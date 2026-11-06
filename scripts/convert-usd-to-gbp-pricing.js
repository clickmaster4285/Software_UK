/**
 * CSU-02: Standardise visible service pricing from USD ($) to GBP (£).
 * Targets main/sub service pricing surfaces — not EU dual-currency city copy.
 */
const fs = require('fs');
const path = require('path');

const targets = [
  'data/service-section-data.js',
  'data/sub-services.js',
];

const amountRe = /\$([0-9][\d,]*(?:\.\d+)?(?:[KkMmBb])?(?:\+)?(?:\/mo)?)/g;

for (const rel of targets) {
  const filePath = path.join(__dirname, '..', rel);
  let src = fs.readFileSync(filePath, 'utf8');
  const before = (src.match(/\$[0-9]/g) || []).length;
  src = src.replace(amountRe, '£$1');
  const after = (src.match(/\$[0-9]/g) || []).length;
  const pounds = (src.match(/£[0-9]/g) || []).length;
  fs.writeFileSync(filePath, src);
  console.log(rel, { before, after, pounds });
}
