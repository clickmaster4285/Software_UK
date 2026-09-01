# Plan: Improve Main-Services & Sub-Services Data Architecture

**Generated:** September 1, 2026
**Scope:** `data/main-services.js`, `data/sub-services.js`, the `/[category]/` and `/[category]/[service]/` routes, and the ~20 MD content files in `main-services/` and `sub-services/`
**Goal:** Understand the current state, identify gaps & risks, and define an improvement plan

---

## 1. Current State — What's There & What It Does

### 1.1 Files & Folders

| Path | Purpose | Size |
|------|---------|------|
| `main-services/*.md` (3 files) | Source-of-truth content: meta keywords, meta title, meta description, H1, hero, body sections, schema JSON | 25 KB – 37 KB each |
| `sub-services/*.md` (21 files) | Per-sub-service content (meta, H1, body, FAQs, FAQPage schema) | 14 KB – 43 KB each |
| `data/main-services.js` | Hand-curated JS object → 13 main service categories with `subServices` arrays (link shell only) | 38 KB / ~900 lines |
| `data/service-section-data.js` | Per-category `features`, `pricing`, `faqs`, `trustedClients`, `stats` (filled-in for all 13) | 33 KB |
| `data/whyChooseUsData.js` | Per-category Why-Choose-Us content + defaults | 17 KB |
| `data/sub-services.js` | Massive hand-written file: 102 sub-service override objects + technology map + helper fns | 16,070 lines / 1.95 MB |
| `app/(landing)/[category]/page.js` | Main category route — combines `mainServicesData` + `service-section-data` | 92 lines |
| `app/(landing)/[category]/[service]/page.js` | Sub-service detail route — pulls from `data/sub-services.js` | 334 lines |
| `app/(landing)/[category]/main-service.jsx` | Renders the main category page UI (12 sub-components) | 14 sections |
| `app/(landing)/[category]/[service]/subservice.js` | Client component used by the sub-service page (NavigationWheel) | 380 lines |
| `components/landing/main-service/*` | 14 components used by main service pages | — |
| `components/landing/sub-services/*` | 16 components used by sub-service pages | — |

### 1.2 Data Shape (current)

#### `mainServicesData` (per category)

```js
{
  'software-development': {
    title: 'Software Development',
    slug: 'software-development',
    icon: 'Code2',                     // string, not component
    metaTitle: '...',
    metaDescription: '...',
    metaKeywords: '...',
    tagline: '...',
    description: '...',                 // short pitch
    heroBadge: '...',
    heroImage: 'https://images.unsplash.com/...',
    stats: [{ value: "200+", label: "Projects Delivered" }, ...],
    trustedClients: [{ name, industry, icon }, ...],
    subServices: [                       // SHELL ONLY — just title/slug/desc/icon
      { title, slug, description, icon, heroImage }
    ]
  },
  // ... 12 more categories
}
```

Then `enrichServiceData(slug, service)` from `service-section-data.js` merges in:
`features`, `pricing`, `faqs`, `lifecycle` (overrides only if missing).

Then `getWhyChooseUsData(slug, service)` from `whyChooseUsData.js` returns:
`{ subtitle, stats, benefits }` (per-category override OR fallback defaults).

#### Sub-service object (in `data/sub-services.js`)

102 hand-written **override objects**, one per slug. Example shape:

```js
{
  slug: "custom-software-development",
  categorySlug: "software-development",
  sectionId: "custom-software-development",
  category: "Software Development",
  title: "Custom Software Development Company for Business-Focused Software Solutions",
  serviceName: "Custom Software Development",
  heroImage: "https://images.unsplash.com/...",
  metaTitle: "Custom Software Development Company UK - Clickmasters",
  metaKeywords: "..., ...",
  metaDescription: "...",
  lead: "...",
  highlights: ["Business-Focused Planning", "Secure & Scalable", ...],
  checklist: [{ item, standard }, ...],
  keyOfferings: [{ title, description }, ...],
  differentiators: [{ feature, description }, ...],
  processPhases: [{ phase, title, timeline, text }, ...],
  techStackCategories: [{ layer, technologies }, ...],
  pricingTiers: [{ type, investment, timeline, bestFor }, ...],
  industryUseCases: [{ name, description }, ...],
  sections: [{ heading, body, items? }, ...],   // article body
  faqs: [{ question, answer }, ...]
}
```

