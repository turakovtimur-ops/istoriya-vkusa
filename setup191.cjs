const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) index.html: canonical + Schema.org (@graph) =================
let h = fs.readFileSync(P('index.html'), 'utf-8');
if (h.includes('application/ld+json')) { console.log('⚠ index.html: JSON-LD уже есть, пропускаю'); }
else {
  const inject = `</title>
<link rel="canonical" href="https://www.istoriya-vkusa.ru/" />
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
{"@type":"Organization","@id":"https://www.istoriya-vkusa.ru/#org","name":"История Вкуса","url":"https://www.istoriya-vkusa.ru/","logo":"https://www.istoriya-vkusa.ru/images/holding/istoriya-vkusa-round.png","telephone":"8 (800) 201-57-57","address":{"@type":"PostalAddress","addressLocality":"Геленджик","addressCountry":"RU"}},
{"@type":"Restaurant","name":"Кинза","servesCuisine":"Грузинская национальная","telephone":"+7 (938) 409-58-55","url":"https://www.istoriya-vkusa.ru/kinza","address":{"@type":"PostalAddress","streetAddress":"Революционная ул., 22","addressLocality":"Геленджик","addressCountry":"RU"},"geo":{"@type":"GeoCoordinates","latitude":38.0687,"longitude":44.5551},"openingHours":"Mo-Su 09:00-24:00","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.8","reviewCount":"2280"}},
{"@type":"Restaurant","name":"Нино","servesCuisine":"Грузинская современная","telephone":"+7 (928) 410-03-42","url":"https://www.istoriya-vkusa.ru/nino","address":{"@type":"PostalAddress","streetAddress":"Революционная ул., 34, корп. 6","addressLocality":"Геленджик","addressCountry":"RU"},"geo":{"@type":"GeoCoordinates","latitude":38.065,"longitude":44.5552},"openingHours":"Mo-Su 08:00-24:00","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","reviewCount":"702"}},
{"@type":"Restaurant","name":"Астория","servesCuisine":"Черноморская кухня","telephone":"+7 (928) 882-00-40","url":"https://www.istoriya-vkusa.ru/astoria","address":{"@type":"PostalAddress","streetAddress":"Революционная ул., 34","addressLocality":"Геленджик","addressCountry":"RU"},"geo":{"@type":"GeoCoordinates","latitude":38.063362,"longitude":44.555713},"openingHours":"Mo-Su 09:00-24:00","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.7","reviewCount":"1099"}},
{"@type":"Restaurant","name":"Ла Коста Берег","servesCuisine":"Европейская, Черноморская","telephone":"+7 (938) 433-95-55","url":"https://www.istoriya-vkusa.ru/la-costa","address":{"@type":"PostalAddress","streetAddress":"Революционная ул., 11","addressLocality":"Геленджик","addressCountry":"RU"},"geo":{"@type":"GeoCoordinates","latitude":38.07625,"longitude":44.559098},"openingHours":"Mo-Su 09:00-24:00","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.6","reviewCount":"2303"}}
]}
</script>`;
  h = h.split('</title>').join(inject);
  fs.writeFileSync(P('index.html'), h, 'utf-8');
  console.log('✓ index.html: canonical + Schema.org (Organization + 4 Restaurant)');
}

// ================= 2) RestaurantPage: динамический JSON-LD + canonical =================
let rp = fs.readFileSync(P('src/components/RestaurantPage.tsx'), 'utf-8');
if (rp.includes('ld-json-resto')) { console.log('⚠ RestaurantPage: JSON-LD уже есть'); }
else {
  const anchor = "useDocumentMeta(restaurant.name + ' — ' + restaurant.cuisine + ' | История Вкуса', restaurant.tagline);";
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
      geo: { '@type': 'GeoCoordinates', latitude: geo(restaurant.id)[0], longitude: geo(restaurant.id)[1] },
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
  if (rp.includes(anchor)) {
    rp = rp.split(anchor).join(anchor + '\n  ' + effect);
    fs.writeFileSync(P('src/components/RestaurantPage.tsx'), rp, 'utf-8');
    console.log('✓ RestaurantPage: динамический Schema.org + canonical для каждого ресторана');
  } else console.log('⚠ RestaurantPage: якорь не найден');
}

// ================= 3) vercel.json: HSTS =================
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
console.log('✓ vercel.json: HSTS добавлен');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "SEO: Schema.org, canonical, HSTS" && git pull --rebase && git push');