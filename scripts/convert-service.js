/**
 * Conversion Script: Standalone Service DOCX → Data File
 *
 * Extracts service content from 11 DOCX files in Service/ folder.
 *
 * Document structure (from analysis):
 * - Table 0: META TITLE | META DESC (single td, single p)
 * - Table 1: Last updated | Reading time | Written by | Reviewed by (single td, single p)
 * - Text: Breadcrumb + H1 heading
 * - Table 2: Badges (6 td cells with emoji + text)
 * - Table 3: Direct Answer (single td, single p starting with "Direct Answer:")
 * - Then alternating: [heading table] [body text] ...
 *   - Heading tables: 1 <p> with <strong>, 2 <td>s (one empty)
 *   - Body text: <p> tags between tables (may contain <strong> bold-led patterns)
 * - Pricing heading table (e.g., "💷 API Development Pricing (GBP, 2025)")
 * - Pricing table: <thead> with Service/Project Type | Typical Scope | Timeline | Starting Price
 * - FAQs heading table + FAQ body text (Q:/A: pairs in text between tables)
 * - CTA table (single td, multiple p)
 * - Author table (2 td, 5 p — author info)
 * - JSON-LD Schema table (single td, single p)
 *
 * Usage: node scripts/convert-service.js
 */

const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const SERVICE_DIR = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Service');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'services.js');

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
  const rowRegex = /<tr[\s\S]*?<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const cells = [];
    const cellRegex = /<t[dh][\s\S]*?<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[0])) !== null) {
      cells.push(stripHtml(cellMatch[0]));
    }
    if (cells.length > 0) rows.push(cells);
  }
  return rows;
}

