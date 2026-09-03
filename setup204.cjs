const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) VacancyModal =================
let target = null;
const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
    const p = path.join(dir, e.name);
    if (['node_modules', '.git', 'dist'].includes(e.name)) return;
    if (e.isDirectory()) walk(p);
    else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes('Анкета соискателя')) target = p;
  });
};
walk(P('src'));
if (!target) { console.log('⚠ VacancyModal не найден'); process.exit(1); }
console.log('✓ найден: ' + target);

let s = fs.readFileSync(target, 'utf-8');
const s0 = s;

if (!s.includes('citizenship')) {
  // state: новые поля
  s = s.replace(/medbook: '[^']*', start: '', about: ''/, "medbook: 'Нет', citizenship: 'Российская Федерация', patent: '', job1: '', job2: '', start: '', about: ''");

  // гражданство + патент-блок (после Должность/Заведение)
  const civJSX = `$1
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
          <p className="text-xs text-muted leading-relaxed">
            {['Республика Белоруссия', 'Армения', 'Казахстан'].includes(form.citizenship)
              ? 'ℹ️ Граждане стран ЕАЭС (Беларусь, Армения, Казахстан) работают в РФ без патента — на основании договора о ЕАЭС.'
              : '⚠️ Гражданам Туркменистана для работы в РФ требуется патент на работу.'}
          </p>
          <div>
            <label className={labelCls}>Патент / разрешение на работу в РФ</label>
            <div className="flex flex-wrap gap-5 pt-1">
              <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                <input type="radio" name="patent" required checked={form.patent === 'Да, есть'} onChange={() => set('patent', 'Да, есть')} className="accent-terra" /> Да, есть
              </label>
              <label className="flex items-center gap-2 text-sm text-graphite cursor-pointer">
                <input type="radio" name="patent" required checked={form.patent === 'Нет, готов(а) оформить'} onChange={() => set('patent', 'Нет, готов(а) оформить')} className="accent-terra" /> Нет, готов(а) оформить
              </label>
            </div>
          </div>
        </div>
      )}`;
  s = s.replace(/(Природа \(загородный комплекс\)\s*<\/option>\s*<\/select>\s*<\/div>\s*<\/div>)/, civJSX);

  // опыт в заведениях (режим анкеты, перед «Когда готовы приступить»)
  const jobsJSX = `<div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Последнее место работы · необязательно</label>
          <input name="field" type="text" value={form.job1} onChange={(e) => set('job1', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>До этого · необязательно</label>
          <input name="field" type="text" value={form.job2} onChange={(e) => set('job2', e.target.value)} placeholder="Заведение и должность" className={inputCls} />
        </div>
      </div>
      `;
  s = s.replace(/(<div>\s*<label className=\{labelCls\}>Когда готовы приступить)/, jobsJSX + '$1');
}

if (s !== s0) { fs.writeFileSync(target, s, 'utf-8'); console.log('✓ VacancyModal: гражданство + патент + 2 последних места'); }
else console.log('⚠ VacancyModal: якоря не совпали');

// ================= 2) api/apply.ts =================
let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
if (!a.includes('Гражданство')) {
  a = a.replace(/const fmtVacancy[\s\S]*?\]\);/, `const fmtVacancy = (d: any) => L(['👔 ВАКАНСИЯ', 'Должность: ' + d.position, 'Заведение: ' + (d.place || 'Любой'), 'ФИО: ' + d.name, 'Телефон: ' + d.phone, 'Email: ' + (d.email || '—'), '🌍 Гражданство: ' + (d.citizenship || 'Российская Федерация'), ...(d.citizenship && d.citizenship !== 'Российская Федерация' ? ['📄 Патент: ' + (d.patent || '—')] : []), 'Опыт: ' + (d.experience || '—'), ...(d.job1 ? ['💼 Последнее место: ' + d.job1] : []), ...(d.job2 ? ['💼 До этого: ' + d.job2] : []), 'Занятость: ' + (d.employment || '—'), 'Медкнижка: ' + (d.medbook || '—'), 'Приступить: ' + (d.start || '—'), 'О себе: ' + (d.about || '—')]);`);
}
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ api/apply: заявка теперь с гражданством, патентом и местами работы'); }
else console.log('⚠ api/apply: не изменился');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Анкета: гражданство, патент (ЕАЭС), 2 последних места" && git pull --rebase && git push');