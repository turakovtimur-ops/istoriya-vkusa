const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

// ================= 1) ФОТО: .jpg → .jpeg в данных =================
let data = fs.readFileSync(P('src/data/holding.ts'), 'utf-8');
const dBefore = data;
data = data.replace(/photo: '([^']+)\.jpg'/g, "photo: '$1.jpeg'");
if (data !== dBefore) {
  fs.writeFileSync(P('src/data/holding.ts'), data, 'utf-8');
  console.log('✓ данные: photo теперь .jpeg (под твои файлы)');
} else console.log('⚠ данные: .jpg не найден');

// ================= 2) КАРТА: зум при наведении =================
const cs = `import { useEffect, useRef } from 'react';
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

function loadYmaps(): Promise<any> {
  return new Promise((res, rej) => {
    if ((window as any).ymaps) return res((window as any).ymaps);
    const s = document.createElement('script');
    s.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
    s.onload = () => res((window as any).ymaps);
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

export default function ContactsSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  const ymapRef = useRef<any>(null);
  const boundsRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const layoutsRef = useRef<Record<string, { small: any; big: any }>>({});

  const setScale = (id: string, big: boolean) => {
    const pm = markersRef.current[id];
    const l = layoutsRef.current[id];
    if (!pm || !l) return;
    pm.options.set('iconLayout', big ? l.big : l.small);
  };

  const zoomTo = (id: string, c: [number, number]) => {
    setScale(id, true);
    const m = ymapRef.current;
    if (m) m.setCenter(c, 17, { duration: 300 });
  };

  const zoomBack = (id: string) => {
    setScale(id, false);
    const m = ymapRef.current;
    if (m && boundsRef.current) m.setBounds(boundsRef.current, { checkZoomRange: true, duration: 300 });
  };

  useEffect(() => {
    let cancelled = false;
    let map: any = null;

    loadYmaps().then((ymaps) => {
      if (cancelled || !mapRef.current) return;
      ymaps.ready(() => {
        if (cancelled || !mapRef.current) return;

        map = new ymaps.Map(
          mapRef.current,
          { center: [44.5557, 38.07], zoom: 13, controls: ['zoomControl'] },
          { suppressMapOpenBlock: true }
        );
        map.behaviors.disable('scroll');
        ymapRef.current = map;

        const makeLayout = (num: number, bg: string, size: number) =>
          ymaps.templateLayoutFactory.createClass(
            '<div style="transform:translate(-50%,-50%);width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:' + bg +
            ';border:3px solid #fff;box-shadow:0 6px 16px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:' +
            (size > 28 ? 13 : 12) + 'px;">' + num + '</div>'
          );

        const all: [number, number][] = [];

        restaurants.forEach((r, i) => {
          const c = RESTAURANTS[r.id];
          if (!c) return;
          all.push(c);
          const small = makeLayout(i + 1, r.accent, 32);
          const big = makeLayout(i + 1, r.accent, 46);
          layoutsRef.current[r.id] = { small, big };
          const pm = new ymaps.Placemark(
            c,
            { balloonContent: '<b>' + r.name + '</b><br>' + r.address + '<br>' + r.beach + '<br>' + r.phone },
            { iconLayout: small, iconShape: { type: 'Rectangle', coordinates: [[-16, -16], [16, 16]] } }
          );
          map.geoObjects.add(pm);
          markersRef.current[r.id] = pm;
        });

        PARTNERS.forEach((p, i) => {
          all.push(p.coords);
          const small = makeLayout(i + 5, '#6B7280', 28);
          const big = makeLayout(i + 5, '#6B7280', 40);
          layoutsRef.current[p.id] = { small, big };
          const pm = new ymaps.Placemark(
            p.coords,
            { balloonContent: '<b>' + p.name + '</b><br>' + p.type },
            { iconLayout: small, iconShape: { type: 'Rectangle', coordinates: [[-14, -14], [14, 14]] } }
          );
          map.geoObjects.add(pm);
          markersRef.current[p.id] = pm;
        });

        const lats = all.map((c) => c[0]);
        const lngs = all.map((c) => c[1]);
        const bounds = [[Math.min(...lats) - 0.004, Math.min(...lngs) - 0.006], [Math.max(...lats) + 0.004, Math.max(...lngs) + 0.006]];
        boundsRef.current = bounds;
        map.setBounds(bounds, { checkZoomRange: true });
      });
    });

    return () => {
      cancelled = true;
      if (map) map.destroy();
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
                  onMouseEnter={() => { const c = RESTAURANTS[r.id]; if (c) zoomTo(r.id, c); }}
                  onMouseLeave={() => zoomBack(r.id)}
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
                      <a href={'tel:' + r.phone.replace(/[^+\\d]/g, '')} className="hover:text-amber transition-colors">{r.phone}</a>
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
                  onMouseEnter={() => zoomTo(p.id, p.coords)}
                  onMouseLeave={() => zoomBack(p.id)}
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
`;

fs.writeFileSync(P('src/components/ContactsSection.tsx'), cs, 'utf-8');
console.log('✓ карта: зум 17 при наведении + возврат к общему виду');

console.log('\n✅ Обнови localhost (Cmd+Shift+R):');
console.log('   1) Кинза и Ла Коста — с ТВОИМИ фото (.jpeg подхватился)');
console.log('   2) карта: наводишь на ресторан слева → зум на метке, уводишь → общий вид');