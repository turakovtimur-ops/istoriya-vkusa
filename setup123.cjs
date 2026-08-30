const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);

let css = fs.readFileSync(P('src/index.css'), 'utf-8');
if (!css.includes('marquee-fade')) {
  css += `
/* setup123: плавные края ленты поставщиков */
.marquee-fade {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 7%, #000 93%, transparent);
}
`;
  fs.writeFileSync(P('src/index.css'), css, 'utf-8');
  console.log('✓ CSS: fade-маска для ленты');
}

// вешаем класс на ленту в SuppliersBlock
const sf = P('src/components/SuppliersBlock.tsx');
let sb = fs.readFileSync(sf, 'utf-8');
if (!sb.includes('marquee-fade')) {
  const n0 = sb.split('className="marquee').length - 1;
  sb = sb.split('className="marquee').join('className="marquee marquee-fade');
  if (sb.includes('marquee marquee-fade')) {
    fs.writeFileSync(sf, sb, 'utf-8');
    console.log('✓ лента поставщиков получила fade-края (вхождений: ' + n0 + ')');
  }
} else console.log('ℹ fade уже есть');

console.log('\n✅ Выкатываем: npm run build && git add -A && git commit -m "Плавные края ленты поставщиков" && git push');