The file also has:

- `baseServices` (auto-generated from `serviceMenuSections`) — fallback for any sub-service **without** an override
- `services = baseServices.map(...)` — final array
- `serviceMenuSections` (12 categories, ~102 items) — used by Navbar mega-menu
- `categoryTechMappings` — used by `TechStack` component
- Helper fns: `slugify`, `getAllServiceSlugs`, `getServicePage`, `getAllServicePages`, `getServicePath`, `getTechnologiesForService`, `getServiceTechnologies`
---

## 2. The Problem — What Needs Improving

### 2.1 Critical Issues

| # | Issue | Impact |
|---|-------|--------|
| **C1** | **MD content is not the source of truth for the live pages.** The hand-written `data/main-services.js` and `data/sub-services.js` are paraphrased, shorter, and missing rich content (comparison tables, long intros, internal-link anchors). The detailed MD content is unused. | SEO loss (long-tail keywords), weaker content quality, internal-link graph is shallow. |
| **C2** | **No conversion pipeline from MD → JS data.** Unlike other content categories (case studies, hire, industries, glossary — all have `scripts/convert-*.js` DOCX→JS), these MD files have no automated conversion. They are frozen in the repo and may drift from the live pages. | Future maintenance burden; no single source of truth. |
| **C3** | **Sub-service data file is 16,070 lines / 1.95 MB** — biggest data file in the project. Listing/menu pages import the full file (via `serviceMenuSections`) but the full overrides are also exported from the same module. | Same data-bloat problem that was already fixed for case-studies & hire-pages (§11.3 of `agent.md`). Estimated **~400-600ms TBT** on listing/landing pages. |
| **C4** | **Listing pages (`/`, navbar, mega-menu, footer) ship the full `sub-services.js` module** including 102 override objects with long body text,, processPhases, etc. | Performance hit on every page load. |
| **C5** | **`app/(landing)/[category]/page.js` has a mid-file `import` statement** (lines 34-35), which is invalid per ES modules (imports must be at top). Vite/Webpack tolerate it but it's brittle and may break with Turbopack. | Build fragility. |
| **C6** | **`subservice.js` is a "client component"** that imports `NavigationWheel` from a sibling file — this file appears **dead** (not referenced by `page.js` which uses `dynamic()` imports instead). | Confusing dead code; not lazy-loaded. |

### 2.2 Content Gaps (MD has,, JS data doesn't)

| Field | In MD | In JS data | Notes |
|-------|:----:|:----------:|-------|
| Meta Title | ✅ | ✅ partial | MD has exact; JS has slightly different version |
| Meta Description | ✅ | ✅ | Mostly aligned |
| Meta Keywords (long list) | ✅ | ⚠️ partial | MD has 20-30 keywords; JS has 5-10 |
| H1 | ✅ | ❌ | MD's H1 is different (richer) than `title` in JS |
| Long intro paragraph (with internal links) | ✅ | ❌ | Major SEO loss |
| H2/H3 body sections | ✅ | ⚠️ partial | JS has `sections` but content is paraphrased |
| Bullet lists within sections | ✅ | ⚠️ partial | Some are flattened into `items` |
| Comparison tables | ✅ | ❌ | E.g., "Native vs Cross-Platform" — completely missing |
| Cost factors / "How much" section | ✅ | ❌ | Major content gap |
| Service list with internal links | ✅ | ⚠️ | JS has `keyOfferings` but no links |
| Numbered process steps | ✅ | ✅ | Aligned (JS has `processPhases`) |
| Tech stack categories | ✅ | ✅ | Aligned (JS has `techStackCategories`) |
| Pricing tiers | ❌ (in MD as "How much") | ✅ | JS has structured `pricingTiers` |
| Industry use cases | ❌ (in MD only for main) | ✅ | JS has structured `industryUseCases` |
| FAQs | ✅ | ✅ | Aligned, but JS has fewer Q&A (5) vs MD (8-10) |
| Service Schema (JSON-LD) | ✅ | ❌ | Currently injected by page.js from a generator; not the exact MD schema |
| FAQPage Schema (JSON-LD) | ✅ | ❌ | Same — page.js builds it; not from MD |
| BreadcrumbList Schema | ✅ | ❌ | Same |

### 2.3 Architecture Smells

