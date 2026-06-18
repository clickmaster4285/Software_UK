const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'Clickmasterssoftwaredevelopmentcompany.co.uk');
const SOURCE = path.join(BASE, 'Industry-Service-Page');

const CITY_SET = new Set([
  'london','manchester','glasgow','edinburgh','birmingham','dublin','cardiff',
  'bristol','leeds','liverpool','sheffield','newcastle','nottingham','southampton',
  'brighton','oxford','cambridge','york','belfast','dundee','aberdeen','swansea',
  'portsmouth','leicester','coventry','bradford','wolverhampton','plymouth','derby',
  'swindon','norwich','ipswich','chelmsford','reading','slough','watford',
  'milton-keynes','northampton','luton','basildon','exeter','blackburn','preston',
  'bolton','wigan','salford','rochdale','stockport','wakefield','doncaster',
  'rotherham','barnsley','huddersfield','halifax','warrington','stoke',
  'stoke-on-trent','walsall','dudley','west-bromwich','sutton-coldfield',
  'telford','worcester','hereford','shrewsbury','chester','carlisle','durham',
  'sunderland','middlesbrough','redcar','stockton','darlington','harrogate',
  'scarborough','whitby','bath','salisbury','winchester','chichester',
  'canterbury','rochester','maidstone','tunbridge-wells','guildford','woking',
  'epsom','reigate','kingston','richmond','bournemouth','poole','weymouth',
  'dorchester','taunton','tiverton','barnstaple','exmouth','truro','falmouth',
  'penzance','st-ives','newquay','bodmin','liskeard','launceston',
  'peterborough','stamford','spalding','boston','lincoln','gainsborough',
  'scunthorpe','grimsby','hull','beverley','bridlington','driffield',
  'aylesbury','high-wycombe','marlow','henley','banbury','bicester','witney',
  'carterton','wantage','didcot','abingdon','wallingford','thame','maidenhead',
  'windsor','bracknell','crowthorne','sandhurst','ascot','fleet','farnborough',
  'aldershot','godalming','haslemere','dorking','redhill','crawley','horsham',
  'haywards-heath','burgess-hill','east-grinstead','uckfield','lewes',
  'newhaven','seaford','eastbourne','hastings','bexhill','rye','tenterden',
  'ashford','folkestone','dover','deal','sandwich','margate','ramsgate',
  'broadstairs','whitstable','faversham','sittingbourne','sheerness',
  'queenborough','chatham','gillingham','rainham','tonbridge','sevenoaks',
  'edenbridge','cranbrook','gravesend','dartford','erith','bexleyheath',
  'sidcup','beckenham','bromley','chislehurst','orpington','petts-wood',
  'croydon','sutton','carshalton','wallington','ewell','leatherhead','farnham',
  'alton','basingstoke','andover','eastleigh','fareham','gosport','havant',
  'waterlooville','petersfield','midhurst','petworth','bognor-regis',
  'littlehampton','worthing','shoreham','lancing','southwick','ryde','newport',
  'cowes','sandown','shanklin','ventnor','yarmouth','freshwater','totland',
  'padstow','bude','saltash','torpoint','dartmouth','totnes','paignton',
  'torquay','brixham','teignmouth','dawlish','budleigh-salterton','honiton',
  'axminster','lyme-regis','bridport','portland','chickerell','gloucester',
  'cheltenham','stroud','cirencester','tetbury','nailsworth','dursley',
  'wotton-under-edge','thornbury','yate','chipping-sodbury',
  'westbury-on-trym','clevedon','weston-super-mare','burnham-on-sea',
  'highbridge','bridgwater','wellington','minehead','watchet','dulverton',
  'wiveliscombe','braunton','ilfracombe','lynton','lynn','bideford',
  'torrington','great-torrington','okehampton','hatherleigh','south-molton',
  'chulmleigh','bishops-castle','clun','craven-arms','knighton','prestigne',
  'builth-wells','rhayader','llandrindod','aberystwyth','cardigan','lampeter',
  'llanelli','neath','port-talbot','bridgend','porthcawl','barry','penarth',
  'llandough','dinas-powys','pontypridd','caerphilly','blackwood','newbridge',
  'abertillery','ebbw-vale','cwmbran','monmouth','chepstow','caldicot','magor',
  'usk','raglan','abergavenny','crickhowell','brecon','hay-on-wye','kington',
  'llangollen','corwen','denbigh','st-asaph','abergele','colwyn-bay',
  'old-colwyn','llandudno','conwy','bangor','caernarfon','porthmadog',
  'pwllheli','criccieth','harlech','bala','dolgellau','barmouth','tywyn',
  'fairbourne','llanfairfechan','penmaenmawr','llanfairpwll','menai-bridge',
  'beaumaris','amlwch','valley','holyhead','llangefni','ammanford',
  'llandeilo','llandovery','llanidloes','newtown','welshpool','llanfyllin',
  'oswestry','wrexham','ruabon','chirk','overton','whitchurch','malpas',
  'nantwich','crewe','sandbach','middlewich','northwich','winsford',
  'ellesmere-port','neston','west-kirby','hoylake','wallasey','bootle',
  'crosby','formby','southport','ormskirk','maghull','kirkby','prescot',
  'st-helens','haydock','newton-le-willows','leigh','atherton','hindley',
  'standish','chorley','leyland','fulwood','longridge','goosnargh','garstang',
  'lancaster','morecambe','carnforth','kendal','windermere','ambleside',
  'grasmere','keswick','cockermouth','whitehaven','workington','maryport',
  'wigton','brampton','hexham','haltwhistle','haydon-bridge','allendale',
  'alnwick','berwick-upon-tweed','wooler','cornhill-on-tweed','morpeth',
  'ashington','blyth','cramlington','gateshead','south-shields','jarrow',
  'hebburn','whitburn','houghton-le-spring','chester-le-street','stanley',
  'consett','shotley-bridge','rowlands-gill','bishop-auckland',
  'barnard-castle','shildon','newton-aycliffe','sedgefield','fishburn',
  'trimdon','wingate','peterlee','horden','easington','seaham','murton',
  'dalton-le-dale','cold-hesledon','blackhall','hartlepool','seaton-carew',
  'greatham','billingham','guisborough','great-ayton','stokesley',
  'ingleby-barwick','yarm','ingleton','kirkby-lonsdale','sedbergh','bowness',
  'penrith','appleby','shap','kirkby-stephen','greystoke','troutbeck',
  'patterdale','glenridding','pooley-bridge','caldbeck','bassenthwaite',
  'broughton-in-furness','milnthorpe','burton-in-kendal','holme','orton',
  'appleby-in-westmorland','longtown','gretna','annan','dumfries','sanquhar',
  'moffat','selkirk','galashiels','melrose','kelso','jedburgh','hawick',
  'langholm','lockerbie','biggar','lanark','lesmahagow','douglas',
  'abington','carstairs','wishaw','motherwell','hamilton','east-kilbride',
  'rutherglen','cambuslang','blantyre','bothwell','utherstone','milngavie',
  'bearsden','bishopbriggs','lennoxtown','kirkintilloch','cumbernauld',
  'airdrie','coatbridge','bellshill','carluke','paisley','johnstone',
  'bridge-of-weir','kilmacolm','greenock','gourock','dunoon','rothesay',
  'wemyss-bay','dumbarton','alexandria','helensburgh','cardross',
  'campbeltown','tarbert','lochgilphead','inveraray','musselburgh',
  'prestongrange','cockenzie','tranent','haddington','dunbar',
  'north-berwick','dirleton','gullane','longniddry','pencaitland','ormiston',
  'east-linton','cockburnspath','eyemouth','coldingham','norham','cornhill',
  'coldstream','sprouston','morebattle','denholm','newcastleton','sanquhar',
  'lockerbie','lesmahagow','rutherglen','cambuslang','blantyre','bothwell',
  'johnstone','bridge-of-weir','kilmacolm','port-glasgow','clydebank',
  'stirling','alloa','clackmannan','dollar','kinross','cowie','dunfermline',
  'kelty','lochgelly','cardenden','cupar','newburgh','newport-on-tay','tayport',
  'monifieth','broughty-ferry','arnoustie','carnoustie','forfar','kirriemuir',
  'blairgowrie','perth','crieff','aberfeldy','pitlochry','blair-atholl',
  'calvine','braemar','ballater','banchory','stonehaven','laurencekirk',
  'inverurie','huntly','keith','dufftown','tomintoul','ballindalloch',
  'grantown-on-spey','elgin','forres','nairn','inverness','beauly','dingwall',
  'muir-of-ord','fortrose','rosemarkie','cromarty','tain','dornoch','golspie',
  'brora','helmsdale','lairg','durness','tongue','thurso','castletown',
  'john-o-groats','wick','stornoway','tarbert','lochmaddy','lochboisdale',
  'castlebay','lisburn','newtownards','bangor','holywood','comber',
  'donaghadee','ards','moira','lurgan','craigavon','portadown','armagh',
  'monaghan','clones','carrickmacross','castleblayney','ballybay','dundalk',
  'drogheda','ardee','laytown','bettystown','mornington','donabate',
  'swords','malahide','portmarnock','baldoyle','howth','sutton',
  'dun-laoghaire','dalkey','killiney','bray','greystones','delgany',
  'newtownmountkennedy','ashford','rathnew','wicklow','arklow','gorey',
  'enniscorthy','wexford','rosslare','new-ross','kilkenny','callan',
  'thomastown','inistioge','graiguenamanagh','borris','bagenalstown','carlow',
  'tullow','rathvilly','hacketstown','muine-beag','navan','trim','kells',
  'athboy','mullingar','moate','kilbeggan','tyrellspass','clara','tullamore',
  'birr','banagher','portarlington','mountmellick','mountrath','portlaoise',
  'abbeyleix','durrow','cullahill','rathdowney','borris-in-ossory',
  'templemore','thurles','cashel','cahir','clonmel','carrick-on-suir',
  'waterford','dungarvan','lismore','cappoquin','fermoy','mallow',
  'mitchelstown','charleville','kilmallock','bruree','newcastle-west',
  'abbeyfeale','listowel','tralee','killarney','kenmare','sneem',
  'cahersiveen','waterville','dingle','ballybunion','tarbert','ballyhooly',
  'castletownroche','ballyduff','ferns','rathdrum','glenealy','avoca',
  'woodenbridge','ennis','kilrush','kilkee','lahinch','milltown-malbay',
  'doonbeg','quilty','malbay','scariff','tuamgraney','killaloe','ballina',
  'castlebar','westport','claremorris','ballinrobe','cloonbur','headford',
  'tuam','mountbellew','glenamaddy','athenry','ballinasloe','roscrea',
  'nenagh','borrisokane','cloughjordan','parsonstown','kinnegad','athlone',
  'castlepollard','granard','oldcastle','ballyjamesduff','cavan','virginia',
  'bailieborough','kingscourt','amsterdam','paris','berlin','zurich',
  'stockholm','milan','brussels','vienna','copenhagen','helsinki','warsaw',
  'lisbon','rotterdam','gothenburg','prague','tallinn','oslo','luxembourg',
  'munich','hamburg','frankfurt'
]);

function classifyFile(filename) {
  const withoutPrefix = filename.replace(/^ClickMasters_P\d+_/i, '');
  const content = withoutPrefix.replace(/_uk\.docx$/i, '').replace(/\.docx$/i, '').toLowerCase();

  if (content.startsWith('glossary_')) return 'glossary';
  if (content.startsWith('howto_')) return 'howto';
  if (content.startsWith('tech_')) return 'tech';
  if (content.startsWith('cost_')) return 'cost';

  if (content.match(/(^|_)(guide|compliance|compliance_guide|smart_grants_guide|ir35|dtac|cyber_essentials)($|_)/)) {
    return 'resource-guide';
  }

  const segments = content.split('_');
  const lastSegment = segments[segments.length - 1];
  if (CITY_SET.has(lastSegment)) return 'city';

  // Special case: P4 has "cost" in the middle of the name
  if (filename === 'ClickMasters_P4_Custom_Software_Cost_UK.docx') return 'cost';

  return 'industry-service';
}

const files = fs.readdirSync(SOURCE).filter(f => f.endsWith('.docx'));
const moves = { glossary: [], howto: [], tech: [], cost: [], 'resource-guide': [], city: [] };

for (const file of files) {
  const type = classifyFile(file);
  if (type !== 'industry-service') {
    moves[type].push(file);
  }
}

const destMap = {
  glossary: 'Glossary',
  howto: 'How-To',
  tech: 'Tech',
  cost: 'Cost',
  'resource-guide': 'Resource-Guide',
  city: 'International-City'
};

let totalMoved = 0;
const log = [];

for (const [type, fileList] of Object.entries(moves)) {
  const destDir = path.join(BASE, destMap[type]);
  for (const file of fileList) {
    const src = path.join(SOURCE, file);
    const dst = path.join(destDir, file);
    try {
      fs.renameSync(src, dst);
      totalMoved++;
    } catch (e) {
      log.push(`ERROR moving ${file}: ${e.message}`);
    }
  }
  console.log(`${type}: moved ${fileList.length} files → ${destMap[type]}/`);
}

console.log(`\nTotal moved: ${totalMoved} files`);
console.log(`Remaining in Industry-Service-Page: ${fs.readdirSync(SOURCE).filter(f => f.endsWith('.docx')).length} files`);

if (log.length) {
  console.log('\nErrors:');
  log.forEach(l => console.log(l));
}
