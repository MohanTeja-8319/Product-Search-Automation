import React, { useState } from "react";
import products from "../data/products";
import ProductCard from "./ProductCard";

function ProductsSection({ selectedCategory }) {
  const [wishlistVersion, setWishlistVersion] = useState(0);

  const handleWishlistToggle = () => {
    setWishlistVersion((prev) => prev + 1);
  };

  const categoryMap = {
    Mobiles: "Smartphones",
    "All Categories": "All Categories"
  };

  const targetCategory = categoryMap[selectedCategory] || selectedCategory;

  const filteredProducts =
    targetCategory === "All Categories"
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === targetCategory.toLowerCase() ||
            product.category.toLowerCase().startsWith(targetCategory.toLowerCase().slice(0, 4))
        );

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-950">
          {selectedCategory === "All Categories"
            ? "Popular Products"
            : `${selectedCategory} Products`}
        </h2>
        <span className="text-xs text-gray-400 font-semibold">
          Showing {filteredProducts.length} items
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-bold text-gray-900">No Products Found</h3>
          <p className="text-gray-500 text-sm mt-2">
            No products are currently available in the "{selectedCategory}" category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onWishlistToggle={handleWishlistToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductsSection;