'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryItem, GalleryCategory } from '@/lib/types';
import { X, ChevronLeft, ChevronRight, Award, ShieldCheck, UserCheck } from 'lucide-react';

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialCategory?: string;
  showFilters?: boolean;
}

export default function GalleryLightbox({
  items,
  initialCategory = 'todos',
  showFilters = true,
}: GalleryLightboxProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const categories: { key: string; label: string }[] = [
    { key: 'todos', label: 'Todas as fotos' },
    { key: 'conquistas', label: 'Conquistas & Alunos' },
    { key: 'aulas', label: 'Aulas Práticas' },
    { key: 'estrutura', label: 'Estrutura & Simulador' },
    { key: 'equipe', label: 'Nossa Equipe' },
    { key: 'eventos', label: 'Eventos & Treinamentos' },
  ];

  // Filter items
  const filteredItems = items.filter((item) => {
    if (activeCategory === 'todos') return true;
    return item.category === activeCategory;
  });

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const showNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => ((prev! + 1) % filteredItems.length));
  }, [selectedIndex, filteredItems.length]);

  const showPrev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => ((prev! - 1 + filteredItems.length) % filteredItems.length));
  }, [selectedIndex, filteredItems.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, showNext, showPrev]);

  // Prevent background scroll when modal open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedIndex]);

  const currentItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

  return (
    <div>
      {/* Category Filter Tabs */}
      {showFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10" role="tablist" aria-label="Categorias da galeria">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                role="tab"
                aria-selected={isSelected}
                onClick={() => {
                  setActiveCategory(cat.key);
                  setSelectedIndex(null);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent-500 ${
                  isSelected
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Photo Grid / Mosaic */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200">
          <p className="text-slate-500 font-medium">Nenhuma foto encontrada nesta categoria no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ampliar imagem: ${item.title}`}
              className="group relative rounded-2xl overflow-hidden bg-slate-900 cursor-pointer shadow-subtle hover:shadow-soft transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-500 aspect-[4/3]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Badge & Info Overlay */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-brand-900/80 backdrop-blur-md border border-brand-700/50 text-white">
                    {item.categoryLabel || item.category}
                  </span>
                  {item.categoryBadge && (
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-accent-500 text-ink shadow-sm">
                      {item.categoryBadge}
                    </span>
                  )}
                </div>

                <div>
                  {item.studentName && (
                    <p className="text-xs font-semibold text-amber-300 mb-0.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.studentName}</span>
                    </p>
                  )}
                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accessible Fullscreen Lightbox Modal */}
      {currentItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={currentItem.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Fechar ampliação da imagem (ou pressione Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Foto anterior (seta esquerda)"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent-500"
            aria-label="Próxima foto (seta direita)"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Modal Container */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-2xl bg-black/40">
              <img
                src={currentItem.imageUrl}
                alt={currentItem.title}
                className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            {/* Lightbox Caption & Details */}
            <div className="w-full mt-4 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">
                    {currentItem.categoryLabel}
                  </span>
                  {currentItem.studentName && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span className="text-xs font-semibold text-emerald-400">
                        {currentItem.studentName}
                      </span>
                    </>
                  )}
                  {currentItem.categoryBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-600 text-ink ml-2">
                      {currentItem.categoryBadge}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-bold text-white">{currentItem.title}</h4>
                <p className="text-sm text-slate-300 mt-0.5">{currentItem.caption}</p>
              </div>

              <div className="shrink-0 text-xs text-slate-400 font-medium">
                Foto {selectedIndex + 1} de {filteredItems.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
