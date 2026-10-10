export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { Calendar, User, ArrowLeft, ExternalLink, Share2, ShieldCheck } from 'lucide-react';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await db.getNewsArticleBySlug((await params).slug);
  if (!article || article.status !== 'publicado') {
    return {
      title: 'Artigo não encontrado | Autoescola Itamarati',
    };
  }

  return {
    title: `${article.seoTitle || article.title} | Autoescola Itamarati`,
    description: article.seoDescription || article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      images: [{ url: article.coverImage }],
    },
  };
}

export const revalidate = 0;

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const article = await db.getNewsArticleBySlug((await params).slug);

  if (!article || article.status !== 'publicado') {
    notFound();
  }

  const relatedArticles = (await db.getNewsArticles({ onlyPublished: true }))
    .filter((a) => a.id !== article.id)
    .slice(0, 3);

  return (
    <article className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para todas as notícias</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-100 text-brand-900">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Publicado em {article.publishedAt}
              </span>
              {article.updatedAt && article.updatedAt !== article.publishedAt && (
                <>
                  <span>•</span>
                  <span>Atualizado em {article.updatedAt}</span>
                </>
              )}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {article.summary}
          </p>

          <div className="pt-2 flex items-center justify-between border-t border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-800 text-white flex items-center justify-center font-bold text-xs">
                {article.author.charAt(0)}
              </div>
              <span>Por <strong className="text-slate-800">{article.author}</strong></span>
            </div>

            {article.sourceUrl && (
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-brand-700 hover:text-brand-900 font-semibold"
              >
                <span>Fonte oficial da informação</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </header>

        {/* Featured Image */}
        <div className="rounded-3xl overflow-hidden shadow-soft bg-slate-900 aspect-[16/9]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formatted Content Body */}
        <div className="prose prose-lg max-w-none text-slate-700 space-y-6 leading-relaxed whitespace-pre-line text-base sm:text-lg">
          {article.content}
        </div>

        {/* Official Source Callout if available */}
        {article.sourceUrl && (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-sm">
                <strong className="block text-slate-900">Verificação de Fonte Oficial</strong>
                <span className="text-slate-500">Esta matéria foi elaborada com base em fontes regulatórias e governamentais.</span>
              </div>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white text-brand-900 border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <span>Acessar fonte externa</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Related News */}
        {relatedArticles.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">Outras publicações recomendadas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/noticias/${rel.slug}`}
                  className="group bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-brand-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-800 transition-colors line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-400 mt-4 block">{rel.publishedAt}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
