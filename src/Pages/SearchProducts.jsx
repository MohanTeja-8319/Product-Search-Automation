import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchProducts = ({
  products = [],
  comparisonProducts = {},
}) => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
        <div className="text-5xl mb-4">🔍</div>

        <h3 className="text-lg font-bold text-gray-950 mb-2">
          No Products Found
        </h3>

        <p className="text-gray-500 text-sm">
          We couldn't find any products matching your search term.
          Try searching for something else!
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

        {/* Header */}

        <div className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] bg-gray-50 border-b border-gray-200 px-6 py-4 text-xs font-semibold uppercase text-gray-500">

          <div>Product</div>

          <div>Price</div>

          <div>Store</div>

          <div>Discount</div>

          <div className="text-center">
            Action
          </div>

        </div>

        {/* Products */}

        {currentProducts.map((product) => {

          const comparison =
            comparisonProducts[product.name];

          const hasComparison = !!comparison;

          return (

            <div
              key={product.id}
              className="grid grid-cols-[3fr_1fr_1.2fr_1.2fr_1fr] items-center px-6 py-5 border-b hover:bg-gray-50"
            >

              {/* Product */}

              <div className="flex items-center gap-4">

                <img
                  src={product.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80";
                  }}
                  alt={product.name}
                  className="w-14 h-14 object-contain"
                />

                <div>

                  <h3 className="font-semibold text-sm text-gray-900">
                    {product.name}
                  </h3>

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

              {/* Price */}

              <div className="font-semibold text-sm text-gray-900">

                ₹{product.price.toLocaleString()}

              </div>

              {/* Store */}

              <div className="text-sm text-gray-600">

                {product.store}

              </div>

              {/* Discount */}

              <div>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                  ↓ {product.discount}

                </span>

              </div>
{/* Button */}
         <div className="flex justify-center">

  {hasComparison ? (

    <button
      onClick={() =>
        navigate(
          `/comparison/${encodeURIComponent(product.name)}`
        )
      }
      className="border border-purple-600 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 hover:text-white transition"
    >
      View Deal
    </button>

  ) : (

    <button
      onClick={() => navigate(`/product/${product.id}`)}
      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition"
    >
      View Details
    </button>

  )}

</div>

            </div>

          );

        })}

      </div>

      {/* Pagination */}

      {totalPages > 1 && (

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">

          <p className="text-sm text-gray-500">

            Showing {startIndex + 1}–

            {Math.min(endIndex, products.length)}

            {" "}of{" "}

            {products.length} results

          </p>

          <div className="flex items-center gap-2">

            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(p - 1, 1))
              }
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex items-center gap-2 overflow-x-auto max-w-[420px] scrollbar-hide px-1">

              {Array.from(
                { length: totalPages },
                (_, i) => i + 1
              ).map((page) => (

                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] h-10 rounded-lg text-sm font-medium flex-shrink-0 transition ${
                    currentPage === page
                      ? "bg-purple-600 text-white"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>

              ))}

            </div>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(p + 1, totalPages)
                )
              }
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

export default SearchProducts;