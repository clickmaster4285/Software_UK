/**
 * Conversion Script: Case Studies DOCX → Data File
 *
 * Content-based extraction — finds tables by their content, not position.
 * Works regardless of how many extra tables (Related Pages, CTA, etc.) exist.
 *
 * Usage: node scripts/convert-case-studies.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const CASE_STUDIES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Case-Study');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'case-studies.js');

// ─── Helpers ────────────────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Find a table whose stripped text matches a regex. Returns { text, raw, index } or null.
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

// Extract text between two tables (by their raw HTML)
function extractBetween(html, afterTableRaw, beforeTableRaw) {
  const afterEnd = html.indexOf(afterTableRaw);
  const beforeStart = html.indexOf(beforeTableRaw);
  if (afterEnd === -1 || beforeStart === -1 || afterEnd >= beforeStart) return '';
  const chunk = html.substring(afterEnd + afterTableRaw.length, beforeStart);
  return stripHtml(chunk).trim();
}

// ─── Extraction Functions ───────────────────────────────────────────

function extractMeta(tables) {
  const meta = {};
  const t = findTable(tables, /META TITLE:/i);
  if (!t) return meta;

  const titleMatch = t.text.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
  if (titleMatch) meta.metaTitle = titleMatch[1].trim();

  const descMatch = t.text.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
  if (descMatch) meta.metaDesc = descMatch[1].trim();

  // SLUG is followed by </p> or </td> — stop there
  const slugMatch = t.text.match(/SLUG:\s*([a-z0-9\-\/]+)/i);
  if (slugMatch) meta.slug = slugMatch[1].trim();

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

function extractBadges(tables) {
  const badges = { sector: '', country: '', status: '', contract: '' };
  // The badges table contains sector emoji + country emoji + status + contract
  const t = findTable(tables, /[🏭🏥🚗🛒💊🏛️💰🎓📦🏗️🌾🔧🎮📱🚀]/);
  if (!t) return badges;

  const text = t.text;

  // Sector: text after sector emoji, before country emoji or pipe
  const sectorMatch = text.match(/[🏭🏥🚗🛒💊🏛️💰🎓📦🏗️🌾🔧🎮📱🚀]\s*([^|🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]+)/);
  if (sectorMatch) badges.sector = sectorMatch[1].replace(/\|.*/, '').trim();

  // Country: text after country flag emoji
  const countryMatch = text.match(/[🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]\s*([A-Za-z\s]+?)(?=\s*[✅⚠️⏳📋]|$)/);
  if (countryMatch) badges.country = countryMatch[1].trim();

  // Status: text after status emoji
  const statusMatch = text.match(/[✅⚠️⏳]\s*([A-Za-z\s]+?)(?=\s*[📋]|$)/);
  if (statusMatch) badges.status = statusMatch[1].trim();

  // Contract: text after 📋 emoji
  const contractMatch = text.match(/📋\s*(.+)/);
  if (contractMatch) badges.contract = contractMatch[1].trim();

  return badges;
}

function extractTechAndCompliance(tables) {
  const result = { technologies: [], compliance: '' };
  // The tech table contains "Sector:" and "Tech:" and "Compliance:"
  const t = findTable(tables, /Tech:\s/i);
  if (!t) return result;

  const techMatch = t.text.match(/Tech:\s*([^|]+)/i);
  if (techMatch) {
    result.technologies = techMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }

  const complianceMatch = t.text.match(/Compliance:\s*(.+)/i);
  if (complianceMatch) result.compliance = complianceMatch[1].trim();

  return result;
}

function extractSections(html, tables) {
  const sections = { challenge: '', approach: '', results: '' };

  const challengeTable = findTable(tables, /The Challenge/i);
  const approachTable = findTable(tables, /Our Approach/i);
  const resultTable = findTable(tables, /The Result/i);

  if (challengeTable && approachTable) {
    sections.challenge = extractBetween(html, challengeTable.raw, approachTable.raw);
  }

  if (approachTable && resultTable) {
    sections.approach = extractBetween(html, approachTable.raw, resultTable.raw);
  }

  // Results = from after "The Result" table until the next table that contains a quote (has " and is long)
  // or the "Category Details" table
  if (resultTable) {
    const resultPos = getTablePosition(html, resultTable.raw);
    if (resultPos) {
      // Find the next table after resultTable that is either the quote or Category Details
      let nextBoundary = null;
      for (let i = 0; i < tables.length; i++) {
        const pos = getTablePosition(html, tables[i]);
        if (pos && pos.start > resultPos.end) {
          const text = stripHtml(tables[i]);
          // Stop at Category Details, Related Pages, or CTA table
          if (/Category Details/i.test(text) || /Related Pages/i.test(text) || /Build Something Similar/i.test(text) || /Article\s*\|/i.test(text)) {
            nextBoundary = pos.start;
            break;
          }
          // Also stop at quote table (contains " and is long, or starts with ")
          if ((text.includes('"') && text.length > 100) || text.startsWith('"')) {
            nextBoundary = pos.start;
            break;
          }
        }
      }
      if (nextBoundary) {
        const chunk = html.substring(resultPos.end, nextBoundary);
        sections.results = stripHtml(chunk).trim();
      }
    }
  }

  return sections;
}

function extractQuote(tables) {
  // Quote table: contains " and is typically a long block of text
  const t = findTable(tables, /^["\s].*["\s]$/);
  if (t) return t.text.replace(/^["\s]+|["\s]+$/g, '').trim();

  // Fallback: find any table with a long quote-like text
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]);
    if (text.includes('"') && text.length > 100 && !/Category Details/i.test(text)) {
      return text.replace(/^["\s]+|["\s]+$/g, '').trim();
    }
  }
  return '';
}

function extractFinalDetails(tables) {
  const details = { technologies: [], compliance: '', contract: '', ipOwnership: '' };
  const t = findTable(tables, /Category Details/i);
  if (!t) return details;

  let content = t.text.replace(/^Category Details\s*/i, '');

  const techMatch = content.match(/Technologies\s+(.+?)\s+Compliance\s+/i);
  if (techMatch) details.technologies = techMatch[1].split(',').map(s => s.trim()).filter(Boolean);

  const compMatch = content.match(/Compliance\s+(.+?)\s+Contract\s+/i);
  if (compMatch) details.compliance = compMatch[1].trim();

  const contractMatch = content.match(/Contract\s+(.+?)\s+IP\s+/i);
  if (contractMatch) details.contract = contractMatch[1].trim();

  const ipMatch = content.match(/IP\s+(.+)/i);
  if (ipMatch) details.ipOwnership = ipMatch[1].trim();

  return details;
}

// ─── Main ───────────────────────────────────────────────────────────

async function convertCaseStudies() {
  console.log('Starting case studies conversion (content-based extraction)...\n');

  const files = fs.readdirSync(CASE_STUDIES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} case study files\n`);

  const caseStudies = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(CASE_STUDIES_DIR, file);

    try {
      const pNumberMatch = file.match(/P(\d+)_/);
      const pNumber = pNumberMatch ? `P${pNumberMatch[1]}` : '';

      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const badges = extractBadges(tables);
      const techCompliance = extractTechAndCompliance(tables);
      const sections = extractSections(html, tables);
      const quote = extractQuote(tables);
      const finalDetails = extractFinalDetails(tables);

      const caseStudy = {
        id: pNumber,
        slug: meta.slug ? meta.slug.replace(/^\/case-studies\//, '').replace(/\/$/, '') : '',
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        sector: badges.sector || '',
        country: badges.country || '',
        status: badges.status || '',
        contract: badges.contract || finalDetails.contract || '',
        technologies: techCompliance.technologies.length > 0 ? techCompliance.technologies : finalDetails.technologies,
        technology: (techCompliance.technologies.length > 0 ? techCompliance.technologies : finalDetails.technologies).join(', '),
        compliance: techCompliance.compliance || finalDetails.compliance || '',
        complianceAchieved: finalDetails.compliance || '',
        challenge: sections.challenge || '',
        approach: sections.approach || '',
        results: sections.results || '',
        clientQuote: quote || '',
        deliveryModel: '',
        timeline: '',
        ipOwnership: finalDetails.ipOwnership || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').replace(/<[^>]*>/g, '').trim(),
        reviewedBy: (header.reviewedBy || '').replace(/<[^>]*>/g, '').trim(),
      };

      caseStudies.push(caseStudy);

      if ((i + 1) % 20 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }

    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${caseStudies.length} case studies successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  // Deduplicate by slug — keep lowest P_Number (numeric comparison)
  const slugMap = new Map();
  caseStudies.forEach(cs => {
    if (!cs.slug) return;
    const existing = slugMap.get(cs.slug);
    if (!existing) {
      slugMap.set(cs.slug, cs);
    } else {
      // Compare P_Numbers numerically (P898 < P1155)
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(cs.id.replace('P', ''));
      if (currentNum < existingNum) {
        slugMap.set(cs.slug, cs);
      }
    }
  });

  const uniqueCaseStudies = Array.from(slugMap.values());
  uniqueCaseStudies.sort((a, b) => parseInt(a.id.replace('P', '')) - parseInt(b.id.replace('P', '')));

  console.log(`Unique case studies (after dedup): ${uniqueCaseStudies.length}`);

  // Log samples for verification
  const samples = ['P1003', 'P517', 'P898'];
  samples.forEach(pid => {
    const s = uniqueCaseStudies.find(cs => cs.id === pid);
    if (s) {
      console.log(`\nSample ${pid}:`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  title: ${s.title.substring(0, 80)}`);
      console.log(`  sector: ${s.sector} | country: ${s.country}`);
      console.log(`  challenge (${s.challenge.length} chars): ${s.challenge.substring(0, 80)}...`);
      console.log(`  approach (${s.approach.length} chars): ${s.approach.substring(0, 80)}...`);
      console.log(`  results (${s.results.length} chars): ${s.results.substring(0, 80)}...`);
      console.log(`  quote (${s.clientQuote.length} chars): ${s.clientQuote.substring(0, 80)}...`);
    } else {
      console.log(`\nSample ${pid}: NOT FOUND`);
    }
  });

  const output = `/**
 * Case Studies Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueCaseStudies.length}
 * Extraction: content-based (table-count-agnostic)
 */

export const caseStudies = ${JSON.stringify(uniqueCaseStudies, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_FILE}`);

  return { total: files.length, unique: uniqueCaseStudies.length, errors };
}

convertCaseStudies()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique case studies: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
