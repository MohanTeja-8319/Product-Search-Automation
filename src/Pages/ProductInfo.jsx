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
    <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Product Image */}

        <div className="lg:w-1/3 flex justify-center items-center">

          <img
            src={image}
            alt={productName}
            className="h-64 object-contain hover:scale-105 transition"
          />

        </div>

        {/* Product Details */}

        <div className="flex-1">

          <h1 className="text-3xl font-bold text-gray-900">

            {productName}

          </h1>

          <div className="flex items-center gap-2 mt-3">

            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">

              ⭐ {rating}

            </span>

            <span className="text-gray-500">

              Highly Rated Product

            </span>

          </div>

          <div className="grid grid-cols-2 gap-5 mt-8">

            <div>

              <p className="text-gray-500 text-sm">

                Best Store

              </p>

              <h3 className="font-bold text-lg">

                {bestStore}

              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">

                Lowest Price

              </p>

              <h3 className="text-green-600 font-bold text-lg">

                ₹{lowestPrice.toLocaleString()}

              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">

                Highest Price

              </p>

              <h3 className="text-red-500 font-bold text-lg">

                ₹{highestPrice.toLocaleString()}

              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">

                Average Price

              </p>

              <h3 className="font-bold text-lg">

                ₹{averagePrice.toLocaleString()}

              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">

                Total Savings

              </p>

              <h3 className="text-purple-600 font-bold text-lg">

                ₹{savings.toLocaleString()}

              </h3>

            </div>

            <div>

              <p className="text-gray-500 text-sm">

                Availability

              </p>

              <h3 className="text-green-600 font-bold">

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