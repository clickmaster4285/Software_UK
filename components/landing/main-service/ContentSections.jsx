'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Table2, ChevronDown, ChevronRight } from 'lucide-react';
import { linkifyMarkdown } from '@/lib/subservice-utils';

const EASE = [0.22, 1, 0.36, 1];

/* ── Grouping patterns ── */
const GROUP_PATTERNS = [
  { label: 'Overview', match: /^(what (are|is)|overview|introduction|about|for (intelligent|ongoing)|built around|development services|outsourcing for)/i },
  { label: 'Services', match: /(development|services?|solutions?|we (build|offer|provide|deliver)|capabilities|offerings)/i },
  { label: 'Capabilities', match: /(recognition|detection|tracking|segmentation|classification|analysis|extraction|processing|intelligence|search|interfaces?|applications?|workflows?)/i },
  { label: 'How It Works', match: /(how .+ (work|works|together)|process|approach|methodology|lifecycle|integration|architecture)/i },
  { label: 'Technology', match: /(technolog|tech stack|tools?|platform|infrastructure|cloud|edge|deployment|training|model|deep learning|data prep|labell)/i },
  { label: 'Use Cases', match: /(use cases?|we build|what we build|solutions? we deliver|business problems|can solve)/i },
  { label: 'Investment', match: /(cost|price|pricing|how much|how long|timeline|engagement|budget)/i },
  { label: 'Deliverables', match: /(what you receive|deliverables|what you get|project deliverables)/i },
];

function assignGroup(heading) {
  for (const g of GROUP_PATTERNS) {
    if (g.match.test(heading)) return g.label;
  }
  return 'Details';
}

/* ── Table ── */
function ComparisonTable({ table }) {
  if (!table?.headers?.length) return null;
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <table className="w-full text-sm font-body">
        <thead>
          <tr className="border-b-2 border-accent/30">
            {table.headers.map((h, i) => (
              <th key={i} className="py-3 px-4 text-left font-semibold text-text-primary bg-accent/5 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows?.map((row, ri) => (
            <tr key={ri} className="border-b border-border/40 last:border-0 hover:bg-surface/40 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="py-3 px-4 text-text-body leading-relaxed" dangerouslySetInnerHTML={{ __html: linkifyMarkdown(String(cell || '')) }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Body renderer ── */
function RenderedBody({ body }) {
  if (!body) return null;
  return (
    <div
      className="text-text-body font-body leading-relaxed space-y-4 [&_p]:text-base [&_p]:md:text-lg [&_a]:text-accent [&_a]:font-medium [&_a:hover]:underline [&_strong]:text-text-primary [&_strong]:font-semibold [&_hr]:border-border [&_hr]:my-8"
      dangerouslySetInnerHTML={{ __html: linkifyMarkdown(body.replace(/^---$/gm, '<hr />')) }}
    />
  );
}

/* ── Item list ── */
function ItemList({ items }) {
  if (!items?.length) return null;
  return (
    <ul className="mt-5 space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm md:text-base text-text-body font-body">
          <span className="mt-1 h-5 w-5 shrink-0 rounded-full bg-accent/10 flex items-center justify-center">
            <Check className="h-3 w-3 text-accent" aria-hidden />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Single section card ── */
function SectionCard({ section, tables }) {
  return (
    <div className="rounded-xl border border-border/60 bg-white p-6 md:p-8 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <h3 className="font-heading text-lg md:text-xl font-bold text-text-primary mb-4 leading-snug">{section.heading}</h3>
      <RenderedBody body={section.body} />
      <ItemList items={section.items} />
      {tables?.map((t, i) => (
        <div key={i} className="mt-6">
          {t.title && <h4 className="font-heading text-base font-semibold text-text-primary mb-3">{t.title}</h4>}
          <ComparisonTable table={t} />
        </div>
      ))}
    </div>
  );
}

/* ── Grouped section with accordion ── */
function SectionGroup({ label, sections, tables, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 md:p-6 text-left group hover:bg-surface/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-90' : ''}`} />
          </span>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-text-primary">{label}</h2>
          <span className="text-xs font-medium text-text-muted bg-surface px-2 py-0.5 rounded-full">{sections.length}</span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-4">
              {sections.map((section, i) => (
                <SectionCard key={i} section={section} tables={tables?.filter(t => t.title === section.heading)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Main component ── */
export function ContentSections({ serviceData }) {
  const sections = serviceData?.sections;
  const tables = serviceData?.tables;

  const hasSections = sections?.length > 0;
  const hasTables = tables?.length > 0;
  if (!hasSections && !hasTables) return null;

  // Group sections by category
  const groups = new Map();
  if (hasSections) {
    sections.forEach(section => {
      const group = assignGroup(section.heading);
      if (!groups.has(group)) groups.set(group, []);
      groups.get(group).push(section);
    });
  }

  // Match tables to groups
  const tableGroups = new Map();
  if (hasTables) {
    tables.forEach(t => {
      const group = assignGroup(t.title || '');
      if (!tableGroups.has(group)) tableGroups.set(group, []);
      tableGroups.get(group).push(t);
    });
  }

  const groupOrder = ['Overview', 'Services', 'Capabilities', 'How It Works', 'Technology', 'Use Cases', 'Investment', 'Deliverables', 'Details'];
  const orderedGroups = groupOrder.filter(g => groups.has(g));

  // If few sections, render flat (no accordion)
  const isFlat = sections.length <= 6;

  return (
    <section className="relative py-16 md:py-24 bg-surface/30" aria-labelledby="content-sections-heading">
      <div className="mx-auto max-w-[96vw] lg:max-w-[85vw] px-4 sm:px-6 lg:px-8">
        {isFlat ? (
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <SectionCard section={section} tables={tables?.filter(t => t.title === section.heading)} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {orderedGroups.map((group, i) => (
              <motion.div
                key={group}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
              >
                <SectionGroup
                  label={group}
                  sections={groups.get(group)}
                  tables={tableGroups.get(group)}
                  defaultOpen={i < 2}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ContentSections;
