---
name: nextjs-canonical-tags
description: Audit and fix canonical tags across all Next.js App Router pages — handle generateMetadata, static metadata exports, client component constraints, and domain consistency
source: auto-skill
extracted_at: '2026-06-22T07:40:43.705Z'
---

# Next.js Canonical Tag Audit & Fix

## When to Use

- SEO audit reveals missing or incorrect canonical tags
- `siteConfig.url` or domain constant points to wrong domain
- Need to add canonical tags to a Next.js App Router project at scale
- Build fails because `export const metadata` is used in a `'use client'` component

## Key Concepts

### Canonical vs Self-Canonical
- **Canonical tag**: Tells search engines the master URL for duplicate/similar content
- **Self-canonical**: Page pointing to itself as canonical — best practice for ALL pages
- Next.js does NOT auto-generate canonical tags — they must be explicitly set

### Two Metadata Patterns in App Router
1. **`generateMetadata()`** — for dynamic pages with access to params/data
2. **`export const metadata`** — for static pages with fixed values

### Client Component Constraint
- `export const metadata` is **NOT allowed** in `'use client'` components
- For client-component pages, create a separate `layout.js` in the same route directory that exports metadata

## Audit Procedure

### Step 1: Check domain consistency
```bash
# Find all domain references in metadata
grep -r "https://.*\." app/ --include="*.js" | grep -v node_modules | grep -v ".next"
```
Check `siteConfig.url` or equivalent domain constant — this is the single source of truth.

### Step 2: Find pages missing canonical
Create an audit script or use grep:
```bash
# Find page.js files with generateMetadata but no alternates
grep -l "generateMetadata" app/**/page.js | while read f; do
  if ! grep -q "alternates" "$f"; then
    echo "MISSING canonical (generateMetadata): $f"
  fi
done

# Find page.js files with no metadata export at all
find app -name "page.js" -exec sh -c 'grep -q "export const metadata\|generateMetadata" "$1" || echo "NO metadata: $1"' _ {} \;
```

### Step 3: Identify client component pages
```bash
grep -l "'use client'" app/**/page.js
```
These pages CANNOT export metadata directly — they need a `layout.js` sibling.

## Fix Patterns

### Pattern A: Dynamic detail pages with `generateMetadata`
Add `alternates.canonical` to the return object:
```js
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getDataBySlug(slug);
  if (!item) return { title: 'Not Found' };

  return {
    title: item.metaTitle,
    description: item.metaDesc,
    alternates: {
      canonical: `https://yourdomain.com/${slug}`,
    },
  };
}
```

### Pattern B: Static listing pages
Add `export const metadata`:
```js
export const metadata = {
  title: 'Page Title | Brand',
  description: 'Page description for SEO.',
  alternates: { canonical: 'https://yourdomain.com/page-path' },
};
```

### Pattern C: Client component pages (`'use client'`)
Remove any `export const metadata` from the page file. Create a `layout.js` in the same directory:
```js
export const metadata = {
  title: 'Page Title | Brand',
  description: 'Page description.',
  alternates: { canonical: 'https://yourdomain.com/page-path' },
};

export default function PageLayout({ children }) {
  return children;
}
```

### Pattern D: Domain constant fix
If `siteConfig.url` or equivalent has wrong domain:
```js
// BEFORE (wrong)
export const siteConfig = { url: 'https://old-domain.com' };

// AFTER (correct)
export const siteConfig = { url: 'https://correct-domain.co.uk' };
```
This fixes ALL pages that reference the constant — single point of failure.

## Common Pitfalls

1. **Wrong domain in canonical**: Worse than no canonical — tells Google the wrong page is canonical
2. **Metadata in client component**: Build error — must use `layout.js` sibling instead
3. **Forgetting listing pages**: Detail pages get canonical but their listing pages don't
4. **Inconsistent domain**: Some pages use `siteConfig.url`, others hardcode a different domain
5. **FAQ page with wrong brand name**: Copy-paste from template (e.g., "Softflow" instead of actual brand)

## Build Verification

After all fixes, run `npm run build` and check:
- No new metadata-related build errors
- Pre-existing errors (e.g., Radix UI prerender) are unchanged
- Canonical tags appear in rendered HTML `<head>` for all pages
