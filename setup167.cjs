const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) api/apply.ts =================
fs.writeFileSync(P('api/apply.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOLJDj0bayibcL31_kyOP3-6s84NVL_lrUfuh3fqD15G-lRNnRzdv3IcbTNPNx5dQ-8_FbjtQ1mi';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';

const rateMap = new Map<string, { count: number; reset: number }>();
const checkRate = (ip: string) => {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + 60000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
};

const fmtBooking = (d: any) => \`🔴 *БРОНЬ*
*Ресторан:* \${d.restaurant || '—'}
*Имя:* \${d.name}
*Телефон:* \${d.phone}
*Дата:* \${d.date} в \${d.time}
*Гостей:* \${d.guests || '—'}
*Комментарий:* \${d.comment || '—'}\`;

const fmtVacancy = (d: any) => \`👔 *ВАКАНСИЯ*
*Должность:* \${d.position}
*Заведение:* \${d.place || 'Любой'}
*ФИО:* \${d.name}
*Телефон:* \${d.phone}
*Email:* \${d.email || '—'}
*Опыт:* \${d.experience || '—'}
*Занятость:* \${d.employment || '—'}
*Медкнижка:* \${d.medbook || '—'}
*Приступить:* \${d.start || '—'}
*О себе:* \${d.about || '—'}\`;

const fmtPartner = (d: any) => \`🤝 *ПАРТНЁР*
*Компания:* \${d.company}
*Контакт:* \${d.person}
*Телефон:* \${d.phone}
*Email:* \${d.email || '—'}
*Категория:* \${d.category}
*Предложение:* \${d.offer}
*Комментарий:* \${d.comment || '—'}\`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  if (!checkRate(ip)) return res.status(429).json({ error: 'rate_limit' });
  const body = req.body as any;
  if (!body || body.honeypot) return res.status(400).json({ error: 'spam' });
  const type = body.type;
  const data = body.data || {};
  if (!['booking', 'vacancy', 'partner'].includes(type)) return res.status(400).json({ error: 'bad_type' });
  let text = '';
  if (type === 'booking') text = fmtBooking(data);
  else if (type === 'vacancy') text = fmtVacancy(data);
  else if (type === 'partner') text = fmtPartner(data);
  try {
    const r = await fetch(B + '/messages', {
      method: 'POST',
      headers: { Authorization: TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok) return res.status(r.status).json({ error: 'max_api', detail: j });
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ error: 'network', detail: e.message });
  }
}
`, 'utf-8');
console.log('✓ api/apply.ts: endpoint для заявок');

// ================= 2) BookingModal: fetch на /api/apply =================
let bm = fs.readFileSync(P('src/components/BookingModal.tsx'), 'utf-8');
const bm0 = bm;
const oldSubmit = `const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setForm({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
    }, 3000);
  };`;
const newSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'booking', data: form, honeypot: '' }),
      });
    } catch (e) { }
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      setForm({ name: '', phone: '', date: '', time: '', guests: 2, comment: '' });
    }, 3000);
  };`;
bm = bm.split(oldSubmit).join(newSubmit);
if (bm !== bm0) { fs.writeFileSync(P('src/components/BookingModal.tsx'), bm, 'utf-8'); console.log('✓ BookingModal: подключён к /api/apply'); }

// ================= 3) VacancyModal: fetch на /api/apply =================
let vm = fs.readFileSync(P('src/components/VacancyModal.tsx'), 'utf-8');
const vm0 = vm;
const oldVacSubmit = `const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };`;
const newVacSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'vacancy', data: form, honeypot: '' }),
      });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };`;
vm = vm.split(oldVacSubmit).join(newVacSubmit);
if (vm !== vm0) { fs.writeFileSync(P('src/components/VacancyModal.tsx'), vm, 'utf-8'); console.log('✓ VacancyModal: подключён к /api/apply'); }

// ================= 4) PartnerModal: fetch на /api/apply =================
let pm = fs.readFileSync(P('src/components/PartnerModal.tsx'), 'utf-8');
const pm0 = pm;
const oldPartSubmit = `const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };`;
const newPartSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'partner', data: form, honeypot: '' }),
      });
    } catch (e) { }
    setTimeout(() => { setSubmitted(false); onClose(); }, 3000);
  };`;
pm = pm.split(oldPartSubmit).join(newPartSubmit);
if (pm !== pm0) { fs.writeFileSync(P('src/components/PartnerModal.tsx'), pm, 'utf-8'); console.log('✓ PartnerModal: подключён к /api/apply'); }

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX-бот: заявки из форм сайта"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 После деплоя открой сайт → забронируй стол (тестовые данные)');
console.log('и проверь чат "ИВ - заявки с сайта" в MAX — должна прийти карточка!');