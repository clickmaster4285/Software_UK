/**
 * Conversion Script: International City DOCX → Data File
 *
 * Extracts city page content from 179 DOCX files in International-City folder.
 * Parses city-specific metadata, benefits, pricing tables, compliance, process steps, FAQs.
 *
 * Usage: node scripts/convert-cities.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const CITIES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'International-City');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'cities.js');

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';

  let rest = filename.replace(/\.docx$/i, '');
  rest = rest.replace(/^ClickMasters_P\d+_/, '');

  const parts = rest.split('_');

  const prefix = 'custom_software_development';
  const prefixIdx = parts.indexOf('custom');
  if (prefixIdx === -1) return { id, city: rest, focus: '' };

  const cityParts = parts.slice(prefixIdx + 3);
  const city = cityParts.join(' ').replace(/_/g, '-');

  return { id, city, focus: '' };
}

function extractMeta(html) {
  const meta = {};
  const titleMatch = html.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
  if (titleMatch) meta.metaTitle = stripHtml(titleMatch[1]);

  const descMatch = html.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
  if (descMatch) meta.metaDesc = stripHtml(descMatch[1]);

  const slugMatch = html.match(/SLUG:\s*\/?([a-z0-9\-\/]+?)(?:\/| |$)/i);
  if (slugMatch) {
    meta.slug = slugMatch[1].replace(/^\//, '').replace(/\/$/, '');
  }

  return meta;
}

function extractHeader(html) {
  const header = {};
  const lastUpdatedMatch = html.match(/Last updated:\s*([^|]+?)(?=\s*\||$)/i);
  if (lastUpdatedMatch) header.lastUpdated = lastUpdatedMatch[1].trim();

  const readingMatch = html.match(/Reading time:\s*(\d+)\s*min/i);
  if (readingMatch) header.readingTime = parseInt(readingMatch[1]);

  const writtenMatch = html.match(/Written by:\s*([^|]+?)(?=\s*\||$)/i);
  if (writtenMatch) header.writtenBy = writtenMatch[1].trim();

  const reviewedMatch = html.match(/Reviewed by:\s*([^|]+?)(?=\s*\||$)/i);
  if (reviewedMatch) header.reviewedBy = reviewedMatch[1].trim();

  return header;
}

function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripHtml(h1Match[1]);
  return '';
}

function extractBadges(html) {
  const daIndex = html.search(/Direct Answer:/i);
  if (daIndex === -1) return [];

  const beforeDa = html.substring(0, daIndex);
  const badgeTables = beforeDa.match(/<table[\s\S]*?<\/table>/gi) || [];

  for (const table of badgeTables) {
    if (/META TITLE|Last updated/i.test(table)) continue;
    const cells = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    const items = cells.map(c => stripHtml(c)).filter(Boolean);
    if (items.length >= 2) return items;
  }
  return [];
}

function extractDirectAnswer(html) {
  const match = html.match(/Direct Answer:\s*([\s\S]*?)(?=<table|<h[12]|<p>\s*<strong>|$)/i);
  if (match) return stripHtml(match[1]);
  return '';
}

function extractBenefits(html) {
  const whyChooseIndex = html.search(/Why\s+.+?\s+(Choose|Work|Trust)\s/i);
  if (whyChooseIndex === -1) return [];

  const chunk = html.substring(whyChooseIndex);
  const ulMatch = chunk.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (!ulMatch) return [];

  const liMatches = ulMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  return liMatches.map(li => stripHtml(li)).filter(Boolean);
}

function extractEcosystem(html) {
  const ecoIndex = html.search(/Technology\s+(Ecosystem|Hub|Landscape|Market)/i);
  if (ecoIndex === -1) return '';

  const chunk = html.substring(ecoIndex);
  const pMatches = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  return pMatches.map(p => stripHtml(p)).filter(Boolean).join('\n\n').substring(0, 2000);
}

function parseHtmlTableToArrays(tableHtml) {
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

function extractDataTable(tableHtml) {
  const text = stripHtml(tableHtml);
  if (text.includes('Frequently Asked Questions') || text.includes('Related Guides')) return null;
  if (text.includes('Direct Answer') || text.includes('META TITLE')) return null;
  if (tableHtml.includes('AUTHOR') && text.includes('ClickMasters')) return null;
  if (text.includes('Get a Free') && text.includes('Consultation')) return null;

  const rows = parseHtmlTableToArrays(tableHtml);
  if (rows.length < 2) return null;
  if (rows[0].length < 2) return null;

  const hasThead = tableHtml.includes('<thead');
  const headers = hasThead && rows.length > 0 ? rows[0] : [];
  const dataRows = hasThead ? rows.slice(1) : rows;

  const hasConsistent = dataRows.filter(r => r.length >= 2).length >= Math.min(3, dataRows.length);
  if (!hasConsistent) return null;

  return { headers, rows: dataRows };
}

function extractProcessSteps(html) {
  const steps = [];
  const stepTables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

  for (const table of stepTables) {
    const text = stripHtml(table);
    const stepMatch = text.match(/^(\d+)\s+/);
    if (stepMatch) {
      const rows = parseHtmlTableToArrays(table);
      if (rows.length > 0 && rows[0].length >= 2) {
        const stepNum = parseInt(stepMatch[1]);
        const cells = rows[0];
        steps.push({
          step: stepNum,
          title: stripHtml((cells[1] || '').split(/<\/?p>/).filter(Boolean)[0] || cells[1] || ''),
          description: stripHtml(cells[1] || '').substring(0, 500)
        });
      }
    }
  }
  return steps.sort((a, b) => a.step - b.step);
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
          faqs.push({ question: currentQuestion, answer: aMatch[1].trim() });
          currentQuestion = '';
          break;
        }
      }
    }
  }
  return faqs;
}

function extractRelatedPages(html) {
  const relatedIndex = html.search(/Related\s+(Guides|Pages|Services)/i);
  if (relatedIndex === -1) return [];

  const chunk = html.substring(relatedIndex);
  const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  const pages = [];

  for (const li of liMatches) {
    const text = stripHtml(li);
    const colonIdx = text.lastIndexOf(':');
    if (colonIdx !== -1) {
      const title = text.substring(0, colonIdx).trim();
      const slug = text.substring(colonIdx + 1).trim().replace(/^\//, '').replace(/\/$/, '');
      pages.push({ title, slug });
    }
  }
  return pages;
}

function extractAuthor(html) {
  const authorMatch = html.match(/AUTHOR[\s\S]*?<\/table>/i);
  if (authorMatch) {
    const cells = authorMatch[0].match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (cells.length >= 2) {
      return stripHtml(cells[cells.length - 1]).split('\n')[0].trim();
    }
  }
  return '';
}

function extractCta(html) {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const text = stripHtml(table);
    if ((text.includes('Free') && (text.includes('Consultation') || text.includes('Quote') || text.includes('Assessment'))) ||
        text.includes('Book Free') || text.includes('Get started')) {
      return text.substring(0, 500);
    }
  }
  return '';
}

async function convertCities() {
  console.log('Starting international city pages conversion...\n');

  const files = fs.readdirSync(CITIES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} city page files\n`);

  const cities = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(CITIES_DIR, file);

    try {
      const { id, city } = parseFilename(file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;

      const meta = extractMeta(html);
      const header = extractHeader(html);
      const title = extractTitle(html);
      const badges = extractBadges(html);
      const directAnswer = extractDirectAnswer(html);
      const benefits = extractBenefits(html);
      const ecosystem = extractEcosystem(html);
      const faqs = extractFaqs(html);
      const relatedPages = extractRelatedPages(html);
      const author = extractAuthor(html);
      const cta = extractCta(html);
      const processSteps = extractProcessSteps(html);

      const allTables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

      let pricingTable = null;
      let complianceTable = null;
      let generalTables = [];

      for (const table of allTables) {
        const text = stripHtml(table);
        const parsed = extractDataTable(table);
        if (!parsed) continue;

        if ((text.includes('Service Type') || text.includes('GBP Pricing') || text.includes('Pricing')) &&
            !text.includes('FAQ') && !text.includes('Related')) {
          pricingTable = parsed;
        } else if ((text.includes('Compliance Area') || text.includes('Compliance')) &&
                   !text.includes('FAQ') && !text.includes('Related')) {
          complianceTable = parsed;
        } else if (!text.match(/^\d+\s+/)) {
          generalTables.push(parsed);
        }
      }

      const cityEntry = {
        id,
        slug: meta.slug || `custom-software-development-${city}`,
        city,
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').trim(),
        reviewedBy: (header.reviewedBy || '').trim(),
        badges,
        directAnswer,
        benefits,
        ecosystem,
        pricingTable,
        complianceTable,
        processSteps,
        faqs,
        relatedPages,
        cta,
        author,
      };

      cities.push(cityEntry);

      if ((i + 1) % 30 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }
    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${cities.length} city pages successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  const slugMap = new Map();
  cities.forEach(c => {
    if (!c.slug) return;
    const existing = slugMap.get(c.slug);
    if (!existing) {
      slugMap.set(c.slug, c);
    } else {
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(c.id.replace('P', ''));
      if (currentNum < existingNum) {
        slugMap.set(c.slug, c);
      }
    }
  });

  const uniqueCities = Array.from(slugMap.values());
  uniqueCities.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  console.log(`Unique cities (after dedup): ${uniqueCities.length}`);

  const samples = ['P27', 'P195', 'P1090', 'P75', 'P1000'];
  samples.forEach(pid => {
    const s = uniqueCities.find(c => c.id === pid);
    if (s) {
      console.log(`\nSample ${pid} (${s.city}):`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  title: ${s.title.substring(0, 70)}`);
      console.log(`  badges: ${s.badges.length} items`);
      console.log(`  benefits: ${s.benefits.length}`);
      console.log(`  pricingTable: ${s.pricingTable ? `${s.pricingTable.rows.length} rows` : 'none'}`);
      console.log(`  complianceTable: ${s.complianceTable ? `${s.complianceTable.rows.length} rows` : 'none'}`);
      console.log(`  processSteps: ${s.processSteps.length}`);
      console.log(`  faqs: ${s.faqs.length}`);
      console.log(`  relatedPages: ${s.relatedPages.length}`);
    } else {
      console.log(`\nSample ${pid}: NOT FOUND`);
    }
  });

  const output = `/**
 * International City Pages Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueCities.length}
 */

export const cities = ${JSON.stringify(uniqueCities, null, 2)};

// Lightweight listing data for cards/listings
export const cityListings = cities.map(
  ({ id, slug, city, title, metaDesc, badges }) => ({ id, slug, city, title, metaDesc, badges: badges.slice(0, 3) })
);

// Get single city page by slug
export function getCityBySlug(slug) {
  return cities.find(c => c.slug === slug) || null;
}

// Get related city pages
export function getRelatedCities(slug, limit = 4) {
  const current = getCityBySlug(slug);
  if (!current) return [];

  const related = cities.filter(
    c => c.slug !== slug
  );

  return related.slice(0, limit).map(
    ({ id, slug, city, title, metaDesc }) => ({ id, slug, city, title, metaDesc })
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

  return { total: files.length, unique: uniqueCities.length, errors };
}

convertCities()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique cities: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
