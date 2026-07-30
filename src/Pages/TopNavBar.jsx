import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";

const TopNavbar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-[72px] bg-white border-b border-gray-200 px-6 flex items-center justify-between">

      {/* Search */}
      <form onSubmit={handleSearch} className="relative w-[650px]">

        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-lg" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more..."
          className="w-full h-12 rounded-xl border border-gray-200 pl-14 pr-36 text-[15px] outline-none"
        />

        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-[120px] rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-500"
        >
          Search
        </button>

      </form>

      {/* Right Side */}
      <div className="flex items-center gap-8">

        <div className="relative cursor-pointer">

          <FaBell className="text-[24px]" />

          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
            3
          </span>

        </div>

        <div className="flex items-center gap-3 cursor-pointer">

          <img
            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />

          <span className="font-semibold text-[16px] text-gray-800">
            Hello, User
          </span>

          <FaChevronDown className="text-gray-600 text-sm" />

        </div>

      </div>

    </header>
  );
};

export default TopNavbar;