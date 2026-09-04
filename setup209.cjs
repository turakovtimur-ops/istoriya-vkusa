const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const find = (marker) => {
  let t = null;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (['node_modules', '.git', 'dist'].includes(e.name)) return;
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes(marker)) t = p;
    });
  };
  walk(P('src'));
  return t;
};

// 1) FaqBlock: убираем строку авторства под аккордеоном (крестики)
const fq = P('src/components/FaqBlock.tsx');
let f = fs.readFileSync(fq, 'utf-8');
const f0 = f;
f = f.replace(/\s*<p className="text-cream\/40 text-xs text-center mt-10">Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович<\/p>/, '');
if (f !== f0) { fs.writeFileSync(fq, f, 'utf-8'); console.log('✓ FaqBlock: строка убрана'); }

// 2) Главный подвал: имя → «Тураков Т. Р.» + шрифт как у ©
const hp = P('src/pages/Holding.tsx');
let s = fs.readFileSync(hp, 'utf-8');
const s0 = s;
const cm = /<p([^>]*)>© 2026 История Вкуса\. Все права защищены\.<\/p>/.exec(s);
const attrs = cm ? cm[1] : ' className="text-cream/50 text-sm font-light"';
s = s.replace(/<p className="text-cream\/40 text-xs md:text-right">Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович<\/p>/, '<p' + attrs + '>Кастомная разработка и дизайн сайта — Тураков Т. Р.</p>');
s = s.split('· Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович').join('· Кастомная разработка и дизайн сайта — Тураков Т. Р.');
if (s !== s0) { fs.writeFileSync(hp, s, 'utf-8'); console.log('✓ главный подвал: «Тураков Т. Р.» тем же шрифтом'); }

// 3) Подвал ресторанов: то же сокращение
const rp = find('export default function RestaurantPage');
if (rp) {
  let r = fs.readFileSync(rp, 'utf-8');
  if (r.includes('Тураков Тимур Рифхатович')) {
    r = r.split('Тураков Тимур Рифхатович').join('Тураков Т. Р.');
    fs.writeFileSync(rp, r, 'utf-8');
    console.log('✓ подвал ресторанов: «Тураков Т. Р.»');
  }
}

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Подпись: Тураков Т.Р. в подвалах, убрана под FAQ" && git pull --rebase && git push');