const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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

// ================= 2) api/apply.ts: заявки + файлы напрямую в MAX =================
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

// ================= 3) max-test: тест загрузки файла =================
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

// ================= 4) Модалки: CSS + отправка + файлы =================
const modalShell = (inner: string) => inner;

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

const fileHelper = `const [fileObj, setFileObj] = useState<File | null>(null);
  const toB64 = (f: File) => new Promise<string>((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(f); });`;

fs.writeFileSync(P('src/components/VacancyModal.tsx'), `import { useEffect, useState } from 'react';
import { restaurants, vacancies } from '../data/holding';
import FileField from './FileField';
interface Props { vacancy: string | null; onClose: () => void; }
const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';
export default function VacancyModal({ vacancy, onClose }: Props) {
  const [mode, setMode] = useState<'form' | 'file'>('form');
  const [form, setForm] = useState({ name: '', phone: '', email: '', position: '', place: 'Любой', experience: 'Не требуется', employment: 'Полная занятость', medbook: 'Нет', start: '', about: '' });
  const [fileName, setFileName] = useState('');
  ${fileHelper}
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (vacancy) { setForm((f) => ({ ...f, position: vacancy })); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [vacancy]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let file;
    if (fileObj && fileObj.size <= 3 * 1024 * 1024) file = { name: fileObj.name, base64: await toB64(fileObj) };
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'vacancy', data: { ...form, file }, honeypot: '' }) });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };
  if (!vacancy) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors z-10" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Анкета соискателя</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-6 leading-tight">Присоединяйтесь к команде</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          <button type="button" onClick={() => setMode('form')} className={'px-5 py-4 border text-left text-sm transition-all ' + (mode === 'form' ? 'border-terra bg-terra/10 text-graphite font-medium' : 'border-graphite/20 text-muted hover:border-graphite/50')}>✍️ Заполнить анкету<span className="block text-xs font-light mt-1 opacity-70">10 коротких вопросов</span></button>
          <button type="button" onClick={() => setMode('file')} className={'px-5 py-4 border text-left text-sm transition-all ' + (mode === 'file' ? 'border-terra bg-terra/10 text-graphite font-medium' : 'border-graphite/20 text-muted hover:border-graphite/50')}>📎 Приложить готовую анкету<span className="block text-xs font-light mt-1 opacity-70">Фото, резюме или файл анкеты</span></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>ФИО *</label><input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Телефон *</label><input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Должность *</label><select required value={form.position} onChange={(e) => set('position', e.target.value)} className={inputCls}>{vacancies.map((v) => (<option key={v} value={v}>{v}</option>))}</select></div>
            <div><label className={labelCls}>Заведение</label><select value={form.place} onChange={(e) => set('place', e.target.value)} className={inputCls}><option>Любой</option>{restaurants.map((r) => (<option key={r.id}>{r.name}</option>))}<option>Природа (загородный комплекс)</option></select></div>
          </div>
          {mode === 'form' ? (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} /></div>
                <div><label className={labelCls}>Опыт работы</label><select value={form.experience} onChange={(e) => set('experience', e.target.value)} className={inputCls}><option>Не требуется</option><option>До 1 года</option><option>1–3 года</option><option>Более 3 лет</option></select></div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div><label className={labelCls}>Занятость</label><select value={form.employment} onChange={(e) => set('employment', e.target.value)} className={inputCls}><option>Полная занятость</option><option>Частичная занятость</option><option>Сменный график</option><option>Подработка</option></select></div>
                <div><label className={labelCls}>Медкнижка</label><select value={form.medbook} onChange={(e) => set('medbook', e.target.value)} className={inputCls}><option>Нет</option><option>Есть</option><option>В процессе оформления</option></select></div>
              </div>
              <div><label className={labelCls}>Когда готовы приступить</label><input type="text" value={form.start} onChange={(e) => set('start', e.target.value)} placeholder="Например: с 1 числа следующего месяца" className={inputCls} /></div>
              <div><label className={labelCls}>О себе</label><textarea rows={3} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Пара слов о себе и почему вам у нас понравится" className={inputCls + ' resize-none'} /></div>
              <FileField label="Фото или резюме (необязательно)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.heic" fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); }} />
            </>
          ) : (
            <>
              <FileField label="Готовая анкета, резюме или фото" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.heic" required fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); }} hint="Прикрепите файл — и мы сами всё прочитаем" />
              <div><label className={labelCls}>Пара слов о себе</label><textarea rows={3} value={form.about} onChange={(e) => set('about', e.target.value)} placeholder="Кем работали, что умеете — одной строкой" className={inputCls + ' resize-none'} /></div>
            </>
          )}
          <label className="flex items-start gap-3 text-xs text-muted cursor-pointer"><input type="checkbox" required className="mt-0.5 accent-terra" />Согласен на обработку персональных данных</label>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">{submitted ? '✓ Анкета отправлена!' : 'Отправить'}</button>
        </form>
      </div>
    </div>
  );
}
`, 'utf-8');
console.log('✓ VacancyModal: файл летит в MAX');

fs.writeFileSync(P('src/components/PartnerModal.tsx'), `import { useEffect, useState } from 'react';
import FileField from './FileField';
interface Props { open: boolean; onClose: () => void; }
const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';
export default function PartnerModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ company: '', person: '', phone: '', email: '', category: 'Продукты и кухня', offer: '', comment: '' });
  const [fileName, setFileName] = useState('');
  ${fileHelper}
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let file;
    if (fileObj && fileObj.size <= 3 * 1024 * 1024) file = { name: fileObj.name, base64: await toB64(fileObj) };
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'partner', data: { ...form, file }, honeypot: '' }) });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Стать партнёром</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-3 leading-tight">Заявка на сотрудничество</h2>
        <p className="text-muted font-light mb-8">Размещение на площадке холдинга, реклама, бартер. Прикрепите прайс или презентацию — мы изучим и свяжемся.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Компания *</label><input type="text" required value={form.company} onChange={(e) => set('company', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Контактное лицо *</label><input type="text" required value={form.person} onChange={(e) => set('person', e.target.value)} className={inputCls} /></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Телефон *</label><input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Email</label><input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Категория</label><select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputCls}><option>Продукты и кухня</option><option>Напитки и бар</option><option>Оборудование и техника</option><option>Сервис и обслуживание</option><option>Другое</option></select></div>
          <div><label className={labelCls}>Что предлагаете *</label><textarea rows={3} required value={form.offer} onChange={(e) => set('offer', e.target.value)} placeholder="Коротко о продукте или услуге и условиях" className={inputCls + ' resize-none'} /></div>
          <FileField label="Прайс или презентация (PDF, Excel)" accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.ppt,.pptx" fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); }} />
          <label className="flex items-start gap-3 text-xs text-muted cursor-pointer"><input type="checkbox" required className="mt-0.5 accent-terra" />Согласен на обработку персональных данных</label>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">{submitted ? '✓ Заявка отправлена!' : 'Отправить заявку'}</button>
        </form>
      </div>
    </div>
  );
}
`, 'utf-8');
console.log('✓ PartnerModal: файл летит в MAX');

