# Plan: ClickMasters Content Migration — Industry+Service Combo Pages

**Generated:** June 20, 2026
**Purpose:** Convert 202 industry+service combo DOCX files into `data/industries.js` and wire to existing route
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

## 3. Industries Covered (202 files)

| Industry | File Count | Example Services |
|----------|-----------|-----------------|
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

## 4. Data File Design

### File: `data/industries.js`

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
  // ... 201 more
];

// Lightweight listing data
export const industryListings = industries.map(
  ({ id, slug, industry, service, title, metaDesc, badges }) =>
    ({ id, slug, industry, service, title, metaDesc, badges })
);

// Lookup by slug
export function getIndustryBySlug(slug) {
  return industries.find(i => i.slug === slug) || null;
}

// Get all industries for a category
export function getIndustriesByCategory(industry) {
  return industries.filter(i => i.industry === industry);
}

// Get unique industries with counts
export function getIndustriesList() {
  const map = {};
  industries.forEach(i => {
    if (!map[i.industry]) map[i.industry] = { industry: i.industry, count: 0, slug: i.industry };
    map[i.industry].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

// Get related services (same industry, different service)
export function getRelatedIndustries(slug, limit = 3) {
  const current = getIndustryBySlug(slug);
  if (!current) return [];
  return industries
    .filter(i => i.slug !== slug && i.industry === current.industry)
    .slice(0, limit);
}

// For generateStaticParams
export function getAllIndustrySlugs() {
  return industries.map(i => i.slug);
}

export { industries };
```

---

## 5. Route Integration

### Existing Route: `app/(landing)/[category]/[service]/page.js`

Currently uses `data/sub-services.js`. After conversion:
- Change import from `data/sub-services.js` to `data/industries.js`
- Update function calls: `getServicePage()` → `getIndustryBySlug()`
- The route already handles: sections, pricingTiers, faqs — all present in new data
- Add `industry` field for breadcrumb/navigation

### New Listing Route: `app/(landing)/[category]/page.js`

Industry listing page showing all services for that industry:
- Uses `getIndustriesByCategory(industry)` for server-side filtering
- Card grid layout with title, badges, description

---

## 6. Execution Plan

- [x] **Step 1:** Analyze 5 Industries DOCX files — 13-table structure confirmed
- [ ] **Step 2:** Create conversion script `scripts/convert-industries.js`
- [ ] **Step 3:** Run script on 202 files → generate `data/industries.js`
- [ ] **Step 4:** Add lightweight data helpers
- [ ] **Step 5:** Update existing `app/(landing)/[category]/[service]/page.js` to use `data/industries.js`
- [ ] **Step 6:** Create `app/(landing)/[category]/page.js` (industry listing page)
- [ ] **Step 7:** Run production build and verify all pages pre-render

---

## 7. Success Metrics

| Metric | Target |
|--------|-------:|
| Documents parsed | 202 |
| Unique pages (after dedup) | ~202 |
| Industries covered | ~16 |
| Detail pages static | ~202 |
| Industry listing pages | ~16 |
| Data file | `data/industries.js` |
| Parsing errors | 0 |

**End of Plan**
