---
name: data-export-gap
description: Fix missing data exports after script regeneration — when convert-*.js rewrites data/*.js but drops helper functions and derived exports that components import
source: auto-skill
extracted_at: '2026-06-22T10:29:53.375Z'
---

# Data Export Gap — When Regeneration Drops Helpers

## When to Use

- After running a `scripts/convert-*.js` script that overwrites `data/*.js`
- Build fails with `Export X doesn't exist in target module` for data files
- The data file only exports a raw array but components import helper functions (`getBySlug`, `getRelated`, `getMeta`, etc.)
- The conversion script writes a fresh `export const items = [...]` but doesn't append helper functions

## The Problem

Conversion scripts (`scripts/convert-*.js`) typically overwrite the entire `data/*.js` file with a fresh array:

```javascript
export const caseStudies = [ ... ];
```

But the consuming components (pages, layouts, navbars) import **helper functions and derived exports** that were manually added after a previous regeneration:

```javascript
import { getCaseStudyBySlug, getRelatedCaseStudies } from '@/data/case-studies';
import { caseStudyListings, getSectorsMeta } from '@/data/case-studies';
```

After regeneration, these exports are gone → build fails.

## The Solution

**Append helper functions and derived exports at the end of the data file**, AFTER the raw array. Never put them inside the script-generated block — the script will overwrite them.

### Pattern 1: Lightweight Listings (for listing/filter pages)

```javascript
const _listingFields = [
  'id', 'slug', 'title', 'metaTitle', 'metaDesc', 'sector', 'country',
  'status', 'contract', 'technologies', 'ipOwnership', 'lastUpdated',
  'readingTime', 'writtenBy', 'reviewedBy',
];

export const caseStudyListings = caseStudies.map(cs => {
  const obj = {};
  for (const f of _listingFields) obj[f] = cs[f];
  return obj;
});
```

**Why:** Listing pages don't need heavy text fields (`challenge`, `approach`, `results`). A lightweight array reduces memory and improves build performance.

### Pattern 2: Lookup by Slug (for detail pages)

```javascript
export function getCaseStudyBySlug(slug) {
  return caseStudies.find(cs => cs.slug === slug) || null;
}
```

### Pattern 3: Related Items (for "you may also like" sections)

```javascript
export function getRelatedCaseStudies(slug, count = 3) {
  const current = getCaseStudyBySlug(slug);
  if (!current) return [];
  const currentSector = current.sector?.split('/')[0]?.trim();
  return caseStudies
    .filter(cs => cs.slug !== slug && cs.sector?.split('/')[0]?.trim() === currentSector)
    .slice(0, count);
}
```

### Pattern 4: Filter/Taxonomy Meta (for filter UI)

```javascript
export function getSectorsMeta() {
  const sectorCounts = {};
  for (const cs of caseStudies) {
    const key = cs.sector?.split('/')[0]?.trim()
      .replace(/[\uD800-\uDFFF]/g, '').trim() || 'Other';
    sectorCounts[key] = (sectorCounts[key] || 0) + 1;
  }
  const sectors = Object.entries(sectorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
  return { sectors, sectorCounts };
}
```

## Checklist After Regenerating Any Data File

1. Run `npm run build` — check for `Export X doesn't exist` errors
2. If errors reference data file exports, append the missing helpers to the END of the data file
3. Verify the helpers reference the correct array name (e.g., `caseStudies` vs `caseStudyListings`)
4. Rebuild to confirm all imports resolve

## Known Affected Files (ClickMasters)

| Data File | Consumers | Required Exports |
|-----------|-----------|-----------------|
| `data/case-studies.js` | `Navbar.js`, `case-studies/page.js`, `case-studies/[slug]/page.js` | `caseStudyListings`, `getCaseStudyBySlug`, `getRelatedCaseStudies`, `getSectorsMeta` |
