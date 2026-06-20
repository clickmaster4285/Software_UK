# Plan: ClickMasters Content Migration — Standalone Service Pages

**Generated:** June 20, 2026
**Purpose:** Convert 11 standalone service DOCX files into `data/services.js` and wire to existing route
**Reference:** See `agent.md` for overall context, `plan-industry-service-pages.md` for industry+service combo plan

---

## 1. Project Context

### Progress So Far

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 311 | 269 | `/hire/[role]/[city]/` | ✅ |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| 4 | Comparison Pages | 177 | 141 | `/comparison/[slug]/` | ✅ |
| 5 | Resource Guides | 105 | 81 | `/resource/[slug]/` | ✅ (re-run with 2 new files) |
| 6 | International City | 306 | 203 | `/cities/[slug]/` | ✅ |
| 7 | Glossary | 200 | 200 | `/glossary/[term]/` | ✅ |
| **8** | **Standalone Services** | **11** | **TBD** | **`/service/[slug]/`** | **🔲 Not Started** |
| 9 | Industry+Service Combos | 202 | TBD | `/[category]/[service]/` | 🔲 Not Started |

---

## 2. Document Inventory

### 11 Files in `Service/` Folder

| # | Filename | P-Number | Slug | Title |
|---|----------|----------|------|-------|
| 1 | `ClickMasters_P6_MVP_Development_UK.docx` | P6 | `/mvp-development/` | MVP Development UK — Launch Your Minimum Viable Product in 8–12 Weeks |
| 2 | `ClickMasters_P8_Staff_Augmentation_UK.docx` | P8 | `/staff-augmentation/` | IT Staff Augmentation UK — Vetted Senior Engineers, IR35-Compliant, from £5,000/Month |
| 3 | `ClickMasters_P10_API_Development_UK.docx` | P10 | `/api-development/` | API Development UK — REST APIs, GraphQL & Government Integrations |
| 4 | `ClickMasters_P11_DevOps_CICD_UK.docx` | P11 | `/devops-cicd/` | DevOps & CI/CD Services UK — AWS, Azure & Kubernetes |
| 5 | `ClickMasters_P12_QA_Testing_Services_UK.docx` | P12 | `/qa-testing/` | QA & Software Testing Services UK — Automated, Manual, Security & Accessibility Testing |
| 6 | `ClickMasters_P13_Legacy_Modernisation_UK.docx` | P13 | `/legacy-modernisation/` | Legacy System Modernisation UK — Migrate Without Downtime or Data Risk |
| 7 | `ClickMasters_P14_Software_Consulting_UK.docx` | P14 | `/software-consulting/` | Software Consulting UK — CTO Advisory, Architecture Review & Technology Strategy |
| 8 | `ClickMasters_P15_Cloud_Native_Development_UK.docx` | P15 | `/cloud-native-development/` | Cloud-Native Development UK — AWS & Azure, UK GDPR Data Residency by Design |
| 9 | `ClickMasters_P16_Microservices_Architecture_UK.docx` | P16 | `/microservices-architecture/` | Microservices Architecture UK — Decompose Your Monolith, Scale Your Platform |
| 10 | `ClickMasters_P17_Software_Maintenance_Support_UK.docx` | P17 | `/software-maintenance/` | Software Maintenance & Support UK — SLA-Backed, Cyber Essentials Aligned |
| 11 | `ClickMasters_P21_Software_Project_Rescue_UK.docx` | P21 | `/software-project-rescue/` | Software Project Rescue UK — Save Your Failed, Stalled or Over-Budget Build |

---

## 3. Document Structure Analysis

### HTML Pattern (from mammoth conversion)

All 11 files share this consistent structure:

```html
<!-- Table 1: Meta table -->
<table>
  META TITLE: {title} | ClickMasters
  META DESC: {description}
  SLUG: /{slug}/
</table>

<!-- Table 2: Header table -->
<table>
  Last updated: {date} | Reading time: {N} min | Written by: {author} | Reviewed by: {reviewer}
</table>

<!-- Table 3: Breadcrumb -->
<p>Home › Services › <strong>{Service Name}</strong></p>

<!-- H1 -->
<h1>{Title}</h1>

<!-- Table 4: Badges table -->
<table>
  {Badge 1} | {Badge 2} | {Price} | {Compliance} | {Location}
</table>

<!-- Table 5: Direct Answer -->
<table>Direct Answer: {text}</table>

<!-- Table 6+: Content sections (heading + paragraphs) -->
<table><td>{Section Heading}</td></tr>
<p><strong>{Bold Title}: </strong>{paragraph text}</p>
<p><strong>{Bold Title}: </strong>{paragraph text}</p>

<!-- Table: Pricing table -->
<table>
  <thead><tr><th>Type</th><th>Scope</th><th>Price</th></tr></thead>
  <tbody><tr><td>...</td><td>...</td><td>...</td></tr></tbody>
</table>

<!-- Table: FAQs -->
<table><td>FAQs</td></tr>
<p><strong>Q: {question}</strong></p>
<p><strong>A: </strong>{answer}</p>
```

