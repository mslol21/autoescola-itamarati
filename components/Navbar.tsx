'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  phone?: string;
  whatsappClean?: string;
}

export default function Navbar({
  phone = '(11) 2554-2278',
  whatsappClean = '5511970539746',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile menu is open; close on Escape
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  const navLinks = [
    { label: 'Seu objetivo', href: '/#seu-objetivo' },
    { label: 'Nossa experiência', href: '/sobre' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Cursos', href: '/cursos' },
    { label: 'Galeria', href: '/galeria' },
    { label: 'Novidades', href: '/noticias' },
    { label: 'Contato', href: '/contato' },
  ];

  const phoneClean = phone.replace(/\D/g, '');
  const waUrl = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${encodeURIComponent(
    'Olá! Vim pelo site da Autoescola Itamarati e gostaria de conversar com a equipe.'
  )}`;

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? 'shadow-[0_1px_0_0_#0d1117]' : 'shadow-[0_1px_0_0_rgba(13,17,23,0.08)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px] gap-4">
          <Link href="/" className="shrink-0 rounded-md" aria-label="Autoescola Itamarati — página inicial">
            <img
              src="/images/logo-itamarati.png"
              alt="Autoescola Itamarati — desde 1967"
              width={815}
              height={306}
              className="h-9 sm:h-11 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const isActive = link.href !== '/' && !link.href.includes('#') && pathname.startsWith(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative px-3 py-2 text-[15px] font-medium rounded-md transition-colors ${
                    isActive ? 'text-ink' : 'text-slate-600 hover:text-ink'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="absolute left-3 right-3 -bottom-0.5 h-[3px] bg-accent-500 rounded-full" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${phoneClean}`}
              className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-ink"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              {phone}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-event-label="header"
              className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-ink text-white pl-5 pr-4 py-2.5 text-sm font-bold hover:bg-brand-800 transition-colors"
            >
              Conversar com a equipe
              <ArrowUpRight className="w-4 h-4 text-accent-400" aria-hidden="true" />
            </a>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-full border-2 border-ink text-ink hover:bg-accent-400 transition-colors"
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 sm:top-[72px] bottom-0 bg-ink text-white overflow-y-auto">
          <nav className="px-5 py-6" aria-label="Navegação principal (celular)">
            <ul className="divide-y divide-white/10">
              {navLinks.map((link, i) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="flex items-baseline gap-4 py-4 font-display text-2xl font-bold hover:text-accent-400"
                  >
                    <span className="text-xs font-sans font-bold text-accent-400 tabular-nums">0{i + 1}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-event-label="mobile_menu"
                className="flex items-center justify-center gap-2 rounded-full bg-accent-500 text-ink py-4 font-bold"
              >
                Conversar com a equipe no WhatsApp
              </a>
              <a
                href={`tel:${phoneClean}`}
                className="flex items-center justify-center gap-2 rounded-full border-2 border-white/30 py-3.5 font-semibold"
              >
                <Phone className="w-4 h-4" aria-hidden="true" /> Ligar {phone}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
