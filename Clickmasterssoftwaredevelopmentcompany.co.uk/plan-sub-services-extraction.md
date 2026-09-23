# Plan: Sub-Services MD → Data → UI

**Generated:** September 23, 2026  
**Last Updated:** September 23, 2026  
**Status:** Phases A–D + CTA plumbing done · ContentSections chapter UI shipped · build green · Phase E (polish QA) remaining

**Mirror of (completed mains):** [`plan-main-services-extraction.md`](./plan-main-services-extraction.md)  
**Tracker:** [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md)

---

## 0. Focus index (only these three)

| Doc | Role | Status |
|-----|------|--------|
| **This file** | Sub-services extraction + UI wiring | **Active** — A–D done; E next |
| [`plan-main-services-extraction.md`](./plan-main-services-extraction.md) | Main MD + UI (done; E deferred) | ✅ |
| [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md) | Counts, per-slug status, deferred backlog | Living |

---

## 0.1 Executive decision

| Decision | Choice | Why |
|----------|--------|-----|
| **Do first** | Converter harden + regenerate | Intro ≠ metaDesc; noise sections; CTA extract |
| **Do second** | Overlay `sections` + `cta` + `hasMdSections` | MD body was extracted but not merged |
| **Do third** | Hero = full intro (no Overview split) | Sub pages read better with description in hero |
| **Do fourth** | Chapter `ContentSections` for MD pages | Accordion / long cards were weak UX |
| **CTAs** | Strip scaffold text → real buttons from MD labels | MD had `**Primary CTA:**` as body noise |
| **Keep curated** | `servicesCards`, process, pricing, checklist, tech | MD weak for those shapes |
| **Defer** | ~88 override-only new MDs | Later |

**Scope (locked):** ~48 MD files / ~42–48 slug-matched pages. No 88 new MDs this sprint.

---

## 0.2 Progress log

| Phase | Status | Notes |
|-------|--------|-------|
| **Docs consolidate** | ✅ Done Sep 23 | Single focus set; removed old umbrella + duplicate UI plan |
| **A — Converter harden** | ✅ Done Sep 23 | H1-gated intro; reject metaDesc; noise filter; live slug aliases; URL/filename resolve; regenerated 48 |
| **B — Overlay adapters** | ✅ Done Sep 23 | `cleanMdSections` + `hasMdSections`; overlay `sections` + `cta` |
| **C — Hero (no Overview split)** | ✅ Done Sep 23 (revised) | Full `intro[]` in hero; `ServiceRichContent` `hideIntro`; tagline gated |
| **D — Sections UI** | ✅ Done Sep 23 | `ContentSections` when MD; `DynamicSections` curated-only fallback |
| **D2 — ContentSections redesign** | ✅ Done Sep 23 | Jump nav + 9 chapter group files; Details 2-col (odd last spans 2) |
| **D3 — CTA extraction + wiring** | ✅ Done Sep 23 | Page + section CTAs; hero/FAQ/Process/Pricing/content buttons; GBP pricing |
| **D4 — Main/sub CTA shape fix** | ✅ Done Sep 23 | `normalizeCtaLabel` — main-service object CTAs vs sub string CTAs; build green |
| **E — Polish + QA** | 🔲 Pending | Dedupe rich content; 3-page spot-check; empty FAQ MDs |

---

## 1. Pipeline (what → how)

```
sub-services/*.md
  → scripts/convert-sub-services-md.js
  → data/sub-services-md.js          (48 entries)
  → data/sub-services.js overlay     (getServicePage / cleanMdSections / hasMdSections / cta)
  → app/(landing)/[mainservice]/[subservice]/page.js
  → service-hero + ContentSections (MD) | DynamicSections (curated)
  → FAQ / Process / Pricing / ServiceRichContent (curated + MD extras)
```

| Layer | Path |
|-------|------|
| MD sources | `sub-services/` (~48 files) |
| Converter | `scripts/convert-sub-services-md.js` |
| Generated | `data/sub-services-md.js` (**48** entries) |
| Overlay | `data/sub-services.js` (`cleanMdSections`, `hasMdSections`, `cta: md.cta`) |
| Runtime sanitizers | `lib/subservice-utils.js` (`stripCtaArtifacts`, `cleanMojibake`, linkify) |
| Hero | `components/landing/sub-services/service-hero.jsx` |
| MD body UI | `components/landing/main-service/content-sections/*` (shared with mains) |
| Curated fallback | `DynamicSections.jsx`, `ServiceRichContent.jsx` |

