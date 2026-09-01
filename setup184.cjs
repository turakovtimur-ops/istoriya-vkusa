const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const YKEY = 'b3a02a6f-15cb-4575-b648-6c1a08e558f8'; // ← ВСТАВЬ ключ Яндекса сюда

// ================= 1) Ключ Яндекс.Карт (index.html + компоненты) =================
if (YKEY === 'PASTE_YANDEX_KEY') {
  console.log('⚠ Ключ не вставлен — пропускаю карту (остальное сделаю)');
} else {
  const targets = [P('index.html')];
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    e.isDirectory() ? walk(p) : (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.html')) && targets.push(p);
  });
  walk(P('src'));
  let patched = 0;
  targets.forEach((f) => {
    if (!fs.existsSync(f)) return;
    let s = fs.readFileSync(f, 'utf-8');
    if (!s.includes('api-maps.yandex.ru')) return;
    const s0 = s;
    s = s.split('api-maps.yandex.ru/2.1/?lang=ru_RU').join('api-maps.yandex.ru/2.1/?apikey=' + YKEY + '&lang=ru_RU');
    if (s !== s0) { fs.writeFileSync(f, s, 'utf-8'); patched++; console.log('✓ карта с ключом: ' + path.basename(f)); }
  });
  if (!patched) console.log('⚠ строка api-maps.yandex.ru/2.1/?lang=ru_RU не найдена — пришли index.html текстом');
}

// ================= 2) vercel.json: security-заголовки =================
fs.writeFileSync(P('vercel.json'), `{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
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
console.log('✓ vercel.json: security-заголовки (SAMEORIGIN не ломает редактор — iframe с того же домена)');

// ================= 3) apply.ts: серверный лимит файла =================
let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
a = a.split('const data = body.data || {};')
  .join('const data = body.data || {};\n  if (data.file && data.file.base64 && String(data.file.base64).length > 4200000) data.file = { name: data.file.name };');
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ apply.ts: серверный лимит ~3 МБ'); }
else console.log('⚠ apply.ts: якорь не найден');

// ================= 4) удаляю диагностику из прода =================
if (fs.existsSync(P('api/max-test.ts'))) { fs.unlinkSync(P('api/max-test.ts')); console.log('✓ api/max-test.ts удалён из прода'); }

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Безопасность: ключ карты, заголовки, лимиты, чистка" && git pull --rebase && git push');