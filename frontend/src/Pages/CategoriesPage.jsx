import React, { useState, useMemo, useEffect } from "react";
import { searchLiveProducts } from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch,
  FiGrid,
  FiLayers,
  FiArrowRight,
  FiTrendingUp,
  FiZap,
  FiCheckCircle,
  FiTag,
  FiStar,
  FiChevronRight,
  FiShoppingBag,
  FiShield,
  FiClock,
  FiExternalLink,
} from "react-icons/fi";
import { FaFire, FaStore, FaExchangeAlt, FaStar } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";

// Comprehensive Category Metadata with Icons, Images, Tags & Departments
const CATEGORY_META = [
  {
    name: "Smartphones",
    searchKey: "Smartphones",
    department: "Electronics",
    icon: "📱",
    gradient: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50/70 dark:bg-blue-950/70 border-blue-200/60",
    textGradient: "from-blue-600 to-indigo-600",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80",
    description: "Compare flagships, 5G smartphones & budget champions across verified retailers.",
    topBrands: ["Apple", "Samsung", "OnePlus", "Xiaomi", "Google", "Vivo", "Nothing"],
    featuredStores: ["Amazon", "Flipkart", "Croma", "Reliance Digital"],
    minPriceEstimate: 15999,
  },
  {
    name: "Laptops",
    searchKey: "Laptops",
    department: "Electronics",
    icon: "💻",
    gradient: "from-indigo-600 to-purple-600",
    bgLight: "bg-indigo-50/70 dark:bg-indigo-950/70 border-indigo-200/60",
    textGradient: "from-indigo-600 to-purple-600",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80",
    description: "MacBooks, ultrabooks, thin & lights, and high-performance gaming laptops.",
    topBrands: ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer"],
    featuredStores: ["Amazon", "Flipkart", "Apple Store", "Reliance Digital"],
    minPriceEstimate: 49999,
  },
  {
    name: "Headphones",
    searchKey: "Headphones",
    department: "Audio",
    icon: "🎧",
    gradient: "from-violet-600 to-pink-600",
    bgLight: "bg-violet-50/70 dark:bg-violet-950/70 border-violet-200/60",
    textGradient: "from-violet-600 to-pink-600",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
    description: "Active noise-canceling headphones, premium over-ears & true wireless earbuds.",
    topBrands: ["Sony", "Bose", "Apple", "boAt", "JBL", "Sennheiser"],
    featuredStores: ["Amazon", "Flipkart", "Croma"],
    minPriceEstimate: 999,
  },
  {
    name: "Accessories",
    searchKey: "Accessories",
    department: "Fashion & Lifestyle",
    icon: "💎",
    gradient: "from-amber-500 to-rose-500",
    bgLight: "bg-amber-50/70 dark:bg-amber-950/70 border-amber-200/60",
    textGradient: "from-amber-600 to-rose-600",
    image: "https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=300&q=80",
    description: "Designer jewelry, silver earrings, bracelets, pendants & luxury gifts.",
    topBrands: ["GIVA", "Swarovski", "Yellow Chimes", "Voylla", "Rubans", "Shaya"],
    featuredStores: ["Amazon", "Myntra", "Flipkart"],
    minPriceEstimate: 899,
  },
  {
    name: "Fashion & Clothing",
    searchKey: "Clothing",
    department: "Fashion & Lifestyle",
    icon: "👕",
    gradient: "from-rose-500 to-orange-500",
    bgLight: "bg-rose-50/70 dark:bg-rose-950/70 border-rose-200/60",
    textGradient: "from-rose-600 to-orange-600",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80",
    description: "Sportswear, casual denim jeans, designer maxi dresses, ethnic kurtas & tees.",
    topBrands: ["Nike", "Levi's", "Zara", "Biba", "Puma", "H&M"],
    featuredStores: ["Myntra", "Ajio", "Amazon", "Flipkart"],
    minPriceEstimate: 1399,
  },
  {
    name: "Smartwatches",
    searchKey: "Smartwatches",
    department: "Electronics",
    icon: "⌚",
    gradient: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50/70 dark:bg-teal-950/70 border-teal-200/60",
    textGradient: "from-teal-600 to-cyan-600",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
    description: "Fitness trackers, GPS running watches, cellular smartwatches & AMOLED bands.",
    topBrands: ["Apple", "Samsung", "Garmin", "Noise", "Fire-Boltt", "Amazfit"],
    featuredStores: ["Amazon", "Flipkart", "Croma"],
    minPriceEstimate: 2499,
  },
  {
    name: "Cameras & Photography",
    searchKey: "Camera",
    department: "Electronics",
    icon: "📷",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50/70 dark:bg-emerald-950/70 border-emerald-200/60",
    textGradient: "from-emerald-600 to-teal-600",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=300&q=80",
    description: "Mirrorless cameras, full-frame DSLRs, vlogging cameras & action cams.",
    topBrands: ["Sony", "Canon", "Nikon", "Fujifilm", "GoPro"],
    featuredStores: ["Amazon", "Flipkart", "Reliance Digital"],
    minPriceEstimate: 28999,
  },
  {
    name: "Televisions & Smart TVs",
    searchKey: "TV",
    department: "Home & Appliances",
    icon: "📺",
    gradient: "from-red-500 to-purple-600",
    bgLight: "bg-red-50/70 dark:bg-red-950/70 border-red-200/60",
    textGradient: "from-red-600 to-purple-600",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&q=80",
    description: "4K OLED, QLED, Mini-LED smart televisions with Dolby Vision & Atmos.",
    topBrands: ["Samsung", "LG", "Sony", "Xiaomi", "OnePlus", "TCL"],
    featuredStores: ["Amazon", "Flipkart", "Croma", "Reliance Digital"],
    minPriceEstimate: 19999,
  },
  {
    name: "Tablets & iPads",
    searchKey: "Tablet",
    department: "Electronics",
    icon: "📱",
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50/70 dark:bg-sky-950/70 border-sky-200/60",
    textGradient: "from-sky-600 to-blue-600",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80",
    description: "Productivity tablets, iPad Pro, iPad Air, Galaxy Tabs & drawing screens.",
    topBrands: ["Apple", "Samsung", "Lenovo", "Xiaomi", "OnePlus"],
    featuredStores: ["Amazon", "Flipkart", "Apple Store"],
    minPriceEstimate: 17999,
  },
  {
    name: "Home Appliances",
    searchKey: "Appliances",
    department: "Home & Appliances",
    icon: "🧊",
    gradient: "from-cyan-500 to-teal-600",
    bgLight: "bg-cyan-50/70 dark:bg-cyan-950/70 border-cyan-200/60",
    textGradient: "from-cyan-600 to-teal-600",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300&q=80",
    description: "Smart refrigerators, washing machines, air purifiers, robotic vacuums & microwaves.",
    topBrands: ["LG", "Samsung", "Dyson", "Philips", "Whirlpool", "Bosch"],
    featuredStores: ["Amazon", "Flipkart", "Croma", "Reliance Digital"],
    minPriceEstimate: 8999,
  },
];

