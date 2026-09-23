'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle Services content only. */
export default function ServicesContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="Services"
      chapterId={chapterId}
      isFirst={isFirst}
      orphanTables={orphanTables}
    >
      <DefaultGroupBody
        sections={sections}
        tables={tables}
        gridClassName="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      />
    </ChapterShell>
  );
}
