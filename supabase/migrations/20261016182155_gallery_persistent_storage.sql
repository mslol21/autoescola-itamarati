-- Apply to the existing Itamarati project before deploying this change.
-- Existing records are preserved; do not overwrite consent or seed over live data.
begin;
create table if not exists public.gallery (
  id text primary key, title text not null, category text, category_label text,
  image_url text not null, student_name text, category_badge text, caption text,
  is_featured_home boolean default false, autorizado_uso_imagem boolean default false,
  "order" int default 0, created_at text
);
alter table public.gallery alter column autorizado_uso_imagem set default false;
alter table public.gallery enable row level security;
revoke all on table public.gallery from anon, authenticated;
grant select, insert, update, delete on table public.gallery to service_role;
create index if not exists gallery_image_url_idx on public.gallery(image_url);

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('itamarati-media', 'itamarati-media', false, 4194304, array['image/webp', 'image/jpeg', 'image/png', 'image/gif'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
-- Even a broad existing permissive policy must not grant access to private media.
create policy "itamarati_media_server_only" on storage.objects
as restrictive for all to anon, authenticated
using (bucket_id <> 'itamarati-media') with check (bucket_id <> 'itamarati-media');
commit;
