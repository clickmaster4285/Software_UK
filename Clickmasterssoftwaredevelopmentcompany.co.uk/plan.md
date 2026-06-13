# Plan: ClickMasters Content Migration — Case Study First

**Generated:** June 13, 2026  
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

### ❌ Not Started
1. Conversion script for case studies
2. Data file generation (`data/case-studies.js`)
3. Route update (change `[id]` to `[slug]`)
4. Same for other 6 categories

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
- [ ] Write `scripts/convert-case-studies.js`
- [ ] Test on 5 files
- [ ] Debug extraction logic

### Step 3: Generate Data File
- [ ] Run script on all 280 case studies
- [ ] Output `data/case-studies.js`
- [ ] Verify count: 280 entries

### Step 4: Update Route
- [ ] Rename `[id]` to `[slug]`
- [ ] Update page to import from data file
- [ ] Test with one case study

### Step 5: Repeat for Other Categories
- [ ] Hire Page (300)
- [ ] Salary Guide (193)
- [ ] Comparison Page (177)
- [ ] Resource Guide (83)
- [ ] International City (179)
- [ ] Industry / Service Page (573)

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Case studies converted | 280 |
| Data file entries | 280 |
| Static pages generated | 1,975+ |
| Build time | 30-60 seconds |
| Page load time | <2 seconds |

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

1. Write extraction script for case studies
2. Run on all 280 files → generate `data/case-studies.js`
3. Update route to use `[slug]`
4. Test the page displays correctly

---

**End of Plan**