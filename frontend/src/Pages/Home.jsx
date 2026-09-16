import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch,
  FiArrowRight,
  FiHeart,
  FiTag,
  FiStar,
  FiX,
  FiChevronRight,
  FiPercent,
  FiGrid,
  FiZap,
  FiShoppingBag,
  FiShield,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { FaHeart, FaStar, FaStore, FaExchangeAlt, FaFire, FaRobot } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import { searchLiveProducts } from "../utils/api";

const STORE_CONFIG = {
  Amazon: { bg: "bg-[#131921] text-amber-400", char: "a", label: "Amazon" },
  Flipkart: { bg: "bg-[#2874f0] text-yellow-300", char: "f", label: "Flipkart" },
  Croma: { bg: "bg-[#00838f] text-white", char: "croma", label: "Croma" },
  Myntra: { bg: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white", char: "M", label: "Myntra" },
  Ajio: { bg: "bg-[#2c4152] text-white", char: "AJIO", label: "Ajio" },
  "Reliance Digital": { bg: "bg-[#e42529] text-white", char: "RD", label: "Reliance" },
  "Apple Store": { bg: "bg-black text-white", char: "", label: "Apple" },
};

const getStoreDetails = (storeName) => {
  return STORE_CONFIG[storeName] || {
    bg: "bg-indigo-600 text-white",
    char: storeName ? storeName[0].toUpperCase() : "S",
    label: storeName || "Store",
  };
};

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [, setWishlistVersion] = useState(0);

  // Smart Recommendation Modal State
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [recCategory, setRecCategory] = useState("Smartphones");
  const [recBudget, setRecBudget] = useState("all");
  const [recPriority, setRecPriority] = useState("balanced");
  const [recResult, setRecResult] = useState(null);

  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoadingInitial(true);
        const res = await searchLiveProducts("trending smartwatches smartphones");
        if (res && res.products) {
          setTrendingProducts(res.products.slice(0, 8));
          const deals = res.products.filter(p => parseInt(p.discount || "0") >= 10);
          setBestDeals(deals.length >= 4 ? deals.slice(0, 4) : res.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to load initial live products", err);
      } finally {
        setLoadingInitial(false);
      }
    };
    fetchInitial();
  }, []);

  // Search Handler
  const handleSearch = (customTerm) => {
    const query = customTerm !== undefined ? customTerm : search;
    if (query.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleWishlistClick = (e, product) => {
    e.stopPropagation();
    toggleWishlistItem(product);
    setWishlistVersion((prev) => prev + 1);
  };

  // Popular search tags
  const popularSearches = [
    "iPhone 16",
    "HP Laptop",
    "AirPods",
    "Smart Watch",
  ];

  // 8 Specific Categories requested
  const categoriesList = [
    {
      name: "Mobiles",
      icon: "📱",
      searchKey: "Smartphones",
      count: "40+ Deals",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      name: "Laptops",
      icon: "💻",
      searchKey: "Laptops",
      count: "25+ Deals",
      gradient: "from-indigo-600 to-purple-600",
    },
    {
      name: "Audio",
      icon: "🎧",
      searchKey: "Headphones",
      count: "20+ Deals",
      gradient: "from-violet-600 to-pink-600",
    },
    {
      name: "Wearables",
      icon: "⌚",
      searchKey: "Smartwatches",
      count: "15+ Deals",
      gradient: "from-teal-500 to-cyan-600",
    },
    {
      name: "Cameras",
      icon: "📷",
      searchKey: "Camera",
      count: "10+ Deals",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      name: "Gaming",
      icon: "🎮",
      searchKey: "Gaming",
      count: "18+ Deals",
      gradient: "from-rose-500 to-red-600",
    },
    {
      name: "Home",
      icon: "🏠",
      searchKey: "Home Appliances",
      count: "15+ Deals",
      gradient: "from-amber-500 to-orange-600",
    },
    {
      name: "Fashion",
      icon: "👟",
      searchKey: "Clothing",
      count: "30+ Deals",
      gradient: "from-pink-500 to-rose-600",
    },
  ];




  // Smart Recommendation Logic
  const handleFindBestProduct = () => {
    let matches = dummyProducts.filter((p) => {
      const matchCat =
        recCategory === "all" ||
        (p.category || "").toLowerCase().includes(recCategory.toLowerCase()) ||
        (p.name || "").toLowerCase().includes(recCategory.toLowerCase());
      return matchCat;
    });

    if (recBudget === "budget") {
      matches = matches.filter((p) => p.price <= 25000);
    } else if (recBudget === "mid") {
      matches = matches.filter((p) => p.price > 25000 && p.price <= 60000);
    } else if (recBudget === "premium") {
      matches = matches.filter((p) => p.price > 60000);
    }

    if (recPriority === "rating") {
      matches.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (recPriority === "discount") {
      matches.sort(
        (a, b) =>
          parseInt(b.discount || "0", 10) - parseInt(a.discount || "0", 10)
      );
    } else {
      matches.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    }

    const topPick = matches[0] || dummyProducts[0];
    setRecResult(topPick);
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Global App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Global Navbar with Search, ThemeToggle, Notifications & Profile */}
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-24">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Home</span>
            <FiChevronRight className="text-[10px]" />
            <span className="text-slate-500 dark:text-slate-400">Multi-Store Product Compare</span>
          </nav>

          {/* =====================================================================
              1. HERO BANNER
              Consistent with CategoriesPage & other app headers
              ===================================================================== */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-10 mb-8 overflow-hidden shadow-xl">
            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8">
                {/* Header Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-3.5">
                  <FiZap className="text-amber-400 text-xs" />
                  <span>Real-Time Multi-Store Product Search & Comparison</span>
                </div>

                {/* Hero Headline */}
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                  Search Once.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-cyan-300">
                    Compare Everywhere.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-slate-300 text-xs sm:text-sm lg:text-base mt-3 max-w-xl leading-relaxed">
                  Find the best products and prices across multiple online stores. Compare prices, ratings, and discounts from Amazon, Flipkart, Croma, and more.
                </p>

                {/* Integrated Search Box */}
                <div className="mt-6 max-w-xl">
                  <div className="flex items-center bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-inner">
                    <span className="text-base ml-3 mr-2 text-indigo-200">🔍</span>
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Search for a product..."
                      className="bg-transparent text-white placeholder-slate-400 px-2 py-2 text-xs sm:text-sm w-full focus:outline-none font-medium"
                    />
                    <button
                      onClick={() => handleSearch()}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-sm cursor-pointer shrink-0"
                    >
                      Search
                    </button>
                  </div>

                  {/* Popular Searches */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      Popular:
                    </span>
                    {popularSearches.map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setSearch(item);
                          handleSearch(item);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 dark:bg-slate-900 border border-white/15 text-xs font-medium text-slate-200 transition cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Metrics Badge Column */}
              <div className="lg:col-span-4 hidden lg:grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-black text-white">15,000+</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Products Tracked</div>
                </div>
                <div className="bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-black text-white">7+ Stores</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Verified Retailers</div>
                </div>
                <div className="bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-black text-amber-400">Live Deals</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Auto-Aggregated</div>
                </div>
                <div className="bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-2xl font-black text-emerald-400">Up to 35%</div>
                  <div className="text-[11px] text-slate-300 mt-0.5 font-medium">Money Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================================
              2. EXPLORE CATEGORIES SECTION
              ===================================================================== */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-0.5">
                  <FiGrid className="text-xs" />
                  <span>Browse by Department</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Explore Categories
                </h2>
              </div>

              <button
                onClick={() => navigate("/categories")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Categories</span>
                <FiChevronRight className="text-xs" />
              </button>
            </div>

            {/* 8 Category Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
              {categoriesList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    navigate(`/search?category=${encodeURIComponent(cat.searchKey)}`)
                  }
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-3.5 flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center text-2xl mb-2.5 shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    {cat.icon}
                  </div>

                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                    {cat.name}
                  </h3>

                  <span className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 font-semibold mt-1">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* =====================================================================
              3. TRENDING PRODUCTS SECTION
              ===================================================================== */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-0.5">
                  <FaFire className="text-xs" />
                  <span>Popular Inquiries</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Trending Products 🔥
                </h2>
              </div>

              <button
                onClick={() => navigate("/search")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Products</span>
                <FiChevronRight className="text-xs" />
              </button>
            </div>

            {/* Trending Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingProducts.map((product) => {
                const inWishlist = isProductInWishlist(product.name);
                const comparison = comparisonProducts[product.name];
                const hasComparison = !!comparison && comparison.length > 0;
                const storeDetail = getStoreDetails(product.store);

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigate(`/comparison/${encodeURIComponent(product.name)}`);
                    }}
                    className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 rounded-3xl p-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg relative cursor-pointer"
                  >
                    <div>
                      {/* Top Badges & Wishlist */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 dark:text-indigo-300 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {product.category}
                        </span>

                        <button
                          onClick={(e) => handleWishlistClick(e, product)}
                          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                          className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          {inWishlist ? (
                            <FaHeart className="text-rose-600 text-xs" />
                          ) : (
                            <FiHeart className="text-xs" />
                          )}
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="w-full h-40 bg-slate-50/70 dark:bg-slate-950/70 dark:bg-slate-950/60 rounded-2xl p-3 flex items-center justify-center mb-3.5 border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                          }}
                        />
                      </div>

                      {/* Brand, Rating & Store */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {product.brand}
                        </span>

                        {product.rating && (
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950 dark:bg-amber-400/10 px-1.5 py-0.5 rounded">
                            <FaStar className="text-[10px]" />
                            <span>{product.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Product Name */}
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {product.name}
                      </h3>
                    </div>

                    {/* Pricing & Action */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline justify-between mb-3">
                        <div>
                          <span className="text-base font-black text-slate-900 dark:text-white">
                            ₹{product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through ml-1.5 font-normal">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        {product.discount && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            {product.discount}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comparison/${encodeURIComponent(product.name)}`);
                        }}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FaExchangeAlt className="text-[10px]" />
                        <span>Compare Stores</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              4. BEST DEALS SECTION
              ===================================================================== */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
                  <FiPercent className="text-xs" />
                  <span>Maximum Savings</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Best Deals & Discounts 💰
                </h2>
              </div>

              <button
                onClick={() => navigate("/search")}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All Deals</span>
                <FiChevronRight className="text-xs" />
              </button>
            </div>

            {/* Deals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {bestDeals.map((deal) => {
                const comparison = comparisonProducts[deal.name];
                const hasComparison = !!comparison && comparison.length > 0;
                const savings =
                  deal.originalPrice && deal.originalPrice > deal.price
                    ? deal.originalPrice - deal.price
                    : 0;

                return (
                  <div
                    key={deal.id}
                    onClick={() => {
                      navigate(`/comparison/${encodeURIComponent(deal.name)}`);
                    }}
                    className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 rounded-3xl p-4 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      {/* Top Save Tag */}
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="bg-emerald-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                          <FiTag className="text-[9px]" />
                          {deal.discount}
                        </span>

                        <span className="text-[10px] font-bold text-slate-400">
                          {deal.store}
                        </span>
                      </div>

                      {/* Image */}
                      <div className="w-full h-36 bg-slate-50/70 dark:bg-slate-950/70 dark:bg-slate-950/60 rounded-2xl p-3 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-800">
                        <img
                          src={deal.image}
                          alt={deal.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                          }}
                        />
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {deal.name}
                      </h3>

                      {savings > 0 && (
                        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                          Save ₹{savings.toLocaleString()} on purchase
                        </p>
                      )}
                    </div>

                    <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ₹{deal.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{deal.originalPrice?.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/comparison/${encodeURIComponent(deal.name)}`);
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
                      >
                        Compare Stores →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* =====================================================================
              5. SMART RECOMMENDATION SECTION
              ===================================================================== */}
          <section className="mb-10">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-3xl shrink-0 font-bold">
                    🤖
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 dark:bg-indigo-500/20 px-2 py-0.5 rounded-md">
                      Smart Assistant
                    </span>
                    <h2 className="text-lg lg:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      Not sure what to buy?
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      Tell us your requirements and budget. We'll pick the best value option for you.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setShowRecommendationModal(true);
                      handleFindBestProduct();
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer flex items-center gap-2"
                  >
                    <FaRobot className="text-sm" />
                    <span>Find My Best Product</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom App Metrics Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold">
                📦
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">15,000+</div>
                <div className="text-xs font-semibold text-slate-400">Products Tracked</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl font-bold">
                🏪
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">7+ Stores</div>
                <div className="text-xs font-semibold text-slate-400">Multi-Retailer Engine</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl font-bold">
                🔔
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">5,400+</div>
                <div className="text-xs font-semibold text-slate-400">Price Alerts Sent</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
                💰
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">₹3.2 Lakh+</div>
                <div className="text-xs font-semibold text-slate-400">User Savings Generated</div>
              </div>
            </div>
          </div>
        </main>

        {/* =====================================================================
            SIMPLE FOOTER (HOME PAGE ONLY)
            ===================================================================== */}
        <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 py-8 px-4 lg:px-8 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            {/* Left Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                🔍
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Price<span className="text-indigo-600 dark:text-indigo-400">Scout</span>
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 dark:text-slate-400 ml-2 hidden sm:inline">
                  Search Once. Compare Everywhere.
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
              <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Home
              </Link>
              <Link to="/search" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Search
              </Link>
              <Link to="/categories" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Categories
              </Link>
              <Link to="/comparison" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Compare
              </Link>
              <Link to="/wishlist" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Wishlist
              </Link>
              <Link to="/support" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Help & Support
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-[11px] text-slate-400 text-center md:text-right">
              © 2026 PriceScout. All rights reserved.
            </p>
          </div>
        </footer>

        {/* Global Modal for Smart Recommendation */}
        {showRecommendationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowRecommendationModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <FiX className="text-base" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl font-bold">
                  🤖
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Smart Product Advisor
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select your preferences to find the best match
                  </p>
                </div>
              </div>

              {/* Selectors */}
              <div className="space-y-3.5 text-xs">
                {/* 1. Category */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    1. What category are you looking for?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Smartphones", "Laptops", "Headphones", "Accessories", "Clothing"].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setRecCategory(cat);
                            setTimeout(handleFindBestProduct, 50);
                          }}
                          className={`py-2 px-2.5 rounded-xl font-bold transition border cursor-pointer text-xs ${
                            recCategory === cat
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 border-slate-200 dark:border-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 2. Budget */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    2. Select Budget
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "all", label: "Any Budget" },
                      { id: "budget", label: "Under ₹25k" },
                      { id: "mid", label: "₹25k – ₹60k" },
                      { id: "premium", label: "₹60,000+" },
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          setRecBudget(b.id);
                          setTimeout(handleFindBestProduct, 50);
                        }}
                        className={`py-2 px-2.5 rounded-xl font-bold transition border cursor-pointer text-xs ${
                          recBudget === b.id
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 border-slate-200 dark:border-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Priority */}
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    3. Priority
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "balanced", label: "Best Overall" },
                      { id: "rating", label: "Top Rated ⭐" },
                      { id: "discount", label: "Max Discount" },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setRecPriority(p.id);
                          setTimeout(handleFindBestProduct, 50);
                        }}
                        className={`py-2 px-2.5 rounded-xl font-bold transition border cursor-pointer text-xs ${
                          recPriority === p.id
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                            : "bg-slate-50 dark:bg-slate-950 dark:bg-slate-800 border-slate-200 dark:border-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Top Pick Result */}
              {recResult && (
                <div className="mt-5 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/80 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    Top Recommended Match
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-xl p-2 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800">
                      <img
                        src={recResult.image}
                        alt={recResult.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=150";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {recResult.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                          ₹{recResult.price.toLocaleString()}
                        </span>
                        {recResult.discount && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                            {recResult.discount}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          ⭐ {recResult.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowRecommendationModal(false);
                      navigate(`/comparison/${encodeURIComponent(recResult.name)}`);
                    }}
                    className="w-full mt-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl transition shadow-sm cursor-pointer"
                  >
                    View & Compare This Product →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;