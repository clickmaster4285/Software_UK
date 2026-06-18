# Plan: ClickMasters Content Migration — Industry / Service Pages

**Generated:** June 18, 2026
**Purpose:** Clean up misplaced files in Industry-Service-Page folder, then convert all remaining true industry+service DOCX files
**Reference:** See `agent.md` for overall context, `plan.md` for overall migration roadmap

---

## 1. Project Context

### Progress So Far

| Phase       | Category                     |          DOCX |         Unique | Route                                | Status                   |
| ----------- | ---------------------------- | ------------: | -------------: | ------------------------------------ | ------------------------ |
| 1           | Case Studies                 |           280 |            274 | `/case-studies/[slug]/`            | ✅                       |
| 2           | Hire Pages                   |           300 |            258 | `/hire/[role]/[city]/`             | ✅                       |
| 3           | Salary Guides                |           193 |             99 | `/salary-guide/[slug]/`            | ✅                       |
| 4           | Comparison Pages             |           177 |            141 | `/comparison/[slug]/`              | ✅                       |
| 5           | Resource Guides              |            83 |             63 | `/resource/[slug]/`                | ✅                       |
| 6           | International City           |           179 |             96 | `/cities/[slug]/`                  | ✅                       |
| **7** | **Industry / Service** | **573** | **~280** | **`/[category]/[service]/`** | **🔲 Not Started** |

### What We're Doing Now: Industry / Service Pages

The `Industry-Service-Page/` folder contains **573 DOCX files**, but analysis shows only **~280** are true industry+service pages. The rest are misplaced files belonging to other categories that were broadly labeled "Industry / Service Page" in the master CSV.

**This plan covers:**

1. Identifying and moving misplaced files to correct folders
2. Creating new folders for content types that don't have one yet
3. Updating the master CSV index
4. Converting each content type with dedicated scripts
5. Creating Next.js routes for each type

---

## 2. File Audit — What's Actually in Industry-Service-Page/

### Filename Pattern Analysis

All files follow the pattern: `ClickMasters_P{number}_{content}.docx`

By analyzing the content portion, we identified **7 distinct file types**:

| # | File Type                       | Naming Pattern                                                                  | Count | Destination              | Examples                                                                                         |
| - | ------------------------------- | ------------------------------------------------------------------------------- | ----- | ------------------------ | ------------------------------------------------------------------------------------------------ |
| 1 | **True Industry+Service** | `{industry}_{service}` (no glossary/howto/tech/cost/city suffix)              | 215   | Industry-Service-Page/   | `fintech_legacy-modernisation`, `healthtech_qa-testing`, `insurtech_saas-development`      |
| 2 | **Glossary**              | `glossary_{term}_definition`                                                  | 200   | Glossary/                | `glossary_ir35_definition`, `glossary_react-definition`, `glossary_oauth-definition`       |
| 3 | **How-To**                | `howto_how_to_{action}_uk`                                                    | 7     | Resource-Guide/ (merged) | `howto_how_to_build_fintech_app_uk`, `howto_how_to_build_nhs_app_uk`                         |
| 4 | **Tech Pages**            | `tech_{technology}_development`                                               | 11    | Hire-Page/ (merged)      | `tech_react_development`, `tech_aws_development`, `tech_python_development`                |
| 5 | **Cost Pages**            | `cost_cost_{topic}_uk`                                                        | 4     | Resource-Guide/ (merged) | `cost_cost_ecommerce_development_uk`, `cost_cost_ai_development_uk`                          |
| 6 | **Resource/Guide**        | `*_guide_*`, `*_compliance_guide_*`, `ir35_*`, `*_smart_grants_guide_*` | 9     | Resource-Guide/          | `IR35_Software_Business_Guide`, `Cyber_Essentials_Software_UK`, `DTAC_Compliance_Guide_UK` |
| 7 | **City-Specific**         | `*{service}_{city}` where city is a known city name                           | 127   | International-City/      | `saas_development_london`, `fintech_glasgow`, `custom-software-development_dublin`         |

### Industries Represented (True Industry+Service Files)

