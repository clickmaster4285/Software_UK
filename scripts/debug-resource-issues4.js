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

  // Show ALL tables with full HTML
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  console.log('Total tables:', tables.length);

  // Focus on tables 4-11 (the section titles and any content between them)
  for (let i = 0; i < tables.length; i++) {
    const t = tables[i];
    const trCount = (t.match(/<tr/gi) || []).length;
    const tdCount = (t.match(/<td/gi) || []).length;
    const thCount = (t.match(/<th/gi) || []).length;
    const text = t.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

    console.log(`\n--- TABLE ${i} (rows:${trCount} tds:${tdCount} ths:${thCount} textLen:${text.length}) ---`);
    console.log('FULL HTML:', t);
  }

  // Show gaps between tables 3-12
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let match;
  let idx = 0;
  const tablePositions = [];
  while ((match = tableRegex.exec(html)) !== null) {
    tablePositions.push({ index: idx, start: match.index, end: match.index + match[0].length });
    idx++;
  }

  for (let j = 3; j <= 12 && j < tablePositions.length; j++) {
    const t = tablePositions[j];
    const gapStart = t.end;
    const gapEnd = j + 1 < tablePositions.length ? tablePositions[j + 1].start : html.length;
    if (gapEnd > gapStart) {
      const gapHtml = html.substring(gapStart, gapEnd);
      const gapText = gapHtml.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      console.log(`\n>>> GAP after TABLE ${j} (${t.start}-${t.end}):`);
      console.log(`    HTML:`, gapHtml.substring(0, 600));
      console.log(`    TEXT:`, gapText.substring(0, 300));
    }
  }
}

(async () => {
  try {
    await debugFile('Issue1: GDPR Checklist', 'ClickMasters_P576_resource_uk_gdpr_compliance_checklist.docx');
    console.log('\n=== DONE ===');
  } catch (e) {
    console.error('Error:', e);
  }
})();
