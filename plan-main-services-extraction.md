# Plan: Main Services MD → Data → Components

**Generated:** September 21, 2026  
**Last Updated:** September 22, 2026  
**Scope:** 9 MD files in `main-services/`, `scripts/convert-main-services-md.js`, `data/main-services-md.js`, `data/main-services.js` overlay, `app/(landing)/[mainservice]/`, `components/landing/main-service/*`  
**Goal:** Make MD the reliable content source for main-service pages — extract correctly, normalize shapes, map to components without breaking curated/API sections

**Related:** [`plan-services-improvement.md`](./plan-services-improvement.md) · [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md) · Canvas: `main-services-pipeline-analysis.canvas.tsx`

---

## 0. Executive Decision

| Decision | Choice | Why |
|----------|--------|-----|
| **Do first** | Shape adapters + Explore gating | UI blocked by field-shape mismatches, not missing files |
| **Do second** | Harden converter + fix MD source outliers | Empty/polluted fields (Support FAQs, process, children) |
| **Do third** | Component polish | deliverables, useCases, tech icons |
| **Defer** | 4 remaining MD files | AI, Data, Cloud/DevOps, Testing — **add later** |
| **Keep curated/API** | Pricing tiers, stats, clients, Apps, Insights, Testimonials | MD weak/absent |
| **Why Choose SoT** | Keep `whyChooseUsData.js` for UI | MD whyChoose is usually one section block, not benefit cards |

---

## 0.1 Progress log

| Phase | Status | Notes |
|-------|--------|-------|
| **A — Adapters + Explore gate** | ✅ Done Sep 22, 2026 | `getServiceData()` helpers + component defenses |
| **B — Converter harden** | ✅ Done Sep 22, 2026 | SECTION skip, FAQ fix, process/mobile H1 fix, Internal Links |
| **C — MD source outliers** | ✅ Done Sep 22, 2026 | Blockchain H1+JSON-LD; NLP placeholders; mobile URL; ML slug kept |
| **D — Component polish** | ✅ Done Sep 22, 2026 | deliverables band, useCases≥3, tech icons, engagement models |
| **E — 4 missing MD** | ⏸️ Deferred | AI, Data, Cloud/DevOps, Testing & QA |
| **F — Validation** | ✅ Done Sep 22, 2026 | Census OK; build **1586/1586** via `next build --webpack` |
| **G — UI/UX polish** | ✅ Done Sep 22, 2026 | Hero title/tagline/metaDesc; Overview + image; ContentSections restored; see [`plan-main-services-ui.md`](./plan-main-services-ui.md) |

---

## 1. Current State (Sep 22, 2026)

### 1.1 Pipeline

```
main-services/*.md
  → convert-main-services-md.js
  → data/main-services-md.js (9 entries)
  → getServiceData()  [enrich + MD overlay + Phase A normalizers]
  → page.js → main-service.jsx → components
```

### 1.2 All 9 MD files converted

| Slug | Parse notes |
|------|-------------|
| `software-development` | Best structured (tech + industries) |
| `web-development` | Solid |
| `mobile-development` | Weak structured parse |
| `design-ui-ux` | Best process |
| `cybersecurity` | Solid; process often empty |
| `machine-learning-ml` | Rich useCases; process empty |
| `blockchain-and-web3` | No JSON-LD in MD |
| `support-and-outsourcing` | FAQs often empty in array; polluted children gated |
| `nlp-computer-vision` | Placeholder FAQ noise; polluted children gated |

Missing MD (deferred): AI, Data Services, Cloud & DevOps, Testing & QA.

### 1.3 Three MD structural families

1. **H1-heavy** — software, UIUX, Cyber, ML, blockchain  
2. **H2-heavy** — web, mobile  
3. **SECTION scaffold** — support, NLP  

---

## 2. Phase A — DONE ✅

Implemented in `data/main-services.js` + small component fixes:

| Task | Result |
|------|--------|
| A.1 CTA normalize | String → `{ primary: { heading, buttonText, … } }` + `ctaText` for Hero |
| A.2 WhyChoose | Only overlay if ≥2 card-shaped items; else curated `whyChooseUsData` |
| A.3 Industries | `name \|\| title` |
| A.4 Children | `href`→`url`; fill missing href via `slugify(title)` ↔ curated `subServices` |
| A.5 Explore gate | Lists >15 or <2 valid routes → fall back to `subServices` (fixes NLP/Support) |

**Smoke check (getServiceData):**
- software: 10 children with valid URLs, 6 industries titled, 9 FAQs, 7 process  
- nlp / support: fall back to curated subServices; CTA headings work  
- whyChoose: curated SoT (MD section blocks not forced into cards)

