/**
 * Conversion Script: Comparison Pages DOCX → Data File
 *
 * Extracts comparison page content from 177 DOCX files in Comparison-Page folder.
 * Parses side-by-side comparison tables, FAQs, and related page links.
 *
 * Usage: node scripts/convert-comparisons.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const COMPARISON_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Comparison-Page');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'comparisons.js');

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';

  let rest = filename.replace(/\.docx$/i, '');
  rest = rest.replace(/^ClickMasters_P\d+_comparison_/, '');

  return { id, topic: rest };
}

function extractMeta(html) {
  const meta = {};
  const titleMatch = html.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
  if (titleMatch) meta.metaTitle = stripHtml(titleMatch[1]);

  const descMatch = html.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
  if (descMatch) meta.metaDesc = stripHtml(descMatch[1]);

  const slugMatch = html.match(/SLUG:\s*\/?([a-z0-9\-\/]+?)(?:\/|$)/i);
  if (slugMatch) {
    meta.slug = slugMatch[1].replace(/^\//, '').replace(/\/$/, '');
  }

  return meta;
}

function extractHeader(html) {
  const header = {};
  const headerMatch = html.match(/Last updated:\s*([^|]+?)(?=\s*\||$)/i);
  if (headerMatch) header.lastUpdated = headerMatch[1].trim();

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

function extractDirectAnswer(html) {
  const match = html.match(/Direct Answer:\s*([\s\S]*?)(?=<table|<h[12]|<p>\s*<strong>|$)/i);
  if (match) return stripHtml(match[1]);
  return '';
}

function extractBadges(html) {
  const daIndex = html.search(/Direct Answer:/i);
  if (daIndex === -1) return [];

  const beforeDa = html.substring(0, daIndex);
  const badgeTables = beforeDa.match(/<table[\s\S]*?<\/table>/gi) || [];

  for (const table of badgeTables) {
    const cells = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    const items = cells.map(c => stripHtml(c)).filter(Boolean);
    if (items.length >= 2) return items;
  }
  return [];
}

function isTitleTable(tableHtml) {
  const text = stripHtml(tableHtml);
  const titlePatterns = ['frequently asked questions', 'related pages', 'comparison', 'vs ', ' vs'];
  return titlePatterns.some(p => text.toLowerCase().includes(p)) && !tableHtml.includes('<th') && tableHtml.split('<tr').length <= 2;
}

function isMetaTable(tableHtml) {
  return /META TITLE|META DESC|SLUG/i.test(tableHtml);
}

function isHeaderTable(tableHtml) {
  return /last updated|reading time|written by/i.test(tableHtml);
}

function isBadgeTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return text.length < 200 && (text.includes('✅') || text.includes('🔵') || text.includes('☁️') || text.includes('🔒') || text.includes('🏥') || text.includes('💷') || text.includes('🇬🇧') || text.includes('⚖️') || text.includes('💻') || text.includes('🎨') || text.includes('🛡️') || text.includes('💰') || text.includes('📱') || text.includes('☕'));
}

function isCtaTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return text.includes('Free') && text.includes('Consultation') || text.includes('Book') && text.includes('free') || text.includes('Contact us') || text.includes('Get started');
}

function isAuthorTable(tableHtml) {
  return stripHtml(tableHtml).includes('AUTHOR') && stripHtml(tableHtml).includes('ClickMasters');
}

function isSchemaTable(tableHtml) {
  return stripHtml(tableHtml).includes('@type') || stripHtml(tableHtml).includes('FAQPage') || stripHtml(tableHtml).includes('Article');
}

function isDirectAnswerTable(tableHtml) {
  return tableHtml.includes('Direct Answer:');
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

function shouldSkipTable(tableHtml, text) {
  if (isMetaTable(tableHtml)) return true;
  if (isHeaderTable(tableHtml)) return true;
  if (isBadgeTable(tableHtml)) return true;
  if (isDirectAnswerTable(tableHtml)) return true;
  if (isCtaTable(tableHtml)) return true;
  if (isAuthorTable(tableHtml)) return true;
  if (isSchemaTable(tableHtml)) return true;
  if (text.length < 10) return true;
  if (text.includes('Related Pages')) return true;
  return false;
}

function extractBodySections(html, comparisonTables) {
  const sections = [];
  const tableMatches = [...html.matchAll(/<table[\s\S]*?<\/table>/gi)];

  for (let i = 0; i < tableMatches.length; i++) {
    const currentTable = tableMatches[i][0];
    const text = stripHtml(currentTable);

    if (text.includes('Direct Answer')) continue;
    if (text.includes('META TITLE')) continue;
    if (text.includes('Last updated')) continue;
    if (text.includes('AUTHOR')) continue;
    if (text.includes('Free') && text.includes('Consultation')) continue;
    if (text.includes('@type') || text.includes('FAQPage')) continue;
    if (isBadgeTable(currentTable)) continue;

    if (text.includes('Frequently Asked Questions') || text.includes('Related Pages')) continue;

    const cells = currentTable.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    const cellTexts = cells.map(c => stripHtml(c)).filter(c => c.length > 5);

    if (cellTexts.length === 1 && !currentTable.includes('<th')) {
      const title = cellTexts[0];
      const endPos = tableMatches[i].index + currentTable.length;
      let nextTableStart = html.length;
      if (i + 1 < tableMatches.length) {
        nextTableStart = tableMatches[i + 1].index;
      }
      const between = html.substring(endPos, nextTableStart);
      const contentP = between.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
      if (contentP) {
        const content = contentP.map(p => stripHtml(p)).filter(Boolean).join('\n\n');
        if (content) {
          sections.push({ title, content });
        }
      }
    }
  }
  return sections;
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

function extractRelatedPages(html) {
  const relatedIndex = html.search(/Related Pages/i);
  if (relatedIndex === -1) return [];

  const chunk = html.substring(relatedIndex);
  const liMatches = chunk.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
  const pages = [];

  for (const li of liMatches) {
    const text = stripHtml(li);
    const colonIdx = text.lastIndexOf(':');
    if (colonIdx !== -1) {
      const title = text.substring(0, colonIdx).trim();
      const url = text.substring(colonIdx + 1).trim();
      const slug = url.replace(/^\//, '').replace(/\/$/, '');
      pages.push({ title, slug });
    }
  }
  return pages;
}

function extractAuthor(html) {
  const authorMatch = html.match(/AUTHOR[\s\S]*?<\/table>/i);
  if (authorMatch) {
    const authorTable = authorMatch[0];
    const cells = authorTable.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    if (cells.length >= 2) {
      const authorName = stripHtml(cells[cells.length - 1]).split('\n')[0].trim();
      if (authorName && authorName.length < 200) return authorName;
    }
  }
  return '';
}

function extractCta(html) {
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  for (const table of tables) {
    const text = stripHtml(table);
    if ((text.includes('Free') && (text.includes('Consultation') || text.includes('Assessment') || text.includes('Quote'))) ||
        (text.includes('Book') && text.includes('free')) ||
        (text.includes('Get started') || text.includes('Contact us'))) {
      return text.substring(0, 500);
    }
  }
  return '';
}

function isDataTable(tableHtml) {
  const text = stripHtml(tableHtml);
  if (text.includes('Frequently Asked Questions') || text.includes('Related Pages')) return false;
  if (text.includes('Direct Answer')) return false;
  if (text.includes('META TITLE')) return false;
  if (text.includes('AUTHOR')) return false;
  if (isBadgeTable(tableHtml)) return false;

  const rows = parseHtmlTableToArrays(tableHtml);
  if (rows.length < 2) return false;

  const firstRowLen = rows[0].length;
  if (firstRowLen < 2) return false;

  const hasConsistentColumns = rows.filter(r => r.length >= 2).length >= Math.min(rows.length, 3);
  if (!hasConsistentColumns) return false;

  if (firstRowLen === 1 && rows.length === 1) return false;

  return true;
}

async function convertComparisons() {
  console.log('Starting comparison pages conversion...\n');

  const files = fs.readdirSync(COMPARISON_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} comparison page files\n`);

  const comparisons = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(COMPARISON_DIR, file);

    try {
      const { id, topic } = parseFilename(file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;

      const meta = extractMeta(html);
      const header = extractHeader(html);
      const title = extractTitle(html);
      const badges = extractBadges(html);
      const directAnswer = extractDirectAnswer(html);
      const faqs = extractFaqs(html);
      const relatedPages = extractRelatedPages(html);
      const author = extractAuthor(html);
      const cta = extractCta(html);

      const allTables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
      const dataTables = allTables.filter(isDataTable);

      const comparisonTables = dataTables.map(tableHtml => {
        const rows = parseHtmlTableToArrays(tableHtml);
        const titleText = rows.length > 0 && rows[0].length === 1
          ? rows[0][0]
          : '';
        const startRow = (rows.length > 0 && rows[0].length === 1) ? 1 : 0;
        const dataRows = rows.slice(startRow);
        const headers = dataRows.length > 0 ? dataRows[0] : [];
        const bodyRows = dataRows.slice(1);

        return {
          title: titleText,
          headers,
          rows: bodyRows
        };
      }).filter(t => t.headers.length >= 2);

      const bodySections = extractBodySections(html, comparisonTables);

      const comparison = {
        id,
        slug: meta.slug || topic.replace(/_/g, '-'),
        topic,
        year: topic.match(/(\d{4})/)?.[1] || '2025',
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').trim(),
        reviewedBy: (header.reviewedBy || '').trim(),
        badges,
        directAnswer,
        comparisonTables,
        bodySections,
        faqs,
        relatedPages,
        cta,
        author
      };

      comparisons.push(comparison);

      if ((i + 1) % 30 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }
    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${comparisons.length} comparison pages successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  const slugMap = new Map();
  comparisons.forEach(c => {
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

  const uniqueComparisons = Array.from(slugMap.values());
  uniqueComparisons.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  console.log(`Unique comparisons (after dedup): ${uniqueComparisons.length}`);

  const samples = ['P102', 'P103', 'P199', 'P418', 'P575'];
  samples.forEach(pid => {
    const s = uniqueComparisons.find(c => c.id === pid);
    if (s) {
      console.log(`\nSample ${pid}:`);
      console.log(`  slug: ${s.slug}`);
      console.log(`  topic: ${s.topic}`);
      console.log(`  title: ${s.title.substring(0, 80)}`);
      console.log(`  badges: ${s.badges.length} items`);
      console.log(`  comparisonTables: ${s.comparisonTables.length}`);
      s.comparisonTables.forEach((t, idx) => {
        console.log(`    [${idx}] "${t.title.substring(0, 50)}" — ${t.headers.length} cols × ${t.rows.length} rows`);
      });
      console.log(`  bodySections: ${s.bodySections.length}`);
      console.log(`  faqs: ${s.faqs.length}`);
      console.log(`  relatedPages: ${s.relatedPages.length}`);
    } else {
      console.log(`\nSample ${pid}: NOT FOUND`);
    }
  });

  const output = `/**
 * Comparison Pages Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueComparisons.length}
 * Extraction: content-based (dynamic table structures)
 */

