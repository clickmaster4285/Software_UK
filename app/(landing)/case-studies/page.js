'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { caseStudies } from '@/data/case-studies';
import { CaseStudyCard } from '@/components/admin/case-study-card';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X, ArrowRight, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 12;

const sectorEmoji = {
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
  return key ? (sectorEmoji[key] || '📁') : '📁';
}

function getSectorColor(sector) {
  const key = extractSectorKey(sector);
  const colors = {
    'FinTech': 'bg-emerald-500', 'HealthTech': 'bg-rose-500', 'GovTech': 'bg-indigo-500',
    'EdTech': 'bg-amber-500', 'RetailTech': 'bg-orange-500', 'eCommerce': 'bg-cyan-500',
    'PropTech': 'bg-stone-500', 'InsurTech': 'bg-blue-500', 'LegalTech': 'bg-violet-500',
    'Manufacturing Tech': 'bg-slate-500', 'AgriTech': 'bg-lime-500', 'CleanTech': 'bg-green-500',
    'LogTech': 'bg-yellow-600', 'HRTech': 'bg-pink-500', 'Data': 'bg-teal-500',
    'Data Engineering': 'bg-sky-500', 'B2B SaaS': 'bg-purple-500', 'MedTech': 'bg-red-500',
    'RegTech': 'bg-fuchsia-500', 'WealthTech': 'bg-amber-600', 'Association Tech': 'bg-emerald-600',
  };
  return colors[key] || 'bg-slate-400';
}

function CaseStudiesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const activeSector = searchParams.get('sector') || '';

  const sectors = useMemo(() => {
    const set = new Set();
    caseStudies.forEach(s => {
      const key = extractSectorKey(s.sector);
      if (key) set.add(key);
    });
    return Array.from(set).sort();
  }, []);

  const sectorCounts = useMemo(() => {
    const counts = {};
    caseStudies.forEach(s => {
      const sec = extractSectorKey(s.sector);
      if (sec) counts[sec] = (counts[sec] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredStudies = useMemo(() => {
    let results = [...caseStudies];
    if (activeSector) {
      results = results.filter(s => extractSectorKey(s.sector) === activeSector);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(s =>
        s.title?.toLowerCase().includes(q) ||
        s.metaDesc?.toLowerCase().includes(q) ||
        s.sector?.toLowerCase().includes(q) ||
        s.challenge?.toLowerCase().includes(q) ||
        s.technologies?.some(t => t.toLowerCase().includes(q))
      );
    }
    results.sort((a, b) => a.id.localeCompare(b.id));
    return results;
  }, [activeSector, searchQuery]);

  const totalPages = Math.ceil(filteredStudies.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedStudies = filteredStudies.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const updateURL = useCallback((page, sector) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (sector) params.set('sector', sector);
    const qs = params.toString();
    router.push(`/case-studies${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router]);

  const handleSectorClick = useCallback((sector) => {
    updateURL(1, activeSector === sector ? '' : sector);
  }, [activeSector, updateURL]);

  const handlePageChange = useCallback((page) => {
    updateURL(page, activeSector);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }, [activeSector, updateURL]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    updateURL(1, '');
  }, [updateURL]);

  const hasActiveFilters = activeSector || searchQuery.trim();

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [];
    if (safePage <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (safePage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = safePage - 1; i <= safePage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [safePage, totalPages]);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="absolute top-10 right-[8%] w-125 h-125 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute bottom-0 left-[5%] w-100 h-100 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 text-center">
          <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
            <Sparkles className="w-3 h-3 mr-1.5 inline -mt-0.5" />
            Portfolio
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Case Studies
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            {filteredStudies.length} projects delivered across {sectors.length} sectors — each one a measurable business outcome.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search by title, tech, sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || activeSector
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border text-text-body hover:bg-surface'
                }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeSector && (
                <span className="ml-1 px-1.5 py-0.5 bg-accent text-white text-[10px] font-bold rounded-full">1</span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-text-muted hover:text-text-body transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>

          {showFilters && (
            <div className="mt-4 pb-1 flex flex-wrap gap-2">
              {sectors.map(sector => {
                const isActive = activeSector === sector;
                const count = sectorCounts[sector] || 0;
                return (
                  <button
                    key={sector}
                    onClick={() => handleSectorClick(sector)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${isActive
                      ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                      : 'bg-surface text-text-body hover:bg-surface-2 border border-border'
                      }`}
                  >
                    <span>{sectorEmoji[sector] || '📁'}</span>
                    {sector}
                    <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-border'
                      }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-16 px-6 bg-surface min-h-[60vh]">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          {filteredStudies.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">No case studies found</h3>
              <p className="text-text-muted max-w-md mx-auto mb-6">
                Try adjusting your search or filter criteria to find what you&apos;re looking for.
              </p>
              <button onClick={clearFilters} className="btn-primary inline-flex items-center gap-2">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-text-muted">
                  Showing <span className="font-semibold text-text-primary">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filteredStudies.length)}</span> of <span className="font-semibold text-text-primary">{filteredStudies.length}</span> case studies
                  {activeSector && <span className="ml-1">in <span className="font-semibold text-accent">{activeSector}</span></span>}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedStudies.map((study, index) => (
                  <div
                    key={study.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.06}s`, animationFillMode: 'forwards' }}
                  >
                    <CaseStudyCard
                      title={study.title}
                      excerpt={study.metaDesc || study.challenge?.substring(0, 200)}
                      challenge={study.challenge}
                      results={study.results}
                      category={extractSectorKey(study.sector) || 'Case Study'}
                      thumbnail={null}
                      href={`/case-studies/${study.slug}`}
                      emoji={getSectorEmoji(study.sector)}
                      sectorColor={getSectorColor(study.sector)}
                      country={study.country}
                      technologies={study.technologies?.slice(0, 4)}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {pageNumbers.map((page, idx) =>
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">…</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === safePage
                          ? 'bg-accent text-white shadow-md shadow-accent/20'
                          : 'text-text-body hover:bg-white'
                          }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-63 h-63 rounded-full bg-accent/5 blur-3xl" />

            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">
                Start Today
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Be Our Next Success Story?
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">
                Let&apos;s discuss how our technical expertise can help your business achieve measurable growth.
              </p>
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CaseStudiesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-mid to-primary-light" />
        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 text-center">
          <Skeleton className="h-6 w-24 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-14 w-64 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-6 w-96 mx-auto bg-white/20" />
        </div>
      </section>
      <section className="py-16 bg-surface">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CaseStudiesPageWithSuspense() {
  return (
    <Suspense fallback={<CaseStudiesLoading />}>
      <CaseStudiesContent />
    </Suspense>
  );
}