**Counts:** ~130 live pages · **48 MD / 48 slug-matched** · ~88 curated-only · ecommerce/PWA/support aliases fixed.

---

## 2. Content extraction (converter)

### 2.1 What we extract

| Field | Source in MD | Notes |
|-------|--------------|-------|
| `slug` / `categorySlug` / `url` | First URL / Service schema / filename | Aliases: ecommerce, PWA typo, dapp, NLP, etc. |
| `metaTitle` / `metaDescription` / `metaKeywords` | Meta blocks | Keywords cleaned of CTA/noise lines |
| `h1` | `## **H1: …**` or bold headings | Strip `H1:` prefix; skip meta headings |
| `intro[]` | Paras between page H1 and next heading | **Never** metaDescription; CTA lines skipped but **captured** into `cta` |
| `sections[]` | `#{1–4} **Heading**` blocks | Lists, tables, prose; noise headings dropped |
| `section.cta` | `**Primary CTA:**` / `**Secondary CTA:**` inside that block | Attached to that section |
| `cta` (page) | First / merged CTA pair across doc | `{ primary, secondary }` **strings** |
| `tables` / `costFactors` / `whyChoose` / `faqs` / `jsonLd` | Structured blocks | FAQ answers strip CTA scaffold text |
| `relatedLinks` | Internal markdown links | Relative paths under domain |

### 2.2 CTA extraction rules (critical)

MD authors write bold labels like:

```md
**Primary CTA:** Book a Free Consultation
 **Secondary CTA:** Request a Custom Software Quote
```

Important details:

1. Colon often sits **inside** the bold: `**Primary CTA:**` (not `**Primary CTA**:`).
2. Secondary line may have a leading space.
3. Intro collector used to **skip** CTA lines without saving them — fixed: `collectIntroFrom` now merges into `out.cta`.
4. Section loop tracks `sectionCta` per heading and pushes `{ …, cta: sectionCta }`.
5. Regex is line-bounded (`[^\n]+`) so secondary never swallows the rest of the file.
6. Converter `stripCtaArtifacts` removes CTA scaffold from body **text**; labels live on `cta` / `section.cta`.
7. Runtime `lib/subservice-utils.stripCtaArtifacts` returns `{ text, primaryCta, secondaryCta }` for any leftover inline CTAs (e.g. FAQ answers).

Regenerate after converter changes:

```bash
node scripts/convert-sub-services-md.js
```

### 2.3 Intro quality gates (`finalizeIntro`)

Reject: metaDesc/title clones, CTA-only lines, `---`, short non-sentences, URL fragments, “Discuss Your…” stubs.

---

## 3. Overlay (`data/sub-services.js`)

Non-destructive merge per slug:

| Field | Behaviour |
|-------|-----------|
| `h1` | MD if not corrupted else override |
| `intro` | MD if non-empty else override |
| `sections` | `cleanMdSections(md.sections)` when usable |
| `hasMdSections` | `true` when clean MD sections exist → page uses ContentSections |
| `cta` | `md.cta \|\| override.cta` |
| meta / tables / cost / why / faqs / links | MD preferred when present |
| Curated cards / process / pricing / checklist | Always override / base |

`cleanMdSections` drops noise headings and empty stubs; **keeps** sections that only have `cta` (closing CTAs).

---

## 4. UI contract (what the page shows)

### 4.1 Hero (`service-hero.jsx`) — revised Sep 23

```
H1            ← page.h1 || title
Tagline       ← short curated lead (hidden if duplicates H1/intro or too long)
Description   ← full intro[] paragraphs (not Overview split)
Primary CTA   ← page.cta.primary  → /contact-us
Secondary CTA ← page.cta.secondary → /contact-us if quote/consult language
                else category / parent service link
Feature pills ← curated page.bullets / highlights when present
```

**Change vs mains:** Sub pages do **not** use a separate Overview for intro. Long MD intro stays in the hero.

### 4.2 MD body — ContentSections (when `hasMdSections`)

Shared package (also used on main-service pages):

```
components/landing/main-service/content-sections/
  ContentSections.jsx      ← composer + jump nav + chapter layout
  ContentJumpNav.jsx       ← plain chapter anchors
  lib.js                   ← GROUP_PATTERNS, normalizeCtaLabel / normalizePageCta
  primitives.jsx           ← RenderedBody, ContentCtaButtons, cards, tables
  groups/
    OverviewContent.jsx
    ServicesContent.jsx
    CapabilitiesContent.jsx
    HowItWorksContent.jsx
    TechnologyContent.jsx
    UseCasesContent.jsx
    InvestmentContent.jsx
    DeliverablesContent.jsx
    DetailsContent.jsx     ← 2-col grid; odd last card spans 2 cols
```

**UX improvements shipped:**

- Replaced weak accordion / long undifferentiated cards with **chapter reading layout**
- Jump nav tracks active chapter via IntersectionObserver
- Closing “Ready to…” sections get page CTAs as **buttons** (not raw `Primary CTA:` text)
- GBP / £ on pricing cards (UK market)

### 4.3 CTA shape: main vs sub (build fix)

| Source | `cta.primary` shape |
|--------|---------------------|
| Sub-service MD overlay | **string** e.g. `"Book a Free Consultation"` |
| Main-service data | **object** `{ heading, subheading, description, buttonText, buttonUrl }` |

ContentSections must never render the object as a React child. Use `normalizeCtaLabel` / `normalizePageCta` in `lib.js` (also hardens `ContentCtaButtons` / `RenderedBody`).

### 4.4 Other CTAs wired to `page.cta`

| Component | Mapping |
|-----------|---------|
| `FAQSection` | Bottom card: primary + optional secondary |
| `ProcessSection` | Footer CTA row |
| `PricingSection` | Tier button labels |
| Final MD section (`Ready to…`) | `section.cta` + merge page secondary |

Curated-only pages (`!hasMdSections`) still use `DynamicSections` + standalone tables.

### 4.5 What stays curated

Process phases, pricing tiers, services cards, engineering checklist, tech stack map, industries, testimonials, case studies — from overrides / shared data, not MD chapter parse.

---

## 5. How we improved things (summary)

| Problem | Fix |
|---------|-----|
| Meta description dumped as intro | H1-gated `collectIntroFrom` + `finalizeIntro` |
| MD sections never on page | Overlay + `hasMdSections` + ContentSections |
| Accordion / long cards | Chapter groups + jump nav + Details grid |
| `Primary CTA:` visible as text | Strip in convert + runtime; render `ContentCtaButtons` |
| Secondary CTA always null / “View all services” | Colon-inside-bold regex; intro CTA capture; hero secondary from MD |
| CTAs only on hero | Section `cta` + FAQ/Process/Pricing props |
| Pricing showed $ / AUD | Force £ / `en-GB` |
| Button `className` swallowed | `button.jsx` merge fix |
| Build crash on `/mobile-development` | Normalize main-service object CTAs before render |
| Overview duplicated hero copy | Removed Overview split; full intro in hero only |

---

## 6. Phases A–E detail

### A — Converter harden + regenerate ✅
Ported main intro rules; reject metaDesc-as-intro; noise headings; live slug aliases; filename/schema URL preference; **48/48** regenerated.

**Census (post-A):** empty intro 0 · meta-as-intro 0 · noise sections 0 · slug miss 0 · empty FAQs ~7 (source MD gaps).

### B — Overlay adapters ✅
`cleanMdSections()` + `hasMdSections` + `cta` overlay. Preserves curated fields for non-MD slugs.

### C — Hero (revised) ✅
Full intro in hero; no Overview section on sub pages; CTAs from `page.cta`.

### D / D2 / D3 / D4 — Sections + CTAs + build ✅
ContentSections chapters; CTA end-to-end; main/sub CTA normalize; `next build` green.

### E — Polish + QA 🔲
- Spot-check: `custom-software-development`, `frontend-development`, one NLP/AI page  
- Fill or accept empty FAQ MDs (support/NLP gaps)  
- Light density / dedupe between ContentSections and ServiceRichContent  
- Confirm GBP + CTA labels on pricing/FAQ/process visually  

---

## 7. Out of scope / deferred

(Also in `SERVICE-CONTENT-TRACKER.md` § Deferred)

- ~88 new sub-service MD files  
- `sub-services-listings.js` split (perf)  
- Industry+service combos  
- Main Phase E (4 missing main MDs)  
- Lighthouse / GSAP removal  
- Brand token changes  

---

## 8. Operator cheat sheet

```bash
# After editing MD or converter
node scripts/convert-sub-services-md.js

# Verify one page’s CTAs
node --input-type=module -e "import { getServicePage } from './data/sub-services.js'; console.log(getServicePage('custom-software-development').cta);"

# Production build
npm run build
```

**Slug check (always):** menu title slugify ≡ override.slug ≡ md.slug ≡ main-services subServices[].slug

---

**Next action:** Phase E — polish + 3-page QA spot-check; then optionally start ~88 override-only MD backlog.
