const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Статический h1 в index.html =================
let html = fs.readFileSync(P('index.html'), 'utf-8');
if (!html.includes('static-h1')) {
  const oldRoot = '<div id="root"></div>';
  const newRoot = `<div id="root">
    <h1 class="static-h1" style="position:fixed;inset:0;margin:0;display:flex;align-items:center;justify-content:center;background:#0E0D0B;color:#F5F2EA;font-family:system-ui,-apple-system,sans-serif;font-size:18px;font-weight:600;letter-spacing:0.02em;text-align:center;padding:0 24px;">История Вкуса — рестораны и отели в Геленджике</h1>
  </div>`;
  if (html.includes(oldRoot)) {
    html = html.split(oldRoot).join(newRoot);
    fs.writeFileSync(P('index.html'), html, 'utf-8');
    console.log('✓ index.html: статический h1 (робот видит до JS)');
  } else console.log('⚠ index.html: <div id="root"> не найден точной строкой');
} else console.log('ℹ static-h1 уже есть');

// ================= 2) Аудит alt у всех картинок =================
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
let fixed = 0;
const report = [];
walk(P('src')).filter((f) => f.endsWith('.tsx')).forEach((f) => {
  let s = fs.readFileSync(f, 'utf-8');
  const s0 = s;
  s = s.replace(/<img\b[^>]*>/g, (tag) => {
    if (/\balt\s*=/.test(tag)) return tag;
    fixed++;
    report.push(path.relative(P('.'), f) + ': ' + tag.slice(0, 70));
    return tag.replace(/\s*\/?>$/, '') + ' alt="" />';
  });
  if (s !== s0) fs.writeFileSync(f, s, 'utf-8');
});
if (report.length) {
  console.log('✓ alt добавлен (декоративный alt="") в ' + fixed + ' местах:');
  report.forEach((r) => console.log('   ' + r));
} else console.log('✓ все <img> в src уже с alt — молодцы');

// ================= 3) Проверка h1 в компонентах =================
['src/pages/Holding.tsx', 'src/sites/RestaurantPage.tsx', 'src/pages/Admin.tsx'].forEach((f) => {
  if (!fs.existsSync(P(f))) return;
  const n = (fs.readFileSync(P(f), 'utf-8').match(/<h1/g) || []).length;
  console.log('ℹ ' + f + ': h1 × ' + n);
});

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "SEO: статический h1 + alt у картинок"');
console.log('git pull --rebase');
console.log('git push');