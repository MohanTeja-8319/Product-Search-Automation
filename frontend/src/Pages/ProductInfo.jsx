import React from "react";
import { FiTrendingDown, FiShield, FiTruck, FiAward, FiCheckCircle } from "react-icons/fi";
import { FaStar, FaStore, FaTrophy } from "react-icons/fa";

const STORE_STYLES = {
  Amazon: "bg-[#131921] text-amber-400 font-bold",
  Flipkart: "bg-[#2874f0] text-yellow-300 font-extrabold",
  Croma: "bg-[#00838f] text-white font-bold",
  Myntra: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-bold",
  Ajio: "bg-[#2c4152] text-white font-bold",
  "Apple Store": "bg-black text-white font-semibold",
  "Reliance Digital": "bg-[#e42529] text-white font-bold",
};

const ProductInfo = ({
  productName,
  image,
  bestStore,
  rating,
  lowestPrice = 0,
  highestPrice = 0,
  averagePrice = 0,
  savings = 0,
}) => {
  const storeBadgeStyle =
    STORE_STYLES[bestStore] || "bg-indigo-600 text-white font-bold";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 sm:p-6 lg:p-8 mt-4 sm:mt-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
        {/* Product Image */}
        <div className="lg:w-1/3 w-full flex justify-center items-center bg-slate-50/80 dark:bg-slate-950/80 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 relative group overflow-hidden">
          <span className="absolute top-3 left-3 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
            <FaTrophy className="text-emerald-600 text-xs" /> Best Price Tracked
          </span>
          <img
            src={image}
            alt={productName}
            className="h-48 sm:h-64 object-contain group-hover:scale-105 transition duration-300 select-none"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full space-y-5 sm:space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`text-[10px] px-2.5 py-1 rounded-lg uppercase ${storeBadgeStyle}`}>
                Best on {bestStore}
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <FaStar className="text-amber-400 text-xs" /> {rating} / 5.0 Rating
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <FiCheckCircle className="text-emerald-500" /> Verified Stores
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {productName}
            </h1>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-3.5">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/70 border border-emerald-200">
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                Lowest Available
              </span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-700 mt-0.5">
                ₹{lowestPrice.toLocaleString()}
              </h3>
              <span className="text-[10px] text-emerald-600 font-semibold truncate block">
                on {bestStore}
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Highest Store Price
              </span>
              <h3 className="text-lg sm:text-xl font-black text-rose-500 mt-0.5">
                ₹{highestPrice.toLocaleString()}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block">other stores</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/60 border border-indigo-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-indigo-700 dark:text-indigo-400 font-bold uppercase tracking-wider block">
                Total Max Savings
              </span>
              <h3 className="text-lg sm:text-xl font-black text-indigo-700 dark:text-indigo-400 mt-0.5 flex items-center gap-1">
                <FiTrendingDown className="text-base" />
                ₹{savings.toLocaleString()}
              </h3>
              <span className="text-[10px] text-indigo-500 font-semibold block">
                Instant Price Advantage
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Average Market Price
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                ₹{averagePrice.toLocaleString()}
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block">Across all sellers</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Stock Status
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock & Ready
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block">Fast Dispatch</span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Warranty & Return
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                1 Year Brand
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block">7-day replacement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;