# Resource Guides — Paragraph Formatting Fix Plan

## Overview

The `data/resource-guides.js` file (10,374 lines, 83 resource guides, 228 content sections) has **337 paragraph formatting issues** across 4 categories. The root cause is in `scripts/convert-resource-guides.js` — the `extractContentSections()` and `extractParagraphsFromHtml()` functions don't properly handle checklist items, FAQ blocks, header artifacts, and related page links.

---

## Issue Type 1: Merged Checklist Paragraphs (1 instance)

### Description
A single paragraph string contains multiple checklist items separated by the `✓` character. Instead of being split into individual paragraphs, all items are crammed into one long string.

### Location
- **File:** `data/resource-guides.js`
- **Guide:** `uk-software-development-contract-guide`
- **Section:** `s15` — "ClickMasters Contract Standards"
- **Paragraph:** `p0`
- **Content:** One paragraph with 10 checkmarks (593 chars)

### Current (Wrong)
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes: ✓ IP Assignment Agreement (100% ownership transferred on final payment) ✓ UK GDPR Article 28 Data Processing Agreement ✓ 30-day defect liability period post-launch ✓ ...",
    "Custom Software Development UK: /custom-software-development/",
    "Fixed Price vs Time & Materials UK: /fixed-price-vs-time-materials-uk/",
    "IR35 Guide UK: /ir35-software-development/",
    "UK GDPR Software Guide: /uk-gdpr-software-development-guide/",
    "Related Pages"
  ]
}
```

### Expected (Correct)
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes:",
    "✓ IP Assignment Agreement (100% ownership transferred on final payment)",
    "✓ UK GDPR Article 28 Data Processing Agreement",
    "✓ 30-day defect liability period post-launch",
    "✓ ..."
  ]
}
```

### Root Cause
`extractParagraphsFromHtml()` already has ✅ splitting logic but it only handles the `✅` emoji. The `✓` (Unicode check mark) used in this guide is a different character. The split logic needs to also handle `✓`.

Additionally, the related page links ("Custom Software Development UK: /custom-software-development/") and "Related Pages" text are mixed into the paragraphs array — these should be filtered out (they already exist in the `relatedPages` array).

---

## Issue Type 2: FAQs Embedded in Paragraphs (~250 instances)

### Description
FAQ question/answer pairs (`Q: ...` / `A: ...`) appear inside section `paragraphs` arrays. These same FAQs are **also** correctly extracted into the top-level `faqs` array by `extractFaqs()`. This means FAQ content is duplicated — rendered both as paragraphs AND as FAQs on the frontend.

