const fs = require('fs');
const path = require('path');
const P = (f) => path.join(__dirname, f);
const re = P('src/data/resto-extra.ts');
let txt = fs.readFileSync(re, 'utf-8');
const i0 = txt.indexOf('= {'); const i1 = txt.lastIndexOf('};');
const data = JSON.parse(txt.slice(i0 + 2, i1 + 1));
for (const id of Object.keys(data)) {
  const dir = P('public/images/' + id + '/gallery');
  data[id].gallery = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort().map((f) => '/images/' + id + '/gallery/' + f)
    : [];
  console.log(id + ': ' + data[id].gallery.length + ' фото');
}
fs.writeFileSync(re, txt.slice(0, i0 + 2) + JSON.stringify(data, null, 2) + txt.slice(i1 + 1), 'utf-8');
console.log('✓ галереи обновлены. Дальше: npm run build && пуш');