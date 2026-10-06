import React from 'react';
import Link from 'next/link';
import { Compass, Home, Phone, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Página Não Encontrada (404) | Autoescola Itamarati',
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-100 text-brand-900 flex items-center justify-center mx-auto shadow-subtle">
          <Compass className="w-10 h-10 text-accent-500 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-800 bg-accent-50 px-3 py-1 rounded-full border border-accent-200">
            Erro 404
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ops, parece que saímos da rota!
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            A página que você estava procurando não existe ou mudou de endereço. Não se preocupe, vamos recolocar você na direção certa.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold bg-brand-900 text-white hover:bg-brand-800 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>Voltar à Página Inicial</span>
          </Link>

          <Link
            href="/contato"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-700" />
            <span>Falar com a equipe</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
