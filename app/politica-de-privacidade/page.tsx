import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade | Autoescola Itamarati',
  description:
    'Política de privacidade e proteção de dados da Autoescola Itamarati em conformidade com a LGPD (Lei nº 13.709/2018).',
};

export default function PoliticaPrivacidadePage() {
  const settings = db.getSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o início</span>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-900 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>LGPD e Proteção de Dados</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Política de Privacidade e Termos de Uso
          </h1>
          <p className="text-sm text-slate-500">
            Última atualização: Outubro de 2026 · Autoescola Itamarati Ltda. (CNPJ: {settings.cnpj})
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            A <strong>Autoescola Itamarati</strong> valoriza a sua privacidade e a transparência no tratamento de dados pessoais. Esta política descreve como coletamos, utilizamos e protegemos as informações fornecidas por você ao utilizar nosso site e nossos canais de atendimento.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">1. Coleta de Informações</h2>
          <p>
            Coletamos informações pessoais que você nos fornece voluntariamente quando preenche formulários de contato, solicita informações via WhatsApp ou inicia o processo de matrícula, tais como:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome completo;</li>
            <li>Telefone / número de WhatsApp;</li>
            <li>Endereço de e-mail;</li>
            <li>Serviço ou curso de interesse;</li>
            <li>Documentos estritamente necessários para os trâmites regulatórios junto ao DETRAN (somente no atendimento presencial ou formal de matrícula).</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6">2. Finalidade do Tratamento dos Dados</h2>
          <p>
            Os dados coletados têm as seguintes finalidades exclusivas:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Responder a pedidos de orçamento, dúvidas e orientações sobre serviços e cursos;</li>
            <li>Organizar agendamentos de aulas e provas com o consentimento do aluno;</li>
            <li>Cumprir obrigações legais e regulatórias do Código de Trânsito Brasileiro e dos órgãos oficiais de trânsito (Senatran e DETRAN);</li>
            <li>Melhorar continuamente a experiência de navegação e atendimento.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6">3. Uso de Imagem e Galeria</h2>
          <p>
            Fotos de alunos exibidas em nossa galeria e materiais de divulgação são publicadas <strong>exclusivamente mediante registro prévio de autorização de uso de imagem</strong>. Nenhuma foto de documento oficial (como CNH, RG ou CPF) com dados visíveis é exposta publicamente. O aluno pode solicitar a remoção de sua foto a qualquer momento pelo e-mail {settings.email}.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">4. Compartilhamento de Dados</h2>
          <p>
            A Autoescola Itamarati não vende, não aluga e não comercializa seus dados com terceiros. O compartilhamento ocorre apenas quando indispensável para o cumprimento de obrigações regulatórias junto aos sistemas oficiais do DETRAN/Senatran ou por determinação judicial.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">5. Segurança dos Dados</h2>
          <p>
            Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acessos não autorizados, perdas ou alterações ilícitas.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">6. Direitos do Titular (LGPD)</h2>
          <p>
            Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de solicitar a confirmação da existência de tratamento, o acesso aos seus dados, a correção de dados incompletos ou a revogação do consentimento.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6">7. Canal de Contato do Encarregado (DPO)</h2>
          <p>
            Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato pelo e-mail <strong>{settings.email}</strong> ou pelo telefone <strong>{settings.phone}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
