import React from 'react';
import { Armchair, MessageCircle, MapPin, Lock, ShieldCheck, Heart } from 'lucide-react';
import { formatWhatsAppNumber } from '../utils/formatters';

export function Footer({ settings, isAdmin, onOpenAdminLogin, onOpenAdminPanel }) {
  const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(
    'Olá! Estive no seu site de desapego e gostaria de mais informações.'
  )}`;

  return (
    <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Armchair className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                {settings.siteTitle || 'Feira do Desapego'}
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              {settings.siteSubtitle ||
                'Catálogo online de desapego de móveis e eletrodomésticos particulares. Itens selecionados com carinho, bom estado e preços justos.'}
            </p>
          </div>

          {/* Guidelines & Safety */}
          <div className="md:col-span-4 space-y-2 text-xs text-stone-400">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Como Funciona a Negociação
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-stone-400">
              <li>Escolha os itens e clique em "Tenho Interesse" ou chame no WhatsApp.</li>
              <li>A retirada é combinada diretamente com o vendedor.</li>
              <li>Formas de pagamento: Pix ou dinheiro na retirada.</li>
              <li>Desmontagem e frete por conta do comprador (salvo combinado).</li>
            </ul>
          </div>

          {/* Quick Contact & Admin Link */}
          <div className="md:col-span-3 space-y-3 flex flex-col md:items-end">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Contato Direto
            </h4>
            {settings.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Conversar no WhatsApp</span>
              </a>
            )}

            <div className="pt-2">
              {isAdmin ? (
                <button
                  type="button"
                  onClick={onOpenAdminPanel}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Gerenciar como Administrador</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Área do Administrador</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.siteTitle}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Site para desapego e venda particular
          </p>
        </div>
      </div>
    </footer>
  );
}
