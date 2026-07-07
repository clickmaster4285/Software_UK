# agent.md — ClickMasters Content Migration

> Main reference file. See `plan-industries-pages.md` for industries execution details.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| Project | ClickMasters Software Development Company |
| URL | https://clickmasterssoftwaredevelopmentcompany.co.uk |
| Type | B2B Next.js website |
| Content | 1,785 Word documents (.docx) |
| Approach | Data files (not MongoDB) — follow fellow's pattern |

---

## 2. Content Inventory

| Category | Count | Folder | Status |
|----------|------:|--------|--------|
| Industry / Service Page | 215 | `Industries/` (202) + `Service/` (11) + `Resource-Guide/` (2) | ✅ Complete (148 unique industry pages) |
| Hire Page | 311 | `Hire-Page/` | ✅ (269 unique, +11 tech merged, re-processed) |
| Case Study | 280 | `Case-Study/` | ✅ (274 unique) |
| Salary Guide | 193 | `Salary-Guide/` | ✅ (99 unique) |
| International City | 306 | `International-City/` | ✅ (203 unique, +127 city merged, re-processed) |
| Comparison Page | 177 | `Comparison-Page/` | ✅ (141 unique) |
| Resource Guide | 103 | `Resource-Guide/` | ✅ (80 unique, +9 resource + 7 how-to + 4 cost merged, re-processed) |
| Glossary | 200 | `Glossary/` | ✅ (200 unique, build verified) |
| **Total** | **1,785** | 9 folders | **All complete** |

### Duplicate Slugs

- Total CSV rows: 1,785
- Unique slugs: 1,429
- Duplicate rows: 356 (25%)

**Strategy:** Use lowest `P_Number` as canonical.

---

