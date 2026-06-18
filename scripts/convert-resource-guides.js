/**
 * Conversion Script: Resource Guides DOCX → Data File
 *
 * Extracts resource guide content from 83 DOCX files in Resource-Guide folder.
 * Follows the salary-guides pattern: content-based table parsing, FAQ extraction,
 * related pages, author box, CTA.
 *
 * Usage: node scripts/convert-resource-guides.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const RESOURCE_GUIDES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Resource-Guide');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'resource-guides.js');

// ─── Helpers ────────────────────────────────────────────────────────────────

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

function findTable(tables, regex) {
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]);
    if (regex.test(text)) {
      return { text, raw: tables[i], index: i };
    }
  }
  return null;
}

function getTablePosition(html, tableRaw) {
  const idx = html.indexOf(tableRaw);
  if (idx === -1) return null;
  return { start: idx, end: idx + tableRaw.length };
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

function parseFilename(filename) {
  const pNumberMatch = filename.match(/P(\d+)/);
  const id = pNumberMatch ? `P${pNumberMatch[1]}` : '';
  let rest = filename.replace(/^ClickMasters_P\d+_/, '');
  rest = rest.replace(/\.docx$/i, '');
  rest = rest.replace(/^resource_?/i, '');
  rest = rest.replace(/_guide_uk$/i, '');
  rest = rest.replace(/_uk$/i, '');
  return { id, slug: rest.toLowerCase().replace(/_/g, '-') };
}

function extractBadges(tables) {
  for (const table of tables) {
    const text = stripHtml(table);
    if ((text.includes('💷') || text.includes('📋') || text.includes('🏢') || text.includes('📊') ||
         text.includes('🔒') || text.includes('⚖️') || text.includes('🇬🇧') || text.includes('💻') ||
         text.includes('🧠') || text.includes('☁️') || text.includes('🛡️') || text.includes('🤖') ||
         text.includes('IR35') || text.includes('UK Market') || text.includes('GBP') ||
         text.includes('Free Consultation') || text.includes('Salary') || text.includes('Team')) &&
        !text.includes('Direct Answer') &&
        !text.includes('Salary by') &&
        !text.includes('Related Pages') &&
        text.length < 300) {
      const tdMatches = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      const badges = tdMatches.map(td => stripHtml(td)).filter(t => t.length > 0 && t.length < 80);
      if (badges.length > 0) return badges;
    }
  }
  return [];
}

function extractDirectAnswer(tables) {
  const t = findTable(tables, /Direct Answer:/i);
  if (t) return stripHtml(t.text.replace(/Direct Answer:/i, '').trim());
  return '';
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

function extractRelatedPages(html, tables) {
  const t = findTable(tables, /Related Pages/i);
  if (!t) return [];
  const pos = getTablePosition(html, t.raw);
  if (!pos) return [];
  let nextTableStart = -1;
  for (const table of tables) {
    const tablePos = getTablePosition(html, table);
    if (tablePos && tablePos.start > pos.end) { nextTableStart = tablePos.start; break; }
  }
  const chunk = nextTableStart !== -1 ? html.substring(pos.end, nextTableStart) : html.substring(pos.end);
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

function extractCta(html, tables) {
  const ctaPatterns = /Free Consultation|Get a Free|Get a Free Estimate|Book a|Contact Us|clickmasterssoftwaredevelopmentcompany\.co\.uk\/contact/i;
  for (let i = tables.length - 1; i >= 0; i--) {
    const text = stripHtml(tables[i]);
    if (ctaPatterns.test(text) && text.length < 300 && !/META TITLE/i.test(text) && !/Last updated/i.test(text)) {
      return text;
    }
  }
  return '';
}

function extractAuthor(html, tables) {
  const authorTable = findTable(tables, /AUTHOR/);
  if (!authorTable) return '';
  const tdMatches = authorTable.raw.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
  if (tdMatches.length >= 2) {
    const name = stripHtml(tdMatches[1]);
    const desc = tdMatches.length >= 3 ? stripHtml(tdMatches[2]) : '';
    return desc ? `${name} — ${desc}` : name;
  }
  if (tdMatches.length === 1) {
    const text = stripHtml(tdMatches[0]);
    return text.replace(/^[^]*\|\s*/, '');
  }
  return '';
}

