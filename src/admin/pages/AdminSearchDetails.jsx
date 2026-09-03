import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSearch,
  FiUser,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiStar,
  FiExternalLink,
  FiGlobe,
  FiTrendingDown,
  FiAward,
  FiZap
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import StatusBadge from "../components/StatusBadge";

export function AdminSearchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSearchById } = useAdminData();

  const search = getSearchById(id);

  if (!search) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 text-xl">
          <FiAlertCircle />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Search Record Not Found</h3>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          No search session found with ID <strong className="font-mono">{id}</strong>.
        </p>
        <Link
          to="/admin/searches"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
        >
          <FiArrowLeft /> Back to Searches
        </Link>
      </div>
    );
  }

  const comparison = search.comparisonSummary;
  const results = search.results || [];

  return (
    <div className="space-y-6">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/searches")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <FiArrowLeft /> Back to Searches
        </button>

        <span className="font-mono text-xs font-bold text-slate-500">
          ID: {search.id}
        </span>
      </div>

      {/* 1. Search Information Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
              Search Query
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              "{search.query}"
            </h2>
          </div>
          <StatusBadge status={search.status} size="lg" />
        </div>

        {/* Search Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {/* User */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              User
            </span>
            <div className="flex items-center gap-2">
              <img
                src={search.userAvatar}
                alt={search.userName}
                className="w-5 h-5 rounded-full object-cover"
              />
              <Link
                to={`/admin/users/${search.userId}`}
                className="text-xs font-bold text-slate-800 hover:text-indigo-600 truncate block"
              >
                {search.userName}
              </Link>
            </div>
          </div>

          {/* Search ID */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Search ID
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">{search.id}</span>
          </div>

          {/* Started Time */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Started Time
            </span>
            <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
              {search.startedTime || search.dateTime}
            </span>
          </div>

          {/* Completed Time */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Completed Time
            </span>
            <span className="text-xs font-medium text-slate-700 whitespace-nowrap">
              {search.completedTime || "In Progress"}
            </span>
          </div>

          {/* Duration */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Duration
            </span>
            <span className="text-xs font-bold font-mono text-indigo-600">{search.duration}</span>
          </div>

          {/* Total Results */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Collected Results
            </span>
            <span className="text-xs font-extrabold text-slate-900">{search.resultsCount} Products</span>
          </div>
        </div>
      </div>

      {/* 2. Comparison Summary (Show only: Cheapest, Highest-Rated, Best Overall) */}
      {comparison && (
        <div>
          <div className="mb-3">
            <h3 className="text-base font-bold text-slate-900">Comparison Summary</h3>
            <p className="text-xs text-slate-500">
              Automated multi-store evaluation highlight cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Cheapest Product */}
            {comparison.cheapest && (
              <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <FiTrendingDown className="text-xs" /> Cheapest Option
                </div>

                <div>
                  <div className="flex items-center gap-3 mt-1 mb-3">
                    <img
                      src={comparison.cheapest.image}
                      alt={comparison.cheapest.name}
                      className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                        <FiGlobe className="text-[10px]" /> {comparison.cheapest.website}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {comparison.cheapest.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xl font-extrabold text-emerald-600">
                    ₹{comparison.cheapest.price.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <FiStar className="text-amber-500 fill-amber-500 text-[10px]" />
                    <span>{comparison.cheapest.rating} ({comparison.cheapest.reviews} reviews)</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-700">Lowest Price Found</span>
                  <a
                    href={comparison.cheapest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Store <FiExternalLink className="text-[10px]" />
                  </a>
                </div>
              </div>
            )}

            {/* Card 2: Highest-Rated Product */}
            {comparison.highestRated && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <FiAward className="text-xs" /> Highest Rated
                </div>

                <div>
                  <div className="flex items-center gap-3 mt-1 mb-3">
                    <img
                      src={comparison.highestRated.image}
                      alt={comparison.highestRated.name}
                      className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 mb-1">
                        <FiGlobe className="text-[10px]" /> {comparison.highestRated.website}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {comparison.highestRated.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>₹{comparison.highestRated.price.toLocaleString("en-IN")}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200">
                      <FiStar className="text-amber-500 fill-amber-500 text-[10px]" />
                      {comparison.highestRated.rating}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Verified {comparison.highestRated.reviews} customer reviews
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-amber-700">Top Rated Seller</span>
                  <a
                    href={comparison.highestRated.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Store <FiExternalLink className="text-[10px]" />
                  </a>
                </div>
              </div>
            )}

            {/* Card 3: Best Overall Result */}
            {comparison.bestOverall && (
              <div className="bg-white rounded-2xl border border-indigo-200 shadow-xs p-5 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider flex items-center gap-1">
                  <FiZap className="text-xs" /> Best Overall
                </div>

                <div>
                  <div className="flex items-center gap-3 mt-1 mb-3">
                    <img
                      src={comparison.bestOverall.image}
                      alt={comparison.bestOverall.name}
                      className="w-14 h-14 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 mb-1">
                        <FiGlobe className="text-[10px]" /> {comparison.bestOverall.website}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {comparison.bestOverall.name}
                      </h4>
                    </div>
                  </div>

                  <div className="text-xl font-extrabold text-indigo-700">
                    ₹{comparison.bestOverall.price.toLocaleString("en-IN")}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {comparison.bestOverall.highlight || "Best balance of rating, price & fast delivery"}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600">Recommended Pick</span>
                  <a
                    href={comparison.bestOverall.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Store <FiExternalLink className="text-[10px]" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Search Results Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Scraped Product Results</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Raw collected products from active store connectors
            </p>
          </div>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
            {results.length} Products Found
          </span>
        </div>

        {results.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No product results available for this search session.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3">Product Image</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 text-center">Rating</th>
                  <th className="px-4 py-3">Reviews</th>
                  <th className="px-4 py-3">Website</th>
                  <th className="px-4 py-3 text-right">Product URL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 p-1 border border-slate-200 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                    </td>

                    {/* Product Name */}
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                      {item.name}
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-extrabold text-slate-900">
                        ₹{item.price.toLocaleString("en-IN")}
                      </div>
                      {item.discount && (
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          {item.discount}
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200/60">
                        <FiStar className="text-amber-500 fill-amber-500 text-[10px]" />
                        {item.rating}
                      </span>
                    </td>

                    {/* Reviews */}
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {item.reviews.toLocaleString()}
                    </td>

                    {/* Website */}
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        <FiGlobe className="text-xs" /> {item.website}
                      </span>
                    </td>

                    {/* Product URL */}
                    <td className="px-4 py-3 text-right">
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        <span>Visit Store</span>
                        <FiExternalLink className="text-[10px]" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminSearchDetails;