## 3. Folder Structure

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── agent.md                    ← main reference
├── plan.md                     ← execution plan
├── ClickMasters_Master_Index.csv
├── Case-Study/           (280 .docx) ✅
├── Comparison-Page/      (177 .docx) ✅
├── Hire-Page/           (311 .docx) ✅ (300 original + 11 tech)
├── Industries/          (202 .docx) ✅ converted
├── Service/             (11 .docx)  🔲 standalone service pages (not yet converted)
├── International-City/  (306 .docx) ✅ (179 original + 127 city)
├── Resource-Guide/      (105 .docx) ✅ (103 original + 2 from Industry-Service-Page)
├── Salary-Guide/        (193 .docx) ✅
├── Glossary/            (200 .docx) ✅
├── data/
│   ├── case-studies.js       ✅ (274 unique)
│   ├── hire-pages.js        ✅ (269 unique, re-processed)
│   ├── salary-guides.js     ✅ (99 unique)
│   ├── comparisons.js       ✅ (141 unique)
│   ├── cities.js            ✅ (203 unique, re-processed)
│   ├── resource-guides.js   ✅ (80 unique, re-processed)
│   ├── glossary.js          ✅ (200 unique, build verified)
│   └── industries.js        ✅ (148 unique, build verified)
```

---

## 3A. Industry-Service-Page File Audit & Cleanup (Completed June 19, 2026)

The `Industry-Service-Page/` folder initially contained **573 DOCX files**. Analysis identified **7 distinct file types**:

| # | File Type | Naming Pattern | Count | Destination |
|---|-----------|---------------|-------|-------------|
| 1 | **True Industry+Service** | `{industry}_{service}` | 215 | Stays in `Industry-Service-Page/` |
| 2 | **Glossary** | `glossary_{term}_definition` | 200 | `Glossary/` (new folder) |
| 3 | **How-To** | `howto_how_to_{action}_uk` | 7 | `Resource-Guide/` (merged) |
| 4 | **Tech Pages** | `tech_{technology}_development` | 11 | `Hire-Page/` (merged) |
| 5 | **Cost Pages** | `cost_cost_{topic}_uk` | 4 | `Resource-Guide/` (merged) |
| 6 | **Resource/Guide** | `*_guide_*`, `ir35_*`, etc. | 9 | `Resource-Guide/` (merged) |
| 7 | **City-Specific** | `*{service}_{city}` | 127 | `International-City/` (merged) |

**Total moved: 358 files. Remaining: 215 true industry+service files.**

### Industries Represented (202 Combo Files → 148 Unique Pages)

| Industry | Services |
|----------|----------|
| fintech | software-development, custom-software-development, saas-development, mvp-development, api-development, devops-cicd, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, microservices-architecture, software-consulting, software-maintenance |
| healthtech | custom-software-development, saas-development, mvp-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, devops-cicd, microservices-architecture |
| govtech | software-development, api-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, saas-development, microservices-architecture |
| ecommerce | software-development, custom-software-development, saas-development, microservices-architecture, api-development, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, mobile-app-development |
| proptech | software-development, saas-development, api-development, devops-cicd, staff-augmentation, cloud-native-development |
| insurtech | custom-software-development, saas-development, api-development, devops-cicd, qa-testing, legacy-modernisation, cloud-native-development, microservices-architecture |
| logtech | software-development, custom-software-development, saas-development, staff-augmentation, qa-testing, legacy-modernisation, cloud-native-development, api-development |
| retailtech | software-development, saas-development, staff-augmentation, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture, ai-development |
| edtech | software-development, saas-development, legacy-modernisation, cloud-native-development, qa-testing, staff-augmentation, api-development, microservices-architecture |
| medtech | saas-development, microservices-architecture, legacy-modernisation, cloud-native-development, api-development, devops-cicd |
| cleantech | api-development, saas-development, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture |
| legaltech | software-development, custom-software-development, saas-development, cloud-native-development, staff-augmentation |
| agritech | api-development |
| insurance | api-development, legacy-modernisation |
| saas | devops-cicd, legacy-modernisation |
| ai | devops-cicd, staff-augmentation, cloud-native-development, software-development |

### Standalone Service Pages (11 files in `Service/`)

| File | Slug | Title |
|------|------|-------|
| P6 | mvp-development | MVP Development UK |
| P8 | staff-augmentation | Staff Augmentation UK |
| P10 | api-development | API Development UK |
| P11 | devops-cicd | DevOps CICD UK |
| P12 | qa-testing-services | QA Testing Services UK |
| P13 | legacy-modernisation | Legacy Modernisation UK |
| P14 | software-consulting | Software Consulting UK |
| P15 | cloud-native-development | Cloud Native Development UK |
| P16 | microservices-architecture | Microservices Architecture UK |
| P17 | software-maintenance-support | Software Maintenance & Support UK |
| P21 | software-project-rescue | Software Project Rescue UK |

### Resource Guides from Industry-Service-Page (2 files → `Resource-Guide/`)

| File | Slug |
|------|------|
| P7 | rd-tax-credits-software |
| P26 | qualifying-rd-software-activities |

---

### 3B. Industry-Service-Page Reorganization (Completed June 20, 2026)

The 215 files from `Industry-Service-Page/` have been split into:

| Destination | Count | Description |
|------------|-------|-------------|
| `Industries/` | 202 | Combo pages: `{industry}_{service}` pattern |
| `Service/` | 11 | Standalone service pages (P6, P8, P10-P17, P21) |
| `Resource-Guide/` | 2 | R&D tax/qualifying activities (P7, P26) |
| **Total** | **215** | **0 files remaining in Industry-Service-Page/** |

---

### 3C. Industries Conversion & Pages (Completed June 20, 2026)

**Data:** `data/industries.js` — 148 unique entries from 202 DOCX files, build verified.

**Routes created:**

| Route | File | Description |
|-------|------|-------------|
| `/industries` | `app/(landing)/industries/page.js` | Premium editorial listing page — asymmetric hero with dot-pattern texture, featured industry bento grid (6 cards), full directory with category icons, compliance strip, dark CTA band |
| `/industries/[slug]` | `app/(landing)/industries/[slug]/page.js` | Industry+service detail page — compact editorial hero with breadcrumb/meta bar/right-side info cards, sticky horizontal TOC, bold-led sections, compliance grid, pricing, testimonials, case study, FAQ, related industries, dark CTA |

**Components created:**

| Component | File | Description |
|-----------|------|-------------|
| `IndustrySections` | `components/landing/industries/IndustrySections.jsx` | Renders `{bold, text}` paragraph pairs with proper editorial hierarchy — accent bar, heading, bold sub-heading above body text. Uses `slugify` from `data/sub-services` for section IDs. |

**Components reused from sub-services:**

| Component | Usage |
|-----------|-------|
| `FAQSection` | FAQ accordion |
| `PricingSection` | Pricing cards (field-mapped: `price`→`investment`, `scope`→`bestFor`) |
| `TestimonialsSection` | Client testimonials |
| `CaseStudySection` | Dynamic import, success stories |

**Key design decisions:**
- Detail page is NOT a copy of sub-service page — uses custom compact hero, custom `IndustrySections` instead of `DynamicSections`, no `ServiceHero`/`ServicesSection`/`WhyChooseUs`/`EngineeringBaseline`/`ProcessSection`/`TechStack`/`CeoVision`/`ClientScrollWheel`
- Listing page uses inline per-industry SVG icons, glassmorphism card stack, gradient blobs, dot patterns
- Bold-led paragraph structure preserved via `IndustrySections` (unlike `DynamicSections` which flattened it)

---

## 4. Case Study Docx Structure

Each case study has this HTML pattern:

```html
<table>
  META TITLE: ...
  META DESC: ...
  SLUG: /case-studies/proptech-build-to-rent-portfolio-management/
