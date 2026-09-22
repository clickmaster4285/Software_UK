# Plan: Main Services MD Extraction — Complete Analysis & Structure

**Generated:** September 21, 2026
**Scope:** All 9 main-service MD files in `main-services/`, the converter `scripts/convert-main-services-md.js`, data files `data/main-services-md.js` + `data/main-services.js`, and page components under `app/(landing)/[mainservice]/`
**Goal:** Design a unified extraction structure that captures ALL content from the MD files, fix parser bugs, and define mapping to page components

---

## 1. File Inventory

### 1.1 All Main-Service MD Files

| # | Filename | Route | Lines | H1 | H2 | H3 | Tables | FAQs | JSON-LD | Process Steps | Converted? |
|---|----------|-------|------:|---:|---:|---:|-------:|-----:|--------:|--------------:|:----------:|
| 1 | `software-development.md` | `/software-development` | 1,011 | 10 | 36 | 0 | 0 | 9 | 2 (Service, FAQ) | 7 | ✅ |
| 2 | `web-development.md` | `/web-development` | 1,335 | 2 | 33 | 18 | 1 | 13 | 2 (Service, FAQ) | 10 | ✅ |
| 3 | `mobile-app-development.md` | `/mobile-development` | 780 | 3 | 15 | 13 | 1 | 11 | 1 (@graph) | 8 | ✅ |
| 4 | `Uiux main.md` | `/design-ui-ux` | 1,391 | ~30 | ~30 | 13 | 3 | 13 | 3 (Service, FAQ, Breadcrumb) | 10 | ✅ |
| 5 | `Cyber Security.md` | `/cybersecurity` | 972 | 22 | 11 | 12 | 1 | 12 | 3 (Service, FAQ, Breadcrumb) | 8 | ✅ |
| 6 | `Machine Learining.md` | `/machine-learning` | 1,400 | 25 | 11 | 15 | 1 | 15 | 3 (Service, FAQ, Breadcrumb) | 12 | ✅ |
| 7 | `block chain.md` | `/blockchain-and-web3` | 796 | 20 | 10 | 13 | 1 | 13 | **0 (missing!)** | 12 | ✅ |
| 8 | `support-and-outsourcing.md` | `/support-and-outsourcing` | 960 | 16 | 16 | 28 | 2 | 12 | 3 (Service, FAQ, Breadcrumb) | 10 | **NO** |
| 9 | `nlp main service.md` | `/nlp-computer-vision` | 1,294 | 17 | 14 | 35 | 0 | 15 | 3 (Service, FAQ, Breadcrumb) | 12 | ✅ |

### 1.2 Conversion Status

| Category | Count |
|----------|------:|
| MD files in `main-services/` | 9 |
| Currently converted (in `main-services-md.js`) | 8 |
| Missing from conversion | 1 (`support-and-outsourcing.md`) |
| Total main services in `mainServicesData` | 13 |
| Main services with MD files | 9 |
| Main services WITHOUT MD files | 4 (AI, Data Services, Cloud & DevOps, Testing & QA) |

### 1.3 Why `support-and-outsourcing.md` Is Not Converted

The URL extraction regex expects:
```
https://clickmasterssoftwaredevelopmentcompany.co.uk/path
```

