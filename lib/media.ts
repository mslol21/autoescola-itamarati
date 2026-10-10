import 'server-only';
import { db } from './db';
import { getSupabase, isDatabaseConfigured } from './supabase';
export const MEDIA_BUCKET = 'itamarati-media';
export async function isPublicMedia(url: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    const [hero, gallery, news, testimonials] = await Promise.all([
      db.getHeroConfig(), db.getGalleryItems(), db.getNewsArticles(), db.getTestimonials(false),
    ]);
    if (gallery.some(x => x.imageUrl === url && x.autorizadoUsoImagem !== true)) return false;
    return hero.heroImageUrl === url || gallery.some(x => x.imageUrl === url && x.autorizadoUsoImagem === true) ||
      news.some(x => x.coverImage === url && x.status === 'publicado') ||
      testimonials.some(x => x.avatarUrl === url && x.active === true);
  }
  const client = getSupabase();
  // Fetch only references to this image, not entire galleries for every image request.
  const [hero, gallery, news, testimonials] = await Promise.all([
    db.getHeroConfig(),
    client.from('gallery').select('autorizado_uso_imagem').eq('image_url',url),
    client.from('news').select('id').eq('cover_image',url).eq('status','publicado').limit(1),
    client.from('testimonials').select('id').eq('avatar_url',url).eq('active',true).limit(1),
  ]);
  if (gallery.error || news.error || testimonials.error) throw new Error('MEDIA_AUTHORIZATION_FAILED');
  if (gallery.data?.some(x => x.autorizado_uso_imagem !== true)) return false;
  return hero.heroImageUrl === url || Boolean(gallery.data?.some(x => x.autorizado_uso_imagem === true) || news.data?.length || testimonials.data?.length);
}
