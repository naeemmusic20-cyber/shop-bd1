import React from 'react';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  ArrowRight, 
  Copy, 
  Check, 
  Phone, 
  MapPin, 
  CreditCard 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface OrderSuccessPageProps {
  orderNumber: string;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderNumber }) => {
  const { orders, navigateTo, websiteSettings, deliverySettings } = useShop();
  const [isCopied, setIsCopied] = React.useState(false);

  const order = orders.find(o => o.orderNumber === orderNumber) || orders[0];

  const handleCopyOrderNumber = () => {
    if (order?.orderNumber) {
      navigator.clipboard?.writeText(order.orderNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>
        <button onClick={() => navigateTo('home')} className="mt-4 bg-rose-600 text-white px-5 py-2 rounded-xl text-xs font-bold">
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 sm:py-16">
      
      {/* Success Badge Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl text-center space-y-4">
        
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 mx-auto flex items-center justify-center animate-bounce">
          <CheckCircle className="w-12 h-12" />
        </div>

        <div>
          <span className="text-xs font-black text-rose-600 uppercase tracking-widest">
            NM Shop BD • Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            We have received your order. Our logistics team is preparing your package for dispatch.
          </p>
        </div>

        {/* Order Number Box */}
        <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
          <span className="text-xs text-slate-500">Order Reference:</span>
          <span className="font-mono text-base font-black text-slate-900">{order.orderNumber}</span>
          <button
            type="button"
            onClick={handleCopyOrderNumber}
            className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
            title="Copy Order ID"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Realtime Order Tracker Summary */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl text-left space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] text-slate-400">Live Status:</span>
              <p className="text-sm font-black text-amber-400 uppercase tracking-wider">{order.status}</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Payment:</span>
              <p className="text-xs font-bold text-white uppercase">{order.paymentMethod.replace(/_/g, ' ')} ({order.paymentStatus})</p>
            </div>
            <div>
              <span className="text-[11px] text-slate-400">Estimated Delivery:</span>
              <p className="text-xs font-bold text-emerald-400">
                {order.deliveryMethod === 'INSIDE_DHAKA' ? deliverySettings.insideDhakaTime : deliverySettings.outsideDhakaTime}
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Shipping Destination:
              </p>
              <p className="font-semibold text-slate-200">{order.customerName}</p>
              <p className="text-slate-300">{order.address}, {order.area}, {order.district}</p>
              <p className="text-slate-400 mt-1 font-mono">Mobile: {order.customerPhone}</p>
            </div>

            <div>
              <p className="text-slate-400 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" /> Payment Summary:
              </p>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{order.subtotal.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span>-৳{order.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span>৳{order.deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1 border-t border-slate-800">
                  <span>Total Amount:</span>
                  <span className="text-rose-400">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigateTo('track-order', order.orderNumber)}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-rose-600/20"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('shop')}
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-6 py-3 rounded-xl transition-all"
          >
            Continue Shopping
          </button>
        </div>

        <div className="text-xs text-slate-400 pt-2">
          Questions regarding your shipment? Call our helpline: <strong className="text-slate-700">{websiteSettings.phone}</strong>
        </div>

      </div>

    </div>
  );
};
