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

let s = fs.readFileSync(target, 'utf-8');
const s0 = s;
let log = [];

// 1) Контейнер кнопок: столбик на мобиле, ряд на десктопе, равные ширины
s = s.replace(/className="mt-8 self-start[^"]*"/, (m) => { log.push('контейнер (старый mt-8)'); return 'className="mt-6 self-stretch md:self-start flex flex-col md:flex-row items-stretch gap-2.5 md:gap-4 w-full md:max-w-4xl"'; });
s = s.replace(/className="mt-6 self-stretch[^"]*"/, (m) => { if (m.includes('flex-col')) return m; log.push('контейнер (mt-6)'); return 'className="mt-6 self-stretch md:self-start flex flex-col md:flex-row items-stretch gap-2.5 md:gap-4 w-full md:max-w-4xl"'; });

// 2) Кнопка брони в hero: во всю ширину / равная доля в ряду
s = s.replace(/className="px-10 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform"/, () => { log.push('кнопка брони'); return 'className="w-full md:flex-1 px-6 md:px-4 py-3 md:py-4 text-xs md:text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform text-center"'; });

// 3) Кнопки Еды и лояльности: тоже равные
s = s.split('inline-flex items-center gap-3 px-8 py-4 text-sm').join('inline-flex items-center justify-center gap-2.5 md:gap-3 w-full md:flex-1 px-4 md:px-4 py-3 md:py-4 text-xs md:text-sm');
if (s !== s0) log.push('кнопки Еды/лояльности');

// 4) Иконки чуть меньше на мобиле
s = s.split('className="w-6 h-6 rounded-md"').join('className="w-5 h-5 md:w-6 md:h-6 rounded-md"');

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ правки: ' + log.join(', ')); }
else console.log('⚠ ничего не изменилось');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Hero-кнопки: одинаковая ширина (моб+десктоп)" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');