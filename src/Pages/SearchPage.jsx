import React from "react";
import { useSearchParams } from "react-router-dom";
import dummyProducts from "../data/products.js";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import Filters from "./Filters";
import SearchProducts from "./SearchProducts";
import PriceAlert from "../Components/PriceAlert";
import WatchList from "../Components/WatchList";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredProducts = dummyProducts.filter((product) => {
    if (!query) return true;
    const term = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen text-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-72 flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 flex-1">
          <div className="mb-8">
            {/* ================= Search Results Header ================= */}
            <div className="flex items-start justify-between mt-4 mb-6">
              {/* Left */}
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

              {/* Right */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 font-medium">
                  Sort by:
                </label>
                <select
                  className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm outline-none cursor-pointer"
                >
                  <option>Relevance</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Highest Discount</option>
                  <option>Newest First</option>
                  <option>Customer Rating</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>

            {/* Page Layout Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
              {/* Left Main Column (75%) */}
              <div className="xl:col-span-3">
                <div className="flex gap-6 items-start">
                  <Filters />
                  <div className="flex-1">
                    <SearchProducts products={filteredProducts} />
                  </div>
                </div>
              </div>

              {/* Right Column (25%) */}
              <div className="xl:col-span-1 space-y-6">
                <PriceAlert />
                <WatchList />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchPage;