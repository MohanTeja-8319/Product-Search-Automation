import React, { useEffect, useState, useMemo } from "react";
import {
  FiBell,
  FiChevronRight,
  FiRefreshCw,
  FiTarget,
  FiShoppingBag,
  FiSliders,
  FiTrash2,
  FiExternalLink,
  FiCheck,
  FiCheckCircle,
  FiSearch,
  FiTrendingDown,
  FiAlertCircle,
  FiPlus,
  FiClock,
  FiZap,
} from "react-icons/fi";
import { FaStore, FaFire, FaCheckCircle, FaTrashAlt, FaExchangeAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useNavigate, Link } from "react-router-dom";
import comparisonProducts from "../data/comparisionProducts";
import {
  getAlerts,
  updateAlert as updateAlertApi,
  deleteAlert as deleteAlertApi,
} from "../utils/api";

const STORE_STYLES = {
  Amazon: "bg-[#131921] text-amber-400 font-bold",
  Flipkart: "bg-[#2874f0] text-yellow-300 font-extrabold",
  Croma: "bg-[#00838f] text-white font-bold",
  Myntra: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-bold",
  Ajio: "bg-[#2c4152] text-white font-bold",
  "Apple Store": "bg-black text-white font-semibold",
  "Reliance Digital": "bg-[#e42529] text-white font-bold",
};

// Turns a Mongo ISO timestamp into a short relative label ("2 days ago").
function formatRelativeTime(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? "" : "s"} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

