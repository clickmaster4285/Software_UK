'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle Investment / pricing content only. */
export default function InvestmentContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="Investment"
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
