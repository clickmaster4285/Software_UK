# ClickMasters — Master Project Guide & Style System

> **Main reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md) — content migration, data layer, routes, performance audit
> **Execution plan:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md) — full conversion plan for 1,785 DOCX files

---

## 1. PROJECT OVERVIEW

| Field | Value |
|-------|-------|
| **Project** | ClickMasters Software Development Company |
| **URL** | https://clickmasterssoftwaredevelopmentcompany.co.uk |
| **Type** | B2B Next.js website (SSG) |
| **Content** | 1,785 Word documents → data files → static pages |
| **Tech Stack** | Next.js 16.2.9, React 19, Tailwind 4 (OKLCH), Turbopack |
| **Storage** | Data files (`data/*.js`) — not MongoDB |
| **Build** | SSG with `generateStaticParams` |

---

## 2. BRAND IDENTITY

- **Name:** ClickMasters Software Development Company
- **Domain:** clickmasterssoftwaredevelopmentcompany.co.uk
- **Tagline:** "We Don't Just Build Software — We Build Revenue Systems"
- **Mission:** Building custom web apps, mobile apps, and enterprise software that powers real business growth.
- **Service Segments:** Custom Software, Web Development, Mobile Apps, AI & Automation, ERP Systems, Cybersecurity.

### Contact Information
- **Emails:** sale@clickmasterssoftwaredevelopmentcompany.co.uk
- **Phones:** +44798856086
- **Office:** Main PWD Rd, Islamabad, Punjab, Pakistan
- **Hours:** Mon-Sat: 9AM - 6PM (24/7 Support for clients)

---

## 3. CONTENT INVENTORY & ROUTES

> Full details in [`agent.md` §2-3](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)

| Category | DOCX | Unique | Route | Data File | Status |
|----------|-----:|-------:|-------|-----------|--------|
| Case Studies | 280 | 274 | `/case-studies/` + `/case-studies/[slug]/` | `data/case-studies.js` | ✅ |
| Hire Pages | 311 | 269 | `/hire/` + `/hire/[role]/[city]/` | `data/hire-pages.js` | ✅ |
| Salary Guides | 193 | 99 | `/salary-guide/` + `/salary-guide/[slug]/` | `data/salary-guides.js` | ✅ |
| Comparisons | 177 | 141 | `/comparison/` + `/comparison/[slug]/` | `data/comparisons.js` | ✅ |
| Cities | 306 | 203 | `/locations/` + `/locations/[slug]/` | `data/cities.js` | ✅ |
| Resource Guides | 105 | 80 | `/resource/` + `/resource/[slug]/` | `data/resource-guides.js` | ✅ |
| Glossary | 200 | 200 | `/glossary/` + `/glossary/[term]/` | `data/glossary.js` | ✅ |
| Industries | 202 | 148 | `/industries/` + `/industries/[slug]/` | `data/industries.js` | ✅ |
| Standalone Services | 11 | TBD | `/service/[slug]/` | `data/services.js` | 🔲 |
| **Total** | **1,785** | **~1,414** | | | **9/10 complete** |

### Static Pages (no data file needed)
`/about/`, `/contact/`, `/faq/`, `/pricing/`, `/projects/`, `/solutions/`, `/testimonials/`, `/` (homepage)

---

## 4. FILE & PLAN INDEX

### Master Files
| File | Purpose |
|------|---------|
| [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md) | Main reference — content inventory, routes, performance audit, animation architecture |
| [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md) | Master execution plan — all 1,785 DOCX files, conversion strategy, duplicate handling |
| [`Clickmasterssoftwaredevelopmentcompany.co.uk/ClickMasters_Master_Index.csv`](./Clickmasterssoftwaredevelopmentcompany.co.uk/ClickMasters_Master_Index.csv) | CSV index of all 1,785 files with P-numbers, slugs, categories |

### Category-Specific Plans
| Plan File | Category | Route | Status |
|-----------|----------|-------|--------|
| [`plan-cities-page.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-cities-page.md) | International Cities | `/locations/[slug]/` | ✅ |
| [`plan-comparison-page.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-comparison-page.md) | Comparisons | `/comparison/[slug]/` | ✅ |
| [`plan-glossary.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-glossary.md) | Glossary | `/glossary/[term]/` | ✅ |
| [`plan-hire-page.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-hire-page.md) | Hire Pages | `/hire/[role]/[city]/` | ✅ |
| [`plan-industries-pages.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-industries-pages.md) | Industries | `/industries/[slug]/` | ✅ |
| [`plan-industry-service-pages.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-industry-service-pages.md) | Industry+Service Combos | `/[category]/[service]/` | 🔲 |
| [`plan-international-city.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-international-city.md) | International Cities (alt) | `/locations/[slug]/` | ✅ |
| [`plan-resource.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-resource.md) | Resource Guides | `/resource/[slug]/` | ✅ |
| [`plan-salary-guide.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-salary-guide.md) | Salary Guides | `/salary-guide/[slug]/` | ✅ |
| [`plan-service-pages.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-service-pages.md) | Standalone Services | `/service/[slug]/` | 🔲 |

