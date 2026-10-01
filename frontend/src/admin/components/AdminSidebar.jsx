import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  Layers,
  Search,
  Globe,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Shield,
  CircleCheck,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Layers },
  { label: "Searches", path: "/admin/searches", icon: Search },
  { label: "Sources / Platforms", path: "/admin/sources", icon: Globe },
  { label: "Jobs", path: "/admin/jobs", icon: Activity },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Reviews", path: "/admin/reviews", icon: MessageSquare },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ mobileOpen = false, onCloseMobile = () => {} }) {
  const { logout, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(6px)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{
          width: 270,
          backgroundColor: "var(--surface, #111111)",
          color: "var(--text-700, #d5cabd)",
          height: "100vh",
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          zIndex: 50,
          borderRight: "1px solid var(--border, #222222)",
          transform: mobileOpen ? "translateX(0)" : undefined,
          transition: "transform 0.25s ease-in-out",
        }}
        className={mobileOpen ? "mobile-sidebar-open" : ""}
      >
        {/* Top Header Logo matching landing page */}
        <div
          style={{
            padding: "20px 22px 18px",
            borderBottom: "1px solid var(--border, #222222)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/logo.png"
              alt="Comparely"
              style={{ height: 42, width: "auto", objectFit: "contain" }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900, #f4efe8)", lineHeight: 1.1 }}>
                Comparely
              </span>
              <span style={{ fontSize: 10.5, color: "var(--text-500, #888888)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Admin Control
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.08em",
              padding: "2px 8px",
              borderRadius: "var(--radius-full, 9999px)",
              backgroundColor: "var(--primary-light, rgba(255, 255, 255, 0.1))",
              border: "1px solid var(--border-primary, rgba(255, 255, 255, 0.2))",
              color: "var(--primary, #ffffff)",
            }}
          >
            PANEL
          </span>
        </div>

        {/* Navigation Section */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--text-500, #888888)",
              padding: "6px 12px 8px",
            }}
          >
            Platform Management
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  borderRadius: "var(--radius-full, 9999px)",
                  textDecoration: "none",
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "var(--primary-content, #0a0a0a)" : "var(--text-700, #d5cabd)",
                  backgroundColor: isActive ? "var(--primary, #ffffff)" : "transparent",
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? "0 2px 10px rgba(255, 255, 255, 0.15)" : "none",
                })}
                className={({ isActive }) => (isActive ? "" : "admin-nav-item-hover")}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      color={isActive ? "var(--primary-content, #0a0a0a)" : "var(--text-500, #888888)"}
                      strokeWidth={isActive ? 2.4 : 1.8}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System Health Status Indicator */}
        <div
          style={{
            padding: "14px 16px",
            margin: "0 14px 12px",
            borderRadius: "var(--radius-md, 12px)",
            backgroundColor: "var(--surface-hover, #1a1a1a)",
            border: "1px solid var(--border, #222222)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-500, #888888)" }}>
              Crawlers & Node Health
            </span>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                boxShadow: "0 0 8px #10b981",
                display: "inline-block",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <CircleCheck size={14} color="#10b981" />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-900, #f4efe8)" }}>
              All 4 Stores Synced (99.9%)
            </span>
          </div>
        </div>

        {/* Bottom Actions: View Storefront & Logout */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid var(--border, #222222)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <a
            href="/home"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 12.5,
              fontWeight: 600,
              color: "var(--text-700, #d5cabd)",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            className="admin-nav-item-hover"
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <ExternalLink size={14} /> View Storefront
            </span>
            <span style={{ fontSize: 10, color: "var(--text-500, #888888)" }}>New Tab</span>
          </a>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#ef4444",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              transition: "all 0.15s ease",
            }}
            className="admin-nav-item-hover"
          >
            <LogOut size={14} /> Sign Out Admin
          </button>
        </div>
      </aside>
    </>
  );
}
