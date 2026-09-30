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
 <div className="bg-white rounded-[16px] border border-slate-200 p-8 text-center max-w-lg mx-auto my-12 shadow-soft">
 <div className="w-12 h-12 rounded-[16px] bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 text-xl">
 <FiAlertCircle />
 </div>
 <h3 className="text-lg font-bold text-slate-800 ">Product Not Found</h3>
 <p className="text-xs text-slate-500 mt-1 mb-5">
 No catalog entry found matching ID <strong className="font-mono">{id}</strong>.
 </p>
 <Link
 to="/admin/products"
 className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-[10px] text-xs font-bold hover:bg-indigo-700"
 >
 <FiArrowLeft /> Back to Products Catalog
 </Link>
 </div>
 );
 }

 return (
 <div className="space-y-6">
 {}
 <div className="flex items-center justify-between">
 <button
 type="button"
 onClick={() => navigate("/admin/products")}
 className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 :text-white bg-white border border-slate-200 px-3 py-1.5 rounded-[10px] shadow-xs transition-colors"
 >
 <FiArrowLeft /> Back to Products
 </button>

 {}
 <a
 href={product.productUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-[10px] shadow-soft transition-all active:scale-95"
 >
 <span>Open Original Website</span>
 <FiExternalLink className="text-sm" />
 </a>
 </div>

 {}
 <div className="bg-white rounded-[16px] border border-slate-200/90 shadow-soft p-6">
 <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
 {}
 <div className="md:col-span-4 lg:col-span-4 bg-slate-50 border border-slate-200 rounded-[16px] p-4 flex items-center justify-center">
 <img
 src={product.image}
 alt={product.name}
 className="max-h-72 w-auto object-contain rounded-[10px] shadow-xs"
 />
 </div>

 {}
 <div className="md:col-span-8 lg:col-span-8 space-y-4">
 {}
 <div>
 <div className="flex items-center gap-2 flex-wrap mb-2">
 <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
 {product.category}
 </span>
 <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 ">
 <FiGlobe className="text-xs" /> {product.sourceWebsite}
 </span>
 <StatusBadge status={product.availability} size="sm" />
 </div>

 <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
 {product.name}
 </h2>
 <span className="font-mono text-xs text-slate-400">ID: {product.id}</span>
 </div>

 {}
 <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
 <div>
 <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
 Scraped Price
 </span>
 <div className="flex items-baseline gap-2 mt-0.5">
 <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 ">
 ₹{product.price.toLocaleString("en-IN")}
 </span>
 {product.originalPrice && (
 <span className="text-sm line-through text-slate-400">
 ₹{product.originalPrice.toLocaleString("en-IN")}
 </span>
 )}
 {product.discount && (
 <span className="text-xs font-bold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
 {product.discount}
 </span>
 )}
 </div>
 </div>

 {}
 <div className="text-right">
 <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
 User Rating & Reviews
 </span>
 <div className="flex items-center gap-2 mt-1 justify-end">
 <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[10px] bg-amber-50 text-amber-900 font-extrabold text-sm border border-amber-200">
 <FiStar className="text-amber-500 fill-amber-500 text-xs" />
 <span>{product.rating}</span>
 </div>
 <span className="text-xs text-slate-500 font-medium">
 ({product.reviews.toLocaleString()} reviews)
 </span>
 </div>
 </div>
 </div>

 {}
 <div>
 <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
 Description
 </h3>
 <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-[10px] border border-slate-200 ">
 {product.description}
 </p>
 </div>

 {}
 <div className="flex items-center gap-6 pt-2 text-xs text-slate-500 border-t border-slate-200 ">
 <span className="flex items-center gap-1.5">
 <FiClock className="text-indigo-600 " /> Last Updated: <strong className="text-slate-700 ">{product.lastUpdated}</strong>
 </span>
 <span className="flex items-center gap-1.5">
 <FiTag className="text-indigo-600 " /> Verified Crawler SKU
 </span>
 </div>
 </div>
 </div>
 </div>

 {}
 <div className="bg-white rounded-[16px] border border-slate-200/90 shadow-soft p-6">
 <div className="pb-4 mb-4 border-b border-slate-200 flex items-center justify-between">
 <div>
 <h3 className="text-base font-bold text-slate-900 ">Technical Specifications</h3>
 <p className="text-xs text-slate-500 mt-0.5">
 Structured properties extracted by automated scraper engine
 </p>
 </div>
 <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-[10px]">
 {Object.keys(product.specifications || {}).length} Parameters
 </span>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {Object.entries(product.specifications || {}).map(([key, value]) => (
 <div
 key={key}
 className="p-3 rounded-[10px] bg-slate-50/80 border border-slate-200 flex items-center justify-between text-xs"
 >
 <span className="font-semibold text-slate-500 ">{key}</span>
 <span className="font-bold text-slate-800 text-right max-w-xs">{value}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
}

export default AdminProductDetails;
