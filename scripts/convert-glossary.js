/**
 * Conversion Script: Glossary DOCX → Data File
 *
 * Extracts glossary term content from 200 DOCX files in Glossary folder.
 *
 * DOCX Structure (confirmed from P105, P106, P107, P108 samples):
 *   Table 0: META TITLE / META DESC / SLUG
 *   Table 1: Last updated | Reading time | Written by | Reviewed by
 *   Para:    Breadcrumb
 *   H1:      Term title
 *   Table 2: 5 badges (Definition | UK Context | Related Terms | Commercial Relevance | JSON-LD Schema)
 *   Table 3: Direct Answer
 *   Table 4: UK Context (2-cell: empty + title) — optional, some files skip this
 *   Para:    UK Context body text (free paragraph after the title table)
 *   Table 5: Related Terms (single or 2-cell title table) — optional header
 *   Paras:   <strong>Term: </strong>definition paragraphs
 *   Table 6: Related Pages (single or 2-cell title table)
 *   <ul><li>: Related page links (Title: /slug/)
 *   Table 7: CTA (Get Expert Advice on {term} + contact link)
 *   Table 8: Schema (DefinedTerm + FAQPage | Target KW: ...)
 *
 * Some files (e.g. P106) have a shorter structure — CTA + schema appear before
 * Related Terms. The script handles both orderings.
 *
 * Usage: node scripts/convert-glossary.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const GLOSSARY_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Glossary');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'glossary.js');

// ─── Helpers ────────────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTextContent(html) {
  return stripHtml(html);
}

function parseHtmlTable(tableHtml) {
  const rows = [];
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  for (const tr of trMatches) {
    const cells = [];
    const cellMatches = tr.match(/<(th|td)[^>]*>([\s\S]*?)<\/\1>/gi) || [];
    for (const cell of cellMatches) {
      cells.push(stripHtml(cell));
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

function getTableText(tableHtml) {
  return stripHtml(tableHtml);
}

function findTableByRegex(tables, regex) {
  for (let i = 0; i < tables.length; i++) {
    if (regex.test(getTableText(tables[i]))) {
      return { table: tables[i], index: i, text: getTableText(tables[i]) };
    }
  }
  return null;
}

function getTablePosition(html, tableHtml) {
  const idx = html.indexOf(tableHtml);
  if (idx === -1) return null;
  return { start: idx, end: idx + tableHtml.length };
}

// ─── Extraction Functions ────────────────────────────────────────────────

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';
  // Term is between 'glossary_' and '_definition' or '-definition'
  const termMatch = filename.match(/glossary_(.+?)[-_]definition/i);
  const term = termMatch ? termMatch[1] : '';
  // Convert underscores to hyphens for slug
  const slug = term.toLowerCase().replace(/_/g, '-');
  // Display version: capitalize first letter of each word, handle acronyms
  const termDisplay = term
    .split('_')
    .map(w => {
      // Keep known acronyms uppercase
      const upper = w.toUpperCase();
      if (['api', 'mvp', 'gdpr', 'ir35', 'saas', 'poc', 'mmp', 'ico', 'cest', 'obie', 'rest', 'graphql', 'http', 'url', 'urls', 'swagger', 'openapi', 'uk', 'eu', 'fca', 'hmrc', 'nhs', 'dsa', 'dsar', 'dpia', 'dpo', 'rbac', 'jwt', 'oauth', 'sso', 'cic', 'msc', 'sds', 'cepi', 'b2b', 'b2c', 'crm', 'erp', 'bi', 'ai', 'ml', 'ci', 'cd', 'devops', 'qa', 'ui', 'ux'].includes(w.toLowerCase())) {
        return upper;
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
  return { id, term, slug: `${slug}-definition`, termDisplay };
}

function extractMeta(tables) {
  const meta = {};
  const t = findTableByRegex(tables, /META TITLE:/i);
  if (!t) return meta;
  const titleMatch = t.text.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
  if (titleMatch) meta.metaTitle = titleMatch[1].trim();
  const descMatch = t.text.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
  if (descMatch) meta.metaDesc = descMatch[1].trim();
  const slugMatch = t.text.match(/SLUG:\s*(\/[a-z0-9\-\/]+)/i);
  if (slugMatch) meta.slug = slugMatch[1].trim();
  return meta;
}

function extractHeader(tables) {
  const header = {};
  const t = findTableByRegex(tables, /Last updated:/i);
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

function extractDirectAnswer(tables) {
  const t = findTableByRegex(tables, /Direct Answer:/i);
  if (t) return t.text.replace(/Direct Answer:\s*/i, '').trim();
  return '';
}