### Structural Observations

1. **5-badge header table**: Service type | Compliance | Price | UK GDPR | UK location
2. **Direct Answer**: Always in its own table cell
3. **Content sections**: `<strong>Bold Title: </strong>` paragraph format within table cells
4. **Pricing table**: Standard thead/tbody with Type | Scope | Price columns
5. **FAQ section**: Q:/A: pairs within a table
6. **Author/Reviewer**: Present in header table
7. **No industry-specific compliance badges** (unlike combo pages which have FCA ICOBS, DTAC, etc.)
8. **Simpler than combo pages**: No industry use cases, no differentiators section, no services cards

### Key Differences from Combo (Industry+Service) Pages

| Feature | Combo Pages (202) | Service Pages (11) |
|---------|-------------------|-------------------|
| Industry badge | ✅ (fintech, healthtech, etc.) | ❌ |
| Industry-specific compliance | ✅ (FCA ICOBS, DTAC, etc.) | ❌ (generic UK GDPR only) |
| Direct Answer | ✅ | ✅ |
| Content sections | ✅ | ✅ |
| Pricing table | ✅ | ✅ |
| FAQs | ✅ | ✅ |
| Services cards | ✅ | ❌ |
| Differentiators | ✅ | ❌ |
| Industry use cases | ✅ | ❌ |
| Author/Reviewer | ✅ | ✅ |
| Tables (data) | ✅ | Some |

---

## 4. Extracted Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number from filename | `"P6"` |
| `slug` | `string` | SLUG meta (cleaned) | `"mvp-development"` |
| `serviceName` | `string` | H1 heading (cleaned) | `"MVP Development UK — Launch in 8–12 Weeks"` |
| `title` | `string` | H1 heading (full) | `"MVP Development UK — Launch Your Minimum Viable Product in 8–12 Weeks"` |
| `metaTitle` | `string` | META TITLE | `"MVP Development UK — Launch in 8–12 Weeks \| ClickMasters"` |
| `metaDesc` | `string` | META DESC | `"Build your MVP in 8–12 weeks from £12,000..."` |
| `lastUpdated` | `string` | Header table | `"August 2025"` |
| `readingTime` | `number` | Header table | `9` |
| `writtenBy` | `string` | Header table | `"ClickMasters Engineering Team"` |
| `reviewedBy` | `string` | Header table | `"James Whitmore, CTO"` |
| `badges` | `array` | Badge table items | `["MVP Development", "UK GDPR", "£12,000+", "Innovate UK"]` |
| `directAnswer` | `string` | Text after "Direct Answer:" | `"ClickMasters builds MVPs..."` |
| `sections` | `array` | Section heading + paragraphs | `[{ heading: "UK Specifics", paragraphs: [...] }]` |
| `pricingTiers` | `array` | Pricing table rows | `[{ type: "Lean MVP", scope: "...", price: "£12,000–£25,000" }]` |
| `faqs` | `array` | Q:/A pairs | `[{ question: "...", answer: "..." }]` |

---

## 5. Current Route Analysis

### Existing Route: `app/(landing)/[category]/[service]/page.js`

This route currently uses `data/sub-services.js` which has a different data shape:
- `servicePages` array with `categorySlug`, `slug`, `serviceName`, `title`, `metaDescription`, etc.
- `getAllServicePages()`, `getServicePage()`, `getServiceTechnologies()` functions

### What Needs to Change

The existing route expects `category` + `service` params. Standalone service pages don't have a category. Two options:

**Option A: New route `/service/[slug]/`** for standalone services
- Clean separation: combo pages at `/[category]/[service]/`, standalone at `/service/[slug]/`
- 11 new pages under `/service/`
- No changes to existing combo route

**Option B: Add `category = "services"` to standalone pages**
- All service pages accessible at `/services/[slug]/`
- Reuse existing route with minor modifications
- Simpler but less clean URL structure

**Recommendation: Option A** — new route `/service/[slug]/` for standalone services. This keeps the URL structure clean and doesn't conflate combo pages with standalone pages.

---

