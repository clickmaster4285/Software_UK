/**
 * convert-main-services-md.js
 * ===========================
 * MD → Data converter for the main-services/*.md content files.
 *
 * Captures rich fields from main-services MD files:
 *   - metaTitle, metaDescription, metaKeywords, URL, slug
 *   - h1, intro paragraphs with relative internal links
 *   - structured sections with body, bullets, tables
 *   - sub-service offerings mentioned in body
 *   - comparison tables
 *   - cost factors
 *   - whyChoose blocks
 *   - all FAQs (deduplicated)
 *   - contextual related internal links
 *   - clean JSON-LD schemas (Service, FAQPage, BreadcrumbList)
 *
 * Usage:  node scripts/convert-main-services-md.js
 * Output: data/main-services-md.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'main-services');
const OUT_FILE = path.join(__dirname, '..', 'data', 'main-services-md.js');

const DOMAIN = 'https://clickmasterssoftwaredevelopmentcompany.co.uk';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clean(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripBoldKeepLinks(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractInternalLinks(text) {
  const links = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^)\s]+|(?:\/[^)\s]+)*)\)/g;
  let m;
  while ((m = re.exec(text))) {
    let href = m[2];
    if (href.startsWith(DOMAIN)) href = href.replace(DOMAIN, '');
    if (href.startsWith('/')) {
      links.push({ label: clean(m[1]), href });
    }
  }
  return links;
}

function startsListMarker(line) {
  const t = line.trim();
  return t.startsWith('* ') || t.startsWith('- ') || /^\d+\.\s/.test(t);
}

// ─── Schema Parser ───────────────────────────────────────────────────────────

function extractSchemas(content) {
  const schemas = {};
  const scriptRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  let match;

  while ((match = scriptRegex.exec(content)) !== null) {
    try {
      const cleanJson = match[1]
        .replace(/\*\*/g, '')
        .replace(/\\([/])/g, '$1')
        .trim();
      const parsed = JSON.parse(cleanJson);
      const type = parsed['@type'];
      if (type === 'Service') schemas.service = parsed;
      else if (type === 'FAQPage') schemas.faqPage = parsed;
      else if (type === 'BreadcrumbList') schemas.breadcrumb = parsed;
      else if (!schemas.raw) schemas.raw = [];
      if (!['Service', 'FAQPage', 'BreadcrumbList'].includes(type)) {
        schemas.raw.push(parsed);
      }
    } catch (e) {
      // Ignore JSON parse errors in malformed raw blocks
    }
  }
  return schemas;
}

// ─── Keyword Extractor ────────────────────────────────────────────────────────

function extractKeywords(content) {
  const kwSectionMatch = content.match(/(?:Meta\s*Keywords?|Recommended\s*Meta\s*Data)[\s\S]*?(?=(?:Page\s*Content|URL:|\*\*URL:|Meta\s*Title|Meta\s*Description|#\s*\*\*H1|##\s*\*\*H1|#\s+\*\*))/i);
  if (!kwSectionMatch) return [];

  const raw = kwSectionMatch[0];
  const backtickMatches = raw.match(/`([^`]+)`/g);
  let keywords = [];

  if (backtickMatches && backtickMatches.length > 0) {
    keywords = backtickMatches.map(clean).filter(k => k.length > 2 && !/meta keyword|recommended meta/i.test(k));
  }

  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const cleaned = clean(line.replace(/#+/g, '').replace(/`[^`]+`/g, ''));
    if (cleaned && !/meta keyword|recommended meta|page content/i.test(cleaned) && cleaned.length > 3) {
      const parts = cleaned.split(/,\s*/);
      for (const p of parts) {
        if (p.trim().length > 2 && !/meta keyword|recommended meta/i.test(p)) {
          keywords.push(p.trim());
        }
      }
    }
  }

  const seen = new Set();
  return keywords.filter(k => {
    const lower = k.toLowerCase().trim();
    if (!lower || seen.has(lower) || lower.includes('page content')) return false;
    seen.add(lower);
    return true;
  });
}

// ─── Main MD Parser ──────────────────────────────────────────────────────────

