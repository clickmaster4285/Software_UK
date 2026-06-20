---
name: glossary-conversion-gotchas
description: Fix glossary DOCX-to-data extraction failures — filename regex mismatches, badge table misidentification, schema keyword format variants, slug prefix stripping
source: auto-skill
extracted_at: '2026-06-19T12:27:08.336Z'
---

# Glossary Conversion Gotchas

## When to Use

- Writing or fixing `scripts/convert-glossary.js` or similar glossary conversion scripts
- Glossary entries have empty `term`, `termDisplay`, `ukContext`, or `targetKeywords` fields
- Slugs have unwanted `glossary/` prefix
- UK Context section is empty even though the DOCX has UK Context content
- Build fails with `Cannot read properties of null (reading 'useContext')` on glossary detail pages

## Glossary DOCX Structure

Each glossary DOCX has **9 tables** in a fixed order:

| Table | Content |
|-------|---------|
| T0 | META TITLE / META DESC / SLUG |
| T1 | Last updated \| Reading time \| Written by \| Reviewed by |
| T2 | **Badge table** — 4 cells: 📚 Definition 🇬🇧 UK Context 🔗 Related Terms 💼 Commercial Relevance |
| T3 | Direct Answer |
| T4 | UK Context title (2 cells, e.g. "React.js — UK Context") |
| T5 | Related Terms title (2 cells) |
| T6 | Related Pages title (2 cells) |
| T7 | CTA (Get Expert Advice on {term}) |
| T8 | Schema (DefinedTerm + FAQPage \| Target KW or bare "keyword" (N/mo)) |

Plus: `<h1>` title, breadcrumb paragraph, `<p>` gap paragraphs between tables, `<ul><li>` related page links.

## Known Issues & Fixes

### 1. Filename Regex Must Match Both `_definition` and `-definition`

**Symptom:** 190 out of 200 entries have `"term": ""` and `"termDisplay": ""`. Only ~10 entries (P105–P133) are correct.

**Root Cause:** The filename format changes mid-sequence:
- P105–P133: `glossary_ir35_definition.docx` (underscore before "definition")
- P134–P488: `glossary_react-definition.docx` (hyphen before "definition")

The regex `/glossary_(.+?)_definition/i` only matches the underscore format.

```js
// ❌ WRONG — only matches underscore format
const termMatch = filename.match(/glossary_(.+?)_definition/i);

// ✅ CORRECT — matches both underscore and hyphen
const termMatch = filename.match(/glossary_(.+?)[-_]definition/i);
```

**Verification:**
```js
const files = fs.readdirSync(GLOSSARY_DIR).filter(f => f.endsWith('.docx'));
const underscore = files.filter(f => /glossary_.+_definition/.test(f)).length;
const hyphen = files.filter(f => /glossary_.+-definition/.test(f)).length;
console.log(`Underscore format: ${underscore}, Hyphen format: ${hyphen}`);
// Expected: ~10 underscore, ~190 hyphen
```

### 2. Badge Table Misidentified as Section Title Table

**Symptom:** `ukContext` is empty for entries that have UK Context content in the DOCX. The extraction returns nothing because the "UK Context title table" is matched to the wrong table.

**Root Cause:** The badge table (T2) contains "UK Context" text AND has 4 cells. The old filter `cellCount >= 5` was meant to skip the badge table, but T2 has only 4 cells — so it passes the filter and gets matched as the UK Context section title. Since there's no content between T2 and T3 (Direct Answer), the extraction returns empty.

**Fix:** Instead of counting cells, detect badge tables by checking if they contain **multiple section keywords**:

```js
// ✅ ROBUST — detects badge tables by content pattern
function isBadgeTable(tableHtml) {
  const text = getTableText(tableHtml);
  const badgeKeywords = [
    /Definition/i, /UK Context/i, /Related Terms/i,
    /Commercial Relevance/i, /JSON-LD/i
  ];
  let matchCount = 0;
  for (const kw of badgeKeywords) {
    if (kw.test(text)) matchCount++;
  }
  return matchCount >= 2; // Badge table has 2+ section keywords
}
```

Use `isBadgeTable()` in both `extractUkContext()` and `findSectionTable()` instead of `cellCount >= 5`.

### 3. Schema Keywords Without "Target KW:" Prefix

**Symptom:** `targetKeywords` is empty for 190 entries. The schema table text doesn't contain "Target KW:" for those files.

**Root Cause:** Two schema table formats exist:
- **Format A** (underscore files): `DefinedTerm + FAQPage | Target KW: "what is ir35" (5,000/mo), "ir35 explained uk" (5,000/mo)`
- **Format B** (hyphen files): `DefinedTerm + FAQPage | "what is react js" (5,000/mo)`

