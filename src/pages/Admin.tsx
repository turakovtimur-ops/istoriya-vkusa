import { useEffect, useState } from 'react';
import { news as initialNews, NewsItem } from '../data/news';
import { PROMO_MEDIA, PromoMedia } from '../data/promos-media';
import { RESTO_EXTRA } from '../data/resto-extra';
import { restaurants } from '../data/holding';
import { suppliers as initialSuppliers } from '../data/suppliers';

const LS_HASH = 'iv_admin_hash';
const LS_TOKEN = 'iv_gh_token';

type Change = { path: string; base64?: string; text?: string; del?: boolean };
const sha256 = async (msg: string) => {
  const buf = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
};
const fileToB64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = rej;
  r.readAsDataURL(f);
});
const inp = 'w-full bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber';
const btnA = 'px-4 py-2 text-xs uppercase tracking-wider bg-amber text-night rounded-full hover:opacity-90';
const btnG = 'px-4 py-2 bg-cream/10 rounded-lg text-xs hover:bg-cream/20';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState<'news' | 'promos' | 'gallery' | 'resto' | 'suppliers' | 'settings' | 'editor'>('news');
  const [token, setToken] = useState(localStorage.getItem(LS_TOKEN) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  // новости
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  // акции
  const [promos, setPromos] = useState<PromoMedia[]>(PROMO_MEDIA);
  const [promoRest, setPromoRest] = useState('all');
  // галереи
  const [galRest, setGalRest] = useState(restaurants[0].id);
  const [extra, setExtra] = useState<any>(() => JSON.parse(JSON.stringify(RESTO_EXTRA)));
  // реквизиты
  const [restSel, setRestSel] = useState(restaurants[0].id);

  useEffect(() => { if (localStorage.getItem(LS_HASH)) setAuthed(true); }, []);

  const login = async () => {
    setErr('');
    const stored = localStorage.getItem(LS_HASH);
    const hash = await sha256(pwd);
    if (!stored) {
      if (pwd === '89322663995') { localStorage.setItem(LS_HASH, hash); setAuthed(true); return; }
      setErr('Первый вход: пароль 89322663995'); return;
    }
    if (hash !== stored) { setErr('Неверный пароль'); return; }
    setAuthed(true);
  };

  const publish = async (message: string, changes: Change[]) => {
    if (!token) { setMsg('Сначала сохрани GitHub-токен во вкладке «Настройки»'); return; }
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gh-token': token },
        body: JSON.stringify({ message, changes })
      });
      const j = await r.json();
      if (!r.ok) { setMsg('Ошибка: ' + (j.d || j.error || r.status)); return; }
      setMsg('✓ Опубликовано! Деплой ~1 минута — потом обнови страницу.');
    } catch (e: any) { setMsg('Сеть: ' + e.message); }
    finally { setBusy(false); }
  };

  // ---------- новости ----------
  const newsText = () => '// НОВОСТИ ХОЛДИНГА (обновлено через админку)\n' +
    'export interface NewsItem { id: string; date: string; tag: string; title: string; text: string }\n' +
    'export const news: NewsItem[] = ' + JSON.stringify(news, null, 2) + ';\n';
  const pubNews = () => publish('админка: новости', [{ path: 'src/data/news.ts', text: newsText() }]);

  // ---------- акции ----------
  const promosText = (list: PromoMedia[]) => '// генерируется админкой\n' +
    'export interface PromoMedia { id: string; restaurant: string; src: string }\n' +
    'export const PROMO_MEDIA: PromoMedia[] = ' + JSON.stringify(list, null, 2) + ';\n';
  const addPromo = async (file: File) => {
    const name = (promoRest === 'all' ? 'all' : promoRest) + '-a' + Date.now() + '.jpg';
    const b64 = await fileToB64(file);
    const list = [...promos, { id: name, restaurant: promoRest, src: '/images/promos/' + name }];
    setPromos(list);
    await publish('админка: акция +' + name, [
      { path: 'public/images/promos/' + name, base64: b64 },
      { path: 'src/data/promos-media.ts', text: promosText(list) }
    ]);
  };
  const delPromo = async (m: PromoMedia) => {
    const list = promos.filter((x) => x.id !== m.id);
    setPromos(list);
    await publish('админка: акция -' + m.id, [
      { path: 'public/images/promos/' + m.id, del: true },
      { path: 'src/data/promos-media.ts', text: promosText(list) }
    ]);
  };

  // ---------- галереи + рестораны ----------
  const restoText = () => '// генерируется админкой\n' +
    'export interface RestoExtra { hours: string; reviews: { name: string; text: string }[]; gallery: string[]; theme?: { pageBg?: string; btn?: string }; rating?: { score: string; count: number }; overrides?: Record<string, string> }\n' +
    'export const RESTO_EXTRA: Record<string, RestoExtra> = ' + JSON.stringify(extra, null, 2) + ';\n';
  const addGal = async (file: File) => {
    const e = extra[galRest]; if (!e) { setMsg('Нет данных ресторана'); return; }
    const name = 'a' + Date.now() + '.jpg';
    const src = '/images/' + galRest + '/gallery/' + name;
    e.gallery = [...(e.gallery || []), src];
    setExtra({ ...extra });
    const b64 = await fileToB64(file);
    await publish('админка: фото галереи ' + galRest, [
      { path: 'public/images/' + galRest + '/gallery/' + name, base64: b64 },
      { path: 'src/data/resto-extra.ts', text: restoText() }
    ]);
  };
  const delGal = async (src: string) => {
    const e = extra[galRest];
    e.gallery = (e.gallery || []).filter((s: string) => s !== src);
    setExtra({ ...extra });
    await publish('админка: фото галереи удалено', [
      { path: 'public' + src, del: true },
      { path: 'src/data/resto-extra.ts', text: restoText() }
    ]);
  };
  const uploadHero = async (file: File) => {
    const e = extra[restSel] || (extra[restSel] = { hours: '09:00–00:00', reviews: [], gallery: [] });
    const name = 'hero-' + Date.now() + '.jpg';
    e.overrides = e.overrides || {};
    e.overrides.image = '/images/' + restSel + '/' + name;
    setExtra({ ...extra });
    const b64 = await fileToB64(file);
    await publish('админка: хиро-фото ' + restSel, [
      { path: 'public/images/' + restSel + '/' + name, base64: b64 },
      { path: 'src/data/resto-extra.ts', text: restoText() }
    ]);
  };
  const setOv = (key: string, val: string) => {
    const e = extra[restSel] || (extra[restSel] = { hours: '09:00–00:00', reviews: [], gallery: [] });
    e.overrides = e.overrides || {};
    e.overrides[key] = val;
    setExtra({ ...extra });
  };
  const setHours = (val: string) => { const e = extra[restSel]; e.hours = val; setExtra({ ...extra }); };
  const addReview = () => { const e = extra[restSel]; e.reviews = [{ name: 'Гость', text: 'Текст отзыва' }, ...(e.reviews || [])]; setExtra({ ...extra }); };
  const updReview = (i: number, patch: any) => { const e = extra[restSel]; e.reviews[i] = { ...e.reviews[i], ...patch }; setExtra({ ...extra }); };
  const delReview = (i: number) => { const e = extra[restSel]; e.reviews = e.reviews.filter((_: any, idx: number) => idx !== i); setExtra({ ...extra }); };
  const pubResto = () => publish('админка: данные ' + restSel, [{ path: 'src/data/resto-extra.ts', text: restoText() }]);

  // ---------- редактор ----------
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
const overridesText = (obj: any) => "import { merge } from './merge';\nexport { merge };\nexport const OVERRIDES: Record<string, any> = " + JSON.stringify(obj, null, 2) + ';\n';
const edSave = async () => {
  if (!edSel) return;
  let o = edOv;
  if (!o) o = await loadOv();
  setByPath(o, edSel.path, edVal.trim());
  setEdOv(JSON.parse(JSON.stringify(o)));
  await publish('админка: редактор ' + edSel.path, [{ path: 'src/data/overrides.ts', text: overridesText(o) }]);
  setEdSel(null);
};
// ---------- партнёры ----------
  const [sups, setSups] = useState<any[]>(JSON.parse(JSON.stringify(initialSuppliers)));
  const [supForm, setSupForm] = useState({ name: '', category: 'Бар и напитки', desc: '', site: '' });
  const PALETTE = ['#1E4E8C', '#7A2E3B', '#349C74', '#B85A3C', '#C2A076', '#5B4B8A', '#2C6E63'];
  const supText = (list: any[]) => 'export interface Supplier { id: string; name: string; category: string; desc: string; accent: string; logo?: string; site?: string; image?: string }\n' +
    '// партнёры холдинга — редактируется через админку\n' +
    'export const suppliers: Supplier[] = ' + JSON.stringify(list, null, 2) + ';\n';
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

  if (!authed) {
    return (
      <div className="min-h-screen bg-graphite text-cream flex items-center justify-center px-6">
        <div className="w-full max-w-md glass-bar rounded-2xl p-8">
          <p className="text-amber text-xs tracking-[0.3em] uppercase mb-4">История Вкуса</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-8">Управление</h1>
          <input type="password" placeholder="Пароль" value={pwd} onChange={(e) => setPwd(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && login()} className={inp + ' mb-4'} />
          <button onClick={login} className="w-full bg-amber text-night font-medium py-3 rounded-lg hover:opacity-90">Войти</button>
          {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
        </div>
      </div>
    );
  }

  const cur = extra[restSel] || { hours: '', reviews: [], gallery: [], overrides: {} };
  const rest0 = restaurants.find((r) => r.id === restSel)!;

  return (
    <div className="min-h-screen bg-graphite text-cream pb-24">
      <header className="sticky top-0 z-50 glass-bar">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-amber text-xs tracking-[0.3em] uppercase">Админка</span>
            <span className="text-cream/40 text-xs hidden md:block">История Вкуса</span>
          </div>
          <a href="#/" className="text-xs text-cream/60 hover:text-cream">← На сайт</a>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 flex gap-2 overflow-x-auto pb-3">
          {([['news', 'Новости'], ['promos', 'Акции'], ['gallery', 'Галереи'], ['resto', 'Рестораны'], ['suppliers', 'Партнёры'], ['settings', 'Настройки'], ['editor', 'Редактор']] as const).map(([id, label]) => (
            <button key={id} onClick={() => { setTab(id); setMsg(''); }} className={'px-4 py-2 text-xs uppercase tracking-wider rounded-full flex-none ' + (tab === id ? 'bg-amber text-night' : 'bg-cream/10 text-cream/70')}>{label}</button>
          ))}
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-8">
        {msg && <p className="mb-6 text-sm px-4 py-3 rounded-lg bg-cream/10" style={{ color: msg.startsWith('✓') ? '#8fd19e' : '#fbbf24' }}>{msg}</p>}

        {tab === 'news' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Новости</h2>
              <button className={btnA} onClick={() => setNews([{ id: 'n' + Date.now(), date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }), tag: 'Новость', title: 'Заголовок', text: 'Текст' }, ...news])}>+ Добавить</button>
            </div>
            <div className="space-y-4">
              {news.map((n, i) => (
                <div key={n.id} className="border border-cream/15 rounded-xl p-5 bg-cream/5">
                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input className={inp} value={n.date} onChange={(e) => setNews(news.map((x, idx) => idx === i ? { ...x, date: e.target.value } : x))} />
                    <input className={inp} value={n.tag} onChange={(e) => setNews(news.map((x, idx) => idx === i ? { ...x, tag: e.target.value } : x))} />
                  </div>
                  <input className={inp + ' mb-3 font-medium'} value={n.title} onChange={(e) => setNews(news.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
                  <textarea className={inp} rows={3} value={n.text} onChange={(e) => setNews(news.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} />
                  <div className="flex justify-end mt-2"><button className="text-xs text-red-400 uppercase tracking-wider" onClick={() => setNews(news.filter((_, idx) => idx !== i))}>Удалить</button></div>
                </div>
              ))}
            </div>
            <button className={btnA + ' mt-6 px-8 py-4'} disabled={busy} onClick={pubNews}>{busy ? 'Отправляем...' : 'Опубликовать новости'}</button>
          </section>
        )}

        {tab === 'promos' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Акции-сторис</h2>
            <div className="border border-cream/15 rounded-xl p-5 bg-cream/5 mb-8">
              <p className="text-cream/50 text-xs mb-3">Добавить плакат (до 3 МБ, пропорции А):</p>
              <div className="flex flex-wrap gap-3 items-center">
                <select className={inp + ' w-auto'} value={promoRest} onChange={(e) => setPromoRest(e.target.value)}>
                  <option value="all">Все рестораны</option>
                  {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) addPromo(f); e.target.value = ''; }} className="text-xs" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {promos.map((m) => (
                <div key={m.id} className="relative border border-cream/15 rounded-lg overflow-hidden">
                  <img src={m.src} alt={m.id} className="w-full aspect-[1080/1534] object-cover" />
                  <p className="text-[10px] text-cream/60 px-2 py-1 truncate">{m.restaurant} · {m.id}</p>
                  <button onClick={() => delPromo(m)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-red-400 text-xs">✕</button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === 'gallery' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Галереи ресторанов</h2>
            <select className={inp + ' w-auto mb-6'} value={galRest} onChange={(e) => setGalRest(e.target.value)}>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="border border-cream/15 rounded-xl p-5 bg-cream/5 mb-8">
              <p className="text-cream/50 text-xs mb-3">Добавить фото (до 3 МБ):</p>
              <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) addGal(f); e.target.value = ''; }} className="text-xs" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {((extra[galRest] && extra[galRest].gallery) || []).map((src: string) => (
                <div key={src} className="relative border border-cream/15 rounded-lg overflow-hidden">
                  <img src={src} alt="" className="w-full aspect-[4/3] object-cover" />
                  <button onClick={() => delGal(src)} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-red-400 text-xs">✕</button>
                </div>
              ))}
              {(!extra[galRest] || !(extra[galRest].gallery || []).length) && <p className="text-cream/40 text-sm">Фото нет — добавь первое.</p>}
            </div>
          </section>
        )}

        {tab === 'resto' && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Данные ресторанов</h2>
            <select className={inp + ' w-auto mb-6'} value={restSel} onChange={(e) => setRestSel(e.target.value)}>
              {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-cream/50 text-xs uppercase tracking-widest">Главное фото (первый экран)</p>
                <div className="flex items-center gap-3">
                  <img src={(cur.overrides && cur.overrides.image) || rest0.image} alt="" className="w-24 h-16 object-cover rounded-lg border border-cream/15" />
                  <input type="file" accept="image/*" className="text-xs" onChange={(e) => { const f = e.target.files && e.target.files[0]; if (f) uploadHero(f); e.target.value = ''; }} />
                </div>
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Часы работы</p>
                <input className={inp} value={cur.hours || ''} onChange={(e) => setHours(e.target.value)} placeholder="09:00–00:00" />
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Телефон</p>
                <input className={inp} defaultValue={rest0.phone} key={restSel + 'p'} onChange={(e) => setOv('phone', e.target.value)} />
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Адрес</p>
                <input className={inp} defaultValue={rest0.address} key={restSel + 'a'} onChange={(e) => setOv('address', e.target.value)} />
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Пляж / ориентир</p>
                <input className={inp} defaultValue={rest0.beach} key={restSel + 'b'} onChange={(e) => setOv('beach', e.target.value)} />
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Короткий слоган</p>
                <textarea className={inp} rows={2} defaultValue={rest0.tagline} key={restSel + 't'} onChange={(e) => setOv('tagline', e.target.value)} />
                <p className="text-cream/50 text-xs uppercase tracking-widest pt-2">Описание (о ресторане)</p>
                <textarea className={inp} rows={5} defaultValue={rest0.description} key={restSel + 'd'} onChange={(e) => setOv('description', e.target.value)} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-cream/50 text-xs uppercase tracking-widest">Отзывы</p>
                  <button className={btnG} onClick={addReview}>+ Отзыв</button>
                </div>
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
                  {(cur.reviews || []).map((r: any, i: number) => (
                    <div key={i} className="border border-cream/15 rounded-lg p-3 bg-cream/5">
                      <input className={inp + ' mb-2'} value={r.name} onChange={(e) => updReview(i, { name: e.target.value })} />
                      <textarea className={inp} rows={3} value={r.text} onChange={(e) => updReview(i, { text: e.target.value })} />
                      <div className="flex justify-end mt-1"><button className="text-xs text-red-400" onClick={() => delReview(i)}>Удалить</button></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button className={btnA + ' mt-8 px-8 py-4'} disabled={busy} onClick={pubResto}>{busy ? 'Отправляем...' : 'Опубликовать данные'}</button>
          </section>
        )}

        {tab === 'suppliers' && (
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

        {tab === 'editor' && (
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
     {tab === 'settings' && (
          <section className="max-w-md">
            <h2 className="text-2xl font-semibold mb-6">Настройки</h2>
            <p className="text-cream/50 text-xs mb-3">GitHub-токен (хранится только в твоём браузере):</p>
            {token ? (
              <div className="flex items-center gap-3 mb-8">
                <span className="text-green-400 text-sm">✓ Токен сохранён</span>
                <button className="text-xs text-cream/50 underline" onClick={() => { localStorage.removeItem(LS_TOKEN); setToken(''); }}>Сбросить</button>
              </div>
            ) : (
              <div className="flex gap-2 mb-8">
                <input type="password" className={inp} value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="ghp_..." />
                <button className={btnG} onClick={() => { if (tokenInput.startsWith('ghp_')) { localStorage.setItem(LS_TOKEN, tokenInput); setToken(tokenInput); setTokenInput(''); setMsg('Токен сохранён'); } else setMsg('Токен начинается с ghp_'); }}>Сохранить</button>
              </div>
            )}
            <p className="text-cream/40 text-xs leading-relaxed">Пароль входа хранится в этом браузере. Публикация = коммит в GitHub → деплой ~1 минута. Фото — до 3 МБ.</p>
          </section>
        )}
      </main>
    </div>
  );
}
