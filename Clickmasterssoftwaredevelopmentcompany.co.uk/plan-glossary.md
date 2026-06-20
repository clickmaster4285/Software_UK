# Plan: ClickMasters Content Migration — Glossary Pages

**Generated:** June 19, 2026
**Status:** ✅ Complete — build verified June 20, 2026
**Purpose:** Convert 200 glossary DOCX files into `data/glossary.js` and create `/glossary/` + `/glossary/[term]/` routes
**Reference:** See `agent.md` for overall context, `plan-industry-service-page.md` for folder cleanup context

---

## 1. Project Context

### Progress So Far

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 311 | 269 | `/hire/[role]/[city]/` | ✅ Re-processed |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| 4 | Comparison Pages | 177 | 141 | `/comparison/[slug]/` | ✅ |
| 5 | Resource Guides | 103 | 80 | `/resource/[slug]/` | ✅ Re-processed |
| 6 | International City | 306 | 203 | `/cities/[slug]/` | ✅ Re-processed |
| 7 | Industry / Service | 215 | TBD | `/[category]/[service]/` | 🔲 Pending |
| **8** | **Glossary** | **200** | **200** | **`/glossary/[term]/`** | **✅ Complete (build verified)** |

---

## 2. Document Structure Analysis

### Filename Pattern

```
ClickMasters_P105_glossary_ir35_definition.docx
ClickMasters_P106_glossary_api_definition.docx
ClickMasters_P107_glossary_uk_gdpr_definition.docx
ClickMasters_P108_glossary_mvp_definition.docx
ClickMasters_P109_glossary_saas_definition.docx
```

- `P{ID}` → unique identifier (P105–P304)
- `glossary_{term}_definition` → term parsed from filename

### Sample: `ClickMasters_P105_glossary_ir35_definition.docx`

**HTML Structure (converted from DOCX):**

```html
<!-- Meta table -->
<table>
  META TITLE: What is IR35? UK Definition & Guide | ClickMasters
  META DESC: IR35 explained for UK software developers and business owners...
  SLUG: /glossary/ir35-definition/
</table>

<!-- Header table -->
<table>
  Last updated: June 2025 | Reading time: 4 min | Written by: ClickMasters Technical Team | Reviewed by: James Whitmore, CTO
</table>

<!-- Breadcrumb -->
<p>Home › Glossary › <strong>What is IR35?</strong></p>

<!-- H1 -->
<h1><strong>What is IR35? — UK Software Development Guide</strong></h1>

<!-- Badge table (5 badges) -->
<table>
  📚 Definition | 🇬🇧 UK Context | 🔗 Related Terms | 💼 Commercial Relevance | 📋 JSON-LD Schema
</table>

<!-- Direct Answer table -->
<table>
  Direct Answer: IR35 (Off-Payroll Working Rules) is UK tax legislation...
</table>

<!-- Collapsible definition content (inside <details><summary>) -->
<!-- "Inside IR35: The contractor is taxed as an employee..." -->
<!-- "Outside IR35: The contractor is genuinely self-employed..." -->

<!-- UK Context section -->
<table><td>UK Context</td></tr>
<table>
  IR35 — UK Context (long paragraph)
</table>

<!-- Related Terms section (paragraphs with <strong>Term: </strong>definition format) -->
<table><td>Related Terms</td></tr>
<p><strong>Inside IR35: </strong>The contractor is taxed as an employee...</p>
<p><strong>Outside IR35: </strong>The contractor is genuinely self-employed...</p>
<p><strong>MSC Legislation: </strong>Managed Service Company rules...</p>

<!-- Related Pages section -->
<table><td>Related Pages</td></tr>
<ul>
  <li>IR35 Guide for UK Tech Businesses: /ir35-guide/</li>
  <li>Software Development IR35-Safe: /software-development-ir35-safe/</li>
</ul>

<!-- CTA table -->
<table>
  Get Expert Advice on IR35 / clickmasterssoftwaredevelopmentcompany.co.uk/contact/
</table>

<!-- Schema table -->
<table>
  DefinedTerm + FAQPage | Target KW: "what is ir35" (5,000/mo)
</table>
```

### Key Structural Observations

1. **5-badge header table**: Definition | UK Context | Related Terms | Commercial Relevance | JSON-LD Schema
2. **Direct Answer**: Always in its own table, starts with "Direct Answer:"
3. **Related Terms**: Paragraphs formatted as `<strong>Term Name: </strong>definition text` — NOT a table with rows
4. **Related Pages**: `<ul><li>` format with `Title: /slug/` pattern
5. **CTA section**: Table with "Get Expert Advice on {term}" + contact link
6. **JSON-LD Schema**: Table with schema type + target keywords
7. **No separate FAQ table** — unlike hire pages or case studies, glossary pages don't have FAQ sections
8. **Content is definition-focused**: direct answer + UK context + related terms + CTA

---