const DEPARTMENTS = ["All Departments", "Electronics", "Fashion & Lifestyle", "Audio", "Home & Appliances"];

const CategoriesPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [activePreviewCategory, setActivePreviewCategory] = useState("Smartphones");

  // Calculate dynamic product counts from dummyProducts
  const categoryCounts = useMemo(() => {
    return CATEGORY_META.reduce((acc, cat) => {
      const count = dummyProducts.filter((p) => {
        const catLower = (p.category || "").toLowerCase();
        const searchKeyLower = cat.searchKey.toLowerCase();
        const nameLower = (p.name || "").toLowerCase();
        return (
          catLower.includes(searchKeyLower) ||
          catLower === cat.name.toLowerCase() ||
          nameLower.includes(searchKeyLower)
        );
      }).length;
      acc[cat.name] = Math.max(count, 5); // ensure realistic counts
      return acc;
    }, {});
  }, []);

  // Filter categories by Department and Search Query
  const filteredCategories = useMemo(() => {
    return CATEGORY_META.filter((cat) => {
      const matchesSearch =
        !searchQuery ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.topBrands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDept =
        selectedDept === "All Departments" || cat.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDept]);

  const [previewProducts, setPreviewProducts] = useState([]);
  
  useEffect(() => {
    let active = true;
    const fetchPreviews = async () => {
      setPreviewProducts([]);
      const activeMeta = CATEGORY_META.find((c) => c.name === activePreviewCategory);
      const key = activeMeta ? activeMeta.searchKey : "smartphones";
      try {
        const res = await searchLiveProducts(key);
        if (active && res && res.products) {
          setPreviewProducts(res.products.slice(0, 4));
        }
      } catch (err) {}
    };
    fetchPreviews();
    return () => { active = false; };
  }, [activePreviewCategory]);

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200 flex flex-col font-sans">
      {/* App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Product Categories</span>
          </nav>

          {/* Hero Banner */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-3">
                  <FiGrid className="text-amber-400 text-xs" />
                  Explore Catalog by Category
                </div>

                <h1 className="text-2xl lg:text-4xl font-extrabold tracking-tight">
                  Product Categories Directory
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-2 max-w-xl leading-relaxed">
                  Browse top departments, compare prices across 7+ verified multi-store retailers, and find instant lowest price deals.
                </p>
              </div>

              {/* Instant Search in Categories */}
              <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2 max-w-md w-full shadow-inner">
                <FiSearch className="text-indigo-300 ml-3 text-base" />
                <input
                  type="text"
                  placeholder="Search categories, items or brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white placeholder-slate-400 px-3 py-1.5 text-xs lg:text-sm w-full focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-white mr-2 text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center text-base">
                  🗂️
                </span>
                <div>
                  <div className="font-extrabold text-white text-sm">10+ Categories</div>
                  <div className="text-[11px] text-slate-400">Curated & Updated</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center text-base">
                  🏬
                </span>
                <div>
                  <div className="font-extrabold text-white text-sm">7 Stores Tracked</div>
                  <div className="text-[11px] text-slate-400">Amazon, Flipkart & More</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center text-base">
                  ⚡
                </span>
                <div>
                  <div className="font-extrabold text-white text-sm">Live Comparisons</div>
                  <div className="text-[11px] text-slate-400">Best Price Finder</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 flex items-center justify-center text-base">
                  🏷️
                </span>
                <div>
                  <div className="font-extrabold text-white text-sm">Up to 35% Savings</div>
                  <div className="text-[11px] text-slate-400">Verified Deals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide py-1">
            {DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-950"
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
            {filteredCategories.map((cat) => {
              const count = categoryCounts[cat.name] || 12;
              const isSelected = activePreviewCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => setActivePreviewCategory(cat.name)}
                  className={`group bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-300 p-6 flex flex-col justify-between relative cursor-pointer hover:-translate-y-1 hover:shadow-xl ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                      : "border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-300 shadow-sm"
                  }`}
                >
                  <div>
                    {/* Header: Icon, Name, Count */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform`}
                        >
                          {cat.icon}
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                            {cat.department}
                          </span>
                          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                            {cat.name}
                          </h3>
                        </div>
                      </div>

                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold text-xs px-2.5 py-1 rounded-full shrink-0">
                        {count} Deals
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                      {cat.description}
                    </p>

                    {/* Top Brands Pills */}
                    <div className="mb-4">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                        Popular Brands
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.topBrands.slice(0, 5).map((brand) => (
                          <span
                            key={brand}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800/70 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: Starting price & Navigation */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Deals starting from
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{cat.minPriceEstimate.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/search?q=${encodeURIComponent(cat.searchKey)}`);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Category</span>
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Featured Deals Spotlight for Selected Category */}
          {previewProducts.length > 0 && (
            <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 lg:p-8 shadow-sm mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Trending in {activePreviewCategory}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Hand-picked verified deals with the highest price-to-value rating.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      `/search?q=${encodeURIComponent(
                        CATEGORY_META.find((c) => c.name === activePreviewCategory)?.searchKey ||
                          activePreviewCategory
                      )}`
                    )
                  }
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
                >
                  <span>View All in {activePreviewCategory}</span>
                  <FiArrowRight />
                </button>
              </div>

              {/* Deals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {previewProducts.map((product) => {
                  const comparison = comparisonProducts[product.name];
                  const hasComparison = !!comparison && comparison.length > 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        navigate(`/comparison/${encodeURIComponent(product.name)}`);
                      }}
                      className="group bg-slate-50/70 dark:bg-slate-950/70 dark:bg-slate-950 hover:bg-white dark:hover:bg-slate-900 dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 hover:border-indigo-300 p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer hover:shadow-md"
                    >
                      <div>
                        {/* Image */}
                        <div className="w-full h-36 bg-white dark:bg-slate-900 rounded-xl p-3 flex items-center justify-center mb-3 border border-slate-100 dark:border-slate-800 overflow-hidden select-none">
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

                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {product.brand}
                          </span>
                          {product.discount && (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              {product.discount}
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                          {product.name}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800">
                        <div className="flex items-baseline justify-between mb-2.5">
                          <span className="text-sm font-black text-slate-900 dark:text-white">
                            ₹{product.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                            {product.store}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/comparison/${encodeURIComponent(product.name)}`);
                          }}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>Compare Stores</span>
                          <FiArrowRight className="text-xs" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bottom Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold">
                📦
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">15,000+</div>
                <div className="text-xs font-semibold text-slate-400">Products Tracked</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center text-2xl font-bold">
                🏪
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">7+ Stores</div>
                <div className="text-xs font-semibold text-slate-400">Multi-Retailer Engine</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-2xl font-bold">
                🔔
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">5,400+</div>
                <div className="text-xs font-semibold text-slate-400">Price Alerts Triggered</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center text-2xl font-bold">
                💰
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 dark:text-white">₹3.2 Lakh+</div>
                <div className="text-xs font-semibold text-slate-400">User Savings Generated</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
