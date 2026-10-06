'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappClean?: string;
}

export default function FloatingWhatsApp({
  whatsappClean = '5511970539746',
}: FloatingWhatsAppProps) {
  const waUrl = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${encodeURIComponent(
    'Olá! Vim pelo botão flutuante do site da Autoescola Itamarati e gostaria de tirar dúvidas sobre a CNH ou cursos.'
  )}`;

  return (
    <aside aria-label="Atendimento rápido pelo WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-white shadow-xl hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400/50"
        aria-label="Iniciar conversa com a Autoescola Itamarati no WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />

        {/* Pulse effect badge */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
        </span>

        {/* Floating tooltip */}
        <span className="pointer-events-none absolute right-16 hidden sm:block whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
          Tire suas dúvidas no WhatsApp
        </span>
      </a>
    </aside>
  );
}
