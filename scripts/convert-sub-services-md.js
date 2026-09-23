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

/** Remove MD scaffold CTAs / schema labels that leak into body & FAQ answers. */
// MD forms seen: **Primary CTA:** Label  |  **Primary CTA**: Label  |  Primary CTA: Label
const CTA_LABEL_RE =
  /\*{0,2}\s*(Primary|Secondary)\s+CTA\s*:?\s*\*{0,2}\s*:?\s*/i;

function stripCtaArtifacts(text) {
  return String(text || '')
    .replace(
      new RegExp(CTA_LABEL_RE.source + '[^\\n]*', 'gi'),
      ' '
    )
    .replace(/\b(?:Primary|Secondary)\s+CTA\s*:/gi, ' ')
    .replace(/\b(?:Service|FAQ|Breadcrumb)\s*Schema\b/gi, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}

function scrubCtaLabel(raw) {
  const v = clean(String(raw || '').replace(/^\*+\s*/, '').replace(/\*+$/, ''));
  // Drop trailing secondary fragment if both were on one line
  return v
    .replace(/\s*\*{0,2}\s*Secondary\s+CTA\s*:?\s*\*{0,2}\s*:?\s*.*$/i, '')
    .trim();
}

function extractCtaPair(text) {
  const src = String(text || '');
  // Colon may sit inside or outside closing ** (e.g. **Primary CTA:** Label)
  const primaryMatch = src.match(
    /\*{0,2}\s*Primary\s+CTA\s*:?\s*\*{0,2}\s*:?\s*([^\n]+)/i
  );
  const secondaryMatch = src.match(
    /\*{0,2}\s*Secondary\s+CTA\s*:?\s*\*{0,2}\s*:?\s*([^\n]+)/i
  );
  const primary = primaryMatch ? scrubCtaLabel(primaryMatch[1]) : '';
  const secondary = secondaryMatch ? scrubCtaLabel(secondaryMatch[1]) : '';
  return {
    primary: primary && primary.length > 2 && primary.length < 90 ? primary : null,
    secondary:
      secondary && secondary.length > 2 && secondary.length < 90 ? secondary : null,
  };
}

function isCtaOnlyLine(line) {
  const t = String(line || '').replace(/\*\*/g, '').trim();
  return /^(Primary|Secondary)\s+CTA\s*:/i.test(t) || /^(Primary|Secondary)\s+CTA$/i.test(t);
}

function stripBoldKeepLinks(text) {
  return stripEmojis(
    stripCtaArtifacts(
      String(text || '')
        .replace(/\*\*/g, '')
        .replace(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk/g, '')
        .replace(/\s+/g, ' ')
        .trim()
    )
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

function parseMd(content, sourceFile = '') {
  content = content.replace(/\r/g, '');
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
    cta: null,
    jsonLd: extractSchemas(content),
  };

  const slugAliases = {
    'e-commerce-development': 'ecommerce-development',
    'progressive-web-app-develoment': 'progressive-web-app-development', // typo in MD filename/URL
    'pwa-development': 'progressive-web-app-development',
    'dapp-development': 'decentralized-app-dapp-development',
    'compliance-management': 'compliance-risk-management',
    'model-training-optimization': 'model-training-optimisation',
    'nlp': 'natural-language-processing',
  };

  // 1. Meta Title (prioritize ## **Meta Title**, then inline **Meta Title:** content, then standalone **Meta Title:** with content next line)
  const titleMatch = content.match(/\n##[ \t]*\*\*`?Meta Title`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/#[ \t]*\*\*`?Meta Title`?:\s*\*\*?[ \t]+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Title`?:\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Title`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\*\*Meta Title\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/Meta Title:\s*(.+?)(?:\s+\**Meta Description)/im)
    || content.match(/Meta Title:\*{0,2}\s*\n+\s*([^\n]+)/im)
    || content.match(/Meta Title:\s*([^\n]+)/im)
    || content.match(/Meta Title\*{0,2}\s+([^\n]+)/im)
    || content.match(/\n\s*Meta Title:\s*\n+([^\n]+)/im);
  if (titleMatch) {
    out.metaTitle = clean(titleMatch[1]);
  }

  // 2. Meta Description (prioritize ## **Meta Description**, then inline **Meta Description:** content, then standalone **Meta Description:** with content next line)
  const descMatch = content.match(/\n##[ \t]*\*\*`?Meta Description`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/#[ \t]*\*\*`?Meta Description`?:\s*\*\*?[ \t]+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Description`?:\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Description`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\*\*Meta Description\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/Meta Description[:\s]*\*{0,2}\s*\n+\s*([^\n]+)/im)
    || content.match(/Meta Description[:\s]+([^\n]+)/im)
    || content.match(/Meta Description\*{0,2}\s+([^\n]+)/im)
    || content.match(/\n\s*Meta Description\s*[:\s]*\n+\s*([^\n]+)/im);
  if (descMatch) {
    out.metaDescription = clean(descMatch[1]);
  }

  // 3. URL, Slug, CategorySlug — prefer category/subservice (2 segments)
  // Prefer path whose leaf matches the source filename when available.
  const fileBase = sourceFile
    ? path.basename(sourceFile, path.extname(sourceFile))
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    : '';
  const allUrls = [...content.matchAll(/https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+(?:\/[a-z0-9-]+)?)/gi)];
  const twoSegUrls = allUrls.filter((m) => m[1].split('/').filter(Boolean).length >= 2);
  const byFilename = fileBase
    ? twoSegUrls.find((m) => {
        const leaf = m[1].split('/').filter(Boolean)[1];
        return leaf === fileBase || leaf === (slugAliases[fileBase] || fileBase);
      })
    : null;
  // Prefer explicit Service schema "url" with 2 segments
  const schemaUrl = content.match(/"@type"\s*:\s*"Service"[\s\S]{0,400}?"url"\s*:\s*"https:\/\/clickmasterssoftwaredevelopmentcompany\.co\.uk(\/[a-z0-9-]+\/[a-z0-9-]+)/i);
  const urlMatch = byFilename
    || (schemaUrl ? { 1: schemaUrl[1] } : null)
    || twoSegUrls[0]
    || allUrls[0];
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

  if (slugAliases[out.slug]) {
    out.slug = slugAliases[out.slug];
    out.url = `${DOMAIN}/${out.categorySlug}/${out.slug}`;
  }
  // When MD only linked the category (slug === categorySlug), derive from filename
  if (out.slug && out.categorySlug && out.slug === out.categorySlug && fileBase) {
    out.slug = slugAliases[fileBase] || fileBase;
    out.url = `${DOMAIN}/${out.categorySlug}/${out.slug}`;
  } else if ((!out.slug || out.slug === out.categorySlug) && fileBase) {
    out.slug = slugAliases[fileBase] || fileBase;
    if (out.categorySlug) out.url = `${DOMAIN}/${out.categorySlug}/${out.slug}`;
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
    // Strip leftover "H1:" prefix if present
    out.h1 = out.h1.replace(/^H1:\s*/i, '').trim();
    out.title = out.h1;
  }

  let inFaq = false;
  let faqCurrent = null;

  const finalizeIntro = (paras) => {
    const metaDesc = clean(out.metaDescription || '').toLowerCase();
    const metaTitle = clean(out.metaTitle || '').toLowerCase();
    return paras
      .map((p) => stripBoldKeepLinks(p))
      .filter((p) => {
        if (!p || p.length < 20) return false;
        const pl = p.toLowerCase();
        if (/^(primary cta|secondary cta|cta)\s*:/i.test(p)) return false;
        if (/^---+\s*$/.test(p)) return false;
        if (/page content/i.test(pl)) return false;
        if (/meta (title|description|keyword)/i.test(pl)) return false;
        if (metaDesc && pl === metaDesc) return false;
        if (metaTitle && pl === metaTitle) return false;
        // URL path fragments mistakenly captured as intro
        if (/^\/[a-z0-9-]+(\/[a-z0-9-]+)?\/?$/i.test(p.trim())) return false;
        if (/^(discuss your|book a |request |talk to )/i.test(p) && p.length < 80) return false;
        if (p.length < 70 && !/[.?!]/.test(p) && !/\[/.test(p)) return false;
        return true;
      });
  };

  const isPageH1Line = (t) => {
    if (!/^#{1,2}\s/.test(t)) return false;
    if (/\bMeta\s+(Title|Description|Keywords?)\b/i.test(t)) return false;
    if (/^#+\s*\*?\*?SECTION\s+\d+/i.test(t)) return false;
    if (/https?:\/\//i.test(t)) return false;
    if (/^#+\s*`/.test(t)) return false;
    const headingText = clean(t.replace(/^#+\s*/, ''));
    if (headingText.length < 20 && !/^H1:/i.test(headingText)) return false;
    if (/^[a-z0-9 /-]+$/.test(headingText) && headingText.length < 45) return false;
    // Explicit H1 tag (any level) — common in SECTION scaffolds: ## **H1: …**
    if (/^#{1,2}\s*\**H1:\s*/i.test(t)) return true;
    if (
      /^#\s+\*{0,2}[A-Za-z]/.test(t) &&
      !/\b(FAQs?|CTA Section|Our .+ Services|Frequently Asked|Target SEO)\b/i.test(t)
    ) {
      return true;
    }
    return false;
  };

  const collectIntroFrom = (startIdx) => {
    const introParas = [];
    let j = startIdx;
    while (j < lines.length) {
      const lj = lines[j].trim();
      if (/^#{1,4}\s/.test(lj)) break;
      if (isCtaOnlyLine(lj) || /^(Primary CTA|Secondary CTA|CTA)\s*:/i.test(lj) || /^\*\*(Primary CTA|Secondary CTA|CTA)\b/i.test(lj)) {
        const pair = extractCtaPair(lj);
        if (pair.primary || pair.secondary) {
          out.cta = {
            primary: pair.primary || out.cta?.primary || null,
            secondary: pair.secondary || out.cta?.secondary || null,
          };
        }
        j++;
        continue;
      }
      if (
        /^---+\s*$/.test(lj) ||
        (/^(Discuss Your|Book a |Request |Talk to )/i.test(lj) && lj.length < 80) ||
        (/^\*\*[^*]{3,60}\*\*\s*$/.test(lj) && !/[.?!]/.test(lj) && lj.length < 80) ||
        /^\\?<script|application\/ld\+json|schema\.org/i.test(lj)
      ) {
        j++;
        continue;
      }
      if (startsListMarker(lj)) {
        j++;
        continue;
      }
      if (lj.length >= 20) introParas.push(lj);
      j++;
    }
    return { paras: finalizeIntro(introParas), end: j };
  };

  const isNoiseSectionHeading = (heading) => {
    const hLower = heading.toLowerCase().trim();
    if (/^(target seo keywords|seo keywords|meta (title|description|keywords|tags)|recommended meta|url:|who we are|page content|author|table of contents)/i.test(hLower)) return true;
    if (/^h1:\s*/i.test(hLower)) return true;
    if (/^section\s+\d+/i.test(hLower)) return true;
    if (/^\d+\.\s/.test(hLower) && hLower.length < 60) return true;
    return false;
  };

  const mergeCta = (current, pair) => {
    if (!pair?.primary && !pair?.secondary) return current;
    return {
      primary: pair.primary || current?.primary || null,
      secondary: pair.secondary || current?.secondary || null,
    };
  };

  const pushContentSection = (heading, blocks, sectionCta = null) => {
    const hLower = heading.toLowerCase();
    if (/frequently asked|\bfaqs?\b/i.test(hLower)) return;
    if (isNoiseSectionHeading(heading)) return;

    if (/why choose (clickmasters|us)/i.test(hLower)) {
      out.whyChoose.push({
        title: heading,
        body: blocks.filter(b => !b.isList).map(b => b.text).join('\n\n'),
        items: blocks.filter(b => b.isList).flatMap(b => b.items),
        ...(sectionCta ? { cta: sectionCta } : {}),
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
          ...(sectionCta ? { cta: sectionCta } : {}),
        });
      }
      return;
    }

    if (blocks.some(b => b.isTable)) {
      blocks.filter(b => b.isTable).forEach(b => out.tables.push({ title: heading, headers: b.headers, rows: b.rows }));
      const nonTable = blocks.filter(b => !b.isTable && !b.isList);
      const list = blocks.filter(b => b.isList);
      if (nonTable.length || list.length || sectionCta) {
        out.sections.push({
          heading,
          body: nonTable.map(b => b.text).join('\n\n'),
          items: list.flatMap(b => b.items),
          ...(sectionCta ? { cta: sectionCta } : {}),
        });
      }
      return;
    }

    const bodyText = blocks.filter(b => !b.isList && !b.isTable).map(b => b.text).join(' ').trim();
    const listItems = blocks.filter(b => b.isList).flatMap(b => b.items);
    // Skip empty / tiny stub sections (allow CTA-only closing sections)
    if (!bodyText && listItems.length === 0 && !sectionCta) return;
    if (bodyText.length < 40 && listItems.length === 0 && !sectionCta) return;

    out.sections.push({
      heading,
      body: blocks.filter(b => !b.isList).map(b => b.text).join('\n\n'),
      items: listItems,
      ...(sectionCta ? { cta: sectionCta } : {}),
    });
  };

  // Iterate lines for Intro, Sections, FAQs
  let introExtracted = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) continue;

    // Intro: ONLY paragraphs between page H1 and the next heading (never meta description)
    if (!introExtracted && isPageH1Line(t)) {
      const { paras, end } = collectIntroFrom(i + 1);
      if (paras.length > 0) {
        out.intro = paras;
        introExtracted = true;
      }
      i = end - 1;
      continue;
    }

    // Fallback: first substantial "Looking for" / body para after meta (rare MD shapes)
    if (
      !introExtracted &&
      /^(Looking for |\*\*Looking for )/i.test(t) &&
      t.length > 40
    ) {
      const { paras, end } = collectIntroFrom(i);
      if (paras.length > 0) {
        out.intro = paras;
        introExtracted = true;
        i = end - 1;
        continue;
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
      if (isCtaOnlyLine(t)) continue;
      if (!/^#{1,4}/.test(t) && !startsListMarker(t) && !/^\*\*Faq\s*Schema/i.test(t)) {
        faqCurrent.answer = stripCtaArtifacts(
          (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t)
        );
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
      let sectionCta = null;
      let j = i + 1;
      while (j < lines.length && !/^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(lines[j].trim())) {
        const lj = lines[j].trim();
        if (lj === '') { j++; continue; }
        if (/^\\?<script/i.test(lj)) break;
        if (isCtaOnlyLine(lj)) {
          const pair = extractCtaPair(lj);
          sectionCta = mergeCta(sectionCta, pair);
          out.cta = mergeCta(out.cta, pair);
          j++;
          continue;
        }

        if (startsListMarker(lj)) {
          const items = [];
          while (j < lines.length && (startsListMarker(lines[j].trim()) || /^\s*$/.test(lines[j]))) {
            if (startsListMarker(lines[j].trim())) {
              const itemText = stripCtaArtifacts(
                clean(lines[j].trim().replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''))
              );
              if (itemText && !isCtaOnlyLine(itemText)) items.push(itemText);
            }
            j++;
          }
          if (items.length) blocks.push({ isList: true, items });
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
          const p = [];
          while (
            j < lines.length &&
            lines[j].trim() !== '' &&
            !startsListMarker(lines[j].trim()) &&
            !lines[j].trim().startsWith('|') &&
            !/^#{1,4}\s*\*\*/.test(lines[j].trim()) &&
            !/^<script|\\?<script/i.test(lines[j].trim())
          ) {
            const pl = lines[j].trim();
            if (isCtaOnlyLine(pl)) {
              const pair = extractCtaPair(pl);
              sectionCta = mergeCta(sectionCta, pair);
              out.cta = mergeCta(out.cta, pair);
              j++;
              continue;
            }
            p.push(pl);
            j++;
          }
          const joined = stripBoldKeepLinks(p.join(' '));
          if (joined.length >= 20) blocks.push({ text: joined });
        }
      }
      i = j - 1;
      pushContentSection(heading, blocks, sectionCta);
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

  // Deduplicate FAQs + strip CTA scaffold from answers
  const seenFaqs = new Set();
  out.faqs = out.faqs
    .map((f) => ({
      ...f,
      question: stripCtaArtifacts(f.question),
      answer: stripCtaArtifacts(f.answer),
    }))
    .filter((f) => {
      const q = f.question.toLowerCase().trim();
      if (!q || seenFaqs.has(q)) return false;
      if (!f.answer || f.answer.length < 10) return false;
      seenFaqs.add(q);
      return true;
    });

  // Clean section bodies / intros
  out.intro = (out.intro || []).map(stripCtaArtifacts).filter((p) => p.length >= 20);
  out.sections = (out.sections || [])
    .map((s) => ({
      ...s,
      body: stripCtaArtifacts(s.body || ''),
      items: (s.items || []).map(stripCtaArtifacts).filter(Boolean),
      // Keep section.cta if already captured from MD lines
      cta: s.cta || null,
    }))
    .filter((s) => (s.body && s.body.length >= 20) || (s.items && s.items.length > 0) || s.cta);

  // Extract / merge CTAs from full source (fill any missing label)
  {
    const pair = extractCtaPair(content);
    if (pair.primary || pair.secondary) {
      out.cta = {
        primary: out.cta?.primary || pair.primary || null,
        secondary: out.cta?.secondary || pair.secondary || null,
      };
    }
  }

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
      const parsed = parseMd(content, file);
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


