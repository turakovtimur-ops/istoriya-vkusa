const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  console.log('✓', label);
  return src.replace(from, to);
}

// ================= 1. TITLE =================
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');
if (h.includes('document.title')) {
  console.log('✓ title уже есть');
} else {
  const m = 'const [teamIdx, setTeamIdx] = useState(0);';
  if (h.includes(m)) {
    h = h.replace(m, m + "\n\n  useEffect(() => { document.title = 'История Вкуса — рестораны в Геленджике'; }, []);");
    fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
    console.log('✓ title вставлен');
  } else console.warn('⚠ маркер teamIdx не найден');
}

// ================= 2. ВАКАНСИИ: адаптив =================
let v = fs.readFileSync(path.join(__dirname, 'src', 'components', 'VacanciesOrbit.tsx'), 'utf-8');
v = rep(v,
  'const W = 640;\nconst H = 480;\nconst R = 215;\nconst RY = 0.78;',
  'const isMob = window.innerWidth < 1024;\nconst W = Math.min(1100, window.innerWidth - 8);\nconst H = isMob ? 430 : 500;\nconst R = isMob ? W * 0.42 : 300;\nconst RY = isMob ? 0.9 : 0.42;',
  'вакансии: адаптив');
v = rep(v,
  'style={{ width: 160, height: 160 }}',
  'style={{ width: isMob ? 108 : 140, height: isMob ? 108 : 140 }}',
  'вакансии: шар компактнее');
v = rep(v,
  'px-6 py-4 text-xs uppercase tracking-wider text-cream/90',
  'px-4 py-2.5 text-[10px] uppercase tracking-wider text-cream/90',
  'вакансии: плашки компактнее');
v = rep(v,
  'block text-[9px] normal-case tracking-normal text-amber/90 mt-1',
  'block text-[8px] normal-case tracking-normal text-amber/90 mt-1',
  'вакансии: подпись мельче');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'VacanciesOrbit.tsx'), v, 'utf-8');

// ================= 3. ПОСТАВЩИКИ: адаптив =================
let s = fs.readFileSync(path.join(__dirname, 'src', 'components', 'SuppliersOrbit.tsx'), 'utf-8');
s = rep(s,
  'const RY = 0.26;',
  'const RY = window.innerWidth < 1024 ? 1 : 0.34;',
  'поставщики: орбита выше');
s = rep(s,
  'const sizeFor = (name: string) => Math.round(Math.min(128, Math.max(72, 50 + name.length * 2.6)));',
  'const sizeFor = (name: string) => window.innerWidth < 1024\n  ? Math.round(Math.min(54, Math.max(38, 26 + name.length * 1.1)))\n  : Math.round(Math.min(104, Math.max(64, 44 + name.length * 2.2)));',
  'поставщики: планеты меньше');
s = rep(s,
  'const R1 = W / 2 - 70;',
  'const R1 = W / 2 - (window.innerWidth < 1024 ? 24 : 70);',
  'поставщики: радиусы на моб');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'SuppliersOrbit.tsx'), s, 'utf-8');

console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Шаг 3: орбиты + title" && git push\n   затем проверить веб и прислать 2 скриншота (вакансии и поставщики)');