But `support-and-outsourcing.md` uses a markdown-link-wrapped URL format:
```markdown
**URL:** [`https://clickmasterssoftwaredevelopmentcompany.co.uk/support-and-outsourcing`](https://clickmasterssoftwaredevelopmentcompany.co.uk/support-and-outsourcing)
```

The regex matches the inner URL, but the slug extraction logic may fail because the outer backticks interfere. This needs a fix in the URL extraction.

---

## 2. Content Sections Across All 9 Files

### 2.1 Universal Sections (present in all 9)

| Section | MD Pattern | Current Extraction | Gap |
|---------|-----------|-------------------|-----|
| **Meta Keywords** | `## **Target SEO Keywords**` or inline | ✅ `metaKeywords` | None |
| **Meta Title** | `## **Meta Title**` / `**Meta Title:**` / `Meta Title:**` | ✅ `metaTitle` | None |
| **Meta Description** | `## **Meta Description**` / `**Meta Description:**` / `Meta Description:**` | ✅ `metaDescription` | None |
| **URL / Slug** | Backtick URL at top of file | ✅ `slug`, `url` | `support-and-outsourcing.md` broken |
| **H1** | `# **H1: ...**` or `## **H1: ...**` | ✅ `h1` | None |
| **Intro paragraph** | Lines between H1 and first `##` heading | ✅ `intro` | May be empty if H1 is inside a section |
| **Child services** | H3 headings under "Our X Services" section | ❌ Not extracted | All 9 files have 4-5 child services |
| **Cost / Pricing** | `## **How Much Does X Cost?**` | ❌ `costFactors[]` always empty | Parser bug: `#`-level headings swallowed |
| **Why Choose** | `## **Why Choose Clickmasters...**` | ❌ `whyChoose[]` always empty | Parser bug: `#`-level headings swallowed |
| **Process steps** | `## **1. Discovery**` / `### **1. Discovery**` | ⚠️ Generic `sections[]` | No step number, title, description structure |
| **FAQs** | `## **Frequently Asked Questions**` | ❌ `faqs[]` always empty | Parser bug: `#` headings swallowed |
| **CTA** | `**Primary CTA:** ...` | ❌ Not extracted | No dedicated field |
| **JSON-LD** | `<script type="application/ld+json">` | ✅ `jsonLd` | None (except Blockchain missing schemas) |

### 2.2 Common Sections (present in 5+ of 9 files)

| Section | MD Pattern | Files | Current Extraction | Gap |
|---------|-----------|:-----:|-------------------|-----|
| **Service overview / definition** | `## **What Are X Services?**` | 9/9 | ⚠️ Goes into generic `sections[]` | No dedicated field |
| **"What can we build" / Use cases** | `## **X We Build**` / `## **X Use Cases**` | 6/9 | ❌ Not extracted | Could be `useCases[]` |
| **Technology stack** | `## **Technologies Used**` / `## **Technology Stack**` | 5/9 | ❌ Not extracted | Could be `techStack[]` |
| **Industry verticals** | `## **X for Different Industries**` | 4/9 | ❌ Not extracted | Could be `industries[]` |
| **Engagement models** | `## **X Engagement Models**` | 3/9 | ❌ Not extracted | Could be `engagementModels[]` |
| **"What You Receive" deliverables** | `## **What You Receive**` | 7/9 | ❌ Not extracted | Could be `deliverables[]` |
| **Comparison tables** | Markdown `\| col \| col \|` | 7/9 | ⚠️ `tables[]` — works for `##` tables | None for `##` level |

### 2.3 Unique Sections (1-2 files only)

| Section | MD Pattern | Files | Current Extraction | Gap |
|---------|-----------|:-----:|-------------------|-----|
| **"Business problems we solve"** | `## **Business Problems X Can Solve**` | Software Dev only | ❌ Not extracted | Unique content |
| **Flow diagrams** | Text arrows `→` | 6/9 | ❌ Not extracted | Could be preserved as text |
| **Related services** | `## **Related AI & ML Services**` | NLP, ML, Blockchain | ⚠️ `relatedLinks[]` — partial | Only scans body text |
| **PoC / MVP sections** | `## **X Proof of Concept**` | ML, NLP, Blockchain | ❌ Not extracted | Unique content |

---

## 3. Parser Bugs (Critical)

### 3.1 Bug A: `#`-level headings swallowed by inner content loop

**Root cause:** The content collection loop stops only at `##`-`####` headings:
```js
while (j < lines.length && !/^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(lines[j].trim())) {
```

Any `#` (H1-level) heading does NOT match `#{2,4}` and is absorbed as body text of the preceding `##` section.

**Impact:** All `#`-level sections are NEVER processed:
- `# **Frequently Asked Questions**` → `faqs[]` always empty
- `# **Why Choose Clickmasters...**` → `whyChoose[]` always empty
- `# **How Much Does... Cost?**` → `costFactors[]` always empty
- `# **What You Receive**` → lost
- `# **Our X Services**` → lost

**Evidence in output:**
- Cyber Security: `faqs: []`, `whyChoose: []`, `costFactors: []`
- Machine Learning: `faqs: []`, `whyChoose: []`, `costFactors: []`
- NLP: `faqs: []` (despite 15 questions in MD)
- Blockchain: `faqs: []` (despite 13 questions in MD)
- Support & Outsourcing: would also be empty

**Fix:** Change inner loop to stop at `#`-`####` headings:
```js
while (j < lines.length && !/^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(lines[j].trim())) {
```

### 3.2 Bug B: Intro check hijacks `# **FAQs**` when intro is empty

**Root cause (line 281):**
```js
if (/^#\s*\**H1:/i.test(t) || (/^#\s*\*\*/.test(t) && !/meta/i.test(t) && !out.intro.length)) {
```

When `out.intro.length === 0`, any `# **...**` heading without "meta" triggers intro collection. This intercepts `# **Frequently Asked Questions**`.

**Fix:** Add `inFaq` check:
```js
if (/^#\s*\**H1:/i.test(t) || (/^#\s*\*\*/.test(t) && !/meta/i.test(t) && !out.intro.length && !inFaq)) {
```

### 3.3 Bug C: Meta/SEO sections leak into `sections[]`

**Root cause (line 326):**
```js
if (/meta (title|description|keyword)/i.test(heading)) continue;
```

Does NOT catch:
- `## **Target SEO Keywords**`
- `## **Meta Tags**`
- `## **Recommended Meta Data**`

**Fix:** Expand filter:
```js
if (/meta (title|description|keyword|tags|data)|target seo|recommended meta/i.test(heading)) continue;
```

### 3.4 Bug D: FAQ answer flattening

**Root cause:** FAQ answers are accumulated as a single string, skipping list items:
```js
if (!/^#{1,4}/.test(t) && !startsListMarker(t) && !/^\*\*Faq\s*Schema/i.test(t)) {
    faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
}
```

List items (`* `, `- `) are skipped entirely. Multi-paragraph answers collapse into one line.

**Fix:** Preserve list items and paragraph breaks:
```js
if (!/^#{1,4}/.test(t) && !/^\*\*Faq\s*Schema/i.test(t)) {
    if (startsListMarker(t)) {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + '\n' : '') + clean(t);
    } else if (t.trim() === '') {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + '\n\n' : '');
    } else {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
    }
}
```

### 3.5 Bug E: `relatedLinks` only scans body text

**Root cause (line 391-395):**
```js
const allText = [
    ...(out.intro || []),
    ...out.sections.map(s => s.body),
    ...(out.whyChoose || []).map(w => w.body),
].join('\n');
```

Links in list items (`items[]`), FAQ answers, table cells are NOT scanned.

**Fix:** Also scan `items`, `faqs[].answer`, `tables[].rows`:
```js
const allText = [
    ...(out.intro || []),
    ...out.sections.flatMap(s => [s.body, ...(s.items || [])]),
    ...(out.whyChoose || []).map(w => w.body),
    ...(out.faqs || []).map(f => f.answer),
    ...(out.tables || []).flatMap(t => t.rows.map(r => r.join(' '))),
].join('\n');
```

### 3.6 Bug F: No CTA extraction

**Impact:** CTA text like `**Primary CTA:** Discuss Your Support Requirements` is lost.

**Fix:** Add CTA extraction regex:
```js
const ctaMatch = content.match(/\*\*Primary CTA:\*\*\s*(.+)/i);
const ctaSecondary = content.match(/\*\*Secondary CTA:\*\*\s*(.+)/i);
```

### 3.7 Bug G: `support-and-outsourcing.md` not converted

**Root cause:** URL format with backtick-wrapped markdown link:
```markdown
**URL:** [`https://...`](https://...)
```

**Fix:** Add a fallback URL pattern that handles backtick-wrapped URLs:
```js
const urlMatch = content.match(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)/i)
    || content.match(/`(https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+))`/i);
```

---

## 4. Target Extraction Structure

### 4.1 Output Object Shape

```js
{
  // --- Identity ---
  slug: "software-development",                    // string — extracted from URL
  url: "https://clickmasterssoftwaredevelopmentcompany.co.uk/software-development",  // string
  sourceFile: "software-development.md",           // string — added by main()

  // --- SEO Meta (existing — working) ---
  metaTitle: "Software Development Services UK | Clickmasters",       // string
  metaDescription: "UK software development services for custom...",  // string
  metaKeywords: ["software development", "custom software", "..."],   // string[]

  // --- Page Content ---
  h1: "Software Development Services UK",          // string
  intro: "paragraph text with internal links...",   // string — first paragraph after H1

  // --- Child Services (NEW) ---
  childServices: [
    {
      title: "Custom Software Development",        // string — from H3 heading
      slug: "custom-software-development",         // string — slugified from title or extracted from link
      description: "Build business-focused...",    // string — body text under H3
      href: "/software-development/custom-software-development"  // string — extracted from **Internal Link:**
    }
  ],

  // --- Content Sections (improved from generic) ---
  sections: [
    {
      heading: "Software Development Built Around Your Business",  // string — from ## heading
      body: "paragraph text...",                   // string — body text (no bullets)
      items: ["bullet 1", "bullet 2"],            // string[] — optional, from list items
      table: null                                 // object | null — only if section contains a table
    }
  ],

  // --- Comparison Tables (NEW — separate from sections) ---
  tables: [
    {
      title: "Native vs Cross-Platform",          // string — from preceding heading or section context
      headers: ["Approach", "Best For", "Benefit"],  // string[] — from table header row
      rows: [["Native", "...", "..."], ...]        // string[][] — from table data rows
    }
  ],

  // --- Process Steps (NEW — structured) ---
  process: [
    {
      step: 1,                                    // number — from "1. Discovery" or "1\. Discovery"
      title: "Discovery & Requirements",          // string — step title
      description: "We define the business...",   // string — body text under step
      duration: null                              // string | null — if duration mentioned
    }
  ],

  // --- Technology Stack (NEW) ---
  techStack: [
    {
      category: "Frontend Development",           // string — from ### heading
      items: ["React", "Vue", "Angular"]          // string[] — from list items
    }
  ],

  // --- Industry Verticals (NEW) ---
  industries: [
    {
      name: "Manufacturing",                      // string — from ## heading
      description: "Software for manufacturing..."  // string — body text
    }
  ],

  // --- Cost / Pricing (NEW) ---
  costFactors: ["Existing software complexity", "Codebase condition", "..."],  // string[] — from cost section bullets
  pricingTiers: null,                             // object[] | null — if structured pricing available

  // --- Engagement Models (NEW) ---
  engagementModels: [
    {
      title: "Project-Based Development",         // string
      description: "..."                          // string
    }
  ],

  // --- Why Choose (NEW — structured) ---
  whyChoose: [
    {
      title: "Business-First Discovery",          // string — from ### heading
      description: "..."                          // string — body text
    }
  ],

  // --- Use Cases (NEW) ---
  useCases: [
    {
      title: "Customer Portals",                  // string
      description: "..."                          // string
    }
  ],

  // --- Deliverables (NEW) ---
  deliverables: ["Technical requirements assessment", "Existing software review", "..."],  // string[]

  // --- FAQs (FIX — currently broken) ---
  faqs: [
    {
      question: "What are software development services?",  // string
      answer: "Software development services provide..."    // string — with preserved list items
    }
  ],

  // --- CTA (NEW) ---
  cta: {
    primary: "Discuss Your Software Development Project",   // string
    secondary: null                                          // string | null
  },

  // --- JSON-LD (existing — working) ---
  jsonLd: {
    service: {...},                               // object — Service schema
    faqPage: {...},                               // object — FAQPage schema
    breadcrumb: {...},                            // object — BreadcrumbList schema
    raw: "..."                                    // string — original HTML for direct injection
  },

  // --- Internal Links (improved) ---
  relatedLinks: [
    {
      label: "Custom Software Development",      // string — link text
      href: "/software-development/custom-software-development"  // string — link URL
    }
  ]
}
```

### 4.2 Fields Summary

| Field | Type | Source | Status |
|-------|------|--------|--------|
| `slug` | `string` | URL regex | ✅ Working |
| `url` | `string` | URL regex | ✅ Working (fix for support-and-outsourcing) |
| `metaTitle` | `string` | Meta regex | ✅ Working |
| `metaDescription` | `string` | Meta regex | ✅ Working |
| `metaKeywords` | `string[]` | `extractKeywords()` | ✅ Working |
| `h1` | `string` | H1 regex | ✅ Working |
| `intro` | `string` | Line iteration | ✅ Working |
| `childServices` | `object[]` | NEW | ❌ Not extracted |
| `sections` | `object[]` | H2/H3 detection | ⚠️ Partial — needs meta filter fix |
| `tables` | `object[]` | Pipe detection | ⚠️ Partial — only for `##` tables |
| `process` | `object[]` | NEW | ❌ Not extracted |
| `techStack` | `object[]` | NEW | ❌ Not extracted |
| `industries` | `object[]` | NEW | ❌ Not extracted |
| `costFactors` | `string[]` | Cost section | ❌ Always empty (parser bug) |
| `pricingTiers` | `object[]` | Cost section | ❌ Not extracted |
| `engagementModels` | `object[]` | NEW | ❌ Not extracted |
| `whyChoose` | `object[]` | Why Choose section | ❌ Always empty (parser bug) |
| `useCases` | `object[]` | NEW | ❌ Not extracted |
| `deliverables` | `string[]` | NEW | ❌ Not extracted |
| `faqs` | `object[]` | FAQ section | ❌ Always empty (parser bug) |
| `cta` | `object` | NEW | ❌ Not extracted |
| `jsonLd` | `object` | `<script>` tags | ✅ Working |
| `relatedLinks` | `object[]` | Link extraction | ⚠️ Partial — body text only |

