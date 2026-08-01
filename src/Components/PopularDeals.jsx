import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";

const PopularDeals = () => {
  const navigate = useNavigate();
  // State to trigger rerender when wishlist updates
  const [wishlistUpdated, setWishlistUpdated] = useState(0);

  const deals = [
    {
      id: 1,
      name: "iPhone 15 (128GB)",
      category: "Smartphone",
      price: "₹69,900",
      drop: "5.41%",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80",
      stores: [
        { name: "Amazon", logo: "a", logoBg: "bg-black text-white", price: "₹69,900" },
        { name: "Flipkart", logo: "f", logoBg: "bg-blue-600 text-yellow-400", price: "₹70,499" },
        { name: "Croma", logo: "c", logoBg: "bg-teal-600 text-white", price: "₹71,999" },
      ],
    },
    {
      id: 2,
      name: "Dell Inspiron 15",
      category: "Laptop",
      price: "₹45,990",
      drop: "3.16%",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=300&q=80",
      stores: [
        { name: "Amazon", logo: "a", logoBg: "bg-black text-white", price: "₹45,990" },
        { name: "Flipkart", logo: "f", logoBg: "bg-blue-600 text-yellow-400", price: "₹46,499" },
        { name: "Croma", logo: "c", logoBg: "bg-teal-600 text-white", price: "₹47,999" },
      ],
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      category: "Headphones",
      price: "₹29,990",
      drop: "6.25%",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
      stores: [
        { name: "Amazon", logo: "a", logoBg: "bg-black text-white", price: "₹29,990" },
        { name: "Flipkart", logo: "f", logoBg: "bg-blue-600 text-yellow-400", price: "₹30,999" },
        { name: "Croma", logo: "c", logoBg: "bg-teal-600 text-white", price: "₹31,999" },
      ],
    },
    {
      id: 4,
      name: "OnePlus Nord 4",
      category: "Smartphone",
      price: "₹29,999",
      drop: "4.48%",
      image: "https://images.unsplash.com/photo-1565849328678-9275afe5d766?w=300&q=80",
      stores: [
        { name: "Amazon", logo: "a", logoBg: "bg-black text-white", price: "₹29,999" },
        { name: "Flipkart", logo: "f", logoBg: "bg-blue-600 text-yellow-400", price: "₹30,499" },
        { name: "Croma", logo: "c", logoBg: "bg-teal-600 text-white", price: "₹30,999" },
      ],
    },
  ];

  const handleWishlistToggle = (item) => {
    // Format item fields to match product specifications
    const numericPrice = Number(item.price.replace(/[^\d]/g, ""));
    toggleWishlistItem({
      name: item.name,
      category: item.category,
      price: numericPrice,
      discount: item.drop,
      image: item.image,
      store: item.stores[0]?.name,
    });
    setWishlistUpdated((prev) => prev + 1);
  };

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-bold text-gray-950">Popular Deals</h2>
        <button
          onClick={() => navigate("/search")}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {deals.map((item) => {
          const inWishlist = isProductInWishlist(item.name);
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm relative group"
            >
              {/* Heart Icon (Top Right) */}
              <button
                onClick={() => handleWishlistToggle(item)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 hover:bg-gray-50 p-1.5 rounded-full transition duration-200 z-10"
              >
                {inWishlist ? (
                  <FaHeart className="text-sm text-red-500" />
                ) : (
                  <FiHeart className="text-sm" />
                )}
              </button>

              {/* Product Image Area */}
              <div
                onClick={() => navigate(`/comparison/${encodeURIComponent(item.name)}`)}
                className="w-full h-32 flex items-center justify-center bg-gray-50 rounded-xl mb-3 overflow-hidden p-3 select-none cursor-pointer"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200";
                  }}
                />
              </div>

              {/* Product Info */}
              <div
                onClick={() => navigate(`/comparison/${encodeURIComponent(item.name)}`)}
                className="text-center mb-3 cursor-pointer"
              >
                <h3 className="font-bold text-xs text-gray-900 leading-tight line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                  {item.category}
                </p>
              </div>

              {/* Price & Drop Row */}
              <div className="flex justify-between items-center px-1 mb-3">
                <span className="font-extrabold text-sm text-gray-950">
                  {item.price}
                </span>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 leading-none">
                  ↓ {item.drop}
                </span>
              </div>

              {/* Store Comparison List */}
              <div className="space-y-1.5 border-t border-gray-50 pt-3 mb-2">
                {item.stores.map((store, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[10px] px-0.5">
                    <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                      <span
                        className={`w-3.5 h-3.5 rounded flex items-center justify-center font-bold text-[8px] uppercase select-none ${store.logoBg}`}
                      >
                        {store.logo}
                      </span>
                      <span>{store.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{store.price}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => navigate(`/comparison/${encodeURIComponent(item.name)}`)}
                className="w-full mt-2 py-2 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/30 text-indigo-600 text-xs font-bold rounded-xl transition duration-200"
              >
                Compare Prices
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PopularDeals;