## 3. Extracted Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number from filename | `"P105"` |
| `slug` | `string` | SLUG meta (cleaned) | `"ir35-definition"` |
| `term` | `string` | Parsed from filename (between `glossary_` and `_definition`) | `"ir35"` |
| `termDisplay` | `string` | Formatted term for display | `"IR35"` |
| `title` | `string` | H1 heading | `"What is IR35? — UK Software Development Guide"` |
| `metaTitle` | `string` | META TITLE | `"What is IR35? UK Definition & Guide \| ClickMasters"` |
| `metaDesc` | `string` | META DESC | `"IR35 explained for UK software developers..."` |
| `lastUpdated` | `string` | Header table | `"June 2025"` |
| `readingTime` | `number` | Header table | `4` |
| `writtenBy` | `string` | Header table | `"ClickMasters Technical Team"` |
| `reviewedBy` | `string` | Header table | `"James Whitmore, CTO"` |
| `directAnswer` | `string` | Text after "Direct Answer:" | `"IR35 (Off-Payroll Working Rules) is UK tax legislation..."` |
| `ukContext` | `string` | Section after "UK Context:" label | `"IR35 — UK Context (paragraph text)"` |
| `relatedTerms` | `array` | `<strong>Term: </strong>definition` paragraphs | `[{ term: "Inside IR35", definition: "..." }]` |
| `relatedPages` | `array` | `<ul><li>` related page links | `[{ title: "IR35 Guide", slug: "/ir35-guide/" }]` |
| `cta` | `string` | CTA table | `"Get Expert Advice on IR35"` |
| `schemaType` | `string` | Schema type from schema table | `"DefinedTerm + FAQPage"` |
| `targetKeywords` | `array` | Keywords from schema table | `["what is ir35", "ir35 explained uk"]` |

---

## 4. Current State

- **200 DOCX files** located under `Clickmasterssoftwaredevelopmentcompany.co.uk/Glossary/`
- Data file `data/glossary.js` — ✅ 200 terms, 10,065 lines, lightweight helpers included
- Routes `/glossary` and `/glossary/[term]` — ✅ listing + detail + filter client, build verified
- Script: `scripts/convert-glossary.js` — ✅ handles all 200 files, dedup by lowest P-number

---

## 5. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-glossary.js`

Steps:
1. Read all 200 .docx from Glossary/ folder
2. For each docx:
   a. Parse term from filename (between `glossary_` and `_definition`)
   b. Use mammoth.convertToHtml()
   c. Extract metadata (slug, title, meta, header)
   d. Direct Answer (text after "Direct Answer:")
   e. UK Context paragraph
   f. Related Terms (paragraphs with `<strong>Term: </strong>` format)
   g. Related Pages (ul > li links)
   h. CTA text
   i. Schema type + target keywords
3. Handle duplicates by slug → keep lowest P-number
4. Output: `data/glossary.js`

### Phase 2: Add Lightweight Data Helpers

Following the established pattern (cities.js, resource-guides.js):
- `glossaryListings` — lightweight array (id, slug, term, termDisplay, metaDesc) for listing
- `getGlossaryTermBySlug(slug)` — lookup function
- `getRelatedTerms(slug, limit)` — related terms by shared relatedPages or alphabetical proximity
- `getGlossaryByLetter(letter)` — filter by first letter for A-Z grid

### Phase 3: Create Next.js Routes

```
app/(landing)/
└── glossary/
    ├── page.js                    # Listing page (A-Z grid of all terms)
    └── [term]/
        ├── page.js                # Detail page (SSG + generateStaticParams)
        └── detail-client.jsx      # Client component (full UI)
```

**URL Examples:**
- `/glossary` — listing page with A-Z filter
- `/glossary/ir35-definition` — IR35 definition page
- `/glossary/api-definition` — API definition page
- `/glossary/uk-gdpr-definition` — UK GDPR definition page

---

## 6. Styling Conventions

- **Typography:** Headings `Sora` (Bold 700), Body `DM Sans`
- **Colors:** Dark navy `primary` backgrounds, teal `accent` highlights
- **Listing Page:** A-Z filter bar at top, card grid below (3 columns), each card shows term + truncated metaDesc
- **Detail Page:**
  - Hero: Term name in H1, badges (Definition | UK Context | Related Terms)
  - Direct Answer: Large callout box (primary background, light text)
  - UK Context: Standard content block
  - Related Terms: Definition list style (`<dt>` / `<dd>` or card grid)
  - Related Pages: Links as pills/cards
  - CTA: Standard CTA block

---

## 7. Step-by-Step Actions

- [x] **Step 1:** Analyze 3 sample glossary DOCX files — structure confirmed
- [x] **Step 2:** Create conversion script `scripts/convert-glossary.js`
- [x] **Step 3:** Run script on all 200 files → generate `data/glossary.js` (200 terms, 10,065 lines)
- [x] **Step 4:** Add lightweight data helpers (`glossaryListings`, `getGlossaryTermBySlug`, `getRelatedTerms`, `getGlossaryLetters`)
- [x] **Step 5:** Create route `app/(landing)/glossary/page.js` (A-Z listing with search + pagination)
- [x] **Step 6:** Create route `app/(landing)/glossary/[term]/page.js` (SSG detail + JSON-LD)
- [x] **Step 7:** Create `app/(landing)/glossary/[term]/detail-client.jsx` (full UI with sections)
- [x] **Step 8:** Run production build and verify all pages pre-render — ✅ build verified June 20, 2026

---

## 8. Success Metrics

| Metric | Target | Actual |
|--------|-------|--------|
| Documents parsed | 200 | 200 |
| Unique glossary terms (after dedup) | ~190–200 | 200 |
| Listing page | `/glossary` (A-Z grid) | ✅ `/glossary` (A-Z + search + pagination) |
| Detail pages | `/glossary/[term]` (static) | ✅ `/glossary/[term]` (SSG + JSON-LD) |
| Data file | `data/glossary.js` | ✅ 10,065 lines + helpers |
| Script | `scripts/convert-glossary.js` | ✅ |
| Parsing errors | 0 | 0 |
| Build verified | — | ✅ June 20, 2026 |

---

## 9. Conversion Summary

| Field | Value |
|-------|-------:|
| Source DOCX files | 200 |
| Filename pattern | `ClickMasters_P{number}_glossary_{term}_definition.docx` |
| SLUG format | `/glossary/{term}/` |
| Route format | `/glossary/[term]/` |
| P-number range | P105–P304 |

**End of Plan**
