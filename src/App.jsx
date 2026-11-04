import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Filters } from './components/Filters';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { InterestModal } from './components/InterestModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ProductFormModal } from './components/ProductFormModal';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

import {
  fetchProducts,
  saveProduct,
  deleteProduct,
  updateProductStatus,
  fetchInterests,
  updateInterestStatus,
  deleteInterest,
  getSettings,
  saveSettings,
  getAdminSession,
  setAdminSession,
} from './services/storage';

export function App() {
  const [products, setProducts] = useState([]);
  const [interests, setInterests] = useState([]);
  const [settings, setSettings] = useState(getSettings());
  const [isAdmin, setIsAdmin] = useState(getAdminSession());
  const [activeAdminTab, setActiveAdminTab] = useState('catalog'); // 'catalog' or 'admin'

  // Modals state
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [selectedProductInterest, setSelectedProductInterest] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // null when closed, object or {} when open
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [sortBy, setSortBy] = useState('recent');

  // Load data on start
  const loadData = async () => {
    try {
      const prods = await fetchProducts();
      setProducts(prods);

      const ints = await fetchInterests();
      setInterests(ints);

      setSettings(getSettings());
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Check URL hash for direct product link (e.g. #prod-2)
  useEffect(() => {
    if (products.length > 0 && window.location.hash) {
      const hashId = window.location.hash.replace('#', '');
      const match = products.find((p) => p.id === hashId);
      if (match) {
        setSelectedProductDetails(match);
      }
    }
  }, [products]);

  // Handle Admin Login & Logout
  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setAdminSession(true);
    setActiveAdminTab('admin');
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
    setAdminSession(false);
    setActiveAdminTab('catalog');
  };

  // Product CRUD Handlers
  const handleSaveProduct = async (productData) => {
    await saveProduct(productData);
    await loadData();
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id, title) => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${title}"?`)) {
      await deleteProduct(id);
      await loadData();
      if (selectedProductDetails?.id === id) {
        setSelectedProductDetails(null);
      }
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    await updateProductStatus(id, newStatus);
    await loadData();
  };

  // Interest handlers
  const handleUpdateInterestStatus = async (id, newStatus) => {
    await updateInterestStatus(id, newStatus);
    await loadData();
  };

  const handleDeleteInterest = async (id) => {
    if (window.confirm('Excluir este registro de interesse?')) {
      await deleteInterest(id);
      await loadData();
    }
  };

  const handleSaveSettings = (newSettings) => {
    const updated = saveSettings(newSettings);
    setSettings(updated);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: products.length,
      available: products.filter((p) => (p.status || 'disponivel') === 'disponivel').length,
      reserved: products.filter((p) => p.status === 'reservado').length,
      sold: products.filter((p) => p.status === 'vendido').length,
    };
  }, [products]);

  // Counts by category
  const countsByCategory = useMemo(() => {
    const counts = { todos: products.length };
    products.forEach((p) => {
      const cat = p.category || 'outros';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = (p.title || '').toLowerCase().includes(query);
          const matchDesc = (p.description || '').toLowerCase().includes(query);
          const matchBrand = (p.brand || '').toLowerCase().includes(query);
          if (!matchTitle && !matchDesc && !matchBrand) return false;
        }

        // Category filter
        if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'todos') {
          const itemStatus = p.status || 'disponivel';
          if (itemStatus !== selectedStatus) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'discount') {
          const discA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discB - discA;
        }
        // Default: recent
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const pendingInterestsCount = useMemo(() => {
    return interests.filter((i) => i.status === 'novo').length;
  }, [interests]);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Sticky Header */}
      <Header
        settings={settings}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
        activeAdminTab={activeAdminTab}
        setActiveAdminTab={setActiveAdminTab}
        pendingInterestsCount={pendingInterestsCount}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {isAdmin && activeAdminTab === 'admin' ? (
          /* Dedicated Admin Dashboard */
          <AdminPanel
            products={products}
            interests={interests}
            settings={settings}
            onAddNewProduct={() => setEditingProduct({})}
            onEditProduct={(p) => setEditingProduct(p)}
            onDeleteProduct={handleDeleteProduct}
            onChangeStatus={handleChangeStatus}
            onUpdateInterestStatus={handleUpdateInterestStatus}
            onDeleteInterest={handleDeleteInterest}
            onSaveSettings={handleSaveSettings}
            onRefreshData={loadData}
            onExitAdmin={() => setActiveAdminTab('catalog')}
          />
        ) : (
          /* Public Catalog View */
          <div>
            {/* Hero Section */}
            <Hero settings={settings} stats={stats} />

            {/* Catalog Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              
              {/* Filters & Search */}
              <Filters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                countsByCategory={countsByCategory}
              />

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={(p) => setSelectedProductDetails(p)}
                      onExpressInterest={(p) => setSelectedProductInterest(p)}
                      isAdmin={isAdmin}
                      onEditProduct={(p) => setEditingProduct(p)}
                      onDeleteProduct={handleDeleteProduct}
                      onChangeStatus={handleChangeStatus}
                    />
                  ))}
                </div>
              ) : (
                /* Empty state */
                <div className="py-20 text-center rounded-3xl bg-white border border-stone-200/80 p-8 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    🔍
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">
                    Nenhum item encontrado
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                    Não encontramos itens que coincidam com sua busca ou filtros selecionados. Tente limpar os filtros.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('todos');
                      setSelectedStatus('todos');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => setActiveAdminTab('admin')}
      />

      {/* Product Detail Modal */}
      {selectedProductDetails && (
        <ProductDetailModal
          product={selectedProductDetails}
          onClose={() => setSelectedProductDetails(null)}
          onExpressInterest={(p) => setSelectedProductInterest(p)}
          settings={settings}
          isAdmin={isAdmin}
          onEditProduct={(p) => setEditingProduct(p)}
        />
      )}

      {/* Buyer Interest Form Modal */}
      {selectedProductInterest && (
        <InterestModal
          product={selectedProductInterest}
          settings={settings}
          onClose={() => setSelectedProductInterest(null)}
          onInterestSubmitted={() => loadData()}
        />
      )}

      {/* Admin Login Modal */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          currentPin={settings.adminPin}
        />
      )}

      {/* Product Form Modal (Add / Edit) */}
      {editingProduct !== null && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
}

export default App;
