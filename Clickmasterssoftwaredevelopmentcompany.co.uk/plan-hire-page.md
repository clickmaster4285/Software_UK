# Plan: ClickMasters Content Migration — Hire Page

**Generated:** June 15, 2026  
**Purpose:** Execute hire-page conversion following the case-studies pattern  
**Reference:** See `agent.md` for overall context, `plan.md` for case-studies pattern

---

## 1. Project Context

### What We Did for Case Studies (Reference)
1. Created `scripts/convert-case-studies.js` to extract data from 280 DOCX files
2. Generated `data/case-studies.js` with extracted fields
3. Updated route from `[id]` to `[slug]`
4. Page now imports directly from data file (no API/MongoDB)

### What We're Doing Now: Hire Page
- **300 DOCX files** in `Clickmasterssoftwaredevelopmentcompany.co.uk/Hire-Page/`
- **Pattern:** `ClickMasters_P{ID}_hire_{role}_{city}.docx`
- **Goal:** Generate `data/hire-pages.js` → Create route `/hire/[role]/[city]/`

---

## 2. Document Structure Analysis

### Sample: `ClickMasters_P52_hire_react-developer_london.docx`

**HTML Structure:**

```html
<table>
  META TITLE: Hire a React Developer in London | IR35-Compliant | ClickMasters
  META DESC: Hire a vetted React Developer in London. IR35-compliant...
  SLUG: /hire-react-developer-london/
  SCHEMA: LocalBusiness + JobPosting + FAQPage + BreadcrumbList
</table>

<p>Last updated: June 2025 | Reading time: 8 min | Written by: ClickMasters Hiring Team | Reviewed by: James Whitmore, CTO</p>

<h1>Hire a Senior React Developer in London — UK-Vetted, IR35-Compliant</h1>

<table>
  🏙️ London | ⚖️ Zero IR35 Risk | 💷 £5,000/mo–£8,000/mo | ✅ 3-Stage Vetting | 🔄 30-Day Rolling | 🇬🇧 UK Right-to-Work Verified
</table>

<p><strong>Why London Businesses Choose ClickMasters for React Developers</strong></p>
<p>London has the deepest software engineering talent pool...</p>
<ul>
  <li>Zero IR35 liability...</li>
  <li>3-stage technical vetting...</li>
  ...
</ul>

<table>
  Engagement Type | Mid-Level | Senior | Technical Lead
  Monthly Rate (ClickMasters) | £5,000/mo | £6,500/mo | £8,000/mo
  ...
</table>

<table>
  <strong>Technical Skills — What Our React Developers Know</strong>
  Core Skills: React, Next.js, TypeScript, Redux...
</table>

<table>
  1 | Technical Assessment (2–3 hours) | ...
  2 | Reference & Background Check | ...
  3 | Communication & Culture Screen | ...
</table>

<table>
  IR35 Comparison Table
  Contractor Agency | ClickMasters
  IR35 assessment required? | Yes | No
  ...
</table>

<table>
  FAQ Section: Q&A pairs about hiring, rates, replacement guarantee
</table>
```

---

## 3. Extracted Data Fields

| Field | Source | Example |
|-------|--------|---------|
| `id` | P_Number from filename | `P52` |
| `slug` | SLUG meta | `/hire-react-developer-london/` |
| `title` | H1 heading | `Hire a Senior React Developer in London — UK-Vetted, IR35-Compliant` |
| `metaTitle` | META TITLE | `Hire a React Developer in London \| IR35-Compliant \| ClickMasters` |
| `metaDesc` | META DESC | `Hire a vetted React Developer in London...` |
| `role` | Filename pattern | `react-developer` |
| `city` | Filename pattern | `london` |
| `cityDisplay` | Badge table | `London` |
| `rate` | Badge table | `£5,000/mo–£8,000/mo` |
| `ir35Status` | Badge table | `Zero IR35 Risk` |
| `vettingStages` | Vetting table | Array of 3 stages |
| `ratesTable` | Rates table | Mid/Senior/Lead pricing |
| `skills` | Skills section | `React, Next.js, TypeScript...` |
| `benefits` | Why Choose list | Array of benefits |
| `faqs` | FAQ section | Array of Q&A |
| `lastUpdated` | Date line | `June 2025` |
| `readingTime` | Date line | `8 min` |

---

## 4. Current State

### ✅ Completed (Case Studies)
1. `scripts/convert-case-studies.js` created
2. `data/case-studies.js` generated with 274 unique entries
3. Route `app/(landing)/case-studies/[slug]/page.js` working

### ❌ Not Started (Hire Page)
1. `scripts/convert-hire-pages.js` - to be created
2. `data/hire-pages.js` - to be generated
3. Route `app/(landing)/hire/[role]/[city]/page.js` - to be created

---

## 5. Execution Plan

### Phase 1: Create Extraction Script

**File:** `scripts/convert-hire-pages.js`

