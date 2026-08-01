import React from "react";
import { FaHeart } from "react-icons/fa";
import comparisonProducts from "../data/comparisionProducts";
import dummyProducts from "../data/products";

const StickyBuyBar = ({ productName, bestDeal }) => {

   
  if (!bestDeal) return null;

  return (

    <div className="fixed bottom-0 left-64 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">

        {/* Left */}

        <div className="flex items-center gap-5">

          <img
            src={bestDeal.image}
            alt={productName}
            className="w-16 h-16 object-contain"
          />

          <div>

            <h2 className="font-bold text-lg">

              {productName}

            </h2>

            <p className="text-gray-500">

              Best Price on {bestDeal.store}

            </p>

          </div>

        </div>

        {/* Middle */}

        <div className="text-center">

          <p className="text-sm text-gray-500">

            Lowest Price

          </p>

          <h2 className="text-3xl font-bold text-purple-700">

            ₹{bestDeal.price.toLocaleString()}

          </h2>

        </div>

        {/* Right */}

        <div className="flex gap-4">

          

          <a
            href={bestDeal.url}
            target="_blank"
            rel="noreferrer"
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            Buy Now
          </a>

          <button
    className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-300 hover:border-red-500 hover:bg-red-50 transition"
>
    <FaHeart className="text-red-500 text-lg" />
</button>

        </div>

      </div>

    </div>

  );

};

export default StickyBuyBar;