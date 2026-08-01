import React from "react";
import { FiBell } from "react-icons/fi";

const PriceAlert = () => {
  const alerts = [
    {
      id: 1,
      name: "Apple iPhone 16 Pro",
      drop: "↓ ₹5,000 (4.17%)",
      currentPrice: "Now ₹1,14,900",
      store: "Amazon",
      time: "2m ago",
      image: "https://images.unsplash.com/photo-1727371515990-24db52ced00a?w=100&q=80",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      drop: "↓ ₹8,000 (6.15%)",
      currentPrice: "Now ₹1,21,999",
      store: "Flipkart",
      time: "1h ago",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80",
    },
    {
      id: 3,
      name: "OnePlus 12 (256GB)",
      drop: "↓ ₹3,000 (4.62%)",
      currentPrice: "Now ₹61,999",
      store: "Croma",
      time: "3h ago",
      image: "https://images.unsplash.com/photo-1565849328678-9275afe5d766?w=100&q=80",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-extrabold text-gray-950">Price Drop Alerts</h2>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border border-gray-100/50 rounded-xl p-3 hover:bg-gray-50/40 transition"
          >
            {/* Image */}
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

            {/* Info */}
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
                  {item.currentPrice}
                </span>
                <span className="text-[9px] font-black text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded leading-none uppercase">
                  {item.store}
                </span>
              </div>
            </div>

            {/* Time & Bell */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[9px] font-semibold text-gray-400 leading-none">
                {item.time}
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
};

export default PriceAlert;