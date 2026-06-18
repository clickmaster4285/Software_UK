# Resource Guides — Paragraph Formatting Fix Plan

## Overview

The `data/resource-guides.js` file (10,374 lines, 83 DOCX source files, 63 unique resource guides, 228 content sections) had **337 paragraph formatting issues** across 4 categories. The root cause was in `scripts/convert-resource-guides.js` — the `extractContentSections()` and `extractParagraphsFromHtml()` functions did not properly handle checklist items, FAQ blocks, header artifacts, and related page links.

**Status: COMPLETE** — All 337 issues resolved. Commit: `30d9ae1`.

---

## All Errors Found

### Error Type 1: Merged Checklist Paragraphs (1 instance)

**Description:** A single paragraph string contained multiple checklist items separated by the `✓` Unicode check mark character. Instead of being split into individual paragraphs, all 10 items were crammed into one 593-character string.

**Location:**
- **Guide:** `uk-software-development-contract-guide`
- **Section:** s15 — "ClickMasters Contract Standards"
- **Paragraph:** p0

**Before (Wrong):**
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes: ✓ IP Assignment Agreement (100% ownership transferred on final payment) ✓ UK GDPR Article 28 Data Processing Agreement ✓ 30-day defect liability period post-launch ✓ Detailed acceptance criteria per user story (from Technical Discovery) ✓ Formal Change Request process for scope changes ✓ Source code and credentials delivery on request ✓ IR35 zero liability (our engineers are our employees) ✓ R&D Tax Credits qualifying activities documentation ✓ 30-day notice termination clause ✓ Named senior engineers — no undisclosed offshore subcontracting",
    "Custom Software Development UK: /custom-software-development/",
    "Fixed Price vs Time & Materials UK: /fixed-price-vs-time-materials-uk/",
    "IR35 Guide UK: /ir35-software-development/",
    "UK GDPR Software Guide: /uk-gdpr-software-development-guide/",
    "Related Pages"
  ]
}
```

**After (Correct):**
```json
{
  "title": "ClickMasters Contract Standards",
  "paragraphs": [
    "Every ClickMasters project contract includes:",
    "✓ IP Assignment Agreement (100% ownership transferred on final payment)",
    "✓ UK GDPR Article 28 Data Processing Agreement",
    "✓ 30-day defect liability period post-launch",
    "✓ Detailed acceptance criteria per user story (from Technical Discovery)",
    "✓ Formal Change Request process for scope changes",
    "✓ Source code and credentials delivery on request",
    "✓ IR35 zero liability (our engineers are our employees)",
    "✓ R&D Tax Credits qualifying activities documentation",
    "✓ 30-day notice termination clause",
    "✓ Named senior engineers — no undisclosed offshore subcontracting"
  ]
}
```

**Root Cause:** The `extractParagraphsFromHtml()` function had checklist splitting logic but only for the `✅` emoji (U+2705). The contract guide used `✓` (U+2013, Unicode check mark) which was a different character. Additionally, the `isStandaloneParagraph()` branch in `extractContentSections()` also only checked for `✅`.

---

### Error Type 2: FAQs Embedded in Paragraphs (~250 instances across ~55 guides)

**Description:** FAQ question/answer pairs (`Q: ...` / `A: ...`) appeared inside section `paragraphs` arrays. These same FAQs were **also** correctly extracted into the top-level `faqs` array by `extractFaqs()`. This meant FAQ content was duplicated — rendered both as paragraphs AND as FAQs on the frontend.

**Affected Guides (55 guides):**

| # | Guide Slug | Section Title | FAQ Q&A Pairs |
|---|---|---|---|
| 1 | `rd-tax-credits-software-development` | Common R&D Claim Mistakes for Software Companies | 2 |
| 2 | `how-much-does-software-development-cost-uk` | UK Day Rates by Role (2025) | 3 |
| 3 | `innovate-uk-smart-grants-guide` | How ClickMasters Supports Grant Applications | 3 |
| 4 | `cyber-essentials-software-development-guide` | Cyber Essentials for Software Development Companies | 2 |
| 5 | `iso-27001-software-development-guide` | ISO 27001 Scope for Software Development | 2 |
| 6 | `wcag-accessibility-guide-uk` | Manual vs Automated WCAG Testing | 2 |
| 7 | `open-banking-development-guide` | FCA Consumer Duty and Open Banking | 2 |
| 8 | `ir35-software-development-guide` | IR35 Cost Comparison | 3 |
| 9 | `nhs-fhir-r4-integration-guide` | UK GDPR Article 9 and FHIR R4 | 1 |
| 10 | `hmrc-making-tax-digital-integration-guide` | UK GDPR for MTD Integrations | 1 |
| 11 | `companies-house-api-integration-guide` | Rate Limiting and Best Practices | 1 |
| 12 | `rd-tax-credits-software-development-uk` | HMRC R&D Enquiries — What to Expect Post-2023 | 1 |
| 13 | `innovate-uk-funding-software-companies` | SBRI — Building Software for Government | 1 |
| 14 | `uk-gdpr-data-processor-agreement-guide` | IDTA — International Data Transfer Addendum | 1 |
| 15 | `dtac-compliance-guide` | DTAC for Different HealthTech Product Types | 1 |
| 16 | `pci-dss-software-development-guide` | FCA and UK GDPR — How PCI-DSS Interacts | 1 |
| 17 | `fixed-price-vs-time-materials-software-contract-uk` | How ClickMasters Fixed-Price Contracts Work | 1 |
| 18 | `technical-discovery-software-development-uk` | Who Should Attend a Technical Discovery? | 1 |
| 19 | `software-project-handover-checklist-uk` | UK GDPR Handover Obligations | 1 |
| 20 | `iso-27001-vs-cyber-essentials-uk` | When Each Certification Is Required | 1 |
| 21 | `graphql-vs-rest-api-guide-uk` | When GraphQL Is Genuinely the Right Choice | 1 |
| 22 | `hmrc-making-tax-digital-software-guide-uk` | MTD Compatible Software — HMRC Recognition | 1 |
| 23 | `open-banking-development-guide-uk` | Open Banking Use Cases — UK Market | 1 |
| 24 | `uk-saas-pricing-models-guide` | UK SaaS Pricing Page Best Practices | 1 |
| 25 | `uk-startup-software-development-guide` | MVP Build Checklist — What ClickMasters Covers | 1 |
| 26 | `uk-enterprise-software-procurement-guide` | UK Public Sector Procurement — G-Cloud and Digital | 1 |
| 27 | `uk-software-team-structure-guide` | In-House vs Agency vs Staff Augmentation | 1 |
| 28 | `technical-debt-guide-uk` | Compliance Debt — UK-Specific Priority | 1 |
| 29 | `ai-software-development-guide-uk` | ICO AI Auditing — What to Expect | 1 |
| 30 | `api-first-design-guide-uk` | Contract Testing for UK APIs | 1 |
| 31 | `iso-27001-certification-guide-uk` | UKAS-Accredited Certification Bodies in the UK | 1 |
| 32 | `observability-guide-uk-software` | NHS DSP Toolkit Observability Requirements | 1 |
| 33 | `uk-saas-technical-due-diligence-guide` | Regulated UK SaaS — FCA, NHS, GDS Specific Checks | 1 |
| 34 | `green-software-development-guide-uk` | Software Carbon Intensity (SCI) — Green Software Foundation | 2 |
| 35 | `uk-software-testing-guide` | Security Testing — UK Compliance Requirements | 2 |
| 36 | `uk-devops-guide` | Cyber Essentials DevOps Requirements | 2 |
| 37 | `microservices-architecture-guide-uk` | Microservices Operational Requirements — UK Cost Impact | 2 |
| 38 | `uk-mvp-development-guide` | UK GDPR — Non-Negotiable MVP Requirements | 2 |
| 39 | `uk-saas-architecture-guide` | UK SaaS Subscription Billing — Stripe Patterns | 2 |
| 40 | `uk-api-development-guide` | API Versioning Strategy for UK Regulated APIs | 2 |
| 41 | `uk-legacy-software-modernisation-guide` | The Technical Discovery — Why It Is Non-Negotiable | 2 |
| 42 | `uk-software-consulting-guide` | UK Technical Due Diligence — What Investors and Acquirers Check | 2 |
| 43 | `uk-staff-augmentation-guide` | UK Compliance in Staff Augmentation | 2 |
| 44 | `uk-open-banking-guide` | TrueLayer vs Yapily — UK Open Banking Aggregator Comparison | 2 |
| 45 | `uk-cloud-cost-optimisation-guide` | AWS Cost Dashboard — What ClickMasters Monitors | 2 |
| 46 | `uk-data-engineering-guide` | NHS Health Data Engineering — UK Specifics | 2 |
| 47 | `uk-mobile-app-development-guide` | NHS Mobile App Development — Additional Requirements | 2 |
| 48 | `uk-saas-pricing-guide` | UK SaaS Pricing and FCA Consumer Duty | 2 |
| 49 | `uk-software-cybersecurity-guide` | Cyber Essentials Annex A — Technical Requirements | 2 |
| 50 | `uk-ai-governance-guide` | UK GDPR and AI — Key Article 22 Requirements | 2 |
| 51 | `uk-product-led-growth-guide` | UK PLG Activation Metrics — What to Measure | 2 |
| 52 | `uk-api-strategy-guide` | UK API Rate Limiting — NHS and FCA Context | 2 |
| 53 | `uk-software-architecture-guide` | UK GDPR Data Architecture — Privacy by Design | 2 |
| 54 | `uk-fintech-compliance-guide` | AML/KYC Software Implementation | 2 |
| 55 | `uk-nhs-digital-development-guide` | NHS FHIR R4 UK Core — Most Used APIs and Resources | 2 |
| 56 | `uk-govtech-digital-development-guide` | GDS Service Assessment — Alpha/Beta/Live Evidence | 2 |
| 57 | `uk-legacy-modernisation-guide` | UK GDPR Data Migration Requirements | 2 |
| 58 | `uk-open-banking-developer-guide` | Variable Recurring Payments (VRP) — 2026 | 2 |
| 59 | `uk-software-startup-guide` | UK Startup Funding 2026 | 2 |
| 60 | `uk-software-architecture-guide-microservices` | Event-Driven Architecture for UK Regulated Systems | 2 |
| 61 | `uk-gdpr-software-guide` | UK GDPR Article 9 — Special Category Data | 2 |

**Before (Wrong) — Example from `innovate-uk-smart-grants-guide`:**
```json
{
  "title": "How ClickMasters Supports Grant Applications",
  "paragraphs": [
    "Technical section writing: articulating technological uncertainty and novelty in Innovate UK language",
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

**After (Correct):**
```json
{
  "title": "How ClickMasters Supports Grant Applications",
  "paragraphs": [
    "Technical section writing: articulating technological uncertainty and novelty in Innovate UK language",
    "Technology readiness level (TRL) assessment and progression plan",
    "Work package breakdown and milestone definitions",
    "R&D qualifying activities documentation (concurrent with project delivery)",
    "Project delivery: we build the technology the grant funds"
  ]
}
```
(FAQs are correctly in the top-level `faqs` array only.)

**Root Cause:** `extractContentSections()` processed gap content between tables and added ALL extracted `<p>` elements to paragraphs without filtering. The `extractFaqs()` function independently extracted FAQs from the full HTML, so FAQs ended up in both places — duplicated.

---

### Error Type 3: Header Artifacts in Paragraphs (65 instances)

**Description:** The strings `"FAQs"`, `"FAQ"`, or `"Related Pages"` appeared as standalone paragraph text. These were section headers from the DOCX that got extracted as paragraph content instead of being recognized as structural markers.

**Affected Guides:** Every guide that had FAQs embedded in paragraphs also had a `"FAQs"` header artifact (63 instances across ~55 guides). Additionally, `uk-software-development-contract-guide` and `uk-gdpr-software-compliance-checklist` had `"Related Pages"` artifacts (2 instances).

**Before (Wrong) — Example from `cyber-essentials-software-development-guide`:**
```json
{
  "title": "Cyber Essentials for Software Development Companies",
  "paragraphs": [
    "FAQs",
    "Q: Is Cyber Essentials mandatory for UK Government contracts?",
    "A: Yes — Cyber Essentials is mandatory for all UK Government contracts...",
    "Q: How much does Cyber Essentials cost?",
    "A: Cyber Essentials: £300–£500 (self-assessment, verified by certified assessor)..."
  ]
}
```

**After (Correct):**
```json
{
  "title": "Cyber Essentials for Software Development Companies",
  "paragraphs": []
}
```
(FAQs are in the top-level `faqs` array; the "FAQs" header is not a paragraph.)

**Root Cause:** When mammoth converted the DOCX, the "FAQs" text appeared as a `<p>` element in the gap between tables. `extractParagraphsFromHtml()` picked it up as a regular paragraph. There was no filtering for these structural header strings.

---

### Error Type 4: Related Page Links in Paragraphs (7 instances)

**Description:** Lines matching the pattern `"Page Title: /slug/"` appeared in paragraphs arrays. These were related page links that should only exist in the `relatedPages` array.

**Locations:**
- `uk-software-development-contract-guide` s15 — 4 link paragraphs
- `uk-gdpr-software-compliance-checklist` s6 — 3 link paragraphs

**Before (Wrong):**
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

**After (Correct):**
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
(Related pages are already in the `relatedPages` array.)

**Root Cause:** These link lines appeared in gap content after the last data table. `extractParagraphsFromHtml()` picked them up. They matched the pattern `"Title: /slug/"` which was distinct from normal paragraph text.

---

## Solution

### File Modified
`scripts/convert-resource-guides.js`

### Changes Made

#### Change 1: Extended `extractParagraphsFromHtml()` checklist splitting to handle `✓`

The existing ✅ split logic only handled the `✅` emoji (U+2705). Extended to also handle the `✓` Unicode check mark character (U+2013):

```javascript
// Split paragraphs that contain multiple checklist items (✅ or ✓) into individual items
const splitParagraphs = [];
for (const para of paragraphs) {
  if (para.includes('✅') || para.includes('✓')) {
    // Split on checkmark boundary — each checkmark starts a new item
    const parts = para.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0);
    splitParagraphs.push(...parts);
  } else {
    splitParagraphs.push(para);
  }
}
```

#### Change 2: Added filter in `extractParagraphsFromHtml()` to remove structural artifacts

Added a filter at the end of `extractParagraphsFromHtml()` to remove:
- Header artifacts: `"FAQs"`, `"FAQ"`, `"Related Pages"`, `"Related Pages:"`
- FAQ Q:/A: lines (already handled by `extractFaqs()`)
- Related page link lines matching pattern `"Title: /slug/"`

```javascript
// Filter out structural artifacts, FAQ lines, and related page links
return splitParagraphs.filter(p => {
  const t = p.trim();
  // Remove header artifacts
  if (t === 'FAQs' || t === 'FAQ' || t === 'Related Pages' || t === 'Related Pages:') return false;
  // Remove FAQ Q:/A: lines (handled by extractFaqs())
  if (/^Q:\s*.+/i.test(t)) return false;
  if (/^A:\s*.+/i.test(t)) return false;
  // Remove related page link lines (e.g. "Custom Software Development UK: /custom-software-development/")
  if (/^[A-Z][^:]+:\s*\/[a-z0-9\-]+\/?$/.test(t)) return false;
  return true;
});
```

#### Change 3: Extended `isStandaloneParagraph` branch to split checklist items

The `isStandaloneParagraph()` branch in `extractContentSections()` handled single-cell tables with ≥120 chars. This path also needed checklist splitting for both `✅` and `✓`:

```javascript
} else if (isStandaloneParagraph(table, text)) {
  // Standalone paragraph table — add as paragraph to current section or create new
  // Split checklist items (✅ or ✓) into individual paragraphs
  const paras = (text.includes('✅') || text.includes('✓'))
    ? text.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0)
    : [text];
  if (currentSection) {
    currentSection.paragraphs.push(...paras);
  } else {
    currentSection = {
      title: '',
      paragraphs: [...paras],
      table: null
    };
  }
}
```

### Why This Approach

Rather than patching the data file directly, the fix was applied at the conversion script level. This ensures:
1. **Regenerability** — the data file can be rebuilt from source DOCX files at any time
2. **Consistency** — all future conversions will handle these patterns correctly
3. **Single source of truth** — the conversion script is the authoritative transformer

---

## Execution Steps

1. **Backed up** `data/resource-guides.js` → `data/resource-guides.js.bak`
2. **Modified** `scripts/convert-resource-guides.js` with the 3 changes above
3. **Re-ran** conversion: `node scripts/convert-resource-guides.js` — 83 files processed, 63 unique guides, 0 errors
4. **Verified** with audit script — 337 issues → 0 issues
5. **Spot-checked** 4 key guides (contract, Innovate UK, IR35, GDPR checklist) — all correct
6. **Committed** both `scripts/convert-resource-guides.js` and `data/resource-guides.js` — commit `30d9ae1`
7. **Cleaned up** 9 temporary debug/audit/verify scripts

---

## Verification Results

### Audit Script Results

**Before fix:**
```
=== ISSUE TYPE 1: Merged checklist paragraphs (✓ items in one string) ===
  uk-software-development-contract-guide | s15 "ClickMasters Contract Standards" | p0 | 10 checkmarks | len=593

=== ISSUE TYPE 2: FAQs embedded in paragraphs ===
  (250 instances across 55 guides)

=== ISSUE TYPE 3: Header artifacts in paragraphs ===
  (65 instances across ~50 guides)

=== ISSUE TYPE 4: Related page links in paragraphs ===
  (7 instances across 2 guides)

=== TOTAL ISSUES: 337 ===
```

**After fix:**
```
=== ISSUE TYPE 1: Merged checklist paragraphs (✓ items in one string) ===

=== ISSUE TYPE 2: FAQs embedded in paragraphs ===

=== ISSUE TYPE 3: Header artifacts in paragraphs ===

=== ISSUE TYPE 4: Related page links in paragraphs ===

=== TOTAL ISSUES: 0 ===
```

### Spot-Check Results

**1. Contract Guide — "ClickMasters Contract Standards":**
- Paragraphs: 11 (1 intro + 10 individual ✓ items) ✅
- No related page links in paragraphs ✅
- Related pages: 4 (in `relatedPages` array) ✅

**2. Innovate UK — "How ClickMasters Supports Grant Applications":**
- Paragraphs: 5 (clean content only) ✅
- No "FAQs" header in paragraphs ✅
- No Q:/A: lines in paragraphs ✅
- FAQs in `faqs` array: 3 ✅

**3. IR35 — "IR35 Cost Comparison":**
- Paragraphs: 0 (all content is FAQ) ✅
- FAQs in `faqs` array: 3 ✅

**4. GDPR Checklist — "Section 7: Breach Response":**
- Paragraphs: 1 (clean content) ✅
- No related page links in paragraphs ✅
- Related pages: 3 (in `relatedPages` array) ✅

### Final Data Statistics

| Metric | Before | After |
|---|---|---|
| Total format issues | 337 | **0** |
| Merged checklist paragraphs | 1 | **0** |
| FAQ lines in paragraphs | ~250 | **0** |
| Header artifacts in paragraphs | 65 | **0** |
| Related page links in paragraphs | 7 | **0** |
| Unique resource guides | 63 | 63 |
| Total content sections | 228 | 228 |
| Total paragraphs | — | 740 |
| Total FAQs | — | 133 |
| Sections with empty title | 0 | 0 |
| Sections with empty content | 0 | 0 |

---

## Files Changed

| File | Change |
|---|---|
| `scripts/convert-resource-guides.js` | Extended checklist splitting (`✓` + `✅`), added filter for FAQs/headers/related-links |
| `data/resource-guides.js` | Regenerated from 83 DOCX files with clean output |

## Files Cleaned Up (Deleted)

| File | Reason |
|---|---|
| `scripts/spot-check.js` | Temporary spot-check script |
| `scripts/audit-format-issues.js` | Temporary audit script |
| `scripts/debug-empty-section.js` | Debug script from prior investigation |
| `scripts/verify-fixes.js` | Verification script from prior fix |
| `scripts/verify-fixes2.js` | Verification script from prior fix |
| `scripts/debug-resource-issues4.js` | Debug script from prior investigation |
| `scripts/debug-resource-issues3.js` | Debug script from prior investigation |
| `scripts/debug-resource-issues2.js` | Debug script from prior investigation |
| `scripts/debug-resource-issues.js` | Debug script from prior investigation |
| `data/resource-guides.js.bak` | Backup of pre-fix data |

## Git Commit

```
commit 30d9ae1
fix: resolve 337 paragraph formatting issues in resource guides

- Split merged ✓ checklist items into individual paragraphs (contract guide)
- Remove FAQ Q:/A: lines from paragraphs (already in faqs array) ~250 instances
- Remove header artifacts ('FAQs', 'Related Pages') from paragraphs ~65 instances
- Remove related page link lines from paragraphs (already in relatedPages) 7 instances
- Extend checklist splitting to handle both ✅ and ✓ characters
- Add filter in extractParagraphsFromHtml() to skip structural artifacts
- Update isStandaloneParagraph branch to split checklist items
- Audit: 337 issues → 0 issues across 63 guides, 228 sections, 740 paragraphs
```
