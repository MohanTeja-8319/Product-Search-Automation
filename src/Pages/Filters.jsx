

import React, { useState } from "react";

const Filters = ({
  // Data
  brands = [],
  categories = [],
  stores = [],
  ratings = [],

  // Selected Values
  selectedBrands = [],
  selectedCategories = [],
  selectedStores = [],
  selectedRatings = [],

  // Handlers
  handleBrandChange,
  handleCategoryChange,
  handleStoreChange,
  handleRatingChange,

  // Price
  maxPrice,
  setMaxPrice,
  clearAllFilters,

  brandCounts,
  categoryCounts,
  storeCounts,
}) => {
        const [showAllCategories, setShowAllCategories] = useState(false);
        const [showAllBrands, setShowAllBrands] = useState(false);
        const [showAllStores, setShowAllStores] = useState(false);

  return (
    <div className="w-[250px] bg-[#FCFCFD] rounded-xl border border-gray-200 p-5 shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Filters
        </h2>

        <button
            onClick={clearAllFilters}
            className="text-xs font-medium text-[#6C4CF1] hover:underline"
          >
          Clear All
        </button>
      </div>

      {/* ================= Categories ================= */}

      <div className="mb-6">

        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Categories
        </h3>

        <div
            className={`space-y-2 text-[13px] ${
              showAllCategories ? "max-h-40 overflow-y-auto pr-1" : ""
            }`}
          >

          {(showAllCategories ? categories : categories.slice(0, 4)).map(
          (category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="accent-[#6C4CF1] w-4 h-4"
              />

              <span>
                  {category}
                  <span className="text-gray-400 ml-1">
                      ({categoryCounts[category]})
                  </span>
              </span>
            </label>
          ))}


          {categories.length > 4 && (
          <button
            onClick={() =>
              setShowAllCategories(!showAllCategories)
            }
            className="mt-2 text-xs text-[#6C4CF1] font-medium"
          >
            {showAllCategories ? "Show Less" : "+ Show More"}
          </button>
)}

        </div>

      </div>

      {/* ================= Brands ================= */}

      <div className="mb-6">

        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Brands
        </h3>

          <div
              className={`space-y-2 text-[13px] ${
                showAllBrands ? "max-h-40 overflow-y-auto pr-1" : ""
              }`}
            >

          {(showAllBrands ? brands : brands.slice(0, 4)).map(
          (brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="accent-[#6C4CF1] w-4 h-4"
              />

            <span>
                {brand}
                <span className="text-gray-400 ml-1">
                    ({brandCounts[brand]})
                </span>
            </span>
            </label>
          ))}


           {brands.length > 4 && (
            <button
              onClick={() =>
                setShowAllBrands(!showAllBrands)
              }
              className="mt-2 text-xs text-[#6C4CF1] font-medium"
            >
              {showAllBrands ? "Show Less" : "+ Show More"}
            </button>
)}

        </div>

      </div>

      {/* ================= Price ================= */}

      <div className="mb-6">

        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Price Range
        </h3>

        <input
          type="range"
          min="10000"
          max="150000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#6C4CF1] cursor-pointer"
        />

        <div className="flex justify-between mt-2 text-xs text-gray-500">

          <span>₹10,000</span>

          <span className="font-semibold text-[#6C4CF1]">
            ₹{maxPrice.toLocaleString()}
          </span>

        </div>

      </div>

      {/* ================= Stores ================= */}

      <div className="mb-6">

        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Stores
        </h3>

        <div
  className={`space-y-2 text-[13px] ${
    showAllStores ? "max-h-40 overflow-y-auto pr-1" : ""
  }`}
>

          {(showAllStores ? stores : stores.slice(0, 4)).map(
  (store) => (
            <label
              key={store}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => handleStoreChange(store)}
                className="accent-[#6C4CF1] w-4 h-4"
              />

              <span>
                    {store}
                    <span className="text-gray-400 ml-1">
                        ({storeCounts[store]})
                    </span>
                </span>
            </label>
          ))}


          {stores.length > 4 && (
  <button
    onClick={() =>
      setShowAllStores(!showAllStores)
    }
    className="mt-2 text-xs text-[#6C4CF1] font-medium"
  >
    {showAllStores ? "Show Less" : "+ Show More"}
  </button>
)}

        </div>

      </div>

      {/* ================= Ratings ================= */}

      <div>

        <h3 className="text-sm font-semibold text-gray-800 mb-3">
          Ratings
        </h3>

        <div className="space-y-2 text-[13px]">

          {ratings.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingChange(rating)}
                className="accent-[#6C4CF1] w-4 h-4"
              />

              <span>{rating}★ & Above</span>
            </label>
          ))}

        </div>

      </div>

    </div>
  );
};

export default Filters;