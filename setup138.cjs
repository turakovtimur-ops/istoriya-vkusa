const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Орбита поставщиков: влезает в экран =================
let o = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const o0 = o;
// после setup135 там слишком широкая орбита — ужимаем
if (o.includes('const mobileR = (w + 40) * 0.62;')) {
  o = o.split('const mobileR = (w + 40) * 0.62;').join('const mobileR = Math.min((w + 40) * 0.38, 170);');
} else if (o.includes('const mobileR = Math.min((w + 40) * 0.36, 170);')) {
  o = o.split('const mobileR = Math.min((w + 40) * 0.36, 170);').join('const mobileR = Math.min((w + 40) * 0.38, 170);');
}
if (o !== o0) { fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), o, 'utf-8'); console.log('✓ орбита поставщиков: планеты в экране'); }
else console.log('⚠ SuppliersOrbit: mobileR не найден');

// ================= 2) CSS: мероприятия каруселью + мягкая команда =================
let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('setup138')) {
  css += `
/* ===== setup138: мобилка — мероприятия каруселью, команда мягче ===== */
@media (max-width: 767px) {
  #events .grid, #events [class*="grid"] {
    display: flex !important;
    flex-direction: row !important;
    grid-template-columns: none !important;
    gap: 14px !important;
    overflow-x: auto !important;
    scroll-snap-type: x mandatory !important;
    padding-bottom: 14px;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch;
  }
  #events .grid > *, #events [class*="grid"] > * {
    flex: 0 0 auto !important;
    min-width: 86% !important;
    max-width: 86% !important;
    width: auto !important;
    scroll-snap-align: start;
  }
  #events .grid::-webkit-scrollbar, #events [class*="grid"]::-webkit-scrollbar { display: none; }
}
.team-anim { animation: teamInSoft 0.7s cubic-bezier(0.25, 0.8, 0.35, 1) !important; }
@keyframes teamInSoft {
  from { opacity: 0; transform: translateX(14px) scale(0.985); }
  to { opacity: 1; transform: none; }
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: мероприятия карусель + плавная команда');
}

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: орбита в экране, мероприятия каруселью"');
console.log('git pull --rebase');
console.log('git push');