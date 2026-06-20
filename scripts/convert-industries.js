/**
 * Conversion Script: Industry+Service Combo DOCX → Data File
 *
 * Extracts industry+service content from 202 DOCX files in Industries/ folder.
 *
 * Document structure (from analysis):
 * - Table 1: META TITLE, META DESC, SLUG
 * - Table 2: Last updated, Reading time, Written by, Reviewed by
 * - Text: Breadcrumb + H1
 * - Table 3: Badges (multiple <td> cells with <strong>)
 * - Table 4: Direct Answer
 * - Then alternating: [heading table] [body text] [heading table] [body text] ...
 *   - Heading tables: exactly 1 <p> tag with <strong> text, 2 <td>s (one empty)
 *   - Body text: <p> tags between tables (may contain <strong> bold-led patterns)
 * - Content tables (multi-row, multi-<p>): Architecture details, process phases
 *   - These have <td> with <strong> sub-heading + <p> items
 * - Pricing table: <thead> with Type/Scope/Price or Service Type/Description/Price
 * - FAQs heading table + FAQ body text (Q:/A: pairs)
 * - Related Pages heading + related links text
 * - Author table + CTA table + JSON-LD table
 *
 * Usage: node scripts/convert-industries.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const INDUSTRIES_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Industries');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'industries.js');

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
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
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

function splitTables(html) {
  const tables = [];
  const regex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    tables.push(match[0]);
  }
  return tables;
}

function countTags(html, tag) {
  return (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
}

/**
 * Split HTML into alternating parts: [text, table, text, table, ...]
 */
function splitByTables(html) {
  const parts = [];
  const regex = /(<table[\s\S]*?<\/table>)/gi;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', html: html.substring(lastIndex, match.index) });
    }
    parts.push({ type: 'table', html: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) {
    parts.push({ type: 'text', html: html.substring(lastIndex) });
  }
  return parts;
}

// ─── Table Classification ─────────────────────────────────────────────────

function isMetaTable(tableHtml) {
  return /META TITLE:/i.test(tableHtml);
}

function isHeaderTable(tableHtml) {
  return /Last updated:/i.test(stripHtml(tableHtml));
}

function isBadgeTable(tableHtml) {
  const text = stripHtml(tableHtml);
  const pCount = countTags(tableHtml, 'p');
  const tdCount = countTags(tableHtml, 'td');
  // Badge table: multiple <td> cells (3-8), each with <strong> text, short total length
  // May or may not have emoji — some files use text-only badges
  const hasEmoji = /[💷🔒⚖️🇬🇧🛒📱🏦🔌💳⚡📋💡☁️]/.test(text);
  const hasComplianceKeywords = /GDPR|IR35|FCA|PCI|DTAC|RICS|IEC|MHRA|WCAG|Cyber Essentials/i.test(text);
  const hasCurrency = /[£$€]|GBP|USD|EUR/i.test(text);
  return tdCount >= 3 && pCount >= 3 && text.length < 400 &&
         (hasEmoji || hasComplianceKeywords || hasCurrency) &&
         !/META TITLE/i.test(text) && !/Last updated/i.test(text) &&
         !/Direct Answer/i.test(text);
}

function isDirectAnswerTable(tableHtml) {
  return /Direct Answer:/i.test(stripHtml(tableHtml));
}

/**
 * Heading-only table: exactly 1 <p> tag (which contains <strong>), 2 <td>s (one empty, one with heading)
 * Must NOT be a pricing/FAQ/related/Author heading.
 * Examples: "What Is SaaS Development?", "Multi-Tenancy — The Architectural Foundation"
 */
function isHeadingOnlyTable(tableHtml) {
  const pCount = countTags(tableHtml, 'p');
  if (pCount !== 1) return false;
  const text = stripHtml(tableHtml);
  if (text.length > 200) return false;
  // The single <p> must contain <strong>
  const pMatch = tableHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (!pMatch || !/<strong>/i.test(pMatch[1])) return false;
  // Exclude pricing/FAQ/related/author headings
  if (/💷.*Pricing|Pricing/i.test(text) && text.length < 60) return false;
  if (/^FAQs$/i.test(text) || /^Frequently Asked Questions/i.test(text)) return false;
  if (/^Related Pages$/i.test(text) || /^Related Guides/i.test(text)) return false;
  if (/AUTHOR/i.test(text) || /👤/.test(text)) return false;
  if (/JSON-LD/i.test(text) || /Service \+ FAQPage/i.test(text)) return false;
  return true;
}

