/**
 * Conversion Script: Hire Pages DOCX → Data File
 *
 * Extracts hire page content from 300 DOCX files in Hire-Page folder.
 * Handles role + city extraction from filename pattern.
 *
 * Usage: node scripts/convert-hire-pages.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const HIRE_PAGES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Hire-Page');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'hire-pages.js');

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

// Extract text between two tables
function extractBetween(html, afterTableRaw, beforeTableRaw) {
  const afterEnd = html.indexOf(afterTableRaw);
  const beforeStart = html.indexOf(beforeTableRaw);
  if (afterEnd === -1 || beforeStart === -1 || afterEnd >= beforeStart) return '';
  const chunk = html.substring(afterEnd + afterTableRaw.length, beforeStart);
  return stripHtml(chunk).trim();
}

// Extract text after a table until the next table
function extractAfter(html, afterTableRaw) {
  const afterEnd = html.indexOf(afterTableRaw);
  if (afterEnd === -1) return '';
  const nextTableStart = html.indexOf('<table', afterEnd + afterTableRaw.length);
  if (nextTableStart === -1) return '';
  const chunk = html.substring(afterEnd + afterTableRaw.length, nextTableStart);
  return stripHtml(chunk).trim();
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

function extractRoleAndCity(filename) {
  // Pattern 1: ClickMasters_P52_hire_react-developer_london.docx
  // role = react-developer, city = london
  // Pattern 2: ClickMasters_P534_hire_react_developer_southampton.docx
  // role = react_developer, city = southampton

  // Find the part after "hire_"
  const hireMatch = filename.match(/hire_([^.]+)\.docx$/i);
  if (!hireMatch) return { role: '', city: '' };

  const rest = hireMatch[1]; // e.g., "react-developer_london" or "react_developer_southampton"

  // Split on underscore first - last part is city, rest is role
  const parts = rest.split('_');
  if (parts.length >= 2) {
    const city = parts[parts.length - 1]; // last part = city
    const role = parts.slice(0, -1).join('-'); // everything else = role, join with hyphens
    return { role, city };
  }

  // Fallback: split on hyphen (less reliable)
  const hyphenParts = rest.split('-');
  if (hyphenParts.length >= 2) {
    const city = hyphenParts[hyphenParts.length - 1];
    const role = hyphenParts.slice(0, -1).join('-');
    return { role, city };
  }

  return { role: rest, city: '' };
}

function extractBadges(tables) {
  const badges = { city: '', ir35Status: '', rate: '', vetting: '', contract: '', rightToWork: '' };
  // The badges table contains city, IR35, rate, vetting, contract, right-to-work
  const t = findTable(tables, /🏙️|London|Manchester|Birmingham|Edinburgh|Glasgow|Liverpool|Cardiff|Nottingham|Sheffield|Belfast|Oxford|Cambridge/i);
  if (!t) return badges;

  const text = t.text;

  // City: after 🏙️ emoji
  const cityMatch = text.match(/🏙️\s*([A-Za-z\s]+?)(?=\s*[⚖️💷✅🔄🇬🇧]|$)/);
  if (cityMatch) badges.city = cityMatch[1].trim();

  // IR35 Status: after ⚖️ emoji
  const ir35Match = text.match(/⚖️\s*([A-Za-z\s]+?)(?=\s*[💷✅🔄🇬🇧]|$)/);
  if (ir35Match) badges.ir35Status = ir35Match[1].trim();

  // Rate: after 💷 emoji
  const rateMatch = text.match(/💷\s*([^|]+)/);
  if (rateMatch) badges.rate = rateMatch[1].trim();

  // Vetting: after ✅ emoji
  const vettingMatch = text.match(/✅\s*([A-Za-z\s]+?)(?=\s*[🔄🇬🇧]|$)/);
  if (vettingMatch) badges.vetting = vettingMatch[1].trim();

  // Contract: after 🔄 emoji
  const contractMatch = text.match(/🔄\s*([A-Za-z\s]+?)(?=\s*[🇬🇧]|$)/);
  if (contractMatch) badges.contract = contractMatch[1].trim();

  // Right to Work: after 🇬🇧 emoji
  const rtWMatch = text.match(/🇬🇧\s*(.+)/);
  if (rtWMatch) badges.rightToWork = rtWMatch[1].trim();

  return badges;
}

function extractDirectAnswer(tables) {
  const t = findTable(tables, /Direct Answer:/i);
  if (t) {
    return stripHtml(t.text.replace(/Direct Answer:/i, '').trim());
  }
  return '';
}

function extractBenefits(html, tables) {
  // Benefits are in a <ul> after the "Why ... Businesses Choose" table
  const t = findTable(tables, /Why.*Businesses Choose/i);
  if (!t) return [];

  const pos = getTablePosition(html, t.raw);
  if (!pos) return [];

  // Find next table after this one
  let nextTableStart = -1;
  for (let i = 0; i < tables.length; i++) {
    const tablePos = getTablePosition(html, tables[i]);
    if (tablePos && tablePos.start > pos.end) {
      nextTableStart = tablePos.start;
      break;
    }
  }

  if (nextTableStart === -1) return [];

  // Extract content between the two tables
  const chunk = html.substring(pos.end, nextTableStart);
  const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];

  return liMatches.map(li => stripHtml(li));
}

function extractRatesTable(tables) {
  // Rates table: has headers like "Engagement Type", "Mid-Level", "Senior", "Technical Lead"
  const t = findTable(tables, /Engagement Type/i);
  if (!t) return { rows: [], midRate: '', seniorRate: '', leadRate: '' };

  const text = t.text;
  const rows = [];

  // Try to parse the table
  const midMatch = text.match(/Mid-Level[^£]*£([\d,]+)/i);
  const seniorMatch = text.match(/Senior[^£]*£([\d,]+)/i);
  const leadMatch = text.match(/Technical Lead[^£]*£([\d,]+)/i);

  return {
    midRate: midMatch ? `£${midMatch[1]}/mo` : '',
    seniorRate: seniorMatch ? `£${seniorMatch[1]}/mo` : '',
    leadRate: leadMatch ? `£${leadMatch[1]}/mo` : ''
  };
}

function extractSkills(tables) {
  const t = findTable(tables, /Technical Skills|What Our.*Developers Know/i);
  if (!t) return [];

  const text = t.text;
  const skills = [];

  // Look for "Core Skills:" or "Default Stack:" sections
  const coreMatch = text.match(/Core Skills:\s*([\s\S]*?)(?=Default Stack:|Vetting Assessment:|$)/i);
  if (coreMatch) {
    const coreSkills = coreMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    skills.push(...coreSkills);
  }

  const defaultMatch = text.match(/Default Stack:\s*([\s\S]*?)(?=Vetting Assessment:|$)/i);
  if (defaultMatch) {
    const defaultSkills = defaultMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    skills.push(...defaultSkills);
  }

  return [...new Set(skills)]; // Remove duplicates
}

function extractVettingStages(html, tables) {
  const stages = [];

  // Look for tables with "1", "2", "3" markers
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]);

    // Stage 1: Technical Assessment
    if (/^\s*1\s*$/.test(text) || text.includes('Technical Assessment')) {
      const stageMatch = text.match(/Technical Assessment.*?([A-Z].*?)(?=\s*2\s*$|Communication|$)/is);
      if (stageMatch) {
        stages.push({
          stage: 1,
          title: 'Technical Assessment (2–3 hours)',
          description: stageMatch[1].replace(/^\d+\s*/, '').trim()
        });
      }
    }

    // Stage 2: Reference & Background Check
    if (/^\s*2\s*$/.test(text) || text.includes('Reference') && text.includes('Background')) {
      const stageMatch = text.match(/Reference.*?Background Check.*?([A-Z].*?)(?=\s*3\s*$|Communication|$)/is);
      if (stageMatch) {
        stages.push({
          stage: 2,
          title: 'Reference & Background Check',
          description: stageMatch[1].replace(/^\d+\s*/, '').trim()
        });
      }
    }

    // Stage 3: Communication & Culture Screen
    if (/^\s*3\s*$/.test(text) || text.includes('Communication') && text.includes('Culture')) {
      const stageMatch = text.match(/Communication.*?Culture Screen.*?([A-Z].*)/is);
      if (stageMatch) {
        stages.push({
          stage: 3,
          title: 'Communication & Culture Screen',
          description: stageMatch[1].replace(/^\d+\s*/, '').trim()
        });
      }
    }
  }

  return stages;
}

function extractIr35Comparison(tables) {
  const t = findTable(tables, /IR35 assessment required/i);
  if (!t) return { contractorAgency: [], clickMasters: [] };

  const text = t.text;
  const rows = [];

  // Parse the comparison table
  const lines = text.split(/\n|\r/).filter(l => l.trim());
  let currentRow = {};

  lines.forEach(line => {
    if (line.includes('Question')) return;
    if (line.includes('Contractor Agency Answer')) {
      currentRow.question = line.replace('Contractor Agency Answer', '').trim();
    } else if (line.includes('ClickMasters Answer')) {
      currentRow.clickMasters = line.replace('ClickMasters Answer', '').trim();
      if (currentRow.question && currentRow.clickMasters) {
        rows.push(currentRow);
        currentRow = {};
      }
    }
  });

  return rows;
}

function extractFaqs(html, tables) {
  const faqs = [];
  const t = findTable(tables, /Frequently Asked Questions/i);
  if (!t) return faqs;

  // Extract content after FAQ table
  const pos = getTablePosition(html, t.raw);
  if (!pos) return faqs;

  // Find next table or end
  let nextTableStart = -1;
  for (let i = 0; i < tables.length; i++) {
    const tablePos = getTablePosition(html, tables[i]);
    if (tablePos && tablePos.start > pos.end) {
      nextTableStart = tablePos.start;
      break;
    }
  }

  const chunk = nextTableStart > 0
    ? html.substring(pos.end, nextTableStart)
    : html.substring(pos.end);

  // Parse Q&A pairs
  const qMatches = chunk.match(/<strong>Q:/g) || [];
  const aMatches = chunk.match(/<strong>A:/g) || [];

  for (let i = 0; i < Math.min(qMatches.length, aMatches.length); i++) {
    const qStart = chunk.indexOf('<strong>Q:', i > 0 ? chunk.indexOf('<strong>Q:', i > 0 ? chunk.indexOf('<strong>Q:') + 1 : 0) : 0);
    const aStart = chunk.indexOf('<strong>A:', qStart);
    const nextQStart = chunk.indexOf('<strong>Q:', aStart);

    if (qStart !== -1 && aStart !== -1) {
      const question = stripHtml(chunk.substring(qStart + 9, aStart));
      const answer = stripHtml(chunk.substring(aStart + 9, nextQStart > 0 ? nextQStart : chunk.length));

      if (question && answer) {
        faqs.push({ question, answer });
      }
    }
  }

  return faqs;
}

