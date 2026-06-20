/**
 * Debug: Analyze Service DOCX structure (11 files)
 */
const fs = require('fs');
const path = require('path');
const mammoth = require('C:/Users/PC-24/Desktop/Software uk/node_modules/mammoth');

const folder = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Service');

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function countTags(html, tag) {
  return (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
}

function splitByTables(html) {
  const parts = [];
  const regex = /(<table[\s\S]*?<\/table>)/gi;
  let lastIndex = 0, match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', html: html.substring(lastIndex, match.index) });
    parts.push({ type: 'table', html: match[0] });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < html.length) parts.push({ type: 'text', html: html.substring(lastIndex) });
  return parts;
}

async function main() {
  const files = fs.readdirSync(folder).filter(f => f.endsWith('.docx'));
  console.log(`Found ${files.length} service files\n`);

  for (const file of files.slice(0, 2)) {
    const filePath = path.join(folder, file);
    const result = await mammoth.convertToHtml({ path: filePath });
    const html = result.value;
    const parts = splitByTables(html);

    console.log(`\n${'='.repeat(80)}`);
    console.log(`FILE: ${file}`);
    console.log(`Total parts: ${parts.length}`);

    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.type === 'table') {
        const text = stripHtml(p.html);
        const pCount = countTags(p.html, 'p');
        const tdCount = countTags(p.html, 'td');
        const hasThead = /<thead/i.test(p.html);
        console.log(`  [TABLE ${i}] p=${pCount} td=${tdCount} thead=${hasThead} | ${text.substring(0, 120)}`);
      } else {
        const text = stripHtml(p.html);
        if (text.length > 10) {
          console.log(`  [TEXT ${i}] len=${text.length} | ${text.substring(0, 150)}`);
        }
      }
    }
  }
}

main().catch(e => console.error(e));
