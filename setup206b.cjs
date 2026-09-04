const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const find = (marker) => {
  let t = null;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (['node_modules', '.git', 'dist'].includes(e.name)) return;
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes(marker)) t = p;
    });
  };
  walk(P('src'));
  return t;
};

// ================= 1) BookingModal: экран благодарности =================
const bm = find('Бронирование');
if (!bm) console.log('⚠ BookingModal не найден');
else {
  let s = fs.readFileSync(bm, 'utf-8');
  const s0 = s;
  if (!s.includes('goMenu')) {
    s = s.replace(/setTimeout\(\(\) => \{\s*setSubmitted\(false\);\s*onClose\(\);\s*setForm\(\{[\s\S]*?\}\);\s*\}, 3000\);/, '');
    s = s.replace(/if \(!isOpen\) return null;/, `const handleClose = () => { onClose(); setSubmitted(false); setForm({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' }); };
const goMenu = () => {
  const rest = (window.location.pathname.split('/')[1] || '');
  handleClose();
  setTimeout(() => {
    const el = document.getElementById('menu') || (!rest ? document.getElementById('restorany') : null);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 120);
};
if (!isOpen) return null;`);
    s = s.split('onClick={onClose}').join('onClick={handleClose}');
    s = s.replace(/<form onSubmit=\{handleSubmit\} className="space-y-6">/, `{submitted ? (
      <div className="text-center py-6">
        <div className="text-5xl mb-6">🙏</div>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-4 leading-tight">Спасибо, что выбрали нас!</h2>
        <p className="text-muted font-light mb-8 leading-relaxed">Мы это ценим. Не переживайте — ваша бронь уже обрабатывается администраторами. В случае чего мы свяжемся с вами для подтверждения. Ожидайте звонка!</p>
        <button onClick={goMenu} className="btn-terra w-full">Посмотреть меню</button>
        <p className="text-xs text-muted text-center mt-4">Вы можете предварительно ознакомиться с нашим меню, чтобы вдохновиться нашими блюдами</p>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">`);
    s = s.replace(/<\/form>/, `</form>
    )}`);
  }
  if (s !== s0) { fs.writeFileSync(bm, s, 'utf-8'); console.log('✓ BookingModal: экран благодарности + «Посмотреть меню»'); }
  else console.log('⚠ BookingModal: без изменений');
}

// ================= 2) VacancyModal: плашка-остановка без патента =================
const vm = find('Анкета соискателя');
if (!vm) console.log('⚠ VacancyModal не найден');
else {
  let s = fs.readFileSync(vm, 'utf-8');
  const s0 = s;
  if (!s.includes('const blocked')) {
    s = s.replace(/const set = \(k: string, v: string\) => setForm\(\(f\) => \(\{ \.\.\.f, \[k\]: v \}\)\);/, "const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));\nconst blocked = form.citizenship === 'Туркменистан' && form.patent === 'Нет, готов(а) оформить';");
    s = s.replace(/\{mode === 'form' \? \(/, `{blocked ? (
      <div className="border border-terra/40 bg-terra/10 p-6 text-center">
        <div className="text-4xl mb-4">🤝</div>
        <p className="text-graphite text-sm leading-relaxed">Мы очень рады, что вы обратились к нам! Рекомендуем вам оформить патент и заполнить анкету повторно.</p>
      </div>
    ) : (
      <>
      {mode === 'form' ? (`);
    s = s.replace(/(<button type="submit" disabled=\{submitted\} className="btn-terra w-full mt-2">.*?<\/button>)/s, `$1
      </>
    )}`);
  }
  if (s !== s0) { fs.writeFileSync(vm, s, 'utf-8'); console.log('✓ VacancyModal: плашка «оформите патент» вместо отправки'); }
  else console.log('⚠ VacancyModal: без изменений');
}

// ================= 3) api/apply: ЕАЭС → «не требуется» =================
let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
if (!a.includes('не требуется (ЕАЭС)')) {
  a = a.split("'📄 Патент: ' + (d.patent || '—')").join("'📄 Патент: ' + (['Республика Белоруссия', 'Армения', 'Казахстан'].includes(d.citizenship) ? 'не требуется (ЕАЭС)' : (d.patent || '—'))");
}
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ api/apply: ЕАЭС → «не требуется»'); }

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Часть 1: благодарность после брони + плашка патента" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');