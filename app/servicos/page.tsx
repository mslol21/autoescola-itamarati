export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Car,
  Bike,
  RefreshCw,
  AlertTriangle,
  Heart,
  Settings,
  CheckCircle2,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const metadata = {
  title: 'Serviços de Habilitação | Autoescola Itamarati Guaianases',
  description:
    'Primeira CNH (categorias A, B e AB), adição de categoria, renovação sem burocracia, reciclagem de condutor suspenso e habilitação humanizada para todas as idades.',
};

export default async function ServicosPage() {
  const services = await db.getServices(true);
  const settings = await db.getSettings();

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Formação & Serviços
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Serviços de Habilitação com Suporte Completo
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Da primeira vez que você segura o volante até a renovação e cursos especializados. Conheça as opções pensadas para o seu momento.
        </p>
      </section>

      {/* Services List Detailed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
            service.whatsappMessage || `Olá! Gostaria de saber mais sobre o serviço ${service.title} na Itamarati.`
          )}`;

          return (
            <article
              key={service.id}
              id={service.slug}
              className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-subtle hover:shadow-soft transition-all duration-300"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-800 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
                      {service.categoryLabel}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                      {service.title}
                    </h2>
                    <p className="text-slate-600 text-base leading-relaxed mt-2">
                      {service.fullDesc}
                    </p>
                  </div>

                  {/* Para quem é indicado */}
                  <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 text-sm text-slate-700">
                    <strong className="block text-brand-950 font-bold mb-1">Para quem é indicado:</strong>
                    <span>{service.forWhom}</span>
                  </div>

                  {/* Requirements & Stages */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Requisitos necessários</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        {service.requirements.map((req, rIdx) => (
                          <li key={rIdx}>• {req}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-brand-700" />
                        <span>Etapas do processo</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600">
                        {service.stages.map((stage, sIdx) => (
                          <li key={sIdx}>{sIdx + 1}. {stage}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* FAQs for this service */}
                  {service.faqs && service.faqs.length > 0 && (
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Dúvidas frequentes deste serviço
                      </h3>
                      {service.faqs.map((faq, fIdx) => (
                        <div key={fIdx} className="bg-slate-50 p-4 rounded-xl text-xs sm:text-sm">
                          <strong className="text-slate-900 block mb-1">P: {faq.q}</strong>
                          <p className="text-slate-600">R: {faq.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sidebar Action Card */}
                <div className="lg:col-span-4 bg-gradient-to-br from-brand-900 to-brand-950 text-white rounded-2xl p-6 sm:p-7 space-y-5 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Atendimento Direto</span>
                    <h3 className="text-xl font-bold text-white">Solicitar orientações sobre {service.categoryLabel}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Converse com nossa equipe em Guaianases para consultar turmas, horários de aula e tirar dúvidas sem compromisso.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm bg-accent-500 text-ink shadow-md hover:bg-accent-400 hover:shadow-glow transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Falar sobre este serviço</span>
                    </a>

                    <Link
                      href="/contato"
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <span>Ver horário e localização da autoescola</span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
