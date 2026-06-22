/**
 * Audit all page.js files for canonical tag coverage.
 * Checks whether each page has generateMetadata with alternates.canonical.
 */
const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'app');
const results = [];

function walkDir(dir, prefix = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, prefix ? `${prefix}/${entry.name}` : entry.name);
    } else if (entry.name === 'page.js') {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const route = `/${prefix}`;

      // Check for generateMetadata
      const hasMetadata = /generateMetadata|export async function metadata/.test(content);

      // Check for canonical
      const hasCanonical = /canonical/.test(content);
      const hasAlternates = /alternates/.test(content);

      // Check if canonical uses hardcoded URL or dynamic
      const canonicalLine = content.match(/canonical['":\s]+['"]([^'"]+)['"]/);
      const usesMetadataConfig = content.includes('metadataConfig');
      const usesSiteConfig = content.includes('siteConfig');

      results.push({
        route,
        hasMetadata,
        hasCanonical,
        hasAlternates,
        canonicalValue: canonicalLine ? canonicalLine[1] : null,
        usesMetadataConfig,
        usesSiteConfig,
      });
    }
  }
}

walkDir(APP_DIR);

console.log('\n=== CANONICAL TAG AUDIT ===\n');
console.log(`Total pages: ${results.length}\n`);

const withCanonical = results.filter(r => r.hasCanonical);
const withoutCanonical = results.filter(r => r.hasCanonical === false);
const withMetadata = results.filter(r => r.hasMetadata);

console.log(`✅ Pages WITH canonical:     ${withCanonical.length}`);
console.log(`❌ Pages WITHOUT canonical:  ${withoutCanonical.length}`);
console.log(`📄 Pages with generateMetadata: ${withMetadata.length}\n`);

console.log('--- Pages with canonical ---');
for (const r of withCanonical) {
  console.log(`  ✅ ${r.route}`);
  if (r.canonicalValue) console.log(`     → ${r.canonicalValue.substring(0, 80)}...`);
}

console.log('\n--- Pages MISSING canonical ---');
for (const r of withoutCanonical) {
  console.log(`  ❌ ${r.route}  (metadata: ${r.hasMetadata ? 'YES' : 'NO'})`);
}

// Check siteConfig URL
console.log('\n--- Checking siteConfig.url ---');
const metadataConfig = fs.readFileSync(path.join(APP_DIR, 'metadata-config.js'), 'utf-8');
const urlMatch = metadataConfig.match(/url:\s*['"]([^'"]+)['"]/);
if (urlMatch) {
  console.log(`  siteConfig.url = ${urlMatch[1]}`);
  if (urlMatch[1].includes('clickmasters.co') && !urlMatch[1].includes('clickmasterssoftwaredevelopmentcompany')) {
    console.log('  ⚠️  WARNING: URL does not match actual domain clickmasterssoftwaredevelopmentcompany.co.uk');
  }
}
