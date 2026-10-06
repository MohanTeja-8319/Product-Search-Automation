import React from "react";
import WishlistButton from "../Components/WishlistButton";
import { getDirectStoreUrl } from "../utils/storeHelper";

const StickyBuyBar = ({ productName, bestDeal }) => {
  if (!bestDeal) return null;

  const product = {
    name: productName,
    price: bestDeal.price,
    image: bestDeal.image,
    store: bestDeal.store,
  };

  return (
    <div className="fixed bottom-0 left-0 lg:left-72 right-0 z-50 bg-white border-t border-gray-200 shadow-soft animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-8 py-3 sm:py-4">
        {/* Left: Product Info */}
        <div className="flex items-center gap-2 sm:gap-5 min-w-0">
          <img
            src={bestDeal.image}
            alt={productName}
            className="w-10 h-10 sm:w-16 sm:h-16 object-contain shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-bold text-sm sm:text-lg truncate">{productName}</h2>
            <p className="hidden sm:block text-gray-500">Best Price on {bestDeal.store}</p>
          </div>
        </div>

        {/* Center: Price */}
        <div className="text-center font-bold shrink-0">
          <p className="hidden sm:block text-sm text-gray-500 font-medium">Lowest Price</p>
          <h2 className="text-lg sm:text-3xl text-purple-700">
            ₹{bestDeal.price.toLocaleString()}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2 sm:gap-4 items-center shrink-0">
          <a
            href={getDirectStoreUrl(bestDeal.store, productName, bestDeal.url)}
            target="_blank"
            rel="noreferrer"
            className="bg-purple-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-[10px] hover:bg-purple-700 transition font-semibold text-sm sm:text-base whitespace-nowrap"
          >
            Buy Now
          </a>

          <WishlistButton
            product={product}
            size={44}
            iconSize={16}
            style={{ borderRadius: "10px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyBuyBar;