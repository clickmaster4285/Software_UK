"use client";

import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { linkifyMarkdown } from "@/lib/subservice-utils";

/**
 * ServiceRichContent
 * =================
 * Optional renderer for the MD-rich fields that the source .md files carry but
 * the old data file compressed/lost: the long intro paragraph(s), cost-factor
 * lists, the "Why Choose Clickmasters" block, and contextual related-service
 * links.
 *
 * Every block is conditionally rendered (no-op when the field is absent), so
 * this is safe to wire up before the data conversion populates the fields.
 */
export default function ServiceRichContent({ page }) {
  if (!page) return null;

  const intro = Array.isArray(page.intro)
    ? page.intro
    : page.intro ? [page.intro] : [];

  const costFactors = (page.costFactors || []).filter(Boolean);
  const whyChoose = (page.whyChoose || []).filter(Boolean);
  const relatedLinks = (page.relatedLinks || []).filter(Boolean);

  if (
    intro.length === 0 &&
    costFactors.length === 0 &&
    whyChoose.length === 0 &&
    relatedLinks.length === 0
  ) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-[96vw] lg:max-w-[90vw] -mx-4 overflow-hidden px-4 py-10 sm:rounded-2xl md:py-14">
      {/* ── Intro paragraph(s) ── */}
      {intro.length > 0 && (
        <section id="overview-body" className="scroll-mt-20">
          <div className="max-w-4xl">
            {intro.map((paragraph, pIdx) => (
              <p
                key={pIdx}
                className={cn(
                  "text-lg leading-relaxed text-slate-600 whitespace-pre-line [&_strong]:font-semibold [&_strong]:text-slate-900 [&_a]:font-medium [&_a]:text-accent [&_a:hover]:underline",
                  pIdx > 0 && "mt-4"
                )}
                dangerouslySetInnerHTML={{ __html: linkifyMarkdown(paragraph) }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Cost factors ── */}
      {costFactors.length > 0 && (
        <section id="cost" className="scroll-mt-20 mt-8 md:mt-12">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
              How Much Does This Cost?
            </h2>
          </div>
          <p className="mt-6 text-lg leading-relaxed text-slate-600 max-w-4xl pl-4 md:pl-7 whitespace-pre-line">
            The cost depends on the scope and complexity of your project. Key factors that
            influence the budget include:
          </p>
          <ul className="mt-6 max-w-4xl space-y-3 pl-4 md:pl-7">
            {costFactors.map((factor, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span
                  className="text-base leading-relaxed text-slate-600 [&_strong]:font-semibold [&_strong]:text-slate-900"
                  dangerouslySetInnerHTML={{ __html: linkifyMarkdown(factor) }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}
      {/* ── Why Choose Clickmasters ── */}
      {whyChoose.length > 0 && (
        <section className="relative py-12 md:py-16 mt-8 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
            <div className="absolute top-0 right-1/3 h-48 w-48 rounded-full bg-primary-mid/6 blur-[80px]" aria-hidden />
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
              Why Choose Clickmasters
            </h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, index) => (
              <div
                key={index}
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 md:p-7 shadow-[0_2px_16px_rgba(0,0,0,0.05)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                <h3 className="font-heading text-lg font-semibold text-text-primary mb-2">
                  {item.title || item.heading}
                </h3>
                {item.body && (
                  <p
                    className="text-sm text-text-body font-body leading-relaxed flex-1"
                    dangerouslySetInnerHTML={{ __html: linkifyMarkdown(item.body) }}
                  />
                )}
                {item.items && item.items.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {item.items.map((li, liIdx) => (
                      <li key={liIdx} className="flex items-center gap-2 text-sm text-text-body">
                        <Check className="h-4 w-4 text-accent shrink-0" aria-hidden />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Related links ── */}
      {relatedLinks.length > 0 && (
        <section id="related" className="scroll-mt-20 mt-8 md:mt-12">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent" />
            <h2 className="font-heading text-2xl font-semibold leading-snug text-slate-900 sm:text-3xl">
              Related Services & Guides
            </h2>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 max-w-5xl">
            {relatedLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-accent/40 hover:bg-accent/5"
              >
                {link.label || link.title}
                <ChevronRight className="h-4 w-4 text-accent shrink-0" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}