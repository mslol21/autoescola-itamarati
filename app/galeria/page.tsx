export const dynamic = 'force-dynamic';
import React from 'react';
import { db } from '@/lib/db';
import GalleryLightbox from '@/components/GalleryLightbox';
import { Camera, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Galeria de Conquistas & Estrutura | Autoescola Itamarati',
  description:
    'Veja fotos reais dos nossos alunos habilitados, aulas práticas, instalações, simulador de direção e equipe da Autoescola Itamarati em Guaianases.',
};

export const revalidate = 0;

export default async function GaleriaPage() {
  // Only photos with authorized image use are shown in the public gallery!
  const items = await db.getGalleryItems({ onlyAuthorized: true });

  return (
    <div className="py-12 sm:py-16 space-y-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Nossa Comunidade & Espaço
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Galeria de Conquistas e Instalações
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Fotos reais dos nossos alunos comemorando a aprovação, bastidores das aulas práticas, frota e instalações da Autoescola Itamarati.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GalleryLightbox items={items} />
      </section>

      {/* Privacy note */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Todas as imagens exibidas contam com autorização prévia de uso de imagem registrada.</span>
        </div>
      </section>
    </div>
  );
}
