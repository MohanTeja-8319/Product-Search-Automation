import React from "react";

const ProductInfo = ({
  productName,
  image,
  bestStore,
  rating,
  lowestPrice,
  highestPrice,
  averagePrice,
  savings,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mt-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Product Image */}
        <div className="w-full lg:w-1/3 flex justify-center items-center">
          <img
            src={image}
            alt={productName}
            className="h-48 sm:h-64 object-contain hover:scale-105 transition"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {productName}
          </h1>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              ⭐ {rating}
            </span>
            <span className="text-gray-500 text-sm sm:text-base">
              Highly Rated Product
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-5 mt-6 sm:mt-8">
            <div>
              <p className="text-gray-500 text-sm">Best Store</p>
              <h3 className="font-bold text-base sm:text-lg break-words">
                {bestStore}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Lowest Price</p>
              <h3 className="text-green-600 font-bold text-base sm:text-lg">
                ₹{lowestPrice.toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Highest Price</p>
              <h3 className="text-red-500 font-bold text-base sm:text-lg">
                ₹{highestPrice.toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Average Price</p>
              <h3 className="font-bold text-base sm:text-lg">
                ₹{averagePrice.toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Total Savings</p>
              <h3 className="text-purple-600 font-bold text-base sm:text-lg">
                ₹{savings.toLocaleString()}
              </h3>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Availability</p>
              <h3 className="text-green-600 font-bold text-base sm:text-lg">
                In Stock
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;