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
    .replace(/\\/g, '')
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

function extractInternalLinkHref(text) {
  if (!text) return '';
  const raw = String(text);

  const labeled =
    raw.match(/Internal Link:\s*[`'"\s]*(\/[-a-z0-9/]+)/i);
  if (labeled) return labeled[1].replace(/\/$/, '');

  const mdLink = raw.match(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]+)\)/);
  if (mdLink) {
    let href = mdLink[2];
    if (href.startsWith(DOMAIN)) href = href.replace(DOMAIN, '');
    if (href.startsWith('/')) return href.split(/[?#]/)[0].replace(/\/$/, '');
  }
  return '';
}

function parseStepTitle(title) {
  const cleaned = clean(String(title || '').replace(/\\/g, ''));
  const m = cleaned.match(/^(\d+)[\.\)]\s*(.+)$/);
  if (m) return { step: parseInt(m[1], 10), title: m[2].trim() };
  return { step: null, title: cleaned };
}

function isScaffoldSectionHeading(heading) {
  return /^SECTION\s*\d+/i.test(String(heading || '').trim());
}

function isFaqHeading(heading) {
  return /^(frequently asked questions|faqs?)(\b|$)/i.test(String(heading || '').trim());
}

function isPlaceholderFaqNoise(text) {
  const t = String(text || '').toLowerCase();
  return (
    /does not contain (the )?faq/i.test(t) ||
    /do not create new faq/i.test(t) ||
    /place the already-approved/i.test(t) ||
    /^ui:\s*faq accordion/i.test(t)
  );
}

/** Child-service parent headings only — avoid capability / explore pollution. */
function isChildServicesHeading(heading) {
  const h = String(heading || '').toLowerCase();
  if (/compar|engagement|support model|when |capabilities|use cases/i.test(h)) return false;
  return (
    /^our .+ services$/i.test(h) ||
    /^our .+ services for\b/i.test(h) ||
    /core(\s*\/\s*child)?\s*services/i.test(h) ||
    /^child services$/i.test(h) ||
    /^mobile app development services\b/i.test(h)
  );
}

function isProcessHeading(heading) {
  const h = String(heading || '').toLowerCase();
  return (
    /\bprocess\b/i.test(h) ||
    /how we (work|build|deliver)/i.test(h) ||
    /our approach|methodology|workflow/i.test(h)
  );
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
  const kwSectionMatch = content.match(/(?:Meta\s*Keywords?|Target\s+SEO\s+Keywords?|Recommended\s*Meta\s*Data)[\s\S]*?(?=(?:Page\s*Content|URL:|\*\*URL:|Meta\s*Title|Meta\s*Description|#\s*\*\*H1|##\s*\*\*H1|#\s+\*\*))/i);
  if (!kwSectionMatch) return [];

  const raw = kwSectionMatch[0];
  const backtickMatches = raw.match(/`([^`]+)`/g);
  let keywords = [];

  if (backtickMatches && backtickMatches.length > 0) {
    keywords = backtickMatches.map(clean).filter(k => k.length > 2 && !/meta keyword|recommended meta/i.test(k));
  }

  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    let cleaned = clean(line.replace(/#+/g, '').replace(/`[^`]+`/g, ''));
    if (!cleaned) continue;
    // Filter out known section headings and noise before splitting
    if (/^(meta keywords?|target seo keywords?|recommended meta data|url:|page content)$/i.test(cleaned)) continue;
    if (/^(meta keyword|recommended meta|page content)/i.test(cleaned)) continue;
    // Strip numbering like "1. ", "2. "
    cleaned = cleaned.replace(/^\d+\.\s*/, '').trim();
    if (!cleaned || cleaned.length <= 3) continue;
    const parts = cleaned.split(/,\s*/);
    for (const p of parts) {
      const trimmed = p.trim();
      if (trimmed.length > 2 && !/meta keyword|recommended meta|meta title|meta description|meta tag|page content|^url:$/i.test(trimmed)) {
        keywords.push(trimmed);
      }
    }
  }

  const seen = new Set();
  return keywords.filter(k => {
    const lower = k.toLowerCase().trim();
    if (!lower || seen.has(lower)) return false;
    if (lower.includes('page content') || lower.startsWith('http') || lower.startsWith('https')) return false;
    if (lower.includes('meta title') || lower.includes('meta description') || lower.includes('meta keyword') || lower.includes('meta tag')) return false;
    if (k.includes('|') && k.length < 120) return false;
    if (lower.startsWith('custom ') && lower.length > 80) return false;
    if (lower.startsWith('clickmasters') && lower.length > 50) return false;
    seen.add(lower);
    return true;
  });
}

// ─── Main MD Parser ──────────────────────────────────────────────────────────

function parseMainMd(content) {
  content = content.replace(/\r/g, '');
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

    // 1. Meta Title (prioritize ## **Meta Title**, then inline **Meta Title:** content, then standalone **Meta Title:** with content next line)
  const titleMatch = content.match(/\n##[ \t]*\*\*`?Meta Title`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/#[ \t]*\*\*`?Meta Title`?:\s*\*\*?[ \t]+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Title`?:\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\n\*\*`?Meta Title`?\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/\*\*Meta Title\*\*[ \t]*\n+([^\n]+)/im)
    || content.match(/Meta Title:\s*(.+?)(?:\s+\**Meta Description)/im)
    || content.match(/Meta Title:\s*([^\n]+)/im)
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
    || content.match(/Meta Description[:\s]+([^\n]+)/im)
    || content.match(/\n\s*Meta Description\s*[:\s]*\n+\s*([^\n]+)/im);
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

  // 3b. CTA extraction
  const cta = {};
  const primaryCtaMatch = content.match(/\*\*Primary CTA:\*\*\s*(.+?)(?:\s+\*\*|$)/im);
  if (primaryCtaMatch) cta.primary = clean(primaryCtaMatch[1]);
  const secondaryCtaMatch = content.match(/\*\*Secondary CTA:\*\*\s*(.+?)(?:\s+\*\*|$)/im);
  if (secondaryCtaMatch) cta.secondary = clean(secondaryCtaMatch[1]);
  out.cta = cta;

  // 4. H1 & Intro
  let h1Match = content.match(/#+\s*\**H1:\s*([^\n*]+)\**/i);
  // UIUX-style: title tacked onto Meta Description line → **UI/UX Design Services UK**
  if (!h1Match) {
    h1Match = content.match(/#+\s*\*\*Meta Description:\*\*[^\n]*?\*\*([^*\n|]+)\*\*\s*$/im);
  }
  if (!h1Match) {
    const boldHeadings = [...content.matchAll(/#+\s*\*\*([^\n*]+)\*\*/g)];
    for (const m of boldHeadings) {
      const val = clean(m[1]).toLowerCase();
      if (/^meta (title|description|keyword|data|tag)/i.test(val)) continue;
      if (/^https?:\/\//.test(val)) continue;
      if (/^seo\b/i.test(val)) continue;
      if (/^recommended meta/i.test(val)) continue;
      if (/^section\s+\d+/i.test(val)) continue;
      if (/^our\s+/i.test(val)) continue;
      if (val.length < 5) continue;
      h1Match = m;
      break;
    }
  }
  // Last resort: Meta Title before pipe
  if (!h1Match && out.metaTitle) {
    const fromMeta = out.metaTitle.split('|')[0].trim();
    if (fromMeta.length >= 10) {
      out.h1 = fromMeta;
      out.title = fromMeta;
    }
  }
  if (h1Match) {
    out.h1 = clean(h1Match[1]);
    out.title = out.h1;
  }

  // Initialize new fields
  out.process = [];
  out.techStack = [];
  out.industries = [];
  out.childServices = [];
  out.engagementModels = [];
  out.useCases = [];
  out.deliverables = [];

  let inFaq = false;
  let faqCurrent = null;

  const finalizeIntro = (paras) => {
    const metaDesc = clean(out.metaDescription || '').toLowerCase();
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
        if (/^(discuss your|book a |request |talk to )/i.test(p) && p.length < 80) return false;
        // Reject keyword-list stubs (short phrases, no sentence punctuation)
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
    // Reject keyword-stub headings (UIUX lists each keyword as # line)
    if (headingText.length < 28 && !/^H1:/i.test(headingText)) return false;
    if (/^[a-z0-9 /-]+$/.test(headingText) && headingText.length < 45) return false;
    // Explicit H1 tag (any level)
    if (/^#{1,2}\s*\**H1:\s*/i.test(t)) return true;
    // Top-level content title (Software / Web style) — not "Our …" / FAQ / CTA
    if (
      /^#\s+\*{0,2}[A-Za-z]/.test(t) &&
      !/\b(FAQs?|CTA Section|Our .+ Services|Frequently Asked)\b/i.test(t)
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
      if (
        /^(Primary CTA|Secondary CTA|CTA)\s*:/i.test(lj) ||
        /^\*\*(Primary CTA|Secondary CTA|CTA)\b/i.test(lj) ||
        /^---+\s*$/.test(lj) ||
        (/^(Discuss Your|Book a |Request |Talk to )/i.test(lj) && lj.length < 80) ||
        (/^\*\*[^*]{3,60}\*\*\s*$/.test(lj) && !/[.?!]/.test(lj) && lj.length < 80)
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

  const pushContentSection = (heading, blocks) => {
    const hLower = heading.toLowerCase();
    if (/frequently asked|\bfaqs?\b/i.test(hLower)) return;

    // ── FILTER: skip SEO metadata, empty, and stub sections ──
    if (/^(target seo keywords|seo keywords|meta (title|description|keywords|tags)|recommended meta|url:|who we are|page content|author|table of contents)/i.test(hLower)) return;
    if (/^\d+\.\s/.test(hLower)) return; // numbered steps as top-level headings
    const bodyText = blocks.filter(b => !b.isList && !b.isTable && !b.isChildBlock).map(b => b.text).join(' ').trim();
    const listItems = blocks.filter(b => b.isList).flatMap(b => b.items);
    const childBlocksEarly = blocks.filter(b => b.isChildBlock);
    // Keep sections that only contain structured child blocks (process / services)
    if (!bodyText && listItems.length === 0 && childBlocksEarly.length === 0) return;
    if (bodyText.length < 40 && listItems.length === 0 && childBlocksEarly.length === 0) return;
    // Skip tiny capability stubs — but not when they have real child blocks
    if (childBlocksEarly.length === 0 && bodyText.length < 120 && listItems.length <= 4) return;
    if (childBlocksEarly.length === 0 && !bodyText && listItems.length > 0 && listItems.length <= 6) return;
    
    if (/why choose (clickmasters|us|our)/i.test(hLower)) {
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

    // Process steps
    if (isProcessHeading(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.process.push(...childBlocks.map((b, idx) => {
          const parsed = parseStepTitle(b.title);
          return {
            step: parsed.step || idx + 1,
            title: parsed.title,
            description: b.body || '',
          };
        }));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.process.push(...listBlocks.flatMap(b => b.items.map((item, idx) => {
          const parsed = parseStepTitle(item);
          return {
            step: parsed.step || idx + 1,
            title: parsed.title,
            description: '',
          };
        })));
      }
      const textBlocks = blocks.filter(b => !b.isList && !b.isTable && !b.isChildBlock);
      if (textBlocks.length > 0) {
        out.sections.push({
          heading,
          body: textBlocks.map(b => b.text).join('\n\n'),
          items: listBlocks.flatMap(b => b.items),
        });
      }
      return;
    }

    // Tech stack
    if (
      /technolog(y|ies)|tech stack|tools? (and|&) technolog|technology stack|network (&|and) technolog|technical architecture|architecture stack/i.test(
        hLower
      )
    ) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.techStack.push(...childBlocks.map(b => ({
          category: b.title,
          items: b.items && b.items.length > 0
            ? b.items
            : (b.body ? b.body.split(/,\s*/).map(i => i.trim()).filter(Boolean) : []),
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.techStack.push({
          category: heading,
          items: listBlocks.flatMap(b => b.items),
        });
      }
      return;
    }

    // Industries
    if (/industr(y|ies)|verticals|for different industries/i.test(hLower) && !/cost|price|engagement/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.industries.push(...childBlocks.map(b => ({
          name: b.title,
          description: b.body,
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.industries.push(...listBlocks.flatMap(b => b.items.map(item => ({
          name: item,
          description: '',
        }))));
      }
      return;
    }

    // Child services — tight heading match; prefer items with real hrefs
    if (isChildServicesHeading(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      const listBlocks = blocks.filter(b => b.isList);
      const allItems = [];
      if (childBlocks.length > 0) {
        allItems.push(...childBlocks
          .filter(b => {
            const t = b.title.toLowerCase();
            if (/^(existing|user|known|our|your|the |how |what |why |when |need )/i.test(t)) return false;
            if (parseStepTitle(b.title).step) return false;
            return true;
          })
          .map(b => {
            const href =
              extractInternalLinkHref(b.body) ||
              extractInternalLinkHref((b.items || []).join('\n'));
            const description = clean(
              String(b.body || '')
                .replace(/\*\*Internal Link:\*\*[\s\S]*/i, '')
                .replace(/Internal Link:\s*\/[-a-z0-9/]+/gi, '')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
                .replace(/\s+---+\s*$/g, '')
            );
            return { title: b.title, href, description };
          }));
      }
      if (listBlocks.length > 0 && allItems.length === 0) {
        allItems.push(...listBlocks.flatMap(b => b.items.map(item => {
          const href = extractInternalLinkHref(item);
          const linkMatch = item.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            let h = linkMatch[2];
            if (h.startsWith(DOMAIN)) h = h.replace(DOMAIN, '');
            return { title: clean(linkMatch[1]), href: h.startsWith('/') ? h : href, description: '' };
          }
          return { title: clean(item), href, description: '' };
        })));
      }
      // Prefer linked children; if none linked, keep titles (Phase A can fill hrefs)
      const linked = allItems.filter(i => i.href && i.href.startsWith('/'));
      out.childServices.push(...(linked.length > 0 ? linked : allItems).slice(0, 15));
      return;
    }

    // Engagement models
    if (/engagement model|how we engage|engagement options|resourcing model|support model compar/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.engagementModels.push(...childBlocks.map(b => ({
          title: b.title,
          description: b.body,
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.engagementModels.push(...listBlocks.flatMap(b => b.items.map(item => ({
          title: item,
          description: '',
        }))));
      }
      const textBlocks = blocks.filter(b => !b.isList && !b.isTable && !b.isChildBlock);
      if (textBlocks.length > 0) {
        out.sections.push({
          heading,
          body: textBlocks.map(b => b.text).join('\n\n'),
          items: listBlocks.flatMap(b => b.items),
        });
      }
      return;
    }

    // Use cases
    if (/use cases?|when (businesses|companies|teams) use|common use cases|problems? (we |that )|we build|what we build|solutions? we deliver|what .+ can we (build|develop)/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      const listBlocks = blocks.filter(b => b.isList);
      if (childBlocks.length > 0) {
        out.useCases.push(...childBlocks.map(b => ({
          title: b.title,
          description: b.body,
          metric: '',
        })));
      }
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.useCases.push(...listBlocks.flatMap(b => b.items.map(item => ({
          title: item,
          description: '',
          metric: '',
        }))));
      }
      const textBlocks = blocks.filter(b => !b.isList && !b.isTable && !b.isChildBlock);
      if (textBlocks.length > 0) {
        out.sections.push({
          heading,
          body: textBlocks.map(b => b.text).join('\n\n'),
          items: listBlocks.flatMap(b => b.items),
        });
      }
      return;
    }

    // Deliverables
    if (/what you receive|deliverables|what you get|project deliverables/i.test(hLower)) {
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0) {
        out.deliverables.push(...listBlocks.flatMap(b => b.items));
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
  let introCollected = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();
    if (!t) continue;

    // Intro: ONLY paragraphs between page H1 and the next heading (never meta description)
    if (!introCollected && isPageH1Line(t)) {
      const { paras, end } = collectIntroFrom(i + 1);
      if (paras.length > 0) {
        out.intro = paras;
        introCollected = true;
      }
      i = end - 1;
      continue;
    }

    // UIUX-style: Meta Description heading embeds page title on the SAME line; hero copy follows
    // Must NOT match bare `**Meta Description:**` labels (support MD) — those close with `:**`
    if (
      !introCollected &&
      /^#+\s*\*\*Meta Description:\*\*/i.test(t) &&
      /\*\*[^*]{8,}\*\*\s*$/.test(t) &&
      !/^\*{0,2}Meta Description:\*{0,2}\s*$/i.test(t)
    ) {
      const { paras, end } = collectIntroFrom(i + 1);
      if (paras.length > 0) {
        out.intro = paras;
        introCollected = true;
        i = end - 1;
        continue;
      }
    }

    // Fallback: first "Looking for …" / substantial hero paragraph after meta block
    if (!introCollected && /^(Looking for |\*\*Looking for )/i.test(t) && t.length > 40) {
      const { paras, end } = collectIntroFrom(i);
      if (paras.length > 0) {
        out.intro = paras;
        introCollected = true;
        i = end - 1;
        continue;
      }
    }

    // FAQ section start — allow trailing text after "FAQs" / "Frequently Asked Questions"
    if (/^#{1,4}\s*\*\*(Frequently Asked Questions|FAQs?)\b[^*]*\*\*\s*$/i.test(t)) {
      inFaq = true;
      faqCurrent = null;
      continue;
    }

    // Exit FAQ on SECTION scaffolds or non-question top-level headings
    if (inFaq && /^#\s+\*\*(.+)\*\*\s*$/.test(t)) {
      const h = clean(t.match(/^#\s+\*\*(.+)\*\*\s*$/)[1]);
      if (isScaffoldSectionHeading(h) || (!isFaqHeading(h) && !/\?$/.test(h))) {
        inFaq = false;
        faqCurrent = null;
        // fall through so SECTION skip / section parser can handle this line
      }
    }

    // FAQ question (### **question?**) — require "?" to avoid related-service cards
    if (inFaq && /^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const q = clean(t.match(/^#{2,4}\s*\*\*(.+)\*\*\s*$/)[1]);
      if (!/\?$/.test(q)) {
        // Non-question heading inside FAQ block — leave FAQ mode if it looks like a new section
        if (isScaffoldSectionHeading(q) || /related services|final cta|child services/i.test(q)) {
          inFaq = false;
          faqCurrent = null;
        }
        continue;
      }
      faqCurrent = { question: q, answer: '' };
      out.faqs.push(faqCurrent);
      continue;
    }

    // FAQ answer text — preserve list items and blank-line paragraph breaks
    if (inFaq && faqCurrent) {
      if (/\\?<\/?script|application\/ld\+json/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        continue;
      }
      if (/^#{1,4}/.test(t) && !/FAQ/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        // don't continue — reprocess this heading on next iteration by rewinding
        i -= 1;
        continue;
      }
      if (isPlaceholderFaqNoise(t)) {
        continue;
      }
      if (startsListMarker(t)) {
        const item = clean(t.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + '\n' : '') + '- ' + item;
      } else if (t.trim() === '') {
        faqCurrent.answer = faqCurrent.answer ? faqCurrent.answer + '\n\n' : '';
      } else if (!/^\*\*Faq\s*Schema/i.test(t)) {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
      }
      continue;
    }

    // H1/H2/H3/H4 Section start — skip if in FAQ mode (h3 questions handled above)
    if (!inFaq && /^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const heading = clean(t.match(/^#{1,4}\s*\*\*(.+)\*\*\s*$/)[1]).replace(/^H1:\s*/i, '');
      if (/meta (title|description|keyword)/i.test(heading)) continue;
      // SECTION scaffolds must not swallow ##/### children (Support, NLP)
      if (isScaffoldSectionHeading(heading)) continue;
      // Page H1 must not swallow the rest of the document as child blocks
      const isPageH1 =
        /^H1:/i.test(heading) ||
        (out.h1 && clean(heading) === clean(out.h1)) ||
        (out.title && clean(heading) === clean(out.title));
      if (isPageH1) continue;

      const blocks = [];
      let j = i + 1;
      const isH1 = /^#\s+\*\*/.test(t);
      while (j < lines.length) {
        const lj = lines[j].trim();
        if (lj === '') { j++; continue; }
        if (/^<script/i.test(lj)) break;
        // Always stop at FAQ sections
        if (/^#{1,4}\s*\*\*(Frequently Asked Questions|FAQs?)\b/i.test(lj)) break;
        // Stop at next SECTION scaffold or other h1
        if (/^#\s+\*\*(.+)\*\*\s*$/.test(lj)) break;

        // Collect h2 headings as child blocks under h1
        if (isH1 && /^#{2}\s+\*\*(.+)\*\*\s*$/.test(lj)) {
          const childHeading = clean(lj.match(/^#{2}\s+\*\*(.+)\*\*\s*$/)[1]);
          const childLines = [];
          j++;
          while (j < lines.length && lines[j].trim() === '') j++;
          while (j < lines.length && lines[j].trim() !== '' && !/^#{1,4}/.test(lines[j].trim())) {
            childLines.push(lines[j].trim());
            j++;
          }
          // Also absorb following Internal Link lines (may follow a blank line)
          while (j < lines.length && lines[j].trim() === '') j++;
          while (j < lines.length) {
            const peek = lines[j].trim();
            if (/^\*\*Internal Link:\*\*/i.test(peek) || /^Internal Link:/i.test(peek)) {
              childLines.push(peek);
              j++;
              while (j < lines.length && lines[j].trim() !== '' && !/^#{1,4}/.test(lines[j].trim())) {
                childLines.push(lines[j].trim());
                j++;
              }
              while (j < lines.length && lines[j].trim() === '') j++;
              continue;
            }
            break;
          }
          const childText = [];
          const childItems = [];
          for (const cl of childLines) {
            if (startsListMarker(cl)) {
              childItems.push(clean(cl.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')));
            } else {
              childText.push(stripBoldKeepLinks(cl));
            }
          }
          blocks.push({ isChildBlock: true, title: childHeading, body: childText.join(' '), items: childItems });
          continue;
        }

        // Collect h3 headings as child blocks under h2
        if (!isH1 && /^#{3}\s+\*\*(.+)\*\*\s*$/.test(lj)) {
          const childHeading = clean(lj.match(/^#{3}\s+\*\*(.+)\*\*\s*$/)[1]);
          const childLines = [];
          j++;
          // Absorb all non-heading content until the next # heading (includes Internal Link)
          while (j < lines.length) {
            const peek = lines[j].trim();
            if (/^#{1,4}/.test(peek) || /^<script/i.test(peek)) break;
            if (peek) childLines.push(peek);
            j++;
          }
          const childText = [];
          const childItems = [];
          for (const cl of childLines) {
            if (startsListMarker(cl)) {
              childItems.push(clean(cl.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '')));
            } else {
              childText.push(stripBoldKeepLinks(cl));
            }
          }
          blocks.push({ isChildBlock: true, title: childHeading, body: childText.join(' '), items: childItems });
          continue;
        }

        // For h2+ sections, stop at h2 headings (sibling)
        if (!isH1 && /^#{2}\s+\*\*(.+)\*\*\s*$/.test(lj)) break;

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

  // Deduplicate FAQs; drop placeholder / non-question noise
  const seenFaqs = new Set();
  out.faqs = out.faqs.filter(f => {
    const q = (f.question || '').toLowerCase().trim();
    if (!q || !/\?$/.test(q) || seenFaqs.has(q)) return false;
    if (isPlaceholderFaqNoise(f.answer) || isPlaceholderFaqNoise(f.question)) return false;
    if (!f.answer || f.answer.trim().length < 20) return false;
    seenFaqs.add(q);
    return true;
  });

  // Extract internal links from all body text
  const allText = [
    ...(out.intro || []),
    ...out.sections.map(s => s.body),
    ...out.sections.flatMap(s => (s.items || []).map(i => typeof i === 'string' ? i : JSON.stringify(i))),
    ...(out.whyChoose || []).map(w => w.body),
    ...(out.whyChoose || []).flatMap(w => (w.items || []).map(i => typeof i === 'string' ? i : JSON.stringify(i))),
    ...(out.faqs || []).map(f => f.answer || ''),
    ...(out.costFactors || []).map(c => typeof c === 'string' ? c : JSON.stringify(c)),
    ...(out.tables || []).flatMap(t => (t.rows || []).map(r => Array.isArray(r) ? r.join(' ') : JSON.stringify(r))),
    ...(out.childServices || []).map(c => `${c.title} ${c.description || ''} ${c.href || ''}`),
    ...(out.process || []).map(p => `${p.title} ${p.description || ''}`),
    ...(out.useCases || []).map(u => `${u.title || ''} ${u.description || ''}`),
    ...(out.deliverables || []),
  ].join('\n');

  out.relatedLinks = extractInternalLinks(allText).filter(
    (l, idx, arr) => arr.findIndex(x => x.href === l.href) === idx && l.href !== `/${out.slug}`
  );

  // Also add child service hrefs as related links
  for (const child of out.childServices || []) {
    if (child.href && child.href.startsWith('/') && child.href !== `/${out.slug}`) {
      if (!out.relatedLinks.some(l => l.href === child.href)) {
        out.relatedLinks.push({ label: child.title, href: child.href });
      }
    }
  }

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