function isTitleTable(tableHtml, tableText) {
  // A title table has exactly 1 row, no <th>, and short text content
  // Pattern 1: 1 cell with short text
  // Pattern 2: 2 cells where first is empty and second has short text (e.g., "<td></td><td><p><strong>Title</strong></p></td>")
  const hasTh = /<th/i.test(tableHtml);
  if (hasTh) return false;
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  if (trMatches.length !== 1) return false;
  const tdMatches = trMatches[0].match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
  if (tdMatches.length === 0) return false;

  if (tdMatches.length === 1) {
    const cellText = stripHtml(tdMatches[0]);
    return cellText.length > 2 && cellText.length < 120;
  }

  if (tdMatches.length === 2) {
    const firstCell = stripHtml(tdMatches[0]);
    const secondCell = stripHtml(tdMatches[1]);
    // First cell empty, second cell has short title text
    if (firstCell.length === 0 && secondCell.length > 2 && secondCell.length < 120) return true;
  }

  return false;
}

function isDataTable(tableHtml) {
  // A data table has <th> elements or multiple rows
  if (/<th/i.test(tableHtml)) return true;
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  return trMatches.length > 1;
}

function isStandaloneParagraph(tableHtml, tableText) {
  // A single-cell, single-row table with longer text (not a title, not a badge)
  const trMatches = tableHtml.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
  if (trMatches.length !== 1) return false;
  const tdMatches = trMatches[0].match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
  if (tdMatches.length !== 1) return false;
  const cellText = stripHtml(tdMatches[0]);
  return cellText.length >= 120;
}

/**
 * Extract paragraphs from raw HTML gap content between tables.
 * Handles: <p>text</p> → one paragraph per <p>
 *          <ul><li>...</li></ul> → one paragraph per <li>
 *          Mixed content → each block element becomes a paragraph.
 *          Checklist items (✅/✓) in a single block → split into individual items.
 * Filters out: FAQ Q:/A: lines, header artifacts ("FAQs", "Related Pages"),
 *              related page link lines ("Title: /slug/").
 */
function extractParagraphsFromHtml(rawHtml) {
  const trimmed = rawHtml.trim();
  if (!trimmed) return [];

  const paragraphs = [];

  // First, extract <li> items from <ul> blocks
  const ulBlocks = trimmed.match(/<ul[^>]*>[\s\S]*?<\/ul>/gi) || [];
  const withoutUl = trimmed;
  for (const ul of ulBlocks) {
    const liMatches = ul.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
    for (const li of liMatches) {
      const text = stripHtml(li).trim();
      if (text.length > 0) paragraphs.push(text);
    }
  }

  // Remove <ul> blocks and extract remaining <p> content
  let remaining = withoutUl;
  for (const ul of ulBlocks) {
    remaining = remaining.replace(ul, '');
  }
  const pMatches = remaining.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  for (const p of pMatches) {
    const text = stripHtml(p).trim();
    if (text.length > 0) paragraphs.push(text);
  }

  // If no structured elements found, treat the whole thing as text
  if (paragraphs.length === 0) {
    const text = stripHtml(trimmed).trim();
    if (text.length > 0) paragraphs.push(text);
  }

  // Split paragraphs that contain multiple checklist items (✅ or ✓) into individual items
  const splitParagraphs = [];
  for (const para of paragraphs) {
    if (para.includes('✅') || para.includes('✓')) {
      // Split on checkmark boundary — each checkmark starts a new item
      const parts = para.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0);
      splitParagraphs.push(...parts);
    } else {
      splitParagraphs.push(para);
    }
  }

  // Filter out structural artifacts, FAQ lines, and related page links
  return splitParagraphs.filter(p => {
    const t = p.trim();
    // Remove header artifacts
    if (t === 'FAQs' || t === 'FAQ' || t === 'Related Pages' || t === 'Related Pages:') return false;
    // Remove FAQ Q:/A: lines (handled by extractFaqs())
    if (/^Q:\s*.+/i.test(t)) return false;
    if (/^A:\s*.+/i.test(t)) return false;
    // Remove related page link lines (e.g. "Custom Software Development UK: /custom-software-development/")
    if (/^[A-Z][^:]+:\s*\/[a-z0-9\-]+\/?$/.test(t)) return false;
    return true;
  });
}

