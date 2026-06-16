# Plan: ClickMasters Content Migration — Comparison Pages

**Generated:** June 16, 2026
**Purpose:** Execute comparison-page conversion following the case-studies / hire-pages / salary-guides pattern
**Reference:** See `agent.md` for overall context, `plan.md` for overall migration roadmap

---

## 1. Project Context

### What We've Done So Far (Reference)

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 300 | 258 | `/hire/[role]/[city]/` | ✅ |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| **4** | **Comparison Pages** | **177** | **?** | **`/comparison/[slug]/`** | **🔲 Current** |

### What We're Doing Now: Comparison Pages

- **177 DOCX files** in `Clickmasterssoftwaredevelopmentcompany.co.uk/Comparison-Page/`
- **Pattern:** `ClickMasters_P{ID}_comparison_{topic}_{subtopic}_uk.docx`
- **Goal:** Generate `data/comparisons.js` → Create route `/comparison/[slug]/`

---

## 2. Document Structure Analysis

### Filename Pattern

```
ClickMasters_P102_comparison_aws_vs_azure_uk.docx
ClickMasters_P103_comparison_agile_vs_waterfall_uk.docx
ClickMasters_P1053_comparison_stripe_vs_gocardless_vs_modulr_uk.docx
ClickMasters_P1113_comparison_uk_software_agency_vs_offshore_uk.docx
```

- `P{ID}` → unique identifier
- `comparison_{topic}` → slug-friendly topic name (can contain `_vs_` patterns)
- Filename component extraction: `id` from P-number, `topic` from everything after `comparison_`

### Sample: `ClickMasters_P102_comparison_aws_vs_azure_uk.docx`

**HTML Structure:**

```html
<!-- Metadata Table -->
<table>
  META TITLE: AWS vs Azure for UK Businesses — Data Residency & GDPR | ClickMasters
  META DESC: AWS eu-west-2 vs Azure UK South for UK businesses...
  SLUG: /aws-vs-azure-uk/
</table>

<!-- Header Table -->
<table>
  Last updated: June 2025 | Reading time: 11 min | Written by: ClickMasters Cloud Team | Reviewed by: AWS & Azure Certified Architects
</table>

<!-- Breadcrumb -->
<p>Home › Resources › <strong>AWS vs Azure UK</strong></p>

<!-- H1 Title -->
<h1>AWS vs Azure for UK Businesses — Data Residency, NHS, GovTech & Cost (2025)</h1>

<!-- Badges Table -->
<table>
  <td>☁️ AWS eu-west-2</td>
  <td>🔵 Azure UK South</td>
  <td>🔒 UK GDPR Data Residency</td>
  <td>🏥 NHS & Gov Preference</td>
  <td>💷 GBP Pricing</td>
  <td>🇬🇧 UK Cloud Experts</td>
</table>

<!-- Direct Answer Table -->
<table>
  Direct Answer: Both AWS eu-west-2 (London) and Azure UK South/West satisfy...
</table>

<!-- Comparison Table Title -->
<table><td><strong>Comprehensive Comparison — AWS vs Azure for UK</strong></td></table>

<!-- Main Comparison Table (core content) -->
<table>
  <thead>
    <tr><th>Factor</th><th>AWS (eu-west-2 London)</th><th>Azure (UK South & UK West)</th></tr>
  </thead>
  <tbody>
    <tr><td>UK Data Centre Location</td><td>eu-west-2 = London...</td><td>UK South = London...</td></tr>
    <tr><td>UK GDPR Data Residency</td><td>✅ All core services...</td><td>✅ All core services...</td></tr>
    <!-- ... more rows comparing aspects -->
  </tbody>
</table>

<!-- Sub-section table titles + body paragraphs -->
<p>Both clouds satisfy UK GDPR data residency when correctly configured...</p>

<!-- FAQ Section -->
<table><td><strong>Frequently Asked Questions — AWS vs Azure UK</strong></td></table>
<p><strong>Q: Can I switch from AWS to Azure (or vice versa) mid-project?</strong></p>
<p><strong>A: </strong>Switching cloud providers mid-project is expensive...</p>

<!-- Related Pages -->
<table><td><strong>Related Pages</strong></td></table>
<ul>
  <li>Cloud-Native Development UK: /cloud-native-development/</li>
  <li>AWS Cloud Migration UK: /aws-cloud-migration/</li>
</ul>

<!-- CTA Table -->
<table>Free Cloud Architecture Consultation...</table>

<!-- Author Box -->
<table>
  👤 AUTHOR
  ClickMasters Cloud Architecture Team
</table>

<!-- Schema -->
<table>Article + FAQPage + BreadcrumbList | "aws vs azure uk" (500/mo)</table>
```

---

