# Plan: ClickMasters Content Migration — Case Study First

**Generated:** June 13, 2026 | **Last Updated:** June 15, 2026  
**Purpose:** Comprehensive execution plan for converting 1,785 Word documents into Next.js data files

---

## 1. Project Context

### What This Project Is
- **Next.js website** for ClickMasters Software Development Company (UK-based B2B)
- **URL:** https://clickmasterssoftwaredevelopmentcompany.co.uk
- **Content:** 1,785 pages stored as `.docx` files (Word documents)
- **Goal:** Convert all documents into data files readable by Next.js

### Content Inventory (Exact from CSV)

| Category | Count | Folder |
|----------|------:|--------|
| Industry / Service Page | 573 | `Industry-Service-Page/` |
| Hire Page | 300 | `Hire-Page/` |
| Case Study | 280 | `Case-Study/` |
| Salary Guide | 193 | `Salary-Guide/` |
| International City | 179 | `International-City/` |
| Comparison Page | 177 | `Comparison-Page/` |
| Resource Guide | 83 | `Resource-Guide/` |
| **Total** | **1,785** | 7 folders |

---

## 2. Key Findings

### 2.1 Document Structure — Case Study

Analyzed: `ClickMasters_P1003_case_proptech_build_to_rent_portfolio_management.docx`

**HTML Structure Pattern:**

```html
<table>
  META TITLE: PropTech Build-to-Rent Portfolio Management Platform — UK Institutional Landlord — ClickMasters Case Study
  META DESC: A UK institutional landlord managing 4,200 build-to-rent units...
  SLUG: /case-studies/proptech-build-to-rent-portfolio-management/
</table>

<p>Last updated: August 2025 | Reading time: 6 min | Written by: ClickMasters Case Study Team | Reviewed by: James Whitmore, CTO</p>

<h1>PropTech Build-to-Rent Portfolio Management Platform — UK Institutional Landlord</h1>

<table><tr><td>🏭 PropTech / Build-to-Rent</td><td>🇬🇧 UK</td><td>✅ On Time</td><td>📋 Fixed Price</td></tr></table>
<table><tr><td>Sector: PropTech / Build-to-Rent | Tech: React, Node.js/Fastify, PostgreSQL...</td></tr></table>

<p><strong>The Challenge</strong></p>
<p>...challenge description...</p>

<p><strong>Our Approach</strong></p>
<p>...approach description...</p>

<p><strong>The Result</strong></p>
<p>...results description...</p>

<blockquote>Client quote...</blockquote>

<table>
  Technologies | React, Node.js/Fastify, PostgreSQL...
  Compliance | Renters' Rights Bill 2024, RICS...
  Contract | Fixed-price Agile
  IP | 100% transferred
</table>
```

**Extracted Data Fields:**

| Field | Source | Example |
|-------|--------|---------|
| `slug` | SLUG meta | `/case-studies/proptech-build-to-rent-portfolio-management/` |
| `title` | H1 heading | `PropTech Build-to-Rent Portfolio Management Platform` |
| `metaTitle` | META TITLE | `PropTech Build-to-Rent Portfolio Management Platform — UK...` |
| `metaDesc` | META DESC | `A UK institutional landlord managing 4,200 build-to-rent units...` |
| `sector` | Badge table | `PropTech / Build-to-Rent` |
| `country` | Badge table | `UK` |
| `status` | Badge table | `On Time` |
| `contract` | Badge table | `Fixed Price` |
| `techStack` | Tech table | `React, Node.js/Fastify, PostgreSQL...` |
| `compliance` | Compliance table | `Renters' Rights Bill 2024, RICS...` |
| `challenge` | "The Challenge" section | `A UK institutional landlord managing 4,200...` |
| `approach` | "Our Approach" section | `Tenancy Lifecycle Management: ...` |
| `results` | "The Result" section | `Platform live at 20 weeks, £130,000...` |
| `clientQuote` | Blockquote | `"Maintenance resolution from 8.4 days to 4.1 days..."` |
| `lastUpdated` | Date line | `August 2025` |
| `readingTime` | Date line | `6 min` |

