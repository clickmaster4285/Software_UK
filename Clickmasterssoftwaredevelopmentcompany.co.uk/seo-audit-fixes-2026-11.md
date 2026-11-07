# SEO Audit Fixes — clickmasterssoftwaredevelopmentcompany.co.uk

**Trackers:**  
- `clickmasters-seo-developer-tracker-2026-11-05.xlsx`  
- `clickmasters-seo-developer-tracker-2026-11-06.xlsx` (confirmation re-crawl)

**Domain:** https://clickmasterssoftwaredevelopmentcompany.co.uk  
**Last updated:** 7 November 2026  
**Status:** Code fixes complete — deploy, then Screaming Frog re-crawl to mark tickets Verified

---

## 1. Original tickets (CSU-01 … CSU-04)

| Ticket | Priority | Finding | Resolution | Code / notes |
|--------|----------|---------|------------|--------------|
| **CSU-01** | P0 | `/contact-us`, `/software-solutions`, privacy CTA 404s | Fixed (5 Nov / 6 Nov Verified) | CTAs → `/contact`; `/contact-us` 308 → `/contact`; `/software-solutions` 308 → `/case-studies`; `/privacy-policy` 200 |
| **CSU-02** | P1 | Fake/contradictory stats, pravatar, `sale@`, € pricing | Fixed in code; owner confirmed figures 7 Nov | Homepage/StatsBanner/service heroes: **200+ projects / 50+ clients / 5+ years**; email **sales@…**; pricing **£50 to £1,000+**; pravatar removed earlier |
| **CSU-03** | P2 | Weak case-study inlinks, long/dupe titles, shared pagination titles | Fixed (6 Nov Verified) + hardened | Related case studies on main services + industries; circulant related links (4 peers); unique `metaTitle`s ≤60; pagination unique titles then later canonicalised to hub |
| **CSU-04** | P3 | HTML &gt;300 KB, heavy images, missing alt/size, empty hubs | Improved in code | Tech-stack marquee no longer duplicates icons in SSR HTML; below-fold main/sub sections `ssr: false`; Lucide Check → CSS dots; pricing/hero alts + dimensions; `/solutions` & `/projects` are real hubs |

---

## 2. Issues first seen 5 Nov (follow-ups)

| Issue | 6 Nov crawl | Resolution |
|-------|-------------|------------|
| Structured-data parse error on `/software-development` | FIXED | Strip leaked MD JSON-LD (`\#` / `\[`) from section bodies via `stripCtaArtifacts` in `lib/subservice-utils.js` |
| `sale@` / `support@clickmasters.uk` | FIXED | All public contact → `sales@clickmasterssoftwaredevelopmentcompany.co.uk` |
| Footer LinkedIn → `https://linkedin.com/` (301) | UNCHANGED on 6 Nov | **Removed** generic LinkedIn/GitHub footer icons (no real company profile URL) |
| 13 indexable pages missing from sitemap | IMPROVED | `/privacy-policy` added to `sitemap-main.xml`; pagination variants no longer need listing |
| Titles over 60 / descriptions over 155 / short titles | IMPROVED | `withBrandSuffix` + `clampDescription` in `app/metadata-config.js`; fuller metaTitles for Testing & QA, Cloud & DevOps, Data Services, Case Studies |
| Paginated `/case-studies?page=N` indexable | IMPROVED | All `?page=` / `?sector=` / `?q=` variants canonicalise to `/case-studies` + `noindex,follow` |

---

## 3. New observations from 6 Nov confirmation crawl

| Issue | Resolution |
|-------|------------|
| Seven sitemap hubs unlinked (hire, locations, glossary, salary, comparison, resource, industries) | Footer **Resources** column + Resources mega-menu “Guides & Hubs” link to listing pages |
| Phone typo / inconsistency (`+44798856086`, `+44 (7988) 56 086`) | Canonical **+44 7988 576086** / `tel:+447988576086` in footer, privacy, `siteConfig`, `llms.txt`, AGENTS |
| Hire copy `£5,000/mo/month` | Bulk replace `/mo/month` → `/month` in `data/hire-pages.js` |
| Malformed hire slugs (`…-stoke-on/trent`, `…-letchworth-garden/city`, etc.) | Corrected to `stoke-on-trent`, `letchworth-garden-city`, `burton-on-trent`, `southend-on-sea` |
| Page weight still high (64 HTML docs &gt;300 KB) | See CSU-04 weight work below |

---

## 4. CSU-04 page-weight work (7 Nov)

**Root cause:** Tech-stack marquees duplicated each icon 4–8× in SSR HTML; main/sub pages also SSR’d heavy icon/GSAP/testimonial sections.

**Changes:**
- `components/landing/sub-services/TechStack.jsx` — static unique grid (no marquee DOM duplication)
- `app/(landing)/[mainservice]/main-service.jsx` — `ssr: false` for Process, PainPoints, TrustedClients, TechStack, Industries, Testimonials, Apps, ScrollSnake
- Sub-service page — CaseStudy / Testimonials / CeoVision stay dynamically imported with SSR (Server Components cannot use `ssr: false`); TechStack stays light SSR; main-service client page still uses `ssr: false` for heavy sections
- Content list bullets — CSS dots instead of Lucide `Check` SVGs
- Homepage `TrustedBy` — logo track not doubled until client mount

**Done when (re-crawl):** no HTML page over 250 KB; no image over 200 KB; Images Missing Alt = 0.

---

## 5. Owner decisions recorded

| Item | Decision |
|------|----------|
| Trust stats | **Confirmed** 200+ Projects, 50+ Clients, 5+ Years |
| Public email | `sales@clickmasterssoftwaredevelopmentcompany.co.uk` |
| Homepage pricing currency | GBP (`£50 to £1,000+`) |
| LinkedIn footer icon | Remove until a real company profile URL is supplied |
| Phone | `+44 7988 576086` |

---

## 6. Key files touched

| Area | Files |
|------|--------|
| Contact / NAP | `app/metadata-config.js`, `components/Footer.js`, `app/(landing)/privacy-policy/page.js`, `public/llms.txt`, contact/FAQ |
| Trust stats | `app/(landing)/home/Benefits.js`, `components/StatsBanner.js`, `components/landing/sub-services/service-hero.jsx`, `TrustedClientsSection.jsx` |
| Case-study linking | `components/landing/main-service/RelatedCaseStudies.jsx`, `data/case-study-cards.js`, `data/case-studies.js` (`getRelatedCaseStudies`), industries detail page |
| Metadata | `app/metadata-config.js` (`withBrandSuffix`, `clampDescription`), main/sub service `generateMetadata`, `data/main-services.js` metaTitles |
| Pagination / sitemap | `app/(landing)/case-studies/page.js`, `scripts/generate-sitemaps.js` (+ regenerated `public/sitemap-*.xml`) |
| Hire data | `data/hire-pages.js` |
| Schema leak | `lib/subservice-utils.js`, content-section primitives |
| Weight | TechStack, main-service dynamics, subservice dynamics, TrustedBy, primitives |

---

## 7. Remaining after deploy

1. Run Screaming Frog with the same profile; mark tickets **Verified** when Done-when tests pass.
2. If any HTML pages still exceed 250–300 KB, do a second weight pass on those specific URLs.
3. Optional: restore LinkedIn icon only with the real company profile URL.

---

## 8. Crawl verdict snapshot (6 Nov)

| Ticket | Verdict 5 Nov | Verdict 6 Nov |
|--------|---------------|---------------|
| CSU-01 | FIXED | FIXED |
| CSU-02 | IMPROVED | FIXED |
| CSU-03 | UNCHANGED | FIXED |
| CSU-04 | IMPROVED | IMPROVED (further code work 7 Nov) |
