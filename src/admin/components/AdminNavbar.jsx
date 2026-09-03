import React, { useState, useRef, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiExternalLink,
  FiShield,
  FiShoppingBag,
} from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminData } from "../context/AdminDataContext";
import NotificationDropdown from "./NotificationDropdown";
import ThemeToggle from "../../Components/ThemeToggle";

export function AdminNavbar({
  onToggleSidebar,
  onOpenMobileSidebar,
  onOpenSearch,
  onOpenProfile,
  onOpenLogoutConfirm,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser } = useAdminAuth();
  const { notifications } = useAdminData();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const unreadNotifCount = notifications?.filter((n) => !n.read).length || 0;

  // Determine current page title based on route pathname
  const getPageTitle = (pathname) => {
    if (pathname.includes("/admin/dashboard") || pathname === "/admin")
      return "Executive Dashboard";
    if (pathname.startsWith("/admin/users/")) return "User Profile & Audit";
    if (pathname.includes("/admin/users")) return "Users Management";
    if (pathname.startsWith("/admin/products/")) return "Product Pricing Details";
    if (pathname.includes("/admin/products")) return "Products Catalog";
    if (pathname.startsWith("/admin/searches/")) return "Search Query Metrics";
    if (pathname.includes("/admin/searches")) return "Searches & Inquiries";
    if (pathname.includes("/admin/automation")) return "Automation & Crawlers";
    if (pathname.includes("/admin/sources")) return "Store Source Integrations";
    if (pathname.includes("/admin/logs")) return "System Audit Logs";
    return "Admin Console";
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left Section: Sidebar toggle & Current Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Toggle Button */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Open mobile menu"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Desktop Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle sidebar collapse"
        >
          <FiMenu className="text-lg" />
        </button>

        {/* Current Page Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <FiShield className="text-[10px]" />
            Admin Only
          </span>
        </div>
      </div>

      {/* Right Section: Client Switcher, Search, Theme Toggle, Notification, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Switch to Client Storefront */}
        <Link
          to="/home"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition border border-slate-200/80 dark:border-slate-700"
          title="Switch to User Storefront"
        >
          <FiShoppingBag className="text-xs text-indigo-600 dark:text-indigo-400" />
          <span>User Store</span>
        </Link>

        {/* Search Trigger Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-200/60 dark:border-slate-700 cursor-pointer"
          title="Search admin items (Ctrl+K)"
        >
          <FiSearch className="text-sm text-slate-400" />
          <span>Search...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle compact={true} />

        {/* Notification Dropdown Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
            aria-label="View system notifications"
          >
            <FiBell className="text-lg" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          <NotificationDropdown
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block"></div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          >
            <img
              src={
                adminUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              }
              alt={adminUser?.name}
              className="w-8 h-8 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                {adminUser?.name || "Mohan Teja"}
              </span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold leading-none mt-0.5">
                Root Administrator
              </span>
            </div>
            <FiChevronDown className="text-slate-400 text-xs hidden sm:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-2 animate-scaleUp">
              <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{adminUser?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{adminUser?.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenProfile();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <FiUser className="text-slate-400 text-sm" />
                <span>Admin Profile</span>
              </button>

              <Link
                to="/home"
                onClick={() => setIsProfileMenuOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <FiShoppingBag className="text-indigo-500 text-sm" />
                <span>Client Storefront</span>
              </Link>

              <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onOpenLogoutConfirm();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <FiLogOut className="text-rose-500 text-sm" />
                <span>Sign Out of Admin</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default AdminNavbar;
