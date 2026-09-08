import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiExternalLink,
  FiStar,
  FiGlobe,
  FiClock,
  FiCheckCircle,
  FiLayers,
  FiTag,
  FiShield,
  FiAlertCircle
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import StatusBadge from "../components/StatusBadge";

export function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useAdminData();

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto mb-3 text-xl">
          <FiAlertCircle />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Product Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          No catalog entry found matching ID <strong className="font-mono">{id}</strong>.
        </p>
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
        >
          <FiArrowLeft /> Back to Products Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & External Link */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <FiArrowLeft /> Back to Products
        </button>

        {/* Button to open original product website */}
        <a
          href={product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95"
        >
          <span>Open Original Website</span>
          <FiExternalLink className="text-sm" />
        </a>
      </div>

      {/* Main Product Hero Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 dark:border-slate-800 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Product Image Gallery */}
          <div className="md:col-span-4 lg:col-span-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-72 w-auto object-contain rounded-xl shadow-xs"
            />
          </div>

          {/* Product Info */}
          <div className="md:col-span-8 lg:col-span-8 space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200">
                  {product.category}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  <FiGlobe className="text-xs" /> {product.sourceWebsite}
                </span>
                <StatusBadge status={product.availability} size="sm" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h2>
              <span className="font-mono text-xs text-slate-400">ID: {product.id}</span>
            </div>

            {/* Price & Rating Bar */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Scraped Price
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-slate-400">
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                  {product.discount && (
                    <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 border border-emerald-200">
                      {product.discount}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  User Rating & Reviews
                </span>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-900 font-extrabold text-sm border border-amber-200">
                    <FiStar className="text-amber-500 fill-amber-500 text-xs" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ({product.reviews.toLocaleString()} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/50 dark:bg-slate-900/50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                {product.description}
              </p>
            </div>

            {/* Meta tags */}
            <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-1.5">
                <FiClock className="text-indigo-600 dark:text-indigo-400" /> Last Updated: <strong className="text-slate-700 dark:text-slate-300">{product.lastUpdated}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <FiTag className="text-indigo-600 dark:text-indigo-400" /> Verified Crawler SKU
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 dark:border-slate-800 shadow-sm p-6">
        <div className="pb-4 mb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Technical Specifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Structured properties extracted by automated scraper engine
            </p>
          </div>
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg">
            {Object.keys(product.specifications || {}).length} Parameters
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(product.specifications || {}).map(([key, value]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/80 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
            >
              <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
              <span className="font-bold text-slate-800 dark:text-slate-100 text-right max-w-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProductDetails;
