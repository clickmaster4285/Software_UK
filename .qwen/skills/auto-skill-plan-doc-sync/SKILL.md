---
name: plan-doc-sync
description: Sync plan and agent documentation files to match actual codebase state after implementation — update checkboxes, counts, routes, components, and design decisions
source: auto-skill
extracted_at: '2026-06-20T11:37:23.225Z'
---

# Plan & Agent Doc Sync Skill

Use when the user asks you to update plan files (`plan-*.md`, `agent.md`, `AGENTS.md`) to reflect what was actually built. This is a **write** operation — unlike `auto-skill-plan-verification` which is read-only assessment.

## When to Use

- After completing a conversion phase (e.g., industries, glossary, case studies)
- When checkboxes in plan files are stale (still show `[ ]` for completed work)
- When route architecture changed during implementation vs. what was planned
- When the user says "update the plan/agent to reflect current state"

## Procedure

### 1. Read ALL Source Files First

Before touching any doc file, read the actual implementation:

```bash
# Data file — check structure, entry count, exported helpers
read_file: data/<category>.js (first 80 lines + last 40 lines)

# Route pages — check actual imports, component usage, section structure
read_file: app/(landing)/<category>/page.js
read_file: app/(landing)/<category>/[slug]/page.js

# Custom components — check what was created vs. reused
list_directory: components/landing/<category>/
read_file: components/landing/<category>/ComponentName.jsx

# Reused components — verify which ones are actually imported
grep for import statements in the detail page
```

### 2. Cross-Reference Plan vs. Actual

Create a mental diff between what the plan says and what exists:

| Aspect | Plan Says | Actually Built | Action |
|--------|-----------|----------------|--------|
| Route structure | `/[category]/[service]/` | `/industries/[slug]/` | Update plan |
| Entry count | 202 | 148 (deduped) | Update plan |
| Data file name | `industry-services.js` | `industries.js` | Update plan |
| Components created | None listed | `IndustrySections.jsx` | Add to plan |
| Components reused | Not specified | FAQSection, PricingSection, etc. | Add to plan |
| Design decisions | Not documented | "NOT a copy of sub-service page" | Add to plan |
| Checkboxes | `[ ]` for steps 2-7 | All done | Check all boxes |

### 3. Update the Plan File

Update these sections in the plan file:

#### Execution Plan Checkboxes
- Change `[ ]` to `[x]` for all completed steps
- Add any steps that were done but not in the original plan

#### Route Integration Section
- Replace planned route architecture with actual
- Document the actual file paths and component structure
- Note which components are custom vs. reused

#### Data File Section
- Update entry counts to actual
- Document all exported helpers (not just the ones originally planned)
- Update field names if they differ from plan (e.g., `reviewedBy` vs `reviewedBy`)

#### Success Metrics Table
- Fill in the "Actual" column with real numbers
- Add any metrics that emerged during implementation

#### New Sections to Add
- **Key Design Decisions** — document choices made during implementation that weren't in the original plan
- **Known Issues** — pre-existing issues that are unrelated to this phase
- **Components Created** — table of new components with file paths and descriptions
- **Components Reused** — table of existing components repurposed

### 4. Update the Agent File

Update these sections in `agent.md`:

#### Content Inventory Table
- Change status from `🔲` to `✅`
- Update counts to actual unique entries

#### Folder Structure
- Mark data files as `✅`
- Update any file name changes

#### Execution Order (§7)
- Mark the phase as `✅`

#### Key Decisions (§8)
- Update any decisions that changed during implementation
- Add new decisions that emerged

#### Next Actions (§12)
- Move items from "In Progress" / "Pending" to "Completed"
- Add new completed items with ✅
- Update remaining items accurately

#### Add New Subsection (if applicable)
- For major phases, add a new subsection (e.g., §3C) documenting:
  - Data file stats
  - Routes created (with full paths)
  - Components created (with full paths and descriptions)
  - Components reused (with usage notes)
  - Key design decisions

### 5. Cross-Check Consistency

After updating both files, verify:

- [ ] Entry counts match between agent.md and plan file
- [ ] Route paths are identical in both files
- [ ] Component names and file paths are consistent
- [ ] Checkboxes in plan match completed items in agent.md
- [ ] Status emojis are consistent (both say ✅ for completed phases)
- [ ] "Last Updated" date is current in both files

## Key Patterns

- **Plan says `[category]/[service]` but code has `industries/[slug]`** — route architecture evolved during implementation; document the actual
- **Plan lists N files but data has M < N entries** — deduplication happened; document both numbers (202 files → 148 unique)
- **Plan doesn't list components** — add a full component inventory (custom + reused)
- **Agent file references old plan filename** — update the reference link
- **Field names differ** (e.g., `reviewedBy` in plan vs `reviewedBy` in code) — use the actual code field names
- **New design decisions emerged** — add a "Key Design Decisions" section to the plan file documenting choices not in the original plan

## Important Constraints

- **Read before write** — always read the actual source files before updating docs; never guess
- **Update both files** — agent.md and the plan file must be synced together
- **Preserve history** — don't remove the original plan content; supplement it with actuals
- **Be specific** — use exact file paths, exact counts, exact component names