### Affected Guides (50+ guides)
| Guide Slug | Section | FAQ Count |
|---|---|---|
| `rd-tax-credits-software-development` | Common R&D Claim Mistakes | 2 Q&A pairs |
| `how-much-does-software-development-cost-uk` | UK Day Rates by Role | 3 Q&A pairs |
| `innovate-uk-smart-grants-guide` | How ClickMasters Supports Grant Applications | 3 Q&A pairs |
| `cyber-essentials-software-development-guide` | Cyber Essentials for Software Dev Companies | 2 Q&A pairs |
| `iso-27001-software-development-guide` | ISO 27001 Scope | 2 Q&A pairs |
| `wcag-accessibility-guide-uk` | Manual vs Automated WCAG Testing | 2 Q&A pairs |
| `open-banking-development-guide` | FCA Consumer Duty and Open Banking | 2 Q&A pairs |
| `ir35-software-development-guide` | IR35 Cost Comparison | 3 Q&A pairs |
| `nhs-fhir-r4-integration-guide` | UK GDPR Article 9 and FHIR R4 | 1 Q&A pair |
| `hmrc-making-tax-digital-integration-guide` | UK GDPR for MTD Integrations | 1 Q&A pair |
| `companies-house-api-integration-guide` | Rate Limiting and Best Practices | 1 Q&A pair |
| `rd-tax-credits-software-development-uk` | HMRC R&D Enquiries | 1 Q&A pair |
| `innovate-uk-funding-software-companies` | SBRI | 1 Q&A pair |
| `uk-gdpr-data-processor-agreement-guide` | IDTA | 1 Q&A pair |
| `dtac-compliance-guide` | DTAC for Different HealthTech Product Types | 1 Q&A pair |
| `pci-dss-software-development-guide` | FCA and UK GDPR | 1 Q&A pair |
| `fixed-price-vs-time-materials-software-contract-uk` | How ClickMasters Fixed-Price Contracts Work | 1 Q&A pair |
| `technical-discovery-software-development-uk` | Who Should Attend a Technical Discovery? | 1 Q&A pair |
| `software-project-handover-checklist-uk` | UK GDPR Handover Obligations | 1 Q&A pair |
| `iso-27001-vs-cyber-essentials-uk` | When Each Certification Is Required | 1 Q&A pair |
| `graphql-vs-rest-api-guide-uk` | When GraphQL Is the Right Choice | 1 Q&A pair |
| `hmrc-making-tax-digital-software-guide-uk` | MTD Compatible Software | 1 Q&A pair |
| `open-banking-development-guide-uk` | Open Banking Use Cases | 1 Q&A pair |
| `uk-saas-pricing-models-guide` | UK SaaS Pricing Page Best Practices | 1 Q&A pair |
| `uk-startup-software-development-guide` | MVP Build Checklist | 1 Q&A pair |
| `uk-enterprise-software-procurement-guide` | UK Public Sector Procurement | 1 Q&A pair |
| `uk-software-team-structure-guide` | In-House vs Agency vs Staff Augmentation | 1 Q&A pair |
| `technical-debt-guide-uk` | Compliance Debt | 1 Q&A pair |
| `ai-software-development-guide-uk` | ICO AI Auditing | 1 Q&A pair |
| `api-first-design-guide-uk` | Contract Testing for UK APIs | 1 Q&A pair |
| `iso-27001-certification-guide-uk` | UKAS-Accredited Certification Bodies | 1 Q&A pair |
| `observability-guide-uk-software` | NHS DSP Toolkit Observability | 1 Q&A pair |
| `uk-saas-technical-due-diligence-guide` | Regulated UK SaaS | 1 Q&A pair |
| `green-software-development-guide-uk` | Software Carbon Intensity | 2 Q&A pairs |
| `uk-software-testing-guide` | Security Testing | 2 Q&A pairs |
| `uk-devops-guide` | Cyber Essentials DevOps Requirements | 2 Q&A pairs |
| `microservices-architecture-guide-uk` | Microservices Operational Requirements | 2 Q&A pairs |
| `uk-mvp-development-guide` | UK GDPR — Non-Negotiable MVP Requirements | 2 Q&A pairs |
| `uk-saas-architecture-guide` | UK SaaS Subscription Billing | 2 Q&A pairs |
| `uk-api-development-guide` | API Versioning Strategy | 2 Q&A pairs |
| `uk-legacy-software-modernisation-guide` | The Technical Discovery | 2 Q&A pairs |
| `uk-software-consulting-guide` | UK Technical Due Diligence | 2 Q&A pairs |
| `uk-staff-augmentation-guide` | UK Compliance in Staff Augmentation | 2 Q&A pairs |
| `uk-open-banking-guide` | TrueLayer vs Yapily | 2 Q&A pairs |
| `uk-cloud-cost-optimisation-guide` | AWS Cost Dashboard | 2 Q&A pairs |
| `uk-data-engineering-guide` | NHS Health Data Engineering | 2 Q&A pairs |
| `uk-mobile-app-development-guide` | NHS Mobile App Development | 2 Q&A pairs |
| `uk-saas-pricing-guide` | UK SaaS Pricing and FCA Consumer Duty | 2 Q&A pairs |
| `uk-software-cybersecurity-guide` | Cyber Essentials Annex A | 2 Q&A pairs |
| `uk-ai-governance-guide` | UK GDPR and AI | 2 Q&A pairs |
| `uk-product-led-growth-guide` | UK PLG Activation Metrics | 2 Q&A pairs |
| `uk-api-strategy-guide` | UK API Rate Limiting | 2 Q&A pairs |
| `uk-software-architecture-guide` | UK GDPR Data Architecture | 2 Q&A pairs |
| `uk-fintech-compliance-guide` | AML/KYC Software Implementation | 2 Q&A pairs |
| `uk-nhs-digital-development-guide` | NHS FHIR R4 UK Core | 2 Q&A pairs |
| `uk-govtech-digital-development-guide` | GDS Service Assessment | 2 Q&A pairs |
| `uk-legacy-modernisation-guide` | UK GDPR Data Migration Requirements | 2 Q&A pairs |
| `uk-open-banking-developer-guide` | Variable Recurring Payments | 2 Q&A pairs |
| `uk-software-startup-guide` | UK Startup Funding 2026 | 2 Q&A pairs |
| `uk-software-architecture-guide-microservices` | Event-Driven Architecture | 2 Q&A pairs |
| `uk-gdpr-software-guide` | UK GDPR Article 9 | 2 Q&A pairs |

