-- Existing content tables: create only if missing; never overwrite editorial data.
CREATE TABLE IF NOT EXISTS site_settings (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    
CREATE TABLE IF NOT EXISTS hero_config (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    
CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        short_desc TEXT,
        full_desc TEXT,
        for_whom TEXT,
        requirements JSONB DEFAULT '[]'::jsonb,
        stages JSONB DEFAULT '[]'::jsonb,
        faqs JSONB DEFAULT '[]'::jsonb,
        highlight BOOLEAN DEFAULT false,
        active BOOLEAN DEFAULT true,
        whatsapp_message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    
CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        kicker TEXT,
        short_desc TEXT,
        full_desc TEXT,
        carga_horaria TEXT,
        modalidade TEXT,
        homologacao TEXT,
        investimento TEXT,
        ementa JSONB DEFAULT '[]'::jsonb,
        publico_alvo TEXT,
        requisitos JSONB DEFAULT '[]'::jsonb,
        active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,
        badge TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    
CREATE TABLE IF NOT EXISTS gallery (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT,
        category_label TEXT,
        image_url TEXT NOT NULL,
        student_name TEXT,
        category_badge TEXT,
        caption TEXT,
        is_featured_home BOOLEAN DEFAULT false,
        autorizado_uso_imagem BOOLEAN DEFAULT false,
        "order" INT DEFAULT 0,
        created_at TEXT
      );
    
CREATE TABLE IF NOT EXISTS news (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        cover_image TEXT,
        category TEXT,
        author TEXT,
        status TEXT DEFAULT 'rascunho',
        published_at TEXT,
        updated_at TEXT,
        is_featured_home BOOLEAN DEFAULT false,
        seo_title TEXT,
        seo_description TEXT,
        source_url TEXT
      );
    
CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        author TEXT NOT NULL,
        category TEXT,
        text TEXT NOT NULL,
        rating INT DEFAULT 5,
        active BOOLEAN DEFAULT true,
        date TEXT
      );
    
CREATE TABLE IF NOT EXISTS faqs (
        id TEXT PRIMARY KEY,
        topic TEXT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        "order" INT DEFAULT 0,
        active BOOLEAN DEFAULT true
      );
    
CREATE TABLE IF NOT EXISTS admin_users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    
CREATE TABLE IF NOT EXISTS contact_leads (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        service TEXT,
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.gallery ALTER COLUMN autorizado_uso_imagem SET DEFAULT false;
UPDATE public.gallery SET autorizado_uso_imagem = false WHERE autorizado_uso_imagem IS NULL;
ALTER TABLE public.gallery ALTER COLUMN autorizado_uso_imagem SET NOT NULL;
ALTER TABLE public.news ALTER COLUMN status SET DEFAULT 'rascunho';

CREATE TABLE IF NOT EXISTS public.admin_sessions (
 token_hash TEXT PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
 admin_id TEXT NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
 credential_version TEXT NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_sessions_expiry_idx ON public.admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS admin_sessions_admin_idx ON public.admin_sessions(admin_id);
CREATE TABLE IF NOT EXISTS public.request_limits (
 key TEXT PRIMARY KEY,
 hits INTEGER NOT NULL,
 expires_at TIMESTAMPTZ NOT NULL
);
CREATE INDEX IF NOT EXISTS request_limits_expiry_idx ON public.request_limits(expires_at);

-- Only the server may query these tables. An authenticated Supabase user is NOT
-- automatically a site administrator; app sessions are checked in the server API.
DO $$
DECLARE t text; p record;
BEGIN
 FOREACH t IN ARRAY ARRAY['site_settings','hero_config','services','courses','gallery','news','testimonials','faqs','admin_users','contact_leads','admin_sessions','request_limits'] LOOP
   EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
   EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', t);
   EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO service_role', t);
   FOR p IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t LOOP
     EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, t);
   END LOOP;
 END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.consume_request_limit(p_key text, p_limit integer, p_seconds integer)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE current_hits integer;
BEGIN
 IF p_key !~ '^[a-f0-9]{64}$' OR p_limit < 1 OR p_limit > 100 OR p_seconds < 1 OR p_seconds > 3600 THEN
   RAISE EXCEPTION 'Invalid rate limit';
 END IF;
 DELETE FROM public.request_limits WHERE expires_at < now();
 DELETE FROM public.admin_sessions WHERE expires_at < now();
 INSERT INTO public.request_limits AS limits (key,hits,expires_at)
 VALUES(p_key,1,now()+make_interval(secs=>p_seconds))
 ON CONFLICT(key) DO UPDATE SET hits = limits.hits+1
 RETURNING hits INTO current_hits;
 RETURN current_hits <= p_limit;
END $$;
REVOKE ALL ON FUNCTION public.consume_request_limit(text,integer,integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_request_limit(text,integer,integer) TO service_role;

-- Private bucket: image authorization is checked on every /api/media request.
INSERT INTO storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
VALUES ('itamarati-media','itamarati-media',false,8388608,ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT(id) DO UPDATE SET public=false, file_size_limit=8388608, allowed_mime_types=EXCLUDED.allowed_mime_types;
-- Restrictive policies protect this bucket even if another bucket has a broad permissive policy.
DROP POLICY IF EXISTS itamarati_private_media ON storage.objects;
CREATE POLICY itamarati_private_media ON storage.objects AS RESTRICTIVE FOR ALL TO anon, authenticated
USING (bucket_id <> 'itamarati-media') WITH CHECK (bucket_id <> 'itamarati-media');

-- Keep legacy photos behind the same authorization check without altering the image.
UPDATE public.gallery SET image_url = replace(image_url,'/images/insta/','/api/media/') WHERE image_url LIKE '/images/insta/%';
UPDATE public.news SET cover_image = replace(cover_image,'/images/insta/','/api/media/') WHERE cover_image LIKE '/images/insta/%';
UPDATE public.hero_config SET data = jsonb_set(data,'{heroImageUrl}',to_jsonb(replace(data->>'heroImageUrl','/images/insta/','/api/media/'))) WHERE data->>'heroImageUrl' LIKE '/images/insta/%';
UPDATE public.testimonials SET avatar_url = replace(avatar_url,'/images/insta/','/api/media/') WHERE avatar_url LIKE '/images/insta/%';

-- Carry forward the owner's already-approved corrections when switching from JSON
-- to the existing database. Only the obsolete values are updated.
UPDATE public.site_settings SET data=jsonb_set(data,'{stats,years}','59'::jsonb) WHERE data#>>'{stats,years}'='58';
UPDATE public.site_settings SET data=jsonb_set(data,'{stats,graduatedStudents}','"+80.000"'::jsonb) WHERE data#>>'{stats,graduatedStudents}'='+60.000';
UPDATE public.services SET active=false WHERE slug='alteracao-pcd-para-manual';
UPDATE public.services SET stages=replace(stages::text,'Curso teórico presencial ou EAD com simulados interativos','Curso teórico CFC somente online (EAD), com simulados interativos')::jsonb WHERE stages::text LIKE '%Curso teórico presencial ou EAD com simulados interativos%';
UPDATE public.hero_config SET data=jsonb_set(data,'{subtitle}',to_jsonb(replace(data->>'subtitle','Aulas práticas e teóricas, orientação acolhedora','Aulas práticas e curso teórico CFC somente online, orientação acolhedora'))) WHERE data->>'subtitle' LIKE '%Aulas práticas e teóricas, orientação acolhedora%';
UPDATE public.news SET summary=replace(replace(summary,'58 anos','59 anos'),'60.000','80.000'), content=replace(replace(content,'58 anos','59 anos'),'60.000','80.000') WHERE summary LIKE '%58 anos%' OR summary LIKE '%60.000%' OR content LIKE '%58 anos%' OR content LIKE '%60.000%';