- **Two sources of truth**: `mainServicesData` (in `data/main-services.js`) and `serviceMenuSections` (in `data/sub-services.js`) **define overlapping menu structures**. The mega-menu uses one, the explore section uses the other,, and they must be kept in sync manually.
- **No `*Listings` lightweight arrays**: Unlike `caseStudyListings`, `hirePageListings`, `industryListings`, there is no `subServiceListings` or `mainServiceListings` for navbar/footer/listing use.
- **No deduplication or dedup-helper**: Ther `caseStudyListings` pattern (map to a thin shape) isn't applied here.
.
- **`baseServices` is regenerated on every import** — 102 objects built at module load.
- **Override map uses array.find()**: `getServicePage(slug)` does `services.find(s => s.slug === slug)` — O(n) per call,, on every page request during SSG.
---

## 3. Improvement Plan

### Phase 1 — Establish the source-of-truth pattern (foundation)

**Goal:** Bring main-services & sub-services in line with the rest of the project (case-studies, hire, etc.).

| # | Task | Details |
|---|------|---------|
| 1.1 | Create `scripts/convert-main-services.js` | Parses the 3 `main-services/*.md` files → `data/main-services.js` (full + lightweight). Mirrors the pattern from `scripts/convert-case-studies.js` and `scripts/convert-glossary.js`. |
| 1.2 | Create `scripts/convert-sub-services.js` | Parses the 21 `sub-services/*.md` files → `data/sub-services.js`. Extracts: meta (title/desc/keywords/url), H1, intro, sections (with bullets), comparison tables, process steps, FAQ list, JSON-LD schemas (or fields to rebuild them). |
| 1.3 | Add lightweight helper exports | `mainServiceListings` (id,, slug,, title,, description,, icon,, metaTitle) and `subServiceListings` (slug,, categorySlug,, title,, serviceName,, metaTitle,, metaDescription,, heroImage). |
| 1.4 | Add lookup functions | `getMainServiceBySlug`, `getSubServiceByCategoryAndSlug`, `getSubServicesByCategory`, `getRelatedSubServices`. |
| 1.5 | Backwards-compat shim | Keep `mainServicesData`, `serviceMenuSections`, `getServiceData`, `getServicePage`, `getAllServicePages`, `getServiceTechnologies` etc. as re-exports from the new data files — so existing pages don't break. |

### Phase 2 — Fix the live pages (consumer-side)

| # | Task | Details |
|---|------|---------|
| 2.1 | Update `app/(landing)/[category]/page.js` | Move the two late-file `import`s (lines 34-35) to the top. Keep existing API; add a fallback chain. |
| 2.2 | Update `app/(landing)/[category]/[service]/page.js` | Use the new `getSubServiceByCategoryAndSlug` lookup; add `generateMetadata` improvement to use exact MD's Meta Title (not `${title} Services | Clickmasters` fallback). |
| 2.3 | Update navbar/footer/mega-menu | Use `mainServiceListings` + `subServiceListings` for the menu so listing pages don't ship 1.95 MB. |
| 2.4 | Update `components/landing/main-service/ExploreSection.jsx` | Use the lightweight listing arrays. |
| 2.5 | Dead-code cleanup | Decide on `subservice.js` (currently dead). If used, lazy-load; if not, delete. |

### Phase 3 — Boost content quality (use the MD rich content)

