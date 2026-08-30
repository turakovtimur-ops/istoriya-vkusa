const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// достаём путь круглого лого холдинга из данных
const data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
let round = '/images/holding/istoriya-vkusa-round.png';
const hbIdx = data.indexOf('holdingBrand');
if (hbIdx !== -1) {
  const rlIdx = data.indexOf('roundLogo', hbIdx);
  if (rlIdx !== -1) {
    const q1 = data.indexOf("'", rlIdx);
    const q2 = data.indexOf("'", q1 + 1);
    if (q1 !== -1 && q2 !== -1) round = data.slice(q1 + 1, q2);
  }
}

let html = fs.readFileSync(P('index.html'), 'utf-8');
if (!html.includes('apple-touch-icon')) {
  const tags = '  <link rel="icon" type="image/png" sizes="32x32" href="' + round + '" />\n  <link rel="apple-touch-icon" href="' + round + '" />\n';
  html = html.replace('</head>', tags + '</head>');
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ favicon PNG подключён: ' + round);
} else console.log('ℹ apple-touch-icon уже есть');

console.log('\nПушим: npm run build && git add -A && git commit -m "favicon PNG для Яндекса" && git push');