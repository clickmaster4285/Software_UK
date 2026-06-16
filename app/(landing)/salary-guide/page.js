import { Suspense } from 'react';
import Link from 'next/link';
import { salaryGuideListings } from '@/data/salary-guides';
import { ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import SalaryGuideFilterClient from './filter-client';

const ITEMS_PER_PAGE = 12;

const categoryEmoji = {
  'Development': '💻',
  'Data & AI': '🧠',
  'DevOps & Cloud': '☁️',
  'Leadership': '👑',
  'Security & QA': '🛡️',
  'Product & Design': '🎨'
};

function getRoleCategory(role) {
  const r = role.toLowerCase();
  if (r.includes('data') || r.includes('scientist') || r.includes('learning') || r.includes('ml') || r.includes('ai') || r.includes('llm') || r.includes('analytics')) {
    return 'Data & AI';
  }
  if (r.includes('devops') || r.includes('sre') || r.includes('platform') || r.includes('infrastructure') || r.includes('cloud') || r.includes('aws') || r.includes('azure') || r.includes('kubernetes') || r.includes('network')) {
    return 'DevOps & Cloud';
  }
  if (r.includes('manager') || r.includes('cto') || r.includes('lead') || r.includes('architect') || r.includes('ciso') || r.includes('director')) {
    return 'Leadership';
  }
  if (r.includes('security') || r.includes('cyber') || r.includes('qa') || r.includes('test') || r.includes('accessibility') || r.includes('writer')) {
    return 'Security & QA';
  }
  if (r.includes('product') || r.includes('design') || r.includes('ux') || r.includes('scrum') || r.includes('analyst') || r.includes('agile')) {
    return 'Product & Design';
  }
  return 'Development';
}

function getCategoryCounts() {
  const counts = {
    'Development': 0,
    'Data & AI': 0,
    'DevOps & Cloud': 0,
    'Leadership': 0,
    'Security & QA': 0,
    'Product & Design': 0
  };
  
  salaryGuideListings.forEach(sg => {
    const cat = getRoleCategory(sg.role);
    if (counts[cat] !== undefined) {
      counts[cat]++;
    }
  });
  
  return counts;
}

function SalaryGuideCard({ title, excerpt, slug, role, year }) {
  const category = getRoleCategory(role);
  const emoji = categoryEmoji[category] || '📁';
  
  return (
    <Link href={`/salary-guide/${slug}`} className="group block h-full bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md">
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-text-body">
              <span>{emoji}</span>
              {category}
            </span>
            <span className="text-xs font-bold text-accent uppercase tracking-wider bg-accent/5 px-2 py-0.5 rounded">
              {year}
            </span>
          </div>
          
          <h3 className="font-heading text-xl font-bold text-text-primary mb-2 group-hover:text-accent transition-colors">
            {title.replace(/— Permanent.*/, '')}
          </h3>
          
          <p className="text-sm text-text-muted line-clamp-3 mb-6">
            {excerpt || `UK salary benchmarks for ${role.replace(/-/g, ' ')} roles in ${year}.`}
          </p>
        </div>
        
        <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-1.5 gap-1 transition-all">
          View Salary Guide <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

function SalaryGuidesFilter({ categoryCounts, activeCategory }) {
  return (
    <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
        <Suspense fallback={
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
            <div className="relative flex-1 h-10 bg-white border border-border rounded-xl animate-pulse" />
            <div className="w-24 h-10 bg-surface border border-border rounded-xl animate-pulse" />
          </div>
        }>
          <SalaryGuideFilterClient
            categoryCounts={categoryCounts}
            activeCategory={activeCategory}
          />
        </Suspense>
      </div>
    </section>
  );
}

export default async function SalaryGuidesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const activeCategory = resolvedSearchParams?.category || '';
  const searchQuery = resolvedSearchParams?.q || '';

  const categoryCounts = getCategoryCounts();

  // Filter from lightweight data (no heavy fields)
  let filtered = [...salaryGuideListings];
  
  if (activeCategory) {
    filtered = filtered.filter(s => getRoleCategory(s.role) === activeCategory);
  }
  
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(s =>
      s.title?.toLowerCase().includes(q) ||
      s.metaDesc?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    );
  }
  
  filtered.sort((a, b) => {
    // Put general developer (P5) first, then sort by title
    if (a.id === 'P5') return -1;
    if (b.id === 'P5') return 1;
    return a.title.localeCompare(b.title);
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedGuides = filtered.slice(
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
            <BookOpen className="w-3 h-3 mr-1.5 inline -mt-0.5" />
            Salary Benchmarks
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            UK Technology Salary Guides
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-body">
            {salaryGuideListings.length} salary guides covering permanent salaries, contractor day rates, and IR35 tax analysis across the UK.
          </p>
        </div>
      </section>

      {/* ── Search & Filter Bar (client) ── */}
      <SalaryGuidesFilter categoryCounts={categoryCounts} activeCategory={activeCategory} />

      {/* ── Results ── */}
      <section className="py-16 px-6 bg-surface min-h-[60vh]">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="font-heading text-2xl font-bold text-text-primary mb-3">No salary guides found</h3>
              <p className="text-text-muted max-w-md mx-auto mb-6">
                Try adjusting your search or filter criteria.
              </p>
              <Link href="/salary-guide" className="btn-primary inline-flex items-center gap-2">
                Clear Filters
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-text-muted">
                  Showing <span className="font-semibold text-text-primary">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-text-primary">{filtered.length}</span> guides
                  {activeCategory && <span className="ml-1">in <span className="font-semibold text-accent">{activeCategory}</span></span>}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedGuides.map((guide, index) => (
                  <div
                    key={guide.id}
                    className="opacity-0 animate-fade-up"
                    style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.06}s`, animationFillMode: 'forwards' }}
                  >
                    <SalaryGuideCard
                      title={guide.title}
                      excerpt={guide.metaDesc}
                      slug={guide.slug}
                      role={guide.role}
                      year={guide.year}
                    />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <PaginationBar
                  currentPage={safePage}
                  totalPages={totalPages}
                  activeCategory={activeCategory}
                  searchQuery={searchQuery}
                />
              )}
            </>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-mid to-primary-light px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="absolute top-0 right-0 w-75 h-75 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-63 h-63 rounded-full bg-accent/5 blur-3xl" />
            <div className="relative">
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Hire Talent</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Hire Vetted Developers at Market Rates</h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">ClickMasters provides senior UK engineers on monthly contracts. Zero IR35 liability for you.</p>
              <Link href="/hire" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4">
                Explore Tech Roles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Pagination uses Link (no JS) ──
function PaginationBar({ currentPage, totalPages, activeCategory, searchQuery }) {
  const buildHref = (page) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (activeCategory) params.set('category', activeCategory);
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    return `/salary-guide${qs ? `?${qs}` : ''}`;
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
