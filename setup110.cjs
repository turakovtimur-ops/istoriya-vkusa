const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let html = fs.readFileSync(P('index.html'), 'utf-8');

const metrika = `  <!-- Yandex.Metrika counter -->
  <script type="text/javascript">
    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
    })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=112073069', 'ym');

    ym(112073069, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
  </script>
  <noscript><div><img src="https://mc.yandex.ru/watch/112073069" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  <!-- /Yandex.Metrika counter -->
`;

if (html.includes('112073069')) {
  console.log('ℹ Метрика уже есть в index.html');
} else {
  html = html.replace('</head>', metrika + '</head>');
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ Метрика 112073069 вставлена в <head>');
}

// favicon на всякий случай
if (!html.includes('rel="icon"')) {
  html = html.replace('</head>', '  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />\n</head>');
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ favicon подключён');
}

console.log('\n✅ Пушим: npm run build && git add -A && git commit -m "Yandex.Metrika + favicon" && git push');