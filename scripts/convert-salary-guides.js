/**
 * Conversion Script: Salary Guides DOCX → Data File
 *
 * Extracts salary guide content from 193 DOCX files in Salary-Guide folder.
 * Robust content-based table parsing identifies Tier A, B, and C structures.
 *
 * Usage: node scripts/convert-salary-guides.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const SALARY_GUIDES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Salary-Guide');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'salary-guides.js');

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find a table whose stripped text matches a regex
function findTable(tables, regex) {
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]);
    if (regex.test(text)) {
      return { text, raw: tables[i], index: i };
    }
  }
  return null;
}

// Get the byte-position of a table in the original HTML
function getTablePosition(html, tableRaw) {
  const idx = html.indexOf(tableRaw);
  if (idx === -1) return null;
  return { start: idx, end: idx + tableRaw.length };
}

// Parse an HTML table into a 2D array of strings
function parseHtmlTable(tableHtml) {
  const rows = [];
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  
  for (const tr of trMatches) {
    const cells = [];
    const cellMatches = tr.match(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
    for (const cell of cellMatches) {
      cells.push(stripHtml(cell));
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  return rows;
}

// ─── Extraction Functions ────────────────────────────────────────────────

function extractMeta(tables) {
  const meta = {};
  const t = findTable(tables, /META TITLE:/i);
  if (!t) return meta;

  const titleMatch = t.text.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
  if (titleMatch) meta.metaTitle = titleMatch[1].trim();

  const descMatch = t.text.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
  if (descMatch) meta.metaDesc = descMatch[1].trim();

  const slugMatch = t.text.match(/SLUG:\s*(\/[a-z0-9\-\/]+)/i);
  if (slugMatch) {
    meta.slug = slugMatch[1].trim();
  } else {
    // Fallback: match without leading slash
    const fallbackMatch = t.text.match(/SLUG:\s*([a-z0-9\-\/]+)/i);
    if (fallbackMatch) meta.slug = fallbackMatch[1].trim();
  }

  return meta;
}

function extractHeader(tables) {
  const header = {};
  const t = findTable(tables, /Last updated:/i);
  if (!t) return header;

  const lastUpdatedMatch = t.text.match(/Last updated:\s*([^|]+?)(?=\s*\||$)/i);
  if (lastUpdatedMatch) header.lastUpdated = lastUpdatedMatch[1].trim();

  const readingTimeMatch = t.text.match(/Reading time:\s*(\d+)\s*min/i);
  if (readingTimeMatch) header.readingTime = parseInt(readingTimeMatch[1]);

  const writtenByMatch = t.text.match(/Written by:\s*([^|]+?)(?=\s*\||$)/i);
  if (writtenByMatch) header.writtenBy = writtenByMatch[1].trim();

  const reviewedByMatch = t.text.match(/Reviewed by:\s*([^|]+?)(?=\s*\||$)/i);
  if (reviewedByMatch) header.reviewedBy = reviewedByMatch[1].trim();

  return header;
}

function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripHtml(h1Match[1]);
  return '';
}

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';

  // Remove ClickMasters_P{ID}_
  let rest = filename.replace(/^ClickMasters_P\d+_/, '');
  rest = rest.replace(/\.docx$/i, '');
  
  // Remove leading 'salary_' if present
  rest = rest.replace(/^salary_/i, '');
  
  // Find year at the end
  const yearMatch = rest.match(/_(\d{4})$/);
  const year = yearMatch ? yearMatch[1] : '2025';
  
  // Remove trailing patterns to get the raw role name
  let role = rest;
  role = role.replace(/_salary_uk_\d{4}$/i, '');
  role = role.replace(/_salary_uk_2025$/i, '');
  role = role.replace(/_salary_uk_2026$/i, '');
  role = role.replace(/_developer_salary_uk_\d{4}$/i, '');
  role = role.replace(/_Developer_Salary_UK_\d{4}$/i, '');
  role = role.replace(/_salary_\d{4}$/i, '');
  role = role.replace(/_\d{4}$/i, '');
  
  // Normalize
  role = role.toLowerCase().replace(/_/g, '-');
  
  return { id, role, year };
}

function extractBadges(tables) {
  for (const table of tables) {
    const text = stripHtml(table);
    if ((text.includes('💷') || text.includes('Market Data') || text.includes('Regional Breakdown') || text.includes('GBP')) && 
        !text.includes('Direct Answer') && 
        !text.includes('Salary by') && 
        !text.includes('Technology Stack') && 
        !text.includes('Contractor Day Rates')) {
      const tdMatches = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      return tdMatches.map(td => stripHtml(td)).filter(Boolean);
    }
  }
  return [];
}

function extractDirectAnswer(tables) {
  const t = findTable(tables, /Direct Answer:/i);
  if (t) {
    return stripHtml(t.text.replace(/Direct Answer:/i, '').trim());
  }
  return '';
}

function extractIntroText(html, tables) {
  const directAnswerTable = findTable(tables, /Direct Answer:/i);
  if (!directAnswerTable) return '';
  
  const pos = getTablePosition(html, directAnswerTable.raw);
  if (!pos) return '';
  
  let nextTableStart = -1;
  for (const table of tables) {
    const tablePos = getTablePosition(html, table);
    if (tablePos && tablePos.start > pos.end) {
      nextTableStart = tablePos.start;
      break;
    }
  }
  
  if (nextTableStart === -1) return '';
  
  const chunk = html.substring(pos.end, nextTableStart);
  return stripHtml(chunk).trim();
}

function getExperienceTable(parsedTables) {
  for (const table of parsedTables) {
    if (table.length < 2) continue;
    const headers = table[0].map(h => h.toLowerCase());
    const hasPermanent = headers.some(h => h.includes('permanent') || h.includes('perm'));
    const hasDayRate = headers.some(h => h.includes('day rate') || h.includes('day-rate'));
    const isNotRoleTable = !headers.some(h => h.includes('junior') && h.includes('mid') && h.includes('senior') && h.some(val => val === 'role'));
    
    if (hasPermanent && hasDayRate && isNotRoleTable) {
      const colIdx = { seniority: 0, permanent: 1, dayRate: 2, annualEquiv: 3 };
      headers.forEach((h, idx) => {
        if (h.includes('seniority') || h.includes('role')) colIdx.seniority = idx;
        else if (h.includes('permanent') || h.includes('perm')) colIdx.permanent = idx;
        else if (h.includes('day rate') || h.includes('day-rate')) colIdx.dayRate = idx;
        else if (h.includes('annual') || h.includes('equiv')) colIdx.annualEquiv = idx;
      });
      
      const dataRows = [];
      for (let r = 1; r < table.length; r++) {
        const row = table[r];
        if (row.length < 2) continue;
        dataRows.push({
          seniority: row[colIdx.seniority] || '',
          permanent: row[colIdx.permanent] || '',
          dayRate: row[colIdx.dayRate] || '',
          annualEquiv: row[colIdx.annualEquiv] || ''
        });
      }
      return dataRows;
    }
  }
  return null;
}

function getCityTable(parsedTables) {
  for (const table of parsedTables) {
    if (table.length < 2) continue;
    const headers = table[0].map(h => h.toLowerCase());
    const hasCity = headers.some(h => h.includes('city') || h.includes('location'));
    const hasVsAverage = headers.some(h => h.includes('average') || h.includes('national'));
    
    if (hasCity && hasVsAverage) {
      const colIdx = { city: 0, vsAverage: 1, range: 2, notes: 3 };
      headers.forEach((h, idx) => {
        if (h.includes('city') || h.includes('location')) colIdx.city = idx;
        else if (h.includes('average') || h.includes('national')) colIdx.vsAverage = idx;
        else if (h.includes('salary') || h.includes('range')) colIdx.range = idx;
        else if (h.includes('note')) colIdx.notes = idx;
      });
      
      const dataRows = [];
      for (let r = 1; r < table.length; r++) {
        const row = table[r];
        if (row.length < 2) continue;
        dataRows.push({
          city: row[colIdx.city] || '',
          vsAverage: row[colIdx.vsAverage] || '',
          range: row[colIdx.range] || '',
          notes: row[colIdx.notes] || ''
        });
      }
      return dataRows;
    }
  }
  return null;
}

function getGeneralRoleSalaryTable(parsedTables) {
  for (const table of parsedTables) {
    if (table.length < 2) continue;
    const headers = table[0].map(h => h.toLowerCase());
    const hasRole = headers.some(h => h.includes('role') || h.includes('job'));
    const hasJunior = headers.some(h => h.includes('junior'));
    const hasMid = headers.some(h => h.includes('mid-level') || h.includes('mid level'));
    const hasSenior = headers.some(h => h.includes('senior'));
    
    if (hasRole && hasJunior && hasMid && hasSenior) {
      const colIdx = { role: 0, junior: 1, mid: 2, senior: 3, principal: 4 };
      headers.forEach((h, idx) => {
        if (h.includes('role') || h.includes('job')) colIdx.role = idx;
        else if (h.includes('junior')) colIdx.junior = idx;
        else if (h.includes('mid-level') || h.includes('mid level') || h.includes('mid')) colIdx.mid = idx;
        else if (h.includes('senior') && !h.includes('junior') && !h.includes('mid')) colIdx.senior = idx;
        else if (h.includes('principal') || h.includes('lead')) colIdx.principal = idx;
      });
      
      const dataRows = [];
      for (let r = 1; r < table.length; r++) {
        const row = table[r];
        if (row.length < 2) continue;
        dataRows.push({
          role: row[colIdx.role] || '',
          junior: row[colIdx.junior] || '',
          mid: row[colIdx.mid] || '',
          senior: row[colIdx.senior] || '',
          principal: row[colIdx.principal] || ''
        });
      }
      return dataRows;
    }
  }
  return null;
}

function getTechStackPremiums(parsedTables) {
  for (const table of parsedTables) {
    if (table.length < 2) continue;
    const headers = table[0].map(h => h.toLowerCase());
    const hasPremium = headers.some(h => h.includes('premium'));
    const hasContext = headers.some(h => h.includes('context') || h.includes('market'));
    
    if (hasPremium && hasContext) {
      const colIdx = { specialisation: 0, premium: 1, marketContext: 2 };
      headers.forEach((h, idx) => {
        if (h.includes('technology') || h.includes('specialisation') || h.includes('specialization') || h.includes('skill')) colIdx.specialisation = idx;
        else if (h.includes('premium')) colIdx.premium = idx;
        else if (h.includes('context') || h.includes('market')) colIdx.marketContext = idx;
      });
      
      const dataRows = [];
      for (let r = 1; r < table.length; r++) {
        const row = table[r];
        if (row.length < 2) continue;
        dataRows.push({
          specialisation: row[colIdx.specialisation] || '',
          premium: row[colIdx.premium] || '',
          marketContext: row[colIdx.marketContext] || ''
        });
      }
      return dataRows;
    }
  }
  return null;
}

function getContractorRates(parsedTables) {
  for (const table of parsedTables) {
    if (table.length < 2) continue;
    const headers = table[0].map(h => h.toLowerCase());
    const hasInside = headers.some(h => h.includes('inside ir35') || h.includes('inside'));
    const hasComparable = headers.some(h => h.includes('comparable') || h.includes('permanent'));
    
    if (hasInside && hasComparable) {
      const colIdx = { role: 0, dayRate: 1, annualOutside: 2, annualInside: 3, permSalary: 4 };
      headers.forEach((h, idx) => {
        if (h.includes('role') || h.includes('job')) colIdx.role = idx;
        else if (h.includes('day rate') || h.includes('day-rate')) colIdx.dayRate = idx;
        else if (h.includes('outside')) colIdx.annualOutside = idx;
        else if (h.includes('inside')) colIdx.annualInside = idx;
        else if (h.includes('comparable') || h.includes('permanent') || h.includes('perm')) colIdx.permSalary = idx;
      });
      
      const dataRows = [];
      for (let r = 1; r < table.length; r++) {
        const row = table[r];
        if (row.length < 2) continue;
        dataRows.push({
          role: row[colIdx.role] || '',
          dayRate: row[colIdx.dayRate] || '',
          annualOutside: row[colIdx.annualOutside] || '',
          annualInside: row[colIdx.annualInside] || '',
          permSalary: row[colIdx.permSalary] || ''
        });
      }
      return dataRows;
    }
  }
  return null;
}

function extractFaqs(html) {
  const faqs = [];
  const textWithNewlines = html
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[ \t]+/g, ' ');
  
  const lines = textWithNewlines.split('\n').map(l => l.trim()).filter(Boolean);
  
  let currentQuestion = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const qMatch = line.match(/^Q:\s*(.+)/i);
    if (qMatch) {
      currentQuestion = qMatch[1].trim();
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const nextLine = lines[j];
        const aMatch = nextLine.match(/^A:\s*(.+)/i);
        if (aMatch) {
          faqs.push({
            question: currentQuestion,
            answer: aMatch[1].trim()
          });
          currentQuestion = '';
          break;
        }
      }
    }
  }
  return faqs;
}

function extractRelatedPages(html, tables) {
  const t = findTable(tables, /Related Pages/i);
  if (!t) return [];
  
  const pos = getTablePosition(html, t.raw);
  if (!pos) return [];
  
  let nextTableStart = -1;
  for (const table of tables) {
    const tablePos = getTablePosition(html, table);
    if (tablePos && tablePos.start > pos.end) {
      nextTableStart = tablePos.start;
      break;
    }
  }
  
  const chunk = nextTableStart !== -1
    ? html.substring(pos.end, nextTableStart)
    : html.substring(pos.end);
    
  const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  const pages = [];
  
  for (const li of liMatches) {
    const text = stripHtml(li);
    const colonIdx = text.lastIndexOf(':');
    if (colonIdx !== -1) {
      const title = text.substring(0, colonIdx).trim();
      const url = text.substring(colonIdx + 1).trim();
      const slug = url.replace(/^\/salary-guide\//, '').replace(/^\//, '').replace(/\/$/, '');
      pages.push({ title, slug });
    }
  }
  return pages;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function convertSalaryGuides() {
  console.log('Starting salary guides conversion...\n');

  const files = fs.readdirSync(SALARY_GUIDES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} salary guide files\n`);

  const salaryGuides = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(SALARY_GUIDES_DIR, file);

    try {
      const { id, role, year } = parseFilename(file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
      const parsedTables = tables.map(parseHtmlTable);

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const badges = extractBadges(tables);
      const directAnswer = extractDirectAnswer(tables);
      const introText = extractIntroText(html, tables);
      
      const experienceTable = getExperienceTable(parsedTables);
      const cityTable = getCityTable(parsedTables);
      const generalRoleSalaryTable = getGeneralRoleSalaryTable(parsedTables);
      const techStackPremiums = getTechStackPremiums(parsedTables);
      const contractorRates = getContractorRates(parsedTables);
      
      const faqs = extractFaqs(html);
      const relatedPages = extractRelatedPages(html, tables);

      // Clean up double pound signs
      const cleanDirectAnswer = directAnswer.replace(/££/g, '£');
      const cleanIntroText = introText.replace(/££/g, '£');

      const cleanExperienceTable = experienceTable
        ? experienceTable.map(row => ({
            seniority: row.seniority.replace(/££/g, '£'),
            permanent: row.permanent.replace(/££/g, '£'),
            dayRate: row.dayRate.replace(/££/g, '£'),
            annualEquiv: row.annualEquiv.replace(/££/g, '£'),
          }))
        : null;

      const cleanCityTable = cityTable
        ? cityTable.map(row => ({
            city: row.city.replace(/££/g, '£'),
            vsAverage: row.vsAverage.replace(/££/g, '£'),
            range: row.range.replace(/££/g, '£'),
            notes: row.notes.replace(/££/g, '£'),
          }))
        : null;

      const cleanGeneralRoleSalaryTable = generalRoleSalaryTable
        ? generalRoleSalaryTable.map(row => ({
            role: row.role.replace(/££/g, '£'),
            junior: row.junior.replace(/££/g, '£'),
            mid: row.mid.replace(/££/g, '£'),
            senior: row.senior.replace(/££/g, '£'),
            principal: row.principal.replace(/££/g, '£'),
          }))
        : null;

      const cleanTechStackPremiums = techStackPremiums
        ? techStackPremiums.map(row => ({
            specialisation: row.specialisation.replace(/££/g, '£'),
            premium: row.premium.replace(/££/g, '£'),
            marketContext: row.marketContext.replace(/££/g, '£'),
          }))
        : null;

      const cleanContractorRates = contractorRates
        ? contractorRates.map(row => ({
            role: row.role.replace(/££/g, '£'),
            dayRate: row.dayRate.replace(/££/g, '£'),
            annualOutside: row.annualOutside.replace(/££/g, '£'),
            annualInside: row.annualInside.replace(/££/g, '£'),
            permSalary: row.permSalary.replace(/££/g, '£'),
          }))
        : null;

      const salaryGuide = {
        id,
        slug: meta.slug ? meta.slug.replace(/^\/salary-guide\//, '').replace(/^\//, '').replace(/\/$/, '') : role + '-salary-uk-' + year,
        role,
        year,
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').trim(),
        reviewedBy: (header.reviewedBy || '').trim(),
        badges,
        directAnswer: cleanDirectAnswer,
        introText: cleanIntroText,
        experienceTable: cleanExperienceTable,
        cityTable: cleanCityTable,
        generalRoleSalaryTable: cleanGeneralRoleSalaryTable,
        techStackPremiums: cleanTechStackPremiums,
        contractorRates: cleanContractorRates,
        faqs,
        relatedPages
      };

      salaryGuides.push(salaryGuide);

      if ((i + 1) % 20 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }

    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${salaryGuides.length} salary guides successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  // Deduplicate by slug — keep lowest P_Number
  const slugMap = new Map();
  salaryGuides.forEach(sg => {
    if (!sg.slug) return;
    const existing = slugMap.get(sg.slug);
    if (!existing) {
      slugMap.set(sg.slug, sg);
    } else {
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(sg.id.replace('P', ''));
      if (currentNum < existingNum) {
        slugMap.set(sg.slug, sg);
      }
    }
  });

  const uniqueSalaryGuides = Array.from(slugMap.values());
  uniqueSalaryGuides.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  console.log(`Unique salary guides (after dedup): ${uniqueSalaryGuides.length}`);

  // Log samples for verification
  const samples = ['P5', 'P198', 'P1006'];
  samples.forEach(pid => {
    const s = uniqueSalaryGuides.find(sg => sg.id === pid);
    if (s) {
      console.log(`\nSample ${pid}:`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  role: ${s.role} | year: ${s.year}`);
      console.log(`  title: ${s.title.substring(0, 60)}`);
      console.log(`  badges: ${s.badges.join(', ')}`);
      console.log(`  experienceTable: ${s.experienceTable ? s.experienceTable.length + ' rows' : 'none'}`);
      console.log(`  cityTable: ${s.cityTable ? s.cityTable.length + ' rows' : 'none'}`);
      console.log(`  generalRoleSalaryTable: ${s.generalRoleSalaryTable ? s.generalRoleSalaryTable.length + ' rows' : 'none'}`);
      console.log(`  techStackPremiums: ${s.techStackPremiums ? s.techStackPremiums.length + ' rows' : 'none'}`);
      console.log(`  faqs: ${s.faqs.length}`);
      console.log(`  relatedPages: ${s.relatedPages.length}`);
    } else {
      console.log(`\nSample ${pid}: NOT FOUND`);
    }
  });

  const output = `/**
 * Salary Guides Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueSalaryGuides.length}
 * Extraction: content-based (dynamic table structures)
 */

