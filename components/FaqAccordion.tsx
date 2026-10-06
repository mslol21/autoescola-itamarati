'use client';

import React, { useState } from 'react';
import { FaqItem } from '@/lib/types';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [activeTopic, setActiveTopic] = useState<string>('todos');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [faqs[0]?.id || '']: true, // First one open by default
  });

  // Extract unique topics
  const topics = ['todos', ...Array.from(new Set(faqs.map((f) => f.topic)))];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeTopic === 'todos') return true;
    return faq.topic === activeTopic;
  });

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full">
      {/* Topics Filter */}
      {topics.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8" role="tablist" aria-label="Tópicos de Dúvidas">
          {topics.map((topic) => {
            const isSelected = activeTopic === topic;
            return (
              <button
                key={topic}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTopic(topic)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                  isSelected
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {topic === 'todos' ? 'Todas as dúvidas' : topic}
              </button>
            );
          })}
        </div>
      )}

      {/* Accordions */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filteredFaqs.map((faq) => {
          const isOpen = !!openIds[faq.id];
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-brand-200 shadow-soft'
                  : 'bg-white/70 hover:bg-white border-slate-200/90'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                id={`faq-btn-${faq.id}`}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isOpen ? 'bg-accent-500 text-ink' : 'bg-slate-100 text-brand-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent-800 block mb-0.5">
                      {faq.topic}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`p-1.5 rounded-full bg-slate-100 text-slate-600 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-brand-50 text-brand-700' : ''
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${faq.id}`}
                  className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-in fade-in-50 duration-150"
                >
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