**Files touched:**
- `data/main-services.js`
- `components/landing/main-service/ExploreSection.jsx`
- `components/landing/main-service/whyUs.jsx`
- `components/landing/main-service/industries-section.jsx`

---

## 3. Phase B — Converter harden ✅ DONE Sep 22, 2026

| # | Task | Result |
|---|------|--------|
| B.1 | Tighten `childServices` | ✅ Our/Core/Child only; cap 15; Internal Link hrefs |
| B.2 | Fix Support FAQ detection | ✅ 12 FAQs (was 0) |
| B.3 | Process across heading levels | ✅ cyber 8, ML 12, NLP 12, support 10, mobile 8 |
| B.4 | Broaden tech / industry / engagement | ✅ mobile tech; software engagement 4 |
| B.5 | Skip NLP placeholder FAQ | ✅ 15 clean FAQs (was 20 polluted) |
| B.6 | Preserve FAQ list items | ✅ |
| B.7 | Expand `relatedLinks` scan | ✅ |
| B.8 | Re-run converter | ✅ `main-services-md.js` regenerated |

**Extra fixes:** skip SECTION scaffolds; skip page H1 swallow; full ### child body + Internal Links.

---

## 4. Phase C — MD source fixes ✅ DONE Sep 22, 2026

| # | Task | Result |
|---|------|--------|
| C.1 | Blockchain: proper H1 + JSON-LD | ✅ `# **H1: …**` + Service/FAQPage/Breadcrumb |
| C.2 | NLP: remove placeholders | ✅ Real FAQ + CTA under SECTION 14/16; editorial notes removed |
| C.3 | Mobile URL → `/mobile-development` | ✅ URL fixed; added Primary CTA |
| C.4 | ML slug | ✅ **Keep `machine-learning-ml`** — already canonical across main/sub MD, routes, and data |

---

## 5. Phase D — Component polish ✅ DONE Sep 22, 2026

| # | Task | Result |
|---|------|--------|
| D.1 | Wire `deliverables[]` under ProcessPage | ✅ Chunked onto steps + “What You Receive” band |
| D.2 | Prefer MD `useCases` when length ≥ 3 | ✅ PainPointsSolutions gate |
| D.3 | Map tech names → icons | ✅ Fuzzy lookup from `aboutData` |
| D.4 | Engagement-models strip | ✅ Under PricingSection + prop from main-service.jsx |

---

## 6. Phase E — 4 missing MD ⏸️ DEFERRED

1. `artificial-intelligence-ai`  
2. `data-services`  
3. `cloud-and-devops`  
4. `testing-and-qa`  

---

## 7. Phase F — Validation ✅ DONE Sep 22, 2026

| # | Task | Result |
|---|------|--------|
| F.1 | Field census (9 MD + overlay) | ✅ No critical issues; all have h1, ≥9 FAQs, ≥7 process |
| F.2 | Sample data smoke | ✅ Overlay CTAs/process/children gated correctly |
| F.3 | Production build | ✅ **1586/1586** pages (`next build --webpack`; default Turbopack failed on `next/font/google` env issue) |
| F.4 | Canonical audit | ⏭️ Skipped — no route/slug renames this sprint |
| F.5 | Update `SERVICE-CONTENT-TRACKER.md` | ✅ 9/13 mains marked converted |

**Known non-blockers:** mobile MD JSON-LD uses `@graph` (page.js rebuilds schemas); software/web lack Primary CTA strings in MD; NLP `costFactors` empty after last convert (cost content may sit in sections).

---

## 8. Component source-of-truth rules

| Component | Prefer | Fallback |
|-----------|--------|----------|
| Hero | MD h1/intro; CTA label | Base stats/features |
| Explore | Gated MD children | Curated `subServices` |
| ContentSections | MD sections/tables | — |
| ProcessPage | MD process | lifecycle / defaults |
| TechStack | MD techStack | aboutData |
| WhyChooseUs | Curated whyChooseUsData | MD only if card-shaped |
| Pricing | Curated tiers + MD costFactors | — |
| Industries | MD (normalized) | Hardcoded |
| FaqSection | MD faqs | section-data |
| FinalCTA | Normalized MD CTA | Hardcoded |
| Apps / Insights / Testimonials / TrustedClients | API / curated | — |

---

## 9. Risks

| Risk | Mitigation |
|------|------------|
| Polluted children | Phase A gate ✅; Phase B tighten at source |
| WhyChoose MD looks worse | Curated SoT ✅ |
| ML slug drift | Phase C |
| Blockchain empty jsonLd | Page.js schemas; C.1 |

---

**Status:** Phase A–D + F + G complete — **E deferred** (4 remaining MD files)  
**UI polish (authoritative):** [`plan-main-services-ui.md`](./plan-main-services-ui.md) — hero contract, issues fixed, field→UI map, what to update next  
**Main Reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)
