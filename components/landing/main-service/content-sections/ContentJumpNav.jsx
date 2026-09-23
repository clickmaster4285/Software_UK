'use client';

import { slugChapter } from './lib';

export default function ContentJumpNav({
  orderedGroups,
  groups,
  active,
  onSelect,
  baseId,
}) {
  return (
    <div className="sticky top-0 z-20 -mx-4 border-y border-border/50 bg-background/95 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-xl lg:border lg:px-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
        <span className="shrink-0 font-heading text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
          Jump to
        </span>
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Content topics"
        >
          {orderedGroups.map((label) => {
            const isActive = active === label;
            const count = groups.get(label)?.length || 0;
            return (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${baseId}-chapter-${slugChapter(label)}`}
                onClick={() => onSelect(label)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-heading font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  isActive
                    ? 'bg-primary text-text-light shadow-sm'
                    : 'bg-white text-text-body border border-border hover:border-accent/40 hover:text-text-primary active:scale-[0.98]'
                }`}
              >
                {label}
                <span
                  className={`tabular-nums text-[11px] font-bold ${
                    isActive ? 'text-text-light/75' : 'text-text-muted'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
