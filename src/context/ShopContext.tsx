import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  WishlistItem, 
  Order, 
  OrderStatus, 
  PaymentMethod, 
  Banner, 
  FlashSale, 
  DeliverySettings, 
  PaymentSettings, 
  WebsiteSettings, 
  Coupon, 
  Review, 
  User, 
  AppNotification, 
  Address,
  SupportSettings,
  WhatsAppOrderSettings,
  ProductShareSettings,
  WebsiteSection
} from '../types';
import { 
  initialProducts, 
  initialCategories, 
  initialBanners, 
  initialFlashSale, 
  initialDeliverySettings, 
  initialPaymentSettings, 
  initialWebsiteSettings, 
  initialSupportSettings,
  initialWhatsAppOrderSettings,
  initialProductShareSettings,
  initialWebsiteSections,
  initialCoupons, 
  initialReviews, 
  initialOrders 
} from '../data/initialData';
import { getProductColorVariants } from '../lib/productVariants';
import { 
  auth, 
  onAuthStateChanged, 
  AUTHORIZED_ADMIN_UID, 
  AUTHORIZED_ADMIN_UIDS,
  isAuthorizedAdminUser,
  firebaseAdminSignOut,
  updateLiveOrderStatus 
} from '../lib/firebase';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ShopContextType {
  // Navigation
  currentPage: string;
  currentParam: string | null;
  navigateTo: (page: string, param?: string | null) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string, selectedImage?: string) => void;
  removeFromCart: (productId: string, selectedSize?: string, selectedColor?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => void;
  deleteCoupon: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    district: string;
    area: string;
    deliveryMethod: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';
    paymentMethod: PaymentMethod;
    transactionId?: string;
    orderNotes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, trackingNumber?: string, note?: string) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => void;
  deleteOrder: (orderId: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  requestReturn: (orderId: string, reason?: string) => void;
  findOrder: (query: string) => Order | undefined;

  // Banners & Flash Sale
  banners: Banner[];
  updateBanners: (banners: Banner[]) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  flashSale: FlashSale;
  updateFlashSale: (updates: Partial<FlashSale>) => void;

  // Website Sections Control
  websiteSections: WebsiteSection[];
  updateWebsiteSections: (sections: WebsiteSection[]) => void;
  updateWebsiteSection: (id: string, updates: Partial<WebsiteSection>) => void;
  addWebsiteSection: (section: Omit<WebsiteSection, 'id'>) => void;
  deleteWebsiteSection: (id: string) => void;

  // Settings
  deliverySettings: DeliverySettings;
  updateDeliverySettings: (settings: DeliverySettings) => void;
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  websiteSettings: WebsiteSettings;
  updateWebsiteSettings: (settings: WebsiteSettings) => void;
  supportSettings: SupportSettings;
  updateSupportSettings: (settings: SupportSettings) => void;
  whatsappOrderSettings: WhatsAppOrderSettings;
  updateWhatsAppOrderSettings: (settings: WhatsAppOrderSettings) => void;
  updateWhatsappOrderSettings: (settings: WhatsAppOrderSettings) => void;
  productShareSettings: ProductShareSettings;
  updateProductShareSettings: (settings: ProductShareSettings) => void;

  // Modals (Support & Share)
  isSupportModalOpen: boolean;
  setIsSupportModalOpen: (open: boolean) => void;
  sharingProduct: Product | null;
  isShareModalOpen: boolean;
  openShareModal: (product: Product) => void;
  closeShareModal: () => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  updateReviewStatus: (id: string, status: 'approved' | 'rejected') => void;
  deleteReview: (id: string) => void;

  // Auth & Customer
  currentUser: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<User>) => void;
  customers: User[];
  toggleBlockCustomer: (userId: string) => void;

  // Strict Firebase Admin Security
  isAuthorizedAdmin: boolean;
  adminFirebaseUser: any | null;
  adminLogout: () => Promise<void>;

  // Recently Viewed & Search
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  searchHistory: string[];
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // Notifications & Toast
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  removeToast: (id: string) => void;

  // Quick Cart Drawer
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with URL parsing
  const parseUrl = (): { page: string; param: string | null } => {
    if (typeof window === 'undefined') return { page: 'home', param: null };
    const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const hash = window.location.hash.replace(/^#\/?/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const queryPage = searchParams.get('page');
    const queryParam = searchParams.get('param');

    if (
      pathname === 'admin' || 
      pathname.startsWith('admin/') || 
      pathname === 'admin-panel' ||
      pathname === 'admin-login' ||
      hash === 'admin' || 
      hash === 'admin-panel' ||
      queryPage === 'admin' ||
      queryPage === 'admin-panel'
    ) {
      return { page: 'admin', param: null };
    }
    if (queryPage) {
      return { page: queryPage, param: queryParam };
    }
    if (hash) {
      const parts = hash.split('/');
      return { page: parts[0] || 'home', param: parts[1] || null };
    }
    if (pathname) {
      const parts = pathname.split('/');
      return { page: parts[0] || 'home', param: parts[1] || null };
    }
    return { page: 'home', param: null };
  };

  const initialRoute = parseUrl();
  const [currentPage, setCurrentPage] = useState<string>(initialRoute.page);
  const [currentParam, setCurrentParam] = useState<string | null>(initialRoute.param);

  const navigateTo = (page: string, param: string | null = null) => {
    setCurrentPage(page);
    setCurrentParam(param);
    try {
      if (page === 'admin') {
        window.history.pushState(null, '', '/admin');
      } else if (page === 'home') {
        window.history.pushState(null, '', '/');
      } else {
        window.history.pushState(null, '', `/${page}${param ? `/${param}` : ''}`);
      }
    } catch {
      // Ignore if pushState restricted
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const route = parseUrl();
      setCurrentPage(route.page);
      setCurrentParam(route.param);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Toast System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // State with LocalStorage Persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('shopbd_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: any) => {
            const vars = getProductColorVariants(p);
            return {
              ...p,
              images: vars.map(v => v.image),
              colors: vars.map(v => ({ name: v.name, hex: v.hex, image: v.image })),
              colorVariants: vars.map(v => ({ name: v.name, image: v.image }))
            };
          });
        }
      }
    } catch (e) {
      console.error('Error loading products from storage:', e);
    }
    return initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('shopbd_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('shopbd_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    const saved = localStorage.getItem('shopbd_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('shopbd_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('shopbd_banners');
    return saved ? JSON.parse(saved) : initialBanners;
  });

  const [flashSale, setFlashSale] = useState<FlashSale>(() => {
    try {
      const saved = localStorage.getItem('shopbd_flash_sale');
      return saved ? { ...initialFlashSale, ...JSON.parse(saved) } : initialFlashSale;
    } catch {
      return initialFlashSale;
    }
  });

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_delivery_settings');
      return saved ? { ...initialDeliverySettings, ...JSON.parse(saved) } : initialDeliverySettings;
    } catch {
      return initialDeliverySettings;
    }
  });

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_payment_settings');
      return saved ? { ...initialPaymentSettings, ...JSON.parse(saved) } : initialPaymentSettings;
    } catch {
      return initialPaymentSettings;
    }
  });

  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_website_settings');
      return saved ? { ...initialWebsiteSettings, ...JSON.parse(saved) } : initialWebsiteSettings;
    } catch {
      return initialWebsiteSettings;
    }
  });

  const [supportSettings, setSupportSettings] = useState<SupportSettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_support_settings');
      if (!saved) return initialSupportSettings;
      const parsed = JSON.parse(saved);
      return {
        ...initialSupportSettings,
        ...parsed,
        whatsapp: { ...initialSupportSettings.whatsapp, ...(parsed.whatsapp || {}) },
        messenger: { ...initialSupportSettings.messenger, ...(parsed.messenger || {}) },
        phone: { ...initialSupportSettings.phone, ...(parsed.phone || {}) }
      };
    } catch {
      return initialSupportSettings;
    }
  });

  const [whatsappOrderSettings, setWhatsAppOrderSettings] = useState<WhatsAppOrderSettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_whatsapp_order_settings');
      return saved ? { ...initialWhatsAppOrderSettings, ...JSON.parse(saved) } : initialWhatsAppOrderSettings;
    } catch {
      return initialWhatsAppOrderSettings;
    }
  });

  const [productShareSettings, setProductShareSettings] = useState<ProductShareSettings>(() => {
    try {
      const saved = localStorage.getItem('shopbd_product_share_settings');
      return saved ? { ...initialProductShareSettings, ...JSON.parse(saved) } : initialProductShareSettings;
    } catch {
      return initialProductShareSettings;
    }
  });

  const [websiteSections, setWebsiteSections] = useState<WebsiteSection[]>(() => {
    const saved = localStorage.getItem('shopbd_website_sections');
    return saved ? JSON.parse(saved) : initialWebsiteSections;
  });

  // Support & Share Modals
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [sharingProduct, setSharingProduct] = useState<Product | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const openShareModal = (product: Product) => {
    setSharingProduct(product);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setSharingProduct(null);
  };

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('shopbd_coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('shopbd_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('shopbd_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-customer-1',
      email: 'customer@shopbd.top',
      displayName: 'Ashikur Rahman',
      phoneNumber: '01712345678',
      role: 'customer',
      status: 'active',
      createdAt: '2026-08-01T00:00:00Z',
      addresses: [
        {
          id: 'addr-1',
          name: 'Home',
          phone: '01712345678',
          address: 'Flat 4B, Green Road, Dhanmondi',
          district: 'Dhaka',
          area: 'Dhanmondi',
          isDefault: true
        }
      ]
    };
  });

  const [customers, setCustomers] = useState<User[]>([
    {
      id: 'usr-customer-1',
      email: 'customer@shopbd.top',
      displayName: 'Ashikur Rahman',
      phoneNumber: '01712345678',
      role: 'customer',
      status: 'active',
      createdAt: '2026-08-01T00:00:00Z'
    },
    {
      id: 'usr-customer-2',
      email: 'tanvir.bd@gmail.com',
      displayName: 'Tanvir Hossain',
      phoneNumber: '01711223344',
      role: 'customer',
      status: 'active',
      createdAt: '2026-08-15T00:00:00Z'
    },
    {
      id: 'usr-customer-3',
      email: 'nusrat.ctg@yahoo.com',
      displayName: 'Nusrat Jahan',
      phoneNumber: '01822334455',
      role: 'customer',
      status: 'active',
      createdAt: '2026-08-20T00:00:00Z'
    }
  ]);

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(['Smartwatch', 'Panjabi', 'Earbuds', 'Air Fryer']);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Eid Flash Sale is LIVE!',
      message: 'Grab up to 50% discount on selected gadgets and fashion items.',
      type: 'promo',
      createdAt: new Date().toISOString(),
      read: false
    }
  ]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Strict Firebase Admin Authentication State
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState<boolean>(() => {
    return isAuthorizedAdminUser(auth?.currentUser);
  });
  const [adminFirebaseUser, setAdminFirebaseUser] = useState<any | null>(() => {
    return isAuthorizedAdminUser(auth?.currentUser) ? auth?.currentUser : null;
  });

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (isAuthorizedAdminUser(fbUser)) {
        setIsAuthorizedAdmin(true);
        setAdminFirebaseUser(fbUser);
      } else {
        setIsAuthorizedAdmin(false);
        setAdminFirebaseUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const adminLogout = async () => {
    try {
      await firebaseAdminSignOut();
    } catch (e) {
      console.error('Sign out error', e);
    }
    setIsAuthorizedAdmin(false);
    setAdminFirebaseUser(null);
    navigateTo('home');
    showToast('Administrator signed out successfully', 'info');
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('shopbd_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopbd_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('shopbd_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopbd_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('shopbd_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopbd_banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('shopbd_flash_sale', JSON.stringify(flashSale));
  }, [flashSale]);

  useEffect(() => {
    localStorage.setItem('shopbd_delivery_settings', JSON.stringify(deliverySettings));
  }, [deliverySettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_website_settings', JSON.stringify(websiteSettings));
  }, [websiteSettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_support_settings', JSON.stringify(supportSettings));
  }, [supportSettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_whatsapp_order_settings', JSON.stringify(whatsappOrderSettings));
  }, [whatsappOrderSettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_product_share_settings', JSON.stringify(productShareSettings));
  }, [productShareSettings]);

  useEffect(() => {
    localStorage.setItem('shopbd_website_sections', JSON.stringify(websiteSections));
  }, [websiteSections]);

  // Dynamic Browser Tab Title & Favicon Synchronizer
  useEffect(() => {
    const brandTitle = websiteSettings.headerName || websiteSettings.websiteName || 'Shop BD';
    const tagline = websiteSettings.tagline || 'Shop Smart, Live Better';
    document.title = `${brandTitle} - ${tagline}`;

    const fav = websiteSettings.favicon || websiteSettings.faviconUrl;
    if (fav) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = fav;
    }
  }, [websiteSettings.websiteName, websiteSettings.headerName, websiteSettings.tagline, websiteSettings.faviconUrl, websiteSettings.favicon]);

  useEffect(() => {
    localStorage.setItem('shopbd_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('shopbd_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shopbd_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shopbd_user');
    }
  }, [currentUser]);

  // Cart Calculations
  const cartSubtotal = cart.reduce((total, item) => {
    const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
    return total + itemPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      const calc = (cartSubtotal * appliedCoupon.discountValue) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      couponDiscount = appliedCoupon.discountValue;
    }
  }

  // Cart Actions
  const addToCart = (
    product: Product, 
    quantity = 1, 
    selectedSize?: string, 
    selectedColor?: string, 
    selectedImage?: string
  ) => {
    const variants = getProductColorVariants(product);
    const matchedVariant = selectedColor 
      ? variants.find(v => v.name.toLowerCase() === selectedColor.toLowerCase())
      : variants[0];
    const finalColor = selectedColor || matchedVariant?.name;
    const finalImage = selectedImage || matchedVariant?.image || product.images[0] || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';

    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.productId === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === finalColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIndex].quantity + quantity, product.stock);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          image: finalImage
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: finalImage,
          quantity,
          selectedSize: selectedSize || (product.sizes?.length ? product.sizes[0] : undefined),
          selectedColor: finalColor,
          stock: product.stock
        }
      ];
    });

    showToast(`Added "${product.name.slice(0, 28)}..." to cart!`, 'success');
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.productId === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
    ));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, selectedSize?: string, selectedColor?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize, selectedColor);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.productId === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor) {
        return { ...item, quantity: Math.min(quantity, item.stock) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(w => w.productId === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(w => w.productId !== product.id));
      showToast('Removed from wishlist', 'info');
    } else {
      setWishlist(prev => [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          image: product.images[0] || '',
          category: product.category,
          inStock: product.stock > 0,
          addedAt: new Date().toISOString()
        }
      ]);
      showToast('Saved to wishlist!', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.some(w => w.productId === productId);
  const removeFromWishlist = (productId: string) => {
    setWishlist(prev => prev.filter(w => w.productId !== productId));
    showToast('Removed from wishlist', 'info');
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared', 'info');
  };

  // Coupon Actions
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === trimmed && c.isActive);

    if (!found) {
      showToast('Invalid coupon code or expired', 'error');
      return { success: false, message: 'Invalid coupon code or expired.' };
    }

    if (cartSubtotal < found.minOrder) {
      showToast(`Minimum order amount of ৳${found.minOrder} required for this coupon`, 'error');
      return { success: false, message: `Minimum order amount of ৳${found.minOrder} required.` };
    }

    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully!`, 'success');
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'timesUsed'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `coup-${Date.now()}`,
      timesUsed: 0
    };
    setCoupons(prev => [newCoupon, ...prev]);
    showToast(`Coupon ${coupon.code} created!`, 'success');
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    showToast('Coupon deleted', 'info');
  };

  // Order Actions
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
    district: string;
    area: string;
    deliveryMethod: 'INSIDE_DHAKA' | 'OUTSIDE_DHAKA';
    paymentMethod: PaymentMethod;
    transactionId?: string;
    orderNotes?: string;
  }): Order => {
    const deliveryCharge = 
      cartSubtotal >= deliverySettings.freeDeliveryThreshold 
        ? 0 
        : orderData.deliveryMethod === 'INSIDE_DHAKA' 
          ? deliverySettings.insideDhakaFee 
          : deliverySettings.outsideDhakaFee;

    const total = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);
    const orderNumber = `SBD-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      userId: currentUser?.id,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      address: orderData.address,
      district: orderData.district,
      area: orderData.area,
      deliveryMethod: orderData.deliveryMethod,
      deliveryCharge,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'CASH_ON_DELIVERY' ? 'UNPAID' : (orderData.transactionId ? 'VERIFYING' : 'UNPAID'),
      transactionId: orderData.transactionId,
      status: 'PENDING',
      subtotal: cartSubtotal,
      discount: couponDiscount,
      total,
      couponCode: appliedCoupon?.code,
      items: cart.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.salePrice && item.salePrice > 0 ? item.salePrice : item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        image: item.image
      })),
      orderNotes: orderData.orderNotes,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: orderData.deliveryMethod === 'INSIDE_DHAKA' ? '1-2 Days' : '2-3 Days',
      statusTimeline: [
        {
          status: 'PENDING',
          timestamp: new Date().toISOString(),
          note: `Order placed successfully with ${orderData.paymentMethod.replace('_', ' ')}`
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);

    // Update real-time database listener
    updateLiveOrderStatus(newOrder.orderNumber, 'PENDING', 'Order placed by customer');

    // Reduce stock
    setProducts(prev => prev.map(prod => {
      const cartItem = cart.find(ci => ci.productId === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    }));

    // If coupon used, increment count
    if (appliedCoupon) {
      setCoupons(prev => prev.map(c => c.id === appliedCoupon.id ? { ...c, timesUsed: c.timesUsed + 1 } : c));
    }

    // Add notification
    addNotification({
      title: `Order Placed: ${orderNumber}`,
      message: `Your order for ৳${total.toLocaleString()} has been received!`,
      type: 'order',
      link: `/track-order?id=${orderNumber}`
    });

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, courierName?: string, trackingNumber?: string, note?: string) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        const updatedTimeline = [
          ...ord.statusTimeline,
          {
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`
          }
        ];
        const isPaid = status === 'DELIVERED' || (ord.paymentMethod !== 'CASH_ON_DELIVERY' && status === 'CONFIRMED');
        
        // Sync Realtime Database
        updateLiveOrderStatus(ord.orderNumber, status, note);

        return {
          ...ord,
          status,
          courierName: courierName || ord.courierName,
          trackingNumber: trackingNumber || ord.trackingNumber,
          paymentStatus: isPaid ? 'PAID' : ord.paymentStatus,
          statusTimeline: updatedTimeline
        };
      }
      return ord;
    }));

    showToast(`Order status updated to ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: Order['paymentStatus']) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        return {
          ...ord,
          paymentStatus
        };
      }
      return ord;
    }));
    showToast(`Order payment status updated to ${paymentStatus}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId && o.orderNumber !== orderId));
    showToast('Order permanently deleted', 'info');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'CANCELLED', undefined, undefined, reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer');
    showToast('Order has been cancelled', 'info');
  };

  const requestReturn = (orderId: string, reason?: string) => {
    updateOrderStatus(orderId, 'RETURN REQUESTED', undefined, undefined, reason ? `Return request: ${reason}` : 'Customer requested a return');
    showToast('Return request submitted for review', 'info');
  };

  const findOrder = (query: string) => {
    const q = query.trim().toUpperCase();
    return orders.find(o => 
      o.orderNumber.toUpperCase() === q || 
      o.id.toUpperCase() === q || 
      o.customerPhone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '')
    );
  };

  // Product CRUD
  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const vars = getProductColorVariants(product);
    const newProd: Product = {
      ...product,
      images: vars.map(v => v.image),
      colors: vars.map(v => ({ name: v.name, hex: v.hex, image: v.image })),
      colorVariants: vars.map(v => ({ name: v.name, image: v.image })),
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${product.name.slice(0, 20)}..." created!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const combined = { ...p, ...updates };
      const vars = getProductColorVariants(combined);
      return {
        ...combined,
        images: vars.map(v => v.image),
        colors: vars.map(v => ({ name: v.name, hex: v.hex, image: v.image })),
        colorVariants: vars.map(v => ({ name: v.name, image: v.image }))
      };
    }));
    showToast('Product details updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted from inventory', 'info');
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${cat.name}" added!`, 'success');
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    showToast('Category updated', 'success');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    showToast('Category deleted', 'info');
  };

  // Banner Actions
  const updateBanners = (newBanners: Banner[]) => {
    setBanners(newBanners);
    showToast('Banners updated', 'success');
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    showToast('Banner updated', 'success');
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBan: Banner = {
      ...banner,
      id: `ban-${Date.now()}`
    };
    setBanners(prev => [...prev, newBan]);
    showToast('Banner created', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast('Banner deleted', 'info');
  };

  const updateFlashSale = (sale: Partial<FlashSale>) => {
    setFlashSale(prev => ({ ...prev, ...sale }));
    showToast('Flash Sale campaign settings updated', 'success');
  };

  // Settings Actions
  const updateDeliverySettings = (settings: DeliverySettings) => {
    setDeliverySettings(settings);
    showToast('Delivery charges updated', 'success');
  };

  const updatePaymentSettings = (settings: PaymentSettings) => {
    setPaymentSettings(settings);
    showToast('Payment methods updated', 'success');
  };

  const updateWebsiteSettings = (settings: WebsiteSettings) => {
    setWebsiteSettings(settings);
    showToast('Website settings saved', 'success');
  };

  const updateSupportSettings = (settings: SupportSettings) => {
    setSupportSettings(settings);
    showToast('Support channels updated', 'success');
  };

  const updateWhatsAppOrderSettings = (settings: WhatsAppOrderSettings) => {
    setWhatsAppOrderSettings(settings);
    showToast('WhatsApp order settings saved', 'success');
  };

  const updateProductShareSettings = (settings: ProductShareSettings) => {
    setProductShareSettings(settings);
    showToast('Product share configuration saved', 'success');
  };

  const updateWebsiteSections = (sections: WebsiteSection[]) => {
    setWebsiteSections(sections);
    showToast('Website sections updated', 'success');
  };

  const updateWebsiteSection = (id: string, updates: Partial<WebsiteSection>) => {
    setWebsiteSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    showToast('Website section updated', 'success');
  };

  const addWebsiteSection = (section: Omit<WebsiteSection, 'id'>) => {
    const newSec: WebsiteSection = {
      ...section,
      id: `sec-${Date.now()}`
    };
    setWebsiteSections(prev => [...prev, newSec]);
    showToast(`Website section "${section.name}" created`, 'success');
  };

  const deleteWebsiteSection = (id: string) => {
    setWebsiteSections(prev => prev.filter(s => s.id !== id));
    showToast('Website section removed', 'info');
  };

  // Reviews Actions
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      status: 'approved', // Auto-approved for friendly demo experience
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate product rating
    const prodReviews = [...reviews.filter(r => r.productId === reviewData.productId), newRev];
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    setProducts(prev => prev.map(p => p.id === reviewData.productId ? {
      ...p,
      rating: parseFloat(avgRating.toFixed(1)),
      reviewsCount: prodReviews.length
    } : p));

    showToast('Thank you! Your review has been published.', 'success');
  };

  const updateReviewStatus = (id: string, status: 'approved' | 'rejected') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    showToast(`Review status: ${status}`, 'info');
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review removed', 'info');
  };

  // Auth Actions (Customer Storefront Only)
  const login = (email: string) => {
    const existing = customers.find(c => c.email.toLowerCase() === email.toLowerCase());
    const user: User = existing ? { ...existing, role: 'customer' } : {
      id: `usr-${Date.now()}`,
      email,
      displayName: email.split('@')[0],
      role: 'customer',
      status: 'active',
      createdAt: new Date().toISOString(),
      phoneNumber: '01712345678'
    };
    setCurrentUser(user);
    if (!existing) {
      setCustomers(prev => [...prev, user]);
    }
    showToast(`Logged in as ${user.displayName}`, 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  const updateUserProfile = (profile: Partial<User>) => {
    if (currentUser) {
      const updated = { ...currentUser, ...profile };
      setCurrentUser(updated);
      setCustomers(prev => prev.map(c => c.id === currentUser.id ? updated : c));
      showToast('Profile updated', 'success');
    }
  };

  const toggleBlockCustomer = (userId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === userId) {
        const nextStatus = c.status === 'active' ? 'blocked' : 'active';
        showToast(`Customer status changed to ${nextStatus}`, 'info');
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Recently Viewed & Search History
  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const addSearchHistory = (q: string) => {
    if (!q.trim()) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      return [q.trim(), ...filtered].slice(0, 8);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const item: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [item, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <ShopContext.Provider
      value={{
        currentPage,
        currentParam,
        navigateTo,

        products,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,

        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,

        coupons,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
        addCoupon,
        deleteCoupon,

        orders,
        createOrder,
        updateOrderStatus,
        updatePaymentStatus,
        deleteOrder,
        cancelOrder,
        requestReturn,
        findOrder,

        banners,
        updateBanners,
        updateBanner,
        addBanner,
        deleteBanner,
        flashSale,
        updateFlashSale,

        websiteSections,
        updateWebsiteSections,
        updateWebsiteSection,
        addWebsiteSection,
        deleteWebsiteSection,

        deliverySettings,
        updateDeliverySettings,
        paymentSettings,
        updatePaymentSettings,
        websiteSettings,
        updateWebsiteSettings,
        supportSettings,
        updateSupportSettings,
        whatsappOrderSettings,
        updateWhatsAppOrderSettings,
        updateWhatsappOrderSettings: updateWhatsAppOrderSettings,
        productShareSettings,
        updateProductShareSettings,

        isSupportModalOpen,
        setIsSupportModalOpen,
        sharingProduct,
        isShareModalOpen,
        openShareModal,
        closeShareModal,

        reviews,
        addReview,
        updateReviewStatus,
        deleteReview,

        currentUser,
        login,
        logout,
        updateUserProfile,
        customers,
        toggleBlockCustomer,

        // Strict Admin Security
        isAuthorizedAdmin,
        adminFirebaseUser,
        adminLogout,

        recentlyViewed,
        addRecentlyViewed,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,

        notifications,
        markNotificationAsRead,
        addNotification,

        toasts,
        showToast,
        removeToast,

        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};