/**
 * Content table: multiple <p> tags, structured content (not heading, not pricing)
 * Examples:
 * - Process phase tables: 2 <td>s, 3 <p>s (number, heading, body)
 * - Architecture details: multi-row with <strong> sub-headings
 * - CTA tables: 1 <td>, 3 <p>s
 */
function isContentTable(tableHtml) {
  const pCount = countTags(tableHtml, 'p');
  const hasThead = /<thead/i.test(tableHtml);
  const text = stripHtml(tableHtml);
  if (pCount <= 1) return false;
  if (hasThead) return false; // pricing tables have thead
  if (text.length < 50) return false;
  // Exclude known non-content tables
  if (/Direct Answer:/i.test(text)) return false;
  if (/META TITLE:/i.test(text)) return false;
  if (/Last updated:/i.test(text)) return false;
  if (/^Compliance:/i.test(text) && text.length < 500) return false;
  if (/Related Pages/i.test(text) && text.length < 30) return false;
  if (/AUTHOR/i.test(text) || /👤/.test(text)) return false;
  if (/JSON-LD/i.test(text) || /Service \+ FAQPage/i.test(text)) return false;
  if (/^FAQs$/i.test(text) || /Frequently Asked Questions/i.test(text)) return false;
  return true;
}

/**
 * Pricing table: has <thead> with price-related headers
 */
function isPricingTable(tableHtml) {
  const text = stripHtml(tableHtml).toLowerCase();
  const hasThead = /<thead/i.test(tableHtml);
  return hasThead && (text.includes('price') || text.includes('starting price'));
}

/**
 * Compliance table: short text starting with "Compliance:"
 */
function isComplianceTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return /^Compliance:/i.test(text) || (/Compliance:/i.test(text) && text.length < 500);
}

/**
 * FAQs heading table: just "FAQs" or "Frequently Asked Questions"
 */
function isFaqsHeadingTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return (/^FAQs$/i.test(text) || /Frequently Asked Questions/i.test(text)) && text.length < 80;
}

/**
 * Related Pages heading table
 */
function isRelatedPagesTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return /^Related Pages$/i.test(text) || /^Related Guides/i.test(text);
}

/**
 * Author table
 */
function isAuthorTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return /AUTHOR/i.test(text) || /👤/.test(text);
}

/**
 * CTA/Consultation table
 */
function isCtaTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return /Free Consultation/i.test(text) || /Book a free/i.test(text) ||
         /clickmasterssoftwaredevelopmentcompany\.co\.uk\/contact/i.test(text);
}

/**
 * JSON-LD / schema table
 */
function isJsonLdTable(tableHtml) {
  const text = stripHtml(tableHtml);
  return /JSON-LD/i.test(text) || /Service \+ FAQPage/i.test(text) || /Target KW/i.test(text);
}

// ─── Extraction Functions ────────────────────────────────────────────────

function extractMeta(tables) {
  const meta = {};
  for (const table of tables) {
    if (!isMetaTable(table)) continue;
    const text = stripHtml(table);
    const titleMatch = text.match(/META TITLE:\s*([\s\S]*?)(?=META DESC:|$)/i);
    if (titleMatch) meta.metaTitle = titleMatch[1].trim();
    const descMatch = text.match(/META DESC:\s*([\s\S]*?)(?=SLUG:|$)/i);
    if (descMatch) meta.metaDesc = descMatch[1].trim();
    const slugMatch = text.match(/SLUG:\s*(\/[a-z0-9\-\/]+)/i);
    if (slugMatch) meta.slug = slugMatch[1].trim();
    break;
  }
  return meta;
}

function extractHeader(tables) {
  const header = {};
  for (const table of tables) {
    if (!isHeaderTable(table)) continue;
    const text = stripHtml(table);
    const lastUpdatedMatch = text.match(/Last updated:\s*([^|]+?)(?=\s*\||$)/i);
    if (lastUpdatedMatch) header.lastUpdated = lastUpdatedMatch[1].trim();
    const readingTimeMatch = text.match(/Reading time:\s*(\d+)\s*min/i);
    if (readingTimeMatch) header.readingTime = parseInt(readingTimeMatch[1]);
    const writtenByMatch = text.match(/Written by:\s*([^|]+?)(?=\s*\||$)/i);
    if (writtenByMatch) header.writtenBy = writtenByMatch[1].trim();
    const reviewedByMatch = text.match(/Reviewed by:\s*([\s\S]*?)(?=\s*\||$)/i);
    if (reviewedByMatch) header.reviewedBy = reviewedByMatch[1].trim().replace(/Home.*$/i, '').trim();
    break;
  }
  return header;
}

function extractTitle(html) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) return stripHtml(h1Match[1]);
  return '';
}

function extractBadges(tables) {
  for (const table of tables) {
    if (!isBadgeTable(table)) continue;
    const tdMatches = table.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];
    const badges = tdMatches.map(td => stripHtml(td)).filter(t => t.length > 0 && t.length < 80);
    if (badges.length >= 2) return badges;
  }
  return [];
}

function extractDirectAnswer(tables) {
  for (const table of tables) {
    if (isDirectAnswerTable(table)) {
      return stripHtml(table).replace(/Direct Answer:/i, '').trim();
    }
  }
  return '';
}

/**
 * Extract content sections from the HTML.
 *
 * Strategy:
 * 1. Split HTML into alternating text/table parts
 * 2. After Direct Answer, look for heading-only tables
 * 3. Body content is either:
 *    a. The text between a heading table and the next table
 *    b. A content table (multi-row structured content like architecture details)
 * 4. Pricing tables are skipped but content AFTER pricing is still captured
 * 5. Stop at FAQs, related pages, author sections
 */
function extractSections(html) {
  const parts = splitByTables(html);
  const sections = [];

  let foundDirectAnswer = false;
  let stopCollecting = false;
  let skipPricing = false;
  let currentHeading = null;
  let currentParagraphs = [];

  const flushSection = () => {
    if (currentHeading) {
      sections.push({
        heading: currentHeading,
        paragraphs: currentParagraphs.length > 0 ? currentParagraphs : [],
      });
      currentHeading = null;
      currentParagraphs = [];
    }
  };

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (part.type === 'table') {
      const text = stripHtml(part.html);

      // State tracking
      if (isDirectAnswerTable(part.html)) {
        flushSection();
        foundDirectAnswer = true;
        continue;
      }
      if (!foundDirectAnswer) continue;

      // Hard stop conditions (FAQs, related, author, CTA, JSON-LD)
      if (isFaqsHeadingTable(part.html) || isRelatedPagesTable(part.html) ||
          isAuthorTable(part.html) || isCtaTable(part.html) || isJsonLdTable(part.html)) {
        flushSection();
        stopCollecting = true;
        continue;
      }
      if (stopCollecting) continue;

      // Pricing table → skip but don't stop collecting
      if (isPricingTable(part.html)) {
        flushSection();
        skipPricing = true;
        continue;
      }

      // Pricing heading table (💷 Pricing) → skip
      if (isHeadingOnlyTable(part.html) && /💷.*Pricing|Pricing/i.test(text)) {
        flushSection();
        skipPricing = true;
        continue;
      }

      // After pricing table, resume normal collection
      if (skipPricing && !isPricingTable(part.html)) {
        skipPricing = false;
        // Don't continue — process this table normally below
      }

      // Compliance table → add as a section
      if (isComplianceTable(part.html)) {
        flushSection();
        const items = text.replace(/Compliance:/i, '').split(/[,|]/).map(s => s.trim()).filter(Boolean);
        sections.push({
          heading: 'Compliance',
          paragraphs: items.map(item => ({ bold: '', text: item })),
        });
        continue;
      }

      // Heading-only table → start new section
      if (isHeadingOnlyTable(part.html)) {
        flushSection();
        currentHeading = text;
        continue;
      }

      // Content table (multi-row structured content) → add as section body
      if (isContentTable(part.html)) {
        // If no current heading, use a generic one from context
        if (!currentHeading) {
          currentHeading = '';
        }
        // Parse the content table into paragraphs
        const tableParagraphs = parseContentTable(part.html);
        currentParagraphs.push(...tableParagraphs);
        continue;
      }

      // Single-<p> tables that aren't headings (like "UK GDPR Consideration", "R&D Tax Credits")
      // Treat as content if they have meaningful text
      const pCount = countTags(part.html, 'p');
      if (pCount === 1 && text.length > 20 && text.length < 300 &&
          !/META TITLE/i.test(text) && !/Last updated/i.test(text)) {
        if (!currentHeading) currentHeading = '';
        currentParagraphs.push({ bold: '', text });
        continue;
      }

      // Any other table we don't recognize → skip
      continue;

    } else {
      // Between-table text
      if (!foundDirectAnswer || stopCollecting || skipPricing) continue;

      const text = stripHtml(part.html);
      if (text.length < 10) continue;

      // Skip breadcrumb lines
      if (/^Home\s*[›>]/.test(text) && !currentHeading) continue;

      // Parse paragraphs from the text
      const paragraphs = parseTextParagraphs(part.html);
      currentParagraphs.push(...paragraphs);
    }
  }

  flushSection();
  return sections;
}

