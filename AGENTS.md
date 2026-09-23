# Clickmasters — Master Project Guide & Style System

> **Main reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md) — content migration, data layer, routes, performance audit
> **Execution plan:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md) — full conversion plan for 1,785 DOCX files

---

## 1. PROJECT OVERVIEW

| Field | Value |
|-------|-------|
| **Project** | Clickmasters Software Development Company |
| **URL** | https://clickmasterssoftwaredevelopmentcompany.co.uk |
| **Type** | B2B Next.js website (SSG) |
| **Content** | 1,785 Word documents → data files → static pages |
| **Tech Stack** | Next.js 16.2.9, React 19, Tailwind 4 (OKLCH), Turbopack |
| **Storage** | Data files (`data/*.js`) — not MongoDB |
| **Build** | SSG with `generateStaticParams` |

---

## 2. BRAND IDENTITY

- **Name:** Clickmasters Software Development Company
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
| **Total** | **1,774** | **~1,414** | | | **8/8 complete** |

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
| [`plan-industry-service-pages.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-industry-service-pages.md) | Industry+Service Combos | `/[mainservice]/[subservice]/` | 🔲 |
| [`plan-international-city.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-international-city.md) | International Cities (alt) | `/locations/[slug]/` | ✅ |
| [`plan-resource.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-resource.md) | Resource Guides | `/resource/[slug]/` | ✅ |
| [`plan-salary-guide.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-salary-guide.md) | Salary Guides | `/salary-guide/[slug]/` | ✅ |

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
│   ├── [mainservice]/
│   │   ├── page.js                    ← Main service page (metadata + canonical)
│   │   └── [subservice]/
│   │       └── page.js                ← Sub-service detail (generateMetadata with canonical)
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
- **No Emojis Policy (CRITICAL):** Do NOT use emojis in headings, titles, section labels, or body text. All headings must be clean, professional B2B text (e.g. "When Cross-Platform Is NOT the Right Choice", NOT "⚠️ When Cross-Platform..."). All conversion scripts (`convert-*.js`) and runtime sanitizers (`lib/subservice-utils.js`) MUST automatically strip all emojis and symbol/mojibake artifacts.
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
| `scripts/convert-sub-services-md.js` | Convert ~48 sub-service Markdown files → `data/sub-services-md.js` (intros, sections, tables, cost factors, why choose, FAQs, CTAs, JSON-LD) |
| `scripts/convert-main-services-md.js` | Convert 7 main-service Markdown files → `data/main-services-md.js` |
| `scripts/generate-url-sheet.js` | Generate Excel URL sheet from all data files |
| `scripts/audit-canonical.js` | Audit all pages for canonical tag coverage |

---

## 11. KEY DECISIONS

| Decision | Choice | Why |
|----------|--------|-----|
| Storage | Data files (not MongoDB) | Simpler, follows proven pattern |
| Build | SSG with `generateStaticParams` | Fastest, static CDN |
| Route params | `[mainservice]` + `[subservice]` (not `[category]`/`[service]`) | Avoids confusion with industries pages; clearer semantics |
| Duplicate handling | Lowest P-number as canonical | Consistent across all phases |
| Client component metadata | Sibling `layout.js` | Next.js restriction — client components can't export metadata |
| Domain in canonical | `clickmasterssoftwaredevelopmentcompany.co.uk` | Real domain (not `clickmasters.co`) |
| How-To/Cost files | Merged into `Resource-Guide/` | Same template, avoids extra category |
| Tech files | Merged into `Hire-Page/` | All are developer hire pages |
| City files | Merged into `International-City/` | City-specific pages |
| Sub-Services Data Architecture | Non-destructive MD overlay pattern | Enriches matching slugs from `data/sub-services-md.js` while 100% preserving base/override data for all other 81+ slugs |

---

## 12. NEXT ACTIONS

