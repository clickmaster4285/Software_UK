const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk');
const SOURCE_DIR = path.join(BASE, 'Industry-Service-Page');

// Known UK/international cities for city-specific detection
const CITY_SET = new Set([
  'london', 'manchester', 'glasgow', 'edinburgh', 'birmingham', 'dublin',
  'cardiff', 'bristol', 'leeds', 'liverpool', 'sheffield', 'newcastle',
  'nottingham', 'southampton', 'brighton', 'oxford', 'cambridge', 'york',
  'belfast', 'dundee', 'aberdeen', 'swansea', 'portsmouth', 'leicester',
  'coventry', 'bradford', 'wolverhampton', 'plymouth', 'derby', 'swindon',
  'norwich', 'ipswich', 'chelmsford', 'reading', 'slough', 'watford',
  'milton-keynes', 'northampton', 'luton', 'basildon', 'exeter',
  'blackburn', 'preston', 'bolton', 'wigan', 'salford', 'rochdale',
  'stockport', 'wakefield', 'doncaster', 'rotherham', 'barnsley',
  'huddersfield', 'halifax', 'warrington', 'stoke', 'stoke-on-trent',
  'walsall', 'dudley', 'west-bromwich', 'sutton-coldfield', 'telford',
  'worcester', 'hereford', 'shrewsbury', 'chester', 'carlisle',
  'durham', 'sunderland', 'middlesbrough', 'redcar', 'stockton',
  'darlington', 'harrogate', 'scarborough', 'whitby', 'bath',
  'salisbury', 'winchester', 'chichester', 'canterbury', 'rochester',
  'maidstone', 'tunbridge-wells', 'guildford', 'woking', 'epsom',
  'reigate', 'kingston', 'richmond', 'bournemouth', 'poole',
  'weymouth', 'dorchester', 'taunton', 'tiverton', 'barnstaple',
  'exmouth', 'truro', 'falmouth', 'penzance', 'st-ives',
  'newquay', 'bodmin', 'liskeard', 'launceston', 'peterborough',
  'stamford', 'spalding', 'boston', 'lincoln', 'gainsborough',
  'scunthorpe', 'grimsby', 'hull', 'beverley', 'bridlington',
  'driffield', 'aylesbury', 'high-wycombe', 'marlow', 'henley',
  'banbury', 'bicester', 'witney', 'carterton', 'wantage',
  'didcot', 'abingdon', 'wallingford', 'thame', 'maidenhead',
  'windsor', 'bracknell', 'crowthorne', 'sandhurst', 'ascot',
  'fleet', 'farnborough', 'aldershot', 'godalming', 'haslemere',
  'dorking', 'redhill', 'crawley', 'horsham', 'haywards-heath',
  'burgess-hill', 'east-grinstead', 'uckfield', 'lewes',
  'newhaven', 'seaford', 'eastbourne', 'hastings', 'bexhill',
  'rye', 'tenterden', 'ashford', 'folkestone', 'dover', 'deal',
  'sandwich', 'margate', 'ramsgate', 'broadstairs', 'whitstable',
  'faversham', 'sittingbourne', 'sheerness', 'queenborough',
  'chatham', 'gillingham', 'rainham', 'tonbridge', 'sevenoaks',
  'edenbridge', 'cranbrook', 'gravesend', 'dartford', 'erith',
  'bexleyheath', 'sidcup', 'beckenham', 'bromley', 'chislehurst',
  'orpington', 'petts-wood', 'croydon', 'sutton', 'carshalton',
  'wallington', 'ewell', 'leatherhead', 'farnham', 'alton',
  'basingstoke', 'andover', 'eastleigh', 'fareham', 'gosport',
  'havant', 'waterlooville', 'petersfield', 'midhurst', 'petworth',
  'bognor-regis', 'littlehampton', 'worthing', 'shoreham', 'lancing',
  'southwick', 'ryde', 'newport', 'cowes', 'sandown', 'shanklin',
  'ventnor', 'yarmouth', 'freshwater', 'totland', 'padstow',
  'bude', 'saltash', 'torpoint', 'dartmouth', 'totnes',
  'paignton', 'torquay', 'brixham', 'teignmouth', 'dawlish',
  'budleigh-salterton', 'honiton', 'axminster', 'lyme-regis',
  'bridport', 'portland', 'chickerell', 'gloucester', 'cheltenham',
  'stroud', 'cirencester', 'tetbury', 'nailsworth', 'dursley',
  'wotton-under-edge', 'thornbury', 'yate', 'chipping-sodbury',
  'westbury-on-trym', 'clevedon', 'weston-super-mare', 'burnham-on-sea',
  'highbridge', 'bridgwater', 'wellington', 'minehead', 'watchet',
  'dulverton', 'wiveliscombe', 'braunton', 'ilfracombe', 'lynton',
  'lynn', 'bideford', 'torrington', 'great-torrington',
  'okehampton', 'hatherleigh', 'south-molton', 'chulmleigh',
  'bishops-castle', 'clun', 'craven-arms', 'knighton',
  'prestigne', 'builth-wells', 'rhayader', 'llandrindod',
  'aberystwyth', 'cardigan', 'lampeter', 'llanelli',
  'neath', 'port-talbot', 'bridgend', 'porthcawl',
  'barry', 'penarth', 'llandough', 'dinas-powys',
  'pontypridd', 'caerphilly', 'blackwood', 'newbridge',
  'abertillery', 'ebbw-vale', 'cwmbran', 'monmouth',
  'chepstow', 'caldicot', 'magor', 'usk', 'raglan',
  'abergavenny', 'crickhowell', 'brecon', 'hay-on-wye',
  'kington', 'llangollen', 'corwen', 'denbigh', 'st-asaph',
  'abergele', 'colwyn-bay', 'old-colwyn', 'llandudno',
  'conwy', 'bangor', 'caernarfon', 'porthmadog',
  'pwllheli', 'criccieth', 'harlech', 'bala',
  'dolgellau', 'barmouth', 'tywyn', 'fairbourne',
  'llanfairfechan', 'penmaenmawr', 'llanfairpwll',
  'menai-bridge', 'beaumaris', 'amlwch', 'valley',
  'holyhead', 'llangefni', 'ammanford', 'llandeilo',
  'llandovery', 'llanidloes', 'newtown', 'welshpool',
  'llanfyllin', 'oswestry', 'wrexham', 'ruabon',
  'chirk', 'overton', 'whitchurch', 'malpas',
  'nantwich', 'crewe', 'sandbach', 'middlewich',
  'northwich', 'winsford', 'ellesmere-port', 'neston',
  'west-kirby', 'hoylake', 'wallasey', 'bootle',
  'crosby', 'formby', 'southport', 'ormskirk',
  'maghull', 'kirkby', 'prescot', 'st-helens',
  'haydock', 'newton-le-willows', 'leigh', 'atherton',
  'hindley', 'standish', 'chorley', 'leyland',
  'fulwood', 'longridge', 'goosnargh', 'garstang',
  'lancaster', 'morecambe', 'carnforth', 'kendal',
  'windermere', 'ambleside', 'grasmere', 'keswick',
  'cockermouth', 'whitehaven', 'workington', 'maryport',
  'wigton', 'brampton', 'hexham', 'haltwhistle',
  'haydon-bridge', 'allendale', 'alnwick', 'berwick-upon-tweed',
  'wooler', 'cornhill-on-tweed', 'morpeth', 'ashington',
  'blyth', 'cramlington', 'gateshead', 'south-shields',
  'jarrow', 'hebburn', 'whitburn', 'houghton-le-spring',
  'chester-le-street', 'stanley', 'consett', 'shotley-bridge',
  'rowlands-gill', 'bishop-auckland', 'barnard-castle',
  'shildon', 'newton-aycliffe', 'sedgefield', 'fishburn',
  'trimdon', 'wingate', 'peterlee', 'horden',
  'easington', 'seaham', 'murton', 'dalton-le-dale',
  'cold-hesledon', 'blackhall', 'hartlepool', 'seaton-carew',
  'greatham', 'billingham', 'guisborough', 'great-ayton',
  'stokesley', 'ingleby-barwick', 'yarm', 'ingleton',
  'kirkby-lonsdale', 'sedbergh', 'bowness', 'penrith',
  'appleby', 'shap', 'kirkby-stephen', 'greystoke',
  'troutbeck', 'patterdale', 'glenridding', 'pooley-bridge',
  'caldbeck', 'bassenthwaite', 'broughton-in-furness',
  'milnthorpe', 'burton-in-kendal', 'holme', 'orton',
  'appleby-in-westmorland', 'longtown', 'gretna',
  'annan', 'dumfries', 'sanquhar', 'moffat',
  'selkirk', 'galashiels', 'melrose', 'kelso',
  'jedburgh', 'hawick', 'langholm', 'lockerbie',
  'biggar', 'lanark', 'lesmahagow', 'douglas',
  'abington', 'carstairs', 'wishaw', 'motherwell',
  'hamilton', 'east-kilbride', 'rutherglen', 'cambuslang',
  'blantyre', 'bothwell', 'utherstone', 'milngavie',
  'bearsden', 'bishopbriggs', 'lennoxtown', 'kirkintilloch',
  'cumbernauld', 'airdrie', 'coatbridge', 'bellshill',
  'carluke', 'paisley', 'johnstone', 'bridge-of-weir',
  'kilmacolm', 'greenock', 'gourock', 'dunoon',
  'rothesay', 'wemyss-bay', 'dumbarton', 'alexandria',
  'helensburgh', 'cardross', 'campbeltown', 'tarbert',
  'lochgilphead', 'inveraray', 'musselburgh', 'prestongrange',
  'cockenzie', 'tranent', 'haddington', 'dunbar',
  'north-berwick', 'dirleton', 'gullane', 'longniddry',
  'pencaitland', 'ormiston', 'east-linton', 'cockburnspath',
  'eyemouth', 'coldingham', 'norham', 'cornhill',
  'coldstream', 'sprouston', 'morebattle', 'denholm',
  'newcastleton', 'sanquhar', 'lockerbie', 'lesmahagow',
  'rutherglen', 'cambuslang', 'blantyre', 'bothwell',
  'johnstone', 'bridge-of-weir', 'kilmacolm', 'port-glasgow',
  'clydebank', 'stirling', 'alloa', 'clackmannan',
  'dollar', 'kinross', 'cowie', 'dunfermline',
  'kelty', 'lochgelly', 'cardenden', 'cupar',
  'newburgh', 'newport-on-tay', 'tayport', 'monifieth',
  'broughty-ferry', 'arnoustie', 'carnoustie', 'forfar',
  'kirriemuir', 'blairgowrie', 'perth', 'crieff',
  'aberfeldy', 'pitlochry', 'blair-atholl', 'calvine',
  'braemar', 'ballater', 'banchory', 'stonehaven',
  'laurencekirk', 'inverurie', 'huntly', 'keith',
  'dufftown', 'tomintoul', 'ballindalloch', 'grantown-on-spey',
  'elgin', 'forres', 'nairn', 'inverness', 'beauly',
  'dingwall', 'muir-of-ord', 'fortrose', 'rosemarkie',
  'cromarty', 'tain', 'dornoch', 'golspie', 'brora',
  'helmsdale', 'lairg', 'durness', 'tongue',
  'thurso', 'castletown', 'john-o-groats', 'wick',
  'stornoway', 'tarbert', 'lochmaddy', 'lochboisdale',
  'castlebay', 'lisburn', 'newtownards', 'bangor',
  'holywood', 'comber', 'donaghadee', 'ards',
  'moira', 'lurgan', 'craigavon', 'portadown',
  'armagh', 'monaghan', 'clones', 'carrickmacross',
  'castleblayney', 'ballybay', 'dundalk', 'drogheda',
  'ardee', 'laytown', 'bettystown', 'mornington',
  'donabate', 'swords', 'malahide', 'portmarnock',
  'baldoyle', 'howth', 'sutton', 'dun-laoghaire',
  'dalkey', 'killiney', 'bray', 'greystones',
  'delgany', 'newtownmountkennedy', 'ashford', 'rathnew',
  'wicklow', 'arklow', 'gorey', 'enniscorthy',
  'wexford', 'rosslare', 'new-ross', 'kilkenny',
  'callan', 'thomastown', 'inistioge', 'graiguenamanagh',
  'borris', 'bagenalstown', 'carlow', 'tullow',
  'rathvilly', 'hacketstown', 'muine-beag', 'navan',
  'trim', 'kells', 'athboy', 'mullingar', 'moate',
  'kilbeggan', 'tyrellspass', 'clara', 'tullamore',
  'birr', 'banagher', 'portarlington', 'mountmellick',
  'mountrath', 'portlaoise', 'abbeyleix', 'durrow',
  'cullahill', 'rathdowney', 'borris-in-ossory', 'templemore',
  'thurles', 'cashel', 'cahir', 'clonmel',
  'carrick-on-suir', 'waterford', 'dungarvan', 'lismore',
  'cappoquin', 'fermoy', 'mallow', 'mitchelstown',
  'charleville', 'kilmallock', 'bruree', 'newcastle-west',
  'abbeyfeale', 'listowel', 'tralee', 'killarney',
  'kenmare', 'sneem', 'cahersiveen', 'waterville',
  'dingle', 'ballybunion', 'tarbert', 'ballyhooly',
  'castletownroche', 'ballyduff', 'ferns', 'rathdrum',
  'glenealy', 'avoca', 'woodenbridge', 'ennis',
  'kilrush', 'kilkee', 'lahinch', 'milltown-malbay',
  'doonbeg', 'quilty', 'malbay', 'scariff',
  'tuamgraney', 'killaloe', 'ballina', 'castlebar',
  'westport', 'claremorris', 'ballinrobe', 'cloonbur',
  'headford', 'tuam', 'mountbellew', 'glenamaddy',
  'athenry', 'ballinasloe', 'roscrea', 'nenagh',
  'borrisokane', 'cloughjordan', 'parsonstown', 'kinnegad',
  'athlone', 'castlepollard', 'granard', 'oldcastle',
  'ballyjamesduff', 'cavan', 'virginia', 'bailieborough',
  'kingscourt', 'amsterdam', 'paris', 'berlin', 'zurich',
  'stockholm', 'milan', 'brussels', 'vienna', 'copenhagen',
  'helsinki', 'warsaw', 'lisbon', 'rotterdam', 'gothenburg',
  'prague', 'tallinn', 'oslo', 'dublin', 'luxembourg',
  'munich', 'hamburg', 'frankfurt', 'amsterdam'
]);

