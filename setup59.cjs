const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'src', 'components', 'ContactsSection.tsx');
const old = fs.readFileSync(p, 'utf-8');

// берём JSX-разметку как есть — она не меняется
const retIdx = old.indexOf('  return (');
if (retIdx === -1) { console.warn('⚠ return не найден'); process.exit(1); }
const jsx = old.slice(retIdx);

const head = `import { useEffect, useRef } from 'react';
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
  const markersRef = useRef<Record<string, any>>({});
  const layoutsRef = useRef<Record<string, { small: any; big: any }>>({});

  const setScale = (id: string, big: boolean) => {
    const pm = markersRef.current[id];
    const l = layoutsRef.current[id];
    if (!pm || !l) return;
    pm.options.set('iconLayout', big ? l.big : l.small);
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
        map.setBounds(
          [[Math.min(...lats) - 0.004, Math.min(...lngs) - 0.006], [Math.max(...lats) + 0.004, Math.max(...lngs) + 0.006]],
          { checkZoomRange: true }
        );
      });
    });

    return () => {
      cancelled = true;
      if (map) map.destroy();
    };
  }, []);

`;

fs.writeFileSync(p, head + jsx, 'utf-8');
console.log('✓ Карта заменена на Яндекс: кружочки, попапы, размеры — всё как было');
console.log('\n✅ Дальше:\n   npm run build\n   git add . && git commit -m "Контакты: Яндекс.Карта вместо OSM" && git push');