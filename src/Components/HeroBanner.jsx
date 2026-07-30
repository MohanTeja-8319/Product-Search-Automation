import React from "react";
import {
  FaSearch,
  FaTags,
  FaChartLine,
  FaShoppingCart,
} from "react-icons/fa";

const HeroBanner = () => {
  return (
    <section className="w-full mt-8">
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl shadow-xl overflow-hidden">

        <div className="grid lg:grid-cols-2 gap-10 items-center p-10">

          {/* Left Side */}
          <div className="text-white">

            <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
              🚀 Smart Shopping Assistant
            </span>

            <h1 className="text-5xl font-bold mt-6 leading-tight">
              Compare Products
              <br />
              <span className="text-yellow-300">
                Before You Buy
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-100">
              Search products from multiple e-commerce websites,
              compare prices, ratings, discounts, and choose
              the best deal instantly.
            </p>

            <div className="flex gap-4 mt-8">

              <button className="bg-white text-indigo-600 font-semibold px-7 py-3 rounded-xl hover:scale-105 transition duration-300 shadow-lg">
                Start Searching
              </button>

              <button className="border border-white text-white px-7 py-3 rounded-xl hover:bg-white hover:text-indigo-600 transition">
                Explore Deals
              </button>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-3 gap-5 mt-10">

              <div>
                <h2 className="text-3xl font-bold">
                  10K+
                </h2>

                <p className="text-gray-200">
                  Products
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  50+
                </h2>

                <p className="text-gray-200">
                  Brands
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  99%
                </h2>

                <p className="text-gray-200">
                  Accuracy
                </p>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="relative flex justify-center items-center">

            {/* Main Card */}

            <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">

              <div className="flex items-center gap-3 mb-6">

                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaShoppingCart className="text-indigo-600 text-2xl" />
                </div>

                <div>
                  <h3 className="font-bold text-xl">
                    Apple MacBook Air M3
                  </h3>

                  <p className="text-gray-500">
                    Compare Prices
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <div className="flex justify-between bg-gray-100 rounded-xl p-3">
                  <span>Amazon</span>
                  <span className="font-bold text-green-600">
                    ₹99,999
                  </span>
                </div>

                <div className="flex justify-between bg-gray-100 rounded-xl p-3">
                  <span>Flipkart</span>
                  <span className="font-bold text-green-600">
                    ₹98,499
                  </span>
                </div>

                <div className="flex justify-between bg-gray-100 rounded-xl p-3">
                  <span>Croma</span>
                  <span className="font-bold text-green-600">
                    ₹1,00,999
                  </span>
                </div>

              </div>

              <button className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition">
                Compare Now
              </button>

            </div>

            {/* Floating Cards */}

            <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">

              <FaSearch className="text-indigo-600 text-2xl" />

              <div>
                <h3 className="font-semibold">
                  Smart Search
                </h3>

                <p className="text-sm text-gray-500">
                  Fast Product Search
                </p>
              </div>

            </div>

            <div className="absolute bottom-0 -right-6 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">

              <FaTags className="text-pink-500 text-2xl" />

              <div>
                <h3 className="font-semibold">
                  Best Discounts
                </h3>

                <p className="text-sm text-gray-500">
                  Save More Money
                </p>
              </div>

            </div>

            <div className="absolute top-1/2 -right-12 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3">

              <FaChartLine className="text-green-600 text-2xl" />

              <div>
                <h3 className="font-semibold">
                  Price Trends
                </h3>

                <p className="text-sm text-gray-500">
                  Track Price Changes
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;