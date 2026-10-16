import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { GalleryItem } from './types';

export const MEDIA_BUCKET = 'itamarati-media';

// Only the server may read private photos or write gallery records.
export function getMediaClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('GALLERY_STORAGE_NOT_CONFIGURED');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store', signal: init?.signal || AbortSignal.timeout(10000) }) },
  });
}

function fromRow(row: Record<string, any>): GalleryItem {
  return {
    id: row.id, title: row.title, category: row.category,
    categoryLabel: row.category_label || '', imageUrl: row.image_url,
    studentName: row.student_name || '', categoryBadge: row.category_badge || '',
    caption: row.caption || '', isFeaturedHome: row.is_featured_home === true,
    autorizadoUsoImagem: row.autorizado_uso_imagem === true,
    order: row.order || 0, createdAt: row.created_at || '',
  };
}

export async function getGalleryItems(options?: {
  onlyAuthorized?: boolean; onlyFeaturedHome?: boolean; category?: string;
}): Promise<GalleryItem[]> {
  const client = getMediaClient();
  const items: GalleryItem[] = [];
  // PostgREST caps each response; paginate so older photos do not disappear.
  for (let offset = 0; ; offset += 500) {
    let query = client.from('gallery').select('*').order('order').order('id').range(offset, offset + 499);
    if (options?.onlyAuthorized) query = query.eq('autorizado_uso_imagem', true);
    if (options?.onlyFeaturedHome) query = query.eq('is_featured_home', true);
    if (options?.category && options.category !== 'todos') query = query.eq('category', options.category);
    const { data, error } = await query;
    if (error || !data) throw new Error('GALLERY_READ_FAILED');
    items.push(...data.map(fromRow));
    if (data.length < 500) return items;
  }
}

export async function saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
  const { data, error } = await getMediaClient().from('gallery').upsert({
    id: item.id, title: item.title, category: item.category,
    category_label: item.categoryLabel, image_url: item.imageUrl,
    student_name: item.studentName || '', category_badge: item.categoryBadge || '',
    caption: item.caption || '', is_featured_home: item.isFeaturedHome === true,
    autorizado_uso_imagem: item.autorizadoUsoImagem === true,
    order: item.order, created_at: item.createdAt,
  }).select('*').single();
  if (error || !data) throw new Error('GALLERY_WRITE_FAILED');
  return fromRow(data);
}

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const { error } = await getMediaClient().from('gallery').delete().eq('id', id);
  if (error) throw new Error('GALLERY_DELETE_FAILED');
  // Keep the private object: another entry may still reference the same photo.
  return true;
}

export async function galleryMediaVisibility(url: string): Promise<'public' | 'private' | 'unreferenced'> {
  const { data, error } = await getMediaClient().from('gallery')
    .select('autorizado_uso_imagem').eq('image_url', url);
  if (error || !data) throw new Error('MEDIA_AUTHORIZATION_FAILED');
  if (data.some(row => row.autorizado_uso_imagem !== true)) return 'private';
  return data.length ? 'public' : 'unreferenced';
}
