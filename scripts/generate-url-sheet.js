/**
 * Generate URL Excel Sheet
 * Reads all data/*.js files and produces a formatted Excel file
 * with Category, Main Page URL, and Sub-Page URL for every page.
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://clickmasterssoftwaredevelopmentcompany.co.uk';
const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_FILE = path.join(__dirname, '..', 'ClickMasters_URL_Sheet.xlsx');

/**
 * Extract array data from a JS data file.
 * Handles both `export const name = [...]` and `const name = [...]` patterns.
 */
function extractData(filePath, arrayName) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Try `export const <name> = [` first, then `const <name> = [`
  let marker = `export const ${arrayName}`;
  let start = content.indexOf(marker);
  if (start === -1) {
    marker = `const ${arrayName}`;
    start = content.indexOf(marker);
  }
  if (start === -1) return [];

  const arrayStart = content.indexOf('[', start);
  if (arrayStart === -1) return [];

  // Walk to matching closing bracket
  let depth = 0;
  let i = arrayStart;
  for (; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) break;
    }
  }

  const arrayStr = content.slice(arrayStart, i + 1);
  try {
    return JSON.parse(arrayStr);
  } catch {
    // If JSON.parse fails (JS object syntax), try eval
    try {
      // Strip the outer brackets to make it a valid JS expression wrapper
      return new Function(`"use strict"; return (${arrayStr})`)();
    } catch (e) {
      console.error(`  ⚠ Could not parse ${filePath}: ${e.message}`);
      return [];
    }
  }
}

/**
 * Category configuration — maps each data file to its URL structure.
 *
 * routeBuilder functions receive the entry and should return the sub-page slug/path.
 */
const CATEGORIES = [
  {
    name: 'Case Studies',
    mainPath: '/case-studies',
    filePath: 'case-studies.js',
    arrayName: 'caseStudies',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Cities',
    mainPath: '/cities',
    filePath: 'cities.js',
    arrayName: 'cities',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Comparisons',
    mainPath: '/comparison',
    filePath: 'comparisons.js',
    arrayName: 'comparisons',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Glossary',
    mainPath: '/glossary',
    filePath: 'glossary.js',
    arrayName: 'glossaryTerms',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Hire Pages',
    mainPath: '/hire',
    filePath: 'hire-pages.js',
    arrayName: 'hirePages',
    routeBuilder: (entry) => `/${entry.role}/${entry.city}`,
  },
  {
    name: 'Industries',
    mainPath: '/industries',
    filePath: 'industries.js',
    arrayName: 'industries',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Resource Guides',
    mainPath: '/resource',
    filePath: 'resource-guides.js',
    arrayName: 'resourceGuides',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Salary Guides',
    mainPath: '/salary-guide',
    filePath: 'salary-guides.js',
    arrayName: 'salaryGuides',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    name: 'Services',
    mainPath: '/services',
    filePath: 'services.js',
    arrayName: 'services',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
];

// Build rows
const rows = [];

// Header row
rows.push(['Category', 'Main Page URL', 'Sub-Page URL']);

for (const cat of CATEGORIES) {
  const filePath = path.join(DATA_DIR, cat.filePath);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${cat.filePath} — skipping`);
    continue;
  }

  console.log(`Processing: ${cat.name}...`);
  const data = extractData(filePath, cat.arrayName);
  console.log(`  Found ${data.length} entries`);

  const mainUrl = `${BASE_URL}${cat.mainPath}`;

  // Category header row
  rows.push([cat.name, mainUrl, '']);

  for (const entry of data) {
    try {
      const subPath = cat.routeBuilder(entry);
      const subUrl = `${BASE_URL}${cat.mainPath}${subPath}`;
      rows.push([cat.name, mainUrl, subUrl]);
    } catch (e) {
      console.warn(`  ⚠ Skipping entry (missing fields): ${e.message}`);
    }
  }
}

// Create workbook
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(rows);

// Column widths
ws['!cols'] = [
  { wch: 20 },  // Category
  { wch: 60 },  // Main Page URL
  { wch: 80 },  // Sub-Page URL
];

// Add the sheet
XLSX.utils.book_append_sheet(wb, ws, 'All Pages');

// Write file
XLSX.writeFile(wb, OUTPUT_FILE);

const totalSubPages = rows.length - 1 - CATEGORIES.length;
console.log(`\n✅ Excel sheet generated: ${OUTPUT_FILE}`);
console.log(`   Total categories: ${CATEGORIES.length}`);
console.log(`   Total sub-page rows: ${totalSubPages}`);
