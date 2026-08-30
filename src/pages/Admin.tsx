import { useEffect, useState } from 'react';
import { news as initialNews, NewsItem } from '../data/news';

const LS_HASH = 'iv_admin_hash';
const LS_TOKEN = 'iv_gh_token';
const LS_PWD = 'iv_admin_pwd';

const sha256 = async (msg: string) => {
  const buf = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
};

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [token, setToken] = useState(localStorage.getItem(LS_TOKEN) || '');
  const [tokenInput, setTokenInput] = useState('');
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [newPwd2, setNewPwd2] = useState('');

  useEffect(() => {
    if (localStorage.getItem(LS_HASH) && localStorage.getItem(LS_PWD)) setAuthed(true);
  }, []);

  const login = async () => {
    setErr('');
    const stored = localStorage.getItem(LS_HASH);
    const storedPwd = localStorage.getItem(LS_PWD);
    const hash = await sha256(pwd);
    if (!stored) {
      if (pwd === '89322663995') {
        localStorage.setItem(LS_HASH, hash);
        localStorage.setItem(LS_PWD, '89322663995');
        setAuthed(true);
        return;
      }
      setErr('Первый вход: пароль 89322663995');
      return;
    }
    if (hash !== stored) { setErr('Неверный пароль'); return; }
    setAuthed(true);
    void storedPwd;
  };

  const changePwd = async () => {
    if (!newPwd || newPwd !== newPwd2) { setMsg('Пароли не совпадают'); return; }
    if (newPwd.length < 6) { setMsg('Минимум 6 символов'); return; }
    localStorage.setItem(LS_HASH, await sha256(newPwd));
    localStorage.setItem(LS_PWD, newPwd);
    setMsg('Пароль изменён');
    setNewPwd(''); setNewPwd2('');
  };

  const saveToken = () => {
    if (!tokenInput.startsWith('ghp_')) { setMsg('Токен должен начинаться с ghp_'); return; }
    localStorage.setItem(LS_TOKEN, tokenInput);
    setToken(tokenInput);
    setTokenInput('');
    setMsg('Токен сохранён');
  };

  const addNews = () => {
    const id = 'n' + Date.now();
    setNews([{ id, date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }), tag: 'Новость', title: 'Новая новость', text: 'Текст новости' }, ...news]);
  };

  const upd = (i: number, patch: Partial<NewsItem>) => setNews(news.map((n, idx) => idx === i ? { ...n, ...patch } : n));
  const del = (i: number) => setNews(news.filter((_, idx) => idx !== i));

  const publish = async () => {
    if (!token) { setMsg('Сначала введи GitHub-токен'); return; }
    setBusy(true); setMsg('');
    try {
      const r = await fetch('/api/publish-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-gh-token': token },
        body: JSON.stringify({ news })
      });
      const j = await r.json();
      if (!r.ok) { setMsg('Ошибка: ' + (j.detail || j.error || r.status)); return; }
      setMsg('✓ Опубликовано! Деплой ~1 минута. Страница обновится автоматически.');
    } catch (e: any) { setMsg('Сеть: ' + e.message); }
    finally { setBusy(false); }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-graphite text-cream flex items-center justify-center px-6">
        <div className="w-full max-w-md glass-bar rounded-2xl p-8">
          <p className="text-amber text-xs tracking-[0.3em] uppercase mb-4">История Вкуса</p>
          <h1 className="text-3xl font-semibold tracking-tight mb-8">Управление</h1>
          <input
            type="password"
            placeholder="Пароль"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full bg-cream/5 border border-cream/20 rounded-lg px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-amber mb-4"
          />
          <button onClick={login} className="w-full bg-amber text-night font-medium py-3 rounded-lg hover:opacity-90 transition-opacity">Войти</button>
          {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
          <p className="text-cream/40 text-xs mt-6 leading-relaxed">Первый вход: пароль 89322663995 (затем можно сменить внутри)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-graphite text-cream pb-20">
      <header className="sticky top-0 z-50 glass-bar">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-amber text-xs tracking-[0.3em] uppercase">Админка</span>
            <span className="text-cream/40 text-xs">История Вкуса</span>
          </div>
          <a href="#/" className="text-xs text-cream/60 hover:text-cream">← На сайт</a>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 pt-10">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">Новости</h2>
            <button onClick={addNews} className="px-4 py-2 text-xs uppercase tracking-wider bg-amber text-night rounded-full hover:opacity-90">+ Добавить</button>
          </div>
          <p className="text-cream/50 text-sm mb-6">Редактируй карточки. Порядок = сверху вниз на сайте.</p>
          <div className="space-y-4">
            {news.map((n, i) => (
              <div key={n.id} className="border border-cream/15 rounded-xl p-5 bg-cream/5">
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  <input value={n.date} onChange={(e) => upd(i, { date: e.target.value })} placeholder="Дата" className="bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm" />
                  <input value={n.tag} onChange={(e) => upd(i, { tag: e.target.value })} placeholder="Тег (Меню/Праздник/Анонс)" className="bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm" />
                </div>
                <input value={n.title} onChange={(e) => upd(i, { title: e.target.value })} placeholder="Заголовок" className="w-full bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-base mb-3 font-medium" />
                <textarea value={n.text} onChange={(e) => upd(i, { text: e.target.value })} placeholder="Текст новости" rows={3} className="w-full bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm resize-y" />
                <div className="flex justify-end mt-3">
                  <button onClick={() => del(i)} className="text-xs text-red-400 hover:text-red-300 uppercase tracking-wider">Удалить</button>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-cream/40 text-center py-10">Новостей нет. Нажми «+ Добавить».</p>}
          </div>
        </section>

        <section className="border-t border-cream/10 pt-10">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Публикация</h2>
          <p className="text-cream/50 text-sm mb-4">Нажми «Опубликовать» — админка сделает коммит в GitHub, Vercel задеплоит за ~1 минуту.</p>
          <button onClick={publish} disabled={busy} className="px-8 py-4 bg-amber text-night font-medium rounded-full hover:opacity-90 disabled:opacity-50 text-sm uppercase tracking-wider">
            {busy ? 'Отправляем...' : 'Опубликовать на сайт'}
          </button>
          {msg && <p className="mt-4 text-sm" style={{ color: msg.startsWith('✓') ? '#8fd19e' : msg.includes('Ошибка') || msg.includes('Сеть') || msg.includes('Сначала') ? '#f87171' : '#fbbf24' }}>{msg}</p>}
        </section>

        <section className="border-t border-cream/10 pt-10 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-3">GitHub-токен</h3>
            <p className="text-cream/50 text-xs mb-3 leading-relaxed">Нужен только для публикации. Вводится один раз, хранится в твоём браузере.</p>
            {token ? (
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-xs">✓ Токен сохранён</span>
                <button onClick={() => { localStorage.removeItem(LS_TOKEN); setToken(''); }} className="text-xs text-cream/50 hover:text-cream underline">Сбросить</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="ghp_..." className="flex-1 bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm" />
                <button onClick={saveToken} className="px-4 py-2 bg-cream/10 rounded-lg text-xs">Сохранить</button>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Смена пароля</h3>
            <p className="text-cream/50 text-xs mb-3 leading-relaxed">Пароль хранится в твоём браузере. На других устройствах нужен будет новый пароль.</p>
            <div className="space-y-2">
              <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} placeholder="Новый пароль (мин. 6)" className="w-full bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm" />
              <input type="password" value={newPwd2} onChange={(e) => setNewPwd2(e.target.value)} placeholder="Повтори пароль" className="w-full bg-cream/5 border border-cream/15 rounded-lg px-3 py-2 text-sm" />
              <button onClick={changePwd} className="px-4 py-2 bg-cream/10 rounded-lg text-xs">Сменить</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
