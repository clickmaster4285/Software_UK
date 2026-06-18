'use client';

export default function ResourceCategoryPills({ categories, activeCategory, searchQuery, totalCount }) {
  const buildUrl = (catKey) => {
    const params = new URLSearchParams();
    if (catKey) params.set('category', catKey);
    if (searchQuery) params.set('q', searchQuery);
    const qs = params.toString();
    return `/resource${qs ? `?${qs}` : ''}`;
  };

  return (
    <section className="bg-surface border-b border-border">
      <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6 py-4">
        <div className="flex flex-wrap gap-2">
          <a
            href={buildUrl('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeCategory
                ? 'bg-accent text-white shadow-md'
                : 'bg-white border border-border text-text-body hover:border-accent'
            }`}
          >
            All ({totalCount})
          </a>
          {categories.map(cat => (
            <a
              key={cat.key}
              href={buildUrl(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? 'bg-accent text-white shadow-md'
                  : 'bg-white border border-border text-text-body hover:border-accent'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label} ({cat.count})
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