</table>

<p>Last updated: August 2025 | Reading time: 6 min | Written by: ... | Reviewed by: ...</p>

<h1>Title</h1>

<table>Sector | Country | Status | Contract</table>
<table>Tech Stack | Compliance</table>

<p><strong>The Challenge</strong></p>
<p>...</p>

<p><strong>Our Approach</strong></p>
<p>...</p>

<p><strong>The Result</strong></p>
<p>...</p>

<blockquote>Client quote</blockquote>

<table>Technologies | Compliance | Contract | IP</table>
```

### Extracted Fields

| Field | Source |
|-------|--------|
| `slug` | SLUG meta |
| `title` | H1 heading |
| `metaTitle` | META TITLE |
| `metaDesc` | META DESC |
| `sector` | Badge table |
| `country` | Badge table |
| `status` | Badge table |
| `contract` | Badge table |
| `techStack` | Tech table |
| `compliance` | Compliance table |
| `challenge` | "The Challenge" section |
| `approach` | "Our Approach" section |
| `results` | "The Result" section |
| `clientQuote` | Blockquote |

---

## 5. Current Route

**File:** `app/(landing)/case-studies/[id]/page.js`

**Recommended Change:** Use `[slug]` instead of `[id]` for better SEO.

---

## 6. Technical Stack

- **Frontend:** Next.js 16.2.4, React 19, Tailwind 4 (OKLCH)
- **Parsing:** `mammoth` (docx → HTML)
- **Build:** SSG with `generateStaticParams`
- **Storage:** Data files (`data/*.js`)

---

## 7. Execution Order

### Phase 1: Case Studies (Priority) ✅
1. Write `scripts/convert-case-studies.js`
2. Generate `data/case-studies.js` (274 unique)
3. Update route: `[id]` → `[slug]`

### Phase 2: Other Categories
1. Hire Page (311) → `data/hire-pages.js` (258 unique) → `/hire/[role]/[city]/` ✅
2. Salary Guide (193) → `data/salary-guides.js` (99 unique) → `/salary-guide/[slug]/` ✅
3. Comparison Page (177) → `data/comparisons.js` (141 unique) → `/comparison/[slug]/` ✅
4. International City (306) → `data/cities.js` (98 unique) → `/cities/[slug]/` ✅
5. Resource Guide (103) → `data/resource-guides.js` (63 unique) → `/resource/[slug]/` ✅
6. Glossary (200) → `data/glossary.js` (200 unique) → `/glossary/[term]/` ✅
7. Industry / Service (215) → `data/industries.js` (148 unique) → `/industries/[slug]/` ✅

---

## 8. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Storage | Data files | Simpler, follows proven pattern |
| Admin panel | No | Data files sufficient |
| Route param | `[slug]` | Better SEO |
| Build | SSG | Fastest, static CDN |
| Glossary URL structure | `/glossary/` + `/glossary/[term]/` | Clean, readable; follows established pattern |
| How-To files → | Merged into `Resource-Guide/` | Same template as resource guides; avoids extra category |
| Cost files → | Merged into `Resource-Guide/` | Same template as resource guides; avoids extra category |
| Tech files → | Merged into `Hire-Page/` | All are `tech_{technology}_development` (developer hire pages) |
| City files → | Merged into `International-City/` | They are city-specific pages |
| Guide files → | Merged into `Resource-Guide/` | Same DOCX template as existing resource guides |
| Industry+Service URL | `/industries/[slug]` | Dedicated route, not `/[category]/[service]/` |
| Duplicate handling | Lowest P-number | Same strategy as all prior phases |
| Execution order | Cleanup first, then convert sequentially | Ensures clean separation before conversion |

---

## 9. Dependencies

```bash
npm install mammoth
```

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Static pages | 1,975+ |
| Build time | 30-60s |
| Page load | <2s |

---

## 11. Performance Audit & Fixes

### 11.1 Lighthouse Baseline (June 2026)

| Metric | Value | Status |
|--------|-------|--------|
| Performance Score | 43 / 100 | 🔴 Critical |
| Accessibility | 100 / 100 | ✅ |
| Best Practices | 100 / 100 | ✅ |
| SEO | 43 / 100 | 🔴 |
| FCP | 0.7s | ✅ |
| LCP | 3.1s | ⚠️ |
| **TBT** | **4,140ms** | 🔴 (target <200ms) |
| CLS | 0.001 | ✅ |
| SI | 6.2s | ⚠️ |

**TBT (Total Blocking Time) at 4,140ms is the #1 problem.** Main-thread work totals 21.4s; script evaluation alone is 2.9s.

---

### 11.2 Root Causes (Priority Order)

| # | Cause | Impact | Status |
|---|-------|--------|--------|
| 1 | **Data bloat** — listing pages import full data arrays just to render titles and links. Every page load parses ~20K lines of JS unnecessarily. | ~800ms+ TBT | ✅ **Fixed** |
| 2 | **Navbar API calls** — `useBlogList()` and `useTestimonialList()` fire on every page load unconditionally. | ~200ms TBT + network | ✅ **Fixed** |
| 3 | **About page** — no lazy-loading at all. Statically imports Services (81 framer-motion motion values), TechStackSection, TrustedClientsSection, FinalCTA. | ~600ms TBT | 🔲 Pending |
| 4 | **Contact page** — no lazy-loading, many framer-motion entrance animations. | ~400ms TBT | 🔲 Pending |
| 5 | **GSAP** (~40 KB) used in 4 files — can be replaced with CSS/IntersectionObserver. | ~150ms TBT + 40 KB JS | 🔲 Pending |
| 6 | **Swiper** (~45 KB) used in TestimonialsSection — replace with CSS scroll-snap. | ~100ms TBT + 45 KB JS | 🔲 Pending |
| 7 | **Lenis** (~36 KB) wraps entire app in layout.js — replace with native `scroll-behavior: smooth`. | ~100ms TBT + 36 KB JS | 🔲 Pending |
| 8 | **Homepage Hero** — infinite floating animation (`repeat: Infinity`) on every page load. | Ongoing main-thread cost | 🔲 Pending |
| 9 | **Homepage TrustedBy** — two infinite marquee loops on 48 logos. | Ongoing main-thread cost | 🔲 Pending |

---

### 11.3 Fixes Applied (June 15, 2026)

#### Fix 1: Data Layer Splitting — Case Studies

**Problem:** `case-studies.js` is 9,744 lines. Every page that imported it parsed the entire array including `challenge`, `approach`, `results`, `clientQuote` — massive text fields never needed for listing views.

**Solution:** Added lightweight helpers at the bottom of `data/case-studies.js`:

```js
export const caseStudyListings = caseStudies.map(
  ({ id, slug, title, metaDesc, sector, country, status, contract, technologies }) =>
    ({ id, slug, title, metaDesc, sector, country, status, contract, technologies })
);

export function getCaseStudyBySlug(slug) { /* ... */ }
export function getSectorsMeta() { /* ... */ }
export function getRelatedCaseStudies(slug, limit = 3) { /* ... */ }
```

**Pages updated:**
- `case-studies/page.js` — uses `caseStudyListings` + `getSectorsMeta()`
- `case-studies/[slug]/page.js` — uses `getCaseStudyBySlug()` + `getRelatedCaseStudies()`
- `components/Navbar.js` — uses `caseStudyListings` (2 items only)

**Estimated savings:** ~600-800ms TBT reduction.

#### Fix 2: Data Layer Splitting — Hire Pages

**Problem:** `hire-pages.js` is 9,467 lines. Listing page imported full array just to group by role.

**Solution:** Added lightweight helpers:

```js
export const hirePageListings = hirePages.map(
  ({ slug, role, city, cityDisplay, rate }) => ({ slug, role, city, cityDisplay, rate })
);

