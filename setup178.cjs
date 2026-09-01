const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) FileField: передаёт файл =================
fs.writeFileSync(P('src/components/FileField.tsx'), `interface Props {
  label: string;
  accept: string;
  required?: boolean;
  fileName: string;
  onFile: (name: string, file?: File) => void;
  hint?: string;
}
export default function FileField({ label, accept, required, fileName, onFile, hint }: Props) {
  return (
    <label className="block cursor-pointer">
      <span className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">
        {label}{required ? ' *' : ''}
      </span>
      <span className="flex items-center gap-3 border border-dashed border-graphite/40 px-4 py-3.5 hover:border-terra transition-colors bg-white/40">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-terra flex-none">
          <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
        <span className={'text-sm truncate ' + (fileName ? 'text-graphite' : 'text-muted')}>
          {fileName || (hint ? hint : 'Нажмите, чтобы прикрепить файл')}
        </span>
        <input
          type="file"
          accept={accept}
          required={required}
          className="hidden"
          onChange={(e) => { const f = e.target.files && e.target.files[0]; onFile(f ? f.name : '', f || undefined); }}
        />
      </span>
    </label>
  );
}
`, 'utf-8');
console.log('✓ FileField: передаёт файл');

// ================= 2) BookingModal: ресторан сам =================
fs.writeFileSync(P('src/components/BookingModal.tsx'), `import { useState, useEffect } from 'react';
import { BookingForm } from '../types';
const REST_NAMES: Record<string, string> = { kinza: 'Кинза', nino: 'Нино', astoria: 'Астория', 'la-costa': 'Ла Коста Берег' };
interface Props { isOpen: boolean; onClose: () => void; }
export default function BookingModal({ isOpen, onClose }: Props) {
  const [form, setForm] = useState<BookingForm>({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', data: { ...form, restaurant: REST_NAMES[(window.location.pathname.split('/')[1] || '')] || '' }, honeypot: '' }),
      });
    } catch (e) { }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setForm({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
    }, 3000);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-14">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors z-10" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Бронирование</p>
        <h2 className="font-serif text-4xl lg:text-5xl font-medium text-graphite mb-3 leading-tight">Забронировать стол</h2>
        <p className="text-muted font-light mb-10">Мы свяжемся с вами для подтверждения</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Имя</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Телефон</label>
              <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+7 (___) ___-__-__" className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Дата</label>
              <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} min={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Время</label>
              <input type="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite" />
            </div>
            <div>
              <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Гостей</label>
              <select value={form.guests} onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })} className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
                ))}
                <option value={0}>Больше 10</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted uppercase tracking-[0.2em] mb-2 block">Комментарий</label>
            <textarea rows={3} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Пожелания, повод, особенности..." className="w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite resize-none" />
          </div>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-8">
            {submitted ? '✓ Заявка принята!' : 'Забронировать'}
          </button>
          <p className="text-xs text-muted text-center mt-4">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
        </form>
      </div>
    </div>
  );
}
`, 'utf-8');
console.log('✓ BookingModal: ресторан определяется сам');

// ================= 3) api/apply.ts: 4 типа + файлы в MAX =================
fs.writeFileSync(P('api/apply.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };

const rateMap = new Map<string, { count: number; reset: number }>();
const checkRate = (ip: string) => {
  const now = Date.now();
  const e = rateMap.get(ip);
  if (!e || now > e.reset) { rateMap.set(ip, { count: 1, reset: now + 60000 }); return true; }
  if (e.count >= 5) return false;
  e.count++;
  return true;
};

async function maxUpload(base64: string, name: string, log?: any): Promise<any | null> {
  try {
    const ext = (name.split('.').pop() || '').toLowerCase();
    const type = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'photo' : 'file';
    const r1 = await fetch(B + '/uploads', { method: 'POST', headers: H, body: JSON.stringify({ type }) });
    const j1: any = await r1.json().catch(() => null);
    if (log) log.up1 = { status: r1.status, body: j1 };
    if (!r1.ok || !j1 || !j1.url) return null;
    const buf = Buffer.from(base64, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'application/octet-stream' }), name);
    const r2 = await fetch(j1.url, { method: 'POST', body: fd });
    if (log) log.up2 = { status: r2.status };
    if (!r2.ok) return null;
    return { type, payload: { token: j1.token } };
  } catch (e: any) {
    if (log) log.err = e.message;
    return null;
  }
}

const L = (lines: string[]) => lines.join('\\n');
const fmtBooking = (d: any) => L(['🔴 *БРОНЬ*', '*Ресторан:* ' + (d.restaurant || '—'), '*Имя:* ' + d.name, '*Телефон:* ' + d.phone, '*Дата:* ' + d.date + ' в ' + d.time, '*Гостей:* ' + (d.guests || '—'), '*Комментарий:* ' + (d.comment || '—')]);
const fmtVacancy = (d: any) => L(['👔 *ВАКАНСИЯ*', '*Должность:* ' + d.position, '*Заведение:* ' + (d.place || 'Любой'), '*ФИО:* ' + d.name, '*Телефон:* ' + d.phone, '*Email:* ' + (d.email || '—'), '*Опыт:* ' + (d.experience || '—'), '*Занятость:* ' + (d.employment || '—'), '*Медкнижка:* ' + (d.medbook || '—'), '*Приступить:* ' + (d.start || '—'), '*О себе:* ' + (d.about || '—')]);
const fmtPartner = (d: any) => L(['🤝 *ПАРТНЁР*', '*Компания:* ' + d.company, '*Контакт:* ' + d.person, '*Телефон:* ' + d.phone, '*Email:* ' + (d.email || '—'), '*Категория:* ' + d.category, '*Предложение:* ' + d.offer, '*Комментарий:* ' + (d.comment || '—')]);
const fmtEvent = (d: any) => L(['🎉 *МЕРОПРИЯТИЕ*', '*Формат:* ' + d.format, '*Имя:* ' + d.name, '*Телефон:* ' + d.phone, '*Дата/площадка:* ' + (d.date || '—'), '*Гостей:* ' + (d.guests || '—'), '*Пожелания:* ' + (d.wishes || '—')]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';
  if (!checkRate(ip)) return res.status(429).json({ error: 'rate_limit' });
  const body = req.body as any;
  if (!body || body.honeypot) return res.status(400).json({ error: 'spam' });
  const type = body.type;
  const data = body.data || {};
  if (!['booking', 'vacancy', 'partner', 'event'].includes(type)) return res.status(400).json({ error: 'bad_type' });
  let text = '';
  if (type === 'booking') text = fmtBooking(data);
  else if (type === 'vacancy') text = fmtVacancy(data);
  else if (type === 'partner') text = fmtPartner(data);
  else text = fmtEvent(data);
  const log: any = {};
  let att: any = null;
  if (data.file && data.file.base64) att = await maxUpload(data.file.base64, data.file.name || 'file', log);
  if (data.file && data.file.name && !att) text += '\\n📎 Файл: ' + data.file.name;
  try {
    const payload: any = { text };
    if (att) payload.attachments = [att];
    const r = await fetch(B + '/messages?chat_id=' + CHAT_ID, { method: 'POST', headers: H, body: JSON.stringify(payload) });
    const j = await r.json().catch(() => null);
    if (!r.ok) return res.status(r.status).json({ error: 'max_api', detail: j });
    return res.status(200).json({ ok: true, file: att ? 'attached' : data.file ? 'name_only' : 'none', dbg: req.query.dbg === '1' ? log : undefined });
  } catch (e: any) {
    return res.status(500).json({ error: 'network', detail: e.message });
  }
}
`, 'utf-8');
console.log('✓ api/apply.ts: 4 типа заявок + файлы в MAX');

// ================= 4) max-test: тест загрузки файла =================
fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  const r1 = await fetch(B + '/uploads', { method: 'POST', headers: H, body: JSON.stringify({ type: 'photo' }) });
  const j1: any = await r1.json().catch(() => null);
  out.up1 = { status: r1.status, body: j1 };
  if (r1.ok && j1 && j1.url) {
    const buf = Buffer.from(TINY_PNG, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'image/png' }), 'test.png');
    const r2 = await fetch(j1.url, { method: 'POST', body: fd });
    out.up2 = { status: r2.status, body: await r2.text().catch(() => null) };
    const r3 = await fetch(B + '/messages?chat_id=' + CHAT_ID, { method: 'POST', headers: H, body: JSON.stringify({ text: '📎 Тест файла', attachments: [{ type: 'photo', payload: { token: j1.token } }] }) });
    out.send = { status: r3.status, body: await r3.json().catch(() => null) };
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: тест файла');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: файлы в чат, мероприятия, ресторан в брони"');
console.log('git pull --rebase');
console.log('git push');