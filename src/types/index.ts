export interface ProductColorVariant {
  name: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  salePrice?: number;
  discount?: number; // percentage
  stock: number;
  sku: string;
  category: string;
  subcategory: string;
  brand: string;
  sizes: string[];
  colors: { name: string; hex: string; image?: string }[];
  colorVariants?: ProductColorVariant[];
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  isFlashSale?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isWholesale?: boolean;
  specifications?: Record<string, string>;
  features?: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: string[];
  status: 'active' | 'inactive';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  stock: number;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN REQUESTED'
  | 'RETURNED';

export type PaymentMethod =
  | 'CASH_ON_DELIVERY'
  | 'WHATSAPP_CONFIRM'
  | 'WHATSAPP_ORDER'
  | 'WHATSAPP_PAYMENT'
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'ONLINE_PAYMENT';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
}

export type PaymentStatus = 'UNPAID' | 'PAID' | 'VERIFYING' | 'REFUNDED' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address: string;
  district: string;
  area: string;
  deliveryMethod: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';
  deliveryCharge: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  items: OrderItem[];
  orderNotes?: string;
  createdAt: string;
  estimatedDeliveryDate?: string;
  courierName?: string;
  trackingNumber?: string;
  statusTimeline: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  photoURL?: string;
  role: 'customer' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
  addresses?: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  area: string;
  isDefault?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured?: boolean;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  maxDiscount?: number;
  expiry: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  categorySpecific?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  link: string;
  type: 'hero' | 'promo' | 'slider';
  isActive: boolean;
  sortOrder: number;
}

export interface FlashSale {
  id: string;
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  productIds: string[];
  isActive: boolean;
}

export interface DeliverySettings {
  insideDhakaFee: number;
  outsideDhakaFee: number;
  freeDeliveryThreshold: number;
  insideDhakaTime: string;
  outsideDhakaTime: string;
}

export interface PaymentSettings {
  codEnabled: boolean;
  codInstructions: string;
  whatsappPaymentEnabled: boolean;
  whatsappPaymentNumber: string;
  whatsappPaymentInstructions: string;
  whatsappPaymentMessage: string;
  bkashEnabled: boolean;
  bkashNumber: string;
  bkashType: 'Merchant' | 'Personal';
  bkashInstructions: string;
  nagadEnabled: boolean;
  nagadNumber: string;
  nagadType: 'Merchant' | 'Personal';
  nagadInstructions: string;
  rocketEnabled: boolean;
  rocketNumber: string;
  rocketInstructions: string;
  onlinePaymentEnabled: boolean;
}

export interface WebsiteSettings {
  websiteName: string;
  companyName: string;
  domain: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  favicon?: string;
  headerLogo: string;
  headerName: string;
  footerLogo: string;
  footerName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  taxPercent: number;
  maintenanceMode: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  whatsappNumber: string;
  messengerUrl: string;
  footerAbout: string;
  topAnnouncementText: string;
  showTopAnnouncement: boolean;
  showTrackOrder: boolean;
  showHotline: boolean;
}

export interface SupportSettings {
  whatsapp: {
    enabled: boolean;
    name: string;
    number: string;
    icon: string;
    logoUrl?: string;
    message: string;
  };
  messenger: {
    enabled: boolean;
    name: string;
    link: string;
    icon: string;
    logoUrl?: string;
  };
  phone: {
    enabled: boolean;
    name: string;
    number: string;
    icon: string;
    logoUrl?: string;
  };
}

export interface WhatsAppOrderSettings {
  whatsappNumber: string;
  whatsappDisplayName: string;
  displayName?: string;
  orderConfirmationTemplate: string;
  messageTemplate?: string;
  paymentWhatsAppNumber: string;
  paymentMessage: string;
  paymentInstructions: string;
  paymentConfirmationText: string;
}

export interface ProductShareSettings {
  domain: string; // Must be https://shopbd.top/
  baseDomain?: string;
  shareMessageTemplate: string;
  defaultMessage?: string;
  hashtags?: string;
}

export interface WebsiteSection {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  type: 'hero' | 'flashSale' | 'categories' | 'trending' | 'bestSellers' | 'newArrivals' | 'promoBanner' | 'valueBadges' | 'reviews' | 'custom-products' | 'custom-banner';
  promoImage?: string;
  promoLink?: string;
  sortOrder: number;
  order?: number;
  itemLimit?: number;
}

export interface SupportTicket {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  orderNumber?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  messages: {
    id: string;
    sender: 'customer' | 'support';
    senderName: string;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'promo' | 'system';
  link?: string;
  createdAt: string;
  read: boolean;
}
