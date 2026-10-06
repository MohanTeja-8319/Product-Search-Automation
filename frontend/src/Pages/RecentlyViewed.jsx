import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { syncUserData } from "../utils/api";

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentProducts")) || [];
    setProducts(recent);
  }, []);

  const openProduct = (product) => {
    // Always navigate to comparison page — it uses live API to fetch product data
    navigate(
      `/comparison/${encodeURIComponent(product.name || product.title)}`,
      { state: { product } }
    );
  };

  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-[10px] border border-gray-200 mt-8 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
        <button
          onClick={() => {
            localStorage.removeItem("recentProducts");
            setProducts([]);
            if (localStorage.getItem("token"))
              syncUserData({ recentProducts: [] }).catch(() => {});
          }}
          className="text-sm text-red-500 hover:underline"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {products.map((product, i) => {
          const price =
            typeof product.price === "number"
              ? product.price
              : parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0;
          const rating = product.rating ?? product.ratings ?? 4.0;

          return (
            <div
              key={`${product.id || "rv"}-${i}`}
              onClick={() => openProduct(product)}
              className="cursor-pointer border rounded-[10px] p-4 hover:shadow-soft transition"
            >
              <img
                src={product.image || product.imageUrl || "/placeholder.png"}
                alt={product.name || product.title}
                className="h-36 w-full object-contain"
                onError={(e) => { e.target.src = "/placeholder.png"; }}
              />

              <h3 className="font-semibold mt-3 line-clamp-2">
                {product.name || product.title}
              </h3>

              <p className="text-purple-700 font-bold mt-2">
                ₹{price.toLocaleString()}
              </p>

              <div className="flex justify-between mt-2">
                <span className="text-yellow-500">
                  ⭐ {typeof rating === "number" ? rating.toFixed(1) : rating}
                </span>
                {product.discount && (
                  <span className="text-emerald-600 text-sm">
                    {product.discount}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentlyViewed;