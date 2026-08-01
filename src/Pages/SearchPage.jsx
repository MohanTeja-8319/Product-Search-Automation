import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import dummyProducts from "../data/products";
import comparisonProducts from "../data/comparisionProducts";

import Sidebar from "./SideBar";
import TopNavbar from "./TopNavBar";
import Filters from "./Filters";
import SearchProducts from "./SearchProducts";

import groupProducts from "../utils/groupProducts";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [maxPrice, setMaxPrice] = useState(150000);
  const [sortBy, setSortBy] = useState("relevance");

  // -------------------- Clear Filters --------------------

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedStores([]);
    setSelectedRatings([]);
    setMaxPrice(150000);
    setSortBy("relevance");
  };

  // -------------------- Filter Values --------------------

  const brands = [...new Set(dummyProducts.map((p) => p.brand))];

  const categories = [
    ...new Set(dummyProducts.map((p) => p.category)),
  ];

  const stores = [...new Set(dummyProducts.map((p) => p.store))];

  const ratings = [4, 3, 2, 1];

  // -------------------- Checkbox Handlers --------------------

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStoreChange = (store) => {
    setSelectedStores((prev) =>
      prev.includes(store)
        ? prev.filter((s) => s !== store)
        : [...prev, store]
    );
  };

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  // -------------------- Counts --------------------

  const brandCounts = brands.reduce((acc, brand) => {
    acc[brand] = dummyProducts.filter(
      (p) => p.brand === brand
    ).length;

    return acc;
  }, {});

  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = dummyProducts.filter(
      (p) => p.category === category
    ).length;

    return acc;
  }, {});

  const storeCounts = stores.reduce((acc, store) => {
    acc[store] = dummyProducts.filter(
      (p) => p.store === store
    ).length;

    return acc;
  }, {});

  // -------------------- Search --------------------

  let searchedProducts = dummyProducts.filter((product) => {
    const term = query.toLowerCase();

    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term);

    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand);

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesStore =
      selectedStores.length === 0 ||
      selectedStores.includes(product.store);

    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.some(
        (rating) => product.rating >= rating
      );

    const matchesPrice =
      product.price <= maxPrice;

    return (
      matchesSearch &&
      matchesBrand &&
      matchesCategory &&
      matchesStore &&
      matchesRating &&
      matchesPrice
    );
  });

  // -------------------- Group Products --------------------

  const filteredProducts = [
    ...groupProducts(searchedProducts),
  ];

  // -------------------- Sorting --------------------

  switch (sortBy) {
    case "low-high":
      filteredProducts.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "high-low":
      filteredProducts.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "discount":
      filteredProducts.sort(
        (a, b) =>
          parseFloat(b.discount) -
          parseFloat(a.discount)
      );
      break;

    case "rating":
      filteredProducts.sort(
        (a, b) => b.rating - a.rating
      );
      break;

    default:
      break;
  };
    return (
       
        <div className="flex h-screen bg-[#f7f8fc] overflow-hidden">

            {/* Sidebar */}

           <div className="h-screen w-64 overflow-y-auto hide-scrollbar border-r bg-white">

                <Sidebar />

            </div>

            {/* Main */}

           <div className="flex-1 flex flex-col overflow-hidden">

    <TopNavbar />

    <div className="flex-1 overflow-y-auto hide-scrollbar">

        <div className="max-w-7xl mx-auto px-8 py-6">

       

          {/* Search Result Header */}

          <div className="flex items-start justify-between mt-8 mb-6">

            {/* Left */}

            <div>

              <h2 className="text-2xl font-bold text-gray-900">

                {query ? (
                  <>
                    Search Results for{" "}
                    <span className="text-purple-600">
                      "{query}"
                    </span>
                  </>
                ) : (
                  "All Products"
                )}

              </h2>

              <p className="mt-2 text-sm text-gray-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "result"
                  : "results"}{" "}
                found
              </p>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

              <label className="text-sm font-medium text-gray-500">
                Sort by:
              </label>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm outline-none cursor-pointer"
              >
                <option value="relevance">
                  Relevance
                </option>

                <option value="low-high">
                  Price: Low to High
                </option>

                <option value="high-low">
                  Price: High to Low
                </option>

                <option value="discount">
                  Highest Discount
                </option>

                <option value="rating">
                  Customer Rating
                </option>

              </select>

            </div>

          </div>

          {/* Filters + Products */}

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

      </div>
</div>
    </div>
  );
};

export default SearchPage;