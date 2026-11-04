import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from '../data/initialProducts';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  PRODUCTS: 'feira_products_v3',
  SETTINGS: 'feira_settings_v3',
  INTERESTS: 'feira_interests_v3',
  ADMIN_SESSION: 'feira_admin_session_v3',
};

// ----------------- LOCAL STORAGE HELPERS -----------------

function getLocalData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`Erro ao ler ${key} do localStorage:`, e);
    return fallback;
  }
}

function setLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Erro ao gravar ${key} no localStorage:`, e);
  }
}

// ----------------- PRODUCTS SERVICE -----------------

export async function fetchProducts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        // Map Supabase snake_case to camelCase
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          price: Number(item.price),
          originalPrice: item.original_price ? Number(item.original_price) : null,
          condition: item.condition,
          dimensions: item.dimensions,
          voltage: item.voltage,
          brand: item.brand,
          description: item.description,
          pickupLocation: item.pickup_location,
          status: item.status,
          featured: Boolean(item.featured),
          images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
          createdAt: item.created_at,
        }));
      } else if (data && data.length === 0 && INITIAL_PRODUCTS.length > 0) {
        // Auto-seed Supabase with current initial products
        try {
          const payload = INITIAL_PRODUCTS.map((p) => ({
            id: p.id,
            title: p.title,
            category: p.category,
            price: Number(p.price) || 0,
            original_price: p.originalPrice ? Number(p.originalPrice) : null,
            condition: p.condition,
            dimensions: p.dimensions,
            voltage: p.voltage,
            brand: p.brand,
            description: p.description,
            pickup_location: p.pickupLocation,
            status: p.status || 'disponivel',
            featured: Boolean(p.featured),
            images: p.images || [],
            created_at: p.createdAt || new Date().toISOString(),
          }));
          await supabase.from('products').upsert(payload);
          return INITIAL_PRODUCTS;
        } catch (seedErr) {
          console.warn('Erro ao auto-popular Supabase:', seedErr);
        }
      }
    } catch (err) {
      console.warn('Falha ao buscar produtos do Supabase, usando local:', err);
    }
  }

  // Fallback to local storage
  const local = getLocalData(STORAGE_KEYS.PRODUCTS, null);
  if (!local) {
    setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }
  return local;
}

export async function saveProduct(product) {
  const isEditing = Boolean(product.id);
  const now = new Date().toISOString();

  const productToSave = {
    ...product,
    id: product.id || `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: product.createdAt || now,
    price: Number(product.price) || 0,
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        id: productToSave.id,
        title: productToSave.title,
        category: productToSave.category,
        price: productToSave.price,
        original_price: productToSave.originalPrice,
        condition: productToSave.condition,
        dimensions: productToSave.dimensions,
        voltage: productToSave.voltage,
        brand: productToSave.brand,
        description: productToSave.description,
        pickup_location: productToSave.pickupLocation,
        status: productToSave.status || 'disponivel',
        featured: Boolean(productToSave.featured),
        images: productToSave.images || [],
        created_at: productToSave.createdAt,
      };

      const { error } = await supabase.from('products').upsert(payload);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao salvar no Supabase:', err);
    }
  }

  // Always update local storage for fast reactive UI / offline cache
  const currentList = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  let updatedList;
  if (isEditing) {
    updatedList = currentList.map((p) => (p.id === productToSave.id ? productToSave : p));
  } else {
    updatedList = [productToSave, ...currentList];
  }
  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);
  return productToSave;
}

export async function deleteProduct(productId) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao excluir no Supabase:', err);
    }
  }

  const currentList = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updatedList = currentList.filter((p) => p.id !== productId);
  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);
  return updatedList;
}

export async function updateProductStatus(productId, newStatus) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao alterar status no Supabase:', err);
    }
  }

  const currentList = getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const updatedList = currentList.map((p) =>
    p.id === productId ? { ...p, status: newStatus } : p
  );
  setLocalData(STORAGE_KEYS.PRODUCTS, updatedList);
  return updatedList;
}

// ----------------- INTERESTS SERVICE -----------------

export async function fetchInterests() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('interests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        return data.map((item) => ({
          id: item.id,
          productId: item.product_id,
          productTitle: item.product_title,
          productPrice: item.product_price,
          name: item.name,
          phone: item.phone,
          message: item.message,
          status: item.status || 'novo',
          createdAt: item.created_at,
        }));
      }
    } catch (err) {
      console.warn('Erro ao buscar interesses do Supabase:', err);
    }
  }

  return getLocalData(STORAGE_KEYS.INTERESTS, []);
}

