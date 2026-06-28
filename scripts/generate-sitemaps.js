const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://clickmasterssoftwaredevelopmentcompany.co.uk';
const DATA_DIR = path.join(__dirname, '..', 'data');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

/**
 * Extract array data from a JS data file.
 */
function extractData(filePath, arrayName) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');

  let marker = `export const ${arrayName}`;
  let start = content.indexOf(marker);
  if (start === -1) {
    marker = `const ${arrayName}`;
    start = content.indexOf(marker);
  }
  if (start === -1) return [];

  const arrayStart = content.indexOf('[', start);
  if (arrayStart === -1) return [];

  let depth = 0;
  let i = arrayStart;
  for (; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) break;
    }
  }

  const arrayStr = content.slice(arrayStart, i + 1);
  try {
    return JSON.parse(arrayStr);
  } catch {
    try {
      return new Function(`"use strict"; return (${arrayStr})`)();
    } catch (e) {
      console.error(`  ⚠ Could not parse ${filePath}: ${e.message}`);
      return [];
    }
  }
}

/**
 * Helper to build XML templates for sitemaps.
 */
function generateSitemapXml(urls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    if (url.lastmod) xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    if (url.changefreq) xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    if (url.priority) xml += `    <priority>${url.priority}</priority>\n`;
    xml += '  </url>\n';
  }
  xml += '</urlset>';
  return xml;
}

/**
 * Helper to build sitemap index XML template.
 */
function generateSitemapIndexXml(sitemapUrls) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const sitemapUrl of sitemapUrls) {
    xml += '  <sitemap>\n';
    xml += `    <loc>${sitemapUrl}</loc>\n`;
    xml += '  </sitemap>\n';
  }
  xml += '</sitemapindex>';
  return xml;
}

const CATEGORIES = [
  {
    key: 'case-studies',
    mainPath: '/case-studies',
    filePath: 'case-studies.js',
    arrayName: 'caseStudies',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'cities',
    mainPath: '/cities',
    filePath: 'cities.js',
    arrayName: 'cities',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'comparisons',
    mainPath: '/comparison',
    filePath: 'comparisons.js',
    arrayName: 'comparisons',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'glossary',
    mainPath: '/glossary',
    filePath: 'glossary.js',
    arrayName: 'glossaryTerms',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'hire',
    mainPath: '/hire',
    filePath: 'hire-pages.js',
    arrayName: 'hirePages',
    routeBuilder: (entry) => `/${entry.role}/${entry.city}`,
  },
  {
    key: 'industries',
    mainPath: '/industries',
    filePath: 'industries.js',
    arrayName: 'industries',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'resource-guides',
    mainPath: '/resource',
    filePath: 'resource-guides.js',
    arrayName: 'resourceGuides',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'salary-guides',
    mainPath: '/salary-guide',
    filePath: 'salary-guides.js',
    arrayName: 'salaryGuides',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
  {
    key: 'services',
    mainPath: '/services',
    filePath: 'services.js',
    arrayName: 'services',
    routeBuilder: (entry) => `/${entry.slug}`,
  },
];

const STATIC_PAGES = [
  { loc: `${BASE_URL}/`, changefreq: 'daily', priority: 1.0 },
  { loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: 0.6 },
  { loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: 0.6 },
  { loc: `${BASE_URL}/pricing`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/projects`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/solutions`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/testimonials`, changefreq: 'weekly', priority: 0.7 },
  { loc: `${BASE_URL}/faq`, changefreq: 'weekly', priority: 0.7 },
];

function run() {
  console.log('🤖 Starting programmatic sitemap splitting by category...');
  const activeSitemaps = [];

  // 1. Generate Static/Main Sitemap
  const mainUrls = STATIC_PAGES.map(p => ({
    loc: p.loc,
    changefreq: p.changefreq,
    priority: p.priority,
    lastmod: new Date().toISOString()
  }));
  const mainFilename = 'sitemap-main.xml';
  fs.writeFileSync(path.join(PUBLIC_DIR, mainFilename), generateSitemapXml(mainUrls));
  activeSitemaps.push(`${BASE_URL}/${mainFilename}`);
  console.log(`✅ Generated ${mainFilename} with ${mainUrls.length} static urls.`);

  // 2. Generate Category Sitemaps
  for (const cat of CATEGORIES) {
    const filePath = path.join(DATA_DIR, cat.filePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`  ⚠ Skipping: data/${cat.filePath} not found`);
      continue;
    }

    const data = extractData(filePath, cat.arrayName);
    if (!data || data.length === 0) {
      console.warn(`  ⚠ Skipping: data/${cat.filePath} had no data or could not be parsed`);
      continue;
    }

    const urls = [];
    
    // Add the main listing route
    urls.push({
      loc: `${BASE_URL}${cat.mainPath}`,
      changefreq: 'daily',
      priority: 0.8,
      lastmod: new Date().toISOString()
    });

    // Add all sub-pages
    for (const entry of data) {
      try {
        const subPath = cat.routeBuilder(entry);
        const subUrl = `${BASE_URL}${cat.mainPath}${subPath}`;
        urls.push({
          loc: subUrl,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: new Date().toISOString()
        });
      } catch (e) {
        // Skip entry if fields are missing
      }
    }

    const catFilename = `sitemap-${cat.key}.xml`;
    fs.writeFileSync(path.join(PUBLIC_DIR, catFilename), generateSitemapXml(urls));
    activeSitemaps.push(`${BASE_URL}/${catFilename}`);
    console.log(`✅ Generated ${catFilename} with ${urls.length} urls.`);
  }

  // 3. Generate Sitemap Index (sitemap.xml)
  const indexXml = generateSitemapIndexXml(activeSitemaps);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml);
  console.log(`✅ Generated main sitemap index: sitemap.xml listing ${activeSitemaps.length} categories.`);
}

run();
