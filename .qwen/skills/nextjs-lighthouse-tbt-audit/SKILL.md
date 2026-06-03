---
name: nextjs-lighthouse-tbt-audit
description: Audit Next.js App Router projects for Lighthouse TBT/Performance issues, tracing root causes across page components and producing a prioritized fix plan
source: auto-skill
extracted_at: '2026-06-02T05:06:58.346Z'
---

# Next.js TBT & Performance Audit

## When to Use

- User shares a Lighthouse report with Performance < 80 or TBT > 200ms
- User asks "why is my Next.js site slow" or "fix my performance score"
- User wants to audit all pages/components for render-blocking issues

## Procedure

### 1. Read the Lighthouse Report

Instruct the user to paste the Lighthouse scores or read the `lighthouse.txt` file. Key metrics:
- **TBT** (Total Blocking Time): target < 200ms. Anything > 500ms is critical.
- **Performance score**: weighted composite; TBT is the heaviest factor.
- **Minimize main-thread work**: breakdown shows Script Evaluation, Style & Layout, Other.
- **Diagnostics**: "Reduce unused JS", "Minimize main-thread work", "Avoid long tasks".
- **Modern HTTP**: indicates HTTP/1.1 vs HTTP/2.
- **Legacy JS**: indicates unnecessary polyfill transpilation.
- **Image delivery**: indicates unoptimized image payloads.

### 1b. Remove Dead Code First

Before auditing performance, eliminate dead code that still gets compiled and bundled. See the `nextjs-dead-code-removal` skill for the full procedure. Quick version:

1. List all files in `components/` subdirectories
2. For each file, grep the entire project for actual imports (`from '.../FileName'` or `import('.../FileName')`)
3. Files with zero imports outside their own directory are dead code — delete them
4. Watch for "unused" comments that are outdated — trust grep results, not comments
5. Watch for broken dynamic imports (e.g., `@/components/landingPage/` when no `landingPage/` directory exists)

**Known dead code patterns in ClickMasters project:**
- `LandingHomeDeferredHeavy.jsx` — orchestrator with broken dynamic imports to non-existent `@/components/landingPage/` path; only referenced in a comment, never actually imported
- Components listed as "unused" in comments within `main-service.jsx` — verify with grep before deleting

### 2. Read package.json — Identify Heavy Libraries

Check for animation/UI libraries that inflate TBT:
- `framer-motion` (~121 KB) — used in 35+ components typically
- `gsap` (~40 KB) — often used alongside framer-motion (redundant)
- `swiper` (~45 KB) — for carousels; CSS scroll-snap is lighter
- `lenis` / `@studio-freight/lenis` (~18 KB each) — smooth scroll; often both installed
- `three` / `@react-three/fiber` — 3D; should always be dynamically imported

### 3. Audit the Homepage Component Tree

Read `app/(landing)/page.js` and identify:
- How many sections are imported synchronously vs dynamically
- Count components: if > 10 sections load at once, lazy-load below-the-fold ones

**Critical: `dynamic()` with `ssr: true` does NOT defer JS loading.** It means the component SSRs, but if it's rendered in the tree (not conditionally), its JS still downloads on page load. True deferral requires either:
- `{ ssr: false }` (client-only, skips SSR entirely)
- Conditional rendering (e.g., `isInView && <LazyComponent />`) so the component only mounts when needed

For EACH imported section component, check:
- Does it import `framer-motion`? Count motion values per component.
- Does it use `useMotionValue`, `useSpring`, `useTransform`? Each creates rAF loops.
- Does it use `AnimatePresence` with staggered children? Expensive on mount.
- Does `framer-motion` usage wrap more than 3 elements per section? Excessive.
- **Does it use `animate={{ ... }}` with `repeat: Infinity`?** This creates a continuous main-thread animation loop that NEVER stops — a major TBT killer even in "lazy-loaded" sections.

**Red flags:**
- A single component creating > 10 motion values (e.g., 9 cards × 9 values each = 81)
- `useSpring` + `useMotionValue` pairs for simple hover effects (use CSS instead)
- `useScroll` + `useTransform` for parallax (use CSS `position: sticky` instead)
- **Infinite animation loops** (`repeat: Infinity`) — replace with CSS `@keyframes` + `animation` property. These run on the main thread continuously and are one of the top TBT contributors.
- **Components "lazy-loaded" with `dynamic()` but rendered immediately** — their JS still loads on page load. The `dynamic()` only helps if the component is conditionally rendered or below the initial viewport fold.

