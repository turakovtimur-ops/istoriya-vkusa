const fs = require('fs');
const P = (f) => require('path').join(__dirname, f);

const hp = P('src/pages/Holding.tsx');
let s = fs.readFileSync(hp, 'utf-8');
const s0 = s;

// 1) фикс пути импорта (Holding лежит в pages/, компонент в components/)
s = s.split("import FaqBlock from './components/FaqBlock';").join("import FaqBlock from '../components/FaqBlock';");

// 2) подпись справа в нижней планке подвала
if (!s.includes('Тураков')) {
  const before = s;
  s = s.replace(/(<p[^>]*>)© 2026 История Вкуса\. Все права защищены\.(<\/p>)/, '<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 w-full">$1© 2026 История Вкуса. Все права защищены.$2<p className="text-cream/40 text-xs md:text-right">Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович</p></div>');
  if (s === before) {
    // фолбэк: просто добавляем в строку
    s = s.split('© 2026 История Вкуса. Все права защищены.').join('© 2026 История Вкуса. Все права защищены. · Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович');
  }
}

if (s !== s0) { fs.writeFileSync(hp, s, 'utf-8'); console.log('✓ Holding.tsx: импорт ../components/FaqBlock + подпись в подвале'); }
else console.log('⚠ Holding.tsx: без изменений');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Часть 2 фикс: FAQ + авторство в подвале главной" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');