# Plan: Main-Service UI / UX Polish

**Last Updated:** September 22, 2026  
**Related:** [`plan-main-services-extraction.md`](./plan-main-services-extraction.md) · [`SERVICE-CONTENT-TRACKER.md`](./SERVICE-CONTENT-TRACKER.md)

**Design read:** B2B agency service landings for UK buyers; preserve OKLCH tokens + Sora/DM Sans; redesign-preserve (not a new brand).

**Scope:** Main-service pages only — `app/(landing)/[mainservice]/` + `components/landing/main-service/*`.

---

## 1. What we did (summary)

| Area | Change |
|------|--------|
| **Hero** | Fixed title / tagline / description mapping so first viewport matches the intended design |
| **Overview** | New section under hero: MD intro copy + image layout + calm scroll motion |
| **Page rhythm** | Reordered sections, alternating `bg-background` / `bg-surface`, lighter card chrome |
| **ContentSections** | Restored after it was accidentally deferred (155 MD sections orphaned) |
| **Converter (prior)** | Intro no longer grabs Meta Description; H1-gated collection |
| **Docs** | This file + extraction Phase G + tracker Phase G |

---

## 2. Issues we removed — and how

### 2.1 Hero showed wrong copy

| Symptom | Cause | Fix |
|---------|--------|-----|
| Description was short SEO blurb that looked “wrong” vs MD body | Converter treated **Meta Description** as `intro` | Harden `convert-main-services-md.js`: collect intro only after page H1; skip bare meta labels / keyword stubs |
| Description became a long “Looking for…” wall | UI polish used `intro[0]` (truncated) as hero lead | Hero description = **`metaDescription`** (fallback curated `description`); full intro → Overview |
| Tagline missing (“Decentralized Future Solutions”) | UI polish **hid** tagline whenever H1 contained `Services UK` | Always show curated `tagline` when short marketing line; hide only if duplicate of H1/description or too long |
| Typewriter + dual headlines competing | Hero did too many jobs | Removed typewriter; single H1 + tagline + short description + CTAs |

**Current hero contract**

```
Badge (optional, curated heroBadge)
H1          ← MD h1 (e.g. "Blockchain & Web3 Development Services UK")
Tagline     ← curated tagline (e.g. "Decentralized Future Solutions")
Description ← metaDescription (short scannable)
CTAs        ← serviceData.cta when present, else defaults
```

Helpers live in [`hero-section.jsx`](components/landing/main-service/hero-section.jsx):
- `getHeroDescription()` — meta / description (not intro dump)
- `getOverviewParas()` — full MD `intro[]` for Overview
- `shouldShowTagline()` — show marketing line unless duplicate/noise

### 2.2 Overview / MD body missing

| Symptom | Cause | Fix |
|---------|--------|-----|
| Long MD intros never readable under hero | Hero ate or truncated intro | Overview section shows full `intro` |
| **155 body sections** invisible | UI polish deferred `ContentSections` | Re-wired after Explore in [`main-service.jsx`](app/(landing)/[mainservice]/main-service.jsx) |
| Overview looked flat | Text-only band | Left image `/landing/main-services/people-starting-business-project.png`, right copy; framer-motion entrance + hover (respects `prefers-reduced-motion`) |

### 2.3 Page felt heavy / card-noisy

| Symptom | Cause | Fix |
|---------|--------|-----|
| Scroll fatigue | ~14 sections, uneven weight | Narrative order + surface alternation |
| Heavy shadows / lift on Explore, Process, Pricing | Dense SaaS-card chrome | Lighter borders, less shadow, calmer hover |
| FeaturedInsights competing | Thin curated band | Deferred (not MD); can restore later if needed |

---

## 3. Current page section order

```
Breadcrumb
Hero
Overview          ← image left, intro text right
Explore           ← childServices or curated subServices
ContentSections   ← MD sections + tables
PainPoints        ← useCases when ≥3
Process           ← process + deliverables
WhyChooseUs       ← curated whyChooseUsData (intentional)
TechStack
Industries
Pricing           ← curated tiers + MD costFactors / engagementModels
TrustedClients / Apps / Testimonials
FAQ               ← MD faqs
FinalCTA
```

---

## 4. Content field → UI map (authoritative)

