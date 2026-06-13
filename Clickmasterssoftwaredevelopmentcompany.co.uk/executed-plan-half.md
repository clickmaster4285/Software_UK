    104 +|`status` | Badge table |
    105 +|`contract` | Badge table |
    106 +|`techStack` | Tech table |
    107 +|`compliance` | Compliance table |
    108 +|`challenge` | "The Challenge" section |
    109 +|`approach` | "Our Approach" section |
    110 +|`results` | "The Result" section |
    111 +|`clientQuote` | Blockquote |
    112
    159 -2.**Model coverage gap** — three CSV categories have no direct
    160 -   MongoDB model:
    161 -   - Hire Page → needs`Hire` model.
    162 -   - International City → needs`City` model (or reuse `BlogPost` with
    163 -`category: "city"`).
    164 -   - Industry / Service Page → needs a richer`Service` model (current
    165 -`Category` is too flat for service variants like
    166 -`fintech-cloud-native-development` vs `healthtech-cloud-native-development`).
    113 +---
    114
    168 -3.**Formatting fidelity** — `.docx` headings, tables, lists, and
    169 -   embedded images need conversion to HTML/MD via`mammoth` while
    170 -   preserving structure.
    115 +## 5. Current Route
    116
    172 -4.**SEO per page** — title, meta description, OG image, canonical URL
    173 -   must be extracted/generated per entry.
    117 +**File:** `app/(landing)/case-studies/[id]/page.js`
    118
    175 -5.**Performance at scale** — 1,785 pages implies ISR, DB indexes on
    176 -`slug`, `category`, `p_number`, and probably a sitemap generator.
    119 +**Recommended Change:** Use `[slug]` instead of `[id]` for better SEO.
    120
    178 -## 6. Current Progress (as of June 12, 2026)
    121 +---
    122
    180 -- ✅`ClickMasters_Master_Index.csv` exists with all 1,785 entries.
    181 -- ✅ All 1,785`.docx` files organized into 7 categorized folders
    182 -  (`Industry-Service-Page/`, `Hire-Page/`, `Case-Study/`, `Salary-Guide/`,
    183 -`International-City/`, `Comparison-Page/`, `Resource-Guide/`).
    184 -- ✅ Redundant copies deleted (`Website Docs/`, empty `part*` folders).
    185 -- ✅ Next.js 16 + React 19 + Tailwind 4 + Mongoose stack already running
    186 -  in parent project.
    187 -- ✅ Admin panel UI shipped (Blog, Project, Testimonial, Case Study).
    188 -- ❌ No CSV-driven import script yet.
    189 -- ❌ No`Hire` or `City` models yet.
    190 -- ❌ No`Industry / Service Page` import path (current `Category` is too
    191 -  flat).
    192 -- ❌ No routing for`hire/*/*`, `cities/*`, or comparison/salary/resource
    193 -  render modes.
    123 +## 6. Technical Stack
    124
    195 -## 7. Project Goals
    125 +-**Frontend:** Next.js 16.2.4, React 19, Tailwind 4 (OKLCH)
    126 +-**Parsing:** `mammoth` (docx → HTML)
    127 +-**Build:** SSG with `generateStaticParams`
    128 +-**Storage:** Data files (`data/*.js`)
    129
    197 -### 7.1 Primary
    130 +---
    131
    199 -1. Ingest all 1,785 docs → 1,429 unique content entries in MongoDB.
    200 -2. Each entry renders cleanly on its target route with intact
    201 -   formatting.
    202 -3. Dedupe by`P_Number` (canonical) with `Slug` only as a secondary
    203 -   key.
    204 -4. New routes for Hire and International City.
    205 -5.`BlogPost` extended with `renderMode` for comparison / salary /
    206 -   resource.
    132 +## 7. Execution Order
    133
    208 -### 7.2 Secondary
    134 +### Phase 1: Case Studies (Priority)
    135 +1. Write`scripts/convert-case-studies.js`
    136 +2. Generate`data/case-studies.js`
    137 +3. Update route:`[id]` → `[slug]`
    138
    210 -1. Bulk import script with resumable progress and dry-run.
    211 -2. Per-page SEO meta + JSON-LD where applicable.
    212 -3. Sitemap + robots.txt regenerated from DB.
    213 -4. Admin UI for Hire and City management.
    214 -5. Cache layer for list pages (TanStack Query stale time tuned).
    139 +### Phase 2: Other Categories
    140 +1. Hire Page (300) →`data/hire-pages.js` → `/hire/[role]/[city]/`
    141 +2. Salary Guide (193) →`data/salary-guides.js` → `/salary-guide/[slug]/`
    142 +3. Comparison Page (177) →`data/comparisons.js` → `/comparison/[slug]/`
    143 +4. Resource Guide (83) →`data/resource-guides.js` → `/resource/[slug]/`
    144 +5. International City (179) →`data/cities.js` → `/cities/[slug]/`
    145 +6. Industry / Service (573) →`data/services.js` → `/[category]/[service]/`
    146
    216 -## 8. Next Steps Required
    147 +---
    148
    218 -### 8.1 Immediate
    149 +## 8. Key Decisions
    150
    220 -1.~~**Pick one canonical copy** and delete duplicates~~ ✅ Done.
    221 -   Files organized into 7 categorized folders;`Website Docs/` and empty
    222 -`part*` folders deleted.
    223 -2.**Normalise slugs** — convert filename underscores to hyphens,
    224 -   lowercase, strip trailing dashes.
    225 -3.**Dedup CSV** — group by `Slug`, keep row with lowest `P_Number`,
    226 -   archive the rest.
    227 -4.**Add Mongoose models**:
    228 -   -`Hire.js` (role, city, country, ukRegion, body, meta).
    229 -   -`City.js` (city, country, region, body, meta).
    230 -   - Extend`BlogPost.js` with `renderMode: 'salary' | 'comparison' | 'resource' | 'standard'`.
    231 -   - New`Service.js` (or extend `Category.js` with sub-service variants).
    232 -5.**Build `scripts/import-docx.mjs`** — stream the CSV, parse each
    233 -   docx with`mammoth`, write to MongoDB via the appropriate model.
    151 +| Decision | Choice | Why |
    152 +|----------|--------|-----|
    153 +| Storage | Data files | Simpler, follows proven pattern |
    154 +| Admin panel | No | Data files sufficient |
    155 +| Route param |`[slug]` | Better SEO |
    156 +| Build | SSG | Fastest, static CDN |
    157
    235 -### 8.2 Short-term
    158 +---
    159
    237 -6. Test the importer on 10–20 docs across all 7 categories.
    238 -7. Add API routes (`/api/hires`, `/api/cities`,
    239 -`/api/posts?renderMode=salary`, etc.) and TanStack Query hooks.
    240 -8. Build the four new frontend routes listed in §4.2.
    160 +## 9. Dependencies
    161
    242 -### 8.3 Long-term
    162 +``bash                                                                                                                                                   163 +npm install mammoth                                                                                                                                       164 +``
    165
    244 -9. ISR + on-demand revalidation for content pages.
    245 -10. Audit trail / versioning for imported content.
    246 -11. Backup/restore script for the`content` collection set.
    166 +---
    167
    248 -## 9. Stakeholders
    168 +## 10. Success Metrics
    169
    250 --**Developer** — implementation owner.
    251 --**Content Team** — `.docx` authors.
    252 --**SEO Team** — meta data and indexing.
    253 --**Marketing Team** — lead-gen campaigns per page.
    170 +| Metric | Target |
    171 +|--------|--------|
    172 +| Static pages | 1,975+ |
    173 +| Build time | 30-60s |
    174 +| Page load | <2s |
    175
    255 -## 10. Technologies
    176 +---
    177
    257 --**Frontend:** Next.js 16.2.4 (App Router), React 19, Tailwind 4 (OKLCH),
    258 -  Sora / DM Sans, Shadcn UI, Lucide React, GSAP, Framer Motion.
    259 --**Backend:** Node.js, Mongoose (MongoDB).
    260 --**Data layer:** TanStack Query + axios wrapper.
    261 --**Import tooling:** Node CLI + `mammoth` (`docx` → HTML), `csv-parse`,
    262 -`slugify`.
    178 +## 11. Next Actions
    179
    264 -## 11. Key Files
    180 +1.~~Create `plan.md`~~ ✅ Done
    181 +2. Write`scripts/convert-case-studies.js`
    182 +3. Run on 280 case studies →`data/case-studies.js`
    183 +4. Update route to use`[slug]`
    184
    266 -| File                                           | Purpose                                                |
    267 -| ---------------------------------------------- | ------------------------------------------------------ |
    268 -|`ClickMasters_Master_Index.csv`                | Canonical 1,785-row index (P_Number, Category, Slug, Filename, Size). |
    269 -|`agent.md`                                     | This context file.                                     |
    270 -|`folder-structure.md`                          | Auto-generated file tree.                              |
    271 -|`Industry-Service-Page/`                       | 573 industry/service page `.docx` files.               |
    272 -|`Hire-Page/`                                   | 300 hire page `.docx` files.                           |
    273 -|`Case-Study/`                                  | 280 case study `.docx` files.                          |
    274 -|`Salary-Guide/`                                | 193 salary guide `.docx` files.                        |
    275 -|`International-City/`                          | 179 international city `.docx` files.                  |
    276 -|`Comparison-Page/`                             | 177 comparison page `.docx` files.                     |
    277 -|`Resource-Guide/`                              | 83 resource guide `.docx` files.                       |
    278 -|`lib/models/BlogPost.js`                       | Blog + Salary + Comparison + Resource storage.         |
    279 -|`lib/models/CaseStudy.js`                      | Case Study storage.                                    |
    280 -|`lib/models/Category.js`                       | Category taxonomy.                                     |
    281 -|`lib/models/Hire.js` (to add)                  | Hire Page storage.                                     |
    282 -|`lib/models/City.js` (to add)                  | International City storage.                            |
    283 -|`app/(landing)/[category]/[service]/page.js`   | Industry/Service dynamic route.                        |
    284 -|`app/(landing)/blog/[id]/page.js`              | Blog/Salary/Comparison/Resource dynamic route.         |
    285 -|`app/(landing)/case-studies/[id]/page.js`     | Case Study dynamic route.                              |
    286 -|`app/admin/...`                                | Admin CRUD UIs.                                        |
    287 -|`scripts/import-docx.mjs` (to add)             | Bulk importer.                                         |
    288 -
    289 -## 12. Risk Assessment
    290 -
    291 -| Risk                       | Severity | Mitigation                                                 |
    292 -| -------------------------- | -------- | ---------------------------------------------------------- |
    293 -| Data loss during import    | High     | Build importer in dry-run mode first; keep folder backup. |
    294 -| Formatting loss            | Medium   | Use`mammoth` + custom style mapping; test on samples.     |
    295 -| Duplicate slug conflicts   | Medium   | Dedup by`P_Number` (canonical); secondary key on Slug.    |
    296 -| Performance degradation    | Low      | DB indexes on`slug`, `category`, `p_number`; ISR.         |
    297 -| Incomplete content mapping | Medium   | Full mapping table in §4.1; review before import.          |
    298 -
    299 -## 13. Success Metrics
    300 -
    301 -- ≥ 99 % of 1,785 docs imported (≥ 1,429 unique after dedup).
    302 -- All 7 categories render on their target routes without 404/500.
    303 -- Page load < 2 s p95 for content pages.
    304 -- 100 % of imported pages emit valid SEO meta + sitemap entry.
    305 -- Admin panel exposes edit on every imported model.
    306 -
    185  ---
      186
    309 -**Last Updated:** June 12, 2026
    310 -**Status:** Planning & Setup Phase — docs organized, ready for import script.
    311 -**Next Milestone:** Build `scripts/import-docx.mjs`, add `Hire` + `City` models, run 10-doc pilot.
    187   No newline at end of file
      188 +**Last Updated:** June 13, 2026
    189 +**See also:** `plan.md` (detailed execution plan)
    190   No newline at end of file

  Thought for 3s (ctrl+o to expand)
