# agent.md — ClickMasters Content Migration

> Main reference file. See `plan.md` for detailed execution plan.

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
├── Case-Study/           (280 .docx)
├── Comparison-Page/      (177 .docx)
├── Hire-Page/           (300 .docx)
├── Industry-Service-Page/ (573 .docx)
├── International-City/  (179 .docx)
├── Resource-Guide/       (83 .docx)
├── Salary-Guide/        (193 .docx)
├── data/
│   ├── case-studies.js       ✅ (274 unique)
│   ├── hire-pages.js        ✅ (258 unique)
│   └── salary-guides.js     ✅ (99 unique)
```

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

### Phase 1: Case Studies (Priority)
1. Write `scripts/convert-case-studies.js`
2. Generate `data/case-studies.js`
3. Update route: `[id]` → `[slug]`

### Phase 2: Other Categories
1. Hire Page (300) → `data/hire-pages.js` → `/hire/[role]/[city]/` ✅
2. Salary Guide (193) → `data/salary-guides.js` → `/salary-guide/[slug]/` ✅
3. Comparison Page (177) → `data/comparisons.js` → `/comparison/[slug]/` 🔲
4. Resource Guide (83) → `data/resource-guides.js` → `/resource/[slug]/` 🔲
5. International City (179) → `data/cities.js` → `/cities/[slug]/` 🔲
6. Industry / Service (573) → `data/services.js` → `/[category]/[service]/` 🔲

---

## 8. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Storage | Data files | Simpler, follows proven pattern |
| Admin panel | No | Data files sufficient |
| Route param | `[slug]` | Better SEO |
| Build | SSG | Fastest, static CDN |

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
| 1 | **Data bloat** — listing pages import full `caseStudies` (9,744 lines) and `hirePages` (9,467 lines) arrays just to render titles and links. Every page load parses ~20K lines of JS unnecessarily. | ~800ms+ TBT | ✅ **Fixed** |
| 2 | **Navbar API calls** — `useBlogList()` and `useTestimonialList()` fire on every page load unconditionally, even though data is only needed when the Resources mega menu is opened. | ~200ms TBT + network | ✅ **Fixed** |
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

**Problem:** `case-studies.js` is 9,744 lines. Every page that imported it (listing, detail, Navbar) parsed the entire array including `challenge`, `approach`, `results`, `clientQuote` — massive text fields never needed for listing views.

**Solution:** Added lightweight helpers at the bottom of `data/case-studies.js`:

```js
// Lightweight listing data — only fields needed for cards/lists
export const caseStudyListings = caseStudies.map(
  ({ id, slug, title, metaDesc, sector, country, status, contract, technologies }) =>
    ({ id, slug, title, metaDesc, sector, country, status, contract, technologies })
);

// Lookup single study by slug (no full-array import needed)
export function getCaseStudyBySlug(slug) {
  return caseStudies.find(cs => cs.slug === slug) || null;
}

// Sectors metadata computed once, cached
export function getSectorsMeta() { /* ... */ }

// Related studies by sector
export function getRelatedCaseStudies(slug, limit = 3) { /* ... */ }
```

**Pages updated:**
- `case-studies/page.js` — now uses `caseStudyListings` + `getSectorsMeta()` (server component)
- `case-studies/[slug]/page.js` — uses `getCaseStudyBySlug()` + `getRelatedCaseStudies()`
- `components/Navbar.js` — uses `caseStudyListings` (2 items only) instead of full `caseStudies`

**Estimated savings:** ~600-800ms TBT reduction on case study pages.

#### Fix 2: Data Layer Splitting — Hire Pages

**Problem:** `hire-pages.js` is 9,467 lines. The hire listing page imported the full array just to group by role and show city names.

**Solution:** Added lightweight helpers at the bottom of `data/hire-pages.js`:

```js
export const hirePageListings = hirePages.map(
  ({ slug, role, city, cityDisplay, rate }) => ({ slug, role, city, cityDisplay, rate })
);

export function getHirePageByRoleCity(role, city) { /* ... */ }
export function getHireRolesMap() { /* groups by role, returns cities */ }
export function getRelatedHirePages(role, city, limit = 8) { /* ... */ }
export function getDedupedFaqs(faqs) { /* deduplicates by question text */ }
```

**Pages updated:**
- `hire/page.js` — uses `getHireRolesMap()` instead of importing full `hirePages`
- `hire/[role]/[city]/page.js` — uses `getHirePageByRoleCity()`, `getRelatedHirePages()`, `getDedupedFaqs()`

**Bonus fix:** FAQs were duplicated up to 6× per page (same question repeated). `getDedupedFaqs()` deduplicates by question text before rendering.

**Estimated savings:** ~400-600ms TBT reduction on hire pages.

#### Fix 3: Navbar Lazy-Loading

**Problem:** `components/Navbar.js` called `useBlogList()` and `useTestimonialList()` (React Query hooks) unconditionally on every page load. These fire API requests to Sanity CMS even though the data is only needed when the user hovers over the Resources mega menu. Also imported the full `caseStudies` array.

**Solution:**
1. Created `components/ResourcesMegaMenu.jsx` — a separate client component that contains the blog/testimonial hooks and FAQ data
2. Lazy-loaded it via `React.lazy()` — the component (and its API calls) only mount when the Resources menu is first opened
3. Replaced full `caseStudies` import with lightweight `caseStudyListings`

```js
// Navbar.js
const ResourcesMegaMenu = lazy(() => import("./ResourcesMegaMenu"));

// In render:
<Suspense fallback={<ResourcesTrigger />}>
  <ResourcesMegaMenu hasWhiteBg={hasWhiteBg} caseStudyItems={caseStudyItems} />
</Suspense>
```

**Estimated savings:** ~200ms TBT + eliminates 2 unnecessary API calls per page load.

#### Fix 4: Navbar Trailing Slash Mismatch

**Problem:** `forceWhiteBgRoutes = ["/case-studies/"]` used trailing slash, but `usePathname()` returns paths without trailing slashes. The match silently failed — case study and hire pages never got the white navbar background.

**Solution:**
```js
// Before:
return forceWhiteBgRoutes.some(route => pathname.startsWith(`${route}/`));

// After:
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

1. ~~Create `plan.md`~~ ✅ Done
2. ~~Write `scripts/convert-case-studies.js`~~ ✅ Done
3. ~~Run on 280 case studies~~ → `data/case-studies.js` (274 unique) ✅
4. ~~Convert 300 hire pages~~ → `data/hire-pages.js` (258 unique) ✅
5. ~~Update case study route to `[slug]`~~ ✅ Done
6. ~~Build hire listing + detail pages~~ ✅ Done
7. ~~Add lightweight data helpers~~ (`caseStudyListings`, `getHireRolesMap`, etc.) ✅
8. ~~Navbar lazy-loading + trailing slash fix + FAQ dedup~~ ✅
9. ✅ Salary Guide (193 → 99 unique) — `/salary-guide/[slug]` live with SSG
10. Next: Convert remaining 4 categories (Comparison, Resource Guide, International City, Industry/Service)

---

**Last Updated:** June 16, 2026
**See also:** `plan.md` (detailed execution plan)