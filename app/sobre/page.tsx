import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import {
  Shield,
  Heart,
  Zap,
  Eye,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Sobre a Autoescola Itamarati | 58 Anos de História e Tradição',
  description:
    'Conheça a história da Autoescola Itamarati, fundada há mais de cinco décadas em Guaianases. Valores éticos, equipe humanizada e mais de 60.000 alunos habilitados.',
};

export default function SobrePage() {
  const settings = db.getSettings();

  const values = [
    {
      icon: Shield,
      title: 'Integridade',
      description: 'Agimos com retidão, seriedade e transparência em todas as relações com alunos e com o poder público.',
      color: 'text-brand-700 bg-brand-50',
    },
    {
      icon: Heart,
      title: 'Respeito',
      description: 'Valorizamos cada ser humano, acolhendo desde o jovem ansioso de 18 anos até o aluno da terceira idade com o mesmo carinho.',
      color: 'text-rose-600 bg-rose-50',
    },
    {
      icon: Zap,
      title: 'Coragem',
      description: 'Inovamos com tecnologia, simulador de direção e métodos que transformam o medo em segurança no trânsito.',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      icon: Eye,
      title: 'Transparência',
      description: 'Sem taxas ocultas ou promessas irreais. Condições claras e orientação verdadeira em cada etapa do DETRAN.',
      color: 'text-emerald-700 bg-emerald-50',
    },
  ];

  return (
    <div className="py-12 sm:py-16 space-y-16">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
          Nossa Trajetória
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-4">
          Conduzindo gerações há mais de 58 anos
        </h1>
        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
          Fundada há 58 anos em Guaianases, a Autoescola Itamarati construiu sua história acreditando que o ato de dirigir representa liberdade, dignidade e oportunidade para as famílias da Zona Leste paulistana.
        </p>
      </section>

      {/* Stats Counter Bar */}
      <section className="bg-brand-950 text-white py-12 border-y border-brand-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">58 Anos</span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">De história e tradição</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">+60.000</span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Alunos habilitados</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">+1.000.000</span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Aulas práticas realizadas</p>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-400">100%</span>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">Credenciamento oficial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Details Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-slate-700 leading-relaxed text-base">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Uma história construída sobre pessoas e respeito
            </h2>
            <p>
              Com mais de 60.000 alunos formados, temos o orgulho de ver pais, filhos e até netos de uma mesma família passando pelas nossas salas de aula e veículos de treinamento.
            </p>
            <p>
              Entendemos que ensinar alguém a dirigir não é apenas cumprir uma ementa técnica do código de trânsito: é lidar com a expectativa, a ansiedade e os sonhos de independência das pessoas.
            </p>
            <p>
              Por isso, valorizamos instrutores que combinam técnica apurada com paciência e didática acolhedora, além de uma recepção sempre pronta para resolver qualquer dúvida sem burocracia.
            </p>

            <div className="pt-2">
              <a
                href={`https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
                  'Olá! Li a história da Autoescola Itamarati no site e gostaria de conhecer mais sobre os cursos.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold bg-accent-500 text-ink shadow-soft hover:bg-accent-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar com a equipe</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-3xl overflow-hidden shadow-subtle border border-slate-200 aspect-[4/5]">
              <img
                src="/images/hero-facade.png"
                alt="Fachada da Autoescola Itamarati em Guaianases"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-subtle border border-slate-200 aspect-[4/5] translate-y-6">
              <img
                src="/images/insta/insta-02.jpg"
                alt="Post da Itamarati: tire sua habilitação"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-subtle border border-slate-200 aspect-[4/5]">
              <img
                src="/images/insta/insta-04.jpg"
                alt="Post da Itamarati: CNH de carro e moto"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-subtle border border-slate-200 aspect-[4/5] translate-y-6">
              <img
                src="/images/insta/insta-07.jpg"
                alt="Post da Itamarati: curso de motofrete"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Values Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Cultura e Princípios
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Nossos Princípios Éticos
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              A conduta da Autoescola Itamarati é pautada por compromissos diários compartilhados por todos os nossos colaboradores.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle space-y-3"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${val.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{val.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community & Social Responsibility */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-900 to-brand-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Compromisso Social
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Educação para o trânsito que salva vidas
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Mais do que preparar para a prova do DETRAN, nossa missão é formar motoristas conscientes, empáticos com pedestres e ciclistas, e responsáveis pela preservação da vida nas ruas e avenidas de São Paulo.
            </p>
          </div>

          <Link
            href="/servicos"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-accent-500 text-ink shadow-soft hover:bg-accent-400 transition-all"
          >
            <span>Conhecer nossos serviços</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