function parseMainMd(content) {
  const lines = content.split(/\r?\n/);
  const out = {
    slug: '',
    title: '',
    h1: '',
    url: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: extractKeywords(content),
    intro: [],
    sections: [],
    tables: [],
    costFactors: [],
    whyChoose: [],
    faqs: [],
    relatedLinks: [],
    jsonLd: extractSchemas(content),
  };

  // 1. Meta Title
  const titleMatch = content.match(/(?:#*\s*\**Meta Title:?\**\s*|\n##\s*\*\*Meta Title\*\*\s*\n+)([^\n]+)/i);
  if (titleMatch) {
    out.metaTitle = clean(titleMatch[1]);
  }

  // 2. Meta Description
  const descMatch = content.match(/(?:#*\s*\**Meta Description:?\**\s*|\n##\s*\*\*Meta Description\*\*\s*\n+)([^\n]+)/i);
  if (descMatch) {
    out.metaDescription = clean(descMatch[1]);
  }

  // 3. URL, Slug
  const urlMatch = content.match(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)/i);
  if (urlMatch) {
    out.url = `${DOMAIN}${urlMatch[1]}`;
    const parts = urlMatch[1].split('/').filter(Boolean);
    out.slug = parts[0] || '';
  }

  // 4. H1 & Intro
  const h1Match = content.match(/#+\s*\**H1:\s*([^\n*]+)\**/i) || content.match(/#+\s*\*\*([^\n*]+)\*\*/);
  if (h1Match) {
    out.h1 = clean(h1Match[1]);
    out.title = out.h1;
  }

  let inFaq = false;
  let faqCurrent = null;

  const pushContentSection = (heading, blocks) => {
    const hLower = heading.toLowerCase();
    if (/frequently asked|\bfaqs?\b/i.test(hLower)) return;
    
    if (/why choose (clickmasters|us)/i.test(hLower)) {
      out.whyChoose.push({
        title: heading,
        body: blocks.filter(b => !b.isList).map(b => b.text).join('\n\n'),
        items: blocks.filter(b => b.isList).flatMap(b => b.items),
      });
      return;
    }

    if (/how (much|long) (does|will)|cost|price|pricing/i.test(hLower)) {
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0) {
        out.costFactors.push(...listBlocks.flatMap(b => b.items));
      }
      const textBlocks = blocks.filter(b => !b.isList && !b.isTable);
      if (textBlocks.length > 0) {
        out.sections.push({
          heading,
          body: textBlocks.map(b => b.text).join('\n\n'),
          items: listBlocks.flatMap(b => b.items),
        });
      }
      return;
    }

    if (blocks.some(b => b.isTable)) {
      blocks.filter(b => b.isTable).forEach(b => out.tables.push({ title: heading, headers: b.headers, rows: b.rows }));
      const nonTable = blocks.filter(b => !b.isTable && !b.isList);
      const list = blocks.filter(b => b.isList);
      if (nonTable.length || list.length) {
        out.sections.push({
          heading,
          body: nonTable.map(b => b.text).join('\n\n'),
          items: list.flatMap(b => b.items),
        });
      }
      return;
    }

    out.sections.push({
      heading,
      body: blocks.filter(b => !b.isList).map(b => b.text).join('\n\n'),
      items: blocks.filter(b => b.isList).flatMap(b => b.items),
    });
  };

  // Iterate lines for Intro, Sections, FAQs
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) continue;

    // Intro extraction between H1 and first H2
    if (/^#\s*\**H1:/i.test(t) || (/^#\s*\*\*/.test(t) && !/meta/i.test(t) && !out.intro.length)) {
      let j = i + 1;
      const introParas = [];
      while (j < lines.length && !/^#{2,4}\s*\*\*/.test(lines[j].trim())) {
        const lj = lines[j].trim();
        if (lj && !startsListMarker(lj) && !/^\*\*URL:|^##\s|^#\s|\bMeta (Title|Description)/i.test(lj)) {
          introParas.push(stripBoldKeepLinks(lj));
        }
        j++;
      }
      out.intro = introParas;
      i = j - 1;
      continue;
    }

    // FAQ section start
    if (/^#{1,4}\s*\*\*(Frequently Asked Questions|FAQs?)\s*\*\*/i.test(t)) {
      inFaq = true;
      continue;
    }

    // FAQ question (### **question**)
    if (inFaq && /^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const q = t.match(/^#{2,4}\s*\*\*(.+)\*\*\s*$/)[1].trim();
      faqCurrent = { question: clean(q), answer: '' };
      out.faqs.push(faqCurrent);
      continue;
    }

    // FAQ answer text
    if (inFaq && faqCurrent) {
      if (/\\?<\/?script|application\/ld\+json/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        continue;
      }
      if (!/^#{1,4}/.test(t) && !startsListMarker(t) && !/^\*\*Faq\s*Schema/i.test(t)) {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
      }
      continue;
    }

    // H2/H3 Section start
    if (/^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const heading = clean(t.match(/^#{2,4}\s*\*\*(.+)\*\*\s*$/)[1]);
      if (/meta (title|description|keyword)/i.test(heading)) continue;

      if (inFaq) {
        inFaq = false;
        faqCurrent = null;
      }

      const blocks = [];
      let j = i + 1;
      while (j < lines.length && !/^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(lines[j].trim())) {
        const lj = lines[j].trim();
        if (lj === '') { j++; continue; }
        if (/^<script/i.test(lj)) break;

        if (startsListMarker(lj)) {
          const items = [];
          while (j < lines.length && (startsListMarker(lines[j].trim()) || /^\s*$/.test(lines[j]))) {
            if (startsListMarker(lines[j].trim())) {
              items.push(clean(lines[j].trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')));
            }
            j++;
          }
          blocks.push({ isList: true, items });
        } else if (lj.startsWith('|')) {
          const rows = [];
          while (j < lines.length && lines[j].trim().startsWith('|')) {
            rows.push(lines[j].trim().split('|').slice(1, -1).map(c => clean(c)));
            j++;
          }
          const headerRow = rows[0] || [];
          const body = rows.filter(r => !r.every(c => /^[:\- ]+$/.test(c))).slice(1);
          if (headerRow.length) blocks.push({ isTable: true, headers: headerRow, rows: body });
        } else {
          const p = [lj];
          j++;
          while (
            j < lines.length &&
            lines[j].trim() !== '' &&
            !startsListMarker(lines[j].trim()) &&
            !lines[j].trim().startsWith('|') &&
            !/^#{1,4}/.test(lines[j].trim()) &&
            !/^<script/i.test(lines[j].trim())
          ) {
            p.push(lines[j].trim());
            j++;
          }
          blocks.push({ text: stripBoldKeepLinks(p.join(' ')) });
        }
      }
      i = j - 1;
      pushContentSection(heading, blocks);
      continue;
    }
  }

  // Deduplicate FAQs
  const seenFaqs = new Set();
  out.faqs = out.faqs.filter(f => {
    const q = f.question.toLowerCase().trim();
    if (!q || seenFaqs.has(q)) return false;
    seenFaqs.add(q);
    return true;
  });

  // Extract internal links from all body text
  const allText = [
    ...(out.intro || []),
    ...out.sections.map(s => s.body),
    ...(out.whyChoose || []).map(w => w.body),
  ].join('\n');

  out.relatedLinks = extractInternalLinks(allText).filter(
    (l, idx, arr) => arr.findIndex(x => x.href === l.href) === idx && l.href !== `/${out.slug}`
  );

  return out;
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error(`Source dir not found: ${SRC_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.md')).sort();
  console.log(`Found ${files.length} main-service MD files\n`);
  const results = [];
  const errors = [];

  files.forEach((file, idx) => {
    try {
      const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
      const parsed = parseMainMd(content);
      parsed.sourceFile = file;
      results.push(parsed);
      console.log(`  ${idx + 1}/${files.length}  ${file}  →  /${parsed.slug || '?'}`);
    } catch (e) {
      errors.push({ file, error: e.message });
      console.error(`  ${idx + 1}/${files.length}  ${file}  ✗ ${e.message}`);
    }
  });

  const out = [];
  out.push('// AUTO-GENERATED from main-services/*.md by scripts/convert-main-services-md.js');
  out.push('// Rich main-service content: intro, tables, costFactors, whyChoose, relatedLinks, full FAQs & keywords.');
  out.push('// NOTE: written to data/main-services-md.js so data/main-services.js is unaffected until ready.');
  out.push(`// Generated: ${new Date().toISOString()}`);
  out.push('');
  out.push('export const mainServicesMd = ' + JSON.stringify(results, null, 2) + ';');
  out.push('');
  out.push('export const mainServiceMdListings = mainServicesMd.map(({ slug, title, metaTitle, metaDescription }) => ({ slug, title, metaTitle, metaDescription }));');
  out.push('');
  out.push('export function getMainServiceMdBySlug(slug) {');
  out.push('  return mainServicesMd.find((s) => s.slug === slug) || null;');
  out.push('}');
  out.push('');

  fs.writeFileSync(OUT_FILE, out.join('\n'), 'utf8');
  console.log(`\nDone. Wrote ${results.length} entries to ${OUT_FILE}`);
  if (errors.length) {
    console.warn(`\nWARNING: ${errors.length} file(s) failed:`);
    errors.forEach(e => console.warn('  - ' + e.file + ': ' + e.error));
  }
}

main();
