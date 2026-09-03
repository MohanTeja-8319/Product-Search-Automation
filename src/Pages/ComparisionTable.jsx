import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { FaStar, FaTrophy } from "react-icons/fa";
import storeLogos from "../data/logos";

const STORE_STYLES = {
  Amazon: "bg-[#131921] text-amber-400 font-bold",
  Flipkart: "bg-[#2874f0] text-yellow-300 font-extrabold",
  Croma: "bg-[#00838f] text-white font-bold",
  Myntra: "bg-gradient-to-r from-[#ff3f6c] to-[#ff527b] text-white font-bold",
  Ajio: "bg-[#2c4152] text-white font-bold",
  "Apple Store": "bg-black text-white font-semibold",
  "Reliance Digital": "bg-[#e42529] text-white font-bold",
};

const ComparisonTable = ({ comparison = [], lowestPrice }) => {
  if (!comparison || comparison.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 mt-6 overflow-hidden shadow-sm">
      <div className="px-4 sm:px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Compare Stores & Live Deals
          </h2>
          <p className="text-slate-400 text-xs font-semibold mt-0.5">
            Real-time price checks across authorized online retailers
          </p>
        </div>
      </div>

      {/* Mobile: stacked responsive cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {comparison.map((store) => {
          const isBest = store.price === lowestPrice;
          const badgeStyle = STORE_STYLES[store.store] || "bg-indigo-600 text-white font-bold";

          return (
            <div
              key={store.id || store.store}
              className={`p-4 transition ${isBest ? "bg-emerald-50/50" : "hover:bg-slate-50/60"}`}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={storeLogos[store.store] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"}
                      alt={store.store}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${badgeStyle}`}>
                        {store.store}
                      </span>
                    </div>
                  </div>
                </div>

                {isBest && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <FaTrophy className="text-emerald-600 text-xs" /> Lowest Price
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-semibold my-3 bg-slate-50/60 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Store Price</span>
                  <span className={`text-base font-black ${isBest ? "text-emerald-700" : "text-slate-900"}`}>
                    ₹{store.price.toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Seller Rating</span>
                  <div className="inline-flex items-center gap-1 text-slate-800 font-bold mt-0.5">
                    <FaStar className="text-amber-400 text-xs" />
                    <span>{store.rating}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Instant Discount</span>
                  <span className="text-xs font-bold text-emerald-600">
                    {store.discount || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Availability</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    In Stock
                  </span>
                </div>
              </div>

              <a
                href={store.url || "#"}
                target="_blank"
                rel="noreferrer"
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition shadow-xs ${
                  isBest
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                }`}
              >
                <span>Buy at {store.store}</span>
                <FiExternalLink className="text-xs" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Tablet / Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
              <th className="px-6 py-4 font-bold text-xs">Retail Store</th>
              <th className="px-4 py-4 font-bold text-xs text-center">Store Price</th>
              <th className="px-4 py-4 font-bold text-xs text-center">Seller Rating</th>
              <th className="px-4 py-4 font-bold text-xs text-center">Instant Discount</th>
              <th className="px-4 py-4 font-bold text-xs text-center">Availability</th>
              <th className="px-6 py-4 font-bold text-xs text-right">Direct Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold">
            {comparison.map((store) => {
              const isBest = store.price === lowestPrice;
              const badgeStyle = STORE_STYLES[store.store] || "bg-indigo-600 text-white font-bold";

              return (
                <tr
                  key={store.id || store.store}
                  className={`hover:bg-slate-50/70 transition duration-150 ${
                    isBest ? "bg-emerald-50/40" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                        <img
                          src={storeLogos[store.store] || "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100"}
                          alt={store.store}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100";
                          }}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 rounded uppercase ${badgeStyle}`}>
                            {store.store}
                          </span>
                          {isBest && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <FaTrophy className="text-emerald-600" /> Lowest Price
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className={`text-base font-black ${isBest ? "text-emerald-700" : "text-slate-900"}`}>
                      ₹{store.price.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 text-slate-800 font-bold">
                      <FaStar className="text-amber-400 text-xs" />
                      <span>{store.rating}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {store.discount || "—"}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      In Stock
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href={store.url || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isBest
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                          : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                      }`}
                    >
                      <span>Buy at {store.store}</span>
                      <FiExternalLink className="text-xs" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;