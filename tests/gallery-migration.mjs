import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('gallery migration preserves existing records and restricts private media', async () => {
  const db = new PGlite();
  try {
    await db.exec(`CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
      CREATE SCHEMA storage; GRANT USAGE ON SCHEMA storage TO anon,authenticated,service_role;
      CREATE TABLE storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
      CREATE TABLE storage.objects(id text primary key,bucket_id text);
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      GRANT SELECT,INSERT,UPDATE,DELETE ON storage.objects TO anon,authenticated,service_role;
      CREATE POLICY legacy_broad_policy ON storage.objects FOR ALL TO anon,authenticated USING(true) WITH CHECK(true);
      CREATE TABLE public.gallery(id text primary key,title text not null,category text,category_label text,image_url text not null,
        student_name text,category_badge text,caption text,is_featured_home boolean default false,autorizado_uso_imagem boolean default true,"order" int default 0,created_at text);
      INSERT INTO public.gallery(id,title,image_url,autorizado_uso_imagem) VALUES ('existing','Existing photo','/images/existing.jpg',false);
      GRANT ALL ON public.gallery TO anon,authenticated;
      CREATE POLICY legacy_public_gallery ON public.gallery FOR ALL USING(true) WITH CHECK(true);`);
    await db.exec(await readFile(new URL('../supabase/migrations/20261016182155_gallery_persistent_storage.sql',import.meta.url),'utf8'));
    assert.deepEqual((await db.query('SELECT id,autorizado_uso_imagem FROM public.gallery')).rows,[{id:'existing',autorizado_uso_imagem:false}]);
    assert.equal((await db.query("SELECT public FROM storage.buckets WHERE id='itamarati-media'")).rows[0].public,false);
    await db.exec("INSERT INTO storage.objects VALUES('private','itamarati-media'),('other','other-bucket')");
    for (const role of ['anon','authenticated']) {
      await db.exec(`SET ROLE ${role}`);
      await assert.rejects(() => db.query('SELECT * FROM public.gallery'), /permission denied/);
      await assert.rejects(() => db.query("INSERT INTO public.gallery(id,title,image_url) VALUES('attack','x','x')"), /permission denied/);
      assert.deepEqual((await db.query('SELECT id FROM storage.objects')).rows,[{id:'other'}]);
      await assert.rejects(() => db.query("INSERT INTO storage.objects VALUES('attack','itamarati-media')"), /row-level security/);
      await db.exec('RESET ROLE');
    }
    await db.exec('SET ROLE service_role');
    await db.exec("INSERT INTO public.gallery(id,title,image_url) VALUES('new','New photo','/images/new.jpg')");
    assert.equal((await db.query("SELECT autorizado_uso_imagem FROM public.gallery WHERE id='new'")).rows[0].autorizado_uso_imagem,false);
    assert.equal((await db.query('SELECT count(*)::int AS count FROM public.gallery')).rows[0].count,2);
  } finally { await db.close(); }
});
