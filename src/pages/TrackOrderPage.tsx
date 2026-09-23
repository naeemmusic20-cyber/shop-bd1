import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Phone, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';

interface TrackOrderPageProps {
  initialOrderNumber?: string;
}

const statusSteps: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'PENDING', label: 'Order Placed', description: 'Order details received and verified' },
  { key: 'CONFIRMED', label: 'Confirmed', description: 'Order confirmed with customer' },
  { key: 'PROCESSING', label: 'Packaging', description: 'Packed securely at Dhaka warehouse' },
  { key: 'SHIPPED', label: 'In Transit', description: 'Handed over to courier partner' },
  { key: 'DELIVERED', label: 'Delivered', description: 'Successfully handed over to customer' },
];

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderNumber }) => {
  const { orders, currentParam, websiteSettings } = useShop();

  const [query, setQuery] = useState(initialOrderNumber || currentParam || '');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search if param provided
  useEffect(() => {
    const q = initialOrderNumber || currentParam;
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [initialOrderNumber, currentParam]);

  const performSearch = (searchQuery: string) => {
    const clean = searchQuery.trim().toLowerCase();
    if (!clean) return;

    setHasSearched(true);
    const match = orders.find(
      o => o.orderNumber.toLowerCase() === clean || o.customerPhone.includes(clean)
    );
    setTrackedOrder(match || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'CANCELLED') return -1;
    const idx = statusSteps.findIndex(s => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = trackedOrder ? getStepIndex(trackedOrder.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
          <Truck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your Order ID (e.g. BD-1001) or 11-digit mobile phone number to check live shipping status.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-4 flex gap-2 max-w-md mx-auto">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order ID (BD-1001) or Mobile Phone"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm outline-none focus:border-rose-500 font-mono shadow-xs"
            required
          />
          <button 
            type="submit" 
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Track</span>
          </button>
        </form>
      </div>

      {/* Results View */}
      {trackedOrder ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
          
          {/* Header Details */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl font-black text-slate-900">{trackedOrder.orderNumber}</span>
                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold uppercase">
                  {trackedOrder.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Placed on {new Date(trackedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="text-slate-500">Total:</span>
              <p className="text-lg font-black text-rose-600">৳{trackedOrder.total.toLocaleString()}</p>
              <span className="text-[11px] text-slate-400 font-medium">({trackedOrder.paymentMethod.replace(/_/g, ' ')})</span>
            </div>
          </div>

          {/* Cancelled notice */}
          {trackedOrder.status === 'CANCELLED' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold">This order has been cancelled.</p>
                <p className="text-[11px] text-rose-600">If you believe this is an error, please reach out to our support hotline.</p>
              </div>
            </div>
          )}

          {/* Stepper Progress Bar */}
          {trackedOrder.status !== 'CANCELLED' && (
            <div className="py-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                {statusSteps.map((step, idx) => {
                  const isCompleted = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                        isCurrent
                          ? 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-md'
                          : isCompleted
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <h4 className={`text-xs font-bold ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                        {step.label}
                      </h4>
                      <p className="text-[10px] text-slate-400 max-w-[120px] mt-0.5 hidden sm:block">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Courier & Tracking Partner Info */}
          {trackedOrder.courierName && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Assigned Courier</span>
                <p className="font-bold text-slate-900 text-sm">{trackedOrder.courierName}</p>
                {trackedOrder.trackingNumber && (
                  <p className="font-mono text-slate-600">Tracking Code: {trackedOrder.trackingNumber}</p>
                )}
              </div>
              <div className="text-slate-500 text-[11px]">
                Your package is handled by {trackedOrder.courierName} express delivery.
              </div>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Order Items</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
              {trackedOrder.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center gap-3 bg-white">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Delivery Destination</span>
              <p className="font-bold text-slate-800">{trackedOrder.customerName}</p>
              <p className="text-slate-600 mt-0.5">{trackedOrder.address}, {trackedOrder.district}</p>
              <p className="text-slate-500 mt-1 font-mono">Mobile: {trackedOrder.customerPhone}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-slate-400 uppercase text-[10px] font-bold block mb-1">Need Assistance?</span>
              <p className="text-slate-700">If your package is delayed, reach our customer care desk:</p>
              <p className="font-bold text-rose-600 mt-1">Hotline: {websiteSettings.phone}</p>
              <p className="text-slate-500 text-[11px]">Email: {websiteSettings.email}</p>
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Order Found</h3>
          <p className="text-xs text-slate-500">
            We could not locate an order matching "{query}". Please verify your Order Reference number (e.g. BD-1001) or phone number.
          </p>
        </div>
      ) : null}

    </div>
  );
};
