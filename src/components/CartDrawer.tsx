import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    deliverySettings,
    navigateTo
  } = useShop();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = deliverySettings.freeDeliveryThreshold;
  const remainingForFreeShipping = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold">Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)})</h2>
            </div>
            <button 
              type="button"
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-rose-50/80 p-3 border-b border-rose-100">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
              <span>
                {remainingForFreeShipping === 0 
                  ? '🎉 Congratulations! You unlocked FREE Delivery!' 
                  : `Add ৳${remainingForFreeShipping.toLocaleString()} more for FREE Delivery`}
              </span>
              <span className="text-rose-600 font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-rose-200/60 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-rose-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('shop');
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item, idx) => {
                const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={`${item.productId}-${item.selectedSize}-${item.selectedColor}-${idx}`} className="flex gap-3 pb-4 border-b border-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-18 h-18 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                            className="text-slate-400 hover:text-rose-600 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 mt-0.5">
                          {item.selectedSize && <span className="bg-slate-100 px-1.5 py-0.5 rounded">Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span className="bg-slate-100 px-1.5 py-0.5 rounded">Color: {item.selectedColor}</span>}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedColor)}
                            className="p-1 hover:bg-slate-200 text-slate-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-rose-600">
                            ৳{(itemPrice * item.quantity).toLocaleString()}
                          </span>
                          {item.quantity > 1 && (
                            <span className="block text-[10px] text-slate-400">
                              (৳{itemPrice.toLocaleString()} each)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
                <span>Subtotal:</span>
                <span className="text-base font-bold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-slate-500">Taxes and delivery charges calculated at checkout.</p>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('cart');
                  }}
                  className="w-full bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs py-2.5 rounded-xl border border-slate-300 transition-colors"
                >
                  View Cart
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigateTo('checkout');
                  }}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
