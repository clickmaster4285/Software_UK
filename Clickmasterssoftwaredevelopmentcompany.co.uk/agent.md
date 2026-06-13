# agent.md — ClickMasters Content Migration

> Main reference file. See `plan.md` for detailed execution plan.

---

## 1. Project Overview

| Field | Value |
|-------|-------|
| Project | ClickMasters Software Development Company |
| URL | https://clickmasterssoftwaredevelopmentcompany.co.uk |
| Type | B2B Next.js website |
| Content | 1,785 Word documents (.docx) |
| Approach | Data files (not MongoDB) — follow fellow's pattern |

---

## 2. Content Inventory

| Category | Count | Folder |
|----------|------:|--------|
| Industry / Service Page | 573 | `Industry-Service-Page/` |
| Hire Page | 300 | `Hire-Page/` |
| Case Study | 280 | `Case-Study/` |
| Salary Guide | 193 | `Salary-Guide/` |
| International City | 179 | `International-City/` |
| Comparison Page | 177 | `Comparison-Page/` |
| Resource Guide | 83 | `Resource-Guide/` |
| **Total** | **1,785** | 7 folders |

### Duplicate Slugs

- Total CSV rows: 1,785
- Unique slugs: 1,429
- Duplicate rows: 356 (25%)

**Strategy:** Use lowest `P_Number` as canonical.

---

## 3. Folder Structure

```
Clickmasterssoftwaredevelopmentcompany.co.uk/
├── agent.md                    ← main reference
├── plan.md                     ← execution plan
├── ClickMasters_Master_Index.csv
├── Case-Study/           (280 .docx)
├── Comparison-Page/      (177 .docx)
├── Hire-Page/           (300 .docx)
├── Industry-Service-Page/ (573 .docx)
├── International-City/  (179 .docx)
├── Resource-Guide/       (83 .docx)
├── Salary-Guide/        (193 .docx)
└── data/
    └── case-studies.js       ← to be generated
```

---

## 4. Case Study Docx Structure

Each case study has this HTML pattern:

```html
<table>
  META TITLE: ...
  META DESC: ...
  SLUG: /case-studies/proptech-build-to-rent-portfolio-management/
</table>

<p>Last updated: August 2025 | Reading time: 6 min | Written by: ... | Reviewed by: ...</p>

<h1>Title</h1>

<table>Sector | Country | Status | Contract</table>
<table>Tech Stack | Compliance</table>

<p><strong>The Challenge</strong></p>
<p>...</p>

<p><strong>Our Approach</strong></p>
<p>...</p>

<p><strong>The Result</strong></p>
<p>...</p>

<blockquote>Client quote</blockquote>

<table>Technologies | Compliance | Contract | IP</table>
```

### Extracted Fields

| Field | Source |
|-------|--------|
| `slug` | SLUG meta |
| `title` | H1 heading |
| `metaTitle` | META TITLE |
| `metaDesc` | META DESC |
| `sector` | Badge table |
| `country` | Badge table |
| `status` | Badge table |
| `contract` | Badge table |
| `techStack` | Tech table |
| `compliance` | Compliance table |
| `challenge` | "The Challenge" section |
| `approach` | "Our Approach" section |
| `results` | "The Result" section |
| `clientQuote` | Blockquote |

---

## 5. Current Route

**File:** `app/(landing)/case-studies/[id]/page.js`

**Recommended Change:** Use `[slug]` instead of `[id]` for better SEO.

---

## 6. Technical Stack

- **Frontend:** Next.js 16.2.4, React 19, Tailwind 4 (OKLCH)
- **Parsing:** `mammoth` (docx → HTML)
- **Build:** SSG with `generateStaticParams`
- **Storage:** Data files (`data/*.js`)

---

## 7. Execution Order

### Phase 1: Case Studies (Priority)
1. Write `scripts/convert-case-studies.js`
2. Generate `data/case-studies.js`
3. Update route: `[id]` → `[slug]`

### Phase 2: Other Categories
1. Hire Page (300) → `data/hire-pages.js` → `/hire/[role]/[city]/`
2. Salary Guide (193) → `data/salary-guides.js` → `/salary-guide/[slug]/`
3. Comparison Page (177) → `data/comparisons.js` → `/comparison/[slug]/`
4. Resource Guide (83) → `data/resource-guides.js` → `/resource/[slug]/`
5. International City (179) → `data/cities.js` → `/cities/[slug]/`
6. Industry / Service (573) → `data/services.js` → `/[category]/[service]/`

---

## 8. Key Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Storage | Data files | Simpler, follows proven pattern |
| Admin panel | No | Data files sufficient |
| Route param | `[slug]` | Better SEO |
| Build | SSG | Fastest, static CDN |

---

## 9. Dependencies

```bash
npm install mammoth
```

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Static pages | 1,975+ |
| Build time | 30-60s |
| Page load | <2s |

---

## 11. Next Actions

1. ~~Create `plan.md`~~ ✅ Done
2. Write `scripts/convert-case-studies.js`
3. Run on 280 case studies → `data/case-studies.js`
4. Update route to use `[slug]`

---

**Last Updated:** June 13, 2026
**See also:** `plan.md` (detailed execution plan)