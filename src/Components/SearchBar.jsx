import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMicrophone } from "react-icons/fa";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-3xl mx-8">
      <div className="relative">

        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for mobiles, laptops, headphones..."
          className="w-full h-14 pl-14 pr-32 rounded-full border border-gray-300 shadow-sm bg-white
          focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          type="submit"
          className="absolute right-16 top-2 bg-indigo-600 hover:bg-indigo-700
          text-white px-5 py-2 rounded-full transition"
        >
          Search
        </button>

        <button
          type="button"
          className="absolute right-2 top-2 w-10 h-10 rounded-full
          bg-gray-100 hover:bg-indigo-100 flex justify-center items-center"
        >
          <FaMicrophone className="text-indigo-600" />
        </button>

      </div>
    </form>
  );
};

export default SearchBar;