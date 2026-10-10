import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('SQL migration: private tables, restrictive storage, atomic limits and non-destructive reapplication',async()=>{
 const db=new PGlite();
 try{
 await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
 CREATE SCHEMA storage; GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role;
 CREATE TABLE storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
 CREATE TABLE storage.objects(id text primary key,bucket_id text);
 ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
 GRANT SELECT,INSERT,UPDATE,DELETE ON storage.objects TO anon,authenticated,service_role;
 CREATE POLICY legacy_broad_policy ON storage.objects FOR ALL TO anon,authenticated USING(true) WITH CHECK(true);`);
 const sql=await readFile(new URL('../supabase/migrations/20261010133117_security_privacy_persistence.sql',import.meta.url),'utf8');
 await db.exec(sql);
 await db.exec(`INSERT INTO public.contact_leads(id,name,email) VALUES('lead-test','Private person','private@example.test');
 INSERT INTO public.site_settings(id,data) VALUES('main_settings','{"name":"Existing business"}');
 INSERT INTO storage.objects(id,bucket_id) VALUES('private-photo','itamarati-media'),('other-photo','another-bucket');`);
 await db.exec(sql);
 assert.equal((await db.query('SELECT data FROM public.site_settings')).rows[0].data.name,'Existing business');
 const roles=await db.query("SELECT relname,relrowsecurity FROM pg_class JOIN pg_namespace n ON n.oid=relnamespace WHERE n.nspname='public' AND relkind='r'");
 assert.equal(roles.rows.length,12);assert.ok(roles.rows.every(row=>row.relrowsecurity));
 for(const role of ['anon','authenticated']){
  await db.exec(`SET ROLE ${role}`);
  for(const table of ['admin_users','admin_sessions','contact_leads','gallery','news','site_settings'])await assert.rejects(()=>db.query(`SELECT * FROM public.${table}`),/permission denied/);
  await assert.rejects(()=>db.query("INSERT INTO public.contact_leads(id,name) VALUES('attack','Attack')"),/permission denied/);
  await assert.rejects(()=>db.query("SELECT public.consume_request_limit(repeat('a',64),5,900)"),/permission denied/);
  assert.deepEqual((await db.query('SELECT id FROM storage.objects ORDER BY id')).rows,[{id:'other-photo'}]);
  await assert.rejects(()=>db.query("INSERT INTO storage.objects(id,bucket_id) VALUES('attack','itamarati-media')"),/row-level security/);
  await db.exec('RESET ROLE');
 }
 await db.exec('SET ROLE service_role');
 assert.equal((await db.query('SELECT count(*) AS n FROM public.contact_leads')).rows[0].n,1);
 for(let i=0;i<7;i++) assert.equal((await db.query("SELECT public.consume_request_limit(repeat('a',64),5,900) AS allowed")).rows[0].allowed,i<5);
 await db.exec('RESET ROLE');
 assert.equal((await db.query("SELECT public FROM storage.buckets WHERE id='itamarati-media'")).rows[0].public,false);
 }finally{await db.close();}
});
