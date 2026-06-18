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

  // Show positions of all tables
  const tableRegex = /<table[\s\S]*?<\/table>/gi;
  let match;
  let i = 0;
  const tables = [];
  while ((match = tableRegex.exec(html)) !== null) {
    tables.push({
      index: i,
      start: match.index,
      end: match.index + match[0].length,
      preview: match[0].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 60)
    });
    i++;
  }

  console.log('\nTable positions:');
  tables.forEach(t => {
    console.log(`  TABLE ${t.index}: [${t.start}-${t.end}] ${t.preview}`);
  });

  // Show gaps between tables 8-12 specifically
  for (let j = 8; j <= 12 && j < tables.length; j++) {
    const t = tables[j];
    const gapStart = t.end;
    const gapEnd = j + 1 < tables.length ? tables[j + 1].start : html.length;
    if (gapEnd > gapStart) {
      const gapHtml = html.substring(gapStart, gapEnd);
      const gapText = gapHtml.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      if (gapText.length > 0) {
        console.log(`\n>>> GAP after TABLE ${j} (${t.preview}):`);
        console.log(`    HTML (${gapHtml.length} chars):`, gapHtml.substring(0, 500));
        console.log(`    TEXT (${gapText.length} chars):`, gapText.substring(0, 200));
      }
    }
  }
}

(async () => {
  try {
    await debugFile('Issue2: IR35 Guide', 'ClickMasters_P695_resource_ir35_software_development_guide.docx');
    console.log('\n=== DONE ===');
  } catch (e) {
    console.error('Error:', e);
  }
})();
