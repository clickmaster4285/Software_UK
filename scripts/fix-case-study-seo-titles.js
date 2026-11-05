/**
 * CSU-03: Shorten case-study metaTitles to ≤60 chars, uniquify, fix duplicate titles.
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'case-studies.js');
let src = fs.readFileSync(filePath, 'utf8');

const titleFixes = [
  {
    slug: 'fintech-buy-now-pay-later-regulated',
    oldTitle: 'FinTech Buy Now Pay Later Platform — UK Regulated BNPL Provider',
    newTitle: 'FinTech BNPL Platform Rebuild — UK Financial Services Group',
  },
  {
    slug: 'proptech-build-to-rent-management-platform',
    oldTitle: 'PropTech Build-to-Rent Management Platform — UK BTR Operator',
    newTitle: 'PropTech Build-to-Rent Portfolio Ops — UK Institutional Landlord',
  },
];

for (const fix of titleFixes) {
  const slugIdx = src.indexOf(`"slug": "${fix.slug}"`);
  if (slugIdx < 0) {
    console.error('slug missing', fix.slug);
    continue;
  }
  const before = src.slice(0, slugIdx);
  const after = src.slice(slugIdx);
  if (!after.slice(0, 800).includes(fix.oldTitle)) {
    console.error('old title not near slug', fix.slug);
    continue;
  }
  src = before + after.replace(`"title": "${fix.oldTitle}"`, `"title": "${fix.newTitle}"`);
  console.log('title fixed', fix.slug);
}

function makeMetaTitle(title, used) {
  let base = title
    .replace(/\u2014/g, '–')
    .replace(/\s+—\s+/g, ' – ')
    .replace(/^FinTech\s+/, '')
    .replace(/^HealthTech\s+/, '')
    .replace(/^GovTech\s+/, '')
    .replace(/^EdTech\s+/, '')
    .replace(/^PropTech\s+/, '')
    .replace(/^InsurTech\s+/, '')
    .replace(/^LegalTech\s+/, '')
    .replace(/^MedTech\s+/, '')
    .replace(/^LogTech\s+/, '')
    .replace(/^RetailTech\s+/, '')
    .replace(/^CleanTech\s+/, '')
    .replace(/^eCommerce\s+/, '')
    .replace(/^AgriTech\s+/, '');

  const suffix = ' | Clickmasters';
  const maxBase = 60 - suffix.length;
  let candidate = base;
  if (candidate.length > maxBase) {
    candidate = candidate
      .slice(0, maxBase)
      .replace(/\s+\S*$/, '')
      .replace(/[–\-:|,]+$/, '')
      .trim();
  }
  let meta = `${candidate}${suffix}`;
  let n = 2;
  while (used.has(meta.toLowerCase())) {
    const tag = ` ${n}`;
    let c = base;
    const room = 60 - suffix.length - tag.length;
    if (c.length > room) {
      c = c.slice(0, room).replace(/\s+\S*$/, '').trim();
    }
    meta = `${c}${tag}${suffix}`;
    n += 1;
  }
  used.add(meta.toLowerCase());
  return meta;
}

const re =
  /\{\s*"id":\s*"([^"]+)",\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"metaTitle":\s*"([^"]+)"/g;
const used = new Set();
const updates = [];
let m;
while ((m = re.exec(src)) !== null) {
  const [, , slug, title, oldMeta] = m;
  const newMeta = makeMetaTitle(title, used);
  updates.push({ slug, oldMeta, newMeta, len: newMeta.length });
}

let changed = 0;
for (const u of updates) {
  if (u.oldMeta === u.newMeta) continue;
  const slugMarker = `"slug": "${u.slug}"`;
  const idx = src.indexOf(slugMarker);
  if (idx < 0) continue;
  const chunkEnd = idx + 500;
  const chunk = src.slice(idx, chunkEnd);
  const newChunk = chunk.replace(
    `"metaTitle": "${u.oldMeta}"`,
    `"metaTitle": "${u.newMeta}"`
  );
  if (newChunk !== chunk) {
    src = src.slice(0, idx) + newChunk + src.slice(chunkEnd);
    changed += 1;
  }
}

fs.writeFileSync(filePath, src);

const over = updates.filter((u) => u.len > 60).length;
const metaCounts = {};
for (const u of updates) {
  metaCounts[u.newMeta] = (metaCounts[u.newMeta] || 0) + 1;
}
const dups = Object.entries(metaCounts).filter(([, c]) => c > 1);

console.log(
  JSON.stringify(
    {
      total: updates.length,
      changed,
      over60: over,
      metaDups: dups.length,
      sample: updates.slice(0, 5),
    },
    null,
    2
  )
);
