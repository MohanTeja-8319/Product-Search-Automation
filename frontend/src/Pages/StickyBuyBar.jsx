import React from "react";
import { useNavigate } from "react-router-dom";
import WishlistButton from "../Components/WishlistButton";
import { getDirectStoreUrl } from "../utils/storeHelper";

const StickyBuyBar = ({ productName, bestDeal }) => {
  const navigate = useNavigate();
  if (!bestDeal) return null;

  const product = {
    name: productName,
    price: bestDeal.price,
    image: bestDeal.image,
    store: bestDeal.store,
  };

  return (
    <div
      className="fixed bottom-0 left-0 lg:left-72 right-0 z-50 bg-white border-t border-gray-200 shadow-soft animate-slide-up"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-2.5 sm:px-8 py-2.5 sm:py-4">
        {/* Left: Product Info */}
        <div className="flex items-center gap-2 sm:gap-5 min-w-0 flex-1">
          <img
            src={bestDeal.image}
            alt={productName}
            className="w-8 h-8 sm:w-16 sm:h-16 object-contain shrink-0"
          />
          <div className="min-w-0">
            <h2 className="font-bold text-xs sm:text-base truncate">{productName}</h2>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-500">Best Price on {bestDeal.store}</p>
          </div>
        </div>

        {/* Center: Price */}
        <div className="text-center font-bold shrink-0 px-1">
          <p className="hidden sm:block text-xs text-gray-500 font-medium">Lowest Price</p>
          <h2 className="text-sm sm:text-2xl text-purple-700 whitespace-nowrap">
            ₹{bestDeal.price.toLocaleString()}
          </h2>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-1.5 sm:gap-4 items-center shrink-0">
          <a
            href={getDirectStoreUrl(bestDeal.store, productName, bestDeal.deeplink || bestDeal.url || bestDeal.product_link || bestDeal.link)}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 text-white px-2.5 py-1.5 sm:px-8 sm:py-3 rounded-[10px] hover:bg-purple-700 transition font-semibold text-xs sm:text-base whitespace-nowrap text-center inline-block"
          >
            Buy <span className="hidden sm:inline">on {bestDeal.store || "Store"}</span>
          </a>

          <WishlistButton
            product={product}
            size={36}
            iconSize={14}
            style={{ borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default StickyBuyBar;