| # | Task | Details |
|---|------|---------|
| 3.1 | Long-form intro paragraph | Add `intro` (or `leadRich`) field to the sub-service data. Render after H1. This is the rich paragraph with internal links. |
| 3.2 | Comparison tables | Add `tables: [{ title, headers, rows }]` to the data. Render with the existing `tables` block in `subservice.js` (already supported) or a new `<ComparisonTable />` component,, `3.3 | "How much" / cost factors | Add `costFactors: [string]` to data. Render as bulleted list under a "How much does X cost?" heading. |
| 3.4 | "Why Choose Clickmasters" content | Add `whyChoose: [{ heading, body, items? }]` to data. Render between sections and FAQ. |
| 3.5 | Improve FAQ count | The MD has 8-10 FAQs; data has 5. Add the missing ones during conversion. |
| 3.6 | Internal-link graph | MD has 10-15 internal links per page. Build a `relatedLinks: [{ label,, href,, anchor }]` field and render as contextual in-body links. |

### Phase 4 — Performance & SEO (polish)

| # | Task | Details | Est. TBT savings |
|---|------|---------|-----------------|
| 4.1 | Split data file | `data/sub-services-listings.js` (lightweight) + `data/sub-services-full.js` (full) — listing pages only import the first. | ~400-600ms |
| 4.2 | Lazy-load heavy sub-service sections | `ProcessSection`, `CaseStudySection`, `TestimonialsSection`, `PricingSection` already use `dynamic()` — verify and audit. | minor |
| 4.3 | Add `preload` hints | For above-the-fold images (`heroImage`). | minor |
| 4.4 | Add canonical | Confirm `app/(landing)/[category]/[service]/page.js` has `alternates: { canonical }` — currently uses `getCanonicalPath()` but the OG object may not include the canonical link. | SEO |
| 4.5 | Fix schema to match MD | Regenerate the Service and FAQPage JSON-LD from MD's exact format (with `@id` and the offer list). | SEO |
| 4.6 | Pre-generate sitemap entries | `scripts/generate-sitemaps.js` already iterates `mainServicesData` — confirm it uses the new lightweight arrays. | minor |

### Phase 5 — Validate (must-pass)

| # | Task | Details |
|---|------|---------|
| 5.1 | Run `npm run build` | Verify all ~115 sub-service pages + 13 main category pages pre-render (1,586 → still 1,586). |
| 5.2 | Run `node scripts/audit-canonical.js` | Verify every sub-service,and category page has a self-canonical pointing to `clickmasterssoftwaredevelopmentcompany.co.uk/...`. |
| 5.3 | Sample 5 sub-service pages manually | Compare the live HTML to the source MD — confirm intro paragraph,, comparison tables,, cost factors,, why-choose-us,, and all FAQs render. |
| 5.4 | Lighthouse on `/software-development` and `/software-development/custom-software-development` | Performance score should improve (target 70+). |
| 5.5 | Validate JSON-LD | Run Google's Rich Results test on a sample sub-service page. |
---

## 4. Suggested Data File Structure (target)

### `data/main-services.js` (target)

```js
// Source-of-truth shape, generated by convert-main-services.js
export const mainServices = [
  {
    id: "software-development",
    slug: "software-development",
    title: "Software Development",
    icon: "Code2",
    metaTitle: "Software Development Services UK | Clickmasters",
    metaDescription: "UK software development services for custom software,, SaaS,, enterprise systems,, APIs and more. Build secure,, scalable software with Clickmasters.",
    metaKeywords: ["software development", "software development services", "..."],
    tagline: "Build reliable software around the way your business actually works.",
    heroBadge: "10+ Enterprise Solutions Delivered",
    heroImage: "https://images.unsplash.com/...",
    stats: [{ value: "200+", label: "Projects Delivered" }, ...],
    intro: "<long paragraph with internal links>",
    sections: [
      { heading: "...", body: "...", bullets: ["...", "..."] },
      { heading: "...", body: "...", table: { headers,, rows } },  // NEW
      { heading: "How much does X cost?", body: "...", costFactors: ["...", "..."] }, // NEW
    ],
    whyChoose: [{ heading,, body }, ...],  // NEW
    subServiceSlugs: ["custom-software-development", "enterprise-software-development", ...],
    faqs: [{ question,, answer }, ...],
    jsonLd: { service: {...}, faq: {...}, breadcrumb: {...} }  // verbatim from MD
  },
  // ... 12 more
];

// Lightweight for navbar/footer/mega-menu
export const mainServiceListings = mainServices.map(({ id,, slug,, title,, icon,, tagline,, description }) => ({...}));

export const subServiceListings = subServices.map(({ slug,, categorySlug,, title,, serviceName,, metaTitle,, metaDescription,, heroImage }) => ({...}));

// Lookups
export function getMainServiceBySlug(slug) {...}
export function getAllMainServiceSlugs() {...}

