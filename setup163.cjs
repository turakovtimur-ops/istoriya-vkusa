const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) merge.ts отдельно =================
fs.writeFileSync(P('src/data/merge.ts'), `export function merge<T>(base: T, over: any): T {
  const b: any = base;
  if (over === undefined || over === null) return base;
  if (Array.isArray(over)) return over as unknown as T;
  if (typeof over === 'object' && typeof b === 'object' && b && !Array.isArray(b)) {
    const out: any = { ...b };
    for (const k of Object.keys(over)) out[k] = merge(b[k], over[k]);
    return out as T;
  }
  return over as T;
}
`, 'utf-8');
console.log('✓ src/data/merge.ts');

// ================= 2) overrides.ts = реэкспорт merge + JSON (с сохранением данных) =================
let ov = fs.readFileSync(P('src/data/overrides.ts'), 'utf-8');
let json = '{}';
const ci = ov.indexOf('export const OVERRIDES');
if (ci > -1) {
  const eq = ov.indexOf('=', ci);
  let body = ov.slice(eq + 1).trim();
  if (body.endsWith(';')) body = body.slice(0, -1);
  try { JSON.parse(body); json = body; } catch (e) { }
}
fs.writeFileSync(P('src/data/overrides.ts'), "export { merge } from './merge';\nexport const OVERRIDES: Record<string, any> = " + json + ';\n', 'utf-8');
console.log('✓ overrides.ts: merge вынесен, JSON сохранён');

// ================= 3) Admin.tsx: вкладка «Редактор» =================
let a = fs.readFileSync(P('src/pages/Admin.tsx'), 'utf-8');
const a0 = a;

// 3a) тип вкладки
a = a.split("useState<'news' | 'promos' | 'gallery' | 'resto' | 'suppliers' | 'settings'>('news')")
  .join("useState<'news' | 'promos' | 'gallery' | 'resto' | 'suppliers' | 'settings' | 'editor'>('news')");

// 3b) кнопка вкладки
a = a.split("['suppliers', 'Партнёры'], ['settings', 'Настройки']] as const")
  .join("['suppliers', 'Партнёры'], ['settings', 'Настройки'], ['editor', 'Редактор']] as const");

// 3c) логика редактора
const logic = `// ---------- редактор ----------
const [edDevice, setEdDevice] = useState<'desktop' | 'mobile'>('desktop');
const [edPage, setEdPage] = useState('/');
const [edKey, setEdKey] = useState(0);
const [edSel, setEdSel] = useState<{ path: string; kind: string; value: string } | null>(null);
const [edVal, setEdVal] = useState('');
const [edOv, setEdOv] = useState<any>(null);
useEffect(() => {
  const onMsg = (e: MessageEvent) => {
    const d: any = e.data;
    if (d && d.type === 'iv-edit') { setEdSel({ path: d.path, kind: d.kind, value: d.value }); setEdVal(d.value || ''); }
  };
  window.addEventListener('message', onMsg);
  return () => window.removeEventListener('message', onMsg);
}, []);
const loadOv = async () => {
  try {
    const r = await fetch('/api/read?path=' + encodeURIComponent('src/data/overrides.ts'), { headers: { 'x-gh-token': token } });
    const j = await r.json();
    if (r.ok && j.text) {
      const i = j.text.indexOf('export const OVERRIDES');
      const eq = j.text.indexOf('=', i);
      let body = j.text.slice(eq + 1).trim();
      if (body.endsWith(';')) body = body.slice(0, -1);
      const o = JSON.parse(body);
      setEdOv(o);
      return o;
    }
  } catch (e) { }
  const o = {};
  setEdOv(o);
  return o;
};
const setByPath = (obj: any, p: string, v: any) => {
  const parts = p.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = String(Number(parts[i + 1])) === parts[i + 1] ? [] : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = v;
};
const overridesText = (obj: any) => "import { merge } from './merge';\\nexport { merge };\\nexport const OVERRIDES: Record<string, any> = " + JSON.stringify(obj, null, 2) + ';\\n';
const edSave = async () => {
  if (!edSel) return;
  let o = edOv;
  if (!o) o = await loadOv();
  setByPath(o, edSel.path, edVal.trim());
  setEdOv(JSON.parse(JSON.stringify(o)));
  await publish('админка: редактор ' + edSel.path, [{ path: 'src/data/overrides.ts', text: overridesText(o) }]);
  setEdSel(null);
};
// ---------- партнёры ----------`;
a = a.split('// ---------- партнёры ----------').join(logic);

// 3d) UI вкладки
const ui = `{tab === 'editor' && (
       <section>
         <div className="flex flex-wrap items-center gap-3 mb-4">
           <h2 className="text-2xl font-semibold">Редактор сайта</h2>
           <div className="flex flex-wrap gap-2 ml-auto">
             <select className={inp + ' w-auto'} value={edPage} onChange={(e) => { setEdPage(e.target.value); setEdSel(null); }}>
               <option value="/">Главная</option>
               {restaurants.map((r) => (<option key={r.id} value={String(r.path).startsWith('/') ? String(r.path) : '/' + r.path}>{r.name}</option>))}
             </select>
             <button className={edDevice === 'desktop' ? btnA : btnG} onClick={() => setEdDevice('desktop')}>🖥 Веб</button>
             <button className={edDevice === 'mobile' ? btnA : btnG} onClick={() => setEdDevice('mobile')}>📱 Мобилка</button>
             <button className={btnG} onClick={() => { setEdKey(edKey + 1); setEdSel(null); }}>⟳ Обновить</button>
           </div>
         </div>
         <p className="text-cream/50 text-xs mb-3">Кликай по подсвеченным элементам внутри рамки — ниже появится поле правки. Публикация = коммит → деплой ~1 минута.</p>
         <div className="border border-cream/15 rounded-xl overflow-hidden bg-black/50 flex justify-center">
           <iframe key={edKey + edDevice + edPage} src={edPage + (edPage.includes('?') ? '&' : '?') + 'edit=1'} title="Редактор" style={{ width: edDevice === 'mobile' ? 390 : '100%', height: '75vh', border: 0, background: '#0E0D0B' }} />
         </div>
         {edSel && (
           <div className="mt-4 border border-amber/40 rounded-xl p-5 bg-cream/5">
             <p className="text-amber text-xs uppercase tracking-widest mb-2">Правка: {edSel.path}</p>
             <textarea className={inp} rows={3} value={edVal} onChange={(e) => setEdVal(e.target.value)} />
             <div className="flex gap-2 mt-3">
               <button className={btnA} disabled={busy} onClick={edSave}>{busy ? 'Отправляем...' : 'Сохранить и опубликовать'}</button>
               <button className={btnG} onClick={() => setEdSel(null)}>Отмена</button>
             </div>
           </div>
         )}
       </section>
     )}
     {tab === 'settings' && (`;
a = a.split('{tab === \'settings\' && (').join(ui);

if (a !== a0) { fs.writeFileSync(P('src/pages/Admin.tsx'), a, 'utf-8'); console.log('✓ Admin: вкладка «Редактор» встроена'); }
else console.log('⚠ Admin: якоря не найдены — ничего не тронул');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Админка: вкладка Редактор (hover-правка сайта)"');
console.log('git pull --rebase');
console.log('git push');