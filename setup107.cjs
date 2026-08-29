const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) index.html: SEO-пакет =================
let html = fs.readFileSync(P('index.html'), 'utf-8');

html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>История Вкуса — рестораны и отели в Геленджике | Официальный сайт</title>');

if (!html.includes('setup107-seo')) {
  const seo = `
  <!-- setup107-seo -->
  <meta name="description" content="Ресторанный холдинг «История Вкуса» в Геленджике: Кинза, Нино, Астория, Ла Коста Берег. Партнёрские отели Бригантина и Янтарь, загородный комплекс Природа. Бронируйте стол онлайн." />
  <meta name="keywords" content="рестораны Геленджика, история вкуса, кинза, нино, астория, ла коста берег, ресторан у моря, банкет Геленджик, свадьба Геленджик, отели Геленджика" />
  <link rel="canonical" href="https://www.istoriya-vkusa.ru/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="История Вкуса" />
  <meta property="og:title" content="История Вкуса — рестораны и отели в Геленджике" />
  <meta property="og:description" content="Четыре ресторана и партнёрские отели на побережье Геленджика. Бронируйте стол онлайн." />
  <meta property="og:url" content="https://www.istoriya-vkusa.ru/" />
  <meta property="og:image" content="https://www.istoriya-vkusa.ru/images/holding/istoriya-vkusa-logo.png" />
  <meta property="og:locale" content="ru_RU" />
  <meta name="geo.region" content="RU-KDA" />
  <meta name="geo.placename" content="Геленджик" />
  <meta name="geo.position" content="44.5557;38.0700" />
  <meta name="ICBM" content="44.5557, 38.0700" />
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "История Вкуса",
    "url": "https://www.istoriya-vkusa.ru/",
    "logo": "https://www.istoriya-vkusa.ru/images/holding/istoriya-vkusa-logo.png",
    "telephone": "+7 800 201-57-57",
    "address": { "@type": "PostalAddress", "addressLocality": "Геленджик", "addressCountry": "RU" },
    "department": [
      { "@type": "Restaurant", "name": "Кинза", "servesCuisine": "Грузинская", "telephone": "+7 938 409-58-55", "address": { "@type": "PostalAddress", "streetAddress": "Революционная ул., 22", "addressLocality": "Геленджик" }, "geo": { "@type": "GeoCoordinates", "latitude": 44.5551, "longitude": 38.0687 } },
      { "@type": "Restaurant", "name": "Нино", "servesCuisine": "Грузинская современная", "telephone": "+7 928 410-03-42", "address": { "@type": "PostalAddress", "streetAddress": "Революционная ул., 34, корп. 6", "addressLocality": "Геленджик" }, "geo": { "@type": "GeoCoordinates", "latitude": 44.5552, "longitude": 38.065 } },
      { "@type": "Restaurant", "name": "Астория", "servesCuisine": "Черноморская кухня", "telephone": "+7 928 882-00-40", "address": { "@type": "PostalAddress", "streetAddress": "Революционная ул., 34", "addressLocality": "Геленджик" }, "geo": { "@type": "GeoCoordinates", "latitude": 44.555746, "longitude": 38.064224 } },
      { "@type": "Restaurant", "name": "Ла Коста Берег", "servesCuisine": "Европейская", "telephone": "+7 938 433-95-55", "address": { "@type": "PostalAddress", "streetAddress": "Революционная ул., 11", "addressLocality": "Геленджик" }, "geo": { "@type": "GeoCoordinates", "latitude": 44.559098, "longitude": 38.07625 } }
    ]
  }
  </script>
`;
  html = html.replace('</head>', seo + '</head>');
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ index.html: title, description, OG, гео, JSON-LD');
} else console.log('ℹ SEO-блок уже в index.html');

// ================= 2) robots.txt =================
fs.writeFileSync(P('public/robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://www.istoriya-vkusa.ru/sitemap.xml\n', 'utf-8');
console.log('✓ robots.txt');

// ================= 3) sitemap.xml =================
fs.writeFileSync(P('public/sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://www.istoriya-vkusa.ru/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>\n</urlset>\n', 'utf-8');
console.log('✓ sitemap.xml');

console.log('\n✅ Пушим: npm run build && git add -A && git commit -m "SEO-пакет: мета, OG, JSON-LD, sitemap" && git push');