function classifyFile(filename) {
  // Strip prefix: ClickMasters_P{number}_
  const withoutPrefix = filename.replace(/^ClickMasters_P\d+_/i, '');
  // Strip suffix: .docx (with optional _uk before it)
  const content = withoutPrefix.replace(/_uk\.docx$/i, '').replace(/\.docx$/i, '').toLowerCase();

  // 1. Explicit prefix checks (most reliable)
  if (content.startsWith('glossary_')) {
    return { type: 'glossary', content };
  }
  if (content.startsWith('howto_')) {
    return { type: 'howto', content };
  }
  if (content.startsWith('tech_')) {
    return { type: 'tech', content };
  }
  if (content.startsWith('cost_')) {
    return { type: 'cost', content };
  }

  // 2. Resource/Guide patterns
  if (content.match(/(^|_)(guide|compliance|compliance_guide|smart_grants_guide|ir35|dtac|cyber_essentials)($|_)/)) {
    return { type: 'resource-guide', content };
  }

  // 3. City-specific: check if last segment is a known city
  const segments = content.split('_');
  const lastSegment = segments[segments.length - 1];
  if (CITY_SET.has(lastSegment)) {
    return { type: 'city', content, city: lastSegment };
  }

  // 4. Default: true industry+service
  return { type: 'industry-service', content };
}