/**
 * Check if a table is a badge/table-of-contains table (contains multiple section keywords).
 * Badge tables have cells like "Definition", "UK Context", "Related Terms", "Commercial Relevance".
 */
function isBadgeTable(tableHtml) {
  const text = getTableText(tableHtml);
  const badgeKeywords = [/Definition/i, /UK Context/i, /Related Terms/i, /Commercial Relevance/i, /JSON-LD/i];
  let matchCount = 0;
  for (const kw of badgeKeywords) {
    if (kw.test(text)) matchCount++;
  }
  return matchCount >= 2;
}

/**
 * Extract UK Context paragraph(s).
 * The UK Context section title appears as a single-cell or 2-cell table
 * containing ONLY "UK Context" or "{Term} — UK Context".
 * Must NOT match the badge table (T2) which also contains "UK Context".
 * Strategy: find tables matching /UK Context/i, skip badge tables,
 * use the first match that looks like a section title (short text, no other section keywords).
 */
function extractUkContext(html, tables) {
  // Find the UK Context section title table (not the badge table)
  let ukTitleTable = null;
  for (const table of tables) {
    const text = getTableText(table);
    if (!/UK Context/i.test(text)) continue;
    // Skip the badge table — it contains multiple section keywords
    if (isBadgeTable(table)) continue;
    // This is the UK Context title table (short text, 1-2 cells)
    if (text.length < 120) {
      ukTitleTable = table;
      break;
    }
  }
  if (!ukTitleTable) return '';

  const pos = getTablePosition(html, ukTitleTable);
  if (!pos) return '';

  // Get content after this table until the next table
  const afterTable = html.substring(pos.end);
  const nextTableMatch = afterTable.match(/<table[\s\S]*?<\/table>/i);
  const chunk = nextTableMatch ? afterTable.substring(0, afterTable.indexOf(nextTableMatch[0])) : afterTable;

  // Extract <p> content from this chunk
  const pMatches = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const paragraphs = pMatches.map(p => stripHtml(p)).filter(t => t.length > 10);

  if (paragraphs.length > 0) return paragraphs.join('\n\n');

  // Fallback: just strip the chunk
  const text = stripHtml(chunk).trim();
  return text.length > 10 ? text : '';
}

/**
 * Find a section title table by keyword, skipping badge tables.
 * Returns { table, pos } or null.
 */
function findSectionTable(html, tables, keyword) {
  for (const table of tables) {
    const text = getTableText(table);
    if (!keyword.test(text)) continue;
    // Skip badge table (contains multiple section keywords)
    if (isBadgeTable(table)) continue;
    // Section title tables are short (<120 chars)
    if (text.length < 120) {
      const pos = getTablePosition(html, table);
      if (pos) return { table, pos };
    }
  }
  return null;
}

/**
 * Extract Related Terms.
 * These are <p> elements with <strong>Term: </strong>definition format.
 * They appear after the "Related Terms" title table, before the "Related Pages" table.
 */
function extractRelatedTerms(html, tables) {
  const terms = [];

  // Find the Related Terms title table
  const rtTable = findSectionTable(html, tables, /Related Terms/i);
  if (!rtTable) return terms;

  // Find the Related Pages title table
  const rpTable = findSectionTable(html, tables, /Related Pages/i);

  // Get chunk between Related Terms title and Related Pages title
  const startPos = rtTable.pos.end;
  const endPos = rpTable ? rpTable.pos.start : html.length;

  if (endPos <= startPos) return terms;

  const chunk = html.substring(startPos, endPos);

  // Extract bold-led paragraphs: <strong>Term: </strong>definition
  const pMatches = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  for (const p of pMatches) {
    const text = stripHtml(p).trim();
    // Match pattern: "Term Name: definition text"
    const boldMatch = text.match(/^([^:]+):\s+(.+)/);
    if (boldMatch && boldMatch[1].length < 60 && boldMatch[2].length > 5) {
      terms.push({
        term: boldMatch[1].trim(),
        definition: boldMatch[2].trim()
      });
    }
  }

  return terms;
}

