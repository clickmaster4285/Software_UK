/**
 * convert-sub-services-md.js
 * ==========================
 * MD → Data converter for the sub-services/*.md content files.
 *
 * Captures rich fields from source MD files:
 *   - metaTitle, metaDescription, metaKeywords, URL, slug, categorySlug
 *   - h1, intro paragraphs with relative internal links
 *   - structured sections with body, bullets, tables
 *   - comparison tables
 *   - cost factors
 *   - whyChoose blocks
 *   - all FAQs (deduplicated)
 *   - contextual related internal links
 *   - clean JSON-LD schemas (Service, FAQPage, BreadcrumbList)
 *
 * Usage:  node scripts/convert-sub-services-md.js
 * Output: data/sub-services-md.js
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'sub-services');
const OUT_FILE = path.join(__dirname, '..', 'data', 'sub-services-md.js');

const DOMAIN = 'https://clickmasterssoftwaredevelopmentcompany.co.uk';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMOJI_AND_MOJIBAKE_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}]|ðŸ[^\s]+|âš[^\s]*|âœ[^\s]*|ðŸ’¡|ðŸ'¡|âš ï¸|âš ï¸ |âš ï¸|âš ï¸|âœ…|ðŸš€|ðŸ”§|ðŸ"§|ðŸ“Š|ðŸ"Š|ðŸ“‹|ðŸ"‹|ðŸ‘ |ðŸ'|ðŸŽ¯|âœ"|ðŸ—ï¸|ðŸ“±|ðŸ"±|ðŸ’°|ðŸ'°|ðŸ”'|ðŸ"'/gu;

function stripEmojis(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(EMOJI_AND_MOJIBAKE_REGEX, '')
    .replace(/^\s*[-•–—:]\s*/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function clean(text) {
  return stripEmojis(
    String(text || '')
      .replace(/\\/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/^#+\s*/, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function stripBoldKeepLinks(text) {
  return stripEmojis(
    String(text || '')
      .replace(/\*\*/g, '')
      .replace(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  );
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
  const scriptRegex = /\\?<script\s+type=["']application\/ld\+json["']\\?>([\s\S]*?)\\?<\/script\\?>/gi;
  let match;

  while ((match = scriptRegex.exec(content)) !== null) {
    try {
      const cleanJson = match[1]
        .replace(/\\/g, '')
        .replace(/\*\*/g, '')
        .replace(/[ \t]+$/gm, '')
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
  const keywords = [];

  // Find keyword section by locating the header, then grab content until next major heading
  const kwHeaderRe = /\**`?(?:Meta\s*Keywords?|Target\s+SEO\s*Keywords?|Meta\s*Tags)`?\**[:\s]*/im;
  const kwMatch = content.match(kwHeaderRe);
  if (kwMatch) {
    const startIdx = kwMatch.index + kwMatch[0].length;
    // Grab content after header until next major heading or URL marker
    const rest = content.substring(startIdx);
    const nextHeading = rest.match(/\n(?:#{1,3}\s+\*\*|URL:\s*|\*\*URL:\s*)/);
    const section = nextHeading ? rest.substring(0, nextHeading.index) : rest.substring(0, 3000);

    // Split into lines and also handle inline keywords on the header line
    const allText = kwMatch[0] + section;
    const lines = allText.split(/\r?\n/);
    lines.forEach(line => {
      let l = line.trim();
      if (!l) return;
      // Strip the header prefix if present
      l = l.replace(/^#*\s*\**`?(?:Meta\s*Keywords?|Target\s+SEO\s*Keywords?|Meta\s*Tags)`?\**[:\s]*/i, '').trim();
      if (!l) return;
      // Skip known section-heading noise
      if (/^(target seo keywords|meta keywords?|meta tags?|url:|cta:|secondary cta:|who we are|page content|recommended meta data)$/i.test(l)) return;
      // Split on double-spaces (inline format) or process as individual lines
      const parts = l.split(/\s{2,}/);
      parts.forEach(p => {
        let cleaned = p.replace(/^\d+\.\s*/, '').replace(/^[#*`\s]+/, '').replace(/[#*`\s]+$/, '').replace(/\\/g, '').trim();
        if (!cleaned) return;
        // If bold markers remain in the middle, split on them (e.g. **kw1** **kw2**)
        if (cleaned.includes('**')) {
          const subParts = cleaned.split(/\*\*\s*/).filter(s => s.trim().length > 0);
          subParts.forEach(sp => {
            const finalClean = sp.replace(/\*\*/g, '').replace(/\\/g, '').trim();
            if (finalClean.length > 2 && finalClean.length < 120 && !/meta keyword|meta title|meta desc|meta tag|https?:\/\//i.test(finalClean)) {
              keywords.push(finalClean);
            }
          });
        } else {
          if (cleaned.length > 2 && cleaned.length < 120 && !/meta keyword|meta title|meta desc|meta tag|https?:\/\//i.test(cleaned)) {
            keywords.push(cleaned);
          }
        }
      });
    });
  }

  // Fallback: extract bold phrases from the meta section (before Meta Title header)
  if (keywords.length === 0) {
    const metaTitleIdx = content.search(/##?\s*\**`?Meta Title`?\**/i);
    const topSection = metaTitleIdx > 0 ? content.substring(0, metaTitleIdx) : content.substring(0, 2000);
    const boldMatches = topSection.match(/\*\*([^*]+)\*\*/g);
    if (boldMatches) {
      boldMatches.forEach(bm => {
        const c = bm.replace(/\*\*/g, '').replace(/`/g, '').replace(/\\/g, '').trim();
        if (c.length > 2 && c.length < 80 && !/meta keyword|meta tag|recommended meta|meta title|meta desc|https?:\/\//i.test(c) && !c.startsWith('http')) {
          keywords.push(c);
        }
      });
    }
  }

  const seen = new Set();
  return keywords.filter(k => {
    const lower = k.toLowerCase().trim();
    if (!lower || seen.has(lower)) return false;
    if (lower.includes('page content') || lower.startsWith('http') || lower.startsWith('https')) return false;
    if (lower.includes('meta title') || lower.includes('meta description') || lower.includes('meta keyword') || lower.includes('meta tag')) return false;
    if (lower === 'url:' || lower.startsWith('url:')) return false;
    // Filter out meta titles (contain | separator for site name) and meta descriptions (long text)
    if (k.includes('|') && k.length < 120) return false;  // metaTitle pattern: "Service | Clickmasters"
    if (lower.startsWith('custom ') && lower.length > 80) return false;  // metaDescription pattern
    if (lower.startsWith('clickmasters') && lower.length > 50) return false;  // metaDescription starting with company name
    seen.add(lower);
    return true;
  });
}

// ─── Main MD Parser ──────────────────────────────────────────────────────────

function parseMd(content) {
  const lines = content.split(/\r?\n/);
  const out = {
    slug: '',
    categorySlug: '',
    category: '',
    title: '',
    serviceName: '',
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

  // 1. Meta Title (handles ## **Meta Title**, ## **`Meta Title`**, and inline Meta Title:)
  const titleMatch = content.match(/(?:#*\s*\**`?Meta Title`?[:\s]*\**\s*|\n##\s*\*\*`?Meta Title`?\*\*\s*\n+)([^\n]+?)(?=\s*\*\*|$)/im);
  if (titleMatch) {
    out.metaTitle = clean(titleMatch[1]);
  }

  // 2. Meta Description (handles ## **Meta Description**, ## **`Meta Description`**, and inline)
  const descMatch = content.match(/(?:#*\s*\**`?Meta Description`?[:\s]*\**\s*|\n##\s*\*\*`?Meta Description`?\*\*\s*\n+)([^\n]+?)(?=\s*\*\*|$)/im);
  if (descMatch) {
    out.metaDescription = clean(descMatch[1]);
  }

  // 3. URL, Slug, CategorySlug
  const urlMatch = content.match(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)/i);
  if (urlMatch) {
    out.url = `${DOMAIN}${urlMatch[1]}`;
    const parts = urlMatch[1].split('/').filter(Boolean);
    if (parts.length >= 2) {
      out.categorySlug = parts[0];
      out.slug = parts[1];
    } else if (parts.length === 1) {
      out.categorySlug = parts[0];
      out.slug = parts[0];
    }
  }

  // Slug aliases / normalization to match existing route structure
  const slugAliases = {
    'ecommerce-development': 'e-commerce-development',
    'progressive-web-app-develoment': 'pwa-development',
    'progressive-web-app-development': 'pwa-development',
    'dapp-development': 'decentralized-app-dapp-development',
    'compliance-management': 'compliance-risk-management',
    'model-training-optimization': 'model-training-optimisation',
  };
  if (slugAliases[out.slug]) {
    out.slug = slugAliases[out.slug];
    out.url = `${DOMAIN}/${out.categorySlug}/${out.slug}`;
  }

  // 4. H1 & Intro
  let h1Match = null;

  // First, try inline H1 on line 1 (for single-line format MDs like custom-software-development)
  const firstLine = content.split('\n')[0];
  const inlineBolds = [...firstLine.matchAll(/\*\*([^*]+)\*\*/g)];
  for (let i = inlineBolds.length - 1; i >= 0; i--) {
    const val = clean(inlineBolds[i][1]);
    if (/^meta (title|description|keyword|tag|data)/i.test(val)) continue;
    if (val.length > 5) {
      h1Match = inlineBolds[i];
      break;
    }
  }

  // Fallback: explicit H1 declaration or markdown headings
  if (!h1Match) {
    const h1MatchExplicit = content.match(/#+\s*\**H1:\s*([^\n*]+)\**/i);
    h1Match = h1MatchExplicit;
    if (!h1Match) {
      const boldHeadings = [...content.matchAll(/#+\s*\*\*([^\n*]+)\*\*/g)];
      for (const m of boldHeadings) {
        const val = clean(m[1]).toLowerCase();
        if (/^meta (title|description|keyword)/i.test(val)) continue;
        if (/^https?:\/\//.test(val)) continue;
        if (/^seo\b/i.test(val)) continue;
        if (val.length < 5) continue;
        h1Match = m;
        break;
      }
    }
  }
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
  let introExtracted = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) continue;

    // Intro extraction between H1 and next heading
    if (!introExtracted && (/^#\s*\**H1:/i.test(t) || /^#\s+\*\*[A-Z]/.test(t))) {
      const isMetaH1 = /\bMeta (Title|Description|Keyword)/i.test(t);
      if (!isMetaH1) {
        let j = i + 1;
        const introParas = [];
        while (j < lines.length) {
          const lj = lines[j].trim();
          if (/^#{1,4}\s*\*\*[A-Z]/.test(lj) && !/\bMeta (Title|Description|Keyword)/i.test(lj)) break;
          if (/^(Primary|Secondary)\s+CTA:|^\s*[\{\[]|^\\?<script|^Service Schema|^FAQ Schema|^Breadcrumb|schema\.org/i.test(lj)) break;
          if (lj && !startsListMarker(lj) && !/^\*\*URL:|\bMeta (Title|Description)/i.test(lj)) {
            introParas.push(stripBoldKeepLinks(lj));
          }
          j++;
        }
        if (introParas.length > 0) {
          out.intro = introParas;
          introExtracted = true;
          i = j - 1;
          continue;
        }
      }
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
      if (/^\\?<\/script|application\/ld\+json/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        continue;
      }
      if (!/^#{1,4}/.test(t) && !startsListMarker(t) && !/^\*\*Faq\s*Schema/i.test(t)) {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
      }
      continue;
    }

    // H1-H4 Section start
    if (/^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const heading = clean(t.match(/^#{1,4}\s*\*\*(.+)\*\*\s*$/)[1]);
      if (/meta (title|description|keyword)/i.test(heading)) continue;
      if (/^seo\b/i.test(heading)) continue;
      if (/^https?:\/\//.test(heading)) continue;

      if (inFaq) {
        inFaq = false;
        faqCurrent = null;
      }

      const blocks = [];
      let j = i + 1;
      while (j < lines.length && !/^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(lines[j].trim())) {
        const lj = lines[j].trim();
        if (lj === '') { j++; continue; }
        if (/^\\?<script/i.test(lj)) break;

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
            !/^#{1,4}\s*\*\*/.test(lines[j].trim()) &&
            !/^<script|\\?<script/i.test(lines[j].trim())
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

  // Category mapping
  const catMap = {
    'software-development': 'Software Development',
    'web-development': 'Web Development',
    'mobile-development': 'Mobile Development',
    'design-ui-ux': 'Design UI/UX',
    'artificial-intelligence-ai': 'Artificial Intelligence (AI)',
    'machine-learning-ml': 'Machine Learning (ML)',
  };
  out.category = catMap[out.categorySlug] || out.categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // ServiceName
  out.serviceName = out.metaTitle
    ? clean(out.metaTitle.replace(/\s*[|–-]\s*(Clickmasters|ClickMasters).*$/i, ''))
    : (out.h1 || out.slug);

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
  console.log(`Found ${files.length} sub-service MD files\n`);
  const results = [];
  const errors = [];

  files.forEach((file, idx) => {
    try {
      const content = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
      const parsed = parseMd(content);
      parsed.sourceFile = file;
      results.push(parsed);
      console.log(`  ${idx + 1}/${files.length}  ${file}  →  /${parsed.categorySlug || '?'}/${parsed.slug || '?'}`);
    } catch (e) {
      errors.push({ file, error: e.message });
      console.error(`  ${idx + 1}/${files.length}  ${file}  ✗ ${e.message}`);
    }
  });

  const out = [];
  out.push('// AUTO-GENERATED from sub-services/*.md by scripts/convert-sub-services-md.js');
  out.push('// Rich sub-service content: intro, tables, costFactors, whyChoose, relatedLinks, full FAQs & keywords.');
  out.push('// NOTE: written to data/sub-services-md.js so data/sub-services.js is unaffected until ready.');
  out.push(`// Generated: ${new Date().toISOString()}`);
  out.push('');
  out.push('export const subServicesMd = ' + JSON.stringify(results, null, 2) + ';');
  out.push('');
  out.push('export const subServiceMdListings = subServicesMd.map(({ slug, categorySlug, title, serviceName, metaTitle, metaDescription }) => ({ slug, categorySlug, title, serviceName, metaTitle, metaDescription }));');
  out.push('');
  out.push('export function getSubServiceMdBySlug(slug) {');
  out.push('  return subServicesMd.find((s) => s.slug === slug) || null;');
  out.push('}');
  out.push('');
  out.push('export function getSubServiceMdByCategoryAndSlug(category, slug) {');
  out.push('  return subServicesMd.find((s) => s.categorySlug === category && s.slug === slug) || getSubServiceMdBySlug(slug);');
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


