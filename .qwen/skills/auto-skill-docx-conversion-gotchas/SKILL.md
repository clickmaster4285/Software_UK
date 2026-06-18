---
name: docx-conversion-gotchas
description: Fix docx-to-data extraction failures — variable table counts, dedup bugs, mammoth quirks, checklist splitting (✓/✅), FAQ/header filtering, gap paragraphs
source: auto-skill
extracted_at: '2026-06-18T08:54:24.228Z'
---

# DOCX Conversion Gotchas — Resource Guides & Beyond

## When to Use

- Writing or fixing a `scripts/convert-*.js` script that parses `.docx` files into `data/*.js`
- Entry count in output doesn't match expected count after dedup
- Extracted fields are empty, garbled, or shifted for certain files
- Duplicate slug handling keeps the wrong entry
- Paragraphs contain FAQ Q:/A: lines, header artifacts, or related page links that shouldn't be there
- Checklist items (✓ or ✅) are merged into a single paragraph string

## Known Issues Discovered

### 1. Variable Table Counts Break Position-Based Extraction

**Symptom:** Most files extract correctly, but some entries have shifted/empty fields (e.g., `challenge` contains the client quote, or `results` is empty).

**Root Cause:** The extraction script uses hardcoded table indices (e.g., `tables[3]` for tech, `tables[7]` for quote). Some docx files have **extra tables** that shift all indices:

| Variant | Table Count | Extra Tables |
|---------|-------------|--------------|
| **Standard** | 9 | None — T0=meta, T1=header, T2=badges, T3=tech, T4-6=section markers, T7=quote, T8=details |
| **Extended** | 12 | T9="Related Pages", T10="CTA/Book consultation", T11="Article tags" |

The extended variant appears in files like P517 (NHS Mental Health App) and P898 (MedTech AI Diagnostic Imaging).

**Fix:** Never use absolute table indices. Instead, identify tables by their **content pattern**:

```js
// ❌ FRAGILE — breaks on 12-table documents
function extractBadges(tables) {
  const t3 = tables[3] || '';  // Shifted if extra tables exist
  ...
}

// ✅ ROBUST — finds tables by content
function extractBadges(allTables) {
  const badgesTable = allTables.find(t =>
    /[🏭🏥🚗🛒💊🏛️💰🎓📦🏗️🌾🔧🎮📱🚀]/.test(t) &&
    /[🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]/.test(t)
  );
  ...
}
```

**Identify section marker tables by keyword, not index:**
```js
// ✅ Find section markers by content
function findSectionMarker(allTables, keyword) {
  return allTables.findIndex(t => new RegExp(keyword, 'i').test(t));
}

const challengeIdx = findSectionMarker(allTables, 'The Challenge');
const approachIdx  = findSectionMarker(allTables, 'Our Approach');
const resultIdx    = findSectionMarker(allTables, 'The Result');
```

### 2. Dedup Logic Must Compare P_Numbers Numerically

**Symptom:** After dedup, the wrong entry is kept — a higher P_Number entry remains instead of the lower one.

**Root Cause:** The script uses `cs.id` (a string like `"P898"`) for comparison with `cs.id < existing.id`. String comparison of `"P1155"` vs `"P898"` fails because `"P1"` < `"P8"` — so P1155 is incorrectly treated as "lower" than P898.

```js
// ❌ WRONG — string comparison: "P1155" < "P898" is TRUE
if (!existing || cs.id < existing.id) {
  slugMap.set(cs.slug, cs);
}

// ✅ CORRECT — compare numeric portion
function pNumber(id) { return parseInt(id.replace('P', ''), 10); }
if (!existing || pNumber(cs.id) < pNumber(existing.id)) {
  slugMap.set(cs.slug, cs);
}
```

### 3. Mammolid SLUG Regex Must Handle Trailing Tags

**Symptom:** Some extracted slugs contain trailing HTML like `</p></td></tr></table><table><tr><td><p>Last...`

**Root Cause:** The slug regex `SLUG:\s*(\S+)` matches everything non-whitespace, but mammoth sometimes concatenates the slug value with the next table cell's content without whitespace separation.

