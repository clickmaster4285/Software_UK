# Context.md — ClickMasters Content Migration

> Single source of truth for the content import project. Numbers below are
> derived directly from `ClickMasters_Master_Index.csv` and on-disk
> `Get-ChildItem` scans (verified June 12, 2026).

---

## 1. Project Overview

| Field            | Value                                                                 |
| ---------------- | --------------------------------------------------------------------- |
| Project Name     | ClickMasters Software Development Company Website                     |
| Production URL   | https://clickmasterssoftwaredevelopmentcompany.co.uk                  |
| Project Type     | Content-heavy B2B software development website (Next.js)              |
| Working Folder   | `C:\Users\PC-24\Desktop\Software uk\Clickmasterssoftwaredevelopmentcompany.co.uk` |

## 2. The Core Problem

The website has **1,785 content pages** stored as Microsoft Word documents
(`.docx`) that need to be ingested into the Next.js site. They span 7
content categories (industry, hire, case study, salary, comparison,
resource, city) and must be normalised to existing Mongoose models,
rendered on existing routes, and indexed for search.

### 2.1 Document Categories (exact counts from CSV)

| #  | Category                   | Count | % of total |
| -- | -------------------------- | ----: | ---------: |
| 1  | Industry / Service Page    |   573 |     32.1 % |
| 2  | Hire Page                  |   300 |     16.8 % |
| 3  | Case Study                 |   280 |     15.7 % |
| 4  | Salary Guide               |   193 |     10.8 % |
| 5  | International City         |   179 |     10.0 % |
| 6  | Comparison Page            |   177 |      9.9 % |
| 7  | Resource Guide             |    83 |      4.7 % |
|    | **Total CSV rows**         | **1,785** | **100 %** |

> The previous estimate in this file ("~1700+ pages") and the per-category
> approximations have been **superseded** by the table above. Do not use
> the old numbers.

### 2.2 Slug & ID Integrity

| Metric                                | Count |
| ------------------------------------- | ----: |
| CSV rows                              | 1,785 |
| Unique `Slug` values                  | 1,429 |
| Unique `P_Number` values              | 1,785 |
| Duplicate-slug rows (appear ≥2 times) |   356 |
| Extra rows introduced by duplicates   |   356 |

Implication: **1,785 raw rows → 1,429 unique content entries** after
deduplication. The `P_Number` column is unique-by-design and is the
reliable identifier for round-tripping; the `Slug` column is **not** safe
to use as a primary key without disambiguation.

## 3. Content Location on Disk

All 1,785 `.docx` files are organized into **7 categorized folders**
(verified 2026-06-12, post-cleanup). Two redundant copies (`Website Docs/`
mirror and `part*` staging folders) were deleted to free disk space.

| #  | Folder                   | Files | % of total |
| -- | ------------------------ | ----: | ---------: |
| 1  | `Industry-Service-Page/` |   573 |     32.1 % |
| 2  | `Hire-Page/`             |   300 |     16.8 % |
| 3  | `Case-Study/`            |   280 |     15.7 % |
| 4  | `Salary-Guide/`          |   193 |     10.8 % |
| 5  | `International-City/`    |   179 |     10.0 % |
| 6  | `Comparison-Page/`       |   177 |      9.9 % |
| 7  | `Resource-Guide/`        |    83 |      4.7 % |
|    | **Total**                | **1,785** | **100 %** |