export const salaryGuides = ${JSON.stringify(uniqueSalaryGuides, null, 2)};

// Lightweight listing data for cards/listings
export const salaryGuideListings = salaryGuides.map(
  ({ id, slug, role, year, title, metaDesc }) => ({ id, slug, role, year, title, metaDesc })
);

// Get single salary guide by slug
export function getSalaryGuideBySlug(slug) {
  return salaryGuides.find(sg => sg.slug === slug) || null;
}

// Get related salary guides by role
export function getRelatedSalaryGuides(slug, limit = 4) {
  const current = getSalaryGuideBySlug(slug);
  if (!current) return [];
  
  // Filter pages that share similar keywords in their role or slug, excluding current
  const related = salaryGuides.filter(
    sg => sg.slug !== slug && (sg.role.includes(current.role) || current.role.includes(sg.role))
  );
  
  // If not enough related, fill with any salary guides
  if (related.length < limit) {
    const others = salaryGuides.filter(
      sg => sg.slug !== slug && !related.some(r => r.slug === sg.slug)
    );
    related.push(...others);
  }
  
  return related.slice(0, limit).map(
    ({ id, slug, role, year, title, metaDesc }) => ({ id, slug, role, year, title, metaDesc })
  );
}

// Deduplicate FAQs by question text
export function getDedupedFaqs(faqs) {
  const seen = new Set();
  return faqs.filter(faq => {
    const q = faq.question.trim().toLowerCase();
    if (seen.has(q)) return false;
    seen.add(q);
    return true;
  });
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_FILE}`);

  return { total: files.length, unique: uniqueSalaryGuides.length, errors };
}

convertSalaryGuides()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique salary guides: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
