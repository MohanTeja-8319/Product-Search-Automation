import React from "react";
import { FiChevronDown } from "react-icons/fi";

const Profile = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition">
      <img
        src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix"
        alt="User profile"
        className="w-10 h-10 rounded-full border border-gray-100 object-cover bg-sky-100"
      />
      <span className="font-semibold text-sm text-gray-800 hidden sm:inline-block">
        Hello, User
      </span>
      <FiChevronDown className="text-gray-500 text-sm" />
    </div>
  );
};

export default Profile;