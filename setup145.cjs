const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Sitemap начисто, только наш домен =================
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['https://www.istoriya-vkusa.ru/', '1.0', 'daily'],
  ['https://www.istoriya-vkusa.ru/kinza', '0.9', 'weekly'],
  ['https://www.istoriya-vkusa.ru/nino', '0.9', 'weekly'],
  ['https://www.istoriya-vkusa.ru/astoria', '0.9', 'weekly'],
  ['https://www.istoriya-vkusa.ru/la-costa', '0.9', 'weekly'],
];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(([loc, pr, cf]) =>
    '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + cf + '</changefreq>\n    <priority>' + pr + '</priority>\n  </url>\n'
  ).join('') + '</urlset>\n';
fs.writeFileSync(P('public/sitemap.xml'), xml, 'utf-8');
console.log('✓ sitemap.xml: 5 адресов, только istoriya-vkusa.ru');

// ================= 2) robots.txt: убрать чужой домен =================
let rb = fs.readFileSync(P('public/robots.txt'), 'utf-8');
const rb0 = rb;
rb = rb.split('kinza-rest-gel.ru').join('www.istoriya-vkusa.ru');
if (!rb.includes('Sitemap:')) rb += '\nSitemap: https://www.istoriya-vkusa.ru/sitemap.xml\n';
if (rb !== rb0) { fs.writeFileSync(P('public/robots.txt'), rb, 'utf-8'); console.log('✓ robots.txt: чужой домен убран'); }
else console.log('ℹ robots.txt: чужого домена не было');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "SEO: чистый sitemap + robots"');
console.log('git pull --rebase');
console.log('git push');