| Industry   | Example Services                                                                                                                                                                                                                                                          |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fintech    | software-development, custom-software-development, saas-development, mvp-development, api-development, devops-cicd, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, microservices-architecture, software-consulting, software-maintenance |
| healthtech | custom-software-development, saas-development, mvp-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, devops-cicd, microservices-architecture                                                                                   |
| govtech    | software-development, api-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, saas-development, microservices-architecture                                                                                                       |
| ecommerce  | software-development, custom-software-development, saas-development, microservices-architecture, api-development, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, mobile-app-development                                                  |
| proptech   | software-development, saas-development, api-development, devops-cicd, staff-augmentation, cloud-native-development                                                                                                                                                        |
| insurtech  | custom-software-development, saas-development, api-development, devops-cicd, qa-testing, legacy-modernisation, cloud-native-development, microservices-architecture                                                                                                       |
| logtech    | software-development, custom-software-development, saas-development, staff-augmentation, qa-testing, legacy-modernisation, cloud-native-development, api-development                                                                                                      |
| retailtech | software-development, saas-development, staff-augmentation, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture, ai-development                                                                                                        |
| edtech     | software-development, saas-development, legacy-modernisation, cloud-native-development, qa-testing, staff-augmentation, api-development, microservices-architecture                                                                                                       |
| medtech    | saas-development, microservices-architecture, legacy-modernisation, cloud-native-development, api-development, devops-cicd                                                                                                                                                |
| cleantech  | api-development, saas-development, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture                                                                                                                                                 |
| legaltech  | software-development, custom-software-development, saas-development, cloud-native-development, staff-augmentation                                                                                                                                                         |
| agritech   | api-development                                                                                                                                                                                                                                                           |
| insurance  | api-development, legacy-modernisation                                                                                                                                                                                                                                     |
| saas       | devops-cicd, legacy-modernisation                                                                                                                                                                                                                                         |
| ai         | devops-cicd, staff-augmentation, cloud-native-development, software-development                                                                                                                                                                                           |

---

## 3. Current State

- **573 DOCX files** in `Clickmasterssoftwaredevelopmentcompany.co.uk/Industry-Service-Page/`
- No conversion script exists yet
- No data file exists yet
- The existing route `app/(landing)/[category]/[service]/page.js` already exists and reads from `data/sub-services.js` — this is a **different data layer** (manually created, not from DOCX conversion)
- The new conversion will create `data/industry-services.js` as the data source

---

## 4. Execution Plan

### Phase 1: Create New Folders & Move Files ✅

**Status:** COMPLETED — All files moved. How-To + Cost merged into Resource-Guide. Tech merged into Hire-Page.

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── Glossary/          NEW — 200 glossary definition files
├── Resource-Guide/    92+9+7+4 = 103 files (merged: original + resource/guides + how-to + cost)
├── Hire-Page/         300+11 = 311 files (merged: original + tech pages)
├── International-City/ 179+127 = 306 files (merged: original + city files)
├── Industry-Service-Page/ 215 true industry+service files (remaining)
├── Case-Study/        280 (unchanged)
├── Comparison-Page/   177 (unchanged)
└── Salary-Guide/      193 (unchanged)
```

### Phase 2: Move Misplaced Files ✅

**Status:** COMPLETED — All 358 files moved.

#### Summary of Moves

| Type                                   | Count         | From → To                                         |
| -------------------------------------- | ------------- | -------------------------------------------------- |
| Glossary                               | 200           | Industry-Service-Page/ → Glossary/                |
| Resource/Guide                         | 9             | Industry-Service-Page/ → Resource-Guide/          |
| How-To                                 | 7             | Industry-Service-Page/ → Resource-Guide/ (merged) |
| Cost                                   | 4             | Industry-Service-Page/ → Resource-Guide/ (merged) |
| Tech                                   | 11            | Industry-Service-Page/ → Hire-Page/ (merged)      |
| City-Specific                          | 127           | Industry-Service-Page/ → International-City/      |
| **Total Moved**                  | **358** |                                                    |
| **Remaining (Industry+Service)** | **215** | Stays in Industry-Service-Page/                    |

#### 2a. Glossary Files → `Glossary/` (200 files) ✅

**Pattern:** Filename starts with `glossary_` after the P-number prefix.

#### 2b. How-To Files → `Resource-Guide/` (7 files, merged) ✅

**Pattern:** Filename starts with `howto_` after the P-number prefix.
**P-numbers:** P221, P222, P223, P255, P256, P284, P285

#### 2c. Tech Files → `Hire-Page/` (11 files, merged) ✅

**Pattern:** Filename starts with `tech_` after the P-number prefix.
**P-numbers:** P224, P225, P226, P251, P252, P253, P254, P280, P281, P282, P283

#### 2d. Cost Files → `Resource-Guide/` (4 files, merged) ✅

**Pattern:** Filename contains `cost_` (P4 is `custom_software_cost_uk`).
**P-numbers:** P4, P164, P165, P166

#### 2e. Resource/Guide Files → `Resource-Guide/` (9 files) ✅

**Pattern:** Filename contains `guide`, `compliance`, `ir35`, `dtac`, `cyber_essentials`, `smart_grants`.
**P-numbers:** P18, P19, P20, P22, P23, P24, P25, P104, P201

#### 2f. City-Specific Files → `International-City/` (127 files) ✅

**Pattern:** Filename ends with a known city name (last segment after `_`).
**P-numbers:** 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 42, 44, 45, 46, 48, 49, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 191, 192, 193, 194, 311, 312, 314, 315, 317, 318, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 357, 358, 359, 360, 361, 362, 364, 365, 367, 368, 370, 371, 373, 374, 375, 376, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 441, 442, 443, 444, 445, 446, 447, 472, 473, 474, 475, 476, 477, 489, 490, 491, 492, 493, 496, 497, 505, 506, 507, 508, 509, 510, 511, 512, 521, 522, 523, 524, 525, 526, 539, 540, 566, 567, 580, 581, 593, 594, 604

#### 2g. Remaining Files → Stay in `Industry-Service-Page/` (215 files) ✅

True industry+service pages remain. These stay in place.

### Phase 3: Update Master CSV ✅

No CSV file found in project root. Skipped.

**Correct categories (post-Phase 1):**

| Original Category       | New Category            |      Count |
| ----------------------- | ----------------------- | ---------: |
| Industry / Service Page | Glossary                |        200 |
| Industry / Service Page | Resource Guide          | 9+7+4 = 20 |
| Industry / Service Page | Hire Page               |         11 |
| Industry / Service Page | International City      |        127 |
| Industry / Service Page | Industry / Service Page |        215 |

### Phase 4: Create Conversion Scripts

Create 2 new conversion scripts (Glossary + Industry-Service). How-To, Cost, Tech already merged into existing categories and will be processed by their respective existing scripts.

#### 4a. `scripts/convert-glossary.js` → `data/glossary.js`

**Source:** `Glossary/` folder (200 files)
**Route:** `/glossary/` (listing) + `/glossary/[term]/` (detail)

**Filename pattern:** `ClickMasters_P{number}_glossary_{term}_definition.docx`

**Expected DOCX structure (to verify with sample):**

- META TITLE / META DESC / SLUG table
- Last updated / Reading time header
- H1: term name
- Definition content (paragraphs)
- Related terms
- FAQs (possibly)

**Data fields to extract:**

| Field            | Type       | Source                                                           |
| ---------------- | ---------- | ---------------------------------------------------------------- |
| `id`           | `string` | P-number from filename                                           |
| `slug`         | `string` | SLUG meta or derived from term                                   |
| `term`         | `string` | Parsed from filename (between `glossary_` and `_definition`) |
| `title`        | `string` | H1 heading                                                       |
| `metaTitle`    | `string` | META TITLE                                                       |
| `metaDesc`     | `string` | META DESC                                                        |
| `lastUpdated`  | `string` | Header table                                                     |
| `readingTime`  | `number` | Header table                                                     |
| `writtenBy`    | `string` | Header table                                                     |
| `reviewedBy`   | `string` | Header table                                                     |
| `content`      | `array`  | Section content (paragraphs, tables)                             |
| `faqs`         | `array`  | Q&A pairs                                                        |
| `relatedPages` | `array`  | Related page links                                               |
| `cta`          | `string` | CTA table                                                        |
| `author`       | `string` | Author box                                                       |

**Exports:**

- `glossaryTerms` — full array of all glossary entries
- `glossaryListings` — lightweight array (id, slug, term, metaDesc) for listing page
- `getGlossaryTermBySlug(slug)` — lookup function
- `getRelatedTerms(slug, limit)` — related terms

#### 4b. `scripts/convert-industry-services.js` → `data/industry-services.js`

**Source:** `Industry-Service-Page/` folder (215 files, after cleanup)
**Route:** `/[category]/[service]/` (already exists in `app/(landing)/[category]/[service]/page.js`)

**Filename pattern:** `ClickMasters_P{number}_{industry}_{service}.docx`

**Expected DOCX structure (to verify with sample):**

- META TITLE / META DESC / SLUG table
- Last updated / Reading time header
- H1: service name for industry
- Badges table (industry, location, compliance, etc.)
- Content sections with headings, paragraphs, tables
- FAQs
- Related pages
- CTA
- Author box

**Data fields to extract:**

| Field            | Type       | Source                                                   |
| ---------------- | ---------- | -------------------------------------------------------- |
| `id`           | `string` | P-number from filename                                   |
| `slug`         | `string` | SLUG meta or derived from filename                       |
| `industry`     | `string` | Parsed from filename (first segment)                     |
| `service`      | `string` | Parsed from filename (second segment)                    |
| `category`     | `string` | Industry slug for URL (e.g.,`fintech`, `healthtech`) |
| `title`        | `string` | H1 heading                                               |
| `metaTitle`    | `string` | META TITLE                                               |
| `metaDesc`     | `string` | META DESC                                                |
| `lastUpdated`  | `string` | Header table                                             |
| `readingTime`  | `number` | Header table                                             |
| `writtenBy`    | `string` | Header table                                             |
| `reviewedBy`   | `string` | Header table                                             |
| `badges`       | `array`  | Badges table                                             |
| `content`      | `array`  | Content sections (heading, paragraphs, tables)           |
| `faqs`         | `array`  | Q&A pairs                                                |
| `relatedPages` | `array`  | Related page links                                       |
| `cta`          | `string` | CTA table                                                |
| `author`       | `string` | Author box                                               |

**Exports:**

- `industryServices` — full array
- `industryServiceListings` — lightweight array for listing pages
- `getIndustryServiceBySlug(slug)` — lookup function
- `getIndustryServiceByCategory(category)` — filter by industry
- `getRelatedServices(slug, limit)` — related services

**Note:** Resource-Guide (103 files) and Hire-Page (311 files) will be re-processed by their existing scripts (`convert-resource-guides.js`, `convert-hire-pages.js`) to include the newly added files.

### Phase 5: Create Next.js Routes

#### 5a. Glossary Routes

```
app/(landing)/
├── glossary/
│   ├── page.js                    # Listing page (A-Z grid of all terms)
│   └── [term]/
│       ├── page.js                # Detail page (SSG + generateStaticParams)
│       └── detail-client.jsx      # Client component (full UI)
```

**URL Examples:**

- `/glossary` — listing page with A-Z filter
- `/glossary/ir35-definition` — IR35 definition page
- `/glossary/react-definition` — React definition page

#### 5b. Industry+Service Routes (Update Existing)

The route `app/(landing)/[category]/[service]/page.js` already exists. It currently reads from `data/sub-services.js`. After conversion, update it to read from `data/industry-services.js` instead.

**URL Examples:**

- `/fintech/legacy-modernisation` — FinTech legacy modernisation
- `/healthtech/qa-testing` — HealthTech QA testing
- `/ecommerce/saas-development` — eCommerce SaaS development

---

## 5. Technical Details

### Libraries (Already Installed)

- `mammoth` — DOCX to HTML conversion ✅

### File Locations After Cleanup

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── Industry-Service-Page/         215 .docx files (true industry+service)
├── Glossary/                      200 .docx files (NEW)
├── Resource-Guide/                103 .docx files (92 original + 9 resource-guides + 7 how-to + 4 cost, merged)
├── International-City/            306 .docx files (179 original + 127 city files)
├── Hire-Page/                     311 .docx files (300 original + 11 tech pages, merged)
├── Case-Study/                    280 (unchanged)
├── Comparison-Page/               177 (unchanged)
└── Salary-Guide/                  193 (unchanged)
```

