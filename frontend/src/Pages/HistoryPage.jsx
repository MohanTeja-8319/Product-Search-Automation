import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiClock,
  FiTrash2,
  FiArrowRight,
  FiSearch,
  FiExternalLink,
  FiHeart,
  FiBell,
  FiCheck,
  FiChevronRight,
  FiGrid,
  FiList,
  FiTrendingDown,
  FiRotateCcw,
  FiCalendar,
  FiZap,
} from "react-icons/fi";
import { FaHeart, FaRegHeart, FaStar, FaStore } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";

const STORE_STYLES = {
  Amazon: "bg-[#131921] text-amber-400 font-bold",
  Flipkart: "bg-[#2874f0] text-yellow-300 font-extrabold",
  Croma: "bg-[#00838f] text-white font-bold",
  Myntra: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-bold",
  Ajio: "bg-[#2c4152] text-white font-bold",
  "Apple Store": "bg-black text-white font-semibold",
  "Reliance Digital": "bg-[#e42529] text-white font-bold",
};

const DEFAULT_RECENT_PRODUCTS = [
  {
    id: 1,
    name: "Apple iPhone 16",
    brand: "Apple",
    category: "Smartphones",
    image: "/images/apple-iphone-15.jpg",
    price: 78999,
    originalPrice: 85999,
    rating: 4.9,
    discount: "8% OFF",
    store: "Flipkart",
    viewedAt: "10 minutes ago",
    timeGroup: "Today",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphones",
    image: "/images/s24plus.jpg",
    price: 68999,
    originalPrice: 79999,
    rating: 4.8,
    discount: "13% OFF",
    store: "Amazon",
    viewedAt: "2 hours ago",
    timeGroup: "Today",
  },
  {
    id: 51,
    name: "Apple MacBook Air M4",
    brand: "Apple",
    category: "Laptops",
    image: "/images/macbook-air-m4.jpg",
    price: 114999,
    originalPrice: 119999,
    rating: 4.9,
    discount: "4% OFF",
    store: "Apple Store",
    viewedAt: "Yesterday at 6:45 PM",
    timeGroup: "Yesterday",
  },
  {
    id: 54,
    name: "Dell XPS 13",
    brand: "Dell",
    category: "Laptops",
    image: "/images/dell-xps-13.webp",
    price: 129999,
    originalPrice: 145999,
    rating: 4.8,
    discount: "11% OFF",
    store: "Amazon",
    viewedAt: "Yesterday at 2:15 PM",
    timeGroup: "Yesterday",
  },
  {
    id: 45,
    name: "Diamond Drop Earrings",
    brand: "Swarovski",
    category: "Accessories",
    image: "/images/diamond-drop-earrings.webp",
    price: 4999,
    originalPrice: 5999,
    rating: 4.9,
    discount: "16% OFF",
    store: "Amazon",
    viewedAt: "3 days ago",
    timeGroup: "Earlier this week",
  },
  {
    id: 4,
    name: "OnePlus 13",
    brand: "OnePlus",
    category: "Smartphones",
    image: "/images/oneplus13.webp",
    price: 64999,
    originalPrice: 69999,
    rating: 4.7,
    discount: "7% OFF",
    store: "Amazon",
    viewedAt: "4 days ago",
    timeGroup: "Earlier this week",
  },
];

const DEFAULT_RECENT_SEARCHES = [
  { query: "iPhone 16 deals", category: "Smartphones", time: "15 mins ago", results: 12 },
  { query: "MacBook Air M4 16GB", category: "Laptops", time: "3 hours ago", results: 8 },
  { query: "Sony Noise Cancelling Headphones", category: "Audio", time: "Yesterday", results: 16 },
  { query: "Swarovski diamond jewelry under 5000", category: "Accessories", time: "2 days ago", results: 24 },
];

