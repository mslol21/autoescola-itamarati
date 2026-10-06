import React from 'react';
import { db } from '@/lib/db';
import CoursesSection from '@/components/CoursesSection';
import { ShieldCheck, Laptop, CheckCircle2, Clock, MessageCircle } from 'lucide-react';

export const metadata = {
  title: 'Cursos Profissionalizantes Senatran | Autoescola Itamarati',
  description:
    'Cursos 100% online homologados pela Senatran: Transporte Coletivo de Passageiros (TCP), Produtos Perigosos (MOPP), Emergência, Escolar, Cargas Indivisíveis e NRs.',
};

export default function CursosPage() {
  const courses = db.getCourses(true);
  const settings = db.getSettings();

  const waGeneral = `https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
    'Olá! Gostaria de consultar informações sobre os CURSOS PROFISSIONALIZANTES homologados pela Senatran.'
  )}`;

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Homologação Senatran Oficial
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Cursos Profissionalizantes para Condutores
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Invista na sua carreira ao volante. Formação à distância com padrão profissional, foco em segurança e homologação oficial integrada aos órgãos de trânsito.
        </p>
      </section>

      {/* Differentials Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-950 text-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center text-amber-400">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">100% Online e Flexível</h3>
            <p className="text-xs text-slate-300">Estude no celular, tablet ou computador quando puder, sem sair de casa.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Validade Nacional</h3>
            <p className="text-xs text-slate-300">Cursos homologados pela Senatran e válidos em todo o território nacional.</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-900 flex items-center justify-center text-accent-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-white">Certificado Oficial</h3>
            <p className="text-xs text-slate-300">Emissão rápida e inserção dos dados na base nacional do Renach.</p>
          </div>
        </div>
      </section>

      {/* Course Catalog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Catálogo Completo de Cursos
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Clique em &ldquo;Saiba mais&rdquo; para ver ementa, carga horária e requisitos de cada modalidade.
          </p>
        </div>

        <CoursesSection courses={courses} whatsappClean={settings.whatsappClean} />
      </section>

      {/* Help Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-8 text-center max-w-2xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-slate-900">Ficou com alguma dúvida sobre qual curso escolher?</h3>
          <p className="text-sm text-slate-600">
            Nossa equipe esclarece quais cursos atendem à sua categoria de CNH e à área em que você deseja trabalhar.
          </p>
          <a
            href={waGeneral}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-accent-500 text-ink hover:bg-accent-400 transition-colors shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar com especialista em cursos</span>
          </a>
        </div>
      </section>
    </div>
  );
}
