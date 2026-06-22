---
name: fixed-navbar-hero-overlap
description: Diagnose and fix fixed navbar showing wrong background because hero section padding pushes dark background below the navbar
source: auto-skill
extracted_at: '2026-06-22T08:20:46.186Z'
---

# Fixed Navbar Hero Overlap

## When to Use

- A page with a fixed navbar shows a white/light navbar on initial load when it should be transparent with white text
- The navbar background only appears correct after scrolling
- Other pages with the same navbar component work fine — only specific pages are affected

## Root Cause Pattern

A fixed navbar (`position: fixed; top: 0`) sits at the viewport top. It is transparent by default and only gains a background on scroll (via `isScrolled` state or route-based checks).

If the page content wrapper has extra top padding (e.g., `<div className="pt-16">`), the dark hero background starts **below** the navbar's bottom edge. The transparent navbar then shows the page's default white background behind it — making it look like a white navbar on load.

## Diagnosis Steps

1. **Read the Navbar component** — find the `hasWhiteBg` logic. Identify what makes it `true` (scroll, route match, explicit list). Confirm the affected page's route does NOT match any condition.

2. **Read the affected page's client component** — look at the outermost wrapper `<div>`. Check for `pt-*` or `padding-top` classes that push content down.

3. **Compare with a working page** — read the same file from a page that works (e.g., `cities/[slug]/detail-client.jsx`). The working page likely uses `<div className="min-h-screen bg-background">` with no top padding, and puts all spacing inside the hero section itself.

4. **Check the hero section padding** — the hero should have enough top padding (`pt-28` / `pt-36` on desktop) to account for the navbar height, AND the hero's dark background should start at the top of the section (no gap above it).

## Fix Pattern

```diff
  return (
-   <div className="pt-16 md:py-20">
+   <div className="min-h-screen bg-background">
      <ReadingProgress />
-     <section className="relative overflow-hidden pt-16 pb-14 md:pt-20 md:pb-18">
+     <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-18">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
```

**Rules:**
- The outermost wrapper should be `<div className="min-h-screen bg-background">` — no top padding
- All navbar clearance goes inside the hero section as `pt-28` (mobile) / `pt-36` (desktop)
- The hero's `absolute inset-0` background must extend to the very top of the section (behind the fixed navbar)

## Common Mistakes

1. **Adding `pt-*` to the page wrapper** — this pushes ALL content down, including the hero background
2. **Using different padding on the hero vs. other pages** — inconsistent `pt-16` vs `pt-28` causes the hero to start too high or too low
3. **Forgetting `bg-background` on the wrapper** — without it, the page background may default to white, making the transparent navbar appear white

## Verification

After fixing:
1. The dark hero background should be visible behind the navbar on initial load
2. The navbar text should be white (readable against the dark hero)
3. On scroll, the navbar should transition to white background with dark text
4. Behavior should match other detail pages (cities, comparison, glossary, etc.)
