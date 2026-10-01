import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Users,
  Package,
  Layers,
  Globe,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  ArrowRight,
  X,
} from "lucide-react";
import { useAdminData } from "../context/AdminDataContext";

export default function GlobalSearchModal({ onClose = () => {} }) {
  const navigate = useNavigate();
  const { users = [], products = [], sources = [], automationJobs = [] } = useAdminData();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const q = query.trim().toLowerCase();

  // Search through navigation pages
  const navSuggestions = [
    { title: "Dashboard", desc: "Overview & key metrics", path: "/admin/dashboard", icon: BarChart3 },
    { title: "Users", desc: "Manage registered accounts", path: "/admin/users", icon: Users },
    { title: "Products", desc: "Product catalog and prices", path: "/admin/products", icon: Package },
    { title: "Categories", desc: "Product collections & taxonomy", path: "/admin/categories", icon: Layers },
    { title: "Searches", desc: "User search queries", path: "/admin/searches", icon: Search },
    { title: "Sources / Platforms", desc: "Amazon, Flipkart, Myntra connectors", path: "/admin/sources", icon: Globe },
    { title: "Jobs & Automation", desc: "Scrapers and sync tasks", path: "/admin/jobs", icon: Activity },
    { title: "Analytics", desc: "Search trends and price savings", path: "/admin/analytics", icon: BarChart3 },
    { title: "Reviews", desc: "Ratings & sentiment moderation", path: "/admin/reviews", icon: MessageSquare },
    { title: "Settings", desc: "System and API configuration", path: "/admin/settings", icon: Settings },
  ].filter((item) => !q || item.title.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q));

  // Search users
  const matchedUsers = users
    .filter((u) => q && (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)))
    .slice(0, 3);

  // Search products
  const matchedProducts = products
    .filter((p) => q && (p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)))
    .slice(0, 3);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        zIndex: 100,
        padding: "80px 20px 20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 600,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid #E2E8F0",
            gap: 12,
          }}
        >
          <Search size={20} color="#4F46E5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a page, user, product, or source..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 16,
              color: "#0F172A",
              background: "transparent",
            }}
          />
          <kbd
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: 4,
              backgroundColor: "#F1F5F9",
              border: "1px solid #CBD5E1",
              color: "#64748B",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: 380, overflowY: "auto", padding: "12px 10px" }}>
          {/* Quick Pages */}
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", padding: "8px 12px 4px" }}>
            Navigation Pages
          </div>
          {navSuggestions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleSelect(item.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
                className="adm-menu-item-hover"
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: "#EEF2FF",
                      color: "#4F46E5",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{item.desc}</div>
                  </div>
                </div>
                <ArrowRight size={14} color="#94A3B8" />
              </button>
            );
          })}

          {/* Matched Users */}
          {matchedUsers.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", padding: "12px 12px 4px" }}>
                Users
              </div>
              {matchedUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSelect(`/admin/users/${u.id}`)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="adm-menu-item-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Users size={16} color="#4F46E5" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                      {u.name} ({u.email})
                    </span>
                  </div>
                  <span style={{ fontSize: 11, color: "#94A3B8" }}>User ID: {u.id.slice(0, 8)}</span>
                </button>
              ))}
            </>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8", padding: "12px 12px 4px" }}>
                Products
              </div>
              {matchedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(`/admin/products/${p.id}`)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  className="adm-menu-item-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Package size={16} color="#10B981" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
                      {p.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "#059669" }}>
                    ₹{p.price?.toLocaleString()}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
