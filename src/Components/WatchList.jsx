import React from "react";
import { FiBell } from "react-icons/fi";

const WatchList = () => {
  const watchlist = [
    {
      id: 1,
      name: "Apple iPhone 16 Plus",
      currentPrice: "₹89,999",
      targetPrice: "Target: ₹85,000",
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=100&q=80",
    },
    {
      id: 2,
      name: "Samsung Galaxy S24",
      currentPrice: "₹68,999",
      targetPrice: "Target: ₹64,000",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&q=80",
    },
    {
      id: 3,
      name: "Google Pixel 9 Pro",
      currentPrice: "₹1,09,999",
      targetPrice: "Target: ₹99,000",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&q=80",
    },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-extrabold text-gray-950">Your Watchlist</h2>
        <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition">
          View All
        </button>
      </div>

      <div className="space-y-3">
        {watchlist.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border border-gray-50/50 rounded-xl p-2.5 hover:bg-gray-50/50 transition"
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
              <h4 className="text-xs font-bold text-gray-900 truncate leading-tight">
                {item.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-extrabold text-gray-950 leading-none">
                  {item.currentPrice}
                </span>
                <span className="text-[10px] text-gray-400 font-semibold leading-none">
                  {item.targetPrice}
                </span>
              </div>
            </div>

            {/* Alert Bell */}
            <div className="shrink-0">
              <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100/80">
                <FiBell className="text-xs text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchList;