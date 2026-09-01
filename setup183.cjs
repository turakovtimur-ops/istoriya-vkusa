const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let a = fs.readFileSync(P('api/apply.ts'), 'utf-8');
const a0 = a;
const OLD = `  let att: any = null;
  if (data.file && data.file.base64) att = await maxUpload(data.file.base64, data.file.name || 'file', log);
  let sent = false;
  if (att) {
    const r = await maxSend(text, [att]);
    if (log) log.send_att = r.status;
    if (r.ok) sent = true;
  }`;
const NEW = `  let att: any = null;
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
  }`;
a = a.split(OLD).join(NEW);
if (a !== a0) { fs.writeFileSync(P('api/apply.ts'), a, 'utf-8'); console.log('✓ apply.ts: автоповтор вложения (2 попытки)'); }
else console.log('⚠ якорь не найден — пришли содержимое api/apply.ts');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "MAX: автоповтор вложений" && git pull --rebase && git push');