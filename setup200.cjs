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

if (!s.includes('MAX_LOYALTY_URL')) {
  s = s.replace(/const geo = \(id: string\) => GEO\[id\] \|\| \[38\.0776, 44\.5611\];/, "const geo = (id: string) => GEO[id] || [38.0776, 44.5611];\nconst MAX_LOYALTY_URL = 'https://max.ru/id2370015710_bot';");
}

if (!s.includes('loyalty-btn')) {
  s = s.replace(/(\{restaurant\.id === 'kinza' && \([\s\S]*?<\/a>\s*\)\})\s*(<\/div>)/, (m, p1, p2) =>
    p1 + `
            <a href={MAX_LOYALTY_URL} target="_blank" rel="noopener noreferrer" className="loyalty-btn inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-widest font-medium shadow-lg hover:scale-105 transition-transform" style={{ background: 'rgba(17,17,17,0.55)', color: '#f5efe6', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <img src="/images/social/max.png" alt="" className="w-6 h-6 rounded-md" />
              Система лояльности
            </a>
          ` + p2);
}

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ кнопка «Система лояльности» в hero всех ресторанов'); }
else console.log('⚠ ничего не изменилось — якорь не совпал');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Кнопка Система лояльности (MAX) в hero ресторанов" && git pull --rebase && git push');