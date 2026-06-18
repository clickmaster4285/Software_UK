# Plan: ClickMasters Content Migration — International City Pages

**Generated:** June 17, 2026
**Purpose:** Execute international-city conversion following the case-studies / hire-pages / salary-guides / comparison-pages pattern
**Reference:** See `agent.md` for overall context, `plan-international-city.md` for original extraction plan

---

## 1. Project Context

### What We've Done So Far (Reference)

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 300 | 258 | `/hire/[role]/[city]/` | ✅ |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| 4 | Comparison Pages | 177 | 141 | `/comparison/[slug]/` | ✅ |
| **5** | **International City** | **179** | **96** | **`/cities/[slug]/`** | **✅** |

### What We're Doing Now: International City Pages

- **179 DOCX files** in `Clickmasterssoftwaredevelopmentcompany.co.uk/International-City/`
- **Pattern:** `ClickMasters_P{ID}_custom_software_development_{city}.docx`
- **Goal:** Generate `data/cities.js` → Create route `/cities/[slug]/`

---

## 2. Document Structure Analysis

### Filename Pattern

```
ClickMasters_P27_custom_software_development_london.docx
ClickMasters_P195_custom_software_development_berlin.docx
ClickMasters_P1000_custom_software_development_warsaw.docx
ClickMasters_P1090_custom_software_development_helsinki_healthtech_focus.docx
ClickMasters_P1119_custom_software_development_tallinn_fintech_focus.docx
```

- `P{ID}` → unique identifier
- `custom_software_development_{city}` → city name (may include focus suffix like `_healthtech_focus`, `_fintech`)

### Sample: `ClickMasters_P27_custom_software_development_london.docx`

**HTML Structure:**

```html
<!-- Metadata Table -->
<table>META TITLE: Custom Software Development London | ClickMasters UK
       META DESC: Custom Software Development in London...
       SLUG: /custom-software-development-london/</table>

<!-- Header Table -->
<table>Last updated: June 2025 | Reading time: 8 min | Written by: ... | Reviewed by: ...</table>

<!-- Breadcrumb -->
<p>Home › Services › Custom Software Development UK › <strong>Custom Software Development London</strong></p>

<!-- H1 Title -->
<h1>Custom Software Development London — Bespoke Software Built for Your Business</h1>

<!-- Badges Table -->
<table><td>🏙️ London</td><td>🇬🇧 UK-Based Team</td><td>💷 £12,000–£200,000+</td><td>🔒 UK GDPR</td><td>⚖️ Zero IR35 Risk</td><td>⏱️ 8 Week Start</td></table>

<!-- Direct Answer Table -->
<table>Direct Answer: ClickMasters provides Custom Software Development services...</table>

<!-- Why Choose Section -->
<table><td>Why London Businesses Choose ClickMasters</td></table>
<ul><li>Transparent GBP Pricing...</li><li>UK GDPR by Design...</li></ul>

<!-- Ecosystem Section -->
<table><td>The London Technology Ecosystem</td></table>
<p>London is the UK's largest technology hub...</p>

<!-- Pricing Table -->
<table><thead><tr><th>Service Type</th><th>Description</th><th>GBP Pricing</th></tr></thead>
       <tbody><tr><td>Consultation / Discovery</td><td>...</td><td>Free</td></tr>...</tbody></table>

<!-- Compliance Table -->
<table><thead><tr><th>Compliance Area</th><th>Requirement</th><th>ClickMasters Implementation</th></tr></thead>
       <tbody>...</tbody></table>

<!-- Process Steps -->
<table><td>How We Work with London Businesses</td></table>
<table><tr><td>1</td><td>Free London Consultation...</td></table>
<table><tr><td>2</td><td>Technical Discovery...</td></table>

<!-- FAQ Section -->
<table><td>Frequently Asked Questions</td></table>
<p><strong>Q: Do you provide services in London?</strong></p>
<p><strong>A: </strong>Yes...</p>

<!-- Related Guides -->
<table><td>Related Guides & Services</td></table>
<ul><li>Custom Software Development UK: /custom-software-development/</li></ul>

<!-- CTA Table -->
<table>Get a Free Custom Software Development Consultation in London...</table>

<!-- Author Box -->
<table>👤 AUTHOR | ClickMasters Custom Software Development Team — London</table>

<!-- Schema Table -->
<table>JSON-LD Schema: LocalBusiness + Service + FAQPage...</table>
```