/**
 * Parse a content table (like architecture details or process phases) into paragraphs.
 *
 * Handles multiple patterns:
 * 1. Process phase: <td><strong>N</strong></td><td><strong>Heading</strong><p>Body</p></td>
 * 2. Architecture row: <td><strong>Sub-heading</strong></td><td><p>Detail</p></td>
 * 3. CTA block: <td><strong>Title</strong><p>Body</p><p>Link</p></td>
 * 4. Simple multi-p: <td><p>Text1</p><p>Text2</p></td>
 */
function parseContentTable(tableHtml) {
  const paragraphs = [];

  // Extract all <td> contents
  const tdMatches = tableHtml.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) || [];

  for (const td of tdMatches) {
    const tdText = stripHtml(td);
    if (tdText.length < 5) continue;

    // Skip pure number cells (phase numbers like "1", "2", etc.)
    const pMatches = td.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    const allPText = pMatches.map(p => stripHtml(p)).join(' ').trim();
    if (/^\d+$/.test(allPText)) continue;

    // Check for bold-led sub-heading pattern
    const strongMatch = td.match(/<strong>([^<]+)<\/strong>/i);
    if (strongMatch) {
      const subHeading = stripHtml(strongMatch[1]);

      // Get all <p> content
      const bodyTexts = [];
      for (const p of pMatches) {
        const pText = stripHtml(p);
        if (pText.length > 3 && pText !== subHeading && pText !== allPText) {
          bodyTexts.push(pText);
        }
      }

      if (bodyTexts.length > 0) {
        // Multiple <p> tags → each becomes a paragraph with the sub-heading as bold
        for (const bodyText of bodyTexts) {
          paragraphs.push({ bold: subHeading, text: bodyText });
        }
      } else {
        // No separate <p> body — use remaining text
        const remaining = tdText.replace(subHeading, '').trim();
        if (remaining.length > 5) {
          paragraphs.push({ bold: subHeading, text: remaining });
        } else if (subHeading.length > 3) {
          // Just the heading itself
          paragraphs.push({ bold: '', text: subHeading });
        }
      }
    } else {
      // No strong tag — add each <p> as a plain paragraph
      for (const p of pMatches) {
        const pText = stripHtml(p);
        if (pText.length > 5) {
          paragraphs.push({ bold: '', text: pText });
        }
      }
    }
  }

  return paragraphs;
}

/**
 * Parse between-table HTML text into paragraphs.
 */
function parseTextParagraphs(html) {
  const paragraphs = [];
  const pMatches = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];

  for (const p of pMatches) {
    const text = stripHtml(p);
    if (text.length < 5) continue;

    // Check for bold-led pattern: "Bold Title: paragraph text"
    const boldMatch = text.match(/^([^:]{3,80}):\s*(.+)/);
    if (boldMatch && boldMatch[2].length > 10) {
      paragraphs.push({ bold: boldMatch[1].trim(), text: boldMatch[2].trim() });
    } else {
      paragraphs.push({ bold: '', text });
    }
  }

  return paragraphs;
}

function extractCompliance(tables, html) {
  // From compliance table
  for (const table of tables) {
    if (!isComplianceTable(table)) continue;
    const text = stripHtml(table).replace(/Compliance:/i, '');
    const items = text.split(/[,|]/).map(s => s.trim()).filter(Boolean);
    if (items.length > 0) return items;
  }

  // From between-table text after a "Compliance" heading
  const parts = splitByTables(html);
  let foundCompliance = false;
  for (const part of parts) {
    if (part.type === 'table') {
      const text = stripHtml(part.html);
      if (/Compliance/i.test(text) && text.length < 100 && !/Direct Answer/i.test(text)) {
        foundCompliance = true;
        continue;
      }
      if (foundCompliance && !isComplianceTable(part.html)) break;
    }
    if (foundCompliance && part.type === 'text') {
      const text = stripHtml(part.html);
      if (text.length > 10 && text.length < 500) {
        const items = text.split(/[,|]/).map(s => s.trim()).filter(Boolean);
        if (items.length > 0) return items;
      }
    }
  }

  return [];
}

