import 'server-only';
import { cache } from 'react';
import seed from '@/data/db.json';
import { getSupabase, isDatabaseConfigured } from './supabase';
import type { HeroConfig, SiteSettings, Service, Course, GalleryItem, NewsArticle, Testimonial, FaqItem } from './types';

type Collections = { services: Service; courses: Course; gallery: GalleryItem; news: NewsArticle; testimonials: Testimonial; faqs: FaqItem };
const columns: Record<keyof Collections, Record<string, string>> = {
  services: { categoryLabel: 'category_label', shortDesc: 'short_desc', fullDesc: 'full_desc', forWhom: 'for_whom', whatsappMessage: 'whatsapp_message' },
  courses: { shortDesc: 'short_desc', fullDesc: 'full_desc', cargaHoraria: 'carga_horaria', publicoAlvo: 'publico_alvo', isFeatured: 'is_featured' },
  gallery: { categoryLabel: 'category_label', imageUrl: 'image_url', studentName: 'student_name', categoryBadge: 'category_badge', isFeaturedHome: 'is_featured_home', autorizadoUsoImagem: 'autorizado_uso_imagem', createdAt: 'created_at' },
  news: { coverImage: 'cover_image', publishedAt: 'published_at', updatedAt: 'updated_at', isFeaturedHome: 'is_featured_home', seoTitle: 'seo_title', seoDescription: 'seo_description', sourceUrl: 'source_url' },
  testimonials: { avatarUrl: 'avatar_url' }, faqs: {},
};
function encode(table: keyof Collections, item: object) {
  return Object.fromEntries(Object.entries(item).map(([key, value]) => [columns[table][key] || key, value]));
}
function decode<K extends keyof Collections>(table: K, row: object): Collections[K] {
  const reverse = Object.fromEntries(Object.entries(columns[table]).map(([key, value]) => [value, key]));
  return Object.fromEntries(Object.entries(row).map(([key, value]) => [reverse[key] || key, value])) as unknown as Collections[K];
}
async function readList<K extends keyof Collections>(table: K): Promise<Collections[K][]> {
  // A missing connection supports read-only local previews. A configured DB failure
  // never silently falls back to old data (drafts/consent must stay authoritative).
  if (!isDatabaseConfigured()) return structuredClone(seed[table]) as unknown as Collections[K][];
  const rows: Collections[K][] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await getSupabase().from(table).select('*').order('id').range(offset, offset + 499);
    if (error) throw new Error('DATABASE_READ_FAILED');
    rows.push(...(data || []).map(row => decode(table, row)));
    if (!data || data.length < 500) return rows;
  }
}
async function readSingleton<T>(table: string, id: string, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) return structuredClone(fallback);
  const { data, error } = await getSupabase().from(table).select('data').eq('id', id).single();
  if (error || !data) throw new Error('DATABASE_READ_FAILED');
  return data.data as T;
}
const list = cache(readList);
const singleton = cache(readSingleton);
async function saveSingleton<T>(table: string, id: string, data: T): Promise<T> {
  const { error } = await getSupabase().from(table).upsert({ id, data, updated_at: new Date().toISOString() });
  if (error) throw new Error('DATABASE_WRITE_FAILED');
  return data;
}
async function save<K extends keyof Collections>(table: K, item: Collections[K]): Promise<Collections[K]> {
  const { error } = await getSupabase().from(table).upsert(encode(table, item));
  if (error) throw new Error('DATABASE_WRITE_FAILED');
  return item;
}
async function remove(table: keyof Collections, id: string): Promise<boolean> {
  const { data, error } = await getSupabase().from(table).delete().eq('id', id).select('id');
  if (error) throw new Error('DATABASE_WRITE_FAILED');
  return Boolean(data?.length);
}
export const db = {
  getHeroConfig: () => singleton<HeroConfig>('hero_config', 'main_hero', seed.hero),
  updateHeroConfig: (data: HeroConfig) => saveSingleton('hero_config', 'main_hero', data),
  getSettings: () => singleton<SiteSettings>('site_settings', 'main_settings', seed.settings),
  updateSettings: (data: SiteSettings) => saveSingleton('site_settings', 'main_settings', data),
  getServices: async (onlyActive = true) => (await list('services')).filter(x => !onlyActive || x.active === true),
  getServiceBySlug: async (slug: string) => (await list('services')).find(x => x.slug === slug && x.active === true),
  saveService: (item: Service) => save('services', item),
  deleteService: (id: string) => remove('services', id),
  getCourses: async (onlyActive = true) => (await list('courses')).filter(x => !onlyActive || x.active === true),
  getCourseBySlug: async (slug: string) => (await list('courses')).find(x => x.slug === slug && x.active === true),
  saveCourse: (item: Course) => save('courses', item),
  deleteCourse: (id: string) => remove('courses', id),
  getGalleryItems: async (options?: { onlyAuthorized?: boolean; onlyFeaturedHome?: boolean; category?: string }) =>
    (await list('gallery')).filter(x => (!options?.onlyAuthorized || x.autorizadoUsoImagem === true) && (!options?.onlyFeaturedHome || x.isFeaturedHome === true) && (!options?.category || ['todos','todas'].includes(options.category) || x.category === options.category)).sort((a,b) => a.order - b.order),
  saveGalleryItem: (item: GalleryItem) => save('gallery', item),
  deleteGalleryItem: (id: string) => remove('gallery', id),
  getNewsArticles: async (options?: { onlyPublished?: boolean; onlyFeaturedHome?: boolean; search?: string; category?: string }) =>
    (await list('news')).filter(x => (!options?.onlyPublished || x.status === 'publicado') && (!options?.onlyFeaturedHome || x.isFeaturedHome === true) && (!options?.category || ['todos','todas'].includes(options.category) || x.category === options.category) && (!options?.search || (x.title + ' ' + x.summary).toLowerCase().includes(options.search.toLowerCase()))).sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)),
  getNewsArticleBySlug: async (slug: string) => (await list('news')).find(x => x.slug === slug && x.status === 'publicado'),
  saveNewsArticle: (item: NewsArticle) => save('news', item),
  deleteNewsArticle: (id: string) => remove('news', id),
  getTestimonials: async (onlyActive = true) => (await list('testimonials')).filter(x => !onlyActive || x.active === true),
  saveTestimonial: (item: Testimonial) => save('testimonials', item),
  deleteTestimonial: (id: string) => remove('testimonials', id),
  getFaqs: async (onlyActive = true) => (await list('faqs')).filter(x => !onlyActive || x.active === true).sort((a,b) => a.order - b.order),
  saveFaq: (item: FaqItem) => save('faqs', item),
  deleteFaq: (id: string) => remove('faqs', id),
};
