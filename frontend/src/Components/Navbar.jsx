import React from "react";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import Profile from "./Profile";
import ThemeToggle from "./ThemeToggle";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3 flex-1 max-w-4xl mr-4 lg:mr-6">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white dark:text-white dark:hover:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-950 dark:hover:bg-slate-950 dark:hover:bg-slate-800 focus:outline-none cursor-pointer"
        >
          <FiMenu className="text-xl" />
        </button>
        <SearchBar />
      </div>

      <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-5">
        {/* Rectangular Theme Toggle Button */}
        <ThemeToggle />
        <Notification />
        <Profile />
      </div>
    </header>
  );
};

export default Navbar;