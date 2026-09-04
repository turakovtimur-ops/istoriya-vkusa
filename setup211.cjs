const fs = require('fs');
const P = (f) => require('path').join(__dirname, f);

const fq = P('src/components/FaqBlock.tsx');
let s = fs.readFileSync(fq, 'utf-8');
const s0 = s;

s = s.split('className="font-serif text-3xl lg:text-5xl font-medium text-cream text-center mb-10"')
  .join('className="text-3xl md:text-5xl font-semibold tracking-tight text-cream text-center mb-10"');

if (s !== s0) { fs.writeFileSync(fq, s, 'utf-8'); console.log('✓ заголовок FAQ: как все заголовки главной'); }
else console.log('⚠ класс не найден — пришли скрин');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "FAQ: заголовок в общем стиле" && git pull --rebase && git push');