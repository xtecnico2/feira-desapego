import React from 'react';
import { Armchair, MapPin, MessageCircle, ShieldCheck, Lock, LogOut } from 'lucide-react';
import { formatWhatsAppNumber } from '../utils/formatters';

export function Header({
  settings,
  isAdmin,
  onOpenAdminLogin,
  onLogoutAdmin,
  activeAdminTab,
  setActiveAdminTab,
  pendingInterestsCount,
}) {
  const whatsappUrl = `https://wa.me/${formatWhatsAppNumber(settings.whatsappNumber)}?text=${encodeURIComponent(
    'Olá! Estive vendo os itens no seu site de desapego e gostaria de tirar algumas dúvidas.'
  )}`;

  return (
    <header className="sticky top-0 z-30 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-700 shadow-xs">
              <Armchair className="w-6 h-6 stroke-[1.8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold tracking-tight text-stone-900">
                  {settings.siteTitle || 'Feira do Desapego'}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>
              {settings.cityNeighborhood && (
                <div className="flex items-center text-xs text-stone-700 mt-0.5 font-medium">
                  <MapPin className="w-3 h-3 mr-1 text-amber-800 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{settings.cityNeighborhood}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* WhatsApp Contact */}
            {settings.whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Vendedor</span>
              </a>
            )}

            {/* Admin Controls */}
            {isAdmin ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setActiveAdminTab(activeAdminTab === 'admin' ? 'catalog' : 'admin')}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeAdminTab === 'admin'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-200/70 hover:bg-stone-200 text-stone-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span className="hidden md:inline">Painel Admin</span>
                  {pendingInterestsCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-bold">
                      {pendingInterestsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  title="Encerrar sessão de administrador"
                  className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors"
                title="Acesso restrito ao administrador"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