### 2.2 Duplicate Slug Analysis

| Metric | Count |
|--------|------:|
| Total CSV rows | 1,785 |
| Unique Slugs | 1,429 |
| Duplicate Slugs | 356 (25%) |

**Most Duplicated Slugs:**
- `custom-software-development-vienna` x7
- `custom-software-development-lisbon` x7
- `custom-software-development-warsaw` x6
- `custom-software-development-stockholm` x5
- `custom-software-development-krakow` x5

**Strategy:** Use lowest `P_Number` as canonical, discard duplicates.

### 2.3 Existing Next.js Route Analysis

**Current Route:** `app/(landing)/case-studies/[id]/page.js`

Uses `useCaseStudy(id)` hook → expects data from MongoDB via API.

**Data Structure Expected by Page:**

```javascript
{
  _id: "...",
  title: "PropTech Build-to-Rent Portfolio Management Platform",
  excerpt: "A UK institutional landlord managing 4,200 build-to-rent units...",
  challenge: "A UK institutional landlord managing 4,200 build-to-rent units...",
  approach: "Tenancy Lifecycle Management: Build-to-rent tenancy lifecycle...",
  results: "Platform live at 20 weeks, £130,000 — under budget...",
  client: "Confidential",
  status: "On Time",
  thumbnail: "https://...",
  technologies: ["React", "Node.js", "PostgreSQL", ...],
  project: {
    title: "...",
    description: "...",
    category: { name: "PropTech" },
    status: "Completed",
    tags: ["build-to-rent", "portfolio-management"],
    url: "https://..."
  }
}
```

### 2.4 URL Structure Decision

**Recommendation:** Use `[slug]` instead of `[id]`

- Better SEO (clean URLs like `/case-studies/proptech-build-to-rent-portfolio-management/`)
- Matches the `SLUG` field in docx
- More user-friendly

---

## 3. Current State

### ✅ Completed
1. All 1,785 `.docx` files organized into 7 category folders
2. Redundant copies removed (part1-part4b, Website Docs deleted)
3. Master CSV intact with metadata
4. `mammoth` library installed for docx parsing
5. **Case studies converted** — 280 DOCX → `data/case-studies.js` (9,743 lines, 274 unique entries after dedup)
6. **Hire pages converted** — 300 DOCX → `data/hire-pages.js` (9,478 lines, 258 unique entries after dedup)
7. **Case studies listing page** — `app/(landing)/case-studies/page.js` rebuilt as server component using lightweight `caseStudyListings` + `getSectorsMeta()`
8. **Case studies detail page** — `app/(landing)/case-studies/[slug]/page.js` using `getCaseStudyBySlug()` + `getRelatedCaseStudies()` with `generateStaticParams`
9. **Hire listing page** — `app/(landing)/hire/page.js` using `getHireRolesMap()` to group by role with cities
10. **Hire detail page** — `app/(landing)/hire/[role]/[city]/page.js` using `getHirePageByRoleCity()`, `getRelatedHirePages()`, `getDedupedFaqs()` with `generateStaticParams`
11. **Client-side filter** — `filter-client.js` for case studies search/sector filtering
12. **Data layer optimization** — both data files export lightweight listing arrays + lookup functions to avoid shipping 9,000+ lines of JS to listing pages
13. **FAQ deduplication** — `getDedupedFaqs()` added to eliminate repeated questions (up to 6× per page)

### 🔲 Not Started (Remaining Categories)
1. Salary Guide (193) → `data/salary-guides.js` → `/salary-guide/[slug]/`
2. Comparison Page (177) → `data/comparisons.js` → `/comparison/[slug]/`
3. Resource Guide (83) → `data/resource-guides.js` → `/resource/[slug]/`
4. International City (179) → `data/cities.js` → `/cities/[slug]/`
5. Industry / Service Page (573) → `data/services.js` → `/[category]/[service]/`

