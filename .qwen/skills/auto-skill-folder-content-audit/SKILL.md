---
name: folder-content-audit
description: Audit a folder of DOCX files to identify misclassified content types by analyzing filename patterns, then redistribute files to correct folders before conversion
source: auto-skill
extracted_at: '2026-06-18T11:55:10.808Z'
---

# Folder Content Audit — Identify & Relocate Misclassified Files

## When to Use

Use this skill when:
- A folder of DOCX files is labeled as one content type but may contain files belonging to different categories
- Before writing conversion scripts for a batch of DOCX files
- The master CSV index shows all files in a folder share a single category, but filename patterns suggest otherwise

## The Pattern

A folder named `Industry-Service-Page/` with 573 files was assumed to contain only industry+service pages. Filename pattern analysis revealed 7 distinct content types mixed together:

| Type | Naming Pattern | Count |
|------|---------------|-------|
| True industry+service | `{industry}_{service}` | ~280 |
| Glossary | `glossary_{term}_definition` | ~107 |
| How-To | `howto_how_to_{action}_uk` | 7 |
| Tech pages | `tech_{technology}_development` | ~10 |
| Cost pages | `cost_cost_{topic}_uk` | 3 |
| Resource/Guide | `*_guide_*`, `*_compliance_guide_*` | ~14 |
| City-specific | `*{service}_{known_city}` | ~60 |

## Procedure

### Step 1: Run a Filename Audit Script

Write a quick script (`scripts/audit-<folder>-files.js`) that:
1. Reads all filenames from the folder
2. Strips the `ClickMasters_P{number}_` prefix
3. Classifies each file by pattern (regex or string matching)
4. Outputs a breakdown: type → count + list of P-numbers

```javascript
// Pseudocode
const fs = require('fs');
const path = require('path');
const dir = '../Clickmasterssoftwaredevelopmentcompany.co.uk/<Folder>/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.docx'));

const categories = {};
for (const file of files) {
  const content = file.replace(/ClickMasters_P\d+_/, '').replace(/_uk\.docx$/, '');
  let type;
  if (content.startsWith('glossary_')) type = 'glossary';
  else if (content.startsWith('howto_')) type = 'howto';
  else if (content.startsWith('tech_')) type = 'tech';
  else if (content.startsWith('cost_')) type = 'cost';
  else if (content.match(/_(london|manchester|glasgow|edinburgh|birmingham|dublin)$/)) type = 'city';
  else if (content.match(/guide|compliance|ir35|dtac/)) type = 'resource-guide';
  else type = 'industry-service';
  // accumulate
}
```

### Step 2: Classify File Types

For each file, determine its true content type using filename signals:
- **Explicit prefixes:** `glossary_`, `howto_`, `tech_`, `cost_` — unambiguous
- **City names:** Match against a known list of city names (london, manchester, glasgow, edinburgh, birmingham, dublin, cardiff, bristol, leeds, etc.)
- **Guide keywords:** `guide`, `compliance`, `ir35`, `dtac`, `cyber-essentials`, `smart-grants`
- **Default:** Whatever remains is the "true" content type for that folder

### Step 3: Group Files by Destination

For each misclassified type, determine the destination:
- **Existing folder?** Move to that folder (e.g., city files → `International-City/`, guides → `Resource-Guide/`)
- **No existing folder?** Create a new one (e.g., `Glossary/`, `How-To/`, `Tech/`, `Cost/`)

### Step 4: Write the Plan First

Before executing moves, write the full plan (following the plan-file pattern):
- Document all file types, counts, and destinations
- List P-numbers for each group
- Specify URL routes for new content types
- Define conversion scripts and data files needed
- Get user approval before executing

### Step 5: Execute Moves

Create a Node.js script that:
1. Creates new directories if needed
2. Moves each file to its correct destination (`fs.renameSync`)
3. Logs every move for verification
4. Updates the master CSV index with correct categories

**Safety:** Always use a script, not manual moves. Log every operation. Verify counts after.

### Step 6: Verify

- Count files in each folder after moves
- Ensure total count matches original total
- Spot-check that moved files exist in destination and no longer in source
- Verify CSV updates are accurate

## Key Lessons

- **Never assume folder labels match content.** The master CSV categorized all 573 files as "Industry / Service Page" but filename patterns revealed 7 distinct types.
- **Filename patterns are more reliable than folder labels or CSV categories** for classification.
- **Move before convert.** Converting from a mixed folder produces corrupted data. Clean first.
- **Document P-numbers for each move group** in the plan file — makes the move script deterministic.
- **City files are tricky:** They look like `{service}_{city}` which can be confused with `{industry}_{service}`. Always check the second segment against a known city list.
- **`.docx` suffix stripping bug:** When classifying, always strip `.docx` as a separate step after stripping `_uk.docx`. The regex `replace(/_uk\.docx$/i, '')` won't match `london.docx` (no `_uk`), so the last segment becomes `london.docx` instead of `london`. Fix: chain `.replace(/\.docx$/i, '')` as a second step.
- **Cost files with "cost" in the middle:** Files like `ClickMasters_P4_Custom_Software_Cost_UK.docx` have "cost" in the middle, not as a `cost_` prefix. The prefix-based classifier (`content.startsWith('cost_')`) misses these. Add explicit filename checks for edge cases: `if (filename === 'ClickMasters_P4_Custom_Software_Cost_UK.docx') return 'cost';`
- **Glossary files matching resource-guide patterns:** Files like `glossary_ir35_definition` match both `glossary_` prefix AND resource-guide keywords (`ir35`). Always check prefix patterns BEFORE keyword patterns to avoid misclassification.
- **Console output garbled on Windows:** When running Node.js scripts with large output, the console output gets corrupted. Fix: redirect output to file with `> file.txt 2>&1` then read the file.
- **Merging small categories:** If a category has very few files (e.g., How-To: 7, Cost: 4), consider merging into a broader category (e.g., Resource-Guide) rather than creating separate folders/routes. Confirm with user before deciding.
- **Move script pattern:** Use `fs.renameSync(src, dst)` in a Node.js script. Log counts per type. Verify total moved + remaining = original total. Remove empty folders after merging.
