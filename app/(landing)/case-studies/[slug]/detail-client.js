'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronRight, Share2, Printer, Target, Lightbulb,
  CheckCircle2, Quote, Clock, Calendar, Shield, Globe, Lock,
  FileText, Users, Cpu, Award, BookOpen, ChevronUp, ArrowRight,
  Sparkles, MapPin, Zap,
} from 'lucide-react';

const sectorEmojiMap = {
  'FinTech': '💰', 'HealthTech': '🏥', 'GovTech': '🏛️', 'EdTech': '🎓',
  'RetailTech': '🛒', 'eCommerce': '📦', 'PropTech': '🏗️', 'InsurTech': '🛡️',
  'LegalTech': '⚖️', 'Manufacturing Tech': '🔧', 'AgriTech': '🌾', 'CleanTech': '♻️',
  'LogTech': '🚛', 'HRTech': '👥', 'Data': '📊', 'Data Engineering': '⚙️',
  'B2B SaaS': '☁️', 'MedTech': '💊', 'RegTech': '📋', 'WealthTech': '💎',
  'Association Tech': '🤝',
};

function extractSectorKey(sector) {
  if (!sector) return '';
  return sector.split('/')[0]?.trim().replace(/[\uD800-\uDFFF]/g, '').trim();
}

function getSectorEmoji(sector) {
  const key = extractSectorKey(sector);
  return key ? (sectorEmojiMap[key] || '📁') : '📁';
}

// ─── Reading Progress Bar ──────────────────────────────────────────
function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, (scrollTop / docHeight) * 100));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1">
      <div
        className="h-full bg-gradient-to-r from-accent to-accent-light transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ─── Table of Contents ─────────────────────────────────────────────