### Data Files to Generate

| Data File                     | Source Script                                   | Entries |
| ----------------------------- | ----------------------------------------------- | ------- |
| `data/glossary.js`          | `scripts/convert-glossary.js`                 | 200     |
| `data/industry-services.js` | `scripts/convert-industry-services.js`        | 215     |
| `data/resource-guides.js`   | `scripts/convert-resource-guides.js` (re-run) | 103     |
| `data/hire-pages.js`        | `scripts/convert-hire-pages.js` (re-run)      | 311     |

### Build Strategy

- Static Site Generation (SSG) with `generateStaticParams()`
- All pages pre-rendered at build time
- Listing pages use lightweight data arrays (no heavy text fields)
- Detail pages use lookup functions for full content

---

## 6. Styling Conventions (from ClickMasters Rule Guide)

- **Typography:** Headings in `Sora` (Bold 700 / SemiBold 600), Body in `DM Sans` (Regular 400 / Medium 500)
- **Colors:** Dark navy/deep background elements (`primary` / `primary-mid`), highlights/buttons in teal (`accent` -> `accent-hover`)
- **Components:**
  - Section Labels: pill badges with 1px border
  - Cards & Tables: 1px borders, rounded corners (12px for cards, 8px for buttons), shadows with hover lifts (+4px transition)
  - FAQ Accordion: Dark navy pills, smooth height transition
  - Glossary Listing: A-Z filter bar, card grid layout

---

## 7. Step-by-Step Actions

