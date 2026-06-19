const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');
const path = require('path');

const dir = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Glossary');

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function main() {
  // Compare schema table between working (P105) and broken (P134) files
  const files = [
    'ClickMasters_P105_glossary_ir35_definition.docx',
    'ClickMasters_P134_glossary_react-definition.docx',
  ];

  for (const file of files) {
    const filePath = path.join(dir, file);
    console.log('\n===', file, '===');
    const r = await mammoth.convertToHtml({ path: filePath });
    const html = r.value;
    const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];

    // Find schema table
    for (let i = 0; i < tables.length; i++) {
      const text = stripHtml(tables[i]);
      if (/DefinedTerm|FAQPage|Target KW/i.test(text)) {
        console.log(`  Schema table T${i}:`);
        console.log('  Text:', text.substring(0, 300));
        console.log('  Raw HTML:', tables[i].substring(0, 400));
      }
    }
  }
}

main().catch(e => console.error(e));