// Re-exports for backwards compat (the existing code uses these)
export { mainServicesData };  // aliased
```

### `data/sub-services.js` (target)

```js
export const subServices = [
  {
    slug: "custom-software-development",
    categorySlug: "software-development",
    category: "Software Development",
    title: "Custom Software Development Company for Business-Focused Software Solutions",
    serviceName: "Custom Software Development",
    heroImage: "...",
    metaTitle: "Custom Software Development Company UK - Clickmasters",
    metaKeywords: ["...", "..."],
    metaDescription: "...",
    h1: "Custom Software Development Company UK for Secure, Scalable Software Solutions",  // NEW
    intro: "<long rich paragraph with internal links>",  // NEW (verbatim from MD)
    highlights: ["...", "..."],
    sections: [
      { heading,, body,, bullets?, table?, costFactors? },
      ...
    ],
    processPhases: [...],
    techStackCategories: [...],
    pricingTiers: [...],
    keyOfferings: [{ title,, description,, href }],  // add href for internal links
    differentiators: [...],
    industryUseCases: [...],
    whyChoose: [...],  // NEW
    relatedLinks: [{ label,, href,, anchor }],  // NEW
    faqs: [...],
    tables: [{ title,, headers,, rows }],  // NEW
    jsonLd: { service,, faq,, breadcrumb }  // NEW
  },
  // ... 101 more
];
```

### File split (recommended)

```
data/
├── main-services.js                  ← full array + lookup fns
├── main-services-listings.js         ← lightweight (for navbar/footer/landing/)
├── sub-services.js                   ← full array + lookup fns
├── sub-services-listings.js          ← lightweight
├── sub-services-technologies.js      ← categoryTechMappings (rarely needed)
├── service-section-data.js           ← per-category pricing/features/faqs (keep)
├── whyChooseUsData.js                ← why-choose-us (keep)
```

---

## 5. Risks & Mitigations

| Risk | Severity | Mitigation |
|------|----------|------------|
| Existing `mainServicesData` shape is used by 14 components — refactor might break many things | High | Backwards-compat re-exports (Phase 1.5) |
| 102 hand-curated override objects have content the MD files don't (or vice versa) | Medium | Side-by-side diff during conversion; flag any data not in MD for manual review |
| MD files have inconsistent structure (different sections,, different tables) | Medium | Robust parser with per-file validation; log warnings,, don't fail |
| Schema JSON in MD may have MD-style bold (`**...**`)that needs cleanup | Low | Strip `**` in parser |
| Sitemap must include all new pages | Low | Update `scripts/generate-sitemaps.js` if new fields are added |
| 16,070-line `sub-services.js` rewrite is risky | High | Generate the new file in a parallel path (`data/sub-services-v2.js`), then swap atomically |

---

## 6. Effort & Priority

| Phase | Effort | Priority | Blocking? |
|-------|--------|----------|-----------|
| Phase 1 — Source-of-truth pipeline | 2-3 days | 🔴 P0 | Yes — everything else builds on it |
| Phase 2 — Fix live pages | 1 day | 🟡 P1 | Recommended before Phase 3 |
| Phase 3 — Content quality |  ️2-3 days | 🟡 P1 | SEO wins,, can be incremental |
| Phase 4 — Performance/SEO polish | 1-2 days | 🟢 P2 | After content is solid |
| Phase 5 — Validation |  ️0.5 day | 🔴 P0 | Yes — must pass before ship |

**Total estimated effort:**; 6-10 days
**Recommended order:** Phase 1 → Phase 2 → Phase 5 (smoke test) → Phase 3 → Phase 4 → Phase 5 (full
---

## 7. Decisions Needed From You

Before I start coding, please confirm:

1. **Approach to the override objects**: Do you want me to **replace** the 102 hand-written overrides with auto-converted MD content ((loses the careful paraphrasing),, or **merge** (MD as base,, keep hand-written extras as augmentations)?
2. **Are the MD files the canonical source?** Should the JS data be 100% derived from MD,, or is the hand-written JS data also considered authoritative?
3. **Should I keep `data/service-section-data.js` and `data/whyChooseUsData.js` as-is?** Or merge them into the new `main-services.js`?
4. **Delete `subservice.js`?** It's currently unused by `page.js`. If we want the rich comparison tables and long intros,, we need a new client component ((or just inline them in `page.js`).
5. **Are there any MD files I haven't seen?** I found 3 main-services MDs and 21 sub-services MDs — is that the complete set?

---

## 8. Quick Reference — Directory Tree (Relevant)

```
Software uk/
├── data/
│   ├── main-services.js           ← 13 categories (hand-curated,, shell subServices)
│   ├── service-section-data.js    ← per-category pricing/features/faqs
│   ├── whyChooseUsData.js         ← why-choose-us
│   └── sub-services.js            ← 102 override objects (16,070 lines)
├── main-services/*.md            (3 files) ← source-of-truth content
├── sub-services/*.md            (21 files) ← source-of-truth content
├── app/(landing)/[category]/page.js            ← main category route
├── app/(landing)/[category]/[service]/page.js ← sub-service detail route
├── app/(landing)/[category]/main-service.jsx  ← main category UI
├── app/(landing)/[category]/[service]/subservice.js ← sub-service client UI (may be dead)
├── components/landing/main-service/*        (14 components)
└── components/landing/sub-services/*        (16 components)
```

---

**Last Updated:** September 1, 2026
---

## 9. Verdict — `service-section-data.js` & `whyChooseUsData.js` (and related files)

> Asked: "Do we need these two files? What should we do with them? And the other relevant data files & mapping components — do we need to change them?"

### 9.1 Who consumes what (verified against code

| File | Consumer | Fields consumed | Needed? |
|------|----------|----------------|:----:|
| `data/service-section-data.js` | `enrichServiceData()` → `getServiceData()` → `app/(landing)/[category]/page.js` → `main-service.jsx` | `pricing` (→ `PricingSection`), `faqs` (→ `FaqSection`), `features` (→ used in hero/process), `trustedClients` (→ `TrustedClientsSection`), `stats` (→ hero/ProcessPage), `lifecycle` (→ ProcessPage) | **YES — actively used** |
| `data/whyChooseUsData.js` | `getWhyChooseUsData()` → `components/landing/main-service/whyUs.jsx` (`WhyChooseUs` section) | `subtitle` (hero text), `stats` (`{number,label}` strip), `benefits` (`{icon,title,description,features,stats,statLabel}` cards), plus `DEFAULT_WHY_CHOOSE_US_BENEFITS` fallback | **YES — actively used** |

### 9.2 Verdict — keep both, but change their *role*

Both files **must stay** — they are the content-richness layer for the main service pages (without them the main pages are near-empty shells). **Do NOT delete.** What changes is how they get authored:

| File | Now | After (target) |
|------|-----------|------------------------|
| `service-section-data.js` | Hand-written per-category `pricing/faqs/features/trustedClients/stats/lifecycle`, merged via `enrichServiceData()` (fallback logic) | **Merge into the MD-derived `data/main-services.js`**. Per-category sections become the `pricing`, `faqs`, `features`, `trustedClients`, `stats` fields IN each main-service object. The `enrichServiceData()` merge-layer becomes redundant → remove. |
| `whyChooseUsData.js` | Hand-written per-category `subtitle/stats/benefits` + defaults | **Merge into `data/main-services.js`** as the `whyChoose: { subtitle, stats, benefits }` field (from the MD "Why Choose Clickmasters" section.In `getWhyChooseUsData()` + `DEFAULT_*` move in / stay as re-exports for backward compat. |

**Caveat (phased approach):** If you'd rather keep the low-risk current split (don't refactor yet), then: keep both files **unchanged** — they already work. The refactor to merge them is only worth doing as part of the Phase-1 source-of-truth rebuild (so we don't edit them twice).

### 9.3 Known gap (found in audit

- `SERVICE_SECTION_DATA` covers **12 of 13** main slugs — **`blockchain-and-web3` is missing** enrichment (no pricing/faqs/features/trustedClients). Its main page currently renders only hero + subServices + fallbacks. During Phase-3, add a `blockchain-and-web3` entry (from MD or hand-curated), or accept the fallback.



###  ️9.4 Other relevant data files & mapping components — what to change

| File | Verdict | Action |
|------|---------|--------|
| `data/main-services.js` | Keep | Becomes MD-derived source-of-truth (+ merges in service-section-data + whyChooseUs). Keep `iconMap` (used heavily incl. `whyUs.jsx`). |
| `data/sub-services.js` | Keep | The 16,070-line file — **split**: add `subServiceListings` (lightweight) export so navbar/listing/Explore menus don't ship 1.95 MB. Optionally split full vs listings into two files. Fix `getServicePage` to use a `Map` (O(1) not `.find()` (O(n). |
| `data/service-section-data.js` | Keep → merge | Content moves into `main-services.js`; delete the file OR keep as re-export shim. |
| `data/whyChooseUsData.js` | Keep → merge | Content moves into `main-services.js`; keep `getWhyChooseUsData` re-export for `whyUs.jsx`. |
| `components/landing/main-service/ExploreSection.jsx` | Change | Use `subServiceListings` (lightweight) instead of the full `mainServicesData/subServices` — avoids forcing the 1.95 MB module. |
| `components/landing/main-service/whyUs.jsx` | No change needed | Already imports `getWhyChooseUsData` cleanly; keeps working via re-export. |
| `app/(landing)/[category]/page.js` | Change | Move the 2 mid-file `import`s to the top (ES-module validity); swap to new lookup API. |
| `app/(landing)/[category]/[service]/page.js` | Change | Use `getSubServiceByCategoryAndSlug`; add exact Meta Title from MD; render new fields (`intro`, `tables`, `costFactors`, `whyChoose`, `relatedLinks`). |
| `app/(landing)/[category]/[service]/subservice.js` | Verify/delete | Appears dead (not imported by `page.js`). If kept, add renderers for new fields; if not, delete. |
| `components/landing/sub-services/DynamicSections.jsx` | Change | Handle bullets lists + comparison tables + cost factors cleanly (it already renders `sections`). |
| `iconMap` (in `main-services.js`) | Keep as-is | String→Lucide mapping; unchanged. |
| `data/case-studies.js`, `hire-pages.js`, etc. | Unchanged | Out of scope; not touched. |

### 9.5 Bottom line

- **Yes, keep both** `service-section-data.js` and `whyChooseUsData.js` — they are actively rendering content on every main-service page. Do **not** delete them.
- The **refactor goal** is to fold their content into the single MD-derived `data/main-services.js` (one source of truth), removing the `enrichServiceData()` merge layer — but that's Phase-1 work, and only if you chose the "MD as canonical" option.
- **Low-risk path**: if you don't refactor now, **change nothing** about these two files; just add the missing `blockchain-and-web3` entry.
- The **must-fix performance item** is unrelated to these files: **split `data/sub-services.js`** (1.95 MB) with `*Listings` so itinerant/menu pages stop shipping it.

---

**Last Updated:** September 1, 2026 (v2 — added §9 verdict
---

## 10. Executed — Recommended Pattern (per §9) Done

**Recommended pattern (implemented:** *Stop importing the heavyweight `data/sub-services.js` module (1.95 MB / 16,070 lines) where only a tiny helper or a dead fallback is needed — replace with a lightweight shared util and drop dead code.*

| # | File | Change | Why |
|---|------|--------|-----|
| 1 | `lib/slugify.js` (**new**) | Tiny, pure `slugify` helper extracted (identical impl to the two inline copies) | Pages needing only `slugify` no longer pull the 1.95 MB module |
| 2 | `app/(landing)/industries/[slug]/page.js` | `import { slugify } from '@/data/sub-services'` → `from '@/lib/slugify'` | Stops 148 industry detail pages from loading the 1.95 MB module per request during SSG |
| 3 | `app/(landing)/industries/[slug]/IndustrySections.jsx` | Same `slugify` import switch (client component) | Stops the industry client bundle from pulling the 1.95 MB module |
| 4 | `app/(landing)/[category]/page.js` | Removed the dead `import { getServicePage } from '@/data/sub-services'` and `import { mainServicesData } from '@/data/main-services'` (mid-file); simplified `mainData = getServiceData(category)`; moved all imports to top | All 13 category slugs resolve via `getServiceData()`; the `getServicePage(category)` fallback was dead code that still forced-loading the 1.95 MB module on every main category page. Also fixed the ES-module mid-file-import smell. |

**Left untouched (intentional):**
- `app/(landing)/[category]/[service]/page.js` — correctly keeps `@/data/sub-services` (detail page needs the full data`.
- `service-section-data.js`, `whyChooseUsData.js`, `main-services.js` data — unchanged this round (see §9 verdict: keep both; merge later in Phase 1..
- `getServicePage()` already used a `Map` (line ~15209 `bySlug.get(slug))` — no perf bug there.

---

---

## 11. Executed — MD Conversion Pipeline & Non-Destructive Overlay Architecture (Completed)

**Executed:** September 1, 2026

| # | File / Component | Purpose / Change | Status |
|---|------------------|-------------------|:------:|
| 1 | `scripts/convert-sub-services-md.js` | Parses all 21 `sub-services/*.md` files into structured JSON objects. Extracts meta titles, 10–40 keywords, canonical URLs, relative internal links in intros, H2/H3 body sections, comparison tables, cost factors, why-choose blocks, deduplicated FAQs, and JSON-LD schemas. | ✅ Executed |
| 2 | `scripts/convert-main-services-md.js` | Parses all 3 `main-services/*.md` category files (`/software-development`, `/web-development`, `/mobile-development`) into structured category data. | ✅ Executed |
| 3 | `data/sub-services-md.js` | Standalone generated data store containing 21 rich sub-service entries, lightweight `subServiceMdListings` array, and lookup functions. | ✅ Created |
| 4 | `data/main-services-md.js` | Standalone generated data store containing 3 rich main-service entries. | ✅ Created |
| 5 | `data/sub-services.js` | **Non-destructive overlay applied**: imports `subServicesMd` and enriches matching slugs with rich fields while preserving 100% of existing base/override data for all other 81+ slugs. Also exports `subServicesMd` and lookup helpers. | ✅ Updated |
| 6 | `data/main-services.js` | Enriched `getServiceData(slug)` to overlay rich fields from `mainServicesMd` if present. | ✅ Updated |
| 7 | `components/landing/sub-services/ServiceRichContent.jsx` | Renders rich intro paragraphs with relative links, cost factor checklist, Why Choose Clickmasters cards, and related service pills. | ✅ Active |

### 11.1 Converted Main Services (3 Pages)

| # | Main Service Name | Route / Slug | Source Markdown File |
|---|-------------------|--------------|----------------------|
| 1 | **Software Development** | `/software-development` | `main-services/Serivces Pages Content Clickamster software .co .uk.md` |
| 2 | **Web Development** | `/web-development` | `main-services/Serivces Pages Content Clickamster software .co .uk (15).md` |
| 3 | **Mobile Development** | `/mobile-development` | `main-services/Serivces Pages Content Clickamster software .co .uk (11).md` |

### 11.2 Converted Sub-Services (21 Pages)

| # | Sub-Service Name | Category | Route | Source Markdown File |
|---|------------------|----------|-------|----------------------|
| 1 | **Custom Software Development** | Software Development | `/software-development/custom-software-development` | `(2).md` |
| 2 | **Enterprise Software Development** | Software Development | `/software-development/enterprise-software-development` | `(9).md` |
| 3 | **SaaS Product Development** | Software Development | `/software-development/saas-product-development` | `(3).md` |
| 4 | **MVP Development** | Software Development | `/software-development/mvp-development` | `(5).md` |
| 5 | **Desktop Application Development** | Software Development | `/software-development/desktop-application-development` | `(1).md` |
| 6 | **API Development & Integration** | Software Development | `/software-development/api-development-integration` | `(4).md` |
| 7 | **Microservices Architecture** | Software Development | `/software-development/microservices-architecture` | `(7).md` |
| 8 | **Backend Development** | Software Development | `/software-development/backend-development` | `(10).md` |
| 9 | **Frontend Development** | Software Development | `/software-development/frontend-development` | `(6).md` |
| 10 | **Full Stack Development** | Software Development | `/software-development/full-stack-development` | `(8).md` |
| 11 | **Web Application Development** | Web Development | `/web-development/web-application-development` | `(15).md` |
| 12 | **Headless CMS Development** | Web Development | `/web-development/headless-cms-development` | `(16).md` |
| 13 | **E-Commerce Development** | Web Development | `/web-development/e-commerce-development` | `(17).md` |
| 14 | **Shopify Development** | Web Development | `/web-development/shopify-development` | `(18).md` |
| 15 | **WooCommerce Development** | Web Development | `/web-development/woocommerce-development` | `(19).md` |
| 16 | **PWA Development** | Web Development | `/web-development/pwa-development` | `(20).md` |
| 17 | **iOS App Development** | Mobile Development | `/mobile-development/ios-app-development` | `.md` |
| 18 | **Android App Development** | Mobile Development | `/mobile-development/android-app-development` | `(12).md` |
| 19 | **Flutter App Development** | Mobile Development | `/mobile-development/flutter-app-development` | `(13).md` |
| 20 | **React Native Development** | Mobile Development | `/mobile-development/react-native-development` | `(14).md` |
| 21 | **Cross-Platform App Development** | Mobile Development | `/mobile-development/cross-platform-app-development` | `(11).md` |

---

**Last Updated:** September 1, 2026 (v4 — added full inventory of 3 main and 21 sub-services)


