import React, { useState } from 'react';
import {
  Package,
  Inbox,
  Settings as SettingsIcon,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  MessageCircle,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Clock,
  Database,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { formatCurrency, formatWhatsAppNumber, formatPhoneDisplay, formatDate } from '../utils/formatters';
import { isSupabaseConfigured } from '../services/supabase';
import { exportBackup, importBackup, resetToDefaults } from '../services/storage';

export function AdminPanel({
  products,
  interests,
  settings,
  onAddNewProduct,
  onEditProduct,
  onDeleteProduct,
  onChangeStatus,
  onUpdateInterestStatus,
  onDeleteInterest,
  onSaveSettings,
  onRefreshData,
  onExitAdmin,
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'interests', 'settings'
  const [interestFilter, setInterestFilter] = useState('todos');

  // Settings local state
  const [settingsForm, setSettingsForm] = useState({ ...settings });
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    onSaveSettings(settingsForm);
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 3000);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = importBackup(event.target.result);
      if (success) {
        alert('Backup importado com sucesso!');
        onRefreshData();
      } else {
        alert('Erro ao importar arquivo. Certifique-se de que é um JSON válido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (window.confirm('Atenção: deseja realmente restaurar os dados de exemplo originais? As alterações feitas serão substituídas.')) {
      resetToDefaults();
      onRefreshData();
    }
  };

  const pendingInterests = interests.filter((i) => i.status === 'novo');
  const filteredInterests =
    interestFilter === 'todos'
      ? interests
      : interests.filter((i) => i.status === interestFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-200">
      
      {/* Top Banner & Tabs */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                Painel do Administrador
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Gerencie catálogo de fotos, preços, status e visualize mensagens de compradores interessados.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onAddNewProduct}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Item para Venda</span>
            </button>
            <button
              type="button"
              onClick={onExitAdmin}
              className="px-3.5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs sm:text-sm font-medium transition-colors"
            >
              Ver Site como Visitante
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 pt-6 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Itens do Catálogo ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('interests')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'interests'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Interesses Recebidos</span>
            {pendingInterests.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white">
                {pendingInterests.length} novos
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Configurações & Backup</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">
              Todos os Itens ({products.length})
            </h3>
            <span className="text-xs text-stone-400">
              Você pode alterar o status de cada item instantaneamente.
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {products.map((item) => {
              const coverImg = item.images?.[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80';
              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={coverImg}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                          {item.category}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500">
                          {item.images?.length || 0} fotos
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-semibold text-stone-900 truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-sm sm:text-base font-bold text-amber-900 font-sans">
                          {formatCurrency(item.price)}
                        </span>
                        {item.originalPrice && (
                          <span className="text-xs text-stone-400 line-through">
                            {formatCurrency(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                    {/* Status dropdown */}
                    <div className="flex items-center gap-1.5">
                      <select
                        value={item.status || 'disponivel'}
                        onChange={(e) => onChangeStatus(item.id, e.target.value)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                          item.status === 'disponivel'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : item.status === 'reservado'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-stone-100 text-stone-600 border-stone-300'
                        }`}
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="reservado">Reservado</option>
                        <option value="vendido">Vendido</option>
                      </select>
                    </div>

                    {/* Edit & Delete Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditProduct(item)}
                        title="Editar item"
                        className="p-2 text-stone-600 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProduct(item.id, item.title)}
                        title="Excluir item"
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {products.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-sm">
                Nenhum produto cadastrado. Clique no botão "Novo Item para Venda" acima.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BUYER INTERESTS INBOX */}
      {activeTab === 'interests' && (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Interesses dos Compradores ({interests.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pessoas que clicaram em "Tenho Interesse" e enviaram formulário com telefone.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs font-medium">
              <button
                type="button"
                onClick={() => setInterestFilter('todos')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  interestFilter === 'todos' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                }`}
              >
                Todos ({interests.length})
              </button>
              <button
                type="button"
                onClick={() => setInterestFilter('novo')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  interestFilter === 'novo' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                }`}
              >
                Novos ({pendingInterests.length})
              </button>
              <button
                type="button"
                onClick={() => setInterestFilter('contatado')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  interestFilter === 'contatado' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500'
                }`}
              >
                Contatados
              </button>
            </div>
          </div>

          <div className="divide-y divide-stone-100">
            {filteredInterests.map((inquiry) => {
              const whatsappBuyerUrl = `https://wa.me/${formatWhatsAppNumber(inquiry.phone)}?text=${encodeURIComponent(
                `Olá ${inquiry.name}! Vi seu interesse no item "${inquiry.productTitle}" no nosso site de desapego. Gostaria de tirar dúvidas ou combinar a retirada?`
              )}`;

              return (
                <div key={inquiry.id} className="p-5 hover:bg-stone-50/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 text-sm sm:text-base">
                          {inquiry.name}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {formatPhoneDisplay(inquiry.phone)}
                        </span>
                        <span className="text-xs text-stone-400">
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>

                      <div className="text-xs text-stone-600">
                        Item de interesse:{' '}
                        <span className="font-semibold text-stone-900">
                          {inquiry.productTitle}
                        </span>{' '}
                        ({formatCurrency(inquiry.productPrice)})
                      </div>

                      {inquiry.message && (
                        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 italic max-w-xl">
                          "{inquiry.message}"
                        </div>
                      )}
                    </div>

                    {/* Inquiry Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Direct WhatsApp Call */}
                      <a
                        href={whatsappBuyerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>Chamar no WhatsApp</span>
                      </a>

                      {/* Status toggle */}
                      <select
                        value={inquiry.status || 'novo'}
                        onChange={(e) => onUpdateInterestStatus(inquiry.id, e.target.value)}
                        className="text-xs font-medium px-2.5 py-2 rounded-xl border border-stone-200 bg-white cursor-pointer"
                      >
                        <option value="novo">Novo</option>
                        <option value="contatado">Contatado</option>
                        <option value="finalizado">Finalizado</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => onDeleteInterest(inquiry.id)}
                        title="Remover interesse"
                        className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInterests.length === 0 && (
              <div className="text-center py-12 text-stone-400 text-sm">
                Nenhum interesse registrado nesta categoria ainda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS & BACKUP */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-1">
              Configurações Gerais do Site
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Esses dados aparecem no cabeçalho e nos links de WhatsApp para os visitantes.
            </p>

            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Título do Site
                </label>
                <input
                  type="text"
                  value={settingsForm.siteTitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                  placeholder="Ex: Desapego da Casa - Família Souza"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Subtítulo / Descrição da Venda
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.siteSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })}
                  placeholder="Ex: Móveis e eletrodomésticos selecionados por motivo de mudança..."
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    WhatsApp do Vendedor (com DDD)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="Ex: 5511999999999"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Formato com código do país e DDD (Ex: 5511999999999)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Cidade / Bairro de Retirada
                  </label>
                  <input
                    type="text"
                    value={settingsForm.cityNeighborhood}
                    onChange={(e) => setSettingsForm({ ...settingsForm, cityNeighborhood: e.target.value })}
                    placeholder="Ex: São Paulo - SP (Pinheiros)"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Senha / PIN de Administrador
                </label>
                <input
                  type="text"
                  value={settingsForm.adminPin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, adminPin: e.target.value })}
                  placeholder="Ex: admin123"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors shadow-xs"
                >
                  Salvar Configurações
                </button>
                {savedSettingsSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                    <Check className="w-4 h-4" /> Alterações salvas com sucesso!
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Backup & Cloud Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Storage Status */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isSupabaseConfigured
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    : 'bg-stone-100 text-stone-700 border border-stone-200'
                }`}>
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Status do Armazenamento
                  </h4>
                  <p className="text-xs text-stone-500">
                    {isSupabaseConfigured ? 'Nuvem Supabase Ativa' : 'Armazenamento Local (Navegador)'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed mb-3">
                {isSupabaseConfigured
                  ? 'O site está conectado à sua nuvem gratuita do Supabase. Todos os itens e interesses são salvos em banco de dados e sincronizados em qualquer computador ou celular.'
                  : 'O site está salvando itens no armazenamento seguro do seu navegador. Para compartilhar a edição com outros aparelhos ou persistir na nuvem de forma 100% gratuita, basta configurar as chaves do Supabase no arquivo .env (script SQL pronto incluso).'}
              </p>
            </div>

            {/* Backup & Export */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-stone-900">
                Backup e Exportação de Dados
              </h4>
              <p className="text-xs text-stone-500">
                Baixe um arquivo com todos os produtos, fotos cadastradas e configurações para guardar ou transferir para outro computador.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={exportBackup}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar Backup Completo (JSON)</span>
                </button>

                <label className="w-full py-2.5 px-4 rounded-xl border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                  <Upload className="w-4 h-4" />
                  <span>Importar Arquivo de Backup</span>
                </label>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full py-2 px-4 rounded-xl text-stone-400 hover:text-rose-600 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar itens de exemplo iniciais</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