function countTags(html, tag) {
  return (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
}

function splitByTables(html) {
  const parts = [];
  const regex = /(<table[\s\S]*?<\/table>)/gi;
  let lastIndex = 0, match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', html: html.substring(lastIndex, match.index) });
    parts.push({ type: 'table', html: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) parts.push({ type: 'text', html: html.substring(lastIndex) });
  return parts;
}

function extractPNumber(filename) {
  const m = filename.match(/_P(\d+)_/);
  return m ? `P${m[1]}` : null;
}

function extractSlugFromMeta(metaText) {
  const m = metaText.match(/SLUG:\s*(\/[^\s\/]+)\//);
  return m ? m[1].replace(/^\//, '').replace(/\/$/, '') : null;
}

// ─── Table Classification ───────────────────────────────────────────────────

function isMetaTable(tableHtml, text) {
  return /META TITLE:/i.test(text) && /META DESC:/i.test(text);
}

function isHeaderTable(text) {
  return /Last updated:/i.test(text) && /Reading time:/i.test(text);
}

function isBadgeTable(tableHtml, text) {
  // Badge table: multiple single-<p> td cells, each with short text + emoji/keywords
  const rows = parseHtmlTable(tableHtml);
  if (rows.length === 1 && rows[0].length >= 4) {
    const allShort = rows[0].every(cell => cell.length < 60);
    const hasEmoji = /[\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]/u.test(text);
    const hasCompliance = /UK|GDPR|OWASP|Cyber|ISO|PCI|FCA/i.test(text);
    const hasCurrency = /£|\$/i.test(text);
    return allShort && (hasEmoji || hasCompliance || hasCurrency);
  }
  return false;
}

function isDirectAnswerTable(text) {
  return /^Direct Answer:/i.test(text.trim());
}

function isHeadingTable(tableHtml, text) {
  // Heading table: exactly 1 <p> with <strong>, 2 <td>s
  const pCount = countTags(tableHtml, 'p');
  const tdCount = countTags(tableHtml, 'td');
  const hasStrong = /<strong/i.test(tableHtml);
  const hasThead = /<thead/i.test(tableHtml);
  return pCount === 1 && hasStrong && !hasThead && tdCount <= 2 && text.length < 120;
}

function isPricingTable(tableHtml, text) {
  const hasThead = /<thead/i.test(tableHtml);
  const hasPrice = /£|price|cost|pricing|starting/i.test(text);
  return hasThead && hasPrice;
}

function isPricingHeadingTable(text) {
  return /💷.*Pricing/i.test(text) || /pricing.*GBP/i.test(text);
}

function isAuthorTable(tableHtml, text) {
  return /AUTHOR/i.test(text) && /ClickMasters/i.test(text);
}

function isJsonLdTable(text) {
  return /JSON-LD/i.test(text) || /"@type"/i.test(text);
}

function isCtaTable(tableHtml, text) {
  // CTA: single td, multiple p, contains "Free" or "Book" or "consultation"
  const rows = parseHtmlTable(tableHtml);
  if (rows.length === 1 && rows[0].length === 1) {
    return /free|book|consultation|call to action|cta/i.test(text);
  }
  return false;
}

function isRelatedLinksTable(text) {
  return /Related Guides/i.test(text) || /Related Services/i.test(text);
}

function isFaqTable(text) {
  return /Frequently Asked Questions/i.test(text) || /^FAQs$/i.test(text);
}

// ─── Extraction Functions ───────────────────────────────────────────────────

function extractMetaTable(text) {
  const metaTitleMatch = text.match(/META TITLE:\s*(.+?)(?:\s*\|\s*ClickMasters|$)/i);
  const metaDescMatch = text.match(/META DESC:\s*(.+?)(?:\s+SLUG:|$)/i);
  const slugMatch = text.match(/SLUG:\s*(\/[^\s\/]+)\//);
  return {
    metaTitle: metaTitleMatch ? metaTitleMatch[1].trim() : '',
    metaDesc: metaDescMatch ? metaDescMatch[1].trim() : '',
    slug: slugMatch ? slugMatch[1].replace(/^\//, '').replace(/\/$/, '') : null,
  };
}

function extractHeaderTable(text) {
  const dateMatch = text.match(/Last updated:\s*([^|]+)/i);
  const readingMatch = text.match(/Reading time:\s*(\d+)/i);
  const writtenMatch = text.match(/Written by:\s*([^|]+)/i);
  const reviewedMatch = text.match(/Reviewed by:\s*(.+)/i);
  return {
    lastUpdated: dateMatch ? dateMatch[1].trim() : '',
    readingTime: readingMatch ? parseInt(readingMatch[1].trim(), 10) : 0,
    writtenBy: writtenMatch ? writtenMatch[1].trim() : '',
    reviewedBy: reviewedMatch ? reviewedMatch[1].trim() : '',
  };
}

function extractH1FromHtml(html) {
  // The text part contains:
  // <p>Home › Services › <strong>Short Name</strong></p><h1><strong>Full Title — subtitle</strong></h1>
  // We want the H1 content specifically
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    return stripHtml(h1Match[1]).trim();
  }
  // Fallback: extract from stripped text
  const text = stripHtml(html);
  const lines = text.split(/\n/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.includes('—') || line.includes('–')) {
      return line.replace(/^\s*Home\s*[›>]\s*Services\s*[›>]\s*/i, '').trim();
    }
  }
  return lines[lines.length - 1] || '';
}

function extractBadges(tableHtml) {
  const rows = parseHtmlTable(tableHtml);
  if (rows.length === 0) return [];
  // All badges are in the first row
  return rows[0].map(b => b.trim()).filter(b => b.length > 0 && b.length < 60);
}

function extractDirectAnswer(text) {
  return text.replace(/^Direct Answer:\s*/i, '').trim();
}

function extractParagraphsFromText(text) {
  // Parse <p> tags from HTML text
  const paragraphs = [];
  const pRegex = /<p[\s\S]*?<\/p>/gi;
  let match;
  while ((match = pRegex.exec(text)) !== null) {
    const raw = stripHtml(match[0]);
    if (raw.length > 0) paragraphs.push(raw);
  }
  return paragraphs;
}

function parseBoldLedParagraphs(text) {
  // Parse paragraphs that have <strong>Bold Title: </strong> body text pattern
  const paragraphs = extractParagraphsFromText(text);
  return paragraphs.map(p => {
    const boldMatch = p.match(/^([^:]+):\s*(.+)/);
    if (boldMatch && boldMatch[2].length > 10) {
      return { bold: boldMatch[1].trim(), text: boldMatch[2].trim() };
    }
    return { bold: '', text: p };
  }).filter(p => p.text.length > 0);
}

function extractPricingRows(tableHtml) {
  const rows = parseHtmlTable(tableHtml);
  if (rows.length < 2) return [];
  // First row is header
  const header = rows[0].map(h => h.toLowerCase());
  const typeIdx = header.findIndex(h => /service|type|project|plan|tier/i.test(h));
  const scopeIdx = header.findIndex(h => /scope|description|details|what|includes/i.test(h));
  const timelineIdx = header.findIndex(h => /timeline|duration|time|weeks/i.test(h));
  const priceIdx = header.findIndex(h => /price|cost|fee|from|starting|£|\$/i.test(h));

  // If we can't find columns, assume first col is type, last is price
  const hasPrice = priceIdx !== -1;
  const hasType = typeIdx !== -1;

  const pricingTiers = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;
    const tier = {
      type: hasType ? (row[typeIdx] || '') : (row[0] || ''),
      scope: scopeIdx !== -1 ? (row[scopeIdx] || '') : (row.length > 2 ? row[1] : ''),
      timeline: timelineIdx !== -1 ? (row[timelineIdx] || '') : '',
      price: hasPrice ? (row[priceIdx] || '') : (row[row.length - 1] || ''),
    };
    if (tier.type || tier.price) pricingTiers.push(tier);
  }
  return pricingTiers;
}

function extractFaqsFromText(text) {
  const faqs = [];
  // Q:/A: pairs in text
  const qaRegex = /[QA]:\s*/gi;
  const parts = text.split(qaRegex).filter(p => p.trim().length > 0);

  for (let i = 0; i < parts.length - 1; i += 2) {
    const question = parts[i].trim();
    const answer = parts[i + 1] ? parts[i + 1].trim() : '';
    if (question.length > 5 && answer.length > 5) {
      // Clean trailing question text from answer
      const cleanAnswer = answer.replace(/\s+Q:.*$/, '').trim();
      faqs.push({ question, answer: cleanAnswer });
    }
  }
  return faqs;
}

// ─── Main Extraction ────────────────────────────────────────────────────────

function extractService(filePath) {
  const filename = path.basename(filePath);
  const id = extractPNumber(filename);

  const buf = fs.readFileSync(filePath);
  // We need to use mammoth with buffer
  return mammoth.convertToHtml({ buffer: buf }).then(result => {
    const html = result.value;
    const parts = splitByTables(html);

    const service = {
      id,
      slug: '',
      serviceName: '',
      title: '',
      metaTitle: '',
      metaDesc: '',
      lastUpdated: '',
      readingTime: 0,
      writtenBy: '',
      reviewedBy: '',
      badges: [],
      directAnswer: '',
      sections: [],
      pricingTiers: [],
      faqs: [],
    };

    let currentSection = null;
    let skipNonContent = false;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const text = part.type === 'table' ? stripHtml(part.html) : stripHtml(part.html);

      // Table classification
      if (part.type === 'table') {
        if (isMetaTable(part.html, text)) {
          const meta = extractMetaTable(text);
          service.slug = meta.slug || '';
          service.metaTitle = meta.metaTitle;
          service.metaDesc = meta.metaDesc;
          continue;
        }

        if (isHeaderTable(text)) {
          const header = extractHeaderTable(text);
          service.lastUpdated = header.lastUpdated;
          service.readingTime = header.readingTime;
          service.writtenBy = header.writtenBy;
          service.reviewedBy = header.reviewedBy;
          continue;
        }

        if (isBadgeTable(part.html, text)) {
          service.badges = extractBadges(part.html);
          continue;
        }

        if (isDirectAnswerTable(text)) {
          service.directAnswer = extractDirectAnswer(text);
          continue;
        }

        if (isPricingTable(part.html, text)) {
          service.pricingTiers = extractPricingRows(part.html);
          skipNonContent = true;
          continue;
        }

        if (isPricingHeadingTable(text)) {
          // Just a heading before the pricing table, skip
          continue;
        }

        if (isFaqTable(text)) {
          // FAQ heading table — the actual FAQs are in the next text part
          continue;
        }

        if (isAuthorTable(part.html, text) || isJsonLdTable(text) || isCtaTable(part.html, text) || isRelatedLinksTable(text)) {
          skipNonContent = true;
          continue;
        }

        if (isHeadingTable(part.html, text)) {
          // Save previous section
          if (currentSection && currentSection.paragraphs.length > 0) {
            service.sections.push(currentSection);
          }
          currentSection = { heading: text, paragraphs: [] };
          skipNonContent = false;
          continue;
        }

        // Unknown table — skip
        continue;
      }

      // Text parts (between tables)
      if (part.type === 'text') {
        // Extract H1 from first text part (use HTML to get <h1> specifically)
        if (!service.title && /Home\s*[›>]\s*Services/i.test(text)) {
          service.title = extractH1FromHtml(part.html);
          service.serviceName = service.title;
          continue;
        }

        // FAQs: text after FAQ heading
        if (text.includes('Q:') && text.includes('A:') && text.length > 100) {
          const faqs = extractFaqsFromText(text);
          if (faqs.length > 0) {
            service.faqs = faqs;
            continue;
          }
        }

        // Content paragraphs for current section
        if (currentSection && !skipNonContent && text.length > 20) {
          const paragraphs = parseBoldLedParagraphs(part.html);
          if (paragraphs.length > 0) {
            currentSection.paragraphs.push(...paragraphs);
          } else {
            // Plain text paragraph
            const rawParagraphs = extractParagraphsFromText(part.html);
            currentSection.paragraphs.push(...rawParagraphs.map(p => ({ bold: '', text: p })));
          }
        }
      }
    }

    // Push last section
    if (currentSection && currentSection.paragraphs.length > 0) {
      service.sections.push(currentSection);
    }

    return service;
  });
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  const files = fs.readdirSync(SERVICE_DIR).filter(f => f.endsWith('.docx')).sort();
  console.log(`Found ${files.length} service files\n`);

  const services = [];
  const errors = [];

  for (const file of files) {
    const filePath = path.join(SERVICE_DIR, file);
    try {
      const service = await extractService(filePath);
      services.push(service);
      console.log(`✅ ${file} → /${service.slug}/ (${service.sections.length} sections, ${service.pricingTiers.length} pricing, ${service.faqs.length} FAQs)`);
    } catch (err) {
      errors.push({ file, error: err.message });
      console.log(`❌ ${file} → ERROR: ${err.message}`);
    }
  }

  // Deduplicate by slug (keep first/lowest P-number)
  const slugMap = new Map();
  for (const s of services) {
    if (!slugMap.has(s.slug)) {
      slugMap.set(s.slug, s);
    }
  }
  const unique = Array.from(slugMap.values());

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total parsed: ${services.length}`);
  console.log(`Unique: ${unique.length}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log(`\nErrors:`);
    errors.forEach(e => console.log(`  ${e.file}: ${e.error}`));
  }

  // ─── Generate Output File ─────────────────────────────────────────────

  const output = `/**
 * Standalone Service Pages Data
 *
 * Auto-generated by scripts/convert-service.js
 * Source: Service/ folder (${files.length} DOCX files)
 * Generated: ${new Date().toISOString()}
 * Unique entries: ${unique.length}
 */

const services = ${JSON.stringify(unique, null, 2)};

// Lightweight listing data for listing pages
export const serviceListings = services.map(
  ({ id, slug, serviceName, title, metaDesc, badges }) =>
    ({ id, slug, serviceName, title, metaDesc, badges })
);

// Lookup by slug
export function getServiceBySlug(slug) {
  return services.find(s => s.slug === slug) || null;
}

// Get all services (for listing page)
export function getAllServices() {
  return services;
}

// Get related services (by badge overlap)
export function getRelatedServices(slug, limit = 3) {
  const current = getServiceBySlug(slug);
  if (!current) return [];
  return services
    .filter(s => s.slug !== slug && s.badges.some(b => current.badges.includes(b)))
    .slice(0, limit);
}

export { services };
`;

  fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
  console.log(`\n✅ Written to ${OUTPUT_FILE}`);
  console.log(`   Lines: ${output.split('\n').length}`);
}

main().catch(e => console.error(e));
