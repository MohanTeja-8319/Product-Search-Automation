import React, { useState, useEffect, useMemo } from "react";
import {
  FiRefreshCw,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiInfo,
  FiSearch,
  FiChevronRight,
  FiShare2,
  FiTrendingDown,
  FiAward,
  FiZap,
  FiSliders,
  FiExternalLink,
  FiHeart,
  FiBell,
} from "react-icons/fi";
import { FaStar, FaStore, FaFire, FaTrophy, FaHeart, FaExchangeAlt } from "react-icons/fa";
import { BiGitCompare } from "react-icons/bi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { useNavigate, Link } from "react-router-dom";
import dummyProducts from "../data/products.js";
import comparisonProducts from "../data/comparisionProducts.js";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";

const POPULAR_BATTLES = [
  {
    title: "Flagship Battle",
    names: ["Apple iPhone 16", "Samsung Galaxy S24", "OnePlus 13"],
    icon: "🔥",
  },
  {
    title: "Ultralight Laptops",
    names: ["Apple MacBook Air M4", "Dell XPS 13"],
    icon: "💻",
  },
  {
    title: "Premium ANC Audio",
    names: ["Sony WH-1000XM5", "Apple AirPods Max"],
    icon: "🎧",
  },
];

const STORE_STYLES = {
  Amazon: "bg-[#131921] text-amber-400 font-bold",
  Flipkart: "bg-[#2874f0] text-yellow-300 font-extrabold",
  Croma: "bg-[#00838f] text-white font-bold",
  Myntra: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-bold",
  Ajio: "bg-[#2c4152] text-white font-bold",
  "Apple Store": "bg-black text-white font-semibold",
  "Reliance Digital": "bg-[#e42529] text-white font-bold",
};

const DEFAULT_COMPARE_LIST = [
  {
    id: 101,
    name: "Apple iPhone 16",
    brand: "Apple",
    category: "Smartphones",
    price: 78999,
    mrp: 79999,
    drop: "1.25%",
    image: "/images/apple-iphone-15.jpg",
    store: "Flipkart",
    display: "6.1-inch Super Retina XDR OLED, 2000 nits",
    processor: "Apple A18 (3nm)",
    ram: "8GB",
    storage: "128GB / 256GB / 512GB",
    battery: "3561 mAh (Fast 25W MagSafe)",
    camera: "48MP Main + 12MP Ultra-wide with 4K Dolby Vision",
    weight: "170 grams",
    os: "iOS 18 (Apple Intelligence)",
    rating: 4.9,
    reviews: 4230,
    badge: "🏆 Editor's Choice",
  },
  {
    id: 102,
    name: "Samsung Galaxy S24",
    brand: "Samsung",
    category: "Smartphones",
    price: 68999,
    mrp: 79999,
    drop: "13.7%",
    image: "/images/s24plus.jpg",
    store: "Amazon",
    display: "6.2-inch Dynamic AMOLED 2X 120Hz LTPO",
    processor: "Snapdragon 8 Gen 3",
    ram: "8GB / 12GB",
    storage: "128GB / 256GB",
    battery: "4000 mAh (25W Fast Charge)",
    camera: "50MP Main + 10MP 3x Telephoto + 12MP Ultra-wide",
    weight: "167 grams",
    os: "One UI 6.1 (Galaxy AI)",
    rating: 4.8,
    reviews: 3120,
    badge: "⚡ Best Value Flagship",
  },
  {
    id: 103,
    name: "OnePlus 13",
    brand: "OnePlus",
    category: "Smartphones",
    price: 64999,
    mrp: 69999,
    drop: "7.14%",
    image: "/images/oneplus13.webp",
    store: "Amazon",
    display: "6.82-inch 2K LTPO 4.0 ProXDR OLED 120Hz",
    processor: "Snapdragon 8 Elite",
    ram: "12GB / 16GB",
    storage: "256GB / 512GB",
    battery: "6000 mAh (100W SuperVOOC)",
    camera: "50MP Hasselblad Main + 50MP 3x Periscope + 50MP UW",
    weight: "210 grams",
    os: "OxygenOS 15 (Android 15)",
    rating: 4.7,
    reviews: 1890,
    badge: "🔋 Battery & Charging King",
  },
];

