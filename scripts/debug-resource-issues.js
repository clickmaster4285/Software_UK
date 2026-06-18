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
  console.log('Total HTML length:', html.length);

  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  console.log('Total tables:', tables.length);

  tables.forEach((t, i) => {
    const trCount = (t.match(/<tr/gi) || []).length;
    const tdCount = (t.match(/<td/gi) || []).length;
    const thCount = (t.match(/<th/gi) || []).length;
    const text = t.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#9745;/g, '✅').replace(/&#9744;/g, '☐').replace(/\s+/g, ' ').trim();

    console.log(`\n--- TABLE ${i} (rows:${trCount} tds:${tdCount} ths:${thCount} textLen:${text.length}) ---`);
    if (text.length < 600) {
      console.log('TEXT:', text);
    } else {
      console.log('TEXT (truncated):', text.substring(0, 400) + '...');
    }
    // Also dump raw HTML for small tables
    if (t.length < 2000) {
      console.log('HTML:', t);
    } else {
      console.log('HTML (first 600):', t.substring(0, 600));
    }
  });

  // Also check for non-table paragraphs with checkmarks
  const nonTableHtml = html.replace(/<table[\s\S]*?<\/table>/gi, '');
  const paragraphs = nonTableHtml.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || [];
  const checkPara = paragraphs.filter(p => p.includes('✅') || p.includes('☑') || p.includes('&#9745;'));
  if (checkPara.length > 0) {
    console.log(`\n>>> NON-TABLE PARAGRAPHS WITH CHECKMARKS: ${checkPara.length}`);
    checkPara.forEach((p, i) => {
      const text = p.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      console.line = `  P${i}: ${text.substring(0, 200)}`;
      console.log(`  P${i}: ${text.substring(0, 200)}`);
    });
  }
}

(async () => {
  try {
    // Issue 1: GDPR checklist with checkmark paragraphs all merged
    await debugFile('Issue1: GDPR Checklist', 'ClickMasters_P576_resource_uk_gdpr_compliance_checklist.docx');

    // Issue 2: IR35 with empty paragraph section
    await debugFile('Issue2: IR35 Guide', 'ClickMasters_P695_resource_ir35_software_development_guide.docx');

    console.log('\n=== DONE ===');
  } catch (e) {
    console.error('Error:', e);
  }
})();
