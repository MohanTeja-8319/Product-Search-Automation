import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { FiHeart, FiLoader } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import { createAlert as createAlertApi, getStoredUserEmail } from "../utils/api";
import { enableBrowserPush } from "../utils/push";

const PriceAlert = ({
 currentPrice: initialCurrentPrice,
 productName: initialProductName,
 image: initialImage,
 store: initialStore,
 productId: initialProductId,
 category: initialCategory,
}) => {
 const location = useLocation();
 const navigate = useNavigate();

 
 const isPage = initialCurrentPrice === undefined && location.pathname.toLowerCase() === "/price-alerts";

 
 const displayPrice = initialCurrentPrice !== undefined && initialCurrentPrice !== null ? initialCurrentPrice : 0;
 const productName = initialProductName || "";
 const store = initialStore || "";
 const image = initialImage || "";

 
 
 const [email, setEmail] = useState(getStoredUserEmail());
 const [targetPrice, setTargetPrice] = useState(displayPrice);
 const [submitting, setSubmitting] = useState(false);
 const [submitted, setSubmitted] = useState(false);
 const [errorMsg, setErrorMsg] = useState("");
 const [wishlistUpdated, setWishlistUpdated] = useState(0);

 const handleSubmit = async (e) => {
 if (e) e.preventDefault();
 if (!email.trim() || submitting) return;

 if (!localStorage.getItem("token")) {
 setErrorMsg("Please sign in to create a price alert.");
 navigate("/login");
 return;
 }

 setSubmitting(true);
 setErrorMsg("");

 
 
 await enableBrowserPush().catch(() => {});

 try {
 await createAlertApi({
 productId: initialProductId,
 productName,
 image,
 currentPrice: displayPrice,
 targetPrice: Number(targetPrice),
 initialPrice: displayPrice,
 store,
 category: initialCategory || "General",
 notifyPriceDrop: true,
 notifyStock: true,
 email: true,
 push: true,
 whatsapp: false,
 emailAddress: email,
 frequency: "Instant",
 });

 setSubmitted(true);
 setTimeout(() => setSubmitted(false), 4000);
 } catch (err) {
 setErrorMsg(err.message || "Could not create the price alert. Please try again.");
 } finally {
 setSubmitting(false);
 }
 };

 const inWishlist = isProductInWishlist(productName);

 const handleWishlistToggle = () => {
 toggleWishlistItem({
 name: productName,
 category: "Smartphone",
 price: displayPrice,
 image: image,
 store: store,
 });
 setWishlistUpdated((prev) => prev + 1);
 };

 const cardContent = (
 <div className="space-y-6 max-w-5xl mx-auto">
 {}
 <div className="bg-white border border-gray-200/80 rounded-[16px] shadow-soft overflow-hidden">
 {}
 <div className="px-6 py-5 border-b border-gray-100">
 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
 <span></span> Price Alert
 </h2>
 <p className="text-xs text-gray-500 mt-1 font-medium">
 Get notified when this product becomes cheaper.
 </p>
 </div>

 {}
 <div className="p-6 md:p-8">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
 {}
 <div>
 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
 Current Lowest Price
 </p>
 <h2 className="text-4xl md:text-5xl font-extrabold text-[#6c5ce7] tracking-tight">
 ₹{displayPrice.toLocaleString()}
 </h2>
 <p className="text-xs text-gray-400 mt-3 font-medium">
 We'll notify you by email and browser push whenever the price reaches your target.
 </p>
 </div>

 {/* Right Column Form */}
 <form onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1.5">
 Email Address
 </label>
 <input
 type="email"
 placeholder="Enter your email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-xs text-gray-800 outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition"
 required
 />
 </div>

 <div>
 <label className="block text-xs font-bold text-gray-700 mb-1.5">
 Notify Me At Price
 </label>
 <input
 type="number"
 value={targetPrice}
 onChange={(e) => setTargetPrice(Number(e.target.value))}
 className="w-full border border-gray-300 rounded-[10px] px-4 py-2.5 text-xs text-gray-800 outline-none focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7] transition"
 />
 </div>

 <button
 type="submit"
 disabled={submitting}
 className="w-full bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white py-3 rounded-[10px] font-bold text-xs shadow-soft shadow-indigo-100 transition duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
 >
 {submitting && <FiLoader className="animate-spin" />}
 <span>{submitting ? "Activating..." : "Set Price Alert"}</span>
 </button>

 {submitted && (
 <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-[10px] p-3 font-semibold flex items-center gap-2">
 ✅ Price alert created successfully!
 </div>
 )}
 {errorMsg && (
 <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-[10px] p-3 font-semibold flex items-center gap-2">
 ⚠️ {errorMsg}
 </div>
 )}
 </form>
 </div>
 </div>
 </div>

 {/* Bottom Customer Reviews Section */}
 <div className="bg-white border border-gray-200/80 rounded-[16px] p-6 shadow-soft">
 <h3 className="text-base font-bold text-gray-900 mb-4">
 Customer Reviews
 </h3>

 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-100 rounded-[10px] bg-gray-50/50 hover:bg-gray-50 :bg-gray-950 :bg-slate-950 :bg-slate-800 transition">
 {/* Product Thumbnail & Title */}
 <div className="flex items-center gap-4 w-full sm:w-auto">
 <div className="w-14 h-14 bg-white rounded-[10px] p-1.5 border border-gray-100 flex items-center justify-center shrink-0">
 <img
 src={image}
 alt={productName}
 className="max-h-full max-w-full object-contain"
 onError={(e) => {
 e.target.onerror = null;
 e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
 }}
 />
 </div>
 <div>
 <h4 className="text-sm font-bold text-gray-900 leading-tight">
 {productName}
 </h4>
 <p className="text-xs font-semibold text-gray-400 mt-0.5">
 Best Price on {store}
 </p>
 </div>
 </div>

 {/* Price, Action Button & Heart */}
 <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
 <div className="text-right sm:text-left">
 <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
 Lowest Price
 </p>
 <p className="text-lg font-extrabold text-[#6c5ce7]">
 ₹{displayPrice.toLocaleString()}
 </p>
 </div>

 <div className="flex items-center gap-3">
 <button
 onClick={() => navigate(`/comparison/${encodeURIComponent(productName)}`)}
 className="px-5 py-2.5 bg-[#6c5ce7] hover:bg-[#5b4bc4] text-white font-bold text-xs rounded-[10px] shadow-soft transition cursor-pointer"
 >
 Buy Now
 </button>
 <button
 onClick={handleWishlistToggle}
 className="p-2.5 rounded-[10px] border border-gray-200 bg-white hover:bg-gray-50 :bg-gray-950 :bg-slate-950 :bg-slate-800 text-gray-400 hover:text-red-500 transition cursor-pointer"
 title="Add to Wishlist"
 >
 {inWishlist ? (
 <FaHeart className="text-red-500 text-sm" />
 ) : (
 <FiHeart className="text-gray-400 hover:text-red-500 text-sm" />
 )}
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>
 );

 if (!isPage) {
 return cardContent;
 }

 return (
 <div className="bg-[#f8fafc] min-h-screen text-gray-800 transition-colors duration-200">
 <Sidebar />
 <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
 <Navbar />
 <main className="p-6 flex-1">
 {cardContent}
 </main>
 </div>
 </div>
 );
};

export default PriceAlert;
