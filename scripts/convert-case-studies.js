/**
 * Conversion Script: Case Studies DOCX → Data File
 *
 * Parses all 280 case study .docx files and generates data/case-studies.js
 *
 * Usage: node scripts/convert-case-studies.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

const CASE_STUDIES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Case-Study');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'case-studies.js');

// Helper to extract text from HTML
function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Extract meta fields from first table
function extractMeta(html) {
  const meta = {};

  // Extract META TITLE - look in the first meta table specifically
  const firstTableMatch = html.match(/<table>[\s\S]*?<\/table>/);
  if (firstTableMatch) {
    const tableContent = firstTableMatch[0];

    const titleMatch = tableContent.match(/META TITLE:\s*([^\n<]+)/i);
    if (titleMatch) meta.metaTitle = titleMatch[1].trim();

    const descMatch = tableContent.match(/META DESC:\s*([^\n<]+)/i);
    if (descMatch) meta.metaDesc = descMatch[1].trim();

    const slugMatch = tableContent.match(/SLUG:\s*([^\n<]+)/i);
    if (slugMatch) meta.slug = slugMatch[1].trim();
  }

  return meta;
}

// Extract header info (last updated, reading time, etc.)
function extractHeader(html) {
  const header = {};

  // Extract "Last updated: Month Year"
  const lastUpdatedMatch = html.match(/Last updated:\s*([^|]+)/i);
  if (lastUpdatedMatch) header.lastUpdated = lastUpdatedMatch[1].trim();

  // Extract "Reading time: X min"
  const readingTimeMatch = html.match(/Reading time:\s*(\d+)\s*min/i);
  if (readingTimeMatch) header.readingTime = parseInt(readingTimeMatch[1]);

  // Extract "Written by: ..."
  const writtenByMatch = html.match(/Written by:\s*([^|]+)/i);
  if (writtenByMatch) header.writtenBy = writtenByMatch[1].trim();

  // Extract "Reviewed by: ..."
  const reviewedByMatch = html.match(/Reviewed by:\s*([^|]+)/i);
  if (reviewedByMatch) header.reviewedBy = reviewedByMatch[1].trim();

  return header;
}

// Extract title from H1
function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return stripHtml(h1Match[1]);
  }
  return '';
}

// Extract badges (sector, country, status, contract) from the badges table
function extractBadges(html) {
  const badges = {
    sector: '',
    country: '',
    compliance: '',
    status: '',
    contract: ''
  };

  // Find tables that contain sector badges (with emojis like 🏭)
  const tables = html.match(/<table>[\s\S]*?<\/table>/gi) || [];

  for (const table of tables) {
    const tableText = stripHtml(table);

    // Look for table with sector emoji pattern
    if (tableText.includes('🏭') || tableText.includes('🏥') || tableText.includes('🚗') ||
        tableText.includes('🇬🇧') || tableText.includes('🇺🇸')) {

      // Extract sector - look for text after sector emoji
      const sectorMatch = table.match(/🏭\s*([^|<]+)|🏥\s*([^|<]+)|🚗\s*([^|<]+)|🛒\s*([^|<]+)|💊\s*([^|<]+)|🏛️\s*([^|<]+)|💰\s*([^|<]+)|🎓\s*([^|<]+)|📦\s*([^|<]+)|🏗️\s*([^|<]+)|🌾\s*([^|<]+)|🔧\s*([^|<]+)|🎮\s*([^|<]+)|📱\s*([^|<]+)|🚀\s*([^|<]+)/);
      if (sectorMatch) {
        badges.sector = (sectorMatch[1] || sectorMatch[2] || sectorMatch[3] || sectorMatch[4] || sectorMatch[5] ||
                         sectorMatch[6] || sectorMatch[7] || sectorMatch[8] || sectorMatch[9] || sectorMatch[10] ||
                         sectorMatch[11] || sectorMatch[12] || sectorMatch[13] || sectorMatch[14] || sectorMatch[15]).trim();
      }

      // Extract country
      const countryMatch = table.match(/🇬🇧\s*([^|<]+)|🇺🇸\s*([^|<]+)|🇩🇪\s*([^|<]+)|🇫🇷\s*([^|<]+)|🇪🇸\s*([^|<]+)/);
      if (countryMatch) {
        badges.country = (countryMatch[1] || countryMatch[2] || countryMatch[3] || countryMatch[4] || countryMatch[5]).trim();
      }

      // Extract status
      const statusMatch = table.match(/✅\s*([^|<]+)|⚠️\s*([^|<]+)|⏳\s*([^|<]+)/);
      if (statusMatch) {
        badges.status = (statusMatch[1] || statusMatch[2] || statusMatch[3]).trim();
      }

      // Extract contract type
      const contractMatch = table.match(/📋\s*([^|<]+)/);
      if (contractMatch) badges.contract = contractMatch[1].trim();

      // Look for compliance (💷 emoji)
      const complianceMatch = table.match(/💷\s*([^|<]+)/);
      if (complianceMatch) badges.compliance = complianceMatch[1].trim();

      break;
    }
  }

  return badges;
}

// Extract tech stack from second table
function extractTechStack(html) {
  const techStack = {
    technology: '',
    compliance: ''
  };

  // Look for the technology table
  const techMatch = html.match(/Technology:\s*([^\n<]+)/i);
  if (techMatch) techStack.technology = techMatch[1].trim();

  const complianceMatch = html.match(/Compliance:\s*([^\n<]+)/i);
  if (complianceMatch) techStack.compliance = complianceMatch[1].trim();

  return techStack;
}

// Extract sections: Challenge, Approach, Results
function extractSections(html) {
  const sections = {
    challenge: '',
    approach: '',
    results: ''
  };

  // Extract The Challenge section
  const challengeMatch = html.match(/<strong>The Challenge[\s\S]*?<\/strong>([\s\S]*?)(?=<strong>Our Approach|<table>|$)/i);
  if (challengeMatch) sections.challenge = stripHtml(challengeMatch[1]);

  // Extract Our Approach section
  const approachMatch = html.match(/<strong>Our Approach[\s\S]*?<\/strong>([\s\S]*?)(?=<strong>The Result|<table>|$)/i);
  if (approachMatch) sections.approach = stripHtml(approachMatch[1]);

  // Extract The Result section
  const resultsMatch = html.match(/<strong>The Result[\s\S]*?<\/strong>([\s\S]*?)(?=<blockquote|<table>|$)/i);
  if (resultsMatch) sections.results = stripHtml(resultsMatch[1]);

  return sections;
}

// Extract client quote
function extractQuote(html) {
  const blockquoteMatch = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
  if (blockquoteMatch) {
    return stripHtml(blockquoteMatch[1]);
  }
  return '';
}

// Extract final tech table details
function extractFinalTechTable(html) {
  const details = {
    technologies: [],
    complianceAchieved: '',
    deliveryModel: '',
    timeline: '',
    ipOwnership: ''
  };

  // Look for the final table with tech stack details
  // This is in the last table with categories like "Technologies Used", "Compliance Achieved", etc.
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

  for (const table of tables) {
    const tableText = stripHtml(table);
    if (tableText.includes('Technologies Used') && tableText.includes('Compliance Achieved')) {
      // Extract technologies
      const techMatch = tableText.match(/Technologies Used[\s\S]*?(Compliance Achieved|Delivery Model)/i);
      if (techMatch) {
        const techStr = techMatch[0].replace('Technologies Used', '').trim();
        details.technologies = techStr.split(/[,;]/).map(t => t.trim()).filter(t => t);
      }

      // Extract compliance
      const compMatch = tableText.match(/Compliance Achieved[\s\S]*?(Delivery Model|Timeline)/i);
      if (compMatch) {
        details.complianceAchieved = compMatch[0].replace('Compliance Achieved', '').trim();
      }

      // Extract delivery model
      const deliveryMatch = tableText.match(/Delivery Model[\s\S]*?(Timeline|IP Ownership)/i);
      if (deliveryMatch) {
        details.deliveryModel = deliveryMatch[0].replace('Delivery Model', '').trim();
      }

      // Extract timeline
      const timelineMatch = tableText.match(/Timeline[\s\S]*?(IP Ownership)/i);
      if (timelineMatch) {
        details.timeline = timelineMatch[0].replace('Timeline', '').trim();
      }

      // Extract IP ownership
      const ipMatch = tableText.match(/IP Ownership[\s\S]*/i);
      if (ipMatch) {
        details.ipOwnership = ipMatch[0].replace('IP Ownership', '').trim();
      }

      break;
    }
  }

  return details;
}

// Main conversion function
async function convertCaseStudies() {
  console.log('Starting case studies conversion...\n');

  // Get all docx files
  const files = fs.readdirSync(CASE_STUDIES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} case study files\n`);

  const caseStudies = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(CASE_STUDIES_DIR, file);

    try {
      // Extract P number from filename
      const pNumberMatch = file.match(/P(\d+)_/);
      const pNumber = pNumberMatch ? `P${pNumberMatch[1]}` : '';

      // Convert docx to HTML
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;

      // Extract all fields
      const meta = extractMeta(html);
      const header = extractHeader(html);
      const title = extractTitle(html);
      const badges = extractBadges(html);
      const techStack = extractTechStack(html);
      const sections = extractSections(html);
      const quote = extractQuote(html);
      const finalTech = extractFinalTechTable(html);

      // Build case study object
      const caseStudy = {
        id: pNumber,
        slug: meta.slug ? meta.slug.replace(/^\/case-studies\//, '').replace(/\/$/, '') : '',
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        sector: badges.sector || '',
        country: badges.country || '',
        status: badges.status || '',
        contract: badges.contract || '',
        technology: techStack.technology || finalTech.technologies.join(', ') || '',
        compliance: techStack.compliance || finalTech.complianceAchieved || '',
        challenge: sections.challenge || '',
        approach: sections.approach || '',
        results: sections.results || '',
        clientQuote: quote || '',
        technologies: finalTech.technologies,
        complianceAchieved: finalTech.complianceAchieved,
        deliveryModel: finalTech.deliveryModel,
        timeline: finalTech.timeline,
        ipOwnership: finalTech.ipOwnership,
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: header.writtenBy || '',
        reviewedBy: header.reviewedBy || ''
      };

      caseStudies.push(caseStudy);

      if ((i + 1) % 20 === 0) {
        console.log(`Processed ${i + 1}/${files.length} files...`);
      }

    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${caseStudies.length} case studies successfully`);
  console.log(`Errors: ${errors.length}`);

  // Handle duplicates - use lowest P_Number as canonical
  const slugMap = new Map();
  caseStudies.forEach(cs => {
    if (!cs.slug) return;
    const existing = slugMap.get(cs.slug);
    if (!existing || cs.id < existing.id) {
      slugMap.set(cs.slug, cs);
    }
  });

  const uniqueCaseStudies = Array.from(slugMap.values());
  console.log(`Unique case studies (after deduplication): ${uniqueCaseStudies.length}`);

  // Sort by ID
  uniqueCaseStudies.sort((a, b) => a.id.localeCompare(b.id));

  // Generate the data file
  const output = `/**
 * Case Studies Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueCaseStudies.length}
 */

export const caseStudies = ${JSON.stringify(uniqueCaseStudies, null, 2)};
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\nWritten to: ${OUTPUT_FILE}`);

  return { total: files.length, unique: uniqueCaseStudies.length, errors };
}

// Run the conversion
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