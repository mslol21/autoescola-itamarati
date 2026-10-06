'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Eye } from 'lucide-react';

interface GoogleMapOnDemandProps {
  embedUrl: string;
  directUrl: string;
  address: string;
}

export default function GoogleMapOnDemand({
  embedUrl,
  directUrl,
  address,
}: GoogleMapOnDemandProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200/90 shadow-soft bg-slate-100 min-h-[380px] sm:min-h-[460px] flex items-center justify-center">
      {isLoaded ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de localização da Autoescola Itamarati: ${address}`}
        />
      ) : (
        <div className="text-center p-8 max-w-md space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center mx-auto shadow-sm">
            <MapPin className="w-8 h-8 text-accent-500" />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-900">Mapa interativo do local</h4>
            <p className="text-sm text-slate-600 mt-1">
              {address}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsLoaded(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-brand-900 text-white hover:bg-brand-800 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent-500"
            >
              <Eye className="w-4 h-4" />
              <span>Carregar mapa aqui</span>
            </button>

            <a
              href={directUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-accent-500 text-ink hover:bg-accent-400 shadow-sm transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Como chegar (GPS)</span>
            </a>
          </div>

          <p className="text-[11px] text-slate-400">
            Carregamento sob demanda para preservar a velocidade e privacidade de navegação.
          </p>
        </div>
      )}
    </div>
  );
}
