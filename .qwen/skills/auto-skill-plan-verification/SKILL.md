---
name: plan-verification
description: Systematically verify whether a multi-phase project plan has been completed by cross-referencing the plan document against actual codebase state
source: auto-skill
extracted_at: '2026-06-13T10:39:20.781Z'
---

# Plan Verification Skill

Use when the user asks you to check whether a plan (plan.md, agent.md, or similar) has been fully executed.

## Procedure

### 1. Read the Plan
- Read the full plan document first
- Extract every checkbox/todo item, every phase step, every "Current State" or "Completed" section
- Note the expected counts, file paths, and data structures

### 2. Verify Each Category Systematically

For **each category** in the plan, check in this order:

#### a. Scripts / Conversion Tools
```bash
# Check if the script exists
glob: **/scripts/convert-<category>.js
# Read the script to verify it's functional (not empty/stub)
```

#### b. Data Files
```bash
# Check if the data file exists
glob: **/data/<category>.js
# Count entries
powershell: (Get-Content '<path>' | Select-String '"id":' | Measure-Object).Count
# Read first 50 lines to verify structure and field population
```

#### c. Routes
```bash
# Check route directory structure
list_directory: app/(landing)/<category>/
# Verify dynamic param matches plan (e.g., [slug] vs [id])
# Read the page.js to verify it imports from data file (not API/hooks)
# Check for generateStaticParams() if SSG is planned
# Check for generateMetadata() if SEO is planned
```

#### d. Source Files (DOCX inventory)
```bash
# Count source files match plan
powershell: (Get-ChildItem -Path '<docx-folder>' -Filter '*.docx').Count
```

#### e. Git Status
```bash
# Check for uncommitted changes to plan-related files
git status
git log --oneline -10
```

### 3. Data Quality Spot-Check
- Read at least 2-3 sample entries from each generated data file
- Verify all expected fields are populated (not empty strings)
- Check for clean text (no HTML artifacts, no emoji corruption)
- Verify slug format matches plan convention

### 4. Compile Report

Structure the analysis as:

```
## <Category> — Status

### ✅ Completed
- [item] — evidence

### ❌ Not Started / Incomplete
- [item] — what's missing

### ⚠️ Issues
- [issue] — severity + detail

### Metrics
| Metric | Plan Target | Actual |
|--------|-------------|--------|
```

### 5. Flag Uncommitted Changes
Always end with a note about any modified/unstaged files that relate to the plan — these represent completed work that hasn't been persisted to version control.

## Key Patterns

- **Plan says `[id]` but code has `[slug]`** → plan was updated mid-execution, code is ahead of plan
- **Data file exists but is empty** → script was created but never run
- **Script exists but data file missing** → script was written but not executed
- **Route still imports from hook/API** → migration to static data not done
- **`generateStaticParams` missing** → SSG not configured, build will fail for dynamic routes
- **Entry count < expected** → dedup happened (check if intentional) or extraction failed on some files