## 3. Extracted Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number from filename | `"P102"` |
| `slug` | `string` | SLUG meta (cleaned) | `"aws-vs-azure-uk"` |
| `topic` | `string` | Parsed from filename (after `comparison_`) | `"aws_vs_azure_uk"` |
| `title` | `string` | H1 tag text | `"AWS vs Azure for UK Businesses — Data Residency, NHS, GovTech & Cost (2025)"` |
| `metaTitle` | `string` | META TITLE | `"AWS vs Azure for UK Businesses — Data Residency & GDPR \| ClickMasters"` |
| `metaDesc` | `string` | META DESC | `"AWS eu-west-2 vs Azure UK South for UK businesses..."` |
| `lastUpdated` | `string` | Header table | `"June 2025"` |
| `readingTime` | `number` | Header table | `11` |
| `writtenBy` | `string` | Header table | `"ClickMasters Cloud Team"` |
| `reviewedBy` | `string` | Header table | `"AWS & Azure Certified Architects"` |
| `badges` | `array` | Badges table (items in first table before Direct Answer) | `["☁️ AWS eu-west-2", "🔵 Azure UK South", ...]` |
| `directAnswer` | `string` | Text after "Direct Answer:" | `"Both AWS eu-west-2 (London) and Azure UK South..."` |
| `introText` | `string` | Paragraphs between Direct Answer and first comparison table | `""` (often empty — direct answer suffices) |
| `comparisonTables` | `array` | Array of parsed comparison tables (each with header row + data rows) | `[{ title: "Comprehensive Comparison", headers: ["Factor","AWS","Azure"], rows: [[...]] }]` |
| `bodySections` | `array` | Array of body sections (title + paragraph content between tables) | `[{ title: "NHS and Government Cloud", content: "..." }]` |
| `faqs` | `array` | Q&A pairs from FAQ section | `[{ question: "Can I switch...?", answer: "Switching cloud providers..." }]` |
| `relatedPages` | `array` | Extracted links from Related Pages list | `[{ title: "Cloud-Native Development UK", slug: "cloud-native-development" }]` |
| `cta` | `string` | CTA table content | `"Free Cloud Architecture Consultation..."` |
| `author` | `string` | Author box | `"ClickMasters Cloud Architecture Team"` |

---

## 4. Current State

- **177 DOCX files** located under `Clickmasterssoftwaredevelopmentcompany.co.uk/Comparison-Page/`
- No database will be queried.
- Data file `data/comparisons.js` — not yet created.
- Routes `/comparison` and `/comparison/[slug]` — not yet created.

---

## 5. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-comparisons.js`

```javascript
// Pseudocode
1. Read all .docx from Comparison-Page/ folder
2. For each docx:
   a. Extract id + topic from filename pattern
   b. Use mammoth.convertToHtml()
   c. Parse HTML to extract fields:
      - slug, metaTitle, metaDesc (meta table)
      - lastUpdated, readingTime, writtenBy, reviewedBy (header table)
      - title (H1 tag)
      - badges (first table cells before "Direct Answer:")
      - directAnswer (text after "Direct Answer:")
      - comparisonTables (all <table> elements with thead/tbody — main comparison grids)
        → Parse each into { title, headers: [...], rows: [[...]] }
      - bodySections (paragraphs between tables, with preceding <table> title)
      - faqs (Q: / A: pairs)
      - relatedPages (Related Pages list items)
      - cta (CTA table before author box)
      - author (author box content)
   d. Map to data structure
3. Handle duplicates: use lowest P_Number as canonical
4. Output: data/comparisons.js
```

### Phase 2: Generate Data File

**Output:** `data/comparisons.js`

```javascript
export const comparisons = [
  {
    id: "P102",
    slug: "aws-vs-azure-uk",
    topic: "aws_vs_azure_uk",
    title: "AWS vs Azure for UK Businesses — Data Residency, NHS, GovTech & Cost (2025)",
    metaTitle: "AWS vs Azure for UK Businesses — Data Residency & GDPR | ClickMasters",
    metaDesc: "AWS eu-west-2 vs Azure UK South for UK businesses...",
    lastUpdated: "June 2025",
    readingTime: 11,
    writtenBy: "ClickMasters Cloud Team",
    reviewedBy: "AWS & Azure Certified Architects",
    badges: ["☁️ AWS eu-west-2", "🔵 Azure UK South", ...],
    directAnswer: "Both AWS eu-west-2 (London) and Azure UK South...",
    comparisonTables: [
      {
        title: "Comprehensive Comparison — AWS vs Azure for UK",
        headers: ["Factor", "AWS (eu-west-2 London)", "Azure (UK South & UK West)"],
        rows: [
          ["UK Data Centre Location", "eu-west-2 = London", "UK South = London | UK West = Cardiff"],
          ["UK GDPR Data Residency", "✅ All core services in eu-west-2", "✅ All core services in UK South/West"],
          // ... more rows
        ]
      }
    ],
    bodySections: [
      {
        title: "NHS and Government Cloud — Which to Choose",
        content: "NHS England has standardised on Azure Landing Zones..."
      }
    ],
    faqs: [
      { question: "Can I switch from AWS to Azure mid-project?", answer: "Switching cloud providers mid-project is expensive..." }
    ],
    relatedPages: [
      { title: "Cloud-Native Development UK", slug: "cloud-native-development" }
    ],
    cta: "Free Cloud Architecture Consultation...",
    author: "ClickMasters Cloud Architecture Team"
  },
  // ... 177 comparison pages
];
```

