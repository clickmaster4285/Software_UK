'use client';

import Link from 'next/link';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  User,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function GlossaryDetailClient({ term, relatedTerms }) {
  const {
    termDisplay,
    title,
    lastUpdated,
    readingTime,
    writtenBy,
    reviewedBy,
    directAnswer,
    ukContext,
    relatedTerms: termRelatedTerms = [],
    relatedPages = [],
    cta,
    schemaType,
    targetKeywords = [],
  } = term;

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[5%] w-[350px] h-[350px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/glossary" className="hover:text-white transition-colors">Glossary</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">{termDisplay}</span>
          </nav>

          <div className="max-w-4xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <HelpCircle className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              Glossary Term
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 font-body">
              {lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {lastUpdated}
                </span>
              )}
              {readingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} min read
                </span>
              )}
              {writtenBy && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {writtenBy}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Direct Answer ── */}
      {directAnswer && (
        <section className="py-14 px-6 border-b border-border bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-4xl">
              <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-linear-to-br from-accent/4 to-transparent p-8">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
                <div className="relative">
                  <h2 className="font-heading text-lg font-semibold text-text-primary mb-4">Direct Answer</h2>
                  <p className="text-text-body leading-relaxed font-body text-base md:text-lg">{directAnswer}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── UK Context ── */}
      {ukContext && (
        <section className="py-16 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-4xl">
              <span className="section-label mb-4">UK Context</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-6">
                {termDisplay} in the UK
              </h2>
              <div className="space-y-4">
                {ukContext.split('\n\n').map((para, idx) => (
                  <p key={idx} className="text-text-body leading-relaxed font-body text-base">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Terms ── */}
      {termRelatedTerms.length > 0 && (
        <section className="py-16 px-6 bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-4xl">
              <span className="section-label mb-4">Related Terms</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
                Terms Related to {termDisplay}
              </h2>

              <div className="space-y-4">
                {termRelatedTerms.map((rt, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-surface rounded-xl border border-border"
                  >
                    <h3 className="font-heading text-base font-bold text-text-primary mb-2">
                      {rt.term}
                    </h3>
                    <p className="text-text-body text-sm leading-relaxed font-body">
                      {rt.definition}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Pages (Internal Links) ── */}
      {relatedPages.length > 0 && (
        <section className="py-14 px-6 bg-surface border-t border-border">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-4xl">
              <h2 className="font-heading text-xl font-bold text-text-primary mb-6">Related Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPages.map((page, idx) => (
                  <Link
                    key={idx}
                    href={`/${page.slug}`}
                    className="group flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-accent transition-all duration-250 hover:shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors shrink-0" />
                    <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">
                      {page.title}
                    </span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent ml-auto shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Glossary Terms ── */}
      {relatedTerms.length > 0 && (
        <section className="py-16 px-6 bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-4xl">
              <span className="section-label mb-4">Explore More</span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
                Related Glossary Terms
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedTerms.map((rt) => (
                  <Link
                    key={rt.slug}
                    href={`/glossary/${rt.slug}`}
                    className="group flex flex-col justify-between p-5 bg-surface rounded-xl border border-border hover:border-accent transition-all duration-300 hover:shadow-xs"
                  >
                    <div>
                      <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-1">
                        {rt.termDisplay}
                      </h4>
                      {rt.metaDesc && (
                        <p className="text-xs text-text-muted line-clamp-2 font-body">
                          {rt.metaDesc}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-accent gap-1 mt-3 group-hover:gap-1.5 transition-all">
                      Read Definition <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-14 md:px-14 md:py-18 text-center">
            <div className="absolute top-0 right-0 w-63 h-63 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-50 h-50 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                ClickMasters
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Get Expert Advice on {termDisplay}
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg font-body">
                {cta || `Speak with our UK software development experts about ${termDisplay}. Free consultation, transparent pricing, no obligation.`}
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
