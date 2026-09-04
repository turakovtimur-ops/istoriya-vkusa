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
if (!bm) { console.log('⚠ BookingModal не найден'); }
else {
  let s = fs.readFileSync(bm, 'utf-8');
  const s0 = s;
  if (!s.includes('goMenu')) {
    // убираем автозакрытие
    s = s.replace(/setTimeout\(\(\) => \{\s*setSubmitted\(false\);\s*onClose\(\);\s*setForm\(\{[\s\S]*?\}\);\s*\}, 3000\);/, '');
    // handleClose + goMenu
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
    // крестик и фон закрывают через handleClose
    s = s.split('onClick={onClose}').join('onClick={handleClose}');
    // форма ИЛИ экран благодарности
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
  else console.log('⚠ BookingModal: уже готов или якоря не совпали');
}

// ================= 2) VacancyModal: гражданство + патент + опыт =================
const vm = find('Анкета соискателя');
if (!vm) { console.log('⚠ VacancyModal не найден'); }
else {
  let s = fs.readFileSync(vm, 'utf-8');
  const s0 = s;
  if (!s.includes('citizenship')) {
    // state
    s = s.replace(/medbook: '[^']*', start: '', about: ''/, "medbook: 'Нет', citizenship: 'Российская Федерация', patent: '', job1: '', job2: '', start: '', about: ''");
    // blocked
    s = s.replace(/const set = \(k: string, v: string\) => setForm\(\(f\) => \(\{ \.\.\.f, \[k\]: v \}\)\);/, "const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));\nconst blocked = form.citizenship === 'Туркменистан' && form.patent === 'Нет';");
    // гражданство после Должность/Заведение
    s = s.replace(/(Природа \(загородный комплекс\)\s*<\/option>\s*<\/select>\s*<\/div>\s*<\/div>)/, `$1
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Гражданство *</label>
          <select required value={form.citizenship} onChange={(e) => set('citizenship', e.target.value)} className={inputCls}>
            <option>Российская Федерация</option>
            <option>Республика Белоруссия</option>
            <option>Туркменистан</option>
            <option>Армения</option>
            <option>Казахстан</option>
          </select>
        </div>
      </div>
      {form.citizenship !== 'Российская Федерация' && (
        <div className="border border-terra/30 bg-terra/5 p-5 space-y-4">
          {['Республика Белоруссия', 'Армения', 'Казахстан'].includes(form.citizenship) ? (
            <p className="text-xs text-muted leading-relaxed">ℹ️ Граждане стран ЕАЭС (Беларусь, Армения, Казахстан) работают в РФ без патента — на основании договора о ЕАЭС.</p>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-muted leading-relaxed">⚠️ Гражданам Туркменистана для работы в РФ требуется патент на работу.</p>
              <div>
                <label className={labelCls}>Патент на работу в РФ</label>
                <div className="flex flex-wrap gap-5 pt-1">
                  <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                    <input type="radio" name="patent" checked={form.patent === 'Да, есть'} onChange={() => set('patent', 'Да, есть')} className="accent-terra" /> Да, есть
                  </label>
                  <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                    <input type="radio" name="patent" checked={form.patent === 'Нет'} onChange={() => set('patent', 'Нет')} className="accent-terra" /> Нет
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}`);
    // плашка-остановка вместо остальной анкеты
    s = s.replace(/\{mode === 'form' \? \(/, `{blocked ? (
      <div className="border border-terra/40 bg-terra/10 p-6 text-center">
        <div className="text-4xl mb-4">🤝</div>
        <p className="text-graphite text-sm leading-relaxed">Мы очень рады, что вы обратились к нам! Рекомендуем вам оформить патент и заполнить анкету повторно.</p>
      </div>
    ) : (
      <>
      {mode === 'form' ? (`);
    // 2 последних места (режим анкеты)
    s = s.replace(/(<div>\s*<label className=\{labelCls\}>Когда готовы приступить)/, `<div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Последнее место работы · необязательно</label>
          <input name="field" type="text" value={form.job1} onChange={(e) => set('job1', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>До этого · необязательно</label>
          <input name="field" type="text" value={form.job2} onChange={(e) => set('job2', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
      </div>
      $1`);
    // закрытие обёртки после кнопки Отправить
    s = s.replace(/(<button type="submit" disabled=\{submitted\} className="btn-terra w-full mt-2">.*?<\/button>)/s, `$1
      </>
    )}`);
  }
  if (s !== s0) { fs.writeFileSync(vm, s, 'utf-8'); console.log('✓ VacancyModal: гражданство + патент (плашка) + 2 последних места'); }
  else console.log('⚠ VacancyModal: уже готов или якоря не совпали');
}

// ================= 3) api/apply: строки в MAX =================
let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
if (!a.includes('Гражданство')) {
  a = a.replace(/const fmtVacancy[\s\S]*?\]\);/, `const fmtVacancy = (d: any) => L(['👔 ВАКАНСИЯ', 'Должность: ' + d.position, 'Заведение: ' + (d.place || 'Любой'), 'ФИО: ' + d.name, 'Телефон: ' + d.phone, 'Email: ' + (d.email || '—'), '🌍 Гражданство: ' + (d.citizenship || 'Российская Федерация'), ...(d.citizenship && d.citizenship !== 'Российская Федерация' ? ['📄 Патент: ' + (['Республика Белоруссия', 'Армения', 'Казахстан'].includes(d.citizenship) ? 'не требуется (ЕАЭС)' : (d.patent || '—'))] : []), 'Опыт: ' + (d.experience || '—'), ...(d.job1 ? ['💼 Последнее место: ' + d.job1] : []), ...(d.job2 ? ['💼 До этого: ' + d.job2] : []), 'Занятость: ' + (d.employment || '—'), 'Медкнижка: ' + (d.medbook || '—'), 'Приступить: ' + (d.start || '—'), 'О себе: ' + (d.about || '—')]);`);
}
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ api/apply: гражданство/патент/опыт в MAX'); }

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Часть 1: благодарность после брони + анкета с гражданством и патентом" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');