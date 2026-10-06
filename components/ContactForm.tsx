'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'primeira-cnh',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        service: 'primeira-cnh',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-emerald-950">Mensagem enviada com sucesso!</h3>
        <p className="text-sm text-emerald-800 max-w-md mx-auto">
          Agradecemos pelo contato. A equipe da Autoescola Itamarati entrará em contato com você o mais breve possível.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-xs font-bold text-emerald-700 underline underline-offset-4 hover:text-emerald-900"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft space-y-5">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Nome Completo <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Como prefere ser chamado(a)?"
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all placeholder:text-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Telefone / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div>
        <label htmlFor="service" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Serviço de Interesse
        </label>
        <select
          id="service"
          name="service"
          value={formData.service}
          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all bg-white"
        >
          <option value="primeira-cnh">Primeira Habilitação (Carro / Moto)</option>
          <option value="adicao-categoria">Adição de Categoria (A ou B)</option>
          <option value="renovacao">Renovação de CNH</option>
          <option value="reciclagem">Reciclagem para Condutor Suspenso</option>
          <option value="idosos">Habilitação sem Restrição de Idade</option>
          <option value="cursos-pro">Cursos Profissionalizantes (TCP, MOPP, etc.)</option>
          <option value="outros">Outros Assuntos</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Mensagem ou Dúvidas
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Conte um pouco sobre suas dúvidas ou disponibilidade..."
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 transition-all placeholder:text-slate-400"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm bg-brand-900 text-white hover:bg-brand-800 shadow-md transition-all disabled:opacity-50 active:scale-95"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Enviando mensagem...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Enviar mensagem para a equipe</span>
          </>
        )}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Seus dados serão utilizados apenas para retorno do seu contato pela equipe Itamarati.
      </p>
    </form>
  );
}
