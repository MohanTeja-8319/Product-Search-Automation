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
 <form onSubmit={handleSearch} className="w-full flex-1 min-w-0">
 <div className="relative flex items-center">
 <FiSearch className="absolute left-3.5 sm:left-4 text-slate-500 text-sm sm:text-base pointer-events-none" />
 <input
 type="text"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder="Search products, stores..."
 className="w-full h-10 sm:h-11 pl-9 sm:pl-11 pr-16 sm:pr-24 rounded-[12px] border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 shadow-soft transition"
 />
 <button
 type="submit"
 className="absolute right-1 sm:right-1.5 h-8 sm:h-8.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 rounded-[10px] text-xs font-bold transition shadow-sm cursor-pointer flex items-center justify-center gap-1"
 >
 <span className="hidden sm:inline">Search</span>
 <FiSearch className="sm:hidden text-xs" />
 </button>
 </div>
 </form>
 );
};

export default SearchBar;