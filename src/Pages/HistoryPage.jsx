import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiTrash2, FiArrowRight } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const HistoryPage = () => {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("recentProducts");
    if (stored) {
      try {
        setHistoryItems(JSON.parse(stored));
      } catch (e) {
        // Ignore
      }
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("recentProducts");
    setHistoryItems([]);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Browsing History</h1>
                <p className="text-gray-500 text-sm mt-1">Your recently viewed products and price comparisons.</p>
              </div>
              {historyItems.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition cursor-pointer"
                >
                  <FiTrash2 className="text-sm" /> Clear All History
                </button>
              )}
            </div>

            {historyItems.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto mt-12">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiClock className="text-indigo-600 text-2xl" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">No History Found</h2>
                <p className="text-gray-500 text-sm mt-2 mb-6">
                  You haven't browsed any products yet. Start searching to track your history.
                </p>
                <button
                  onClick={() => navigate("/search")}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-indigo-100 cursor-pointer"
                >
                  Start Browsing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {historyItems.map((product, idx) => (
                  <div
                    key={`${product.id}-${idx}`}
                    onClick={() => navigate(`/comparison/${encodeURIComponent(product.name)}`)}
                    className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative group cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-3 overflow-hidden p-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full uppercase">
                        {product.brand}
                      </span>
                      <h3 className="font-extrabold text-xs text-gray-900 leading-snug line-clamp-2 mt-1.5 mb-2 group-hover:text-indigo-600 transition">
                        {product.name}
                      </h3>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-black text-sm text-gray-900">
                          ₹{product.price ? product.price.toLocaleString() : "N/A"}
                        </span>
                        <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-0.5 group-hover:translate-x-0.5 transition duration-200">
                          Compare <FiArrowRight />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