function TableOfContents({ study }) {
  const sections = useMemo(() => {
    const s = [];
    s.push({ id: 'overview', label: 'Overview', icon: BookOpen });
    if (study.challenge) s.push({ id: 'challenge', label: 'Challenge', icon: Target });
    if (study.approach) s.push({ id: 'approach', label: 'Approach', icon: Lightbulb });
    if (study.results) s.push({ id: 'results', label: 'Results', icon: CheckCircle2 });
    if (study.clientQuote) s.push({ id: 'testimonial', label: 'Testimonial', icon: Quote });
    s.push({ id: 'details', label: 'Project Details', icon: FileText });
    return s;
  }, [study]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="hidden xl:block sticky top-28 w-56 shrink-0 self-start">
      <div className="bg-white rounded-2xl border border-border p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4 font-heading">Contents</h4>
        <ul className="space-y-0.5">
          {sections.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text-muted hover:text-primary hover:bg-surface transition-all text-left"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-4 border-t border-border">
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-accent text-white text-xs font-bold rounded-xl hover:bg-accent-hover transition-all shadow-sm"
          >
            Hire Us
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

// ─── Section Heading ────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title, color = 'bg-primary/10 text-primary' }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <h2 className="font-heading text-2xl font-bold text-text-primary">{title}</h2>
    </div>
  );
}

// ─── Main Client Component ─────────────────────────────────────────
export function CaseStudyDetailClient({ study, relatedStudies }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const emoji = getSectorEmoji(study.sector);

  return (
    <div className="pt-16">
      <ReadingProgress />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-16 pb-14 md:pt-20 md:pb-18">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[8%] w-[500px] h-[500px] rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/80 truncate max-w-xs">{study.title}</span>
          </nav>

          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-bold uppercase tracking-[0.15em] backdrop-blur-sm">
                {emoji} {extractSectorKey(study.sector) || 'Success Story'}
              </span>
              {study.status && (
                <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                  study.status.toLowerCase().includes('time')
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/20'
                    : 'bg-blue-500/20 text-blue-200 border border-blue-400/20'
                }`}>
                  {study.status}
                </span>
              )}
              {study.contract && (
                <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 border border-white/15 text-white/80">
                  📋 {study.contract}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
              {study.title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
              {study.country && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-white/40" />
                  {study.country}
                </span>
              )}
              {study.readingTime > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-white/40" />
                  {study.readingTime} min read
                </span>
              )}
              {study.lastUpdated && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-white/40" />
                  Updated {study.lastUpdated}
                </span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" />
                </button>
                <button onClick={() => window.print()} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Key Stats Bar ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {study.country && (
              <div className="bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Region</span>
                </div>
                <div className="text-sm font-bold text-text-primary">{study.country}</div>
              </div>
            )}
            {study.contract && (
              <div className="bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Contract</span>
                </div>
                <div className="text-sm font-bold text-text-primary">{study.contract}</div>
              </div>
            )}
            <div className="bg-surface rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-text-muted mb-1">
                <Cpu className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-heading">Tech Stack</span>
              </div>
              <div className="text-sm font-bold text-text-primary">{study.technologies?.length || 0} Technologies</div>
            </div>
            {study.ipOwnership && (
              <div className="bg-surface rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 text-text-muted mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-heading">IP</span>
                </div>
                <div className="text-sm font-bold text-text-primary">{study.ipOwnership}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main Content + TOC ── */}
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pt-10 pb-24 flex gap-10">
        <TableOfContents study={study} />

        <article className="flex-1 min-w-0 max-w-7xl">
          {/* Accent divider */}
          <div className="w-16 h-1 bg-accent rounded-full mb-14" />

          {/* ── Overview ── */}
          {study.metaDesc && (
            <section id="overview" className="mb-16 scroll-mt-28">
              <SectionHeading icon={BookOpen} title="Project Overview" />
              <p className="text-lg text-text-body leading-relaxed mb-8">{study.metaDesc}</p>

              {/* Technologies */}
              {study.technologies?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4 flex items-center gap-2 font-heading">
                    <Cpu className="w-4 h-4" />
                    Technology Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {study.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface text-text-body rounded-lg text-sm font-medium border border-border hover:border-accent/25 hover:bg-accent/5 hover:text-accent transition-all cursor-default"
                      >
                        <Cpu className="w-3 h-3" />
                        {tech.replace(/^Used\s/i, '')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance */}
              {study.compliance && (
                <div>
                  <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-[0.15em] mb-4 flex items-center gap-2 font-heading">
                    <Shield className="w-4 h-4" />
                    Compliance & Standards
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {study.compliance.split(',').map((comp) => (
                      <span
                        key={comp}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-200/50"
                      >
                        <Shield className="w-3 h-3" />
                        {comp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ── Challenge / Approach / Results — Bento Grid ── */}
          {(study.challenge || study.approach || study.results) && (
            <section className="mb-16">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {study.challenge && (
                  <div id="challenge" className="scroll-mt-28 rounded-2xl bg-gradient-to-br from-red-50 via-white to-white border border-red-100 p-7 flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-red-200">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">The Challenge</h3>
                    </div>
                    <p className="text-sm text-text-body leading-relaxed flex-1">{study.challenge}</p>
                  </div>
                )}

                {study.approach && (
                  <div id="approach" className="scroll-mt-28 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 p-7 flex flex-col hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                        <Lightbulb className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">Our Approach</h3>
                    </div>
                    <p className="text-sm text-text-body leading-relaxed flex-1">{study.approach}</p>
                  </div>
                )}

                {study.results && (
                  <div id="results" className="scroll-mt-28 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-white border border-emerald-100 p-7 flex flex-col md:col-span-2 lg:col-span-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-shadow duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-text-primary">The Results</h3>
                    </div>
                    <p className="text-sm text-text-body leading-relaxed flex-1">{study.results}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Client Quote ── */}
          {study.clientQuote && (
            <section id="testimonial" className="mb-16 scroll-mt-28">
              <div className="relative bg-gradient-to-br from-primary via-primary-mid to-primary-light rounded-3xl p-10 md:p-14 overflow-hidden">
                <div className="absolute top-6 left-8 text-8xl text-white/5 font-serif leading-none select-none">&ldquo;</div>
                <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-accent/10 blur-[100px]" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Quote className="w-6 h-6 text-accent" />
                    <span className="text-[11px] font-bold text-white/50 uppercase tracking-[0.2em] font-heading">Client Testimonial</span>
                  </div>
                  <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8 font-heading">
                    &ldquo;{study.clientQuote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{study.writtenBy}</div>
                      {study.reviewedBy && (
                        <div className="text-xs text-white/50">Reviewed by {study.reviewedBy}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Project Details ── */}
          <section id="details" className="mb-16 scroll-mt-28">
            <SectionHeading icon={FileText} title="Project Details" color="bg-surface text-text-body" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Award, label: 'Sector', value: extractSectorKey(study.sector) },
                { icon: Globe, label: 'Country', value: study.country },
                { icon: undefined, label: 'Status', value: study.status },
                { icon: FileText, label: 'Contract', value: study.contract },
                { icon: Cpu, label: 'Tech Stack', value: `${study.technologies?.length || 0} Technologies` },
                { icon: Clock, label: 'Reading Time', value: study.readingTime > 0 ? `${study.readingTime} min` : null },
                { icon: Lock, label: 'IP Ownership', value: study.ipOwnership },
                { icon: Calendar, label: 'Last Updated', value: study.lastUpdated },
                { icon: Users, label: 'Written By', value: study.writtenBy },
                { icon: Users, label: 'Reviewed By', value: study.reviewedBy },
              ].filter(d => d.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl border border-border p-5 hover:border-accent/20 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300">
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5 font-heading">
                    {Icon && <Icon className="w-3 h-3" />}
                    {label}
                  </div>
                  <div className="text-sm font-bold text-text-primary">{value}</div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Related Case Studies ── */}
          {relatedStudies.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl font-bold text-text-primary">Related Case Studies</h2>
                <Link href="/case-studies" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedStudies.map(cs => (
                  <Link
                    key={cs.slug}
                    href={`/case-studies/${cs.slug}`}
                    className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="h-32 bg-gradient-to-br from-surface to-surface-2 flex items-center justify-center border-b border-border">
                      <span className="text-4xl">{getSectorEmoji(cs.sector)}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-heading">
                          {extractSectorKey(cs.sector)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-text-primary line-clamp-2 group-hover:text-accent transition-colors font-heading">
                        {cs.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-2 line-clamp-2">{cs.metaDesc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── Bottom CTA ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-mid to-primary-light px-8 py-14 md:px-14 md:py-18 text-center">
            <div className="absolute top-0 right-0 w-[250px] h-[250px] rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
                Ready to Start?
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                Let&apos;s discuss how our technical expertise can help you achieve remarkable results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/case-studies"
                  className="inline-flex items-center justify-center gap-2 px-10 py-4 border-2 border-white/20 text-white font-medium rounded-xl hover:bg-white/10 transition-colors text-base"
                >
                  View All Case Studies
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-all"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
