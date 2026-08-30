const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let html = fs.readFileSync(P('index.html'), 'utf-8');

// переносим <noscript> из <head> в <body> (по спеке HTML там ему и место)
const m = html.match(/<noscript>[\s\S]*?<\/noscript>/);
if (m) {
  html = html.replace(m[0], '');
  html = html.replace(/<body[^>]*>/, (b) => b + '\n  ' + m[0]);
  fs.writeFileSync(P('index.html'), html, 'utf-8');
  console.log('✓ noscript перенесён в <body> — Метрика работает, build пройдёт');
} else {
  console.log('ℹ noscript не найден — нечего переносить');
}

console.log('\n✅ Дальше: npm run build && git add -A && git commit -m "Metrika fix + favicon" && git push');