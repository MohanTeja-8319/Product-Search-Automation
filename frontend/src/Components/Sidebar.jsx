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
  FiZap,
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
    { icon: <FiGrid />, text: "Categories", path: "/categories" },
    { icon: <FiBell />, text: "Price Alerts", path: "/pricealerts" },
    { icon: <FiHeart />, text: "Wishlist", path: "/wishlist" },
    { icon: <FiRefreshCw />, text: "Comparison", path: "/comparison" },
    { icon: <FiClock />, text: "History", path: "/history" },
    { icon: <FiSettings />, text: "Settings", path: "/settings" },
    { icon: <FiHelpCircle />, text: "Help & Support", path: "/support" },
    { icon: <FiLogOut />, text: "Logout", path: "/logout" },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile viewport */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`w-72 h-screen bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 flex flex-col justify-between fixed left-0 top-0 z-40 transition-all duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Section */}
        <div className="flex-1 py-5 px-4 flex flex-col overflow-hidden">
          {/* Logo & Mobile Close button */}
          <div className="flex items-center justify-between px-3 mb-6 shrink-0">
            <div 
              onClick={() => navigate("/home")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3z" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-black mt-1 select-none">
                  ₹
                </span>
              </div>

              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-0.5">
                  Price<span className="text-indigo-600 dark:text-indigo-400">Scout</span>
                </h1>
                <p className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-[10px] font-extrabold tracking-wider uppercase">
                  Compare. Save.
                </p>
              </div>
            </div>

            {/* Close Button on Mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1 flex-1 overflow-y-auto pr-1 scrollbar-hide">
            {menuItems.map((item, index) => {
              const isActive = item.path
                ? location.pathname.toLowerCase() === item.path.toLowerCase()
                : false;

              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.path) {
                      navigate(item.path);
                      setIsOpen(false);
                    }
                  }}
                  className={`flex items-center gap-3.5 w-full px-4 py-2.5 rounded-2xl transition duration-200 font-bold text-xs cursor-pointer text-left ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <span className={`text-base shrink-0 ${isActive ? "text-white" : "text-slate-400 dark:text-slate-500"}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.text}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white dark:bg-slate-900 animate-pulse"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Promo Card */}
        {showPromo && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 shrink-0 transition-colors">
            <div className="rounded-3xl bg-gradient-to-b from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-slate-900/90 p-4 text-center border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden shadow-xs">
              <button
                onClick={handleRemovePromo}
                className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition cursor-pointer"
                title="Dismiss promotion"
              >
                <FiX className="text-xs stroke-[2.5]" />
              </button>

              <div className="relative w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                <div className="absolute w-12 h-12 rounded-full bg-indigo-200/60 dark:bg-indigo-600/20 animate-pulse"></div>
                <div className="relative z-10 w-9 h-9 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                  <FiBell className="text-white text-sm animate-bounce" />
                </div>
                <div className="absolute -top-1 -right-1 z-20 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow">
                  <span className="text-white text-[7px] font-black">%</span>
                </div>
              </div>

              <h3 className="text-xs font-black text-slate-900 dark:text-white">
                Never Miss a Deal!
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                Get notified instantly when prices drop on your favorite tracked items.
              </p>

              <button
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-[11px] font-extrabold py-2 px-3 rounded-xl mt-3 shadow-md shadow-indigo-500/20 transition cursor-pointer"
                onClick={() => navigate("/createalerts")}
              >
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