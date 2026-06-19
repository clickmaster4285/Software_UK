const fs = require('fs');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');
const path = require('path');

const dir = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Glossary');

async function main() {
  // Check a few hyphen-format files vs underscore-format files
  const files = [
    'ClickMasters_P105_glossary_ir35_definition.docx',   // underscore - works
    'ClickMasters_P134_glossary_react-definition.docx',  // hyphen - broken
    'ClickMasters_P135_glossary_postgresql-definition.docx', // hyphen - broken
  ];

  for (const f of files) {
    const filePath = path.join(dir, f);
    console.log('===', f, '===');
    try {
      const r = await mammoth.convertToHtml({ path: filePath });
      const html = r.value;
      const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
      console.log('  Tables:', tables.length);

      // Show first table (meta)
      if (tables[0]) {
        const t0 = tables[0].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('  T0 (meta):', t0.substring(0, 250));
      }
      // Show second table (header)
      if (tables[1]) {
        const t1 = tables[1].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        console.log('  T1 (header):', t1.substring(0, 250));
      }
      // Show H1
      const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      if (h1) console.log('  H1:', h1[1].replace(/<[^>]*>/g, '').trim());

      // Check SLUG value
      const slugMatch = html.match(/SLUG:\s*([^\s]+)/i);
      if (slugMatch) console.log('  SLUG:', slugMatch[1]);

      // Check for Direct Answer
      const daMatch = html.match(/Direct Answer:/i);
      console.log('  Has Direct Answer:', !!daMatch);

      // Check for UK Context
      const ukMatch = html.match(/UK Context/i);
      console.log('  Has UK Context:', !!ukMatch);

      // Check for Related Terms
      const rtMatch = html.match(/Related Terms/i);
      console.log('  Has Related Terms:', !!rtMatch);

      // Check for Related Pages
      const rpMatch = html.match(/Related Pages/i);
      console.log('  Has Related Pages:', !!rpMatch);

      // Check for CTA
      const ctaMatch = html.match(/Get Expert Advice/i);
      console.log('  Has CTA:', !!ctaMatch);

      // Check for schema
      const schemaMatch = html.match(/DefinedTerm|FAQPage|Target KW/i);
      console.log('  Has Schema:', !!schemaMatch);

    } catch (e) {
      console.log('  ERROR:', e.message);
    }
    console.log();
  }
}

main();