● Done! Created both files:

  Files Created

1. plan.md — Detailed descriptive plan with all findings:
   - Project context
   - Content inventory (exact counts)    - Document structure analysis (Case Study example)
   - Duplicate slug analysis    - Technical details
   - Step-by-step actions
   - Risks & mitigations
2. agent.md — Consolidated main reference (concise, to the point):
   - Project overview
   - Content inventory
   - Folder structure
   - Case Study docx structure
   - Current route
   - Technical stack
   - Execution order
   - Key decisions

  Summary

  ┌──────────┬──────────────────────────────────────────────────┐
  │   File   │                     Purpose                      │
 ▐▛███▜▌   Claude Code v2.1.177
▝▜█████▛▘  minimax-m2.5:cloud · API Usage Billing
▝▜█████▛▘  minimax-m2.5:cloud · API Usage Billing
  ▘▘ ▝▝    ~\Desktop\Software uk

❯ /clear

❯ read C:\Users\PC-24\Desktop\Software uk\Clickmasterssoftwaredevelopmentcompany.co.uk\plan.md and follow the plan ,
    C:\Users\PC-24\Desktop\Software uk\Clickmasterssoftwaredevelopmentcompany.co.uk\agent.md

  Thought for 5s (ctrl+o to expand)

● I'll read both files to understand the plan and then follow it.

  Thought for 8s, read 2 files (ctrl+o to expand)

