const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Карта: убираем «возврат» при уведении мыши =================
const cf = P('src/components/ContactsSection.tsx');
let c = fs.readFileSync(cf, 'utf-8');
const c0 = c;
// глушим все onMouseLeave (они сбрасывают зум карты)
c = c.replace(/onMouseLeave=\{(?:[^{}]|\{[^{}]*\})*\}/g, '');
if (c !== c0) {
  fs.writeFileSync(cf, c, 'utf-8');
  console.log('✓ карта больше не прыгает обратно при уведении мыши');
} else {
  console.log('⚠ onMouseLeave не найден — вот кусок файла для диагностики:');
  const i = c.indexOf('iframe');
  console.log(c.slice(Math.max(0, i - 1500), i + 500));
}

// ================= 2) Координаты Астории =================
const OLD = [['44.555746', '44.555713'], ['38.064224', '38.063362']];
for (const f of ['src/components/ContactsSection.tsx', 'src/data/holding.ts']) {
  let s = fs.readFileSync(P(f), 'utf-8');
  let changed = false;
  for (const [o, n] of OLD) {
    if (s.includes(o)) { s = s.split(o).join(n); changed = true; }
  }
  if (changed) {
    fs.writeFileSync(P(f), s, 'utf-8');
    console.log('✓ Астория: координаты исправлены в ' + f);
  }
}
// если старых координат нет — покажем, какие есть в ContactsSection
let chk = fs.readFileSync(cf, 'utf-8');
if (!chk.includes('44.555713')) {
  console.log('ℹ строки с координатами в ContactsSection:');
  chk.split('\n').forEach((l, i) => { if (/44\.|38\.|lat|lon|coord/i.test(l)) console.log('  ' + (i + 1) + ': ' + l.trim()); });
}

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Карта: без авто-возврата + Астория на месте" && git push');