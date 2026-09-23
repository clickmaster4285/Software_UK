'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { groupServiceContent, slugChapter } from './lib';
import { DefaultGroupBody, ContentCtaButtons } from './primitives';
import ContentJumpNav from './ContentJumpNav';
import OverviewContent from './groups/OverviewContent';
import ServicesContent from './groups/ServicesContent';
import CapabilitiesContent from './groups/CapabilitiesContent';
import HowItWorksContent from './groups/HowItWorksContent';
import TechnologyContent from './groups/TechnologyContent';
import UseCasesContent from './groups/UseCasesContent';
import InvestmentContent from './groups/InvestmentContent';
import DeliverablesContent from './groups/DeliverablesContent';
import DetailsContent from './groups/DetailsContent';

const EASE = [0.22, 1, 0.36, 1];

/** One component per chapter — edit groups/*.jsx individually. */
export const GROUP_COMPONENTS = {
  Overview: OverviewContent,
  Services: ServicesContent,
  Capabilities: CapabilitiesContent,
  'How It Works': HowItWorksContent,
  Technology: TechnologyContent,
  'Use Cases': UseCasesContent,
  Investment: InvestmentContent,
  Deliverables: DeliverablesContent,
  Details: DetailsContent,
};

function ChapterLayout({ orderedGroups, groups, tableGroups }) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const [active, setActive] = useState(orderedGroups[0]);
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const nodes = orderedGroups
      .map((label) =>
        root.querySelector(`[data-chapter="${CSS.escape(label)}"]`)
      )
      .filter(Boolean);
    if (!nodes.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.dataset?.chapter) {
          setActive(visible[0].target.dataset.chapter);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.25, 0.5] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [orderedGroups]);

  const scrollToChapter = (label) => {
    setActive(label);
    const el = rootRef.current?.querySelector(
      `[data-chapter="${CSS.escape(label)}"]`
    );
    if (el) {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={rootRef} className="space-y-12 md:space-y-16">
      <ContentJumpNav
        orderedGroups={orderedGroups}
        groups={groups}
        active={active}
        onSelect={scrollToChapter}
        baseId={baseId}
      />

      <div className="space-y-16 md:space-y-20">
        {orderedGroups.map((label, chapterIdx) => {
          const Group = GROUP_COMPONENTS[label] || DetailsContent;
          const chapterSections = groups.get(label) || [];
          const chapterTables = tableGroups.get(label) || [];
          const orphanTables = chapterTables.filter(
            (t) => !chapterSections.some((s) => s.heading === t.title)
          );

          return (
            <motion.div
              key={label}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.45,
                delay: Math.min(chapterIdx * 0.03, 0.12),
                ease: EASE,
              }}
            >
              <Group
                sections={chapterSections}
                tables={chapterTables}
                orphanTables={orphanTables}
                chapterId={`${baseId}-chapter-${slugChapter(label)}`}
                isFirst={chapterIdx === 0}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function FlatDocument({ sections, tables }) {
  const reduce = useReducedMotion();
  return (
    <div className="space-y-8">
      <header className="max-w-3xl">
        <h2
          id="content-sections-heading"
          className="font-heading text-2xl md:text-3xl font-bold text-text-primary tracking-tight"
        >
          What we deliver
        </h2>
        <div className="mt-3 h-1 w-12 rounded-full bg-accent" aria-hidden />
      </header>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <DefaultGroupBody sections={sections} tables={tables || []} />
      </motion.div>
    </div>
  );
}

/**
 * Composer only — does not own per-group layout.
 * Fix one group at a time under ./groups/
 */
export function ContentSections({ serviceData }) {
  const tables = serviceData?.tables;
  const pageCta = serviceData?.cta || null;

  // Attach / complete CTAs on closing sections from page-level MD labels
  const sections = (serviceData?.sections || []).map((s) => {
    const isClosing =
      /^ready to |^let.?s |final cta|next step|get started|talk to us/i.test(
        s.heading || ''
      );
    if (!pageCta && !s.cta) return s;
    if (s.cta?.primary || s.cta?.secondary || isClosing) {
      return {
        ...s,
        cta: {
          primary: s.cta?.primary || (isClosing ? pageCta?.primary : null) || null,
          secondary:
            s.cta?.secondary || (isClosing ? pageCta?.secondary : null) || null,
        },
      };
    }
    return s;
  });

  const hasSections = sections?.length > 0;
  const hasTables = tables?.length > 0;
  if (!hasSections && !hasTables) return null;

  const { groups, tableGroups, orderedGroups } = groupServiceContent(
    sections || [],
    tables || []
  );
  const useChapters = sections.length > 6 && orderedGroups.length > 1;
  const anySectionCta = sections.some((s) => s.cta?.primary || s.cta?.secondary);

  return (
    <section
      className="relative overflow-hidden py-14 md:py-20 border-t border-border/50 bg-surface/50"
      id="md-content"
      aria-labelledby="content-sections-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, oklch(0.78 0.02 250 / 0.4) 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] px-4 sm:px-6 lg:px-8">
        {useChapters ? (
          <ChapterLayout
            orderedGroups={orderedGroups}
            groups={groups}
            tableGroups={tableGroups}
          />
        ) : (
          <FlatDocument sections={sections} tables={tables} />
        )}

        {/* Page CTAs when no section carried buttons (hero already shows them above) */}
        {!anySectionCta && pageCta?.primary && (
          <div className="mt-12 md:mt-16 flex flex-wrap items-center justify-center gap-3 border-t border-border/60 pt-10">
            <ContentCtaButtons
              primary={pageCta.primary}
              secondary={pageCta.secondary}
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default ContentSections;