---

## 3. Extracted Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number from filename | `"P27"` |
| `slug` | `string` | SLUG meta (cleaned) | `"custom-software-development-london"` |
| `city` | `string` | Parsed city from filename | `"london"` |
| `focus` | `string` | Optional sector focus from filename | `"healthtech"`, `"fintech"`, `"saas"` |
| `title` | `string` | H1 tag text | `"Custom Software Development London — Bespoke Software Built for Your Business"` |
| `metaTitle` | `string` | META TITLE | `"Custom Software Development London \| ClickMasters UK"` |
| `metaDesc` | `string` | META DESC | `"Custom Software Development in London..."` |
| `lastUpdated` | `string` | Header table | `"June 2025"` |
| `readingTime` | `number` | Header table | `8` |
| `writtenBy` | `string` | Header table | `"ClickMasters Custom Software Development Team"` |
| `reviewedBy` | `string` | Header table | `"James Whitmore, CTO — London client work"` |
| `badges` | `array` | Badges table items | `["🏙️ London", "🇬🇧 UK-Based Team", "💷 £12,000–£200,000+"]` |
| `directAnswer` | `string` | Text after "Direct Answer:" | `"ClickMasters provides Custom Software Development..."` |
| `benefits` | `array` | Why Choose list items | `["Transparent GBP Pricing", "UK GDPR by Design"]` |
| `ecosystem` | `string` | Ecosystem section content | `"London is the UK's largest technology hub..."` |
| `pricingTable` | `object` | Pricing table (headers + rows) | `{ headers: ["Service Type", ...], rows: [[...]] }` |
| `complianceTable` | `object` | Compliance table (headers + rows) | `{ headers: ["Compliance Area", ...], rows: [[...]] }` |
| `processSteps` | `array` | Process step tables | `[{ step: 1, title: "Free London Consultation", description: "..." }]` |
| `faqs` | `array` | Q&A pairs | `[{ question: "...", answer: "..." }]` |
| `relatedPages` | `array` | Related guides links | `[{ title: "...", slug: "..." }]` |
| `cta` | `string` | CTA table | `"Get a Free Consultation..."` |
| `author` | `string` | Author box | `"ClickMasters Custom Software Development Team — London"` |

---

## 4. Current State (Post-Conversion)

- **179 DOCX files** located under `Clickmasterssoftwaredevelopmentcompany.co.uk/International-City/`
- No database will be queried.
- ✅ Data file `data/cities.js` generated (96 unique entries)
- ✅ Routes `/cities` and `/cities/[slug]` created and live
- ✅ Full production build verified — 96 city pages pre-rendered

---

## 5. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-cities.js`

```javascript
// Pseudocode
1. Read all .docx from International-City/ folder
2. For each docx:
   a. Parse city name + focus from filename pattern
      - Handle multi-word cities: cape_town, kuala_lumpur, buenos_aires, etc.
      - Handle focus suffixes: healthtech_focus, fintech, saas, govtech, etc.
   b. Use mammoth.convertToHtml()
   c. Extract metadata (slug, title, meta, header, badges, directAnswer)
   d. Extract benefits (ul > li after "Why Choose" section)
   e. Extract ecosystem paragraphs (body text between table sections)
   f. Extract pricing table (thead + tbody with pricing columns)
   g. Extract compliance table (thead + tbody with compliance columns)
   h. Extract process steps (individual step tables — split title from description)
   i. Extract FAQs (Q: / A: pairs), related pages, CTA, author
   j. Decode HTML entities (&amp; → &, &lt; → <, etc.)
3. Handle duplicates by slug → keep lowest P-number
4. Output: data/cities.js
```

### Phase 2: Generate Data File

**Output:** `data/cities.js`

