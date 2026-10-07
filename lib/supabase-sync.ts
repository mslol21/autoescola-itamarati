import { supabase } from './supabase';
import {
  HeroConfig,
  SiteSettings,
  Service,
  Course,
  GalleryItem,
  NewsArticle,
  Testimonial,
  FaqItem,
} from './types';

export async function syncHeroToSupabase(hero: HeroConfig) {
  try {
    await supabase.from('hero_config').upsert({
      id: 'main_hero',
      data: hero,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Supabase syncHero error:', err);
  }
}

export async function syncSettingsToSupabase(settings: SiteSettings) {
  try {
    await supabase.from('site_settings').upsert({
      id: 'main_settings',
      data: settings,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Supabase syncSettings error:', err);
  }
}

export async function syncServiceToSupabase(service: Service) {
  try {
    await supabase.from('services').upsert({
      id: service.id,
      slug: service.slug,
      title: service.title,
      category: service.category,
      category_label: service.categoryLabel,
      short_desc: service.shortDesc,
      full_desc: service.fullDesc,
      for_whom: service.forWhom,
      requirements: service.requirements || [],
      stages: service.stages || [],
      faqs: service.faqs || [],
      highlight: service.highlight ?? false,
      active: service.active ?? true,
      whatsapp_message: service.whatsappMessage || '',
    });
  } catch (err) {
    console.error('Supabase syncService error:', err);
  }
}

export async function deleteServiceFromSupabase(id: string) {
  try {
    await supabase.from('services').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteService error:', err);
  }
}

export async function syncCourseToSupabase(course: Course) {
  try {
    await supabase.from('courses').upsert({
      id: course.id,
      slug: course.slug,
      title: course.title,
      kicker: course.kicker || '',
      short_desc: course.shortDesc || '',
      full_desc: course.fullDesc || '',
      carga_horaria: course.cargaHoraria || '',
      modalidade: course.modalidade || '',
      homologacao: course.homologacao || '',
      investimento: course.investimento || '',
      ementa: course.ementa || [],
      publico_alvo: course.publicoAlvo || '',
      requisitos: course.requisitos || [],
      active: course.active ?? true,
      is_featured: course.isFeatured ?? false,
      badge: course.badge || '',
    });
  } catch (err) {
    console.error('Supabase syncCourse error:', err);
  }
}

export async function deleteCourseFromSupabase(id: string) {
  try {
    await supabase.from('courses').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteCourse error:', err);
  }
}

export async function syncGalleryToSupabase(item: GalleryItem) {
  try {
    await supabase.from('gallery').upsert({
      id: item.id,
      title: item.title,
      category: item.category,
      category_label: item.categoryLabel,
      image_url: item.imageUrl,
      student_name: item.studentName || '',
      category_badge: item.categoryBadge || '',
      caption: item.caption || '',
      is_featured_home: item.isFeaturedHome ?? false,
      autorizado_uso_imagem: item.autorizadoUsoImagem ?? true,
      order: item.order || 0,
      created_at: item.createdAt || '',
    });
  } catch (err) {
    console.error('Supabase syncGallery error:', err);
  }
}

export async function deleteGalleryFromSupabase(id: string) {
  try {
    await supabase.from('gallery').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteGallery error:', err);
  }
}

export async function syncNewsToSupabase(article: NewsArticle) {
  try {
    await supabase.from('news').upsert({
      id: article.id,
      slug: article.slug,
      title: article.title,
      summary: article.summary || '',
      content: article.content || '',
      cover_image: article.coverImage || '',
      category: article.category || '',
      author: article.author || '',
      status: article.status || 'publicado',
      published_at: article.publishedAt || '',
      updated_at: article.updatedAt || '',
      is_featured_home: article.isFeaturedHome ?? false,
      seo_title: article.seoTitle || '',
      seo_description: article.seoDescription || '',
      source_url: article.sourceUrl || '',
    });
  } catch (err) {
    console.error('Supabase syncNews error:', err);
  }
}

export async function deleteNewsFromSupabase(id: string) {
  try {
    await supabase.from('news').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteNews error:', err);
  }
}

export async function syncTestimonialToSupabase(testimonial: Testimonial) {
  try {
    await supabase.from('testimonials').upsert({
      id: testimonial.id,
      author: testimonial.author,
      category: testimonial.category,
      text: testimonial.text,
      rating: testimonial.rating || 5,
      active: testimonial.active ?? true,
      date: testimonial.date || '',
    });
  } catch (err) {
    console.error('Supabase syncTestimonial error:', err);
  }
}

export async function deleteTestimonialFromSupabase(id: string) {
  try {
    await supabase.from('testimonials').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteTestimonial error:', err);
  }
}

export async function syncFaqToSupabase(faq: FaqItem) {
  try {
    await supabase.from('faqs').upsert({
      id: faq.id,
      topic: faq.topic,
      question: faq.question,
      answer: faq.answer,
      order: faq.order || 0,
      active: faq.active ?? true,
    });
  } catch (err) {
    console.error('Supabase syncFaq error:', err);
  }
}

export async function deleteFaqFromSupabase(id: string) {
  try {
    await supabase.from('faqs').delete().eq('id', id);
  } catch (err) {
    console.error('Supabase deleteFaq error:', err);
  }
}

export async function syncAdminPasswordToSupabase(passwordHash: string) {
  try {
    await supabase.from('admin_users').upsert({
      id: 'primary_admin',
      username: 'admin',
      password_hash: passwordHash,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Supabase syncAdminPassword error:', err);
  }
}

export async function saveLeadToSupabase(lead: {
  name: string;
  phone?: string;
  email?: string;
  service?: string;
  message?: string;
}) {
  try {
    await supabase.from('contact_leads').insert({
      id: `lead-${Date.now()}`,
      name: lead.name,
      phone: lead.phone || '',
      email: lead.email || '',
      service: lead.service || '',
      message: lead.message || '',
    });
  } catch (err) {
    console.error('Supabase saveLead error:', err);
  }
}
