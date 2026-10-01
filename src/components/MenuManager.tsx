import { useState } from 'react';
import { restaurants } from '../data/holding';

const OWNER = 'turakovtimur-ops';
const REPO = 'istoriya-vkusa';
const TYPES = [
  { key: 'kuhnya', label: 'Кухня' },
  { key: 'bar',    label: 'Бар' },
  { key: 'deserty',label: 'Десерты' },
];
const MAX_MB = 30;

const fileToB64 = (f: File) => new Promise<string>((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = rej;
  r.readAsDataURL(f);
});

const todayTag = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
};

export default function MenuManager({ token }: { token: string }) {
  const [busy, setBusy] = useState<{[k:string]: boolean}>({});
  const [msg, setMsg] = useState('');

  const publish = async (message: string, changes: any[]) => {
    const r = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-gh-token': token },
      body: JSON.stringify({ message, changes })
    });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  };

  const readPageText = async (): Promise<string | null> => {
    const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/src/sites/RestaurantPage.tsx?ref=main`, {
      headers: { Authorization: 'token ' + token, Accept: 'application/vnd.github.raw' }
    });
    return r.ok ? await r.text() : null;
  };

  const bumpVersion = (text: string, restId: string, type: string): string => {
    const tag = todayTag();
    const re = new RegExp(`(${restId}-${type}\\.pdf)(?:\\?v=[^"'\`]+)?`, 'g');
    return text.replace(re, `$1?v=${tag}`);
  };

  const doAction = async (restId: string, type: string, action: 'upload' | 'delete', file?: File) => {
    const k = `${restId}-${type}`;
    setBusy(s => ({...s, [k]: true})); setMsg('');
    try {
      const changes: any[] = [];

      if (action === 'upload' && file) {
        const mb = file.size / 1024 / 1024;
        if (mb > MAX_MB) throw new Error(`Файл ${mb.toFixed(1)} МБ — сожмите в Preview до ≤ ${MAX_MB} МБ`);
        const base64 = await fileToB64(file);
        changes.push({ path: `public/menus/${restId}-${type}.pdf`, base64 });
      } else if (action === 'delete') {
        changes.push({ path: `public/menus/${restId}-${type}.pdf`, del: true });
      }

      const pageText = await readPageText();
      if (pageText) {
        const updated = bumpVersion(pageText, restId, type);
        if (updated !== pageText) {
          changes.push({ path: 'src/sites/RestaurantPage.tsx', text: updated });
        }
      }

      if (!changes.length) throw new Error('нечего коммитить');

      const msgText = `menu: ${restId} ${type} — ${action === 'upload' ? 'загрузка' : 'удаление'}`;
      await publish(msgText, changes);
      setMsg(`✓ ${msgText} — на сайте через ≤60 сек (деплой)`);
    } catch (e: any) {
      setMsg(`✗ ${e.message}`);
    } finally {
      setBusy(s => ({...s, [k]: false}));
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-cream/70">
        Загрузка/удаление PDF-меню. Файл уходит в GitHub → VPS подхватит ≤60 сек. Ссылки автоматически получают свежий <code>?v=</code>.
      </div>
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
                  const k = `${r.id}-${t.key}`;
                  return (
                    <td key={t.key} className="py-3 px-2">
                      <div className="flex gap-2 items-center flex-wrap">
                        <label className={`px-3 py-1.5 rounded-lg bg-amber/90 text-night text-xs cursor-pointer hover:bg-amber ${busy[k] ? 'opacity-50 pointer-events-none' : ''}`}>
                          {busy[k] ? '…' : 'Загрузить'}
                          <input type="file" accept="application/pdf" className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f) doAction(r.id, t.key, 'upload', f);
                              e.target.value = '';
                            }} />
                        </label>
                        <button
                          onClick={() => confirm(`Удалить ${t.label} у ${r.name}?`) && doAction(r.id, t.key, 'delete')}
                          className="px-3 py-1.5 rounded-lg bg-red-500/80 text-white text-xs hover:bg-red-500">
                          Удалить
                        </button>
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
