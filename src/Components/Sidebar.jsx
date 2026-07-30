import React from "react";
import {
  FaHome,
  FaSearch,
  FaThLarge,
  FaBell,
  FaHeart,
  FaBalanceScale,
  FaHistory,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaPercentage,
} from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { icon: <FaHome />, text: "Home", active: true },
    { icon: <FaSearch />, text: "Search Products" },
    { icon: <FaThLarge />, text: "Categories" },
    { icon: <FaBell />, text: "Price Alerts" },
    { icon: <FaHeart />, text: "Wishlist" },
    { icon: <FaBalanceScale />, text: "Comparison" },
    { icon: <FaHistory />, text: "History" },
    { icon: <FaCog />, text: "Settings" },
    { icon: <FaQuestionCircle />, text: "Help & Support" },
    { icon: <FaSignOutAlt />, text: "Logout" },
  ];

  return (
    <aside className="w-72 h-screen bg-white shadow-xl flex flex-col justify-between fixed left-0 top-0">

      {/* Logo */}
      <div>

        <div className="flex items-center gap-3 p-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-500 p-3 rounded-xl">
            <FaPercentage className="text-white text-2xl" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              Price<span className="text-indigo-600">Scout</span>
            </h1>

            <p className="text-gray-500 text-sm">
              Compare. Save. Shop Smart.
            </p>
          </div>
        </div>

        {/* Menu */}

        <div className="mt-5 px-4">

          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center gap-4 w-full p-4 rounded-xl mb-2 transition duration-300

              ${
                item.active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>

              <span className="font-medium">{item.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Card */}

      <div className="p-5">

        <div className="rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-center text-white">

          <div className="text-6xl mb-3">
            🔔
          </div>

          <h2 className="text-xl font-bold">
            Never Miss a Deal!
          </h2>

          <p className="text-sm mt-3">
            Receive instant alerts whenever prices drop.
          </p>

          <button className="bg-white text-indigo-600 font-semibold rounded-xl px-6 py-3 mt-5 hover:scale-105 transition">
            Create Alert
          </button>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;