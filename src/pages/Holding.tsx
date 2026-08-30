import { useEffect, useRef, useState } from 'react';
import RestaurantPage from '../components/RestaurantPage';
import OrbitHero from '../components/OrbitHero';
import VacancyModal from '../components/VacancyModal';
import PartnerModal from '../components/PartnerModal';
import SuppliersBlock from '../components/SuppliersBlock';
import PromoStories from '../components/PromoStories';
import EventsBlock from '../components/EventsBlock';
import { news } from '../data/news';
import ContactsSection from '../components/ContactsSection';
import VacanciesOrbit from '../components/VacanciesOrbit';
import BrandImg from '../components/BrandImg';
import { restaurants, partners, promos, history, holdingBrand, team, vacancies, benefits, Partner } from '../data/holding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
const STARS = Array.from({ length: 70 }, () => ({ top: Math.random() * 100, left: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 4 }));

function HoldingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  const links = [
    ['#history', 'История'],
    ['#team', 'Команда'],
    ['#restaurants', 'Рестораны'],
    ['#partners', 'Партнёры'],
    ['#news', 'Новости'],
    ['#promos', 'Акции'],
    ['#vacancies', 'Вакансии'],
    ['#suppliers', 'Поставщики'],
    ['#events', 'Мероприятия'],
    ['#contacts', 'Контакты'],
  ] as [string, string][];
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
        <div className="fixed inset-0 z-[70] bg-night/95 flex flex-col" style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }} onClick={() => setOpen(false)}>
          <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-cream/10" onClick={(ev) => ev.stopPropagation()}>
            <a href="#/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-cream flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0E0D0B" strokeWidth="2" strokeLinecap="round">
                  <line x1="9" y1="4" x2="9" y2="20" />
                  <path d="M15 4c-1.5 2-2 4-2 6 0 1.5 1 2 2 2v8" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight text-amber">История Вкуса</span>
            </a>
            <button aria-label="Закрыть" onClick={() => setOpen(false)} className="glass-chip w-11 h-11 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 flex flex-col justify-center px-8 overflow-y-auto" onClick={(ev) => ev.stopPropagation()}>
            {links.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="py-2 text-xl font-semibold tracking-tight text-cream/90 border-b border-cream/5 active:text-amber">
                {label}
              </a>
            ))}
          </nav>
          <div className="px-8 pb-10 pt-4" onClick={(ev) => ev.stopPropagation()}>
            <a href="tel:88002015757" className="inline-block text-sm tracking-[0.2em] uppercase text-amber border-b border-amber/40 pb-1 mb-4">
              8 800 201-57-57
            </a>
            <p className="text-cream/40 text-xs font-light">Геленджик · ресторанный холдинг</p>
          </div>
        </div>
      )}
    </>
  );
}

function TeamAvatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-end justify-center bg-coal">
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4 text-cream/25" fill="currentColor">
          <circle cx="50" cy="36" r="17" />
          <path d="M18 92c2-20 15-30 32-30s30 10 32 30z" />
        </svg>
      </div>
    );
  }
  return <img loading="lazy" src={src} alt={name} onError={() => setFailed(true)} className="w-full h-full object-cover" />;
}

