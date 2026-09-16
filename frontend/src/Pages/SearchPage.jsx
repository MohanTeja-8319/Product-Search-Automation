import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiSliders,
  FiStar,
  FiHeart,
  FiCheck,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiArrowRight,
  FiTag,
  FiTrendingUp,
  FiBell,
  FiLayers,
  FiEye,
  FiRefreshCw,
  FiShield,
  FiZap,
  FiShoppingBag,
  FiExternalLink,
  FiTrash2,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { FaHeart, FaStar, FaStore, FaExchangeAlt, FaFire } from "react-icons/fa";

import dummyProducts from "../data/products.js";
import staticComparisonProducts from "../data/comparisionProducts";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import groupProducts from "../utils/groupProducts";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import { searchLiveProducts } from "../utils/api";

// Store Logo Config & Badges
const STORE_CONFIG = {
  Amazon: { bg: "bg-[#131921] text-amber-400", border: "border-gray-800", char: "a", label: "Amazon" },
  Flipkart: { bg: "bg-[#2874f0] text-yellow-300", border: "border-blue-700", char: "f", label: "Flipkart" },
  Croma: { bg: "bg-[#00838f] text-white", border: "border-teal-700", char: "croma", label: "Croma" },
  Myntra: { bg: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white", border: "border-pink-500", char: "M", label: "Myntra" },
  Ajio: { bg: "bg-[#2c4152] text-white", border: "border-slate-600", char: "AJIO", label: "Ajio" },
  "Apple Store": { bg: "bg-black text-white", border: "border-gray-900", char: "", label: "Apple" },
};

const getStoreDetails = (storeName) => {
  return STORE_CONFIG[storeName] || {
    bg: "bg-indigo-600 text-white",
    border: "border-indigo-700",
    char: storeName ? storeName[0].toUpperCase() : "P",
    label: storeName || "Store",
  };
};

// Category Icons Mapping
const CATEGORY_EMOJIS = {
  Smartphones: "📱",
  Laptops: "💻",
  Headphones: "🎧",
  Accessories: "💎",
  Fashion: "👕",
  Smartwatches: "⌚",
  Tablets: "📱",
  Cameras: "📷",
  Audio: "🔊",
  TV: "📺",
};

// Quick Price Presets
const PRICE_PRESETS = [
  { label: "All Prices", min: 0, max: 500000 },
  { label: "Under ₹10k", min: 0, max: 10000 },
  { label: "₹10k – ₹30k", min: 10000, max: 30000 },
  { label: "₹30k – ₹70k", min: 30000, max: 70000 },
  { label: "₹70k+", min: 70000, max: 500000 },
];

/* =========================================================================
   COMPONENTS: Filters Sidebar
   ========================================================================= */
export const Filters = ({
  brands = [],
  categories = [],
  stores = [],
  selectedBrands = [],
  selectedCategories = [],
  selectedStores = [],
  selectedRatings = [],
  selectedDiscount,
  inStockOnly,
  setInStockOnly,
  handleBrandChange,
  handleCategoryChange,
  handleStoreChange,
  handleRatingChange,
  setSelectedDiscount,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  clearAllFilters,
  activeFilterCount,
  brandCounts,
  categoryCounts,
  storeCounts,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    brands: true,
    stores: true,
    ratings: true,
    discount: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredBrands = brands.filter((b) =>
    b.toLowerCase().includes(brandSearch.toLowerCase())
  );
  const filteredCategories = categories.filter((c) =>
    c.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 p-5 shadow-sm transition-all duration-300 ${
        isMobileDrawer ? "w-full max-h-[85vh] overflow-y-auto" : "w-[280px] shrink-0 sticky top-24"
      }`}
    >
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
            <FiSliders className="text-base" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-none">Filters</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Refine results</p>
          </div>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-indigo-600 text-white text-[11px] font-bold rounded-full animate-scaleUp">
              {activeFilterCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-400 hover:underline transition cursor-pointer"
            >
              Reset All
            </button>
          )}
          {isMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <FiX className="text-lg" />
            </button>
          )}
        </div>
      </div>

      {/* Stock Availability Toggle */}
      <div className="mb-5 p-3 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-xl border border-indigo-100/70 dark:border-indigo-900/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">In Stock Only</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* Price Range Section */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span>Price Range</span>
          {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.price && (
          <div className="space-y-3.5 animate-fadeIn">
            {/* Quick Price Preset Chips */}
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map((preset) => {
                const isActive = minPrice === preset.min && maxPrice === preset.max;
                return (
                  <button
                    key={preset.label}
                    onClick={() => {
                      setMinPrice(preset.min);
                      setMaxPrice(preset.max);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm font-semibold"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Dual Sliders */}
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[10px] text-slate-500 font-bold mb-1 block">Min Price Slider</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold mb-1 block">Max Price Slider</label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            {/* Min - Max Box */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-center">
                <span className="text-[10px] text-slate-400 block font-medium">Min</span>
                <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} className="w-full bg-transparent font-bold text-slate-800 dark:text-slate-100 text-center outline-none" />
              </div>
              <span className="text-slate-300 font-bold">—</span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-950 border border-indigo-200 rounded-lg px-2.5 py-1.5 text-center">
                <span className="text-[10px] text-indigo-500 block font-medium">Max</span>
                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full bg-transparent font-bold text-indigo-700 dark:text-indigo-400 text-center outline-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categories Section */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span className="flex items-center gap-1.5">
            Categories
            {selectedCategories.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                {selectedCategories.length}
              </span>
            )}
          </span>
          {expandedSections.categories ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.categories && (
          <div className="space-y-2 animate-fadeIn">
            {categories.length > 6 && (
              <div className="relative mb-2">
                <FiSearch className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search category..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>
            )}

            <div
              className={`space-y-1.5 text-[13px] ${
                showAllCategories || categorySearch ? "max-h-48 overflow-y-auto pr-1" : ""
              }`}
            >
              {(showAllCategories || categorySearch
                ? filteredCategories
                : filteredCategories.slice(0, 5)
              ).map((category) => {
                const isSelected = selectedCategories.includes(category);
                const emoji = CATEGORY_EMOJIS[category] || "📦";
                return (
                  <label
                    key={category}
                    className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition select-none ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-400 font-semibold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category)}
                        className="accent-indigo-600 w-3.5 h-3.5 rounded cursor-pointer"
                      />
                      <span className="text-xs truncate">
                        <span className="mr-1">{emoji}</span>
                        {category}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                        isSelected ? "bg-indigo-200/60 text-indigo-800 dark:text-indigo-400 font-bold" : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      {categoryCounts[category] || 0}
                    </span>
                  </label>
                );
              })}

              {!categorySearch && categories.length > 5 && (
                <button
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {showAllCategories ? "− Show Less" : `+ View All (${categories.length})`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Brands Section */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection("brands")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span className="flex items-center gap-1.5">
            Brands
            {selectedBrands.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                {selectedBrands.length}
              </span>
            )}
          </span>
          {expandedSections.brands ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.brands && (
          <div className="space-y-2 animate-fadeIn">
            {brands.length > 6 && (
              <div className="relative mb-2">
                <FiSearch className="absolute left-2.5 top-2.5 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search brand..."
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-7 pr-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-400"
                />
              </div>
            )}

            <div
              className={`space-y-1.5 text-[13px] ${
                showAllBrands || brandSearch ? "max-h-48 overflow-y-auto pr-1" : ""
              }`}
            >
              {(showAllBrands || brandSearch ? filteredBrands : filteredBrands.slice(0, 5)).map(
                (brand) => {
                  const isSelected = selectedBrands.includes(brand);
                  return (
                    <label
                      key={brand}
                      className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition select-none ${
                        isSelected
                          ? "bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-400 font-semibold"
                          : "hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleBrandChange(brand)}
                          className="accent-indigo-600 w-3.5 h-3.5 rounded cursor-pointer"
                        />
                        <span className="text-xs truncate">{brand}</span>
                      </div>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                          isSelected
                            ? "bg-indigo-200/60 text-indigo-800 dark:text-indigo-400 font-bold"
                            : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                        }`}
                      >
                        {brandCounts[brand] || 0}
                      </span>
                    </label>
                  );
                }
              )}

              {!brandSearch && brands.length > 5 && (
                <button
                  onClick={() => setShowAllBrands(!showAllBrands)}
                  className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-800 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  {showAllBrands ? "− Show Less" : `+ View All (${brands.length})`}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stores Section */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection("stores")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span className="flex items-center gap-1.5">
            Stores & Platforms
            {selectedStores.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 dark:text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                {selectedStores.length}
              </span>
            )}
          </span>
          {expandedSections.stores ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.stores && (
          <div className="space-y-1.5 animate-fadeIn">
            {stores.map((store) => {
              const isSelected = selectedStores.includes(store);
              const storeDetail = getStoreDetails(store);
              return (
                <label
                  key={store}
                  className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition select-none ${
                    isSelected
                      ? "bg-indigo-50/70 dark:bg-indigo-950/70 text-indigo-900 dark:text-indigo-400 font-semibold"
                      : "hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleStoreChange(store)}
                      className="accent-indigo-600 w-3.5 h-3.5 rounded cursor-pointer"
                    />
                    <span
                      className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center shrink-0 uppercase ${storeDetail.bg}`}
                    >
                      {storeDetail.char}
                    </span>
                    <span className="text-xs truncate">{store}</span>
                  </div>
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? "bg-indigo-200/60 text-indigo-800 dark:text-indigo-400 font-bold"
                        : "text-slate-400 bg-slate-100 dark:bg-slate-800"
                    }`}
                  >
                    {storeCounts[store] || 0}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Customer Ratings Filter */}
      <div className="mb-5 pb-5 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => toggleSection("ratings")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span>Customer Ratings</span>
          {expandedSections.ratings ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.ratings && (
          <div className="space-y-1.5 animate-fadeIn">
            {[4, 3, 2].map((rating) => {
              const isSelected = selectedRatings.includes(rating);
              return (
                <label
                  key={rating}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition select-none ${
                    isSelected
                      ? "bg-amber-50 dark:bg-amber-950 text-amber-900 font-semibold border border-amber-200/60"
                      : "hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleRatingChange(rating)}
                      className="accent-amber-500 w-3.5 h-3.5 rounded cursor-pointer"
                    />
                    <div className="flex items-center gap-1 text-xs">
                      <div className="flex text-amber-400 text-xs">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar
                            key={i}
                            className={i < rating ? "text-amber-400" : "text-slate-200"}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 ml-1">
                        {rating}★ & Above
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Minimum Discount Filter */}
      <div>
        <button
          onClick={() => toggleSection("discount")}
          className="flex items-center justify-between w-full text-left font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-3"
        >
          <span>Minimum Discount</span>
          {expandedSections.discount ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {expandedSections.discount && (
          <div className="grid grid-cols-2 gap-1.5 animate-fadeIn">
            {[
              { label: "All Deals", value: 0 },
              { label: "5% & Above", value: 5 },
              { label: "10% & Above", value: 10 },
              { label: "15% & Above", value: 15 },
              { label: "20% & Above", value: 20 },
            ].map((d) => {
              const isSelected = selectedDiscount === d.value;
              return (
                <button
                  key={d.label}
                  onClick={() => setSelectedDiscount(d.value)}
                  className={`text-[11px] py-1.5 px-2 rounded-lg font-medium transition cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 font-semibold shadow-sm"
                      : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTS: Single Product Card (Grid View)
   ========================================================================= */
const ProductGridCard = ({
  product,
  comparisonProducts,
  onWishlistToggle,
  isCompared,
  onToggleCompare,
  onOpenPriceAlert,
}) => {
  const navigate = useNavigate();
  const inWishlist = isProductInWishlist(product.name);
  const comparison = comparisonProducts[product.name];
  const hasComparison = !!comparison && comparison.length > 0;
  const isLiveProduct = product.live === true;
  const storeDetail = getStoreDetails(product.store);

  // Price calculations
  const originalPrice = product.originalPrice || Math.round(product.price * 1.12);
  const savings = Math.max(0, originalPrice - product.price);

  const handleCardClick = () => {
    if (hasComparison || isLiveProduct) {
      // Live products do not exist in the old dummyProducts array.
      // Always send live results to the live Comparison Page, which fetches
      // the comparison by product name from the backend.
      navigate(`/comparison/${encodeURIComponent(product.name)}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    toggleWishlistItem(product);
    if (onWishlistToggle) onWishlistToggle();
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    onToggleCompare(product);
  };

  const handleAlertClick = (e) => {
    e.stopPropagation();
    onOpenPriceAlert(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer hover:-translate-y-1.5 ${
        isCompared
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
          : "border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 hover:shadow-xl shadow-sm"
      }`}
    >
      {/* Top Floating Badges & Actions */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none gap-2">
        {/* Discount & Best Price Badges */}
        <div className="flex flex-col items-start gap-1 pointer-events-auto">
          {product.discount && (
            <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              <FiTag className="text-[9px]" />
              {product.discount}
            </span>
          )}
          {hasComparison && (
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
              🏆 Best Deal
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 pointer-events-auto shrink-0">
          {/* Compare Checkbox */}
          <button
            onClick={handleCompareClick}
            title={isCompared ? "Remove from comparison" : "Add to compare"}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-sm text-xs cursor-pointer border ${
              isCompared
                ? "bg-indigo-600 text-white border-indigo-600 ring-2 ring-indigo-300"
                : "bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-900 border-slate-200/80 dark:border-slate-800/80"
            }`}
          >
            {isCompared ? <FiCheck className="stroke-[3]" /> : <FaExchangeAlt className="text-[9px]" />}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={handleHeartClick}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            className="w-7 h-7 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex items-center justify-center shadow-sm text-slate-400 hover:text-red-500 hover:bg-white dark:hover:bg-slate-900 dark:bg-slate-900 transition cursor-pointer border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800"
          >
            {inWishlist ? (
              <FaHeart className="text-red-500 text-xs animate-scaleUp" />
            ) : (
              <FiHeart className="text-xs" />
            )}
          </button>
        </div>
      </div>

      {/* Image Showcase */}
      <div className="w-full h-48 bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-900/50 flex items-center justify-center p-6 overflow-hidden relative select-none">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80";
          }}
        />

        {/* Store Brand Badge Bottom Left */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 dark:bg-slate-900 backdrop-blur-md px-2 py-0.5 rounded-lg border border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800 shadow-xs">
          <span
            className={`w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center uppercase ${storeDetail.bg}`}
          >
            {storeDetail.char}
          </span>
          <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{product.store}</span>
        </div>

        {/* Stock Status Bottom Right */}
        <div className="absolute bottom-2.5 right-3">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              product.availability === "Limited Stock"
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {product.availability || "In Stock"}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {product.brand} · {product.category}
            </span>

            {product.rating && (
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950 text-amber-800 px-1.5 py-0.5 rounded-md text-[11px] font-bold">
                <FaStar className="text-amber-400 text-[10px]" />
                <span>{product.rating}</span>
                {product.reviews && (
                  <span className="text-slate-400 font-normal text-[10px]">
                    ({product.reviews >= 1000 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
            {product.name}
          </h3>
        </div>

        {/* Pricing & Deals */}
        <div>
          <div className="mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹{product.price.toLocaleString()}
                </span>
                {originalPrice > product.price && (
                  <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {savings > 0 && (
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                  Save ₹{savings.toLocaleString()}
                </span>
              )}
            </div>

            {hasComparison && (
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
                <FiZap className="text-amber-500 fill-amber-500" />
                Compared across {comparison.length} verified stores
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-xl transition duration-200 shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{hasComparison || isLiveProduct ? "Compare Stores" : "View Details"}</span>
              <FiArrowRight className="text-xs" />
            </button>

            <button
              onClick={handleAlertClick}
              title="Set Price Alert"
              className="p-2.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition cursor-pointer"
            >
              <FiBell className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTS: Product List Card (Detailed List View)
   ========================================================================= */
const ProductListCard = ({
  product,
  comparisonProducts,
  onWishlistToggle,
  isCompared,
  onToggleCompare,
  onOpenPriceAlert,
}) => {
  const navigate = useNavigate();
  const inWishlist = isProductInWishlist(product.name);
  const comparison = comparisonProducts[product.name];
  const hasComparison = !!comparison && comparison.length > 0;
  const isLiveProduct = product.live === true;
  const storeDetail = getStoreDetails(product.store);

  const originalPrice = product.originalPrice || Math.round(product.price * 1.12);
  const savings = Math.max(0, originalPrice - product.price);

  const handleCardClick = () => {
    if (hasComparison || isLiveProduct) {
      navigate(`/comparison/${encodeURIComponent(product.name)}`);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group bg-white dark:bg-slate-900 rounded-2xl border p-4 transition-all duration-300 flex flex-col md:flex-row items-center gap-5 relative cursor-pointer hover:shadow-lg ${
        isCompared
          ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
          : "border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 shadow-sm"
      }`}
    >
      {/* Image Showcase */}
      <div className="w-32 h-32 md:w-36 md:h-36 bg-slate-50 dark:bg-slate-950 rounded-xl p-3 flex items-center justify-center shrink-0 relative overflow-hidden border border-slate-100 dark:border-slate-800">
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&q=80";
          }}
        />
        {product.discount && (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {product.discount}
          </span>
        )}
      </div>

      {/* Middle Content */}
      <div className="flex-1 min-w-0 space-y-1.5 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {product.brand}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {product.category}
          </span>

          {hasComparison && (
            <span className="bg-purple-100 text-purple-700 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              🏆 Best Price across {comparison.length} stores
            </span>
          )}
        </div>

        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {product.name}
        </h3>

        <div className="flex items-center justify-center md:justify-start gap-3 text-xs text-slate-500 dark:text-slate-400">
          {product.rating && (
            <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
              <FaStar className="text-xs" />
              <span>{product.rating}</span>
              {product.reviews && (
                <span className="text-slate-400 font-normal">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center uppercase ${storeDetail.bg}`}
            >
              {storeDetail.char}
            </span>
            <span>Sold by <strong className="text-slate-700 dark:text-slate-300">{product.store}</strong></span>
          </div>

          <span
            className={`font-semibold ${
              product.availability === "Limited Stock"
                ? "text-amber-600"
                : "text-emerald-600"
            }`}
          >
            ● {product.availability || "In Stock"}
          </span>
        </div>
      </div>

      {/* Pricing & Actions */}
      <div className="flex flex-col items-center md:items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto">
        <div className="text-center md:text-right">
          <div className="text-xl font-black text-slate-900 dark:text-white">
            ₹{product.price.toLocaleString()}
          </div>
          {originalPrice > product.price && (
            <div className="text-xs text-slate-400 line-through">
              MRP: ₹{originalPrice.toLocaleString()}
            </div>
          )}
          {savings > 0 && (
            <div className="text-xs font-bold text-emerald-600">
              Save ₹{savings.toLocaleString()}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlistItem(product);
              if (onWishlistToggle) onWishlistToggle();
            }}
            className="p-2 border border-slate-200 dark:border-slate-800 hover:border-red-300 rounded-xl text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-950 hover:bg-red-50 dark:hover:bg-red-950 transition cursor-pointer"
          >
            {inWishlist ? <FaHeart className="text-red-500" /> : <FiHeart />}
          </button>

          {/* Compare */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`p-2 border rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
              isCompared
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
            }`}
          >
            <FaExchangeAlt />
          </button>

          {/* Price Alert */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenPriceAlert(product);
            }}
            title="Set Price Alert"
            className="p-2 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-50 dark:bg-slate-950 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition cursor-pointer"
          >
            <FiBell />
          </button>

          {/* Main Action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5"
          >
            <span>{hasComparison ? "Compare Deal" : "View"}</span>
            <FiArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTS: Store Comparison Table View
   ========================================================================= */
const ComparisonTableView = ({
  products = [],
  comparisonProducts = {},
  onWishlistToggle,
  isComparedList = [],
  onToggleCompare,
  onOpenPriceAlert,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 w-10"></th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Best Store</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Price</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4 text-center">Multi-Store</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {products.map((product) => {
              const comparison = comparisonProducts[product.name];
              const hasComparison = !!comparison && comparison.length > 0;
              const isLiveProduct = product.live === true;
              const storeDetail = getStoreDetails(product.store);
              const inWishlist = isProductInWishlist(product.name);
              const isCompared = isComparedList.some((p) => p.id === product.id);

              return (
                <tr
                  key={product.id}
                  onClick={() => {
                    if (hasComparison || isLiveProduct) {
                      navigate(`/comparison/${encodeURIComponent(product.name)}`);
                    } else {
                      navigate(`/product/${product.id}`);
                    }
                  }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-950/80 dark:bg-slate-950 transition cursor-pointer group"
                >
                  {/* Compare Toggle */}
                  <td
                    className="py-3 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompare(product);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isCompared}
                      onChange={() => {}}
                      className="accent-indigo-600 w-4 h-4 rounded cursor-pointer"
                    />
                  </td>

                  {/* Product Thumbnail & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition text-xs md:text-sm">
                          {product.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {product.brand} · {product.category}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Store */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center uppercase ${storeDetail.bg}`}
                      >
                        {storeDetail.char}
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{product.store}</span>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-4">
                    {product.rating ? (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md w-max">
                        <FaStar className="text-amber-400 text-[10px]" />
                        <span>{product.rating}</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4">
                    <div className="font-black text-slate-900 dark:text-white text-sm">
                      ₹{product.price.toLocaleString()}
                    </div>
                    {product.originalPrice && (
                      <div className="text-[11px] text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </td>

                  {/* Discount */}
                  <td className="py-3 px-4">
                    {product.discount ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2 py-0.5 rounded-full">
                        {product.discount}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>

                  {/* Multi-Store comparison badge */}
                  <td className="py-3 px-4 text-center">
                    {hasComparison ? (
                      <span className="inline-flex items-center gap-1 bg-purple-50 dark:bg-purple-950 text-purple-700 border border-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        <FiZap className="text-amber-500" />
                        {comparison.length} Stores
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Single Store</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlistItem(product);
                          if (onWishlistToggle) onWishlistToggle();
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition cursor-pointer"
                      >
                        {inWishlist ? (
                          <FaHeart className="text-red-500 text-xs" />
                        ) : (
                          <FiHeart className="text-xs" />
                        )}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (hasComparison) {
                            navigate(`/comparison/${encodeURIComponent(product.name)}`);
                          } else {
                            navigate(`/product/${product.id}`);
                          }
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                      >
                        {hasComparison || isLiveProduct ? "Compare" : "View"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTS: Quick Comparison Side-by-Side Modal
   ========================================================================= */
const QuickCompareModal = ({ isOpen, onClose, products = [], onClear }) => {
  const navigate = useNavigate();
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FaExchangeAlt />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Side-by-Side Comparison</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparing {products.length} selected {products.length === 1 ? "product" : "products"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClear}
              className="text-xs text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        {/* Modal Content / Comparison Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          <div
            className={`grid gap-4 ${
              products.length === 1
                ? "grid-cols-1"
                : products.length === 2
                ? "grid-cols-2"
                : products.length === 3
                ? "grid-cols-3"
                : "grid-cols-4"
            }`}
          >
            {products.map((p) => {
              const storeDetail = getStoreDetails(p.store);
              return (
                <div
                  key={p.id}
                  className="bg-slate-50/70 dark:bg-slate-950/70 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="w-full h-36 bg-white dark:bg-slate-900 rounded-xl p-3 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-800">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {p.brand}
                    </span>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1 line-clamp-2">
                      {p.name}
                    </h4>

                    {/* Price */}
                    <div className="mt-3">
                      <div className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{p.price.toLocaleString()}
                      </div>
                      {p.originalPrice && (
                        <div className="text-xs text-slate-400 line-through">
                          ₹{p.originalPrice.toLocaleString()} ({p.discount})
                        </div>
                      )}
                    </div>

                    {/* Specs / Details */}
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Store:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                          <span
                            className={`w-3.5 h-3.5 rounded text-[8px] font-bold flex items-center justify-center uppercase ${storeDetail.bg}`}
                          >
                            {storeDetail.char}
                          </span>
                          {p.store}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Rating:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                          <FaStar className="text-amber-400 text-xs" /> {p.rating || "4.5"}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Category:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100">{p.category}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Status:</span>
                        <span className="font-semibold text-emerald-600">
                          {p.availability || "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/comparison/${encodeURIComponent(p.name)}`);
                    }}
                    className="mt-5 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Detailed Store Deals
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   COMPONENTS: Quick Price Alert Modal
   ========================================================================= */
const PriceAlertModal = ({ isOpen, onClose, product }) => {
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (product) {
      setTargetPrice(Math.round(product.price * 0.9));
      setIsSubmitted(false);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem("priceAlerts") || "[]");
    const newAlert = {
      id: Date.now(),
      productName: product.name,
      currentPrice: product.price,
      targetPrice: Number(targetPrice),
      email: email || "user@example.com",
      image: product.image,
      store: product.store,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("priceAlerts", JSON.stringify([...stored, newAlert]));
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative animate-scaleUp">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 p-1 rounded-lg"
        >
          <FiX className="text-xl" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 animate-fadeIn">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              <FiCheckCircle />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Price Alert Activated!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              We'll notify you as soon as the price of{" "}
              <strong className="text-slate-700 dark:text-slate-300">{product.name}</strong> drops to ₹
              {Number(targetPrice).toLocaleString()}.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-lg font-bold">
                <FiBell />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Set Price Drop Alert</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Get notified when the price decreases</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 object-contain bg-white dark:bg-slate-900 rounded-lg p-1 border"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{product.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Current: <strong className="text-slate-800 dark:text-slate-100">₹{product.price.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    required
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    max={product.price}
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Suggested target (10% drop): ₹{Math.round(product.price * 0.9).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer mt-2"
              >
                Track Price Drop
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================================
   MAIN COMPONENT: SearchPage
   ========================================================================= */
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const initialCategoryParam = searchParams.get("category") || "";

  // Filter States
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    initialCategoryParam ? [initialCategoryParam] : []
  );
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState("relevance");

  // View States
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'table'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Comparison & Price Alert Modal States
  const [comparedProducts, setComparedProducts] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);
  const [, setWishlistUpdateFlag] = useState(0);

  // Search input state
  const [searchInput, setSearchInput] = useState(query);
  const [liveProducts, setLiveProducts] = useState([]);
  const [liveComparisonProducts, setLiveComparisonProducts] = useState({});
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveSearchError, setLiveSearchError] = useState("");

  // Live search uses the backend so the QuickCommerce API key never reaches the browser.
  useEffect(() => {
    let cancelled = false;

    const searchTerm = query.trim() || "trending smartphones laptops";

    setLiveLoading(true);
    setLiveSearchError("");

    searchLiveProducts(searchTerm)
      .then((response) => {
        if (cancelled) return;
        const products = Array.isArray(response?.products)
          ? response.products
          : Array.isArray(response?.data?.products)
            ? response.data.products
            : Array.isArray(response?.data)
              ? response.data
              : response?.product
                ? [response.product]
                : [];

        const comparisonMap = {};

        // A live comparison is valid only when the exact product
        // is available on all three stores used by this project.
        const requiredStores = ["Amazon", "Flipkart", "Myntra"];

        products.forEach((product) => {
          const comparison = Array.isArray(product?.comparison)
            ? product.comparison
            : [];

          const normalizedComparison = comparison.filter((item) => {
            const store = String(item?.store || "").trim().toLowerCase();
            return requiredStores.some(
              (requiredStore) => store === requiredStore.toLowerCase()
            );
          });

          const stores = new Set(
            normalizedComparison.map((item) =>
              String(item?.store || "").trim().toLowerCase()
            )
          );

          const existsOnAllStores = requiredStores.every((store) =>
            stores.has(store.toLowerCase())
          );

          if (existsOnAllStores && product?.name) {
            // Keep exactly one offer per store.
            const uniqueComparison = requiredStores
              .map((store) =>
                normalizedComparison.find(
                  (item) =>
                    String(item?.store || "").trim().toLowerCase() ===
                    store.toLowerCase()
                )
              )
              .filter(Boolean);

            comparisonMap[product.name] = uniqueComparison;
          }
        });

        setLiveProducts(products);
        setLiveComparisonProducts(comparisonMap);
      })
      .catch((error) => {
        if (cancelled) return;
        setLiveProducts([]);
        setLiveComparisonProducts({});
        setLiveSearchError(error.message || "Unable to load live products.");
        })
      .finally(() => {
        if (!cancelled) setLiveLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategories([cat]);
    }
  }, [searchParams]);

  // Wishlist update listener
  const triggerWishlistUpdate = () => {
    setWishlistUpdateFlag((prev) => prev + 1);
  };

  const sourceProducts = liveProducts;
  const comparisonData = liveComparisonProducts;

  // Distinct Filter options
  const brands = useMemo(
    () => [...new Set(sourceProducts.map((p) => p.brand).filter(Boolean))].sort(),
    [sourceProducts]
  );
  const categories = useMemo(
    () => [...new Set(sourceProducts.map((p) => p.category).filter(Boolean))].sort(),
    [sourceProducts]
  );
  const stores = useMemo(
    () => [...new Set(sourceProducts.map((p) => p.store).filter(Boolean))].sort(),
    [sourceProducts]
  );

  // Counts
  const brandCounts = useMemo(() => {
    return brands.reduce((acc, b) => {
      acc[b] = sourceProducts.filter((p) => p.brand === b).length;
      return acc;
    }, {});
  }, [brands, sourceProducts]);

  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, c) => {
      acc[c] = sourceProducts.filter((p) => p.category === c).length;
      return acc;
    }, {});
  }, [categories, sourceProducts]);

  const storeCounts = useMemo(() => {
    return stores.reduce((acc, s) => {
      acc[s] = sourceProducts.filter((p) => p.store === s).length;
      return acc;
    }, {});
  }, [stores, sourceProducts]);

  // Filter Handlers
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleStoreChange = (store) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStores([]);
    setSelectedRatings([]);
    setSelectedDiscount(0);
    setInStockOnly(false);
    setMinPrice(0);
    setMaxPrice(500000);
    setSortBy("relevance");
    setCurrentPage(1);
  };

  // Compare Toggle
  const toggleCompare = (product) => {
    setComparedProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 4) {
        alert("You can compare a maximum of 4 products at once.");
        return prev;
      }
      return [...prev, product];
    });
  };

  // Active filters count
  const activeFilterCount =
    selectedBrands.length +
    selectedCategories.length +
    selectedStores.length +
    selectedRatings.length +
    (selectedDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (minPrice > 0 || maxPrice < 500000 ? 1 : 0);

  // Search Filter Pipeline
  const filteredProducts = useMemo(() => {
    let list = sourceProducts.filter((product) => {
      const term = query.toLowerCase().trim();
      const matchesSearch =
        !term ||
        String(product.name || "").toLowerCase().includes(term) ||
        String(product.brand || "").toLowerCase().includes(term) ||
        String(product.category || "").toLowerCase().includes(term) ||
        String(product.store || "").toLowerCase().includes(term);

      const matchesBrand =
        selectedBrands.length === 0 || selectedBrands.some(b => b.toLowerCase() === (product.brand || "").toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.some(c => c.toLowerCase() === (product.category || "").toLowerCase());
      const matchesStore =
        selectedStores.length === 0 || selectedStores.some(s => s.toLowerCase() === (product.store || "").toLowerCase());
      const matchesRating =
        selectedRatings.length === 0 || selectedRatings.some((r) => product.rating >= r);
      const parsePrice = (p) => {
        if (typeof p === "number") return p;
        if (typeof p === "string") return Number(p.replace(/[^\d.]/g, "")) || 0;
        return 0;
      };
      const numericPrice = parsePrice(product.price) || 0;
      const matchesPrice =
        numericPrice >= minPrice && numericPrice <= maxPrice;

      const discountVal = parseFloat(product.discount) || 0;
      const matchesDiscount = discountVal >= selectedDiscount;

      const matchesStock = !inStockOnly || product.availability !== "Out of Stock";

      return (
        matchesSearch &&
        matchesBrand &&
        matchesCategory &&
        matchesStore &&
        matchesRating &&
        matchesPrice &&
        matchesDiscount &&
        matchesStock
      );
    });

    // Grouping
    const grouped = query.trim() ? [...list] : [...groupProducts(list)];

    // Sorting
    switch (sortBy) {
      case "low-high":
        grouped.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case "high-low":
        grouped.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case "discount":
        grouped.sort(
          (a, b) => (parseFloat(b.discount) || 0) - (parseFloat(a.discount) || 0)
        );
        break;
      case "rating":
        grouped.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "reviews":
        grouped.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
      default:
        break;
    }

    return grouped;
  }, [
    query,
    selectedBrands,
    selectedCategories,
    selectedStores,
    selectedRatings,
    minPrice,
    maxPrice,
    selectedDiscount,
    inStockOnly,
    sortBy,
    sourceProducts,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Search Submit Handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* App Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-7 flex-1 max-w-7xl w-full mx-auto pb-24">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-slate-600 dark:text-slate-400 font-semibold">Search Products</span>
            {query && (
              <>
                <FiChevronRight className="text-[10px]" />
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold truncate max-w-xs">
                  "{query}"
                </span>
              </>
            )}
          </nav>

          {/* Hero Header Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-6 overflow-hidden shadow-xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold flex items-center gap-1.5">
                    <FiZap className="text-amber-400 fill-amber-400 text-xs" />
                    Multi-Store Price Engine
                  </span>
                  <span className="text-slate-400 text-xs">Live Comparisons</span>
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                  {query ? (
                    <>
                      Results for <span className="text-indigo-400 font-black">"{query}"</span>
                    </>
                  ) : selectedCategories.length === 1 ? (
                    <>
                      Explore <span className="text-indigo-400">{selectedCategories[0]}</span> Deals
                    </>
                  ) : (
                    "Discover & Compare Products"
                  )}
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-1.5 max-w-xl">
                  Compare live prices across Amazon, Flipkart and Myntra to find the lowest available deal.
                </p>
              </div>

              {/* In-Header Search Refine Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 max-w-md w-full"
              >
                <FiSearch className="text-indigo-300 ml-3 text-base" />
                <input
                  type="text"
                  placeholder="Refine search by product or brand..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-400 px-3 py-1.5 text-xs lg:text-sm w-full focus:outline-none"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      setSearchParams({});
                    }}
                    className="text-slate-400 hover:text-white mr-2"
                  >
                    <FiX className="text-sm" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer shrink-0 shadow-sm"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Quick Stats Highlights */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span><strong>{filteredProducts.length}</strong> products matching</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">🏬</span>
                <span><strong>3</strong> Live Store Platforms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚡</span>
                <span>Instant Deal Comparisons</span>
              </div>
            </div>
          </div>

          {query && (liveLoading || liveSearchError) && (
            <div className={`mb-5 rounded-xl border px-4 py-3 text-xs font-semibold ${
              liveSearchError
                ? "bg-rose-50 border-rose-200 text-rose-700"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}>
              {liveLoading && "Searching Amazon, Flipkart and Myntra for live prices…"}
              {!liveLoading && liveSearchError && liveSearchError}
            </div>
          )}

          {/* Quick Category Pills Bar */}
          <div className="mb-6 overflow-x-auto scrollbar-hide py-1">
            <div className="flex items-center gap-2 min-w-max">
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchParams(query ? { q: query } : {});
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  selectedCategories.length === 0
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-950"
                }`}
              >
                <span>🔥</span>
                <span>All Deals</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategories.length === 0 ? "bg-indigo-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {sourceProducts.length}
                </span>
              </button>

              {categories.map((cat) => {
                const isSelected =
                  selectedCategories.length === 1 && selectedCategories[0] === cat;
                const emoji = CATEGORY_EMOJIS[cat] || "🏷️";
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategories([cat]);
                      setSearchParams(query ? { q: query, category: cat } : { category: cat });
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? "bg-indigo-700 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {categoryCounts[cat] || 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800/70 dark:border-slate-800 shadow-xs animate-fadeIn">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
                <FiFilter className="text-indigo-600 dark:text-indigo-400" /> Active Filters:
              </span>

              {selectedCategories.map((c) => (
                <span
                  key={c}
                  className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200/80 text-indigo-700 dark:text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>Category: {c}</span>
                  <button
                    onClick={() => handleCategoryChange(c)}
                    className="hover:text-indigo-900 dark:hover:text-indigo-400"
                  >
                    <FiX />
                  </button>
                </span>
              ))}

              {selectedBrands.map((b) => (
                <span
                  key={b}
                  className="bg-purple-50 dark:bg-purple-950 border border-purple-200/80 text-purple-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>Brand: {b}</span>
                  <button
                    onClick={() => handleBrandChange(b)}
                    className="hover:text-purple-900"
                  >
                    <FiX />
                  </button>
                </span>
              ))}

              {selectedStores.map((s) => (
                <span
                  key={s}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>Store: {s}</span>
                  <button
                    onClick={() => handleStoreChange(s)}
                    className="hover:text-slate-900 dark:hover:text-white dark:text-white"
                  >
                    <FiX />
                  </button>
                </span>
              ))}

              {selectedRatings.map((r) => (
                <span
                  key={r}
                  className="bg-amber-50 dark:bg-amber-950 border border-amber-200 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                >
                  <span>{r}★ & Above</span>
                  <button
                    onClick={() => handleRatingChange(r)}
                    className="hover:text-amber-950"
                  >
                    <FiX />
                  </button>
                </span>
              ))}

              {selectedDiscount > 0 && (
                <span className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span>Min {selectedDiscount}% Discount</span>
                  <button
                    onClick={() => setSelectedDiscount(0)}
                    className="hover:text-emerald-950"
                  >
                    <FiX />
                  </button>
                </span>
              )}

              {inStockOnly && (
                <span className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-700 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span>In Stock Only</span>
                  <button
                    onClick={() => setInStockOnly(false)}
                    className="hover:text-emerald-950"
                  >
                    <FiX />
                  </button>
                </span>
              )}

              {(minPrice > 0 || maxPrice < 500000) && (
                <span className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <span>
                    ₹{minPrice.toLocaleString()} - ₹{maxPrice.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      setMinPrice(0);
                      setMaxPrice(500000);
                    }}
                    className="hover:text-slate-900 dark:hover:text-white dark:text-white"
                  >
                    <FiX />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline ml-auto cursor-pointer"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Controls Toolbar: Results count, View Switcher & Sorting */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 text-indigo-700 dark:text-indigo-400 font-bold text-xs rounded-xl"
              >
                <FiFilter />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              <div>
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "Product" : "Products"} Found
                </span>
                <span className="text-xs text-slate-400 ml-2">
                  (Showing {filteredProducts.length === 0 ? 0 : startIndex + 1}–
                  {Math.min(endIndex, filteredProducts.length)})
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* View Mode Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FiGrid className="text-base" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  title="List View"
                  className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FiList className="text-base" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Multi-Store Matrix Table View"
                  className={`p-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FiLayers className="text-base" />
                </button>
              </div>

              {/* Items Per Page */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <label>Show:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-indigo-400 cursor-pointer"
                >
                  <option value={8}>8 items</option>
                  <option value={12}>12 items</option>
                  <option value={24}>24 items</option>
                  <option value={48}>48 items</option>
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  Sort by:
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="relevance">⭐ Best Match</option>
                    <option value="low-high">💵 Price: Low to High</option>
                    <option value="high-low">💎 Price: High to Low</option>
                    <option value="discount">🔥 Biggest Discount</option>
                    <option value="rating">🌟 Top Rated</option>
                    <option value="reviews">💬 Most Popular</option>
                  </select>
                  <FiChevronDown className="absolute right-2.5 top-3 text-slate-400 pointer-events-none text-xs" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout: Sidebar Filters + Products Showcase */}
          <div className="flex gap-7 items-start">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block">
              <Filters
                brands={brands}
                categories={categories}
                stores={stores}
                selectedBrands={selectedBrands}
                selectedCategories={selectedCategories}
                selectedStores={selectedStores}
                selectedRatings={selectedRatings}
                selectedDiscount={selectedDiscount}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                handleBrandChange={handleBrandChange}
                handleCategoryChange={handleCategoryChange}
                handleStoreChange={handleStoreChange}
                handleRatingChange={handleRatingChange}
                setSelectedDiscount={setSelectedDiscount}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                clearAllFilters={clearAllFilters}
                activeFilterCount={activeFilterCount}
                brandCounts={brandCounts}
                categoryCounts={categoryCounts}
                storeCounts={storeCounts}
              />
            </div>

            {/* Products Container */}
            <div className="flex-1 min-w-0">
              {filteredProducts.length === 0 ? (
                /* Enhanced Empty State */
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-5 text-3xl shadow-inner">
                    🔍
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                    No Matching Products Found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
                    We couldn't find any products matching your specific search filters. Try adjusting price limits or clearing specific tags.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto mb-6">
                    <span className="text-xs text-slate-400 block w-full mb-1">
                      Try popular searches:
                    </span>
                    {["iPhone 16", "MacBook Air", "Galaxy S24", "OnePlus", "Accessories"].map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          clearAllFilters();
                          setSearchParams({ q: term });
                        }}
                        className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded-lg transition cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-fadeIn">
                      {currentProducts.map((product) => (
                        <ProductGridCard
                          key={product.id}
                          product={product}
                          comparisonProducts={comparisonData}
                          onWishlistToggle={triggerWishlistUpdate}
                          isCompared={comparedProducts.some((p) => p.id === product.id)}
                          onToggleCompare={toggleCompare}
                          onOpenPriceAlert={setAlertProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* List View */}
                  {viewMode === "list" && (
                    <div className="space-y-4 animate-fadeIn">
                      {currentProducts.map((product) => (
                        <ProductListCard
                          key={product.id}
                          product={product}
                          comparisonProducts={comparisonData}
                          onWishlistToggle={triggerWishlistUpdate}
                          isCompared={comparedProducts.some((p) => p.id === product.id)}
                          onToggleCompare={toggleCompare}
                          onOpenPriceAlert={setAlertProduct}
                        />
                      ))}
                    </div>
                  )}

                  {/* Matrix Table View */}
                  {viewMode === "table" && (
                    <ComparisonTableView
                      products={currentProducts}
                      comparisonProducts={comparisonData}
                      onWishlistToggle={triggerWishlistUpdate}
                      isComparedList={comparedProducts}
                      onToggleCompare={toggleCompare}
                      onOpenPriceAlert={setAlertProduct}
                    />
                  )}

                  {/* Pagination Bar */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Showing{" "}
                        <strong className="text-slate-800 dark:text-slate-100">
                          {startIndex + 1}–{Math.min(endIndex, filteredProducts.length)}
                        </strong>{" "}
                        of <strong className="text-slate-800 dark:text-slate-100">{filteredProducts.length}</strong>{" "}
                        results
                      </p>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.max(p - 1, 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === 1}
                          className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          Previous
                        </button>

                        <div className="flex items-center gap-1 overflow-x-auto max-w-[320px] scrollbar-hide px-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                              key={page}
                              onClick={() => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                              className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center shrink-0 ${
                                currentPage === page
                                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                  : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700"
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setCurrentPage((p) => Math.min(p + 1, totalPages));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          disabled={currentPage === totalPages}
                          className="px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Bottom Compare Tray */}
      {comparedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 animate-scaleUp max-w-xl w-[92%] sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-400">
              {comparedProducts.length}/4 Selected
            </span>
            <div className="flex -space-x-2 overflow-hidden py-1">
              {comparedProducts.map((p) => (
                <div
                  key={p.id}
                  className="relative group w-9 h-9 rounded-lg bg-white dark:bg-slate-900 p-0.5 border-2 border-slate-800 shadow-sm"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-contain rounded"
                  />
                  <button
                    onClick={() => toggleCompare(p)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] flex items-center justify-center shadow hover:scale-110 transition"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setComparedProducts([])}
              className="text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <FaExchangeAlt />
              <span>Compare Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Quick Compare Modal */}
      <QuickCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        products={comparedProducts}
        onClear={() => {
          setComparedProducts([]);
          setIsCompareModalOpen(false);
        }}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={!!alertProduct}
        onClose={() => setAlertProduct(null)}
        product={alertProduct}
      />

      {/* Mobile Filters Slide-over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
          <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <Filters
              brands={brands}
              categories={categories}
              stores={stores}
              selectedBrands={selectedBrands}
              selectedCategories={selectedCategories}
              selectedStores={selectedStores}
              selectedRatings={selectedRatings}
              selectedDiscount={selectedDiscount}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              handleBrandChange={handleBrandChange}
              handleCategoryChange={handleCategoryChange}
              handleStoreChange={handleStoreChange}
              handleRatingChange={handleRatingChange}
              setSelectedDiscount={setSelectedDiscount}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
              brandCounts={brandCounts}
              categoryCounts={categoryCounts}
              storeCounts={storeCounts}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
            />

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-4 py-3 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow"
            >
              Show {filteredProducts.length} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;