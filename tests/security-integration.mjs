import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { randomBytes, scryptSync } from 'node:crypto';
import sharp from 'sharp';

// Fake only the remote transport. Exercise the real Next server, validation,
// sessions, database adapter, storage proxy and HTTP responses end to end.
const seed = JSON.parse(await readFile(new URL('../data/db.json',import.meta.url),'utf8'));
const mappings = {
 services:{categoryLabel:'category_label',shortDesc:'short_desc',fullDesc:'full_desc',forWhom:'for_whom',whatsappMessage:'whatsapp_message'},
 courses:{shortDesc:'short_desc',fullDesc:'full_desc',cargaHoraria:'carga_horaria',publicoAlvo:'publico_alvo',isFeatured:'is_featured'},
 gallery:{categoryLabel:'category_label',imageUrl:'image_url',studentName:'student_name',categoryBadge:'category_badge',isFeaturedHome:'is_featured_home',autorizadoUsoImagem:'autorizado_uso_imagem',createdAt:'created_at'},
 news:{coverImage:'cover_image',publishedAt:'published_at',updatedAt:'updated_at',isFeaturedHome:'is_featured_home',seoTitle:'seo_title',seoDescription:'seo_description',sourceUrl:'source_url'},testimonials:{avatarUrl:'avatar_url'},faqs:{}
};
const tables={site_settings:[{id:'main_settings',data:seed.settings}],hero_config:[{id:'main_hero',data:seed.hero}],admin_sessions:[],contact_leads:[]};
for(const [name,map] of Object.entries(mappings)) tables[name]=seed[name].map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[map[k]||k,v])));
const password='Local-test-password-'+randomBytes(12).toString('hex');
const salt=randomBytes(16).toString('hex');
tables.admin_users=[{id:'primary_admin',username:'admin',password_hash:`scrypt$${salt}$${scryptSync(password,salt,64).toString('hex')}`}];
let failTable=null,allowRate=true;
const objects=new Map();
const backend=createServer(async(req,res)=>{
 try {
  assert.equal(req.headers.apikey,'integration-server-key');
  const url=new URL(req.url,'http://localhost');
  const chunks=[];for await(const chunk of req)chunks.push(chunk);const raw=Buffer.concat(chunks);
  if(url.pathname.startsWith('/storage/v1/object/')){
   const key=url.pathname.split('/').pop();
   if(req.method==='POST'){objects.set(key,raw);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({Key:key}));return;}
   if(objects.has(key)){res.setHeader('Content-Type','image/webp');res.end(objects.get(key));return;}
   res.statusCode=404;res.end('{}');return;
  }
  res.setHeader('Content-Type','application/json');
  if(url.pathname.includes('/rpc/')){res.end(JSON.stringify(allowRate));return;}
  const name=url.pathname.split('/').pop();
  if(name===failTable){res.statusCode=503;res.end(JSON.stringify({message:'simulated database outage'}));return;}
  if(!tables[name]){res.statusCode=404;res.end('{}');return;}
  const matches=row=>[...url.searchParams].every(([key,val])=>!val.startsWith('eq.')||String(row[key])===val.slice(3));
  let result=[];
  if(req.method==='GET')result=tables[name].filter(matches);
  else if(req.method==='POST'){
   const input=JSON.parse(raw);for(const row of Array.isArray(input)?input:[input]){
    const key=name==='admin_sessions'?'token_hash':'id';const index=tables[name].findIndex(x=>x[key]===row[key]);
    if(index>=0)tables[name][index]={...tables[name][index],...row};else tables[name].push(row);result.push(row);
   }
  }else if(req.method==='PATCH'){const patch=JSON.parse(raw);for(const row of tables[name].filter(matches)){Object.assign(row,patch);result.push(row);}}
  else if(req.method==='DELETE'){result=tables[name].filter(matches);tables[name]=tables[name].filter(x=>!matches(x));}
  if(req.method==='GET'){
   const offset=Number(url.searchParams.get('offset')||0),limit=Number(url.searchParams.get('limit')||1000);result=result.slice(offset,offset+limit);
  }
  if(req.headers.accept?.includes('vnd.pgrst.object+json')){if(result.length!==1){res.statusCode=406;res.end('{}');return;}result=result[0];}
  res.end(JSON.stringify(result));
 }catch(e){res.statusCode=500;res.end('{}');console.error('Mock backend failure',e.message);}
});
await new Promise(resolve=>backend.listen(0,'127.0.0.1',resolve));
const backendUrl=`http://127.0.0.1:${backend.address().port}`;
const port=3218,origin=`http://127.0.0.1:${port}`;
let server;let logs='';
const launch=async()=>{
 server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,SUPABASE_URL:backendUrl,SUPABASE_SERVICE_ROLE_KEY:'integration-server-key',APP_ORIGIN:origin,NODE_ENV:'production'}});
 server.stdout.on('data',d=>logs+=d);server.stderr.on('data',d=>logs+=d);
 for(let i=0;i<100;i++){try{const r=await fetch(origin+'/api/auth/session');if(r.ok)return;}catch{}await new Promise(r=>setTimeout(r,100));}
 throw Error('Application did not start');
};
const stop=async()=>{if(!server)return;server.kill('SIGTERM');await new Promise(r=>server.once('exit',r));server=null;};
const request=(path,{method='GET',cookie,body,origin:requestOrigin=origin,...rest}={})=>fetch(origin+path,{method,headers:{...(method!=='GET'?{Origin:requestOrigin}:{}),...(cookie?{Cookie:cookie}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{}),...rest});
const cookieOf=r=>r.headers.get('set-cookie').split(';')[0];
let count=0;const ok=msg=>{count++;console.log('PASS '+msg)};
try{
 await launch();
 for(const path of ['/','/sobre','/servicos','/cursos','/galeria','/noticias','/contato'])assert.equal((await request(path)).status,200,path);ok('public pages render');
 for(const name of Object.keys(mappings).concat(['hero','settings']))assert.equal((await request('/api/admin/'+name)).status,401,name);ok('all admin reads deny anonymous access');
 const forged=Buffer.from(JSON.stringify({username:'admin',role:'admin',createdAt:Date.now()})+'.fake').toString('base64');
 assert.equal((await request('/api/admin/settings',{cookie:'itam_admin_session='+forged})).status,401);ok('legacy or forged cookie rejected');
 assert.equal((await request('/api/auth/login',{method:'POST',origin:'https://attacker.test',body:{username:'admin',password}})).status,403);ok('cross-origin login rejected');
 assert.equal((await request('/api/auth/login',{method:'POST',body:{username:'admin',password:'wrong'}})).status,401);ok('wrong password rejected');
 const login=await request('/api/auth/login',{method:'POST',body:{username:'admin',password}});assert.equal(login.status,200);let cookie=cookieOf(login);
 assert.match(login.headers.get('set-cookie'),/HttpOnly/);assert.match(login.headers.get('set-cookie'),/Secure/);assert.match(login.headers.get('set-cookie'),/SameSite=strict/i);ok('secure login cookie');
 assert.equal((await request('/api/admin/settings',{cookie})).status,200);
 const malicious={...seed.hero,ctaPrimaryHref:'javascript:alert(1)'};
 assert.equal((await request('/api/admin/hero',{method:'PUT',cookie,body:malicious})).status,400);ok('unsafe stored URL rejected');
 const modified={...seed.settings,phone:'(11) 2554-2278 TEST'};
 assert.equal((await request('/api/admin/settings',{method:'PUT',cookie,body:modified})).status,200);
 await stop();await launch();
 assert.equal((await(await request('/api/admin/settings',{cookie})).json()).phone,modified.phone);ok('saved data and session survive server restart');
 failTable='site_settings';
 assert.equal((await request('/api/admin/settings',{method:'PUT',cookie,body:seed.settings})).status,503);failTable=null;ok('database failure never reports successful save');
 failTable='contact_leads';
 assert.equal((await request('/api/contact',{method:'POST',body:{name:'Privacy Test',phone:'11999999999',email:'privacy@example.test',service:'outros',message:'Private message'}})).status,503);failTable=null;ok('contact failure never reports success');
 assert.equal((await request('/api/contact',{method:'POST',body:{name:'Privacy Test',phone:'11999999999',email:'privacy@example.test',service:'outros',message:'Private message'}})).status,200);
 assert.equal(logs.includes('privacy@example.test'),false);assert.equal(logs.includes('11999999999'),false);ok('contact PII absent from server logs');
 tables.gallery.push({id:'private-photo',image_url:'/api/media/private.webp',autorizado_uso_imagem:false});objects.set('private.webp',Buffer.from('private'));
 assert.equal((await request('/api/media/private.webp')).status,404);ok('unauthorized photo inaccessible by direct URL');
 const picture=await sharp({create:{width:2,height:2,channels:3,background:'#ff0000'}}).jpeg().toBuffer();
 const form=new FormData();form.set('file',new Blob([picture],{type:'image/jpeg'}),'picture.jpg');
 const upload=await fetch(origin+'/api/admin/upload',{method:'POST',headers:{Origin:origin,Cookie:cookie},body:form});assert.equal(upload.status,200);const uploaded=await upload.json();
 assert.equal((await request(uploaded.url)).status,404);ok('uploaded image stays private until publication');
 const item={...seed.gallery[0],id:'test-consent',imageUrl:uploaded.url,autorizadoUsoImagem:true};
 assert.equal((await request('/api/admin/gallery',{method:'POST',cookie,body:item})).status,200);
 const visible=await request(uploaded.url);assert.equal(visible.status,200);assert.match(visible.headers.get('cache-control'),/no-store/);
 assert.equal((await request('/api/admin/gallery',{method:'POST',cookie,body:{...item,autorizadoUsoImagem:false}})).status,200);
 assert.equal((await request(uploaded.url)).status,404);ok('consent withdrawal blocks previously published media');
 assert.equal((await request('/api/auth/change-password',{method:'POST',cookie,body:{currentPassword:password,newPassword:password+'new'}})).status,200);
 assert.equal((await request('/api/admin/settings',{cookie})).status,401);ok('password change revokes old sessions');
 const login2=await request('/api/auth/login',{method:'POST',body:{username:'admin',password:password+'new'}});cookie=cookieOf(login2);
 assert.equal((await request('/api/auth/logout',{method:'POST',cookie})).status,200);
 assert.equal((await request('/api/admin/settings',{cookie})).status,401);ok('logout revokes replayed session');
 allowRate=false;assert.equal((await request('/api/auth/login',{method:'POST',body:{username:'admin',password}})).status,429);ok('shared rate limit enforced');
 console.log(`${count} integration checks passed`);
} finally {await stop();await new Promise(r=>backend.close(r));}
