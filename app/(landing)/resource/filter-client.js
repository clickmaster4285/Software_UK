'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function ResourceGuideFilterClient({ categoryCounts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const updateURL = useCallback((q) => {
    const params = new URLSearchParams();
    const currentCategory = searchParams.get('category');
    if (currentCategory) params.set('category', currentCategory);
    if (q) params.set('q', q);
    const qs = params.toString();
    router.push(`/resource${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router, searchParams]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    updateURL(searchQuery);
  }, [searchQuery, updateURL]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    const params = new URLSearchParams();
    const currentCategory = searchParams.get('category');
    if (currentCategory) params.set('category', currentCategory);
    const qs = params.toString();
    router.push(`/resource${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resource guides..."
          className="w-full h-10 pl-10 pr-10 bg-white border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="h-10 px-6 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
      >
        Search
      </button>
    </form>
  );
}
