import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Facebook, 
  MessageSquare,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ProductShareModal: React.FC = () => {
  const { 
    isShareModalOpen, 
    closeShareModal, 
    sharingProduct, 
    productShareSettings,
    showToast 
  } = useShop();

  const [copied, setCopied] = useState(false);

  if (!isShareModalOpen || !sharingProduct) return null;

  // Real SHOP BD Domain (Strict requirement: always https://shopbd.top/ and NEVER localhost/preview/firebase)
  const baseDomain = (productShareSettings.domain || 'https://shopbd.top').replace(/\/+$/, '');
  
  // Format clean product URL on the real domain
  const productSlug = sharingProduct.id;
  const shareUrl = `${baseDomain}/product/${productSlug}`;

  const currentPrice = sharingProduct.salePrice && sharingProduct.salePrice > 0 
    ? sharingProduct.salePrice 
    : sharingProduct.price;

  // Prepared share message using admin template
  const rawTemplate = productShareSettings.shareMessageTemplate || 'Check out {product_name} on Shop BD! Only ৳{price}. Order here: {url}';
  const shareMessage = rawTemplate
    .replace('{product_name}', sharingProduct.name)
    .replace('{price}', currentPrice.toLocaleString())
    .replace('{url}', shareUrl);

  // Copy Link Handler
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      showToast('Real Shop BD link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  // WhatsApp Share Handler
  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Facebook Share Handler
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  // Messenger Share Handler
  const handleMessengerShare = () => {
    // Open Messenger dialog or mobile protocol
    const url = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeShareModal}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900">Share This Product</h2>
              <p className="text-[11px] text-slate-400">Share with family & friends across Bangladesh</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={closeShareModal}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Mini Preview */}
        <div className="p-5 pb-2">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <img 
              src={sharingProduct.images[0]} 
              alt={sharingProduct.name} 
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 block">
                {sharingProduct.brand}
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">{sharingProduct.name}</p>
              <p className="text-xs font-extrabold text-slate-900 mt-0.5">
                ৳{currentPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* 4 Share Options */}
        <div className="p-5 space-y-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Choose Platform
          </label>

          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. WhatsApp */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/70 text-slate-800 flex flex-col items-center gap-1.5 transition-all active:scale-95 shadow-2xs group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold">WhatsApp</span>
            </button>

            {/* 2. Messenger */}
            <button
              type="button"
              onClick={handleMessengerShare}
              className="p-3 rounded-2xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/70 text-slate-800 flex flex-col items-center gap-1.5 transition-all active:scale-95 shadow-2xs group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold">Messenger</span>
            </button>

            {/* 3. Facebook */}
            <button
              type="button"
              onClick={handleFacebookShare}
              className="p-3 rounded-2xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 text-slate-800 flex flex-col items-center gap-1.5 transition-all active:scale-95 shadow-2xs group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Facebook className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xs font-bold">Facebook</span>
            </button>
          </div>

          {/* 4. Copy Link (With Strict Real Domain Display) */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Official Shop BD Link
            </label>
            <div className="flex items-center gap-2 p-1.5 pl-3 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-600 font-mono truncate flex-1 select-all">
                {shareUrl}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-rose-600 hover:bg-rose-700 active:scale-95 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Uses real domain <span className="font-semibold text-slate-600">https://shopbd.top</span> verified by Shop BD</span>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
