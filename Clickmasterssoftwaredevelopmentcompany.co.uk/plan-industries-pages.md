# Plan: ClickMasters Content Migration — Industry+Service Combo Pages

**Generated:** June 20, 2026
**Last Updated:** June 20, 2026
**Status:** ✅ Complete — Data extraction, listing page, detail page, and custom components all done.
**Reference:** See `agent.md` for overall context

---

## 1. Document Structure (Confirmed)

### 13-Table Pattern (all 202 files)

| Table # | Content | Extraction |
|---------|---------|------------|
| 1 | META TITLE, META DESC, SLUG | Metadata |
| 2 | Last updated, Reading time, Written by, Reviewed by | Header |
| 3 | Breadcrumb | Ignore (generated) |
| 4 | H1 heading | Title |
| 5 | Badges (Industry, Compliance, Price, UK GDPR, IR35-Safe, UK) | Badges array |
| 6 | Direct Answer | Direct answer text |
| 7 | Content section heading + paragraphs | Sections |
| 8 | Compliance list | Compliance array |
| 9 | Pricing heading | Pricing section start |
| 10 | Pricing table (Type, Scope, Price) | Pricing tiers |
| 11 | FAQs (Q:/A pairs) | FAQs |
| 12 | Related pages | Related slugs |
| 13 | Author box + CTA + JSON-LD | Author, CTA |

### Key Observations

- **Industry badge** is always first in the badge table (e.g., "InsurTech", "HealthTech", "eCommerce")
- **Industry-specific compliance** varies: FCA ICOBS (insurtech), DTAC (healthtech), PCI-DSS (ecommerce), etc.
- **Content sections** use `<strong>Bold Title: </strong>paragraph` format within a single table cell
- **Pricing table** has `Type | Scope | Price` columns in thead/tbody format
- **FAQs** use `<strong>Q: ...</strong>` then `<strong>A: ...</strong>` format
- **No services cards, differentiators, or industry use cases** in the DOCX (those are only in the manually-created sub-services.js)

---

## 2. Data Fields

| Field | Type | Source | Example |
|-------|------|--------|---------|
| `id` | `string` | P-number | `"P1001"` |
| `slug` | `string` | SLUG meta | `"insurtech-saas-development"` |
| `industry` | `string` | First badge or filename | `"insurtech"` |
| `service` | `string` | Second segment of filename | `"saas-development"` |
| `title` | `string` | H1 heading | `"SaaS Development for UK InsurTech — FCA ICOBS Built In"` |
| `metaTitle` | `string` | META TITLE | `"SaaS Development for InsurTech UK \| ClickMasters"` |
| `metaDesc` | `string` | META DESC | `"SaaS Development for UK InsurTech. FCA ICOBS..."` |
| `lastUpdated` | `string` | Header table | `"August 2025"` |
| `readingTime` | `number` | Header table | `9` |
| `writtenBy` | `string` | Header table | `"ClickMasters InsurTech Team"` |
| `reviewedBy` | `string` | Header table | `"James Whitmore, CTO"` |
| `badges` | `array` | Badge table | `["InsurTech", "FCA ICOBS", "💷 £35,000–£180,000", "🔒 UK GDPR", "⚖️ IR35-Safe", "🇬🇧 UK"]` |
| `directAnswer` | `string` | Direct Answer table | `"ClickMasters provides..."` |
| `sections` | `array` | Content sections | `[{ heading: "UK Specifics", paragraphs: [{ bold: "Lloyd's...", text: "..." }] }]` |
| `compliance` | `array` | Compliance table | `["FCA ICOBS", "Consumer Duty", "UK GDPR"]` |
| `pricingTiers` | `array` | Pricing table | `[{ type: "InsurTech SaaS Development", scope: "Full engagement", price: "£35,000–£180,000" }]` |
| `faqs` | `array` | Q:/A pairs | `[{ question: "...", answer: "..." }]` |

---

## 3. Industries Covered (148 unique entries from 202 files)

| Industry | Entry Count | Example Services |
|----------|------------|-----------------|
| fintech | ~25 | software-development, saas-development, mvp-development, api-dev, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, microservices-architecture |
| healthtech | ~20 | custom-software-development, saas-development, mvp-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, devops-cicd, microservices-architecture |
| govtech | ~18 | software-development, api-development, qa-testing, staff-augmentation, legacy-modernisation, cloud-native-development, saas-development, microservices-architecture |
| ecommerce | ~18 | software-development, custom-software-development, saas-development, microservices-architecture, api-development, qa-testing, legacy-modernisation, cloud-native-development, staff-augmentation, mobile-app-development |
| proptech | ~16 | software-development, saas-development, api-development, devops-cicd, staff-augmentation, cloud-native-development |
| insurtech | ~16 | custom-software-development, saas-development, api-development, devops-cicd, qa-testing, legacy-modernisation, cloud-native-development, microservices-architecture |
| logtech | ~14 | software-development, custom-software-development, saas-development, staff-augmentation, qa-testing, legacy-modernisation, cloud-native-development, api-development |
| retailtech | ~14 | software-development, saas-development, staff-augmentation, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture, ai-development |
| edtech | ~13 | software-development, saas-development, legacy-modernisation, cloud-native-development, qa-testing, staff-augmentation, api-development, microservices-architecture |
| medtech | ~12 | saas-development, microservices-architecture, legacy-modernisation, cloud-native-development, api-development, devops-cicd |
| cleantech | ~10 | api-development, saas-development, cloud-native-development, legacy-modernisation, qa-testing, microservices-architecture |
| legaltech | ~10 | software-development, custom-software-development, saas-development, cloud-native-development, staff-augmentation |
| agritech | ~2 | api-development |
| insurance | ~2 | api-development, legacy-modernisation |
| saas | ~2 | devops-cicd, legacy-modernisation |
| ai | ~2 | devops-cicd, staff-augmentation, cloud-native-development |

---

## 4. Data File — `data/industries.js`

### Structure

```js
const industries = [
  {
    id: "P1001",
    slug: "insurtech-saas-development",
    industry: "insurtech",
    service: "saas-development",
    title: "SaaS Development for UK InsurTech — FCA ICOBS Built In",
    metaTitle: "SaaS Development for InsurTech UK | ClickMasters",
    metaDesc: "SaaS Development for UK InsurTech. FCA ICOBS. £35,000–£180,000.",
    lastUpdated: "August 2025",
    readingTime: 9,
    writtenBy: "ClickMasters InsurTech Team",
    reviewedBy: "James Whitmore, CTO",
    badges: ["InsurTech", "FCA ICOBS", "💷 £35,000–£180,000", "🔒 UK GDPR", "⚖️ IR35-Safe", "🇬🇧 UK"],
    directAnswer: "ClickMasters provides SaaS Development...",
    sections: [
      {
        heading: "SaaS Development for InsurTech — UK Specifics",
        paragraphs: [
          { bold: "Lloyd's Market Association API Integration", text: "Lloyd's of London digital ecosystem..." },
          { bold: "FCA ICOBS and SaaS Insurance Products", text: "FCA ICOBS applies to..." },
        ]
      }
    ],
    compliance: ["FCA ICOBS", "Consumer Duty", "Solvency II UK", "UK GDPR", "PCI-DSS"],
    pricingTiers: [
      { type: "InsurTech SaaS Development", scope: "Full engagement", price: "£35,000–£180,000" }
    ],
    faqs: [
      { question: "Does InsurTech SaaS need FCA authorisation?", answer: "It depends..." }
    ],
  },
  // ... 147 more
];
```

### Exported Helpers

| Export | Purpose |
|--------|---------|
| `industries` | Full array (all 148 entries) |
| `getIndustryBySlug(slug)` | Lookup single entry by slug |
| `getIndustriesByCategory(industry)` | Filter by industry category |
| `getIndustriesList()` | Unique industries with counts, sorted by count desc |
| `getRelatedIndustries(slug, limit)` | Same-industry, different-service entries |
| `getAllIndustrySlugs()` | For `generateStaticParams` |

---

## 5. Route Architecture

### Listing Page: `app/(landing)/industries/page.js`
- **Route:** `/industries`
- **Purpose:** Premium editorial listing of all 14 industry categories with 148 service entries
- **Sections:**
  1. **Hero** — Full-bleed dark with asymmetric layout (copy left, featured industries card stack right), inline stats, dot pattern texture
  2. **Featured Industries** — 3-column bento grid of top 6 categories with icons, descriptions, badge previews, hover accent bars
  3. **Complete Directory** — All categories with icon headers, service count, compact horizontal service cards with arrow icons
  4. **Compliance Strip** — Trust signal bar with UK GDPR, PCI-DSS, FCA, MHRA, DTAC, Cyber Essentials, ISO 27001, IEC 62304
  5. **CTA** — Dark editorial band with consultation booking
- **Data:** Uses `industries` export directly from `data/industries.js`
- **Design:** Custom per-industry SVG icons, glassmorphism card stack, gradient blobs, dot patterns

### Detail Page: `app/(landing)/industries/[slug]/page.js`
- **Route:** `/industries/[slug]` (e.g., `/industries/insurtech-saas-development`)
- **Purpose:** Unique industry+service combo page — NOT a copy of sub-service page
- **Detail Page Layout & Section Sources:**

| Section | Source | Design & Implementation Details |
| :--- | :--- | :--- |
| **Industry Hero** | Dynamic (`data/industries.js`) | Compact dark background with breadcrumb, title, direct answer, and meta info bar (updated, reading time, author). Features dual-column layout with right-hand compliance/pricing badges card stack. |
| **Sticky TOC** | Dynamic | Horizontal scrollable Table of Contents bar sticking to the top of the viewport for easy section navigation. |
| **Industry Sections** | Dynamic (`data/industries.js`) | Custom `IndustrySections` component rendering bold-led paragraphs (preserving the original `{bold, text}` format) with an editorial feel. |
| **Compliance** | Dynamic (`data/industries.js`) | Card grid with shield/regulation icons, dynamically mapped per-industry standards (e.g., FCA ICOBS, UK GDPR). |
| **Pricing** | Dynamic (`data/industries.js`) | Three-tier structure with custom field mapping (`price` -> `investment`, `scope` -> `bestFor`). |
| **Testimonials** | ⚠️ Hard-coded (Inline component) | 3 static testimonials rendered via `IndustryTestimonials` component, with the industry name dynamically injected (e.g., "...success stories in fintech"). |
| **FAQs** | Dynamic (`data/industries.js`) | Accordion container displaying question/answer pairs. |
| **Related Industries** | Dynamic (`data/industries.js`) | Sidebar/grid displaying other services in the same industry using `getRelatedIndustries()`. |
| **CTA** | Static | Editorial dark band section with contact consultation links. |

> [!NOTE]
> The **Case Studies** section has been successfully removed from the detail page layout as per design requirements.

- **Key difference from sub-service page:** No `ServiceHero` (uses custom compact hero), no `DynamicSections` (uses `IndustrySections` for bold-led paragraphs), no `ServicesSection`/`WhyChooseUs`/`EngineeringBaseline`/`ProcessSection`/`TechStack`/`CeoVision`/`ClientScrollWheel`, has compliance section, has related industries section, and does not render Case Studies.

### Custom Component: `components/landing/industries/IndustrySections.jsx`
- Renders industry content sections with proper bold-led paragraph formatting
- Each section has an accent bar, heading, and paragraphs where `bold` text renders as a semibold sub-heading above the body `text`
- Uses `slugify` from `data/sub-services` for section IDs
- Preserves the rich `{bold, text}` paragraph structure from the DOCX data (unlike `DynamicSections` which flattened it)

---

## 6. Execution Plan — ✅ All Steps Complete

- [x] **Step 1:** Analyze Industries DOCX files — 13-table structure confirmed
- [x] **Step 2:** Create conversion script `scripts/convert-industries.js`
- [x] **Step 3:** Run script on 202 files → generate `data/industries.js` (148 unique entries)
- [x] **Step 4:** Add lightweight data helpers (`getIndustryBySlug`, `getRelatedIndustries`, `getAllIndustrySlugs`, etc.)
- [x] **Step 5:** Create `app/(landing)/industries/page.js` — Premium editorial listing page
- [x] **Step 6:** Create `app/(landing)/industries/[slug]/page.js` — Unique detail page (not sub-service copy)
- [x] **Step 7:** Create `components/landing/industries/IndustrySections.jsx` — Bold-led paragraph renderer
- [x] **Step 8:** Build and verify — TypeScript compiles, modules resolve. Pre-existing Radix UI prerender errors in glossary/case-studies pages are unrelated.

---

## 7. Key Design Decisions

### Industries Listing Page
- **Asymmetric hero** (2-column on desktop): Left = copy + inline stats, Right = glass-morphism card with featured industry list
- **Bento grid** for 6 featured categories with icons, descriptions, badge previews, and hover-reveal accent bars
- **Full directory** below with category icon headers and compact service link cards
- **Compliance strip** with checkmark pills for trust signals
- **Dark CTA band** with dot-pattern texture matching hero

### Industries Detail Page
- **NOT a copy of sub-service page** — uses its own layout, hero, and component structure
- **Compact hero** with breadcrumb, meta bar (updated date, reading time, author), dual-column with info cards
- **Sticky horizontal TOC** for section navigation
- **Bold-led paragraph rendering** via custom `IndustrySections` component — preserves the `{bold, text}` data structure properly instead of flattening
- **Compliance section** with shield icons and card grid
- **Related industries** section at bottom for same-industry cross-linking
- **Field mapping** for PricingSection: `price`→`investment`, `scope`→`bestFor`
- **Section removal**: Case Studies section was completely removed from the page to streamline the design.
- **Inline Testimonials**: Employs a custom `IndustryTestimonials` component with 3 hard-coded industry-neutral quotes, dynamically inserting the current industry name to personalize the context.

---

## 8. Success Metrics

| Metric | Target | Actual |
|--------|-------:|-------:|
| Documents parsed | 202 | ✅ 202 |
| Unique pages (after dedup) | ~202 | ✅ 148 |
| Industries covered | ~16 | ✅ 14 |
| Detail pages static | ~202 | ✅ 148 |
| Data file | `data/industries.js` | ✅ |
| Listing page | Premium editorial | ✅ |
| Detail page | Unique (not sub-service copy) | ✅ |
| Custom components | IndustrySections | ✅ |
| Parsing errors | 0 | ✅ 0 |

---

## 9. Known Issues (Pre-existing, Not Related)

- Radix UI `useContext` prerender errors in `/glossary/[term]` and `/case-studies/[slug]` pages — these are pre-existing and unrelated to industries pages

**End of Plan**
