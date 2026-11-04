import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Plus,
  Trash2,
  Star,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

const CATEGORY_OPTIONS = [
  { value: 'moveis', label: 'Móveis' },
  { value: 'eletro', label: 'Eletrodomésticos' },
  { value: 'decoracao', label: 'Decoração & Iluminação' },
  { value: 'outros', label: 'Outros' },
];

const CONDITION_OPTIONS = [
  'Seminovo (Pouco Uso)',
  'Excelente Estado',
  'Bom Estado',
  'Novo / Lacrado',
  'Com marcas leves de uso',
];

const VOLTAGE_OPTIONS = [
  { value: '', label: 'Não se aplica' },
  { value: '110V', label: '110V (127V)' },
  { value: '220V', label: '220V' },
  { value: 'Bivolt', label: 'Bivolt' },
];

export function ProductFormModal({ product, onClose, onSave }) {
  const isEditing = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    id: product?.id || '',
    title: product?.title || '',
    category: product?.category || 'moveis',
    price: product?.price !== undefined ? product.price : '',
    originalPrice: product?.originalPrice || '',
    condition: product?.condition || 'Seminovo (Pouco Uso)',
    dimensions: product?.dimensions || '',
    voltage: product?.voltage || '',
    brand: product?.brand || '',
    description: product?.description || '',
    pickupLocation: product?.pickupLocation || '',
    status: product?.status || 'disponivel',
    featured: Boolean(product?.featured),
    images: product?.images ? [...product.images] : [],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle uploading photos from device
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsCompressing(true);
    setErrorMessage('');

    try {
      const compressedList = [];
      for (const file of files) {
        try {
          const result = await compressImage(file, 1600, 1600, 0.82);
          compressedList.push(result.dataUrl);
        } catch (err) {
          console.warn(`Erro ao comprimir arquivo ${file.name}:`, err);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...compressedList],
      }));
    } catch (err) {
      setErrorMessage('Ocorreu um erro ao processar as fotos selecionadas.');
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  // Handle adding image via web URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  // Set photo as cover (move to index 0)
  const handleSetCover = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const [chosen] = newImages.splice(index, 1);
      newImages.unshift(chosen);
      return { ...prev, images: newImages };
    });
  };

  // Remove photo
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Por favor, informe o título do item.');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Por favor, informe um preço de venda válido.');
      return;
    }
    if (formData.images.length === 0) {
      setErrorMessage('Por favor, adicione pelo menos 1 foto do item.');
      return;
    }

    onSave({
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 transition-opacity animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              {isEditing ? 'Editar Item do Catálogo' : 'Cadastrar Novo Item para Venda'}
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

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section: Photos (Crucial requirement: multiple photos per item) */}
          <div className="space-y-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Fotos do Item ({formData.images.length}) *
                </label>
                <span className="text-[11px] text-stone-500">
                  Adicione uma ou mais fotos reais do móvel/eletrodoméstico de diferentes ângulos.
                </span>
              </div>
              {formData.images.length > 0 && (
                <span className="text-xs font-medium text-amber-800">
                  Primeira foto é a capa
                </span>
              )}
            </div>

            {/* Photo Upload Zone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Device file upload */}
              <label className="border-2 border-dashed border-stone-300 hover:border-amber-600 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {isCompressing ? (
                  <div className="flex flex-col items-center py-2">
                    <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                    <span className="text-xs text-stone-600 mt-2 font-medium">
                      Otimizando fotos...
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-stone-400 group-hover:text-amber-600 transition-colors" />
                    <span className="text-xs font-semibold text-stone-700 group-hover:text-stone-900 mt-2">
                      Carregar fotos do celular / PC
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      Pode selecionar várias de uma vez
                    </span>
                  </>
                )}
              </label>

              {/* Paste URL */}
              <div className="border border-stone-200 rounded-2xl p-3 bg-white flex flex-col justify-between">
                <span className="text-xs font-medium text-stone-700 block mb-1">
                  Ou adicione link direto de imagem:
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/foto.jpg"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:border-amber-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-xl transition-colors shrink-0"
                  >
                    Adicionar
                  </button>
                </div>
                <span className="text-[10px] text-stone-400 mt-1">
                  Ex: links do Unsplash, Imgur, etc.
                </span>
              </div>
            </div>

            {/* Uploaded Photos Grid */}
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {formData.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Cover badge */}
                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-bold shadow-xs">
                        Foto de Capa
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/60 hover:bg-black/80 text-white text-[10px] font-medium backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Tornar Capa
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors"
                      title="Excluir esta foto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-stone-400">
                Nenhuma foto anexada ainda. Adicione ao menos 1 foto.
              </div>
            )}
          </div>

          {/* Section: Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Título do Item *
              </label>
              <input
                type="text"
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Sofá 3 Lugares Retrátil e Reclinável em Linho Bege"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Categoria *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Estado de Conservação
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                {CONDITION_OPTIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Preço de Venda (R$) *
              </label>
              <input
                type="number"
                step="any"
                required
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ex: 1450"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 transition-all"
              />
            </div>

            {/* Original / Reference Price */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Preço Original / Novo (R$) <span className="font-normal text-stone-400">(opcional)</span>
              </label>
              <input
                type="number"
                step="any"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                placeholder="Ex: 3200 (para mostrar o desconto)"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Dimensões (L × A × P)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                placeholder="Ex: 220cm (L) × 102cm (A) × 110cm (P)"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Voltage */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Voltagem (para eletros)
              </label>
              <select
                name="voltage"
                value={formData.voltage}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                {VOLTAGE_OPTIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Marca / Fabricante
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Ex: Brastemp, Tok&Stok, Electrolux"
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Status Atual do Item
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 cursor-pointer"
              >
                <option value="disponivel">Disponível para Venda</option>
                <option value="reservado">Reservado / Em Negociação</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>

            {/* Pickup Location */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Instruções de Retirada / Frete
              </label>
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Ex: Retirada em Petrópolis - Centro (prédio com elevador de carga). Desmontagem por conta do comprador."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Descrição Detalhada do Item
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva detalhes como tempo de uso, funcionamento, motivos do desapego, se possui manual ou acessórios..."
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-amber-600 resize-none"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              {isEditing ? 'Salvar Alterações' : 'Publicar Anúncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
