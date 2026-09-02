const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const patch = (file, anchor, goal) => {
  let s = fs.readFileSync(P(file), 'utf-8');
  const s0 = s;
  const line = "    if ((window as any).ym) (window as any).ym(112073069, 'reachGoal', '" + goal + "');";
  s = s.split(anchor).join(anchor + '\n' + line);
  if (s !== s0) { fs.writeFileSync(P(file), s, 'utf-8'); console.log('✓ ' + file + ': цель ' + goal); }
  else console.log('⚠ ' + file + ': якорь не найден');
};

patch('src/components/BookingModal.tsx', "    setSubmitted(true);\n    try {", 'booking_sent');
patch('src/components/VacancyModal.tsx', "    setSubmitted(true);\n    let file;", 'vacancy_sent');
patch('src/components/PartnerModal.tsx', "    setSubmitted(true);\n    let file;", 'partner_sent');
patch('src/components/EventModal.tsx', "    setSubmitted(true);\n    let file;", 'event_sent');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Метрика: JS-цели по заявкам" && git pull --rebase && git push');