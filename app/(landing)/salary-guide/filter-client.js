'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'Development',
  'Data & AI',
  'DevOps & Cloud',
  'Leadership',
  'Security & QA',
  'Product & Design'
];

const categoryEmoji = {
  'Development': '💻',
  'Data & AI': '🧠',
  'DevOps & Cloud': '☁️',
  'Leadership': '👑',
  'Security & QA': '🛡️',
  'Product & Design': '🎨'
};

export default function SalaryGuideFilterClient({ categoryCounts, activeCategory: initialCategory }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const updateURL = useCallback((page, category, q) => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    const qs = params.toString();
    router.push(`/salary-guide${qs ? `?${qs}` : ''}`, { scroll: false });
  }, [router]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    updateURL(1, activeCategory, searchQuery.trim());
  }, [activeCategory, searchQuery, updateURL]);

  const handleCategoryClick = useCallback((category) => {
    const next = activeCategory === category ? '' : category;
    setActiveCategory(next);
    updateURL(1, next, searchQuery.trim());
  }, [activeCategory, searchQuery, updateURL]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('');
    router.push('/salary-guide', { scroll: false });
  }, [router]);

  const hasActiveFilters = activeCategory || searchQuery.trim();

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search by role, technology, stack..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
        />
        {searchQuery && (
          <button type="button" onClick={() => { setSearchQuery(''); updateURL(1, activeCategory, ''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body">
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters || activeCategory
          ? 'bg-accent/10 border-accent text-accent'
          : 'border-border text-text-body hover:bg-surface'
          }`}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Categories
        {activeCategory && (
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

      {showFilters && (
        <div className="mt-2 pb-1 flex flex-wrap gap-2 w-full sm:mt-0 sm:w-auto">
          {CATEGORIES.map(category => {
            const isActive = activeCategory === category;
            const count = categoryCounts[category] || 0;
            return (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${isActive
                  ? 'bg-accent text-white shadow-md shadow-accent/20 scale-105'
                  : 'bg-surface text-text-body hover:bg-surface-2 border border-border'
                  }`}
              >
                <span>{categoryEmoji[category] || '📁'}</span>
                {category}
                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? 'bg-white/20' : 'bg-border'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
