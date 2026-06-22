import Link from 'next/link';
import { cityListings } from '@/data/cities';
import { ArrowRight, MapPin, BookOpen, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Software Development by City | ClickMasters UK',
  description: 'ClickMasters provides custom software development services across UK cities. Find local expertise in London, Manchester, Birmingham, and more.',
  alternates: { canonical: 'https://clickmasterssoftwaredevelopmentcompany.co.uk/cities' },
};

const ITEMS_PER_PAGE = 24;

function CityCard({ city }) {
  return (
    <Link href={`/cities/${city.slug}`} className="group block h-full bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md">
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-text-body">
              <MapPin className="w-3 h-3" />
              {city.city.charAt(0).toUpperCase() + city.city.slice(1).replace(/-/g, ' ')}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {city.title}
          </h3>

          {city.metaDesc && (
            <p className="text-sm text-text-muted line-clamp-3 mb-6">
              {city.metaDesc}
            </p>
          )}

          {city.badges && city.badges.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {city.badges.slice(0, 3).map((badge, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-muted">
                  {badge.length > 25 ? badge.substring(0, 25) + '...' : badge}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-1.5 gap-1 transition-all">
          View City Guide <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

function PaginationBar({ currentPage, totalPages }) {
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

  const buildHref = (page) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    return `/cities${qs ? `?${qs}` : ''}`;
  };

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

export default async function CitiesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);

  const filtered = [...cityListings].sort((a, b) => a.city.localeCompare(b.city));

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginated = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const ukCities = filtered.filter(c =>
    ['london','manchester','birmingham','edinburgh','glasgow','liverpool','leeds','bristol',
     'cardiff','sheffield','nottingham','southampton','brighton','leicester','coventry',
     'exeter','york','derby','hull'].includes(c.city)
  );
  const euCities = filtered.filter(c =>
    ['berlin','paris','amsterdam','dublin','stockholm','copenhagen','oslo','helsinki',
     'madrid','barcelona','lisbon','porto','milan','rome','vienna','prague','warsaw',
     'budapest','athens','brussels','munich','zurich','geneva','luxembourg','reykjavik'].includes(c.city)
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
            <Building2 className="w-3 h-3 mr-1.5 inline -mt-0.5" />
            Global City Guides
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Custom Software Development by City
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto font-body">
            {filtered.length} city-specific guides covering UK and European tech hubs — with pricing, compliance context, and local ecosystem insights.
          </p>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-border bg-white">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-muted">
              Showing <span className="font-semibold text-text-primary">{(safePage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-text-primary">{filtered.length}</span> cities
            </p>
            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                🇬🇧 {ukCities.length} UK Cities
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                🇪🇺 {euCities.length} European Cities
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-surface border border-border text-text-muted">
                🌍 {filtered.length - ukCities.length - euCities.length} Global
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Results Grid ── */}
      <section className="py-16 px-6 bg-surface min-h-[60vh]">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((city, index) => (
              <div
                key={city.id}
                className="opacity-0 animate-fade-up"
                style={{ animationDelay: `${(index % ITEMS_PER_PAGE) * 0.06}s`, animationFillMode: 'forwards' }}
              >
                <CityCard city={city} />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationBar currentPage={safePage} totalPages={totalPages} />
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
              <span className="section-label mb-6 bg-white/10 border-white/15 text-white/80">Global Reach</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">Need Software Development in Your City?</h2>
              <p className="text-white/60 max-w-xl mx-auto mb-10 text-lg">We deliver custom software for businesses across the UK, Europe, and beyond. Book a free consultation to discuss your project.</p>
              <Link href="/contact" className="btn-primary inline-flex items-center justify-center gap-2 text-base px-10 py-4">
                Book Free Consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
