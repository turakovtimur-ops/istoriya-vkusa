import { useEffect, useRef } from 'react';
import { restaurants } from '../data/holding';

const RESTAURANTS: Record<string, [number, number]> = {
  kinza: [44.5551, 38.0687],
  nino: [44.5552, 38.065],
  astoria: [44.555733, 38.064269],
  'la-costa': [44.559098, 38.07625],
};

const PARTNERS = [
  { id: 'priroda', name: 'Природа', type: 'Загородный комплекс', coords: [44.5493, 38.174031] as [number, number] },
  { id: 'brigantina', name: 'Бригантина', type: 'Отель', coords: [44.5548, 38.0703] as [number, number] },
  { id: 'yantar', name: 'Янтарь', type: 'Отель', coords: [44.559, 38.0764] as [number, number] },
];

function loadAsset(href: string, type: 'css' | 'js'): Promise<void> {
  return new Promise((res, rej) => {
    if (type === 'css') {
      if (document.querySelector('link[href="' + href + '"]')) return res();
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = href;
      l.onload = () => res();
      l.onerror = rej;
      document.head.appendChild(l);
    } else {
      if ((window as any).L) return res();
      const s = document.createElement('script');
      s.src = href;
      s.onload = () => res();
      s.onerror = rej;
      document.head.appendChild(s);
    }
  });
}

export default function ContactsSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<Record<string, any>>({});

  const setScale = (id: string, big: boolean) => {
    const m = markersRef.current[id];
    if (!m) return;
    const el = m.getElement();
    if (!el) return;
    const inner = el.firstElementChild as HTMLElement;
    if (!inner) return;
    inner.style.transition = 'transform 0.25s ease';
    inner.style.transform = 'translate(-50%,-50%) scale(' + (big ? 1.45 : 1) + ')';
    el.style.zIndex = big ? '2000' : '';
  };

  useEffect(() => {
    let cancelled = false;
    let map: any = null;
    loadAsset('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css', 'css')
      .then(() => loadAsset('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', 'js'))
      .then(() => {
        if (cancelled || !mapRef.current) return;
        const L = (window as any).L;
        map = L.map(mapRef.current, { scrollWheelZoom: false });
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap',
        }).addTo(map);

        restaurants.forEach((r, i) => {
          const c = RESTAURANTS[r.id];
          if (!c) return;
          const icon = L.divIcon({
            className: '',
            html:
              '<div style="transform:translate(-50%,-50%);width:32px;height:32px;border-radius:50%;background:' +
              r.accent +
              ';border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:13px;">' +
              (i + 1) +
              '</div>',
            iconSize: [0, 0],
          });
          const marker = L.marker(c, { icon })
            .addTo(map)
            .bindPopup('<b>' + r.name + '</b><br>' + r.address + '<br>' + r.beach + '<br>' + r.phone);
          markersRef.current[r.id] = marker;
        });

        PARTNERS.forEach((p, i) => {
          const icon = L.divIcon({
            className: '',
            html:
              '<div style="transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;background:#6B7280;border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:12px;">' +
              (i + 5) +
              '</div>',
            iconSize: [0, 0],
          });
          const marker = L.marker(p.coords, { icon })
            .addTo(map)
            .bindPopup('<b>' + p.name + '</b><br>' + p.type);
          markersRef.current[p.id] = marker;
        });

        const allCoords = [
          ...restaurants.map((r) => RESTAURANTS[r.id]).filter(Boolean),
          ...PARTNERS.map((p) => p.coords),
        ];
        map.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] });
      });
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, []);

  return (
    <section id="contacts" className="py-14 lg:py-16 bg-coal">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="reveal mb-8">
          <p className="text-amber text-xs tracking-[0.3em] uppercase mb-4 font-medium">Контакты</p>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter">Мы на карте Геленджика</h2>
        </div>
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 reveal">
            <p className="text-amber text-[10px] uppercase tracking-[0.3em] mb-4 font-medium">Рестораны</p>
            <div className="space-y-2">
              {restaurants.map((r, i) => (
                <div
                  key={r.id}
                  className="flex gap-4 p-2 -m-2 rounded-sm hover:bg-cream/5 transition-colors cursor-default"
                  onMouseEnter={() => setScale(r.id, true)}
                  onMouseLeave={() => setScale(r.id, false)}
                >
                  <div
                    className="w-8 h-8 flex-none rounded-full flex items-center justify-center text-night font-bold text-xs"
                    style={{ background: r.accent }}
                  >
                    {i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold tracking-tight leading-tight">{r.name}</p>
                    <p className="text-cream/55 text-xs font-light mt-0.5">{r.address} · {r.beach}</p>
                    <p className="text-cream/70 text-xs mt-0.5">
                      <a href={'tel:' + r.phone.replace(/[^+\d]/g, '')} className="hover:text-amber transition-colors">{r.phone}</a>
                      <span className="text-cream/40"> · {r.phoneFree}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-amber text-[10px] uppercase tracking-[0.3em] mt-6 mb-3 font-medium">Партнёры холдинга</p>
            <div className="flex flex-wrap gap-2">
              {PARTNERS.map((p, i) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-2 px-3 py-2 border border-cream/15 text-cream/70 text-xs hover:bg-cream/5 transition-colors cursor-default"
                  onMouseEnter={() => setScale(p.id, true)}
                  onMouseLeave={() => setScale(p.id, false)}
                >
                  <span className="w-5 h-5 rounded-full bg-[#6B7280] text-night flex items-center justify-center font-bold text-[10px]">{i + 5}</span>
                  {p.name} · {p.type}
                </span>
              ))}
            </div>

            <p className="text-cream/60 text-xs font-light mt-6 pt-4 border-t border-cream/10">
              Единая линия:{' '}
              <a href="tel:88002015757" className="text-cream hover:text-amber transition-colors font-medium">8 800 201-57-57</a>
            </p>
          </div>

          <div className="lg:col-span-7 reveal reveal-delay-1">
            <div className="relative z-0 h-[380px] lg:h-[480px] rounded-sm overflow-hidden border border-cream/10">
              <div ref={mapRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}