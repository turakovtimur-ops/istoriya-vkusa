const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  console.log('✓', label);
  return src.replace(from, to);
}

let v = fs.readFileSync(path.join(__dirname, 'src', 'components', 'VacanciesOrbit.tsx'), 'utf-8');

v = rep(v,
  'const isMob = window.innerWidth < 1024;\nconst W = Math.min(1100, window.innerWidth - 8);\nconst H = isMob ? 430 : 500;\nconst R = isMob ? W * 0.42 : 300;\nconst RY = isMob ? 0.9 : 0.42;',
  'const isMob = window.innerWidth < 1024;\nconst W = isMob ? window.innerWidth - 8 : 640;\nconst H = isMob ? 430 : 480;\nconst R = isMob ? W * 0.42 : 215;\nconst RY = isMob ? 0.9 : 0.78;',
  'вакансии: десктопу исходные размеры');

v = rep(v,
  'style={{ width: isMob ? 108 : 140, height: isMob ? 108 : 140 }}',
  'style={{ width: isMob ? 108 : 160, height: isMob ? 108 : 160 }}',
  'вакансии: шар десктоп 160');

v = rep(v,
  'className="group glass-chip bubble-float block px-4 py-2.5 text-[10px] uppercase tracking-wider text-cream/90"',
  "className={'group glass-chip bubble-float block ' + (isMob ? 'px-4 py-2.5 text-[10px]' : 'px-6 py-4 text-xs') + ' uppercase tracking-wider text-cream/90'}",
  'вакансии: плашки по устройству');

v = rep(v,
  'className="block text-[8px] normal-case tracking-normal text-amber/90 mt-1"',
  "className={'block ' + (isMob ? 'text-[8px]' : 'text-[9px]') + ' normal-case tracking-normal text-amber/90 mt-1'}",
  'вакансии: подпись по устройству');

fs.writeFileSync(path.join(__dirname, 'src', 'components', 'VacanciesOrbit.tsx'), v, 'utf-8');

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "вакансии: десктоп возвращён" && git push');