function extractPricing(tables) {
  for (const table of tables) {
    if (!isPricingTable(table)) continue;

    const rows = parseHtmlTable(table);
    const tiers = [];
    let headerFound = false;

    for (const row of rows) {
      const rowText = row.join(' ').toLowerCase();
      if ((rowText.includes('type') && rowText.includes('price')) ||
          (rowText.includes('service type') && rowText.includes('starting price')) ||
          (rowText.includes('service / project type') && rowText.includes('price'))) {
        headerFound = true;
        continue;
      }
      if (headerFound && row.length >= 2) {
        // Handle different column layouts
        if (row.length >= 4) {
          // Service Type | Description/Scope | Timeline | Price
          tiers.push({
            type: row[0] || '',
            scope: row[1] || '',
            price: row[row.length - 2] || row[row.length - 1] || '',
          });
        } else if (row.length >= 3) {
          tiers.push({
            type: row[0] || '',
            scope: row[1] || '',
            price: row[2] || '',
          });
        } else {
          tiers.push({
            type: row[0] || '',
            scope: '',
            price: row[1] || '',
          });
        }
      }
    }
    if (tiers.length > 0) return tiers;
  }
  return [];
}

function extractFaqs(html) {
  const faqs = [];
  const parts = splitByTables(html);
  let inFaqs = false;

  for (const part of parts) {
    if (part.type === 'table' && isFaqsHeadingTable(part.html)) {
      inFaqs = true;
      continue;
    }

    if (inFaqs && part.type === 'text') {
      const text = stripHtml(part.html);
      if (text.length < 5) continue;

      // Stop at related pages or author
      if (/Related Pages/i.test(text) || /Related Guides/i.test(text) ||
          /AUTHOR/i.test(text) || /👤/.test(text)) break;

      // Parse Q:/A: pairs
      // First try: each Q:/A: on its own "line" (split by newlines from <p> tags)
      const pMatches = part.html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
      let currentQuestion = '';

      for (const p of pMatches) {
        const pText = stripHtml(p);
        const qMatch = pText.match(/^Q:\s*(.+)/i);
        if (qMatch) {
          currentQuestion = qMatch[1].trim();
          continue;
        }
        const aMatch = pText.match(/^A:\s*(.+)/i);
        if (aMatch && currentQuestion) {
          faqs.push({ question: currentQuestion, answer: aMatch[1].trim() });
          currentQuestion = '';
        }
      }

      // If no FAQs found via <p> tags, try inline pattern
      if (faqs.length === 0) {
        const qaPattern = /Q:\s*([^Q]+?)\s*A:\s*([^Q]+)/gi;
        let qaMatch;
        while ((qaMatch = qaPattern.exec(text)) !== null) {
          faqs.push({
            question: qaMatch[1].trim(),
            answer: qaMatch[2].trim(),
          });
        }
      }
    }
  }

  return faqs;
}

function parseFilename(filename) {
  const match = filename.match(/^ClickMasters_P(\d+)_(.+?)_(.+)\.docx$/);
  if (match) {
    return {
      id: `P${match[1]}`,
      industry: match[2].toLowerCase(),
      service: match[3].toLowerCase().replace(/_/g, '-'),
    };
  }
  // Fallback for non-standard names (e.g., P100_ecommerce_software_development_uk, P9_SaaS_Development_UK)
  const pMatch = filename.match(/P(\d+)/);
  const id = pMatch ? `P${pMatch[1]}` : '';
  let rest = filename.replace(/^ClickMasters_P\d+_/, '').replace(/\.docx$/i, '').replace(/_uk$/i, '');
  const parts = rest.split('_');
  return {
    id,
    industry: parts[0] ? parts[0].toLowerCase() : '',
    service: parts.slice(1).join('-').toLowerCase() || rest.toLowerCase().replace(/_/g, '-'),
  };
}

// ─── Main Conversion ───────────────────────────────────────────────────────

