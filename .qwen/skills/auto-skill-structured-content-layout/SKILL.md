---
name: structured-content-layout
description: Parse dense long-form text fields into structured editorial layouts — subsection cards, bullet splits, metric highlighting — for scannable detail pages
source: auto-skill
extracted_at: '2026-06-22T08:36:46.607Z'
---

# Structured Content Layout Pattern

## When to Use

Apply this pattern when a detail page has text fields that are long, dense paragraphs containing multiple logical subsections or outcomes merged into a single string. Common in case studies, project pages, service descriptions, and any content sourced from DOCX/CSV where structured data was flattened into prose.

**Symptoms this solves:**
- Walls of text with no visual structure
- Multiple distinct points merged into one `<p>` tag
- Key metrics (numbers, percentages, currency) buried in prose
- Subsections identifiable by label patterns (e.g., "Architecture:", "Delivery:")

## The Pattern

### 1. Subsection Parsing (for fields like "approach", "methodology", "process")

When a text field contains labelled subsections joined together:

```
"Architecture: Next.js, Node.js, PostgreSQL. Delivery: 12-week build. Compliance: GDPR, WCAG."
```

**Step 1 — Split on label:content patterns:**

```javascript
const subsectionRegex = /([A-Z][A-Za-z0-9\s/&]+?):\s/g;
const indices = [];
let match;
while ((match = subsectionRegex.exec(text)) !== null) {
  indices.push({
    label: match[1].trim(),
    start: match.index + match[0].length,
    labelStart: match.index
  });
}
const sections = [];
for (let i = 0; i < indices.length; i++) {
  const end = i + 1 < indices.length ? indices[i + 1].labelStart : text.length;
  const content = text.substring(indices[i].start, end).trim();
  if (content) sections.push({ label: indices[i].label, content });
}
```

**Step 2 — Split each subsection's content into bullets. Two patterns exist in real data:**

**Pattern A (~70%): Sentence-based** — split on period-space or semicolons:

```javascript
const bullets = content
  .split(/(?<=\.)\s+(?=[A-Z])|;\s*/)
  .map(b => b.trim())
  .filter(b => b.length > 0);
```

**Pattern B (~30%): Numbered list** — `(1) item (2) item (3) item`. Detect and split:

```javascript
const hasNumberedList = /^\(\d+\)/.test(content.trim());
let bullets;
if (hasNumberedList) {
  bullets = content
    .split(/(?=\(\d+\)\s)/)
    .map(b => b.trim())
    .filter(b => b.length > 0);
} else {
  bullets = content
    .split(/(?<=\.)\s+(?=[A-Z])|;\s*/)
    .map(b => b.trim())
    .filter(b => b.length > 0);
}
```

**Step 3 — Render each subsection as a card with label + bullet list (or single paragraph if only one bullet).**

For numbered lists, render each item with a numbered badge instead of a dot, and strip the `(N) ` prefix from display text:

```jsx
{bullets.map((b, bIdx) => (
  <li key={bIdx} className="flex items-start gap-2.5">
    {hasNumberedList ? (
      <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-500 text-[10px] font-bold flex items-center justify-center shrink-0">
        {b.match(/^\((\d+)\)/)?.[1] || '•'}
      </span>
    ) : (
      <span className="w-1 h-1 rounded-full bg-blue-300 mt-2 shrink-0" />
    )}
    <span>{b.replace(/^\(\d+\)\s*/, '')}</span>
  </li>
))}
```

**Fallback:** If no subsections detected, render the entire text as a single `<p>`.

### 2. Outcome Card Grid (for fields like "results", "outcomes", "impact")

When a text field contains multiple distinct outcome sentences:

```
"Delivered at £165,000. 450 signups in first month. 8% conversion rate."
```

**Step 1 — Split into sentences:**

```javascript
const sentences = text
  .split(/(?<=\.)\s+(?=[A-Z])/)
  .map(s => s.trim())
  .filter(s => s.length > 0);
```

**Step 2 — Highlight metrics in each sentence:**

```javascript
const highlightMetrics = (text) => {
  const parts = text.split(
    /(£[\d,.]+%?|\d+%|\d+\s*(?:weeks?|months?|days?|hours?|minutes?|seconds?|years?|x\b)?)/gi
  );
  return parts.map((part, i) => {
    if (/^(£[\d,.]+%?|\d+%|\d+\s*(?:weeks?|months?|days?|hours?|minutes?|seconds?|years?|x\b)?)$/i.test(part)) {
      return <strong key={i} className="text-[accent-color] font-bold">{part}</strong>;
    }
    return part;
  });
};
```

**Step 3 — Render each sentence as an individual card in a 2-column grid**, with a check/icon marker.

### 3. Single Paragraph Card (for fields like "challenge", "context")

When a field is a single cohesive paragraph that shouldn't be split:

- Render as a clean card with an icon heading
- Use generous line-height (`leading-[1.8]`) for readability
- Add a subtle colored border matching the section's color theme

## Color Coding Convention

| Section Type | Color Family | Usage |
|-------------|-------------|-------|
| Problem/Challenge | red | Icon, step badge, border |
| Approach/Method | blue | Icon, subsection labels, dots |
| Results/Outcomes | emerald/green | Icon, check marks, metric highlights |
| Neutral/Overview | slate/gray | Meta info, secondary content |

## Responsive Rules

- Outcome cards: single column on mobile, 2-column at `sm+`
- Subsection cards: always single column (stacked)
- Icon + heading rows: always horizontal, never stack

## Real-World Example

Applied in `app/(landing)/case-studies/[slug]/detail-client.js`:

- **Challenge** → single red card, `leading-[1.8]` paragraph
- **Approach** → parsed on `Label:` patterns, each rendered as a blue card with dot-labeled subsection heading + bullet list
- **Results** → split into sentences, each rendered as an emerald card in a 2-column grid with `£`/`%`/time-unit metrics auto-highlighted in bold

## Gotchas

- The subsection regex `/([A-Z][A-Za-z0-9\s/&]+?):\s/g` is non-greedy — it will match the first colon after a capitalized word sequence. This means labels containing colons (e.g., "Domain 3 (Technical Security)") work correctly because the regex stops at the first `:`.
- Sentence splitting on `(?<=\.)\s+(?=[A-Z])` assumes sentences start with capital letters. Abbreviations like "GDPR" or "AWS" mid-sentence can cause false splits. If this is a problem, add a negative lookbehind for common abbreviations.
- Metric highlighting regex can match bare numbers that aren't meaningful metrics. Tighten the regex if you get false positives (e.g., require at least 2 digits or a currency symbol).
- **Numbered list pattern `(1) item (2) item (3) item`** is common in DOCX-sourced data (~30% of entries in case studies). Always detect this pattern with `/^\(\d+\)/` before applying sentence-based splitting — the two patterns are mutually exclusive within a single subsection. Use a lookahead split `(?=\(\d+\)\s)` to keep the number attached to each item, then strip `(N) ` for display.
