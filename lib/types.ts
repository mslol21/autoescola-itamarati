export type ServiceCategory = 'primeira-habilitacao' | 'adicao' | 'renovacao' | 'reciclagem' | 'especiais';

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  forWhom: string;
  requirements: string[];
  stages: string[];
  faqs: { q: string; a: string }[];
  highlight: boolean;
  active: boolean;
  whatsappMessage: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  shortDesc: string;
  fullDesc: string;
  cargaHoraria: string;
  modalidade: string;
  homologacao: string;
  investimento: string;
  ementa: string[];
  publicoAlvo: string;
  requisitos: string[];
  active: boolean;
  isFeatured: boolean;
  badge?: string;
}

export type GalleryCategory = 'conquistas' | 'equipe' | 'estrutura' | 'aulas' | 'eventos';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  imageUrl: string;
  studentName?: string;
  categoryBadge?: string;
  caption: string;
  isFeaturedHome: boolean;
  autorizadoUsoImagem: boolean; // Fotos sem autorização registrada NÃO são publicadas no site público!
  order: number;
  createdAt: string;
}

export type ArticleStatus = 'rascunho' | 'publicado' | 'arquivado';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown or rich text
  coverImage: string;
  category: string;
  author: string;
  status: ArticleStatus;
  publishedAt: string;
  updatedAt: string;
  isFeaturedHome: boolean;
  seoTitle?: string;
  seoDescription?: string;
  sourceUrl?: string; // Link da fonte quando houver informação externa oficial
}

export interface Testimonial {
  id: string;
  author: string;
  category: string; // Ex: "Categoria A / B", "Categoria B", "Categoria A"
  text: string;
  rating: number; // 5
  avatarUrl?: string;
  active: boolean;
  date?: string;
}

export interface FaqItem {
  id: string;
  topic: string; // Ex: "Primeira Habilitação", "Cursos Homologados", "Documentos & Prazos", "Aulas Práticas"
  question: string;
  answer: string;
  order: number;
  active: boolean;
}

export interface HeroConfig {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaPrimaryHref: string;
  ctaSecondaryText: string;
  ctaSecondaryHref: string;
  heroImageUrl: string;
  heroImageAlt: string;
}

export interface SiteSettings {
  name: string;
  cnpj: string;
  address: string;
  district: string;
  city: string;
  state: string;
  cep: string;
  phone: string;
  phoneClean: string;
  whatsapp: string;
  whatsappClean: string;
  email: string;
  openingHoursWeekday: string;
  openingHoursSaturday: string;
  openingHoursSunday: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl: string;
  stats: {
    years: number;
    graduatedStudents: string;
    completedClasses: string;
    trainingHours: string;
  };
}

export interface AdminSession {
  authenticated: boolean;
  username: string;
  role: string;
  loginTime: number;
}
