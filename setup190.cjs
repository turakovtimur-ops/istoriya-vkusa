const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const today = '2026-09-03';

// ================= robots.txt =================
fs.writeFileSync(P('public/robots.txt'), `User-agent: *
Allow: /
Disallow: /upravlenie
Disallow: /api/

Sitemap: https://www.istoriya-vkusa.ru/sitemap.xml
`, 'utf-8');
console.log('✓ public/robots.txt');

// ================= sitemap.xml =================
const urls = [
  ['https://www.istoriya-vkusa.ru/', 'daily', '1.0'],
  ['https://www.istoriya-vkusa.ru/kinza', 'weekly', '0.9'],
  ['https://www.istoriya-vkusa.ru/nino', 'weekly', '0.9'],
  ['https://www.istoriya-vkusa.ru/astoria', 'weekly', '0.9'],
  ['https://www.istoriya-vkusa.ru/la-costa', 'weekly', '0.9'],
];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schema/sitemap/0.9">\n' +
  urls.map(([loc, cf, pr]) =>
    '  <url>\n    <loc>' + loc + '</loc>\n    <lastmod>' + today + '</lastmod>\n    <changefreq>' + cf + '</changefreq>\n    <priority>' + pr + '</priority>\n  </url>'
  ).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(P('public/sitemap.xml'), xml, 'utf-8');
console.log('✓ public/sitemap.xml (5 страниц)');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "SEO: robots.txt + sitemap.xml" && git pull --rebase && git push');