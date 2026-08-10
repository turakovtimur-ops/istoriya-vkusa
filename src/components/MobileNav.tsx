import { motion } from 'framer-motion';

interface Props { onClose: () => void; onBook: () => void; }

const navItems = [
  { label: 'Ресторан', href: '#about' },
  { label: 'Меню', href: '#menu' },
  { label: 'Галерея', href: '#gallery' },
  { label: 'Банкеты', href: '#banquets' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contacts' },
];

export default function MobileNav({ onClose, onBook }: Props) {
  const handleNav = (href: string) => {
    onClose();
    setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }), 300);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }} className="fixed inset-0 z-[100] bg-cream">
      <div className="flex flex-col h-full px-6 pt-6">
        <div className="flex items-center justify-between pb-10 border-b border-graphite/10">
          <span className="font-serif text-3xl font-medium">КИН<span className="text-terra">Z</span>A</span>
          <button onClick={onClose} aria-label="Закрыть">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 flex flex-col justify-center py-10">
          {navItems.map((item, i) => (
            <motion.button key={item.href} onClick={() => handleNav(item.href)}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }} className="py-5 text-left">
              <span className="font-serif text-4xl font-medium text-graphite hover:text-terra transition-colors">
                {item.label}
              </span>
            </motion.button>
          ))}
        </nav>
        <div className="pb-10 space-y-4">
          <a href="tel:+79384095855" className="block text-lg text-graphite">+7 (938) 409-58-55</a>
          <button onClick={() => { onClose(); setTimeout(onBook, 300); }} className="btn-terra w-full">
            Забронировать стол
          </button>
        </div>
      </div>
    </motion.div>
  );
}