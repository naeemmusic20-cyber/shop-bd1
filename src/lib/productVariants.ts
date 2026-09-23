import { Product, Order, WhatsAppOrderSettings } from '../types';

export interface ProductColorVariantItem {
  name: string;
  image: string;
  hex: string;
}

const COLOR_HEX_MAP: Record<string, string> = {
  black: '#111827',
  'midnight black': '#0f172a',
  'matte black': '#18181b',
  'jet black': '#09090b',
  'charcoal black': '#27272a',
  'piano black': '#000000',
  silver: '#94a3b8',
  'silver steel': '#cbd5e1',
  'silver chrome': '#94a3b8',
  white: '#ffffff',
  'pure white': '#ffffff',
  'glacier white': '#f8fafc',
  'cream white': '#fef3c7',
  'off white': '#fafaf9',
  blue: '#2563eb',
  'royal navy': '#1e3a8a',
  'navy blue': '#172554',
  'ocean blue': '#0284c7',
  'sky blue': '#38bdf8',
  red: '#dc2626',
  'crimson red': '#991b1b',
  green: '#16a34a',
  'olive green': '#365314',
  'emerald green': '#059669',
  gold: '#d97706',
  'rose gold': '#e11d48',
  purple: '#9333ea',
  'midnight purple': '#581c87',
  yellow: '#eab308',
  orange: '#ea580c',
  pink: '#db2777',
  brown: '#78350f',
  'vintage bronze': '#92400e',
  bronze: '#78350f',
  grey: '#64748b',
  gray: '#64748b',
};

export const getColorHex = (name: string): string => {
  if (!name) return '#334155';
  const clean = name.toLowerCase().trim();
  if (COLOR_HEX_MAP[clean]) {
    return COLOR_HEX_MAP[clean];
  }
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (clean.includes(key)) {
      return hex;
    }
  }
  return '#475569';
};

/**
 * Ensures a strict 1-to-1 connection between color variant and image.
 * Number of color options ALWAYS matches the number of color/variant images.
 */
export const getProductColorVariants = (
  product: Partial<Product> | null | undefined
): ProductColorVariantItem[] => {
  if (!product) return [];

  // 1. If explicit colorVariants are configured
  if (product.colorVariants && product.colorVariants.length > 0) {
    return product.colorVariants
      .filter((cv) => cv && cv.image && cv.image.trim().length > 0)
      .map((cv, idx) => {
        const variantName = (cv.name && cv.name.trim()) || (idx === 0 ? 'Default' : `Variant ${idx + 1}`);
        return {
          name: variantName,
          image: cv.image.trim(),
          hex: getColorHex(variantName),
        };
      });
  }

  // 2. Derive 1-to-1 mapping from images & colors
  const images = (product.images || []).filter((img) => img && img.trim().length > 0);

  if (images.length === 0) {
    const fallbackImage = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80';
    const fallbackName = product.colors?.[0]?.name || 'Default';
    return [{ name: fallbackName, image: fallbackImage, hex: getColorHex(fallbackName) }];
  }

  return images.map((img, idx) => {
    const colorObj = product.colors?.[idx];
    const colorName =
      colorObj?.name?.trim() ||
      (idx === 0
        ? 'Black'
        : idx === 1
        ? 'Silver'
        : idx === 2
        ? 'Blue'
        : `Color ${idx + 1}`);
    return {
      name: colorName,
      image: img.trim(),
      hex: colorObj?.hex || getColorHex(colorName),
    };
  });
};

/**
 * Generates formatted WhatsApp confirmation message
 */
export const generateWhatsAppOrderMessage = (
  order: Order,
  template?: string
): string => {
  const fullAddress = `${order.address}, ${order.area ? `${order.area}, ` : ''}${order.district}`;

  const itemsList = order.items
    .map((item, idx) => {
      const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
      const variantText = item.selectedColor ? `Color/Variant: *${item.selectedColor}*` : 'Color/Variant: Standard';
      const sizeText = item.selectedSize ? ` | Size: ${item.selectedSize}` : '';
      return `${idx + 1}. *${item.name}*\n   • ${variantText}${sizeText}\n   • Quantity: *${item.quantity}*\n   • Price: ৳${itemPrice.toLocaleString()}\n   • Subtotal: ৳${(itemPrice * item.quantity).toLocaleString()}`;
    })
    .join('\n\n');

  if (template && template.includes('{customer_name}')) {
    return template
      .replace(/{customer_name}/g, order.customerName)
      .replace(/{phone}/g, order.customerPhone)
      .replace(/{customer_phone}/g, order.customerPhone)
      .replace(/{address}/g, fullAddress)
      .replace(/{order_id}/g, order.orderNumber)
      .replace(/{items}/g, itemsList)
      .replace(/{subtotal}/g, `৳${order.subtotal.toLocaleString()}`)
      .replace(/{delivery_charge}/g, `৳${(order.deliveryCharge ?? 0).toLocaleString()}`)
      .replace(/{total}/g, `৳${order.total.toLocaleString()}`)
      .replace(/{payment_method}/g, 'WhatsApp Confirm Order')
      .replace(/{payment_status}/g, order.paymentStatus || 'Pending');
  }

  return `🛍️ *SHOP BD - WHATSAPP ORDER CONFIRMATION REQUEST*

Hello Shop BD, please confirm my order:

📋 *CUSTOMER INFORMATION*
• *Name:* ${order.customerName}
• *Phone:* ${order.customerPhone}
• *Delivery Address:* ${fullAddress}

📦 *ORDER DETAILS (ID: ${order.orderNumber})*
${itemsList}

💰 *PAYMENT & BILLING*
• *Product Price:* ৳${order.subtotal.toLocaleString()}
• *Delivery Charge:* ৳${(order.deliveryCharge ?? 0).toLocaleString()}
${order.discount > 0 ? `• *Discount:* -৳${order.discount.toLocaleString()}\n` : ''}• *Total Amount:* ৳${order.total.toLocaleString()}
• *Payment Option:* WHATSAPP CONFIRM ORDER

✅ *CONFIRMATION REQUEST*
Please confirm my order and advise parcel dispatch timeline. Thank you!`;
};
