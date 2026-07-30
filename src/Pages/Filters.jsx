import React from "react";

const Filters = () => {
  return (
    <div className="w-[240px] bg-white rounded-xl border border-gray-200 p-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Filters
        </h2>

        <button className="text-xs font-medium text-purple-600 hover:underline">
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Categories
        </h3>

        <div className="space-y-2 text-[13px]">

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Smartphones
            </div>
            <span className="text-[11px] text-gray-400">(25)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Accessories
            </div>
            <span className="text-[11px] text-gray-400">(250)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Tablets
            </div>
            <span className="text-[11px] text-gray-400">(80)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Laptops
            </div>
            <span className="text-[11px] text-gray-400">(40)</span>
          </label>

          <button className="text-xs text-purple-600 font-medium">
            + Show more
          </button>

        </div>
      </div>

      {/* Brands */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Brands
        </h3>

        <div className="space-y-2 text-[13px]">

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Apple
            </div>
            <span className="text-[11px] text-gray-400">(120)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Samsung
            </div>
            <span className="text-[11px] text-gray-400">(95)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              OnePlus
            </div>
            <span className="text-[11px] text-gray-400">(40)</span>
          </label>

          <label className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="accent-purple-600 w-3.5 h-3.5"
              />
              Nothing
            </div>
            <span className="text-[11px] text-gray-400">(25)</span>
          </label>

          <button className="text-xs text-purple-600 font-medium">
            + Show more
          </button>

        </div>
      </div>

      {/* Price Range */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Price Range
        </h3>

        <input
          type="range"
          min="20000"
          max="150000"
          defaultValue="120000"
          className="w-full accent-purple-600"
        />

        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
          <span>₹20,000</span>
          <span>₹1,50,000+</span>
        </div>
      </div>

      {/* Stores */}
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Stores
        </h3>

        <div className="space-y-2 text-[13px]">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked
              className="accent-purple-600 w-3.5 h-3.5"
            />
            Amazon
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked
              className="accent-purple-600 w-3.5 h-3.5"
            />
            Flipkart
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            Croma
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            Reliance Digital
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            Vijay Sales
          </label>

          <button className="text-xs text-purple-600 font-medium">
            + Show more
          </button>

        </div>
      </div>

      {/* Ratings */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">
          Ratings
        </h3>

        <div className="space-y-2 text-[13px]">

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked
              className="accent-purple-600 w-3.5 h-3.5"
            />
            4 ★ & above
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            3 ★ & above
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            2 ★ & above
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="accent-purple-600 w-3.5 h-3.5"
            />
            1 ★ & above
          </label>

        </div>
      </div>

    </div>
  );
};

export default Filters;