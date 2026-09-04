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

// ================= 1) src/data/faq.ts (текущие 7 вопросов) =================
if (!fs.existsSync(P('src/data/faq.ts'))) {
  fs.writeFileSync(P('src/data/faq.ts'), `// генерируется админкой
export interface FaqItem { q: string; a: string }
export const FAQ_ITEMS: FaqItem[] = [
  { q: 'Можно ли принести свой алкоголь?', a: 'У нас обширная барная и винная карта с большим ассортиментом коктейлей на любой вкус — необходимости приносить свои напитки нет.' },
  { q: 'Есть ли скидка в день рождения?', a: 'В честь дня рождения мы дарим вам десерт и коктейль в подарок 🎁' },
  { q: 'Можно ли приходить с животными?', a: 'Да, мы зоо-friendly: для маленьких питомцев предусмотрены поилки и комплименты 🐾' },
  { q: 'Как забронировать стол?', a: 'Кнопкой «Забронировать» на сайте, по телефону или в MAX/WhatsApp — администратор подтвердит бронь звонком.' },
  { q: 'Есть ли детские стульчики?', a: 'Да, у нас есть детские стульчики и посуда — малышам будет комфортно.' },
  { q: 'Есть ли вегетарианские блюда?', a: 'Да, в меню есть вегетарианские позиции, и часть блюд мы адаптируем под вас — подскажет официант.' },
  { q: 'Принимаете ли карты и СБП?', a: 'Да, принимаем карты, СБП и наличные.' },
];
`, 'utf-8');
  console.log('✓ src/data/faq.ts создан (7 вопросов)');
}

// ================= 2) FaqBlock берёт из data/faq =================
const fq = P('src/components/FaqBlock.tsx');
let f = fs.readFileSync(fq, 'utf-8');
const f0 = f;
if (!f.includes('FAQ_ITEMS')) {
  f = f.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { FAQ_ITEMS } from '../data/faq';");
  f = f.replace(/const FAQ = \[[\s\S]*?\];/, 'const FAQ = FAQ_ITEMS;');
  fs.writeFileSync(fq, f, 'utf-8');
  console.log('✓ FaqBlock: вопросы из data/faq.ts');
}

// ================= 3) Admin: вкладка FAQ =================
const ad = find("const LS_HASH = 'iv_admin_hash'") || P('src/pages/Admin.tsx');
let s = fs.readFileSync(ad, 'utf-8');
const s0 = s;
if (!s.includes("'faq'")) {
  // тип вкладки
  s = s.split("'suppliers' | 'settings' | 'editor'>('news')").join("'suppliers' | 'faq' | 'settings' | 'editor'>('news')");
  // импорт
  s = s.split("import { suppliers as initialSuppliers } from '../data/suppliers';").join("import { suppliers as initialSuppliers } from '../data/suppliers';\nimport { FAQ_ITEMS } from '../data/faq';");
  // состояние + публикация
  s = s.split("const [supForm, setSupForm] = useState({ name: '', category: 'Бар и напитки', desc: '', site: '' });").join("const [supForm, setSupForm] = useState({ name: '', category: 'Бар и напитки', desc: '', site: '' });\n// ---------- FAQ ----------\nconst [faq, setFaq] = useState<any[]>(JSON.parse(JSON.stringify(FAQ_ITEMS)));\nconst faqText = () => '// генерируется админкой\\nexport interface FaqItem { q: string; a: string }\\nexport const FAQ_ITEMS: FaqItem[] = ' + JSON.stringify(faq, null, 2) + ';\\n';\nconst pubFaq = () => publish('админка: FAQ', [{ path: 'src/data/faq.ts', text: faqText() }]);");
  // кнопка вкладки
  s = s.split("['suppliers', 'Партнёры'], ['settings', 'Настройки']").join("['suppliers', 'Партнёры'], ['faq', 'FAQ'], ['settings', 'Настройки']");
  // секция
  s = s.split('{tab === \'settings\' && (').join(`{tab === 'faq' && (
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Вопросы и ответы (главная)</h2>
          <button className={btnA} onClick={() => setFaq([...faq, { q: 'Новый вопрос', a: 'Ответ' }])}>+ Добавить</button>
        </div>
        <div className="space-y-4">
          {faq.map((it, i) => (
            <div key={i} className="border border-cream/15 rounded-xl p-5 bg-cream/5">
              <input name="field" className={inp + ' mb-3 font-medium'} value={it.q} onChange={(e) => setFaq(faq.map((x, idx) => idx === i ? { ...x, q: e.target.value } : x))} />
              <textarea name="field" className={inp} rows={3} value={it.a} onChange={(e) => setFaq(faq.map((x, idx) => idx === i ? { ...x, a: e.target.value } : x))} />
              <div className="flex justify-end mt-2"><button className="text-xs text-red-400 uppercase tracking-wider" onClick={() => setFaq(faq.filter((_, idx) => idx !== i))}>Удалить</button></div>
            </div>
          ))}
        </div>
        <button className={btnA + ' mt-6 px-8 py-4'} disabled={busy} onClick={pubFaq}>{busy ? 'Отправляем...' : 'Опубликовать FAQ'}</button>
      </section>
    )}
    {tab === 'settings' && (`);
}
if (s !== s0) { fs.writeFileSync(ad, s, 'utf-8'); console.log('✓ Admin: вкладка FAQ готова'); }
else console.log('⚠ Admin: без изменений');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Админка: редактор FAQ" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');