Format B omits the "Target KW:" label. The regex `/Target KW:\s*([\s\S]+)/i` only matches Format A.

**Fix:** Fall back to the full table text when "Target KW:" is not found, and extract all quoted strings:

```js
// ✅ Handles both formats
const kwMatch = t.text.match(/Target KW:\s*([\s\S]+)/i);
const kwSource = kwMatch ? kwMatch[1] : t.text; // Fallback to full text
const kwPattern = /"([^"]+)"/g;
let m;
while ((m = kwPattern.exec(kwSource)) !== null) {
  result.targetKeywords.push(m[1]);
}
```

### 4. Slug Contains `glossary/` Prefix from DOCX Meta Table

**Symptom:** All slugs are `"glossary/ir35-definition"` instead of `"ir35-definition"`. This causes 400s or URL mismatch on the detail page.

**Root Cause:** The DOCX meta table's SLUG field contains the full path: `/glossary/ir35-definition`. The extraction strips leading/trailing slashes but not the `glossary/` prefix.

**Fix:** Strip the prefix in the slug assignment:

```js
// ✅ Strips glossary/ prefix from DOCX meta slug
slug: meta.slug
  ? meta.slug.replace(/^\//, '').replace(/\/$/, '').replace(/^glossary\//, '')
  : filenameSlug,
```

**Or fix after generation** (one-time):
```js
const fs = require('fs');
let content = fs.readFileSync('data/glossary.js', 'utf8');
const before = (content.match(/"slug": "glossary\//g) || []).length;
content = content.replace(/"slug": "glossary\//g, '"slug": "');
fs.writeFileSync('data/glossary.js', content);
console.log(`Fixed ${before} slugs`);
```

### 5. `termDisplay` Acronym Handling

The `parseFilename` function converts filename terms to display format. It has an acronym list for known terms (API, MVP, GDPR, SaaS, etc.). If a term is not in the acronym list, it gets title-cased normally.

**Important:** The term from the filename uses underscores as word separators (e.g., `uk_gdpr` → `UK GDPR`). The `split('_')` + acronym lookup handles this correctly.

If you need to add new acronyms, add them to the `parseFilename` function's acronym array.

## Verification Checklist

After running `node scripts/convert-glossary.js`:

```js
// 1. All 200 entries have term and termDisplay
const d = require('./data/glossary');
const emptyTerm = d.glossaryTerms.filter(x => !x.term);
const emptyDisplay = d.glossaryTerms.filter(x => !x.termDisplay);
console.log(`Empty term: ${emptyTerm.length}, Empty termDisplay: ${emptyDisplay.length}`);
// Expected: 0, 0

// 2. ukContext populated (allow 0-1 for entries that genuinely lack it)
const emptyUk = d.glossaryTerms.filter(x => !x.ukContext);
console.log(`Empty ukContext: ${emptyUk.length}`);
// Expected: 0-1

// 3. targetKeywords populated
const emptyKw = d.glossaryTerms.filter(x => !x.targetKeywords || x.targetKeywords.length === 0);
console.log(`Empty targetKeywords: ${emptyKw.length}`);
// Expected: 0

// 4. No glossary/ prefix in slugs
const withPrefix = d.glossaryTerms.filter(x => x.slug.startsWith('glossary/'));
console.log(`Slugs with glossary/ prefix: ${withPrefix.length}`);
// Expected: 0

// 5. Slug format is clean
const badSlugs = d.glossaryTerms.filter(x => x.slug.includes('/') || x.slug.includes(' '));
console.log(`Bad slugs: ${badSlugs.length}`);
// Expected: 0
```

## Glossary Detail Page — UX Patterns

When building glossary detail pages, these patterns work well:

1. **Reading progress bar** — Fixed 3px accent bar at viewport top, width tied to `scrollY / docHeight`
2. **Sticky TOC sidebar** — Desktop: left sidebar with section anchor links, active section highlighted via scroll listener. Mobile: collapsible dropdown
3. **Badge table detection** — Always use content-pattern detection (`isBadgeTable()`) not cell-count heuristics
4. **Back to glossary link** — Include in breadcrumb nav with BookOpen icon
5. **Drop-cap on first paragraph** — Use `first-letter:` CSS pseudo-element for UK Context's opening paragraph
6. **Back to top button** — Fixed position, appears after 600px scroll, smooth scroll to top
7. **Section dividers** — Use `border-t` + `pt-10` between sections instead of uniform `py-16`

## Related Skills

- `docx-conversion-gotchas` — Resource guide conversion patterns (checklist splitting, gap paragraphs, FAQ filtering)
- `nextjs-prerender-radix-fix` — For Radix UI prerender errors on detail pages
- `file-corruption-fix` — For invisible character issues in generated data files
