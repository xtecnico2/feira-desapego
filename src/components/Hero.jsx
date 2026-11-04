import React from 'react';
import { Sparkles, CheckCircle2, Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export function Hero({ settings, stats }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-stone-200/60 bg-gradient-to-b from-stone-100/60 to-stone-50">
      {/* Decorative subtle background accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-10 right-0 w-96 h-96 rounded-full bg-stone-300/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/80 border border-stone-300/80 text-xs font-medium text-stone-700 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Desapego de Casa & Oportunidades</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-stone-900 leading-tight">
            Móveis & eletrodomésticos selecionados para sua casa
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed font-light">
            {settings.siteSubtitle ||
              'Itens em excelente estado de conservação por motivo de mudança. Todos testados, higienizados e com fotos reais detalhadas.'}
          </p>

          {/* Key Trust Highlights */}
          <div className="mt-6 flex flex-wrap gap-y-2 gap-x-6 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Fotos 100% reais</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-amber-600" />
              <span>Negociação direta com o dono</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-stone-600" />
              <span>Retirada combinada sem complicação</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 flex items-center gap-3 sm:gap-4">
            <div className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold text-stone-900 font-sans">
                {stats.available}
              </span>
              <span className="text-xs text-stone-500 font-medium">Disponíveis</span>
            </div>

            {stats.reserved > 0 && (
              <div className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
                <span className="block text-xl sm:text-2xl font-bold text-amber-600 font-sans">
                  {stats.reserved}
                </span>
                <span className="text-xs text-stone-500 font-medium">Reservados</span>
              </div>
            )}

            <div className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold text-stone-400 font-sans">
                {stats.sold}
              </span>
              <span className="text-xs text-stone-500 font-medium">Vendidos</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
