import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'todos', label: 'Todos os Itens' },
  { id: 'moveis', label: 'Móveis' },
  { id: 'eletro', label: 'Eletrodomésticos' },
  { id: 'decoracao', label: 'Decoração' },
  { id: 'outros', label: 'Outros' },
];

export function Filters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  countsByCategory,
}) {
  return (
    <div className="space-y-4">
      {/* Search & Sort Controls Row */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por sofá, geladeira, mesa, marca..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter & Sort Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-medium text-stone-700 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs cursor-pointer"
            >
              <option value="todos">Status: Todos</option>
              <option value="disponivel">Apenas Disponíveis</option>
              <option value="reservado">Reservados</option>
              <option value="vendido">Vendidos</option>
            </select>
            <SlidersHorizontal className="absolute right-3 pointer-events-none w-3.5 h-3.5 text-stone-400" />
          </div>

          {/* Sort Selector */}
          <div className="relative flex items-center">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-medium text-stone-700 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 shadow-2xs cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
              <option value="discount">Maior Desconto</option>
            </select>
            <ArrowUpDown className="absolute right-3 pointer-events-none w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-sm">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = countsByCategory[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isSelected
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
              }`}
            >
              {cat.label}
              {count > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                    isSelected ? 'bg-stone-700 text-stone-200' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
