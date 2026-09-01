const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) api/apply.ts: авто-подбор type + всё остальное =================
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
    const isImg = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(ext);
    const types = isImg ? ['image', 'photo', 'file'] : ['file', 'image'];
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
    if (log) log.up2 = { status: r2.status };
    if (!r2.ok) return null;
    return { type: used, payload: { token: j1.token } };
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
  if (data.file && data.file.name && !att) text += '\\n📎 Файл: ' + data.file.name + ' (не прикрепился)';
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
console.log('✓ api/apply.ts: авто-подбор type');

// ================= 2) max-test: перебор типов =================
fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };
const TINY_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  let j1: any = null;
  let used = '';
  for (const t of ['image', 'photo', 'file', 'video', 'audio']) {
    const r1 = await fetch(B + '/uploads?type=' + t, { method: 'POST', headers: H });
    const j = await r1.json().catch(() => null);
    out['up1_' + t] = { status: r1.status, body: j };
    if (r1.ok && j && j.url) { j1 = j; used = t; break; }
  }
  out.used = used;
  if (j1) {
    const buf = Buffer.from(TINY_PNG, 'base64');
    const fd = new FormData();
    fd.append('file', new Blob([buf], { type: 'image/png' }), 'test.png');
    const r2 = await fetch(j1.url, { method: 'POST', body: fd });
    out.up2 = { status: r2.status, body: await r2.text().catch(() => null) };
    const r3 = await fetch(B + '/messages?chat_id=' + CHAT_ID, { method: 'POST', headers: H, body: JSON.stringify({ text: '📎 Тест файла', attachments: [{ type: used, payload: { token: j1.token } }] }) });
    out.send = { status: r3.status, body: await r3.json().catch(() => null) };
  }
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: перебор типов');

// ================= 3) Модалки: лимит 3 МБ с предупреждением =================
['src/components/VacancyModal.tsx', 'src/components/PartnerModal.tsx', 'src/components/EventModal.tsx'].forEach((f) => {
  let s = fs.readFileSync(P(f), 'utf-8');
  const s0 = s;
  s = s.split("const [fileName, setFileName] = useState('');")
    .join("const [fileName, setFileName] = useState('');\n  const [fileWarn, setFileWarn] = useState('');");
  s = s.split("onFile={(n, f) => { setFileName(n); setFileObj(f || null); }}")
    .join("onFile={(n, f) => { setFileName(n); setFileObj(f || null); setFileWarn(f && f.size > 3 * 1024 * 1024 ? 'Файл больше 3 МБ — он не прикрепится к заявке' : ''); }}");
  s = s.split("<label className=\"flex items-start gap-3 text-xs text-muted cursor-pointer\">")
    .join("{fileWarn && <p className=\"text-red-500 text-xs\">{fileWarn}</p>}\n          <label className=\"flex items-start gap-3 text-xs text-muted cursor-pointer\">");
  s = s.split('Фото или резюме (необязательно)').join('Фото или резюме (необязательно, до 3 МБ)');
  s = s.split('Готовая анкета, резюме или фото').join('Готовая анкета, резюме или фото (до 3 МБ)');
  s = s.split('Прайс или презентация (PDF, Excel)').join('Прайс или презентация (PDF, Excel, до 3 МБ)');
  s = s.split('Фото и примеры (как вы хотите видеть)').join('Фото и примеры (как вы хотите видеть, до 3 МБ)');
  if (s !== s0) { fs.writeFileSync(P(f), s, 'utf-8'); console.log('✓ ' + f + ': лимит 3 МБ с предупреждением'); }
  else console.log('⚠ ' + f + ': якоря не найдены');
});

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: авто-подбор type + лимит 3 МБ"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 1) Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 → пришли JSON');
console.log('2) Тест: вакансия с фото 100 КБ → файл в чате; фото 10 МБ → красное предупреждение');