function extractContentSections(html, tables) {
  const sections = [];
  let currentSection = null;

  // Find position after direct answer table
  const daTable = findTable(tables, /Direct Answer:/i);
  const daEnd = daTable ? getTablePosition(html, daTable.raw).end : 0;

  // Find position before FAQ table
  const faqTable = findTable(tables, /FAQs/i);
  const faqStart = faqTable ? getTablePosition(html, faqTable.raw).start : html.length;

  // Build ordered list of tables with their positions between DA and FAQ
  const relevantTables = [];
  for (const table of tables) {
    const pos = getTablePosition(html, table);
    if (!pos) continue;
    if (pos.start < daEnd || pos.start >= faqStart) continue;
    const text = stripHtml(table);

    // Skip known non-content tables
    if (/META TITLE/i.test(text)) continue;
    if (/Last updated/i.test(text)) continue;
    if (/Direct Answer/i.test(text)) continue;
    if (/Related Pages/i.test(text)) continue;
    if (/AUTHOR/i.test(text)) continue;
    if (/JSON-LD/i.test(text) || /Article\s*[+|]\s*FAQ/i.test(text) || /^\s*Article\s*[+|]/i.test(text)) continue;
    if (/Free Consultation|Get a Free|Book a|clickmasterssoftwaredevelopmentcompany\.co\.uk\/contact/i.test(text) && text.length < 300) continue;

    relevantTables.push({ table, pos, text });
  }

  // Sort by position in HTML
  relevantTables.sort((a, b) => a.pos.start - b.pos.start);

  for (let i = 0; i < relevantTables.length; i++) {
    const { table, pos, text } = relevantTables[i];

    if (isTitleTable(table, text)) {
      // Extract gap text between previous table and this title table
      const prevEnd = i > 0 ? relevantTables[i - 1].pos.end : daEnd;
      const gapHtml = html.substring(prevEnd, pos.start);
      const gapParagraphs = extractParagraphsFromHtml(gapHtml);

      // For 2-cell title tables (empty first cell), get text from second cell
      let titleText = stripHtml(table);
      const tdMatches = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
      if (tdMatches.length === 2 && stripHtml(tdMatches[0]).length === 0) {
        titleText = stripHtml(tdMatches[1]);
      }

      // If there's an active section, attach gap paragraphs to it BEFORE closing
      if (currentSection) {
        if (currentSection.table) {
          // Current section already has a table — push it
          sections.push(currentSection);
          // Only create a new gap section if there's actual gap content
          if (gapParagraphs.length > 0) {
            currentSection = {
              title: '',
              paragraphs: gapParagraphs,
              table: null
            };
          } else {
            currentSection = null;
          }
        } else {
          currentSection.paragraphs.push(...gapParagraphs);
        }
      }

      // Start new section with this title
      if (currentSection) sections.push(currentSection);
      currentSection = {
        title: titleText,
        paragraphs: [],
        table: null
      };
    } else if (isDataTable(table)) {
      const parsed = parseHtmlTable(table);
      if (parsed.length >= 2) {
        if (currentSection) {
          // If current section already has a table, push it and start new
          if (currentSection.table) {
            sections.push(currentSection);
            currentSection = {
              title: '',
              paragraphs: [],
              table: { headers: parsed[0], rows: parsed.slice(1) }
            };
          } else {
            currentSection.table = {
              headers: parsed[0],
              rows: parsed.slice(1)
            };
          }
        } else {
          // Standalone data table before any title
          currentSection = {
            title: '',
            paragraphs: [],
            table: { headers: parsed[0], rows: parsed.slice(1) }
          };
        }
      }
    } else if (isStandaloneParagraph(table, text)) {
      // Standalone paragraph table — add as paragraph to current section or create new
      // Split checklist items (✅ or ✓) into individual paragraphs
      const paras = (text.includes('✅') || text.includes('✓'))
        ? text.split(/(?=[✅✓])/).map(s => s.trim()).filter(s => s.length > 0)
        : [text];
      if (currentSection) {
        currentSection.paragraphs.push(...paras);
      } else {
        currentSection = {
          title: '',
          paragraphs: [...paras],
          table: null
        };
      }
    }
  }

  if (currentSection) sections.push(currentSection);

  // Extract trailing gap: content between last relevant table and the next
  // non-content table (Related Pages, AUTHOR, CTA, Article, FAQ, etc.)
  if (relevantTables.length > 0) {
    const lastTable = relevantTables[relevantTables.length - 1];
    // Find the next table boundary after the last relevant table
    // Stop at FAQ, Related Pages, AUTHOR, CTA, or Article tables
    let boundary = faqStart;
    for (const table of tables) {
      const tablePos = getTablePosition(html, table);
      if (!tablePos || tablePos.start <= lastTable.pos.end) continue;
      const text = stripHtml(table);
      if (/Related Pages/i.test(text) || /AUTHOR/i.test(text) ||
          /Free Consultation|Get a Free|Book a|clickmasterssoftwaredevelopmentcompany\.co\.uk\/contact/i.test(text) ||
          /Article\s*[+|]/i.test(text) || /JSON-LD/i.test(text)) {
        boundary = tablePos.start;
        break;
      }
    }
    if (lastTable.pos.end < boundary) {
      const trailingChunk = html.substring(lastTable.pos.end, boundary);
      const trailingParagraphs = extractParagraphsFromHtml(trailingChunk);
      if (trailingParagraphs.length > 0 && sections.length > 0) {
        sections[sections.length - 1].paragraphs.push(...trailingParagraphs);
      }
    }
  }

  // Extract intro text (paragraphs between DA and first content table)
  if (relevantTables.length > 0 && sections.length > 0) {
    const firstTableStart = relevantTables[0].pos.start;
    if (firstTableStart > daEnd) {
      const introChunk = html.substring(daEnd, firstTableStart);
      const introParagraphs = extractParagraphsFromHtml(introChunk);
      if (introParagraphs.length > 0) {
        sections[0].paragraphs.unshift(...introParagraphs);
      }
    }
  }

  return sections;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function convertResourceGuides() {
  console.log('Starting resource guides conversion...\n');

  const files = fs.readdirSync(RESOURCE_GUIDES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} resource guide files\n`);

  const resourceGuides = [];
  const errors = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(RESOURCE_GUIDES_DIR, file);

    try {
      const { id, slug: filenameSlug } = parseFilename(file);
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const badges = extractBadges(tables);
      const directAnswer = extractDirectAnswer(tables);
      const faqs = extractFaqs(html);
      const relatedPages = extractRelatedPages(html, tables);
      const cta = extractCta(html, tables);
      const author = extractAuthor(html, tables);
      const contentSections = extractContentSections(html, tables);

      // Clean double pound signs
      const cleanDA = directAnswer.replace(/££/g, '£');
      const cleanCta = cta.replace(/££/g, '£');
      const cleanBadges = badges.map(b => b.replace(/££/g, '£'));

      const resourceGuide = {
        id,
        slug: meta.slug ? meta.slug.replace(/^\//, '').replace(/\/$/, '') : filenameSlug,
        title: title || meta.metaTitle || '',
        metaTitle: meta.metaTitle || '',
        metaDesc: meta.metaDesc || '',
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: (header.writtenBy || '').trim(),
        reviewedBy: (header.reviewedBy || '').trim(),
        badges: cleanBadges,
        directAnswer: cleanDA,
        contentSections,
        faqs,
        relatedPages,
        cta: cleanCta,
        author
      };

      resourceGuides.push(resourceGuide);

      if ((i + 1) % 20 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }
    } catch (err) {
      errors.push({ file, error: err.message });
      console.error(`  Error processing ${file}: ${err.message}`);
    }
  }

  console.log(`\nProcessed ${resourceGuides.length} resource guides successfully`);
  if (errors.length > 0) {
    console.log(`Errors: ${errors.length}`);
    errors.forEach(e => console.error(`  - ${e.file}: ${e.error}`));
  }

  // Deduplicate by slug — keep lowest P_Number
  const slugMap = new Map();
  resourceGuides.forEach(rg => {
    if (!rg.slug) return;
    const existing = slugMap.get(rg.slug);
    if (!existing) {
      slugMap.set(rg.slug, rg);
    } else {
      const existingNum = parseInt(existing.id.replace('P', ''));
      const currentNum = parseInt(rg.id.replace('P', ''));
      if (currentNum < existingNum) slugMap.set(rg.slug, rg);
    }
  });

  const uniqueGuides = Array.from(slugMap.values());
  uniqueGuides.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  console.log(`Unique resource guides (after dedup): ${uniqueGuides.length}`);

  // Log samples
  uniqueGuides.slice(0, 3).forEach(rg => {
    console.log(`\nSample ${rg.id}:`);
    console.log(`  slug: ${rg.slug}`);
    console.log(`  title: ${rg.title.substring(0, 70)}`);
    console.log(`  badges: ${rg.badges.length}`);
    console.log(`  sections: ${rg.contentSections.length}`);
    console.log(`  faqs: ${rg.faqs.length}`);
    console.log(`  relatedPages: ${rg.relatedPages.length}`);
    console.log(`  author: ${rg.author ? rg.author.substring(0, 40) : 'none'}`);
    console.log(`  cta: ${rg.cta ? rg.cta.substring(0, 50) : 'none'}`);
  });

  const output = `/**
 * Resource Guides Data
 * Generated from ${files.length} DOCX files
 * Unique entries: ${uniqueGuides.length}
 * Extraction: content-based (dynamic table structures)
 */

export const resourceGuides = ${JSON.stringify(uniqueGuides, null, 2)};

// Lightweight listing data for cards/listings
export const resourceGuideListings = resourceGuides.map(
  ({ id, slug, title, metaDesc, lastUpdated, readingTime }) =>
    ({ id, slug, title, metaDesc, lastUpdated, readingTime })
);

// Get single resource guide by slug
export function getResourceGuideBySlug(slug) {
  return resourceGuides.find(rg => rg.slug === slug) || null;
}

// Get related resource guides by slug
export function getRelatedResourceGuides(slug, limit = 4) {
  const current = getResourceGuideBySlug(slug);
  if (!current) return [];
  const related = resourceGuides.filter(rg => rg.slug !== slug);
  if (related.length < limit) {
    const others = resourceGuides.filter(
      rg => rg.slug !== slug && !related.some(r => r.slug === rg.slug)
    );
    related.push(...others);
  }
  return related.slice(0, limit).map(
    ({ id, slug, title, metaDesc }) => ({ id, slug, title, metaDesc })
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
  return { total: files.length, unique: uniqueGuides.length, errors };
}

convertResourceGuides()
  .then(result => {
    console.log('\n=== CONVERSION COMPLETE ===');
    console.log(`Total files: ${result.total}`);
    console.log(`Unique resource guides: ${result.unique}`);
    console.log(`Errors: ${result.errors.length}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Conversion failed:', err);
    process.exit(1);
  });