1. ✅ **Main & Sub-Services MD Conversion** — 48 sub + 9 main MD files → `data/sub-services-md.js` & `data/main-services-md.js` with non-destructive overlay.
2. ✅ **Design UI/UX Category** — `/design-ui-ux` + 7 sub-services; jamstack under web-development.
3. ✅ **Slug Consistency Fix** — PWA / ecommerce / support aliases aligned across menu, override, MD, main-services.
4. ✅ **Sub-services pipeline A–D (Sep 23)** — Converter harden, overlay `sections`/`cta`/`hasMdSections`, hero full intro, chapter ContentSections, CTA buttons end-to-end, UK £ pricing, main/sub CTA normalize (build green). See [`plan-sub-services-extraction.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-sub-services-extraction.md).
5. 🔲 **Sub Phase E** — Spot-check custom-software / frontend / NLP; fill empty FAQ MDs; density polish.
6. 🔲 **~88 override-only sub MDs** — After Phase E.
7. 🔲 **Industry+Service Combos** — Plan and convert 202 combo files → `/[mainservice]/[subservice]/` route
8. 🔲 **Performance** — Lazy-load About + Contact; listings split for `sub-services.js`; GSAP removal backlog
9. ✅ **Route rename** — `/[mainservice]/[subservice]/`
10. ✅ **Radix UI / SSG** — Clean static builds

**Service content docs:** [`plan-sub-services-extraction.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-sub-services-extraction.md) · [`plan-main-services-extraction.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-main-services-extraction.md) · [`SERVICE-CONTENT-TRACKER.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/SERVICE-CONTENT-TRACKER.md)

---

## 13. ADDING NEW SERVICES (Slug Consistency Rule)

> **CRITICAL:** A slug mismatch between `serviceMenuSections`, override objects, and MD data causes 404 errors. Always verify slugs match across all 4 locations before deploying.

### Steps to Add a New Main Service

1. Add title to `serviceMenuSections` in `data/sub-services.js` (this title gets slugified)
2. Create override object in `data/sub-services.js` with `slug` = `slugify(title)`
3. Create MD file in `main-services/` directory with URL matching the slug
4. Run `node scripts/convert-main-services-md.js`
5. Add entry to `main-services.js` with matching slug
6. Add entry to `service-section-data.js` and `whyChooseUsData.js`

### Steps to Add a New Sub-Service

1. Add title to the correct category in `serviceMenuSections` in `data/sub-services.js`
2. Create override object in `data/sub-services.js` with `slug` = `slugify(title)` and matching `categorySlug`
3. Create MD file in `sub-services/` directory with URL matching the slug
4. Run `node scripts/convert-sub-services-md.js`
5. Add slug to the parent category's `subServices` array in `main-services.js`

### Slug Verification Checklist

Before deploying, verify these 4 locations all use the same slug:

| Location | Field |
|----------|-------|
| `data/sub-services.js` → `serviceMenuSections[].items[].title` | `slugify(title)` must match |
| `data/sub-services.js` → override object | `slug` field |
| `data/sub-services-md.js` → entry | `slug` field |
| `data/main-services.js` → `subServices[]` | `slug` field |

### Example: Adding "Blockchain Consulting"

```js
// 1. serviceMenuSections (slugify("Blockchain Consulting") = "blockchain-consulting")
{ title: "Blockchain Consulting", description: "..." }

// 2. Override object
const blockchainConsultingOverride = {
  slug: "blockchain-consulting",  // MUST match slugify(title)
  categorySlug: "blockchain-and-web3",
  // ...
};

// 3. MD file URL
// https://clickmasterssoftwaredevelopmentcompany.co.uk/blockchain-and-web3/blockchain-consulting

// 4. main-services.js subServices
{ title: 'Blockchain Consulting', slug: 'blockchain-consulting', ... }
```

---

**Last Updated:** September 23, 2026
**Main Reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)
**Execution Plan:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md)
**Service content:** [`plan-sub-services-extraction.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan-sub-services-extraction.md) · [`SERVICE-CONTENT-TRACKER.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/SERVICE-CONTENT-TRACKER.md)