---

## 5. MD Heading → Extraction Field Mapping

### 5.1 Heading Patterns by File

| File | Heading Style | Example |
|------|--------------|---------|
| software-development.md | `# **SECTION**` / `## **Sub**` | `# **Our Software Development Services**` |
| web-development.md | `## **SECTION**` / `### **Sub**` | `## **Our Web Development Services**` |
| mobile-app-development.md | `# **H1:**` / `## **Sub**` / `### **Sub**` | `## **Mobile App Development Services**` |
| Uiux main.md | `# **SECTION**` / `## **Sub**` | `# **Our UI/UX Design Services**` |
| Cyber Security.md | `# **SECTION**` / `## **Sub**` | `# **Our Cyber Security Services**` |
| Machine Learining.md | `# **SECTION**` / `## **Sub**` | `# **Our Machine Learning Development Services**` |
| block chain.md | `# **SECTION**` / `## **Sub**` | `# **Our Blockchain & Web3 Development Services**` |
| support-and-outsourcing.md | `# **SECTION 01 — HERO**` / `## **Sub**` / `### **Sub**` | `# **SECTION 03 — CORE SERVICES**` |
| nlp main service.md | `# **SECTION 01 — HERO**` / `## **Sub**` / `### **Sub**` / `#### **Sub**` | `# **SECTION 03 — CORE / CHILD SERVICES**` |

### 5.2 Universal Section → Field Mapping