Top-level folder layout (verified 2026-06-12, post-cleanup):

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── agent.md                       ← this file
├── folder-structure.md            ← auto-generated file tree
├── ClickMasters_Master_Index.csv  ← canonical 1,785-row index
├── Industry-Service-Page/  (573 docx)
├── Hire-Page/              (300 docx)
├── Case-Study/             (280 docx)
├── Salary-Guide/           (193 docx)
├── International-City/     (179 docx)
├── Comparison-Page/        (177 docx)
└── Resource-Guide/         (83 docx)
```

Filename convention: `ClickMasters_P<Number>_<slug>.docx`. Slug uses
underscores; the row's `Slug` column uses hyphens (must be normalised at
import time).

## 4. Existing Next.js Site (downstream consumer)

Routes (current build):

- `/` — Homepage (hero, services, portfolio, testimonials, pricing)
- `app/(landing)/[category]/[service]/page.js` — Dynamic industry/service detail
- `app/(landing)/blog/[id]/page.js` — Dynamic blog/salary/comparison/resource
- `app/(landing)/case-studies/[id]/page.js` — Dynamic case study
- `app/(landing)/projects/page.js` — Portfolio gallery
- `/about`, `/contact`, `/pricing`, `/faq`, `/testimonials` — Static

Mongoose models (in `lib/models/`):

- `BlogPost.js` ← fit candidates: Salary Guide (193), Comparison Page
  (177), Resource Guide (83). Requires `renderMode` to switch layout.
- `CaseStudy.js` ← Case Study (280). 1:1 fit.
- `Project.js` ← not in scope for this CSV.
- `Category.js` ← taxonomy.
- `Testimonial.js` ← not in scope for this CSV.
- `User.js` ← admin auth.

### 4.1 Content Type → Model Mapping

| CSV Category             | Count | Target storage                             | Notes                                                                                       |
| ------------------------ | ----: | ------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Industry / Service Page  |   573 | Extend `Category` or new `Service` model   | Subcategories: custom-dev, saas, mvp, api, cloud-native, devops, qa, legacy, microservice, consulting, mobile, web-app, ai, etc. |
| Hire Page                |   300 | New `Hire` model (role × city composite)   | Pattern: `hire-{role}-in-{city}`. Roles ≈ react, nodejs, python, full-stack, devops, ai-ml, typescript, cloud, qa, mobile, ruby, php, elixir, scala, kotlin, swift, go, rust, java, dotnet, android, ios, vuejs, embedded, security, data, backend, frontend, etc. |
| Case Study               |   280 | `CaseStudy`                                 | Sectors: fintech, healthtech, govtech, proptech, insurtech, edtech, ecommerce, legaltech, cleantech, retailtech, logtech, medtech, agritech, nhs. |
| Salary Guide             |   193 | `BlogPost` with `renderMode="salary"`      | Years 2025 and 2026; UK-wide.                                                                 |
| International City       |   179 | New `City` model OR `BlogPost` w/ city-tag  | Cities include Warsaw, Copenhagen, Amsterdam, Lisbon, Stockholm, Madrid, Milan, Brussels, Berlin, Paris, Dublin, etc. + second-tier: Tallinn, Vilnius, Riga, Sofia, Bucharest, Athens, Kyiv, Tbilisi, Almaty, Yerevan, Minsk, Sarajevo, Belgrade, Skopje, Tirana, Pristina, Zagreb, Ljubljana, Bratislava, Budapest, Brno, Oslo, Helsinki, Reykjavik, Geneva, Zurich, Vienna, Tokyo, Osaka, Seoul, Singapore, Dubai, Toronto, Melbourne, Kuala Lumpur, Buenos Aires, Cape Town, Johannesburg, Lagos, Nairobi, Casablanca, Osaka, Sarajevo. |
| Comparison Page          |   177 | `BlogPost` with `renderMode="comparison"`   | X-vs-Y-vs-Z pattern; tech/cloud/payment/AI stacks.                                            |
| Resource Guide           |    83 | `BlogPost` with `renderMode="resource"`     | Compliance, procurement, R&D-tax, ISO, accessibility, devops, architecture, cost guides.      |

### 4.2 Routes to Add / Extend

| New route                                              | Maps from                            | Count |
| ------------------------------------------------------ | ------------------------------------ | ----: |
| `app/(landing)/hire/[role]/[city]/page.js`            | Hire Page                            |   300 |
| `app/(landing)/cities/[city]/page.js`                 | International City                   |   179 |
| `app/(landing)/blog/[slug]/page.js` (comparison mode) | Comparison Page                      |   177 |
| `app/(landing)/blog/[slug]/page.js` (salary mode)      | Salary Guide                         |   193 |
| `app/(landing)/blog/[slug]/page.js` (resource mode)    | Resource Guide                       |    83 |
| `app/(landing)/case-studies/[slug]/page.js`           | Case Study                           |   280 |
| `app/(landing)/[category]/[service]/page.js`          | Industry / Service Page              |   573 |

## 5. Technical Challenge

Migrating 1,785 Word documents to a production Next.js site with SEO
intact. Volume + duplicates + model-mapping mismatch make a manual import
infeasible.

### 5.1 Specific Issues

1. **Duplicate slugs (356 rows / 25 % of total)** — the same slug
   appears up to 7× (e.g. `custom-software-development-vienna` x7,
   `custom-software-development-lisbon` x7, `custom-software-development-warsaw` x6,
   `custom-software-development-stockholm` x5, `custom-software-development-krakow` x5,
   `custom-software-development-amsterdam` x3, `comparison-agile-vs-waterfall-uk` x3,
   `comparison-monolith-vs-microservices-uk` x3, `comparison-playwright-vs-cypress-vs-selenium-uk` x3,
   `comparison-stripe-vs-adyen-vs-braintree-uk` x3, `comparison-typescript-vs-javascript-uk` x3,
   `comparison-tailwind-vs-css-modules-vs-styled-components-` x3).
   Strategy: keep the lowest `P_Number`; merge the rest as revisions or
   discard as duplicates.

2. **Model coverage gap** — three CSV categories have no direct
   MongoDB model:
   - Hire Page → needs `Hire` model.
   - International City → needs `City` model (or reuse `BlogPost` with
     `category: "city"`).
   - Industry / Service Page → needs a richer `Service` model (current
     `Category` is too flat for service variants like
     `fintech-cloud-native-development` vs `healthtech-cloud-native-development`).

3. **Formatting fidelity** — `.docx` headings, tables, lists, and
   embedded images need conversion to HTML/MD via `mammoth` while
   preserving structure.

4. **SEO per page** — title, meta description, OG image, canonical URL
   must be extracted/generated per entry.

5. **Performance at scale** — 1,785 pages implies ISR, DB indexes on
   `slug`, `category`, `p_number`, and probably a sitemap generator.

## 6. Current Progress (as of June 12, 2026)

- ✅ `ClickMasters_Master_Index.csv` exists with all 1,785 entries.
- ✅ All 1,785 `.docx` files organized into 7 categorized folders
  (`Industry-Service-Page/`, `Hire-Page/`, `Case-Study/`, `Salary-Guide/`,
  `International-City/`, `Comparison-Page/`, `Resource-Guide/`).
- ✅ Redundant copies deleted (`Website Docs/`, empty `part*` folders).
- ✅ Next.js 16 + React 19 + Tailwind 4 + Mongoose stack already running
  in parent project.
- ✅ Admin panel UI shipped (Blog, Project, Testimonial, Case Study).
- ❌ No CSV-driven import script yet.
- ❌ No `Hire` or `City` models yet.
- ❌ No `Industry / Service Page` import path (current `Category` is too
  flat).
- ❌ No routing for `hire/*/*`, `cities/*`, or comparison/salary/resource
  render modes.

## 7. Project Goals

### 7.1 Primary

1. Ingest all 1,785 docs → 1,429 unique content entries in MongoDB.
2. Each entry renders cleanly on its target route with intact
   formatting.
3. Dedupe by `P_Number` (canonical) with `Slug` only as a secondary
   key.
4. New routes for Hire and International City.
5. `BlogPost` extended with `renderMode` for comparison / salary /
   resource.

### 7.2 Secondary

1. Bulk import script with resumable progress and dry-run.
2. Per-page SEO meta + JSON-LD where applicable.
3. Sitemap + robots.txt regenerated from DB.
4. Admin UI for Hire and City management.
5. Cache layer for list pages (TanStack Query stale time tuned).

## 8. Next Steps Required

### 8.1 Immediate

1. ~~**Pick one canonical copy** and delete duplicates~~ ✅ Done.
   Files organized into 7 categorized folders; `Website Docs/` and empty
   `part*` folders deleted.
2. **Normalise slugs** — convert filename underscores to hyphens,
   lowercase, strip trailing dashes.
3. **Dedup CSV** — group by `Slug`, keep row with lowest `P_Number`,
   archive the rest.
4. **Add Mongoose models**:
   - `Hire.js` (role, city, country, ukRegion, body, meta).
   - `City.js` (city, country, region, body, meta).
   - Extend `BlogPost.js` with `renderMode: 'salary' | 'comparison' | 'resource' | 'standard'`.
   - New `Service.js` (or extend `Category.js` with sub-service variants).
5. **Build `scripts/import-docx.mjs`** — stream the CSV, parse each
   docx with `mammoth`, write to MongoDB via the appropriate model.

### 8.2 Short-term

6. Test the importer on 10–20 docs across all 7 categories.
7. Add API routes (`/api/hires`, `/api/cities`,
   `/api/posts?renderMode=salary`, etc.) and TanStack Query hooks.
8. Build the four new frontend routes listed in §4.2.

### 8.3 Long-term

9. ISR + on-demand revalidation for content pages.
10. Audit trail / versioning for imported content.
11. Backup/restore script for the `content` collection set.

## 9. Stakeholders

- **Developer** — implementation owner.
- **Content Team** — `.docx` authors.
- **SEO Team** — meta data and indexing.
- **Marketing Team** — lead-gen campaigns per page.

## 10. Technologies

- **Frontend:** Next.js 16.2.4 (App Router), React 19, Tailwind 4 (OKLCH),
  Sora / DM Sans, Shadcn UI, Lucide React, GSAP, Framer Motion.
- **Backend:** Node.js, Mongoose (MongoDB).
- **Data layer:** TanStack Query + axios wrapper.
- **Import tooling:** Node CLI + `mammoth` (`docx` → HTML), `csv-parse`,
  `slugify`.

## 11. Key Files

| File                                           | Purpose                                                |
| ---------------------------------------------- | ------------------------------------------------------ |
| `ClickMasters_Master_Index.csv`                | Canonical 1,785-row index (P_Number, Category, Slug, Filename, Size). |
| `agent.md`                                     | This context file.                                     |
| `folder-structure.md`                          | Auto-generated file tree.                              |
| `Industry-Service-Page/`                       | 573 industry/service page `.docx` files.               |
| `Hire-Page/`                                   | 300 hire page `.docx` files.                           |
| `Case-Study/`                                  | 280 case study `.docx` files.                          |
| `Salary-Guide/`                                | 193 salary guide `.docx` files.                        |
| `International-City/`                          | 179 international city `.docx` files.                  |
| `Comparison-Page/`                             | 177 comparison page `.docx` files.                     |
| `Resource-Guide/`                              | 83 resource guide `.docx` files.                       |
| `lib/models/BlogPost.js`                       | Blog + Salary + Comparison + Resource storage.         |
| `lib/models/CaseStudy.js`                      | Case Study storage.                                    |
| `lib/models/Category.js`                       | Category taxonomy.                                     |
| `lib/models/Hire.js` (to add)                  | Hire Page storage.                                     |
| `lib/models/City.js` (to add)                  | International City storage.                            |
| `app/(landing)/[category]/[service]/page.js`   | Industry/Service dynamic route.                        |
| `app/(landing)/blog/[id]/page.js`              | Blog/Salary/Comparison/Resource dynamic route.         |
| `app/(landing)/case-studies/[id]/page.js`     | Case Study dynamic route.                              |
| `app/admin/...`                                | Admin CRUD UIs.                                        |
| `scripts/import-docx.mjs` (to add)             | Bulk importer.                                         |

## 12. Risk Assessment

| Risk                       | Severity | Mitigation                                                 |
| -------------------------- | -------- | ---------------------------------------------------------- |
| Data loss during import    | High     | Build importer in dry-run mode first; keep folder backup. |
| Formatting loss            | Medium   | Use `mammoth` + custom style mapping; test on samples.     |
| Duplicate slug conflicts   | Medium   | Dedup by `P_Number` (canonical); secondary key on Slug.    |
| Performance degradation    | Low      | DB indexes on `slug`, `category`, `p_number`; ISR.         |
| Incomplete content mapping | Medium   | Full mapping table in §4.1; review before import.          |

## 13. Success Metrics

- ≥ 99 % of 1,785 docs imported (≥ 1,429 unique after dedup).
- All 7 categories render on their target routes without 404/500.
- Page load < 2 s p95 for content pages.
- 100 % of imported pages emit valid SEO meta + sitemap entry.
- Admin panel exposes edit on every imported model.

---

**Last Updated:** June 12, 2026
**Status:** Planning & Setup Phase — docs organized, ready for import script.
**Next Milestone:** Build `scripts/import-docx.mjs`, add `Hire` + `City` models, run 10-doc pilot.