● Now I understand the plan. Let me check the current state of the data files and routes to see what's already been done.

  Thought for 3s, searched for 3 patterns (ctrl+o to expand)

● Let me check what's in the main project's data directory and check the current case studies route:

  Thought for 2s, searched for 2 patterns (ctrl+o to expand)

● The data files already exist! Let me check their content and the current route:

  Thought for 5s, read 3 files (ctrl+o to expand)

● The data files exist but are empty. Let me check the hooks and package.json to understand the current setup:

  Thought for 2s, searched for 1 pattern, read 1 file (ctrl+o to expand)

● mammoth is installed. Let me check the hook and understand the data structure:

  Thought for 5s, read 1 file (ctrl+o to expand)

● Now I understand the structure. Let me create a task list and start implementing the plan:

  Thought for 1s (ctrl+o to expand)

● Thinking for 1s… (ctrl+o to expand)
  ⎿  Let me first test mammoth with a sample docx to understand the exact HTML structure before writing the script.

● Bash(cd "C:\Users\PC-24\Desktop\Software uk" && node -e "
      const mammoth = require('mammoth');…)
  ⎿  Waiting…
● Creating conversion script… (52s · ↑ 2.0k tokens)
  ⎿  ◼ Create convert-case-studies.js script
     `<table><tr>``<td><p>`META TITLE: Open Banking AISP Platform for UK FinTech Startup — ClickMasters Case Study
─────META─DESC:─Open─Banking─AISP─Platform─for─UK─FinTech─Startup.─A─UK─FinTech─startup─needed─to─build─an─FCA-authorised─Account─Information─Service─Provider─(─────     AISP) platform that could a...
     … +31 lines (ctrl+o to expand)  [CAVEMAN]                                                                                                                                        ● high · /effort
  Thought for 5s (ctrl+o to expand)

● Now I understand the structure. Let me create the conversion script:
     ● Write(scripts\convert-case-studies.js)
  ⎿  Wrote 341 lines to scripts\convert-case-studies.js       1 /**
       2  * Conversion Script: Case Studies DOCX → Data File
       3  *
       4  * Parses all 280 case study .docx files and generates data/case-studies.js       5  *
       6  * Usage: node scripts/convert-case-studies.js       7  */
       8
       9 const fs = require('fs');
      10 const path = require('path');
     … +331 lines (ctrl+o to expand)

  Thought for 2s (ctrl+o to expand)

● Now let me run the conversion script:

● Bash(cd "C:\Users\PC-24\Desktop\Software uk" && node scripts/convert-case-studies.js)
  ⎿  Starting case studies conversion...

    Found 280 case study files
     … +26 lines (ctrl+o to expand)
  ⎿  (timeout 2m)

  Thought for 5s (ctrl+o to expand)

● Excellent! The conversion was successful - 280 files processed, 274 unique case studies. Let me verify the data and then update the route:

  Thought for 5s, read 1 file (ctrl+o to expand)

● The data was generated but the extraction needs improvement. Let me fix the script to get cleaner data:

● Update(scripts\convert-case-studies.js)  ⎿  Added 12 lines, removed 9 lines
      25  function extractMeta(html) {
      26    const meta = {};
      27
    28 -  // Extract META TITLE                                                                                                                                   29 -  const titleMatch = html.match(/META TITLE:\s*([^\n<]+)/i);
    30 -  if (titleMatch) meta.metaTitle = titleMatch[1].trim();                                                                                                  28 +  // Extract META TITLE - look in the first meta table specifically
    29 +  const firstTableMatch = html.match(/`<table>`[\s\S]*?<\/table>/);
    30 +  if (firstTableMatch) {
    31 +    const tableContent = firstTableMatch[0];
    32
    32 -  // Extract META DESC
    33 -  const descMatch = html.match(/META DESC:\s*([^\n<]+)/i);
    34 -  if (descMatch) meta.metaDesc = descMatch[1].trim();
    33 +    const titleMatch = tableContent.match(/META TITLE:\s*([^\n<]+)/i);
    34 +    if (titleMatch) meta.metaTitle = titleMatch[1].trim();
    35
    36 -  // Extract SLUG
    37 -  const slugMatch = html.match(/SLUG:\s*([^\n<]+)/i);
    38 -  if (slugMatch) meta.slug = slugMatch[1].trim();
    36 +    const descMatch = tableContent.match(/META DESC:\s*([^\n<]+)/i);
    37 +    if (descMatch) meta.metaDesc = descMatch[1].trim();
    38
    39 +    const slugMatch = tableContent.match(/SLUG:\s*([^\n<]+)/i);
    40 +    if (slugMatch) meta.slug = slugMatch[1].trim();
    41 +  }
    42 +
    43    return meta;
      44  }
      45

  Thought for 24s (ctrl+o to expand)

● Update(scripts\convert-case-studies.js)
  ⎿  Added 37 lines, removed 23 lines
      75    return '';
      76  }
      77
    78 -// Extract badges (sector, country, status, contract)                                                                                                     78 +// Extract badges (sector, country, status, contract) from the badges table
    79  function extractBadges(html) {      80    const badges = {
      81      sector: '',
    ...
       85      contract: ''
       86    };
       87
    88 -  // Find the badges table - typically contains sector emoji, country emoji, etc.
    89 -  const badgeTableMatch = html.match(/`<table>`[\s\S]*?`<tr>`[\s\S]*?`<td>`[\s\S]*?<\/tr>[\s\S]*?<\/table>/);
    90 -  if (badgeTableMatch) {
    91 -    const tableText = stripHtml(badgeTableMatch[0]);
    88 +  // Find tables that contain sector badges (with emojis like 🏭)
    89 +  const tables = html.match(/`<table>`[\s\S]*?<\/table>/gi) || [];
    90
    93 -    // Extract sector (contains emoji like 🏭 or 🏥)
    94 -    const sectorMatch = tableText.match(/[🏭🏥🚗🛒💊🏛️ 💰🎓📦🏗️ 🌾🔧🎮📱🚀]?\s*([^|]+)/);
    95 -    if (sectorMatch) badges.sector = sectorMatch[1].trim();
    91 +  for (const table of tables) {
    92 +    const tableText = stripHtml(table);
    93
    97 -    // Extract country (contains emoji like 🇬🇧)
    98 -    const countryMatch = tableText.match(/🇬🇧|🇺🇸|🇩🇪|🇫🇷|🇪🇸|🇮🇪|🇦🇺|🇨🇦/);
    99 -    if (countryMatch) {
    100 -      const countryTextMatch = tableText.match(/([🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]\s*[A-Za-z]+)/);
    101 -      if (countryTextMatch) badges.country = countryTextMatch[1].replace(/🇬🇧|🇺🇸|🇩🇪|🇫🇷|🇪🇸|🇮🇪|🇦🇺|🇨🇦/, '').trim();
    102 -    }
    94 +    // Look for table with sector emoji pattern
    95 +    if (tableText.includes('🏭') || tableText.includes('🏥') || tableText.includes('🚗') ||
    96 +        tableText.includes('🇬🇧') || tableText.includes('🇺🇸')) {
    97
    104 -    // Extract status (✅ or similar)
    105 -    const statusMatch = tableText.match(/✅|⚠️ |⏳/);
    106 -    if (statusMatch) {
    107 -      const statusTextMatch = tableText.match(/([✅⚠️ ⏳]\s*[A-Za-z\s]+)/);
    108 -      if (statusTextMatch) badges.status = statusTextMatch[1].replace(/✅|⚠️ |⏳/, '').trim();
    109 -    }
    98 +      // Extract sector - look for text after sector emoji
    99 +      const sectorMatch = table.match(/🏭\s*([^|<]+)|🏥\s*([^|<]+)|🚗\s*([^|<]+)|🛒\s*([^|<]+)|💊\s*([^|<]+)|🏛️ \s*([^|<]+)|💰\s*([^|<]+)|🎓\s*([^|<
          +]+)|📦\s*([^|<]+)|🏗️ \s*([^|<]+)|🌾\s*([^|<]+)|🔧\s*([^|<]+)|🎮\s*([^|<]+)|📱\s*([^|<]+)|🚀\s*([^|<]+)/);
    100 +      if (sectorMatch) {
    101 +        badges.sector = (sectorMatch[1] || sectorMatch[2] || sectorMatch[3] || sectorMatch[4] || sectorMatch[5] ||
    102 +                         sectorMatch[6] || sectorMatch[7] || sectorMatch[8] || sectorMatch[9] || sectorMatch[10] ||
    103 +                         sectorMatch[11] || sectorMatch[12] || sectorMatch[13] || sectorMatch[14] || sectorMatch[15]).trim();
    104 +      }
    105
    111 -    // Extract contract type
    112 -    const contractMatch = tableText.match(/📋\s*([A-Za-z\s]+)/);
    113 -    if (contractMatch) badges.contract = contractMatch[1].trim();
    106 +      // Extract country
    107 +      const countryMatch = table.match(/🇬🇧\s*([^|<]+)|🇺🇸\s*([^|<]+)|🇩🇪\s*([^|<]+)|🇫🇷\s*([^|<]+)|🇪🇸\s*([^|<]+)/);
    108 +      if (countryMatch) {
    109 +        badges.country = (countryMatch[1] || countryMatch[2] || countryMatch[3] || countryMatch[4] || countryMatch[5]).trim();
    110 +      }
    111 +
    112 +      // Extract status
    113 +      const statusMatch = table.match(/✅\s*([^|<]+)|⚠️ \s*([^|<]+)|⏳\s*([^|<]+)/);
    114 +      if (statusMatch) {
    115 +        badges.status = (statusMatch[1] || statusMatch[2] || statusMatch[3]).trim();
    116 +      }
    117 +
    118 +      // Extract contract type
    119 +      const contractMatch = table.match(/📋\s*([^|<]+)/);
    120 +      if (contractMatch) badges.contract = contractMatch[1].trim();
    121 +
    122 +      // Look for compliance (💷 emoji)
    123 +      const complianceMatch = table.match(/💷\s*([^|<]+)/);
    124 +      if (complianceMatch) badges.compliance = complianceMatch[1].trim();
    125 +
    126 +      break;
    127 +    }
    128    }
      129
    130    return badges;

  Thought for 19s (ctrl+o to expand)

● Bash(cd "C:\Users\PC-24\Desktop\Software uk" && node scripts/convert-case-studies.js)
  ⎿  Starting case studies conversion...

    Found 280 case study files
     … +26 lines (ctrl+o to expand)
  ⎿  (timeout 2m)
  Thought for 31s, read 1 file (ctrl+o to expand)

● The extraction is now much cleaner. Let me mark the first task complete and update the route:

  Thought for 1s (ctrl+o to expand)

● Now let me update the route to use slug and the data file:

  Thought for 4s (ctrl+o to expand)

  Thought for 3s (ctrl+o to expand)

● Bash(cd "C:\Users\PC-24\Desktop\Software uk" && mv "app/(landing)/case-studies/[id]" "app/(landing)/case-studies/[slug]")
  ⎿  Done

  Thought for 54s, read 1 file (ctrl+o to expand)

● Write(app\(landing)\case-studies\[slug]\page.js)
  ⎿  Added 119 lines, removed 91 lines
       1 -'use client';
    2 -
    3 -import { useParams } from 'next/navigation';
    4 -import { useCaseStudy } from '@/hooks/useCaseStudies';
    5 -import { Skeleton } from '@/components/ui/skeleton';                                                                                                       1 +import { caseStudies } from '@/data/case-studies';
    2 +import { notFound } from 'next/navigation';                                                                                                                3 +import Link from 'next/link';
    4 +import Image from 'next/image';
    5 +import { Metadata } from 'next';
    6  import { Badge } from '@/components/ui/badge';
       7  import { Button } from '@/components/ui/button';
       8  import { ArrowLeft, Target, Lightbulb, CheckCircle2, ChevronRight, Share2, Printer } from 'lucide-react';
       9 -import Link from 'next/link';
    10 -import Image from 'next/image';
    11 -import { notFound } from 'next/navigation';
    9
    13 -export default function CaseStudyDetailPage() {
    14 -  const { id } = useParams();
    15 -  const { data: study, isLoading, error } = useCaseStudy(id);
    10 +// Generate static params for SSG
    11 +export async function generateStaticParams() {
    12 +  return caseStudies.map((study) => ({
    13 +    slug: study.slug,
    14 +  }));
    15 +}
    16
    17 -  if (isLoading) {
    18 -    return (
    19 -`<div className="min-h-screen bg-slate-50 pt-32 pb-24">`
    20 -`<div className="container">`
    21 -`<Skeleton className="h-10 w-48 mb-8" />`
    22 -`<Skeleton className="h-20 w-3/4 mb-12" />`
    23 -`<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">`
    24 -`<div className="lg:col-span-2 space-y-8">`
    25 -`<Skeleton className="h-100 w-full rounded-3xl" />`
    26 -`<Skeleton className="h-64 w-full rounded-2xl" />`
    27 -`</div>`
    28 -`<div className="space-y-6">`
    29 -`<Skeleton className="h-96 w-full rounded-2xl" />`
    30 -`</div>`
    31 -`</div>`
    32 -`</div>`
    33 -`</div>`
    34 -    );
    17 +// Generate metadata for SEO
    18 +export async function generateMetadata({ params }) {
    19 +  const { slug } = await params;
    20 +  const study = caseStudies.find((cs) => cs.slug === slug);
    21 +
    22 +  if (!study) {
    23 +    return {
    24 +      title: 'Case Study Not Found | ClickMasters',
    25 +    };
    26    }
      27
    37 -  if (error || !study) {
    38 -    return notFound();
    28 +  return {
    29 +    title: study.metaTitle || study.title,
    30 +    description: study.metaDesc || study.challenge?.substring(0, 160),
    31 +  };
    32 +}
    33 +
    34 +export default async function CaseStudyDetailPage({ params }) {
    35 +  const { slug } = await params;
    36 +  const study = caseStudies.find((cs) => cs.slug === slug);
    37 +
    38 +  if (!study) {
    39 +    notFound();
    40    }
      41
    42    return (
     ...
      55`<header className="mb-16">`
      56            `<div className="flex items-center gap-4 mb-8">`
      57              `<Badge className="bg-accent text-primary hover:bg-accent/90 px-4 py-2 text-sm font-bold">`
      57 -              {study.project?.category?.name || 'Success Story'}
    58 +              {study.sector || 'Success Story'}
    59`</Badge>`
      60              `<div className="h-px bg-slate-200 flex-1"></div>`
      61              `<Badge className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-bold">`
      61 -              {study.status}
    62 +              {study.status || 'Completed'}
    63`</Badge>`
      64            `</div>`
      65
    ...
      74`<Target className="w-6 h-6" />`
      75                  `</div>`
      76                  `<div>`
      76 -                  `<div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">`Client`</div>`
    77 -`<div className="text-lg font-bold text-slate-900">`{study.client || 'Confidential'}`</div>`
    77 +`<div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">`Country`</div>`
    78 +`<div className="text-lg font-bold text-slate-900">`{study.country || 'Confidential'}`</div>`
    79`</div>`
      80                `</div>`
      81
    81 -              {study.project && (
    82 -`<div className="flex items-center gap-4">`
    83 -`<div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">`
    84 -`<Lightbulb className="w-6 h-6" />`
    85 -`</div>`
    86 -`<div>`
    87 -`<div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">`Solution`</div>`
    88 -`<div className="text-lg font-bold text-slate-900">`{study.project.title}`</div>`
    89 -`</div>`
    82 +`<div className="flex items-center gap-4">`
    83 +`<div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">`
    84 +`<Lightbulb className="w-6 h-6" />`
    85`</div>`
      91 -              )}
    86 +`<div>`
    87 +`<div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">`Contract`</div>`
    88 +`<div className="text-lg font-bold text-slate-900">`{study.contract || 'N/A'}`</div>`
    89 +`</div>`
    90 +`</div>`
    91
    92`<div className="flex gap-2">`
      93                  `<Button variant="outline" size="icon" className="rounded-xl border-slate-200 hover:bg-primary hover:text-accent hover:border-primary
           transition-all">`
     ...
      101            `</div>`
      102          `</header>`
      103
    105 -        {/* Featured Image */}
    106 -`<div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 mb-16 aspect-video">`
    107 -          <Image
    108 -            src={study.thumbnail || study.project?.thumbnail || 'https://via.placeholder.com/1200x600?text=Case+Study'}
    109 -            alt={study.title || 'Case study image'}
    110 -            fill
    111 -            className="object-cover"
    112 -            unoptimized
    113 -          />
    104 +        {/* Featured Image Placeholder */}
    105 +`<div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 mb-16 aspect-video bg-gradient-to-br from-primary/20 to-a
          +ccent/20">`
    106 +`<div className="absolute inset-0 flex items-center justify-center">`
    107 +`<div className="text-center">`
    108 +`<div className="text-6xl mb-4">`{study.sector?.charAt(0) || '📁'}`</div>`
    109 +`<div className="text-xl font-bold text-primary">`{study.sector}`</div>`
    110 +`</div>`
    111 +`</div>`
    112`<div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"></div>`
      113          `</div>`
      114
    115          {/* Overview */}
      116`<div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16">`
      117            `<h2 className="text-3xl font-bold text-primary mb-6">`Project Overview`</h2>`
      120 -          `<p className="text-lg text-slate-600 leading-relaxed mb-8">`{study.excerpt}`</p>`
    118 +`<p className="text-lg text-slate-600 leading-relaxed mb-8">`{study.metaDesc}`</p>`
    119
    120            {/* Technologies */}
      121            {study.technologies?.length > 0 && (
      122`<div>`
      123                `<h3 className="text-lg font-bold text-slate-900 mb-4">`Technologies Used`</h3>`
      124                `<div className="flex flex-wrap gap-3">`
      127 -                {study.technologies.map(tech => (
    125 +                {study.technologies.map((tech) => (
    126                    <Badge key={tech} variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-primary hover:text-accent border border-sla
           te-200 px-4 py-2 text-sm font-medium transition-all">
      127                      {tech}
      128`</Badge>`
     ...
      130                `</div>`
      131              `</div>`
      132            )}
      133 +
    134 +          {/* Compliance */}
    135 +          {study.compliance && (
    136 +`<div className="mt-6">`
    137 +`<h3 className="text-lg font-bold text-slate-900 mb-4">`Compliance`</h3>`
    138 +`<div className="flex flex-wrap gap-3">`
    139 +                {study.compliance.split(',').map((comp) => (
    140 +                  <Badge key={comp} variant="outline" className="border-emerald-200 text-emerald-700 bg-emerald-50 px-4 py-2 text-sm font-medium">
      141 +                    {comp.trim()}
    142 +`</Badge>`
    143 +                ))}
    144 +`</div>`
    145 +`</div>`
    146 +          )}
    147`</div>`
      148
    149          {/* Challenge, Approach, Results Grid */}
     ...
      173`</div>`
      174          `</div>`
      175
    164 -        {/* Project Details */}
    165 -        {study.project && (
    176 +        {/* Client Quote */}
    177 +        {study.clientQuote && (
    178`<div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16">`
      167 -            `<h2 className="text-3xl font-bold text-primary mb-8">`Related Solution`</h2>`
    168 -`<div className="grid md:grid-cols-2 gap-8">`
    169 -`<div>`
    170 -`<h3 className="text-xl font-bold text-slate-900 mb-4">`{study.project.title}`</h3>`
    171 -`<p className="text-slate-600 leading-relaxed mb-6">`{study.project.description}`</p>`
    172 -`<div className="flex flex-wrap gap-3">`
    173 -                  {study.project.tags?.map(tag => (
    174 -                    <Badge key={tag} variant="outline" className="border-slate-200 text-slate-600">
    175 -                      {tag}
    176 -`</Badge>`
    177 -                  ))}
    178 -`</div>`
    179 -`</div>`
    180 -`<div className="bg-slate-50 rounded-2xl p-6">`
    181 -`<div className="space-y-4">`
    179 +`<blockquote className="text-xl md:text-2xl font-medium text-slate-700 italic leading-relaxed">`
    180 +&ldquo;{study.clientQuote}&rdquo;
    181 +`</blockquote>`
    182 +`</div>`
    183 +        )}
    184 +
    185 +        {/* Project Details */}
    186 +`<div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-lg mb-16">`
    187 +`<h2 className="text-3xl font-bold text-primary mb-8">`Project Details`</h2>`
    188 +`<div className="grid md:grid-cols-2 gap-8">`
    189 +`<div>`
    190 +`<div className="space-y-4">`
    191 +                {study.sector && (
    192`<div>`
      183 -                    `<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Category`</div>`
    184 -`<div className="text-lg font-bold text-slate-900">`{study.project.category?.name}`</div>`
    193 +`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Sector`</div>`
    194 +`<div className="text-lg font-bold text-slate-900">`{study.sector}`</div>`
    195`</div>`
      196 +                )}
    197 +                {study.country && (
    198`<div>`
      199 +                    `<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Country`</div>`
    200 +`<div className="text-lg font-bold text-slate-900">`{study.country}`</div>`
    201 +`</div>`
    202 +                )}
    203 +                {study.status && (
    204 +`<div>`
    205`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Status`</div>`
      188 -                    `<div className="text-lg font-bold text-slate-900">`{study.project.status}`</div>`
    206 +`<div className="text-lg font-bold text-slate-900">`{study.status}`</div>`
    207`</div>`
      190 -                  {study.project.url && (
    191 -`<div>`
    192 -`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Live URL`</div>`
    193 -                      <Link
    194 -                        href={study.project.url}
    195 -                        target="_blank"
    196 -                        className="text-primary hover:text-accent transition-colors font-medium"
    197 -                      >
    198 -                        View Project →
    199 -`</Link>`
    200 -`</div>`
    201 -                  )}
    202 -`</div>`
    208 +                )}
    209`</div>`
      210              `</div>`
      211 +            `<div className="bg-slate-50 rounded-2xl p-6">`
    212 +`<div className="space-y-4">`
    213 +                {study.readingTime > 0 && (
    214 +`<div>`
    215 +`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Reading Time`</div>`
    216 +`<div className="text-lg font-bold text-slate-900">`{study.readingTime} min`</div>`
    217 +`</div>`
    218 +                )}
    219 +                {study.lastUpdated && (
    220 +`<div>`
    221 +`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`Last Updated`</div>`
    222 +`<div className="text-lg font-bold text-slate-900">`{study.lastUpdated}`</div>`
    223 +`</div>`
    224 +                )}
    225 +                {study.ipOwnership && (
    226 +`<div>`
    227 +`<div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">`IP Ownership`</div>`
    228 +`<div className="text-lg font-bold text-slate-900">`{study.ipOwnership}`</div>`
    229 +`</div>`
    230 +                )}
    231 +`</div>`
    232 +`</div>`
    233`</div>`
      206 -        )}
    234 +`</div>`
    235
    236          {/* CTA Section */}
      237`<div className="bg-linear-to-r from-primary to-primary-mid rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">`
     ...
      261        `</article>`
      262      `</main>`
      263    );
      236 -}
    264 +}
    265   No newline at end of file

  Thought for 52s (ctrl+o to expand)

● Now let me check and update the case studies list page to use the data file:

  Thought for 21s, read 1 file (ctrl+o to expand)

● Write(app\(landing)\case-studies\page.js)
  ⎿  Added 66 lines, removed 28 lines
       1 -'use client';
    2 -
    3 -import { useCaseStudyList } from '@/hooks/useCaseStudies';
    4 -import { Skeleton } from '@/components/ui/skeleton';
    5 -import { CaseStudyCard } from '@/components/admin/case-study-card';                                                                                        6 -import { Button } from '@/components/ui/button';
    1 +import { caseStudies } from '@/data/case-studies';                                                                                                         2  import Link from 'next/link';
    3 +import { Button } from '@/components/ui/button';
    4 +import { Badge } from '@/components/ui/badge';
    5
    6 +// Server component - fetches data directly from static file
    7  export default function CaseStudiesPage() {
      10 -  const { data: caseStudies, isLoading } = useCaseStudyList();
    11 -  const publishedStudies = caseStudies?.filter(s => s.published) || [];
    8 +  // Sort by ID (P number) for consistent ordering
    9 +  const sortedStudies = [...caseStudies].sort((a, b) => a.id.localeCompare(b.id));
    10
    11    return (
      12`<main className="bg-white">`
     ...
      22
    23`<section className="py-24 bg-surface">`
      24          `<div className="container">`
      27 -          {isLoading ? (
    28 -`<div className="grid grid-cols-1 md:grid-cols-2 gap-10">`
    29 -              {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-100 rounded-3xl" />)}
    30 -`</div>`
    31 -          ) : publishedStudies.length === 0 ? (
    25 +          {sortedStudies.length === 0 ? (
    26`<div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100">`
      27                `<h3 className="text-2xl font-bold text-slate-900">`Case studies coming soon`</h3>`
      28                `<p className="text-slate-500 mt-2">`We&apos;re currently preparing our latest success stories. Check back soon!`</p>`
     ...
      32              `</div>`
      33            ) : (
      34              `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">`
      41 -              {publishedStudies.map((study, index) => (
    42 -                <div
    43 -                  key={study._id}
    44 -                  className="opacity-0 animate-fade-up"
    35 +              {sortedStudies.map((study, index) => (
    36 +                <Link
    37 +                  key={study.id}
    38 +                  href={`/case-studies/${study.slug}`}
    39 +                  className="block opacity-0 animate-fade-up group"
    40                    style={{ animationDelay:`${index * 0.1}s`, animationFillMode: 'forwards' }}
      41                  >
      47 -                  <CaseStudyCard
    48 -                    title={study.title}
    49 -                    excerpt={study.excerpt}
    50 -                    challenge={study.challenge}
    51 -                    results={study.results}
    52 -                    category={study.project?.category?.name || 'Project'}
    53 -                    thumbnail={study.thumbnail || study.project?.thumbnail || 'https://via.placeholder.com/800x450?text=Success+Story'}
    54 -                    href={`/case-studies/${study.slug || study._id}`}
    55 -                  />
    56 -`</div>`
    42 +`<article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/1
         +0 transition-all duration-300 h-full">`
    43 +                    {/* Thumbnail */}
    44 +`<div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">`
    45 +`<div className="absolute inset-0 flex items-center justify-center">`
    46 +`<span className="text-5xl font-black text-primary/30 group-hover:text-primary/50 transition-colors">`
    47 +                          {study.sector?.charAt(0) || '📁'}
    48 +
    49 +`</div>`
    50 +`<div className="absolute top-4 left-4">`
    51 +`<Badge className="bg-accent text-primary hover:bg-accent/90 px-3 py-1 text-xs font-bold">`
    52 +                          {study.sector?.split('/')[0]?.trim() || 'Case Study'}
    53 +`</Badge>`
    54 +`</div>`
    55 +                      {study.status && (
    56 +`<div className="absolute top-4 right-4">`
    57 +`<Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">`
    58 +                            {study.status}
    59 +`</Badge>`
    60 +`</div>`
    61 +                      )}
    62 +`</div>`
    63 +
    64 +                    {/* Content */}
    65 +`<div className="p-8">`
    66 +`<h2 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2">`
    67 +                        {study.title}
    68 +`</h2>`
    69 +
    70 +`<p className="text-slate-600 mb-6 line-clamp-3">`
    71 +                        {study.metaDesc || study.challenge?.substring(0, 150)}
    72 +`</p>`
    73 +
    74 +                      {/* Meta info */}
    75 +`<div className="flex items-center justify-between text-sm text-slate-500">`
    76 +`<div className="flex items-center gap-4">`
    77 +                          {study.country && (
    78 +`<span className="flex items-center gap-1">`
    79 +                              📍 {study.country}
    80 +
    81 +                          )}
    82 +                          {study.readingTime > 0 && (
    83 +`<span className="flex items-center gap-1">`
    84 +                              ⏱️  {study.readingTime} min
    85 +
    86 +                          )}
    87 +`</div>`
    88 +`<span className="text-primary font-medium group-hover:underline">`
    89 +                          Read more →
    90 +
    91 +`</div>`
    92 +`</div>`
    93 +`</article>`
    94 +`</Link>`
    95                ))}
      96`</div>`
      97            )}
     ...
      118        `</section>`
      119      `</main>`
      120    );
       83 -}
    121 +}
    122   No newline at end of file

  Thought for 2s (ctrl+o to expand)

  Thought for 2s (ctrl+o to expand)

● Let me run a test build to verify everything works:

● Bash(cd "C:\Users\PC-24\Desktop\Software uk" && npm run build 2>&1 | head -100)
  ⎿  Interrupted · What should Claude do instead?

❯ first lets verdify that main case-studies pages has been updated or not,  where very case studies come i a cards and the cards is a resuable components , and then   the case-studes-[slug]/pages where all the contect of that case-stuedies will come ,

  Thought for 10s (ctrl+o to expand)

● Let me check the current setup - first the reusable CaseStudyCard component:

  Thought for 11s, searched for 1 pattern, read 1 file (ctrl+o to expand)
● Good, there's a reusable CaseStudyCard component. Let me update the list page to use it properly:

● Write(app\(landing)\case-studies\page.js)  ⎿  Added 14 lines, removed 58 lines
      1  import { caseStudies } from '@/data/case-studies';
      2  import Link from 'next/link';
      3  import { Button } from '@/components/ui/button';
      4 -import { Badge } from '@/components/ui/badge';                                                                                                             4 +import { CaseStudyCard } from '@/components/admin/case-study-card';
    5        6  // Server component - fetches data directly from static file
      7  export default function CaseStudiesPage() {
    ...
      31`</Button>`
      32              `</div>`
      33            ) : (
      34 -            `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">`
    34 +`<div className="grid grid-cols-1 md:grid-cols-2 gap-10">`
    35                {sortedStudies.map((study, index) => (
      36 -                <Link
    36 +                <div
    37                    key={study.id}
      38 -                  href={`/case-studies/${study.slug}`}
    39 -                  className="block opacity-0 animate-fade-up group"
    38 +                  className="opacity-0 animate-fade-up"
    39                    style={{ animationDelay:`${index * 0.1}s`, animationFillMode: 'forwards' }}
      40                  >
      42 -                  `<article className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/1
         -0 transition-all duration-300 h-full">`
    43 -                    {/* Thumbnail */}
    44 -`<div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">`
    45 -`<div className="absolute inset-0 flex items-center justify-center">`
    46 -`<span className="text-5xl font-black text-primary/30 group-hover:text-primary/50 transition-colors">`
    47 -                          {study.sector?.charAt(0) || '📁'}
    48 -
    49 -`</div>`
    50 -`<div className="absolute top-4 left-4">`
    51 -`<Badge className="bg-accent text-primary hover:bg-accent/90 px-3 py-1 text-xs font-bold">`
    52 -                          {study.sector?.split('/')[0]?.trim() || 'Case Study'}
    53 -`</Badge>`
    54 -`</div>`
    55 -                      {study.status && (
    56 -`<div className="absolute top-4 right-4">`
    57 -`<Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-bold">`
    58 -                            {study.status}
    59 -`</Badge>`
    60 -`</div>`
    61 -                      )}
    62 -`</div>`
    63 -
    64 -                    {/* Content */}
    65 -`<div className="p-8">`
    66 -`<h2 className="text-2xl font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-2">`
    67 -                        {study.title}
    68 -`</h2>`
    69 -
    70 -`<p className="text-slate-600 mb-6 line-clamp-3">`
    71 -                        {study.metaDesc || study.challenge?.substring(0, 150)}
    72 -`</p>`
    73 -
    74 -                      {/* Meta info */}
    75 -`<div className="flex items-center justify-between text-sm text-slate-500">`
    76 -`<div className="flex items-center gap-4">`
    77 -                          {study.country && (
    78 -`<span className="flex items-center gap-1">`
    79 -                              📍 {study.country}
    80 -
    81 -                          )}
    82 -                          {study.readingTime > 0 && (
    83 -`<span className="flex items-center gap-1">`
    84 -                              ⏱️  {study.readingTime} min
    85 -
    86 -                          )}
    87 -`</div>`
    88 -`<span className="text-primary font-medium group-hover:underline">`
    89 -                          Read more →
    90 -
    91 -`</div>`
    92 -`</div>`
    93 -`</article>`
    94 -`</Link>`
    41 +                  <CaseStudyCard
    42 +                    title={study.title}
    43 +                    excerpt={study.metaDesc || study.challenge?.substring(0, 200)}
    44 +                    challenge={study.challenge}
    45 +                    results={study.results}
    46 +                    category={study.sector?.split('/')[0]?.trim() || 'Case Study'}
    47 +                    thumbnail={null}
    48 +                    href={`/case-studies/${study.slug}`}
    49 +                  />
    50 +`</div>`
    51                ))}
      52`</div>`
      53            )}

● API Error: Request rejected (429) · you (developer9356) have reached your session usage limit, upgrade for higher limits: https://ollama.com/upgrade (ref:
  12c52684-d98f-4e31-8e00-15a25c05d561)
