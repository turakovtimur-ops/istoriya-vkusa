import { REST_PAGES } from '../data/restPages';

export default function RestaurantPage({ r }: { r: any }) {
  const p = REST_PAGES[r.id];
  const a = (r.accent as string) || '#C2A076';
  return (
    <div className="min-h-screen bg-night text-cream">
      <header className="fixed top-0 left-0 right-0 z-40 px-4 pt-4">
        <div className="max-w-[1400px] mx-auto glass-bar rounded-full px-5 py-3 flex items-center justify-between">
          <a href="#/" className="text-cream/70 text-[10px] uppercase tracking-[0.2em] hover:text-cream transition-colors">← В холдинг</a>
          <span className="text-[10px] uppercase tracking-[0.3em]" style={{ color: a }}>{r.cuisine}</span>
        </div>
      </header>

      <section className="relative overflow-hidden pt-32 pb-14 px-5">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 35%, ' + a + '22, transparent 70%)' }} />
        <div className="relative max-w-[1100px] mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-white" style={{ border: '1px solid ' + a + '66', boxShadow: '0 0 40px ' + a + '44' }}>
            <img src={r.logo} alt={r.name} className="w-full h-full object-contain p-2" />
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tighter mb-4">{r.name}</h1>
          <p className="text-lg md:text-2xl text-cream/70 font-light">{p.slogan}</p>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: a }}>О ресторане</p>
          {p.about.map((t: string, i: number) => (
            <p key={i} className="text-cream/70 font-light leading-relaxed mb-4">{t}</p>
          ))}
          <div className="flex flex-wrap gap-2 mt-6">
            {p.features.map((f: string) => (
              <span key={f} className="glass-chip px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-cream/80">{f}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-8">Фирменное меню</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {p.dishes.map((d: any) => (
              <div key={d.name} className="border border-cream/10 p-6" style={{ background: 'linear-gradient(160deg,' + a + '0d, transparent 60%)' }}>
                <p className="font-semibold tracking-tight mb-1">{d.name}</p>
                <p className="text-cream/55 text-sm font-light">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-14">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-8">Гости говорят</h2>
          <div className="space-y-4">
            {p.reviews.map((rv: any) => (
              <div key={rv.name} className="border border-cream/10 p-6 rounded-2xl">
                <p className="text-cream/70 text-sm font-light leading-relaxed mb-3">«{rv.text}»</p>
                <p className="text-xs uppercase tracking-[0.2em]" style={{ color: a }}>— {rv.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="max-w-[900px] mx-auto border border-cream/10 p-8 text-center" style={{ background: a + '0a' }}>
          <p className="text-cream/70 font-light mb-2">{r.address} · {r.beach}</p>
          <p className="text-cream/70 font-light mb-6">{r.phone} · {r.phoneFree}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={'tel:' + String(r.phone).replace(/[^+\d]/g, '')} className="px-6 py-3 text-xs uppercase tracking-[0.2em] rounded-full font-semibold" style={{ background: a, color: '#0E0D0B' }}>Позвонить</a>
            <a href="#/" className="glass-chip px-6 py-3 text-xs uppercase tracking-[0.2em] text-cream/80">Карта холдинга</a>
          </div>
        </div>
      </section>
    </div>
  );
}