| MD Section Heading Pattern | Extract To | Regex / Detection |
|---------------------------|------------|-------------------|
| `# **H1: ...**` or `## **H1: ...**` | `h1` | `/#+\s*\**H1:\s*([^\n*]+)\**/i` |
| Lines after H1, before first `##` | `intro` | Line iteration with `clean()` |
| `## **Our X Services**` (or `# **Our X Services**`) | `childServices[]` (extract H3s) | `/our .+ services/i` |
| `### **Service Name**` under child services | `childServices[].title` | `/^#{3}\s*\*\*(.+)\*\*/` |
| `**Internal Link:**` after child service | `childServices[].href` | `/\*\*Internal Link:\*\*\s*(.+)/` |
| `## **X We Build**` or `## **X Use Cases**` | `useCases[]` | `/(we build|use cases)/i` |
| `## **Technologies Used**` or `## **Technology Stack**` | `techStack[]` | `/(technologies|tech stack|technology)/i` |
| `## **X for Different Industries**` | `industries[]` | `/industries/i` |
| `## **How Much Does X Cost?**` | `costFactors[]` | `/how (much\|long)/i` |
| `## **X Engagement Models**` | `engagementModels[]` | `/(engagement\|model)/i` |
| `## **Why Choose Clickmasters...**` | `whyChoose[]` | `/why choose/i` |
| `## **Frequently Asked Questions**` | Start FAQ extraction | `/frequently asked\|faqs?/i` |
| `### **Question?**` (inside FAQ) | `faqs[].question` | `/^#{2,3}\s*\*\*(.+)\*\*/` |
| `## **What You Receive**` | `deliverables[]` | `/what you receive/i` |
| `**Primary CTA:** ...` | `cta.primary` | `/\*\*Primary CTA:\*\*\s*(.+)/i` |
| `\| col \| col \|` (markdown table) | `tables[]` | `lj.startsWith('\|')` |
| `## **1. Step Name**` or `### **1. Step Name**` | `process[]` | `/^#{2,3}\s*\*?\*?(\d+)[\.\)]\s*(.+)/` |
| `<script type="application/ld+json">` | `jsonLd` | `/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi` |
| `[text](url)` (markdown links) | `relatedLinks[]` | `/\[([^\]]+)\]\(([^)]+)\)/g` |

---

## 6. Page Component Mapping

### 6.1 Current Data Flow

```
main-services-md.js (converter output)
    ↓
data/main-services.js → getServiceData(slug)
    ↓                          ↓
    ↓                    service-section-data.js → enrichServiceData()
    ↓                          ↓
    ↓                    whyChooseUsData.js → getWhyChooseUsData()
    ↓                          ↓
    └──────────────────────────→ merged "mainData" object
                                     ↓
                              page.js (server component)
                                     ↓
                              main-service.jsx (client orchestrator)
                                     ↓
                              ┌─── HeroSection
                              ├─── ExploreSection
                              ├─── PainPointsSolutions (hardcoded)
                              ├─── TrustedClientsSection
                              ├─── AppsSection (runtime)
                              ├─── ProcessPage
                              ├─── TechStackSection (hardcoded)
                              ├─── FeaturedInsights (runtime)
                              ├─── WhyChooseUs
                              ├─── PricingSection
                              ├─── IndustriesSection (hardcoded)
                              ├─── TestimonialsSection (runtime)
                              ├─── FaqSection
                              └─── FinalCTA (hardcoded)
```

### 6.2 New Fields → Component Mapping

