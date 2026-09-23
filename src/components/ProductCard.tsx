import React from 'react';
import { Heart, ShoppingCart, Star, Eye, Share2 } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { getOptimizedImageUrl } from '../lib/cloudinary';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { navigateTo, addToCart, toggleWishlist, isInWishlist, openShareModal } = useShop();

  const isWished = isInWishlist(product.id);
  const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.salePrice!) / product.price) * 100)
    : product.discount || 0;

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-rose-300 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image & Badges Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer" onClick={() => navigateTo('product', product.id)}>
        <img 
          src={getOptimizedImageUrl(product.images[0], { width: 500, height: 500, quality: 'auto' })} 
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out" 
        />

        {/* Badges: Discount, Flash Sale, Out of Stock */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              -{discountPercent}%
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
              <span>⚡ FLASH</span>
            </span>
          )}
          {product.isBestSeller && !product.isFlashSale && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Action Overlay: Wishlist, Quick View & Share */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
              isWished 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'
            }`}
            aria-label="Add to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
          </button>

          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openShareModal(product);
            }}
            className="w-8 h-8 rounded-full bg-white/95 text-slate-700 hover:bg-white hover:text-rose-600 flex items-center justify-center transition-all shadow-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
            aria-label="Share Product"
            title="Share on WhatsApp, Facebook, Messenger (Real Domain shopbd.top)"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {onQuickView && (
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600 flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
              aria-label="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400 mb-1">
            <span className="font-semibold text-rose-600 uppercase tracking-wider truncate">{product.brand}</span>
            <span className="truncate">{product.category}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => navigateTo('product', product.id)}
            className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 hover:text-rose-600 transition-colors cursor-pointer mb-1.5 leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-700 ml-1">{product.rating}</span>
            </div>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            {isLowStock && (
              <span className="ml-auto text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-rose-600">
                ৳{currentPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-medium">Inside Dhaka ৳60</span>
          </div>

          <button 
            type="button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all shadow-xs ${
              isOutOfStock 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white hover:shadow-md hover:shadow-rose-600/20'
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

      </div>

    </div>
  );
};
