'use client';

import { ChapterShell, CompactCard } from '../primitives';

/** Details only — 2-column grid; odd last card spans full width. */
export default function DetailsContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  const total = sections.length;
  const oddLast = total % 2 === 1;

  return (
    <ChapterShell
      label="Details"
      chapterId={chapterId}
      isFirst={isFirst}
      orphanTables={orphanTables}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((section, i) => {
          const isLastOdd = oddLast && i === total - 1;
          return (
            <div
              key={`${section.heading}-${i}`}
              className={isLastOdd ? 'sm:col-span-2' : undefined}
            >
              <CompactCard
                section={section}
                tables={(tables || []).filter((t) => t.title === section.heading)}
                index={i}
              />
            </div>
          );
        })}
      </div>
    </ChapterShell>
  );
}
