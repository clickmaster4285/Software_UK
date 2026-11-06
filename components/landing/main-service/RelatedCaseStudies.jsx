'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { filterCaseStudyCardsForService } from '@/lib/case-study-public';

/**
 * Lightweight related case-study links for main-service pages.
 * Always renders static hrefs in the initial HTML for crawlable inlinks.
 */
export default function RelatedCaseStudies({ serviceName, serviceSlug, limit = 5 }) {
  const studies = filterCaseStudyCardsForService(serviceName || serviceSlug, limit);

  if (!studies.length) return null;

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-[96vw] lg:max-w-[90vw] px-6">
        <div className="mb-10 max-w-3xl">
          <span className="section-label">Case Studies</span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Related success stories
          </h2>
          <p className="mt-3 text-base text-text-muted md:text-lg">
            Explore recent projects connected to {serviceName || 'this service'} — outcomes, stack, and delivery approach.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {studies.map((study) => (
            <li key={study.slug}>
              <Link
                href={`/case-studies/${study.slug}`}
                className="group flex h-full flex-col rounded-xl border border-border bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all duration-250 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              >
                {study.industry ? (
                  <span className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-accent">
                    {study.industry}
                  </span>
                ) : null}
                <span className="font-heading text-base font-semibold leading-snug text-text-primary group-hover:text-accent">
                  {study.title}
                </span>
                <span className="mt-auto pt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                  Read case study
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent"
          >
            View all case studies
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
