import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import AdminProfileModal from "./AdminProfileModal";
import GlobalSearchModal from "./GlobalSearchModal";
import ConfirmDialog from "./ConfirmDialog";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminToast } from "../context/AdminToastContext";

export function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const { logout } = useAdminAuth();
  const { addToast } = useAdminToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsLogoutConfirmOpen(false);
    addToast("Logged out of Admin Portal", "info");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-white flex flex-col antialiased transition-colors duration-200">
      {/* Admin Sidebar */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >
        {/* Top Navbar */}
        <AdminNavbar
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenLogoutConfirm={() => setIsLogoutConfirmOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Admin Profile Modal */}
      <AdminProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* Global Command Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isLogoutConfirmOpen}
        title="Confirm Admin Logout"
        message="Are you sure you want to log out of the Product Search Automation Admin Console?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setIsLogoutConfirmOpen(false)}
      />
    </div>
  );
}

export default AdminLayout;
