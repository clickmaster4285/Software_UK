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
  if (!h1Match) {
    const boldHeadings = [...content.matchAll(/#+\s*\*\*([^\n*]+)\*\*/g)];
    for (const m of boldHeadings) {
      const val = clean(m[1]).toLowerCase();
      if (/^meta (title|description|keyword|data|tag)/i.test(val)) continue;
      if (/^https?:\/\//.test(val)) continue;
      if (/^seo\b/i.test(val)) continue;
      if (/^recommended meta/i.test(val)) continue;
      if (val.length < 5) continue;
      h1Match = m;
      break;
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
  let foundFirstHeading = false;

  const pushContentSection = (heading, blocks) => {
    const hLower = heading.toLowerCase();
    if (/frequently asked|\bfaqs?\b/i.test(hLower)) return;

    // ── FILTER: skip SEO metadata, empty, and stub sections ──
    if (/^(target seo keywords|seo keywords|meta (title|description|keywords|tags)|recommended meta|url:|who we are|page content|author|table of contents)/i.test(hLower)) return;
    if (/^\d+\.\s/.test(hLower)) return; // numbered steps (1. Problem Discovery)
    const bodyText = blocks.filter(b => !b.isList && !b.isTable).map(b => b.text).join(' ').trim();
    const listItems = blocks.filter(b => b.isList).flatMap(b => b.items);
    if (!bodyText && listItems.length === 0) return; // completely empty section
    if (bodyText.length < 40 && listItems.length === 0) return; // too short to be useful

    // ── FILTER: skip tiny sub-service detail stubs (items-only, < 6 items, no body) ──
    if (!bodyText && listItems.length > 0 && listItems.length <= 6) return;

    // ── FILTER: skip small capability stubs (short body < 120 chars, no items or ≤4 items) ──
    // These are individual capability descriptions that belong in childServices
    if (bodyText.length < 120 && listItems.length <= 4) return;
    
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
    if (/our .+ process|how we (work|build|deliver)|our approach|development process|design process|our .+ (workflow|methodology|approach)/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.process.push(...childBlocks.map((b, idx) => ({
          step: idx + 1,
          title: b.title,
          description: b.body,
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.process.push(...listBlocks.flatMap(b => b.items.map((item, idx) => ({
          step: idx + 1,
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

    // Tech stack
    if (/technolog(y|ies) (used|we use|stack)|tech stack|tools? and technolog/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.techStack.push(...childBlocks.map(b => ({
          category: b.title,
          items: b.items && b.items.length > 0 ? b.items : (b.body ? b.body.split(/,\s*/).map(i => i.trim()).filter(Boolean) : []),
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.techStack.push(...listBlocks.flatMap(b => b.items));
      }
      return;
    }

    // Industries
    if (/industr(y|ies)/i.test(hLower) && !/cost|price|engagement/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      if (childBlocks.length > 0) {
        out.industries.push(...childBlocks.map(b => ({
          name: b.title,
          description: b.body,
        })));
      }
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0 && childBlocks.length === 0) {
        out.industries.push(...listBlocks.flatMap(b => b.items));
      }
      return;
    }

    // Child services
    if (/our .+ services|core services|what we offer|our offerings|child services|explore our|explore the/i.test(hLower) && !/compar/i.test(hLower)) {
      const childBlocks = blocks.filter(b => b.isChildBlock);
      const listBlocks = blocks.filter(b => b.isList);
      const allItems = [];
      if (childBlocks.length > 0) {
        allItems.push(...childBlocks
          .filter(b => {
            const t = b.title.toLowerCase();
            if (/^(existing|user|known|our|your|the |how |what |why |when )/i.test(t)) return false;
            if (/^(authentication|access|application|network|data|security config|requirements|gap|policy|risk|remediation|control|documentation)/i.test(t)) return false;
            return true;
          })
          .map(b => {
            const linkMatch = b.body.match(/\[([^\]]+)\]\(([^)]+)\)/);
            let href = '';
            if (linkMatch) {
              href = linkMatch[2];
              if (href.startsWith(DOMAIN)) href = href.replace(DOMAIN, '');
            }
            return { title: b.title, href, description: b.body.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').trim() };
          }));
      }
      if (listBlocks.length > 0 && allItems.length === 0) {
        allItems.push(...listBlocks.flatMap(b => b.items.map(item => {
          const linkMatch = item.match(/\[([^\]]+)\]\(([^)]+)\)/);
          if (linkMatch) {
            let href = linkMatch[2];
            if (href.startsWith(DOMAIN)) href = href.replace(DOMAIN, '');
            return { title: clean(linkMatch[1]), href, description: '' };
          }
          return { title: item, href: '', description: '' };
        })));
      }
      out.childServices.push(...allItems);
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

    // Engagement models
    if (/engagement model|how we engage|engagement options/i.test(hLower)) {
      const listBlocks = blocks.filter(b => b.isList);
      if (listBlocks.length > 0) {
        out.engagementModels.push(...listBlocks.flatMap(b => b.items));
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

    // Use cases
    if (/use cases?|when (businesses|companies|teams) use|common use cases|use cases? (we |that )|problems? (we |that )|solutions? (we |that )|we build|what we build|solutions? we deliver/i.test(hLower)) {
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

    // Intro extraction: find the first substantial paragraph block after H1 heading
    // This handles all MD structures: pre-heading intro, post-H1 intro, post-meta intro
    if (/^#{1,4}\s/.test(t)) foundFirstHeading = true;
    if (!introCollected && !out.intro.length) {
    // Skip until we find the first heading (intro comes after H1)
    if (!foundFirstHeading) continue;
    // Skip meta sections (numbered keywords, Meta Title/Description blocks, URLs)
    if (/^#+\s/.test(t) && /(meta|keyword|url|target seo)/i.test(t)) continue;
    if (/^\d+\.\s/.test(t) && t.length < 80) continue; // numbered keyword list
    if (/^https?:\/\//i.test(t)) continue;
    if (/^\*\*(Meta|URL|Primary CTA|Secondary CTA)/i.test(t)) continue;

      // Check if this line starts a real content paragraph
      const isUrlLine = t.startsWith('/') || t.startsWith('https://') || (t.charCodeAt(0) === 96);
      if (t.length > 30 && !isUrlLine && !/^#{1,4}\s/.test(t) && !/^\*\*Meta/i.test(t) && !/^\*\*URL/i.test(t) && !/\|\s*Click/i.test(t)) {
        const introParas = [];
        let j = i;
          while (j < lines.length) {
            const lj = lines[j].trim();
            // Stop at: heading, meta block, keyword list, URL line, CTA line
            if (/^#{1,4}\s/.test(lj)) break;
            if (/^\*\*(Meta|URL|Primary CTA|Secondary CTA|CTA)\b/i.test(lj)) break;
            if (/^\*\*Meta Description[:*]/i.test(lj)) break;
            if (/^https?:\/\//i.test(lj)) break;
            if (lj.startsWith('/') || lj.charCodeAt(0) === 96) break;
            if (/^#+\s/.test(lj) && /(meta|keyword|url|target seo)/i.test(lj)) break;
            if (/^\d+\.\s/.test(lj) && lj.length < 80) break;
            if (/\|\s*Click/i.test(lj)) break;
            if (/^\*\*[A-Z]/.test(lj) && /\b(services?|company|UK|Clickmasters|Click)\b/i.test(lj) && lj.length < 200) break;
            // Skip CTA lines, separator lines, and very short lines
            if (/^(Primary CTA|Secondary CTA|CTA):/i.test(lj)) break;
            if (/^---+\s*$/.test(lj)) break;
            if (lj && !startsListMarker(lj) && lj.length >= 20) {
              introParas.push(stripBoldKeepLinks(lj));
            }
            j++;
          }
        if (introParas.length > 0) {
          out.intro = introParas.filter(p => {
            const pl = p.toLowerCase();
            if (/^(primary cta|secondary cta|cta)\s*:/i.test(p)) return false;
            if (/^---+\s*$/.test(p)) return false;
            if (/page content/i.test(pl)) return false;
            if (/meta (title|description|keyword)/i.test(pl)) return false;
            return true;
          });
          introCollected = true;
          i = j - 1;
          continue;
        }
      }
    }

    // Intro extraction between H1 and first H2 (fallback for MDs with H1: tag)
    if (!out.intro.length && (/^#{1,2}\s*\**H1:/i.test(t) || (/^#\s*\*\*/.test(t) && !/meta/i.test(t) && !out.intro.length))) {
      let j = i + 1;
      const introParas = [];
      while (j < lines.length && !/^#{1,4}\s*\*\*/.test(lines[j].trim())) {
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
    if (/^#{1,4}\s*\*\*(Frequently Asked Questions|FAQs?)(\s+About|\s+For|\s+—|\s+[-–]|:|\s*\w+\s+\w+\s+\w+)?\s*\*\*/i.test(t)) {
      inFaq = true;
      continue;
    }

    // FAQ question (### **question**) — must be BEFORE heading detection
    if (inFaq && /^#{2,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const q = t.match(/^#{2,4}\s*\*\*(.+)\*\*\s*$/)[1].trim();
      faqCurrent = { question: clean(q), answer: '' };
      out.faqs.push(faqCurrent);
      continue;
    }

    // FAQ answer text — must be BEFORE heading detection
    if (inFaq && faqCurrent) {
      if (/\\?<\/?script|application\/ld\+json/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        continue;
      }
      if (/^#{1,4}/.test(t) && !/FAQ/i.test(t)) {
        inFaq = false;
        faqCurrent = null;
        continue;
      }
      if (startsListMarker(t)) {
        const item = clean(t.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, ''));
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + '\n' : '') + '- ' + item;
      } else if (!/^\*\*Faq\s*Schema/i.test(t)) {
        faqCurrent.answer = (faqCurrent.answer ? faqCurrent.answer + ' ' : '') + clean(t);
      }
      continue;
    }

    // H1/H2/H3/H4 Section start — skip if in FAQ mode (h3 questions handled above)
    if (!inFaq && /^#{1,4}\s*\*\*(.+)\*\*\s*$/.test(t)) {
      const heading = clean(t.match(/^#{1,4}\s*\*\*(.+)\*\*\s*$/)[1]).replace(/^H1:\s*/i, '');
      if (/meta (title|description|keyword)/i.test(heading)) continue;

      if (inFaq) {
        inFaq = false;
        faqCurrent = null;
      }

      const blocks = [];
      let j = i + 1;
      const isH1 = /^#\s+\*\*/.test(t);
      while (j < lines.length) {
        const lj = lines[j].trim();
        if (lj === '') { j++; continue; }
        if (/^<script/i.test(lj)) break;
        // Always stop at FAQ sections
        if (/^#{1,4}\s*\*\*(Frequently Asked Questions|FAQs?)\s*\*\*/i.test(lj)) break;
        // Stop at h1 headings (new top-level section)
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
          while (j < lines.length && lines[j].trim() === '') j++;
          while (j < lines.length && lines[j].trim() !== '' && !/^#{1,4}/.test(lines[j].trim())) {
            childLines.push(lines[j].trim());
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

  // Deduplicate FAQs
  const seenFaqs = new Set();
  out.faqs = out.faqs.filter(f => {
    const q = f.question.toLowerCase().trim();
    if (!q || seenFaqs.has(q)) return false;
    seenFaqs.add(q);
    return true;
  });

  // Extract internal links from all body text (intro, sections, whyChoose, FAQs, costFactors, tables)
  const allText = [
    ...(out.intro || []),
    ...out.sections.map(s => s.body),
    ...out.sections.flatMap(s => (s.items || []).map(i => typeof i === 'string' ? i : JSON.stringify(i))),
    ...(out.whyChoose || []).map(w => w.body),
    ...(out.whyChoose || []).flatMap(w => (w.items || []).map(i => typeof i === 'string' ? i : JSON.stringify(i))),
    ...(out.faqs || []).map(f => f.answer || ''),
    ...(out.costFactors || []).map(c => typeof c === 'string' ? c : JSON.stringify(c)),
    ...(out.tables || []).flatMap(t => (t.rows || []).map(r => Array.isArray(r) ? r.join(' ') : JSON.stringify(r))),
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
