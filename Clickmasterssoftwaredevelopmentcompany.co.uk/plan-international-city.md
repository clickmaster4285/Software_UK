# Plan: ClickMasters Content Migration — International City Pages

**Generated:** June 16, 2026
**Purpose:** Execute international-city conversion following established patterns
**Reference:** See `agent.md` for overall context

---

## 1. Project Context

### What We've Done So Far

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 300 | 258 | `/hire/[role]/[city]/` | ✅ |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| 4 | Comparison Pages | 177 | 141 | `/comparison/[slug]/` | ✅ |
| **5** | **International City** | **179** | **98** | **`/cities/[slug]/`** | **✅** |

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
- `custom_software_development_{city}` → city name (may include focus suffix)

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
<!-- ... more step tables -->

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
| `cityDisplay` | `string` | City name from badges | `"London"` |
| `focus` | `string` | Optional sector focus from filename | `"healthtech-focus"` |
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
| `pricingTable` | `array` | Pricing table rows | `[{ service: "Consultation", description: "...", price: "Free" }]` |
| `complianceTable` | `array` | Compliance table rows | `[{ area: "UK GDPR", requirement: "...", implementation: "..." }]` |
| `processSteps` | `array` | Process step tables | `[{ step: 1, title: "Free London Consultation", description: "..." }]` |
| `faqs` | `array` | Q&A pairs | `[{ question: "...", answer: "..." }]` |
| `relatedPages` | `array` | Related guides links | `[{ title: "...", slug: "..." }]` |
| `cta` | `string` | CTA table | `"Get a Free Consultation..."` |
| `author` | `string` | Author box | `"ClickMasters Custom Software Development Team — London"` |

---

## 4. Current State

- **179 DOCX files** located under `Clickmasterssoftwaredevelopmentcompany.co.uk/International-City/`
- Data file `data/cities.js` — not yet created
- Routes `/cities` and `/cities/[slug]` — not yet created

---

## 5. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-cities.js`

Steps:
1. Read all .docx from International-City/ folder
2. For each docx:
   a. Parse city name + focus from filename
   b. Use mammoth.convertToHtml()
   c. Extract metadata (slug, title, meta, header, badges, directAnswer)
   d. Extract benefits (ul > li after "Why Choose" section)
   e. Extract ecosystem paragraphs (body text between table sections)
   f. Extract pricing table (thead + tbody with pricing columns)
   g. Extract compliance table (thead + tbody with compliance columns)
   h. Extract process steps (individual step tables)
   i. Extract FAQs, related pages, CTA, author
3. Handle duplicates by slug → keep lowest P-number
4. Output: data/cities.js

### Phase 2: Optimize Data Layer

- `data/cities.js` exports `cityListings` (lightweight: id, slug, city, title, metaDesc, badges)
- Helper functions: `getCityBySlug()`, `getRelatedCities()`

### Phase 3: Create Next.js Routes

```
app/(landing)/
├── cities/
│   ├── page.js                    # List all cities (searchable grid)
│   └── [slug]/
│       ├── page.js                # Detail page with SSG + generateStaticParams()
│       └── detail-client.jsx      # Client component with full UI
```

---

## 6. Styling Conventions

- **Typography:** Headings `Sora` (Bold 700), Body `DM Sans`
- **Colors:** Dark navy `primary` backgrounds, teal `accent` highlights
- **Components:** Section labels (pill badges), tables (12px rounded, 1px border, shadow), FAQ accordion (dark navy pills)

---

## 7. Step-by-Step Actions

- [x] **Step 1:** Convert 3 sample city DOCX files to HTML, verify extraction patterns
- [x] **Step 2:** Create conversion script `scripts/convert-cities.js`
- [x] **Step 3:** Run script on all 179 files → generate `data/cities.js` (98 unique)
- [x] **Step 4:** Add lightweight data helpers (`cityListings`, `getCityBySlug()`, `getRelatedCities()`) — built into data file
- [x] **Step 5:** Create route `app/(landing)/cities/page.js` (listing page with paginated grid)
- [x] **Step 6:** Create route `app/(landing)/cities/[slug]/page.js` (SSG detail page with JSON-LD)
- [x] **Step 7:** Create `app/(landing)/cities/[slug]/detail-client.jsx` (full UI: benefits, pricing, compliance, process steps, FAQ)
- [x] **Step 8:** Run production build and verify all pages pre-render — 1049 total pages, 98 city pages static

---

## 8. Success Metrics

| Metric | Target | Actual |
|--------|-------:|:------|
| Documents parsed | 179 | 179 ✅ |
| Unique pages generated (after dedup) | ~80–100 | 98 ✅ |
| Detail page rendering | Fully static (SSG) | ✅ 98 pages pre-rendered |
| Build integration | Matches existing patterns | ✅ 1049 total pages |

## 9. Conversion Summary

| Metric | Actual |
|--------|-------:|
| Source DOCX files | 179 |
| Parsing errors | 0 |
| Unique entries (after dedup) | 98 |
| Listing page | `/cities` (paginated grid, 24 per page) |
| Detail pages | `/cities/[slug]` (98 static pages) |
| Data file | `data/cities.js` |
| Script | `scripts/convert-cities.js` |

✅ **International City Conversion Complete!**

**End of Plan**