const HistoryPage = () => {
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState(() => {
    const stored = localStorage.getItem("recentProducts");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          return parsed.map((item, idx) => ({
            ...item,
            timeGroup: item.timeGroup || (idx < 2 ? "Today" : idx < 4 ? "Yesterday" : "Earlier this week"),
            viewedAt: item.viewedAt || (idx === 0 ? "Recently" : `${idx + 1} hours ago`),
            originalPrice: item.originalPrice || Math.round((item.price || 50000) * 1.1),
            discount: item.discount || "10% OFF",
          }));
        }
      } catch (e) {}
    }
    localStorage.setItem("recentProducts", JSON.stringify(DEFAULT_RECENT_PRODUCTS));
    return DEFAULT_RECENT_PRODUCTS;
  });

  const [recentSearches, setRecentSearches] = useState(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return DEFAULT_RECENT_SEARCHES;
  });

  const [activeTab, setActiveTab] = useState("products"); // 'products' | 'searches'
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [wishlistRefresh, setWishlistRefresh] = useState(0);

  useEffect(() => {
    localStorage.setItem("recentProducts", JSON.stringify(historyItems));
  }, [historyItems]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const clearAllHistory = () => {
    if (activeTab === "products") {
      setHistoryItems([]);
      localStorage.removeItem("recentProducts");
      triggerToast("Browsed products history cleared.");
    } else {
      setRecentSearches([]);
      localStorage.removeItem("recentSearches");
      triggerToast("Search queries history cleared.");
    }
  };

  const removeSingleItem = (id, name, e) => {
    if (e) e.stopPropagation();
    setHistoryItems((prev) => prev.filter((p) => p.id !== id));
    triggerToast(`Removed "${name}" from browsing history.`);
  };

  const removeSingleSearch = (query, e) => {
    if (e) e.stopPropagation();
    setRecentSearches((prev) => prev.filter((s) => s.query !== query));
    triggerToast(`Removed search query "${query}".`);
  };

  const handleWishlistToggle = (product, e) => {
    if (e) e.stopPropagation();
    const { added } = toggleWishlistItem(product);
    setWishlistRefresh((prev) => prev + 1);
    triggerToast(
      added
        ? `Added "${product.name}" to Wishlist.`
        : `Removed "${product.name}" from Wishlist.`
    );
  };

  // Categories list
  const categories = useMemo(() => {
    const cats = [...new Set(historyItems.map((i) => i.category || "General"))];
    return ["All", ...cats];
  }, [historyItems]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return historyItems.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [historyItems, searchQuery, categoryFilter]);

  // Group by time
  const groupedProducts = useMemo(() => {
    const groups = {};
    filteredProducts.forEach((item) => {
      const group = item.timeGroup || "Recently Viewed";
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  }, [filteredProducts]);

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-28">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Browsing History</span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-3">
                  <FiClock className="text-indigo-300 text-xs" />
                  Activity & Browsing Timeline
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Your Browsing History
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Pick up right where you left off. Revisit viewed items, compare historical prices, or re-run recent search queries.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={clearAllHistory}
                  disabled={
                    activeTab === "products"
                      ? historyItems.length === 0
                      : recentSearches.length === 0
                  }
                  className="px-4 py-2.5 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 dark:bg-slate-900 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md disabled:opacity-40"
                >
                  <FiTrash2 className="text-sm" />
                  <span>Clear {activeTab === "products" ? "Products" : "Searches"}</span>
                </button>

                <button
                  onClick={() => navigate("/search")}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiSearch className="text-sm stroke-[3]" />
                  <span>Explore New Deals</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-lg">
                  📦
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    {historyItems.length} Products
                  </div>
                  <div className="text-[11px] text-slate-400">Viewed Items</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300 text-lg">
                  🔍
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    {recentSearches.length} Queries
                  </div>
                  <div className="text-[11px] text-slate-400">Saved Searches</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg">
                  💰
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">Up to 16%</div>
                  <div className="text-[11px] text-slate-400">Average Drop Found</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 text-lg">
                  ⚡
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">Instant Sync</div>
                  <div className="text-[11px] text-slate-400">Local Device History</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar: Dual Tabs, Categories Filter, Search */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-4 mb-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "products"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>📦 Viewed Products ({historyItems.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("searches")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "searches"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>🔍 Search Queries ({recentSearches.length})</span>
              </button>
            </div>

            {/* Category Pills & Search if in Products tab */}
            {activeTab === "products" && (
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                  {categories.map((cat) => {
                    const isSelected = categoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Search input */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100 w-44"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ================= TAB 1: VIEWED PRODUCTS ================= */}
          {activeTab === "products" ? (
            filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                  <FiClock />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {searchQuery || categoryFilter !== "All"
                    ? "No Matching Items Found"
                    : "No Browsing History"}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                  Products and price comparisons you view will automatically appear here.
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                {Object.entries(groupedProducts).map(([groupTitle, products]) => (
                  <div key={groupTitle} className="space-y-4">
                    {/* Time Group Header */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <h2 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                        {groupTitle}
                      </h2>
                      <span className="text-xs text-slate-400 font-semibold">
                        ({products.length})
                      </span>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {products.map((product) => {
                        const inWish = isProductInWishlist(product.name);
                        const storeBadgeStyle =
                          STORE_STYLES[product.store] || "bg-indigo-600 text-white font-bold";
                        const comparison = comparisonProducts[product.name];
                        const hasComparison = !!comparison && comparison.length > 0;

                        return (
                          <div
                            key={product.id}
                            className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 hover:border-indigo-300 p-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                          >
                            {/* Top Badges & Controls */}
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`text-[9px] px-2 py-0.5 rounded uppercase ${storeBadgeStyle}`}
                              >
                                {product.store || "Amazon"}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleWishlistToggle(product, e)}
                                  title={inWish ? "In Wishlist" : "Add to Wishlist"}
                                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                                >
                                  {inWish ? (
                                    <FaHeart className="text-rose-500 text-xs" />
                                  ) : (
                                    <FaRegHeart className="text-xs" />
                                  )}
                                </button>

                                <button
                                  onClick={(e) =>
                                    removeSingleItem(product.id, product.name, e)
                                  }
                                  title="Remove from history"
                                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                                >
                                  <FiTrash2 className="text-xs" />
                                </button>
                              </div>
                            </div>

                            {/* Product Image */}
                            <div
                              onClick={() => {
                                if (hasComparison) {
                                  navigate(
                                    `/comparison/${encodeURIComponent(product.name)}`
                                  );
                                } else {
                                  navigate(
                                    `/search?q=${encodeURIComponent(product.name)}`
                                  );
                                }
                              }}
                              className="w-full h-40 bg-slate-50/80 dark:bg-slate-950/80 dark:bg-slate-950 rounded-2xl p-4 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-800 overflow-hidden cursor-pointer select-none"
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                                }}
                              />
                            </div>

                            {/* Details */}
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                  {product.brand} · {product.category}
                                </span>
                                {product.discount && (
                                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                                    {product.discount}
                                  </span>
                                )}
                              </div>

                              <h3
                                onClick={() => {
                                  if (hasComparison) {
                                    navigate(
                                      `/comparison/${encodeURIComponent(product.name)}`
                                    );
                                  } else {
                                    navigate(
                                      `/search?q=${encodeURIComponent(product.name)}`
                                    );
                                  }
                                }}
                                className="font-bold text-xs text-slate-900 dark:text-white leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition cursor-pointer"
                              >
                                {product.name}
                              </h3>

                              {/* Price */}
                              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                                <div>
                                  <span className="text-base font-black text-slate-900 dark:text-white">
                                    ₹{product.price.toLocaleString()}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-[11px] text-slate-400 line-through ml-1.5">
                                      ₹{product.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>

                                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                                  <FiClock className="text-[9px]" /> {product.viewedAt}
                                </span>
                              </div>
                            </div>

                            {/* View Deal Button */}
                            <button
                              onClick={() => {
                                if (hasComparison) {
                                  navigate(
                                    `/comparison/${encodeURIComponent(product.name)}`
                                  );
                                } else {
                                  navigate(
                                    `/search?q=${encodeURIComponent(product.name)}`
                                  );
                                }
                              }}
                              className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <span>{hasComparison ? "Compare Stores" : "View Deal"}</span>
                              <FiArrowRight className="text-xs" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* ================= TAB 2: RECENT SEARCHES ================= */
            <div className="space-y-4 animate-fadeIn">
              {recentSearches.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-16 text-center shadow-sm">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
                    <FiSearch />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                    No Search History
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                    Your recent keyword queries and catalog lookups will appear here for fast re-searching.
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                  >
                    Search Products
                  </button>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Recent Search Inquiries
                    </h2>
                    <span className="text-xs text-slate-400 font-semibold">
                      Click any search to re-execute immediately
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {recentSearches.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                        className="py-3.5 flex items-center justify-between hover:bg-indigo-50/40 dark:hover:bg-indigo-950/40 px-3 rounded-2xl transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm transition">
                            <FiSearch />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                              "{item.query}"
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              {item.category} · {item.results} results found · {item.time}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/search?q=${encodeURIComponent(item.query)}`);
                            }}
                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Re-search</span>
                            <FiArrowRight className="text-[10px]" />
                          </button>

                          <button
                            onClick={(e) => removeSingleSearch(item.query, e)}
                            title="Remove search"
                            className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition cursor-pointer"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Banner */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-blue-50/60 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-blue-950/60 border border-indigo-100/60 dark:border-indigo-900/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <FiRotateCcw className="text-xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  Smart Session Storage & Privacy
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                  Your browsing timeline is safely preserved on your local device for instant retrieval anytime.
                </p>
              </div>
            </div>

            <button
              onClick={clearAllHistory}
              className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-300 text-rose-600 font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <FiTrash2 className="text-xs" />
              <span>Clear History</span>
            </button>
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-800 text-xs font-bold transition duration-300 z-50 animate-bounce backdrop-blur-md">
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white shrink-0">
            <FiCheck className="stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
