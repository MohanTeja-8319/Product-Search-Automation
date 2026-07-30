import React from "react";
import dummyProducts from "/src/data/products.js";
import Sidebar from "./SideBar";
import TopNavbar from "./TopNavBar";
import Filters from "./Filters";
import SearchProducts from "./SearchProducts";
const SearchPage = () => {
  return (
    <div className="flex">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex-1 p-6">
        <TopNavbar/>
        {/* Search page content goes here */}

        <div className="mb-8">

      {/* ================= Search Results Header ================= */}

<div className="flex items-start justify-between mt-8 mb-6">

  {/* Left */}
  <div>
    <h2 className="text-2xl font-bold text-gray-900">
      Search Results for <span className="text-black">"iPhone 15"</span>
    </h2>

    <p className="mt-2 text-gray-500 text-sm">
      120 results found
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


 <div className="flex gap-6 items-start">

          <Filters />

          <div className="flex-1">
            <SearchProducts />
          </div>

        </div>


</div>
    </div>
</div>
  );
};

export default SearchPage;