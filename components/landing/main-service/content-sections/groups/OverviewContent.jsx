'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle Overview content only. */
export default function OverviewContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="Overview"
      chapterId={chapterId}
      isFirst={isFirst}
      orphanTables={orphanTables}
    >
      <DefaultGroupBody
        sections={sections}
        tables={tables}
        gridClassName="grid gap-4 sm:grid-cols-2"
      />
    </ChapterShell>
  );
}
