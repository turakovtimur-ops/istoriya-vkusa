import { useState } from 'react';
import { restaurants } from '../data/holding';

const OWNER = 'turakovtimur-ops';
const REPO = 'istoriya-vkusa';
const PAGE = 'src/sites/RestaurantPage.tsx';
const TYPES = [
  { key: 'kuhnya', label: 'Кухня' },
  { key: 'bar', label: 'Бар' },
  { key: 'deserty', label: 'Десерты' },
];
const MAX_MB = 25;

const fileToB64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = rej;
  r.readAsDataURL(f);
});
const todayTag = () => { const d = new Date(); return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`; };
const utf8b64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

export default function MenuManager({ token }: { token: string }) {
  const [busy, setBusy] = useState<{ [k: string]: boolean }>({});
  const [msg, setMsg] = useState('');

  const gh = (p: string, method = 'GET', body?: any, accept = 'application/vnd.github+json') =>
    fetch('https://api.github.com/repos/' + OWNER + '/' + REPO + p, {
      method,
      headers: { Authorization: 'token ' + token, Accept: accept, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
  const shaOf = async (path: string) => { const r = await gh('/contents/' + path); return r.ok ? (await r.json()).sha as string : undefined; };

  const doAction = async (restId: string, type: string, action: 'upload' | 'delete', file?: File) => {
    const k = restId + '-' + type;
    setBusy(s => ({ ...s, [k]: true })); setMsg('');
    try {
      if (!token) throw new Error('Сначала сохрани GitHub-токен во вкладке «Настройки»');
      const pdfPath = `public/menus/${restId}-${type}.pdf`;
      const sha = await shaOf(pdfPath);
      if (action === 'delete') {
        if (!sha) throw new Error('файл уже отсутствует');
        const r = await gh('/contents/' + pdfPath, 'DELETE', { message: `menu: ${restId} ${type} — удаление`, branch: 'main', sha });
        if (!r.ok) throw new Error('GitHub: ' + r.status + ' ' + (await r.text()));
      } else {
        if (!file) throw new Error('нет файла');
        const mb = file.size / 1024 / 1024;
        if (mb > MAX_MB) throw new Error(`Файл ${mb.toFixed(1)} МБ — сожмите в Preview до ≤ ${MAX_MB} МБ`);
        const body: any = { message: `menu: ${restId} ${type} — загрузка`, content: await fileToB64(file), branch: 'main' };
        if (sha) body.sha = sha;
        const r = await gh('/contents/' + pdfPath, 'PUT', body);
        if (!r.ok) throw new Error('GitHub: ' + r.status + ' ' + (await r.text()));
      }
      const rr = await gh('/contents/' + PAGE + '?ref=main', 'GET', undefined, 'application/vnd.github.raw');
      const text = rr.ok ? await rr.text() : null;
      if (text) {
        const tag = todayTag();
        const updated = text.replace(new RegExp(`(${restId}-${type}\\.pdf)(?:\\?v=[^'"\`]+)?`, 'g'), `$1?v=${tag}`);
        if (updated !== text) {
          const psha = await shaOf(PAGE);
          const r2 = await gh('/contents/' + PAGE, 'PUT', { message: `menu: ${restId} ${type} — сброс кэша ?v=${tag}`, content: utf8b64(updated), branch: 'main', sha: psha });
          if (!r2.ok) throw new Error('GitHub page: ' + r2.status);
        }
      }
      setMsg(`✓ ${restId} ${type}: ${action === 'upload' ? 'загружено' : 'удалено'} — на сайте через ≤60 сек`);
    } catch (e: any) {
      setMsg(`✗ ${e.message}`);
    } finally {
      setBusy(s => ({ ...s, [k]: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-cream/70">Загрузка/удаление PDF-меню: файл уходит коммитом в GitHub → VPS подхватит ≤60 сек. Ссылки сами получают свежий ?v=.</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-cream/60 text-xs uppercase">
              <th className="py-2">Ресторан</th>
              {TYPES.map(t => <th key={t.key} className="py-2 px-2">{t.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {restaurants.map(r => (
              <tr key={r.id} className="border-t border-cream/10">
                <td className="py-3 font-medium">{r.name}</td>
                {TYPES.map(t => {
                  const k = r.id + '-' + t.key;
                  return (
                    <td key={t.key} className="py-3 px-2">
                      <div className="flex gap-2 items-center flex-wrap">
                        <label className={`px-3 py-1.5 rounded-lg bg-amber/90 text-night text-xs cursor-pointer hover:bg-amber ${busy[k] ? 'opacity-50 pointer-events-none' : ''}`}>
                          {busy[k] ? '…' : 'Загрузить'}
                          <input type="file" accept="application/pdf" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) doAction(r.id, t.key, 'upload', f); e.target.value = ''; }} />
                        </label>
                        <button onClick={() => confirm(`Удалить ${t.label} у ${r.name}?`) && doAction(r.id, t.key, 'delete')} className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500">Удалить</button>
                        <a href={`/menus/${r.id}-${t.key}.pdf`} target="_blank" className="text-cream/50 text-xs underline">pdf</a>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {msg && <div className="text-sm text-amber">{msg}</div>}
    </div>
  );
}
