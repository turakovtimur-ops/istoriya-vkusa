import { useEffect, useState } from 'react';
import OrbitHero from '../components/OrbitHero';
import VacancyModal from '../components/VacancyModal';
import PartnerModal from '../components/PartnerModal';
import SuppliersBlock from '../components/SuppliersBlock';
import EventsBlock from '../components/EventsBlock';
import ContactsSection from '../components/ContactsSection';
import RestaurantGallery from '../components/RestaurantGallery';
import VacanciesOrbit from '../components/VacanciesOrbit';
import BrandImg from '../components/BrandImg';
import { restaurants, partners, promos, history, holdingBrand, team, vacancies, benefits, Partner } from '../data/holding';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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

function FloatingButtons() {
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



export default function Holding() {
  useScrollAnimation();
  const [promoFilter, setPromoFilter] = useState('all');
  const [vacancy, setVacancy] = useState<string | null>(null);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [teamIdx, setTeamIdx] = useState(0);
  const filteredPromos =
    promoFilter === 'all'
      ? promos
      : promos.filter((p) => p.restaurants === 'all' || p.restaurants.includes(promoFilter));

  return (
    <div className="bg-night text-cream min-h-screen">
      <HoldingHeader />
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
          <div className="md:hidden relative">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restaurants.map((r, i) => (
              <a key={r.id} href={'#' + r.path} className="group reveal flex flex-col" style={{ transitionDelay: (i * 0.1) + 's' }}>
                <div className="relative aspect-[4/3] overflow-hidden mb-4 bg-paper">
                  <RestaurantGallery r={r} />
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
          <div className="grid md:grid-cols-3 gap-6">
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

      <section id="promos" className="py-16 lg:py-24 bg-coal">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="reveal mb-10">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Акции</p>
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter">Сейчас в ресторанах</h2>
          </div>
          <div className="reveal reveal-delay-1 mb-12 flex flex-wrap gap-2">
            <button
              onClick={() => setPromoFilter('all')}
              className={'px-5 py-2.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all ' + (promoFilter === 'all' ? 'bg-amber text-night border border-amber' : 'glass-chip text-cream/70')}
            >
              Все
            </button>
            {restaurants.map((r) => (
              <button
                key={r.id}
                onClick={() => setPromoFilter(r.id)}
                className={'px-5 py-2.5 text-xs uppercase tracking-wider font-medium rounded-full transition-all ' + (promoFilter === r.id ? 'bg-amber text-night border border-amber' : 'glass-chip text-cream/70')}
              >
                {r.name}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredPromos.map((promo) => (
              <div key={promo.id} className="border border-cream/10 p-6 lg:p-8 hover:border-cream/30 transition-colors reveal">
                <div className="flex flex-wrap gap-2 mb-5">
                  {promo.restaurants === 'all' ? (
                    <span className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 bg-cream/10 text-cream/80 rounded-full">
                      Все рестораны
                    </span>
                  ) : (
                    promo.restaurants.map((id) => {
                      const r = restaurants.find((x) => x.id === id);
                      return r ? (
                        <span key={id} className="text-[10px] uppercase tracking-[0.25em] px-3 py-1.5 text-cream rounded-full" style={{ background: r.accent }}>
                          {r.name}
                        </span>
                      ) : null;
                    })
                  )}
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-5">{promo.title}</h3>
                {promo.items && (
                  <ul className="space-y-2.5 mb-5">
                    {promo.items.map((item, i) => (
                      <li key={i} className="flex items-baseline justify-between gap-4 text-sm border-b border-dotted border-cream/15 pb-2">
                        <span className="text-cream/70 font-light">{item.name}</span>
                        <span className="font-semibold whitespace-nowrap">{item.price} ₽</span>
                      </li>
                    ))}
                  </ul>
                )}
                {promo.note && <p className="text-cream/60 text-sm font-light leading-relaxed">{promo.note}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vacancies" className="py-16 lg:py-24">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14 items-center">
          <div className="lg:col-span-7 reveal">
            <p className="text-amber text-xs tracking-[0.3em] uppercase mb-6 font-medium">Вакансии</p>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-semibold tracking-tighter mb-10">
              Ты непременно станешь<br />частью нашей команды
            </h2>
            <div className="hidden lg:block">
              <VacanciesOrbit onApply={setVacancy} />
            </div>
            <div className="lg:hidden flex flex-wrap gap-3">
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
          <div>
            <p className="text-2xl font-semibold tracking-tight mb-3 text-amber">История Вкуса</p>
            <p className="text-cream/50 text-sm font-light">Сеть ресторанов и отелей · Геленджик</p>
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