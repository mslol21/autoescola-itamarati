import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { createHmac, randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';

// Exercise the real production Next server; replace only Supabase's network transport.
// No production credentials or customer data are used.
const originalData = await readFile('data/db.json', 'utf8');
const objects = new Map();
let rows = [], failDatabase = false, failStorage = false;
const backend = createServer(async (req, res) => {
  try {
    assert.equal(req.headers.apikey, 'gallery-test-service-key');
    const url = new URL(req.url, 'http://localhost');
    const chunks = []; for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks);
    if (url.pathname.startsWith('/storage/v1/object/')) {
      if (failStorage) { res.writeHead(503, {'Content-Type':'application/json'});res.end('{"message":"Storage unavailable","statusCode":"503"}');return; }
      const name = url.pathname.split('/').pop();
      if (req.method === 'POST') { objects.set(name, raw); res.setHeader('Content-Type','application/json');res.end(JSON.stringify({Key:name}));return; }
      if (objects.has(name)) { res.setHeader('Content-Type','image/webp');res.end(objects.get(name));return; }
      res.writeHead(404, {'Content-Type':'application/json'});res.end('{"message":"Not found","statusCode":"404"}');return;
    }
    assert.equal(url.pathname, '/rest/v1/gallery');
    res.setHeader('Content-Type','application/json');
    if (failDatabase) { res.statusCode = 503;res.end('{"message":"Database unavailable"}');return; }
    const matches = row => [...url.searchParams].every(([key,val]) => !val.startsWith('eq.') || String(row[key]) === val.slice(3));
    let result;
    if (req.method === 'POST') {
      const row = JSON.parse(raw); const at = rows.findIndex(item => item.id === row.id);
      if (at >= 0) rows[at] = row; else rows.push(row);
      result = [row];
    } else if (req.method === 'DELETE') { rows = rows.filter(row => !matches(row));result = []; }
    else {
      const offset = Number(url.searchParams.get('offset') || 0), limit = Number(url.searchParams.get('limit') || 1000);
      result = rows.filter(matches).sort((a,b) => a.order - b.order || a.id.localeCompare(b.id)).slice(offset, offset + limit);
    }
    if (req.headers.accept?.includes('vnd.pgrst.object+json')) result = result[0];
    res.end(JSON.stringify(result));
  } catch (error) { res.statusCode = 500;res.end('{}');console.error(error.message); }
});
await new Promise(resolve => backend.listen(0,'127.0.0.1',resolve));
const backendUrl = `http://127.0.0.1:${backend.address().port}`;
const origin = 'http://127.0.0.1:3219';
const sessionSecret = randomBytes(32).toString('hex');
const payload = JSON.stringify({username:'admin',role:'admin',createdAt:Date.now()});
const token = Buffer.from(payload+'.'+createHmac('sha256', sessionSecret).update(payload).digest('hex')).toString('base64');
const cookie = 'itam_admin_session='+token;
let server, logs = '';
async function launch() {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3219'], {
    env:{...process.env,NODE_ENV:'production',SUPABASE_URL:backendUrl,SUPABASE_SERVICE_ROLE_KEY:'gallery-test-service-key',ADMIN_SESSION_SECRET:sessionSecret}
  });
  server.stdout.on('data', d => logs += d);server.stderr.on('data', d => logs += d);
  for (let n = 0; n < 100; n++) { try { if ((await fetch(origin+'/api/auth/session')).ok) return; } catch {} await new Promise(resolve => setTimeout(resolve,100)); }
  throw new Error('Server did not start: '+logs.slice(-1500));
}
async function stop() { if (!server || server.exitCode !== null) return; const exited = new Promise(resolve => server.once('exit',resolve));server.kill('SIGTERM');await exited;server = null; }
const request = (path, {method='GET',admin=false,body,requestOrigin=origin}={}) => fetch(origin+path, {
  method, headers:{...(admin?{Cookie:cookie}:{}),...(method !== 'GET'?{Origin:requestOrigin}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})
});
const picture = await sharp({create:{width:32,height:24,channels:3,background:'#ffdd00'}}).jpeg().withMetadata({orientation:6}).toBuffer();
async function upload(data=picture,type='image/jpeg',admin=true) {
  const form = new FormData();form.set('file',new Blob([data],{type}),'test.jpg');
  return fetch(origin+'/api/admin/upload',{method:'POST',headers:{Origin:origin,...(admin?{Cookie:cookie}:{})},body:form});
}
let count = 0;function pass(msg) { count++; console.log('PASS '+msg); }
try {
  await launch();
  assert.equal((await upload(picture,'image/jpeg',false)).status,401);
  assert.equal((await request('/api/admin/gallery',{method:'POST',body:{}})).status,401);pass('anonymous mutations denied');
  assert.equal((await request('/api/admin/gallery',{method:'POST',admin:true,requestOrigin:'https://other.test',body:{}})).status,403);pass('cross-origin save denied');
  assert.equal((await upload(Buffer.from('not an image'))).status,400);
  assert.equal((await upload(Buffer.alloc(4*1024*1024+1))).status,400);pass('invalid and oversized files rejected');
  failStorage = true;assert.equal((await upload()).status,503);assert.equal(objects.size,0);failStorage = false;pass('storage failure does not report successful upload');
  const response = await upload();assert.equal(response.status,200);const photo = await response.json();
  assert.equal(objects.size,1);const stored = objects.get(photo.fileName);const metadata = await sharp(stored).metadata();
  assert.equal(metadata.format,'webp');assert.equal(metadata.width,24);assert.equal(metadata.height,32);assert.equal(metadata.exif,undefined);pass('upload stored remotely, oriented and stripped of metadata');
  assert.equal((await request(photo.url)).status,404);assert.equal((await request(photo.url,{admin:true})).status,200);pass('unpublished upload only visible to administrator');
  let item = {id:'integration-photo',title:'Foto de teste persistente',category:'estrutura',categoryLabel:'Estrutura',imageUrl:photo.url,caption:'Teste',order:1,isFeaturedHome:true,autorizadoUsoImagem:false};
  assert.equal((await request('/api/admin/gallery',{method:'POST',admin:true,body:item})).status,200);
  assert.equal((await (await request('/api/admin/gallery')).json()).length,0);
  assert.equal((await (await request('/api/admin/gallery',{admin:true})).json()).length,1);pass('private photo saved but absent from public gallery');
  item.autorizadoUsoImagem=true;
  assert.equal((await request('/api/admin/gallery',{method:'POST',admin:true,body:item})).status,200);
  await stop();await launch();
  assert.equal((await (await request('/api/admin/gallery')).json())[0].imageUrl,photo.url);
  const downloaded = await request(photo.url);assert.equal(downloaded.status,200);assert.deepEqual(Buffer.from(await downloaded.arrayBuffer()),stored);
  for (const page of ['/','/galeria']) { const res=await request(page);assert.equal(res.status,200);assert.ok((await res.text()).includes(photo.fileName)); }
  pass('gallery, homepage and actual image survive process restart');
  failDatabase = true;
  assert.equal((await request('/api/admin/gallery',{method:'POST',admin:true,body:{...item,title:'must not save'}})).status,503);
  assert.equal((await request('/api/admin/gallery')).status,503);
  assert.equal((await request(photo.url)).status,503);
  assert.equal((await request('/')).status,200);
  const unavailablePage = await request('/galeria');assert.equal(unavailablePage.status,200);
  assert.ok((await unavailablePage.text()).includes('Não foi possível carregar as fotos'));
  failDatabase=false;assert.equal(rows[0].title,item.title);pass('database outages return errors without false success or leaked images');
  item.autorizadoUsoImagem=false;
  await request('/api/admin/gallery',{method:'POST',admin:true,body:item});
  const privateImage=await request(photo.url);assert.equal(privateImage.status,404);assert.match(privateImage.headers.get('cache-control'),/no-store/);
  assert.equal((await (await request('/galeria')).text()).includes(photo.fileName),false);pass('withdrawing consent immediately hides photo and blocks its URL');
  assert.equal((await request('/api/admin/gallery?id='+item.id,{method:'DELETE',admin:true})).status,200);
  await stop();await launch();assert.equal((await (await request('/api/admin/gallery',{admin:true})).json()).length,0);
  assert.equal((await request(photo.url)).status,404);pass('deletion persists after restart and orphan object stays private');
  for (let i=0;i<501;i++)rows.push({id:'page-'+String(i).padStart(4,'0'),title:'photo',image_url:'/images/test.jpg',category:'estrutura',autorizado_uso_imagem:true,order:i});
  assert.equal((await (await request('/api/admin/gallery')).json()).length,501);pass('gallery reads beyond one database result page');
  assert.equal(await readFile('data/db.json','utf8'),originalData);pass('gallery never writes local database');
  console.log(`${count} integration checks passed`);
} finally { await stop();await new Promise(resolve=>backend.close(resolve)); }
