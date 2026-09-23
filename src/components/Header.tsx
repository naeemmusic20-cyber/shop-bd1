import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingCart, 
  Heart, 
  User as UserIcon, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Flame, 
  ShieldCheck, 
  ChevronDown, 
  Clock, 
  Package, 
  LogOut, 
  Settings,
  Sparkles,
  MapPin,
  Headphones
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Header: React.FC = () => {
  const {
    navigateTo,
    currentPage,
    categories,
    cartCount,
    cartSubtotal,
    wishlist,
    currentUser,
    login,
    logout,
    setIsCartDrawerOpen,
    searchHistory,
    addSearchHistory,
    clearSearchHistory,
    products,
    websiteSettings,
    deliverySettings,
    setIsSupportModalOpen
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSearchCat, setSelectedSearchCat] = useState('all');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    addSearchHistory(searchQuery.trim());
    setIsSearchOpen(false);
    navigateTo('search', searchQuery.trim());
  };

  // Instant autocomplete filtering
  const matchingSuggestions = searchQuery.trim()
    ? products
        .filter(p => 
          (selectedSearchCat === 'all' || p.category === selectedSearchCat) &&
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.category.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs">
      {/* Top Announcement Bar */}
      {websiteSettings.showTopAnnouncement && (
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 font-medium border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Notice</span>
              <span>{websiteSettings.topAnnouncementText || `Free Delivery across Bangladesh on orders over ৳${deliverySettings.freeDeliveryThreshold.toLocaleString()}!`}</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] text-slate-300">
              {websiteSettings.showTrackOrder && (
                <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer" onClick={() => navigateTo('track-order')}>
                  <Package className="w-3.5 h-3.5 text-rose-400" />
                  <span>Track Order</span>
                </div>
              )}
              {websiteSettings.showTrackOrder && websiteSettings.showHotline && (
                <span className="text-slate-600 hidden sm:inline">|</span>
              )}
              {websiteSettings.showHotline && (
                <button 
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Helpline: {websiteSettings.phone}</span>
                </button>
              )}
              <span className="text-slate-600 hidden sm:inline">|</span>
              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>24/7 Support</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 md:gap-6">
          
          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Dynamic Brand Logo */}
          <div 
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            {(websiteSettings.headerLogo || websiteSettings.logoUrl) ? (
              <img 
                src={websiteSettings.headerLogo || websiteSettings.logoUrl} 
                alt={websiteSettings.headerName || websiteSettings.websiteName || 'Shop BD'} 
                className="h-10 sm:h-11 max-w-[160px] object-contain group-hover:scale-102 transition-transform" 
              />
            ) : (
              <div className="relative w-11 h-11 bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  <path d="M12 5V2.5a1.5 1.5 0 0 1 3 0V5" strokeWidth="1.8" />
                  <path d="M1 6h3" stroke="#FDE047" strokeWidth="1.8" />
                  <path d="M2 9h2" stroke="#FDE047" strokeWidth="1.8" />
                </svg>
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-rose-600 to-slate-900 bg-clip-text text-transparent">
                  {websiteSettings.headerName || websiteSettings.websiteName || 'Shop BD'}
                </span>
                <span className="text-[10px] font-semibold bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded-full border border-rose-200 uppercase">
                  top
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide -mt-1 hidden sm:block">
                {websiteSettings.tagline || 'Shop Smart, Live Better'}
              </span>
            </div>
          </div>

          {/* Search Bar with live autocomplete */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative">
            <form onSubmit={handleSearchSubmit} className="flex w-full rounded-xl border-2 border-rose-500 overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-rose-500/20">
              <select 
                value={selectedSearchCat} 
                onChange={(e) => setSelectedSearchCat(e.target.value)}
                className="bg-slate-50 text-slate-700 text-xs px-3 py-2 border-r border-slate-200 outline-none hover:bg-slate-100 transition-colors font-medium max-w-[140px] truncate"
              >
                <option value="all">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              <input 
                type="text" 
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search smartwatches, Panjabi, earbuds, air fryers..." 
                className="flex-1 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none"
              />

              <button 
                type="submit" 
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 flex items-center justify-center font-medium transition-colors"
                aria-label="Search products"
              >
                <Search className="w-4 h-4 mr-1.5" />
                <span className="text-xs font-semibold">Search</span>
              </button>
            </form>

            {/* Search Dropdown Modal */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50">
                {/* Autocomplete items */}
                {matchingSuggestions.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
                      Matching Products
                    </div>
                    {matchingSuggestions.map(product => (
                      <div 
                        key={product.id}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery('');
                          navigateTo('product', product.id);
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-rose-50/70 rounded-lg cursor-pointer transition-colors"
                      >
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded-md border border-slate-200" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 truncate">{product.name}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-600">৳{(product.salePrice || product.price).toLocaleString()}</span>
                            {product.salePrice && (
                              <span className="text-[10px] text-slate-400 line-through">৳{product.price.toLocaleString()}</span>
                            )}
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 rounded">{product.brand}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular & Recent searches */}
                <div className="p-3 bg-slate-50/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Recent Searches</span>
                    {searchHistory.length > 0 && (
                      <button 
                        type="button" 
                        onClick={clearSearchHistory} 
                        className="text-[11px] text-rose-600 hover:underline"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(item);
                          setIsSearchOpen(false);
                          navigateTo('search', item);
                        }}
                        className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 hover:border-rose-400 hover:text-rose-600 transition-colors flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons: Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* User Account Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-slate-700 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-colors"
                aria-label="Account Menu"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                  {currentUser ? currentUser.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    {currentUser ? 'Hello,' : 'Sign In'}
                  </span>
                  <span className="text-xs font-bold text-slate-800 truncate max-w-[100px]">
                    {currentUser ? currentUser.displayName.split(' ')[0] : 'My Account'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-800 truncate">{currentUser.displayName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                          {currentUser.role === 'admin' ? 'Admin Access' : 'Verified Customer'}
                        </span>
                      </div>

                      {currentUser.role === 'admin' && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Control Panel</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        <span>My Profile</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('my-orders');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>My Orders</span>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 text-center border-b border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigateTo('login');
                          }}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
                        >
                          Sign In / Register
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('track-order');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4 text-slate-400" />
                        <span>Track Parcel</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button 
              type="button"
              onClick={() => navigateTo('wishlist')}
              className="relative p-2 text-slate-700 hover:text-rose-600 hover:bg-slate-50 rounded-xl transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute 1 top-1 right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl transition-colors group border border-rose-200"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] text-slate-500 font-semibold uppercase leading-none">Cart</span>
                <span className="text-xs font-bold text-slate-800 leading-tight">৳{cartSubtotal.toLocaleString()}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="flex w-full rounded-xl border border-rose-400 overflow-hidden shadow-xs">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products in Shop BD..."
              className="flex-1 px-3 py-2 text-sm text-slate-800 outline-none"
            />
            <button 
              type="submit" 
              className="bg-rose-600 text-white px-4 flex items-center justify-center"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Navigation Menu Bar */}
      <nav className="bg-slate-900 text-white border-t border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            
            {/* All Categories Dropdown Mega Trigger */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 flex items-center gap-2 font-semibold text-xs tracking-wide uppercase transition-colors"
              >
                <Menu className="w-4 h-4" />
                <span>All Categories</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCategoriesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 w-64 bg-white text-slate-800 shadow-2xl rounded-b-xl border border-slate-200 py-2 z-50"
                  onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
                >
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setIsCategoriesDropdownOpen(false);
                        navigateTo('category', cat.slug);
                      }}
                      className="flex items-center justify-between px-4 py-2.5 hover:bg-rose-50 hover:text-rose-600 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">({cat.subcategories.length})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Links */}
            <div className="flex items-center space-x-1 pl-4 text-xs font-semibold">
              <button 
                onClick={() => navigateTo('home')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'home' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('shop')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'shop' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Shop All
              </button>
              <button 
                onClick={() => navigateTo('flash-sale')}
                className={`px-3 py-3 rounded-md transition-colors flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold`}
              >
                <Flame className="w-3.5 h-3.5 animate-bounce" />
                <span>Flash Sale</span>
              </button>
              <button 
                onClick={() => navigateTo('new-arrivals')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'new-arrivals' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                New Arrivals
              </button>
              <button 
                onClick={() => navigateTo('trending')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'trending' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Trending
              </button>
              <button 
                onClick={() => navigateTo('best-sellers')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'best-sellers' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Best Sellers
              </button>
              <button 
                onClick={() => navigateTo('collections')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'collections' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Collections
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className={`px-3 py-3 rounded-md transition-colors ${currentPage === 'contact' ? 'text-rose-400' : 'text-slate-200 hover:text-white'}`}
              >
                Contact
              </button>
            </div>
          </div>

          {/* Support Helpline */}
          <div className="flex items-center gap-2.5 text-xs">
            <button 
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold py-1.5 px-3 rounded-full bg-emerald-950/60 border border-emerald-700/80 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Headphones className="w-3.5 h-3.5 text-emerald-400" />
              <span>Customer Support</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex">
          <div className="w-4/5 max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-xl text-rose-500">Shop BD</span>
                <span className="text-[10px] text-slate-300 font-medium">NM Shop BD</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:text-rose-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* User status */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="text-xs">
                <p className="font-bold text-slate-800">{currentUser ? currentUser.displayName : 'Guest Customer'}</p>
                <p className="text-[10px] text-slate-500">{currentUser ? currentUser.email : 'Login to view orders'}</p>
              </div>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (currentUser) {
                    logout();
                  } else {
                    navigateTo('login');
                  }
                }}
                className="text-xs font-semibold text-rose-600 bg-white px-2.5 py-1 rounded border border-rose-200"
              >
                {currentUser ? 'Logout' : 'Login'}
              </button>
            </div>

            {/* Mobile Nav Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 text-sm font-medium text-slate-700">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('home'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Home</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('shop'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Shop All Products</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('flash-sale'); }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-bold bg-rose-50 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-rose-600" />
                <span>Flash Sale 🔥</span>
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('new-arrivals'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                New Arrivals
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('trending'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Trending
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigateTo('track-order'); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-slate-500" />
                <span>Track My Order</span>
              </button>

              <div className="pt-3 pb-1 border-t border-slate-200">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">Categories</p>
                {categories.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setIsMobileMenuOpen(false); navigateTo('category', c.slug); }}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700">Need Help?</p>
              <p>Hotline: {websiteSettings.phone}</p>
              <p>Email: {websiteSettings.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
