import { Suspense } from 'react';
import Link from 'next/link';
import { CaseStudyCard } from '@/components/admin/case-study-card';
import { caseStudyListings, getSectorsMeta } from '@/data/case-studies';
import { ArrowRight, Sparkles } from 'lucide-react';
import CaseStudiesFilterClient from './filter-client';

const BASE_URL = 'https://clickmasterssoftwaredevelopmentcompany.co.uk/case-studies';

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1', 10);
  const activeSector = resolvedSearchParams?.sector || '';
  const searchQuery = resolvedSearchParams?.q || '';
  const canonical = page > 1 ? `${BASE_URL}?page=${page}` : BASE_URL;

  const metadata = {
    title: 'Case Studies | ClickMasters Software Development',
    description: 'Explore our portfolio of successful software development projects across FinTech, HealthTech, GovTech, EdTech, and more UK industries.',
    alternates: { canonical },
  };

  // Compute total pages for SEO pagination links
  let filtered = [...caseStudyListings];
  if (activeSector) {
    filtered = filtered.filter(s => extractSectorKey(s.sector) === activeSector);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.metaDesc?.toLowerCase().includes(q) ||
      s.sector?.toLowerCase().includes(q) ||
      s.technologies?.some(t => t.toLowerCase().includes(q))
    );
  }
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const other = {};
  if (page > 1) {
    other['link:prev'] = page === 2 ? BASE_URL : `${BASE_URL}?page=${page - 1}`;
  }
  if (page < totalPages) {
    other['link:next'] = `${BASE_URL}?page=${page + 1}`;
  }
  if (Object.keys(other).length > 0) {
    metadata.other = other;
  }

  return metadata;
}

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

// ── Server component: builds initial listing from lightweight data ──
function CaseStudiesFilter({ sectors, sectorCounts, activeSector }) {
  return (
    <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
        <Suspense fallback={
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
            <div className="relative flex-1 h-10 bg-white border border-border rounded-xl animate-pulse" />
            <div className="w-24 h-10 bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        }>
          <CaseStudiesFilterClient
            sectors={sectors}
            sectorCounts={sectorCounts}
            activeSector={activeSector}
          />
        </Suspense>
      </div>
    </section>
  );
}

export default async function CaseStudiesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  // Read search params on server (no 'use client' needed)
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const activeSector = resolvedSearchParams?.sector || '';
  const searchQuery = resolvedSearchParams?.q || '';

  // Compute sectors from lightweight data
  const { sectors, sectorCounts } = getSectorsMeta();

  // Filter from lightweight data (no heavy fields)
  let filtered = [...caseStudyListings];
  if (activeSector) {
    filtered = filtered.filter(s => extractSectorKey(s.sector) === activeSector);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.metaDesc?.toLowerCase().includes(q) ||
      s.sector?.toLowerCase().includes(q) ||
      s.technologies?.some(t => t.toLowerCase().includes(q))
    );
  }
  filtered.sort((a, b) => a.id.localeCompare(b.id));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedStudies = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

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
            {filtered.length} projects delivered across {sectors.length} sectors — each one a measurable business outcome.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar (client) ── */}
      <CaseStudiesFilter sectors={sectors} sectorCounts={sectorCounts} activeSector={activeSector} />

      {/* ── Results ── */}
      <section className="py-16 px-6 bg-surface min-h-[60vh]">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">No case studies found</h3>
              <p className="text-text-muted max-w-md mx-auto mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Link href="/case-studies" className="btn-primary inline-flex items-center gap-2">
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-text-muted">
                  Showing <span className="font-semibold text-text-primary">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-text-primary">{filtered.length}</span> case studies
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
                      excerpt={study.metaDesc}
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
                <PaginationBar
                  currentPage={safePage}
                  totalPages={totalPages}
                  activeSector={activeSector}
                  searchQuery={searchQuery}
                />
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
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Start Today</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Ready to Be Our Next Success Story?</h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">Let&apos;s discuss how our technical expertise can help your business achieve measurable growth.</p>
              <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4">
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Pagination uses Link (no JS) ──
function PaginationBar({ currentPage, totalPages, activeSector, searchQuery }) {
  const buildHref = (page) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (activeSector) params.set('sector', activeSector);
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    return `/case-studies${qs ? `?${qs}` : ''}`;
  };

  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push(1);
    pages.push('...');
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    pages.push('...');
    for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
    pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="mt-16 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white transition-all">
          ← Prev
        </Link>
      )}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-text-muted text-sm">…</span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={`w-9 h-9 rounded-xl text-sm font-semibold flex items-center justify-center transition-all ${page === currentPage ? 'bg-accent text-white shadow-md shadow-accent/20' : 'text-text-body hover:bg-white'}`}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)} className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-text-body hover:bg-white transition-all">
          Next →
        </Link>
      )}
    </div>
  );
}
