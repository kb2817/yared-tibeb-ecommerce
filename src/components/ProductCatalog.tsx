import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '../types';
import { Heart, ShoppingBag, Eye, Share2, Sparkles, Check, X, RotateCcw, SlidersHorizontal, DollarSign, Tag, ArrowDownUp, Percent } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  onSelectProduct: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onShareProduct: (p: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  searchQuery: string;
}

const CATEGORIES: ProductCategory[] = ['All', 'Wedding', "Men's", 'Holiday', 'Family', 'Baby', 'Formal'];

type AvailabilityFilter = 'all' | 'in-stock' | 'on-sale' | 'low-stock';
type SortOption = 'featured' | 'discount' | 'price-low' | 'price-high';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
  onShareProduct,
  wishlistIds,
  onToggleWishlist,
  searchQuery
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Price range bounds calculated from products
  const { absoluteMinPrice, absoluteMaxPrice } = useMemo(() => {
    if (!products.length) return { absoluteMinPrice: 0, absoluteMaxPrice: 1000 };
    const prices = products.map((p) => p.price);
    return {
      absoluteMinPrice: Math.min(...prices),
      absoluteMaxPrice: Math.max(...prices)
    };
  }, [products]);

  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');

  // Count how many products are on sale
  const saleProductsCount = useMemo(() => {
    return products.filter((p) => p.originalPrice && p.originalPrice > p.price).length;
  }, [products]);

  // Reset filters
  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMinPrice(0);
    setMaxPrice(1000);
    setAvailability('all');
    setSortBy('featured');
  };

  // Active filter count
  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (minPrice > absoluteMinPrice || maxPrice < absoluteMaxPrice ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (sortBy !== 'featured' ? 1 : 0);

  // Filter & sort products logic
  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      // Category filter
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

      // Search query filter
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      // Price filter
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;

      // Availability filter
      let matchesAvailability = true;
      if (availability === 'in-stock') {
        matchesAvailability = p.stock > 0;
      } else if (availability === 'on-sale') {
        matchesAvailability = Boolean(p.originalPrice && p.originalPrice > p.price);
      } else if (availability === 'low-stock') {
        matchesAvailability = p.stock > 0 && p.stock <= 5;
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesAvailability;
    });

    // Apply Sorting
    if (sortBy === 'discount') {
      result.sort((a, b) => {
        const discA = a.originalPrice && a.originalPrice > a.price ? (a.originalPrice - a.price) / a.originalPrice : 0;
        const discB = b.originalPrice && b.originalPrice > b.price ? (b.originalPrice - b.price) / b.originalPrice : 0;
        return discB - discA;
      });
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, searchQuery, minPrice, maxPrice, availability, sortBy]);

  return (
    <section id="catalog-section" className="py-16 sm:py-24 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C59B27]">
            Handcrafted Ethiopian Couture
          </p>
          <h2 className="font-serif-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#2C1A14]">
            The Heritage Collection
          </h2>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto" />
        </div>

        {/* Category Tabs & Main Toolbar */}
        <div className="bg-[#f5e9cc] border border-[#ECE3D4] p-4 sm:p-6 shadow-sm space-y-4">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Quick Category Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-[#2C1A14] text-[#D4AF37] shadow-md border border-[#D4AF37]'
                      : 'bg-white border border-[#ECE3D4] text-[#2C1A14] hover:border-[#D4AF37] hover:text-[#C59B27]'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {/* Special On Sale Discount Pill */}
              <button
                onClick={() => setAvailability(availability === 'on-sale' ? 'all' : 'on-sale')}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center space-x-1.5 ${
                  availability === 'on-sale'
                    ? 'bg-red-950 text-[#FFD700] border border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30'
                    : 'bg-gradient-to-r from-red-900 to-[#2C1A14] text-[#FAF6F0] border border-red-800 hover:text-[#D4AF37]'
                }`}
              >
                <Tag size={13} className="text-[#D4AF37]" />
                <span>Price Discounts ({saleProductsCount})</span>
              </button>
            </div>

            {/* Filter & Sort Toolbar */}
            <div className="flex items-center justify-end space-x-3 text-xs border-t lg:border-t-0 pt-3 lg:pt-0 border-[#ECE3D4]">
              
              {/* Sort By Dropdown */}
              <div className="flex items-center space-x-1.5 bg-white px-3 py-2 border border-[#ECE3D4]">
                <ArrowDownUp size={14} className="text-[#C59B27]" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2C1A14]/70 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs font-bold text-[#2C1A14] focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="discount">Highest Discount (% OFF)</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`px-4 py-2 font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors border ${
                  isFilterPanelOpen || activeFiltersCount > 0
                    ? 'bg-[#D4AF37] text-[#1A0F0B] border-[#D4AF37]'
                    : 'bg-white text-[#2C1A14] border-[#ECE3D4] hover:bg-[#2C1A14] hover:text-[#FAF6F0]'
                }`}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 bg-[#1A0F0B] text-[#D4AF37] text-[10px] rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

            </div>

          </div>

          {/* Expandable Refined Filter Drawer/Panel */}
          {isFilterPanelOpen && (
            <div className="pt-6 border-t border-[#ECE3D4] animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 border border-[#ECE3D4]">
                
                {/* Filter: Price Range */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2C1A14]">
                    <span className="flex items-center space-x-1">
                      <DollarSign size={14} className="text-[#C59B27]" />
                      <span>Price Range (ETB)</span>
                    </span>
                    <span className="text-[#C59B27] font-semibold">ETB {minPrice} - ETB {maxPrice}</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-[#2C1A14]/60 uppercase">Min (ETB)</label>
                        <input
                          type="number"
                          min={0}
                          max={maxPrice}
                          value={minPrice}
                          onChange={(e) => setMinPrice(Number(e.target.value))}
                          className="w-full bg-[#FAF5EE] border border-[#ECE3D4] px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                      <span className="text-[#2C1A14]/40 mt-3">-</span>
                      <div className="flex-1">
                        <label className="text-[10px] text-[#2C1A14]/60 uppercase">Max (ETB)</label>
                        <input
                          type="number"
                          min={minPrice}
                          max={2000}
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full bg-[#FAF5EE] border border-[#ECE3D4] px-2.5 py-1.5 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={25}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#D4AF37] cursor-pointer"
                    />

                    {/* Preset Price Buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[
                        { label: 'Under $200', min: 0, max: 200 },
                        { label: '$200 - $400', min: 200, max: 400 },
                        { label: '$400+', min: 400, max: 1000 },
                        { label: 'All Prices', min: 0, max: 1000 }
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setMinPrice(preset.min);
                            setMaxPrice(preset.max);
                          }}
                          className="px-2.5 py-1 text-[10px] font-semibold bg-[#FAF5EE] border border-[#ECE3D4] hover:bg-[#2C1A14] hover:text-[#D4AF37] transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Filter: Discount & Stock Availability */}
                <div className="space-y-3 md:border-l md:border-[#ECE3D4] md:pl-5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#2C1A14] flex items-center space-x-1">
                    <Percent size={14} className="text-[#C59B27]" />
                    <span>Special Deals & Availability</span>
                  </div>

                  <div className="flex flex-col space-y-2 text-xs">
                    <button
                      onClick={() => setAvailability('all')}
                      className={`px-3 py-2 text-left font-semibold border ${
                        availability === 'all'
                          ? 'bg-[#2C1A14] text-[#D4AF37] border-[#D4AF37]'
                          : 'bg-[#FAF5EE] text-[#2C1A14] border-[#ECE3D4] hover:bg-white'
                      }`}
                    >
                      Show All Garments
                    </button>
                    <button
                      onClick={() => setAvailability('on-sale')}
                      className={`px-3 py-2 text-left font-semibold border flex items-center justify-between ${
                        availability === 'on-sale'
                          ? 'bg-red-950 text-[#FFD700] border-[#D4AF37]'
                          : 'bg-[#FAF5EE] text-[#2C1A14] border-[#ECE3D4] hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center space-x-1.5">
                        <Tag size={13} className="text-[#C59B27]" />
                        <span>Discounted Price Items Only</span>
                      </span>
                      <span className="text-[10px] bg-red-900 text-white px-2 py-0.5 rounded font-bold">
                        {saleProductsCount} Available
                      </span>
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 pt-3 border-t border-[#ECE3D4] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#2C1A14]">
                    Matching Results: <span className="text-[#C59B27] font-serif-heading text-sm">{filtered.length}</span> / {products.length}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1.5 border border-[#ECE3D4] text-[#2C1A14] hover:bg-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setIsFilterPanelOpen(false)}
                      className="px-4 py-1.5 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-[10px] font-bold uppercase tracking-wider transition-colors"
                    >
                      Apply & Close
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Product Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-[#FAF5EE] border border-dashed border-[#C59B27] p-8 space-y-3">
            <Sparkles className="mx-auto text-[#D4AF37]" size={36} />
            <h3 className="font-serif-heading text-2xl text-[#2C1A14] font-medium">
              No Ethiopian Garments Found
            </h3>
            <p className="text-xs text-[#2C1A14]/70 max-w-md mx-auto">
              No items in our collection match your current combination of category, price range, or availability filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-4 py-2 bg-[#2C1A14] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A0F0B] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product) => {
              const isWishlisted = wishlistIds.includes(product.id);
              const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
              const discountPct = hasDiscount
                ? Math.round((((product.originalPrice! - product.price) / product.originalPrice!) * 100))
                : 0;
              const savingsAmount = hasDiscount ? product.originalPrice! - product.price : 0;

              return (
                <div
                  key={product.id}
                  className="group relative bg-[#FAF5EE] border border-[#ECE3D4] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:border-[#D4AF37]"
                >
                  {/* Product Image Box */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#1A0F0B] cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      onClick={() => onSelectProduct(product)}
                      className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Stock & Discount Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                      {hasDiscount && (
                        <span className="bg-gradient-to-r from-red-950 via-red-900 to-[#2C1A14] text-[#FFD700] border border-[#D4AF37] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 shadow-lg flex items-center space-x-1">
                          <Tag size={11} className="text-[#D4AF37]" />
                          <span>{discountPct}% OFF</span>
                        </span>
                      )}
                      {product.stock <= 5 && (
                        <span className="bg-amber-900/90 text-amber-100 text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 shadow">
                          Only {product.stock} Left
                        </span>
                      )}
                    </div>

                    {/* Wishlist & Share Quick Action Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-2 z-10">
                      <button
                        onClick={() => onToggleWishlist(product.id)}
                        className={`p-2 rounded-full backdrop-blur-md shadow transition-colors ${
                          isWishlisted
                            ? 'bg-red-900 text-red-200'
                            : 'bg-[#FAF6F0]/80 text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#D4AF37]'
                        }`}
                        title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>

                      <button
                        onClick={() => onShareProduct(product)}
                        className="p-2 rounded-full bg-[#FAF6F0]/80 text-[#2C1A14] hover:bg-[#2C1A14] hover:text-[#D4AF37] backdrop-blur-md shadow transition-colors"
                        title="Share Product"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>

                    {/* Quick Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A0F0B]/90 via-[#1A0F0B]/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between gap-2 z-10">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 py-2 bg-[#FAF6F0] text-[#2C1A14] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center space-x-1"
                      >
                        <Eye size={14} />
                        <span>Quick View</span>
                      </button>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="p-2 bg-[#D4AF37] text-[#1A0F0B] hover:bg-white transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Details Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-[#C59B27] font-semibold uppercase tracking-wider mb-1">
                        <span>{product.category}</span>
                        {hasDiscount && (
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                            Save ${savingsAmount}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => onSelectProduct(product)}
                        className="font-serif-heading text-lg font-medium text-[#2C1A14] hover:text-[#C59B27] cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#2C1A14]/70 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Price and Add to Cart Action */}
                    <div className="pt-3 border-t border-[#ECE3D4] flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline space-x-2">
                          <span className="font-serif-heading text-xl font-bold text-[#2C1A14]">
                            ${product.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-[#2C1A14]/50 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        {hasDiscount && (
                          <span className="text-[10px] font-semibold text-emerald-700 flex items-center space-x-1 mt-0.5">
                            <span>Heritage Discount ({discountPct}% Off)</span>
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onAddToCart(product)}
                        className="px-3 py-1.5 bg-[#2C1A14] text-[#FAF6F0] hover:bg-[#D4AF37] hover:text-[#1A0F0B] text-[10px] uppercase tracking-widest font-bold transition-colors shrink-0"
                      >
                        Add to Cart
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};


