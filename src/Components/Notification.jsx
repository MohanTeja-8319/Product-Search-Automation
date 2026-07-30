import React from "react";
import { FaBell } from "react-icons/fa";

const Notification = () => {
  return (
    <div className="relative cursor-pointer">

      <div
        className="w-12 h-12 rounded-full bg-white shadow-md
        hover:bg-indigo-50 flex items-center justify-center transition"
      >
        <FaBell className="text-xl text-gray-700" />
      </div>

      <span
        className="absolute -top-1 -right-1
        bg-red-500 text-white
        text-xs font-semibold
        w-5 h-5 rounded-full
        flex justify-center items-center"
      >
        3
      </span>

    </div>
  );
};

export default Notification;