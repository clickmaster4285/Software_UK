# Plan: Case Studies — Design System & Detail Page

**Generated:** June 22, 2026 | **Last Updated:** June 22, 2026
**Scope:** Case study detail page (`/case-studies/[slug]/`) — structure, layout, and content rendering patterns

---

## 1. Data Source

**File:** `data/case-studies.js`
**Entries:** 274 unique (from 280 DOCX files, duplicates removed)
**Lookup:** `getCaseStudyBySlug(slug)` for detail page; `caseStudyListings` (lightweight) for listing page

### Key Fields Used on Detail Page

| Field | Type | Used In |
|-------|------|---------|
| `title` | string | Hero H1 |
| `metaDesc` | string | Overview section |
| `sector` | string | Badge, project details |
| `country` | string | Meta bar, stats, details |
| `status` | string | Badge, details |
| `contract` | string | Badge, stats, details |
| `technologies` | string[] | Tech stack tags |
| `compliance` | string | Compliance badges |
| `challenge` | string | Challenge section |
| `approach` | string | Approach section (parsed into subsections) |
| `results` | string | Results section (parsed into outcome cards) |
| `clientQuote` | string | Testimonial block |
| `ipOwnership` | string | Stats bar, details |
| `lastUpdated` | string | Meta bar |
| `readingTime` | number | Meta bar |
| `writtenBy` | string | Testimonial, details |
| `reviewedBy` | string | Testimonial, details |

---

## 2. Detail Page File Structure

```
app/(landing)/case-studies/[slug]/
├── page.js              # Server component — data fetching, JSON-LD, metadata
└── detail-client.js     # Client component — all interactive UI
```

### Responsibilities

| File | Concerns |
|------|----------|
| `page.js` | `generateStaticParams`, `generateMetadata`, JSON-LD structured data, calls `getCaseStudyBySlug` + `getRelatedCaseStudies`, renders `<CaseStudyDetailClient>` |
| `detail-client.js` | All UI rendering, scroll progress, table of contents, section layout, interactive FAQ, share/print buttons |

---

## 3. Section-by-Section Layout Specification

### 3.1 Hero Section
- Dark gradient background (`from-primary via-primary-mid to-primary-light`)
- Breadcrumb: Home > Case Studies > Title
- Sector badge with emoji + status badge + contract badge
- H1 title (3xl→5xl responsive)
- Meta row: country, reading time, last updated, share/print icons
- Padding: `pt-28 pb-14 md:pt-36 md:pb-18` (accounts for fixed navbar)

### 3.2 Key Stats Bar
- 4-column grid: Region, Contract, Tech Stack count, IP Ownership
- White background, surface-colored inner cards

### 3.3 Sidebar TOC (Table of Contents)
- Hidden on < `xl` breakpoint
- Sticky at `top-28`
- Links: Overview → Challenge → Approach → Results → Testimonial → Project Details
- "Hire Us" CTA button at bottom

### 3.4 Project Overview
- metaDesc as lead paragraph
- Technology stack as hoverable tags
- Compliance badges (green, split on comma)

---

## 4. Challenge / Approach / Results — Editorial Layout

### Design Philosophy
These three sections are the core of every case study. The data contains long, structured paragraphs that must be broken into scannable, visual blocks — not rendered as walls of text.

### 4.1 Challenge (Single Card)

**Structure:**
```
[Icon + "Step 01" + "The Challenge" heading]
[White card, red accent border, full paragraph]
```

- No parsing needed — the challenge is always a single cohesive paragraph
- Typography: `text-sm md:text-[15px] leading-[1.8]` for readability
- Color: red-500 icon, red-400 step label, red-100/80 border

### 4.2 Approach (Parsed Subsections)

**Problem:** The approach field contains multiple labelled subsections merged into one string:
```
"Architecture: Next.js, Node.js... Delivery: 12-week Agile build..."
```

**Parsing Strategy:**
1. **Split on subsection labels** — regex: `/([A-Z][A-Za-z0-9\s/&]+?):\s/g`
   - Matches patterns like "Architecture:", "Delivery:", "Performance:", "FCA Consumer Duty Compliance:"
   - Each match becomes a subsection card
2. **Split content into bullets** — two patterns detected in data:
   - **Pattern A (~70%):** Sentence-based — split on `/(?<=\.)\s+(?=[A-Z])|;\s*/` (period-space between sentences or semicolons)
   - **Pattern B (~30%):** Numbered list `(1) item (2) item (3) item` — detected via `/^\(\d+\)/`, split on `(?=\(\d+\)\s)` lookahead, rendered with numbered badges
3. **Render each subsection** as a white card with:
   - Blue-600 label with blue-400 dot indicator
   - Bullet list (if multiple points) or single paragraph
   - Numbered items get a blue badge with the number instead of a dot

**Edge Cases:**
- If no subsections detected → render as single `<p>` (graceful fallback)
- Labels that contain colons within them (e.g., "Domain 3 (Technical Security)") are correctly captured because the regex is non-greedy
- Mixed content (both patterns in same entry) — each subsection is independently detected and parsed

**Example Output for "open-banking-aisp-platform-fintech":**

| Subsection Card | Content |
|----------------|---------|
| **Architecture** | TrueLayer aggregator, Next.js frontend, Node.js API, PostgreSQL with row-level security, AWS eu-west-2, Stripe billing |
| **FCA Consumer Duty Compliance** | No dark patterns, transparent fee structure, vulnerable customer pathway, outcome monitoring |
| **UK GDPR Architecture** | Article 28 DPA with TrueLayer, consent-based processing, right to erasure with token revocation |
| **Delivery** | 12-week Agile build, fixed price, R&D Tax Credits documentation |

### 4.3 Results (Outcome Cards Grid)

**Problem:** Results are multiple distinct outcomes merged into one paragraph:
```
"Delivered at £165,000. 450 signups in first month. 8% conversion. R&D claim filed — £38,000 returned."
```

**Parsing Strategy:**
1. **Split into sentences** — regex: `/(?<=\.)\s+(?=[A-Z])/`
2. **Each sentence becomes a card** in a 2-column grid
3. **Auto-highlight metrics** — regex: `/(£[\d,.]+%?|\d+%|\d+\s*(?:weeks?|months?|days?|hours?|minutes?|seconds?|years?|x\b)?)/gi`
   - Matched values render as `<strong className="text-emerald-700 font-bold">`

**Visual Structure:**
```
[emerald check icon]  Outcome sentence with **highlighted metric**
```

**Example Output for "open-banking-aisp-platform-fintech":**

| Card | Text |
|------|------|
| ✓ | Delivered on time at **£165,000** (within budget) |
| ✓ | Launched to beta users at **Week 12** |
| ✓ | **450** signups in first month |
| ✓ | **8%** freemium-to-paid conversion |
| ✓ | FCA authorisation application supported with technical documentation |
| ✓ | R&D Tax Credit claim filed — **£38,000** returned |

### 4.4 Color Coding Summary

| Section | Step Badge | Icon Color | Border | Accent |
|---------|-----------|------------|--------|--------|
| Challenge | red-400 | red-500 | red-100/80 | Red |
| Approach | blue-400 | blue-500 | blue-100/80 | Blue |
| Results | emerald-500 | emerald-500 | emerald-100/80 | Emerald |

---

## 5. Remaining Sections

### 5.1 Client Testimonial
- Dark gradient card (primary colors)
- Large decorative quote mark
- Blockquote text (xl→3xl responsive)
- Author name + reviewer credit

### 5.2 Project Details
- 2×2 or 3×3 grid of detail cards
- Fields: Sector, Country, Status, Contract, Tech Stack count, Reading Time, IP Ownership, Last Updated, Written By, Reviewed By
- Cards with hover border/shadow transition

### 5.3 Related Case Studies
- 3-column grid of cards
- Sector emoji as thumbnail placeholder
- Title, excerpt, "Read More" link
- Links to `/case-studies/[related-slug]`

### 5.4 Bottom CTA
- Dark gradient card
- "Start Your Project" primary button + "View All Case Studies" ghost button

---

## 6. Design Tokens Used

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | Dark navy | Hero, CTA backgrounds |
| `--color-accent` | Brand accent | Badges, buttons, highlights |
| `--color-surface` | Light gray | Alternating section backgrounds |
| `--color-text-primary` | Dark | Headings |
| `--color-text-body` | Gray | Body text |
| `--color-text-muted` | Light gray | Labels, meta |
| `--color-border` | Light gray | Card borders |

---

## 7. Responsive Breakpoints

| Breakpoint | Layout Changes |
|-----------|---------------|
| `< sm` | Single column results, stacked stats |
| `sm – lg` | 2-column results grid, 2-column stats |
| `lg – xl` | 3-column related studies, wider content |
| `≥ xl` | TOC sidebar visible (56px wide, sticky) |

---

## 8. Change Log

| Date | Change | Type |
|------|--------|------|
| June 13, 2026 | Initial case study detail page built with 3-column bento grid for Challenge/Approach/Results | Structure |
| June 22, 2026 | Redesigned to process timeline layout (vertical connecting line, numbered steps) | Design |
| June 22, 2026 | **Redesigned to structured editorial layout** — Approach parsed into subsection cards, Results parsed into outcome grid with metric highlighting, Challenge as clean single card | **Design + Parsing** |
| June 22, 2026 | **Completed GUI refactor** — Replaced inline IIFE parsing in detail-client.js with proper helper functions (`parseApproachSubsections`, `splitApproachBullets`, `splitResultsSentences`, `highlightMetrics`). Extracted `ApproachSection` and `ResultsSection` into proper components. Added `TableOfContents`, `SectionHeading`, `ClientTestimonial` components. All helpers return JSX-compatible output. | **Refactor** |
| June 22, 2026 | **Fixed data exports** — Added missing `caseStudyListings` (lightweight array), `getCaseStudyBySlug`, `getRelatedCaseStudies`, `getSectorsMeta` exports to `data/case-studies.js`. Build now resolves all case-study imports. | **Fix** |
| June 22, 2026 | **Cleaned up** — Removed 7 temporary diagnostic/audit scripts from `scripts/` directory. | **Cleanup** |

---

**End of Plan**
