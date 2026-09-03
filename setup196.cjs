const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let s = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const s0 = s;

console.log('Диагностика до:');
console.log('  SAT_URL: ' + s.includes('const SAT_URL'));
console.log('  satAngle: ' + s.includes('satAngle'));
console.log('  расчёт ki: ' + s.includes('const ki ='));
console.log('  спутник eda-sat: ' + (s.match(/eda-sat/g) || []).length);

// 1) ссылка
if (!s.includes('const SAT_URL')) {
  s = s.replace(/const SPEED = 4;/, "const SPEED = 4;\nconst SAT_URL = 'https://eda.yandex.ru/r/kinza_1721032873?placeSlug=kinza_l37w6';");
}

// 2) угол спутника
if (!s.includes('satAngle')) {
  s = s.replace(/const \[angle, setAngle\] = useState\(0\);/, 'const [angle, setAngle] = useState(0);\nconst [satAngle, setSatAngle] = useState(0);');
  s = s.replace(/setAngle\(\(a\) => \(a \+ curSpeed\.current \* dt\) % 360\);/, 'setAngle((a) => (a + curSpeed.current * dt) % 360);\n      setSatAngle((a) => (a + curSpeed.current * 5 * dt) % 360);');
}

// 3) расчёт позиции от Кинзы
if (!s.includes('const ki =')) {
  s = s.replace(/const cy = R \* ryF \+ 2;/, `const cy = R * ryF + 2;
const ki = restaurants.findIndex((r) => r.id === 'kinza');
const krad = ((PHASES[ki] + angle) * Math.PI) / 180;
const kx = Math.cos(krad) * R * ORBITS[ki].r;
const ky = Math.sin(krad) * R * ryF * ORBITS[ki].ry;
const kdepth = (Math.sin(krad) + 1) / 2;
const kscale = 0.7 + kdepth * 0.4;
const srad = ((satAngle + 90) * Math.PI) / 180;
const sR = 96;
const sx = kx + Math.cos(srad) * sR * kscale;
const sy = ky - 46 * kscale + Math.sin(srad) * sR * 0.5 * kscale;
const sfront = Math.sin(srad) > 0;
const sz = sfront ? 35 : 9;
const sscale = kscale * (sfront ? 1 : 0.82);
const mkx = Math.cos(krad) * mobileR * M_ORBITS[ki];
const mky = Math.sin(krad) * mobileR * M_ORBITS[ki] * M_RY;
const msx = mkx + Math.cos(srad) * 46;
const msy = mky - 6 + Math.sin(srad) * 24;
const msz = sfront ? 35 : 9;`);
}

// 4) спутники (умные якоря)
if (!s.includes('eda-sat')) {
  const deskSat = `<a
  key="eda-sat"
  href={SAT_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Кинза — доставка в Яндекс Еде"
  title="Доставка · Яндекс Еда"
  className="absolute left-1/2 top-1/2 eda-satellite"
  style={{ transform: 'translate(-50%, -50%) translate(' + sx + 'px, ' + sy + 'px) scale(' + sscale + ')', zIndex: sz, opacity: 0.75 + kdepth * 0.25 }}
>
  <img src="/images/kinza/yandex-eda.png" alt="" className="w-12 h-12 lg:w-14 lg:h-14 rounded-[22%] eda-logo" style={{ boxShadow: '0 0 26px rgba(255,214,10,0.5), 0 8px 20px rgba(0,0,0,0.45)' }} />
</a>`;
  const mobSat = `<a
  key="eda-sat"
  href={SAT_URL}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Кинза — доставка в Яндекс Еде"
  className="absolute left-1/2 top-1/2 eda-satellite"
  style={{ transform: 'translate(-50%, -50%) translate(' + msx + 'px, ' + msy + 'px)', zIndex: msz }}
>
  <img src="/images/kinza/yandex-eda.png" alt="" className="w-9 h-9 rounded-[22%] eda-logo" style={{ boxShadow: '0 0 18px rgba(255,214,10,0.5)' }} />
</a>`;
  // desktop: после закрытия map с чипом «Перейти в ресторан»
  s = s.replace(/Перейти в ресторан\s*<\/span>\s*<\/div>\s*<\/a>\s*\);\s*\}\)\}/, (m) => m + '\n' + deskSat);
  // mobile: перед «) : (»
  s = s.replace(/\}\)\}(\s*<\/div>\s*<\/div>\s*\)\s*:\s*\()/, (m, tail) => '})}\n' + mobSat + tail);
}

if (s !== s0) { fs.writeFileSync(P('src/components/OrbitHero.tsx'), s, 'utf-8'); console.log('✓ OrbitHero дописан'); }
else console.log('⚠ ничего не изменилось');

console.log('Диагностика после: спутник eda-sat = ' + (s.match(/eda-sat/g) || []).length + ' (должно быть 2)');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Спутник Яндекс Еды: фикс вставки" && git pull --rebase && git push');