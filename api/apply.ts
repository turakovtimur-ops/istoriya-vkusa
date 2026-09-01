import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
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

const fmtBooking = (d: any) => `🔴 *БРОНЬ*
*Ресторан:* ${d.restaurant || '—'}
*Имя:* ${d.name}
*Телефон:* ${d.phone}
*Дата:* ${d.date} в ${d.time}
*Гостей:* ${d.guests || '—'}
*Комментарий:* ${d.comment || '—'}`;

const fmtVacancy = (d: any) => `👔 *ВАКАНСИЯ*
*Должность:* ${d.position}
*Заведение:* ${d.place || 'Любой'}
*ФИО:* ${d.name}
*Телефон:* ${d.phone}
*Email:* ${d.email || '—'}
*Опыт:* ${d.experience || '—'}
*Занятость:* ${d.employment || '—'}
*Медкнижка:* ${d.medbook || '—'}
*Приступить:* ${d.start || '—'}
*О себе:* ${d.about || '—'}`;

const fmtPartner = (d: any) => `🤝 *ПАРТНЁР*
*Компания:* ${d.company}
*Контакт:* ${d.person}
*Телефон:* ${d.phone}
*Email:* ${d.email || '—'}
*Категория:* ${d.category}
*Предложение:* ${d.offer}
*Комментарий:* ${d.comment || '—'}`;

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
