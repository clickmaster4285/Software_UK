---
name: file-corruption-fix
description: Fix invisible character / syntax corruption in source files when edit tool fails — delete and rewrite, or use Node.js regex scripts for data files
source: auto-skill
extracted_at: '2026-06-19T10:43:55.558Z'
---

# File Corruption Fix — Invisible Characters & Syntax Corruption

## When to Use

- `edit` tool says "file not read" or replacement doesn't match even though content looks correct
- Build fails with parse errors like `Expected '</', got '}'` at a line that visually looks correct
- JSX props have corrupted syntax like `onClick => () =>` instead of `onClick={() =>}`
- Regex replacements via shell tools (PowerShell, sed) fail to change the file
- The file content shown by `read_file` looks correct but the actual disk bytes differ

## Root Cause

Files can contain **invisible or corrupted characters** that survive copy-paste, shell escaping, or tool write operations. Common patterns:

| Corruption | Symptom | Example |
|-----------|---------|---------|
| Extra `}` or `)` | Parse error at line that looks fine | `}}>` instead of `}>}` |
| Split arrow `=>` | `onClick => () =>` | `=` separated from `{` |
| Hidden Unicode | Character count mismatch, regex won't match | Zero-width spaces, BOM |
| Shell mangling | PowerShell `-replace` produces literal `` `n `` instead of newlines | Multi-line replacement fails |

## Fix Strategy 1: Delete and Rewrite (For Component Files)

When a `.js` or `.jsx` file has invisible corruption:

1. **Delete the file entirely:**
   ```bash
   del "path\to\file.js"
   ```

2. **Rewrite from scratch** using `write_file` with the exact correct content:
   - Do NOT copy-paste from the old file
   - Type/write the content fresh, or use a known-good template
   - For Suspense fallbacks, ensure `}>` not `}}>`
   - For arrow functions in JSX props, ensure `onClick={() => ...}` not `onClick => () => ...`

3. **Verify with byte-level check:**
   ```powershell
   # Check exact bytes around the previously-corrupted area
   $content = Get-Content -Raw 'path\to\file.js'
   $idx = $content.IndexOf('</Suspense>')
   $content.Substring([Math]::Max(0, $idx - 10), 20)
   ```

4. **Run build** to confirm the fix.

## Fix Strategy 2: Node.js Regex Script (For Data Files)

When a `data/*.js` file has systematic corruption across many entries (e.g., wrong slug prefix):

1. **Write a dedicated `.js` fix script** — do NOT use inline `node -e` or PowerShell for regex on large files:
   ```js
   // fix-data.js
   const fs = require('fs');
   let content = fs.readFileSync('data/glossary.js', 'utf8');
   
   // Count before
   const before = (content.match(/"slug": "glossary\//g) || []).length;
   console.log('Matches found:', before);
   
   // Replace — NOTE: match the EXACT format including spaces
   content = content.replace(/"slug": "glossary\//g, '"slug": "');
   
   // Count after
   const after = (content.match(/"slug": "glossary\//g) || []).length;
   console.log('Matches after:', after);
   
   fs.writeFileSync('data/glossary.js', content);
   console.log('File written');
   ```

2. **Run the script:**
   ```bash
   node fix-data.js
   ```

3. **Verify with cache-cleared require:**
   ```bash
   node -e "delete require.cache[require.resolve('./data/glossary')]; const {glossaryListings} = require('./data/glossary'); console.log('Sample:', glossaryListings[0].slug);"
   ```
   
   **IMPORTANT:** Node.js caches `require()` results. Always clear cache when verifying data file changes:
   ```js
   delete require.cache[require.resolve('./data/glossary')]
   ```

4. **Delete the fix script** after verification.

## Fix Strategy 3: Avoid Inline Shell Regex

**Never use these for file modification:**

```powershell
# ❌ PowerShell -replace with special chars (}}, =>, $) — gets mangled
(Get-Content file.js) -replace '}}>', '}>' | Set-Content file.js

# ❌ Inline node -e with complex regex — quoting nightmares
node -e "var c=fs.readFileSync('f.js','utf8'); c=c.replace(/.../g,'...');"

# ❌ sed on Windows — not available, escaping is nightmarish
```

**Always write a separate `.js` file** for any non-trivial find/replace.

## Common Corruption Patterns in This Project

### Suspense Fallback Extra Brace
```jsx
// ❌ Corrupted
<Suspense fallback={fallbackLoading}>
  ...
}}>     ← extra }

// ✅ Correct
<Suspense fallback={fallbackLoading}>
  ...
</Suspense>
```

### Arrow Function Split
```jsx
// ❌ Corrupted — = separated from {
onClick => () => hasTerms && handleLetterClick(letter)}

// ✅ Correct
onClick={() => hasTerms && handleLetterClick(letter)}
```

### Slug Prefix in Data Files
```js
// ❌ Corrupted — includes folder name in slug
"slug": "glossary/ir35-definition"

// ✅ Correct
"slug": "ir35-definition"
```

## Prevention

- When using `write_file`, write the entire file content at once — don't chain multiple edits
- After any `edit` tool operation, re-read the file to verify the change actually took effect
- For data file generation scripts, verify a sample of output entries before running on full dataset
- Keep backup copies of data files before running fix scripts (`.bak` files are auto-deleted by project cleanup)