```javascript
export const cities = [
  {
    id: "P27",
    slug: "custom-software-development-london",
    city: "london",
    focus: "",
    title: "Custom Software Development London — Bespoke Software Built for Your Business",
    metaTitle: "Custom Software Development London | ClickMasters UK",
    metaDesc: "Custom Software Development in London...",
    lastUpdated: "June 2025",
    readingTime: 8,
    writtenBy: "ClickMasters Custom Software Development Team",
    reviewedBy: "James Whitmore, CTO — London client work",
    badges: ["🏙️ London", "🇬🇧 UK-Based Team", "💷 £12,000–£200,000+", "🔒 UK GDPR", "⚖️ Zero IR35 Risk", "⏱️ 8 Week Start"],
    directAnswer: "ClickMasters provides Custom Software Development...",
    benefits: ["Transparent GBP Pricing", "UK GDPR by Design"],
    ecosystem: "London is the UK's largest technology hub...",
    pricingTable: { headers: ["Service Type", "Description", "GBP Pricing"], rows: [["Consultation / Discovery", "...", "Free"], ...] },
    complianceTable: { headers: ["Compliance Area", "Requirement", "ClickMasters Implementation"], rows: [...] },
    processSteps: [
      { step: 1, title: "Free London Consultation (Week 1)", description: "45-minute video call..." },
      { step: 2, title: "Technical Discovery", description: "For projects over £10K..." },
      ...
    ],
    faqs: [
      { question: "Do you provide services in London?", answer: "Yes, we deliver..." },
      ...
    ],
    relatedPages: [
      { title: "Custom Software Development UK", slug: "custom-software-development" },
      ...
    ],
    cta: "Get a Free Custom Software Development Consultation in London...",
    author: "ClickMasters Custom Software Development Team — London"
  },
  // ... 96 city entries
];
```

### Phase 3: Optimize Data Layer (Performance First)

To avoid loading massive content in listing grids:

- `data/cities.js` exports a lightweight list array (`cityListings`) containing: `id`, `slug`, `city`, `focus`, `title`, `metaDesc`, `badges`.
- Export lookup functions:
  - `getCityBySlug(slug)`: retrieves full record for detail view.
  - `getRelatedCities(slug, limit)`: returns related cities.
  - `getDedupedFaqs(faqs)`: deduplicates FAQs by question text.

### Phase 4: Create Next.js Routes

**Route structure:**
```
app/(landing)/
├── cities/
│   ├── page.js                    # List all cities (paginated grid, 24 per page)
│   └── [slug]/
│       ├── page.js                # Detail page with SSG + generateStaticParams()
│       └── detail-client.jsx      # Client component with full UI
```

**URL Examples:**
- `/cities` — listing page with pagination
- `/cities/custom-software-development-london` — London detail page
- `/cities/custom-software-development-helsinki-healthtech-focus` — Helsinki HealthTech detail page

---

## 6. Technical Details

### Libraries (Already Installed)
- `mammoth` — DOCX to HTML conversion ✅

### File Locations
```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── International-City/            # 179 .docx files
│   ├── ClickMasters_P27_custom_software_development_london.docx
│   └── ...
├── data/
│   └── cities.js                  # GENERATED (96 unique entries)
├── app/(landing)/cities/
│   ├── page.js                    # LISTING PAGE (paginated grid)
│   └── [slug]/
│       ├── page.js                # DETAIL PAGE (SSG + JSON-LD)
│       └── detail-client.jsx      # CLIENT COMPONENT (full UI)
└── scripts/
    └── convert-cities.js          # EXTRACTION SCRIPT
```

### Build Strategy
- Static Site Generation (SSG) with `generateStaticParams()`
- All 96 city pages pre-rendered at build time
- Listing page paginated at 24 items per page (4 pages)

---

## 7. Styling Conventions (from ClickMasters Rule Guide)

- **Typography:** Headings in `Sora` (Bold 700 / SemiBold 600), Body in `DM Sans` (Regular 400 / Medium 500)
- **Colors:** Dark navy/deep background elements (`primary` / `primary-mid`), highlights/buttons in teal (`accent` -> `accent-hover`)
- **Components:**
  - Section Labels: pill badges with 1px border
  - Cards & Tables: 1px borders, rounded corners (12px for cards, 8px for buttons), shadows with hover lifts (+4px transition)
  - FAQ Accordion: Dark navy pills, smooth height transition
  - Process Steps: Numbered cards in a 5-column grid

---

## 8. Step-by-Step Actions