## 6. Data File Design

### File: `data/services.js`

Following the established pattern (lightweight helpers + full data):

```js
const services = [
  {
    id: "P6",
    slug: "mvp-development",
    serviceName: "MVP Development UK — Launch in 8–12 Weeks",
    title: "MVP Development UK — Launch Your Minimum Viable Product in 8–12 Weeks",
    metaTitle: "MVP Development UK — Launch in 8–12 Weeks | ClickMasters",
    metaDesc: "Build your MVP in 8–12 weeks from £12,000...",
    lastUpdated: "August 2025",
    readingTime: 9,
    writtenBy: "ClickMasters Engineering Team",
    reviewedBy: "James Whitmore, CTO",
    badges: ["MVP Development", "UK GDPR", "£12,000+", "Innovate UK"],
    directAnswer: "ClickMasters builds MVPs...",
    sections: [
      { heading: "MVP Development — UK Specifics", paragraphs: [...] },
      // ...
    ],
    pricingTiers: [
      { type: "Lean MVP", scope: "...", price: "£12,000–£25,000" },
      // ...
    ],
    faqs: [
      { question: "How long does it take to build an MVP?", answer: "..." },
      // ...
    ],
  },
  // ... 10 more
];

// Lightweight listing data
export const serviceListings = services.map(
  ({ id, slug, serviceName, title, metaDesc, badges }) =>
    ({ id, slug, serviceName, title, metaDesc, badges })
);

// Lookup by slug
export function getServiceBySlug(slug) {
  return services.find(s => s.slug === slug) || null;
}

// Get all services (for listing page)
export function getAllServices() {
  return services;
}

// Get related services (by badge overlap)
export function getRelatedServices(slug, limit = 3) {
  const current = getServiceBySlug(slug);
  if (!current) return [];
  return services
    .filter(s => s.slug !== slug && s.badges.some(b => current.badges.includes(b)))
    .slice(0, limit);
}

export { services };
```

---

## 7. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-service.js`

Steps:
1. Read all 11 .docx from `Service/` folder
2. For each docx:
   a. Extract P-number from filename
   b. Use mammoth.convertToHtml()
   c. Extract metadata (slug, title, meta, header)
   d. Extract badge table items
   e. Direct Answer
   f. Content sections (heading + bold-labeled paragraphs)
   g. Pricing table
   h. FAQs (Q:/A pairs)
3. Handle duplicates by slug → keep lowest P-number
4. Output: `data/services.js`

### Phase 2: Add Lightweight Data Helpers

Following the established pattern:
- `serviceListings` — lightweight array for listing pages
- `getServiceBySlug(slug)` — lookup function
- `getAllServices()` — all services for listing page
- `getRelatedServices(slug, limit)` — related by badge overlap

### Phase 3: Create Route

**New file:** `app/(landing)/service/[slug]/page.js`

- Standalone service detail page
- Uses `data/services.js` instead of `data/sub-services.js`
- Same UI structure as combo page (hero, sections, pricing, FAQ)

### Phase 4: Create Listing Page (Optional)

**New file:** `app/(landing)/service/page.js`

- Lists all 11 standalone services
- Card grid layout

---

## 8. Styling Conventions

- **Typography:** Headings `Sora` (Bold 700), Body `DM Sans`
- **Colors:** Dark navy `primary`, teal `accent`
- **Detail Page:**
  - Hero: Title + badges (service type, compliance, price, UK GDPR, UK)
  - Direct Answer: Callout box
  - Content sections: Standard content blocks with bold-led paragraphs
  - Pricing: Table with Type | Scope | Price
  - FAQ: Accordion (dark navy pills)
- **Listing Page:** Card grid showing all 11 services

---

## 9. Step-by-Step Actions

- [x] **Step 1:** Analyze 11 standalone service DOCX files — structure confirmed
- [ ] **Step 2:** Create conversion script `scripts/convert-service.js`
- [ ] **Step 3:** Run script on 11 files → generate `data/services.js`
- [ ] **Step 4:** Add lightweight data helpers
- [ ] **Step 5:** Create `app/(landing)/service/[slug]/page.js` route
- [ ] **Step 6:** Create `app/(landing)/service/page.js` listing page (optional)
- [ ] **Step 7:** Run production build and verify all pages pre-render

---

## 10. Success Metrics

| Metric | Target |
|--------|-------:|
| Documents parsed | 11 |
| Unique pages (after dedup) | ~11 |
| Detail pages static | ~11 |
| Data file | `data/services.js` |
| Parsing errors | 0 |

**End of Plan**
