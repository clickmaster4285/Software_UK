---
name: generate-url-sheet
description: Generate an Excel (.xlsx) URL sheet from all data/*.js files — lists every category, main page URL, and sub-page URL for the ClickMasters site
source: auto-skill
extracted_at: '2026-06-22T11:32:00.000Z'
---

# Generate URL Excel Sheet

Produces `ClickMasters_URL_Sheet.xlsx` in the project root, listing every static page URL grouped by category.

## When to Use

- User asks for an Excel/CSV of all site URLs
- User wants a sitemap-like listing in spreadsheet form
- After adding new categories or data files, to regenerate the URL inventory

## Script Location

`scripts/generate-url-sheet.js`

## How to Run

```bash
cd "C:\Users\PC-24\Desktop\Software uk"
node scripts/generate-url-sheet.js
```

Output: `ClickMasters_URL_Sheet.xlsx` in the project root.

## Excel Structure

| Column | Content |
|--------|---------|
| Category | Category name (e.g. "Case Studies") |
| Main Page URL | e.g. `https://clickmasterssoftwaredevelopmentcompany.co.uk/case-studies` |
| Sub-Page URL | e.g. `https://...co.uk/case-studies/open-banking-aisp-platform-fintech` |

Each category has a header row (category name + main page URL, blank sub-page), followed by one row per sub-page.

## Category Configuration

The `CATEGORIES` array in the script defines each category:

```js
{
  name: 'Case Studies',          // Display name
  mainPath: '/case-studies',     // Main listing page path
  filePath: 'case-studies.js',   // Data file in data/
  arrayName: 'caseStudies',     // JS variable name (not export name)
  routeBuilder: (entry) => `/${entry.slug}`,  // Builds sub-page path from entry
}
```

### Key Fields

- **`arrayName`**: The JS variable name in the data file. Some files use `export const name = [...]`, others use `const name = [...]`. The script handles both.
- **`routeBuilder`**: Function that receives a data entry and returns the sub-page path segment(s). For nested routes like hire pages: `(entry) => \`/${entry.role}/${entry.city}\``.

## Adding a New Category

1. Add an entry to the `CATEGORIES` array in `scripts/generate-url-sheet.js`
2. Ensure the `filePath` and `arrayName` match the actual data file
3. Write the `routeBuilder` to construct the correct URL path from entry fields
4. Re-run the script

## What's Included / Excluded

**Included** (static data files in `data/`):
- Case Studies, Cities, Comparisons, Glossary, Hire Pages, Industries, Resource Guides, Salary Guides, Services

**Excluded** (API-driven, no static data file):
- Solutions, Blog, Testimonials

## Dependencies

- `xlsx` npm package (install with `npm install xlsx --save`)

## Known Counts (June 2026)

| Category | Sub-Pages |
|----------|----------:|
| Case Studies | 274 |
| Cities | 203 |
| Comparisons | 141 |
| Glossary | 200 |
| Hire Pages | 269 |
| Industries | 148 |
| Resource Guides | 81 |
| Salary Guides | 99 |
| Services | 11 |
| **Total** | **1,426** |
