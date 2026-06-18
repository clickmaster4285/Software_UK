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

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';

  let rest = filename.replace(/\.docx$/i, '');
  rest = rest.replace(/^ClickMasters_P\d+_/, '');

  const parts = rest.split('_');

  const prefixIdx = parts.indexOf('custom');
  if (prefixIdx === -1) return { id, city: rest.replace(/_/g, '-'), focus: '' };

  // Everything after "custom_software_development" (3 parts)
  const afterPrefix = parts.slice(prefixIdx + 3);

  // Known multi-word city names that use underscores in filename
  const multiWordCities = [
    'cape_town', 'kuala_lumpur', 'buenos_aires', 'nizhny_novgorod',
    'cluj_napoca', 'thessaloniki', 'nicosia'
  ];

  // Try to match multi-word city names first
  const remaining = afterPrefix.join('_');
  for (const mw of multiWordCities) {
    if (remaining === mw || remaining.startsWith(mw + '_')) {
      const afterCity = remaining.substring(mw.length).replace(/^_/, '');
      // Check for focus suffix (e.g., healthtech_focus, fintech, saas, govtech, ehealth, cyber_focus)
      let focus = '';
      if (afterCity) {
        // Normalize: "healthtech_focus" -> "healthtech", "fintech" -> "fintech", "cyber_focus" -> "cyber"
        focus = afterCity.replace(/_focus$/, '').replace(/_/g, '-');
      }
      return { id, city: mw.replace(/_/g, '-'), focus };
    }
  }

  // Single-word city: check for focus suffix like "tallinn_fintech" or "helsinki_healthtech_focus"
  if (afterPrefix.length >= 2) {
    // Check for compound focus like "healthtech_focus" (last part is literally "focus")
    const hasCompoundFocus = afterPrefix[afterPrefix.length - 1] === 'focus';
    if (hasCompoundFocus && afterPrefix.length >= 2) {
      const focus = afterPrefix.slice(0, afterPrefix.length - 1).slice(1).join('-').replace(/_/g, '-');
      // City is the first part, everything between city and "_focus" is the focus
      // e.g., ["helsinki", "healthtech", "focus"] -> city="helsinki", focus="healthtech"
      // e.g., ["tallinn", "fintech", "focus"] -> city="tallinn", focus="fintech"
      const city = afterPrefix[0];
      return { id, city, focus };
    }

    // Check for multi-word focus like "digital_government" (last part is "government")
    const lastPart = afterPrefix[afterPrefix.length - 1];
    const focusIndicators = ['saas', 'fintech', 'govtech', 'ehealth', 'healthtech', 'cyber', 'medtech', 'government'];
    const isLastFocus = focusIndicators.some(f => lastPart === f || lastPart.startsWith(f));

    if (isLastFocus) {
      // Everything after the city name is the focus
      const city = afterPrefix[0];
      const focusParts = afterPrefix.slice(1);
      const focus = focusParts.join('-').replace(/_/g, '-');
      return { id, city, focus };
    }
  }

  // No focus detected — entire remainder is the city
  const city = afterPrefix.join('-');
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

  const headerTable = html.match(/<table[\s\S]*?(?:Last updated|Reading time)[\s\S]*?<\/table>/i);
  if (!headerTable) return header;
  const text = stripHtml(headerTable[0]);

  const lastUpdatedMatch = text.match(/Last updated:\s*(.+?)(?=\s*\|)/i);
  if (lastUpdatedMatch) header.lastUpdated = lastUpdatedMatch[1].trim();

  const readingMatch = text.match(/Reading time:\s*(\d+)\s*min/i);
  if (readingMatch) header.readingTime = parseInt(readingMatch[1]);

  const writtenMatch = text.match(/Written by:\s*(.+?)(?=\s*\|)/i);
  if (writtenMatch) header.writtenBy = writtenMatch[1].trim();

  const reviewedMatch = text.match(/Reviewed by:\s*(.+)/i);
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
  const whyChooseIndex = html.search(/Why\s+.+?\s+(Choose|Work|Trust|Use)\s/i);
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

  const after = html.substring(ecoIndex);
  const sectionBoundary = after.search(/<strong>[^<]*?(?:💷|UK Compliance for|How We Work in|Frequently Asked|FAQs|Why\s+\w+\s+Businesses\s+Use|EU GDPR vs)/i);
  const endPos = sectionBoundary !== -1 ? ecoIndex + sectionBoundary : html.length;

  const chunk = html.substring(ecoIndex, endPos);
  const noTables = chunk.replace(/<table[\s\S]*?<\/table>/gi, '');
  const pMatches = noTables.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  const tableMatches = chunk.match(/<table[\s\S]*?<\/table>/gi) || [];
  const tableTexts = tableMatches.map(t => stripHtml(t)).filter(Boolean);

  const texts = [
    ...pMatches.map(p => stripHtml(p)).filter(Boolean),
    ...tableTexts
  ];

  return texts.join('\n\n').substring(0, 2000);
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
        const cellText = stripHtml(rows[0][1] || '');

        // Extract title: text before the first parenthetical or first sentence
        // e.g., "Free London Consultation (Week 1)" from "Free London Consultation (Week 1) 45-minute video..."
        let title = cellText;
        // Try to extract just the step name: everything before " 45-minute" or " For " or " Output:"
        const titleEnd = cellText.search(/\s+(?:\d+[\s-]minute|For projects|Output:|Development in|Production deployment|OWASP|Staging environment)/i);
        if (titleEnd > 10) {
          title = cellText.substring(0, titleEnd).trim();
        } else {
          // Fallback: take text up to first period or first 80 chars
          const periodIdx = cellText.indexOf('. ');
          if (periodIdx > 10 && periodIdx < 100) {
            title = cellText.substring(0, periodIdx).trim();
          } else {
            title = cellText.substring(0, Math.min(80, cellText.length)).trim();
          }
        }

        steps.push({
          step: stepNum,
          title,
          description: cellText.substring(0, 500)
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
  // Find the AUTHOR table — it contains "AUTHOR" in a cell, and the author name in the next cell
  const authorMatch = html.match(/\bAUTHOR\b[\s\S]*?<\/table>/i);
  if (!authorMatch) return '';

  // The authorMatch starts from "AUTHOR" mid-table, so the first <td> found
  // is actually the cell containing the author name (the label cell was before "AUTHOR")
  const cells = [];
  const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
  let tdMatch;
  while ((tdMatch = tdRegex.exec(authorMatch[0])) !== null) {
    cells.push(tdMatch[0]);
  }

  if (cells.length >= 1) {
    // cells[0] is the author name cell (the "AUTHOR" label is in a preceding <td> outside the match)
    const cellHtml = cells[0];
    const pMatches = cellHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    if (pMatches.length > 0) {
      const firstP = stripHtml(pMatches[0]).trim();
      if (firstP && firstP.length > 3) return firstP;
    }
    const cellText = stripHtml(cellHtml);
    const firstChunk = cellText.split(/\s{2,}/)[0].trim();
    if (firstChunk && firstChunk.length > 3) return firstChunk;
  }
  return '';
}

function extractCta(html) {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const text = stripHtml(table);

    // Skip pricing tables (have "Service Type" / "GBP Pricing" / "Description" headers)
    if (text.includes('Service Type') && (text.includes('GBP Pricing') || text.includes('Description'))) continue;

    // Skip process step tables (start with a number followed by text like "Free ... Consultation")
    if (/^\d+\s+(Free|Technical|Agile|Security|Launch)\b/.test(text)) continue;

    // Skip compliance tables
    if (text.includes('Compliance Area') || text.includes('ClickMasters Implementation')) continue;

    // Actual CTA: contains "Free" + "Consultation" or "Book Free" or "Get started"
    // and is relatively short (under 400 chars — pricing tables are longer)
    if ((text.includes('Free') && (text.includes('Consultation') || text.includes('Quote') || text.includes('Assessment'))) ||
        text.includes('Book Free') || text.includes('Get started')) {
      if (text.length < 400) {
        return text.substring(0, 500);
      }
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
      const { id, city, focus } = parseFilename(file);
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
        focus,
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
  ({ id, slug, city, focus, title, metaDesc, badges }) => ({ id, slug, city, focus, title, metaDesc, badges: badges.slice(0, 3) })
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