fs.writeFileSync(P('src/components/EventModal.tsx'), `import { useEffect, useState } from 'react';
import FileField from './FileField';
interface Props { open: boolean; format: string; onClose: () => void; }
const inputCls = 'w-full bg-transparent border-b border-graphite/30 py-3 focus:outline-none focus:border-terra transition-colors text-graphite';
const labelCls = 'text-xs text-muted uppercase tracking-[0.2em] mb-2 block';
export default function EventModal({ open, format, onClose }: Props) {
  const [form, setForm] = useState({ name: '', phone: '', format: '', date: '', guests: '', wishes: '' });
  const [fileName, setFileName] = useState('');
  ${fileHelper}
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (open) { setForm((f) => ({ ...f, format })); setFileName(''); setFileObj(null); setSubmitted(false); document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [open, format]);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    let file;
    if (fileObj && fileObj.size <= 3 * 1024 * 1024) file = { name: fileObj.name, base64: await toB64(fileObj) };
    try {
      await fetch('/api/apply', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'event', data: { ...form, file }, honeypot: '' }) });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm modal-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="modal-pop relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-cream p-8 lg:p-12">
        <button onClick={onClose} className="absolute top-6 right-6 text-graphite hover:text-terra transition-colors" aria-label="Закрыть">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" /></svg>
        </button>
        <p className="text-terra text-xs tracking-[0.3em] uppercase mb-4 font-medium">Мероприятия и кейтеринг</p>
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-graphite mb-3 leading-tight">Заявка: {form.format}</h2>
        <p className="text-muted font-light mb-8 text-sm">Расскажите о событии и прикрепите примеры — так мы предложим точнее.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Имя *</label><input type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputCls} /></div>
            <div><label className={labelCls}>Телефон *</label><input type="tel" required value={form.phone} onChange={(e) => set('phone', e.target.value)} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Формат</label><select value={form.format} onChange={(e) => set('format', e.target.value)} className={inputCls}><option>Выездной банкет</option><option>Кейтеринг</option><option>Праздники под ключ</option><option>Спонсорство и благотворительность</option><option>Другое</option></select></div>
          <div className="grid md:grid-cols-2 gap-5">
            <div><label className={labelCls}>Дата и площадка</label><input type="text" value={form.date} onChange={(e) => set('date', e.target.value)} placeholder="Например: 15 августа, пляж" className={inputCls} /></div>
            <div><label className={labelCls}>Количество гостей</label><input type="text" value={form.guests} onChange={(e) => set('guests', e.target.value)} placeholder="≈ 50" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Пожелания</label><textarea rows={3} value={form.wishes} onChange={(e) => set('wishes', e.target.value)} placeholder="Повод, стиль, любимые блюда гостей — всё, что важно" className={inputCls + ' resize-none'} /></div>
          <FileField label="Фото и примеры (как вы хотите видеть)" accept=".jpg,.jpeg,.png,.heic,.webp,.pdf" fileName={fileName} onFile={(n, f) => { setFileName(n); setFileObj(f || null); }} hint="Примеры сервировки, площадки, меню — всё подойдёт" />
          <label className="flex items-start gap-3 text-xs text-muted cursor-pointer"><input type="checkbox" required className="mt-0.5 accent-terra" />Согласен на обработку персональных данных</label>
          <button type="submit" disabled={submitted} className="btn-terra w-full mt-2">{submitted ? '✓ Заявка отправлена!' : 'Отправить заявку'}</button>
        </form>
      </div>
    </div>
  );
}
`, 'utf-8');
console.log('✓ EventModal: заявки с «Мероприятий» летят в MAX');

// ================= 5) Убираем api/upload.ts (не нужен) =================
if (fs.existsSync(P('api/upload.ts'))) { fs.unlinkSync(P('api/upload.ts')); console.log('✓ api/upload.ts удалён'); }

// ================= 6) framer-motion больше никто не использует? =================
const left = [];
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
  const p = path.join(dir, e.name);
  if (['node_modules', '.git', 'dist'].includes(e.name)) return;
  e.isDirectory() ? walk(p) : (p.endsWith('.tsx') || p.endsWith('.ts')) && left.push(p);
});
left.length = 0;
walk(P('src'));
const fm = left.filter((f) => fs.readFileSync(f, 'utf-8').includes('framer-motion'));
if (!fm.length) {
  try { execSync('npm uninstall framer-motion', { stdio: 'pipe' }); console.log('✓ framer-motion удалён из зависимостей'); } catch (e) { console.log('⚙ выполни: npm uninstall framer-motion'); }
} else console.log('⚠ framer-motion ещё где-то: ' + fm.join(', '));

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: файлы в чат, мероприятия, ресторан в брони"');
console.log('git pull --rebase');
console.log('git push');