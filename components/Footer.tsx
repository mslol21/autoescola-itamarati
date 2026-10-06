import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Lock, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const waUrl = `https://api.whatsapp.com/send?phone=${settings.whatsappClean}&text=${encodeURIComponent(
    'Olá! Vim pelo site da Autoescola Itamarati e gostaria de conversar com a equipe.'
  )}`;

  const nav = [
    { label: 'Início', href: '/' },
    { label: 'Sobre a Itamarati', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Galeria', href: '/galeria' },
    { label: 'Novidades e dicas', href: '/noticias' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <footer className="bg-ink text-slate-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Rodapé</h2>

      {/* Closing call to action */}
      <div className="bg-accent-500 text-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <p className="kicker text-ink/70">Sua próxima conquista começa aqui</p>
            <p className="mt-3 font-display font-extrabold text-4xl sm:text-6xl leading-[0.95] tracking-tight">
              Bora tirar esse plano do papel?
            </p>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-ink/80">
              Conte o que você precisa. A equipe da Itamarati em Guaianases responde e explica cada passo, sem enrolação.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-event-label="footer_cta"
              className="btn-ink"
            >
              Chamar no WhatsApp
              <ArrowUpRight className="w-5 h-5 text-accent-400" aria-hidden="true" />
            </a>
            <Link href="/contato" className="btn-outline">
              Ver endereço e horários
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-5">
            <Link href="/" className="inline-block bg-white rounded-xl px-4 py-3">
              <img src="/images/logo-itamarati.png" alt="Autoescola Itamarati — desde 1967" width={815} height={306} className="h-10 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Centro de Formação de Condutores em Guaianases, São Paulo. Formando motoristas desde 1967.
            </p>
            <div className="flex gap-2">
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Autoescola Itamarati" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent-500 hover:text-ink hover:border-accent-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook da Autoescola Itamarati" className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center hover:bg-accent-500 hover:text-ink hover:border-accent-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="kicker text-accent-400 mb-4">Navegação</p>
            <ul className="space-y-2.5 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white hover:underline underline-offset-4 decoration-accent-500 decoration-2">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5 grid sm:grid-cols-2 gap-8">
            <div>
              <p className="kicker text-accent-400 mb-4">Onde estamos</p>
              <address className="not-italic text-sm leading-relaxed">
                {settings.address}
                <br />
                {settings.district} · {settings.city}/{settings.state}
                <br />
                CEP {settings.cep}
              </address>
              <a href={settings.googleMapsUrl} target="_blank" rel="noopener noreferrer" data-event="directions_click" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-white hover:text-accent-400">
                Como chegar <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
            <div>
              <p className="kicker text-accent-400 mb-4">Fale com a gente</p>
              <ul className="space-y-1.5 text-sm">
                <li>
                  <a href={`tel:${settings.phoneClean}`} className="hover:text-white">Tel. {settings.phone}</a>
                </li>
                <li>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" data-event="whatsapp_click" data-event-label="footer" className="hover:text-white">
                    WhatsApp {settings.whatsapp}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-white break-all">{settings.email}</a>
                </li>
              </ul>
              <ul className="mt-4 space-y-0.5 text-xs text-slate-400">
                <li>{settings.openingHoursWeekday}</li>
                <li>{settings.openingHoursSaturday}</li>
                <li>{settings.openingHoursSunday}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {currentYear} {settings.name} · CNPJ {settings.cnpj}
          </p>
          <div className="flex items-center gap-5">
            <Link href="/politica-de-privacidade" className="hover:text-slate-200 underline underline-offset-2">
              Política de privacidade
            </Link>
            <Link href="/admin" rel="nofollow" className="inline-flex items-center gap-1 hover:text-slate-200">
              <Lock className="w-3 h-3" aria-hidden="true" /> Área da equipe
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
