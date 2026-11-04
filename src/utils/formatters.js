/**
 * Format a number to Brazilian Real currency format: R$ 1.250,00 or R$ 1.250
 */
export function formatCurrency(value, showCents = false) {
  if (value === null || value === undefined || isNaN(value)) return 'R$ 0';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Clean phone number to WhatsApp international format (e.g. 5511999999999)
 */
export function formatWhatsAppNumber(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55')) return digits;
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Format phone for display (e.g. (11) 98765-4321)
 */
export function formatPhoneDisplay(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  
  // Strip 55 if present for cleaner national display
  const num = digits.startsWith('55') && digits.length >= 12 ? digits.slice(2) : digits;
  
  if (num.length === 11) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
  }
  if (num.length === 10) {
    return `(${num.slice(0, 2)}) ${num.slice(2, 6)}-${num.slice(6)}`;
  }
  return phone;
}

/**
 * Format date to Brazilian relative or short format
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(currentPrice, originalPrice) {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}
