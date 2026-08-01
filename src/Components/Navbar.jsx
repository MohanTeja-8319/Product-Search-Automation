import React from "react";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import Profile from "./Profile";
import { FiMenu } from "react-icons/fi";

const Navbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggle-sidebar"));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-4xl mr-6">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50 focus:outline-none"
        >
          <FiMenu className="text-xl" />
        </button>
        <SearchBar />
      </div>
      
      <div className="flex items-center gap-4 lg:gap-6">
        <Notification />
        <Profile />
      </div>
    </header>
  );
};

export default Navbar;