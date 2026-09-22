# Plan: Main-Service UI / UX Polish

**Last Updated:** September 22, 2026  
**Related:** [`plan-main-services-extraction.md`](./plan-main-services-extraction.md)

## Phase G — Design polish (status)

| Step | Status | Notes |
|------|--------|-------|
| Hero lead / no typewriter / CTA wiring | Done | `intro[0]` lead; tagline demoted when H1 is long |
| Overview band | Done | Remaining `intro.slice(1)` under hero |
| Section reorder + surface rhythm | Done | Narrative order in `main-service.jsx` |
| Explore / Process / Pricing density | Done | Lighter borders, less shadow lift |
| ContentSections | Restored | Was deferred; **155 MD sections** were orphaned — wired again after Explore |
| FeaturedInsights | Deferred | Curated/API; not MD |
| Spot-check sample routes | Done | Logic smoke tests for 3 slugs |

## Content field → UI map

| MD / overlay field | UI consumer | Status |
|--------------------|-------------|--------|
| `h1` | Hero | Wired |
| `intro[0]` | Hero lead | Wired |
| `intro[1+]` | Overview | Wired |
| `sections` (+ tables) | ContentSections | Wired (restored) |
| `childServices` / `subServices` | Explore | Wired (gated children → curated subs) |
| `useCases` | PainPoints | Wired when ≥3 |
| `process` / `deliverables` | ProcessPage | Wired |
| `whyChoose` | WhyChooseUs | Curated `whyChooseUsData` (intentional) |
| `techStack` | TechStack | Wired when present (sparse on some MDs) |
| `industries` | Industries | Wired when present (often empty) |
| `costFactors` / `engagementModels` | Pricing | Wired |
| `faqs` | FaqSection | Wired |
| `cta` | Hero + FinalCTA | Wired when present |
| FeaturedInsights | — | Deferred (not MD) |

## Known sparse fields (converter/MD, not UI)

- `techStack` / `industries` empty on several slugs → components fall back to curated defaults
- `childServices` gated when polluted → Explore uses curated `subServices`
- Software/Web often missing MD `cta` → Hero defaults to consultation CTAs

## Out of scope (unchanged)

Sub-service redesign, brand token changes, Phase E missing MD files, Lighthouse library removals.