| Field | Source | UI | Notes |
|-------|--------|-----|-------|
| `h1` | MD | Hero title | Prefer over curated `title` |
| `tagline` | Curated `mainServicesData` | Hero subline | Show when short marketing line |
| `metaDescription` | MD | Hero description | Short scannable |
| `description` | Curated | Hero fallback | If meta thin |
| `intro[]` | MD | Overview | Full paragraphs + links |
| `sections` / `tables` | MD | ContentSections | Restored |
| `childServices` | MD (gated) | Explore | Else curated `subServices` |
| `useCases` | MD | PainPoints | When ≥3 |
| `process` / `deliverables` | MD | ProcessPage | |
| `whyChoose` | Curated SoT | WhyChooseUs | MD often not card-shaped |
| `techStack` / `industries` | MD when present | Tech / Industries | Often sparse → curated fallback |
| `costFactors` / `engagementModels` | MD | Pricing extras | |
| `faqs` | MD | FaqSection | |
| `cta` / `ctaText` | MD normalized | Hero + FinalCTA | Software/Web often missing → defaults |

---

## 5. Key files touched

| File | Role |
|------|------|
| [`scripts/convert-main-services-md.js`](scripts/convert-main-services-md.js) | Intro after H1; meta/keyword noise filters |
| [`data/main-services-md.js`](data/main-services-md.js) | Regenerated output (9 entries) |
| [`data/main-services.js`](data/main-services.js) | Overlay + normalizers (Phase A) |
| [`hero-section.jsx`](components/landing/main-service/hero-section.jsx) | Title / tagline / description / CTAs |
| [`OverviewSection.jsx`](components/landing/main-service/OverviewSection.jsx) | Intro + image + motion |
| [`main-service.jsx`](app/(landing)/[mainservice]/main-service.jsx) | Section order + ContentSections restore |
| Explore / Process / Pricing / FAQ | Density / spacing polish |

---

## 6. What to update when changing content or UI

### Content (MD → live)

1. Edit `main-services/*.md`
2. Run `node scripts/convert-main-services-md.js`
3. Confirm `data/main-services-md.js` intro/h1/metaDescription
4. Spot-check `/[slug]` hero (meta short) + Overview (full intro) + ContentSections

### Hero copy rules (do not break)

- **Do not** put long intro paragraphs in the hero description slot
- **Do not** hide tagline solely because H1 ends with “Services UK”
- **Do** keep Overview as the home for MD `intro[]`

### Overview image

- Asset: `public/landing/main-services/people-starting-business-project.png`
- Constant: `OVERVIEW_IMAGE` in `OverviewSection.jsx`

### Adding a new main service with MD

1. Add MD + run converter  
2. Ensure curated entry in `mainServicesData` has `tagline`, `heroBadge`, `subServices`  
3. Verify hero mapping with the three-slot contract above  
4. See [`AGENTS.md`](AGENTS.md) §13 slug consistency

---

## 7. Known remaining gaps (not bugs in wiring)

| Gap | Status |
|-----|--------|
| 4 mains without MD (AI, Data, Cloud/DevOps, Testing) | Phase E deferred |
| Sparse `techStack` / `industries` on several MDs | Curated fallbacks |
| `childServices` gated when polluted | Explore uses curated subs |
| Software / Web often lack MD `cta` | Default consultation CTAs |
| FeaturedInsights | Deferred on purpose |
| Turbopack `next/font` build quirk | Use `next build --webpack` if needed |

---

## 8. Phase G checklist

| Step | Status |
|------|--------|
| Hero title / tagline / description contract | ✅ |
| Remove typewriter; CTA from `serviceData.cta` | ✅ |
| Overview band + image left / text right | ✅ |
| Overview motion (reduced-motion safe) | ✅ |
| Section reorder + surface rhythm | ✅ |
| Explore / Process / Pricing density | ✅ |
| Restore ContentSections (155 sections) | ✅ |
| Converter intro ≠ meta description | ✅ |
| Docs / tracker updated | ✅ |

---

## Out of scope (unchanged)

- Sub-service page redesign  
- New brand colors/fonts  
- Phase E (4 missing MD files)  
- Lighthouse / remove GSAP library pass (separate backlog)
