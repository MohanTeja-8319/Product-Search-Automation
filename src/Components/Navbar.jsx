import React from "react";
import SearchBar from "./SearchBar";
import Notification from "./Notification";
import Profile from "./Profile";

const Navbar = () => {
  return (
    <nav
      className="ml-72 h-20 bg-white
      flex items-center justify-between
      px-8 shadow"
    >

      <SearchBar />

      <div className="flex items-center gap-6">
        <Notification />
        <Profile />
      </div>

    </nav>
  );
};

export default Navbar;