var fs = require('fs');
var path = require('path');
var dir = path.join(__dirname, 'Clickmasterssoftwaredevelopmentcompany.co.uk', 'Industry-Service-Page');
var files = fs.readdirSync(dir).filter(function(f) { return f.endsWith('.docx'); });

// Find resource-guide files
var rg = files.filter(function(f) {
  return f.match(/guide|compliance|ir35|dtac|cyber_essentials|smart_grants|tax_credits|data_residency|project_rescue|qualifying_rd/i);
});
console.log('=== Resource/Guide files ===');
console.log('Count:', rg.length);
rg.forEach(function(f) { console.log('  ' + f); });

// Find city files
var cityNames = ['london','manchester','edinburgh','birmingham','leeds','bristol','glasgow','belfast','dublin','amsterdam','paris','berlin','zurich','stockholm','milan','brussels','vienna','copenhagen','helsinki','warsaw','lisbon','rotterdam','gothenburg','prague','tallinn','oslo','cardiff','nottingham','oxford','cambridge','southampton','brighton','leicester','coventry','sheffield','liverpool','york','derby','hull','exeter'];
var city = files.filter(function(f) {
  var content = f.replace(/^ClickMasters_P\d+_/i, '').replace(/\.docx$/i, '').toLowerCase();
  // Remove optional _uk suffix
  content = content.replace(/_uk$/i, '');
  var parts = content.split('_');
  var last = parts[parts.length - 1];
  return cityNames.indexOf(last) !== -1;
});
console.log('\n=== City files ===');
console.log('Count:', city.length);
city.forEach(function(f) { console.log('  ' + f); });

// Find cost files
var cost = files.filter(function(f) {
  return f.match(/cost/i);
});
console.log('\n=== Cost files ===');
console.log('Count:', cost.length);
cost.forEach(function(f) { console.log('  ' + f); });

// Summary
console.log('\n=== Summary ===');
console.log('Total files:', files.length);
console.log('Resource/Guide:', rg.length);
console.log('City:', city.length);
console.log('Cost:', cost.length);
console.log('Glossary:', files.filter(function(f){return f.match(/^ClickMasters_P\d+_glossary_/i);}).length);
console.log('HowTo:', files.filter(function(f){return f.match(/^ClickMasters_P\d+_howto_/i);}).length);
console.log('Tech:', files.filter(function(f){return f.match(/^ClickMasters_P\d+_tech_/i);}).length);