### 3b. Audit Non-Homepage Landing Pages

Check ALL landing page routes for lazy-loading gaps. Common pages that are often missed:
- `app/(landing)/about/page.js` — often imports heavy sections (Services, TechStack, TrustedClients) statically
- `app/(landing)/contact/page.js` — often imports FinalCTA and other heavy components statically
- `app/(landing)/pricing/page.js`, `/faq/page.js`, `/projects/page.js`, `/blog/page.js`, `/case-studies/page.js` — usually lighter but check anyway

For each page, count synchronous imports of components that use framer-motion or other heavy libraries. Any page with > 3 synchronous heavy imports needs lazy-loading.

### 4. Audit Service/Sub-Page Routes

Read `app/(landing)/[category]/page.js` and `app/(landing)/[category]/[service]/page.js`:
- Count synchronous imports in `main-service.jsx` or equivalent
- Identify components that duplicate library usage (GSAP + framer-motion in same file)
- Check for smooth scroll libraries (Lenis) — they run continuous rAF loops
- Check for Swiper — replace with CSS `scroll-snap-type: x mandatory`

### 5. Check for Duplicate Libraries

Common duplicate pairs found in Next.js projects:
- `gsap` + framer-motion (pick one)
- `lenis` + `@studio-freight/lenis` (pick one, or remove both)
- `swiper` + framer-motion AnimatePresence carousel (pick one)

### 6. Check Image Optimization

- Run `find public -name "*.png" -size +50k` (or list_directory) to find large PNGs
- PNG → WebP conversion typically saves 40-60% file size
- Check for external image URLs (pravatar.cc, unsplash) — replace with local optimized versions
- Ensure `<Image>` components have explicit `width` and `height` props

### 7. Check next.config.mjs

- **`optimizePackageImports`**: Check for this experimental config. It rewrites imports from large barrel-export libraries (like `lucide-react`) so only used exports get bundled. Verify it's present for icon libraries:
  ```js
  experimental: {
    optimizePackageIcons: ["lucide-react"],
  }
  ```
  This is a bundle-size optimization only — it doesn't reduce main-thread execution cost.
- **`browserslist` in `package.json`**: If missing or targeting old browsers, 13+ KB of unnecessary polyfills get bundled. Target: `last 2 Chrome/Firefox/Safari/Edge versions, not dead, not ie 11`.
- **Bundle analyzer**: Check if `@next/bundle-analyzer` is enabled. Run `ANALYZE=true npm run build` to see per-page bundle breakdown.
- **`allowedDevOrigins`**: IP addresses for dev server access — not a production concern.

### 8. Write the Solutions Document

Produce `lighthouse-solutions.txt` with this structure:
1. **Executive Summary** — current scores, expected scores
2. **Root cause analysis** — each problem with severity, TBT impact, JS savings
3. **Per-problem solution** — BEFORE/AFTER code for each file
4. **Files to modify** — summary table
5. **Implementation order** — phased approach: quick wins → library removal → fine-tuning → production
6. **Expected results** — before/after metric table

### 9. Rank Fixes by Impact

Priority order (highest TBT reduction first):
1. Remove duplicate animation libraries (GSAP or framer-motion, not both) — saves 40-121 KB JS parse/eval
2. Replace infinite animation loops (`repeat: Infinity`) with CSS `@keyframes` — eliminates continuous main-thread work
3. Lazy-load below-the-fold sections with `next/dynamic` — but only effective for sections rendered conditionally or truly below fold (immediate-render `dynamic()` with `ssr: true` still loads JS on page load)
4. Replace heavy per-element motion values with CSS transitions
5. Remove smooth scroll libraries (use native scroll) — eliminates continuous rAF loop
6. Replace Swiper with CSS scroll-snap
7. Optimize images (PNG → WebP)
8. Add modern browserslist config
9. Inline critical CSS
10. Enable HTTP/2 in production

## Output Format

The solutions document should be written to `{project}/lighthouse-solutions.txt` with:
- Clear BEFORE/AFTER code blocks for each file change
- Specific import lines to add/remove
- Exact CSS replacements for motion effects
- Package.json changes (packages to uninstall)
- Estimated TBT impact and JS savings per fix
