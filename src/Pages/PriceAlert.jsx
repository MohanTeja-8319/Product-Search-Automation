import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiBell, FiTrash2, FiPlus, FiArrowRight, FiCheck } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const PriceAlert = ({ currentPrice }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isComparisonMode = currentPrice !== undefined;
  const isWidgetMode = !isComparisonMode && location.pathname.toLowerCase() === "/home";

  const [email, setEmail] = useState("");
  const [targetPrice, setTargetPrice] = useState(currentPrice || 0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (currentPrice !== undefined) {
      setTargetPrice(currentPrice);
    }
  }, [currentPrice]);

  const [alerts, setAlerts] = useState(() => {
    const stored = localStorage.getItem("priceAlertsList");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return [
      {
        id: 1,
        name: "Apple iPhone 16 Pro",
        category: "Smartphone",
        currentPrice: 114900,
        targetPrice: 110000,
        drop: "↓ ₹5,000 (4.17%)",
        time: "2m ago",
        image: "https://images.unsplash.com/photo-1727371515990-24db52ced00a?w=100&q=80",
        store: "Amazon",
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        category: "Smartphone",
        currentPrice: 121999,
        targetPrice: 115000,
        drop: "↓ ₹8,000 (6.15%)",
        time: "1h ago",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80",
        store: "Flipkart",
      },
      {
        id: 3,
        name: "OnePlus 12 (256GB)",
        category: "Smartphone",
        currentPrice: 61999,
        targetPrice: 58000,
        drop: "↓ ₹3,000 (4.62%)",
        time: "3h ago",
        image: "https://images.unsplash.com/photo-1565849328678-9275afe5d766?w=100&q=80",
        store: "Croma",
      }
    ];
  });

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("priceAlertsList", JSON.stringify(alerts));
  }, [alerts]);

  const handleSubmit = () => {
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setTargetPrice(currentPrice || 0);
    }, 3000);
  };

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setToastMessage("Alert removed successfully.");
    setTimeout(() => setToastMessage(""), 3000);
  };

  // 1. COMPARISON MODE: Rendered inline in comparison / detail sections
  if (isComparisonMode) {
    const displayPrice = currentPrice !== undefined && currentPrice !== null ? currentPrice : 0;
    return (
      <div className="bg-white border border-gray-200 rounded-xl mt-6">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold">🔔 Price Alert</h2>
          <p className="text-gray-500 mt-1">Get notified when this product becomes cheaper.</p>
        </div>

        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-5">Current Lowest Price</p>
              <h2 className="text-5xl font-bold text-purple-600">
                ₹{displayPrice.toLocaleString()}
              </h2>
              <p className="text-gray-500 mt-4">We'll notify you whenever the price reaches your target.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-medium">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Notify Me At Price</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition cursor-pointer"
              >
                Set Price Alert
              </button>

              {submitted && (
                <div className="bg-green-100 border border-green-300 text-green-700 rounded-lg p-4">
                  ✅ Price alert created successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. WIDGET MODE: Rendered on the Home Page sidebar/right-column
  if (isWidgetMode) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-extrabold text-gray-950">Price Drop Alerts</h2>
          <button
            onClick={() => navigate("/price-alerts")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-3">
          {alerts.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border border-gray-100/50 rounded-xl p-3 hover:bg-gray-50/40 transition"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center p-1.5 shrink-0 select-none">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-black text-slate-900 truncate mb-1">
                  {item.name}
                </h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-red-600 font-extrabold bg-red-50/80 px-2 py-0.5 rounded leading-none">
                    Price Drop: {item.drop}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-black text-slate-800">
                    Now ₹{(item.currentPrice || 0).toLocaleString()}
                  </span>
                  <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                    {item.store}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[9px] font-semibold text-gray-400 leading-none">
                  {item.time || "2m ago"}
                </span>
                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                  <FiBell className="text-xs text-emerald-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. PAGE MODE: Dedicated alert manager page (/price-alerts route)
  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Price Alerts</h1>
                <p className="text-gray-500 text-sm mt-1">Monitor price drops on products you've requested alerts for.</p>
              </div>
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
              >
                <FiPlus className="text-sm stroke-[3]" /> Add New Alert
              </button>
            </div>

            {/* Toast Message */}
            {toastMessage && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2 animate-fade-in">
                <FiCheck className="text-base" /> {toastMessage}
              </div>
            )}

            {alerts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto mt-12">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiBell className="text-indigo-600 text-2xl animate-pulse" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">No Alerts Created</h2>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  You don't have any active price alerts. Search for products to set alerts.
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
                >
                  Find Products
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/70 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <th className="py-4 px-6">Product Details</th>
                        <th className="py-4 px-4">Current Price</th>
                        <th className="py-4 px-4">Target Price</th>
                        <th className="py-4 px-4">Price Drop Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {alerts.map((alert) => (
                        <tr key={alert.id} className="hover:bg-gray-50/40 transition">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={alert.image}
                                alt={alert.name}
                                className="w-12 h-12 object-contain rounded bg-gray-50 p-1 flex-shrink-0"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                                }}
                              />
                              <div>
                                <h3 className="font-extrabold text-xs text-gray-900 line-clamp-1">{alert.name}</h3>
                                <p className="text-[10px] text-gray-400 font-bold mt-0.5">{alert.category} • {alert.store}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-black text-xs text-gray-900">
                            ₹{(alert.currentPrice || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-xs text-indigo-600">
                            ₹{(alert.targetPrice || 0).toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {alert.drop}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <button
                                onClick={() => navigate(`/comparison/${encodeURIComponent(alert.name)}`)}
                                className="px-3.5 py-2 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                              >
                                View <FiArrowRight />
                              </button>
                              <button
                                onClick={() => deleteAlert(alert.id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition cursor-pointer"
                                title="Remove alert"
                              >
                                <FiTrash2 className="text-sm" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PriceAlert;