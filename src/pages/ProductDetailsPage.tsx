import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Check, 
  Plus, 
  Minus, 
  Package, 
  Clock, 
  MessageSquare,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { getProductColorVariants } from '../lib/productVariants';

interface ProductDetailsPageProps {
  productId: string;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ productId }) => {
  const { 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    navigateTo, 
    addRecentlyViewed, 
    reviews, 
    addReview, 
    currentUser,
    deliverySettings,
    openShareModal
  } = useShop();

  const product = products.find(p => 
    p.id === productId || 
    p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === productId.toLowerCase() ||
    p.sku?.toLowerCase() === productId.toLowerCase()
  ) || products[0];

  const variants = useMemo(() => (product ? getProductColorVariants(product) : []), [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'shipping' | 'reviews'>('description');
  
  // Review submission state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewerName, setNewReviewerName] = useState(currentUser?.displayName || '');
  const [isCopiedShare, setIsCopiedShare] = useState(false);

  // Set default variants when product changes (Default color & first image automatically selected!)
  useEffect(() => {
    if (product) {
      const vars = getProductColorVariants(product);
      if (vars.length > 0) {
        setSelectedColor(vars[0].name);
        setActiveImageIndex(0);
      }
      setSelectedSize(product.sizes?.length ? product.sizes[0] : '');
      setQuantity(1);
      addRecentlyViewed(product);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product not found</h2>
        <button onClick={() => navigateTo('shop')} className="mt-4 bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
          Back to Shop
        </button>
      </div>
    );
  }

  const isWished = isInWishlist(product.id);
  const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : product.discount || 0;

  // Filter reviews for this product
  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4);

  const activeVariant = variants.find(v => v.name.toLowerCase() === selectedColor.toLowerCase()) || variants[activeImageIndex] || variants[0];

  const handleSelectColor = (variantName: string) => {
    setSelectedColor(variantName);
    const matchedIdx = variants.findIndex(v => v.name.toLowerCase() === variantName.toLowerCase());
    if (matchedIdx !== -1) {
      setActiveImageIndex(matchedIdx);
    }
  };

  const handleSelectImageIndex = (idx: number) => {
    setActiveImageIndex(idx);
    if (variants[idx]) {
      setSelectedColor(variants[idx].name);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, activeVariant?.name, activeVariant?.image);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, activeVariant?.name, activeVariant?.image);
    navigateTo('checkout');
  };

  const handleShare = () => {
    if (product) {
      openShareModal(product);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    addReview({
      productId: product.id,
      productName: product.name,
      userId: currentUser?.id || `anon-${Date.now()}`,
      userName: newReviewerName.trim() || 'Verified Shopper',
      rating: newRating,
      comment: newComment.trim(),
      isVerifiedPurchase: true
    });

    setNewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto pb-1">
        <button onClick={() => navigateTo('home')} className="hover:text-rose-600 transition-colors">Home</button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button onClick={() => navigateTo('shop')} className="hover:text-rose-600 transition-colors">Shop</button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <button onClick={() => navigateTo('category', product.category)} className="hover:text-rose-600 transition-colors truncate">
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl bg-slate-100 overflow-hidden border border-slate-200/80 shadow-md">
            <img 
              src={getOptimizedImageUrl(variants[activeImageIndex]?.image || product.images[activeImageIndex] || product.images[0], { width: 800, height: 800 })} 
              alt={`${product.name} - ${variants[activeImageIndex]?.name || 'Preview'}`}
              className="w-full h-full object-cover object-center transition-all duration-300" 
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {hasDiscount && (
                <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
              {product.isFlashSale && (
                <span className="bg-amber-400 text-slate-900 text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
                  ⚡ FLASH SALE
                </span>
              )}
            </div>

            {/* Active Color Overlay Badge */}
            {variants[activeImageIndex] && (
              <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/20 shadow-md">
                <span 
                  className="w-3 h-3 rounded-full border border-white/40 shadow-xs" 
                  style={{ backgroundColor: variants[activeImageIndex].hex }}
                />
                <span>Showing: <strong className="font-bold text-rose-300">{variants[activeImageIndex].name}</strong></span>
              </div>
            )}

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                isWished ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails mapped 1-to-1 with variant colors */}
          {variants.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {variants.map((v, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectImageIndex(idx)}
                  className={`group relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx 
                      ? 'border-rose-600 scale-95 shadow-md ring-2 ring-rose-500/20' 
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'
                  }`}
                  title={`${v.name} - Click to switch color and image`}
                >
                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-xs text-[10px] text-white font-semibold text-center truncate px-1 py-0.5">
                    {v.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Actions (7 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div>
            
            {/* Brand, Category & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-rose-600 uppercase tracking-wider">{product.brand}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{product.category}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight mb-3">
              {product.name}
            </h1>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} 
                  />
                ))}
                <span className="text-xs font-bold text-slate-800 ml-1.5">{product.rating}</span>
              </div>
              <span className="text-xs text-slate-400">
                ({productReviews.length || product.reviewsCount} customer reviews)
              </span>
              <span className="text-slate-300">|</span>
              <span className={`text-xs font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price Box */}
            <div className="bg-rose-50/70 p-4 rounded-2xl border border-rose-100 mb-6 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-rose-600">
                ৳{currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    ৳{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    You Save ৳{(product.price - product.salePrice!).toLocaleString()} ({discountPercent}%)
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Variant: Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Size: <span className="text-rose-600">{selectedSize}</span>
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all ${
                        selectedSize === size
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant: Colors (Strict 1-to-1 connection with images) */}
            {variants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Color / Variant: <span className="text-rose-600 font-semibold">{selectedColor}</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {variants.length} {variants.length === 1 ? 'color' : 'colors'} available
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((variant) => {
                    const isSelected = selectedColor.toLowerCase() === variant.name.toLowerCase();
                    return (
                      <button
                        key={variant.name}
                        type="button"
                        onClick={() => handleSelectColor(variant.name)}
                        className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl border text-xs transition-all ${
                          isSelected
                            ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold shadow-xs ring-2 ring-rose-600/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-4 h-4 rounded-full border border-slate-300 shadow-xs shrink-0" 
                          style={{ backgroundColor: variant.hex }}
                        />
                        <img 
                          src={variant.image} 
                          alt="" 
                          className="w-5 h-5 rounded-md object-cover border border-slate-200" 
                        />
                        <span>{variant.name}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-rose-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 font-bold text-xs text-slate-800">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2.5 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={handleBuyNow}
                  className="bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl transition-all"
                >
                  Instant Buy Now (৳{(currentPrice * quantity).toLocaleString()})
                </button>
              </div>

              {/* Share & Wishlist Row */}
              <div className="flex items-center justify-between text-xs pt-2 text-slate-500">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isCopiedShare ? 'Link Copied to Clipboard!' : 'Share This Product'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="flex items-center gap-1.5 hover:text-rose-600 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'text-rose-600 fill-rose-600' : ''}`} />
                  <span>{isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Delivery & Trust Highlights Box */}
          <div className="mt-8 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <div>
                <span className="font-bold">Home Delivery:</span> Dhaka ৳{deliverySettings.insideDhakaFee} ({deliverySettings.insideDhakaTime}), Outside Dhaka ৳{deliverySettings.outsideDhakaFee} ({deliverySettings.outsideDhakaTime})
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">100% Authentic:</span> Guaranteed genuine product or 2x money back
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold">7 Days Return:</span> Hassle-free replacement for defective items
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Tabs: Description, Specs, Shipping, Reviews */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50">
          <button
            onClick={() => setActiveTab('description')}
            className={`px-6 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'description' 
                ? 'border-rose-600 text-rose-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Description & Key Features
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'specs' 
                ? 'border-rose-600 text-rose-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'shipping' 
                ? 'border-rose-600 text-rose-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Shipping & Returns
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'reviews' 
                ? 'border-rose-600 text-rose-600 bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({productReviews.length})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tab 1: Description */}
          {activeTab === 'description' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-2">Product Overview</h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Key Highlights:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specs */}
          {activeTab === 'specs' && (
            <div className="max-w-2xl">
              <h3 className="text-base font-bold text-slate-900 mb-4">Detailed Specifications</h3>
              {product.specifications ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs sm:text-sm">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="grid grid-cols-2 p-3">
                      <span className="font-semibold text-slate-600">{key}</span>
                      <span className="text-slate-900">{val}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {/* Tab 3: Shipping */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-slate-700 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">Delivery Nationwide in Bangladesh</h3>
              <p>
                We partner with leading courier services (Steadfast, RedX, Pathao, Paperfly) to ensure fast and safe parcel delivery across all 64 districts in Bangladesh.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Inside Dhaka Metro</h4>
                  <p className="text-xs text-slate-600">Charge: ৳{deliverySettings.insideDhakaFee}</p>
                  <p className="text-xs text-slate-600">Estimated Delivery: {deliverySettings.insideDhakaTime}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-1">Outside Dhaka (All BD Districts)</h4>
                  <p className="text-xs text-slate-600">Charge: ৳{deliverySettings.outsideDhakaFee}</p>
                  <p className="text-xs text-slate-600">Estimated Delivery: {deliverySettings.outsideDhakaTime}</p>
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-900 pt-3">7-Day Replacement Policy:</h4>
              <p className="text-xs text-slate-600">
                If the product is damaged, defective, or not as described, please record an unboxing video and notify our hotline within 48 hours for immediate replacement.
              </p>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              
              {/* Reviews Summary */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center sm:text-left">
                  <span className="text-4xl font-black text-slate-900">{product.rating}</span>
                  <div className="flex items-center text-amber-400 justify-center sm:justify-start my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">Based on {productReviews.length} verified ratings</span>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900">Customer Feedback</h4>
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to share your thoughts!</p>
                ) : (
                  productReviews.map(r => (
                    <div key={r.id} className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                            {r.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-slate-900">{r.userName}</span>
                          {r.isVerifiedPurchase && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < r.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{r.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Write a Review Form */}
              <div className="pt-6 border-t border-slate-200 max-w-xl">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Write a Customer Review</h4>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
                    <div className="flex items-center gap-1 text-2xl cursor-pointer">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className={star <= newRating ? 'text-amber-400' : 'text-slate-300'}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      placeholder="e.g. Asif Ahmed"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Review Comments</label>
                    <textarea 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                      placeholder="How was the product quality and packaging?"
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Similar Products You Might Like</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
