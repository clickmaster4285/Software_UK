'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Clock,
  Calendar,
  BookOpen,
  Sparkles,
  User,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function ResourceGuideDetailClient({ guide, relatedGuides }) {
  const [openFaq, setOpenFaq] = useState(null);

  const {
    title,
    lastUpdated,
    readingTime,
    writtenBy,
    reviewedBy,
    badges = [],
    directAnswer,
    contentSections = [],
    faqs = [],
    relatedPages = [],
    cta,
    author,
  } = guide;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[5%] w-150 h-150 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-88 h-88 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/resource" className="hover:text-white transition-colors">Resource Guides</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90 truncate max-w-50 md:max-w-none">
              {title.length > 50 ? title.substring(0, 47) + '...' : title}
            </span>
          </nav>

          <div className="max-w-7xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <BookOpen className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              Resource Guide
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {badges.map((badge, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white text-sm backdrop-blur-sm">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-8 py-4"
              >
                Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              {contentSections.length > 0 && (
                <a
                  href="#content"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors text-base"
                >
                  Read Guide
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/50 font-body">
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
      </section>

      {/* ── Direct Answer ── */}
      {directAnswer && (
        <section className="py-14 px-6 border-b border-border bg-background">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl border border-accent/20 bg-linear-to-br from-accent/4 to-transparent p-8">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-accent/5 blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  <h2 className="font-heading text-lg font-semibold text-text-primary">Direct Answer</h2>
                </div>
                <p className="text-text-body leading-relaxed font-body text-base md:text-lg">{directAnswer}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Content Sections ── */}
      {contentSections.length > 0 && (
        <section id="content" className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              {contentSections.map((section, sIdx) => (
                <div key={sIdx} className={sIdx > 0 ? 'mt-16' : ''}>
                  {/* Section Title */}
                  {section.title && (
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-6">
                      {section.title}
                    </h2>
                  )}

                  {/* Section Paragraphs */}
                  {section.paragraphs && section.paragraphs.length > 0 && (
                    <div className="mb-8 space-y-4">
                      {section.paragraphs.map((para, pIdx) => (
                        <p key={pIdx} className="text-text-body leading-relaxed font-body text-base">
                          {para}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Section Table */}
                  {section.table && section.table.headers && section.table.headers.length > 0 && (
                    <div className="rounded-2xl border border-border bg-white overflow-hidden shadow-xs overflow-x-auto">
                      <table className="w-full min-w-150 border-collapse">
                        <thead>
                          <tr className="bg-primary text-white font-heading font-semibold text-sm">
                            {section.table.headers.map((header, hIdx) => (
                              <th key={hIdx} className={`p-4 text-left ${hIdx > 0 ? 'text-center' : ''}`}>
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={`border-b border-border text-sm font-body ${rIdx % 2 === 1 ? 'bg-surface/50' : ''
                                }`}
                            >
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`p-4 ${cIdx === 0
                                    ? 'font-semibold text-text-primary'
                                    : 'text-text-body text-center'
                                    }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related Pages (Internal Links) ── */}
      {relatedPages.length > 0 && (
        <section className="py-14 px-6 bg-background border-t border-border">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <h2 className="font-heading text-xl font-bold text-text-primary mb-6">Related Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPages.map((page, idx) => (
                  <Link
                    key={idx}
                    href={`/${page.slug}`}
                    className="group flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-accent/30 transition-all duration-250 hover:shadow-sm"
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

      {/* ── FAQs ── */}
      {faqs.length > 0 && (
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <span className="section-label mb-4">
                <HelpCircle className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                FAQs
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-text-muted mb-10 font-body">
                Common questions about {title.toLowerCase()}.
              </p>

              <div className="space-y-3">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                        ? 'border-accent/30 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
                        : 'border-border bg-white hover:border-accent/20'
                        }`}
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                      >
                        <span className={`font-heading font-semibold pr-4 transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-text-primary'}`}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-accent' : 'text-text-muted'}`}
                        />
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
                      >
                        <div className="px-6 pb-6">
                          <div className="pl-4 border-l-2 border-accent/30">
                            <p className="text-text-body text-sm leading-relaxed font-body">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Author Box ── */}
      {author && (
        <section className="py-14 px-6 bg-background border-t border-border">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-start gap-4 p-6 bg-surface rounded-2xl border border-border">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">About the Author</p>
                  <p className="text-sm text-text-body leading-relaxed font-body">{author}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Related Guides ── */}
      {relatedGuides.length > 0 && (
        <section className="py-20 px-6 bg-surface">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
            <div className="max-w-7xl mx-auto">
              <span className="section-label mb-4">Resource Library</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Related Resource Guides
              </h2>
              <p className="text-text-muted mb-8 font-body">
                Explore more UK software development guides and resources.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedGuides.map((rg) => (
                  <Link
                    key={rg.slug}
                    href={`/resource/${rg.slug}`}
                    className="group flex flex-col justify-between p-5 bg-white rounded-xl border border-border hover:border-accent/30 transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                  >
                    <div>
                      <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-accent transition-colors line-clamp-2 mb-2">
                        {rg.title.length > 70 ? rg.title.substring(0, 67) + '...' : rg.title}
                      </h4>
                      {rg.metaDesc && (
                        <p className="text-xs text-text-muted line-clamp-2 font-body">
                          {rg.metaDesc}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-accent gap-1 mt-4 group-hover:gap-1.5 transition-all">
                      Read Guide <ChevronRight className="w-3.5 h-3.5" />
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
                {cta ? cta.split(' ').slice(0, 6).join(' ') + (cta.split(' ').length > 6 ? '...' : '') : 'Get Expert Guidance'}
              </h2>
              <p className="text-white/70 max-w-xl mx-auto mb-10 text-lg font-body">
                {cta || 'Speak with our UK software development experts. Free consultation, transparent pricing, no obligation.'}
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
