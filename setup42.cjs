const fs = require('fs');
const path = require('path');

function rep(src, from, to, label) {
  if (!src.includes(from)) { console.warn('⚠ не найдено:', label); return src; }
  return src.replace(from, to);
}

// ================= HOLDING =================
let h = fs.readFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), 'utf-8');

// --- 3) Бургер-меню: заменяем HoldingHeader целиком ---
const hs = h.indexOf('function HoldingHeader() {');
const he = h.indexOf('\n}\n', hs);
const newHeader = `function HoldingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    ['#history', 'История'],
    ['#restaurants', 'Рестораны'],
    ['#promos', 'Акции'],
    ['#events', 'Мероприятия'],
    ['#partners', 'Партнёры'],
    ['#vacancies', 'Вакансии'],
    ['#contacts', 'Контакты'],
  ];
  return (
    <>
      <header className={'fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[min(1400px,calc(100vw-32px))] rounded-full transition-all duration-700 glass-bar ' + (scrolled ? 'scrolled py-3' : 'py-4')}>
        <div className="max-w-[1400px] mx-auto px-5 lg:px-12 flex items-center justify-between">
          <a href="#/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-paper flex items-center justify-center overflow-hidden shadow-lg">
              <BrandImg src={holdingBrand.logo} alt={holdingBrand.name} fallback="ИВ" color={holdingBrand.gold} className="w-full h-full p-1.5" />
            </div>
            <span className="text-lg md:text-xl font-semibold tracking-tight text-amber">История Вкуса</span>
          </a>
          <nav className="hidden lg:flex items-center gap-6">
            {links.map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-cream/70 hover:text-cream transition-colors">{label}</a>
            ))}
          </nav>
          <button
            onClick={() => setOpen(true)}
            aria-label="Меню"
            className="lg:hidden glass-chip w-11 h-11 flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </header>
      {open && (
        <div className="fixed inset-0 z-[70] bg-night/95 flex flex-col items-center justify-center gap-5" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={() => setOpen(false)}>
          <button aria-label="Закрыть" className="absolute top-6 right-6 glass-chip w-11 h-11 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </svg>
          </button>
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="text-2xl font-semibold tracking-tight text-cream/85 hover:text-amber transition-colors">
              {label}
            </a>
          ))}
          <a href="tel:88002015757" className="mt-3 text-sm tracking-[0.2em] uppercase text-amber border-b border-amber/40 pb-1">
            8 800 201-57-57
          </a>
        </div>
      )}
    </>
  );
}`;
if (hs !== -1 && he !== -1) {
  h = h.slice(0, hs) + newHeader + h.slice(he + 2);
  console.log('✓ бургер-меню');
} else console.warn('⚠ HoldingHeader не найден');

// --- 4+7) Плавающие кнопки: наверх и позвонить ---
const floatBtn = `function FloatingButtons() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <>
      <a
        href="tel:88002015757"
        aria-label="Позвонить"
        className="glass-btn fixed bottom-5 left-4 z-40 w-13 h-13 flex items-center justify-center rounded-full"
        style={{ width: 52, height: 52 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      {show && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Наверх"
          className="glass-btn fixed bottom-5 right-4 z-40 flex items-center justify-center rounded-full"
          style={{ width: 52, height: 52 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      )}
    </>
  );
}

`;
h = rep(h, 'export default function Holding() {', floatBtn + 'export default function Holding() {', 'FloatingButtons');
h = rep(h, '      <VacancyModal', '      <FloatingButtons />\n\n      <VacancyModal', 'вызов FloatingButtons');

// --- 5) Карусель команды ---
h = rep(h, 'const [partnerOpen, setPartnerOpen] = useState(false);', 'const [partnerOpen, setPartnerOpen] = useState(false);\n  const [teamIdx, setTeamIdx] = useState(0);', 'teamIdx state');

const carousel = `<div className="md:hidden relative">
            <div className="flex items-stretch justify-center">
              <div className="w-[24%] -mr-5 opacity-40 scale-90 pointer-events-none">
                <TeamMobileCard t={team[(teamIdx + team.length - 1) % team.length]} />
              </div>
              <div className="w-[60%] z-10">
                <TeamMobileCard t={team[teamIdx]} />
              </div>
              <div className="w-[24%] -ml-5 opacity-40 scale-90 pointer-events-none">
                <TeamMobileCard t={team[(teamIdx + 1) % team.length]} />
              </div>
            </div>
            <button
              onClick={() => setTeamIdx((teamIdx + team.length - 1) % team.length)}
              aria-label="Назад"
              className="glass-chip absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <button
              onClick={() => setTeamIdx((teamIdx + 1) % team.length)}
              aria-label="Вперёд"
              className="glass-chip absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
            <div className="flex justify-center gap-1.5 mt-6">
              {team.map((t, i) => (
                <button key={t.id} onClick={() => setTeamIdx(i)} className={'w-2 h-2 rounded-full transition-colors ' + (i === teamIdx ? 'bg-amber' : 'bg-cream/25')} aria-label={t.name} />
              ))}
            </div>
          </div>
          <div className="hidden md:grid md:grid-cols-3 gap-8">`;
h = rep(h, '<div className="grid md:grid-cols-3 gap-8">', carousel, 'карусель команды');

