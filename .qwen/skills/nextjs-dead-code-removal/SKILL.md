---
name: nextjs-dead-code-removal
description: Systematic approach to identify and remove dead/unused component files in a Next.js project by verifying actual imports vs directory listing
source: auto-skill
extracted_at: '2026-06-03T11:12:19.638Z'
---

# Next.js Dead Code Removal

## When to Use

- Cleaning up a `components/` subdirectory with many files, some unused
- Components listed as "unused" in comments but not verified
- Reducing bundle size by eliminating dead components that still get compiled
- Before a major refactor when you want to know what's actually in use

## Procedure

### 1. List All Files in the Directory

```bash
ls path/to/components/subdir/
```

### 2. For Each File, Search for Actual Imports Across the Entire Project

```bash
# Search for direct imports (static or dynamic)
grep -r "from.*subdir/FileName" --include="*.{js,jsx,ts,tsx}" .

# Also search for dynamic imports with the path
grep -r "import.*subdir/FileName" --include="*.{js,jsx,ts,tsx}" .
```

**Critical: Do NOT trust comments in source files that label components as "unused".** Comments can be outdated. Only trust actual import statements found via grep.

### 3. Categorize Each File

- **USED**: Found in at least one `import` or `dynamic(() => import(...))` statement outside its own directory
- **DEAD**: Never imported anywhere outside its own directory (self-references don't count)
- **BROKEN**: Referenced in code but the import path doesn't resolve to an existing file (e.g., `@/components/landingPage/` when no `landingPage/` directory exists)

### 4. Check for Broken Dynamic Imports

Some files use `dynamic(() => import('@/components/somePath/Component'))` where `somePath` doesn't exist on disk. These are silent failures — the component never renders but the code compiles. Check with:

```bash
# List the directory the import points to
ls path/that/import/references/
# If ENOENT → broken import
```

### 5. Delete Dead Files

Only delete files confirmed as DEAD (never imported). Move to trash or version control first:

```bash
# Delete confirmed dead files
rm path/to/dead/File1.jsx path/to/dead/File2.jsx
```

### 6. Clean Up Stale Comments

After deletion, remove any comments in other files that listed the deleted files as "unused" — those comments are now misleading.

### 7. Verify Build Still Passes

After removing files, run the build to confirm nothing broke:

```bash
npm run build
```

## Common Pitfalls

- **Comments lie**: A comment saying "unused" may be outdated. A comment saying "used" may also be outdated. Only grep for actual imports.
- **Self-references don't count**: A file importing another file from the same directory doesn't make the target "used" in the project sense — check if anything OUTSIDE the directory imports it.
- **Dynamic imports with wrong paths**: `dynamic(() => import('./Component'))` where `./Component` doesn't exist won't fail at build time in some Next.js configs — it silently fails at runtime. Always verify the path exists.
- **Barrel exports**: If a directory has an `index.js` that re-exports everything, grep for the barrel file instead of individual components.
- **Landing page deferred heavy patterns**: Files like `LandingHomeDeferredHeavy.jsx` that dynamically import from paths that don't exist (`@/components/landingPage/`) are themselves dead code if nothing imports them — even though they look like orchestrators.