### Key Source Folders (DOCX)
| Folder | Count | Description |
|--------|------:|-------------|
| `Case-Study/` | 280 | Case study documents |
| `Comparison-Page/` | 177 | Technology comparison documents |
| `Glossary/` | 200 | Glossary term documents |
| `Hire-Page/` | 311 | Developer hire page documents |
| `Industries/` | 202 | Industry+service combo documents |
| `International-City/` | 306 | City-specific documents |
| `Resource-Guide/` | 105 | Resource guide documents |
| `Salary-Guide/` | 193 | Salary benchmark documents |
| `Service/` | 11 | Standalone service documents |

---

## 5. TECHNICAL ARCHITECTURE

### Data Layer Pattern
All content is stored as JS data files in `data/*.js`. Each file exports:
- **Full array** — complete data for detail pages (e.g., `caseStudies`)
- **Lightweight array** — stripped-down data for listing pages (e.g., `caseStudyListings`)
- **Lookup functions** — for fetching single items (e.g., `getCaseStudyBySlug()`)
- **Helper functions** — for related items, filtering, dedup (e.g., `getRelatedCaseStudies()`, `getDedupedFaqs()`)

> **Critical:** Listing pages MUST use lightweight arrays, not full data. See [`agent.md` §11.3](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md) for TBT impact.

### Route Structure
```
app/
├── layout.js                          ← Root layout (fonts, providers, metadata with canonical)
├── (landing)/
│   ├── layout.js                      ← Landing layout (Navbar + Footer)
│   ├── page.js                        ← Homepage (client component — no metadata export)
│   ├── about/
│   │   ├── layout.js                  ← Metadata with canonical (client component page)
│   │   └── page.js                    ← About page
│   ├── contact/
│   │   ├── layout.js                  ← Metadata with canonical (client component page)
│   │   └── page.js                    ← Contact page
│   ├── case-studies/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── locations/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── comparison/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── glossary/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [term]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── hire/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [role]/[city]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── industries/
│   │   ├── page.js                    ← Listing page (metadata + canonical via siteConfig.url)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── [category]/[service]/
│   │   └── page.js                    ← Sub-service detail (generateMetadata with canonical)
│   ├── resource/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── salary-guide/
│   │   ├── page.js                    ← Listing page (metadata + canonical)
│   │   └── [slug]/
│   │       └── page.js                ← Detail page (generateMetadata with canonical)
│   ├── projects/
│   │   ├── layout.js                  ← Metadata with canonical (client component page)
│   │   └── page.js                    ← Projects page
│   ├── solutions/
│   │   ├── layout.js                  ← Metadata with canonical (client component page)
│   │   └── page.js                    ← Solutions page
│   ├── testimonials/
│   │   ├── layout.js                  ← Metadata with canonical (client component page)
│   │   └── page.js                    ← Testimonials page
│   ├── faq/page.js                    ← FAQ page (metadata + canonical)
│   └── pricing/page.js                ← Pricing page (metadata + canonical)
```

### Metadata & Canonical Pattern
- **Server components:** Use `export const metadata` or `generateMetadata()` with `alternates: { canonical }`
- **Client components (`'use client'`):** Create a sibling `layout.js` that exports metadata — client components CANNOT export metadata
- **Domain:** Always use `https://clickmasterssoftwaredevelopmentcompany.co.uk` (NOT `clickmasters.co`)
- **siteConfig.url:** Defined in `app/metadata-config.js` — used by industries and sub-service pages

### Key Files
| File | Purpose |
|------|---------|
| `app/metadata-config.js` | `siteConfig.url`, `metadataConfig.serviceDetail()`, schema helpers |
| `app/layout.js` | Root layout — fonts, providers, homepage canonical |
| `app/(landing)/layout.js` | Landing layout — Navbar + Footer wrapper |
| `data/*.js` | All content data files (9 files, ~1,414 unique entries) |
| `components/Navbar.js` | Navigation with lazy-loaded ResourcesMegaMenu |
| `components/Footer.js` | Site footer |

---

## 6. DESIGN SYSTEM (OKLCH & TAILWIND 4)

> **Rule:** Must use global CSS color variables wherever color is used. Never hardcode hex/rgb.

### Color Palette
| Token | Usage |
|-------|-------|
| `primary` | Backgrounds, dark sections, footer |
| `primary-mid` | Card dark backgrounds |
| `accent` | CTA buttons, highlights, icons |
| `accent-hover` | Button hover states |
| `surface` | Light gray section backgrounds |
| `text-primary` | Dark headings |
| `text-light` | Text on dark backgrounds |
| `text-body` | Body text |
| `text-muted` | Muted/secondary text |
| `border` | Card borders |
| `background` | Page background |

### Typography
- **Headings:** `Sora` (Bold 700 / SemiBold 600) — CSS variable `--font-sora`
- **Body:** `DM Sans` (Regular 400 / Medium 500) — CSS variable `--font-dm-sans`
- **Pill Labels:** `DM Sans` Medium, 11px, Uppercase, Tracking 0.08em

### Visual Style
- **Corners:** Buttons (8px), Cards (12px), Large Cards (16px), Badges (Pill 100px)
- **Shadows:**
  - Standard: `0 2px 16px rgba(0,0,0,0.07)`
  - Hover: `0 8px 32px rgba(0,0,0,0.12)`
  - Pricing (Popular): `0 16px 48px` with accent color
- **Transitions:** Smooth fade-up on scroll (0.6s), 0.25s hover transitions

### Key Component Patterns
- **Hero:** Dramatic dark navy gradient with floating dashboard mockups
- **Section Labels:** Small uppercase pill badges with 1px border — use `section-label` class
- **Buttons:** Linear gradient (`accent` → `accent-hover`), white text, hover lift 2px — use `btn-primary` class
- **Cards:** White background, 1px solid border, subtle shadows, hover lift 4px
- **FAQ:** Dark navy pills for questions, smooth accordion expansion

### CSS Classes (from globals.css)
| Class | Usage |
|-------|-------|
| `section-label` | Uppercase pill badge with border |
| `btn-primary` | Gradient CTA button |
| `btn-secondary` | Outlined secondary button |
| `animate-fade-up` | Scroll-triggered fade-up animation |

---

## 7. CONTENT STRATEGY

- **Tone:** Professional, Results-Driven, Authoritative but Approachable
- **Keywords:** Scalable revenue, ROI, High-performance systems, Enterprise security
- **Case Studies:** Manufacturing, Retail, Healthcare, Education, Real Estate, FinTech, HealthTech, GovTech, EdTech, PropTech, InsurTech, LogTech, RetailTech, MedTech, CleanTech, LegalTech, AgriTech

---

## 8. PERFORMANCE

> Full audit details in [`agent.md` §11](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)

### Lighthouse Baseline (June 2026)
| Metric | Value | Status |
|--------|-------|--------|
| Performance Score | 43 / 100 | 🔴 Critical |
| TBT | 4,140ms | 🔴 (target <200ms) |
| LCP | 3.1s | ⚠️ |
| FCP | 0.7s | ✅ |
| CLS | 0.001 | ✅ |
| Accessibility | 100 / 100 | ✅ |
| SEO | 43 / 100 | 🔴 (now fixed with canonical tags) |

### Fixes Applied
1. ✅ **Data layer splitting** — Lightweight arrays for listing pages (case-studies, hire-pages)
2. ✅ **Navbar lazy-loading** — ResourcesMegaMenu only loads on interaction
3. ✅ **FAQ deduplication** — `getDedupedFaqs()` removes up to 6× duplicates
4. ✅ **Canonical tags** — All pages have self-canonical pointing to correct domain
5. ✅ **Pagination SEO** — `rel="prev"`/`rel="next"` links on all 5 paginated listing pages (case-studies, salary-guide, comparison, resource, glossary)

### Remaining Work
| # | Task | Est. TBT Savings |
|---|------|-----------------|
| 1 | Lazy-load About page (dynamic imports) | ~600ms |
| 2 | Lazy-load Contact page (dynamic imports) | ~400ms |
| 3 | Remove GSAP (4 files → CSS/IntersectionObserver) | ~150ms + 40 KB |
| 4 | Remove Swiper (→ CSS scroll-snap) | ~100ms + 45 KB |
| 5 | Remove Lenis (→ native `scroll-behavior: smooth`) | ~100ms + 36 KB |
| 6 | Replace infinite animations with CSS (Hero, TrustedBy) | Ongoing |

