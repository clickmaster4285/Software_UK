/**
 * Generate a lightweight case-study cards file for client components.
 * Keeps listing pages / service inlinks without shipping full case-study bodies.
 */
const fs = require('fs');
const path = require('path');

const { caseStudyListings } = require('../data/case-studies.js');

const cards = caseStudyListings.map((cs) => ({
  slug: cs.slug,
  title: cs.title,
  excerpt: cs.metaDesc || '',
  sector: cs.sector || '',
  industry: (cs.sector || '').split('/')[0]?.trim() || '',
  technologies: (cs.technologies || []).slice(0, 6),
  country: cs.country || 'UK',
}));

const out = `/**
 * Lightweight case-study cards for client components (auto-generated).
 * Source: data/case-studies.js listings — do not edit by hand.
 * Regenerate: node scripts/generate-case-study-cards.js
 */

export const caseStudyCards = ${JSON.stringify(cards, null, 2)};

export function getFeaturedCaseStudyCards(count = 6) {
  const preferred = ['FinTech', 'HealthTech', 'GovTech', 'EdTech', 'PropTech', 'eCommerce'];
  const picked = [];
  const used = new Set();
  for (const sector of preferred) {
    const match = caseStudyCards.find((cs) => !used.has(cs.slug) && cs.industry === sector);
    if (match) {
      picked.push(match);
      used.add(match.slug);
    }
    if (picked.length >= count) break;
  }
  for (const cs of caseStudyCards) {
    if (picked.length >= count) break;
    if (used.has(cs.slug)) continue;
    picked.push(cs);
    used.add(cs.slug);
  }
  return picked;
}

export function filterCaseStudyCardsForService(serviceName, limit = 6) {
  if (!serviceName) return caseStudyCards.slice(0, limit);
  const q = String(serviceName).toLowerCase();
  const related = caseStudyCards.filter(
    (study) =>
      study.title?.toLowerCase().includes(q) ||
      study.sector?.toLowerCase().includes(q) ||
      study.industry?.toLowerCase().includes(q) ||
      study.technologies?.some((t) => t.toLowerCase().includes(q))
  );
  return (related.length > 0 ? related : caseStudyCards).slice(0, limit);
}
`;

const outPath = path.join(__dirname, '..', 'data', 'case-study-cards.js');
fs.writeFileSync(outPath, out);
console.log('Wrote', outPath, 'cards:', cards.length);