### 🔲 Known Issues to Address
- `deliveryModel` and `timeline` fields are empty across all case studies (source DOCX lack these fields)
- P1109 case study entry is commented out in data file
- Pre-existing Radix UI prerender error on hire detail pages (`Cannot read properties of null (reading 'useContext')`) — exists on base branch, not caused by our changes

---

## 4. Execution Plan: Case Studies First

### Phase 1: Create Extraction Script

**File:** `scripts/convert-case-studies.js`

```javascript
// Pseudocode
1. Read all .docx from Case-Study/ folder
2. For each docx:
   a. Use mammoth.convertToHtml()
   b. Parse HTML to extract fields (slug, title, challenge, approach, results, etc.)
   c. Map to data structure
3. Output: data/case-studies.js
```

### Phase 2: Generate Data File

**Output:** `data/case-studies.js`

```javascript
export const caseStudies = [
  {
    id: "P1003",
    slug: "proptech-build-to-rent-portfolio-management",
    title: "PropTech Build-to-Rent Portfolio Management Platform",
    // ... all mapped fields
  },
  // ... 280 case studies
];
```

### Phase 3: Update Route

**Change:** `app/(landing)/case-studies/[id]/page.js` → `app/(landing)/case-studies/[slug]/page.js`

**Updates needed:**
1. Change `useParams()` from `id` to `slug`
2. Update data fetching to use slug
3. Add `generateStaticParams()` for SSG

### Phase 4: Repeat for Other Categories

| Category | Count | Data File | Route |
|----------|------:|-----------|-------|
| Hire Page | 300 | `data/hire-pages.js` | `/hire/[role]/[city]/` |
| Salary Guide | 193 | `data/salary-guides.js` | `/salary-guide/[slug]/` |
| Comparison Page | 177 | `data/comparisons.js` | `/comparison/[slug]/` |
| Resource Guide | 83 | `data/resource-guides.js` | `/resource/[slug]/` |
| International City | 179 | `data/cities.js` | `/cities/[slug]/` |
| Industry / Service | 573 | `data/services.js` | `/[category]/[service]/` |

---

## 5. Technical Details

### Libraries Needed
- `mammoth` — DOCX to HTML conversion (installed ✅)
- `jsdom` or `cheerio` — HTML parsing for field extraction

### File Locations

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── Case-Study/                    # 280 .docx files
│   ├── ClickMasters_P1003_case_...
│   └── ...
├── data/
│   ├── case-studies.js           # TO BE GENERATED
│   ├── hire-pages.js             # ...
│   └── ...
├── app/(landing)/case-studies/
│   ├── page.js                    # List page
│   └── [slug]/page.js             # Detail page (to update)
└── scripts/
    ├── convert-case-studies.js   # TO BE CREATED
    └── ...
