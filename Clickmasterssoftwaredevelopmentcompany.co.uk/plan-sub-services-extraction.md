# Plan: Sub-Services MD → Data → UI

**Generated:** September 23, 2026  
**Last Updated:** September 23, 2026  
**Status:** Phases A–D done — overlay + hero/Overview + MD sections wired (Sep 23)

**Mirror of (completed mains):** [`plan-main-services-extraction.md`](./plan-main-services-extraction.md) (§10 = UI contract)  
**Tracker:** [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md)

---

## 0. Focus index (only these three)

| Doc | Role | Status |
|-----|------|--------|
| **This file** | Sub-services extraction + UI wiring | **NEXT** |
| [`plan-main-services-extraction.md`](./plan-main-services-extraction.md) | Main MD + UI (done; E deferred) | ✅ |
| [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md) | Counts, per-slug status, deferred backlog | Living |

---

## 0.1 Executive decision

| Decision | Choice | Why |
|----------|--------|-----|
| **Do first** | Converter harden + regenerate | Intro ≠ metaDesc; noise sections |
| **Do second** | Overlay `sections` | MD body extracted but never merged |
| **Do third** | Hero + Overview UI | Same contract as mains §10 |
| **Do fourth** | Wire MD sections into page | DynamicSections is curated-only |
| **Defer** | ~88 override-only new MDs | Later |
| **Keep curated** | `servicesCards`, process, pricing, checklist, tech | MD weak for those shapes |

**Scope (locked):** ~48 MD files / ~42 slug-matched pages. No 88 new MDs this sprint.

---

## 0.2 Progress log

| Phase | Status | Notes |
|-------|--------|-------|
| **Docs consolidate** | ✅ Done Sep 23 | Single focus set; removed old umbrella + duplicate UI plan |
| **A — Converter harden** | ✅ Done Sep 23 | H1-gated intro; reject metaDesc; noise filter; live slug aliases; URL/filename resolve; regenerated 48 |
| **B — Overlay adapters** | ✅ Done Sep 23 | `cleanMdSections` + `hasMdSections`; overlay `sections` |
| **C — Hero + Overview** | ✅ Done Sep 23 (revised) | Full intro in hero; no Overview split on sub-pages |
| **D — Sections UI** | ✅ Done Sep 23 | ContentSections when MD; DynamicSections curated-only fallback |
| **E — Polish + QA** | 🔲 Pending | Dedupe rich content; 3-page spot-check |

---

## 1. Current pipeline

```
sub-services/*.md
  → scripts/convert-sub-services-md.js
  → data/sub-services-md.js
  → data/sub-services.js overlay (getServicePage)
  → app/(landing)/[mainservice]/[subservice]/page.js
  → components/landing/sub-services/*
```

| Layer | Path |
|-------|------|
| MD sources | `sub-services/` (~48 files) |
| Converter | `scripts/convert-sub-services-md.js` |
| Generated | `data/sub-services-md.js` (**48** entries, regenerated Sep 23) |
| Overlay | `data/sub-services.js` (~line 15240) |
| Hero | `components/landing/sub-services/service-hero.jsx` |
| Rich / sections | `ServiceRichContent.jsx`, `DynamicSections.jsx` |

**Counts:** ~130 live pages · **48 MD / 48 slug-matched to overrides** · ~88 curated-only · ecommerce/PWA orphans fixed · support MDs included.

---

## 2. What is broken (vs mains)

| Main fix | Sub today |
|----------|-----------|
| Intro ≠ metaDesc | ✅ Fixed (Phase A) — 0 meta-as-intro, 0 empty intro |
| Hero H1 + tagline + short meta | ✅ Phase C — `service-hero.jsx` |
| Overview for full intro | ✅ Phase C — reuses main `OverviewSection` |
| MD `sections` on page | ✅ Phase B+D — overlay + `ContentSections` |
| Slug consistency | ✅ Fixed — ecommerce, PWA, technical-support |
| Fresh convert | ✅ 48/48 on disk → `sub-services-md.js` |

---

## 3. Hero contract (same as main §10)

```
H1          ← MD h1 (if clean) else curated title
Tagline     ← curated lead (short)
Description ← metaDescription (short)
CTAs        ← keep existing
```

Full `intro[]` → Overview under hero. MD `sections` → ContentSections-style UI. Keep curated cards/process/pricing.

---

## 4. Phases A–E

### A — Converter harden + regenerate ✅
Ported main intro rules (`finalizeIntro`, `isPageH1Line`, `collectIntroFrom`); reject metaDesc-as-intro; filter noise headings; aliases target live routes (`ecommerce-development`, `progressive-web-app-development`); URL resolve prefers filename/schema 2-seg paths; regenerated 48 entries.

**Census (post-A):** empty intro 0 · meta-as-intro 0 · noise sections 0 · slug miss 0 · empty FAQs 7 (source MD gaps — Phase E / deferred).

### B — Overlay adapters ✅
`cleanMdSections()` filters noise/empty stubs; overlays `md.sections` when clean; sets `hasMdSections` for UI routing. Keeps `isCorruptedH1` / `cleanMetaKeywords`.

### C — Hero + Overview ✅
`service-hero.jsx`: H1 ← `page.h1`, tagline ← short curated `lead`, description ← `metaDescription` via `getHeroDescription`. Full `intro[]` → main `OverviewSection` under hero. `ServiceRichContent` gets `hideIntro` when Overview is shown.

### D — Wire MD sections ✅
`ContentSections` when `hasMdSections`; curated `DynamicSections` + standalone tables only when no MD sections. TOC collapses MD body to a single “Details” item.

### E — Polish + QA
Light density; update tracker; spot-check custom-software, frontend-development, one NLP/AI page.

---

## 5. Out of scope / deferred backlog

(Also listed in `SERVICE-CONTENT-TRACKER.md` § Deferred)

- ~88 new sub-service MD files  
- `sub-services-listings.js` split  
- Industry+service combos  
- Main Phase E (4 missing main MDs)  
- Lighthouse / GSAP removal  
- Brand token changes  

---

**Next action:** Start Phase E (polish + 3-page QA spot-check).
