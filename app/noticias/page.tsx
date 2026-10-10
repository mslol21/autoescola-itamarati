export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Calendar, User, Search, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Novidades & Dicas de Trânsito | Autoescola Itamarati',
  description:
    'Notícias oficiais, atualizações sobre legislação de trânsito, regras de renovação de CNH e dicas para as aulas práticas da Autoescola Itamarati.',
};

export const revalidate = 0;

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const search = (await searchParams)?.q;
  const category = (await searchParams)?.category;

  const articles = await db.getNewsArticles({
    onlyPublished: true,
    search,
    category,
  });

  const allArticles = await db.getNewsArticles({ onlyPublished: true });
  const categories = ['todas', ...Array.from(new Set(allArticles.map((a) => a.category)))];

  return (
    <div className="py-12 sm:py-16 space-y-12">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Educação & Informação
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Novidades e Dicas de Trânsito
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Mantenha-se informado sobre normas do DETRAN, alterações no Código de Trânsito Brasileiro e orientações práticas de direção defensiva.
        </p>
      </section>

      {/* Search and Category Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive = (category || 'todas') === cat;
              return (
                <Link
                  key={cat}
                  href={cat === 'todas' ? '/noticias' : `/noticias?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'todas' ? 'Todas as matérias' : cat}
                </Link>
              );
            })}
          </div>

          {/* Search Bar Form */}
          <form method="GET" action="/noticias" className="w-full md:w-72">
            <div className="relative">
              <input
                type="text"
                name="q"
                defaultValue={search || ''}
                placeholder="Buscar notícias..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </form>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium">Nenhuma notícia encontrada com os filtros selecionados.</p>
            <Link href="/noticias" className="mt-3 inline-block text-xs font-bold text-brand-700 hover:underline">
              Limpar filtros de busca
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-subtle hover:shadow-soft transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-4 left-4 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand-900 text-white shadow-sm">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.publishedAt}
                      </span>
                      <span>•</span>
                      <span>{article.author}</span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                      <Link href={`/noticias/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between">
                  <Link
                    href={`/noticias/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-accent-800 group-hover:text-ink"
                  >
                    <span>Ler matéria completa</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {article.sourceUrl && (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1" title="Contém fonte oficial externa">
                      <ExternalLink className="w-3 h-3" />
                      Fonte oficial
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
