import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiGrid,
  FiBell,
  FiHeart,
  FiRefreshCw,
  FiClock,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  useEffect(() => {
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-sidebar", handleToggle);
  }, []);

  const handleRemovePromo = () => {
    setShowPromo(false);
  };

  const menuItems = [
    { icon: <FiHome />, text: "Home", path: "/home" },
    { icon: <FiSearch />, text: "Search Products", path: "/search" },
    { icon: <FiGrid />, text: "Categories" },
    { icon: <FiBell />, text: "Price Alerts" },
    { icon: <FiHeart />, text: "Wishlist", path: "/wishlist" },
    { icon: <FiRefreshCw />, text: "Comparison", path: "/comparison" },
    { icon: <FiClock />, text: "History" },
    { icon: <FiSettings />, text: "Settings" },
    { icon: <FiHelpCircle />, text: "Help & Support" },
    { icon: <FiLogOut />, text: "Logout", path: "/logout" },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile viewport */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`w-72 h-screen bg-white border-r border-gray-100 flex flex-col justify-between fixed left-0 top-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section - Compact and Non-Scrollable */}
        <div className="flex-1 py-4 px-4 flex flex-col overflow-hidden">
          {/* Logo & Mobile Close button */}
          <div className="flex items-center justify-between px-3 mb-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <svg className="w-10 h-10 text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold mt-1.5 select-none">
                  ₹
                </span>
              </div>

              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-0.5">
                  Price<span className="text-indigo-600">Scout</span>
                </h1>
                <p className="text-gray-400 text-[10px] font-bold tracking-wider uppercase mt-0.5">
                  Compare. Save.
                </p>
              </div>
            </div>

            {/* Close Button on Mobile viewports */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-50 transition"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Menu Items - Compact Spacing & Font Sizes */}
          <nav className="space-y-0.5 flex-1 overflow-y-auto pr-1">
            {menuItems.map((item, index) => {
              // Determine active menu item
              const isActive = item.path 
                ? (location.pathname.toLowerCase() === item.path.toLowerCase()) 
                : false;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                    }
                  }}
                  className={`flex items-center gap-3.5 w-full px-3.5 py-2.5 rounded-xl transition duration-200 font-semibold text-xs ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-md shadow-indigo-100"
                      : "text-gray-500 hover:text-gray-950 hover:bg-gray-50"
                  }`}
                >
                  <span className={`text-base ${isActive ? "text-white" : "text-gray-400"}`}>
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promotion Card - Removable with Close Button */}
        {showPromo && (
          <div className="p-4 border-t border-gray-50 bg-white shrink-0">
            <div className="rounded-2xl bg-indigo-50/70 p-4 text-center border border-indigo-100/40 relative overflow-hidden">
              {/* Close/Remove Alert Box button */}
              <button
                onClick={handleRemovePromo}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
                title="Remove promotion box"
              >
                <FiX className="text-xs stroke-[2.5]" />
              </button>

              {/* Bell Illustration */}
              <div className="relative w-14 h-14 mx-auto mb-2 flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-indigo-100/60 animate-pulse"></div>
                <div className="relative z-10 w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
                  <FiBell className="text-white text-sm animate-bounce" />
                </div>
                <div className="absolute top-0 right-1 z-20 w-5 h-5 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center shadow">
                  <span className="text-white text-[8px] font-bold">%</span>
                </div>
              </div>

              <h3 className="text-xs font-black text-gray-900">
                Never Miss a Deal!
              </h3>
              <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                Get notified instantly when prices drop on your favorite products.
              </p>

              <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-500 hover:from-indigo-700 hover:to-purple-600 text-white text-[10px] font-bold py-2 px-3 rounded-lg mt-3 shadow-sm hover:shadow transition duration-200">
                Create Alert
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;