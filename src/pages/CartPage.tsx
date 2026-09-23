import React, { useState } from 'react';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Tag, 
  Check, 
  ShieldCheck, 
  Truck 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    cartSubtotal, 
    appliedCoupon, 
    couponDiscount, 
    applyCoupon, 
    removeCoupon, 
    deliverySettings, 
    navigateTo 
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [selectedZone, setSelectedZone] = useState<'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'>('INSIDE_DHAKA');

  const deliveryCharge = 
    cartSubtotal >= deliverySettings.freeDeliveryThreshold 
      ? 0 
      : selectedZone === 'INSIDE_DHAKA' 
        ? deliverySettings.insideDhakaFee 
        : deliverySettings.outsideDhakaFee;

  const grandTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);
  const remainingForFreeShipping = Math.max(0, deliverySettings.freeDeliveryThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput.trim());
    setCouponCodeInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2">Your Shopping Cart is Empty</h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Looks like you haven't added any products to your cart yet. Explore our flash deals and collections!
        </p>
        <button
          onClick={() => navigateTo('shop')}
          className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-rose-600/20"
        >
          Explore Shop BD
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500">You have {cart.reduce((s, i) => s + i.quantity, 0)} items in your cart</p>
        </div>
        <button 
          onClick={clearCart} 
          className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Items (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Free Shipping Alert Bar */}
          <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {remainingForFreeShipping === 0 
                  ? '🎉 Free Shipping activated for this order!' 
                  : `Add ৳${remainingForFreeShipping.toLocaleString()} more to unlock FREE Delivery!`}
              </span>
            </div>
            <button onClick={() => navigateTo('shop')} className="font-bold text-rose-600 hover:underline">
              Add More
            </button>
          </div>

          {/* Cart Table */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
            {cart.map((item, index) => {
              const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
              return (
                <div key={`${item.productId}-${index}`} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-slate-200 bg-slate-50 shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 
                      onClick={() => navigateTo('product', item.productId)}
                      className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      {item.selectedSize && <span className="bg-slate-100 px-2 py-0.5 rounded">Size: {item.selectedSize}</span>}
                      {item.selectedColor && <span className="bg-slate-100 px-2 py-0.5 rounded">Color: {item.selectedColor}</span>}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs font-bold text-rose-600">৳{itemPrice.toLocaleString()}</span>
                      {item.price > itemPrice && (
                        <span className="text-[10px] text-slate-400 line-through">৳{item.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedColor)}
                        className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-800">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedColor)}
                        className="p-2 text-slate-600 hover:bg-slate-200 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right sm:min-w-[90px]">
                      <span className="text-sm font-black text-slate-900 block">
                        ৳{(itemPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId, item.selectedSize, item.selectedColor)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-2"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-slate-700 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </button>
          </div>

        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h2>

            {/* Delivery Location Selector Preview */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Delivery Destination:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedZone('INSIDE_DHAKA')}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    selectedZone === 'INSIDE_DHAKA'
                      ? 'border-rose-600 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <p>Inside Dhaka</p>
                  <span className="text-[10px] text-slate-500 font-normal">৳{deliverySettings.insideDhakaFee} (24-48h)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedZone('OUTSIDE_DHAKA')}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                    selectedZone === 'OUTSIDE_DHAKA'
                      ? 'border-rose-600 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  <p>Outside Dhaka</p>
                  <span className="text-[10px] text-slate-500 font-normal">৳{deliverySettings.outsideDhakaFee} (48-72h)</span>
                </button>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="pt-2 border-t border-slate-100">
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-800 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Coupon: {appliedCoupon.code}
                    </span>
                    <span className="text-[11px] text-emerald-600 block">
                      Saved ৳{couponDiscount.toLocaleString()}
                    </span>
                  </div>
                  <button 
                    onClick={removeCoupon} 
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input 
                    type="text" 
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    placeholder="Enter coupon code (e.g. WELCOME10)" 
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-rose-500 uppercase"
                  />
                  <button 
                    type="submit" 
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Delivery Charge:</span>
                <span className="font-bold text-slate-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `৳${deliveryCharge.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-rose-600">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              type="button"
              onClick={() => navigateTo('checkout')}
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-sm py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Safe & Secure 256-bit SSL Checkout</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