- [x] **Step 1:** Convert 3 sample city DOCX files to HTML, verify extraction patterns
- [x] **Step 2:** Create conversion script `scripts/convert-cities.js`
- [x] **Step 3:** Run script on all 179 files → generate `data/cities.js` (96 unique)
- [x] **Step 4:** Deduplicate and verify entry count — 96 unique (83 duplicates collapsed)
- [x] **Step 5:** Add lightweight data helpers (`cityListings`, `getCityBySlug()`, `getRelatedCities()`, `getDedupedFaqs()`) — built into data file
- [x] **Step 6:** Create route `app/(landing)/cities/page.js` (listing page with paginated grid, 24 per page)
- [x] **Step 7:** Create route `app/(landing)/cities/[slug]/page.js` (SSG detail page with Article + FAQPage JSON-LD)
- [x] **Step 8:** Create `app/(landing)/cities/[slug]/detail-client.jsx` (full UI: benefits, pricing, compliance, process steps, FAQ accordion, author box, related pages)
- [x] **Step 9:** Run production build and verify all pages pre-render — 96 city pages static
- [x] **Step 10:** Fix extraction bugs (focus field, multi-word cities, author, CTA, process steps, HTML entities)
- [x] **Step 11:** Re-run script and verify all fixes — 96 cities, all fields populated

---

## 9. Success Metrics

| Metric | Target | Actual |
|--------|-------:|:------|
| Documents parsed | 179 | 179 ✅ |
| Unique pages generated (after dedup) | ~80–100 | 96 ✅ (83 duplicates in source) |
| Listing page size | Minimal (uses lightweight `cityListings`) | ✅ |
| Detail page rendering | Fully static (SSG), no client-side database calls | ✅ 96 pages pre-rendered |
| Build integration | Matches existing patterns | ✅ 1049+ total pages |
| Author field populated | 96/96 | ✅ 96/96 |
| Focus field populated | ~10 cities | ✅ 9 cities |
| HTML entities decoded | All fields | ✅ |

---

## 10. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Route structure | `/cities/[slug]/` | Clean, readable URLs; matches slug format from meta table |
| Data file | `data/cities.js` | Follows established pattern from case-studies, hire-pages, salary-guides |
| City + focus extraction | From filename | Consistent naming convention; focus suffix optional |
| Multi-word city handling | Underscore → hyphen conversion | `cape_town` → `cape-town` for URL-safe slugs |
| Duplicate handling | Lowest P-number | Same strategy as all prior phases |
| Process step title | Extracted from text before duration/pattern | Avoids title=description duplication |
| CTA extraction | Skip pricing/compliance/step tables | Prevents pricing table from being misidentified as CTA |
| Author extraction | Cell index 0 in AUTHOR table match | Regex starts from "AUTHOR" mid-table, so first `<td>` is the author name |
| HTML entity decoding | In `stripHtml()` function | Handles `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;` |

---

## 11. Post-Conversion Analysis: 179 Files → 96 Unique Cities

### Why 96, Not 179?

The source folder contains **multiple P-number revisions** of the same city page. The script deduplicates by **slug**, keeping only the **lowest P-number** as canonical.

**Example — `custom-software-development-london`:**
| File | P-Number | Kept? |
|------|----------|-------|
| `ClickMasters_P27_custom_software_development_london.docx` | P27 | ✅ Kept (lowest) |
| `ClickMasters_P300_custom_software_development_london.docx` | P300 | ❌ Duplicate |
| `ClickMasters_P500_custom_software_development_london.docx` | P500 | ❌ Duplicate |

### Content Coverage

| Field | Cities with data |
|-------|:----------------:|
| Title | 96/96 |
| Meta description | 96/96 |
| Badges | 96/96 |
| Direct answer | 96/96 |
| Ecosystem | 96/96 |
| FAQs | 96/96 |
| CTA | 96/96 |
| Author | 96/96 |
| Benefits | 21/96 |
| Pricing table | 11/96 |
| Compliance table | 6/96 |
| Process steps | 6/96 |
| Focus (sector) | 9/96 |

### Focus Distribution

| Focus | Cities |
|-------|--------|
| fintech | 2 (tallinn) |
| saas | 1 (tallinn) |
| ehealth | 1 (tallinn) |
| healthtech | 1 (helsinki) |
| digital-government | 1 (helsinki) |
| govtech | 1 (tallinn) |
| cyber | 1 (vilnius) |
| medtech | 1 (thessaloniki) |

### Geographic Breakdown

| Region | Count |
|--------|------:|
| UK Cities | 17 |
| European Cities | 27 |
| Global (non-UK/EU) | 52 |
| **Total** | **96** |

### Edge Cases Handled

- **Multi-word cities:** `cape_town`, `kuala_lumpur`, `buenos_aires`, `nizhny_novgorod`, `cluj_napoca`, `thessaloniki`, `nicosia` — correctly hyphenated
- **Compound focus suffixes:** `healthtech_focus` → focus: `"healthtech"`, `digital_government` → focus: `"digital-government"`
- **Pricing tables misidentified as CTA:** Filtered by checking for "Service Type" + "GBP Pricing" headers
- **Process step title = description:** Title extracted from text before duration/pattern markers
- **HTML entities in ecosystem/body text:** `&amp;` → `&`, `&lt;` → `<`, etc.
- **Author cell offset:** Regex match starts from "AUTHOR" mid-table, so `cells[0]` is the author name cell

### Example Entry Structure

```js
{
  id: "P27",
  slug: "custom-software-development-london",
  city: "london",
  focus: "",
  title: "Custom Software Development London — Bespoke Software Built for Your Business",
  metaTitle: "Custom Software Development London | ClickMasters UK",
  metaDesc: "Custom Software Development in London...",
  lastUpdated: "June 2025",
  readingTime: 8,
  writtenBy: "ClickMasters Custom Software Development Team",
  reviewedBy: "James Whitmore, CTO — London client work",
  badges: ["🏙️ London", "🇬🇧 UK-Based Team", "💷 £12,000–£200,000+", "🔒 UK GDPR", "⚖️ Zero IR35 Risk", "⏱️ 8 Week Start"],
  directAnswer: "ClickMasters provides Custom Software Development...",
  benefits: ["Transparent GBP Pricing", "UK GDPR by Design", ...],
  ecosystem: "London is the UK's largest technology hub...",
  pricingTable: { headers: ["Service Type", "Description", "GBP Pricing"], rows: [...] },
  complianceTable: { headers: ["Compliance Area", "Requirement", "ClickMasters Implementation"], rows: [...] },
  processSteps: [
    { step: 1, title: "Free London Consultation (Week 1)", description: "45-minute video call..." },
    { step: 2, title: "Technical Discovery", description: "For projects over £10K..." },
    ...
  ],
  faqs: [
    { question: "Do you provide services in London?", answer: "Yes, we deliver..." },
    ...
  ],
  relatedPages: [
    { title: "Custom Software Development UK", slug: "custom-software-development" },
    ...
  ],
  cta: "Get a Free Custom Software Development Consultation in London...",
  author: "ClickMasters Custom Software Development Team — London"
}
```

---

## 12. Conversion Summary

| Metric | Actual |
|--------|-------:|
| Source DOCX files | 179 |
| Parsing errors | 0 |
| Unique entries (after dedup) | 96 |
| Listing page | `/cities` (paginated grid, 24 per page) |
| Detail pages | `/cities/[slug]` (96 static pages) |
| Data file | `data/cities.js` |
| Script | `scripts/convert-cities.js` |

---

## 13. Bugs Fixed During Review

| # | Bug | Root Cause | Fix |
|---|-----|-----------|-----|
| 1 | `focus` field always empty | `parseFilename()` never detected focus suffixes | Added multi-word city detection + focus suffix extraction |
| 2 | Multi-word cities with spaces | Filename underscores not converted for city names | Added `multiWordCities` lookup + underscore→hyphen conversion |
| 3 | `author` field empty for all 96 entries | Regex `\bAUTHOR\b` starts mid-table; `cells[1]` was wrong index | Changed to `cells[0]` — first `<td>` in match is the author name |
| 4 | `cta` contained pricing table text | `extractCta()` matched any table with "Free" + "Consultation" | Added filters to skip pricing tables, process steps, compliance tables |
| 5 | `processSteps` title = description | Both fields set to full cell text | Extract title from text before duration/pattern markers |
| 6 | `&amp;` HTML entities in data | `stripHtml()` didn't decode entities | Added entity decoding for `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&nbsp;` |
| 7 | `focus` missing from `cityListings` | Lightweight mapping didn't include `focus` | Added `focus` to `cityListings` map |

---

## 14. Next Category

Next: **Resource Guide (83 DOCX)** — see `plan-resource-guide.md`

---

✅ **International City Page Conversion Complete!**

**End of Plan**
