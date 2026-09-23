import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  ShoppingBag, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Truck, 
  DollarSign, 
  Flame, 
  ExternalLink,
  Upload,
  AlertCircle,
  ShieldCheck,
  Lock,
  Mail,
  LogOut,
  MessageCircle,
  PhoneCall,
  Share2,
  Layers,
  HelpCircle,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Clock,
  Send,
  Save,
  Copy,
  ChevronDown,
  Globe,
  Printer,
  Phone
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { 
  auth, 
  AUTHORIZED_ADMIN_UID, 
  AUTHORIZED_ADMIN_UIDS,
  isAuthorizedAdminUser,
  firebaseAdminSignIn, 
  firebaseAdminSignOut 
} from '../lib/firebase';
import { 
  Product, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  Category, 
  Coupon, 
  Banner, 
  WebsiteSection 
} from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    coupons,
    addCoupon,
    deleteCoupon,
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    flashSale,
    updateFlashSale,
    websiteSettings,
    updateWebsiteSettings,
    deliverySettings,
    updateDeliverySettings,
    paymentSettings,
    updatePaymentSettings,
    supportSettings,
    updateSupportSettings,
    whatsappOrderSettings,
    updateWhatsappOrderSettings,
    productShareSettings,
    updateProductShareSettings,
    websiteSections,
    updateWebsiteSection,
    addWebsiteSection,
    deleteWebsiteSection,
    showToast,
    navigateTo,
    isAuthorizedAdmin,
    adminFirebaseUser,
    adminLogout
  } = useShop();

  // Strict Firebase Admin Login Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!adminEmail.trim()) {
      setLoginError('Please enter administrator email');
      return;
    }
    if (!adminPassword.trim()) {
      setLoginError('Please enter administrator password');
      return;
    }

    try {
      setIsAuthenticating(true);
      const user = await firebaseAdminSignIn(adminEmail.trim(), adminPassword);
      if (isAuthorizedAdminUser(user)) {
        showToast('Authorized Administrator Logged In', 'success');
        setAdminPassword('');
      } else {
        await firebaseAdminSignOut();
        setLoginError(`Access Denied: Authenticated account [${user.email || user.uid}] is not authorized for Shop BD Admin Portal.`);
      }
    } catch (err: any) {
      console.error('Admin Auth Error:', err);
      const msg = err?.message || 'Authentication failed. Please verify administrator credentials.';
      setLoginError(msg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'banners' | 'flash-sale' | 'sections' | 'support' | 'coupons' | 'settings'
  >('overview');

  // Search & Filter in Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  // Product Add / Edit modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState<{
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    price: number;
    salePrice: number;
    stock: number;
    sku: string;
    images: string;
    description: string;
    isFeatured: boolean;
    isFlashSale: boolean;
    isTrending: boolean;
    isBestSeller: boolean;
    status: 'active' | 'draft' | 'archived';
  }>({
    name: '',
    brand: 'Shop BD',
    category: categories[0]?.name || 'Electronics & Gadgets',
    subcategory: 'Standard',
    price: 1500,
    salePrice: 1200,
    stock: 20,
    sku: `BD-${Date.now().toString().slice(-4)}`,
    images: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    description: 'High quality authentic product with warranty.',
    isFeatured: true,
    isFlashSale: false,
    isTrending: true,
    isBestSeller: false,
    status: 'active'
  });

  // Category modal & edit state
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState('https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=400&q=80');

  // Banner add form state
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80');
  const [newBannerLink, setNewBannerLink] = useState('/shop');
  const [newBannerButtonText, setNewBannerButtonText] = useState('Shop Now');
  const [newBannerType, setNewBannerType] = useState<'hero' | 'slider' | 'promo'>('hero');

  // Website Section add form state
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecSubtitle, setNewSecSubtitle] = useState('');
  const [newSecType, setNewSecType] = useState<'custom-products' | 'custom-banner'>('custom-products');
  const [newSecLimit, setNewSecLimit] = useState(4);

  // Coupon modal state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('fixed');
  const [newCouponValue, setNewCouponValue] = useState(150);
  const [newCouponMin, setNewCouponMin] = useState(1000);

  // Local editable copies of store settings
  const [localWebsite, setLocalWebsite] = useState(websiteSettings);
  const [localDelivery, setLocalDelivery] = useState(deliverySettings);
  const [localPayment, setLocalPayment] = useState(paymentSettings);
  const [localSupport, setLocalSupport] = useState(supportSettings);
  const [localWhatsappOrder, setLocalWhatsappOrder] = useState(whatsappOrderSettings);
  const [localProductShare, setLocalProductShare] = useState(productShareSettings);

  // Sync local states if shop context updates
  React.useEffect(() => {
    setLocalWebsite(websiteSettings);
  }, [websiteSettings]);
  React.useEffect(() => {
    setLocalDelivery(deliverySettings);
  }, [deliverySettings]);
  React.useEffect(() => {
    setLocalPayment(paymentSettings);
  }, [paymentSettings]);
  React.useEffect(() => {
    setLocalSupport(supportSettings);
  }, [supportSettings]);
  React.useEffect(() => {
    setLocalWhatsappOrder(whatsappOrderSettings);
  }, [whatsappOrderSettings]);
  React.useEffect(() => {
    setLocalProductShare(productShareSettings);
  }, [productShareSettings]);

  // Order Details Modal & Filtering
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [modalCourierName, setModalCourierName] = useState('');
  const [modalTrackingNumber, setModalTrackingNumber] = useState('');

  // Category Edit State
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catEditForm, setCatEditForm] = useState<{
    name: string;
    slug: string;
    image: string;
    sortOrder: number;
    status: 'active' | 'inactive';
  }>({ name: '', slug: '', image: '', sortOrder: 1, status: 'active' });

  // Banner Edit State
  const [isEditBannerModalOpen, setIsEditBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerEditForm, setBannerEditForm] = useState<{
    title: string;
    subtitle: string;
    image: string;
    link: string;
    buttonText: string;
    type: 'hero' | 'promo' | 'slider';
    isActive: boolean;
    sortOrder: number;
  }>({ title: '', subtitle: '', image: '', link: '', buttonText: '', type: 'hero', isActive: true, sortOrder: 1 });

  // Section Edit State
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<WebsiteSection | null>(null);
  const [sectionEditForm, setSectionEditForm] = useState<{
    title: string;
    subtitle: string;
    type: WebsiteSection['type'];
    itemLimit: number;
    enabled: boolean;
    order: number;
  }>({ title: '', subtitle: '', type: 'custom-products', itemLimit: 4, enabled: true, order: 1 });

  // Universal Custom Delete Confirmation Modal State (Reliable across all browsers/iframes without window.confirm blocking)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: () => {}
  });

  const requestDelete = (title: string, message: string, itemName: string, onConfirm: () => void) => {
    setDeleteConfirmation({
      isOpen: true,
      title,
      message,
      itemName,
      onConfirm
    });
  };

  const handleExecuteDelete = () => {
    deleteConfirmation.onConfirm();
    setDeleteConfirmation({
      isOpen: false,
      title: '',
      message: '',
      itemName: '',
      onConfirm: () => {}
    });
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'CANCELLED' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED').length;
  const totalProductsCount = products.length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesFilter = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
    const q = orderSearchQuery.trim().toLowerCase();
    if (!q) return matchesFilter;
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      o.district.toLowerCase().includes(q) ||
      (o.area && o.area.toLowerCase().includes(q)) ||
      o.items.some(i => i.name.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  // Category Edit Handlers
  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatEditForm({
      name: cat.name,
      slug: cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: cat.image,
      sortOrder: cat.sortOrder || 1,
      status: cat.status || 'active'
    });
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    updateCategory(editingCategory.id, {
      name: catEditForm.name.trim(),
      slug: catEditForm.slug.trim(),
      image: catEditForm.image.trim(),
      sortOrder: Number(catEditForm.sortOrder),
      status: catEditForm.status
    });
    setIsEditCategoryModalOpen(false);
    setEditingCategory(null);
    showToast(`Category "${catEditForm.name}" updated successfully!`, 'success');
  };

  // Banner Edit Handlers
  const handleOpenEditBanner = (ban: Banner) => {
    setEditingBanner(ban);
    setBannerEditForm({
      title: ban.title,
      subtitle: ban.subtitle,
      image: ban.image,
      link: ban.link,
      buttonText: ban.buttonText,
      type: ban.type,
      isActive: ban.isActive,
      sortOrder: ban.sortOrder || 1
    });
    setIsEditBannerModalOpen(true);
  };

  const handleSaveEditBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    updateBanner(editingBanner.id, {
      title: bannerEditForm.title.trim(),
      subtitle: bannerEditForm.subtitle.trim(),
      image: bannerEditForm.image.trim(),
      link: bannerEditForm.link.trim(),
      buttonText: bannerEditForm.buttonText.trim(),
      type: bannerEditForm.type,
      isActive: bannerEditForm.isActive,
      sortOrder: Number(bannerEditForm.sortOrder)
    });
    setIsEditBannerModalOpen(false);
    setEditingBanner(null);
    showToast(`Banner "${bannerEditForm.title}" updated successfully!`, 'success');
  };

  // Section Edit Handlers
  const handleOpenEditSection = (sec: WebsiteSection) => {
    setEditingSection(sec);
    setSectionEditForm({
      title: sec.title,
      subtitle: sec.subtitle || '',
      type: sec.type,
      itemLimit: sec.itemLimit || 4,
      enabled: sec.enabled,
      order: sec.order || sec.sortOrder || 1
    });
    setIsEditSectionModalOpen(true);
  };

  const handleSaveEditSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;
    updateWebsiteSection(editingSection.id, {
      title: sectionEditForm.title.trim(),
      subtitle: sectionEditForm.subtitle.trim(),
      type: sectionEditForm.type,
      itemLimit: Number(sectionEditForm.itemLimit),
      enabled: sectionEditForm.enabled,
      order: Number(sectionEditForm.order),
      sortOrder: Number(sectionEditForm.order)
    });
    setIsEditSectionModalOpen(false);
    setEditingSection(null);
    showToast(`Section "${sectionEditForm.title}" updated successfully!`, 'success');
  };

  // Order Details Modal Handlers
  const handleOpenOrderDetails = (order: Order) => {
    setSelectedOrderDetails(order);
    setModalCourierName(order.courierName || '');
    setModalTrackingNumber(order.trackingNumber || '');
  };

  const handleSaveCourierDetails = () => {
    if (!selectedOrderDetails) return;
    updateOrderStatus(
      selectedOrderDetails.id,
      selectedOrderDetails.status,
      modalCourierName,
      modalTrackingNumber,
      `Courier updated: ${modalCourierName || 'N/A'}, Tracking: ${modalTrackingNumber || 'N/A'}`
    );
    setSelectedOrderDetails(prev => prev ? ({ ...prev, courierName: modalCourierName, trackingNumber: modalTrackingNumber }) : null);
    showToast('Courier and tracking details saved', 'success');
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdForm({
      name: '',
      brand: 'Shop BD',
      category: categories[0]?.name || 'Electronics & Gadgets',
      subcategory: 'Standard',
      price: 2000,
      salePrice: 1600,
      stock: 25,
      sku: `BD-${Math.floor(1000 + Math.random() * 9000)}`,
      images: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      description: 'Authentic imported product with manufacturer warranty in Bangladesh.',
      isFeatured: true,
      isFlashSale: false,
      isTrending: true,
      isBestSeller: false,
      status: 'active'
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProdForm({
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      subcategory: prod.subcategory || 'Standard',
      price: prod.price,
      salePrice: prod.salePrice || 0,
      stock: prod.stock,
      sku: prod.sku,
      images: prod.images.join(', '),
      description: prod.description,
      isFeatured: prod.isFeatured !== undefined ? !!prod.isFeatured : true,
      isFlashSale: !!prod.isFlashSale,
      isTrending: !!prod.isTrending,
      isBestSeller: !!prod.isBestSeller,
      status: 'active'
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const imageList = prodForm.images
      .split(',')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodForm.name,
        brand: prodForm.brand,
        category: prodForm.category,
        subcategory: prodForm.subcategory || 'Standard',
        price: Number(prodForm.price),
        salePrice: Number(prodForm.salePrice) || undefined,
        stock: Number(prodForm.stock),
        sku: prodForm.sku,
        images: imageList.length ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
        description: prodForm.description,
        isFeatured: prodForm.isFeatured,
        isFlashSale: prodForm.isFlashSale,
        isTrending: prodForm.isTrending,
        isBestSeller: prodForm.isBestSeller
      });
      showToast('Product updated successfully', 'success');
    } else {
      addProduct({
        name: prodForm.name,
        brand: prodForm.brand,
        category: prodForm.category,
        subcategory: prodForm.subcategory || 'Standard',
        price: Number(prodForm.price),
        salePrice: Number(prodForm.salePrice) || undefined,
        stock: Number(prodForm.stock),
        sku: prodForm.sku,
        sizes: ['Standard'],
        colors: [{ name: 'Default', hex: '#000000' }],
        images: imageList.length ? imageList : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'],
        description: prodForm.description,
        isFeatured: prodForm.isFeatured,
        isFlashSale: prodForm.isFlashSale,
        isTrending: prodForm.isTrending,
        isBestSeller: prodForm.isBestSeller,
        rating: 4.8,
        reviewsCount: 1
      });
      showToast('New product added to catalog', 'success');
    }

    setIsProductModalOpen(false);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: newCatImage.trim(),
      subcategories: ['Standard'],
      status: 'active',
      sortOrder: categories.length + 1
    });
    setNewCatName('');
    showToast('Category created successfully', 'success');
  };

  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    addBanner({
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      image: newBannerImage.trim(),
      link: newBannerLink.trim(),
      buttonText: newBannerButtonText.trim(),
      isActive: true,
      type: newBannerType,
      sortOrder: banners.length + 1
    });
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    showToast('Banner added successfully', 'success');
  };

  const handleAddSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecTitle.trim()) return;
    addWebsiteSection({
      name: newSecTitle.trim(),
      title: newSecTitle.trim(),
      subtitle: newSecSubtitle.trim(),
      type: newSecType,
      itemLimit: Number(newSecLimit) || 4,
      enabled: true,
      sortOrder: websiteSections.length + 1,
      order: websiteSections.length + 1
    });
    setNewSecTitle('');
    setNewSecSubtitle('');
    showToast('Website section added to storefront', 'success');
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minOrder: Number(newCouponMin),
      usageLimit: 500,
      isActive: true,
      expiry: '2026-12-31'
    });
    setNewCouponCode('');
    showToast('Coupon activated', 'success');
  };

  // WhatsApp Order Confirmation Trigger
  const handleSendWhatsAppOrderConfirmation = (order: Order) => {
    const itemsText = order.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}, Price: ৳${((i.salePrice || i.price) * i.quantity).toLocaleString()})`)
      .join('\n');

    let template = localWhatsappOrder.messageTemplate || 
`Assalamu Alaikum {customer_name},
Thank you for your order on Shop BD!