// ─── Main ────────────────────────────────────────────────────────────────

async function convertHirePages() {
  console.log('Starting hire pages conversion...\n');

  const files = fs.readdirSync(HIRE_PAGES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} hire page files\n`);

  const hirePages = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(HIRE_PAGES_DIR, file);

    try {
      const pNumberMatch = file.match(/P(\d+)_/);
      const pNumber = pNumberMatch ? `P${pNumberMatch[1]}` : '';

      // Extract role and city from filename
      const { role, city } = extractRoleAndCity(file);

      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const badges = extractBadges(tables);
      const directAnswer = extractDirectAnswer(tables);
      const benefits = extractBenefits(html, tables);
      const ratesTable = extractRatesTable(tables);
      const skills = extractSkills(tables);
      const vettingStages = extractVettingStages(html, tables);
      const ir35Comparison = extractIr35Comparison(tables);
      const faqs = extractFaqs(html, tables);

      const hirePage = {
        id: pNumber,
        slug: meta.slug ? meta.slug.replace(/^\/hire-/, '').replace(/\/$/, '') : '',
        role: role,
        city: city,
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        cityDisplay: badges.city || city || '',
        rate: badges.rate || ratesTable.midRate || '',
        rates: {
          mid: ratesTable.midRate,
          senior: ratesTable.seniorRate,
          lead: ratesTable.leadRate
        },
        ir35Status: badges.ir35Status || '',
        vettingStages: badges.vetting || '',
        contract: badges.contract || '',
        rightToWork: badges.rightToWork || '',
        directAnswer: directAnswer,
        benefits: benefits,
        skills: skills,
        vettingProcess: vettingStages,
        ir35Comparison: ir35Comparison,
        faqs: faqs,
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').replace(/<[^>]*>/g, '').trim(),
        reviewedBy: (header.reviewedBy || '').replace(/<[^>]*>/g, '').trim(),
      };

      hirePages.push(hirePage);

      if ((i + 1) % 20 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }

    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${hirePages.length} hire pages successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  // Deduplicate by slug — keep lowest P_Number
  const slugMap = new Map();
  hirePages.forEach(hp => {
    if (!hp.slug) return;
    const existing = slugMap.get(hp.slug);
    if (!existing) {
      slugMap.set(hp.slug, hp);
    } else {
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(hp.id.replace('P', ''));
      if (currentNum < existingNum) {
        slugMap.set(hp.slug, hp);
      }
    }
  });

  const uniqueHirePages = Array.from(slugMap.values());
  uniqueHirePages.sort((a, b) => parseInt(a.id.replace('P', '')) - parseInt(b.id.replace('P', '')));

  console.log(`Unique hire pages (after dedup): ${uniqueHirePages.length}`);

  // Log samples for verification
  const samples = ['P52', 'P64', 'P150'];
  samples.forEach(pid => {
    const s = uniqueHirePages.find(hp => hp.id === pid);
    if (s) {
      console.log(`\nSample ${pid}:`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  role: ${s.role} | city: ${s.city}`);
      console.log(`  title: ${s.title.substring(0, 60)}`);
      console.log(`  rate: ${s.rate}`);
      console.log(`  benefits (${s.benefits.length}): ${s.benefits.slice(0, 2).join(', ')}...`);
      console.log(`  skills (${s.skills.length}): ${s.skills.slice(0, 3).join(', ')}...`);
      console.log(`  faqs: ${s.faqs.length}`);
    } else {
      console.log(`\nSample ${pid}: NOT FOUND`);
    }
  });

  const output = `/**
 * Hire Pages Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueHirePages.length}
 * Extraction: content-based (hire-page specific)
 */

export const hirePages = ${JSON.stringify(uniqueHirePages, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_FILE}`);

  return { total: files.length, unique: uniqueHirePages.length, errors };
}

convertHirePages()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique hire pages: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });