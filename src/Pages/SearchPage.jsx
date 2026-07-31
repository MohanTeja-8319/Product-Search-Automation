import React,{useState} from "react";
import { useSearchParams } from "react-router-dom";
import dummyProducts from "../data/products.js";
import Sidebar from "./SideBar";
import TopNavbar from "./TopNavBar";
import Filters from "./Filters";
import SearchProducts from "./SearchProducts";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sortBy, setSortBy] = React.useState("relevance");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [maxPrice, setMaxPrice] = useState(150000);



  const clearAllFilters = () => {
  setSelectedBrands([]);
  setSelectedCategories([]);
  setSelectedStores([]);
  setSelectedRatings([]);
  setMaxPrice(150000);
  setSortBy("relevance");
};

  const brands = [...new Set(dummyProducts.map(product => product.brand))];
  const handleBrandChange = (brand) => {
  setSelectedBrands((prev) =>
    prev.includes(brand)
      ? prev.filter((b) => b !== brand)
      : [...prev, brand]
  );
};


const categories = [
  ...new Set(dummyProducts.map((product) => product.category)),
];

const handleCategoryChange = (category) => {
  setSelectedCategories((prev) =>
    prev.includes(category)
      ? prev.filter((c) => c !== category)
      : [...prev, category]
  );
};


const stores = [...new Set(dummyProducts.map(product => product.store))];

const handleStoreChange = (store) => {
  setSelectedStores((prev) =>
    prev.includes(store)
      ? prev.filter((s) => s !== store)
      : [...prev, store]
  );
};




const ratings = [4, 3, 2, 1];
const handleRatingChange = (rating) => {
  setSelectedRatings((prev) =>
    prev.includes(rating)
      ? prev.filter((r) => r !== rating)
      : [...prev, rating]
  );
};



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



   let filteredProducts = dummyProducts.filter((product) => {
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
  selectedRatings.some((rating) => product.rating >= rating);


     const matchesPrice = product.price <= maxPrice;
return (
  matchesSearch &&
  matchesBrand &&
  matchesCategory &&
  matchesStore &&
  matchesRating &&
  matchesPrice
);
});

  switch (sortBy) {
  case "low-high":
    filteredProducts.sort((a, b) => a.price - b.price);
    break;

  case "high-low":
    filteredProducts.sort((a, b) => b.price - a.price);
    break;

  case "discount":
    filteredProducts.sort(
      (a, b) =>
        parseFloat(b.discount) - parseFloat(a.discount)
    );
    break;

  case "rating":
    filteredProducts.sort((a, b) => b.rating - a.rating);
    break;

  default:
    break;
}

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <TopNavbar />
        {/* Search page content goes here */}

        <div className="mb-8">

          {/* ================= Search Results Header ================= */}

          <div className="flex items-start justify-between mt-8 mb-6">

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
               value={sortBy}
               onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm outline-none cursor-pointer"
>
                <option value="relevance">Relevance</option>

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
              <SearchProducts products={filteredProducts} />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default SearchPage;