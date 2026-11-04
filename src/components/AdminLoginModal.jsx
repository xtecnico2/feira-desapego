import React, { useState } from 'react';
import { X, Lock, KeyRound, AlertCircle } from 'lucide-react';

export function AdminLoginModal({ onClose, onLoginSuccess, currentPin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const targetPin = currentPin || 'admin123';

    if (pin.trim() === targetPin) {
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Acesso Restrito</h3>
            <p className="text-xs text-stone-500 mt-1">
              Área exclusiva para o administrador cadastrar fotos, descrições e valores.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Senha / PIN de Administrador
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Digite o PIN de admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all text-center tracking-widest font-mono"
              />
            </div>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Senha incorreta. (Senha padrão: admin123)</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Entrar como Administrador
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-stone-100 text-center">
          <span className="text-[11px] text-stone-400">
            Dica: você pode alterar a senha a qualquer momento nas configurações do painel.
          </span>
        </div>
      </div>
    </div>
  );
}