### Phase 1: Folder Setup & File Moves ✅

- [X] **Step 1:** Create `Glossary/` folder
- [X] **Step 2:** Move 200 glossary files to `Glossary/`
- [X] **Step 3:** Move 9 resource/guide files to `Resource-Guide/`
- [X] **Step 4:** Move 7 how-to files to `Resource-Guide/` (merged)
- [X] **Step 5:** Move 4 cost files to `Resource-Guide/` (merged)
- [X] **Step 6:** Move 11 tech files to `Hire-Page/` (merged)
- [X] **Step 7:** Move 127 city-specific files to `International-City/`
- [X] **Step 8:** CSV update (no CSV found, skipped)

### Phase 2: Glossary Conversion

- [ ] **Step 9:** Analyze 2-3 sample glossary DOCX files to confirm structure
- [ ] **Step 10:** Create `scripts/convert-glossary.js`
- [ ] **Step 11:** Run script on all 200 files → generate `data/glossary.js`
- [ ] **Step 12:** Verify output — check for parsing errors, empty fields
- [ ] **Step 13:** Create `/glossary/` listing page
- [ ] **Step 14:** Create `/glossary/[term]/` detail page

### Phase 3: Industry+Service Conversion

- [ ] **Step 15:** Analyze 2-3 sample industry+service DOCX files
- [ ] **Step 16:** Create `scripts/convert-industry-services.js`
- [ ] **Step 17:** Run script on 215 files → generate `data/industry-services.js`
- [ ] **Step 18:** Update existing `app/(landing)/[category]/[service]/page.js` to use new data file
- [ ] **Step 19:** Create industry listing pages (e.g., `/fintech/`, `/healthtech/`)

### Phase 4: Re-process Merged Categories

- [ ] **Step 20:** Re-run `scripts/convert-resource-guides.js` on 103 files (includes new how-to + cost files)
- [ ] **Step 21:** Re-run `scripts/convert-hire-pages.js` on 311 files (includes new tech files)
- [ ] **Step 22:** Re-run `scripts/convert-cities.js` on 306 files (includes new city files)

### Phase 5: Verification

- [ ] **Step 23:** Run production build — verify all pages pre-render
- [ ] **Step 24:** Spot-check 5+ pages per type for content accuracy
- [ ] **Step 25:** Update `plan.md` with completion status

---

## 8. Success Metrics

| Metric | Target | Actual |
|--------|-------:|-------:|
| Files moved to correct folders | ~293 | 358 ✅ |
| Industry-Service-Page remaining | ~215 | 215 ✅ |
| Glossary entries converted | 200 | |
| Resource-Guide entries (merged) | 103 | |
| Hire-Page entries (merged) | 311 | |
| International-City entries (merged) | 306 | |
| Industry+Service entries converted | 215 | |
| Total categories | 9 | 9 ✅ |
| Parsing errors | 0 | |
| Empty required fields | 0 | |

---

## 9. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Glossary URL structure | `/glossary/` + `/glossary/[term]/` | Clean, readable; follows established pattern |
| How-To files → | Merged into `Resource-Guide/` | Same template as resource guides; avoids extra category |
| Cost files → | Merged into `Resource-Guide/` | Same template as resource guides; avoids extra category |
| Tech files → | Merged into `Hire-Page/` | All are `tech_{technology}_development` (developer hire pages) |
| Industry+Service URL | `/[category]/[service]/` | Already exists; update data source |
| City files destination | `International-City/` | They are city-specific pages |
| Guide files destination | `Resource-Guide/` | Same DOCX template as existing resource guides |
| Duplicate handling | Lowest P-number | Same strategy as all prior phases |
| Execution order | Cleanup first, then convert sequentially | Ensures clean separation before conversion |

---

## 10. Risks & Mitigations

| Risk                                                 | Severity | Mitigation                                                        |
| ---------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| DOCX structure varies by type                        | Medium   | Analyze 2-3 samples before writing each script                    |
| Glossary files may have different template           | Medium   | Check if glossary uses same META/HEADER/FAQ tables as other types |
| City files may not match International-City template | Medium   | May need separate handling or a subtype field                     |
| Resource guide files may duplicate existing slugs    | Low      | Check for slug conflicts before merging                           |
| Large file count (~280 industry+service)             | Low      | Script handles bulk processing; dedup by slug                     |

---

## 11. Next Categories After This

All 7 original categories will be complete after this phase. Remaining work:

- Update `plan.md` with final completion status
- Address any remaining performance items (see agent.md §11)
- Fix pre-existing Radix UI prerender error on hire detail pages

---

**End of Plan**