function TeamMobileCard({ t }: { t: (typeof team)[number] }) {
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



function PartnerPhoto({ p }: { p: Partner }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-coal">
        <span className="font-serif text-3xl text-cream/30">{p.name}</span>
      </div>
    );
  }
  return <img loading="lazy" src={p.image} alt={p.name} onError={() => setFailed(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />;
}

function RestCardPhoto({ r }: { r: (typeof restaurants)[number] }) {
  const [stage, setStage] = useState(0);
  const srcs = ([r.photo, r.image, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80'] as (string | undefined)[]).filter(Boolean) as string[];
  const src = srcs[Math.min(stage, srcs.length - 1)];
  return (
    <img
      src={src}
      alt={r.name + ' — ресторан в Геленджике'}
      loading="lazy"
      onError={() => setStage((s) => Math.min(s + 1, srcs.length - 1))}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
    />
  );
}

function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col gap-3">
      <a href="tel:88002015757" aria-label="Позвонить" className="glass-btn flex items-center justify-center rounded-full" style={{ width: 44, height: 44 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Наверх" className="glass-btn flex items-center justify-center rounded-full" style={{ width: 44, height: 44 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F5F2EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
    </div>
  );
}



export default function Holding() {
  useScrollAnimation();
  const [promoFilter, setPromoFilter] = useState('all');
  const [vacancy, setVacancy] = useState<string | null>(null);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [teamIdx, setTeamIdx] = useState(0);
  const touchX = useRef<number | null>(null);

  // Страницы ресторанов по hash
  const [route, setRoute] = useState(typeof window !== 'undefined' ? window.location.pathname : '');
  useEffect(() => {
    const onPop = () => { setRoute(window.location.pathname); window.scrollTo(0, 0); };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const curRoute = route.replace(/\/+$/, '');
  const activeRest = restaurants.find((r) => curRoute === r.path || curRoute === '/' + r.path);

  useEffect(() => { document.title = 'История Вкуса — рестораны в Геленджике'; }, []);

  // Мобайл: шапка прячется при скролле вниз, появляется при скролле вверх
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (window.innerWidth >= 1024) return;
      const y = window.scrollY;
      const el = document.querySelector('header') as HTMLElement | null;
      if (el) el.style.top = y > lastY && y > 240 ? '-140px' : '';
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // hideHeaderDone

  // Перезагрузка: всегда старт сверху
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'auto';
  }, []);

  // Меню и логотип: плавный скролл БЕЗ смены hash (нет прыжков на главную)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const a = t.closest ? (t.closest('a[href^="#"]') as HTMLAnchorElement | null) : null;
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === '#/') {
        const cur = window.location.hash;
        if (cur && cur !== '#/' && cur.startsWith('#/')) return; // со страницы ресторана — роутер сам
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const el = document.getElementById(href.slice(1));
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  const filteredPromos =
    promoFilter === 'all'
      ? promos
      : promos.filter((p) => p.restaurants === 'all' || p.restaurants.includes(promoFilter));

  if (activeRest) return <RestaurantPage r={activeRest} />;
  return (
    <div className="bg-night text-cream min-h-screen">
      <HoldingHeader />
      <h1 className="sr-only">История Вкуса — рестораны и отели в Геленджике</h1>
      <OrbitHero />

      <section id="history" className="py-16 lg:py-24 bg-coal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5 reveal">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">О холдинге</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-[1.02]">{history.title}</h2>
          </div>
          <div className="lg:col-span-7 reveal reveal-delay-1">
            <div className="space-y-5 text-cream/75 text-lg font-light leading-relaxed">
              {history.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-cream/10">
              {history.stats.map((s, i) => (
                <div key={i}>
                  <p className="text-3xl md:text-6xl font-semibold tracking-tighter text-amber">{s.value}</p>
                  <p className="text-[9px] md:text-xs uppercase tracking-[0.2em] text-cream/50 mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="reveal mb-10 text-center">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Команда</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Люди, которые создают вкус</h2>
          </div>
          <div
          className="md:hidden relative"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - (touchX.current ?? 0);
            if (dx < -40) setTeamIdx((teamIdx + 1) % team.length);
            if (dx > 40) setTeamIdx((teamIdx + team.length - 1) % team.length);
          }}
        >
          <div className="flex items-start justify-center">
            <div className="w-32 -mr-6 opacity-50 pointer-events-none">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-amber/40 bg-coal">
                <TeamAvatar src={team[(teamIdx + team.length - 1) % team.length].photo} name={team[(teamIdx + team.length - 1) % team.length].name} />
              </div>
            </div>
            <div key={teamIdx} className="w-[62%] z-10 text-center px-2 team-anim">
              <div className="relative w-36 h-36 mx-auto mb-4 rounded-full overflow-hidden border-2 border-amber/60 bg-coal" style={{ boxShadow: '0 0 30px rgba(194,160,118,0.2)' }}>
                <TeamAvatar src={team[teamIdx].photo} name={team[teamIdx].name} />
              </div>
              <p className="text-amber text-[9px] uppercase tracking-[0.3em] mb-1.5 font-medium">{team[teamIdx].role}</p>
              <h3 className="text-xl font-semibold tracking-tight mb-2">{team[teamIdx].name}</h3>
              <p className="text-cream/60 text-xs font-light leading-relaxed">{team[teamIdx].desc}</p>
            </div>
            <div className="w-32 -ml-6 opacity-50 pointer-events-none">
              <div className="w-32 h-32 rounded-full overflow-hidden border border-amber/40 bg-coal">
                <TeamAvatar src={team[(teamIdx + 1) % team.length].photo} name={team[(teamIdx + 1) % team.length].name} />
              </div>
            </div>
          </div>
        </div>
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {team.map((t, i) => (
              <div key={t.id} className="reveal text-center" style={{ transitionDelay: (i * 0.1) + 's' }}>
                <div className="relative w-36 h-36 mx-auto mb-5 rounded-full overflow-hidden border-2 border-amber/60 bg-coal" style={{ boxShadow: '0 0 45px rgba(194,160,118,0.25)' }}>
                  <TeamAvatar src={t.photo} name={t.name} />
                </div>
                <p className="text-amber text-[10px] uppercase tracking-[0.3em] mb-2 font-medium">{t.role}</p>
                <h3 className="text-2xl font-semibold tracking-tight mb-3">{t.name}</h3>
                <p className="text-cream/60 text-sm font-light leading-relaxed max-w-xs mx-auto">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="restaurants" className="py-16 lg:py-24 bg-coal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="reveal mb-10">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Наши рестораны</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Четыре характера</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 hv-carousel hv-carousel-r">
            {restaurants.map((r, i) => (
              <a key={r.id} href={'#' + r.path} className="group reveal flex flex-col" style={{ transitionDelay: (i * 0.1) + 's' }}>
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-paper">
                  <RestCardPhoto r={r} />
                  <div className="absolute bottom-0 left-0 right-0 h-1 z-10" style={{ background: r.accent }} />
                </div>
                <p className="text-2xl font-semibold tracking-tight mb-1">{r.name}</p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cream/50 mb-3">{r.cuisine}</p>
                <p className="text-cream/60 text-sm font-light mb-4">{r.tagline}</p>
                <div className="mt-auto pt-4 border-t border-cream/10 space-y-1.5">
                  <p className="text-xs text-cream/50">{r.beach} · {r.address}</p>
                  <p className="text-xs text-cream/70"><a href={"tel:" + r.phone.replace(/[^+\d]/g, "")} className="hover:text-amber transition-colors">{r.phone}</a></p>
                </div>
                <span className="mt-4 self-start text-xs uppercase tracking-[0.2em] border-b pb-1 border-cream/30 group-hover:border-amber group-hover:text-amber transition-colors">
                  Перейти в ресторан
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="partners" className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="reveal mb-10">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Партнёры</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Нам доверяют</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 hv-carousel hv-carousel-p">
            {partners.map((p, i) => (
              <div key={p.id} className="group reveal flex flex-col border border-cream/10 hover:border-cream/30 transition-colors" style={{ transitionDelay: (i * 0.1) + 's' }}>
                <div className="relative aspect-video overflow-hidden">
                  <PartnerPhoto p={p} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 bg-night/70 backdrop-blur-sm text-cream/90">
                    {p.type}
                  </span>
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight mb-2">{p.name}</h3>
                  <p className="text-cream/60 text-sm font-light leading-relaxed mb-5">{p.desc}</p>
                  <div className="mt-auto space-y-1.5 pt-4 border-t border-cream/10">
                    <p className="text-xs text-cream/50">{p.address}</p>
                    <p className="text-xs text-cream/70">
                      <a href={'tel:' + p.phone.replace(/[^+\d]/g, '')} className="hover:text-amber transition-colors">{p.phone}</a>
                    </p>
                  </div>
                  <a
                    href={p.site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 self-start text-xs uppercase tracking-[0.2em] border-b pb-1 border-cream/30 group-hover:border-amber group-hover:text-amber transition-colors"
                  >
                    Сайт партнёра ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="news" className="py-16 lg:py-24 bg-coal">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="reveal mb-10">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Новости</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Новости и анонсы</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((nItem, i) => (
          <article key={nItem.id} className="border border-cream/10 hover:border-cream/30 transition-colors p-7 flex flex-col reveal" style={{ transitionDelay: (i * 0.08) + 's' }}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 rounded-full bg-amber/15 text-amber">{nItem.tag}</span>
              <time className="text-cream/40 text-xs">{nItem.date}</time>
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-3">{nItem.title}</h3>
            <p className="text-cream/60 text-sm font-light leading-relaxed">{nItem.text}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
  <section id="promos" className="py-16 lg:py-24 bg-coal">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="reveal mb-10">
        <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Акции</p>
        <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Сейчас в ресторанах</h2>
      </div>
      <PromoStories />
    </div>
  </section>
  <section id="vacancies" className="relative overflow-hidden pt-16 lg:pt-24 pb-8 lg:pb-10">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">{STARS.map((s, i) => (<span key={i} className="absolute rounded-full bg-cream/60 star-twinkle" style={{ top: s.top + '%', left: s.left + '%', width: s.size, height: s.size, animationDelay: s.delay + 's' }} />))}</div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7 reveal">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Вакансии</p>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tighter mb-10">
              Ты непременно станешь<br />частью нашей команды
            </h2>
            <div className="hidden md:block -mt-4 lg:-mt-8">
              <VacanciesOrbit onApply={setVacancy} />
            </div>
            <div className="md:hidden flex flex-col gap-3">
              {vacancies.map((v) => (
                <button
                  key={v}
                  onClick={() => setVacancy(v)}
                  className="group glass-chip px-5 py-3 text-cream/85 text-sm uppercase tracking-wider text-left"
                >
                  {v}
                  <span className="block text-[10px] normal-case tracking-normal mt-1 text-amber/90">
                    Заполнить анкету →
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 reveal reveal-delay-1">
            <div className="border border-cream/10 p-6 lg:p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-cream/50 mb-7">Мы предлагаем</p>
              <ul className="space-y-3.5 mb-10">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-3 text-cream/75 font-light">
                    <svg className="text-amber flex-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
              <p className="text-cream/60 text-sm font-light mb-7 leading-relaxed">
                Обращаться по телефону 8 800 201-57-57<br />или к администратору нужного вам заведения
              </p>
              <a href="tel:88002015757" className="glass-btn inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-medium">Позвонить</a>
            </div>
          </div>
        </div>
      </section>

      <SuppliersBlock onPartner={() => setPartnerOpen(true)} />

      <EventsBlock />

      <ContactsSection />

      <footer className="py-12 border-t border-cream/10 bg-coal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-10">
          <div className="flex flex-col items-center text-center">
            <img src={holdingBrand.fullLogo} alt="История Вкуса" className="h-14 lg:h-16 w-auto object-contain" />
            <p className="text-cream/50 text-sm font-light mt-3">Сеть ресторанов и отелей</p>
            <p className="text-cream/50 text-sm font-light mt-1">Геленджик</p>
          </div>
          <div>
            <p className="text-xs text-cream/40 uppercase tracking-[0.3em] mb-4">Рестораны</p>
            <ul className="space-y-2 text-cream/70 font-light text-sm">
              {restaurants.map((r) => (
                <li key={r.id}><a href={'#' + r.path} className="hover:text-cream transition-colors">{r.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs text-cream/40 uppercase tracking-[0.3em] mb-4">Партнёры</p>
            <ul className="space-y-2 text-cream/70 font-light text-sm">
              {partners.map((p) => (
                <li key={p.id}>
                  <a href={p.site} target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">{p.name}</a> — {p.type.toLowerCase()}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-12 pt-8 border-t border-cream/10">
          <p className="text-cream/40 text-xs">© 2026 История Вкуса. Все права защищены.</p>
        </div>
      </footer>

      <FloatingButtons />



      <VacancyModal vacancy={vacancy} onClose={() => setVacancy(null)} />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
    </div>
  );
}