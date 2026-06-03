---
name: nextjs-dynamic-import-gotchas
description: Fix common next/dynamic import errors in Next.js App Router — named export wrapping, SSR handling, and build verification
source: auto-skill
extracted_at: '2026-06-02T01:20:00.000Z'
---

# next/dynamic Import Gotchas in Next.js App Router

## When to Use

- Implementing lazy-loading for below-the-fold sections in Next.js
- Build fails with "rendering a JavaScript object instead of valid HTML" after adding `next/dynamic`
- `TypeError: Cannot read properties of null (reading 'useContext')` in dynamically imported components
- Dynamically imported components don't render or show blank space

## The Core Rule

**`next/dynamic(() => import('...'))` expects the resolved value to be a DEFAULT EXPORT component.**

If the module has a **named export** (e.g., `export function MyComponent()`), you MUST NOT return a plain object from `.then()`.

## Pattern 1: Default Export (Simple)

```js
// Works — module has `export default function MyComponent()`
const MyComponent = dynamic(() => import('@/components/MyComponent'), { ssr: true });
```

## Pattern 2: Named Export (Wrapper Required)

**WRONG** — returns a plain object `{}`, not a React component:
```js
// ❌ This causes "rendering a JavaScript object" error
const TechStackSection = dynamic(() =>
  import('./TechStackSection').then(mod => ({ default: mod.TechStackSection })),
  { ssr: true }
);
```

**WRONG** — `__esModule` hack doesn't work either:
```js
// ❌ Still a plain object, not a function/component
const TechStackSection = dynamic(() =>
  import('./TechStackSection').then(mod => ({
    __esModule: true,
    default: mod.TechStackSection,
  })),
  { ssr: true }
);
```

**CORRECT** — return a React component function that wraps the named export:
```js
// ✅ Returns a function component that renders the named export
const TechStackSection = dynamic(() =>
  import('./TechStackSection').then(mod => {
    const Comp = mod.TechStackSection;
    const Wrapper = (props) => <Comp {...props} />;
    Wrapper.displayName = 'TechStackSection';
    return Wrapper;
  }),
  { ssr: true }
);
```

## How to Check Export Type

**ALWAYS** verify each component's export before writing the dynamic import. Never assume — many files have both, only named, or only default.

```bash
grep "^export " path/to/Component.jsx
```

Results and which pattern to use:
- **Only `export default`** → Pattern 1 (simple `dynamic(() => import(...))`)
- **Only named `export function`** → Pattern 2 (MUST wrap with `.then()`)
- **Both `export function` + `export default`** → Either pattern works; Pattern 1 is simpler

### Common Mistake: Assuming Default When Only Named Exists

When dynamically importing many components in bulk (e.g., lazy-loading 10+ sections), it's easy to put them all in the "default export" group without checking. **This causes the exact "Element type is invalid: got: object" error** because `next/dynamic` receives `undefined` for `.default` and passes an empty object `{}` to React.

**Debug approach when build fails with "got: object":**
1. Note which page URL fails (e.g., `/software-development`)
2. Read the page component file to find all `dynamic()` calls
3. For **each** dynamically imported component, grep its source: `grep "^export " path/to/Component.jsx`
4. Any component that only has named exports but was imported with simple Pattern 1 → change to Pattern 2 wrapping

### Example: Bulk Audit of main-service.jsx

When we had 8 dynamically imported components in `main-service.jsx`:
- `ExploreSection.jsx` — `export function ExploreSection` only → needed wrapper ❌ was simple
- `PainPointsSolutions.jsx` — `export default function` only → simple import OK ✓
- `TrustedClientsSection.jsx` — both named + default → simple import OK ✓
- `AppsSection.jsx` — `export function AppsSection` only → needed wrapper ❌ was simple
- `ProcessPage.jsx` — both named + default → simple import OK ✓
- `FeaturedInsights.jsx` — `export default function` only → simple import OK ✓
- `industries-section.jsx` — `export function IndustriesSection` only → needed wrapper ❌ was simple
- `TestimonialsSection.jsx` — `export function TestimonialsSection` only → needed wrapper ❌ was simple

**4 out of 8 were wrong** — all 4 "named export only" components were imported with simple Pattern 1, causing the build to fail with "Element type is invalid: got: object".

## Batch Implementation Pattern

When lazy-loading many sections from a page, group them by export type:

```js
// Default exports — simple imports
const Hero = dynamic(() => import('./Hero'), { ssr: true });
const Portfolio = dynamic(() => import('./Portfolio'), { ssr: true });
const Services = dynamic(() => import('./Services'), { ssr: true });

// Named exports — wrapper required
const TechStackSection = dynamic(() =>
  import('./TechStackSection').then(mod => {
    const C = mod.TechStackSection;
    const W = (props) => <C {...props} />;
    W.displayName = 'TechStackSection';
    return W;
  }),
  { ssr: true }
);
```

## Build Verification

After implementing dynamic imports, run `npm run build` and check:

1. **Compilation**: `✓ Compiled successfully` — must see this
2. **TypeScript**: `✓ Finished TypeScript` — must see this
3. **Look for YOUR file names** in any errors — if page.js or main-service.jsx appear in error traces, you have an import issue
4. **Pre-existing errors** (e.g., Lenis useContext null in unrelated sub-service pages) are NOT caused by your changes

Common unrelated errors you can ignore if they existed before your changes:
- `TypeError: Cannot read properties of null (reading 'useContext')` in SmoothScroll/Lenis
- `ChunkLoadError` for modules you didn't touch
- Admin page errors when only landing pages were modified

## Pattern 3: Named Export — Direct Return (Also Valid)

An alternative to the wrapper function pattern — directly return the named function:

```js
// ✅ Also works — returns the function component directly
const ProcessSection = dynamic(() =>
  import('@/components/landings/sub-services/ProcessSection').then(mod => mod.ProcessSection)
);
```

This works because `mod.ProcessSection` IS already a function component. It's equivalent to Pattern 2 but without the wrapper.

**Difference from Pattern 2:** The wrapper creates a new component (`Wrapper`) that renders `<Comp {...props} />`. The direct return gives `next/dynamic` the raw function. Both are valid React components. The wrapper pattern is more defensive and preserves `displayName`.

## SSR Behavior

- `{ ssr: true }` (default): Component renders on server + client. Use for all above-the-fold-adjacent content.
- `{ ssr: false }`: Client-only. Only use for components that access `window`/`document` directly at module level (e.g., map libraries, browser-only APIs).
- Components that conditionally check `typeof window !== 'inside useEffect'` are SSR-safe with `ssr: true`.
