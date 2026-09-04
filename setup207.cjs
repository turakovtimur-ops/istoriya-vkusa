const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

const find = (marker, notMarker) => {
  let t = null;
  const walk = (dir) => {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((e) => {
      const p = path.join(dir, e.name);
      if (['node_modules', '.git', 'dist'].includes(e.name)) return;
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.tsx') && fs.readFileSync(p, 'utf-8').includes(marker) && (!notMarker || !fs.readFileSync(p, 'utf-8').includes(notMarker))) t = p;
    });
  };
  walk(P('src'));
  return t;
};

// ================= 1) FaqBlock компонент =================
fs.writeFileSync(P('src/components/FaqBlock.tsx'), `import { useState } from 'react';
const FAQ = [
  { q: 'Можно ли принести свой алкоголь?', a: 'У нас обширная барная и винная карта с большим ассортиментом коктейлей на любой вкус — необходимости приносить свои напитки нет.' },
  { q: 'Есть ли скидка в день рождения?', a: 'В честь дня рождения мы дарим вам десерт и коктейль в подарок 🎁' },
  { q: 'Можно ли приходить с животными?', a: 'Да, мы зоо-friendly: для маленьких питомцев предусмотрены поилки и комплименты 🐾' },
  { q: 'Как забронировать стол?', a: 'Кнопкой «Забронировать» на сайте, по телефону или в MAX/WhatsApp — администратор подтвердит бронь звонком.' },
  { q: 'Есть ли детские стульчики?', a: 'Да, у нас есть детские стульчики и посуда — малышам будет комфортно.' },
  { q: 'Есть ли вегетарианские блюда?', a: 'Да, в меню есть вегетарианские позиции, и часть блюд мы адаптируем под вас — подскажет официант.' },
  { q: 'Принимаете ли карты и СБП?', a: 'Да, принимаем карты, СБП и наличные.' },
];
export default function FaqBlock() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-night py-16 lg:py-24 px-6 lg:px-12">
      <div className="max-w-[900px] mx-auto">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-3 font-medium text-center">Частые вопросы</p>
        <h2 className="font-serif text-3xl lg:text-5xl font-medium text-cream text-center mb-10">Вопросы и ответы</h2>
        <div className="space-y-3">
          {FAQ.map((f, i) => (
            <div key={i} className="border border-cream/15 bg-cream/5">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left text-cream text-sm lg:text-base font-medium">
                {f.q}
                <span className={'text-amber text-xl transition-transform ' + (open === i ? 'rotate-45' : '')}>+</span>
              </button>
              {open === i && <p className="px-6 pb-5 text-cream/70 font-light text-sm lg:text-base leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
        <p className="text-cream/40 text-xs text-center mt-10">Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович</p>
      </div>
    </section>
  );
}
`, 'utf-8');
console.log('✓ FaqBlock.tsx создан (7 вопросов + строка авторства)');

// ================= 2) Подключаем FAQ на главной =================
const app = find('OrbitHero');
if (!app) console.log('⚠ главный файл не найден');
else {
  let s = fs.readFileSync(app, 'utf-8');
  const s0 = s;
  if (!s.includes('FaqBlock')) {
    const imp = /import OrbitHero[^\n]*\n/.exec(s);
    if (imp) s = s.split(imp[0]).join(imp[0] + "import FaqBlock from '" + (app.includes('/components/') ? './FaqBlock' : './components/FaqBlock') + "';\n");
    if (s.includes('<footer')) s = s.replace(/<footer/, '<FaqBlock />\n      <footer');
    else s = s.replace(/<\/main>(?![\s\S]*<\/main>)/, '<FaqBlock />\n      </main>');
  }
  if (s !== s0) { fs.writeFileSync(app, s, 'utf-8'); console.log('✓ FAQ подключён на главной: ' + path.relative(P('.'), app)); }
  else console.log('⚠ FAQ: без изменений (пришли скрин, если блока нет)');
}

// ================= 3) Авторство в подвале ресторанов =================
const rp = find('export default function RestaurantPage');
if (rp) {
  let s = fs.readFileSync(rp, 'utf-8');
  if (!s.includes('Тураков')) {
    s = s.split('Часть холдинга «История Вкуса»</a>').join('Часть холдинга «История Вкуса» · Кастомная разработка и дизайн сайта — Тураков Тимур Рифхатович</a>');
    fs.writeFileSync(rp, s, 'utf-8');
    console.log('✓ подвал ресторанов: строка авторства');
  }
}

// ================= 4) index.html: meta + комментарий + анти-коп =================
let h = fs.readFileSync(P('index.html'), 'utf-8');
const h0 = h;
if (!h.includes('name="author"')) {
  h = h.split('</title>').join('</title>\n<meta name="author" content="Тураков Тимур Рифхатович" />\n<meta name="copyright" content="История Вкуса, 2026. Кастомная разработка и дизайн: Тураков Т.Р." />\n<!-- © 2026 История Вкуса. Кастомная разработка и дизайн сайта: Тураков Тимур Рифхатович. Все права защищены. Копирование материалов без письменного согласия запрещено. -->');
}
if (!h.includes('contextmenu')) {
  h = h.split('</body>').join(`<script>
document.addEventListener('contextmenu', function (e) { var t = e.target; if (t && t.closest && t.closest('input,textarea,select,a')) return; e.preventDefault(); });
document.addEventListener('keydown', function (e) { if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && ['i','j','c'].includes(e.key.toLowerCase())) || (e.ctrlKey && ['u','s'].includes(e.key.toLowerCase()))) e.preventDefault(); });
document.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); });
</script>
</body>`);
}
if (h !== h0) { fs.writeFileSync(P('index.html'), h, 'utf-8'); console.log('✓ index.html: авторство + анти-коп'); }

// ================= 5) CSS: картинки не перетаскиваются =================
let c = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!c.includes('user-drag')) {
  c += '\nimg { -webkit-user-drag: none; user-select: none; }\n';
  fs.writeFileSync(P('src/index.css'), c, 'utf-8');
  console.log('✓ index.css: img защита');
}

// ================= 6) middleware: hotlink-защита =================
fs.writeFileSync(P('middleware.ts'), `export const config = { matcher: ['/images/:path*', '/menus/:path*'] };
export default function middleware(request: Request) {
  const referer = request.headers.get('referer') || '';
  const allow = ['istoriya-vkusa.ru', 'yandex.ru', 'vercel.app', 'localhost'];
  if (referer && !allow.some((d) => referer.includes(d))) {
    return new Response('403 — контент защищён © Тураков Т.Р.', { status: 403 });
  }
}
`, 'utf-8');
console.log('✓ middleware.ts: hotlink-защита картинок/PDF');

console.log('\n✅ ОДНОЙ КОМАНДОЙ:');
console.log('npm run build && git add -A && git commit -m "Часть 2: авторство Тураков Т.Р. + FAQ + защита" && git pull --rebase && git push');
console.log('\n↩️ ОТКАТ: git revert HEAD --no-edit && git push');