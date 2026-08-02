import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Categories = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const categories = [
    {
      name: "Mobiles",
      categoryKey: "Smartphone",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&q=80",
    },
    {
      name: "Laptops",
      categoryKey: "Laptop",
      image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&q=80",
    },
    {
      name: "Headphones",
      categoryKey: "Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=120&q=80",
    },
    {
      name: "Foldables",
      categoryKey: "Smartphone",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&q=80",
    },
    {
      name: "Cameras",
      categoryKey: "Camera",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&q=80",
    },
    {
      name: "Accessories",
      categoryKey: "Accessories",
      image: "https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=120&q=80",
    },
  ];

  return (
    <section className="mt-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-sm font-bold text-gray-950">Browse by Category</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/categories")}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition"
          >
            View All Categories
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-indigo-300 hover:bg-gray-50 transition shrink-0 cursor-pointer text-gray-600 hover:text-indigo-600"
              title="Move left"
              aria-label="Move left"
            >
              <FiChevronLeft className="text-sm" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm hover:border-indigo-300 hover:bg-gray-50 transition shrink-0 cursor-pointer text-gray-600 hover:text-indigo-600"
              title="Move right"
              aria-label="Move right"
            >
              <FiChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth"
      >
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => navigate(`/search?category=${encodeURIComponent(cat.categoryKey)}`)}
            className="bg-white border border-gray-100 rounded-2xl pl-2 pr-5 py-2 flex items-center gap-3.5 shadow-sm cursor-pointer hover:border-indigo-300 hover:shadow-md transition duration-300 shrink-0"
          >
            {/* Larger Image Container */}
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100 p-1">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120";
                }}
              />
            </div>
            <span className="text-sm font-extrabold text-gray-900 tracking-tight leading-none">
              {cat.name}
            </span>
          </div>
        ))}

        {/* Right Scroll Arrow Button at end of list */}
        <button
          onClick={() => scroll("right")}
          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm hover:border-indigo-300 hover:shadow-md transition shrink-0 cursor-pointer"
          title="Move items right"
          aria-label="Move items right"
        >
          <FiChevronRight className="text-gray-600 text-sm" />
        </button>
      </div>
    </section>
  );
};

export default Categories;