```javascript
// Pseudocode
1. Read all .docx from Hire-Page/ folder
2. For each docx:
   a. Extract role + city from filename pattern
   b. Use mammoth.convertToHtml()
   c. Parse HTML to extract fields:
      - slug, metaTitle, metaDesc
      - title, cityDisplay, rate, ir35Status
      - benefits (ul > li items)
      - ratesTable (thead + tbody)
      - skills
      - vettingStages (3 tables)
      - ir35Comparison
      - faqs (Q&A pairs)
   d. Map to data structure
3. Handle duplicates: use lowest P_Number as canonical
4. Output: data/hire-pages.js
```

### Phase 2: Generate Data File

**Output:** `data/hire-pages.js`

```javascript
export const hirePages = [
  {
    id: "P52",
    slug: "hire-react-developer-london",
    role: "react-developer",
    city: "london",
    title: "Hire a Senior React Developer in London — UK-Vetted, IR35-Compliant",
    metaTitle: "Hire a React Developer in London | IR35-Compliant | ClickMasters",
    metaDesc: "Hire a vetted React Developer in London. IR35-compliant...",
    cityDisplay: "London",
    rate: "£5,000/mo–£8,000/mo",
    ir35Status: "Zero IR35 Risk",
    benefits: ["Zero IR35 liability", "3-stage technical vetting", ...],
    ratesTable: {...},
    skills: ["React", "Next.js", "TypeScript", ...],
    vettingStages: [...],
    faqs: [...],
    // ... all mapped fields
  },
  // ... 300 hire pages
];
```

### Phase 3: Create Route

**Route:** `app/(landing)/hire/[role]/[city]/page.js`

**Structure:**
```
app/(landing)/
├── hire/
│   ├── page.js                    # List all hire options (by role)
│   └── [role]/
│       └── [city]/
│           └── page.js             # Detail page for specific hire option
```

**URL Examples:**
- `/hire/react-developer/london`
- `/hire/python-developer/manchester`
- `/hire/full-stack-developer/edinburgh`

### Phase 4: Implement Page Components

**Components needed:**
1. `app/(landing)/hire/page.js` - Landing page listing all roles/cities
2. `app/(landing)/hire/[role]/[city]/page.js` - Detail page
3. `app/(landing)/hire/[role]/[city]/detail-client.js` - Client component with UI

---

## 6. Technical Details

### Libraries (Already Installed)
- `mammoth` — DOCX to HTML conversion ✅
- `jsdom` or `cheerio` — HTML parsing

### File Locations

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── Hire-Page/                     # 300 .docx files
│   ├── ClickMasters_P52_hire_react-developer_london.docx
│   └── ...
├── data/
│   └── hire-pages.js              # TO BE GENERATED
├── app/(landing)/hire/
│   ├── page.js                    # TO BE CREATED
│   └── [role]/
│       └── [city]/
│           └── page.js            # TO BE CREATED
└── scripts/
    └── convert-hire-pages.js      # TO BE CREATED
```

### Build Strategy
- Static Site Generation (SSG) with `generateStaticParams`
- All 300 hire pages pre-rendered at build time
- Expected output: ~300 static hire pages

---

## 7. Step-by-Step Actions

### Step 1: Parse First Hire Page
- [ ] Convert one hire docx to HTML using mammoth
- [ ] Identify field extraction patterns
- [ ] Verify structure with 2 more samples (different role + city)

### Step 2: Create Conversion Script
- [ ] Write `scripts/convert-hire-pages.js`
- [ ] Handle filename parsing (role + city extraction)
- [ ] Test on 5 files
- [ ] Debug extraction logic

### Step 3: Generate Data File
- [ ] Run script on all 300 hire pages
- [ ] Output `data/hire-pages.js`
- [ ] Verify count: ~300 entries (minus duplicates)

### Step 4: Create Route Structure
- [ ] Create `app/(landing)/hire/page.js` (list page)
- [ ] Create `app/(landing)/hire/[role]/[city]/page.js` (detail page)
- [ ] Add `generateStaticParams()` for SSG
- [ ] Test with one hire page

### Step 5: Implement UI Components
- [ ] Build detail-client.js with hire-page-specific UI
- [ ] Display rates table, vetting process, benefits, FAQs
- [ ] Add SEO metadata generation

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Hire pages converted | 300 |
| Data file entries | ~280 (after dedup) |
| Static pages generated | 300+ |
| Build time | 30-60 seconds |

---

## 9. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Route structure | `/hire/[role]/[city]/` | Matches hire page pattern: hire {role} in {city} |
| Data file | `data/hire-pages.js` | Follows case-studies pattern |
| Role/City extraction | From filename | Consistent, no parsing errors |
| Duplicate handling | Lowest P_Number | Same strategy as case studies |

---

## 10. Next Immediate Actions

1. Write extraction script for hire pages
2. Run on all 300 files → generate `data/hire-pages.js`
3. Create route `/hire/[role]/[city]/`
4. Test the page displays correctly

---

**End of Plan**