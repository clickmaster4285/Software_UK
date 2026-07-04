import { Suspense } from 'react';
import Link from 'next/link';
import { glossaryListings, getGlossaryLetters } from '@/data/glossary';
import { ArrowRight, BookOpen } from 'lucide-react';
import GlossaryFilterClient from './filter-client';

const ITEMS_PER_PAGE = 24;

const BASE_URL = 'https://clickmasterssoftwaredevelopmentcompany.co.uk/glossary';

export async function generateMetadata({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1', 10);
  const activeLetter = resolvedSearchParams?.letter || '';
  const searchQuery = resolvedSearchParams?.q || '';
  const canonical = page > 1 ? `${BASE_URL}?page=${page}` : BASE_URL;

  const metadata = {
    title: 'Glossary \u2014 UK Software Development Terms | ClickMasters',
    description: 'Comprehensive glossary of UK software development terms, technologies, and business concepts. Definitions covering APIs, MVPs, SaaS, GDPR, IR35, and more.',
    alternates: { canonical },
  };

  // Compute total pages for SEO pagination links
  let filtered = [...glossaryListings];
  if (activeLetter) {
    const upper = activeLetter.toUpperCase();
    filtered = filtered.filter(t => t.termDisplay.charAt(0).toUpperCase() === upper);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.termDisplay?.toLowerCase().includes(q) ||
      t.metaDesc?.toLowerCase().includes(q) ||
      t.slug?.toLowerCase().includes(q)
    );
  }
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const links = [];
  if (page > 1) {
    links.push({ rel: 'prev', href: page === 2 ? BASE_URL : `${BASE_URL}?page=${page - 1}` });
  }
  if (page < totalPages) {
    links.push({ rel: 'next', href: `${BASE_URL}?page=${page + 1}` });
  }
  if (links.length > 0) {
    metadata.link = links;
  }

  return metadata;
}

function GlossaryCard({ term }) {
  return (
    <Link
      href={`/glossary/${term.slug}`}
      className="group block h-full bg-white rounded-xl border border-border hover:border-accent hover:-translate-y-1 transition-all duration-250 shadow-xs hover:shadow-md"
    >
      <div className="p-6 flex flex-col h-full justify-between">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-surface border border-border text-text-body mb-3">
            {term.termDisplay.charAt(0).toUpperCase()}
          </span>
          <h3 className="font-heading text-lg font-bold text-text-primary mb-2 group-hover:text-accent transition-colors leading-snug">
            {term.termDisplay}
          </h3>
          <p className="text-sm text-text-muted line-clamp-2 mb-4">
            {term.metaDesc || `Definition of ${term.termDisplay} in UK software development context.`}
          </p>
        </div>
        <div className="flex items-center text-sm font-semibold text-accent group-hover:gap-1.5 gap-1 transition-all">
          Read Definition <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

export default async function GlossaryPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const activeLetter = resolvedSearchParams?.letter || '';
  const currentPage = parseInt(resolvedSearchParams?.page || '1', 10);
  const searchQuery = resolvedSearchParams?.q || '';

  const letters = getGlossaryLetters();

  let filtered = [...glossaryListings];

  if (activeLetter) {
    const upper = activeLetter.toUpperCase();
    filtered = filtered.filter(t => t.termDisplay.charAt(0).toUpperCase() === upper);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.termDisplay?.toLowerCase().includes(q) ||
      t.metaDesc?.toLowerCase().includes(q) ||
      t.slug?.toLowerCase().includes(q)
    );
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const safePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  const paginatedTerms = filtered.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const letterCounts = {};
  glossaryListings.forEach(t => {
    const letter = t.termDisplay.charAt(0).toUpperCase();
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  });

  const fallbackLoading = (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 26 }, (_, i) => (
        <div key={i} className="w-8 h-8 rounded-lg bg-surface animate-pulse" />
      ))}
    </div>
  );

  return (
    <main>
      <section className="relative bg-linear-to-br from-primary via-primary-mid to-primary py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent" />
        <div className="relative max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-white/10 border border-white/20 text-white/80 mb-6">
            <BookOpen className="w-3.5 h-3.5" />
            Glossary
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            UK Software Development
            <span className="block text-accent">Glossary</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-8">
            Browse {glossaryListings.length} expert definitions covering UK software development technologies, regulations, methodologies, and business concepts.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {glossaryListings.length} Terms
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              A-Z Index
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Updated 2025
            </span>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
          <Suspense fallback={fallbackLoading}>
            <GlossaryFilterClient
              letters={letters}
              letterCounts={letterCounts}
              activeLetter={activeLetter}
              searchQuery={searchQuery}
              totalCount={glossaryListings.length}
            />
          </Suspense>
        </div>
      </section>

      <section className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pt-8 pb-4">
        <p className="text-sm text-text-muted">
          Showing {paginatedTerms.length} of {filtered.length} glossary terms
          {activeLetter && ` starting with "${activeLetter.toUpperCase()}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </section>

      <section className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 pb-16">
        {paginatedTerms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedTerms.map(term => (
              <GlossaryCard key={term.id} term={term} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg">No glossary terms found matching your criteria.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              const params = new URLSearchParams();
              if (page > 1) params.set('page', String(page));
              if (activeLetter) params.set('letter', activeLetter);
              if (searchQuery) params.set('q', searchQuery);
              const qs = params.toString();
              return (
                <a
                  key={page}
                  href={`/glossary${qs ? '?' + qs : ''}`}
                  className={
                    'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ' +
                    (page === safePage
                      ? 'bg-accent text-white shadow-md'
                      : 'bg-white border border-border text-text-body hover:border-accent')
                  }
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
