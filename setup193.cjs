const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let target = null;
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes('export default function RestaurantPage')) target = p;
  });
};
walk(P('src'));
if (!target) { console.log('⚠ RestaurantPage не найден'); process.exit(1); }
console.log('✓ найден: ' + target);

let rp = fs.readFileSync(target, 'utf-8');

const effect = `useEffect(() => {
    const rating = (extra0 as any).rating;
    const hrs = (extra0.hours || '09:00–00:00').replace('–', '-');
    const ld: any = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: restaurant.name,
      description: restaurant.tagline,
      servesCuisine: restaurant.cuisine,
      telephone: restaurant.phone,
      url: 'https://www.istoriya-vkusa.ru' + restaurant.path,
      address: { '@type': 'PostalAddress', streetAddress: restaurant.address, addressLocality: 'Геленджик', addressCountry: 'RU' },
      geo: { '@type': 'GeoCoordinates', latitude: geo(restaurant.id)[1], longitude: geo(restaurant.id)[0] },
      openingHours: 'Mo-Su ' + (hrs.endsWith('00:00') ? hrs.replace(/00:00$/, '24:00') : hrs),
    };
    if (rating) ld.aggregateRating = { '@type': 'AggregateRating', ratingValue: String(rating.score), reviewCount: String(rating.count) };
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'ld-json-resto';
    s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = 'https://www.istoriya-vkusa.ru' + restaurant.path;
    return () => { const el = document.getElementById('ld-json-resto'); if (el) el.remove(); };
  }, [restaurant.id]);`;

if (rp.includes('ld-json-resto')) {
  const bad = 'latitude: geo(restaurant.id)[0], longitude: geo(restaurant.id)[1]';
  const good = 'latitude: geo(restaurant.id)[1], longitude: geo(restaurant.id)[0]';
  if (rp.includes(bad)) {
    rp = rp.split(bad).join(good);
    fs.writeFileSync(target, rp, 'utf-8');
    console.log('✓ координаты в Schema исправлены (широта/долгота на местах)');
  } else console.log('✓ координаты уже правильные');
} else {
  const anchor = "useDocumentMeta(restaurant.name + ' — ' + restaurant.cuisine + ' | История Вкуса', restaurant.tagline);";
  if (rp.includes(anchor)) {
    rp = rp.split(anchor).join(anchor + '\n  ' + effect);
    fs.writeFileSync(target, rp, 'utf-8');
    console.log('✓ RestaurantPage: Schema.org + canonical вставлены');
  } else console.log('⚠ якорь не найден');
}

// ================= vercel.json: HSTS =================
fs.writeFileSync(P('vercel.json'), `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=()" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
`, 'utf-8');
console.log('✓ vercel.json: HSTS на месте');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "SEO: фикс координат Schema + HSTS" && git pull --rebase && git push');