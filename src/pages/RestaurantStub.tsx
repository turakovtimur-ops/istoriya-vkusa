import { restaurants } from '../data/holding';
import BrandImg from '../components/BrandImg';

interface Props { path: string; }

export default function RestaurantStub({ path }: Props) {
  const r = restaurants.find((x) => x.path === path);
  if (!r) return null;
  return (
    <div className="relative min-h-screen bg-night flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {r.pattern && (
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none bg-cover bg-center"
          style={{ backgroundImage: 'url(' + r.pattern + ')' }}
        />
      )}
      <p className="text-amber text-xs tracking-[0.4em] uppercase mb-10 relative font-medium">История Вкуса представляет</p>
      <div className="relative w-72 md:w-96 bg-paper rounded-sm p-8 mb-8" style={{ boxShadow: '0 0 60px ' + r.accent + '44' }}>
        <BrandImg src={r.logo} alt={r.name} fallback={r.name} color={r.accent} className="w-full h-24" />
      </div>
      <h1 className="relative text-4xl md:text-6xl font-semibold tracking-tighter text-cream mb-6">{r.name}</h1>
      <p className="relative text-cream/60 max-w-md mb-8 font-light leading-relaxed">{r.description}</p>
      <div className="relative text-cream/60 text-sm space-y-1 mb-12">
        <p>{r.address} · {r.beach}</p>
        <a href={'tel:' + r.phone.replace(/[^+\d]/g, '')} className="hover:text-cream transition-colors">{r.phone}</a>
        <p className="text-cream/40">{r.phoneFree}</p>
      </div>
      <a href="#/" className="btn-outline relative">← Вернуться в холдинг</a>
    </div>
  );
}