export const comparisons = ${JSON.stringify(uniqueComparisons, null, 2)};

// Lightweight listing data for cards/listings
export const comparisonListings = comparisons.map(
  ({ id, slug, topic, title, metaDesc, badges, year }) => ({ id, slug, topic, title, metaDesc, badges: badges.slice(0, 3), year })
);

// Get single comparison by slug
export function getComparisonBySlug(slug) {
  return comparisons.find(c => c.slug === slug) || null;
}

// Get related comparisons by topic similarity
export function getRelatedComparisons(slug, limit = 4) {
  const current = getComparisonBySlug(slug);
  if (!current) return [];

  const keywords = current.slug.replace(/-/g, ' ').split(' ');
  const scored = comparisons
    .filter(c => c.slug !== slug)
    .map(c => {
      const cKeywords = c.slug.replace(/-/g, ' ').split(' ');
      const score = keywords.filter(k => cKeywords.some(ck => ck.includes(k) || k.includes(ck))).length;
      return { ...c, score };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length < limit) {
    const others = comparisons.filter(
      c => c.slug !== slug && !scored.find(s => s.slug === c.slug)
    );
    scored.push(...others.slice(0, limit - scored.length));
  }

  return scored.slice(0, limit).map(
    ({ id, slug, topic, title, metaDesc }) => ({ id, slug, topic, title, metaDesc })
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

  return { total: files.length, unique: uniqueComparisons.length, errors };
}

convertComparisons()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique comparisons: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
