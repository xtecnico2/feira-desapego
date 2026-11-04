import React from 'react';
import { Camera, MapPin, Tag, Edit3, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency, calculateDiscount } from '../utils/formatters';

export function ProductCard({
  product,
  onViewDetails,
  onExpressInterest,
  isAdmin,
  onEditProduct,
  onDeleteProduct,
  onChangeStatus,
}) {
  const {
    id,
    title,
    category,
    price,
    originalPrice,
    condition,
    dimensions,
    voltage,
    status = 'disponivel',
    images = [],
    pickupLocation,
  } = product;

  const coverImage = images[0] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
  const discount = calculateDiscount(price, originalPrice);
  const isAvailable = status === 'disponivel';
  const isReserved = status === 'reservado';
  const isSold = status === 'vendido';

  return (
    <div
      className={`group relative rounded-3xl bg-white border border-stone-200/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:border-stone-300 ${
        isSold ? 'opacity-75' : ''
      }`}
    >
      {/* Image Container */}
      <div
        className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dark gradient overlay for bottom text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Status Badge */}
          {isAvailable && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Disponível
            </span>
          )}
          {isReserved && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-xs">
              <Clock className="w-3 h-3" />
              Reservado
            </span>
          )}
          {isSold && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-700 text-stone-200 shadow-xs">
              <CheckCircle2 className="w-3 h-3" />
              Vendido
            </span>
          )}

          {/* Photo Count Indicator */}
          {images.length > 1 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-xs">
              <Camera className="w-3 h-3" />
              {images.length}
            </span>
          )}
        </div>

        {/* Bottom image snippet: condition & category */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white/90 pointer-events-none">
          <span className="capitalize font-medium drop-shadow-xs">
            {category} {condition ? `• ${condition}` : ''}
          </span>
          {voltage && (
            <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-xs font-semibold">
              {voltage}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3
            onClick={() => onViewDetails(product)}
            className="text-base sm:text-lg font-semibold text-stone-900 line-clamp-2 hover:text-amber-800 transition-colors cursor-pointer"
            title={title}
          >
            {title}
          </h3>

          {/* Dimensions / brief info */}
          {dimensions && (
            <p className="mt-1.5 text-xs text-stone-500 line-clamp-1">
              <span className="font-medium text-stone-600">Medidas:</span> {dimensions}
            </p>
          )}

          {/* Price Section */}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-sans">
              {formatCurrency(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <>
                <span className="text-xs sm:text-sm text-stone-400 line-through">
                  {formatCurrency(originalPrice)}
                </span>
                {discount > 0 && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-semibold transition-colors text-center"
          >
            Ver Fotos e Detalhes
          </button>

          {!isSold && (
            <button
              type="button"
              onClick={() => onExpressInterest(product)}
              className="py-2.5 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
            >
              Tenho Interesse
            </button>
          )}
        </div>

        {/* Admin Quick Action Controls */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-amber-100 bg-amber-50/50 -mx-5 -mb-5 p-3 rounded-b-3xl flex items-center justify-between text-xs">
            {/* Quick Status Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-amber-900 font-semibold">Status:</span>
              <select
                value={status}
                onChange={(e) => onChangeStatus(id, e.target.value)}
                className="bg-white border border-amber-300 rounded-lg px-2 py-1 text-xs font-medium text-stone-800 focus:outline-none"
              >
                <option value="disponivel">Disponível</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>

            {/* Edit & Delete */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onEditProduct(product)}
                title="Editar este produto"
                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 text-amber-700" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteProduct(id, title)}
                title="Excluir este produto"
                className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
