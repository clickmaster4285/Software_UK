'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useTransition } from 'react';
import { Search } from 'lucide-react';

export default function GlossaryFilterClient({
  letters = [],
  letterCounts = {},
  activeLetter = '',
  searchQuery = '',
  totalCount = 0,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const updateParams = useCallback((letter, query) => {
    const params = new URLSearchParams();
    if (letter) params.set('letter', letter);
    if (query && query.trim()) params.set('q', query.trim());
    const qs = params.toString();
    startTransition(() => {
      router.push(`/glossary${qs ? '?' + qs : ''}`);
    });
  }, [router]);

  const handleLetterClick = useCallback((letter) => {
    const newLetter = activeLetter === letter ? '' : letter;
    updateParams(newLetter, localQuery);
  }, [activeLetter, localQuery, updateParams]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    updateParams(activeLetter, localQuery);
  }, [activeLetter, localQuery, updateParams]);

  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <>
      {/* A-Z Letters */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {allLetters.map(letter => {
          const count = letterCounts[letter] || 0;
          const isActive = activeLetter.toUpperCase() === letter;
          const hasTerms = count > 0;

          return (
            <button
              key={letter}
              onClick={() => hasTerms && handleLetterClick(letter)}
              disabled={!hasTerms}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-accent text-white shadow-md'
                  : hasTerms
                    ? 'bg-white border border-border text-text-body hover:border-accent hover:text-accent cursor-pointer'
                    : 'bg-surface text-text-muted/40 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search glossary terms..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
        />
      </form>
    </>
  );
}