| New Field | Component | How to Use |
|-----------|-----------|------------|
| `childServices[]` | **ExploreSection** | Replace hardcoded `mainServicesData.subServices` with MD-derived `childServices` — richer descriptions |
| `process[]` | **ProcessPage** | Replace generic `lifecycle` from `service-section-data.js` with MD-derived `process` — exact step titles and descriptions |
| `techStack[]` | **TechStackSection** | Replace hardcoded `aboutData.js` with MD-derived `techStack` — service-specific technologies |
| `industries[]` | **IndustriesSection** | Replace hardcoded `industries[]` with MD-derived `industries` — service-specific verticals |
| `engagementModels[]` | **PricingSection** or new component | Render as engagement model cards or tabs |
| `costFactors[]` | **PricingSection** or new component | Render as cost factor checklist under pricing |
| `whyChoose[]` | **WhyChooseUs** | Override `whyChooseUsData.js` with MD-derived `whyChoose` — exact benefit titles |
| `useCases[]` | **New component** or **ExploreSection** | Render as use-case cards with descriptions |
| `deliverables[]` | **ProcessPage** or new section | Render as deliverable checklist after process steps |
| `cta.primary` | **FinalCTA** | Override hardcoded CTA text with MD-derived CTA |
| `tables[]` | **New component** or **DynamicSections** | Render comparison tables |

### 6.3 Components to Update

| Component | Current Source | New Source | Change |
|-----------|---------------|------------|--------|
| `ExploreSection` | `mainServicesData.subServices` | `childServices[]` | Use MD-derived child services with richer descriptions |
| `ProcessPage` | `service-section-data.js` → `lifecycle[]` | `process[]` | Use MD-derived process steps |
| `TechStackSection` | `aboutData.js` (hardcoded) | `techStack[]` | Use MD-derived tech stack per service |
| `IndustriesSection` | Hardcoded `industries[]` | `industries[]` | Use MD-derived industry verticals |
| `WhyChooseUs` | `whyChooseUsData.js` | `whyChoose[]` | Use MD-derived why-choose benefits |
| `PricingSection` | `service-section-data.js` → `pricing[]` | Keep + add `costFactors[]` | Add cost factors below pricing |
| `FaqSection` | `service-section-data.js` → `faqs[]` | `faqs[]` | Use MD-derived FAQs (currently empty due to bug) |
| `FinalCTA` | Hardcoded | `cta.primary` | Use MD-derived CTA text |
| `HeroSection` | `mainServicesData` | Keep | No change needed |
| `TrustedClientsSection` | `service-section-data.js` | Keep | No change needed |
| `PainPointsSolutions` | Hardcoded | Keep or replace | Could use `useCases[]` |
| `AppsSection` | Runtime hook | Keep | No change needed |
| `FeaturedInsights` | Runtime hook | Keep | No change needed |
| `TestimonialsSection` | Runtime hook | Keep | No change needed |

---

## 7. Implementation Plan

### Phase 1: Fix Parser Bugs (Critical)

| # | Task | Files | Impact |
|---|------|-------|--------|
| 1.1 | Fix `#`-heading detection in content loop | `convert-main-services-md.js` | Unlocks `faqs[]`, `whyChoose[]`, `costFactors[]` |
| 1.2 | Fix intro hijack for empty intro | `convert-main-services-md.js` | Prevents `# **FAQs**` from being consumed |
| 1.3 | Expand meta/SEO section filter | `convert-main-services-md.js` | Removes junk from `sections[]` |
| 1.4 | Fix FAQ answer list preservation | `convert-main-services-md.js` | Preserves bullet lists in FAQ answers |
| 1.5 | Fix `relatedLinks` scope | `convert-main-services-md.js` | Scans list items, FAQs, tables |
| 1.6 | Fix `support-and-outsourcing.md` URL extraction | `convert-main-services-md.js` | Enables conversion of 9th file |
| 1.7 | Add CTA extraction | `convert-main-services-md.js` | Captures `cta.primary`, `cta.secondary` |

### Phase 2: Add New Extraction Fields

| # | Task | Regex / Detection | Output Field |
|---|------|-------------------|--------------|
| 2.1 | Extract child services from H3 headings under "Our X Services" | `/^#{2,3}\s*\*\*(.+)\*\*/` + `**Internal Link:**` | `childServices[]` |
| 2.2 | Extract process steps with step numbers | `/^#{2,3}\s*\*?\*?(\d+)[\.\)]\s*(.+)/` | `process[]` |
| 2.3 | Extract technology stack from tech sections | `/(technologies\|tech stack\|technology)/i` | `techStack[]` |
| 2.4 | Extract industry verticals | `/industries/i` | `industries[]` |
| 2.5 | Extract engagement models | `/(engagement\|model)/i` | `engagementModels[]` |
| 2.6 | Extract use cases | `/(we build\|use cases)/i` | `useCases[]` |
| 2.7 | Extract deliverables from "What You Receive" | `/what you receive/i` | `deliverables[]` |
| 2.8 | Extract CTA text | `/\*\*Primary CTA:\*\*\s*(.+)/i` | `cta.primary` |

### Phase 3: Update Data Files

| # | Task | File | Change |
|---|------|------|--------|
| 3.1 | Re-run converter | `data/main-services-md.js` | Generate 9 entries with all new fields |
| 3.2 | Update MD overlay in `getServiceData()` | `data/main-services.js` | Pass new fields through overlay |
| 3.3 | Add `cleanProcessSteps()` helper | `data/main-services.js` | Normalize process step numbers and titles |

### Phase 4: Update Page Components

| # | Task | Component | Change |
|---|------|-----------|--------|
| 4.1 | Update ExploreSection | `ExploreSection.jsx` | Use `childServices[]` with richer descriptions |
| 4.2 | Update ProcessPage | `ProcessPage.jsx` | Use `process[]` instead of `lifecycle[]` |
| 4.3 | Update TechStackSection | `TechStackSection.jsx` | Use `techStack[]` instead of hardcoded data |
| 4.4 | Update IndustriesSection | `IndustriesSection.jsx` | Use `industries[]` instead of hardcoded data |
| 4.5 | Update WhyChooseUs | `whyUs.jsx` | Use `whyChoose[]` from MD overlay |
| 4.6 | Add ComparisonTable component | New component | Render `tables[]` |
| 4.7 | Update FaqSection | `FaqSection.jsx` | Use `faqs[]` from MD (now populated) |
| 4.8 | Update FinalCTA | `finalCta.jsx` | Use `cta.primary` from MD |
| 4.9 | Add CostFactors component | New component or extend PricingSection | Render `costFactors[]` |

### Phase 5: Validation

| # | Task | Command |
|---|------|---------|
| 5.1 | Run converter | `node scripts/convert-main-services-md.js` |
| 5.2 | Verify output | `node -e "..."` — check all 9 entries have all fields |
| 5.3 | Run build | `npm run build` — verify 1586+ pages generate |
| 5.4 | Audit canonical | `node scripts/audit-canonical.js` |
| 5.5 | Sample check | Compare 3 pages: HTML vs source MD content |

---

## 8. Effort Estimate

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Fix parser bugs | 2-3 hours | 🔴 P0 — blocks everything |
| Phase 2: Add new extraction fields | 3-4 hours | 🔴 P0 — core feature |
| Phase 3: Update data files | 1 hour | 🟡 P1 |
| Phase 4: Update page components | 4-6 hours | 🟡 P1 |
| Phase 5: Validation | 1-2 hours | 🔴 P0 |
| **Total** | **11-16 hours** | |

**Recommended order:** Phase 1 → Phase 2 → Phase 3 → Phase 5 (smoke test) → Phase 4 → Phase 5 (full)

---

## 9. Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Changing inner loop from `#{2,4}` to `#{1,4}` may break existing section detection | High | Test on all 8 currently-converted files before and after |
| New fields may not render correctly in existing components | Medium | Add new fields incrementally; keep existing fields as fallbacks |
| `support-and-outsourcing.md` URL format may have other parser issues | Low | Run converter and inspect output carefully |
| `block chain.md` has no JSON-LD schemas — `jsonLd` will be empty | Low | Accept as-is; schemas can be added to MD later |
| NLP file has duplicate FAQ section (one placeholder, one real) | Medium | Parser should handle both; first real FAQ section wins |

---

**Last Updated:** September 21, 2026
**Main Reference:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/agent.md)
**Execution Plan:** [`Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md`](./Clickmasterssoftwaredevelopmentcompany.co.uk/plan.md)