### Phase 3: Optimize Data Layer (Performance First)

To avoid loading massive content in listing grids:

- `data/comparisons.js` will export a lightweight list array (`comparisonListings`) containing: `id`, `slug`, `title`, `metaDesc`, `topic`.
- Export lookup functions:
  - `getComparisonBySlug(slug)`: retrieves full record for detail view.
  - `getRelatedComparisons(slug, limit)`: returns related comparisons sharing similar topic keywords.

### Phase 4: Create Next.js Routes

**Route structure:**
```
app/(landing)/
├── comparison/
│   ├── page.js                    # List all comparison pages (searchable grid)
│   └── [slug]/
│       ├── page.js                # Detail page with SSG + generateStaticParams()
│       └── detail-client.jsx      # Client component with full UI
```

**URL Examples:**
- `/comparison/aws-vs-azure-uk`
- `/comparison/agile-vs-waterfall-uk`
- `/comparison/stripe-vs-gocardless-vs-modulr-uk`

---

## 6. Technical Details

### Libraries (Already Installed)
- `mammoth` — DOCX to HTML conversion ✅

### File Locations
```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── Comparison-Page/               # 177 .docx files
│   ├── ClickMasters_P102_comparison_aws_vs_azure_uk.docx
│   └── ...
├── data/
│   └── comparisons.js             # TO BE GENERATED
├── app/(landing)/comparison/
│   ├── page.js                    # TO BE CREATED
│   └── [slug]/
│       ├── page.js                # TO BE CREATED
│       └── detail-client.jsx      # TO BE CREATED
└── scripts/
    └── convert-comparisons.js     # TO BE CREATED
```

### Build Strategy
- Static Site Generation (SSG) with `generateStaticParams()`
- All comparison pages pre-rendered at build time

---

## 7. Styling Conventions (from ClickMasters Rule Guide)

- **Typography:** Headings in `Sora` (Bold 700 / SemiBold 600), Body in `DM Sans` (Regular 400 / Medium 500)
- **Colors:** Dark navy/deep background elements (`primary` / `primary-mid`), highlights/buttons in teal (`accent` -> `accent-hover`)
- **Components:**
  - Section Labels: pill badges with 1px border
  - Cards & Tables: 1px borders, rounded corners (12px for cards, 8px for buttons), shadows with hover lifts (+4px transition)
  - FAQ Accordion: Dark navy pills, smooth height transition
  - Comparison Tables: Side-by-side column layout with highlight column for the recommended option

---

## 8. Step-by-Step Actions

- [ ] **Step 1:** Convert 3 sample comparison DOCX files to HTML, verify extraction patterns match all variations (2-item, 3-item, and single-section comparisons)
- [ ] **Step 2:** Create conversion script `scripts/convert-comparisons.js`
- [ ] **Step 3:** Run script on all 177 files → generate `data/comparisons.js`
- [ ] **Step 4:** Deduplicate and verify entry count
- [ ] **Step 5:** Add lightweight data helpers (`comparisonListings`, `getComparisonBySlug()`, `getRelatedComparisons()`)
- [ ] **Step 6:** Create route `app/(landing)/comparison/page.js` (listing page with search/filter grid)
- [ ] **Step 7:** Create route `app/(landing)/comparison/[slug]/page.js` (SSG detail page with JSON-LD)
- [ ] **Step 8:** Create `app/(landing)/comparison/[slug]/detail-client.jsx` (comparison table UI, FAQ accordion, related pages)
- [ ] **Step 9:** Run production build and verify all pages pre-render

---

## 9. Success Metrics

| Metric | Target |
|--------|-------:|
| Documents parsed | 177 |
| Unique pages generated (after dedup) | ~150–170 |
| Listing page size | Minimal (uses lightweight `comparisonListings`) |
| Detail page rendering | Fully static (SSG), no client-side database calls |
| Build integration | Matches existing patterns (case-studies, hire-pages, salary-guides) |

---

## 10. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Route structure | `/comparison/[slug]/` | Matches slug format from meta table |
| Data file | `data/comparisons.js` | Follows established pattern |
| Topic extraction | From filename | Consistent with other categories |
| Duplicate handling | Lowest P_Number | Same strategy as all prior phases |
| Comparison table parsing | Content-based column detection | Handles 2-way, 3-way, and 4-way comparisons |

---

## 11. Next Immediate Action

1. Create extraction script `scripts/convert-comparisons.js`
2. Run on all 177 files → generate `data/comparisons.js`
3. Create route `/comparison/[slug]/`
4. Build comparison table UI component

---

**End of Plan**