const Comparison = () => {
  const navigate = useNavigate();

  const [compareList, setCompareList] = useState(() => {
    const stored = localStorage.getItem("compareListItems");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    localStorage.setItem("compareListItems", JSON.stringify(DEFAULT_COMPARE_LIST));
    return DEFAULT_COMPARE_LIST;
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  useEffect(() => {
    localStorage.setItem("compareListItems", JSON.stringify(compareList));
  }, [compareList]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const removeProduct = (id) => {
    const item = compareList.find((p) => p.id === id);
    setCompareList(compareList.filter((p) => p.id !== id));
    if (item) {
      triggerToast(`Removed "${item.name}" from comparison.`);
    }
  };

  const clearAll = () => {
    if (compareList.length === 0) return;
    setCompareList([]);
    triggerToast("Cleared comparison comparison matrix.");
  };

  const loadPresetBattle = (battle) => {
    const matched = battle.names
      .map((name) => {
        return (
          DEFAULT_COMPARE_LIST.find((p) => p.name.includes(name)) ||
          dummyProducts.find((p) => p.name.toLowerCase().includes(name.toLowerCase()))
        );
      })
      .filter(Boolean)
      .map((p) => {
        if (p.processor) return p;
        return formatDummyProductForCompare(p);
      });

    if (matched.length > 0) {
      setCompareList(matched);
      triggerToast(`Loaded "${battle.title}" comparison battle!`);
    }
  };

  const formatDummyProductForCompare = (product) => {
    const brand = product.brand || "Brand";
    const isApple = brand.toLowerCase().includes("apple");
    const isSamsung = brand.toLowerCase().includes("samsung");
    const isSony = brand.toLowerCase().includes("sony");
    const isDell = brand.toLowerCase().includes("dell");

    let display = "6.5-inch AMOLED 120Hz";
    let processor = "Octa-Core Processor";
    let ram = "8GB";
    let storage = "128GB / 256GB";
    let battery = "5000 mAh";
    let camera = "50MP Main + 8MP Ultra-wide";
    let weight = "185 grams";
    let os = "Android 14";

    if (isApple) {
      display = "6.1-inch Super Retina XDR OLED";
      processor = "Apple A18 Chip (3nm)";
      ram = "8GB";
      storage = "128GB / 256GB";
      battery = "3561 mAh";
      camera = "48MP Fusion + 12MP Ultra-wide";
      weight = "170 grams";
      os = "iOS 18";
    } else if (isSamsung) {
      display = "6.2-inch Dynamic AMOLED 2X 120Hz";
      processor = "Snapdragon 8 Gen 3";
      ram = "8GB / 12GB";
      storage = "128GB / 256GB";
      battery = "4000 mAh";
      camera = "50MP + 10MP 3x + 12MP UW";
      weight = "167 grams";
      os = "One UI 6.1";
    } else if (isDell) {
      display = "13.4-inch FHD+ InfinityEdge (500 nits)";
      processor = "Intel Core Ultra 7 155H";
      ram = "16GB LPDDR5X";
      storage = "512GB NVMe SSD";
      battery = "55Wh (Up to 14 Hours)";
      camera = "1080p FHD Webcam";
      weight = "1.19 kg";
      os = "Windows 11 Home";
    } else if (isSony) {
      display = "N/A (Over-Ear Headphones)";
      processor = "Sony V1 + QN1 HD Processor";
      ram = "N/A";
      storage = "N/A";
      battery = "30 Hours ANC On (3min charge = 3hrs)";
      camera = "8 Microphones with AI Noise Reduction";
      weight = "250 grams";
      os = "Sony Sound Connect App";
    }

    return {
      id: Date.now() + Math.random(),
      name: product.name,
      brand: product.brand,
      category: product.category || "Electronics",
      price: product.price,
      mrp: product.originalPrice || Math.round(product.price * 1.15),
      drop: product.discount || "10%",
      image: product.image,
      store: product.store || "Amazon",
      display,
      processor,
      ram,
      storage,
      battery,
      camera,
      weight,
      os,
      rating: product.rating || 4.7,
      reviews: product.reviews || 1200,
      badge: "⭐ Featured",
    };
  };

  const addProductToList = (product) => {
    if (compareList.length >= 4) {
      triggerToast("You can compare a maximum of 4 products side by side.");
      setShowAddModal(false);
      setSearchQuery("");
      return;
    }
    if (compareList.some((p) => p.name.toLowerCase() === product.name.toLowerCase())) {
      triggerToast("This product is already in the comparison matrix.");
      return;
    }

    const newProduct = formatDummyProductForCompare(product);
    setCompareList([...compareList, newProduct]);
    triggerToast(`Added "${product.name}" to comparison.`);
    setShowAddModal(false);
    setSearchQuery("");
  };

  const renderSlots = () => {
    const slots = [];
    for (let i = 0; i < 4; i++) {
      slots.push(compareList[i] || null);
    }
    return slots;
  };

  // Find lowest price among compared
  const lowestPriceCompared = useMemo(() => {
    if (compareList.length === 0) return 0;
    return Math.min(...compareList.map((p) => p.price));
  }, [compareList]);

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-28">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 font-semibold">Side-by-Side Comparison</span>
          </nav>

          {/* Hero Banner with Stats */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-3">
                  <BiGitCompare className="text-indigo-300 text-sm" />
                  Multi-Store Specs & Price Comparison Engine
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Compare Products Side by Side
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Analyze performance, display, processor, battery, camera, and multi-store pricing for up to 4 models at once.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={clearAll}
                  disabled={compareList.length === 0}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md disabled:opacity-40"
                >
                  <FiTrash2 className="text-sm" />
                  <span>Clear All</span>
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={compareList.length >= 4}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <FiPlus className="text-sm stroke-[3]" />
                  <span>Add Product ({compareList.length}/4)</span>
                </button>
              </div>
            </div>

            {/* Popular Battles Shortcuts */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-slate-400 font-bold text-xs">Quick Battles:</span>
              {POPULAR_BATTLES.map((battle) => (
                <button
                  key={battle.title}
                  onClick={() => loadPresetBattle(battle)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition cursor-pointer border border-white/10 flex items-center gap-1.5"
                >
                  <span>{battle.icon}</span>
                  <span>{battle.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Row (Slots) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {renderSlots().map((product, index) => {
              if (product) {
                const isLowest = product.price === lowestPriceCompared;
                const storeBadgeStyle =
                  STORE_STYLES[product.store] || "bg-indigo-600 text-white font-bold";

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between shadow-sm relative group hover:shadow-xl hover:-translate-y-1 ${
                      isLowest
                        ? "border-emerald-400 ring-2 ring-emerald-100"
                        : "border-slate-200/80 hover:border-indigo-300"
                    }`}
                  >
                    {/* Badge & Remove */}
                    <div className="flex items-center justify-between mb-3">
                      {isLowest ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <FaTrophy className="text-emerald-600" /> Best Price
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          Slot {index + 1}
                        </span>
                      )}

                      <button
                        onClick={() => removeProduct(product.id)}
                        title="Remove product"
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition cursor-pointer"
                      >
                        <FiX className="text-sm" />
                      </button>
                    </div>

                    {/* Image */}
                    <div className="w-full h-36 bg-slate-50 rounded-2xl flex items-center justify-center p-3 mb-3 border border-slate-100 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300";
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="text-center space-y-1 mb-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded uppercase ${storeBadgeStyle}`}>
                          {product.store}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {product.brand}
                        </span>
                      </div>

                      <h3 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 h-8 px-1">
                        {product.name}
                      </h3>

                      <div className="pt-2">
                        <span className="font-black text-base text-slate-900">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.mrp && (
                          <span className="text-[11px] text-slate-400 line-through ml-2">
                            ₹{product.mrp.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center justify-center gap-1 pt-1">
                        <FaStar className="text-amber-400 text-xs" />
                        <span className="text-xs font-black text-slate-800">{product.rating}</span>
                        <span className="text-[10px] text-slate-400">
                          ({product.reviews?.toLocaleString() || "1k+"})
                        </span>
                      </div>
                    </div>

                    {/* View Multi-Store Breakdown */}
                    <button
                      onClick={() =>
                        navigate(`/comparison/${encodeURIComponent(product.name)}`)
                      }
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>View All Stores</span>
                      <FiExternalLink className="text-xs" />
                    </button>
                  </div>
                );
              } else {
                return (
                  <div
                    key={`empty-${index}`}
                    onClick={() => setShowAddModal(true)}
                    className="bg-white border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-indigo-50/20 transition duration-300 min-h-[280px] select-none group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-lg transition duration-200 mb-3 shadow-inner">
                      <FiPlus className="stroke-[3]" />
                    </div>
                    <h4 className="text-xs font-extrabold text-slate-800">
                      Add Product {index + 1}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-[140px] font-medium leading-tight">
                      Pick any smartphone or gadget to compare side by side
                    </p>
                  </div>
                );
              }
            })}
          </div>

          {/* Full Specifications Matrix Table */}
          {compareList.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mb-10">
              <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Detailed Specifications Matrix
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Feature-by-feature side by side breakdown
                  </p>
                </div>

                {/* Highlight Differences Switch */}
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={highlightDifferences}
                    onChange={(e) => setHighlightDifferences(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  <span className="text-xs font-bold text-slate-600">
                    Highlight Key Highlights
                  </span>
                </label>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[700px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      <th className="py-3.5 px-6 w-[180px] font-bold text-xs">Specification</th>
                      {renderSlots().map((p, idx) => (
                        <th key={idx} className="py-3.5 px-4 font-bold text-xs text-slate-800">
                          {p ? p.name : `Slot ${idx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                    {/* Lowest Price Row */}
                    <tr className="bg-indigo-50/30">
                      <td className="py-3.5 px-6 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider">
                        Current Best Price
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4">
                          {p ? (
                            <span className="font-black text-sm text-slate-900">
                              ₹{p.price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic font-normal">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Best Store */}
                    <tr>
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        Best Store
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4">
                          {p ? (
                            <span className="font-bold text-slate-800">{p.store}</span>
                          ) : (
                            <span className="text-slate-300 italic font-normal">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Display */}
                    <tr>
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        Display
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-600 font-medium leading-relaxed">
                          {p ? p.display : <span className="text-slate-300 italic font-normal">—</span>}
                        </td>
                      ))}
                    </tr>

                    {/* Processor */}
                    <tr className="bg-slate-50/40">
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        Processor
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-900 font-bold">
                          {p ? p.processor : <span className="text-slate-300 italic font-normal">—</span>}
                        </td>
                      ))}
                    </tr>

                    {/* RAM & Storage */}
                    <tr>
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        RAM / Storage
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-700 font-medium">
                          {p ? (
                            <span>
                              {p.ram} RAM · {p.storage}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic font-normal">—</span>
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Camera */}
                    <tr className="bg-slate-50/40">
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        Camera Setup
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-700 font-medium leading-relaxed">
                          {p ? p.camera : <span className="text-slate-300 italic font-normal">—</span>}
                        </td>
                      ))}
                    </tr>

                    {/* Battery & Charging */}
                    <tr>
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        Battery & Charging
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-700 font-medium">
                          {p ? p.battery : <span className="text-slate-300 italic font-normal">—</span>}
                        </td>
                      ))}
                    </tr>

                    {/* OS & AI Features */}
                    <tr className="bg-slate-50/40">
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        OS / Ecosystem
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4 text-slate-700 font-medium">
                          {p ? p.os || "Latest OS" : <span className="text-slate-300 italic font-normal">—</span>}
                        </td>
                      ))}
                    </tr>

                    {/* Rating & Reviews */}
                    <tr>
                      <td className="py-3.5 px-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        User Rating
                      </td>
                      {renderSlots().map((p, idx) => (
                        <td key={idx} className="py-3.5 px-4">
                          {p ? (
                            <div className="flex items-center gap-1.5">
                              <FaStar className="text-amber-400 text-xs" />
                              <span className="font-extrabold text-slate-900">{p.rating} / 5.0</span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                ({p.reviews?.toLocaleString() || "1,200"} reviews)
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-300 italic font-normal">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Info Banner */}
          <div className="bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-blue-50/60 border border-indigo-100/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <BiGitCompare className="text-2xl" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  Smart Decision Engine Ready
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Comparing multi-store prices, seller warranties, and verified specs guarantees the best purchase decision.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/search")}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
            >
              Browse Catalog
            </button>
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-scaleUp">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Add Product to Comparison Matrix
                </h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">
                  Select any model from our live catalogue
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery("");
                }}
                className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-xl transition cursor-pointer"
              >
                <FiX className="text-base" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <FiSearch className="absolute left-4 top-3.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or store (e.g. iPhone, MacBook, Sony)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:border-indigo-500 focus:outline-none transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Scrollable Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {dummyProducts
                .filter((p) => {
                  const query = searchQuery.toLowerCase().trim();
                  if (!query) return true;
                  return (
                    p.name.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    (p.category && p.category.toLowerCase().includes(query))
                  );
                })
                .map((p) => {
                  const isAlreadyAdded = compareList.some(
                    (c) => c.name.toLowerCase() === p.name.toLowerCase()
                  );
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 hover:bg-indigo-50/40 rounded-2xl transition border ${
                        isAlreadyAdded ? "border-indigo-100 bg-indigo-50/20" : "border-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl p-1 flex items-center justify-center shrink-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 truncate">
                            {p.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {p.brand} · ₹{p.price.toLocaleString()} · {p.store}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => addProductToList(p)}
                        disabled={isAlreadyAdded}
                        className={`text-xs font-bold py-1.5 px-3.5 rounded-xl transition cursor-pointer ${
                          isAlreadyAdded
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                        }`}
                      >
                        {isAlreadyAdded ? "Added" : "Add"}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

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

export default Comparison;
