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

For EACH imported section component, check:
- Does it import `framer-motion`? Count motion values per component.
- Does it use `useMotionValue`, `useSpring`, `useTransform`? Each creates rAF loops.
- Does it use `AnimatePresence` with staggered children? Expensive on mount.
- Does `framer-motion` usage wrap more than 3 elements per section? Excessive.

**Red flags:**
- A single component creating > 10 motion values (e.g., 9 cards × 9 values each = 81)
- `useSpring` + `useMotionValue` pairs for simple hover effects (use CSS instead)
- `useScroll` + `useTransform` for parallax (use CSS `position: sticky` instead)

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

### 7. Check Build Configuration

- Look for `browserslist` in `package.json` or `.browserslistrc`
- If missing or targeting old browsers, 13+ KB of unnecessary polyfills get bundled
- Target: `last 2 Chrome/Firefox/Safari/Edge versions, not dead, not ie 11`

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
1. Lazy-load below-the-fold sections with `next/dynamic`
2. Remove duplicate animation libraries (GSAP or framer-motion, not both)
3. Replace heavy per-element motion values with CSS transitions
4. Remove smooth scroll libraries (use native scroll)
5. Replace Swiper with CSS scroll-snap
6. Optimize images (PNG → WebP)
7. Add modern browserslist config
8. Inline critical CSS
9. Enable HTTP/2 in production

## Output Format

The solutions document should be written to `{project}/lighthouse-solutions.txt` with:
- Clear BEFORE/AFTER code blocks for each file change
- Specific import lines to add/remove
- Exact CSS replacements for motion effects
- Package.json changes (packages to uninstall)
- Estimated TBT impact and JS savings per fix
