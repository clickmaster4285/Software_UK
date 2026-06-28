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
 * Extract object data from a JS file.
 */
function extractObject(filePath, objectName) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf-8');

  let marker = `export const ${objectName}`;
  let start = content.indexOf(marker);
  if (start === -1) {
    marker = `const ${objectName}`;
    start = content.indexOf(marker);
  }
  if (start === -1) return {};

  const objectStart = content.indexOf('{', start);
  if (objectStart === -1) return {};

  let depth = 0;
  let i = objectStart;
  for (; i < content.length; i++) {
    if (content[i] === '{') depth++;
    else if (content[i] === '}') {
      depth--;
      if (depth === 0) break;
    }
  }

  const objectStr = content.slice(objectStart, i + 1);
  try {
    return new Function(`"use strict"; return (${objectStr})`)();
  } catch (e) {
    console.error(`  ⚠ Could not parse object ${objectName} in ${filePath}: ${e.message}`);
    return {};
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
    key: 'locations',
    mainPath: '/locations',
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
  
  // Clean up any old sitemap files first to prevent obsolete sitemaps
  if (fs.existsSync(PUBLIC_DIR)) {
    const files = fs.readdirSync(PUBLIC_DIR);
    for (const file of files) {
      if (file.startsWith('sitemap-') && file.endsWith('.xml')) {
        try {
          fs.unlinkSync(path.join(PUBLIC_DIR, file));
        } catch (e) {
          // ignore
        }
      }
    }
  }

  const activeSitemaps = [];

  // 1. Generate Static/Main Sitemap (1st Position)
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

  // 2. Generate Services Sitemap (2nd Position)
  const serviceUrls = [];

  // A. Add Category & Sub-Service pages from data/main-services.js
  const mainServicesPath = path.join(DATA_DIR, 'main-services.js');
  if (fs.existsSync(mainServicesPath)) {
    const mainServicesData = extractObject(mainServicesPath, 'mainServicesData');
    for (const categoryKey of Object.keys(mainServicesData)) {
      const categoryData = mainServicesData[categoryKey];
      
      // Add Category Page: /[category]/
      serviceUrls.push({
        loc: `${BASE_URL}/${categoryKey}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: new Date().toISOString()
      });

      // Add Sub-Service Pages: /[category]/[service]/
      if (categoryData.subServices) {
        for (const subService of categoryData.subServices) {
          serviceUrls.push({
            loc: `${BASE_URL}/${categoryKey}/${subService.slug}`,
            changefreq: 'weekly',
            priority: 0.7,
            lastmod: new Date().toISOString()
          });
        }
      }
    }
  }

  // B. Add Standalone Services from data/services.js (if any exist)
  const standaloneServicesPath = path.join(DATA_DIR, 'services.js');
  if (fs.existsSync(standaloneServicesPath)) {
    const standaloneServices = extractData(standaloneServicesPath, 'services');
    for (const service of standaloneServices) {
      serviceUrls.push({
        loc: `${BASE_URL}/service/${service.slug}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString()
      });
    }
  }

  if (serviceUrls.length > 0) {
    const servicesFilename = 'sitemap-services.xml';
    fs.writeFileSync(path.join(PUBLIC_DIR, servicesFilename), generateSitemapXml(serviceUrls));
    activeSitemaps.push(`${BASE_URL}/${servicesFilename}`);
    console.log(`✅ Generated ${servicesFilename} with ${serviceUrls.length} service urls.`);
  }

  // 3. Generate Category Sitemaps (Other categories follow)
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

  // 4. Generate Sitemap Index (sitemap.xml)
  const indexXml = generateSitemapIndexXml(activeSitemaps);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), indexXml);
  console.log(`✅ Generated main sitemap index: sitemap.xml listing ${activeSitemaps.length} categories.`);
}

run();
