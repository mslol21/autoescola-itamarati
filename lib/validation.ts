import { z } from 'zod';
const text = z.string().max(2000);
const short = z.string().trim().min(1).max(200);
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180);
export function safeUrl(value: string, local = true) {
  if (!value || /[\\\u0000-\u0020\u007f]/.test(value)) return false;
  if (local && (/^\/(?!\/)/.test(value) || /^#[a-zA-Z0-9_-]+$/.test(value))) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
const url = z.string().max(2048).refine(v => safeUrl(v));
const optionalUrl = z.union([url, z.literal('')]).default('');
const strings = z.array(text).max(100);
export const serviceSchema = z.object({ id: id.optional(), slug, title: short, category: z.enum(['primeira-habilitacao','adicao','renovacao','reciclagem','especiais']), categoryLabel: short, shortDesc: text, fullDesc: text, forWhom: text, requirements: strings, stages: strings, faqs: z.array(z.object({ q: short, a: text })).max(50), highlight: z.boolean().default(false), active: z.boolean().default(false), whatsappMessage: text });
export const courseSchema = z.object({ id: id.optional(), slug, title: short, kicker: text, shortDesc: text, fullDesc: text, cargaHoraria: text, modalidade: text, homologacao: text, investimento: text, ementa: strings, publicoAlvo: text, requisitos: strings, active: z.boolean().default(false), isFeatured: z.boolean().default(false), badge: text.optional() });
export const gallerySchema = z.object({ id: id.optional(), title: short, category: z.enum(['conquistas','equipe','estrutura','aulas','eventos']), categoryLabel: short, imageUrl: url, studentName: text.optional(), categoryBadge: text.optional(), caption: text, isFeaturedHome: z.boolean().default(false), autorizadoUsoImagem: z.boolean().default(false), order: z.number().int().min(0).max(100000), createdAt: date.optional() });
export const newsSchema = z.object({ id: id.optional(), slug, title: short, summary: text, content: z.string().max(100000), coverImage: optionalUrl, category: short, author: short, status: z.enum(['rascunho','publicado','arquivado']).default('rascunho'), publishedAt: date.optional(), updatedAt: date.optional(), isFeaturedHome: z.boolean().default(false), seoTitle: text.optional(), seoDescription: text.optional(), sourceUrl: optionalUrl });
export const testimonialSchema = z.object({ id: id.optional(), author: short, category: text, text, rating: z.number().int().min(1).max(5), avatarUrl: optionalUrl, active: z.boolean().default(false), date: z.union([date,z.literal('')]).optional() });
export const faqSchema = z.object({ id: id.optional(), topic: short, question: short, answer: text, order: z.number().int().min(0).max(100000), active: z.boolean().default(false) });
export const heroSchema = z.object({ badge: text, title: short, titleHighlight: text, subtitle: text, ctaPrimaryText: short, ctaPrimaryHref: url, ctaSecondaryText: short, ctaSecondaryHref: url, heroImageUrl: url, heroImageAlt: short });
export const settingsSchema = z.object({ name: short, cnpj: text, address: text, district: text, city: text, state: z.string().length(2), cep: text, phone: text, phoneClean: z.string().regex(/^\d{10,13}$/), whatsapp: text, whatsappClean: z.string().regex(/^\d{10,15}$/), email: z.string().email().max(254), openingHoursWeekday: text, openingHoursSaturday: text, openingHoursSunday: text, instagramUrl: optionalUrl, facebookUrl: optionalUrl, googleMapsUrl: url, googleMapsEmbedUrl: url.refine(v => { try { const u = new URL(v); return ['www.google.com','maps.google.com'].includes(u.hostname) && u.pathname.startsWith('/maps'); } catch { return false; } }), stats: z.object({ years: z.number().int().min(0).max(300), graduatedStudents: text, completedClasses: text, trainingHours: text }) });
export const contactSchema = z.object({ name: z.string().trim().min(2).max(120), phone: z.string().max(30).regex(/^[+()\d\s.-]*$/).default(''), email: z.union([z.string().email().max(254),z.literal('')]).default(''), service: z.enum(['primeira-cnh','adicao-categoria','renovacao','reciclagem','idosos','cursos-pro','outros']), message: z.string().max(3000).default('') }).refine(v => v.phone.replace(/\D/g,'').length >= 10 || Boolean(v.email));
export const loginSchema = z.object({ username: z.string().trim().min(1).max(100), password: z.string().min(1).max(128) });
export const passwordSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: z.string().min(12).max(128) });
export const idSchema = id;
