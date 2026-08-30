const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let h = fs.readFileSync(P('src/pages/Holding.tsx'), 'utf-8');
const h0 = h;

// ================= 1) TeamAvatar: фото возвращаются при смене =================
const avOld = "function TeamAvatar({ src, name }: { src: string; name: string }) {\nconst [failed, setFailed] = useState(false);";
const avNew = "function TeamAvatar({ src, name }: { src: string; name: string }) {\nconst [failed, setFailed] = useState(false);\nuseEffect(() => { setFailed(false); }, [src]);";
if (h.includes(avOld)) h = h.split(avOld).join(avNew);
else {
  // если форматирование отличается — вставляем после первой строки функции
  h = h.replace(/function TeamAvatar\(\{ src, name \}: \{ src: string; name: string \}\) \{\s*\n(\s*)const \[failed, setFailed\] = useState\(false\);/,
    (m, sp) => m + '\n' + sp + 'useEffect(() => { setFailed(false); }, [src]);');
}
console.log('✓ TeamAvatar: фото не пропадают после свайпа');

// ================= 2) Новый мобильный блок команды =================
const re = /<div\s+className="md:hidden relative"[\s\S]*?(?=\s*<div className="hidden md:grid md:grid-cols-3 gap-8">)/;
const NEW_BLOCK = `<div
        className="md:hidden relative"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
          if (dx < -40) setTeamIdx((teamIdx + 1) % team.length);
          if (dx > 40) setTeamIdx((teamIdx + team.length - 1) % team.length);
        }}
      >
        <div className="flex items-center justify-center overflow-visible">
          <div className="w-36 h-36 flex-none rounded-full overflow-hidden border border-amber/40 bg-coal opacity-60 pointer-events-none">
            <TeamAvatar src={team[(teamIdx + team.length - 1) % team.length].photo} name={team[(teamIdx + team.length - 1) % team.length].name} />
          </div>
          <div key={teamIdx} className="w-44 h-44 mx-3 flex-none rounded-full overflow-hidden border-2 border-amber/60 bg-coal z-10 team-anim" style={{ boxShadow: '0 0 30px rgba(194,160,118,0.2)' }}>
            <TeamAvatar src={team[teamIdx].photo} name={team[teamIdx].name} />
          </div>
          <div className="w-36 h-36 flex-none rounded-full overflow-hidden border border-amber/40 bg-coal opacity-60 pointer-events-none">
            <TeamAvatar src={team[(teamIdx + 1) % team.length].photo} name={team[(teamIdx + 1) % team.length].name} />
          </div>
        </div>
        <div key={'txt' + teamIdx} className="text-center px-6 mt-6 team-anim">
          <p className="text-amber text-[9px] uppercase tracking-[0.3em] mb-2 font-medium">{team[teamIdx].role}</p>
          <h3 className="text-lg font-semibold tracking-tight whitespace-nowrap">{team[teamIdx].name}</h3>
          <p className="text-cream/60 text-sm font-light leading-relaxed mt-3">{team[teamIdx].desc}</p>
        </div>
        <div className="team-dots flex justify-center gap-2 mt-6">
          {team.map((m, i) => (
            <button key={m.id} onClick={() => setTeamIdx(i)} aria-label={m.name} className={'w-2.5 h-2.5 rounded-full transition-colors ' + (i === teamIdx ? 'bg-amber' : 'bg-cream/25')} />
          ))}
        </div>
        <p className="text-center text-cream/40 text-[9px] tracking-[0.3em] uppercase mt-3">Листайте</p>
      </div>`;
if (re.test(h)) {
  h = h.replace(re, NEW_BLOCK);
  console.log('✓ команда мобилка: новая раскладка');
} else console.log('⚠ мобильный блок команды не найден');

if (h !== h0) fs.writeFileSync(P('src/pages/Holding.tsx'), h, 'utf-8');

console.log('\n✅ Ритуал:');
console.log('git pull --rebase');
console.log('npm run build');
console.log('git add -A && git commit -m "Мобилка: команда финал" && git push');