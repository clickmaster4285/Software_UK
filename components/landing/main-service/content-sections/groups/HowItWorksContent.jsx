'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle How It Works content only. */
export default function HowItWorksContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="How It Works"
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
