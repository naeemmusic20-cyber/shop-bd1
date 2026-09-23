import React from 'react';
import { Heart, Trash2, ShoppingCart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, clearWishlist, navigateTo, addToCart, products, removeFromWishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Your Wishlist is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
          Explore our trending gadgets and collections, then tap the heart icon to save your favorite items!
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-rose-600/20"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
          <p className="text-xs text-slate-500">You have {wishlist.length} saved items</p>
        </div>

        <button
          onClick={clearWishlist}
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Wishlist</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map(item => {
          const prod = products.find(p => p.id === item.productId);
          if (prod) {
            return <ProductCard key={prod.id} product={prod} />;
          }

          // Fallback if product not in immediate local array
          return (
            <div key={item.productId} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
              <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-xl" />
              <div>
                <p className="font-bold text-xs text-slate-900 line-clamp-1">{item.name}</p>
                <p className="font-black text-rose-600 text-sm mt-1">৳{(item.salePrice || item.price).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => removeFromWishlist(item.productId)}
                  className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