/**
 * Extract Related Pages from <ul><li> after the Related Pages table.
 * Format: "Title: /slug/"
 */
function extractRelatedPages(html, tables) {
  const rpTable = findSectionTable(html, tables, /Related Pages/i);
  if (!rpTable) return [];

  const pos = rpTable.pos;
  if (!pos) return [];

  // Get content after Related Pages table until next table
  const afterTable = html.substring(pos.end);
  const nextTableMatch = afterTable.match(/<table[\s\S]*?<\/table>/i);
  const chunk = nextTableMatch ? afterTable.substring(0, afterTable.indexOf(nextTableMatch[0])) : afterTable;

  const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  const pages = [];
  for (const li of liMatches) {
    const text = stripHtml(li).trim();
    // Format: "Title: /slug/" or "Title: /slug"
    const colonIdx = text.lastIndexOf(':');
    if (colonIdx !== -1) {
      const title = text.substring(0, colonIdx).trim();
      const url = text.substring(colonIdx + 1).trim();
      const slug = url.replace(/^\//, '').replace(/\/$/, '');
      if (title && slug) pages.push({ title, slug });
    }
  }
  return pages;
}

/**
 * Extract CTA text.
 */
function extractCta(tables) {
  const t = findTableByRegex(tables, /Get Expert Advice/i);
  if (!t) return '';
  // Get just the first line (the CTA title)
  const lines = t.text.split('\n').map(l => l.trim()).filter(Boolean);
  return lines[0] || t.text.substring(0, 100).trim();
}

/**
 * Extract schema type and target keywords.
 */
function extractSchema(tables) {
  const result = { schemaType: '', targetKeywords: [] };
  const t = findTableByRegex(tables, /DefinedTerm|FAQPage|Target KW/i);
  if (!t) return result;

  // Schema type: "DefinedTerm + FAQPage" or similar
  const schemaMatch = t.text.match(/(DefinedTerm\s*\+?\s*FAQPage|FAQPage|DefinedTerm|Article|HowTo)/i);
  if (schemaMatch) result.schemaType = schemaMatch[1].trim();

  // Target keywords: may appear as 'Target KW: "kw1" (N/mo)' or just '"kw1" (N/mo)' after '|'
  // First try "Target KW:" prefix format
  const kwMatch = t.text.match(/Target KW:\s*([\s\S]+)/i);
  const kwSource = kwMatch ? kwMatch[1] : t.text;
  // Extract all quoted strings as keywords
  const kwPattern = /"([^"]+)"/g;
  let m;
  while ((m = kwPattern.exec(kwSource)) !== null) {
    result.targetKeywords.push(m[1]);
  }
  // If no quoted keywords found, try comma-separated bare words
  if (result.targetKeywords.length === 0) {
    const bareKw = (kwMatch ? kwMatch[1] : t.text).split(',').map(k => k.trim().replace(/["()0-9\/mo|]/gi, '').trim()).filter(k => k.length > 2 && !/DefinedTerm|FAQPage/i.test(k));
    result.targetKeywords = bareKw;
  }

  return result;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function convertGlossary() {
  console.log('Starting glossary conversion...\n');

  const files = fs.readdirSync(GLOSSARY_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} glossary files\n`);

  const glossaryTerms = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(GLOSSARY_DIR, file);

    try {
      const { id, term, slug: filenameSlug, termDisplay } = parseFilename(file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const directAnswer = extractDirectAnswer(tables);
      const ukContext = extractUkContext(html, tables);
      const relatedTerms = extractRelatedTerms(html, tables);
      const relatedPages = extractRelatedPages(html, tables);
      const cta = extractCta(tables);
      const { schemaType, targetKeywords } = extractSchema(tables);

      const glossaryTerm = {
        id,
        slug: meta.slug ? meta.slug.replace(/^\//, '').replace(/\/$/, '') : filenameSlug,
        term,
        termDisplay,
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').trim(),
        reviewedBy: (header.reviewedBy || '').trim(),
        directAnswer,
        ukContext,
        relatedTerms,
        relatedPages,
        cta,
        schemaType,
        targetKeywords
      };

      glossaryTerms.push(glossaryTerm);

      if ((i + 1) % 25 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }
    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${glossaryTerms.length} glossary terms successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  // Deduplicate by slug — keep lowest P-number
  const slugMap = new Map();
  glossaryTerms.forEach(gt => {
    if (!gt.slug) return;
    const existing = slugMap.get(gt.slug);
    if (!existing) {
      slugMap.set(gt.slug, gt);
    } else {
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(gt.id.replace('P', ''));
      if (currentNum < existingNum) slugMap.set(gt.slug, gt);
    }
  });

  const uniqueTerms = Array.from(slugMap.values());
  uniqueTerms.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  console.log(`Unique glossary terms (after dedup): ${uniqueTerms.length}`);

  // Log samples
  uniqueTerms.slice(0, 3).forEach(gt => {
    console.log(`\nSample ${gt.id}:`);
    console.log(`  slug: ${gt.slug}`);
    console.log(`  term: ${gt.termDisplay}`);
    console.log(`  title: ${gt.title.substring(0, 70)}`);
    console.log(`  directAnswer: ${gt.directAnswer.substring(0, 60)}...`);
    console.log(`  ukContext: ${gt.ukContext ? gt.ukContext.substring(0, 60) + '...' : 'none'}`);
    console.log(`  relatedTerms: ${gt.relatedTerms.length}`);
    console.log(`  relatedPages: ${gt.relatedPages.length}`);
    console.log(`  cta: ${gt.cta ? gt.cta.substring(0, 50) : 'none'}`);
    console.log(`  schemaType: ${gt.schemaType}`);
    console.log(`  targetKW: ${gt.targetKeywords.length}`);
  });

  const output = `/**
 * Glossary Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueTerms.length}
 */

export const glossaryTerms = ${JSON.stringify(uniqueTerms, null, 2)};

// Lightweight listing data for A-Z grid / cards
export const glossaryListings = glossaryTerms.map(
  ({ id, slug, term, termDisplay, metaDesc }) =>
    ({ id, slug, term, termDisplay, metaDesc })
);

// Get single glossary term by slug
export function getGlossaryTermBySlug(slug) {
  return glossaryTerms.find(gt => gt.slug === slug) || null;
}

// Get related terms (same first letter or shared related pages)
export function getRelatedTerms(slug, limit = 6) {
  const current = getGlossaryTermBySlug(slug);
  if (!current) return [];
  const currentFirstLetter = current.termDisplay.charAt(0).toUpperCase();
  const related = glossaryTerms.filter(gt => {
    if (gt.slug === slug) return false;
    // Same first letter
    if (gt.termDisplay.charAt(0).toUpperCase() === currentFirstLetter) return true;
    // Shared related pages
    const sharedPages = gt.relatedPages.some(rp =>
      current.relatedPages.some(cr => cr.slug === rp.slug)
    );
    return sharedPages;
  });
  return related.slice(0, limit).map(
    ({ id, slug, term, termDisplay, metaDesc }) => ({ id, slug, term, termDisplay, metaDesc })
  );
}

// Get glossary terms grouped by first letter (A-Z)
export function getGlossaryByLetter(letter) {
  const upper = letter.toUpperCase();
  return glossaryTerms.filter(gt => gt.termDisplay.charAt(0).toUpperCase() === upper);
}

// Get all letters that have glossary terms
export function getGlossaryLetters() {
  const letters = new Set();
  glossaryTerms.forEach(gt => {
    if (gt.termDisplay) letters.add(gt.termDisplay.charAt(0).toUpperCase());
  });
  return Array.from(letters).sort();
}
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_FILE}`);
  return { total: files.length, unique: uniqueTerms.length, errors };
}

convertGlossary()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique glossary terms: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