```html
SLUG: /case-studies/medtech-ai-diagnostic-imaging-radiology/</p></td></tr></table><table><tr><td><p>Last
```

**Fix:** Anchor the slug regex to stop at `/` or specific delimiters:

```js
// ❌ Captures trailing HTML
const slugMatch = html.match(/SLUG:\s*(\S+)/i);

// ✅ Stops at end of slug path
const slugMatch = html.match(/SLUG:\s*(\/case-studies\/[a-z0-9-]+)\//i);
// Or more broadly:
const slugMatch = html.match(/SLUG:\s*([^\s<]+)/i);
```

### 4. Checklist Tables — Split ✅ and ✓ Items into Individual Paragraphs

**Symptom:** A section that should contain checklist items has all items concatenated into a single unreadable string, or zero paragraphs.

**Root Cause:** Mammoth renders checklist items as table cells. Two different checkmark characters appear in DOCX files:
- `✅` (Unicode U+2705, heavy check mark emoji) — used in GDPR checklist etc.
- `✓` (Unicode U+2713, check mark) — used in contract guides, CTA sections

Both must be handled. Also, checklist content can arrive via two code paths:
1. **Gap path**: HTML `<p>` elements between tables → `extractParagraphsFromHtml()`
2. **Standalone paragraph path**: single-cell table with ≥120 chars → `isStandaloneParagraph` branch in `extractContentSections()`

**Fix** — In both `extractParagraphsFromHtml()` AND the `isStandaloneParagraph` branch, split on both characters:

```js
// In extractParagraphsFromHtml() — after collecting paragraphs:
const splitParagraphs = [];
for (const para of paragraphs) {
  if (para.includes('✅') || para.includes('✓')) {
    const parts = para.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0);
    splitParagraphs.push(...parts);
  } else {
    splitParagraphs.push(para);
  }
}
```

```js
// In extractContentSections() — isStandaloneParagraph branch:
const paras = (text.includes('✅') || text.includes('✓'))
  ? text.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0)
  : [text];
if (currentSection) {
  currentSection.paragraphs.push(...paras);
} else {
  currentSection = { title: '', paragraphs: [...paras], table: null };
}
```

**Verification:** After fix, each checklist item should be its own paragraph starting with `✓` or `✅`.

### 5. Gap Paragraphs Between Title Tables and Data Tables

**Symptom:** A section title is correctly identified, but its paragraphs are empty. The content that should be in the section is lost.

**Root Cause:** In resource guide DOCX files, the structure is often:
```
[Title Table] → <p>intro text</p> → [Data Table with <th>]
```
The title table and data table are both detected, but the `<p>` content *between* them (in the HTML gap) is not extracted. The converter only looked at content *within* tables, not the HTML between them.

**Fix:** When processing a title table, extract the HTML gap between the previous table's end and this title table's start. Also extract the gap between a title table and the next data table. Use `extractParagraphsFromHtml` on these gaps:

```js
// When encountering a title table at position i:
const prevEnd = i > 0 ? relevantTables[i - 1].pos.end : daEnd;
const gapHtml = html.substring(prevEnd, pos.start);
const gapParagraphs = extractParagraphsFromHtml(gapHtml);

// Attach gap paragraphs to the section that came BEFORE this title
if (currentSection) {
  if (currentSection.table) {
    sections.push(currentSection);
  } else {
    currentSection.paragraphs.push(...gapParagraphs);
  }
}
```

Also extract **trailing gaps** — content between the last relevant table and the next non-content table (Related Pages, AUTHOR, CTA):

```js
// After processing all relevant tables:
if (lastTable.pos.end < boundary) {
  const trailingChunk = html.substring(lastTable.pos.end, boundary);
  const trailingParagraphs = extractParagraphsFromHtml(trailingChunk);
  if (trailingParagraphs.length > 0 && sections.length > 0) {
    sections[sections.length - 1].paragraphs.push(...trailingParagraphs);
  }
}
```

And **intro gaps** — content between the Direct Answer table and the first content table:

