import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full flex-1">
      <div className="relative flex items-center">
        <FiSearch className="absolute left-5 text-gray-400 text-lg" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products, brands and more..."
          className="w-full h-12 pl-12 pr-28 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
        />
        <button
          type="submit"
          className="absolute right-1.5 h-9 bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-lg text-xs font-semibold tracking-wide transition shadow-sm cursor-pointer"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;