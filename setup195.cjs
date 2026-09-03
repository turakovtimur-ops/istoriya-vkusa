const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

if (!fs.existsSync(P('public/images/kinza/yandex-eda.png'))) {
  console.log('⚠ НЕ НАШЁЛ логотип! Ожидал: public/images/kinza/yandex-eda.png — скажи, как назвал файл');
} else console.log('✓ логотип на месте');

let s = fs.readFileSync(P('src/components/OrbitHero.tsx'), 'utf-8');
const s0 = s;

// 1) константа ссылки
s = s.split('const SPEED = 4;')
  .join("const SPEED = 4;\nconst SAT_URL = 'https://eda.yandex.ru/r/kinza_1721032873?placeSlug=kinza_l37w6';");

// 2) отдельный угол спутника (без скачков)
s = s.split('const [angle, setAngle] = useState(0);')
  .join('const [angle, setAngle] = useState(0);\nconst [satAngle, setSatAngle] = useState(0);');

s = s.split('setAngle((a) => (a + curSpeed.current * dt) % 360);')
  .join('setAngle((a) => (a + curSpeed.current * dt) % 360);\n      setSatAngle((a) => (a + curSpeed.current * 5 * dt) % 360);');

// 3) расчёт позиции спутника от Кинзы
s = s.split('const cy = R * ryF + 2;').join(`const cy = R * ryF + 2;
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

// 4) спутник в DESKTOP-ветке (внутри контейнера с планетами)
const deskAnchor = "         })}\n       </div>\n     </div>\n   )}\n   <div className=\"absolute bottom-2 left-1/2";
const deskSat = `         })}
         <a
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
         </a>
       </div>
     </div>
   )}
   <div className="absolute bottom-2 left-1/2`;
s = s.split(deskAnchor).join(deskSat);

// 5) спутник в MOBILE-ветке
const mobAnchor = "         })}\n       </div>\n     </div>\n   ) : (";
const mobSat = `         })}
         <a
           key="eda-sat"
           href={SAT_URL}
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Кинза — доставка в Яндекс Еде"
           className="absolute left-1/2 top-1/2 eda-satellite"
           style={{ transform: 'translate(-50%, -50%) translate(' + msx + 'px, ' + msy + 'px)', zIndex: msz }}
         >
           <img src="/images/kinza/yandex-eda.png" alt="" className="w-9 h-9 rounded-[22%] eda-logo" style={{ boxShadow: '0 0 18px rgba(255,214,10,0.5)' }} />
         </a>
       </div>
     </div>
   ) : (`;
s = s.split(mobAnchor).join(mobSat);

if (s !== s0) { fs.writeFileSync(P('src/components/OrbitHero.tsx'), s, 'utf-8'); console.log('✓ OrbitHero: спутник Яндекс Еды вокруг Кинзы (desktop + mobile)'); }
else console.log('⚠ OrbitHero: якоря не найдены — пришли файл');

// 6) CSS: ховер-эффект логотипа
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('.eda-satellite')) {
  css += `\n/* Спутник Яндекс Еды */\n.eda-satellite img { transition: transform 0.3s ease; }\n.eda-satellite:hover img { transform: scale(1.15) rotate(-6deg); }\n`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ index.css: ховер спутника');
}

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Спутник Яндекс Еды у Кинзы" && git pull --rebase && git push');