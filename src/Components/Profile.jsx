import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { FaGoogle } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);

  const loadUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {}
  };

  useEffect(() => {
    loadUser();

    const handleUpdate = () => loadUser();
    window.addEventListener("user-profile-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("user-profile-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    navigate("/logout");
  };

  const displayName = user?.name || user?.fullName || "Mohan Teja";
  const userEmail = user?.email || "mohan.teja@gmail.com";
  const avatarUrl =
    user?.avatar ||
    "https://api.dicebear.com/7.x/adventurer/svg?seed=Mohan";
  const isGoogle = user?.provider === "google";
  const userBadge = user?.badge || "Active Member";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 cursor-pointer p-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`Account menu for ${displayName}`}
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-9 h-9 rounded-xl border-2 border-indigo-200 dark:border-indigo-500/40 object-cover bg-indigo-50 dark:bg-slate-800 shadow-xs"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix";
            }}
          />
          {isGoogle ? (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xs border border-gray-100 dark:border-slate-700">
              <FaGoogle className="text-[8px] text-[#4285F4]" />
            </span>
          ) : (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          )}
        </div>

        <div className="hidden sm:flex flex-col text-left">
          <span className="font-bold text-xs text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
            {displayName}
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-none mt-0.5">
            {userBadge}
          </span>
        </div>

        <FiChevronDown
          className={`text-slate-400 dark:text-slate-500 text-xs hidden sm:inline-block ml-0.5 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-indigo-600 dark:text-indigo-400" : ""
          }`}
        />
      </button>

      {/* Interactive Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 py-3 z-50 animate-fadeIn">
          {/* User Info Header */}
          <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-10 h-10 rounded-2xl border border-indigo-100 dark:border-slate-700 object-cover bg-indigo-50 dark:bg-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                    {displayName}
                  </h4>
                  {isGoogle && (
                    <span className="px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded">
                      Google
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {userEmail}
                </p>
                <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                  ● {userBadge}
                </span>
              </div>
            </div>

            {/* Close / Cross Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 ml-2"
              title="Close profile menu"
            >
              <FiX className="text-sm" />
            </button>
          </div>

          {/* Quick Menu Options (Account Profile only) */}
          <div className="py-2 px-2 space-y-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm shrink-0 group-hover:scale-105 transition-transform">
                <FiUser />
              </div>
              <div className="flex-1">
                <span className="font-bold">Account Profile</span>
                <span className="block text-[10px] text-slate-400 font-normal">Edit personal details</span>
              </div>
            </Link>
          </div>

          {/* Logout Section */}
          <div className="pt-2 px-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/80 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition font-bold text-xs cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center text-sm group-hover:scale-105 transition-transform shrink-0">
                <FiLogOut />
              </div>
              <span className="flex-1 text-left">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;