```js
if (firstTableStart > daEnd) {
  const introChunk = html.substring(daEnd, firstTableStart);
  const introParagraphs = extractParagraphsFromHtml(introChunk);
  if (introParagraphs.length > 0) {
    sections[0].paragraphs.unshift(...introParagraphs);
  }
}
```

### 6. Filter FAQ Q:/A: Lines from Paragraphs

**Symptom:** Section `paragraphs` arrays contain `Q: ...` and `A: ...` FAQ lines. The same FAQs are also correctly extracted into the top-level `faqs` array. This causes duplicate FAQ rendering.

**Root Cause:** When mammoth converts DOCX gap content, FAQ text appears as `<p>Q: question</p>` and `<p>A: answer</p>` between tables. `extractParagraphsFromHtml()` picks them up as regular paragraphs. Meanwhile `extractFaqs()` independently extracts the same FAQs from the full HTML.

**Affected scope:** 50+ guides, ~250 paragraph-level FAQ instances across the dataset.

**Fix:** Add a filter at the end of `extractParagraphsFromHtml()`:

```js
// Filter out FAQ Q:/A: lines (handled by extractFaqs())
return splitParagraphs.filter(p => {
  const t = p.trim();
  if (/^Q:\s*.+/i.test(t)) return false;
  if (/^A:\s*.+/i.test(t)) return false;
  return true;
});
```

**Verification:** After fix, no paragraph should start with `Q:` or `A:`. FAQs should only appear in the `faqs` array.

### 7. Filter Header Artifacts ("FAQs", "Related Pages") from Paragraphs

**Symptom:** Section `paragraphs` arrays contain standalone strings like `"FAQs"`, `"FAQ"`, or `"Related Pages"`. These are section headers from the DOCX, not content paragraphs.

**Root Cause:** Mammoth renders structural header text as `<p>` elements in gap content. `extractParagraphsFromHtml()` picks them up as regular paragraphs.

**Affected scope:** ~65 instances across ~50 guides (every guide that has inline FAQs also has a "FAQs" header artifact).

**Fix:** Extend the filter in `extractParagraphsFromHtml()`:

```js
return splitParagraphs.filter(p => {
  const t = p.trim();
  // Remove header artifacts
  if (t === 'FAQs' || t === 'FAQ' || t === 'Related Pages' || t === 'Related Pages:') return false;
  // ... other filters ...
  return true;
});
```

### 8. Filter Related Page Link Lines from Paragraphs

**Symptom:** Section `paragraphs` arrays contain lines like `"Custom Software Development UK: /custom-software-development/"`. These are related page links already in the `relatedPages` array.

**Root Cause:** After the last content table, HTML gap content includes related page links formatted as `"Title: /slug/"`. These are picked up by `extractParagraphsFromHtml()`.

**Affected scope:** 7 instances in 2 guides (`uk-software-development-contract-guide`, `uk-gdpr-software-compliance-checklist`).

**Fix:** Extended filter using pattern matching:

```js
return splitParagraphs.filter(p => {
  const t = p.trim();
  // Remove related page link lines (e.g. "Title: /slug/")
  if (/^[A-Z][^:]+:\s*\/[a-z0-9\-]+\/?$/.test(t)) return false;
  // ... other filters ...
  return true;
});
```

### 9. Complete Combined Filter for `extractParagraphsFromHtml()`

The full recommended filter at the end of `extractParagraphsFromHtml()`:

```js
return splitParagraphs.filter(p => {
  const t = p.trim();
  // Remove header artifacts
  if (t === 'FAQs' || t === 'FAQ' || t === 'Related Pages' || t === 'Related Pages:') return false;
  // Remove FAQ Q:/A: lines (handled by extractFaqs())
  if (/^Q:\s*.+/i.test(t)) return false;
  if (/^A:\s*.+/i.test(t)) return false;
  // Remove related page link lines (e.g. "Custom Software Development UK: /custom-software-development/")
  if (/^[A-Z][^:]+:\s*\/[a-z0-9\-]+\/?$/.test(t)) return false;
  return true;
});
```

### 10. Empty/Debug Files in Project Root

