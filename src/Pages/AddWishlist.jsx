import React, { useState, useEffect } from "react";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import dummyProducts from "../data/products";

const Wishlist = ({ productName }) => {
  const [saved, setSaved] = useState(() => isProductInWishlist(productName));

  useEffect(() => {
    setSaved(isProductInWishlist(productName));
  }, [productName]);

  const handleToggle = () => {
    const product = dummyProducts.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    ) || { name: productName };

    const { added } = toggleWishlistItem(product);
    setSaved(added);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">
      <div className="flex items-center justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold">Wishlist</h2>
          <p className="text-gray-500 mt-1">Save this product for later.</p>
        </div>

        <button
          onClick={handleToggle}
          className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer ${
            saved
              ? "bg-red-500 text-white hover:bg-red-600"
              : "border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
          }`}
        >
          {saved ? "❤️ Saved" : "♡ Add to Wishlist"}
        </button>
      </div>
    </div>
  );
};

export default Wishlist;