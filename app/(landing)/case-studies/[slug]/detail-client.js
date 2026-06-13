'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronRight, Share2, Printer, Target, Lightbulb,
  CheckCircle2, Quote, Clock, Calendar, Shield, Globe, Lock,
  FileText, Users, Cpu, Award, BookOpen, ChevronUp, ArrowRight
} from 'lucide-react';

// ─── Sector emoji helper ───────────────────────────────────────────
const sectorEmojiMap = {
  'FinTech': '💰', 'HealthTech': '🏥', 'GovTech': '🏛️', 'EdTech': '🎓',
  'RetailTech': '🛒', 'eCommerce': '📦', 'PropTech': '🏗️', 'InsurTech': '🛡️',
  'LegalTech': '⚖️', 'Manufacturing Tech': '🔧', 'AgriTech': '🌾', 'CleanTech': '♻️',
  'LogTech': '🚛', 'HRTech': '👥', 'Data': '📊', 'Data Engineering': '⚙️',
  'B2B SaaS': '☁️', 'MedTech': '💊', 'RegTech': '📋', 'WealthTech': '💎',
  'Association Tech': '🤝',
};

function getSectorEmojiFn(sector) {
  if (!sector) return '📁';
  const key = sector.split('/')[0]?.trim();
  return sectorEmojiMap[key] || '📁';
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
        className="h-full bg-linear-to-r from-accent to-accent-light transition-all duration-150 ease-out"
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
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Contents</h4>
        <ul className="space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-primary hover:bg-slate-50 transition-all text-left"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {label}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-4 border-t border-slate-100">
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

// ─── Main Client Component ─────────────────────────────────────────
export function CaseStudyDetailClient({ study, relatedStudies }) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const emoji = getSectorEmojiFn(study.sector);

  return (
    <div className="pt-20">
      <ReadingProgress />
      <main className="bg-white min-h-screen">
        {/* Breadcrumbs */}
        <div className="bg-surface border-b border-border">
          <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/case-studies" className="hover:text-primary transition-colors">Case Studies</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-700 font-medium truncate max-w-xs">{study.title}</span>
            </nav>
          </div>
        </div>

        {/* Layout: TOC + Content */}
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pt-10 pb-24 flex gap-10">
          <TableOfContents study={study} />

          <article className="flex-1 min-w-0 max-w-7xl">
            {/* Hero Header */}
            <header className="mb-14">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <Badge className="bg-accent text-white px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] rounded-full">
                  {emoji} {study.sector || 'Success Story'}
                </Badge>
                <Badge className={`${study.status?.toLowerCase().includes('time') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'} px-3 py-1.5 text-xs font-semibold rounded-full`}>
                  {study.status || 'Completed'}
                </Badge>
                {study.contract && (
                  <Badge variant="outline" className="border-slate-200 text-slate-500 px-3 py-1.5 text-xs font-semibold rounded-full">
                    📋 {study.contract}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight mb-8">
                {study.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
                {study.country && (
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-slate-400" />
                    {study.country}
                  </span>
                )}
                {study.readingTime > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {study.readingTime} min read
                  </span>
                )}
                {study.lastUpdated && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Updated {study.lastUpdated}
                  </span>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-primary">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-slate-400 hover:text-primary" onClick={() => window.print()}>
                    <Printer className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Key stats bar */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {study.country && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Globe className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Region</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{study.country}</div>
                  </div>
                )}
                {study.contract && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <FileText className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Contract</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{study.contract}</div>
                  </div>
                )}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Tech Stack</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{study.technologies?.length || 0} Technologies</div>
                </div>
                {study.ipOwnership && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">IP</span>
                    </div>
                    <div className="text-sm font-bold text-slate-800">{study.ipOwnership}</div>
                  </div>
                )}
              </div>
            </header>

            {/* Accent divider */}
            <div className="w-16 h-1 bg-accent rounded-full mb-14" />

            {/* Overview */}
            {study.metaDesc && (
              <section id="overview" className="mb-14 scroll-mt-28">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Project Overview</h2>
                </div>
                <p className="text-lg text-slate-600 leading-relaxed">{study.metaDesc}</p>

                {/* Technologies */}
                {study.technologies?.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Technology Stack
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {study.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200/50 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all cursor-default"
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
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
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

            {/* Challenge / Approach / Results — Bento Grid */}
            {(study.challenge || study.approach || study.results) && (
              <section className="mb-14">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {study.challenge && (
                    <div id="challenge" className="scroll-mt-28 rounded-2xl bg-linear-to-br from-red-50 via-white to-white border border-red-100 p-7 flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-red-200">
                          <Target className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">The Challenge</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed flex-1">{study.challenge}</p>
                    </div>
                  )}

                  {study.approach && (
                    <div id="approach" className="scroll-mt-28 rounded-2xl bg-linear-to-br from-blue-50 via-white to-white border border-blue-100 p-7 flex flex-col">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200">
                          <Lightbulb className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Our Approach</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed flex-1">{study.approach}</p>
                    </div>
                  )}

                  {study.results && (
                    <div id="results" className="scroll-mt-28 rounded-2xl bg-linear-to-br from-emerald-50 via-white to-white border border-emerald-100 p-7 flex flex-col md:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">The Results</h3>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed flex-1">{study.results}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Client Quote */}
            {study.clientQuote && (
              <section id="testimonial" className="mb-14 scroll-mt-28">
                <div className="relative bg-primary rounded-3xl p-10 md:p-14 overflow-hidden">
                  <div className="absolute top-6 left-8 text-8xl text-white/5 font-serif leading-none select-none">&ldquo;</div>
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-[100px]" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                      <Quote className="w-6 h-6 text-accent" />
                      <span className="text-xs font-bold text-white/50 uppercase tracking-[0.2em]">Client Testimonial</span>
                    </div>
                    <blockquote className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8">
                      &ldquo;{study.clientQuote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{study.writtenBy}</div>
                        <div className="text-xs text-white/50">{study.reviewedBy && `Reviewed by ${study.reviewedBy}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Project Details */}
            <section id="details" className="mb-14 scroll-mt-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Project Details</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Award, label: 'Sector', value: study.sector },
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
                  <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      {Icon && <Icon className="w-3 h-3" />}
                      {label}
                    </div>
                    <div className="text-sm font-bold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Related Case Studies */}
            {relatedStudies.length > 0 && (
              <section className="mb-14">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Related Case Studies</h2>
                  <Link href="/case-studies" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedStudies.map(cs => (
                    <Link
                      key={cs.slug}
                      href={`/case-studies/${cs.slug}`}
                      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="h-32 bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b border-slate-100">
                        <span className="text-4xl">{getSectorEmojiFn(cs.sector)}</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{cs.sector?.split('/')[0]?.trim()}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">{cs.title}</h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">{cs.metaDesc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom CTA */}
            <div className="bg-linear-to-br from-primary to-primary-mid rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-accent rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-4xl font-black text-white mb-4">Ready to Transform Your Business?</h2>
                <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                  Let&apos;s discuss how our technical expertise can help you achieve remarkable results.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-all hover:scale-105 active:scale-95 shadow-xl"
                  >
                    Start Your Project
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/case-studies"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    View All Case Studies
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>

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
