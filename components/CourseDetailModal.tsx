'use client';

import React from 'react';
import { Course } from '@/lib/types';
import { X, Clock, Laptop, CheckCircle, MessageCircle, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  whatsappClean?: string;
}

export default function CourseDetailModal({
  course,
  onClose,
  whatsappClean = '5511970539746',
}: CourseDetailModalProps) {
  if (!course) return null;

  const waEnroll = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${encodeURIComponent(
    `Olá! Estou interessado(a) em realizar minha matrícula no curso de ${course.title} da Itamarati. Como posso proceder?`
  )}`;

  const waQuestions = `https://api.whatsapp.com/send?phone=${whatsappClean}&text=${encodeURIComponent(
    `Olá! Tenho algumas dúvidas sobre o curso de ${course.title} (requisitos, prazos e certificado). Podem me ajudar?`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-950 text-white p-6 sm:p-8 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              {course.kicker}
            </span>
            <h3 id="course-modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {course.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Fechar janela de detalhes do curso"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 text-sm sm:text-base">
          {/* Key Facts Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-accent-500 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Carga horária</span>
                <span className="text-xs font-semibold text-slate-900">{course.cargaHoraria}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Laptop className="w-5 h-5 text-brand-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Modalidade</span>
                <span className="text-xs font-semibold text-slate-900">{course.modalidade}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase block">Homologação</span>
                <span className="text-xs font-semibold text-slate-900">Senatran Válida</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">Sobre este curso</h4>
            <p className="leading-relaxed text-slate-600">{course.fullDesc}</p>
          </div>

          {/* Ementa / Syllabus */}
          {course.ementa && course.ementa.length > 0 && (
            <div>
              <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-700" />
                <span>Conteúdo programático (Ementa)</span>
              </h4>
              <ul className="space-y-2">
                {course.ementa.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {course.requisitos && course.requisitos.length > 0 && (
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80">
              <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Requisitos para matrícula</span>
              </h4>
              <ul className="space-y-1.5">
                {course.requisitos.map((req, idx) => (
                  <li key={idx} className="text-xs text-amber-900">
                    • {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href={waQuestions}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-800 transition-colors"
          >
            Tirar dúvidas antes de matricular
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Fechar
            </button>
            <a
              href={waEnroll}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-accent-500 text-ink shadow-md hover:bg-accent-400 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Matricule-se já!</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
