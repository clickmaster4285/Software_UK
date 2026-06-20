import { Suspense } from 'react';
import Link from 'next/link';
import { resourceGuideListings } from '@/data/resource-guides';
import { ArrowRight, BookOpen } from 'lucide-react';
import ResourceGuideFilterClient from './filter-client';
import ResourceCategoryPills from './category-pills';

const ITEMS_PER_PAGE = 12;

const categoryLabels = {
  'development': 'Development',
  'ai': 'AI & Machine Learning',
  'cloud': 'Cloud & DevOps',
  'security': 'Security & Compliance',
  'data': 'Data & Databases',
  'mobile': 'Mobile Development',
  'business': 'Business & Strategy',
  'design': 'Design & UX',
  'testing': 'Testing & QA',
  'architecture': 'Architecture & Design',
  'fintech': 'FinTech & Finance',
  'health': 'HealthTech & NHS',
  'gov': 'GovTech & Public Sector',
  'legal': 'LegalTech & Regulation',
};

function getCategory(slug, title) {
  const s = (slug + ' ' + title).toLowerCase();
  if (s.includes('ai') || s.includes('machine learning') || s.includes('llm') || s.includes('rag')) return 'ai';
  if (s.includes('cloud') || s.includes('devops') || s.includes('aws') || s.includes('azure') || s.includes('kubernetes') || s.includes('docker')) return 'cloud';
  if (s.includes('security') || s.includes('cyber') || s.includes('gdpr') || s.includes('iso') || s.includes('cyber essentials') || s.includes('ir35') || s.includes('compliance')) return 'security';
  if (s.includes('data') || s.includes('database') || s.includes('sql') || s.includes('postgresql') || s.includes('mongodb')) return 'data';
  if (s.includes('mobile') || s.includes('ios') || s.includes('android') || s.includes('react native') || s.includes('flutter')) return 'mobile';
  if (s.includes('fintech') || s.includes('financial') || s.includes('fca') || s.includes('payment') || s.includes('open banking') || s.includes('banking')) return 'fintech';
  if (s.includes('nhs') || s.includes('health') || s.includes('fhir') || s.includes('dtac') || s.includes('dsp')) return 'health';
  if (s.includes('gov') || s.includes('gds') || s.includes('govtech') || s.includes('public sector') || s.includes('companies house')) return 'gov';
  if (s.includes('legal') || s.includes('contract') || s.includes('solicitor')) return 'legal';
  if (s.includes('design') || s.includes('ux') || s.includes('ui') || s.includes('accessibility') || s.includes('wcag')) return 'design';
  if (s.includes('test') || s.includes('qa') || s.includes('quality')) return 'testing';
  if (s.includes('architect') || s.includes('microservice') || s.includes('monolith') || s.includes('api') || s.includes('graphql') || s.includes('rest')) return 'architecture';
  if (s.includes('startup') || s.includes('mvp') || s.includes('cost') || s.includes('pricing') || s.includes('budget') || s.includes('procurement') || s.includes('staff augmentation')) return 'business';
  return 'development';
}

const categoryEmoji = {
  'development': '💻',
  'ai': '🤖',
  'cloud': '☁️',
  'security': '🔒',
  'data': '📊',
  'mobile': '📱',
  'business': '💷',
  'design': '🎨',
  'testing': '🧪',
  'architecture': '🏗️',
  'fintech': '💰',
  'health': '🏥',
  'gov': '🏛️',
  'legal': '⚖️',
};

function getCategoryCounts() {
  const counts = {};
  resourceGuideListings.forEach(rg => {
    const cat = getCategory(rg.slug, rg.title);
    counts[cat] = (counts[cat] || 0) + 1;
  });
  return counts;
}

function ResourceCard({ guide }) {
  const category = getCategory(guide.slug, guide.title);
  const label = categoryLabels[category] || 'Development';
  const emoji = categoryEmoji[category] || '📁';

  return (
    <Link href={`/resource/${guide.slug}`} className="group block h-full bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md">
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-text-body">
              <span>{emoji}</span>
              {label}
            </span>
            {guide.readingTime > 0 && (
              <span className="text-xs font-medium text-text-muted">
                {guide.readingTime} min read
              </span>
            )}
          </div>

          <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
            {guide.title.length > 90 ? guide.title.substring(0, 87) + '...' : guide.title}
          </h3>

          <p className="text-sm text-text-muted line-clamp-3 mb-6">
            {guide.metaDesc || `UK software development resource guide covering ${guide.title.toLowerCase()}.`}
          </p>
        </div>

        <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-1.5 gap-1 transition-all">
          Read Guide <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

function ResourceFilter({ categoryCounts }) {
  return (
    <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
        <Suspense fallback={
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
            <div className="relative flex-1 h-10 bg-white border border-border rounded-xl animate-pulse" />
          </div>
        }>
          <ResourceGuideFilterClient categoryCounts={categoryCounts} />
        </Suspense>
      </div>
    </section>
  );
}

export default async function ResourceGuidesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const activeCategory = resolvedSearchParams?.category || '';
  const searchQuery = resolvedSearchParams?.q || '';

  const categoryCounts = getCategoryCounts();

  let filtered = [...resourceGuideListings];

  if (activeCategory) {
    filtered = filtered.filter(guide => getCategory(guide.slug, guide.title) === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(g =>
      g.title?.toLowerCase().includes(q) ||
      g.metaDesc?.toLowerCase().includes(q) ||
      g.slug?.toLowerCase().includes(q)
    );
  }

  // Sort by P-number (extracted from id)
  filtered.sort((a, b) => {
    const aNum = parseInt(a.id.replace('P', '')) || 0;
    const bNum = parseInt(b.id.replace('P', '')) || 0;
    return aNum - bNum;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedGuides = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, count]) => ({
      key: cat,
      label: categoryLabels[cat] || cat,
      emoji: categoryEmoji[cat] || '📁',
      count,
    }));

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-linear-to-br from-primary via-primary-mid to-primary py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 border border-white/20 text-white/80 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Resource Guides
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            UK Software Development
            <span className="block text-accent">Resource Guides</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8">
            In-depth guides covering UK software development costs, team structures, compliance, regulations, and best practices for British businesses.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {resourceGuideListings.length} Guides
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Free to Read
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Updated 2025
            </span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <ResourceFilter categoryCounts={categoryCounts} />

      {/* Category Pills */}
      <ResourceCategoryPills
        categories={sortedCategories}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        totalCount={resourceGuideListings.length}
      />

      {/* Results Count */}
      <section className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pt-8 pb-4">
        <p className="text-sm text-text-muted">
          Showing {paginatedGuides.length} of {filtered.length} resource guides
          {activeCategory && ` in ${categoryLabels[activeCategory] || activeCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pb-16">
        {paginatedGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGuides.map(guide => (
              <ResourceCard key={guide.id} guide={guide} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No resource guides found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const params = new URLSearchParams();
              if (page > 1) params.set('page', String(page));
              if (activeCategory) params.set('category', activeCategory);
              if (searchQuery) params.set('q', searchQuery);
              const qs = params.toString();
              return (
                <a
                  key={page}
                  href={`/resource${qs ? `?${qs}` : ''}`}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    page === safePage
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-white border border-border text-text-body hover:border-accent'
                  }`}
                >
                  {page}
                </a>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