export function getHirePageByRoleCity(role, city) { /* ... */ }
export function getHireRolesMap() { /* ... */ }
export function getRelatedHirePages(role, city, limit = 8) { /* ... */ }
export function getDedupedFaqs(faqs) { /* deduplicates by question text */ }
```

**Pages updated:**
- `hire/page.js` — uses `getHireRolesMap()`
- `hire/[role]/[city]/page.js` — uses `getHirePageByRoleCity()`, `getRelatedHirePages()`, `getDedupedFaqs()`

**Bonus fix:** FAQs were duplicated up to 6× per page. `getDedupedFaqs()` deduplicates by question text.

**Estimated savings:** ~400-600ms TBT reduction.

#### Fix 3: Navbar Lazy-Loading

**Problem:** `useBlogList()` and `useTestimonialList()` fired unconditionally on every page load.

**Solution:** Created `components/ResourcesMegaMenu.jsx`, lazy-loaded via `React.lazy()`. Component (and API calls) only mount when Resources menu is first opened.

```js
const ResourcesMegaMenu = lazy(() => import("./ResourcesMegaMenu"));
```

**Estimated savings:** ~200ms TBT + eliminates 2 unnecessary API calls per page load.

#### Fix 4: Navbar Trailing Slash Mismatch

**Problem:** `forceWhiteBgRoutes = ["/case-studies/"]` used trailing slash, but `usePathname()` returns paths without trailing slashes.

**Solution:**
```js
return forceWhiteBgRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
```

Also added `/hire` to the routes array.

---

### 11.4 Remaining Work (Priority Order)

| # | Task | Est. TBT Savings | Effort |
|---|------|-----------------|--------|
| 1 | **Lazy-load About page** — dynamic imports for Services, TechStackSection, TrustedClientsSection, FinalCTA | ~600ms | Medium |
| 2 | **Lazy-load Contact page** — dynamic imports for form/map/animation sections | ~400ms | Medium |
| 3 | **Remove GSAP** — replace 4 files with CSS/IntersectionObserver | ~150ms + 40 KB | Medium |
| 4 | **Remove Swiper** — replace with CSS scroll-snap in TestimonialsSection | ~100ms + 45 KB | Low |
| 5 | **Remove Lenis** — replace with `scroll-behavior: smooth` in CSS | ~100ms + 36 KB | Medium |
| 6 | **Replace infinite animations with CSS** — Hero floating, TrustedBy marquee | Ongoing savings | Medium |

**Total potential savings from remaining work:** ~1,350ms TBT + ~121 KB JS reduction.

---

### 11.5 Animation Architecture Constraints

**framer-motion** (30+ files) — cannot be removed or use `optimizePackageImports` (shared internal state). Strategy: `dynamic()` imports for below-fold components, CSS `@keyframes` replacement for infinite loops.

**GSAP** (4 files) — CAN be fully removed:
- `ProcessPage.jsx` → CSS + IntersectionObserver
- `CommunitySection.jsx` → already has framer-motion, GSAP is redundant
- `help-section.jsx` → CSS transitions
- `service-hero.jsx` → IntersectionObserver

**Swiper** (1 file) — replace with CSS scroll-snap carousel.

**Lenis** (layout wrapper) — replace with native `scroll-behavior: smooth`.

**Lucide-react** — `optimizePackageImports` already configured in `next.config.mjs`. Keep it.

---

### 11.6 Lazy-Loading Patterns (Established Conventions)

**Default export:**
```js
const Component = dynamic(() => import('@/path/to/Component'), { ssr: true });
```

**Named export:**
```js
const Component = dynamic(() =>
  import('@/path/to/Component').then(mod => {
    const C = mod.ComponentName;
    const W = (p) => <C {...p} />;
    W.displayName = 'ComponentName';
    return W;
  }), { ssr: true }
);
```

**Key rule:** `dynamic()` with `ssr: true` SSRs into initial HTML but splits the chunk. It does NOT defer main-thread parse time if the component renders unconditionally. For true main-thread savings, combine with CSS animation replacements or conditional rendering gates.

**Pages already properly lazy-loaded:** Homepage (13 sections), Main Service pages (12 sections), Sub Service pages (6 sections).

---

## 12. Next Actions

### Completed
1. ✅ Create `plan.md`
2. ✅ Write & run `scripts/convert-case-studies.js` → `data/case-studies.js` (274 unique)
3. ✅ Convert hire pages → `data/hire-pages.js` (269 unique, re-processed with merged tech pages)
4. ✅ Update case study route to `[slug]`
5. ✅ Build hire listing + detail pages
6. ✅ Add lightweight data helpers (`caseStudyListings`, `getHireRolesMap`, etc.)
7. ✅ Navbar lazy-loading + trailing slash fix + FAQ dedup
8. ✅ Salary Guide (193 → 99 unique) — `/salary-guide/[slug]` live
9. ✅ Comparison Pages (177 → 141 unique) — `/comparison/[slug]` live
10. ✅ International City (306 → 203 unique, re-processed with 127 merged city files) — `/cities/[slug]` live
11. ✅ Resource Guide re-processed (103 → 80 unique, with 9 resource + 7 how-to + 4 cost merged)
12. ✅ File audit & cleanup — 358 misplaced files moved to correct folders
13. ✅ Glossary data file generated — `data/glossary.js` (200 terms)
14. ✅ Glossary routes created — listing page + detail page + filter client
15. ✅ Industries conversion — `data/industries.js` (148 unique from 202 files)
16. ✅ Industries listing page — `/industries` with premium editorial design
17. ✅ Industries detail page — `/industries/[slug]` with custom layout
18. ✅ `IndustrySections` component — bold-led paragraph renderer
19. ✅ Build verified — industries pages compile and resolve

### In Progress
20. 🔲 Service conversion (11 standalone files) — create `scripts/convert-service.js` → `data/services.js`

### Pending
21. 🔲 Address remaining performance items (§11.4): About page lazy-load, Contact page lazy-load, GSAP/Swiper/Lenis removal
22. 🔲 Fix pre-existing Radix UI prerender errors (glossary/case-studies)

---

**Last Updated:** June 20, 2026
**See also:** `plan-industries-pages.md` (industries execution details)