const PriceAlerts = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [needsLogin, setNeedsLogin] = useState(false);

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'triggered'
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  // Load the logged-in user's alerts from MongoDB.
  useEffect(() => {
    let cancelled = false;

    async function loadAlerts() {
      if (!localStorage.getItem("token")) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLoadError("");
      try {
        const res = await getAlerts();
        if (!cancelled) {
          setAlerts(res?.alerts || []);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || "Could not load your price alerts.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAlerts();
    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  // Toggle Alert Active / Paused
  const toggleAlertStatus = async (id) => {
    const target = alerts.find((a) => a._id === id);
    if (!target) return;

    const newStatus = !target.active;
    // Optimistic update, rolled back if the request fails.
    setAlerts((prev) =>
      prev.map((alert) => (alert._id === id ? { ...alert, active: newStatus } : alert))
    );

    try {
      await updateAlertApi(id, { active: newStatus });
      showToast(
        newStatus
          ? `Alert for "${target.productName}" resumed.`
          : `Alert for "${target.productName}" paused.`
      );
    } catch (err) {
      // Roll back on failure.
      setAlerts((prev) =>
        prev.map((alert) => (alert._id === id ? { ...alert, active: !newStatus } : alert))
      );
      showToast(err.message || "Could not update the alert.");
    }
  };

  // Delete Alert
  const deleteAlert = async (id) => {
    const target = alerts.find((a) => a._id === id);
    if (!target) return;

    try {
      await deleteAlertApi(id);
      setAlerts((prev) => prev.filter((a) => a._id !== id));
      showToast(`Removed alert for "${target.productName}".`);
    } catch (err) {
      showToast(err.message || "Could not delete the alert.");
    }
  };

  // Simulate Price Drop on First Active Alert
  const simulatePriceDrop = async () => {
    const firstActive = alerts.find((a) => a.active);
    if (!firstActive) {
      showToast("No active alerts to trigger.");
      return;
    }

    const newPrice = Math.round(firstActive.targetPrice * 0.95); // Drops below target!
    const triggeredAt = new Date().toISOString();

    try {
      const res = await updateAlertApi(firstActive._id, {
        active: false,
        currentPrice: newPrice,
        triggeredAt,
      });
      const updatedAlert = res?.alert;

      setAlerts((prev) =>
        prev.map((alert) =>
          alert._id === firstActive._id
            ? updatedAlert || { ...alert, active: false, currentPrice: newPrice, triggeredAt }
            : alert
        )
      );

      showToast(`⚡ Price drop triggered for "${firstActive.productName}"!`);
    } catch (err) {
      showToast(err.message || "Could not trigger the price drop.");
    }
  };

  // Metrics
  const activeAlerts = useMemo(() => alerts.filter((a) => a.active), [alerts]);
  const triggeredAlerts = useMemo(() => alerts.filter((a) => !a.active), [alerts]);

  const totalPotentialSavings = useMemo(() => {
    return alerts.reduce((acc, a) => {
      const saving = (a.currentPrice || 0) - (a.targetPrice || 0);
      return acc + (saving > 0 ? saving : 0);
    }, 0);
  }, [alerts]);

  // Filtered List
  const displayedAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "active" && alert.active) ||
        (activeTab === "triggered" && !alert.active);

      const matchesSearch =
        !searchQuery ||
        alert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (alert.store && alert.store.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (alert.category && alert.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesTab && matchesSearch;
    });
  }, [alerts, activeTab, searchQuery]);

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans">
      <Sidebar />

      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />

        <main className="p-4 lg:p-8 flex-1 max-w-7xl w-full mx-auto pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link to="/home" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Home
            </Link>
            <FiChevronRight className="text-[10px]" />
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Price Alerts</span>
          </nav>

          {/* Hero Banner with Stats */}
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 lg:p-8 mb-8 overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-bold mb-3">
                  <FiBell className="text-amber-400 animate-bounce text-xs" />
                  Automated Price Drop Tracker
                </div>

                <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Price Alerts & Notifications
                </h1>

                <p className="text-slate-300 text-xs lg:text-sm mt-1.5 max-w-xl leading-relaxed">
                  Track price drops 24/7 across Amazon, Flipkart, Croma, Apple Store & get notified the second your target price is reached.
                </p>
              </div>

              {/* Action Buttons in Hero */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={simulatePriceDrop}
                  className="px-4 py-2.5 bg-white/10 dark:bg-slate-900/10 hover:bg-white/20 dark:hover:bg-slate-900/20 dark:bg-slate-900 border border-white/20 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
                  title="Simulate a real-time price drop trigger"
                >
                  <FiZap className="text-amber-400 fill-amber-400" />
                  <span>Simulate Drop</span>
                </button>

                <button
                  onClick={() => navigate("/createalerts")}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FiPlus className="text-sm stroke-[3]" />
                  <span>Create New Alert</span>
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 text-lg">
                  🔔
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">{activeAlerts.length}</div>
                  <div className="text-[11px] text-slate-400">Active Trackers</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-300 text-lg">
                  🎯
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">{triggeredAlerts.length}</div>
                  <div className="text-[11px] text-slate-400">Target Reached</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300 text-lg">
                  💰
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">
                    ₹{totalPotentialSavings.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">Targeted Savings</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300 text-lg">
                  ⚡
                </div>
                <div>
                  <div className="font-extrabold text-white text-base">24/7 Live</div>
                  <div className="text-[11px] text-slate-400">Instant Push & Email</div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Bar: Tabs & Search Filter */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-4 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "all"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                All Alerts ({alerts.length})
              </button>
              <button
                onClick={() => setActiveTab("active")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "active"
                    ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Active ({activeAlerts.length})
              </button>
              <button
                onClick={() => setActiveTab("triggered")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "triggered"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Triggered ({triggeredAlerts.length})
              </button>
            </div>

            {/* Search within alerts */}
            <div className="relative max-w-xs w-full">
              <FiSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search alerts by product or store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-400 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Alerts List */}
          <div className="space-y-4 mb-10">
            {needsLogin ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FiBell />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Sign in to see your price alerts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                  Price alerts are saved to your account so we can notify you the moment a
                  price drops.
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            ) : loading ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl animate-spin">
                  <FiRefreshCw />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Loading your price alerts...
                </h3>
              </div>
            ) : loadError ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FiAlertCircle />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  Could not load price alerts
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {loadError}
                </p>
              </div>
            ) : displayedAlerts.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                  <FiBell />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                  No {activeTab !== "all" ? activeTab : ""} Price Alerts Found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-5">
                  {searchQuery
                    ? `No alerts match your search for "${searchQuery}".`
                    : "Create a price alert on any product to get notified the second the price drops."}
                </p>
                <button
                  onClick={() => navigate("/createalerts")}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  Create Your First Alert
                </button>
              </div>
            ) : (
              displayedAlerts.map((alert) => {
                const diff = (alert.currentPrice || 0) - (alert.targetPrice || 0);
                const isTargetReached = !alert.active;
                const storeBadgeStyle =
                  STORE_STYLES[alert.store] || "bg-indigo-600 text-white font-bold";

                const dropPercent =
                  alert.currentPrice > 0
                    ? Math.round(
                        (Math.abs(alert.currentPrice - alert.targetPrice) /
                          alert.currentPrice) *
                          100
                      )
                    : 0;

                const comparison = comparisonProducts[alert.productName];
                const hasComparison = !!comparison && comparison.length > 0;

                return (
                  <div
                    key={alert._id}
                    className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-300 p-5 shadow-sm hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative ${
                      isTargetReached
                        ? "border-emerald-300 dark:border-emerald-800 ring-2 ring-emerald-100 dark:ring-emerald-900/50 bg-gradient-to-r from-white via-emerald-50/20 to-white dark:from-slate-900 dark:via-emerald-950/30 dark:to-slate-900"
                        : "border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-200"
                    }`}
                  >
                    {/* Left: Product Details */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-1.5 flex items-center justify-center shrink-0">
                        <img
                          src={alert.image}
                          alt={alert.productName}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120";
                          }}
                        />
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded uppercase ${storeBadgeStyle}`}
                          >
                            {alert.store || "Amazon"}
                          </span>
                          <span className="text-[11px] text-slate-400 font-semibold">
                            {alert.category || "Electronics"}
                          </span>

                          {isTargetReached ? (
                            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                              <FiCheckCircle /> Target Price Reached!
                            </span>
                          ) : (
                            <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              ● Tracking Live
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {alert.productName}
                        </h3>

                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <FiClock className="text-[10px]" />
                          Created {formatRelativeTime(alert.createdAt)}
                          {alert.frequency && ` · ${alert.frequency} Alert`}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Pricing Breakdown */}
                    <div className="flex items-center justify-between sm:justify-start gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6 w-full lg:w-auto shrink-0">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                          Current Price
                        </span>
                        <span className="text-base font-black text-slate-900 dark:text-white">
                          ₹{alert.currentPrice.toLocaleString()}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-indigo-500 uppercase font-bold tracking-wider block">
                          Target Price
                        </span>
                        <span className="text-base font-black text-indigo-700 dark:text-indigo-400">
                          ₹{alert.targetPrice.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider block">
                          Potential Drop
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          <FiTrendingDown /> ↓ {dropPercent}%
                        </span>
                      </div>
                    </div>

                    {/* Right: Toggle, Buy Deal & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-3 lg:pt-0 lg:pl-6 w-full lg:w-auto shrink-0">
                      {/* Active Status Switch */}
                      <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={alert.active}
                            onChange={() => toggleAlertStatus(alert._id)}
                            className="sr-only peer"
                          />
                          <div className="relative w-10 h-5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                          {alert.active ? "Active" : "Paused"}
                        </span>
                      </div>

                      {/* Buy Now / View Comparison */}
                      <button
                        onClick={() => {
                          if (hasComparison) {
                            navigate(`/comparison/${encodeURIComponent(alert.productName)}`);
                          } else {
                            navigate(`/search?q=${encodeURIComponent(alert.productName)}`);
                          }
                        }}
                        className={`px-3.5 py-2 font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                          isTargetReached
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                        }`}
                      >
                        <span>{isTargetReached ? "Buy Lowest Deal" : "View Deals"}</span>
                        <FiExternalLink />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteAlert(alert._id)}
                        title="Delete Alert"
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition cursor-pointer"
                      >
                        <FiTrash2 className="text-base" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Informational Cards Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How it works */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xl shrink-0 font-bold">
                <FiZap />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  How Price Alerts Tracking Operates
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Our crawler checks major stores every hour. When the price hits or drops below your target price, we immediately trigger a notification with the direct checkout deal link.
                </p>
              </div>
            </div>

            {/* Smart target tip */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-6 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 flex items-center justify-center text-xl shrink-0 font-bold">
                <FiTarget />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Pro-Tip for Maximum Savings
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Setting target prices 8% to 12% lower than the current price yields the fastest trigger rate during festival sales and weekly lightning drops.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-bounce backdrop-blur-md">
          <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] text-white">
            <FiCheck className="stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PriceAlerts;