async function convert() {
  const files = fs.readdirSync(INDUSTRIES_DIR).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} industry+service files\n`);

  const industries = [];
  let errors = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(INDUSTRIES_DIR, file);

    try {
      const result = await mammoth.convertToHtml({ path: filePath });
      const html = result.value;
      const tables = splitTables(html);
      const fileInfo = parseFilename(file);

      const meta = extractMeta(tables);
      const header = extractHeader(tables);
      const title = extractTitle(html);
      const badges = extractBadges(tables);
      const directAnswer = extractDirectAnswer(tables);
      const sections = extractSections(html);
      const compliance = extractCompliance(tables, html);
      const pricingTiers = extractPricing(tables);
      const faqs = extractFaqs(html);

      const entry = {
        id: fileInfo.id,
        slug: meta.slug ? meta.slug.replace(/^\//, '').replace(/\/$/, '') : `${fileInfo.industry}-${fileInfo.service}`,
        industry: fileInfo.industry,
        service: fileInfo.service,
        title: title || meta.metaTitle,
        metaTitle: meta.metaTitle,
        metaDesc: meta.metaDesc,
        lastUpdated: header.lastUpdated || '',
        readingTime: header.readingTime || 0,
        writtenBy: header.writtenBy || '',
        reviewedBy: header.reviewedBy || '',
        badges,
        directAnswer,
        sections,
        compliance,
        pricingTiers,
        faqs,
      };

      industries.push(entry);

      if ((i + 1) % 50 === 0) {
        console.log(`  Processed ${i + 1}/${files.length} files...`);
      }
    } catch (err) {
      console.log(`  ERROR: ${file} — ${err.message}`);
      errors++;
    }
  }

  // Deduplicate by slug (keep lowest P-number)
  const slugMap = new Map();
  for (const entry of industries) {
    const existing = slugMap.get(entry.slug);
    if (!existing || entry.id < existing.id) {
      slugMap.set(entry.slug, entry);
    }
  }
  const unique = Array.from(slugMap.values());

  // Sort by ID
  unique.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', ''));
    const bNum = parseInt(b.id.replace('P', ''));
    return aNum - bNum;
  });

  // ─── Generate Output ────────────────────────────────────────────────────

  const output = `/**
 * Auto-generated by scripts/convert-industries.js
 * ${unique.length} unique industry+service combo pages
 * Generated: ${new Date().toISOString()}
 */

const industries = ${JSON.stringify(unique, null, 2)};

// Lightweight listing data — only fields needed for cards/lists
export const industryListings = industries.map(
  ({ id, slug, industry, service, title, metaDesc, badges }) =>
    ({ id, slug, industry, service, title, metaDesc, badges })
);

// Lookup single entry by slug
export function getIndustryBySlug(slug) {
  return industries.find(i => i.slug === slug) || null;
}

// Get all services for a given industry
export function getIndustriesByCategory(industry) {
  return industries.filter(i => i.industry === industry);
}

// Get unique industries with counts
export function getIndustriesList() {
  const map = {};
  industries.forEach(i => {
    if (!map[i.industry]) map[i.industry] = { industry: i.industry, count: 0, slug: i.industry };
    map[i.industry].count++;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

// Get related services (same industry, different service)
export function getRelatedIndustries(slug, limit = 3) {
  const current = getIndustryBySlug(slug);
  if (!current) return [];
  return industries
    .filter(i => i.slug !== slug && i.industry === current.industry)
    .slice(0, limit);
}

// For generateStaticParams
export function getAllIndustrySlugs() {
  return industries.map(i => i.slug);
}

export { industries };
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');

  console.log(`\n=== CONVERSION COMPLETE ===`);
  console.log(`Total files: ${files.length}`);
  console.log(`Unique entries: ${unique.length}`);
  console.log(`Errors: ${errors}`);
  console.log(`Written to: ${OUTPUT_FILE}`);

  // Print detailed samples
  if (unique.length > 0) {
    for (const idx of [0, Math.floor(unique.length / 2), unique.length - 1]) {
      const sample = unique[idx];
      console.log(`\n--- Sample ${sample.id} (${sample.industry}/${sample.service}) ---`);
      console.log(`  slug: ${sample.slug}`);
      console.log(`  title: ${sample.title.substring(0, 80)}`);
      console.log(`  badges: ${sample.badges.length}`);
      console.log(`  sections: ${sample.sections.length}`);
      for (const s of sample.sections) {
        console.log(`    "${s.heading.substring(0, 60)}" → ${s.paragraphs.length} paras`);
      }
      console.log(`  compliance: ${sample.compliance.length}`);
      console.log(`  pricingTiers: ${sample.pricingTiers.length}`);
      console.log(`  faqs: ${sample.faqs.length}`);
      if (sample.faqs.length > 0) {
        console.log(`    FAQ[0]: "${sample.faqs[0].question.substring(0, 60)}"`);
      }
    }
  }

  // Print industry counts
  const industryCounts = {};
  unique.forEach(i => {
    industryCounts[i.industry] = (industryCounts[i.industry] || 0) + 1;
  });
  console.log(`\nIndustry breakdown:`);
  Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ind, count]) => console.log(`  ${ind}: ${count}`));
}

convert().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