export async function saveInterest({ productId, productTitle, productPrice, name, phone, message }) {
  const newInterest = {
    id: `int-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    productId,
    productTitle,
    productPrice: Number(productPrice) || 0,
    name: name.trim(),
    phone: phone.trim(),
    message: (message || '').trim(),
    status: 'novo',
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('interests').insert({
        id: newInterest.id,
        product_id: newInterest.productId,
        product_title: newInterest.productTitle,
        product_price: newInterest.productPrice,
        name: newInterest.name,
        phone: newInterest.phone,
        message: newInterest.message,
        status: newInterest.status,
        created_at: newInterest.createdAt,
      });
      if (error) throw error;
    } catch (err) {
      console.error('Erro ao salvar interesse no Supabase:', err);
    }
  }

  const current = getLocalData(STORAGE_KEYS.INTERESTS, []);
  const updated = [newInterest, ...current];
  setLocalData(STORAGE_KEYS.INTERESTS, updated);
  return newInterest;
}

export async function updateInterestStatus(interestId, status) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('interests').update({ status }).eq('id', interestId);
    } catch (err) {
      console.error('Erro ao atualizar status do interesse:', err);
    }
  }

  const current = getLocalData(STORAGE_KEYS.INTERESTS, []);
  const updated = current.map((item) => (item.id === interestId ? { ...item, status } : item));
  setLocalData(STORAGE_KEYS.INTERESTS, updated);
  return updated;
}

export async function deleteInterest(interestId) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('interests').delete().eq('id', interestId);
    } catch (err) {
      console.error('Erro ao excluir interesse:', err);
    }
  }

  const current = getLocalData(STORAGE_KEYS.INTERESTS, []);
  const updated = current.filter((item) => item.id !== interestId);
  setLocalData(STORAGE_KEYS.INTERESTS, updated);
  return updated;
}

// ----------------- SETTINGS SERVICE -----------------

export function getSettings() {
  let local = getLocalData(STORAGE_KEYS.SETTINGS, null);
  if (!local) {
    const old = getLocalData('desapego_settings_v1', null);
    if (old) {
      local = {
        ...INITIAL_SETTINGS,
        ...old,
        siteTitle: old.siteTitle === 'Desapego da Casa' ? INITIAL_SETTINGS.siteTitle : old.siteTitle,
        cityNeighborhood: old.cityNeighborhood?.includes('Pinheiros') ? INITIAL_SETTINGS.cityNeighborhood : old.cityNeighborhood,
        whatsappNumber: old.whatsappNumber === '5511999999999' ? INITIAL_SETTINGS.whatsappNumber : old.whatsappNumber,
        whatsappDisplay: old.whatsappDisplay === '(11) 99999-9999' ? INITIAL_SETTINGS.whatsappDisplay : old.whatsappDisplay,
        adminPin: (old.adminPin === 'admin123' || !old.adminPin) ? INITIAL_SETTINGS.adminPin : old.adminPin,
      };
    } else {
      local = INITIAL_SETTINGS;
    }
    setLocalData(STORAGE_KEYS.SETTINGS, local);
  } else if (local.adminPin === 'admin123') {
    local.adminPin = INITIAL_SETTINGS.adminPin;
    setLocalData(STORAGE_KEYS.SETTINGS, local);
  }
  return { ...INITIAL_SETTINGS, ...local };
}

export function saveSettings(newSettings) {
  const current = getSettings();
  const merged = { ...current, ...newSettings };
  setLocalData(STORAGE_KEYS.SETTINGS, merged);
  return merged;
}

// ----------------- ADMIN SESSION -----------------

export function getAdminSession() {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSession(isAdmin) {
  try {
    if (isAdmin) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  } catch (e) {
    console.error('Erro ao manipular sessão de admin:', e);
  }
}

// ----------------- BACKUP / RESTORE -----------------

export function exportBackup() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    products: getLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),
    settings: getSettings(),
    interests: getLocalData(STORAGE_KEYS.INTERESTS, []),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-desapego-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importBackup(jsonData) {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (parsed.products && Array.isArray(parsed.products)) {
      setLocalData(STORAGE_KEYS.PRODUCTS, parsed.products);
    }
    if (parsed.settings && typeof parsed.settings === 'object') {
      setLocalData(STORAGE_KEYS.SETTINGS, parsed.settings);
    }
    if (parsed.interests && Array.isArray(parsed.interests)) {
      setLocalData(STORAGE_KEYS.INTERESTS, parsed.interests);
    }
    return true;
  } catch (e) {
    console.error('Erro ao importar backup:', e);
    return false;
  }
}

export function resetToDefaults() {
  setLocalData(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  setLocalData(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  setLocalData(STORAGE_KEYS.INTERESTS, []);
}
