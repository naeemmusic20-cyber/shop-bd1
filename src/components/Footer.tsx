import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  CreditCard,
  Facebook,
  Instagram,
  Youtube,
  Send,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { websiteSettings, navigateTo, showToast, login, setIsSupportModalOpen } = useShop();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Subscribed to Shop BD newsletter with exclusive offers!', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 border-t border-slate-800">
      
      {/* Value Badges Banner */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 border-b border-slate-800 pb-12">
          
          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Delivery</h4>
              <p className="text-[11px] text-slate-400">24-48 hrs in Dhaka, 64 districts nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine</h4>
              <p className="text-[11px] text-slate-400">Authentic products with official warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">7 Days Return</h4>
              <p className="text-[11px] text-slate-400">Hassle-free replacement & refund policy</p>
            </div>
          </div>

          <div 
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-3 p-3 bg-slate-900/60 hover:bg-slate-900 rounded-xl border border-slate-800/80 hover:border-emerald-600/50 cursor-pointer transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>24/7 Support</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </h4>
              <p className="text-[11px] text-slate-400">WhatsApp, Messenger & Phone</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => navigateTo('home')}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              {(websiteSettings.footerLogo || websiteSettings.logoUrl) ? (
                <img 
                  src={websiteSettings.footerLogo || websiteSettings.logoUrl} 
                  alt={websiteSettings.footerName || websiteSettings.websiteName || 'Shop BD'} 
                  className="h-10 max-w-[160px] object-contain" 
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    <path d="M12 5V2.5a1.5 1.5 0 0 1 3 0V5" strokeWidth="1.8" />
                  </svg>
                </div>
              )}
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  {websiteSettings.footerName || websiteSettings.websiteName || 'Shop BD'}
                </span>
                <p className="text-[11px] text-slate-400 -mt-1">{websiteSettings.tagline}</p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {websiteSettings.footerAbout}
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{websiteSettings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{websiteSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{websiteSettings.email}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a 
                href={websiteSettings.facebookUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={websiteSettings.instagramUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={websiteSettings.youtubeUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href={`https://wa.me/${websiteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
              Explore Store
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-rose-400 transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('flash-sale')} className="hover:text-amber-400 text-amber-500 font-semibold transition-colors flex items-center gap-1">
                  <span>Flash Sale Deals 🔥</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('new-arrivals')} className="hover:text-rose-400 transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('trending')} className="hover:text-rose-400 transition-colors">
                  Trending Items
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('best-sellers')} className="hover:text-rose-400 transition-colors">
                  Best Sellers
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('collections')} className="hover:text-rose-400 transition-colors">
                  Featured Collections
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
              Customer Support
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-rose-400 transition-colors">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('my-orders')} className="hover:text-rose-400 transition-colors">
                  My Orders & Invoices
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('wishlist')} className="hover:text-rose-400 transition-colors">
                  My Wishlist
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('faq')} className="hover:text-rose-400 transition-colors">
                  FAQs & Help Center
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('support')} className="hover:text-rose-400 transition-colors">
                  Submit Support Ticket
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('contact')} className="hover:text-rose-400 transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('about')} className="hover:text-rose-400 transition-colors">
                  About NM Shop BD
                </button>
              </li>
            </ul>
          </div>

          {/* Policies & Legal */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-rose-500 pl-2">
              Policies & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigateTo('shipping-policy')} className="hover:text-rose-400 transition-colors">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('return-policy')} className="hover:text-rose-400 transition-colors">
                  Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('refund-policy')} className="hover:text-rose-400 transition-colors">
                  Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('cancellation-policy')} className="hover:text-rose-400 transition-colors">
                  Cancellation Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('terms')} className="hover:text-rose-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('privacy-policy')} className="hover:text-rose-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Subscribe for ৳100 Coupon
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input 
                  type="email" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="bg-slate-900 text-xs px-3 py-2 rounded-l-lg border border-slate-800 text-white outline-none w-full focus:border-rose-500"
                  required
                />
                <button 
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 rounded-r-lg text-xs font-semibold"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Gateway Badges & Copyright */}
      <div className="border-t border-slate-900 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span>© 2026 <strong>NM Shop BD</strong> (shopbd.top). All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Registered Bangladeshi E-Commerce Business</span>
          </div>

          {/* Payment Badges: Cash on Delivery, bKash, Nagad, Rocket, Cards */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] text-slate-400 mr-1 font-semibold uppercase">Accepted Payments:</span>
            
            <span className="bg-rose-950/80 text-rose-300 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-bold">
              bKash
            </span>
            <span className="bg-amber-950/80 text-amber-300 border border-amber-800/80 px-2 py-0.5 rounded text-[10px] font-bold">
              Nagad
            </span>
            <span className="bg-purple-950/80 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded text-[10px] font-bold">
              Rocket
            </span>
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-bold">
              Cash on Delivery (COD)
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
              Visa / Master
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};
