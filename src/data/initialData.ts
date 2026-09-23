import { 
  Product, 
  Category, 
  Banner, 
  FlashSale, 
  DeliverySettings, 
  PaymentSettings, 
  WebsiteSettings, 
  Coupon,
  Review,
  User,
  Order,
  SupportSettings,
  WhatsAppOrderSettings,
  ProductShareSettings,
  WebsiteSection
} from '../types';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics & Gadgets',
    slug: 'electronics-gadgets',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Smartwatches', 'Wireless Earbuds', 'Power Banks', 'Bluetooth Speakers', 'Cables & Adapters'],
    status: 'active',
    sortOrder: 1,
    seoTitle: 'Buy Electronics & Gadgets Online in Bangladesh | Shop BD',
    seoDescription: 'Find best deals on smartwatches, TWS earbuds, fast chargers, and smart gadgets in BD with home delivery.'
  },
  {
    id: 'cat-2',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Premium Panjabi', 'Casual Shirts', 'Polo T-Shirts', 'Trousers & Jeans', 'Winter Hoodies'],
    status: 'active',
    sortOrder: 2,
    seoTitle: "Men's Fashion & Panjabi Online BD | NM Shop BD",
    seoDescription: "Shop authentic Men's Panjabi, formal shirts, polo t-shirts, and cotton wear at affordable prices in Bangladesh."
  },
  {
    id: 'cat-3',
    name: "Women's Fashion",
    slug: 'womens-fashion',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Exclusive Sarees', 'Three Piece & Kurtis', 'Hijab & Abaya', 'Ladies Bags', 'Jewelry'],
    status: 'active',
    sortOrder: 3,
    seoTitle: "Women's Clothing & Saree Collection | Shop BD",
    seoDescription: "Explore elegant sarees, designer salwar kameez, party wear, and accessories with cash on delivery."
  },
  {
    id: 'cat-4',
    name: 'Home & Kitchen Appliances',
    slug: 'home-kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Air Fryers', 'Blenders & Grinders', 'Non-stick Cookware', 'Electric Kettles', 'Water Bottles'],
    status: 'active',
    sortOrder: 4,
    seoTitle: 'Smart Home & Kitchen Appliances | Shop BD',
    seoDescription: 'Upgrade your kitchen with non-stick cookware, blenders, pressure cookers, and daily household tools.'
  },
  {
    id: 'cat-5',
    name: 'Health & Personal Care',
    slug: 'health-beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Hair Dryers & Trimmers', 'Skincare & Serums', 'Face Wash', 'Body Lotions', 'Health Monitors'],
    status: 'active',
    sortOrder: 5,
    seoTitle: 'Health & Beauty Products in Bangladesh | Shop BD',
    seoDescription: 'Genuine beauty products, grooming trimmers, imported skincare, and personal care essentials.'
  },
  {
    id: 'cat-6',
    name: 'Watches & Lifestyle',
    slug: 'watches-lifestyle',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    subcategories: ['Analog Watches', 'Leather Wallets', 'Sunglasses', 'Backpacks & Luggage'],
    status: 'active',
    sortOrder: 6,
    seoTitle: 'Watches, Bags & Lifestyle Accessories | Shop BD',
    seoDescription: 'Trendy watches, genuine leather wallets, sunglasses, and travel backpacks with warranty.'
  }
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Haylou Solar Pro AMOLED Smartwatch with Bluetooth Calling',
    description: 'Experience ultra-smooth navigation with the 1.43" HD AMOLED display, metallic rotary crown, 100+ sports modes, 24/7 heart rate monitor, SpO2 sensor, and Bluetooth 5.3 phone call support. Battery life lasts up to 10 days on a single charge.',
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
    ],
    price: 3650,
    salePrice: 2850,
    discount: 22,
    stock: 45,
    sku: 'SBD-WAT-001',
    category: 'Electronics & Gadgets',
    subcategory: 'Smartwatches',
    brand: 'Haylou',
    sizes: ['Standard 22mm Strap'],
    colors: [
      { name: 'Midnight Black', hex: '#111827' },
      { name: 'Silver Steel', hex: '#9CA3AF' },
      { name: 'Ocean Blue', hex: '#0284C7' }
    ],
    colorVariants: [
      { name: 'Midnight Black', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80' },
      { name: 'Silver Steel', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Ocean Blue', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.8,
    reviewsCount: 38,
    isFeatured: true,
    isFlashSale: true,
    isTrending: true,
    isBestSeller: true,
    specifications: {
      'Display': '1.43-inch AMOLED (466x466 px)',
      'Bluetooth': 'v5.3 with Voice Calling',
      'Battery': '300mAh (Up to 10 Days typical use)',
      'Water Resistance': 'IP68 certified',
      'Sensors': 'Optical Heart Rate, SpO2, Sleep Tracker',
      'Warranty': '6 Months Official Replacement Warranty'
    },
    features: [
      'Crystal-clear Bluetooth HD calls with noise cancellation',
      'Always-on Display with customized animated watch faces',
      'Real-time health monitoring and sleep analysis',
      'Fast magnetic charging cable included'
    ],
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Anker Soundcore Life P2i True Wireless Earbuds with AI Call Enhancement',
    description: 'Equipped with 10mm graphene drivers for deeply rich bass and clear mids. Dual microphones with custom AI noise reduction algorithm ensure crystal clear phone calls even in bustling Dhaka traffic. 28 hours total playtime.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    price: 2600,
    salePrice: 1999,
    discount: 23,
    stock: 28,
    sku: 'SBD-AUD-002',
    category: 'Electronics & Gadgets',
    subcategory: 'Wireless Earbuds',
    brand: 'Soundcore',
    sizes: ['S/M/L Tips Included'],
    colors: [
      { name: 'Matte Black', hex: '#1F2937' },
      { name: 'Glacier White', hex: '#F3F4F6' }
    ],
    colorVariants: [
      { name: 'Matte Black', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80' },
      { name: 'Glacier White', image: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.9,
    reviewsCount: 52,
    isFeatured: true,
    isFlashSale: true,
    isTrending: true,
    isBestSeller: true,
    specifications: {
      'Driver Size': '10mm Graphene coated',
      'Playtime': '8 hours per charge, 28 hours with case',
      'Fast Charge': '10 min charge gives 1 hour playtime',
      'Waterproof': 'IPX5 Sweat & Water Resistant',
      'EQ Modes': 'Bass Mode and Podcast Mode'
    },
    features: [
      'AI enhanced dual microphones for noise-free calls',
      'Instant One-Step Bluetooth 5.2 pairing',
      'Featherweight ergonomic design for long listening comfort'
    ],
    createdAt: '2026-08-10T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Premium Semi-Pure Cotton Jacquard Embroidered Men Panjabi',
    description: 'Finely crafted premium cotton fabric featuring sophisticated chest embroidery, band collar, metallic button detailing, and side pockets. Ideal for Eid festivals, Jummah prayers, weddings, and formal occasions in Bangladesh.',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
    ],
    price: 2450,
    salePrice: 1750,
    discount: 29,
    stock: 60,
    sku: 'SBD-PAN-003',
    category: "Men's Fashion",
    subcategory: 'Premium Panjabi',
    brand: 'NM Exclusive',
    sizes: ['40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: [
      { name: 'Royal Navy', hex: '#1E3A8A' },
      { name: 'Charcoal Black', hex: '#111827' }
    ],
    colorVariants: [
      { name: 'Royal Navy', image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80' },
      { name: 'Charcoal Black', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.7,
    reviewsCount: 29,
    isFeatured: true,
    isTrending: true,
    isBestSeller: true,
    specifications: {
      'Fabric': '100% Breathable Egyptian Combed Cotton',
      'Collar': 'Stitched Mandarin Band Collar',
      'Pattern': 'Geometric Tone-on-tone Jacquard',
      'Care': 'Hand wash or dry clean recommended'
    },
    features: [
      'Sweat-absorbent cool fabric designed for tropical climate',
      'Anti-shrinkage treated and colorfast dyes',
      'Precision cut for modern slim-regular silhouette'
    ],
    createdAt: '2026-08-20T14:30:00Z'
  },
  {
    id: 'prod-4',
    name: 'Baseus Bipow 20000mAh 20W PD Digital Fast Charging Power Bank',
    description: 'Massive 20,000mAh lithium-polymer battery capacity with dual input and triple output ports. Features an accurate LED digital percentage display and 20W Power Delivery for rapid charging of iPhones, Samsungs, and Xiaomi devices.',
    images: [
      'https://images.unsplash.com/photo-1609592424368-2a911eb31a89?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=800&q=80'
    ],
    price: 2800,
    salePrice: 2150,
    discount: 23,
    stock: 35,
    sku: 'SBD-POW-004',
    category: 'Electronics & Gadgets',
    subcategory: 'Power Banks',
    brand: 'Baseus',
    sizes: ['20000mAh'],
    colors: [
      { name: 'Jet Black', hex: '#000000' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    colorVariants: [
      { name: 'Jet Black', image: 'https://images.unsplash.com/photo-1609592424368-2a911eb31a89?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pure White', image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.8,
    reviewsCount: 44,
    isFeatured: true,
    isFlashSale: true,
    isTrending: true,
    specifications: {
      'Capacity': '20,000mAh / 3.7V (74Wh)',
      'Max Output': '20W PD / QC 3.0',
      'Ports': '1x USB-C (In/Out), 2x USB-A (Out), 1x Micro-USB (In)',
      'Protection': 'Over-voltage, short-circuit, over-heating protection'
    },
    features: [
      'Charges iPhone 14/15 up to 50% in just 30 minutes',
      'Airplane travel certified with multi-layer safety chips',
      'LED screen shows remaining battery percentage clearly'
    ],
    createdAt: '2026-08-05T09:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Pure Soft Dhakai Jamdani Handloom Saree with Zari Work',
    description: 'Authentic handcrafted Bangladeshi Jamdani saree woven from superfine cotton silk threads with gleaming gold zari floral motifs across the aanchal and border. Comes with matching unstitched blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'
    ],
    price: 5200,
    salePrice: 3850,
    discount: 26,
    stock: 15,
    sku: 'SBD-SAR-005',
    category: "Women's Fashion",
    subcategory: 'Exclusive Sarees',
    brand: 'Heritage Dhaka',
    sizes: ['Standard 12 Haat with Blouse'],
    colors: [
      { name: 'Crimson Red & Gold', hex: '#991B1B' },
      { name: 'Emerald Green', hex: '#065F46' }
    ],
    colorVariants: [
      { name: 'Crimson Red & Gold', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Emerald Green', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 5.0,
    reviewsCount: 19,
    isFeatured: true,
    isBestSeller: true,
    specifications: {
      'Fabric': 'Premium Handloom Cotton Silk',
      'Work': 'Fine Gold Zari floral weaving',
      'Origin': 'Demra / Rupganj, Dhaka, Bangladesh',
      'Length': '6.3 meters including 0.8m blouse piece'
    },
    features: [
      'Lightweight, soft texture that drapes gracefully',
      'Handcrafted by generational master weavers in Dhaka',
      'Traditional heritage look perfect for celebrations'
    ],
    createdAt: '2026-08-18T16:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'Smart 5.5L Visual Air Fryer with Touch Control & Oil-Free Cooking',
    description: 'Cook delicious crispy snacks, samosas, chicken roast, and french fries with 85% less oil! Features a transparent tempered glass viewing window, digital touch presets, non-stick removable basket, and 360° rapid hot air convection circulation.',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80'
    ],
    price: 6500,
    salePrice: 4890,
    discount: 25,
    stock: 20,
    sku: 'SBD-KIT-006',
    category: 'Home & Kitchen Appliances',
    subcategory: 'Air Fryers',
    brand: 'Miyako Pro',
    sizes: ['5.5 Litre Family Size'],
    colors: [
      { name: 'Piano Black & Rose Gold', hex: '#18181B' },
      { name: 'Nordic Cream White', hex: '#FEF3C7' }
    ],
    colorVariants: [
      { name: 'Piano Black & Rose Gold', image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80' },
      { name: 'Nordic Cream White', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.9,
    reviewsCount: 31,
    isFeatured: true,
    isFlashSale: true,
    specifications: {
      'Capacity': '5.5 Liters',
      'Power': '1400 Watts / 220V',
      'Temperature': '80°C - 200°C Adjustable',
      'Timer': '0 - 60 minutes with auto shut-off',
      'Basket': 'Food grade ceramic non-stick dishwasher safe'
    },
    features: [
      'Glass observation window lets you monitor browning without opening',
      '8 one-touch cooking presets for effortless family meals',
      'Save gas and electricity with ultra-fast heating element'
    ],
    createdAt: '2026-08-12T11:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'VGR Professional Cordless Hair & Beard Trimmer (LED Display)',
    description: 'Heavy-duty stainless steel self-sharpening blades with zero gapped T-blade design. Ideal for clean beard shaping, hair fades, and personal grooming. Fast USB-C charging with smart LED battery indicator.',
    images: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    price: 1850,
    salePrice: 1250,
    discount: 32,
    stock: 50,
    sku: 'SBD-GRO-007',
    category: 'Health & Personal Care',
    subcategory: 'Hair Dryers & Trimmers',
    brand: 'VGR',
    sizes: ['Includes 1mm, 2mm, 3mm Guide Combs'],
    colors: [
      { name: 'Vintage Bronze Metal', hex: '#78350F' },
      { name: 'Silver Chrome', hex: '#6B7280' }
    ],
    colorVariants: [
      { name: 'Vintage Bronze Metal', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80' },
      { name: 'Silver Chrome', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.7,
    reviewsCount: 67,
    isFeatured: false,
    isTrending: true,
    isBestSeller: true,
    specifications: {
      'Blade': 'Stainless Steel T-Blade Zero Gap',
      'Battery': '1200mAh Lithium-ion',
      'Run Time': '120 minutes continuous use',
      'Charging Time': '2 hours fast USB Type-C'
    },
    features: [
      'Quiet powerful rotary motor with 6500 RPM',
      'Carved vintage all-metal anti-slip casing',
      'Complete set includes oil, cleaning brush, and 3 guards'
    ],
    createdAt: '2026-08-01T08:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Curren Classic Men Business Chronograph Watch with Genuine Leather',
    description: 'Timeless luxury design featuring a surgical grade stainless steel case, quartz movement, functional chronograph sub-dials, date window, and a hand-stitched genuine leather strap. 30M waterproof for daily wear.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    price: 2200,
    salePrice: 1550,
    discount: 30,
    stock: 32,
    sku: 'SBD-WAT-008',
    category: 'Watches & Lifestyle',
    subcategory: 'Analog Watches',
    brand: 'Curren',
    sizes: ['44mm Dial Diameter'],
    colors: [
      { name: 'Cognac Brown Strap & Blue Dial', hex: '#78350F' },
      { name: 'All Black Luxury', hex: '#18181B' }
    ],
    colorVariants: [
      { name: 'Cognac Brown Strap & Blue Dial', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80' },
      { name: 'All Black Luxury', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80' }
    ],
    rating: 4.6,
    reviewsCount: 22,
    isFeatured: true,
    isTrending: false,
    isBestSeller: false,
    specifications: {
      'Movement': 'Japanese Quartz Precision Movement',
      'Dial Window': 'Hardlex Scratch-Resistant Mineral Crystal',
      'Water Resistance': '3ATM (Splash and Rain Resistant)',
      'Band Width': '22mm Genuine Leather'
    },
    features: [
      'Working minute and second chronograph sub-dials',
      'Luminous hour hands for night visibility',
      'Comes in a signature branded gift box'
    ],
    createdAt: '2026-08-08T15:00:00Z'
  }
];

export const initialBanners: Banner[] = [
  {
    id: 'ban-1',
    title: 'Grand Flash Sale & Mega Deals!',
    subtitle: 'Up to 50% OFF on Top Tech, Men & Women Fashion with Cash on Delivery nationwide across Bangladesh.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Shop Flash Sale',
    link: '/flash-sale',
    type: 'hero',
    isActive: true,
    sortOrder: 1
  },
  {
    id: 'ban-2',
    title: 'Smart Gadgets & Audio Festival 2026',
    subtitle: '100% Genuine Smartwatches, Earbuds, and Fast Chargers with official warranty & fast 24h delivery in Dhaka.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Explore Gadgets',
    link: '/category/electronics-gadgets',
    type: 'hero',
    isActive: true,
    sortOrder: 2
  },
  {
    id: 'ban-3',
    title: 'Authentic Panjabi & Festive Apparel',
    subtitle: 'Hand-embroidered pure combed cotton Panjabi, kurtas, and traditional sarees tailored to perfection.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'View Collection',
    link: '/category/mens-fashion',
    type: 'hero',
    isActive: true,
    sortOrder: 3
  }
];

export const initialFlashSale: FlashSale = {
  id: 'flash-sale-main',
  title: 'Limited Time Midnight Flash Sale',
  subtitle: 'Hurry up! Special discounts available while stocks last. Stock updates in real time.',
  startDate: new Date(Date.now() - 3600000).toISOString(),
  endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days remaining
  discountPercent: 30,
  productIds: ['prod-1', 'prod-2', 'prod-4', 'prod-6'],
  isActive: true
};

export const initialDeliverySettings: DeliverySettings = {
  insideDhakaFee: 60,
  outsideDhakaFee: 120,
  freeDeliveryThreshold: 2000,
  insideDhakaTime: '24 - 48 Hours',
  outsideDhakaTime: '48 - 72 Hours'
};

export const initialPaymentSettings: PaymentSettings = {
  codEnabled: true,
  codInstructions: 'Pay with cash right at your doorstep upon receiving and checking the parcel.',
  whatsappPaymentEnabled: true,
  whatsappPaymentNumber: '+8801700000000',
  whatsappPaymentInstructions: 'You can complete your payment via WhatsApp! Message our admin with your Order ID for instant bKash, Nagad, or Bank payment confirmation.',
  whatsappPaymentMessage: 'Hello Shop BD Admin, I have placed an order and would like to confirm my payment via WhatsApp. Order details attached.',
  bkashEnabled: true,
  bkashNumber: '01712-345678',
  bkashType: 'Merchant',
  bkashInstructions: 'Go to your bKash app -> Select "Make Payment" (or "Send Money" if personal) -> Enter 01712-345678 -> Enter amount -> Use Order ID as reference -> Enter TrxID below.',
  nagadEnabled: true,
  nagadNumber: '01812-345678',
  nagadType: 'Merchant',
  nagadInstructions: 'Go to Nagad app -> Select Merchant Payment -> Enter 01812-345678 -> Enter total amount -> Put TrxID in the box.',
  rocketEnabled: true,
  rocketNumber: '01912-345678-9',
  rocketInstructions: 'Dial *322# or use Rocket App -> Merchant Pay -> Enter 01912-345678-9 -> Put TrxID.',
  onlinePaymentEnabled: true
};

export const initialWebsiteSettings: WebsiteSettings = {
  websiteName: 'Shop BD',
  companyName: 'NM Shop BD',
  domain: 'shopbd.top',
  tagline: 'Shop Smart, Live Better',
  logoUrl: '',
  faviconUrl: 'https://shopbd.top/favicon.ico',
  favicon: 'https://shopbd.top/favicon.ico',
  headerLogo: '',
  headerName: 'Shop BD',
  footerLogo: '',
  footerName: 'Shop BD',
  phone: '+880 1700-000000',
  email: 'support@shopbd.top',
  address: 'Plot 12, Road 4, Block D, Banani Commercial Area, Dhaka-1213, Bangladesh',
  currency: '৳',
  taxPercent: 0,
  maintenanceMode: false,
  facebookUrl: 'https://facebook.com/shopbdofficial',
  instagramUrl: 'https://instagram.com/shopbdofficial',
  youtubeUrl: 'https://youtube.com/@shopbd',
  tiktokUrl: 'https://tiktok.com/@shopbd',
  whatsappNumber: '+8801700000000',
  messengerUrl: 'https://m.me/shopbdofficial',
  footerAbout: 'Shop BD (NM Shop BD) is an all-in-one verified Bangladeshi online marketplace. We bridge quality brands with valued customers, offering 100% original products, instant bKash/Nagad checkout, friendly customer care, and rapid express delivery across all 64 districts.',
  topAnnouncementText: 'Free Delivery across Bangladesh on orders over ৳2,000!',
  showTopAnnouncement: true,
  showTrackOrder: true,
  showHotline: true
};

export const initialSupportSettings: SupportSettings = {
  whatsapp: {
    enabled: true,
    name: 'WhatsApp Support',
    number: '+8801700000000',
    icon: 'MessageCircle',
    logoUrl: '',
    message: 'Hello Shop BD Support team! I need assistance with product selection or an existing order.'
  },
  messenger: {
    enabled: true,
    name: 'Messenger Support',
    link: 'https://m.me/shopbdofficial',
    icon: 'MessageSquare',
    logoUrl: ''
  },
  phone: {
    enabled: true,
    name: 'Phone Call Helpline',
    number: '+8801700000000',
    icon: 'PhoneCall',
    logoUrl: ''
  }
};

export const initialWhatsAppOrderSettings: WhatsAppOrderSettings = {
  whatsappNumber: '+8801700000000',
  whatsappDisplayName: 'Shop BD Customer Desk',
  displayName: 'Shop BD Customer Desk',
  orderConfirmationTemplate: `🛍️ *SHOP BD - WHATSAPP ORDER CONFIRMATION REQUEST*

Hello Shop BD, please confirm my order:

📋 *CUSTOMER INFORMATION*
• *Name:* {customer_name}
• *Phone:* {phone}
• *Delivery Address:* {address}

📦 *ORDER DETAILS (ID: {order_id})*
{items}

💰 *PAYMENT & BILLING*
• *Product Price:* {subtotal}
• *Delivery Charge:* {delivery_charge}
• *Total Amount:* {total}
• *Payment Option:* WHATSAPP CONFIRM ORDER

✅ *CONFIRMATION REQUEST*
Please verify and confirm my order for delivery. Thank you!`,
  messageTemplate: `🛍️ *SHOP BD - WHATSAPP ORDER CONFIRMATION REQUEST*

Hello Shop BD, please confirm my order:

📋 *CUSTOMER INFORMATION*
• *Name:* {customer_name}
• *Phone:* {phone}
• *Delivery Address:* {address}

📦 *ORDER DETAILS (ID: {order_id})*
{items}

💰 *PAYMENT & BILLING*
• *Product Price:* {subtotal}
• *Delivery Charge:* {delivery_charge}
• *Total Amount:* {total}
• *Payment Option:* WHATSAPP CONFIRM ORDER

✅ *CONFIRMATION REQUEST*
Please verify and confirm my order for delivery. Thank you!`,
  paymentWhatsAppNumber: '+8801700000000',
  paymentMessage: `Hello Shop BD, I want to confirm payment for my Order {order_id} (Total: ৳{total}). Please provide instructions.`,
  paymentInstructions: 'Send the payable amount to our official bKash/Nagad Merchant number and reply with the TrxID or screenshot.',
  paymentConfirmationText: 'Payment verification takes less than 15 minutes during business hours.'
};

export const initialProductShareSettings: ProductShareSettings = {
  domain: 'https://shopbd.top',
  baseDomain: 'https://shopbd.top',
  hashtags: '#ShopBD #OnlineShoppingBD #Authentic',
  defaultMessage: 'Check out {product_name} on Shop BD! Only ৳{price}. Authentic warranty with fast delivery in BD. Order here: {url}',
  shareMessageTemplate: 'Check out {product_name} on Shop BD! Only ৳{price}. Authentic warranty with fast delivery in BD. Order here: {url}'
};

export const initialWebsiteSections: WebsiteSection[] = [
  {
    id: 'sec-hero',
    name: 'Hero Slider & Banners',
    title: 'Top Promotional Banners',
    enabled: true,
    type: 'hero',
    sortOrder: 1
  },
  {
    id: 'sec-badges',
    name: 'Value Proposition Badges',
    title: 'Store Guarantee Badges',
    enabled: true,
    type: 'valueBadges',
    sortOrder: 2
  },
  {
    id: 'sec-flash',
    name: 'Flash Sale Deals',
    title: 'Midnight Flash Deals & Special Offers',
    subtitle: 'Hurry up! Special discounts available while stocks last. Stock updates in real time.',
    enabled: true,
    type: 'flashSale',
    sortOrder: 3
  },
  {
    id: 'sec-categories',
    name: 'Top Categories Grid',
    title: 'Featured Shopping Categories',
    enabled: true,
    type: 'categories',
    sortOrder: 4
  },
  {
    id: 'sec-trending',
    name: 'Trending Products',
    title: 'Trending in Bangladesh Today',
    subtitle: 'Most popular customer choices with verified high ratings',
    enabled: true,
    type: 'trending',
    sortOrder: 5
  },
  {
    id: 'sec-promo',
    name: 'Promotional Brand Banner',
    title: 'Eid Mega Savings Festival',
    subtitle: 'Get up to 50% discount on original Electronics & Fashion with fast 24h delivery.',
    enabled: true,
    type: 'promoBanner',
    promoImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80',
    promoLink: '/flash-sale',
    sortOrder: 6
  },
  {
    id: 'sec-new',
    name: 'New Arrivals',
    title: 'Fresh New Arrivals',
    subtitle: 'Just landed in our warehouse this week',
    enabled: true,
    type: 'newArrivals',
    sortOrder: 7
  },
  {
    id: 'sec-bestsellers',
    name: 'Best Selling Products',
    title: 'All-Time Best Sellers',
    subtitle: 'Top-rated by thousands of Bangladeshi shoppers',
    enabled: true,
    type: 'bestSellers',
    sortOrder: 8
  },
  {
    id: 'sec-reviews',
    name: 'Verified Customer Reviews',
    title: 'What Our Customers Say',
    subtitle: 'Real feedback from verified purchasers across Bangladesh',
    enabled: true,
    type: 'reviews',
    sortOrder: 9
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'coup-1',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minOrder: 1000,
    maxDiscount: 300,
    expiry: '2026-12-31',
    usageLimit: 500,
    timesUsed: 42,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'SHOPBD100',
    discountType: 'fixed',
    discountValue: 100,
    minOrder: 1500,
    expiry: '2026-12-31',
    usageLimit: 200,
    timesUsed: 18,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'DHAKAFAST',
    discountType: 'fixed',
    discountValue: 60,
    minOrder: 1200,
    expiry: '2026-11-30',
    usageLimit: 300,
    timesUsed: 12,
    isActive: true
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    productName: 'Haylou Solar Pro AMOLED Smartwatch with Bluetooth Calling',
    userId: 'user-101',
    userName: 'Tanvir Hossain',
    rating: 5,
    comment: 'Alhamdulillah, received within 24 hours in Mirpur, Dhaka! The AMOLED screen is bright outdoors and Bluetooth calling is super crisp. Great service by Shop BD!',
    isVerifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-08-25T14:20:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    productName: 'Anker Soundcore Life P2i True Wireless Earbuds with AI Call Enhancement',
    userId: 'user-102',
    userName: 'Nusrat Jahan',
    rating: 5,
    comment: 'Bass is really deep and mic quality is top notch in Dhaka traffic. Verified original product. Highly recommended seller!',
    isVerifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-08-22T09:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    productName: 'Premium Semi-Pure Cotton Jacquard Embroidered Men Panjabi',
    userId: 'user-103',
    userName: 'Mahmudur Rahman',
    rating: 4,
    comment: 'Fabric feels very premium and comfortable in hot weather. Size 42 fits me perfectly. Packaging was neat.',
    isVerifiedPurchase: true,
    status: 'approved',
    isFeatured: true,
    createdAt: '2026-08-28T18:00:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SBD-98214',
    userId: 'user-101',
    customerName: 'Tanvir Hossain',
    customerPhone: '01711223344',
    customerEmail: 'tanvir.bd@gmail.com',
    address: 'House 45, Road 7, Block B, Mirpur-10',
    district: 'Dhaka',
    area: 'Mirpur',
    deliveryMethod: 'INSIDE_DHAKA',
    deliveryCharge: 60,
    paymentMethod: 'BKASH',
    paymentStatus: 'PAID',
    transactionId: '9K8J7H6G5F',
    status: 'SHIPPED',
    subtotal: 2850,
    discount: 100,
    total: 2810,
    couponCode: 'SHOPBD100',
    items: [
      {
        productId: 'prod-1',
        name: 'Haylou Solar Pro AMOLED Smartwatch with Bluetooth Calling',
        price: 2850,
        quantity: 1,
        selectedColor: 'Midnight Black',
        selectedSize: 'Standard 22mm Strap',
        image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80'
      }
    ],
    orderNotes: 'Please call before delivery.',
    createdAt: '2026-08-29T10:30:00Z',
    statusTimeline: [
      { status: 'PENDING', timestamp: '2026-08-29T10:30:00Z', note: 'Order placed online' },
      { status: 'CONFIRMED', timestamp: '2026-08-29T11:00:00Z', note: 'bKash payment verified' },
      { status: 'PROCESSING', timestamp: '2026-08-29T13:45:00Z', note: 'Packed at Dhaka Hub' },
      { status: 'SHIPPED', timestamp: '2026-08-30T09:15:00Z', note: 'Handed over to RedX Courier rider' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'SBD-98215',
    userId: 'user-102',
    customerName: 'Nusrat Jahan',
    customerPhone: '01822334455',
    customerEmail: 'nusrat.ctg@yahoo.com',
    address: 'GEC Circle, Nasirabad',
    district: 'Chittagong',
    area: 'Nasirabad',
    deliveryMethod: 'OUTSIDE_DHAKA',
    deliveryCharge: 120,
    paymentMethod: 'CASH_ON_DELIVERY',
    paymentStatus: 'UNPAID',
    status: 'PROCESSING',
    subtotal: 1999,
    discount: 0,
    total: 2119,
    items: [
      {
        productId: 'prod-2',
        name: 'Anker Soundcore Life P2i True Wireless Earbuds',
        price: 1999,
        quantity: 1,
        selectedColor: 'Matte Black',
        selectedSize: 'S/M/L Tips Included',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80'
      }
    ],
    createdAt: '2026-08-30T14:15:00Z',
    statusTimeline: [
      { status: 'PENDING', timestamp: '2026-08-30T14:15:00Z', note: 'Order placed with Cash on Delivery' },
      { status: 'CONFIRMED', timestamp: '2026-08-30T15:00:00Z', note: 'Phone call verified with customer' },
      { status: 'PROCESSING', timestamp: '2026-08-30T16:30:00Z', note: 'Packaging underway' }
    ]
  }
];

export const bdDistricts = [
  'Dhaka', 'Chittagong', 'Gazipur', 'Narayanganj', 'Comilla', 'Sylhet', 
  'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Bogra', 
  'Cox\'s Bazar', 'Feni', 'Noakhali', 'Jessore', 'Tangail', 'Faridpur', 
  'Dinajpur', 'Kushtia', 'Pabna', 'Jamalpur', 'Brahmanbaria', 'Sirajganj'
];
