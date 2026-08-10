import { useState, useEffect } from 'react';
import MobileNav from './MobileNav';

interface HeaderProps { onBook: () => void; }

const navItems = [
  { label: 'Ресторан', href: '#about' },
  { label: 'Меню', href: '#menu' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Банкеты', href: '#banquets' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
];

export default function Header({ onBook }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled ? 'bg-cream/95 backdrop-blur-md border-b border-graphite/10 py-4' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <a href="#" className="relative z-10">
            <span className={`font-serif text-3xl lg:text-4xl font-medium tracking-tight transition-colors duration-700 ${
              scrolled ? 'text-graphite' : 'text-cream'
            }`}>
              КИН<span className="text-terra">Z</span>A
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}
                className={`text-sm font-light tracking-wide transition-colors duration-500 hover:opacity-70 ${
                  scrolled ? 'text-graphite' : 'text-cream'
                }`}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:+79384095855" className={`text-sm font-light tracking-wide transition-colors ${
              scrolled ? 'text-graphite' : 'text-cream'
            }`}>+7 (938) 409-58-55</a>
            <button onClick={onBook} className="btn-primary">Забронировать</button>
          </div>
          <button onClick={() => setMobileOpen(true)} className={`lg:hidden relative z-10 p-2 transition-colors ${
            scrolled ? 'text-graphite' : 'text-cream'
          }`} aria-label="Открыть меню">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </div>
      </header>
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} onBook={onBook} />}
    </>
  );
}