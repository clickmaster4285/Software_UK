/**
 * Shared grouping + helpers for MD content chapters.
 * Edit a group's match rules here; edit layout in groups/*.jsx
 */

export const GROUP_PATTERNS = [
  {
    id: 'overview',
    label: 'Overview',
    match:
      /^(what (are|is)|overview|introduction|about|for (intelligent|ongoing)|built around|development services|outsourcing for)/i,
  },
  {
    id: 'services',
    label: 'Services',
    match:
      /(development|services?|solutions?|we (build|offer|provide|deliver)|capabilities|offerings)/i,
  },
  {
    id: 'capabilities',
    label: 'Capabilities',
    match:
      /(recognition|detection|tracking|segmentation|classification|analysis|extraction|processing|intelligence|search|interfaces?|applications?|workflows?)/i,
  },
  {
    id: 'how-it-works',
    label: 'How It Works',
    match:
      /(how .+ (work|works|together)|process|approach|methodology|lifecycle|integration|architecture)/i,
  },
  {
    id: 'technology',
    label: 'Technology',
    match:
      /(technolog|tech stack|tools?|platform|infrastructure|cloud|edge|deployment|training|model|deep learning|data prep|labell)/i,
  },
  {
    id: 'use-cases',
    label: 'Use Cases',
    match:
      /(use cases?|we build|what we build|solutions? we deliver|business problems|can solve)/i,
  },
  {
    id: 'investment',
    label: 'Investment',
    match:
      /(cost|price|pricing|how much|how long|timeline|engagement|budget)/i,
  },
  {
    id: 'deliverables',
    label: 'Deliverables',
    match:
      /(what you receive|deliverables|what you get|project deliverables)/i,
  },
];

export const GROUP_ORDER = [
  'Overview',
  'Services',
  'Capabilities',
  'How It Works',
  'Technology',
  'Use Cases',
  'Investment',
  'Deliverables',
  'Details',
];

export function assignGroup(heading) {
  for (const g of GROUP_PATTERNS) {
    if (g.match.test(heading)) return g.label;
  }
  return 'Details';
}

export function slugChapter(label) {
  return String(label)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function isCompactSection(section) {
  const body = typeof section.body === 'string' ? section.body.trim() : '';
  const items = Array.isArray(section.items) ? section.items.filter(Boolean) : [];
  if (items.length > 4) return false;
  if (body.length > 320) return false;
  if (body.split(/\n\n+/).filter(Boolean).length > 2) return false;
  return true;
}

export function groupServiceContent(sections = [], tables = []) {
  const groups = new Map();
  sections.forEach((section) => {
    const group = assignGroup(section.heading);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(section);
  });

  const tableGroups = new Map();
  tables.forEach((t) => {
    const group = assignGroup(t.title || '');
    if (!tableGroups.has(group)) tableGroups.set(group, []);
    tableGroups.get(group).push(t);
  });

  const orderedGroups = GROUP_ORDER.filter((g) => groups.has(g));
  return { groups, tableGroups, orderedGroups };
}
