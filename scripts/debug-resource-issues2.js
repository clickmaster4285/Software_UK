const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');
const path = require('path');

const dir = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Resource-Guide');

async function debugFile(label, filename) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`FILE: ${label} → ${filename}`);
  console.log('='.repeat(60));

  const filePath = path.join(dir, filename);
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;

  // Show ALL tables with full content
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  console.log('Total tables:', tables.length);

  tables.forEach((t, i) => {
    const trCount = (t.match(/<tr/gi) || []).length;
    const tdCount = (t.match(/<td/gi) || []).length;
    const thCount = (t.match(/<th/gi) || []).length;
    const text = t.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    console.log(`\n--- TABLE ${i} (rows:${trCount} tds:${tdCount} ths:${thCount} textLen:${text.length}) ---`);
    console.log('FULL TEXT:', text);
    console.log('FULL HTML:', t);
  });
}

(async () => {
  try {
    await debugFile('Issue2: IR35 Guide', 'ClickMasters_P695_resource_ir35_software_development_guide.docx');
    console.log('\n=== DONE ===');
  } catch (e) {
    console.error('Error:', e);
  }
})();
