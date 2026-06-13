---
name: docx-conversion-gotchas
description: Fix docx-to-data extraction failures caused by variable table counts, duplicate slug dedup bugs, and mammoth HTML quirks
source: auto-skill
extracted_at: '2026-06-13T10:59:26.607Z'
---

# DOCX Conversion Gotchas — Case Studies & Beyond

## When to Use

- Writing or fixing a `scripts/convert-*.js` script that parses `.docx` files into `data/*.js`
- Entry count in output doesn't match expected count after dedup
- Extracted fields are empty, garbled, or shifted for certain files
- Duplicate slug handling keeps the wrong entry

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

### 4. Empty/Debug Files in Project Root

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
