const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');
const path = require('path');

const dir = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Glossary');

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function main() {
  const file = 'ClickMasters_P134_glossary_react-definition.docx';
  const filePath = path.join(dir, file);
  console.log('===', file, '===');

  const r = await mammoth.convertToHtml({ path: filePath });
  const html = r.value;
  const tables = html.match(/<table[\s\S]*?<\/table>/gi) || [];
  console.log('Total tables:', tables.length);

  // Show all tables briefly
  tables.forEach((t, i) => {
    const text = stripHtml(t).substring(0, 120);
    const rows = t.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    const cellCount = rows.length > 0 ? (rows[0].match(/<(th|td)/gi) || []).length : 0;
    console.log(`  T${i} [${cellCount} cells]: ${text}`);
  });

  // Find UK Context title table
  let ukTitleTable = null;
  let ukTitleIdx = -1;
  for (let i = 0; i < tables.length; i++) {
    const text = stripHtml(tables[i]);
    if (!/UK Context/i.test(text)) continue;
    const rows = tables[i].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    const cellCount = rows.length > 0 ? (rows[0].match(/<(th|td)/gi) || []).length : 0;
    if (cellCount >= 5) continue; // badge table
    if (text.length < 120) {
      ukTitleTable = tables[i];
      ukTitleIdx = i;
      console.log(`\nUK Context title table: T${i}`);
      break;
    }
  }

  if (!ukTitleTable) {
    console.log('\nNo UK Context title table found!');
    return;
  }

  const ukPos = html.indexOf(ukTitleTable);
  const afterTable = html.substring(ukPos + ukTitleTable.length);
  const nextTableMatch = afterTable.match(/<table[\s\S]*?<\/table>/i);
  const chunk = nextTableMatch ? afterTable.substring(0, afterTable.indexOf(nextTableMatch[0])) : afterTable;

  console.log('\nChunk after UK Context title:');
  console.log('  HTML length:', chunk.length);
  const pMatches = chunk.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  console.log('  <p> tags:', pMatches.length);
  pMatches.forEach((p, i) => {
    console.log(`  p[${i}]: ${stripHtml(p).substring(0, 150)}`);
  });
  if (pMatches.length === 0) {
    console.log('  Raw text:', stripHtml(chunk).substring(0, 300));
  }
}

main().catch(e => console.error(e));