const teamCard = `function TeamMobileCard({ t }: { t: (typeof team)[number] }) {
  return (
    <div className="text-center px-2">
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber/60 bg-coal" style={{ boxShadow: '0 0 30px rgba(194,160,118,0.2)' }}>
        <TeamAvatar src={t.photo} name={t.name} />
      </div>
      <p className="text-amber text-[9px] uppercase tracking-[0.3em] mb-1.5 font-medium">{t.role}</p>
      <h3 className="text-xl font-semibold tracking-tight mb-2">{t.name}</h3>
      <p className="text-cream/60 text-xs font-light leading-relaxed">{t.desc}</p>
    </div>
  );
}

`;
h = rep(h, 'function PartnerPhoto', teamCard + 'function PartnerPhoto', 'TeamMobileCard');

// --- 6) Кликабельные телефоны в карточках ресторанов ---
h = rep(h, '<p className="text-xs text-cream/70">{r.phone}</p>', '<p className="text-xs text-cream/70"><a href={"tel:" + r.phone.replace(/[^+\\d]/g, "")} className="hover:text-amber transition-colors">{r.phone}</a></p>', 'tel в ресторанах');

// --- 9) Статистика на мобильном ---
h = rep(h, '<p className="text-5xl md:text-6xl font-semibold tracking-tighter text-amber">{s.value}</p>', '<p className="text-3xl md:text-6xl font-semibold tracking-tighter text-amber">{s.value}</p>', 'stats size');
h = rep(h, '<p className="text-xs uppercase tracking-[0.2em] text-cream/50 mt-2">{s.label}</p>', '<p className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-cream/50 mt-2">{s.label}</p>', 'stats label');

// --- 10) lazy-фото ---
h = rep(h, '<img src={p.image} alt={p.name} onError', '<img loading="lazy" src={p.image} alt={p.name} onError', 'lazy partners');
h = rep(h, '<img src={src} alt={name} onError', '<img loading="lazy" src={src} alt={name} onError', 'lazy team');

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'Holding.tsx'), h, 'utf-8');
console.log('✓ Holding.tsx');

// ================= ORBIT HERO =================
let o = fs.readFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), 'utf-8');
o = rep(o, 'const target = pausedRef.current !== null ? SPEED * 0.25 : SPEED;', 'const target = pausedRef.current !== null ? SPEED * 0.25 : isMobile ? SPEED * 0.5 : SPEED;', 'медленнее на мобильном');
o = rep(o, 'style={{ width: mobileR * 2 + 90, height: mobileR * 2 * M_RY + 150 }}', 'style={{ width: mobileR * 2 + 90, maxWidth: "100%", height: mobileR * 2 * M_RY + 150 }}', 'orbit maxwidth');
o = rep(o, '<div className="relative w-14 h-14 rounded-full overflow-hidden"', '<div className="relative w-16 h-16 rounded-full overflow-hidden"', 'планеты крупнее');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'OrbitHero.tsx'), o, 'utf-8');
console.log('✓ OrbitHero.tsx');

// ================= GALLERY lazy =================
let g = fs.readFileSync(path.join(__dirname, 'src', 'components', 'RestaurantGallery.tsx'), 'utf-8');
g = rep(g, '<img\n            src={src}', '<img\n            loading="lazy"\n            src={src}', 'lazy gallery');
fs.writeFileSync(path.join(__dirname, 'src', 'components', 'RestaurantGallery.tsx'), g, 'utf-8');
console.log('✓ RestaurantGallery.tsx');

// ================= CSS: нет горизонтального скролла =================
fs.appendFileSync(
  path.join(__dirname, 'src', 'index.css'),
  '\n/* Стоп горизонтальный скролл */\nhtml, body { overflow-x: clip; }\n#root { max-width: 100vw; }\n'
);
console.log('✓ index.css');

// ================= SEO / соц-пакет =================
let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const data = fs.readFileSync(path.join(__dirname, 'src', 'data', 'holding.ts'), 'utf-8');
const logoMatch = data.match(/holdingBrand[\s\S]*?roundLogo:\s*['"]([^'"]+)['"]/);
const ogImage = logoMatch ? logoMatch[1] : '/images/logo-round.png';

html = rep(html, /<title>[\s\S]*?<\/title>/, '<title>История Вкуса — рестораны в Геленджике</title>', 'title');
const metaBlock =
  '<meta name="description" content="Ресторанный холдинг «История Вкуса» в Геленджике: Кинза, Нино, Астория, Ла Коста Берег. Банкеты, кейтеринг, акции. 8 800 201-57-57" />\n    <meta property="og:title" content="История Вкуса — рестораны в Геленджике" />\n    <meta property="og:description" content="Одна история — четыре вкуса. Четыре ресторана, партнёрские отели и загородный комплекс на побережье." />\n    <meta property="og:type" content="website" />\n    <meta property="og:image" content="' + ogImage + '" />\n    <link rel="icon" type="image/png" href="' + ogImage + '" />';
html = rep(html, '</head>', metaBlock + '\n  </head>', 'meta+og+favicon');
fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf-8');
console.log('✓ index.html (SEO/OG/favicon)');

console.log('\n✅ Мобильный апгрейд готов! Проверьте на телефоне, затем commit + push.\n');