### Current (Wrong)
```json
{
  "title": "How ClickMasters Supports Grant Applications",
  "paragraphs": [
    "Technical section writing: articulating technological uncertainty...",
    "Technology readiness level (TRL) assessment and progression plan",
    "Work package breakdown and milestone definitions",
    "R&D qualifying activities documentation (concurrent with project delivery)",
    "Project delivery: we build the technology the grant funds",
    "FAQs",
    "Q: What is the Innovate UK Smart Grant success rate?",
    "A: Overall success rate is approximately 5–15% depending on competition...",
    "Q: Can a startup apply for an Innovate UK Smart Grant?",
    "A: Yes — startups can apply as sole organisations or as part of collaborations...",
    "Q: How does ClickMasters support as a technical partner?",
    "A: ClickMasters can participate in Innovate UK applications as: technology delivery partner..."
  ]
}
```

### Expected (Correct)
```json
{
  "title": "How ClickMasters Supports Grant Applications",
  "paragraphs": [
    "Technical section writing: articulating technological uncertainty...",
    "Technology readiness level (TRL) assessment and progression plan",
    "Work package breakdown and milestone definitions",
    "R&D qualifying activities documentation (concurrent with project delivery)",
    "Project delivery: we build the technology the grant funds"
  ]
}
```
(The FAQs are already correctly in the top-level `faqs` array.)

### Root Cause
`extractContentSections()` processes gap content between tables and adds ALL extracted `<p>` elements to paragraphs. It doesn't filter out Q:/A: lines. The `extractFaqs()` function independently extracts FAQs from the full HTML, so FAQs end up in both places.

---

## Issue Type 3: Header Artifacts in Paragraphs (65 instances)

### Description
The strings `"FAQs"`, `"FAQ"`, or `"Related Pages"` appear as standalone paragraph text. These are section headers from the DOCX that got extracted as paragraph content instead of being recognized as structural markers.

### Affected Guides (65 instances across ~50 guides)
Every guide that has FAQs embedded in paragraphs also has a `"FAQs"` header artifact. Additionally, `uk-software-development-contract-guide` and `uk-gdpr-software-compliance-checklist` have `"Related Pages"` artifacts.

### Current (Wrong)
```json
{
  "title": "Cyber Essentials for Software Development Companies",
  "paragraphs": [
    "FAQs",
    "Q: Is Cyber Essentials mandatory for UK Government contracts?",
    "A: Yes — Cyber Essentials is mandatory for all UK Government...",
    ...
  ]
}
```

### Expected (Correct)
```json
{
  "title": "Cyber Essentials for Software Development Companies",
  "paragraphs": []
}
```
(FAQs are in the top-level `faqs` array; the "FAQs" header should not be a paragraph.)

### Root Cause
When mammoth converts the DOCX, the "FAQs" text appears as a `<p>` element in the gap between tables. `extractParagraphsFromHtml()` picks it up as a regular paragraph. There's no filtering for these structural header strings.

---

## Issue Type 4: Related Page Links in Paragraphs (7 instances)

### Description
Lines matching the pattern `"Page Title: /slug/"` appear in paragraphs arrays. These are related page links that should only exist in the `relatedPages` array.

### Locations
- `uk-software-development-contract-guide` s15 — 4 link paragraphs
- `uk-gdpr-software-compliance-checklist` s6 — 3 link paragraphs

### Current (Wrong)
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes: ✓ ...",
    "Custom Software Development UK: /custom-software-development/",
    "Fixed Price vs Time & Materials UK: /fixed-price-vs-time-materials-uk/",
    "IR35 Guide UK: /ir35-software-development/",
    "UK GDPR Software Guide: /uk-gdpr-software-development-guide/",
    "Related Pages"
  ]
}
```

### Expected (Correct)
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes:",
    "✓ IP Assignment Agreement (100% ownership transferred on final payment)",
    "✓ UK GDPR Article 28 Data Processing Agreement",
    ...
  ]
}
```
(The related pages are already in the `relatedPages` array.)

