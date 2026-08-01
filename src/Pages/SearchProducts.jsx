import React, { useState } from "react";

const SearchProducts = ({ products = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-bold text-gray-950 mb-2">No Products Found</h3>
        <p className="text-gray-500 text-sm">We couldn't find any products matching your search term. Try searching for something else!</p>
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
        {/* Table Header */}
        <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold uppercase text-gray-500">
          <div>Product</div>
          <div>Price</div>
          <div>Store</div>
          <div>Discount</div>
          <div className="text-center">Action</div>
        </div>

        {/* Rows */}
        {currentProducts.map((product) => (
          <div key={product.id} className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50">
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
                <h3 className="font-semibold text-sm text-gray-900">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {product.brand} | {product.category}
                </p>
              </div>
            </div>

            <div className="font-semibold text-sm text-gray-900">
              ₹{product.price.toLocaleString()}
            </div>

            <div className="text-sm text-gray-600">
              {product.store}
            </div>

            <div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                ↓ {product.discount}
              </span>
            </div>

            <div className="flex justify-center">
              <a
                href={product.url || "#"}
                className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition"
              >
                View Deal
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, products.length)} of {products.length} results
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-purple-600 text-white shadow-md"
                    : "border hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchProducts;