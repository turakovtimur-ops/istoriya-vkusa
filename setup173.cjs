const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

fs.writeFileSync(P('api/max-test.ts'), `import type { VercelRequest, VercelResponse } from '@vercel/node';
const TOKEN = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';
const CHAT_ID = -78445984835780;
const B = 'https://botapi.max.ru';
const H = { Authorization: TOKEN, 'Content-Type': 'application/json' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.query.key !== 'iv2026') return res.status(403).json({ error: 'forbidden' });
  const out: any = {};
  
  // Гипотезы о правильных эндпоинтах
  const tries: [string, string, string, any][] = [
    // Варианты 1: /sendMessage
    ['sendMessage_num', 'POST', B + '/sendMessage', { chat_id: CHAT_ID, text: '✅ Тест!' }],
    ['sendMessage_recipient', 'POST', B + '/sendMessage', { recipient: { chat_id: CHAT_ID }, text: '✅ Тест!' }],
    
    // Варианты 2: /message (единственное число)
    ['message_num', 'POST', B + '/message', { chat_id: CHAT_ID, text: '✅ Тест!' }],
    ['message_recipient', 'POST', B + '/message', { recipient: { chat_id: CHAT_ID }, text: '✅ Тест!' }],
    
    // Варианты 3: /chats/{id}/send
    ['chats_send', 'POST', B + '/chats/' + CHAT_ID + '/send', { text: '✅ Тест!' }],
    ['chats_send_msg', 'POST', B + '/chats/' + CHAT_ID + '/send', { message: { text: '✅ Тест!' } }],
    
    // Варианты 4: /chat/{id}/message
    ['chat_msg', 'POST', B + '/chat/' + CHAT_ID + '/message', { text: '✅ Тест!' }],
    ['chat_msg_body', 'POST', B + '/chat/' + CHAT_ID + '/message', { body: { text: '✅ Тест!' } }],
    
    // Варианты 5: /send
    ['send_num', 'POST', B + '/send', { chat_id: CHAT_ID, text: '✅ Тест!' }],
    ['send_recipient', 'POST', B + '/send', { recipient: { chat_id: CHAT_ID }, text: '✅ Тест!' }],
    
    // Варианты 6: разные структуры payload
    ['msg_text_obj', 'POST', B + '/messages', { chat_id: CHAT_ID, message: { type: 'text', text: '✅ Тест!' } }],
    ['msg_recipient_full', 'POST', B + '/messages', { recipient: { chat_id: CHAT_ID, type: 'group' }, message: { text: '✅ Тест!' } }],
    
    // Варианты 7: личный диалог с владельцем чата
    ['owner_dm', 'POST', B + '/messages', { recipient: { user_id: 57604036 }, text: '✅ Тест в личку!' }],
  ];
  
  for (const [name, method, url, body] of tries) {
    try {
      const r = await fetch(url, { method, headers: H, body: JSON.stringify(body) });
      out[name] = { status: r.status, body: await r.json().catch(() => null) };
      if (r.ok) break;
    } catch (e: any) { out[name] = { error: e.message }; }
  }
  
  return res.status(200).json(out);
}
`, 'utf-8');
console.log('✓ api/max-test.ts: финальная диагностика всех вариантов');

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: финальная диагностика"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026 и пришли JSON!');