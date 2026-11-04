import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Share2,
  Check,
  MapPin,
  Maximize2,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatWhatsAppNumber, calculateDiscount, formatDate } from '../utils/formatters';

export function ProductDetailModal({
  product,
  onClose,
  onExpressInterest,
  settings,
  isAdmin,
  onEditProduct,
}) {
  if (!product) return null;

  const {
    id,
    title,
    category,
    price,
    originalPrice,
    condition,
    dimensions,
    voltage,
    brand,
    description,
    pickupLocation,
    status = 'disponivel',
    images = [],
    createdAt,
  } = product;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [images.length, isZoomed, onClose]);

  const discount = calculateDiscount(price, originalPrice);
  const isAvailable = status === 'disponivel';
  const isReserved = status === 'reservado';
  const isSold = status === 'vendido';

  const currentImage = images[activeImageIndex] || images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80';

  const whatsappMessage = `Olá! Tenho interesse no item "${title}" anunciado por ${formatCurrency(price)} no seu site. Ainda está disponível?`;
  const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(whatsappMessage)}`;

  const handleCopyLink = () => {
    const url = window.location.href.split('#')[0];
    navigator.clipboard.writeText(`${url}#${id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-opacity animate-in fade-in duration-200">
      
      {/* Lightbox / Zoom Overlay */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
        >
          <button
            type="button"
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-stone-800/80 text-white hover:bg-stone-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={currentImage}
            alt={title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
          <span className="text-white/70 text-sm mt-3">
            Foto {activeImageIndex + 1} de {images.length} • Clique para fechar
          </span>
        </div>
      )}

      {/* Main Dialog Modal */}
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between shrink-0 bg-stone-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              {category}
            </span>
            <span className="text-stone-300">•</span>
            {isAvailable && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Disponível
              </span>
            )}
            {isReserved && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700">
                <Clock className="w-3.5 h-3.5" />
                Reservado
              </span>
            )}
            {isSold && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vendido
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copiar link deste anúncio"
              className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-xl transition-colors"
            >
              {copiedLink ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Check className="w-4 h-4" /> Link copiado!
                </span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column: Photo Gallery (7 cols on lg) */}
          <div className="lg:col-span-7 bg-stone-100 p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-200">
            {/* Main Image Display */}
            <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner group">
              <img
                src={currentImage}
                alt={`${title} - Foto ${activeImageIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />

              {/* Prev / Next Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((prev) => (prev + 1) % images.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors shadow-md"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Fullscreen Zoom Button */}
              <button
                type="button"
                onClick={() => setIsZoomed(true)}
                title="Ampliar foto em tela cheia"
                className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs transition-colors shadow-md"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Index counter pill */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                  {activeImageIndex + 1} de {images.length} fotos
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? 'border-amber-600 ring-2 ring-amber-500/30 scale-105'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions (5 cols on lg) */}
          <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 leading-snug">
                {title}
              </h2>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline justify-between">
                <div>
                  <span className="block text-xs font-medium text-stone-500 uppercase tracking-wider">
                    Valor de Desapego
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-sans">
                      {formatCurrency(price)}
                    </span>
                    {originalPrice && originalPrice > price && (
                      <span className="text-sm text-stone-400 line-through">
                        {formatCurrency(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {discount > 0 && (
                  <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    -{discount}% OFF
                  </span>
                )}
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                {condition && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Conservação</span>
                    <span className="font-semibold text-stone-800">{condition}</span>
                  </div>
                )}
                {brand && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Marca/Origem</span>
                    <span className="font-semibold text-stone-800">{brand}</span>
                  </div>
                )}
                {voltage && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                    <span className="text-stone-400 block font-medium">Voltagem</span>
                    <span className="font-semibold text-stone-800">{voltage}</span>
                  </div>
                )}
                {dimensions && (
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 col-span-2">
                    <span className="text-stone-400 block font-medium">Dimensões (L × A × P)</span>
                    <span className="font-semibold text-stone-800">{dimensions}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                    Descrição Detalhada
                  </span>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line font-light">
                    {description}
                  </p>
                </div>
              )}

              {/* Pickup Location Notes */}
              {pickupLocation && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Local de Retirada & Frete:</span>
                    <span>{pickupLocation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons Footer */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              {!isSold ? (
                <>
                  {/* WhatsApp Primary Button */}
                  {settings.whatsappNumber && (
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <MessageCircle className="w-5 h-5 fill-white" />
                      <span>Falar no WhatsApp com o Vendedor</span>
                    </a>
                  )}

                  {/* Form Interest Button */}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onExpressInterest(product);
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Registrar Meu Interesse pelo Site</span>
                  </button>
                </>
              ) : (
                <div className="p-3 text-center rounded-2xl bg-stone-100 text-stone-600 text-sm font-medium">
                  Este item já foi vendido.
                </div>
              )}

              {/* Admin shortcut */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEditProduct(product);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-amber-800 hover:bg-amber-50 border border-amber-200 transition-colors"
                >
                  Editar Anúncio deste Item
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
