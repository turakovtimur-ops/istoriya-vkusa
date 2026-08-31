const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const EXT = ['.ts', '.tsx', '.html', '.xml', '.txt', '.json', '.css'];
const SKIP = ['node_modules', 'dist', '.git', '.vercel'];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(dir, e.name);
  if (SKIP.includes(e.name)) return [];
  return e.isDirectory() ? walk(p) : [p];
});
const rel = (f) => path.relative(P('.'), f);

// ================= 1) Старые домены: отчёт + авто-замена =================
console.log('=== 1) Старые домены ===');
let changed = 0;
walk(P('.')).forEach((f) => {
  if (!EXT.some((x) => f.endsWith(x))) return;
  let s = fs.readFileSync(f, 'utf-8');
  const s0 = s;
  ['https://kinza-rest-gel.ru', 'http://kinza-rest-gel.ru', 'kinza-rest-gel.ru'].forEach((d) => {
    s = s.split(d).join('https://www.istoriya-vkusa.ru/kinza');
  });
  if (s !== s0) { fs.writeFileSync(f, s, 'utf-8'); changed++; console.log('✓ заменено в: ' + rel(f)); }
  ['kinza-rest-gel', 'rest-gel', 'astoriarestgel'].forEach((dom) => {
    s.split('\n').forEach((ln, i) => { if (ln.includes(dom)) console.log('  ⚠ ' + rel(f) + ':' + (i + 1) + ' → ' + ln.trim().slice(0, 90)); });
  });
});
if (!changed) console.log('ℹ авто-замен нет (или уже чисто)');

// ================= 2) public/: список файлов =================
console.log('\n=== 2) Файлы в public/ ===');
walk(P('public')).forEach((f) => console.log('  ' + path.relative(P('public'), f)));

// ================= 3) Мёртвые компоненты =================
console.log('\n=== 3) Мёртвые компоненты ===');
const srcAll = walk(P('src')).filter((f) => f.endsWith('.tsx') || f.endsWith('.ts')).map((f) => ({ f, s: fs.readFileSync(f, 'utf-8') }));
const navUsers = srcAll.filter((x) => x.s.includes('MobileNav')).map((x) => rel(x.f));
console.log('  MobileNav используется в: ' + (navUsers.length ? navUsers.join(', ') : 'НИГДЕ'));
if (navUsers.length === 1 && navUsers[0].endsWith('MobileNav.tsx') && fs.existsSync(P('src/components/MobileNav.tsx'))) {
  fs.unlinkSync(P('src/components/MobileNav.tsx'));
  console.log('✓ MobileNav.tsx удалён (никто не импортировал)');
}
const fm = srcAll.filter((x) => x.s.includes('framer-motion')).map((x) => rel(x.f));
console.log('  framer-motion используется в: ' + (fm.length ? fm.join(', ') : 'НИГДЕ (зависимость мёртвая)'));

// ================= 4) .DS_Store + gitignore =================
console.log('\n=== 4) Мусорные файлы ===');
walk(P('.')).filter((f) => f.endsWith('.DS_Store')).forEach((f) => { fs.unlinkSync(f); console.log('✓ удалён ' + rel(f)); });
let gi = fs.existsSync(P('.gitignore')) ? fs.readFileSync(P('.gitignore'), 'utf-8') : '';
if (!gi.includes('.DS_Store')) { fs.writeFileSync(P('.gitignore'), gi + (gi.endsWith('\n') || !gi ? '' : '\n') + '.DS_Store\n', 'utf-8'); console.log('✓ .gitignore: добавлен .DS_Store'); }

// ================= 5) http:// ссылки (отчёт, без авто-правок) =================
console.log('\n=== 5) http:// (проверить глазами) ===');
let httpHits = 0;
srcAll.forEach((x) => x.s.split('\n').forEach((ln, i) => {
  if (ln.includes('http://') && !ln.includes('sitemaps.org') && !ln.includes('w3.org')) {
    httpHits++; console.log('  ' + rel(x.f) + ':' + (i + 1) + ' → ' + ln.trim().slice(0, 90));
  }
}));
if (!httpHits) console.log('✓ небезопасных ссылок нет');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Чистка: старые домены и мусор"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 ПРИШЛИ МНЕ ВЕСЬ ВЫВОД КОНСОЛИ — по нему сделаю Шаг 2!');