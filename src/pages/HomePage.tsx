import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft, 
  Clock, 
  TrendingUp, 
  Award, 
  Percent, 
  ShieldCheck, 
  Truck,
  Heart,
  Tag
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { 
    banners, 
    categories, 
    products, 
    flashSale, 
    recentlyViewed, 
    navigateTo,
    reviews,
    websiteSections
  } = useShop();

  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active hero banners
  const heroBanners = banners.filter(b => b.isActive && (b.type === 'hero' || b.type === 'slider'));

  // Auto rotate banners
  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIdx(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  // Flash Sale countdown timer
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 23,
    minutes: 45,
    seconds: 12
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(flashSale.endDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60))),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [flashSale.endDate]);

  // Filtered product groups
  const flashSaleProducts = products.filter(p => p.isFlashSale || flashSale.productIds.includes(p.id));
  const trendingProducts = products.filter(p => p.isTrending);
  const newArrivals = [...products].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);
  const bestSellers = products.filter(p => p.isBestSeller);
  const featuredReviews = reviews.filter(r => r.isFeatured && r.status === 'approved');

  const isSectionEnabled = (id: string) => {
    const sec = websiteSections?.find(s => s.id === id);
    return sec ? sec.enabled : true;
  };

  const getSection = (id: string) => {
    return websiteSections?.find(s => s.id === id);
  };

  const customSections = websiteSections?.filter(s => 
    s.enabled && !['hero-slider', 'categories', 'flash-sale', 'trending', 'promo-banners', 'new-arrivals', 'best-sellers', 'reviews'].includes(s.id)
  ) || [];

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      
      {/* 1. Hero Banner Slider */}
      {isSectionEnabled('hero-slider') && heroBanners.length > 0 && (
        <section className="relative overflow-hidden bg-slate-900">
          <div className="relative h-[280px] sm:h-[400px] md:h-[480px] w-full max-w-7xl mx-auto">
            {heroBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                index === activeBannerIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="w-full h-full object-cover object-center" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent flex items-center">
                <div className="max-w-xl px-6 sm:px-12 text-white space-y-3 sm:space-y-4">
                  <div className="inline-flex items-center gap-2 bg-rose-600/90 text-white text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Exclusive Bangladeshi E-Commerce</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                    {banner.title}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm">
                    {banner.subtitle}
                  </p>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigateTo('shop')}
                      className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2"
                    >
                      <span>{banner.buttonText || 'Shop Now'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('flash-sale')}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all backdrop-blur-xs border border-white/20"
                    >
                      Explore Deals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider navigation buttons */}
          {heroBanners.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setActiveBannerIdx(prev => (prev - 1 + heroBanners.length) % heroBanners.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={() => setActiveBannerIdx(prev => (prev + 1) % heroBanners.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === activeBannerIdx ? 'w-6 bg-rose-500' : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      )}

      {/* 2. Top Categories Showcase */}
      {isSectionEnabled('categories') && (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {getSection('categories')?.title || 'Shop By Category'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {getSection('categories')?.subtitle || 'Explore authentic top-rated collections'}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => navigateTo('shop')}
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => navigateTo('category', cat.slug)}
              className="group bg-white p-3 rounded-2xl border border-slate-200/80 hover:border-rose-400 hover:shadow-lg transition-all duration-300 text-center cursor-pointer flex flex-col items-center"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 overflow-hidden mb-2.5 p-1 border border-slate-100 group-hover:scale-105 transition-transform">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover rounded-xl" 
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {cat.subcategories?.length || 4}+ items
              </span>
            </div>
          ))}
        </div>
      </section>
      )}

      {/* 3. Flash Sale Section with Countdown */}
      {isSectionEnabled('flash-sale') && flashSale.isActive && flashSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
            {/* Background glowing accents */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-rose-700/60 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                  <Flame className="w-7 h-7 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Flash Sale
                    </h2>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      Up to 50% Off
                    </span>
                  </div>
                  <p className="text-xs text-rose-200 mt-0.5">
                    {flashSale.subtitle || 'Limited stock deals on top electronics and fashion'}
                  </p>
                </div>
              </div>

              {/* Countdown Digits */}
              <div className="flex items-center gap-2 bg-black/30 backdrop-blur-xs p-2 rounded-2xl border border-rose-500/30">
                <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider px-2">Ends in:</span>
                <div className="flex items-center gap-1.5 text-center font-mono">
                  <div className="bg-slate-900 text-amber-400 px-2.5 py-1.5 rounded-xl border border-rose-500/40">
                    <span className="text-base sm:text-lg font-black">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Hrs</span>
                  </div>
                  <span className="text-amber-400 font-bold">:</span>
                  <div className="bg-slate-900 text-amber-400 px-2.5 py-1.5 rounded-xl border border-rose-500/40">
                    <span className="text-base sm:text-lg font-black">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Min</span>
                  </div>
                  <span className="text-amber-400 font-bold">:</span>
                  <div className="bg-slate-900 text-rose-400 px-2.5 py-1.5 rounded-xl border border-rose-500/40">
                    <span className="text-base sm:text-lg font-black">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-sans">Sec</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigateTo('flash-sale')}
                  className="ml-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors hidden sm:block"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Flash Sale Product Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {flashSaleProducts.slice(0, 4).map(product => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} onQuickView={setQuickViewProduct} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Trending Products */}
      {isSectionEnabled('trending') && trendingProducts.length > 0 && (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {getSection('trending')?.title || 'Trending in Bangladesh'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {getSection('trending')?.subtitle || 'Most sought-after items right now'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => navigateTo('trending')}
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <span>View More</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {trendingProducts.slice(0, 8).map(prod => (
            <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>
      )}

      {/* 5. Promotional Split Banners */}
      {isSectionEnabled('promo-banners') && (
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div 
            onClick={() => navigateTo('category', 'mens-fashion')}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 p-6 sm:p-8 text-white cursor-pointer group shadow-md"
          >
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full inline-block">
                Festive Collection
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                Pure Cotton Men's Panjabi
              </h3>
              <p className="text-xs text-slate-300">
                Tailored with fine embroidery & modern styling. Get flat ৳500 discount with promo code.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  Shop Panjabi <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80" 
              alt="Panjabi" 
              className="absolute right-0 top-0 bottom-0 w-1/2 object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-500" 
            />
          </div>

          <div 
            onClick={() => navigateTo('category', 'electronics-gadgets')}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-950 to-slate-900 p-6 sm:p-8 text-white cursor-pointer group shadow-md"
          >
            <div className="relative z-10 max-w-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full inline-block">
                Smart Lifestyle
              </span>
              <h3 className="text-xl sm:text-2xl font-black">
                AMOLED Calling Smartwatches
              </h3>
              <p className="text-xs text-slate-300">
                10-day battery life, Bluetooth calls & health monitoring. 6 months official warranty.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                  Explore Gadgets <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80" 
              alt="Smartwatch" 
              className="absolute right-0 top-0 bottom-0 w-1/2 object-cover object-center opacity-70 group-hover:scale-105 transition-transform duration-500" 
            />
          </div>
        </div>
      </section>
      )}

      {/* 6. New Arrivals */}
      {isSectionEnabled('new-arrivals') && newArrivals.length > 0 && (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {getSection('new-arrivals')?.title || 'New Arrivals'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {getSection('new-arrivals')?.subtitle || 'Fresh stock added this week'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => navigateTo('new-arrivals')}
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {newArrivals.map(prod => (
            <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>
      )}

      {/* 7. Best Sellers */}
      {isSectionEnabled('best-sellers') && bestSellers.length > 0 && (
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {getSection('best-sellers')?.title || 'Best Sellers'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                {getSection('best-sellers')?.subtitle || 'Highest rated by Bangladeshi shoppers'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => navigateTo('best-sellers')}
            className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
          {bestSellers.map(prod => (
            <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
          ))}
        </div>
      </section>
      )}

      {/* 8. Verified Customer Reviews Showcase */}
      {isSectionEnabled('reviews') && featuredReviews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-widest">
                Trusted by 50,000+ Customers
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-slate-900 mt-1">
                {getSection('reviews')?.title || 'What Shoppers Say About Shop BD'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {getSection('reviews')?.subtitle || 'Verified reviews from Dhaka, Chittagong, Sylhet, and across Bangladesh'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {featuredReviews.map(rev => (
                <div key={rev.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-base ${i < rev.rating ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-700 italic leading-relaxed mb-3">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[180px]">{rev.productName}</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Dynamic Custom Sections Created in Admin */}
      {customSections.map(sec => (
        <section key={sec.id} className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {sec.title}
              </h2>
              {sec.subtitle && (
                <p className="text-xs sm:text-sm text-slate-500">{sec.subtitle}</p>
              )}
            </div>
            <button 
              type="button"
              onClick={() => navigateTo('shop')}
              className="text-xs sm:text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 hover:underline"
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5">
            {products.slice(0, sec.itemLimit || 4).map(prod => (
              <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      ))}

      {/* 9. Recently Viewed Products (if any) */}
      {recentlyViewed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">Recently Viewed</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentlyViewed.slice(0, 4).map(prod => (
              <ProductCard key={prod.id} product={prod} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

    </div>
  );
};
