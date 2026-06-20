'use client';

import { useState, useEffect, useRef } from 'react';
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
  BookOpen,
  ArrowUp,
  ChevronDown,
} from 'lucide-react';

const SECTIONS = [
  { id: 'direct-answer', label: 'Direct Answer' },
  { id: 'uk-context', label: 'UK Context' },
  { id: 'related-terms', label: 'Related Terms' },
  { id: 'related-pages', label: 'Related Pages' },
  { id: 'explore-more', label: 'Explore More' },
];

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

  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const mainRef = useRef(null);

  // Reading progress + active section tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
      setShowBackToTop(scrollTop > 600);

      // Determine active section
      const sectionEls = SECTIONS.map(s => ({
        id: s.id,
        el: document.getElementById(s.id),
      })).filter(s => s.el);

      let current = '';
      for (const { id, el } of sectionEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 160) current = id;
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 100;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setTocOpen(false);
  };

  const hasTocSections = !!directAnswer || !!ukContext || termRelatedTerms.length > 0 || relatedPages.length > 0 || relatedTerms.length > 0;

  return (
    <div className="min-h-screen bg-background" ref={mainRef}>
      {/* ── Reading Progress Bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[5%] w-[350px] h-[350px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Back to glossary + breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8 flex-wrap">
            <Link href="/glossary" className="inline-flex items-center gap-1 hover:text-white transition-colors">
              <BookOpen className="w-3.5 h-3.5" />
              Glossary
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/90">{termDisplay}</span>
          </nav>

          <div className="max-w-7xl">
            <span className="section-label mb-5 bg-white/10 border-white/15 text-white/80">
              <HelpCircle className="w-3 h-3 mr-1.5 inline -mt-0.5" />
              Glossary Term
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/50 font-body">
              {readingTime > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} min read
                </span>
              )}
              {lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {lastUpdated}
                </span>
              )}
              {writtenBy && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {writtenBy}
                </span>
              )}
              {reviewedBy && (
                <span className="text-white/40 text-xs">
                  Reviewed by {reviewedBy}
                </span>
              )}
            </div>

            {/* Target keywords */}
            {targetKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-5">
                {targetKeywords.map((kw, i) => (
                  <span key={i} className="text-[11px] font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content Layout ── */}
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-12">
        <div className="flex gap-10">
          {/* ── Sticky TOC Sidebar (desktop) ── */}
          {hasTocSections && (
            <aside className="hidden lg:block w-56 shrink-0 ">
              <div className="sticky top-24 border p-3 rounded-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted mb-3">On this page</p>
                <nav className="space-y-1">
                  {SECTIONS.filter(s => {
                    if (s.id === 'direct-answer' && !directAnswer) return false;
                    if (s.id === 'uk-context' && !ukContext) return false;
                    if (s.id === 'related-terms' && termRelatedTerms.length === 0) return false;
                    if (s.id === 'related-pages' && relatedPages.length === 0) return false;
                    if (s.id === 'explore-more' && relatedTerms.length === 0) return false;
                    return true;
                  }).map(s => (
                    <button
                      key={s.id}
                      onClick={() => scrollToSection(s.id)}
                      className={`block w-full text-left text-sm py-1.5 pl-3 border-l-2 transition-all ${
                        activeSection === s.id
                          ? 'border-accent text-accent font-medium'
                          : 'border-transparent text-text-muted hover:text-text-body hover:border-border'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* ── Content Column ── */}
          <div className="flex-1 min-w-0 max-w-7xl">

            {/* ── Mobile TOC dropdown ── */}
            {hasTocSections && (
              <div className="lg:hidden mb-8">
                <button
                  onClick={() => setTocOpen(!tocOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-text-body bg-surface border border-border rounded-lg px-4 py-2.5 w-full justify-between"
                >
                  <span>On this page</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${tocOpen ? 'rotate-180' : ''}`} />
                </button>
                {tocOpen && (
                  <div className="mt-2 bg-surface border border-border rounded-lg p-3 space-y-1">
                    {SECTIONS.filter(s => {
                      if (s.id === 'direct-answer' && !directAnswer) return false;
                      if (s.id === 'uk-context' && !ukContext) return false;
                      if (s.id === 'related-terms' && termRelatedTerms.length === 0) return false;
                      if (s.id === 'related-pages' && relatedPages.length === 0) return false;
                      if (s.id === 'explore-more' && relatedTerms.length === 0) return false;
                      return true;
                    }).map(s => (
                      <button
                        key={s.id}
                        onClick={() => scrollToSection(s.id)}
                        className="block w-full text-left text-sm text-text-muted hover:text-accent py-1.5 px-2 rounded transition-colors"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Direct Answer ── */}
            {directAnswer && (
              <section id="direct-answer" className="mb-12">
                <div className="relative overflow-hidden rounded-2xl border-l-4 border-accent bg-linear-to-br from-accent/5 to-transparent p-8 md:p-10">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-accent/5 blur-3xl" />
                  <div className="absolute -bottom-2 right-4 text-accent/45">
                    <HelpCircle className="w-24 h-24" />
                  </div>
                  <div className="relative">
                    <h2 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      Direct Answer
                    </h2>
                    <p className="text-text-body leading-relaxed font-body text-lg md:text-xl">
                      {directAnswer}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ── UK Context ── */}
            {ukContext && (
              <section id="uk-context" className="mb-12">
                <div className="border-t border-border pt-10">
                  <span className="section-label mb-4">UK Context</span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-6">
                    {termDisplay} in the UK
                  </h2>
                  <div className="space-y-5">
                    {ukContext.split('\n\n').map((para, idx) => (
                      <p
                        key={idx}
                        className={`text-text-body leading-[1.85] font-body text-base ${idx === 0 ? 'text-lg first-letter:text-4xl first-letter:font-bold first-letter:text-accent first-letter:float-left first-letter:mr-2 first-letter:mt-1' : ''}`}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Related Terms ── */}
            {termRelatedTerms.length > 0 && (
              <section id="related-terms" className="mb-12">
                <div className="border-t border-border pt-10">
                  <span className="section-label mb-4">Related Terms</span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
                    Terms Related to {termDisplay}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {termRelatedTerms.map((rt, idx) => (
                      <div
                        key={idx}
                        className="group p-5 bg-surface rounded-xl border border-border hover:border-accent/40 hover:-translate-y-0.5 transition-all duration-250"
                      >
                        <h3 className="font-heading text-base font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
                          {rt.term}
                        </h3>
                        <p className="text-text-body text-sm leading-relaxed font-body line-clamp-3">
                          {rt.definition}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Related Pages ── */}
            {relatedPages.length > 0 && (
              <section id="related-pages" className="mb-12">
                <div className="border-t border-border pt-10">
                  <h2 className="font-heading text-xl font-bold text-text-primary mb-6">Related Pages</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {relatedPages.map((page, idx) => (
                      <Link
                        key={idx}
                        href={`/${page.slug}`}
                        className="group flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-accent transition-all duration-250 hover:shadow-sm"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5 text-accent" />
                        </div>
                        <span className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors truncate">
                          {page.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent ml-auto shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── Related Glossary Terms ── */}
            {relatedTerms.length > 0 && (
              <section id="explore-more" className="mb-12">
                <div className="border-t border-border pt-10">
                  <span className="section-label mb-4">Explore More</span>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-text-primary mb-8">
                    Related Glossary Terms
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedTerms.map((rt) => (
                      <Link
                        key={rt.slug}
                        href={`/glossary/${rt.slug}`}
                        className="group flex flex-col justify-between p-5 bg-surface rounded-xl border border-border hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div>
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
                            <BookOpen className="w-3.5 h-3.5 text-accent" />
                          </div>
                          <h4 className="font-heading text-base font-bold text-text-primary group-hover:text-accent transition-colors mb-1">
                            {rt.termDisplay}
                          </h4>
                          {rt.metaDesc && (
                            <p className="text-xs text-text-muted line-clamp-2 font-body leading-relaxed">
                              {rt.metaDesc}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center text-xs font-semibold text-accent gap-1 mt-4 group-hover:gap-2 transition-all">
                          Read Definition <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── CTA ── */}
            <section className="mb-8">
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
                  <p className="text-white/70 max-w-xl mx-auto mb-8 text-lg font-body">
                    {cta || `Speak with our UK software development experts about ${termDisplay}. Free consultation, transparent pricing, no obligation.`}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/contact"
                      className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
                    >
                      Book a Free Consultation
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/glossary"
                      className="inline-flex items-center justify-center gap-2 text-base px-8 py-4 rounded-lg border border-white/20 text-white/80 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <BookOpen className="w-4 h-4" />
                      Browse All Terms
                    </Link>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
