import React from 'react';
import { 
  X, 
  MessageCircle, 
  MessageSquare, 
  PhoneCall, 
  Headphones, 
  ExternalLink,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SupportModal: React.FC = () => {
  const { 
    isSupportModalOpen, 
    setIsSupportModalOpen, 
    supportSettings, 
    websiteSettings 
  } = useShop();

  if (!isSupportModalOpen) return null;

  const { whatsapp, messenger, phone } = supportSettings;

  const waIcon = (whatsapp as any).logoUrl || whatsapp.icon;
  const msIcon = (messenger as any).logoUrl || messenger.icon;
  const phIcon = (phone as any).logoUrl || phone.icon;

  // Handle WhatsApp Click
  const handleWhatsAppClick = () => {
    const cleanNumber = whatsapp.number.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(whatsapp.message || 'Hello Shop BD Support team!');
    const url = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle Messenger Click
  const handleMessengerClick = () => {
    let url = messenger.link.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handle Phone Call Click
  const handlePhoneClick = () => {
    const cleanNumber = phone.number.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsSupportModalOpen(false)}
      />

      {/* Dialog Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 p-6 text-white relative">
          <button 
            type="button"
            onClick={() => setIsSupportModalOpen(false)}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-200 block">
                {websiteSettings.websiteName || 'Shop BD'} Help Desk
              </span>
              <h2 className="text-xl font-black text-white">Customer Support</h2>
            </div>
          </div>
          <p className="text-xs text-rose-100/90 leading-relaxed">
            How would you like to connect with us? Choose your preferred channel below:
          </p>
        </div>

        {/* EXACTLY 3 Support Options */}
        <div className="p-6 space-y-3.5">
          
          {/* 1. WhatsApp Support Option */}
          {whatsapp.enabled && (
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="w-full group p-4 rounded-2xl border-2 border-emerald-500/20 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 transition-all flex items-center justify-between text-left shadow-xs cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  {waIcon && (waIcon.startsWith('http') || waIcon.startsWith('/') || waIcon.startsWith('data:')) ? (
                    <img src={waIcon} alt="WhatsApp" className="w-7 h-7 object-contain rounded-lg" />
                  ) : (
                    <MessageCircle className="w-6 h-6 fill-current" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {whatsapp.name || 'WhatsApp Support'}
                    </span>
                    <span className="text-[9px] font-bold uppercase bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                      Fastest
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                    {whatsapp.number || '+880 1700-000000'}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Instant chat & order queries
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shrink-0 shadow-xs border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </button>
          )}

          {/* 2. Messenger Support Option */}
          {messenger.enabled && (
            <button
              type="button"
              onClick={handleMessengerClick}
              className="w-full group p-4 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 transition-all flex items-center justify-between text-left shadow-xs cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                  {msIcon && (msIcon.startsWith('http') || msIcon.startsWith('/') || msIcon.startsWith('data:')) ? (
                    <img src={msIcon} alt="Messenger" className="w-7 h-7 object-contain rounded-lg" />
                  ) : (
                    <MessageSquare className="w-6 h-6 fill-current" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                      {messenger.name || 'Messenger Support'}
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                    Facebook Live Messenger
                  </p>
                  <p className="text-[10px] text-blue-600 font-medium">
                    Chat with our official page
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center shrink-0 shadow-xs border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </button>
          )}

          {/* 3. Phone Call Support Option */}
          {phone.enabled && (
            <button
              type="button"
              onClick={handlePhoneClick}
              className="w-full group p-4 rounded-2xl border-2 border-rose-500/20 hover:border-rose-500 bg-rose-50/40 hover:bg-rose-50 transition-all flex items-center justify-between text-left shadow-xs cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-600/20 group-hover:scale-105 transition-transform">
                  {phIcon && (phIcon.startsWith('http') || phIcon.startsWith('/') || phIcon.startsWith('data:')) ? (
                    <img src={phIcon} alt="Phone" className="w-7 h-7 object-contain rounded-lg" />
                  ) : (
                    <PhoneCall className="w-6 h-6" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 group-hover:text-rose-700 transition-colors">
                      {phone.name || 'Phone Call'}
                    </span>
                    <span className="text-[9px] font-bold uppercase bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded-full">
                      Toll Free
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                    {phone.number || '+880 1700-000000'}
                  </p>
                  <p className="text-[10px] text-rose-600 font-medium">
                    Speak directly with representative
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-xs border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <PhoneCall className="w-3.5 h-3.5" />
              </div>
            </button>
          )}

          {/* Footer note */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Available 9:00 AM - 11:00 PM</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified NM Support</span>
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
