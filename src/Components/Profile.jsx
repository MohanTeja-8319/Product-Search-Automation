import React from "react";
import { FaChevronDown } from "react-icons/fa";

const Profile = () => {
  return (
    <div
      className="flex items-center gap-4
      bg-white shadow-md px-4 py-2
      rounded-full cursor-pointer
      hover:shadow-lg transition"
    >

      <img
        src="https://i.pravatar.cc/150?img=12"
        alt="profile"
        className="w-12 h-12 rounded-full border-2 border-indigo-600"
      />

      <div className="hidden md:block">

        <h3 className="font-semibold text-gray-800">
          Mohan Teja
        </h3>

        <p className="text-sm text-gray-500">
          Premium User
        </p>

      </div>

      <FaChevronDown className="text-gray-500" />

    </div>
  );
};

export default Profile;