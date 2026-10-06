// Revert over-eager text-white -> text-ink replacements: keep text-ink only on
// lines whose class list actually has a (non-hover) yellow background.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const mine = new Set(['components/Navbar.tsx', 'components/Footer.tsx', 'components/NextStepSelector.tsx', 'app/page.tsx'].map((f) => path.join(root, f)));
function walk(dir, out = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.tsx')) out.push(p);
  }
  return out;
}
const yellowBg = /(^|[\s"'`])bg-accent-(400|500|600)(?=[\s"'`]|$)/;
for (const f of [...walk(path.join(root, 'app')), ...walk(path.join(root, 'components'))]) {
  if (mine.has(f)) continue;
  const lines = fs.readFileSync(f, 'utf8').split('\n');
  let n = 0;
  const out = lines.map((l) => {
    if (/(^|\s)text-ink(?=[\s"'`]|$)/.test(l) && !yellowBg.test(l)) {
      n++;
      return l.replace(/(^|\s)text-ink(?=[\s"'`]|$)/g, '$1text-white');
    }
    return l;
  });
  if (n) {
    fs.writeFileSync(f, out.join('\n'));
    console.log('reverted', n, 'in', path.relative(root, f));
  }
}
// Home + navbar: fix the three spots by hand-picked strings
const fix = (f, a, b) => {
  const p = path.join(root, f);
  const s = fs.readFileSync(p, 'utf8');
  if (!s.includes(a)) return console.log('NOT FOUND in', f, a);
  fs.writeFileSync(p, s.split(a).join(b));
};
fix('app/page.tsx', 'rounded-full bg-ink text-ink flex', 'rounded-full bg-ink text-white flex');
fix('app/page.tsx', 'bg-brand-900 text-ink py-20', 'bg-brand-900 text-white py-20');
fix('components/Navbar.tsx', 'rounded-full bg-ink text-ink pl-5', 'rounded-full bg-ink text-white pl-5');
