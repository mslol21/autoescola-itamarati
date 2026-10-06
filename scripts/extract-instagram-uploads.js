// Extracts og:image / description from the Instagram HTML pages uploaded by the user
// and downloads each real photo into public/images/insta/.
const fs = require('fs');
const path = require('path');
const https = require('https');

const dir = process.argv[2];
const outDir = path.join(__dirname, '../public/images/insta');
fs.mkdirSync(outDir, { recursive: true });

function decode(s) {
  return s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d));
}

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return download(res.headers.location, dest).then(resolve);
      if (res.statusCode !== 200) return resolve({ ok: false, status: res.statusCode });
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => { fs.writeFileSync(dest, Buffer.concat(chunks)); resolve({ ok: true, size: fs.statSync(dest).size }); });
    }).on('error', (e) => resolve({ ok: false, error: e.message }));
  });
}

(async () => {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.html')).sort();
  const result = [];
  let i = 1;
  for (const f of files) {
    const html = fs.readFileSync(path.join(dir, f), 'utf-8');
    const img = html.match(/<meta property="og:image" content="([^"]+)"/);
    const desc = html.match(/<meta property="og:description" content="([^"]+)"/) || html.match(/<meta name="description" content="([^"]+)"/);
    const url = html.match(/<meta property="og:url" content="([^"]+)"/);
    if (!img) { console.log(f, 'no og:image'); continue; }
    const name = `insta-${String(i).padStart(2, '0')}.jpg`;
    const r = await download(decode(img[1]), path.join(outDir, name));
    result.push({ file: f, name, ok: r.ok, size: r.size, url: url && decode(url[1]), desc: desc && decode(desc[1]).slice(0, 300) });
    i++;
  }
  fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
})();
