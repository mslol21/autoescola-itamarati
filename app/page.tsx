export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import NextStepSelector from '@/components/NextStepSelector';
import CoursesSection from '@/components/CoursesSection';
import FaqAccordion from '@/components/FaqAccordion';
import GoogleMapOnDemand from '@/components/GoogleMapOnDemand';
import { ArrowRight, ArrowUpRight, MapPin, Phone, Clock, MessageCircle } from 'lucide-react';

export const revalidate = 0; // Ensure fresh data on each request

const fmtDate = (d: string) => {
  const dt = new Date(`${d}T12:00:00`);
  return isNaN(dt.getTime()) ? d : dt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

function SectionHead({
  num,
  kicker,
  title,
  id,
  dark = false,
  action,
}: {
  num: string;
  kicker: string;
  title: React.ReactNode;
  id: string;
  dark?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
      <div className="max-w-3xl">
        <p className={`kicker ${dark ? 'text-accent-400' : 'text-brand-700'}`}>
          {num} — {kicker}
        </p>
        <h2 id={id} className={`mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] ${dark ? 'text-white' : 'text-ink'}`}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export default async function HomePage() {
  const [hero, settings, allGallery, featuredNews, testimonials, faqs, courses] = await Promise.all([
    db.getHeroConfig(), db.getSettings(), db.getGalleryItems({ onlyAuthorized: true }),
    db.getNewsArticles({ onlyPublished: true, onlyFeaturedHome: true }),
    db.getTestimonials(true), db.getFaqs(true), db.getCourses(true),
  ]);
  const featuredGallery = allGallery.filter(item => item.isFeaturedHome);
  const insideGallery = allGallery.filter((i) => ['estrutura', 'equipe', 'aulas'].includes(i.category)).slice(0, 3);
  const featuredCourses = courses.filter(c => c.isFeatured);

  const mainNews = featuredNews[0];
  const secondaryNews = featuredNews.slice(1, 4);
  const [quote, ...otherQuotes] = testimonials;

  const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
    'Olá! Vim pelo site da Itamarati e quero começar meu processo de habilitação. Podem me orientar?'
  )}`;

  const ticker = [
    'Primeira habilitação',
    'Categoria A — moto',
    'Categoria B — carro',
    'Adição de categoria',
    'Renovação',
    'Reciclagem',
    'Cursos profissionalizantes',
    'Guaianases · Zona Leste',
  ];

  const experience = [
    {
      t: 'Gente de verdade no atendimento',
      d: 'Você é recebido na recepção ou no WhatsApp por uma equipe que explica documentos, etapas e condições sem pressa e sem termos complicados.',
    },
    {
      t: 'Instrutores que respeitam seu ritmo',
      d: 'Tem quem chegue com medo, tem quem já sabe o básico. As aulas práticas são conduzidas com paciência — de quem tem 18 a quem tem 70.',
    },
    {
      t: 'Carro e moto no mesmo lugar',
      d: 'Categorias A, B ou as duas juntas. Também atendemos quem já tem CNH e quer adicionar categoria, renovar ou fazer reciclagem.',
    },
    {
      t: 'Horários que cabem na sua rotina',
      d: 'Atendimento de segunda a sábado. A equipe organiza a grade de aulas com você para conciliar com trabalho e estudos.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative bg-paper overflow-hidden" aria-labelledby="hero-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 lg:pt-20 lg:pb-24">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="kicker text-brand-700">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-500 ring-2 ring-ink" aria-hidden="true" />
                {hero.badge}
              </p>
              <h1
                id="hero-heading"
                className="mt-6 text-[2.75rem] leading-[0.95] sm:text-7xl lg:text-[5.5rem] font-extrabold text-ink tracking-[-0.035em]"
              >
                {hero.title} <span className="marker">{hero.titleHighlight}</span>
              </h1>
              <p className="mt-7 text-lg sm:text-xl text-slate-700 max-w-xl leading-relaxed">{hero.subtitle}</p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <a href={hero.ctaPrimaryHref} className="btn-yellow text-base" data-event="cta_click" data-event-label="hero_primary">
                  {hero.ctaPrimaryText}
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </a>
                <Link href={hero.ctaSecondaryHref} className="btn-outline text-base">
                  {hero.ctaSecondaryText}
                </Link>
              </div>

              <dl className="mt-12 grid grid-cols-3 max-w-lg border-t-2 border-ink pt-5">
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Desde</dt>
                  <dd className="font-display text-3xl sm:text-4xl font-extrabold text-ink">1967</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">De estrada</dt>
                  <dd className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{settings.stats.years} anos</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-slate-600">Habilitados</dt>
                  <dd className="font-display text-3xl sm:text-4xl font-extrabold text-ink">{settings.stats.graduatedStudents}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-[400px] lg:max-w-none lg:ml-auto lg:w-[88%]">
                <div className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 rounded-[2rem] bg-accent-500 border-2 border-ink" aria-hidden="true" />
                <figure className="relative rounded-[2rem] overflow-hidden border-2 border-ink bg-ink aspect-[4/5]">
                  <img
                    src={hero.heroImageUrl}
                    alt={hero.heroImageAlt}
                    width={335}
                    height={597}
                    fetchPriority="high"
                    className="w-full h-full object-cover object-[50%_35%]"
                  />
                  <figcaption className="absolute left-3 right-3 bottom-3 flex items-center gap-2 rounded-full bg-white/95 border-2 border-ink px-4 py-2.5 text-sm font-semibold text-ink">
                    <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">Nossa unidade · {settings.address.split('(')[0].trim()}</span>
                  </figcaption>
                </figure>
                <div
                  className="absolute -top-5 -left-4 sm:-left-8 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-ink text-white flex flex-col items-center justify-center text-center -rotate-12 border-4 border-paper"
                  aria-hidden="true"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent-400">Autoescola</span>
                  <span className="font-display text-2xl sm:text-3xl font-extrabold leading-none">CFC</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">desde 1967</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TICKER ============ */}
      <div className="bg-accent-500 border-y-2 border-ink overflow-hidden" aria-label="Serviços">
        <ul className="sr-only">
          {ticker.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="flex w-max animate-marquee py-3.5" aria-hidden="true">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i} className="flex items-center font-display text-lg sm:text-xl font-extrabold text-ink uppercase tracking-tight whitespace-nowrap">
              <span className="px-6">{t}</span>
              <span className="text-ink/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ============ 01 SELECTOR ============ */}
      <NextStepSelector whatsappClean={settings.whatsappClean} />

      {/* ============ 02 EXPERIENCE ============ */}
      <section id="experiencia" className="bg-white py-20 sm:py-28" aria-labelledby="experience-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="kicker text-brand-700">02 — A experiência Itamarati</p>
              <h2 id="experience-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink leading-[0.98]">
                Aprender a dirigir sem <span className="marker">perrengue.</span>
              </h2>
              <p className="mt-6 text-lg text-slate-700 max-w-md">
                Desde 1967 em Guaianases. Muita coisa mudou no trânsito — o jeito de receber cada aluno, não.
              </p>
              <Link href="/sobre" className="mt-8 inline-flex items-center gap-2 font-bold text-ink underline underline-offset-[6px] decoration-accent-500 decoration-[3px] hover:decoration-ink">
                Conhecer nossa história <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ol className="lg:col-span-7 border-t-2 border-ink">
            {experience.map((e, i) => (
              <li key={e.t} className="grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-4 py-8 border-b border-slate-200">
                <span className="font-display text-4xl sm:text-5xl font-extrabold text-accent-500 [-webkit-text-stroke:1.5px_#0d1117] leading-none">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-ink">{e.t}</h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">{e.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ 03 CONQUESTS (stories rail) ============ */}
      {featuredGallery.length > 0 && (
        <section className="bg-paper py-20 sm:py-28 overflow-hidden" aria-labelledby="conquests-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              num="03"
              kicker="No nosso dia a dia"
              id="conquests-heading"
              title={
                <>
                  Conquistas que <span className="marker">merecem aparecer.</span>
                </>
              }
              action={
                <Link href="/galeria" className="btn-ink shrink-0">
                  Ver todas as conquistas <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              }
            />
          </div>
          <ul className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] pb-4">
            {featuredGallery.map((item, i) => (
              <li key={item.id} className={`snap-start shrink-0 w-[68vw] sm:w-[280px] ${i % 2 === 1 ? 'sm:mt-10' : ''}`}>
                <Link href="/galeria" className="group block">
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border-2 border-ink bg-ink">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {item.categoryBadge && (
                      <span className="absolute top-3 left-3 rounded-full bg-accent-500 border-2 border-ink px-3 py-1 text-xs font-bold text-ink">
                        {item.categoryBadge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-display text-lg font-bold text-ink leading-snug">{item.title}</p>
                  {item.studentName && <p className="text-sm font-semibold text-brand-700">{item.studentName}</p>}
                  <p className="text-sm text-slate-600 line-clamp-2">{item.caption}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ============ 04 INSIDE ============ */}
      <section className="bg-brand-900 text-white py-20 sm:py-28" aria-labelledby="inside-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <p className="kicker text-accent-400">04 — Conheça por dentro</p>
            <h2 id="inside-heading" className="mt-4 text-4xl sm:text-5xl font-extrabold leading-[0.98]">
              Passa aqui pra tomar um café e conhecer a gente.
            </h2>
            <p className="mt-6 text-lg text-brand-100">
              Nossa unidade fica na esquina da R. Saturnino Pereira com a R. Joaquim Leite, na divisa de Guaianases com o Lajeado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/galeria" className="btn-yellow">
                Abrir a galeria completa <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" data-event="directions_click" className="inline-flex items-center gap-2 rounded-full border-2 border-white/40 px-6 py-4 font-bold hover:bg-white hover:text-ink transition-colors">
                Como chegar <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2 grid grid-cols-5 gap-4 items-end">
            {insideGallery[0] && (
              <img
                src={insideGallery[0].imageUrl}
                alt={insideGallery[0].title}
                loading="lazy"
                className="col-span-3 w-full aspect-[3/4] object-cover rounded-2xl border-2 border-white/10"
              />
            )}
            <div className="col-span-2 grid gap-4">
              {insideGallery.slice(1, 3).map((p) => (
                <img key={p.id} src={p.imageUrl} alt={p.title} loading="lazy" className="w-full aspect-[4/5] object-cover object-top rounded-2xl border-2 border-white/10" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 05 HOW TO START ============ */}
      <section className="bg-accent-500 text-ink py-20 sm:py-28 border-y-2 border-ink" aria-labelledby="steps-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="kicker text-ink/70">05 — Como começar</p>
          <h2 id="steps-heading" className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[0.98] max-w-3xl">
            Três passos e você já está no caminho.
          </h2>
          <ol className="mt-14 grid md:grid-cols-3 gap-10 md:gap-6">
            {[
              ['Conte qual é seu objetivo', 'Primeira CNH, adicionar categoria, renovar ou fazer um curso? Mande uma mensagem ou passe na unidade.'],
              ['Receba orientação', 'A equipe explica o serviço indicado para o seu caso, as etapas, documentos e as condições.'],
              ['Combine os próximos passos', 'Com tudo claro, vocês alinham juntos o início e os horários das aulas.'],
            ].map(([t, d], i) => (
              <li key={t} className="border-t-2 border-ink pt-6">
                <span className="font-display text-7xl font-extrabold leading-none">{i + 1}</span>
                <h3 className="mt-4 text-2xl font-bold">{t}</h3>
                <p className="mt-2 text-ink/80 leading-relaxed">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-event-label="steps" className="btn-ink text-base">
              <MessageCircle className="w-5 h-5 text-accent-400" aria-hidden="true" />
              Dar o primeiro passo no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ============ 06 TESTIMONIALS ============ */}
      {quote && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="testimonials-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="kicker text-brand-700">06 — Quem passou por aqui</p>
            <h2 id="testimonials-heading" className="sr-only">Depoimentos de alunos</h2>
            <figure className="mt-8 grid lg:grid-cols-12 gap-8">
              <blockquote className="lg:col-span-9 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink leading-[1.12] tracking-tight">
                <span className="text-accent-500 [-webkit-text-stroke:1.5px_#0d1117]">“</span>
                {quote.text}”
              </blockquote>
              <figcaption className="lg:col-span-3 lg:self-end border-l-4 border-accent-500 pl-4">
                <p className="font-bold text-ink text-lg">{quote.author}</p>
                <p className="text-sm text-slate-600">
                  {quote.category}
                  {quote.date ? ` · ${quote.date}` : ''}
                </p>
              </figcaption>
            </figure>
            {otherQuotes.length > 0 && (
              <div className="mt-16 columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {otherQuotes.slice(0, 6).map((t) => (
                  <figure key={t.id} className="break-inside-avoid mb-6 rounded-2xl bg-paper p-6">
                    <blockquote className="text-slate-800 leading-relaxed">“{t.text}”</blockquote>
                    <figcaption className="mt-4 text-sm">
                      <span className="font-bold text-ink">{t.author}</span>
                      <span className="text-slate-500"> · {t.category}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ COURSES ============ */}
      {featuredCourses.length > 0 && (
        <section className="bg-paper py-20 sm:py-28" aria-labelledby="courses-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              num="07"
              kicker="Qualificação profissional"
              id="courses-heading"
              title="Cursos para quem vive da direção."
              action={
                <Link href="/cursos" className="btn-outline shrink-0">
                  Ver todos os cursos <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              }
            />
            <CoursesSection courses={featuredCourses} whatsappClean={settings.whatsappClean} limit={3} />
          </div>
        </section>
      )}

      {/* ============ 08 NEWS ============ */}
      {mainNews && (
        <section className="bg-white py-20 sm:py-28" aria-labelledby="news-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHead
              num="08"
              kicker="Novidades e dicas"
              id="news-heading"
              title="O que está rolando na Itamarati."
              action={
                <Link href="/noticias" className="btn-outline shrink-0">
                  Ver todas as publicações <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              }
            />
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
              <Link href={`/noticias/${mainNews.slug}`} className="group lg:col-span-7 grid sm:grid-cols-2 gap-6 items-start">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-2 border-ink bg-ink">
                  <img src={mainNews.coverImage} alt="" loading="lazy" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="flex flex-col h-full">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-700">
                    {mainNews.category} · <time dateTime={mainNews.publishedAt}>{fmtDate(mainNews.publishedAt)}</time>
                  </p>
                  <h3 className="mt-3 text-3xl font-extrabold text-ink leading-tight group-hover:underline decoration-accent-500 decoration-4 underline-offset-4">
                    {mainNews.title}
                  </h3>
                  <p className="mt-3 text-slate-600 leading-relaxed">{mainNews.summary}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-ink">
                    Ler publicação <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
              <ul className="lg:col-span-5 border-t-2 border-ink">
                {secondaryNews.map((n) => (
                  <li key={n.id} className="border-b border-slate-200">
                    <Link href={`/noticias/${n.slug}`} className="group flex gap-4 py-5 items-center">
                      <img src={n.coverImage} alt="" loading="lazy" className="w-20 h-24 shrink-0 rounded-xl object-cover object-top border-2 border-ink" />
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-brand-700">
                          {n.category} · <time dateTime={n.publishedAt}>{fmtDate(n.publishedAt)}</time>
                        </p>
                        <h3 className="mt-1 font-display text-lg font-bold text-ink leading-snug group-hover:underline decoration-accent-500 decoration-[3px] underline-offset-4">
                          {n.title}
                        </h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ============ 09 FAQ ============ */}
      <section className="bg-paper py-20 sm:py-28" aria-labelledby="faq-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="kicker text-brand-700">09 — Dúvidas frequentes</p>
            <h2 id="faq-heading" className="mt-4 text-4xl sm:text-5xl font-extrabold text-ink leading-[0.98]">
              Pergunta que a gente responde todo dia.
            </h2>
            <p className="mt-6 text-slate-700">Não achou a sua? Manda no WhatsApp que a equipe responde.</p>
          </div>
          <div className="lg:col-span-8">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ============ 10 LOCATION ============ */}
      <section className="bg-white py-20 sm:py-28" aria-labelledby="location-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <p className="kicker text-brand-700">10 — Onde estamos</p>
            <h2 id="location-heading" className="mt-4 text-4xl sm:text-5xl font-extrabold text-ink leading-[0.98]">
              Pertinho de você, em Guaianases.
            </h2>
            <dl className="mt-10 divide-y divide-slate-200 border-y-2 border-ink">
              <div className="py-5 flex gap-4">
                <MapPin className="w-5 h-5 mt-1 shrink-0 text-brand-700" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Endereço</dt>
                  <dd className="font-semibold text-ink">{settings.address}</dd>
                  <dd className="text-sm text-slate-600">
                    {settings.district} · {settings.city}/{settings.state} · CEP {settings.cep}
                  </dd>
                </div>
              </div>
              <div className="py-5 flex gap-4">
                <Phone className="w-5 h-5 mt-1 shrink-0 text-brand-700" aria-hidden="true" />
                <div>
                  <dt className="sr-only">Telefones</dt>
                  <dd>
                    <a href={`tel:${settings.phoneClean}`} className="font-semibold text-ink hover:underline">Tel. {settings.phone}</a>
                  </dd>
                  <dd>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-event-label="location" className="font-semibold text-ink hover:underline">
                      WhatsApp {settings.whatsapp}
                    </a>
                  </dd>
                </div>
              </div>
              <div className="py-5 flex gap-4">
                <Clock className="w-5 h-5 mt-1 shrink-0 text-brand-700" aria-hidden="true" />
                <div className="text-sm text-slate-700">
                  <dt className="sr-only">Horários</dt>
                  <dd>{settings.openingHoursWeekday}</dd>
                  <dd>{settings.openingHoursSaturday}</dd>
                  <dd className="text-slate-500">{settings.openingHoursSunday}</dd>
                </div>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" data-event="directions_click" className="btn-yellow">
                Como chegar <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a href={waUrl} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-event-label="location_btn" className="btn-outline">
                Chamar no WhatsApp
              </a>
            </div>
          </div>
          <div className="lg:col-span-7">
            <GoogleMapOnDemand
              embedUrl={settings.googleMapsEmbedUrl}
              directUrl={settings.googleMapsUrl}
              address={`${settings.address}, ${settings.district}, São Paulo - SP`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