Order ID: #{order_id}
Ordered Items:
{products}

Total Amount: {total}
Payment Status: {payment_status}
Delivery Address: {address}

We are preparing your package for dispatch. If you need any assistance, feel free to reply to this message.
Shop BD Customer Support`;

    const message = template
      .replace(/{customer_name}/g, order.customerName)
      .replace(/{order_id}/g, order.orderNumber)
      .replace(/{products}/g, itemsText)
      .replace(/{total}/g, `৳${order.total.toLocaleString()}`)
      .replace(/{payment_status}/g, (order.paymentStatus || 'PENDING').toUpperCase())
      .replace(/{address}/g, `${order.address}, ${order.district}`);

    const customerPhoneClean = order.customerPhone.replace(/[^0-9]/g, '');
    const phoneToUse = customerPhoneClean.startsWith('88') ? customerPhoneClean : `88${customerPhoneClean}`;

    const url = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Check if an unpermitted user is currently authenticated in Firebase
  const isForbiddenUser = Boolean(auth?.currentUser && !isAuthorizedAdminUser(auth.currentUser));

  if (isForbiddenUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-3xl p-8 shadow-2xl text-slate-100 space-y-6 text-center">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/30">
              Access Denied • 403 Forbidden
            </span>
            <h1 className="text-xl font-black text-white">Unauthorized Administrator Account</h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              You are signed in to Firebase as: <span className="text-rose-400 font-semibold">{auth?.currentUser?.email || auth?.currentUser?.uid}</span>
            </p>
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-mono break-all text-left">
              <div><strong className="text-slate-300">Your UID:</strong> {auth?.currentUser?.uid}</div>
              <div className="mt-1"><strong className="text-emerald-400">Designated Admin UID:</strong> {AUTHORIZED_ADMIN_UID}</div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              This account does not have administrator privileges for Shop BD. Normal users and unauthorized accounts cannot access this portal.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={async () => {
                await firebaseAdminSignOut();
                showToast('Signed out of unauthorized account', 'info');
              }}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3 rounded-xl transition-all text-xs cursor-pointer shadow-lg shadow-rose-600/20"
            >
              Sign Out & Switch Account
            </button>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl border border-slate-700 transition-colors text-xs cursor-pointer"
            >
              Return to Public Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated as authorized admin, show standalone Admin Portal Login Gate (Real Firebase Auth)
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-blue-500/30">
              Restricted Area
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Shop BD Admin Portal</h1>
            <p className="text-xs text-slate-300">
              Sign in with your designated Firebase Administrator credentials.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-200 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@shopbd.top"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-400 transition-colors"
                  required
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-200 font-bold mb-1.5 uppercase tracking-wider text-[11px]">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-3 text-white placeholder-slate-400 outline-none focus:border-blue-400 transition-colors"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-xs uppercase tracking-wider cursor-pointer"
            >
              {isAuthenticating ? 'Verifying Administrator...' : 'Sign In with Firebase'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Return to Shop BD Public Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin Control Center
            </span>
            <span className="text-xs text-slate-400 font-mono">shopbd.top • /admin</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Full Website Management Panel</h1>
          <p className="text-xs text-slate-300 mt-0.5">Control products, categories, orders, banners, sections, support & branding</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-xl border border-slate-700 text-xs text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[11px] font-semibold">{adminFirebaseUser?.email || auth?.currentUser?.email || 'Authorized Administrator'}</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-[10px] text-emerald-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>UID: {(adminFirebaseUser?.uid || auth?.currentUser?.uid || AUTHORIZED_ADMIN_UID).slice(0, 10)}...</span>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            title="Open customer-facing website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={adminLogout}
            className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
            title="Sign out of Admin Console"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin">
        {[
          { key: 'overview', label: 'Overview Metrics', icon: BarChart3 },
          { key: 'products', label: `Products (${products.length})`, icon: Package },
          { key: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { key: 'categories', label: `Categories (${categories.length})`, icon: Tag },
          { key: 'banners', label: `Banners (${banners.length})`, icon: ImageIcon },
          { key: 'flash-sale', label: 'Flash Sale Deals', icon: Flame },
          { key: 'sections', label: `Website Sections (${websiteSections.length})`, icon: Layers },
          { key: 'support', label: 'Support Settings', icon: HelpCircle },
          { key: 'coupons', label: `Coupons (${coupons.length})`, icon: DollarSign },
          { key: 'settings', label: 'Store & Header Settings', icon: Settings },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 font-bold'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Sales</span>
              <p className="text-2xl font-black text-rose-600 mt-1">৳{totalRevenue.toLocaleString()}</p>
              <span className="text-[10px] text-emerald-700 font-semibold">Active Bangladeshi Revenue</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Total Orders</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount}</p>
              <span className="text-[10px] text-slate-600 font-medium">All 64 districts</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Action Needed</span>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrdersCount}</p>
              <span className="text-[10px] text-amber-700 font-semibold">Pending confirmation/shipping</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Active Inventory</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalProductsCount}</p>
              <span className="text-[10px] text-slate-600 font-medium">Products in database</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Quick Management Shortcuts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={handleOpenAddProduct}
                className="p-4 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Add New Product</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Confirm Orders</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className="p-4 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Support Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-4 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Branding & Header</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-slate-900">Manage Catalog & Inventory</h2>
              <p className="text-xs text-slate-500">Add, edit, change price, sale discount, stock, or delete products</p>
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by title, SKU, or brand..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-500 font-medium outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <select
              value={productCategoryFilter}
              onChange={(e) => setProductCategoryFilter(e.target.value)}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 font-bold outline-none cursor-pointer focus:border-blue-600"
            >
              <option value="ALL">All Categories ({products.length})</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Price & Sale Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Badges</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/70">
                      <td className="p-3.5 flex items-center gap-3">
                        <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-slate-600 font-mono">SKU: {prod.sku} • {prod.brand}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-800 font-medium">{prod.category}</td>
                      <td className="p-3.5">
                        <span className="font-bold text-rose-600">৳{(prod.salePrice || prod.price).toLocaleString()}</span>
                        {prod.salePrice && <span className="text-[10px] text-slate-500 line-through block">৳{prod.price.toLocaleString()}</span>}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-bold ${prod.stock <= 5 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-3.5 space-x-1">
                        {prod.isFlashSale && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Flash</span>}
                        {prod.isTrending && <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Trending</span>}
                        {prod.isBestSeller && <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Best Seller</span>}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Delete Product Permanently',
                              'Are you sure you want to remove this product from the inventory? It will immediately disappear from the shop storefront.',
                              prod.name,
                              () => deleteProduct(prod.id)
                            );
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Manage Customer Orders & Order Confirmations</h2>
              <p className="text-xs text-slate-500">View complete details, confirm/cancel, change status, and send WhatsApp confirmation</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                Total Orders: <strong className="text-rose-600">{orders.length}</strong>
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                Action Needed: <strong>{pendingOrdersCount}</strong>
              </span>
            </div>
          </div>

          {/* Order Search & Status Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search orders by customer name, phone, order # (e.g. SBD-), district..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none focus:border-rose-500"
              />
              {orderSearchQuery && (
                <button 
                  onClick={() => setOrderSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { key: 'ALL', label: 'All Orders' },
                { key: 'PENDING', label: 'Pending' },
                { key: 'CONFIRMED', label: 'Confirmed' },
                { key: 'PROCESSING', label: 'Processing' },
                { key: 'SHIPPED', label: 'Shipped' },
                { key: 'DELIVERED', label: 'Delivered' },
                { key: 'CANCELLED', label: 'Cancelled' }
              ].map(tab => {
                const count = tab.key === 'ALL' 
                  ? orders.length 
                  : orders.filter(o => o.status === tab.key).length;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setOrderStatusFilter(tab.key as any)}
                    className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                      orderStatusFilter === tab.key 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      orderStatusFilter === tab.key ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No orders match your filter</h3>
                <p className="text-xs text-slate-400">Try changing your search term or select "All Orders".</p>
                <button
                  onClick={() => {
                    setOrderStatusFilter('ALL');
                    setOrderSearchQuery('');
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Order Filters
                </button>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-base font-black text-slate-900">#{order.orderNumber}</span>
                      <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-full">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}
                      </span>
                      <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        order.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        order.status === 'DELIVERED' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        order.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800 border border-purple-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {order.status}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        {order.deliveryMethod === 'INSIDE_DHAKA' ? 'Inside Dhaka' : 'Outside Dhaka'}
                      </span>
                    </div>

                    {/* Quick Order Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenOrderDetails(order)}
                        className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                        title="View complete customer & order details"
                      >
                        <Eye className="w-3.5 h-3.5 text-rose-400" />
                        <span>View Details</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppOrderConfirmation(order)}
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                        title="Open WhatsApp with pre-filled customer confirmation message"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Confirmation</span>
                      </button>

                      {order.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => {
                            updateOrderStatus(order.id, 'CONFIRMED');
                            showToast(`Order #${order.orderNumber} confirmed!`, 'success');
                          }}
                          className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Confirm Order</span>
                        </button>
                      )}

                      {order.status !== 'CANCELLED' && (
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Cancel Customer Order',
                              'Are you sure you want to mark this order as Cancelled?',
                              `Order #${order.orderNumber}`,
                              () => {
                                updateOrderStatus(order.id, 'CANCELLED');
                                showToast(`Order #${order.orderNumber} cancelled`, 'info');
                              }
                            );
                          }}
                          className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          requestDelete(
                            'Permanently Delete Order',
                            'Are you sure you want to completely erase this order record? This cannot be undone.',
                            `Order #${order.orderNumber} (${order.customerName})`,
                            () => deleteOrder(order.id)
                          );
                        }}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 transition-colors cursor-pointer"
                        title="Permanently Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer, Shipping, and Payment Details */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider">Customer Details</span>
                      <p className="font-bold text-slate-900 mt-0.5">{order.customerName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <a href={`tel:${order.customerPhone}`} className="text-rose-600 hover:underline font-mono font-bold flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          <span>{order.customerPhone}</span>
                        </a>
                      </div>
                      {order.customerEmail && <span className="text-slate-600 block font-medium truncate">{order.customerEmail}</span>}
                    </div>

                    <div>
                      <span className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider">Delivery Address</span>
                      <p className="text-slate-900 font-medium mt-0.5">{order.address}</p>
                      <p className="text-slate-600 font-bold">{order.area ? `${order.area}, ` : ''}{order.district}</p>
                      {order.courierName && (
                        <p className="text-emerald-700 font-mono text-[11px] font-bold mt-1">
                          Courier: {order.courierName} {order.trackingNumber ? `(${order.trackingNumber})` : ''}
                        </p>
                      )}
                      {order.orderNotes && <p className="text-slate-600 italic text-[11px] mt-1 font-medium">Note: {order.orderNotes}</p>}
                    </div>

                    <div>
                      <span className="text-slate-600 block text-[10px] uppercase font-bold tracking-wider">Payment & Total</span>
                      <p className="text-slate-900 font-extrabold mt-0.5 text-base text-rose-600">৳{order.total.toLocaleString()}</p>
                      <p className="text-slate-800 font-bold">{order.paymentMethod.replace(/_/g, ' ')}</p>
                      <span className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-1 ${
                        order.paymentStatus === 'PAID' || order.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        Payment: {order.paymentStatus || 'UNPAID'}
                      </span>
                      {order.transactionId && (
                        <p className="font-mono text-rose-600 text-[11px] font-bold mt-0.5">TrxID: {order.transactionId}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-slate-700 block text-[10px] uppercase font-bold mb-1 tracking-wider">Update Order Status</span>
                        <select
                          value={order.status}
                          onChange={(e) => {
                            updateOrderStatus(order.id, e.target.value as OrderStatus);
                            showToast(`Status updated to ${e.target.value}`, 'success');
                          }}
                          className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PROCESSING">Processing</option>
                          <option value="SHIPPED">Shipped</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-slate-700 block text-[10px] uppercase font-bold mb-1 tracking-wider">Payment Status</span>
                        <select
                          value={order.paymentStatus || 'pending'}
                          onChange={(e) => {
                            updatePaymentStatus(order.id, e.target.value as PaymentStatus);
                            showToast(`Payment status updated to ${e.target.value}`, 'success');
                          }}
                          className="w-full text-xs font-bold p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Ordered Items Preview */}
                  <div className="pt-3 border-t border-slate-100">
                    <span className="text-slate-700 block text-[10px] uppercase font-black mb-2 tracking-wider">Ordered Products ({order.items.length})</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-slate-800 truncate">{item.name}</p>
                            <p className="text-[11px] text-slate-500">
                              Qty: <strong className="text-slate-900">{item.quantity}</strong> × ৳{(item.salePrice || item.price).toLocaleString()}
                              {item.selectedSize && ` • Size: ${item.selectedSize}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 4. Categories Tab */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Add New Category</h3>
            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Smart Watch & Gadgets"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md shadow-rose-600/20">
                Create Category
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Categories ({categories.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(c => (
                <div key={c.id} className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{c.name}</p>
                      <span className="text-[10px] text-slate-600 font-medium">{c.subcategories?.length || 0} subcategories</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleOpenEditCategory(c)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        requestDelete(
                          'Delete Category',
                          'Are you sure you want to remove this category? Products in this category may need to be recategorized.',
                          c.name,
                          () => deleteCategory(c.id)
                        );
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Banners Tab */}
      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Add New Banner</h3>
            <form onSubmit={handleAddBannerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Banner Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  placeholder="e.g. Eid Mega Discount"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Banner Subtitle</label>
                <input 
                  type="text" 
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="e.g. Up to 60% off on all fashion & electronics"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Image URL <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Button Text</label>
                  <input 
                    type="text" 
                    value={newBannerButtonText}
                    onChange={(e) => setNewBannerButtonText(e.target.value)}
                    placeholder="Shop Now"
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Type</label>
                  <select 
                    value={newBannerType}
                    onChange={(e: any) => setNewBannerType(e.target.value)}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium cursor-pointer shadow-xs"
                  >
                    <option value="hero">Hero Banner</option>
                    <option value="slider">Slider Banner</option>
                    <option value="promo">Promo Split Banner</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md shadow-rose-600/20">
                Save & Publish Banner
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Website Banners ({banners.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="relative h-36 bg-slate-100">
                    <img src={b.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {b.type}
                    </span>
                  </div>
                  <div className="p-3.5 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{b.title}</p>
                      <p className="text-slate-500 text-[11px] truncate max-w-[200px]">{b.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditBanner(b)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Banner"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          requestDelete(
                            'Delete Store Banner',
                            'Are you sure you want to remove this promotional banner from the website?',
                            b.title,
                            () => deleteBanner(b.id)
                          );
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Flash Sale Tab */}
      {activeTab === 'flash-sale' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Flash Sale Configuration & Products</h2>
              <p className="text-xs text-slate-500">Control countdown timer, title, banner image, and add/remove flash sale items</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input 
                type="checkbox" 
                checked={flashSale.isActive} 
                onChange={(e) => updateFlashSale({ isActive: e.target.checked })} 
                className="w-4 h-4 accent-rose-600"
              />
              <span className="text-xs font-bold text-slate-800">Flash Sale Active</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Sale Title</label>
              <input 
                type="text" 
                value={flashSale.title ?? ''}
                onChange={(e) => updateFlashSale({ title: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Sale Subtitle</label>
              <input 
                type="text" 
                value={flashSale.subtitle ?? ''}
                onChange={(e) => updateFlashSale({ subtitle: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">End Date / Countdown Target</label>
              <input 
                type="text" 
                value={flashSale.endDate ?? ''}
                onChange={(e) => updateFlashSale({ endDate: e.target.value })}
                placeholder="2026-12-31T23:59:59"
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
          </div>

          {/* Flash Sale Products Selector */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Include Products in Flash Sale</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {products.map(prod => {
                const isSelected = prod.isFlashSale || flashSale.productIds.includes(prod.id);
                return (
                  <div 
                    key={prod.id}
                    onClick={() => {
                      updateProduct(prod.id, { isFlashSale: !isSelected });
                      const updatedIds = isSelected 
                        ? flashSale.productIds.filter(id => id !== prod.id)
                        : [...flashSale.productIds, prod.id];
                      updateFlashSale({ productIds: updatedIds });
                      showToast(isSelected ? `Removed ${prod.name} from Flash Sale` : `Added ${prod.name} to Flash Sale`, 'info');
                    }}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isSelected ? 'border-rose-500 bg-rose-50/60' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-800 truncate">{prod.name}</p>
                        <p className="text-[10px] text-rose-600 font-bold">৳{(prod.salePrice || prod.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {isSelected ? 'Active' : '+ Add'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Website Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">Homepage Sections Control</h2>
              <p className="text-xs text-slate-500">Enable, disable, rename, change display order, or create custom sections</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Custom Section */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Add New Section</h3>
              <form onSubmit={handleAddSectionSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Section Title <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={newSecTitle}
                    onChange={(e) => setNewSecTitle(e.target.value)}
                    placeholder="e.g. Ramadan Special Offers"
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Section Subtitle</label>
                  <input 
                    type="text" 
                    value={newSecSubtitle}
                    onChange={(e) => setNewSecSubtitle(e.target.value)}
                    placeholder="e.g. Hand-picked authentic deals"
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Type</label>
                    <select 
                      value={newSecType}
                      onChange={(e: any) => setNewSecType(e.target.value)}
                      className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium cursor-pointer shadow-xs"
                    >
                      <option value="custom-products">Product Showcase</option>
                      <option value="custom-banner">Banner Promo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Product Limit</label>
                    <input 
                      type="number" 
                      value={newSecLimit}
                      onChange={(e) => setNewSecLimit(Number(e.target.value))}
                      className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium shadow-xs"
                      min={1}
                      max={12}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md shadow-rose-600/20">
                  Add Section to Website
                </button>
              </form>
            </div>

            {/* Existing Sections List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Storefront Sections ({websiteSections.length})</h3>
              <div className="space-y-3">
                {websiteSections.map(sec => (
                  <div key={sec.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{sec.title}</span>
                        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          Order: {sec.order}
                        </span>
                      </div>
                      {sec.subtitle && <p className="text-slate-500 text-[11px]">{sec.subtitle}</p>}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
                        <input 
                          type="checkbox" 
                          checked={sec.enabled} 
                          onChange={(e) => {
                            updateWebsiteSection(sec.id, { enabled: e.target.checked });
                            showToast(`${sec.title} ${e.target.checked ? 'Enabled' : 'Disabled'}`, 'info');
                          }} 
                          className="accent-rose-600"
                        />
                        <span className="font-bold text-slate-700">{sec.enabled ? 'Enabled' : 'Disabled'}</span>
                      </label>

                      <button
                        onClick={() => handleOpenEditSection(sec)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Section"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {!['hero-slider', 'categories', 'flash-sale', 'trending', 'promo-banners', 'new-arrivals', 'best-sellers', 'reviews'].includes(sec.id) && (
                        <button
                          type="button"
                          onClick={() => {
                            requestDelete(
                              'Delete Website Section',
                              'Are you sure you want to delete this custom section from the homepage?',
                              sec.title,
                              () => deleteWebsiteSection(sec.id)
                            );
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Support Settings Tab */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-8">
          <div>
            <h2 className="text-base font-black text-slate-900">Support Channels Configuration</h2>
            <p className="text-xs text-slate-500">
              Admin controls all 3 support channels: WhatsApp, Messenger, and Phone Call. Clicking each in the customer modal opens the exact destination.
            </p>
          </div>

          {/* 1. WhatsApp Support */}
          <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">1. WhatsApp Support</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-emerald-300">
                <input 
                  type="checkbox" 
                  checked={localSupport.whatsapp.enabled}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    whatsapp: { ...localSupport.whatsapp, enabled: e.target.checked }
                  })}
                  className="accent-emerald-600"
                />
                <span className="text-xs font-bold text-slate-800">Enable WhatsApp Support</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  value={localSupport.whatsapp?.name ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    whatsapp: { ...localSupport.whatsapp, name: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Number (with country code or local)</label>
                <input 
                  type="text" 
                  value={localSupport.whatsapp?.number ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    whatsapp: { ...localSupport.whatsapp, number: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Logo / Icon Image URL</label>
                <input 
                  type="text" 
                  value={localSupport.whatsapp?.logoUrl ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    whatsapp: { ...localSupport.whatsapp, logoUrl: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Default Pre-filled Message</label>
                <input 
                  type="text" 
                  value={localSupport.whatsapp?.message ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    whatsapp: { ...localSupport.whatsapp, message: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* 2. Messenger Support */}
          <div className="p-5 rounded-2xl border border-sky-200 bg-sky-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">2. Messenger Support</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-sky-300">
                <input 
                  type="checkbox" 
                  checked={localSupport.messenger?.enabled ?? true}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    messenger: { ...localSupport.messenger, enabled: e.target.checked }
                  })}
                  className="accent-sky-600"
                />
                <span className="text-xs font-bold text-slate-800">Enable Messenger Support</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  value={localSupport.messenger?.name ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    messenger: { ...localSupport.messenger, name: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Messenger Link / Profile URL</label>
                <input 
                  type="text" 
                  value={localSupport.messenger?.link ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    messenger: { ...localSupport.messenger, link: e.target.value }
                  })}
                  placeholder="https://m.me/shopbdofficial"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 font-mono text-xs font-medium shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Logo / Icon Image URL</label>
                <input 
                  type="text" 
                  value={localSupport.messenger?.logoUrl ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    messenger: { ...localSupport.messenger, logoUrl: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-sky-600 focus:ring-2 focus:ring-sky-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Phone Support */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">3. Phone Call Support</h3>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-amber-300">
                <input 
                  type="checkbox" 
                  checked={localSupport.phone?.enabled ?? true}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    phone: { ...localSupport.phone, enabled: e.target.checked }
                  })}
                  className="accent-amber-600"
                />
                <span className="text-xs font-bold text-slate-800">Enable Phone Support</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Display Name</label>
                <input 
                  type="text" 
                  value={localSupport.phone?.name ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    phone: { ...localSupport.phone, name: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Direct Phone Number</label>
                <input 
                  type="text" 
                  value={localSupport.phone?.number ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    phone: { ...localSupport.phone, number: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Logo / Icon Image URL</label>
                <input 
                  type="text" 
                  value={localSupport.phone?.logoUrl ?? ''}
                  onChange={(e) => setLocalSupport({
                    ...localSupport,
                    phone: { ...localSupport.phone, logoUrl: e.target.value }
                  })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                updateSupportSettings(localSupport);
                showToast('Support settings saved and updated across website!', 'success');
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Support Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* 9. Coupons Tab */}
      {activeTab === 'coupons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs h-fit space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Create Coupon</h3>
            <form onSubmit={handleAddCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  placeholder="SHOPBD500"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl uppercase font-mono text-xs font-bold placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">Type</label>
                  <select 
                    value={newCouponType}
                    onChange={(e: any) => setNewCouponType(e.target.value)}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium cursor-pointer focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                  >
                    <option value="fixed">Fixed BDT (৳)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Discount <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Min Order Amount (৳) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="number" 
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl cursor-pointer shadow-md shadow-rose-600/20">
                Add Coupon Code
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Active Promotional Coupons</h3>
            <div className="space-y-2">
              {coupons.map(cp => (
                <div key={cp.id} className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-black text-rose-600 text-sm">{cp.code}</span>
                    <p className="text-slate-500 mt-0.5">
                      {cp.discountType === 'percentage' ? `${cp.discountValue}% Off` : `৳${cp.discountValue} Flat Off`} • Min Spend: ৳{cp.minOrder}
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      requestDelete(
                        'Delete Coupon Code',
                        'Are you sure you want to deactivate and remove this coupon code?',
                        cp.code,
                        () => deleteCoupon(cp.id)
                      );
                    }} 
                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Store & Header Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-8">
          
          {/* Global Branding & Header Control */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-600" />
              <span>Global Website Branding & Header Control</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Updating these fields updates the header logo, header title, website name, favicon, and footer across the entire public store.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Website Name</label>
                <input 
                  type="text" 
                  value={localWebsite.websiteName ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, websiteName: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Header Title / Brand</label>
                <input 
                  type="text" 
                  value={localWebsite.headerName ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, headerName: e.target.value })}
                  placeholder="e.g. Shop BD"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Header Logo Image URL</label>
                <input 
                  type="text" 
                  value={localWebsite.headerLogo ?? localWebsite.logoUrl ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, headerLogo: e.target.value, logoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Favicon Image URL</label>
                <input 
                  type="text" 
                  value={localWebsite.favicon ?? localWebsite.faviconUrl ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, favicon: e.target.value })}
                  placeholder="https://.../favicon.ico"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Footer Brand Name</label>
                <input 
                  type="text" 
                  value={localWebsite.footerName ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, footerName: e.target.value })}
                  placeholder="Shop BD"
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Footer Logo Image URL</label>
                <input 
                  type="text" 
                  value={localWebsite.footerLogo ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, footerLogo: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Header Top Announcement Text</label>
                <input 
                  type="text" 
                  value={localWebsite.topAnnouncementText ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, topAnnouncementText: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Tagline</label>
                <input 
                  type="text" 
                  value={localWebsite.tagline ?? ''}
                  onChange={(e) => setLocalWebsite({ ...localWebsite, tagline: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 text-xs font-medium placeholder:text-slate-400 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Order Confirmation Settings */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Order Confirmation Settings</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              When admin clicks "WhatsApp Confirmation" on an order, this number and message template will be used.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Admin WhatsApp Number</label>
                <input 
                  type="text" 
                  value={localWhatsappOrder.whatsappNumber ?? ''}
                  onChange={(e) => setLocalWhatsappOrder({ ...localWhatsappOrder, whatsappNumber: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Display Name</label>
                <input 
                  type="text" 
                  value={localWhatsappOrder.displayName ?? localWhatsappOrder.whatsappDisplayName ?? ''}
                  onChange={(e) => setLocalWhatsappOrder({ ...localWhatsappOrder, displayName: e.target.value, whatsappDisplayName: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
            </div>

            <div className="mt-3 text-xs">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Confirmation Message Template</label>
              <textarea 
                rows={5}
                value={localWhatsappOrder.messageTemplate ?? localWhatsappOrder.orderConfirmationTemplate ?? ''}
                onChange={(e) => setLocalWhatsappOrder({ ...localWhatsappOrder, messageTemplate: e.target.value, orderConfirmationTemplate: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
              <span className="text-[11px] text-slate-600 font-medium">Available tags: {'{customer_name}, {order_id}, {products}, {total}, {payment_status}, {address}'}</span>
            </div>
          </div>

          {/* Product Sharing Settings */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-rose-600" />
              <span>Product Sharing Configuration (Real Domain shopbd.top)</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4 font-medium">
              All shared links strictly enforce the real production domain <strong>https://shopbd.top/</strong> as mandated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Base Domain (Locked to Real Domain)</label>
                <input 
                  type="text" 
                  value={localProductShare.baseDomain ?? localProductShare.domain ?? 'https://shopbd.top'}
                  disabled
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-100 font-mono text-slate-700 font-bold cursor-not-allowed shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Social Hashtags</label>
                <input 
                  type="text" 
                  value={localProductShare.hashtags ?? ''}
                  onChange={(e) => setLocalProductShare({ ...localProductShare, hashtags: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
            </div>

            <div className="mt-3 text-xs">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Default Share Message</label>
              <input 
                type="text" 
                value={localProductShare.defaultMessage ?? localProductShare.shareMessageTemplate ?? ''}
                onChange={(e) => setLocalProductShare({ ...localProductShare, defaultMessage: e.target.value, shareMessageTemplate: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
          </div>

          {/* Online Payment / WhatsApp Payment Settings */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
              Payment Methods & WhatsApp Payment
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Payment Number</label>
                <input 
                  type="text" 
                  value={localPayment.whatsappPaymentNumber ?? ''}
                  onChange={(e) => setLocalPayment({ ...localPayment, whatsappPaymentNumber: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Payment Message</label>
                <input 
                  type="text" 
                  value={localPayment.whatsappPaymentMessage ?? ''}
                  onChange={(e) => setLocalPayment({ ...localPayment, whatsappPaymentMessage: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
            </div>

            <div className="mt-3 text-xs">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">WhatsApp Payment Instructions (Shown on Checkout)</label>
              <textarea 
                rows={2}
                value={localPayment.whatsappPaymentInstructions ?? ''}
                onChange={(e) => setLocalPayment({ ...localPayment, whatsappPaymentInstructions: e.target.value })}
                className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              />
            </div>
          </div>

          {/* Bangladesh Delivery Charges */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Bangladesh Delivery Charges</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Inside Dhaka Fee (৳)</label>
                <input 
                  type="number" 
                  value={localDelivery.insideDhakaFee ?? 60}
                  onChange={(e) => setLocalDelivery({ ...localDelivery, insideDhakaFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Outside Dhaka Fee (৳)</label>
                <input 
                  type="number" 
                  value={localDelivery.outsideDhakaFee ?? 120}
                  onChange={(e) => setLocalDelivery({ ...localDelivery, outsideDhakaFee: Number(e.target.value) })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Free Delivery Threshold (৳)</label>
                <input 
                  type="number" 
                  value={localDelivery.freeDeliveryThreshold ?? 2000}
                  onChange={(e) => setLocalDelivery({ ...localDelivery, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl text-xs font-medium focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                updateWebsiteSettings(localWebsite);
                updateDeliverySettings(localDelivery);
                updatePaymentSettings(localPayment);
                updateWhatsappOrderSettings(localWhatsappOrder);
                updateProductShareSettings(localProductShare);
                showToast('All store and header settings updated instantly!', 'success');
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>

        </div>
      )}

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 text-slate-900">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsProductModalOpen(false)} 
          />
          <div className="relative bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingProductId ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {editingProductId ? 'Update product information in your live catalog' : 'Fill in the product details to publish to your shop'}
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsProductModalOpen(false)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs text-slate-900">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Product Name / Title <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={prodForm.name ?? ''} 
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. Ultra Fast Smart Watch Pro"
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                  required
                />
              </div>

              {/* Category, Subcategory & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    value={prodForm.category ?? ''} 
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const catObj = categories.find(c => c.name === newCat);
                      setProdForm({ 
                        ...prodForm, 
                        category: newCat,
                        subcategory: catObj?.subcategories?.[0] || 'Standard'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs cursor-pointer"
                    required
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name} className="text-slate-900 bg-white">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Subcategory
                  </label>
                  <input 
                    type="text" 
                    value={prodForm.subcategory ?? ''} 
                    onChange={(e) => setProdForm({ ...prodForm, subcategory: e.target.value })}
                    placeholder="e.g. Smart Watches"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Brand <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={prodForm.brand ?? ''} 
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    placeholder="e.g. Shop BD"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                    required
                  />
                </div>
              </div>

              {/* Price, Sale Price, Stock, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Product Price (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={prodForm.price ?? 0} 
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    placeholder="2000"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Discount Price (৳)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={prodForm.salePrice ?? ''} 
                    onChange={(e) => setProdForm({ ...prodForm, salePrice: Number(e.target.value) })}
                    placeholder="Optional sale price"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={prodForm.stock ?? 0} 
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    SKU Code
                  </label>
                  <input 
                    type="text" 
                    value={prodForm.sku ?? ''} 
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    placeholder="e.g. BD-8921"
                    className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-mono font-medium shadow-xs"
                  />
                </div>
              </div>

              {/* Product Status */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Product Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={prodForm.status ?? 'active'}
                  onChange={(e: any) => setProdForm({ ...prodForm, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs cursor-pointer"
                >
                  <option value="active" className="text-slate-900 bg-white">Active (Visible on Storefront)</option>
                  <option value="draft" className="text-slate-900 bg-white">Draft (Hidden from Catalog)</option>
                  <option value="archived" className="text-slate-900 bg-white">Archived</option>
                </select>
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Product Image URLs (comma separated) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={prodForm.images ?? ''} 
                  onChange={(e) => setProdForm({ ...prodForm, images: e.target.value })}
                  placeholder="https://images.unsplash.com/..., https://..."
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                  required
                />
                {prodForm.images && (
                  <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                    {prodForm.images.split(',').map((imgUrl, idx) => {
                      const trimmed = imgUrl.trim();
                      if (!trimmed) return null;
                      return (
                        <div key={idx} className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                          <img 
                            src={trimmed} 
                            alt={`Preview ${idx + 1}`} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Product Description <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  rows={3}
                  value={prodForm.description ?? ''} 
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Write full product features, specifications, and warranty details..."
                  className="w-full px-3.5 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium shadow-xs"
                  required
                />
              </div>

              {/* Promotion Badges & Flags */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Featured & Promotion Badges
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-medium">
                    <input 
                      type="checkbox" 
                      checked={prodForm.isFeatured} 
                      onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })} 
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span>Featured Product</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-medium">
                    <input 
                      type="checkbox" 
                      checked={prodForm.isFlashSale} 
                      onChange={(e) => setProdForm({ ...prodForm, isFlashSale: e.target.checked })} 
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span>Flash Sale</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-medium">
                    <input 
                      type="checkbox" 
                      checked={prodForm.isTrending} 
                      onChange={(e) => setProdForm({ ...prodForm, isTrending: e.target.checked })} 
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span>Trending</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-medium">
                    <input 
                      type="checkbox" 
                      checked={prodForm.isBestSeller} 
                      onChange={(e) => setProdForm({ ...prodForm, isBestSeller: e.target.checked })} 
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 accent-rose-600 cursor-pointer"
                    />
                    <span>Best Seller</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                {editingProductId ? (
                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = editingProductId;
                      const nameToDelete = prodForm.name;
                      setIsProductModalOpen(false);
                      requestDelete(
                        'Delete Product Permanently',
                        'Are you sure you want to remove this product from the inventory?',
                        nameToDelete,
                        () => deleteProduct(idToDelete)
                      );
                    }}
                    className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Product</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{editingProductId ? 'Update Product' : 'Add Product'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 text-slate-900">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsEditCategoryModalOpen(false)} />
          <div className="relative bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Edit Category: {editingCategory.name}</h3>
              <button onClick={() => setIsEditCategoryModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditCategory} className="space-y-3 text-xs text-slate-900">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Category Name</label>
                <input 
                  type="text" 
                  value={catEditForm.name ?? ''} 
                  onChange={(e) => setCatEditForm({ ...catEditForm, name: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Category Slug</label>
                <input 
                  type="text" 
                  value={catEditForm.slug ?? ''} 
                  onChange={(e) => setCatEditForm({ ...catEditForm, slug: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={catEditForm.image ?? ''} 
                  onChange={(e) => setCatEditForm({ ...catEditForm, image: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
                {catEditForm.image && (
                  <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                    <img src={catEditForm.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Display Sort Order</label>
                  <input 
                    type="number" 
                    value={catEditForm.sortOrder ?? 1} 
                    onChange={(e) => setCatEditForm({ ...catEditForm, sortOrder: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Status</label>
                  <select 
                    value={catEditForm.status ?? 'active'} 
                    onChange={(e: any) => setCatEditForm({ ...catEditForm, status: e.target.value })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="active" className="text-slate-900 bg-white">Active</option>
                    <option value="inactive" className="text-slate-900 bg-white">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idToDelete = editingCategory.id;
                    const nameToDelete = editingCategory.name;
                    setIsEditCategoryModalOpen(false);
                    requestDelete(
                      'Delete Category',
                      'Are you sure you want to permanently delete this category?',
                      nameToDelete,
                      () => deleteCategory(idToDelete)
                    );
                  }}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditCategoryModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-rose-600/20"
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Banner Modal */}
      {isEditBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 text-slate-900">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsEditBannerModalOpen(false)} />
          <div className="relative bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Edit Website Banner</h3>
              <button onClick={() => setIsEditBannerModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditBanner} className="space-y-3 text-xs text-slate-900">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Banner Title</label>
                <input 
                  type="text" 
                  value={bannerEditForm.title ?? ''} 
                  onChange={(e) => setBannerEditForm({ ...bannerEditForm, title: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={bannerEditForm.subtitle ?? ''} 
                  onChange={(e) => setBannerEditForm({ ...bannerEditForm, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Image URL</label>
                <input 
                  type="text" 
                  value={bannerEditForm.image ?? ''} 
                  onChange={(e) => setBannerEditForm({ ...bannerEditForm, image: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
                {bannerEditForm.image && (
                  <div className="mt-2 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <img src={bannerEditForm.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Target Link URL</label>
                  <input 
                    type="text" 
                    value={bannerEditForm.link ?? ''} 
                    onChange={(e) => setBannerEditForm({ ...bannerEditForm, link: e.target.value })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Button Text</label>
                  <input 
                    type="text" 
                    value={bannerEditForm.buttonText ?? ''} 
                    onChange={(e) => setBannerEditForm({ ...bannerEditForm, buttonText: e.target.value })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Banner Type</label>
                  <select 
                    value={bannerEditForm.type ?? 'hero'} 
                    onChange={(e: any) => setBannerEditForm({ ...bannerEditForm, type: e.target.value })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  >
                    <option value="hero" className="text-slate-900 bg-white">Hero Main Banner</option>
                    <option value="slider" className="text-slate-900 bg-white">Slider Banner</option>
                    <option value="promo" className="text-slate-900 bg-white">Promo Split Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Display Sort Order</label>
                  <input 
                    type="number" 
                    value={bannerEditForm.sortOrder ?? 1} 
                    onChange={(e) => setBannerEditForm({ ...bannerEditForm, sortOrder: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-bold">
                  <input 
                    type="checkbox" 
                    checked={bannerEditForm.isActive} 
                    onChange={(e) => setBannerEditForm({ ...bannerEditForm, isActive: e.target.checked })} 
                    className="accent-rose-600 w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <span>Active / Visible on Store</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const idToDelete = editingBanner.id;
                    const titleToDelete = editingBanner.title;
                    setIsEditBannerModalOpen(false);
                    requestDelete(
                      'Delete Store Banner',
                      'Are you sure you want to permanently remove this banner from the store?',
                      titleToDelete,
                      () => deleteBanner(idToDelete)
                    );
                  }}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditBannerModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-rose-600/20"
                  >
                    Update Banner
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Section Modal */}
      {isEditSectionModalOpen && editingSection && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 text-slate-900">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsEditSectionModalOpen(false)} />
          <div className="relative bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Edit Website Section</h3>
              <button onClick={() => setIsEditSectionModalOpen(false)} className="cursor-pointer text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSection} className="space-y-3 text-xs text-slate-900">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Section Title</label>
                <input 
                  type="text" 
                  value={sectionEditForm.title ?? ''} 
                  onChange={(e) => setSectionEditForm({ ...sectionEditForm, title: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Subtitle</label>
                <input 
                  type="text" 
                  value={sectionEditForm.subtitle ?? ''} 
                  onChange={(e) => setSectionEditForm({ ...sectionEditForm, subtitle: e.target.value })}
                  className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Item Limit</label>
                  <input 
                    type="number" 
                    value={sectionEditForm.itemLimit ?? 4} 
                    onChange={(e) => setSectionEditForm({ ...sectionEditForm, itemLimit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Display Order</label>
                  <input 
                    type="number" 
                    value={sectionEditForm.order ?? 1} 
                    onChange={(e) => setSectionEditForm({ ...sectionEditForm, order: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white text-slate-900 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-800 font-bold">
                  <input 
                    type="checkbox" 
                    checked={sectionEditForm.enabled} 
                    onChange={(e) => setSectionEditForm({ ...sectionEditForm, enabled: e.target.checked })} 
                    className="accent-rose-600 w-4 h-4 rounded border-slate-300 cursor-pointer"
                  />
                  <span>Enable Section on Storefront</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
                {!['hero-slider', 'categories', 'flash-sale', 'trending', 'promo-banners', 'new-arrivals', 'best-sellers', 'reviews'].includes(editingSection.id) ? (
                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = editingSection.id;
                      const titleToDelete = editingSection.title;
                      setIsEditSectionModalOpen(false);
                      requestDelete(
                        'Delete Website Section',
                        'Are you sure you want to permanently delete this custom section?',
                        titleToDelete,
                        () => deleteWebsiteSection(idToDelete)
                      );
                    }}
                    className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl cursor-pointer flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditSectionModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer shadow-md shadow-rose-600/20"
                  >
                    Update Section
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complete Order Details & Confirmation Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedOrderDetails(null)} />
          <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-lg font-black text-slate-900 font-mono">
                    Order #{selectedOrderDetails.orderNumber}
                  </h3>
                  <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    selectedOrderDetails.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                    selectedOrderDetails.status === 'DELIVERED' ? 'bg-blue-100 text-blue-800' :
                    selectedOrderDetails.status === 'CANCELLED' ? 'bg-rose-100 text-rose-800' :
                    selectedOrderDetails.status === 'PROCESSING' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedOrderDetails.status}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    selectedOrderDetails.paymentStatus === 'PAID' || selectedOrderDetails.paymentStatus === 'paid' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    Payment: {selectedOrderDetails.paymentStatus || 'UNPAID'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(selectedOrderDetails.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  title="Print Order Invoice"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Print Invoice</span>
                </button>
                <button 
                  onClick={() => setSelectedOrderDetails(null)} 
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Confirmation Banner for Pending Orders */}
            {selectedOrderDetails.status === 'PENDING' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-900">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>This order is waiting for admin confirmation.</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      updateOrderStatus(selectedOrderDetails.id, 'CONFIRMED');
                      setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'CONFIRMED' }) : null);
                      showToast(`Order #${selectedOrderDetails.orderNumber} confirmed!`, 'success');
                    }}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm Order Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppOrderConfirmation(selectedOrderDetails)}
                    className="inline-flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* Customer & Delivery Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Customer Details</span>
                <p className="font-bold text-sm text-slate-900">{selectedOrderDetails.customerName}</p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a 
                    href={`tel:${selectedOrderDetails.customerPhone}`}
                    className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-rose-600 font-mono font-bold hover:border-rose-300"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrderDetails.customerPhone}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleSendWhatsAppOrderConfirmation(selectedOrderDetails)}
                    className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg hover:bg-emerald-100 font-bold"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>
                {selectedOrderDetails.customerEmail && (
                  <p className="text-slate-600 pt-1">Email: {selectedOrderDetails.customerEmail}</p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Delivery Details</span>
                <p className="font-bold text-slate-900">{selectedOrderDetails.address}</p>
                <p className="text-slate-700">
                  {selectedOrderDetails.area ? `${selectedOrderDetails.area}, ` : ''}{selectedOrderDetails.district}
                </p>
                <p className="text-slate-700 font-semibold">
                  Method: {selectedOrderDetails.deliveryMethod === 'INSIDE_DHAKA' ? 'Inside Dhaka (৳60)' : 'Outside Dhaka (৳120)'}
                </p>
                {selectedOrderDetails.orderNotes && (
                  <p className="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 italic mt-1 font-medium">
                    Customer Note: "{selectedOrderDetails.orderNotes}"
                  </p>
                )}
              </div>
            </div>

            {/* Ordered Products Table */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider">
                Ordered Products ({selectedOrderDetails.items.length})
              </span>
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3 text-center">Unit Price</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Line Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrderDetails.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-900">{item.name}</p>
                              {item.selectedSize && (
                                <span className="text-[10px] text-slate-600 font-medium">Size: {item.selectedSize}</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-900">
                          ৳{(item.salePrice || item.price).toLocaleString()}
                        </td>
                        <td className="p-3 text-center font-bold text-slate-900">
                          {item.quantity}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900 font-mono">
                          ৳{((item.salePrice || item.price) * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Financial Calculation */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Subtotal</span>
                <span className="font-mono text-slate-900">৳{selectedOrderDetails.subtotal.toLocaleString()}</span>
              </div>
              {selectedOrderDetails.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount</span>
                  <span className="font-mono">-৳{selectedOrderDetails.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-700 font-medium">
                <span>Delivery Charge</span>
                <span className="font-mono text-slate-900">৳{(selectedOrderDetails.deliveryCharge ?? 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                <span>Grand Total</span>
                <span className="text-rose-600 font-mono font-bold">৳{selectedOrderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Payment & Courier Assignment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Payment Information</span>
                <p className="text-slate-800 font-bold">Method: {selectedOrderDetails.paymentMethod.replace(/_/g, ' ')}</p>
                {selectedOrderDetails.transactionId && (
                  <p className="font-mono text-rose-600 font-bold">TrxID: {selectedOrderDetails.transactionId}</p>
                )}
                <div>
                  <label className="block text-slate-800 mb-1.5 font-bold">Change Payment Status</label>
                  <select
                    value={selectedOrderDetails.paymentStatus || 'pending'}
                    onChange={(e) => {
                      const newStatus = e.target.value as PaymentStatus;
                      updatePaymentStatus(selectedOrderDetails.id, newStatus);
                      setSelectedOrderDetails(prev => prev ? ({ ...prev, paymentStatus: newStatus }) : null);
                      showToast(`Payment status updated to ${newStatus}`, 'success');
                    }}
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold cursor-pointer shadow-xs focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="pending" className="text-slate-900 bg-white">Pending</option>
                    <option value="paid" className="text-slate-900 bg-white">Paid</option>
                    <option value="failed" className="text-slate-900 bg-white">Failed</option>
                    <option value="refunded" className="text-slate-900 bg-white">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Courier Shipping Details</span>
                <div>
                  <label className="block text-slate-800 mb-1.5 font-bold">Courier Partner Name</label>
                  <input 
                    type="text"
                    value={modalCourierName ?? ''}
                    onChange={(e) => setModalCourierName(e.target.value)}
                    placeholder="e.g. Steadfast, Pathao, RedX, Paperfly"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-medium placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-slate-800 mb-1.5 font-bold">Courier Tracking ID</label>
                  <input 
                    type="text"
                    value={modalTrackingNumber ?? ''}
                    onChange={(e) => setModalTrackingNumber(e.target.value)}
                    placeholder="e.g. ST-8823901"
                    className="w-full p-2.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-mono font-medium placeholder:text-slate-400 shadow-xs focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSaveCourierDetails}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Courier Info
                </button>
              </div>
            </div>

            {/* Order Timeline History */}
            {selectedOrderDetails.statusTimeline && selectedOrderDetails.statusTimeline.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Order Status Timeline</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {selectedOrderDetails.statusTimeline.map((event, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{event.status}</span>
                        {event.note && <span className="text-slate-600 font-medium">• {event.note}</span>}
                      </div>
                      <span className="text-slate-600 font-mono text-[10px] font-semibold">
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Complete Status Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selectedOrderDetails.id, 'CONFIRMED');
                    setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'CONFIRMED' }) : null);
                    showToast(`Order #${selectedOrderDetails.orderNumber} confirmed!`, 'success');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Confirm Order</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selectedOrderDetails.id, 'PROCESSING');
                    setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'PROCESSING' }) : null);
                    showToast(`Order marked as Processing`, 'info');
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Mark Processing
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selectedOrderDetails.id, 'SHIPPED');
                    setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'SHIPPED' }) : null);
                    showToast(`Order marked as Shipped`, 'info');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Mark Shipped
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updateOrderStatus(selectedOrderDetails.id, 'DELIVERED');
                    updatePaymentStatus(selectedOrderDetails.id, 'paid');
                    setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'DELIVERED', paymentStatus: 'paid' }) : null);
                    showToast(`Order marked as Delivered & Paid!`, 'success');
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Mark Delivered
                </button>

                <button
                  type="button"
                  onClick={() => {
                    requestDelete(
                      'Cancel Customer Order',
                      'Are you sure you want to mark this order as Cancelled?',
                      `Order #${selectedOrderDetails.orderNumber}`,
                      () => {
                        updateOrderStatus(selectedOrderDetails.id, 'CANCELLED');
                        setSelectedOrderDetails(prev => prev ? ({ ...prev, status: 'CANCELLED' }) : null);
                        showToast(`Order cancelled`, 'info');
                      }
                    );
                  }}
                  className="bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject / Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const idToDelete = selectedOrderDetails.id;
                    const ordNum = selectedOrderDetails.orderNumber;
                    setSelectedOrderDetails(null);
                    requestDelete(
                      'Permanently Delete Order',
                      'Are you sure you want to completely erase this order record from the system?',
                      `Order #${ordNum}`,
                      () => deleteOrder(idToDelete)
                    );
                  }}
                  className="bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-700 border border-slate-200 hover:border-rose-300 font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Permanently Delete Order"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Order</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWhatsAppOrderConfirmation(selectedOrderDetails)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-2 border rounded-xl hover:bg-slate-50 cursor-pointer font-bold"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Universal In-App Delete Confirmation Modal (Bypasses iframe alert/confirm blocking) */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
            onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))} 
          />
          <div className="relative bg-white text-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6 text-rose-600" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">{deleteConfirmation.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {deleteConfirmation.message}
              </p>
              {deleteConfirmation.itemName && (
                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs font-bold text-slate-800 break-all">
                  {deleteConfirmation.itemName}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="w-1/2 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
