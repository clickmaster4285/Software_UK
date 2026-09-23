'use client';

import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { linkifyMarkdown, stripCtaArtifacts } from '@/lib/subservice-utils';
import { isCompactSection, normalizeCtaLabel } from './lib';

export function ContentCtaButtons({ primary, secondary }) {
  const primaryLabel = normalizeCtaLabel(primary);
  const secondaryLabel = normalizeCtaLabel(secondary);
  if (!primaryLabel && !secondaryLabel) return null;
  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {primaryLabel && (
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-accent to-accent-hover px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_16px_oklch(0.5675_0.2072_318.97/0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_oklch(0.5675_0.2072_318.97/0.4)]"
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
      {secondaryLabel && (
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-5 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-accent/40 hover:text-accent"
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}

export function ComparisonTable({ table }) {
  if (!table?.headers?.length) return null;
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-border/80 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-surface">
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className="px-4 py-3 text-left font-heading text-sm font-semibold text-text-primary whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows?.map((row, ri) => (
              <tr key={ri} className="border-b border-border/40 last:border-0">
                {row.map((cell, ci) => (
                  <td
                    key={ci}
                    className="px-4 py-3 text-text-body leading-relaxed align-top"
                    dangerouslySetInnerHTML={{
                      __html: linkifyMarkdown(String(cell || '')),
                    }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RenderedBody({ body, compact, cta }) {
  if (!body && !cta?.primary && !cta?.secondary) return null;
  const { text, primaryCta, secondaryCta } = stripCtaArtifacts(body || '');
  const primary = normalizeCtaLabel(primaryCta || cta?.primary);
  const secondary = normalizeCtaLabel(secondaryCta || cta?.secondary);
  if (!text && !primary && !secondary) return null;

  const parts = text
    .replace(/^---$/gm, '')
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !/^(Primary|Secondary)\s+CTA/i.test(p));

  return (
    <div className="space-y-4">
      {parts.length > 0 && (
        <div
          className={`space-y-4 font-body text-text-body leading-relaxed [&_a]:text-accent [&_a]:font-medium [&_a:hover]:underline [&_strong]:text-text-primary [&_strong]:font-semibold ${
            compact
              ? 'text-sm md:text-[0.95rem] leading-snug'
              : 'max-w-[62ch] text-base md:text-lg leading-[1.7]'
          }`}
        >
          {parts.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: linkifyMarkdown(p) }} />
          ))}
        </div>
      )}
      {(primary || secondary) && (
        <ContentCtaButtons primary={primary} secondary={secondary} />
      )}
    </div>
  );
}

export function ItemList({ items, compact }) {
  if (!items?.length) return null;

  if (compact) {
    return (
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm text-text-body font-body"
          >
            <Check
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
              strokeWidth={2.5}
              aria-hidden
            />
            <span dangerouslySetInnerHTML={{ __html: linkifyMarkdown(item) }} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 max-w-3xl">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-white px-3.5 py-3 text-sm text-text-body font-body"
        >
          <Check
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent"
            strokeWidth={2.5}
            aria-hidden
          />
          <span dangerouslySetInnerHTML={{ __html: linkifyMarkdown(item) }} />
        </li>
      ))}
    </ul>
  );
}

export function CompactCard({ section, tables, index }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border/70 bg-white p-5 shadow-[0_1px_10px_rgba(0,0,0,0.03)] transition-shadow duration-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] hover:border-accent/25">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-heading text-[11px] font-bold tabular-nums text-accent"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="font-heading text-base md:text-[1.05rem] font-bold text-text-primary leading-snug tracking-tight">
          {section.heading}
        </h3>
      </div>
      <RenderedBody body={section.body} compact cta={section.cta} />
      <ItemList items={section.items} compact />
      {tables?.map((t, i) => (
        <div key={i} className="mt-3">
          <ComparisonTable table={t} />
        </div>
      ))}
    </article>
  );
}

export function ProseBlock({ section, tables, index }) {
  return (
    <article className="max-w-3xl scroll-mt-36">
      <div className="flex items-start gap-3">
        <span
          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 font-heading text-xs font-bold tabular-nums text-accent"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <h3 className="font-heading text-xl md:text-2xl font-bold text-text-primary leading-snug tracking-tight text-balance">
            {section.heading}
          </h3>
          <div className="mt-4">
            <RenderedBody body={section.body} cta={section.cta} />
            <ItemList items={section.items} />
            {tables?.map((t, i) => (
              <div key={i} className="mt-2">
                {t.title && t.title !== section.heading && (
                  <h4 className="mt-6 mb-2 font-heading text-base font-semibold text-text-primary">
                    {t.title}
                  </h4>
                )}
                <ComparisonTable table={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Default body renderer: compact tiles in a grid, longer copy as prose. */
export function DefaultGroupBody({ sections, tables = [], gridClassName }) {
  const stream = [];
  let buf = [];
  sections.forEach((section, i) => {
    const matchedTables = tables.filter((t) => t.title === section.heading);
    const entry = { section, tables: matchedTables, index: i };
    if (isCompactSection(section) && matchedTables.length === 0) {
      buf.push(entry);
    } else {
      if (buf.length) {
        stream.push({ type: 'grid', items: buf });
        buf = [];
      }
      stream.push({ type: 'prose', ...entry });
    }
  });
  if (buf.length) stream.push({ type: 'grid', items: buf });

  return (
    <div className="space-y-8 md:space-y-10">
      {stream.map((block, bi) => {
        if (block.type === 'grid') {
          return (
            <div
              key={`grid-${bi}`}
              className={
                gridClassName || 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
              }
            >
              {block.items.map((item) => (
                <CompactCard
                  key={`${item.section.heading}-${item.index}`}
                  section={item.section}
                  tables={item.tables}
                  index={item.index}
                />
              ))}
            </div>
          );
        }
        return (
          <ProseBlock
            key={`${block.section.heading}-${block.index}`}
            section={block.section}
            tables={block.tables}
            index={block.index}
          />
        );
      })}
    </div>
  );
}

export function ChapterShell({
  label,
  chapterId,
  isFirst,
  children,
  orphanTables = [],
  className = '',
}) {
  return (
    <section id={chapterId} data-chapter={label} className={`scroll-mt-36 ${className}`}>
      <header className="mb-6 md:mb-8 max-w-3xl">
        <h2
          className="font-heading text-2xl md:text-3xl font-bold text-text-primary tracking-tight"
          {...(isFirst ? { id: 'content-sections-heading' } : {})}
        >
          {label}
        </h2>
        <div className="mt-3 h-1 w-12 rounded-full bg-accent" aria-hidden />
      </header>

      {children}

      {orphanTables.map((t, i) => (
        <div key={`orphan-table-${i}`} className="mt-8 max-w-4xl">
          {t.title && (
            <h3 className="mb-3 font-heading text-lg font-semibold text-text-primary">
              {t.title}
            </h3>
          )}
          <ComparisonTable table={t} />
        </div>
      ))}
    </section>
  );
}
