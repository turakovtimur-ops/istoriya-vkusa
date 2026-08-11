const fs = require('fs');
const path = require('path');

let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const data = fs.readFileSync(path.join(__dirname, 'src', 'data', 'holding.ts'), 'utf-8');
const m = data.match(/holdingBrand[\s\S]*?roundLogo:\s*['"]([^'"]+)['"]/);
const ogImage = m ? m[1] : '/images/logo-round.png';

// 1) Title
const t1 = html.indexOf('<title>');
const t2 = html.indexOf('</title>');
if (t1 !== -1 && t2 !== -1) {
  html = html.slice(0, t1) + '<title>История Вкуса — рестораны в Геленджике</title>' + html.slice(t2 + 8);
  console.log('✓ title');
}

// 2) Meta + OG + favicon (если ещё нет)
if (!html.includes('og:title')) {
  const meta =
    '<meta name="description" content="Ресторанный холдинг «История Вкуса» в Геленджике: Кинза, Нино, Астория, Ла Коста Берег. Банкеты, кейтеринг, акции. 8 800 201-57-57" />\n    ' +
    '<meta property="og:title" content="История Вкуса — рестораны в Геленджике" />\n    ' +
    '<meta property="og:description" content="Одна история — четыре вкуса. Четыре ресторана, партнёрские отели и загородный комплекс на побережье." />\n    ' +
    '<meta property="og:type" content="website" />\n    ' +
    '<meta property="og:image" content="' + ogImage + '" />\n    ' +
    '<link rel="icon" type="image/png" href="' + ogImage + '" />';
  html = html.replace('</head>', meta + '\n  </head>');
  console.log('✓ meta + og + favicon');
}

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf-8');
console.log('\n✅ SEO-шапка готова! Теперь commit + push.\n');