const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) Admin.tsx: вкладка «Партнёры» =================
let a = fs.readFileSync(P('src/pages/Admin.tsx'), 'utf-8');
const a0 = a;

// тип таба
a = a.split("useState<'news' | 'promos' | 'gallery' | 'resto' | 'settings'>('news')")
  .join("useState<'news' | 'promos' | 'gallery' | 'resto' | 'suppliers' | 'settings'>('news')");
// кнопка вкладки
a = a.split("['resto', 'Рестораны'], ['settings', 'Настройки']")
  .join("['resto', 'Рестораны'], ['suppliers', 'Партнёры'], ['settings', 'Настройки']");
// импорт данных
a = a.split("import { restaurants } from '../data/holding';")
  .join("import { restaurants } from '../data/holding';\nimport { suppliers as initialSuppliers } from '../data/suppliers';");

// состояние + функции
const fnAnchor = '  if (!authed) {';
const fnBlock = `  // ---------- партнёры ----------
  const [sups, setSups] = useState<any[]>(JSON.parse(JSON.stringify(initialSuppliers)));
  const [supForm, setSupForm] = useState({ name: '', category: 'Бар и напитки', desc: '', site: '' });
  const PALETTE = ['#1E4E8C', '#7A2E3B', '#349C74', '#B85A3C', '#C2A076', '#5B4B8A', '#2C6E63'];
  const supText = (list: any[]) => 'export interface Supplier { id: string; name: string; category: string; desc: string; accent: string; logo?: string; site?: string; image?: string }\\n' +
    '// партнёры холдинга — редактируется через админку\\n' +
    'export const suppliers: Supplier[] = ' + JSON.stringify(list, null, 2) + ';\\n';
  const addSup = async (file: File | null) => {
    if (!supForm.name) { setMsg('Укажи название компании'); return; }
    const id = 's' + Date.now();
    const entry: any = { id, name: supForm.name, category: supForm.category, desc: supForm.desc || 'Партнёр холдинга «История Вкуса»', accent: PALETTE[sups.length % PALETTE.length] };
    if (supForm.site) entry.site = supForm.site;
    const changes: Change[] = [];
    if (file) {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      entry.logo = '/images/suppliers/' + id + '.' + ext;
      changes.push({ path: 'public/images/suppliers/' + id + '.' + ext, base64: await fileToB64(file) });
    }
    const list = [...sups, entry];
    setSups(list);
    changes.push({ path: 'src/data/suppliers.ts', text: supText(list) });
    await publish('админка: партнёр + ' + supForm.name, changes);
    setSupForm({ name: '', category: 'Бар и напитки', desc: '', site: '' });
  };
  const delSup = async (s: any) => {
    const list = sups.filter((x) => x.id !== s.id);
    setSups(list);
    const changes: Change[] = [{ path: 'src/data/suppliers.ts', text: supText(list) }];
    if (s.logo) changes.push({ path: 'public' + s.logo, del: true });
    await publish('админка: партнёр - ' + s.name, changes);
  };

` + fnAnchor;
if (!a.includes('addSup')) a = a.split(fnAnchor).join(fnBlock);

// UI секции
const uiAnchor = '        {tab === \'settings\' && (';
const uiBlock = `        {tab === 'suppliers' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Партнёры и поставщики</h2>
            <div className="border border-cream/15 rounded-xl p-5 bg-cream/5 mb-8 space-y-3">
              <p className="text-cream/50 text-xs uppercase tracking-widest">Добавить компанию</p>
              <div className="grid md:grid-cols-2 gap-3">
                <input className={inp} placeholder="Название компании" value={supForm.name} onChange={(e) => setSupForm({ ...supForm, name: e.target.value })} />
                <select className={inp} value={supForm.category} onChange={(e) => setSupForm({ ...supForm, category: e.target.value })}>
                  <option>Бар и напитки</option>
                  <option>Кухня и продукты</option>
                  <option>Город и события</option>
                  <option>Сервис и оборудование</option>
                </select>
              </div>
              <input className={inp} placeholder="Сайт (https://...)" value={supForm.site} onChange={(e) => setSupForm({ ...supForm, site: e.target.value })} />
              <textarea className={inp} rows={2} placeholder="Описание для тултипа (1–2 строки)" value={supForm.desc} onChange={(e) => setSupForm({ ...supForm, desc: e.target.value })} />
              <div className="flex items-center gap-3 flex-wrap">
                <input type="file" accept="image/*" className="text-xs" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) addSup(f); e.target.value = ''; }} />
                <button className={btnG} onClick={() => addSup(null)}>Добавить без логотипа</button>
              </div>
              <p className="text-cream/40 text-xs">Логотип — квадратный, до 1 МБ. Компоний больше шести — садятся по две на орбиту, кольца не раздуваются.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {sups.map((s) => (
                <div key={s.id} className="border border-cream/15 rounded-xl p-4 bg-cream/5 flex items-center gap-4">
                  {s.logo ? (
                    <img src={s.logo} alt="" className="w-12 h-12 rounded-full object-cover border border-cream/15" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-coal flex items-center justify-center text-[9px] text-cream/80 text-center px-1">{s.name}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.name}</p>
                    <p className="text-cream/50 text-xs truncate">{s.category}{s.site ? ' · ' + s.site : ''}</p>
                  </div>
                  <button className="text-xs text-red-400 uppercase tracking-wider flex-none" onClick={() => delSup(s)}>Удалить</button>
                </div>
              ))}
            </div>
          </section>
        )}

` + uiAnchor;
if (!a.includes("tab === 'suppliers'")) a = a.split(uiAnchor).join(uiBlock);

if (a !== a0) { fs.writeFileSync(P('src/pages/Admin.tsx'), a, 'utf-8'); console.log('✓ админка: вкладка «Партнёры»'); }
else console.log('⚠ Admin.tsx: якоря не найдены');

// ================= 2) SuppliersOrbit: по две компании на орбиту =================
let o = fs.readFileSync(P('src/components/SuppliersOrbit.tsx'), 'utf-8');
const o0 = o;
// десктоп: вторая компания на том же кольце — напротив (+180°)
o = o.split('const deg = ring.phase + t * ring.speed;')
  .join('const deg = ring.phase + Math.floor(i / RINGS.length) * 180 + t * ring.speed;');
// мобайл: безопасные индексы + та же логика пары
o = o.split('const deg = PHASES[i] + t * SPEEDS[i];')
  .join('const deg = PHASES[i % PHASES.length] + Math.floor(i / 4) * 180 + t * SPEEDS[i % SPEEDS.length];');
if (o !== o0) { fs.writeFileSync(P('src/components/SuppliersOrbit.tsx'), o, 'utf-8'); console.log('✓ орбита: компании по две на кольцо'); }
else console.log('⚠ SuppliersOrbit: строки не найдены');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "Админка: партнёры + парные орбиты"');
console.log('git pull --rebase');
console.log('git push');