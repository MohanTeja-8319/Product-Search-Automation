import React from "react";
import { useNavigate } from "react-router-dom";
import { getProductRoute } from "../utils/NavigateHelper";

const RelatedProducts = ({ products = [] }) => {
  const navigate = useNavigate();

  if (!products.length) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl mt-6">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold">Similar Products</h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          You may also like these products
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 p-4 sm:p-6">
        {products.slice(0, 5).map((product) => (
          <div
            key={product.id}
            className="border border-gray-200 rounded-xl p-3 sm:p-4 hover:border-purple-500 hover:shadow-md transition cursor-pointer"
            onClick={() => navigate(getProductRoute(product))}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-28 sm:h-40 w-full object-contain"
            />

            <h3 className="font-semibold mt-3 sm:mt-4 line-clamp-2 text-sm sm:text-base">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {product.brand}
            </p>

            <div className="mt-2 sm:mt-3">
              <span className="text-purple-700 font-bold text-lg sm:text-xl">
                ₹{product.price.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center mt-2 sm:mt-3">
              <span className="text-yellow-500 text-sm sm:text-base">
                ⭐ {product.rating}
              </span>
              <span className="text-green-600 text-xs sm:text-sm">
                {product.discount}
              </span>
            </div>

            <button
              className="w-full mt-3 sm:mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition text-sm sm:text-base"
              onClick={() => navigate(getProductRoute(product))}
            >
              Compare
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;