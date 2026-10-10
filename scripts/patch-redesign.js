// One-off patch: stale image paths + color contrast for the new yellow accent.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const rd = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const wr = (f, s) => fs.writeFileSync(path.join(root, f), s);
const I = (n) => `/api/media/insta-0${n}.jpg`;

// ---- layout: fonts + OG image ----
let s = rd('app/layout.tsx');
s = s.split('/images/hero-modern-driver.jpg').join('/images/hero-facade.png');
s = s.replace(/width: 1200,(\s+)height: 800,/, 'width: 335,$1height: 597,');
s = s.replace(
  /family=Inter[^"]+display=swap/,
  'family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap'
);
s = s.replace('selection:bg-brand-100 selection:text-brand-900', 'selection:bg-accent-400 selection:text-ink');
wr('app/layout.tsx', s);

// ---- sobre: real photos instead of broken placeholders ----
s = rd('app/sobre/page.tsx');
s = s
  .replace('/images/gallery/recepcao-itamarati.jpg', '/images/hero-facade.png')
  .replace('/images/gallery/simulador-direcao.jpg', I(2))
  .replace('/images/gallery/frota-carros.jpg', I(4))
  .replace('/images/gallery/equipe-instrutores.jpg', I(7))
  .replace('Recepção acolhedora da Autoescola Itamarati', 'Fachada da Autoescola Itamarati em Guaianases')
  .replace('Simulador moderno de direção veicular', 'Post da Itamarati: tire sua habilitação')
  .replace('Frota moderna e higienizada de carros', 'Post da Itamarati: CNH de carro e moto')
  .replace('Equipe de instrutores credenciados pelo DETRAN', 'Post da Itamarati: curso de motofrete');
s = s.split('aspect-[4/3]').join('aspect-[4/5]');
wr('app/sobre/page.tsx', s);

// ---- admin: no default image for new items ----
s = rd('app/admin/page.tsx');
s = s.split("'/images/news/news-dicas-exame.jpg'").join("''");
s = s.split("'/images/gallery/conquista-cnh-carro.jpg'").join("''");
s = s.split('/images/... ou /uploads/...').join('/images/... ou /api/media/...');
wr('app/admin/page.tsx', s);

// ---- seed data (used only if data/db.json is missing) ----
s = rd('lib/db.ts');
s = s.split('/images/hero-modern-driver.jpg').join('/images/hero-facade.png');
const seedMap = {
  'conquista-cnh-carro': I(2), 'conquista-cnh-moto': I(7), 'conquista-cnh-ab': I(4),
  'aula-pratica-carro': I(4), 'recepcao-itamarati': '/images/hero-facade.png', 'simulador-direcao': I(2),
  'frota-carros': I(4), 'circuito-motos': I(7), 'equipe-instrutores': I(1),
};
for (const [k, v] of Object.entries(seedMap)) s = s.split(`/images/gallery/${k}.jpg`).join(v);
s = s.split('/images/news/news-legislacao-transito.jpg').join(I(1));
s = s.split('/images/news/news-renovacao-cnh.jpg').join(I(6));
s = s.split('/images/news/news-dicas-exame.jpg').join(I(4));
// Seed gallery entries were illustrative: never publish them without registered consent
s = s.replace(/(imageUrl: '[^']+',[\s\S]*?)autorizadoUsoImagem: true/g, '$1autorizadoUsoImagem: false');
wr('lib/db.ts', s);

// ---- contrast: white text on yellow is unreadable -> dark text ----
function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}
const files = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'components'))];
let changed = 0;
for (const f of files) {
  let c = fs.readFileSync(f, 'utf8');
  const before = c;
  // Inside any className string containing a yellow background, swap text-white for ink
  c = c.replace(/(className=(?:"|\{`|\{'))([^"`']*)/g, (m, pre, cls) => {
    if (/(^|\s)(group-hover:)?bg-accent-(400|500|600)(\s|$)/.test(cls)) {
      cls = cls.replace(/(^|\s)text-white(?=\s|$)/g, '$1text-ink');
      cls = cls.replace(/hover:bg-accent-600/g, 'hover:bg-accent-400');
      cls = cls.replace(/hover:bg-accent-700/g, 'hover:bg-accent-400');
    }
    // yellow text on white backgrounds is hard to read -> darker mustard
    cls = cls.replace(/(^|\s)text-accent-600(?=\s|$)/g, '$1text-accent-800');
    cls = cls.replace(/(^|\s)text-accent-700(?=\s|$)/g, '$1text-accent-800');
    cls = cls.replace(/hover:text-accent-700/g, 'hover:text-ink');
    return pre + cls;
  });
  // conditional class strings like isSelected ? 'bg-accent-500 text-white' : ...
  c = c.replace(/'([^']*\bbg-accent-(?:400|500|600)\b[^']*)'/g, (m, cls) => `'${cls.replace(/(^|\s)text-white(?=\s|$)/g, '$1text-ink')}'`);
  if (c !== before) {
    fs.writeFileSync(f, c);
    changed++;
    console.log('contrast fix:', path.relative(root, f));
  }
}
console.log('files changed for contrast:', changed);
