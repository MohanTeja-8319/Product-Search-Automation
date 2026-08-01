import React, { useState, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import dummyProducts from "../data/products";

const StickyBuyBar = ({ productName, bestDeal }) => {
  const [saved, setSaved] = useState(() => isProductInWishlist(productName));

  useEffect(() => {
    setSaved(isProductInWishlist(productName));
  }, [productName]);

  if (!bestDeal) return null;

  const handleToggle = () => {
    const product = dummyProducts.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    ) || { name: productName, price: bestDeal.price, image: bestDeal.image, store: bestDeal.store };

    const { added } = toggleWishlistItem(product);
    setSaved(added);
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Left */}
        <div className="flex items-center gap-5">
          <img
            src={bestDeal.image}
            alt={productName}
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="font-bold text-lg">{productName}</h2>
            <p className="text-gray-500">Best Price on {bestDeal.store}</p>
          </div>
        </div>

        {/* Middle */}
        <div className="text-center font-bold">
          <p className="text-sm text-gray-500 font-medium">Lowest Price</p>
          <h2 className="text-3xl text-purple-700">
            ₹{bestDeal.price.toLocaleString()}
          </h2>
        </div>

        {/* Right */}
        <div className="flex gap-4 items-center">
          <a
            href={bestDeal.url || "https://amazon.in"}
            target="_blank"
            rel="noreferrer"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Buy Now
          </a>

          <button
            onClick={handleToggle}
            className={`w-12 h-12 flex items-center justify-center rounded-xl border transition cursor-pointer ${
              saved
                ? "border-red-500 bg-red-50 text-red-500"
                : "border-gray-300 text-gray-400 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
            }`}
          >
            <FaHeart className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StickyBuyBar;