### Root Cause
These link lines appear in gap content after the last data table. `extractParagraphsFromHtml()` picks them up. They match the pattern `"Title: /slug/"` which is distinct from normal paragraph text.

---

## Solution

### File to Modify
`scripts/convert-resource-guides.js`

### Changes Required

#### 1. Update `extractParagraphsFromHtml()` — Add filtering

Add a filter at the end of `extractParagraphsFromHtml()` to remove:
- Lines that are exactly `"FAQs"`, `"FAQ"`, or `"Related Pages"`
- Lines matching the related page link pattern: `"Title: /slug/"` (contains `: /` and is short)
- Lines starting with `Q:` or `A:` (FAQ items — handled by `extractFaqs()`)

```javascript
function extractParagraphsFromHtml(rawHtml) {
  // ... existing extraction logic ...

  // FILTER: Remove structural artifacts and FAQ items
  return splitParagraphs.filter(p => {
    const t = p.trim();
    // Remove header artifacts
    if (t === 'FAQs' || t === 'FAQ' || t === 'Related Pages' || t === 'Related Pages:') return false;
    // Remove FAQ Q:/A: lines (handled by extractFaqs())
    if (/^Q:\s*.+/i.test(t)) return false;
    if (/^A:\s*.+/i.test(t)) return false;
    // Remove related page link lines (e.g. "Title: /slug/")
    if (/^[A-Z][^:]+:\s*\/[a-z0-9\-]+\/?$/.test(t)) return false;
    return true;
  });
}
```

#### 2. Update `extractParagraphsFromHtml()` — Handle `✓` checklist splitting

The existing ✅ split logic only handles the `✅` emoji. Extend it to also handle the `✓` (Unicode U+2013) check mark character:

```javascript
// Split paragraphs that contain multiple checkmark items into individual items
const splitParagraphs = [];
for (const para of paragraphs) {
  if (para.includes('✅') || para.includes('✓')) {
    // Split on checkmark boundary — each checkmark starts a new item
    const marker = para.includes('✅') ? '✅' : '✓';
    const parts = para.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0);
    // First part may be introductory text without a checkmark — keep it as-is
    splitParagraphs.push(...parts);
  } else {
    splitParagraphs.push(para);
  }
}
```

#### 3. Update `extractContentSections()` — Filter trailing gap content

In the trailing gap extraction (after the last relevant table), also filter out related page link lines and FAQ lines that appear between the last content table and the "Related Pages" / "AUTHOR" / "CTA" boundary tables.

This is already partially handled by the `extractParagraphsFromHtml()` filter above, but we should also ensure the boundary detection stops at the right tables.

### Execution Steps

1. **Backup** current `data/resource-guides.js`
2. **Modify** `scripts/convert-resource-guides.js` with the 3 changes above
3. **Re-run** conversion: `node scripts/convert-resource-guides.js`
4. **Verify** with audit script: `node scripts/audit-format-issues.js` → expect 0 issues
5. **Spot-check** key guides:
   - `uk-software-development-contract-guide` — checklist items split, no related page links
   - `innovate-uk-smart-grants-guide` — no FAQs in paragraphs
   - `ir35-software-development-guide` — no FAQs in paragraphs
   - `uk-gdpr-software-compliance-checklist` — no related page links in paragraphs
6. **Commit** both `scripts/convert-resource-guides.js` and `data/resource-guides.js`

### Expected Results After Fix

| Metric | Before | After |
|---|---|---|
| Total format issues | 337 | 0 |
| Merged checklist paragraphs | 1 | 0 |
| FAQ lines in paragraphs | ~250 | 0 |
| Header artifacts | 65 | 0 |
| Related page links in paragraphs | 7 | 0 |
| Total sections | 228 | ~228 (unchanged) |
| Guides with empty sections | 0 | 0 |

---

## Audit Script

The audit script `scripts/audit-format-issues.js` scans all 4 issue types and reports totals. Run it before and after the fix to verify.

```bash
node scripts/audit-format-issues.js
```