// Main
const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.docx'));

const categories = {
  'industry-service': [],
  'glossary': [],
  'howto': [],
  'tech': [],
  'cost': [],
  'resource-guide': [],
  'city': []
};

for (const file of files) {
  const result = classifyFile(file);
  categories[result.type].push({ file, content: result.content });
}

// Output report
console.log('=== Industry-Service-Page File Audit ===\n');
console.log('Total files: ' + files.length + '\n');

const typeLabels = {
  'industry-service': 'INDUSTRY+SERVICE',
  'glossary': 'GLOSSARY',
  'howto': 'HOW-TO',
  'tech': 'TECH',
  'cost': 'COST',
  'resource-guide': 'RESOURCE/GUIDE',
  'city': 'CITY-SPECIFIC'
};

for (const [type, items] of Object.entries(categories)) {
  console.log('--- ' + typeLabels[type] + ' (' + items.length + ' files) ---');
  for (const item of items) {
    const pNum = (item.file.match(/P(\d+)/) || [])[1] || '?';
    console.log('  P' + pNum + ': ' + item.file);
  }
  console.log('');
}

// Summary
console.log('=== Summary ===');
for (const [type, items] of Object.entries(categories)) {
  console.log('  ' + type + ': ' + items.length);
}
const total = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
console.log('  TOTAL: ' + total);

// Output P-number lists for move script
console.log('\n=== P-Number Lists for Move Script ===');
for (const [type, items] of Object.entries(categories)) {
  if (type === 'industry-service') continue;
  const pNumbers = items.map(i => (i.file.match(/P(\d+)/) || [])[1]).filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
  console.log('\n' + type + ': ' + pNumbers.length + ' files');
  console.log(pNumbers.join(', '));
}