During conversion script development, these scratch files get created in the project root:

| File | What It Is | Action |
|------|-----------|--------|
| `docx-inspect.html` | Raw mammoth HTML dump of a sample docx | Delete — debugging artifact |
| `docx-tables.txt` | Extracted table text from a sample docx | Delete — debugging artifact |
| `inspect-docx.js` | One-off Node script to dump HTML | Delete — debugging artifact |
| `slug-page.txt` | Backup of old route page before rewrite | Delete — superseded by git history |

**Always clean up after finalizing the conversion script.**

## Verification Checklist

After running any conversion script, verify:

```bash
# 1. Count entries match expected
node -e "var c=fs.readFileSync('data/case-studies.js','utf-8'); console.log('Entries:', (c.match(/"slug":/g)||[]).length);"

# 2. No duplicate slugs remain
node -e "
  var c=fs.readFileSync('data/case-studies.js','utf-8');
  var s=c.match(/\"slug\":\s*\"([^\"]+)\"/g).map(x=>x.replace(/.*\"slug\":\s*\"([^\"]+)\".*/,'$1'));
  var d={}; s.forEach(x=>d[x]=(d[x]||0)+1);
  var dup=Object.entries(d).filter(e=>e[1]>1);
  console.log('Dupes:', dup.length); dup.forEach(e=>console.log(' ',e[0],'x'+e[1]));
"

# 3. Spot-check a known-problematic entry (e.g., extended table count)
# Open data/case-studies.js and search for the entry, verify all fields populated

# 4. Compare DOCX file count vs data entry count (account for expected dedup)
# Expected: DOCX count - duplicate groups = data entries
```

### Resource Guide–Specific Verification

For `data/resource-guides.js`, additionally verify:

```bash
# 5. Zero sections with title but no paragraphs or table
node -e "
  const fs = require('fs');
  const data = fs.readFileSync('data/resource-guides.js','utf-8');
  const m = data.match(/export const resourceGuides = (\[[\s\S]*?\]);/);
  const guides = JSON.parse(m[1]);
  let empty = 0;
  guides.forEach(g => g.contentSections.forEach(s => {
    if (s.paragraphs.length === 0 && !s.table && s.title) empty++;
  }));
  console.log('Sections with title but no content:', empty);
"

# 6. Spot-check a checklist guide (e.g., GDPR) — each section should have ✅ paragraphs
node -e "
  const fs = require('fs');
  const data = fs.readFileSync('data/resource-guides.js','utf-8');
  const m = data.match(/export const resourceGuides = (\[[\s\S]*?\]);/);
  const guides = JSON.parse(m[1]);
  const gdpr = guides.find(g => g.slug.includes('gdpr'));
  gdpr.contentSections.forEach((s,i) => {
    const hasCheck = s.paragraphs.some(p => p.includes('✅'));
    console.log('Section', i, ':', s.title.substring(0,50), '| paras:', s.paragraphs.length, '| hasCheck:', hasCheck);
  });
"

# 7. Spot-check a guide with gap paragraphs (e.g., IR35) — sections should have content
node -e "
  const fs = require('fs');
  const data = fs.readFileSync('data/resource-guides.js','utf-8');
  const m = data.match(/export const resourceGuides = (\[[\s\S]*?\]);/);
  const guides = JSON.parse(m[1]);
  const ir35 = guides.find(g => g.slug.includes('ir35'));
  ir35.contentSections.forEach((s,i) => {
    console.log('Section', i, ':', s.title.substring(0,50), '| paras:', s.paragraphs.length);
    s.paragraphs.forEach((p,j) => console.log('  P'+j+':', p.substring(0,80)));
  });
"
```

## Rerunning the Script

The conversion script is safe to rerun — it overwrites the output file:

```bash
node scripts/convert-case-studies.js
```

Expected output:
```
Found 280 case study files
  Processed 20/280 files...
  Processed 40/280 files...
  ...
Processed 280 case studies successfully
Unique case studies (after dedup): 276
```

If counts don't match expectations, check the `errors` array in the script output for files that failed to parse.
