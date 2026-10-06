'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles, Car, Bike, RefreshCw, GraduationCap } from 'lucide-react';

interface NextStepSelectorProps {
  whatsappClean?: string;
}

export default function NextStepSelector({ whatsappClean = '5511970539746' }: NextStepSelectorProps) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const steps = [
    {
      id: 'primeira-cnh',
      tabLabel: 'Quero minha 1ª habilitação',
      icon: Car,
      tagline: 'O começo da sua independência ao volante',
      description:
        'Aulas para carro (categoria B), moto (categoria A) ou ambas juntas (A/B). Conte com instrução acolhedora, paciência redobrada para quem está começando do zero e treinamento no simulador antes de ir para a rua.',
      highlights: [
        'Aulas teóricas e simulador interativo de direção',
        'Instrutores pacientes e metodologia focada em confiança',
        'Horários flexíveis de segunda a sábado',
        'Acompanhamento passo a passo até o dia da prova prática',
      ],
      pageUrl: '/servicos#primeira-habilitacao',
      pageLabel: 'Ver detalhes da 1ª Habilitação',
      waMessage:
        'Olá! Selecionei a opção "Quero minha primeira habilitação" no site da Itamarati e gostaria de tirar dúvidas sobre turmas, documentos e valores.',
    },
    {
      id: 'adicao-categoria',
      tabLabel: 'Quero adicionar categoria',
      icon: Bike,
      tagline: 'Amplie suas possibilidades com carro ou moto',
      description:
        'Já possui CNH e quer pilotar moto ou começar a dirigir carro? O processo de adição é simplificado e mais rápido: você não precisa refazer o curso teórico tradicional do CFC, apenas o exame médico e as aulas práticas da nova categoria.',
      highlights: [
        'Sem necessidade de refazer o curso teórico geral',
        'Foco 100% nas aulas práticas da categoria desejada',
        'Pista de treino exclusiva para motocicletas',
        'Veículos novos e revisados para a sua comodidade',
      ],
      pageUrl: '/servicos#adicao-de-categoria',
      pageLabel: 'Conhecer Adição de Categoria',
      waMessage:
        'Olá! Já tenho CNH e selecionei a opção "Adicionar Categoria" no site da Itamarati. Como funciona o processo e prazos?',
    },
    {
      id: 'outros-servicos',
      tabLabel: 'Já tenho CNH e busco outro serviço',
      icon: RefreshCw,
      tagline: 'Renovação, reciclagem e aulas para quem tem medo de dirigir',
      description:
        'Se você precisa renovar sua CNH com rapidez, resolver pendências de pontuação com o curso de reciclagem ou quer aulas práticas para perder a insegurança no trânsito, temos a solução adequada.',
      highlights: [
        'Renovação descomplicada com agendamento assistido',
        'Curso de reciclagem para condutores suspensos',
        'Treinamento humanizado para quem já é habilitado mas tem receio',
        'Alteração de restrição médica PCD para manual',
      ],
      pageUrl: '/servicos',
      pageLabel: 'Explorar todos os serviços',
      waMessage:
        'Olá! Já sou habilitado(a) e selecionei "Já tenho CNH e procuro outro serviço" no site. Gostaria de atendimento para meu caso.',
    },
    {
      id: 'cursos-pro',
      tabLabel: 'Quero conhecer os cursos',
      icon: GraduationCap,
      tagline: 'Cursos 100% online homologados pela Senatran',
      description:
        'Qualifique-se para o mercado de trabalho com cursos profissionais à distância: Transporte Coletivo de Passageiros (TCP), Produtos Perigosos (MOPP), Emergência, Escolar, Cargas Indivisíveis e normas de segurança (NR20 e NR35).',
      highlights: [
        'Homologação oficial Senatran e validade em todo o Brasil',
        'Estudo 100% online no seu ritmo, pelo celular ou computador',
        'Certificação rápida integrada aos órgãos de trânsito',
        'Suporte pedagógico da equipe Autoescola Itamarati',
      ],
      pageUrl: '/cursos',
      pageLabel: 'Ver catálogo completo de cursos',
      waMessage:
        'Olá! Estou interessado nos CURSOS PROFISSIONALIZANTES (TCP, MOPP ou outros) no site da Itamarati. Podem me passar a programação?',
    },
  ];

  const currentStep = steps[selectedTab];

  const waUrl = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${encodeURIComponent(
    currentStep.waMessage
  )}`;

  // WAI-ARIA tabs: arrow keys move between options
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % steps.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (idx - 1 + steps.length) % steps.length;
    else return;
    e.preventDefault();
    setSelectedTab(next);
    document.getElementById(`tab-${steps[next].id}`)?.focus();
  };

  return (
    <section id="seu-objetivo" className="scroll-mt-20 bg-ink text-white py-20 sm:py-28" aria-labelledby="step-selector-heading">
      <span id="passo-a-passo" className="block -mt-20 pt-20" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
          <div className="lg:col-span-7">
            <p className="kicker text-accent-400">01 — Seu objetivo</p>
            <h2 id="step-selector-heading" className="mt-4 text-4xl sm:text-6xl font-extrabold leading-[0.95]">
              Qual é o seu <span className="text-accent-400">próximo passo?</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-slate-300 text-lg">
            Escolha a opção que tem a ver com você. A gente mostra o caminho — sem cadastro, sem formulário.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <div className="lg:col-span-5 flex flex-col border-t border-white/15" role="tablist" aria-orientation="vertical" aria-label="Escolha seu objetivo">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isSelected = selectedTab === idx;
              return (
                <button
                  key={step.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  aria-controls={`panel-${step.id}`}
                  id={`tab-${step.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setSelectedTab(idx)}
                  onKeyDown={(e) => onKeyDown(e, idx)}
                  data-event="service_interest"
                  data-event-label={step.id}
                  className={`group flex items-center gap-4 py-5 px-2 text-left border-b border-white/15 transition-colors ${
                    isSelected ? 'text-accent-400' : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold tabular-nums w-6 text-white/40">0{idx + 1}</span>
                  <span className="flex-1 font-display text-xl sm:text-2xl font-bold leading-tight">{step.tabLabel}</span>
                  <span
                    className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isSelected ? 'bg-accent-500 border-accent-500 text-ink' : 'border-white/25 group-hover:border-white/60'
                    }`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`panel-${currentStep.id}`}
            aria-labelledby={`tab-${currentStep.id}`}
            tabIndex={0}
            className="lg:col-span-7 bg-accent-500 text-ink rounded-3xl p-7 sm:p-10 flex flex-col"
          >
            <p className="kicker text-ink/70">{currentStep.tagline}</p>
            <p className="mt-4 text-lg sm:text-xl leading-relaxed font-medium">{currentStep.description}</p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3">
              {currentStep.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-[15px]">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-event-label={`selector_${currentStep.id}`}
                className="btn-ink"
              >
                <MessageCircle className="w-5 h-5 text-accent-400" aria-hidden="true" />
                Falar sobre isso no WhatsApp
              </a>
              <Link href={currentStep.pageUrl} className="btn-outline">
                {currentStep.pageLabel}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
