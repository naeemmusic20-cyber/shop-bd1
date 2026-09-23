import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  Check, 
  Star, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';

interface ShopPageProps {
  initialCategory?: string;
  initialSubcategory?: string;
  initialTag?: string; // 'flash-sale' | 'new-arrivals' | 'trending' | 'best-sellers'
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  initialCategory, 
  initialSubcategory,
  initialTag 
}) => {
  const { products, categories, currentParam } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || currentParam || 'all'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    initialSubcategory || 'all'
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [discountOnly, setDiscountOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract all available brands
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter (match by slug or exact name)
      if (selectedCategory !== 'all') {
        const catObj = categories.find(c => c.slug === selectedCategory || c.name === selectedCategory);
        const matchName = catObj ? catObj.name : selectedCategory;
        if (product.category !== matchName) return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && product.subcategory !== selectedSubcategory) {
        return false;
      }

      // Initial tag filter (e.g. from dedicated route)
      if (initialTag === 'flash-sale' && !product.isFlashSale) return false;
      if (initialTag === 'trending' && !product.isTrending) return false;
      if (initialTag === 'best-sellers' && !product.isBestSeller) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price filter
      const currentPrice = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;
      if (currentPrice < priceRange[0] || currentPrice > priceRange[1]) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // In stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Discount only
      if (discountOnly && (!product.salePrice || product.salePrice >= product.price)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.price;
      const priceB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.price;

      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // newest
    });
  }, [
    products, 
    categories, 
    selectedCategory, 
    selectedSubcategory, 
    initialTag, 
    selectedBrands, 
    priceRange, 
    minRating, 
    inStockOnly, 
    discountOnly, 
    sortBy
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setMinRating(0);
    setInStockOnly(false);
    setDiscountOnly(false);
    setSortBy('newest');
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const activeCategoryObj = categories.find(c => c.slug === selectedCategory || c.name === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      
      {/* Page Breadcrumb / Title Bar */}
      <div className="mb-6 pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {initialTag === 'flash-sale' ? 'Flash Sale Deals 🔥' :
               initialTag === 'trending' ? 'Trending Products in Bangladesh' :
               initialTag === 'best-sellers' ? 'Best Selling Items' :
               initialTag === 'new-arrivals' ? 'New Arrivals' :
               activeCategoryObj ? activeCategoryObj.name : 'All Products Catalog'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing <span className="font-bold text-slate-800">{filteredProducts.length}</span> genuine items with express delivery across Bangladesh
            </p>
          </div>

          {/* Sort & Mobile Filter Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-white text-slate-800 rounded-xl border border-slate-200 text-xs font-semibold shadow-xs"
            >
              <Filter className="w-4 h-4 text-rose-600" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
              <span className="text-xs text-slate-500 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Tags */}
        {(selectedCategory !== 'all' || selectedBrands.length > 0 || minRating > 0 || inStockOnly || discountOnly) && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-400 mr-1">Active:</span>

            {selectedCategory !== 'all' && (
              <span className="bg-rose-50 text-rose-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                Category: {activeCategoryObj?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3" /></button>
              </span>
            )}

            {selectedBrands.map(brand => (
              <span key={brand} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                {brand}
                <button onClick={() => toggleBrand(brand)}><X className="w-3 h-3" /></button>
              </span>
            ))}

            {minRating > 0 && (
              <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                {minRating}★ & up
                <button onClick={() => setMinRating(0)}><X className="w-3 h-3" /></button>
              </span>
            )}

            {inStockOnly && (
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200/80 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Filters</h3>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Categories
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1 text-xs">
              <button
                type="button"
                onClick={() => { setSelectedCategory('all'); setSelectedSubcategory('all'); }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedCategory === 'all' ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories ({products.length})
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setSelectedCategory(cat.slug); setSelectedSubcategory('all'); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat.slug || selectedCategory === cat.name
                      ? 'bg-rose-50 text-rose-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ({products.filter(p => p.category === cat.name).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories (if category selected) */}
          {activeCategoryObj && activeCategoryObj.subcategories?.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Subcategories
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className={`w-full text-left px-2.5 py-1 rounded-md ${selectedSubcategory === 'all' ? 'font-bold text-rose-600' : 'text-slate-600'}`}
                >
                  All Subcategories
                </button>
                {activeCategoryObj.subcategories.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-2.5 py-1 rounded-md ${selectedSubcategory === sub ? 'font-bold text-rose-600' : 'text-slate-600'}`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Max Price: ৳{priceRange[1].toLocaleString()}
            </h4>
            <input 
              type="range" 
              min="500" 
              max="10000" 
              step="250"
              value={priceRange[1]} 
              onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>৳0</span>
              <span>৳10,000+</span>
            </div>
          </div>

          {/* Brands */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Brands
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs">
              {allBrands.map(brand => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                  <input 
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-rose-600 focus:ring-rose-500 accent-rose-600"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Ratings */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded-lg ${
                    minRating === rating ? 'bg-amber-50 text-amber-900 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? 'fill-current' : 'text-slate-200'}`} />
                    ))}
                    <span className="ml-1 text-slate-700 font-medium">& Up</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Availability Switches */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-slate-700">
              <span>In Stock Only</span>
              <input 
                type="checkbox" 
                checked={inStockOnly} 
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-rose-600"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-slate-700">
              <span>Discounted Items</span>
              <input 
                type="checkbox" 
                checked={discountOnly} 
                onChange={(e) => setDiscountOnly(e.target.checked)}
                className="accent-rose-600"
              />
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
                Try widening your price range, clearing brand selections, or removing category restrictions.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onQuickView={setQuickViewProduct} 
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase">Filters</h3>
                <button onClick={() => setIsMobileFilterOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              {/* Mobile Filter Options */}
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Category</h4>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Max Price: ৳{priceRange[1]}</h4>
                  <input 
                    type="range" 
                    min="500" 
                    max="10000" 
                    step="500"
                    value={priceRange[1]} 
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-rose-600"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="accent-rose-600" />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full bg-rose-600 text-white font-bold py-2.5 rounded-xl text-xs"
              >
                Apply Filters ({filteredProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}

    </div>
  );
};
