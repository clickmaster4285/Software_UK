'use client';

import { ChapterShell, DefaultGroupBody } from '../primitives';

/** Edit this file to restyle Deliverables content only. */
export default function DeliverablesContent({
  sections,
  tables,
  orphanTables,
  chapterId,
  isFirst,
}) {
  return (
    <ChapterShell
      label="Deliverables"
      chapterId={chapterId}
      isFirst={isFirst}
      orphanTables={orphanTables}
    >
      <DefaultGroupBody sections={sections} tables={tables} />
    </ChapterShell>
  );
}
