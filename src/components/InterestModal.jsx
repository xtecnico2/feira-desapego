import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatWhatsAppNumber } from '../utils/formatters';
import { saveInterest } from '../services/storage';

export function InterestModal({ product, settings, onClose, onInterestSubmitted }) {
  if (!product) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await saveInterest({
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        name,
        phone,
        message,
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Safe fallback if canvas not available
      }

      setIsSuccess(true);
      if (onInterestSubmitted) {
        onInterestSubmitted();
      }
    } catch (err) {
      console.error('Erro ao enviar interesse:', err);
      alert('Não foi possível registrar o interesse. Tente novamente ou use o WhatsApp direto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Olá! Meu nome é ${name || 'um comprador'} e acabei de registrar interesse no item "${product.title}" (${formatCurrency(product.price)}). Mensagem: ${message || 'Gostaria de combinar a compra/retirada.'}`;
  const directWhatsAppUrl = `https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-semibold text-stone-900">
              Registrar Interesse no Item
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Summary Header Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 mb-6">
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80'}
              alt={product.title}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-stone-900 truncate">
                {product.title}
              </h4>
              <p className="text-sm font-bold text-amber-800 font-sans mt-0.5">
                {formatCurrency(product.price)}
              </p>
              {product.pickupLocation && (
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {product.pickupLocation}
                </p>
              )}
            </div>
          </div>

          {isSuccess ? (
            /* Success State */
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-stone-900">
                  Interesse enviado com sucesso!
                </h4>
                <p className="text-sm text-stone-600 mt-1 max-w-sm mx-auto">
                  O vendedor foi notificado com seus dados e entrará em contato via WhatsApp em breve.
                </p>
              </div>

              {settings.whatsappNumber && (
                <div className="pt-2">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>Também quero falar no WhatsApp agora</span>
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
              >
                Voltar aos produtos
              </button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Mariana Silva"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Seu WhatsApp / Telefone com DDD *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Usaremos este número apenas para responder sobre este item.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Mensagem ou Dúvida (opcional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ex: Tenho interesse! É possível retirar no sábado pela manhã? Tem desconto à vista?"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Enviando...' : 'Confirmar Interesse'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
