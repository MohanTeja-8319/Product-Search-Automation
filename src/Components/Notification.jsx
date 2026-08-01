import React from "react";
import { FiBell } from "react-icons/fi";

const Notification = () => {
  return (
    <div className="relative cursor-pointer">
      <div
        className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition shadow-sm"
      >
        <FiBell className="text-lg text-gray-700" />
      </div>

      <span
        className="absolute -top-1 -right-1
        bg-pink-500 text-white
        text-[10px] font-bold
        w-4 h-4 rounded-full
        flex justify-center items-center shadow-sm"
      >
        3
      </span>
    </div>
  );
};

export default Notification;