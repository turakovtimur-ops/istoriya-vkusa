const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const patch = (file, pairs) => {
  if (!fs.existsSync(P(file))) { console.log('⚠ нет файла ' + file); return []; }
  let s = fs.readFileSync(P(file), 'utf-8');
  const s0 = s;
  const done = [];
  for (const [re, rep, label] of pairs) {
    if (re.test(s)) { s = s.replace(re, rep); done.push(label); }
  }
  if (s !== s0) fs.writeFileSync(P(file), s, 'utf-8');
  return done;
};

// ================= SuppliersOrbit: мобилка как веб =================
const d1 = patch('src/components/SuppliersOrbit.tsx', [
  [/const M_RY = 0\.8;/, 'const M_RY = 0.42;', 'плоский эллипс 0.42'],
  [/const mobileR = Math\.min\(\(w \+ 40\) \* 0\.36, 170\);/, 'const mobileR = (w + 40) * 0.62;', 'орбита шире экрана'],
  [/style=\{\{ width: 100, height: 100 \}\}/, 'style={{ width: 120, height: 120 }}', 'солнце крупнее'],
  [/w-14 h-14 rounded-full/g, 'w-16 h-16 rounded-full', 'планеты крупнее'],
]);
console.log('✓ SuppliersOrbit мобилка: ' + (d1.join(' + ') || '⚠ ничего не совпало'));

// ================= OrbitHero: мобилка как веб =================
const d2 = patch('src/components/OrbitHero.tsx', [
  [/const M_RY = 0\.8\d?;/, 'const M_RY = 0.42;', 'плоский эллипс 0.42'],
  [/const mobileR = Math\.min\(\(w \+ 40\) \* 0\.3\d, 170\);/, 'const mobileR = (w + 40) * 0.62;', 'орбита шире экрана'],
]);
console.log('✓ OrbitHero мобилка: ' + (d2.join(' + ') || '⚠ шаблоны не совпали — пришли OrbitHero.tsx, докручу точечно'));

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: орбиты как в вебе"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n↩️ Если не понравится — откат: git revert HEAD --no-edit && git push');