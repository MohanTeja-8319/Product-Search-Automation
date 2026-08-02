import React from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiStar } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";

function ProductCard({ product, onWishlistToggle }) {
  const navigate = useNavigate();
  const inWishlist = isProductInWishlist(product.name);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    toggleWishlistItem(product);
    if (onWishlistToggle) {
      onWishlistToggle();
    }
  };

  const storeLogos = {
    Amazon: { bg: "bg-black text-white font-serif", char: "a" },
    Flipkart: { bg: "bg-blue-600 text-yellow-400 font-extrabold", char: "f" },
    Croma: { bg: "bg-teal-700 text-white text-[10px] tracking-tighter uppercase px-1 py-0.5 rounded", char: "croma" }
  };

  const logoDetails = storeLogos[product.store] || { bg: "bg-purple-600 text-white", char: product.store ? product.store[0].toLowerCase() : "p" };

  return (
    <div
      onClick={() => window.open(`/comparison/${encodeURIComponent(product.name)}`, "_blank")}
      className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative group cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300"
    >
      {/* Heart Icon */}
      <button
        onClick={handleWishlistClick}
        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-gray-50 p-1.5 rounded-full transition duration-200 z-10 cursor-pointer"
      >
        {inWishlist ? (
          <FaHeart className="text-sm text-red-500" />
        ) : (
          <FiHeart className="text-sm" />
        )}
      </button>

      {/* Product Image */}
      <div className="w-full h-36 flex items-center justify-center bg-gray-50 rounded-xl mb-4 overflow-hidden p-3 select-none">
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

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[10px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">
              {product.brand}
            </span>
            {product.rating && (
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <FiStar className="fill-amber-400 text-amber-400 stroke-[3]" /> {product.rating}
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-sm text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition">
            {product.name}
          </h3>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-3">
            <div>
              <span className="text-base font-black text-gray-900">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-gray-400 line-through ml-1.5 font-medium">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.discount && (
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {product.discount}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold">
              <span className={`w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] uppercase select-none ${logoDetails.bg}`}>
                {logoDetails.char}
              </span>
              <span>{product.store}</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-bold">
              {product.availability}
            </span>
          </div>

          <button className="w-full mt-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition duration-200 shadow-sm cursor-pointer">
            Compare Price
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;