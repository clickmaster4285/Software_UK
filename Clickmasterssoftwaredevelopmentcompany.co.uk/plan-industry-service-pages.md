# Plan: ClickMasters Content Migration — Industry / Service Pages

**Generated:** June 19, 2026
**Purpose:** Convert 215 true industry+service DOCX files into `data/industry-services.js` and update existing route to use new data
**Reference:** See `agent.md` for overall context, `plan-industry-service-page.md` for folder cleanup context

---

## 1. Project Context

### Progress So Far

| Phase | Category | DOCX | Unique | Route | Status |
|-------|----------|-----:|-------:|-------|--------|
| 1 | Case Studies | 280 | 274 | `/case-studies/[slug]/` | ✅ |
| 2 | Hire Pages | 311 | 269 | `/hire/[role]/[city]/` | ✅ |
| 3 | Salary Guides | 193 | 99 | `/salary-guide/[slug]/` | ✅ |
| 4 | Comparison Pages | 177 | 141 | `/comparison/[slug]/` | ✅ |
| 5 | Resource Guides | 103 | 80 | `/resource/[slug]/` | ✅ |
| 6 | International City | 306 | 203 | `/cities/[slug]/` | ✅ |
| **7** | **Industry / Service** | **215** | **TBD** | **`/[category]/[service]/`** | **🔲 Not Started** |
| 8 | Glossary | 200 | TBD | `/glossary/[term]/` | 🔲 Pending |

---

## 2. Document Structure Analysis

### Filename Pattern

```
ClickMasters_P1001_insurtech_saas-development.docx
ClickMasters_P1002_healthtech_qa-testing.docx
```

- `P{ID}` → unique identifier
- `{industry}_{service}` → industry + service from filename

### Sample: `ClickMasters_P1001_insurtech_saas-development.docx`

**HTML Structure (converted from DOCX):**

```html
<!-- Meta table -->
<table>
  META TITLE: SaaS Development for InsurTech UK | ClickMasters
  META DESC: SaaS Development for UK InsurTech. FCA ICOBS. £35,000–£180,000.
  SLUG: /insurtech-saas-development/
</table>

<!-- Header table -->
<table>
  Last updated: August 2025 | Reading time: 9 min | Written by: ClickMasters InsurTech Team | Reviewed by: James Whitmore, CTO
</table>

<!-- Breadcrumb -->
<p>Home › Industries › InsurTech Software › <strong>SaaS Development for InsurTech</strong></p>

<!-- H1 -->
<h1><strong>SaaS Development for UK InsurTech — FCA ICOBS Built In</strong></h1>

<!-- Badges table -->
<table>
  InsurTech | FCA ICOBS | 💷 £35,000–£180,000 | 🔒 UK GDPR | ⚖️ IR35-Safe | 🇬🇧 UK
</table>

<!-- Direct Answer table -->
<table>
  Direct Answer: ClickMasters provides SaaS Development for UK InsurTech businesses...
</table>

<!-- Content sections (heading + paragraphs per section) -->
<table><td>SaaS Development for InsurTech — UK Specifics</td></tr>
<p><strong>Lloyd's Market Association API Integration: </strong>...</p>
<p><strong>FCA ICOBS and SaaS Insurance Products: </strong>...</p>

<!-- Compliance table -->
<table>
  Compliance: DTAC, NHS DSP Toolkit, UK GDPR Article 9, ...
</table>

<!-- Pricing table -->
<table>
  <thead><tr><th>Type</th><th>Scope</th><th>Price</th></tr></thead>
  <tbody><tr><td>InsurTech SaaS Development</td><td>Full engagement</td><td>£35,000–£180,000</td></tr></tbody>
</table>

<!-- FAQ section (Q:/A: pairs) -->
<table><td>FAQs</td></tr>
<p><strong>Q: Does InsurTech SaaS need FCA authorisation?</strong></p>
<p><strong>A: </strong>It depends. If the platform itself does not provide regulated insurance advice...</p>
```

### Key Structural Observations

1. **6-badge header table**: Industry | Compliance | Price | UK GDPR | IR35-Safe | UK
2. **Direct Answer**: Always in its own table
3. **Content sections**: `<strong>Bold Title: </strong>` paragraph format within a table cell
4. **Pricing table**: Standard thead/tbody with Type | Scope | Price columns
5. **FAQ section**: Q:/A: pairs within a table (same pattern as resource guides)
6. **No separate author/CTA tables** (unlike resource guides) — ends after FAQs
7. **Industry-specific compliance**: Each industry has different compliance badges (FCA ICOBS for insurtech, DTAC for healthtech, etc.)

---

