import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiTrash2, FiPlus, FiArrowRight, FiCheck } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const PriceAlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(() => {
    const stored = localStorage.getItem("priceAlertsList");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    const defaultAlerts = [
      {
        id: 1,
        name: "iPhone 15 (128GB)",
        category: "Smartphone",
        currentPrice: 69900,
        targetPrice: 65000,
        drop: "↓ ₹4,900",
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
        store: "Amazon",
      },
      {
        id: 2,
        name: "Dell Inspiron 15",
        category: "Laptop",
        currentPrice: 45990,
        targetPrice: 43000,
        drop: "↓ ₹1,990",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80",
        store: "Flipkart",
      },
      {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Headphones",
        currentPrice: 29990,
        targetPrice: 27000,
        drop: "↓ ₹2,990",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
        store: "Amazon",
      }
    ];
    localStorage.setItem("priceAlertsList", JSON.stringify(defaultAlerts));
    return defaultAlerts;
  });

  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("priceAlertsList", JSON.stringify(alerts));
  }, [alerts]);

  const deleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setToastMessage("Alert removed successfully.");
    setTimeout(() => setToastMessage(""), 3000);
  };

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
                            ₹{alert.currentPrice.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-xs text-indigo-600">
                            ₹{alert.targetPrice.toLocaleString()}
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

export default PriceAlertsPage;
