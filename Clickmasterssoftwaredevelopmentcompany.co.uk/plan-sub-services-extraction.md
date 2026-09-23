# Plan: Sub-Services MD → Data → UI

**Generated:** September 23, 2026  
**Last Updated:** September 23, 2026  
**Status:** Ready to implement (docs consolidated; code not started)

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
| **A — Converter harden** | 🔲 Pending | Intro/H1/noise/aliases + regenerate |
| **B — Overlay adapters** | 🔲 Pending | Merge `md.sections` when clean |
| **C — Hero + Overview** | 🔲 Pending | Mirror main §10 hero contract |
| **D — Sections UI** | 🔲 Pending | ContentSections-style or DynamicSections MD path |
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
| Generated | `data/sub-services-md.js` (~44; stale vs disk) |
| Overlay | `data/sub-services.js` (~line 15240) |
| Hero | `components/landing/sub-services/service-hero.jsx` |
| Rich / sections | `ServiceRichContent.jsx`, `DynamicSections.jsx` |

**Counts:** ~130 live pages · ~42 with MD overlay · ~88 curated-only · 2 slug orphans (ecommerce/PWA) · 4 support MDs not in generated JS.

---

## 2. What is broken (vs mains)

| Main fix | Sub today |
|----------|-----------|
| Intro ≠ metaDesc | Converter still pollutes intro |
| Hero H1 + tagline + short meta | Uses curated `title`/`lead` |
| Overview for full intro | Intro mid-page in ServiceRichContent |
| MD `sections` on page | Overlay omits `sections` |
| Slug consistency | ecommerce/PWA aliases miss routes |
| Fresh convert | 4 support MDs missing from generated JS |

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

### A — Converter harden + regenerate
Port main intro rules; reject metaDesc-as-intro; filter noise headings; fix aliases (`ecommerce-development`, `progressive-web-app-development`); re-run converter; census.

### B — Overlay adapters
Overlay `sections` when clean; keep `isCorruptedH1` / `cleanMetaKeywords`.

### C — Hero + Overview
`service-hero.jsx` + Overview under hero; dedupe intro from ServiceRichContent.

### D — Wire MD sections
After Overview; curated DynamicSections only when no MD sections.

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

**Next action:** Start Phase A when you say go.
