import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  ChevronDown,
  User,
  Settings,
  Activity,
  LogOut,
  Menu,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminData } from "../context/AdminDataContext";
import AdminProfileModal from "./AdminProfileModal";
import GlobalSearchModal from "./GlobalSearchModal";

export default function AdminNavbar({ onToggleMobile = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminUser, logout } = useAdminAuth();
  const { notifications = [], markAllNotificationsAsRead } = useAdminData();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") || "dark";
    } catch {
      return "dark";
    }
  });

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shortcut for command palette: Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute page title from path
  const getPageTitle = () => {
    const path = location.pathname.replace("/admin/", "");
    switch (path) {
      case "dashboard":
        return { title: "Dashboard", subtitle: "Overview of Comparely platform activity" };
      case "users":
        return { title: "User Management", subtitle: "Monitor and manage registered platform accounts" };
      case "products":
        return { title: "Product Catalog", subtitle: "Comparely normalized product index and multi-store matches" };
      case "categories":
        return { title: "Categories", subtitle: "Manage e-commerce taxonomy and product collections" };
      case "searches":
        return { title: "Search Queries", subtitle: "Live telemetry and user search activity across all stores" };
      case "sources":
        return { title: "Sources & Platforms", subtitle: "Scraper connectors, store sync health, and API integrations" };
      case "jobs":
      case "automation":
        return { title: "Automation & Scraping Jobs", subtitle: "Background workers, cron jobs, and price sync pipelines" };
      case "analytics":
        return { title: "Analytics & Trends", subtitle: "Deep search metrics, platform pricing, and savings insights" };
      case "reviews":
        return { title: "Customer Reviews", subtitle: "Store ratings, product reviews, and consumer sentiment" };
      case "settings":
        return { title: "System Settings", subtitle: "Global platform configuration, API secrets, and crawler limits" };
      default:
        return { title: "Admin Control Center", subtitle: "Comparely Systems Management" };
    }
  };

  const { title, subtitle } = getPageTitle();

  // Mock list of notifications conforming to user requirements
  const defaultNotifications = [
    {
      id: "n-1",
      title: "Reliance Digital Sync Failed",
      time: "10 min ago",
      type: "error", // red
      description: "Gateway timeout (504) while querying mobile categories.",
    },
    {
      id: "n-2",
      title: "Scraping Job Completed",
      time: "25 min ago",
      type: "success", // green
      description: "Amazon & Flipkart daily price sync updated 148 product quotes.",
    },
    {
      id: "n-3",
      title: "New User Registered",
      time: "1 hour ago",
      type: "info", // indigo
      description: "User mohan teja joined and configured 2 price alerts.",
    },
    {
      id: "n-4",
      title: "System Warning: Rate Limiting",
      time: "2 hours ago",
      type: "warning", // amber
      description: "SerpAPI monthly query allowance at 78% of monthly plan.",
    },
    {
      id: "n-5",
      title: "Product Sync Completed",
      time: "3 hours ago",
      type: "success", // green
      description: "Myntra fashion catalog synchronization succeeded.",
    },
  ];

  const displayNotifications =
    notifications.length > 0 ? notifications : defaultNotifications;

  return (
    <>
      <header
        style={{
          height: 72,
          backgroundColor: "var(--surface, #111111)",
          borderBottom: "1px solid var(--border, #222222)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left Side: Title & Subtitle */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={onToggleMobile}
            style={{
              display: "none",
              padding: 8,
              borderRadius: 8,
              border: "1px solid var(--border, #222222)",
              background: "var(--surface-hover, #1a1a1a)",
              cursor: "pointer",
            }}
            className="admin-mobile-menu-btn"
          >
            <Menu size={20} color="var(--text-900, #f4efe8)" />
          </button>

          <div>
            <h1
              className="font-heading"
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--text-900, #f4efe8)",
                margin: 0,
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--text-500, #888888)",
                margin: 0,
                marginTop: 2,
              }}
            >
              {subtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Search, Theme Toggle, Notifications, Admin Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Quick Search Button */}
          <button
            onClick={() => setSearchModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 16px",
              backgroundColor: "var(--surface-hover, #1a1a1a)",
              border: "1px solid var(--border, #222222)",
              borderRadius: "var(--radius-full, 9999px)",
              fontSize: 13,
              color: "var(--text-500, #888888)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            title="Search products, users, or jobs (Cmd+K)"
          >
            <Search size={14} color="var(--text-500, #888888)" />
            <span style={{ display: "inline-block" }}>Search platform...</span>
            <kbd
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: "2px 6px",
                borderRadius: 4,
                backgroundColor: "var(--surface, #111111)",
                border: "1px solid var(--border, #222222)",
                color: "var(--text-500, #888888)",
              }}
            >
              ⌘K
            </kbd>
          </button>

          {/* Theme Toggle Button matching Landing page */}
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              backgroundColor: "var(--surface-hover, #1a1a1a)",
              border: "1px solid var(--border, #222222)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-700, #d5cabd)",
              transition: "all 0.2s ease",
            }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications Dropdown */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: notifOpen ? "var(--border, #222222)" : "var(--surface-hover, #1a1a1a)",
                border: "1px solid var(--border, #222222)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.15s ease",
              }}
              title="Notifications"
            >
              <Bell size={17} color={notifOpen ? "var(--primary, #ffffff)" : "var(--text-700, #d5cabd)"} />
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 9,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#ef4444",
                }}
              />
            </button>

            {notifOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 360,
                  backgroundColor: "var(--surface, #111111)",
                  borderRadius: "var(--radius-lg, 14px)",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)",
                  border: "1px solid var(--border, #222222)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--border, #222222)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-900, #f4efe8)" }}>
                      System Notifications
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        backgroundColor: "var(--primary-light, rgba(255, 255, 255, 0.08))",
                        color: "var(--primary, #ffffff)",
                        padding: "2px 8px",
                        borderRadius: 9999,
                      }}
                    >
                      5 New
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (markAllNotificationsAsRead) markAllNotificationsAsRead();
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--primary, #ffffff)",
                      cursor: "pointer",
                    }}
                  >
                    Mark read
                  </button>
                </div>

                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                  {displayNotifications.map((n) => {
                    let Icon = Info;
                    let iconColor = "#ffffff";
                    let iconBg = "rgba(255, 255, 255, 0.08)";

                    if (n.type === "success") {
                      Icon = CheckCircle2;
                      iconColor = "#10b981";
                      iconBg = "rgba(16, 185, 129, 0.15)";
                    } else if (n.type === "warning") {
                      Icon = AlertTriangle;
                      iconColor = "#f59e0b";
                      iconBg = "rgba(245, 158, 11, 0.15)";
                    } else if (n.type === "error") {
                      Icon = XCircle;
                      iconColor = "#ef4444";
                      iconBg = "rgba(239, 68, 68, 0.15)";
                    }

                    return (
                      <div
                        key={n.id}
                        style={{
                          padding: "12px 18px",
                          borderBottom: "1px solid var(--border, #222222)",
                          display: "flex",
                          gap: 12,
                          alignItems: "flex-start",
                          transition: "background-color 0.15s ease",
                        }}
                        className="notif-item-hover"
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: iconBg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            marginTop: 2,
                          }}
                        >
                          <Icon size={16} color={iconColor} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-900, #f4efe8)" }}>
                              {n.title}
                            </span>
                            <span style={{ fontSize: 11, color: "var(--text-500, #888888)" }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: 12, color: "var(--text-500, #888888)", margin: "3px 0 0", lineHeight: 1.4 }}>
                            {n.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "var(--surface-hover, #1a1a1a)",
                    borderTop: "1px solid var(--border, #222222)",
                    textAlign: "center",
                  }}
                >
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      navigate("/admin/jobs");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: "var(--primary, #ffffff)",
                      cursor: "pointer",
                    }}
                  >
                    View system event logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Admin Profile Dropdown */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 14px 4px 6px",
                borderRadius: "var(--radius-full, 9999px)",
                backgroundColor: "var(--surface-hover, #1a1a1a)",
                border: "1px solid var(--border, #222222)",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <img
                src={
                  adminUser?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                }
                alt="Admin"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid var(--primary, #ffffff)",
                }}
              />
              <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-900, #f4efe8)", lineHeight: 1.2 }}>
                  {adminUser?.name || "Mohan Teja"}
                </span>
                <span style={{ fontSize: 10.5, color: "var(--text-500, #888888)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Admin
                </span>
              </div>
              <ChevronDown size={14} color="var(--text-500, #888888)" />
            </button>

            {profileOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 230,
                  backgroundColor: "var(--surface, #111111)",
                  borderRadius: "var(--radius-lg, 14px)",
                  boxShadow: "0 10px 40px rgba(0, 0, 0, 0.7)",
                  border: "1px solid var(--border, #222222)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border, #222222)" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--text-900, #f4efe8)" }}>
                    {adminUser?.name || "Mohan Teja"}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--text-500, #888888)", marginTop: 2, wordBreak: "break-all" }}>
                    {adminUser?.email || "admin@comparely.io"}
                  </div>
                </div>

                <div style={{ padding: 6 }}>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      setProfileModalOpen(true);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: "var(--radius-full, 9999px)",
                      border: "none",
                      background: "none",
                      fontSize: 13,
                      color: "var(--text-700, #d5cabd)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    className="adm-menu-item-hover"
                  >
                    <User size={15} color="var(--text-500, #888888)" /> View Profile
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/settings");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: "var(--radius-full, 9999px)",
                      border: "none",
                      background: "none",
                      fontSize: 13,
                      color: "var(--text-700, #d5cabd)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    className="adm-menu-item-hover"
                  >
                    <Settings size={15} color="var(--text-500, #888888)" /> Settings
                  </button>

                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate("/admin/jobs");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: "var(--radius-full, 9999px)",
                      border: "none",
                      background: "none",
                      fontSize: 13,
                      color: "var(--text-700, #d5cabd)",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                    className="adm-menu-item-hover"
                  >
                    <Activity size={15} color="var(--text-500, #888888)" /> Activity Logs
                  </button>
                </div>

                <div style={{ padding: 6, borderTop: "1px solid var(--border, #222222)" }}>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/admin/login");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "9px 12px",
                      borderRadius: "var(--radius-full, 9999px)",
                      border: "none",
                      background: "none",
                      fontSize: 13,
                      color: "#ef4444",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: 600,
                      transition: "all 0.15s ease",
                    }}
                    className="adm-menu-item-hover"
                  >
                    <LogOut size={15} color="#ef4444" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      {profileModalOpen && (
        <AdminProfileModal onClose={() => setProfileModalOpen(false)} />
      )}
      {searchModalOpen && (
        <GlobalSearchModal onClose={() => setSearchModalOpen(false)} />
      )}
    </>
  );
}
