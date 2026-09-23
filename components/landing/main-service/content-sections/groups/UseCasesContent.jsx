'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle Use Cases content only. */
export default function UseCasesContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="Use Cases"
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