## 3. Extracted Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number from filename | `"P1001"` |
| `slug` | `string` | SLUG meta (cleaned) | `"insurtech-saas-development"` |
| `industry` | `string` | First segment of filename | `"insurtech"` |
| `service` | `string` | Second segment of filename | `"saas-development"` |
| `title` | `string` | H1 heading | `"SaaS Development for UK InsurTech — FCA ICOBS Built In"` |
| `metaTitle` | `string` | META TITLE | `"SaaS Development for InsurTech UK \| ClickMasters"` |
| `metaDesc` | `string` | META DESC | `"SaaS Development for UK InsurTech..."` |
| `lastUpdated` | `string` | Header table | `"August 2025"` |
| `readingTime` | `number` | Header table | `9` |
| `writtenBy` | `string` | Header table | `"ClickMasters InsurTech Team"` |
| `reviewedBy` | `string` | Header table | `"James Whitmore, CTO"` |
| `badges` | `array` | Badge table items | `["InsurTech", "FCA ICOBS", "💷 £35,000–£180,000"]` |
| `directAnswer` | `string` | Text after "Direct Answer:" | `"ClickMasters provides SaaS Development..."` |
| `contentSections` | `array` | Section heading + paragraphs | `[{ heading: "UK Specifics", paragraphs: [...] }]` |
| `compliance` | `array` | Compliance table/bullet items | `["FCA ICOBS", "UK GDPR", "IR35-Safe"]` |
| `pricingTable` | `array` | Pricing table rows | `[{ type: "Full engagement", scope: "...", price: "£35,000–£180,000" }]` |
| `faqs` | `array` | Q:/A pairs | `[{ question: "...", answer: "..." }]` |

---

## 4. Industries Represented

| Industry | Example Services |
|----------|-----------------|
| fintech | software-development, saas-development, mvp-development, api-development, qa-testing, legacy-modernisation, etc. |
| healthtech | custom-software-development, saas-development, mvp-development, qa-testing, staff-augmentation, etc. |
| govtech | software-development, api-development, qa-testing, staff-augmentation, etc. |
| ecommerce | software-development, saas-development, microservices-architecture, api-development, etc. |
| proptech | software-development, saas-development, api-development, devops-cicd, etc. |
| insurtech | custom-software-development, saas-development, api-development, qa-testing, etc. |
| logtech | software-development, custom-software-development, saas-development, etc. |
| retailtech | software-development, saas-development, staff-augmentation, ai-development, etc. |
| edtech | software-development, saas-development, legacy-modernisation, etc. |
| medtech | saas-development, microservices-architecture, legacy-modernisation, etc. |
| cleantech | api-development, saas-development, cloud-native-development, etc. |
| legaltech | software-development, custom-software-development, saas-development, etc. |
| agritech | api-development |
| insurance | api-development, legacy-modernisation |
| saas | devops-cicd, legacy-modernisation |
| ai | devops-cicd, staff-augmentation, cloud-native-development |

---

## 5. Current State

- **215 DOCX files** located under `Clickmasterssoftwaredevelopmentcompany.co.uk/Industry-Service-Page/`
- Data file `data/industry-services.js` — does not exist yet
- Existing route `app/(landing)/[category]/[service]/page.js` — exists but uses `data/sub-services.js` (manually created data, not from DOCX)
- Need to: create conversion script → generate data → update existing route

---

## 6. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-industry-services.js`

Steps:
1. Read all 215 .docx from Industry-Service-Page/ folder
2. For each docx:
   a. Parse industry + service from filename
   b. Use mammoth.convertToHtml()
   c. Extract metadata (slug, title, meta, header)
   d. Extract badge table items
   e. Direct Answer
   f. Content sections (heading + bold-labeled paragraphs)
   g. Compliance items
   h. Pricing table
   i. FAQs (Q:/A pairs)
3. Handle duplicates by slug → keep lowest P-number
4. Output: `data/industry-services.js`

### Phase 2: Add Lightweight Data Helpers

Following the established pattern:
- `industryServiceListings` — lightweight array (id, slug, industry, service, title, metaDesc, badges) for listing pages
- `getIndustryServiceBySlug(slug)` — lookup function
- `getIndustryServicesByCategory(industry)` — filter by industry for listing pages
- `getRelatedServices(slug, limit)` — same industry, different service
- `getIndustriesList()` — unique industries with counts

### Phase 3: Update Existing Route + Create New Listing Route

**Update existing:** `app/(landing)/[category]/[service]/page.js` — change import from `data/sub-services.js` to `data/industry-services.js`

**Create new:** `app/(landing)/[category]/page.js` — industry listing page showing all services for that industry

---

## 7. Styling Conventions

- **Typography:** Headings `Sora` (Bold 700), Body `DM Sans`
- **Colors:** Dark navy `primary`, teal `accent`
- **Detail Page:**
  - Hero: Title + badges (industry, compliance, price, UK GDPR, IR35-Safe, UK)
  - Direct Answer: Callout box
  - Content sections: Standard content blocks with bold-led paragraphs
  - Pricing: Table with Type | Scope | Price
  - FAQ: Accordion (dark navy pills)
- **Listing Page:** Card grid showing all services for the industry

---

## 8. Step-by-Step Actions

- [x] **Step 1:** Analyze 2 sample industry+service DOCX files — structure confirmed
- [ ] **Step 2:** Create conversion script `scripts/convert-industry-services.js`
- [ ] **Step 3:** Run script on 215 files → generate `data/industry-services.js`
- [ ] **Step 4:** Add lightweight data helpers
- [ ] **Step 5:** Update existing `app/(landing)/[category]/[service]/page.js` to use `data/industry-services.js`
- [ ] **Step 6:** Create `app/(landing)/[category]/page.js` (industry listing page)
- [ ] **Step 7:** Run production build and verify all pages pre-render

---

## 9. Success Metrics

| Metric | Target |
|--------|-------:|
| Documents parsed | 215 |
| Unique pages (after dedup) | ~215 |
| Industries covered | ~16 |
| Detail pages static | ~215 |
| Industry listing pages | ~16 |
| Data file | `data/industry-services.js` |
| Parsing errors | 0 |

**End of Plan**