### Animation Architecture
| Library | Files | Strategy |
|---------|-------|----------|
| **framer-motion** | 30+ | Keep. Use `dynamic()` for below-fold. Replace infinite loops with CSS. |
| **GSAP** | 4 | Remove — replace with CSS + IntersectionObserver |
| **Swiper** | 1 | Remove — replace with CSS scroll-snap |
| **Lenis** | layout | Remove — use native `scroll-behavior: smooth` |
| **Lucide-react** | many | Keep — `optimizePackageImports` already configured |

### Lazy-Loading Conventions
```js
// Default export:
const Component = dynamic(() => import('@/path/to/Component'), { ssr: true });

// Named export:
const Component = dynamic(() =>
  import('@/path/to/Component').then(mod => {
    const C = mod.ComponentName;
    const W = (p) => <C {...p} />;
    W.displayName = 'ComponentName';
    return W;
  }), { ssr: true }
);
```

---

## 9. KNOWN ISSUES

| ID | Issue | Status |
|----|-------|--------|
| P1109 | Radix UI prerender error — `Cannot read properties of null (reading 'useContext')` during SSG | ✅ Resolved — server builds 1586/1586 pages cleanly |
| | `siteConfig.url` had wrong domain (`clickmasters.co`) — fixed June 22, 2026 | ✅ Fixed |
| | 46 pages missing canonical tags — all fixed June 22, 2026 | ✅ Fixed |
| | FAQ page had wrong title ("Softflow") — fixed June 22, 2026 | ✅ Fixed |
| | Pagination SEO links — `rel="prev"`/`rel="next"` added to 5 listing pages | ✅ Fixed |

---

## 10. SCRIPTS

| Script | Purpose |
|--------|---------|
| `scripts/convert-case-studies.js` | Convert case study DOCX → `data/case-studies.js` |
| `scripts/convert-hire-pages.js` | Convert hire page DOCX → `data/hire-pages.js` |
| `scripts/convert-salary-guides.js` | Convert salary guide DOCX → `data/salary-guides.js` |
| `scripts/convert-comparisons.js` | Convert comparison DOCX → `data/comparisons.js` |
| `scripts/convert-cities.js` | Convert city DOCX → `data/cities.js` |
| `scripts/convert-resource-guides.js` | Convert resource guide DOCX → `data/resource-guides.js` |
| `scripts/convert-glossary.js` | Convert glossary DOCX → `data/glossary.js` |
| `scripts/convert-industries.js` | Convert industry DOCX → `data/industries.js` |
| `scripts/convert-service.js` | Convert standalone service DOCX → `data/services.js` (pending) |
| `scripts/generate-url-sheet.js` | Generate Excel URL sheet from all data files |
| `scripts/audit-canonical.js` | Audit all pages for canonical tag coverage |

---

## 11. KEY DECISIONS

| Decision | Choice | Why |
|----------|--------|-----|
| Storage | Data files (not MongoDB) | Simpler, follows proven pattern |
| Build | SSG with `generateStaticParams` | Fastest, static CDN |
| Route params | `[slug]` (not `[id]`) | Better SEO |
| Duplicate handling | Lowest P-number as canonical | Consistent across all phases |
| Client component metadata | Sibling `layout.js` | Next.js restriction — client components can't export metadata |
| Domain in canonical | `clickmasterssoftwaredevelopmentcompany.co.uk` | Real domain (not `clickmasters.co`) |
| How-To/Cost files | Merged into `Resource-Guide/` | Same template, avoids extra category |
| Tech files | Merged into `Hire-Page/` | All are developer hire pages |
| City files | Merged into `International-City/` | City-specific pages |

---

## 12. NEXT ACTIONS

1. 🔲 **Standalone Services** — Create `scripts/convert-service.js` → `data/services.js` (11 files, route: `/service/[slug]/`)
2. 🔲 **Industry+Service Combos** — Plan and convert 202 combo files → `/[category]/[service]/` route
3. 🔲 **Performance** — Lazy-load About + Contact pages, remove GSAP/Swiper/Lenis
4. ✅ **Radix UI fix** — P1109 resolved — verified successful build of 1586/1586 static pages

---

**Last Updated:** August 15, 2026
**Main Reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)
**Execution Plan:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md)
