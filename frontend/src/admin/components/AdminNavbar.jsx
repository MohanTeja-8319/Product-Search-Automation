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
 <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between transition-colors">
 {}
 <div className="flex items-center gap-3 sm:gap-4">
 {}
 <button
 type="button"
 onClick={onOpenMobileSidebar}
 className="lg:hidden p-2 rounded-[10px] text-slate-600 hover:text-slate-900 :text-white :text-white hover:bg-slate-100 :bg-slate-800 transition-colors focus:outline-none cursor-pointer"
 aria-label="Open mobile menu"
 >
 <FiMenu className="text-xl" />
 </button>

 {}
 <button
 type="button"
 onClick={onToggleSidebar}
 className="hidden lg:flex p-2 rounded-[10px] text-slate-500 hover:text-slate-800 :text-slate-100 :text-white hover:bg-slate-100 :bg-slate-800 transition-colors focus:outline-none cursor-pointer"
 aria-label="Toggle sidebar collapse"
 >
 <FiMenu className="text-lg" />
 </button>

 {}
 <div className="flex items-center gap-2">
 <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
 {pageTitle}
 </h1>
 <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 ">
 <FiShield className="text-[10px]" />
 Admin Only
 </span>
 </div>
 </div>

 {}
 <div className="flex items-center gap-2 sm:gap-3">
 {}
 <Link
 to="/home"
 className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200/80 :bg-slate-700 rounded-[10px] transition border border-slate-200 "
 title="Switch to User Storefront"
 >
 <FiShoppingBag className="text-xs text-indigo-600 " />
 <span>User Store</span>
 </Link>

 {}
 <button
 type="button"
 onClick={onOpenSearch}
 className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 :bg-slate-700 rounded-[10px] transition-colors border border-slate-200/60 cursor-pointer"
 title="Search admin items (Ctrl+K)"
 >
 <FiSearch className="text-sm text-slate-400" />
 <span>Search...</span>
 <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
 ⌘K
 </kbd>
 </button>

 {}
 <ThemeToggle compact={true} />

 {}
 <div className="relative">
 <button
 type="button"
 onClick={() => setIsNotifOpen(!isNotifOpen)}
 className="relative p-2 rounded-[10px] text-slate-600 hover:text-slate-900 :text-white :text-white hover:bg-slate-100 :bg-slate-800 transition-colors focus:outline-none cursor-pointer"
 aria-label="View system notifications"
 >
 <FiBell className="text-lg" />
 {unreadNotifCount > 0 && (
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white "></span>
 )}
 </button>

 <NotificationDropdown
 isOpen={isNotifOpen}
 onClose={() => setIsNotifOpen(false)}
 />
 </div>

 <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

 {}
 <div className="relative" ref={profileMenuRef}>
 <button
 type="button"
 onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
 className="flex items-center gap-2 p-1 sm:px-2 sm:py-1.5 rounded-[10px] hover:bg-slate-100 :bg-slate-800 transition-colors focus:outline-none cursor-pointer"
 >
 <img
 src={
 adminUser?.avatar ||
 "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
 }
 alt={adminUser?.name}
 className="w-8 h-8 rounded-[10px] object-cover border border-slate-200 shadow-xs"
 />
 <div className="hidden md:flex flex-col text-left">
 <span className="text-xs font-black text-slate-900 leading-tight">
 {adminUser?.name || "Mohan Teja"}
 </span>
 <span className="text-[10px] text-indigo-600 font-bold leading-none mt-0.5">
 Root Administrator
 </span>
 </div>
 <FiChevronDown className="text-slate-400 text-xs hidden sm:block" />
 </button>

 {}
 {isProfileMenuOpen && (
 <div className="absolute right-0 mt-2 w-56 bg-white rounded-[16px] shadow-2xl border border-slate-200 z-50 p-2 animate-scaleUp">
 <div className="px-3 py-2.5 border-b border-slate-200 mb-1">
 <p className="text-xs font-bold text-slate-900 ">{adminUser?.name}</p>
 <p className="text-[11px] text-slate-500 truncate">{adminUser?.email}</p>
 </div>

 <button
 type="button"
 onClick={() => {
 setIsProfileMenuOpen(false);
 onOpenProfile();
 }}
 className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 :bg-slate-800 rounded-[10px] transition-colors cursor-pointer"
 >
 <FiUser className="text-slate-400 text-sm" />
 <span>Admin Profile</span>
 </button>

 <Link
 to="/home"
 onClick={() => setIsProfileMenuOpen(false)}
 className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 :bg-slate-800 rounded-[10px] transition-colors"
 >
 <FiShoppingBag className="text-indigo-600 text-sm" />
 <span>Client Storefront</span>
 </Link>

 <div className="my-1 border-t border-slate-200 "></div>

 <button
 type="button"
 onClick={() => {
 setIsProfileMenuOpen(false);
 onOpenLogoutConfirm();
 }}
 className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 :bg-rose-950/40 rounded-[10px] transition-colors cursor-pointer"
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
