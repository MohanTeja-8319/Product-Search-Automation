import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiShare2,
  FiTrash2,
  FiHeart,
  FiCheck,
  FiArrowRight,
  FiGrid,
  FiList,
  FiSearch,
  FiFilter,
  FiBell,
  FiTag,
  FiExternalLink,
  FiPlus,
  FiShoppingBag,
  FiLayers,
  FiClock,
  FiZap,
  FiChevronRight,
  FiCheckCircle,
} from "react-icons/fi";
import { FaHeart, FaStar, FaStore, FaExchangeAlt, FaRegHeart } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";

const STORE_STYLES = {
  Amazon: { bg: "bg-[#131921] text-amber-400", char: "a", label: "Amazon" },
  Flipkart: { bg: "bg-[#2874f0] text-yellow-300", char: "f", label: "Flipkart" },
  Croma: { bg: "bg-[#00838f] text-white", char: "croma", label: "Croma" },
  Myntra: { bg: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white", char: "M", label: "Myntra" },
  Ajio: { bg: "bg-[#2c4152] text-white", char: "AJIO", label: "Ajio" },
  "Apple Store": { bg: "bg-black text-white", char: "", label: "Apple" },
  "Reliance Digital": { bg: "bg-[#e42529] text-white", char: "RD", label: "Reliance" },
};

const getStoreDetail = (storeName) => {
  return STORE_STYLES[storeName] || {
    bg: "bg-indigo-600 text-white",
    char: storeName ? storeName[0].toUpperCase() : "S",
    label: storeName || "Store",
  };
};

const DEFAULT_WISHLIST_ITEMS = [
  {
    id: 1,
    name: "Apple iPhone 16 (128GB)",
    category: "Smartphones",
    price: 79999,
    targetPrice: 72000,
    drop: "8.00%",
    image: "/images/apple-iphone-15.jpg",
    store: "Amazon",
    rating: 4.8,
    lastUpdated: "2m ago",
  },
  {
    id: 2,
    name: "Apple MacBook Air M4",
    category: "Laptops",
    price: 114999,
    targetPrice: 104000,
    drop: "9.50%",
    image: "/images/macbook-air-m4.jpg",
    store: "Apple Store",
    rating: 4.9,
    lastUpdated: "1h ago",
  },
  {
    id: 3,
    name: "Samsung Galaxy S24",
    category: "Smartphones",
    price: 68999,
    targetPrice: 62000,
    drop: "10.1%",
    image: "/images/s24plus.jpg",
    store: "Flipkart",
    rating: 4.7,
    lastUpdated: "3h ago",
  },
  {
    id: 4,
    name: "Dell XPS 13",
    category: "Laptops",
    price: 129999,
    targetPrice: 115000,
    drop: "11.5%",
    image: "/images/dell-xps-13.webp",
    store: "Amazon",
    rating: 4.8,
    lastUpdated: "5h ago",
  },
  {
    id: 5,
    name: "Diamond Drop Earrings",
    category: "Accessories",
    price: 4999,
    targetPrice: 4200,
    drop: "16.0%",
    image: "/images/diamond-drop-earrings.webp",
    store: "Amazon",
    rating: 4.9,
    lastUpdated: "1d ago",
  },
  {
    id: 6,
    name: "OnePlus 13",
    category: "Smartphones",
    price: 64999,
    targetPrice: 58000,
    drop: "10.7%",
    image: "/images/oneplus13.webp",
    store: "Amazon",
    rating: 4.7,
    lastUpdated: "2d ago",
  },
];

const Wishlist = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("wishlistItems");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) return parsed;
      } catch (e) {}
    }
    localStorage.setItem("wishlistItems", JSON.stringify(DEFAULT_WISHLIST_ITEMS));
    return DEFAULT_WISHLIST_ITEMS;
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("wishlistItems", JSON.stringify(items));
  }, [items]);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  // Categories list in wishlist
  const categories = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.category || "General"))];
    return ["All", ...cats];
  }, [items]);

  // Filtered Wishlist Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.store && item.store.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, categoryFilter]);

  // Metrics
  const totalValue = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.price || 0), 0);
  }, [items]);

  const potentialSavings = useMemo(() => {
    return items.reduce((acc, item) => {
      const target = item.targetPrice || Math.round(item.price * 0.9);
      const diff = item.price - target;
      return acc + (diff > 0 ? diff : 0);
    }, 0);
  }, [items]);

  // Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const deleteItem = (id) => {
    const itemToDelete = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    if (itemToDelete) {
      triggerToast(`Removed "${itemToDelete.name}" from your wishlist.`);
    }
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setItems((prev) => prev.filter((i) => !selectedIds.includes(i.id)));
    triggerToast(`Removed ${selectedIds.length} items from your wishlist.`);
    setSelectedIds([]);
  };

  const clearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    setSelectedIds([]);
    triggerToast("Cleared all items from your wishlist.");
  };

  const shareWishlist = () => {
    if (items.length === 0) {
      triggerToast("Your wishlist is empty.");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    triggerToast("🔗 Wishlist link copied to clipboard!");
  };

  // Compare Selected Items
  const compareSelected = () => {
    const selectedItems = items.filter((i) => selectedIds.includes(i.id));
    if (selectedItems.length === 0) return;
    navigate(`/comparison/${encodeURIComponent(selectedItems[0].name)}`);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-800 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 font-semibold">My Wishlist</span>
          </nav>

          {/* Hero Banner with Stats */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/30 border border-pink-400/30 text-pink-200 text-xs font-bold mb-3">
                  <FiHeart className="text-pink-400 fill-pink-400 text-xs animate-pulse" />
                  Saved Products & Price Drop Tracker
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                  My Saved Wishlist
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Keep track of desired products, compare multi-store prices, and get auto-notified when prices drop.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={shareWishlist}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                >
                  <FiShare2 className="text-sm" />
                  <span>Share List</span>
                </button>

                <button
                  onClick={() => navigate("/search")}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiPlus className="text-sm stroke-[3]" />
                  <span>Add More Deals</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-pink-500/30 flex items-center justify-center text-pink-300 text-lg">
                  ❤️
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">{items.length} Items</div>
                  <div className="text-[11px] text-slate-400">Total Saved</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-lg">
                  💎
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    ₹{totalValue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">Cart Portfolio Value</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg">
                  💰
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    ₹{potentialSavings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">Estimated Savings</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300 text-lg">
                  ⚡
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">Auto-Alerts</div>
                  <div className="text-[11px] text-slate-400">Daily Price Updates</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar: Categories Filter, Search & View Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
              {categories.map((cat) => {
                const isSelected = categoryFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Right Controls: Search, View Switcher & Clear */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative max-w-xs w-full sm:w-auto">
                <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-50 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-400 text-slate-800 w-full sm:w-48"
                />
              </div>

              {/* View Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <FiGrid className="text-base" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  title="Table View"
                  className={`p-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <FiList className="text-base" />
                </button>
              </div>

              {/* Batch Actions when items selected */}
              {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 animate-scaleUp">
                  <button
                    onClick={compareSelected}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FaExchangeAlt />
                    <span>Compare ({selectedIds.length})</span>
                  </button>
                  <button
                    onClick={deleteSelected}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <FiTrash2 />
                    <span>Delete</span>
                  </button>
                </div>
              )}

              {/* Clear All */}
              {items.length > 0 && selectedIds.length === 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs font-bold text-slate-400 hover:text-rose-600 transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Wishlist Items Content */}
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
                ❤️
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {searchQuery || categoryFilter !== "All"
                  ? "No Matching Wishlist Items"
                  : "Your Wishlist is Empty"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6 leading-relaxed">
                Explore thousands of deals across Amazon, Flipkart, Croma & click the heart icon on any card to save it here.
              </p>
              <button
                onClick={() => navigate("/search")}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Discover Hot Products
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
              {filteredItems.map((item) => {
                const storeDetail = getStoreDetail(item.store);
                const isSelected = selectedIds.includes(item.id);
                const comparison = comparisonProducts[item.name];
                const hasComparison = !!comparison && comparison.length > 0;
                const targetPrice = item.targetPrice || Math.round(item.price * 0.9);
                const saving = item.price - targetPrice;

                return (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-3xl border transition-all duration-300 p-5 flex flex-col justify-between relative hover:shadow-xl hover:-translate-y-1 ${
                      isSelected
                        ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                        : "border-slate-200/80 hover:border-indigo-300 shadow-sm"
                    }`}
                  >
                    {/* Top Floating Controls */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                        />
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${storeDetail.bg}`}
                        >
                          {item.store || "Amazon"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            // Quick Alert trigger
                            navigate(`/createalerts`);
                          }}
                          title="Set Price Alert"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        >
                          <FiBell className="text-xs" />
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          title="Remove from Wishlist"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Image */}
                    <div
                      onClick={() => {
                        if (hasComparison) {
                          navigate(`/comparison/${encodeURIComponent(item.name)}`);
                        } else {
                          navigate(`/search?q=${encodeURIComponent(item.name)}`);
                        }
                      }}
                      className="w-full h-44 bg-slate-50/70 rounded-2xl p-4 flex items-center justify-center mb-4 border border-slate-100 overflow-hidden cursor-pointer select-none"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.category}
                        </span>
                        {item.drop && (
                          <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                            ↓ {item.drop}
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => {
                          if (hasComparison) {
                            navigate(`/comparison/${encodeURIComponent(item.name)}`);
                          } else {
                            navigate(`/search?q=${encodeURIComponent(item.name)}`);
                          }
                        }}
                        className="font-bold text-sm text-slate-900 leading-snug truncate group-hover:text-indigo-600 transition cursor-pointer"
                      >
                        {item.name}
                      </h3>

                      {/* Price Section */}
                      <div className="mt-3 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                        <div>
                          <span className="text-lg font-black text-slate-900">
                            ₹{item.price.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-semibold">
                            Target: ₹{targetPrice.toLocaleString()}
                          </span>
                        </div>

                        {saving > 0 && (
                          <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                            Save ₹{saving.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        if (hasComparison) {
                          navigate(`/comparison/${encodeURIComponent(item.name)}`);
                        } else {
                          navigate(`/search?q=${encodeURIComponent(item.name)}`);
                        }
                      }}
                      className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{hasComparison ? "Compare All Stores" : "View Deal"}</span>
                      <FiArrowRight className="text-xs" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden animate-fadeIn">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      <th className="py-4 px-6 w-12 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredItems.length > 0 &&
                            selectedIds.length === filteredItems.length
                          }
                          onChange={handleSelectAll}
                          className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                        />
                      </th>
                      <th className="py-4 px-4 font-bold text-xs">Product</th>
                      <th className="py-4 px-4 font-bold text-xs">Current Price</th>
                      <th className="py-4 px-4 font-bold text-xs">Target Price</th>
                      <th className="py-4 px-4 font-bold text-xs">Best Store</th>
                      <th className="py-4 px-4 font-bold text-xs">Updated</th>
                      <th className="py-4 px-6 font-bold text-xs text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isRowSelected = selectedIds.includes(item.id);
                      const storeDetail = getStoreDetail(item.store);
                      const targetPrice = item.targetPrice || Math.round(item.price * 0.9);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-slate-50/70 transition duration-150 ${
                            isRowSelected ? "bg-indigo-50/30" : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-4 px-6 text-center">
                            <input
                              type="checkbox"
                              checked={isRowSelected}
                              onChange={() => handleSelectRow(item.id)}
                              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                            />
                          </td>

                          {/* Product Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                                  }}
                                />
                              </div>
                              <div>
                                <h4
                                  onClick={() =>
                                    navigate(
                                      `/comparison/${encodeURIComponent(item.name)}`
                                    )
                                  }
                                  className="font-bold text-xs text-slate-900 hover:text-indigo-600 transition cursor-pointer"
                                >
                                  {item.name}
                                </h4>
                                <p className="text-[10px] font-semibold text-slate-400">
                                  {item.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Current Price */}
                          <td className="py-4 px-4">
                            <div className="font-black text-xs text-slate-900">
                              ₹{item.price.toLocaleString()}
                            </div>
                            {item.drop && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                ↓ {item.drop}
                              </span>
                            )}
                          </td>

                          {/* Target Price */}
                          <td className="py-4 px-4 text-xs font-semibold text-slate-500">
                            ₹{targetPrice.toLocaleString()}
                          </td>

                          {/* Store */}
                          <td className="py-4 px-4">
                            <span
                              className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold ${storeDetail.bg}`}
                            >
                              {item.store}
                            </span>
                          </td>

                          {/* Last Updated */}
                          <td className="py-4 px-4 text-xs font-medium text-slate-400">
                            {item.lastUpdated || "Recently"}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  navigate(
                                    `/comparison/${encodeURIComponent(item.name)}`
                                  )
                                }
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer"
                              >
                                View
                              </button>
                              <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              >
                                <FiTrash2 className="text-xs" />
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
          )}

          {/* Bottom Feature Promo banner */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-blue-50/60 border border-indigo-100/60 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
                <FiHeart className="text-xl fill-current" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                  Automated Price Tracking is Active on Wishlist Items
                </h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  We check verified platforms every hour so you always purchase at the true lowest market price.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/pricealerts")}
              className="px-4 py-2 bg-white border border-indigo-200 hover:border-indigo-400 text-indigo-600 font-bold text-xs rounded-xl shadow-xs transition shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <span>Manage Alerts</span>
              <FiArrowRight className="text-xs" />
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

export const AddWishlistWidget = ({ productName }) => {
  const [saved, setSaved] = useState(() => isProductInWishlist(productName));

  useEffect(() => {
    setSaved(isProductInWishlist(productName));
  }, [productName]);

  const handleToggle = () => {
    const product = dummyProducts.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    ) || { name: productName };

    const { added } = toggleWishlistItem(product);
    setSaved(added);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl mt-6 p-6 shadow-sm flex items-center justify-between">
      <div>
        <h2 className="text-lg font-extrabold text-slate-900">Add to Wishlist</h2>
        <p className="text-xs text-slate-500 mt-0.5">Save this item to track price drops.</p>
      </div>

      <button
        onClick={handleToggle}
        className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
          saved
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
        }`}
      >
        {saved ? (
          <>
            <FaHeart className="text-xs" />
            <span>Saved to Wishlist</span>
          </>
        ) : (
          <>
            <FaRegHeart className="text-xs" />
            <span>Add to Wishlist</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Wishlist;
