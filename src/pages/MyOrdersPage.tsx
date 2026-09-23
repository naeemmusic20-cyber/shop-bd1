import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  ExternalLink, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { OrderStatus } from '../types';

export const MyOrdersPage: React.FC = () => {
  const { orders, currentUser, navigateTo, addToCart, products } = useShop();

  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter orders for current user or all local orders if guest
  const userOrders = currentUser 
    ? orders.filter(o => o.userId === currentUser.id || o.customerPhone === currentUser.phoneNumber)
    : orders;

  const filteredOrders = userOrders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleReorder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        addToCart(prod, item.quantity, item.selectedSize, item.selectedColor);
      }
    });

    navigateTo('cart');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Orders & Invoices</h1>
          <p className="text-xs text-slate-500">
            Track, reorder and inspect your purchase history across Bangladesh
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs pb-1">
          {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-full capitalize font-semibold transition-all whitespace-nowrap ${
                filterStatus === st 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              You haven't placed any orders matching this status yet.
            </p>
          </div>
          <button
            onClick={() => navigateTo('shop')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 hover:border-rose-300 transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-slate-900">{order.orderNumber}</span>
                  <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                    order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'SHIPPED' ? 'bg-sky-100 text-sky-700' :
                    order.status === 'PROCESSING' ? 'bg-amber-100 text-amber-700' :
                    order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="font-bold text-slate-900">৳{order.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Items in order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`}
                      </p>
                      <span className="font-bold text-rose-600">৳{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span className="font-semibold text-slate-700">Ship to: </span>
                  {order.customerName} ({order.district})
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigateTo('track-order', order.orderNumber)}
                    className="flex-1 sm:flex-none bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold px-4 py-2 rounded-xl border border-rose-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Parcel</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleReorder(order.id)}
                    className="flex-1 sm:flex-none bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
