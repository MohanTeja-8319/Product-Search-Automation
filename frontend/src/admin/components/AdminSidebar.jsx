import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiPackage,
  FiSearch,
  FiCpu,
  FiGlobe,
  FiFileText,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiX
} from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";

export function AdminSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
  onOpenProfile,
  onOpenLogoutConfirm
}) {
  const { adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: FiGrid },
    { name: "Users", path: "/admin/users", icon: FiUsers }
  ];

  const handleNavClick = () => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isMobileOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* Top Section (Header + Navigation) */}
        <div>
          {/* Brand Header */}
          <div className="relative">
            <div
              className={`h-16 flex items-center border-b border-slate-800/80 bg-slate-950/40 transition-all ${
              isCollapsed ? "justify-center px-2" : "justify-between px-4"
            }`}
          >
            <Link
              to="/admin/dashboard"
              onClick={() => {
                if (isCollapsed) setIsCollapsed(false);
                handleNavClick();
              }}
              className={`flex items-center group cursor-pointer ${
                isCollapsed ? "justify-center" : "gap-3 min-w-0"
              }`}
              title={isCollapsed ? "Product Search Admin (Click to expand)" : "Product Search Admin"}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
                PSA
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-white tracking-tight truncate group-hover:text-indigo-200 transition-colors">
                    Product Search
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
                    Admin Panel
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>

            {/* Desktop Collapse Toggle (When expanded) */}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="hidden lg:flex text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Collapse sidebar"
              >
                <FiChevronLeft className="text-lg" />
              </button>
            )}
          </div>

          {/* Desktop Expand Toggle (When collapsed - floating on border) */}
          {isCollapsed && (
            <button
              onClick={() => setIsCollapsed(false)}
              className="hidden lg:flex absolute -right-3 top-5 z-50 w-6 h-6 rounded-full bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-slate-300 hover:text-white items-center justify-center shadow-lg transition-all duration-200 cursor-pointer hover:scale-110"
              title="Expand sidebar"
            >
              <FiChevronRight className="text-xs" />
            </button>
          )}
        </div>

          {/* Navigation Links (Strictly the 7 requested) */}
          <nav className="p-3 space-y-1.5 mt-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs md:text-sm transition-all group relative ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    } ${isCollapsed ? "justify-center" : ""}`
                  }
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon className="text-lg flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}

                  {/* Tooltip on collapsed desktop view */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-800">
                      {item.name}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Admin Profile & Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-1">
          {/* Admin Profile Button */}
          <button
            type="button"
            onClick={() => {
              handleNavClick();
              onOpenProfile();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors group relative ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Admin Profile" : undefined}
          >
            <div className="relative flex-shrink-0">
              <img
                src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"}
                alt={adminUser?.name}
                className="w-7 h-7 rounded-lg object-cover border border-indigo-500/50"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900"></span>
            </div>

            {!isCollapsed && (
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-white truncate text-xs">{adminUser?.name}</div>
                <div className="text-[10px] text-indigo-300 truncate">Admin Profile</div>
              </div>
            )}

            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-slate-800">
                Admin Profile
              </div>
            )}
          </button>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => {
              handleNavClick();
              onOpenLogoutConfirm();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors group relative ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <FiLogOut className="text-lg flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}

            {isCollapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-rose-950 text-rose-200 text-xs font-semibold rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-rose-900">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
