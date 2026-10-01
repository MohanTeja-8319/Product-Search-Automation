import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import "../admin.css";

export default function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="admin-root" style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "var(--adm-bg, #0a0a0a)" }}>
      {/* Fixed Left Sidebar */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, backgroundColor: "var(--adm-bg, #0a0a0a)" }}>
        {/* Top Navbar */}
        <AdminNavbar onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

        {/* Dynamic Page Outlet */}
        <main
          style={{
            flex: 1,
            padding: "28px 32px 60px",
            backgroundColor: "var(--adm-bg, #0a0a0a)",
            overflowY: "auto",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
