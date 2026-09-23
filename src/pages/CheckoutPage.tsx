import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  MapPin,
  Phone,
  User,
  Mail,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod } from '../types';
import { bdDistricts } from '../data/initialData';
import { generateWhatsAppOrderMessage } from '../lib/productVariants';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    cartSubtotal, 
    appliedCoupon, 
    couponDiscount, 
    deliverySettings, 
    paymentSettings,
    whatsappOrderSettings,
    createOrder, 
    navigateTo, 
    currentUser,
    showToast 
  } = useShop();

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneNumber || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState(
    currentUser?.addresses?.[0]?.address || ''
  );
  const [district, setDistrict] = useState(
    currentUser?.addresses?.[0]?.district || 'Dhaka'
  );
  const [area, setArea] = useState(
    currentUser?.addresses?.[0]?.area || ''
  );
  const [deliveryMethod, setDeliveryMethod] = useState<'INSIDE_DHAKA' | 'OUTSIDE_DHAKA'>(
    district.toLowerCase().includes('dhaka') ? 'INSIDE_DHAKA' : 'OUTSIDE_DHAKA'
  );
  // STRICT REQUIREMENT: Only 2 options (WhatsApp Confirm Order or Cash On Delivery)
  const [paymentMethod, setPaymentMethod] = useState<'WHATSAPP_CONFIRM' | 'CASH_ON_DELIVERY'>('WHATSAPP_CONFIRM');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-switch delivery method when district changes
  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    if (d === 'Dhaka') {
      setDeliveryMethod('INSIDE_DHAKA');
    } else {
      setDeliveryMethod('OUTSIDE_DHAKA');
    }
  };

  const deliveryCharge = 
    cartSubtotal >= deliverySettings.freeDeliveryThreshold 
      ? 0 
      : deliveryMethod === 'INSIDE_DHAKA' 
        ? deliverySettings.insideDhakaFee 
        : deliverySettings.outsideDhakaFee;

  const grandTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryCharge);

  if (cart.length === 0) {
    navigateTo('cart');
    return null;
  }

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!customerName.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }

    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      showToast('Please enter a valid 11-digit Bangladeshi mobile number (01XXXXXXXXX)', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please provide your complete delivery address', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const order = createOrder({
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        address: address.trim(),
        district,
        area: area.trim() || district,
        deliveryMethod,
        paymentMethod: paymentMethod === 'WHATSAPP_CONFIRM' ? 'WHATSAPP_CONFIRM' : 'CASH_ON_DELIVERY',
        orderNotes: orderNotes.trim() || undefined
      });

      // OPTION 1: WHATSAPP CONFIRM ORDER - Open WhatsApp with admin number and formatted template
      if (paymentMethod === 'WHATSAPP_CONFIRM') {
        const message = generateWhatsAppOrderMessage(
          order,
          whatsappOrderSettings?.orderConfirmationTemplate || whatsappOrderSettings?.messageTemplate
        );
        const targetNumber = (
          whatsappOrderSettings?.whatsappNumber || 
          paymentSettings?.whatsappPaymentNumber || 
          '+8801700000000'
        ).replace(/[^0-9]/g, '');

        const waUrl = `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
        try {
          window.open(waUrl, '_blank');
        } catch {
          // Handled if browser restricts popups
        }
      }

      // Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }

      showToast(`Order #${order.orderNumber} placed successfully!`, 'success');
      navigateTo('order-success', order.orderNumber);
    } catch (err: any) {
      showToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        <p className="text-xs text-slate-500">Provide shipping details and select your preferred payment method</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form: Delivery & Payment (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Customer Information Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-rose-600" />
              <span>1. Contact & Customer Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Asif Mahmud"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Active for SMS/Delivery) <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="tel" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Optional, for invoices)
              </label>
              <input 
                type="email" 
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>2. Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District <span className="text-rose-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500 bg-white"
                >
                  {bdDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Area / Thana / Sub-district <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Dhanmondi, Gulshan, Mirpur"
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address, House & Road No. <span className="text-rose-500">*</span>
              </label>
              <textarea 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="e.g. House 14, Road 5, Block C, Apt 3B"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                required
              />
            </div>

            {/* Delivery Method Radios */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Delivery Service Option</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'INSIDE_DHAKA'
                    ? 'border-rose-600 bg-rose-50/60 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}>
                  <input 
                    type="radio" 
                    name="deliveryMethod"
                    checked={deliveryMethod === 'INSIDE_DHAKA'}
                    onChange={() => setDeliveryMethod('INSIDE_DHAKA')}
                    className="mt-0.5 accent-rose-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Inside Dhaka (৳{deliverySettings.insideDhakaFee})</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{deliverySettings.insideDhakaTime}</p>
                  </div>
                </label>

                <label className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'OUTSIDE_DHAKA'
                    ? 'border-rose-600 bg-rose-50/60 text-slate-900 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}>
                  <input 
                    type="radio" 
                    name="deliveryMethod"
                    checked={deliveryMethod === 'OUTSIDE_DHAKA'}
                    onChange={() => setDeliveryMethod('OUTSIDE_DHAKA')}
                    className="mt-0.5 accent-rose-600"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">Outside Dhaka (৳{deliverySettings.outsideDhakaFee})</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{deliverySettings.outsideDhakaTime}</p>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Order Notes / Special Delivery Instructions (Optional)
              </label>
              <input 
                type="text" 
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="e.g. Please deliver after 3 PM or call security guard"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Payment Method Selector (EXACTLY TWO OPTIONS: WhatsApp Confirm Order & Cash on Delivery) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>3. Payment / Order Option</span>
              </h2>
              <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                2 options available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* OPTION 1: WHATSAPP CONFIRM ORDER */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden ${
                paymentMethod === 'WHATSAPP_CONFIRM'
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod"
                  checked={paymentMethod === 'WHATSAPP_CONFIRM'}
                  onChange={() => setPaymentMethod('WHATSAPP_CONFIRM')}
                  className="mt-1 accent-emerald-600 w-4 h-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-emerald-950 uppercase tracking-tight">
                      WHATSAPP CONFIRM ORDER
                    </span>
                    <span className="text-[9px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full tracking-wide">
                      RECOMMENDED
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800/90 mt-1 leading-snug">
                    Confirm instantly with our official Admin WhatsApp desk.
                  </p>
                  <p className="text-[10px] text-emerald-700/80 mt-1 font-mono">
                    Desk: {whatsappOrderSettings?.whatsappNumber || paymentSettings?.whatsappPaymentNumber || '+8801700000000'}
                  </p>
                </div>
              </label>

              {/* OPTION 2: CASH ON DELIVERY */}
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden ${
                paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'border-rose-600 bg-rose-50/70 shadow-sm ring-2 ring-rose-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}>
                <input 
                  type="radio" 
                  name="paymentMethod"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="mt-1 accent-rose-600 w-4 h-4 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">
                      CASH ON DELIVERY
                    </span>
                    <span className="text-[9px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
                      STANDARD
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    Pay with cash when your package arrives at your door.
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Direct order placement, no advance required.
                  </p>
                </div>
              </label>
            </div>

            {/* Option Details Card */}
            {paymentMethod === 'WHATSAPP_CONFIRM' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-2 text-emerald-950">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>How WhatsApp Confirm Order Works</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-900/90">
                  When you submit, your order is generated and WhatsApp will automatically open with your message prepared:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] bg-white/70 p-2.5 rounded-xl border border-emerald-100 font-medium">
                  <div className="flex items-center gap-1 text-emerald-800">• Customer Name</div>
                  <div className="flex items-center gap-1 text-emerald-800">• Phone Number</div>
                  <div className="flex items-center gap-1 text-emerald-800">• Full Address</div>
                  <div className="flex items-center gap-1 text-emerald-800">• Order ID</div>
                  <div className="flex items-center gap-1 text-emerald-800">• Color/Variants</div>
                  <div className="flex items-center gap-1 text-emerald-800">• Total Amount</div>
                </div>
                <p className="text-[10px] text-emerald-700 italic">
                  Controlled directly by Shop BD Admin WhatsApp Desk ({whatsappOrderSettings?.whatsappNumber || '+8801700000000'}).
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-1.5 text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-rose-600" />
                  <span>Cash on Delivery Verification</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Your order is placed directly into our system. Our team will verify your address and dispatch your package immediately. You can pay cash upon receiving the package.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Right Summary: Items & Total (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-base font-black text-slate-900 pb-3 border-b border-slate-100">
              Order Breakdown ({cart.length} items)
            </h2>

            {/* Mini Items List */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map((item, idx) => {
                const itemPrice = item.salePrice && item.salePrice > 0 ? item.salePrice : item.price;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}</p>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">৳{(itemPrice * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900">৳{cartSubtotal.toLocaleString()}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon ({appliedCoupon?.code}):</span>
                  <span>-৳{couponDiscount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold text-slate-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `৳${deliveryCharge.toLocaleString()}`}
                </span>
              </div>

              <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="text-rose-600">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Confirm Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-black text-sm py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-98 ${
                paymentMethod === 'WHATSAPP_CONFIRM'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
              }`}
            >
              {isSubmitting ? (
                <span>Placing Order...</span>
              ) : paymentMethod === 'WHATSAPP_CONFIRM' ? (
                <>
                  <MessageCircle className="w-4 h-4" />
                  <span>WHATSAPP CONFIRM ORDER (৳{grandTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  <Truck className="w-4 h-4" />
                  <span>CASH ON DELIVERY ORDER (৳{grandTotal.toLocaleString()})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="space-y-2 text-[11px] text-slate-500 pt-1">
              <p className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>By placing order, you agree to NM Shop BD Terms and Policies</span>
              </p>
              <p className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>Our representative may call to verify your address</span>
              </p>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
};
