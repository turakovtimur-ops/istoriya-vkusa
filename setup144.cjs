const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Главная орбита: убрать «Перейти» =================
let oh = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const oh0 = oh;
oh = oh.split('<span className="glass-chip text-[8px] uppercase tracking-[0.15em] px-2.5 py-1 text-cream/90">Перейти →</span>').join('');
if (oh !== oh0) { fs.writeFileSync(P('src/components/OrbitHero.tsx'), oh, 'utf-8'); console.log('✓ главная орбита: кнопки убраны'); }
else console.log('⚠ OrbitHero: кнопка не найдена');

// ================= 2) Поставщики: кнопки убрать, клики оставить, имя без разрыва =================
let so = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const so0 = so;
so = so.split("\n<span className=\"glass-chip text-[7px] uppercase tracking-[0.12em] px-2 py-0.5 text-cream/90\">{s.site ? 'Перейти →' : 'Подробнее'}</span>").join('');
so = so.split('<span className="text-[8px] font-semibold text-cream/85 text-center leading-tight break-words w-full">{s.name}</span>')
  .join('<span className="text-[8px] font-semibold text-cream/85 text-center leading-tight w-24 -mx-4">{s.name}</span>');
if (so !== so0) { fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), so, 'utf-8'); console.log('✓ поставщики: кнопки убраны, клики живы, «Администрация Геленджика» по словам'); }
else console.log('⚠ SuppliersOrbit: строки не найдены');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: финальная полировка орбит"');
console.log('git pull --rebase');
console.log('git push');