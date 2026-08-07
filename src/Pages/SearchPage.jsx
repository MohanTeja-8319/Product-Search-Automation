import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import dummyProducts from "../data/products.js";
import comparisonProducts from "../data/comparisionProducts";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

import groupProducts from "../utils/groupProducts";

export const Filters = ({
  brands = [],
  categories = [],
  stores = [],
  ratings = [],
  selectedBrands = [],
  selectedCategories = [],
  selectedStores = [],
  selectedRatings = [],
  handleBrandChange,
  handleCategoryChange,
  handleStoreChange,
  handleRatingChange,
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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button
          onClick={clearAllFilters}
          className="text-xs font-medium text-[#6C4CF1] hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Categories</h3>
        <div className={`space-y-2 text-[13px] ${showAllCategories ? "max-h-40 overflow-y-auto pr-1" : ""}`}>
          {(showAllCategories ? categories : categories.slice(0, 4)).map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="accent-[#6C4CF1] w-4 h-4"
              />
              <span>
                {category}
                <span className="text-gray-400 ml-1">({categoryCounts[category]})</span>
              </span>
            </label>
          ))}
          {categories.length > 4 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="mt-2 text-xs text-[#6C4CF1] font-medium"
            >
              {showAllCategories ? "Show Less" : "+ Show More"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Brands</h3>
        <div className={`space-y-2 text-[13px] ${showAllBrands ? "max-h-40 overflow-y-auto pr-1" : ""}`}>
          {(showAllBrands ? brands : brands.slice(0, 4)).map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="accent-[#6C4CF1] w-4 h-4"
              />
              <span>
                {brand}
                <span className="text-gray-400 ml-1">({brandCounts[brand]})</span>
              </span>
            </label>
          ))}
          {brands.length > 4 && (
            <button
              onClick={() => setShowAllBrands(!showAllBrands)}
              className="mt-2 text-xs text-[#6C4CF1] font-medium"
            >
              {showAllBrands ? "Show Less" : "+ Show More"}
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Price Range</h3>
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
          <span className="font-semibold text-[#6C4CF1]">₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Stores</h3>
        <div className={`space-y-2 text-[13px] ${showAllStores ? "max-h-40 overflow-y-auto pr-1" : ""}`}>
          {(showAllStores ? stores : stores.slice(0, 4)).map((store) => (
            <label key={store} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStores.includes(store)}
                onChange={() => handleStoreChange(store)}
                className="accent-[#6C4CF1] w-4 h-4"
              />
              <span>
                {store}
                <span className="text-gray-400 ml-1">({storeCounts[store]})</span>
              </span>
            </label>
          ))}
          {stores.length > 4 && (
            <button
              onClick={() => setShowAllStores(!showAllStores)}
              className="mt-2 text-xs text-[#6C4CF1] font-medium"
            >
              {showAllStores ? "Show Less" : "+ Show More"}
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-800 mb-3">Ratings</h3>
        <div className="space-y-2 text-[13px]">
          {ratings.map((rating) => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
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

export const SearchProducts = ({ products = [], comparisonProducts = {} }) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-gray-950 mb-2">No Products Found</h3>
        <p className="text-gray-500 text-sm">
          We couldn't find any products matching your search term. Try searching for something else!
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <>
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold uppercase text-gray-500">
          <div>Product</div>
          <div>Price</div>
          <div>Store</div>
          <div>Discount</div>
          <div className="text-center">Action</div>
        </div>

        {currentProducts.map((product) => {
          const comparison = comparisonProducts[product.name];
          const hasComparison = !!comparison;

          return (
            <div
              key={product.id}
              className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-50 flex items-center justify-center shrink-0 rounded-xl border border-gray-100 p-1.5 shadow-sm">
                  <img
                    src={product.image}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&q=80";
                    }}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    alt={product.name}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{product.name}</h3>
                  {hasComparison && (
                    <span className="inline-block mt-1 bg-purple-100 text-purple-700 text-[11px] font-semibold px-2 py-1 rounded-full">
                      🏆 Best Deal Available
                    </span>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {product.brand} | {product.category}
                  </p>
                </div>
              </div>

              <div className="font-semibold text-sm text-gray-900">
                ₹{product.price.toLocaleString()}
              </div>

              <div className="text-sm text-gray-600">{product.store}</div>

              <div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  ↓ {product.discount}
                </span>
              </div>

              <div className="flex justify-center">
                {hasComparison ? (
                  <button
                    onClick={() =>
                      window.open(`/comparison/${encodeURIComponent(product.name)}`, "_blank")
                    }
                    className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition cursor-pointer"
                  >
                    View Deal
                  </button>
                ) : (
                  <button
                    onClick={() => window.open(`/product/${product.id}`, "_blank")}
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition cursor-pointer"
                  >
                    View Details
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, products.length)} of {products.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-2 overflow-x-auto max-w-[420px] scrollbar-hide px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] h-10 rounded-lg text-sm font-medium flex-shrink-0 transition ${
                    currentPage === page ? "bg-purple-600 text-white" : "border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const initialCategory = searchParams.get("category");
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStores([]);
    setSelectedRatings([]);
    setMaxPrice(150000);
    setSortBy("relevance");
  };

  const brands = [...new Set(dummyProducts.map((p) => p.brand))];
  const categories = [...new Set(dummyProducts.map((p) => p.category))];
  const stores = [...new Set(dummyProducts.map((p) => p.store))];
  const ratings = [4, 3, 2, 1];

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleStoreChange = (store) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const brandCounts = brands.reduce((acc, brand) => {
    acc[brand] = dummyProducts.filter((p) => p.brand === brand).length;
    return acc;
  }, {});

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = dummyProducts.filter((p) => p.category === category).length;
    return acc;
  }, {});

  const storeCounts = stores.reduce((acc, store) => {
    acc[store] = dummyProducts.filter((p) => p.store === store).length;
    return acc;
  }, {});

  let searchedProducts = dummyProducts.filter((product) => {
    const term = query.toLowerCase();
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);

    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesStore = selectedStores.length === 0 || selectedStores.includes(product.store);
    const matchesRating = selectedRatings.length === 0 || selectedRatings.some((r) => product.rating >= r);
    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesBrand && matchesCategory && matchesStore && matchesRating && matchesPrice;
  });

  const filteredProducts = [...groupProducts(searchedProducts)];

  switch (sortBy) {
    case "low-high":
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case "high-low":
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case "discount":
      filteredProducts.sort((a, b) => parseFloat(b.discount) - parseFloat(a.discount));
      break;
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      <Sidebar />
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 flex-1">
          <div className="mb-8">
            <div className="flex items-start justify-between mt-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {query ? (
                    <>
                      Search Results for <span className="text-purple-600">"{query}"</span>
                    </>
                  ) : (
                    "All Products"
                  )}
                </h2>
                <p className="mt-2 text-gray-500 text-sm">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"} found
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 font-medium">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm outline-none cursor-pointer"
                >
                  <option value="relevance">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                  <option value="discount">Highest Discount</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <Filters
                brands={brands}
                categories={categories}
                stores={stores}
                ratings={ratings}
                selectedBrands={selectedBrands}
                selectedCategories={selectedCategories}
                selectedStores={selectedStores}
                selectedRatings={selectedRatings}
                handleBrandChange={handleBrandChange}
                handleCategoryChange={handleCategoryChange}
                handleStoreChange={handleStoreChange}
                handleRatingChange={handleRatingChange}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                clearAllFilters={clearAllFilters}
                brandCounts={brandCounts}
                categoryCounts={categoryCounts}
                storeCounts={storeCounts}
              />
              <div className="flex-1">
                <SearchProducts
                  products={filteredProducts}
                  comparisonProducts={comparisonProducts}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;