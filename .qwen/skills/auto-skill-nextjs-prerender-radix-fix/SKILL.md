---
name: nextjs-prerender-radix-fix
description: Diagnose and fix Next.js prerender errors with Radix UI context in dynamic route pages — proper root cause analysis instead of data-level workarounds
source: auto-skill
extracted_at: '2026-06-13T12:24:57.265Z'
---

# Next.js Prerender Errors with Radix UI Context

## When to Use

- A dynamic route page (`[slug]`, `[id]`, etc.) fails at build time with a prerender error
- Error mentions Radix UI context (`useContext`, `createContext`, or Radix component internals)
- The workaround of commenting out data entries "fixes" the build — but the root cause is in the component, not the data
- `npm run build` fails only for specific entries in a dynamic route, not all of them

## The Anti-Pattern: Commenting Out Data

**NEVER** comment out data entries as a fix for prerender errors:

```js
// ❌ ANTI-PATTERN — masks the real problem, data stays broken forever
/* Temporarily disabled — causes prerender error with Radix UI context
{
  "id": "P1109",
  "slug": "govtech-defra-environmental-permit-management",
  ...
},
*/
```

This creates a permanent dead entry that will never be fixed. The error will recur for any new entry that triggers the same component bug.

## Root Cause Analysis

### Why Prerender Errors Happen with Radix UI

Radix UI components (Badge, Button, Dialog, etc.) use React Context internally. During Next.js static prerendering (`npm run build`), the page is rendered in a **server-only environment** where:

1. **No browser APIs** — `window`, `document`, `matchMedia` are undefined
2. **No layout** — `ResizeObserver`, `IntersectionObserver` don't exist
3. **Context must be complete** — Radix providers must wrap consumers at render time

The error occurs when a **client component** using Radix UI is rendered during the server-side prerender pass, and something in the render path triggers a code branch that assumes browser APIs exist.

### Most Common Trigger: Data-Dependent Rendering Paths

The error often only affects **specific entries** because different data values trigger different render paths:

```jsx
// This component renders differently based on data
function StatusBadge({ status }) {
  // P1109 has status "On Time" → renders fine
  // But what if another entry has a status that triggers a different branch?
  if (status?.toLowerCase().includes('time')) {
    return <Badge className="bg-emerald-100...">{status}</Badge>;  // ✅ works
  }
  // What if a future entry hits this branch with a Radix component that needs browser APIs?
  return <Badge variant="outline">...</Badge>;
}
```

The key insight: **the error is in the component code, not the data**. The data just happens to trigger a code path that exposes the bug.

## Diagnostic Procedure

### Step 1: Identify the Failing Entry and the Failing Component

1. Run `npm run build` and capture the full error trace
2. Note which dynamic route entry fails (e.g., `P1109`)
3. Note which component in the error stack trace is the deepest — that's the likely culprit

### Step 2: Read the Detail Client Component

Read the client component file (e.g., `app/(landing)/case-studies/[slug]/detail-client.js`) and look for:

- **Radix UI components** (Badge, Button, Dialog, Tabs, Accordion, etc.)
- **Conditional rendering based on data values** — different entries hit different branches
- **Browser API access** inside render (not inside `useEffect`) — `window.innerWidth`, `navigator`, `document.querySelector`
- **Dynamic class construction** that might produce invalid values for Radix components

### Step 3: Check for the Specific Pattern — Radix Component + Conditional Data

The most common pattern that causes entry-specific prerender errors:

```jsx
// ❌ PROBLEM — Radix Badge with conditional className based on data
<Badge className={`${status?.toLowerCase().includes('time') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} px-3 py-1.5 text-xs font-semibold rounded-full`}>
  {study.status || 'Completed'}
</Badge>
```

If `study.status` is `undefined` or has an unexpected value, the conditional still works — but if the **Radix component itself** has an internal code path that breaks during SSR for certain prop combinations, only some entries fail.

### Step 4: Check for Empty/Missing Data Fields

Empty strings (`""`) vs `undefined` vs `null` can cause different behavior in Radix components:

```jsx
// deliveryModel and timeline are empty strings ""
// If the component renders a section for these, it might trigger Radix components with empty content
{study.deliveryModel && (
  <Badge variant="outline">{study.deliveryModel}</Badge>  // Never renders — empty string is falsy
)}
```

This is usually safe. But if the component unconditionally renders a Radix component around empty data:

```jsx
// ❌ PROBLEM — Radix component wrapping potentially empty/undefined content
<Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1.5 text-xs font-semibold rounded-full">
  📋 {study.contract}  {/* If contract is undefined, renders "📋 undefined" */}
</Badge>
```

### Step 5: The Real Fix — Make the Component SSR-Safe

Instead of commenting out data, fix the component:

1. **Add null guards** for all data-dependent Radix component props
2. **Ensure no browser API access** during render (move to `useEffect`)
3. **Use `useEffect` + `useState` for client-only values** (e.g., `window.innerWidth`)
4. **Add `suppressHydrationWarning`** only as a last resort, not a first fix

```jsx
// ✅ FIXED — null-guarded Radix component
{study.contract && study.contract.trim() !== '' && (
  <Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1.5 text-xs font-semibold rounded-full">
    📋 {study.contract}
  </Badge>
)}
```

### Step 6: Re-enable the Commented-Out Entry

Once the component is fixed:

1. Remove the `/* Temporarily disabled */` comment wrapper
2. Verify the entry is valid JSON and part of the array
3. Run `npm run build` to confirm the entry renders without error
4. Navigate to the entry's URL in dev server to verify visual output

## Re-enabling Checklist

When you find a commented-out entry in `data/case-studies.js`:

```bash
# 1. Verify the entry is valid JSON (no trailing commas, proper quotes)
node -e "try { JSON.parse(require('fs').readFileSync('data/case-studies.js','utf-8').match(/\/\*.*?\*\/([\s\S]*?)\/\*/)[1]); console.log('Valid JSON'); } catch(e) { console.log('Invalid:', e.message); }"

# 2. After removing the comment wrapper, verify entry count increased by 1
node -e "var c=require('fs').readFileSync('data/case-studies.js','utf-8'); console.log('Entries:', (c.match(/"slug":/g)||[]).length);"

# 3. Build and check for the specific slug
npm run build 2>&1 | Select-String "P1109|govtech-defra"
```

## Prevention: Add to `generateStaticParams` Verification

If using SSG, add a post-build check that all dynamic slugs are accounted for:

```js
// In the page.js server component
export async function generateStaticParams() {
  const studies = caseStudies.filter(cs => cs.slug); // Only entries with slugs
  return studies.map((cs) => ({ slug: cs.slug }));
}
```

If an entry is missing a `slug` field, it won't be pre-rendered — but it also won't cause a build error. The build error only happens when the slug exists but the component fails during rendering.

## Key Takeaway

**Commenting out data entries is never the fix.** The error is always in the component code — a missing null guard, an unconditional Radix component render, or a browser API accessed during SSR. Fix the component, re-enable the data.

## Related Skills

- `nextjs-dynamic-import-gotchas` — for `next/dynamic` wrapper patterns when lazy-loading the detail client component
- `docx-conversion-gotchas` — for ensuring data entries are correctly parsed from DOCX sources
- `nextjs-lighthouse-tbt-audit` — for performance auditing after fixing prerender errors
