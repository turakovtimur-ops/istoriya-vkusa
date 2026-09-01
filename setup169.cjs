const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const OLD = 'f9LHodD0cOLJDj0bayibcL31_kyOP3-6s84NVL_lrUfuh3fqD15G-lRNnRzdv3IcbTNPNx5dQ-8_FbjtQ1mi';
const NEW = 'f9LHodD0cOKR-mKoOWi0aFYaL4aNgu6pmTBXyo2vWrurD0uM1YY5Geysg9wP9A9cMQeJ6XYweiOEjkllaNEp';

['api/apply.ts', 'api/max-test.ts', 'api/max-diag.ts'].forEach((f) => {
  if (!fs.existsSync(P(f))) { console.log('ℹ ' + f + ': нет файла'); return; }
  let s = fs.readFileSync(P(f), 'utf-8');
  if (s.includes(OLD)) {
    s = s.split(OLD).join(NEW);
    fs.writeFileSync(P(f), s, 'utf-8');
    console.log('✓ ' + f + ': токен обновлён');
  } else console.log('ℹ ' + f + ': старого токена нет');
});

// max-diag больше не нужен — убираем (там был старый токен)
if (fs.existsSync(P('api/max-diag.ts'))) { fs.unlinkSync(P('api/max-diag.ts')); console.log('✓ api/max-diag.ts удалён (не нужен)'); }

console.log('\n✅ Ритуал:');
console.log('npm run build');
console.log('git add -A && git commit -m "MAX: новый токен"');
console.log('git pull --rebase');
console.log('git push');
console.log('\n📋 1) Открой: https://www.istoriya-vkusa.ru/api/max-test?key=iv2026');
console.log('   → ждём status 200 и сообщение «✅ Тест: бот на связи!» в чате MAX');
console.log('2) Затем отправь тестовую анкету с сайта — карточка должна упасть в чат!');