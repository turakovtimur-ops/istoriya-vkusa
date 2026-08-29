const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let html = fs.readFileSync(P('index.html'), 'utf-8');
if (!html.includes('rel="icon"')) {
  html = html.replace('</head>',
    '  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n  <link rel="shortcut icon" href="/favicon.svg" />\n</head>');
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ favicon подключён');
} else {
  console.log('ℹ favicon уже в index.html');
}
console.log('\nПушим: npm run build && git add -A && git commit -m "favicon + SEO" && git push');