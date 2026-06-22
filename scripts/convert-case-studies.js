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

  // Strategy 1: Find badge table by emoji (older DOCX format)
  let t = findTable(tables, /[🏭🏥🚗🛒💊🏛️💰🎓📦🏗️🌾🔧🎮📱🚀]/);
  if (t) {
    const text = t.text;
    const sectorMatch = text.match(/[🏭🏥🚗🛒💊🏛️💰🎓📦🏗️🌾🔧🎮📱🚀]\s*([^|🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]+)/);
    if (sectorMatch) badges.sector = sectorMatch[1].replace(/\|.*/, '').trim();
    const countryMatch = text.match(/[🇬🇧🇺🇸🇩🇪🇫🇷🇪🇸🇮🇪🇦🇺🇨🇦]\s*([A-Za-z\s]+?)(?=\s*[✅⚠️⏳📋]|$)/);
    if (countryMatch) badges.country = countryMatch[1].trim();
    const statusMatch = text.match(/[✅⚠️⏳]\s*([A-Za-z\s]+?)(?=\s*[📋]|$)/);
    if (statusMatch) badges.status = statusMatch[1].trim();
    const contractMatch = text.match(/📋\s*(.+)/);
    if (contractMatch) badges.contract = contractMatch[1].trim();
    return badges;
  }

  // Strategy 2: Find badge table by plain-text keywords (newer DOCX format)
  // Looks for a short table containing "On Time" or "Delayed" and "Fixed" or "Agile"
  t = findTable(tables, /(?:On Time|Delayed|On Budget).*(?:Fixed|Agile|T&M|Time and Materials)/i)
    || findTable(tables, /(?:Fixed Price|Fixed-price).*(?:On Time|Delayed)/i);
  if (!t) return badges;

  const text = t.text;

  // Sector: first segment before country keyword — split on known country codes
  const countryCodes = ['UK', 'US', 'DE', 'FR', 'ES', 'IE', 'AU', 'CA'];
  const countryPattern = countryCodes.join('|');
  const sectorMatch = text.match(new RegExp(`^(.+?)\\s+(?:${countryPattern})\\b`));
  if (sectorMatch) badges.sector = sectorMatch[1].trim().replace(/^[\s\-]+|[\s\-]+$/g, '');

  // Country: first matching country code
  const cMatch = text.match(new RegExp(`\\b(${countryPattern})\\b`));
  if (cMatch) badges.country = cMatch[1];

  // Status: On Time / Delayed / On Budget (case-insensitive match, normalized below)
  const sMatch = text.match(/\b(On Time|Delayed|On Budget)\b/i);
  if (sMatch) badges.status = sMatch[1];

  // Contract: Fixed Price / Fixed-price / Agile / T&M etc.
  const coMatch = text.match(/\b(Fixed[ -]price Agile|Fixed[ -]price|T&M|Time and Materials|Agile)\b/i);
  if (coMatch) badges.contract = coMatch[1];

  return badges;
}

function extractTechAndCompliance(tables) {
  const result = { technologies: [], compliance: '' };

  // Strategy 1: Dedicated tech table (older DOCX format) — contains "Tech:" label
  let t = findTable(tables, /Tech:\s/i);
  if (t) {
    const techMatch = t.text.match(/Tech:\s*([^|]+)/i);
    if (techMatch) {
      result.technologies = techMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    }
    const complianceMatch = t.text.match(/Compliance:\s*(.+)/i);
    if (complianceMatch) result.compliance = complianceMatch[1].trim();
    return result;
  }

  // Strategy 2: Combined sector+tech+compliance table (newer DOCX format)
  // Format: "Sector: X / Y | Tech: a, b, c | Compliance: ..."
  t = findTable(tables, /Sector:\s*.+\|\s*Tech:\s/i);
  if (!t) return result;

  const text = t.text;
  const techMatch = text.match(/Tech:\s*([^|]+)/i);
  if (techMatch) {
    result.technologies = techMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  }
  const complianceMatch = text.match(/Compliance:\s*(.+)/i);
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
  // Quote table: must start with a quote character and read like a testimonial
  // Real quotes: start with ", contain an attribution (— or -- or " —), and are 80-800 chars
  // Must NOT be metadata (Sector:/Technology:/Compliance:/Category Details/pipe-separated)
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]).trim();
    // Skip known non-quote tables
    if (/^(Sector:|Category Details|Related Pages|Build Something|Article\s*\|)/i.test(text)) continue;
    if (/Technologies\s+.*Compliance\s+.*Contract\s+.*IP/i.test(text)) continue;
    if (/^(Last updated|META TITLE|The Challenge|Our Approach|The Result)/i.test(text)) continue;

    // Real quotes start with " and contain an attribution marker
    if (/^["\u201C]/.test(text) && text.length > 80 && text.length < 800) {
      // Must have attribution: em-dash, en-dash, or double-dash before a name/role
      if (/[\u2014\u2013-]{1,2}\s*[A-Z]/.test(text) || /"[\u2014\u2013-]{1,2}\s*[A-Z]/.test(text)) {
        return text.replace(/^["\s\u201C]+|["\s\u201D]+$/g, '').trim();
      }
    }
  }
  // Fallback: tables starting with " that are testimonial-length and not metadata
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]).trim();
    if (/^(Sector:|Category Details|Related Pages|Build Something|Article\s*\|)/i.test(text)) continue;
    if (/Technologies\s+.*Compliance\s+.*Contract\s+.*IP/i.test(text)) continue;
    if (/^(Last updated|META TITLE|The Challenge|Our Approach|The Result)/i.test(text)) continue;
    if (text.length < 80 || text.length > 800) continue;

    // Must start with quote and have multiple quote marks (opening + closing)
    if (/^["\u201C]/.test(text) && (text.match(/["\u201C\u201D]/g) || []).length >= 3) {
      return text.replace(/^["\s\u201C]+|["\s\u201D]+$/g, '').trim();
    }
  }
  return '';
}

function extractFinalDetails(tables) {
  const details = { technologies: [], compliance: '', contract: '', ipOwnership: '' };
  const t = findTable(tables, /Category Details/i);
  if (!t) return details;

  // Remove "Category Details" prefix — rest contains Technologies, Compliance, Contract, IP
  let content = t.text.replace(/^Category Details\s*/i, '').trim();

  // Newer format: "Technologies X Y Z Compliance A B Contract C IP D" (space-separated, no labels for some)
  // Older format: "Technologies | X, Y, Z | Compliance | A, B | Contract | C | IP | D" (pipe-separated)
  // Detect format by checking for pipe separators
  const isPipeFormat = content.includes('|');

  if (isPipeFormat) {
    // ── Older pipe-separated format ──
    // Extract IP ownership first (most reliable anchor — always at end)
    const ipMatch = content.match(/IP\s+(100%\s*transferred(?:\s+to\s+client)?(?:\s+on\s+delivery)?|Ownership\s+100%\s*transferred(?:\s+to\s+client)?(?:\s+on\s+delivery)?)/i);
    if (ipMatch) {
      details.ipOwnership = ipMatch[1].trim();
      content = content.substring(0, content.indexOf(ipMatch[0])).trim();
    }

    // Extract contract
    const contractMatch = content.match(/Contract\s+(.+?)$/i);
    if (contractMatch) {
      details.contract = contractMatch[1].trim();
      content = content.substring(0, content.lastIndexOf('Contract')).trim();
    }

    // Extract compliance
    const compMatch = content.match(/Compliance\s+(.+?)$/i);
    if (compMatch) {
      details.compliance = compMatch[1].trim();
      content = content.substring(0, content.lastIndexOf('Compliance')).trim();
    }

    // Remaining = technologies
    let techContent = content.replace(/^Technologies\s*/i, '').trim();
    if (techContent) {
      details.technologies = techContent.split(',').map(s => s.trim()).filter(Boolean);
    }
  } else {
    // ── Newer space-separated format ──
    // Extract IP first (always at end): "IP 100% transferred" or "IP 100% transferred to client"
    const ipMatch = content.match(/IP\s+(100%\s*transferred(?:\s+to\s+client)?(?:\s+on\s+delivery)?|Ownership\s+100%\s*transferred(?:\s+to\s+client)?(?:\s+on\s+delivery)?)/i);
    if (ipMatch) {
      details.ipOwnership = ipMatch[1].trim();
      content = content.substring(0, content.indexOf(ipMatch[0])).trim();
    }

    // Extract contract: "Contract Fixed-price Agile" or "Contract Fixed Price"
    const contractMatch = content.match(/Contract\s+(Fixed[ -]price(?:\s+Agile)?|T&M|Time and Materials|Agile)/i);
    if (contractMatch) {
      details.contract = contractMatch[1].trim();
      content = content.substring(0, content.lastIndexOf('Contract')).trim();
    }

    // Extract compliance: "Compliance X, Y, Z" — everything between "Compliance" and "Contract"/"IP"
    const compMatch = content.match(/Compliance\s+(.+?)(?=\s+Contract|\s+IP|$)/i);
    if (compMatch) {
      details.compliance = compMatch[1].trim();
      content = content.substring(0, content.lastIndexOf('Compliance')).trim();
    }

    // Remaining = technologies (may be prefixed with "Technologies" or just a comma-separated list)
    let techContent = content.replace(/^Technologies\s*/i, '').trim();
    if (techContent) {
      details.technologies = techContent.split(',').map(s => s.trim()).filter(Boolean);
    }
  }

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

      // ── Normalize fields ──

      // Sector: strip any leading emoji/surrogate pairs and whitespace
      if (caseStudy.sector) {
        caseStudy.sector = caseStudy.sector
          .replace(/^[\uD800-\uDFFF\u2600-\u27BF\uFE00-\uFE0F\u200D\s]+/g, '')  // remove leading emoji/surrogates
          .replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')  // remove leading/trailing dashes/spaces
          .trim();
      }

      // Country: "UK Client" → "UK"
      if (/^UK\s+Client$/i.test(caseStudy.country)) caseStudy.country = 'UK';

      // Status: normalize case — "on Time" → "On Time", "Delivered on Time" → "On Time"
      if (caseStudy.status) {
        const statusLower = caseStudy.status.toLowerCase().replace(/\s+/g, ' ').trim();
        if (statusLower === 'on time' || statusLower === 'delivered on time' || statusLower === 'delivered on-time') {
          caseStudy.status = 'On Time';
        } else if (statusLower === 'delayed') {
          caseStudy.status = 'Delayed';
        } else if (statusLower === 'on budget') {
          caseStudy.status = 'On Budget';
        }
      }

      // Normalize ipOwnership: strip trailing noise, standardize format
      if (caseStudy.ipOwnership) {
        const ipClean = caseStudy.ipOwnership.match(/(100%\s*transferred(?:\s+to\s+client)?(?:\s+on\s+delivery)?)/i);
        if (ipClean) caseStudy.ipOwnership = ipClean[1].replace(/\s+/g, ' ').trim();
      }

      // Remove "Used " prefix from first technology
      if (caseStudy.technologies.length > 0) {
        caseStudy.technologies[0] = caseStudy.technologies[0].replace(/^Used\s+/i, '');
        caseStudy.technology = caseStudy.technologies.join(', ');
      }

      // Normalize contract: standardize format
      if (caseStudy.contract) {
        const contractLower = caseStudy.contract.toLowerCase().replace(/[\s-]+/g, ' ').trim();
        if (contractLower === 'fixed price' || contractLower === 'fixedprice') {
          caseStudy.contract = 'Fixed Price';
        } else if (contractLower === 'fixed price agile' || contractLower === 'fixedprice agile') {
          caseStudy.contract = 'Fixed-price Agile';
        } else if (contractLower === 'agile') {
          caseStudy.contract = 'Agile';
        } else if (contractLower === 't&m' || contractLower === 'time and materials') {
          caseStudy.contract = 'T&M';
        }
      }

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
