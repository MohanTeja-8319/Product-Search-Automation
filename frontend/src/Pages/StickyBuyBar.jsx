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
<div className="fixed bottom-0 left-0 lg:left-72 right-0 z-50 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 shadow-lg animate-slide-up">
<div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-8 py-3 sm:py-4">
{/* Left */}
<div className="flex items-center gap-2 sm:gap-5 min-w-0">
<img
src={bestDeal.image}
alt={productName}
className="w-10 h-10 sm:w-16 sm:h-16 object-contain shrink-0"
/>
<div className="min-w-0">
<h2 className="font-bold text-sm sm:text-lg truncate">{productName}</h2>
<p className="hidden sm:block text-gray-500 dark:text-slate-400">Best Price on {bestDeal.store}</p>
</div>
</div>

{/* Middle */}
<div className="text-center font-bold shrink-0">
<p className="hidden sm:block text-sm text-gray-500 dark:text-slate-400 font-medium">Lowest Price</p>
<h2 className="text-lg sm:text-3xl text-purple-700">
            ₹{bestDeal.price.toLocaleString()}
</h2>
</div>

{/* Right */}
<div className="flex gap-2 sm:gap-4 items-center shrink-0">
<a
href={bestDeal.url || "https://amazon.in"}
target="_blank"
rel="noreferrer"
className="bg-purple-600 text-white px-4 py-2 sm:px-8 sm:py-3 rounded-lg hover:bg-purple-700 transition font-semibold text-sm sm:text-base whitespace-nowrap"
>
            Buy Now
</a>

<button
onClick={handleToggle}
className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border transition cursor-pointer shrink-0 ${
saved
                ? "border-red-500 bg-red-50 dark:bg-red-950 text-red-500"
                : "border-gray-300 text-gray-400 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500"
}`}
>
<FaHeart className="text-base sm:text-lg" />
</button>
</div>
</div>
</div>
  );
};

export default StickyBuyBar;