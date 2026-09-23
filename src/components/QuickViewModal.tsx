import React, { useState, useMemo, useEffect } from 'react';
import { X, Heart, Star, Check, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';
import { getProductColorVariants } from '../lib/productVariants';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInWishlist, navigateTo } = useShop();

  const variants = useMemo(() => (product ? getProductColorVariants(product) : []), [product]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      const vars = getProductColorVariants(product);
      if (vars.length > 0) {
        setSelectedColor(vars[0].name);
        setActiveImageIndex(0);
      }
      setSelectedSize(product.sizes?.length ? product.sizes[0] : '');
      setQuantity(1);
    }
  }, [product?.id]);

  if (!product) return null;

  const isWished = isInWishlist(product.id);
  const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

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
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, activeVariant?.name, activeVariant?.image);
    onClose();
    navigateTo('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 overflow-hidden max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                <img 
                  src={getOptimizedImageUrl(variants[activeImageIndex]?.image || product.images[activeImageIndex] || product.images[0], { width: 600, height: 600 })} 
                  alt={`${product.name} - ${variants[activeImageIndex]?.name || 'Preview'}`}
                  className="w-full h-full object-cover" 
                />
              </div>

              {variants.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {variants.map((v, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectImageIndex(i)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === i ? 'border-rose-600 scale-95 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                      title={v.name}
                    >
                      <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white font-medium text-center truncate px-1 py-0.5">
                        {v.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          {/* Product Details & Selection */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-rose-600 font-bold uppercase tracking-wider mb-1">
                <span>{product.brand}</span>
                <span>•</span>
                <span className="text-slate-400 font-normal">{product.category}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-slate-800 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-slate-400">({product.reviewsCount} customer reviews)</span>
                <span className="text-xs text-slate-300">|</span>
                <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4 p-3 bg-rose-50/50 rounded-xl">
                <span className="text-2xl font-black text-rose-600">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-slate-400 line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded-full">
                      Save {product.discount || Math.round(((product.price - product.salePrice!) / product.price) * 100)}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Select Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                          selectedSize === size
                            ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selection */}
              {variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Color: <span className="text-rose-600 font-semibold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {variants.map(variant => (
                      <button
                        key={variant.name}
                        type="button"
                        onClick={() => handleSelectColor(variant.name)}
                        className={`group flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                          selectedColor.toLowerCase() === variant.name.toLowerCase()
                            ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold shadow-xs'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0" 
                          style={{ backgroundColor: variant.hex }}
                        />
                        <span>{variant.name}</span>
                        {selectedColor.toLowerCase() === variant.name.toLowerCase() && (
                          <Check className="w-3 h-3 text-rose-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 font-bold text-xs text-slate-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-3 rounded-xl border transition-all ${
                    isWished 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'border-slate-200 text-slate-700 hover:border-rose-300'
                  }`}
                  title="Add to Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={handleBuyNow}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all"
              >
                Instant Buy Now (৳{(currentPrice * quantity).toLocaleString()})
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigateTo('product', product.id);
                }}
                className="w-full text-center text-xs text-slate-500 hover:text-rose-600 font-medium pt-1"
              >
                View Full Product Details & Specifications →
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
