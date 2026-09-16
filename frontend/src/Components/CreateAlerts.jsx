import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  FiSearch,
  FiChevronDown,
  FiX,
  FiArrowRight,
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiMail,
  FiSmartphone,
  FiMessageSquare,
  FiClock,
  FiZap,
  FiChevronRight,
  FiSliders,
} from "react-icons/fi";
import { FaStore, FaFire, FaExchangeAlt, FaWhatsapp } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";
import { createAlert as createAlertApi } from "../utils/api";

const POPULAR_SUGGESTIONS = [
  { name: "Apple iPhone 16", icon: "📱" },
  { name: "Apple MacBook Air M4", icon: "💻" },
  { name: "Samsung Galaxy S24", icon: "📱" },
  { name: "OnePlus 13", icon: "📱" },
  { name: "Dell XPS 13", icon: "💻" },
  { name: "Diamond Drop Earrings", icon: "💎" },
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

const CreateAlert = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const searchWrapRef = useRef(null);

  // States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [store, setStore] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [selectedDiscountPreset, setSelectedDiscountPreset] = useState(10);

  // Notification Preferences
  const [notifyPriceDrop, setNotifyPriceDrop] = useState(true);
  const [notifyStock, setNotifyStock] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);
  const [whatsappNotify, setWhatsappNotify] = useState(false);
  const [emailAddress, setEmailAddress] = useState("user@example.com");
  const [frequency, setFrequency] = useState("Instant");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Load product if passed via URL param
  useEffect(() => {
    if (!id) {
      // Default to iPhone 16 for rich demo
      const defaultProduct = dummyProducts[0];
      if (defaultProduct) {
        handleSelectProduct(defaultProduct);
      }
      return;
    }

    const product = dummyProducts.find((item) => item.id === Number(id));
    if (product) {
      handleSelectProduct(product);
    }
  }, [id]);

  // Close suggestions dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts =
    search.trim().length === 0
      ? []
      : dummyProducts
          .filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.brand.toLowerCase().includes(search.toLowerCase())
          )
          .slice(0, 6);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    const stores = comparisonProducts[product.name];
    if (stores && stores.length > 0) {
      setStore(stores[0].store);
    } else {
      setStore(product.store || "Amazon");
    }

    // Default target price to 10% drop
    const defaultTarget = Math.round(product.price * 0.9);
    setTargetPrice(defaultTarget);
    setSelectedDiscountPreset(10);

    setSearch("");
    setShowSuggestions(false);
  };

  const handleApplyDiscountPreset = (percent) => {
    if (!selectedProduct) return;
    setSelectedDiscountPreset(percent);
    const newTarget = Math.round(selectedProduct.price * (1 - percent / 100));
    setTargetPrice(newTarget);
  };

  const handleRemoveProduct = () => {
    setSelectedProduct(null);
    setTargetPrice("");
    setStore("");
    setSelectedDiscountPreset(null);
  };

  const handleCreateAlert = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProduct || !targetPrice) return;

    if (!localStorage.getItem("token")) {
      setCreateError("Please sign in to create a price alert.");
      navigate("/login");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      // Persisted to MongoDB under the logged-in user, not localStorage.
      await createAlertApi({
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        image: selectedProduct.image,
        currentPrice: selectedProduct.price,
        targetPrice: Number(targetPrice),
        initialPrice: selectedProduct.originalPrice || selectedProduct.price,
        store: store || selectedProduct.store,
        category: selectedProduct.category || "General",
        notifyPriceDrop,
        notifyStock,
        email: emailNotify,
        push: pushNotify,
        whatsapp: whatsappNotify,
        emailAddress,
        frequency,
      });

      navigate("/pricealerts");
    } catch (err) {
      setCreateError(err.message || "Could not create the price alert. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const storeOptions =
    selectedProduct && comparisonProducts[selectedProduct.name]
      ? comparisonProducts[selectedProduct.name]
      : selectedProduct
      ? [{ store: selectedProduct.store }]
      : [];

  const current = selectedProduct ? selectedProduct.price : 0;
  const target = Number(targetPrice) || 0;
  const saving = current - target;
  const percentage =
    current > 0 && saving > 0 ? ((saving / current) * 100).toFixed(1) : "0.0";

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-5xl w-full mx-auto pb-24">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <Link to="/pricealerts" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Price Alerts
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Create Alert</span>
          </nav>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">
                <FiBell />
              </span>
              Create Price Drop Alert
            </h1>
            <p className="text-slate-400 text-xs font-semibold mt-1">
              Select your product, set your desired price point, and get notified instantly on price drops.
            </p>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 shadow-sm p-4 mb-8">
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    selectedProduct
                      ? "bg-emerald-500 text-white shadow-sm"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {selectedProduct ? <FiCheck className="stroke-[3]" /> : "1"}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Product Selection</div>
                  <div className="text-[10px] text-slate-400">Choose item to monitor</div>
                </div>
              </div>

              <div className="flex-1 h-0.5 mx-3 bg-slate-100 dark:bg-slate-800 rounded">
                <div
                  className={`h-full bg-indigo-600 transition-all duration-300 ${
                    selectedProduct ? "w-full" : "w-1/2"
                  }`}
                ></div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                    targetPrice > 0
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  2
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Target Price</div>
                  <div className="text-[10px] text-slate-400">Set discount limit</div>
                </div>
              </div>

              <div className="flex-1 h-0.5 mx-3 bg-slate-100 dark:bg-slate-800 rounded">
                <div
                  className={`h-full bg-indigo-600 transition-all duration-300 ${
                    targetPrice > 0 ? "w-full" : "w-0"
                  }`}
                ></div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center font-black text-xs">
                  3
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Preferences</div>
                  <div className="text-[10px] text-slate-400">Notification channels</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateAlert} className="space-y-8">
            {/* ================= 1. Select Product Section ================= */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                      1
                    </span>
                    Select Product to Track
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Search or click a trending product below
                  </p>
                </div>
              </div>

              {!selectedProduct ? (
                <div className="space-y-4">
                  {/* Search Autocomplete Input */}
                  <div className="relative" ref={searchWrapRef}>
                    <FiSearch className="absolute left-4 top-4 text-slate-400 text-base" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Type product name or brand (e.g. iPhone 16, MacBook, Samsung)..."
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 dark:bg-slate-900 transition"
                    />

                    {/* Suggestions dropdown */}
                    {showSuggestions && filteredProducts.length > 0 && (
                      <div className="absolute z-30 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden max-h-72 overflow-y-auto animate-scaleUp">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleSelectProduct(product)}
                            className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 border-b border-slate-100 dark:border-slate-800 last:border-b-0 transition"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-contain p-0.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold">
                                {product.brand} · {product.category}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-slate-900 dark:text-white">
                                ₹{product.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {product.store}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Popular Suggestion Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs font-bold text-slate-400 mr-1">Trending:</span>
                    {POPULAR_SUGGESTIONS.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          const match = dummyProducts.find((p) =>
                            p.name.toLowerCase().includes(item.name.toLowerCase())
                          );
                          if (match) handleSelectProduct(match);
                        }}
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Selected Product Card */
                <div className="border border-indigo-200 bg-indigo-50/30 dark:bg-indigo-950/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-scaleUp">
                  <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                    <div className="w-16 h-16 rounded-xl bg-white dark:bg-slate-900 p-1.5 border border-indigo-100 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 px-2 py-0.5 rounded">
                        {selectedProduct.brand}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate mt-1">
                        {selectedProduct.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                        Current Lowest:{" "}
                        <strong className="text-slate-900 dark:text-white">
                          ₹{selectedProduct.price.toLocaleString()}
                        </strong>
                      </p>
                    </div>
                  </div>

                  {/* Store Selector & Change Product */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 shadow-xs">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Store:</span>
                      <select
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-100 outline-none cursor-pointer"
                      >
                        {storeOptions.map((s, idx) => (
                          <option key={idx} value={s.store}>
                            {s.store}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveProduct}
                      className="text-xs font-bold text-slate-400 hover:text-rose-600 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-200 px-3 py-2 rounded-xl transition cursor-pointer shadow-xs"
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ================= 2. Set Target Price Section ================= */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  Set Your Target Price
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick a recommended discount preset or type your custom price
                </p>
              </div>

              {/* Discount Preset Chips */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Quick Discount Presets:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { label: "5% Price Drop", value: 5 },
                    { label: "10% Drop (Recommended)", value: 10 },
                    { label: "15% Flash Drop", value: 15 },
                    { label: "20% Super Deal", value: 20 },
                  ].map((p) => {
                    const isSelected = selectedDiscountPreset === p.value;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => handleApplyDiscountPreset(p.value)}
                        disabled={!selectedProduct}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer border text-center disabled:opacity-40 disabled:cursor-not-allowed ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                            : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-950/50 dark:bg-slate-900/50 dark:bg-slate-950">
                {/* Current Price */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Current Retail Price
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    {selectedProduct ? `₹${selectedProduct.price.toLocaleString()}` : "—"}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold block mt-1">
                    Store: {store || "Amazon"}
                  </span>
                </div>

                {/* Target Price Input */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-indigo-300 shadow-xs ring-2 ring-indigo-50">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                    Target Alert Price
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-black text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      value={targetPrice}
                      onChange={(e) => {
                        setTargetPrice(e.target.value);
                        setSelectedDiscountPreset(null);
                      }}
                      disabled={!selectedProduct}
                      className="w-full text-xl font-black text-indigo-700 dark:text-indigo-400 outline-none bg-transparent"
                      placeholder="0"
                    />
                  </div>
                  <span className="text-[11px] text-indigo-500 font-medium block mt-1">
                    Triggered when price drops to this
                  </span>
                </div>

                {/* Expected Drop Savings */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-emerald-200/80 shadow-xs">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                    Calculated Savings
                  </span>
                  <span className="text-xl font-black text-emerald-600">
                    ↓ {percentage}%
                  </span>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-bold block mt-1">
                    You Save ₹{saving > 0 ? saving.toLocaleString() : 0}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= 3. Alert Preferences Section ================= */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs">
                    3
                  </span>
                  Notification Channels & Frequency
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Choose where and how fast you receive notifications
                </p>
              </div>

              {/* Channels Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Email */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition select-none flex items-start gap-3 ${
                    emailNotify
                      ? "bg-indigo-50/70 dark:bg-indigo-950/70 border-indigo-300 text-indigo-950"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={emailNotify}
                    onChange={(e) => setEmailNotify(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <FiMail />
                      <span>Email Alert</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Direct deal link sent to your inbox.
                    </p>
                  </div>
                </label>

                {/* Push Notification */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition select-none flex items-start gap-3 ${
                    pushNotify
                      ? "bg-indigo-50/70 dark:bg-indigo-950/70 border-indigo-300 text-indigo-950"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={pushNotify}
                    onChange={(e) => setPushNotify(e.target.checked)}
                    className="accent-indigo-600 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <FiZap />
                      <span>Browser Push</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Instant desktop & mobile popup.
                    </p>
                  </div>
                </label>

                {/* WhatsApp */}
                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition select-none flex items-start gap-3 ${
                    whatsappNotify
                      ? "bg-emerald-50/70 dark:bg-emerald-950/70 border-emerald-300 text-emerald-950"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={whatsappNotify}
                    onChange={(e) => setWhatsappNotify(e.target.checked)}
                    className="accent-emerald-600 w-4 h-4 mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <FaWhatsapp className="text-emerald-600" />
                      <span>WhatsApp Notification</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Lightning fast alert message.
                    </p>
                  </div>
                </label>
              </div>

              {/* Email Address Input if Email checked */}
              {emailNotify && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Send Email Notifications To:
                  </label>
                  <input
                    type="email"
                    required
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {/* Frequency Radios */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Check & Notification Frequency:
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {[
                    { label: "⚡ Instant (Real-Time)", value: "Instant" },
                    { label: "📅 Daily Digest", value: "Daily" },
                    { label: "📆 Weekly Summary", value: "Weekly" },
                  ].map((freq) => (
                    <label
                      key={freq.value}
                      className={`px-4 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition flex items-center gap-2 select-none ${
                        frequency === freq.value
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                          : "bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={freq.value}
                        checked={frequency === freq.value}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="sr-only"
                      />
                      <span>{freq.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 block font-semibold">Ready to activate</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {selectedProduct
                    ? `Monitoring ${selectedProduct.name} at ₹${Number(targetPrice || 0).toLocaleString()}`
                    : "Please select a product"}
                </span>
                {createError && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1.5">{createError}</p>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/pricealerts")}
                  className="w-1/2 sm:w-auto px-5 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 dark:hover:bg-slate-800 font-bold text-xs rounded-xl transition cursor-pointer text-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!selectedProduct || !targetPrice || creating}
                  className="w-1/2 sm:w-auto px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FiBell className="text-sm" />
                  <span>{creating ? "Activating..." : "Activate Price Alert"}</span>
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateAlert;