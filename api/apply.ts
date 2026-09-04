import type { VercelRequest, VercelResponse } from '@vercel/node';
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
    const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(ext);
    const types = isImg ? ['image', 'file'] : ['file', 'image'];
    let j1: any = null;
    let used = '';
    for (const t of types) {
      const r1 = await fetch(B + '/uploads?type=' + t, { method: 'POST', headers: H });
      const j = await r1.json().catch(() => null);
      if (log) log['up1_' + t] = { status: r1.status, body: j };
      if (r1.ok && j && j.url) { j1 = j; used = t; break; }
    }
    if (!j1) return null;
    const buf = Buffer.from(base64, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'application/octet-stream' }), name);
    const r2 = await fetch(j1.url, { method: 'POST', body: fd });
    const j2: any = await r2.json().catch(() => null);
    if (log) log.up2 = { status: r2.status, body: j2 };
    if (!r2.ok || !j2) return null;
    let token = '';
    const bag = j2.photos || j2.files || j2.videos || j2.audios || null;
    if (bag) { const k = Object.keys(bag)[0]; if (k && bag[k] && bag[k].token) token = bag[k].token; }
    if (!token && typeof j2.token === 'string') token = j2.token;
    if (!token) return null;
    return { type: used, payload: { token } };
  } catch (e: any) {
    if (log) log.err = e.message;
    return null;
  }
}

async function maxSend(text: string, attachments: any[] | null) {
  const payload: any = { text };
  if (attachments && attachments.length) payload.attachments = attachments;
  const r = await fetch(B + '/messages?chat_id=' + CHAT_ID, { method: 'POST', headers: H, body: JSON.stringify(payload) });
  const j = await r.json().catch(() => null);
  return { ok: r.ok, status: r.status, j };
}

const L = (lines: string[]) => lines.join('\n');
const fmtDate = (s: string) => { const p = (s || '').split('-'); return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : (s || '—'); };
const fmtBooking = (d: any) => L(['🔴 БРОНЬ', 'Ресторан: ' + (d.restaurant || '—'), 'Имя: ' + d.name, 'Телефон: ' + d.phone, 'Дата: ' + fmtDate(d.date) + ' в ' + d.time, 'Гостей: ' + (d.guests || '—'), 'Комментарий: ' + (d.comment || '—')]);
const fmtVacancy = (d: any) => L(['👔 ВАКАНСИЯ', 'Должность: ' + d.position, 'Заведение: ' + (d.place || 'Любой'), 'ФИО: ' + d.name, 'Телефон: ' + d.phone, 'Email: ' + (d.email || '—'), '🌍 Гражданство: ' + (d.citizenship || 'Российская Федерация'), ...(d.citizenship && d.citizenship !== 'Российская Федерация' ? ['📄 Патент: ' + (['Республика Белоруссия', 'Армения', 'Казахстан'].includes(d.citizenship) ? 'не требуется (ЕАЭС)' : (d.patent || '—'))] : []), 'Опыт: ' + (d.experience || '—'), ...(d.job1 ? ['💼 Последнее место: ' + d.job1] : []), ...(d.job2 ? ['💼 До этого: ' + d.job2] : []), 'Занятость: ' + (d.employment || '—'), 'Медкнижка: ' + (d.medbook || '—'), 'Приступить: ' + (d.start || '—'), 'О себе: ' + (d.about || '—')]);
const fmtPartner = (d: any) => L(['🤝 ПАРТНЁР', 'Компания: ' + d.company, 'Контакт: ' + d.person, 'Телефон: ' + d.phone, 'Email: ' + (d.email || '—'), 'Категория: ' + d.category, 'Предложение: ' + d.offer, 'Комментарий: ' + (d.comment || '—')]);
const fmtEvent = (d: any) => L(['🎉 МЕРОПРИЯТИЕ', 'Формат: ' + d.format, 'Имя: ' + d.name, 'Телефон: ' + d.phone, 'Дата/площадка: ' + (d.date || '—'), 'Гостей: ' + (d.guests || '—'), 'Пожелания: ' + (d.wishes || '—')]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' });
  const ip = (req.headers['x-forwarded-for'] as string) || 'unknown';
  if (!checkRate(ip)) return res.status(429).json({ error: 'rate_limit' });
  const body = req.body as any;
  if (!body || body.honeypot) return res.status(400).json({ error: 'spam' });
  const type = body.type;
  const data = body.data || {};
  if (data.file && data.file.base64 && String(data.file.base64).length > 4200000) data.file = { name: data.file.name };
  if (!['booking', 'vacancy', 'partner', 'event'].includes(type)) return res.status(400).json({ error: 'bad_type' });
  let text = '';
  if (type === 'booking') text = fmtBooking(data);
  else if (type === 'vacancy') text = fmtVacancy(data);
  else if (type === 'partner') text = fmtPartner(data);
  else text = fmtEvent(data);
  const log: any = {};
  let att: any = null;
  if (data.file && data.file.base64) {
    for (let attempt = 0; attempt < 2 && !att; attempt++) att = await maxUpload(data.file.base64, data.file.name || 'file', log);
  }
  let sent = false;
  if (att) {
    for (let attempt = 0; attempt < 2 && !sent; attempt++) {
      const r = await maxSend(text, [att]);
      if (log) log['send_att_' + attempt] = r.status;
      if (r.ok) sent = true;
    }
  }
  if (!sent) {
    const t2 = text + (data.file && data.file.name ? '\n📎 Файл: ' + data.file.name : '');
    const r = await maxSend(t2, null);
    if (log) log.send_text = r.status;
    if (!r.ok) return res.status(r.status).json({ error: 'max_api', detail: r.j });
  }
  return res.status(200).json({ ok: true, file: att ? 'attached' : data.file ? 'name_only' : 'none', dbg: req.query.dbg === '1' ? log : undefined });
}