```

### Build Strategy
- Static Site Generation (SSG) with `generateStaticParams`
- All 1,785 pages pre-rendered at build time
- Expected output: ~1,975 static pages

---

## 6. Step-by-Step Actions

### Step 1: Parse First Case Study
- [x] Convert docx to HTML using mammoth
- [x] Identify field extraction patterns
- [x] Verify structure with 2 more samples

### Step 2: Create Conversion Script
- [x] Write `scripts/convert-case-studies.js`
- [x] Test on 5 files
- [x] Debug extraction logic

### Step 3: Generate Data File — Case Studies
- [x] Run script on all 280 case studies
- [x] Output `data/case-studies.js` — 9,743 lines, 274 unique entries
- [x] Add lightweight helper exports (`caseStudyListings`, `getCaseStudyBySlug`, `getSectorsMeta`, `getRelatedCaseStudies`)

### Step 4: Update Routes — Case Studies
- [x] Route: `app/(landing)/case-studies/[slug]/page.js` (changed from `[id]`)
- [x] Listing page rebuilt as server component using `caseStudyListings`
- [x] Detail page using `getCaseStudyBySlug()` with `generateStaticParams`
- [x] Client-side filter extracted to `filter-client.js`

### Step 5: Generate Data File — Hire Pages
- [x] Converted 300 hire page DOCX files
- [x] Output `data/hire-pages.js` — 9,478 lines, 258 unique entries
- [x] Add lightweight helper exports (`hirePageListings`, `getHirePageByRoleCity`, `getHireRolesMap`, `getRelatedHirePages`, `getDedupedFaqs`)

### Step 6: Update Routes — Hire Pages
- [x] Listing page: `app/(landing)/hire/page.js` using `getHireRolesMap()`
- [x] Detail page: `app/(landing)/hire/[role]/[city]/page.js` with `generateStaticParams`
- [x] Detail page using `getHirePageByRoleCity()`, `getRelatedHirePages()`, `getDedupedFaqs()`

### Step 7: Performance Optimization (see agent.md Section 11)
- [x] Split data files into lightweight listing arrays + lookup functions
- [x] Lazy-load Navbar Resources mega menu (`ResourcesMegaMenu.jsx`)
- [x] Fix Navbar trailing slash mismatch in `forceWhiteBgRoutes`
- [x] Deduplicate FAQ data in hire pages

### Step 8: Repeat for Remaining Categories
- [ ] Salary Guide (193) → `data/salary-guides.js`
- [ ] Comparison Page (177) → `data/comparisons.js`
- [ ] Resource Guide (83) → `data/resource-guides.js`
- [ ] International City (179) → `data/cities.js`
- [ ] Industry / Service Page (573) → `data/services.js`

---

## 7. Success Metrics

| Metric | Target | Actual |
|--------|--------|--------|
| Case studies converted | 280 | ✅ 274 unique (from 280 DOCX) |
| Hire pages converted | 300 | ✅ 258 unique (from 300 DOCX) |
| Data file entries (case studies) | 280 | 274 |
| Data file entries (hire pages) | 300 | 258 |
| Static pages generated (case studies) | 283 (listing + detail + filter) | ✅ Live |
| Static pages generated (hire pages) | 301 (listing + detail) | ✅ Live |
| Build time | 30-60s | ⚠️ Existing prerender error on hire detail (pre-existing) |
| Page load time | <2s | Improved via data splitting (see agent.md §11) |
| Data shipped to listing pages | Minimal | ✅ Lightweight arrays only (no heavy text fields) |

---

## 8. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| DOCX formatting variations | Medium | Test on 5+ samples before bulk run |
| Duplicate slugs | Medium | Use lowest P_Number as canonical |
| Missing fields | Low | Add defaults, log warnings |
| Build time too long | Low | Use incremental builds, Turbopack |

---

## 9. Decision Points

1. **Use slug or id in route?** → **Use slug** (more SEO-friendly)
2. **Store in data files or MongoDB?** → **Data files** (simpler, follows fellow's pattern)
3. **Admin panel?** → **No** (data files are simpler)

---

## 10. Next Immediate Actions

### Completed ✅
1. ~~Write extraction script for case studies~~ → 274 unique entries generated
2. ~~Run on all 280 files~~ → `data/case-studies.js` (9,743 lines)
3. ~~Convert hire pages~~ → 258 unique entries → `data/hire-pages.js` (9,478 lines)
4. ~~Update case study route to use `[slug]`~~ → listing + detail pages live
5. ~~Update hire route~~ → listing + detail pages live
6. ~~Add lightweight data helpers~~ → listing pages no longer ship full data arrays
7. ~~Performance optimizations~~ → Navbar lazy-load, trailing slash fix, FAQ dedup

### Remaining
1. Convert Salary Guide (193 DOCX) → `data/salary-guides.js`
2. Convert Comparison Page (177 DOCX) → `data/comparisons.js`
3. Convert Resource Guide (83 DOCX) → `data/resource-guides.js`
4. Convert International City (179 DOCX) → `data/cities.js`
5. Convert Industry / Service Page (573 DOCX) → `data/services.js`
6. Fix pre-existing Radix UI prerender error on hire detail pages
7. Populate empty `deliveryModel`/`timeline` fields in case studies
8. Address remaining performance items (see agent.md §11.4)

---

**End of Plan**