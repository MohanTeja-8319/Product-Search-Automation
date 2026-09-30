import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiHome, FiSearch, FiGrid, FiBell, FiHeart,
  FiClock, FiSettings, FiHelpCircle, FiChevronRight,
  FiBarChart2, FiX
} from "react-icons/fi";

const NAV_ITEMS = [
  { label: "Home",          icon: FiHome,      path: "/home" },
  { label: "Search",        icon: FiSearch,    path: "/search" },
  { label: "Categories",    icon: FiGrid,      path: "/categories" },
  { label: "Comparison",    icon: FiBarChart2, path: "/comparison" },
  { label: "Price Alerts",  icon: FiBell,      path: "/pricealerts" },
  { label: "Wishlist",      icon: FiHeart,     path: "/wishlist" },
  { label: "History",       icon: FiClock,     path: "/history" },
];

const BOTTOM_ITEMS = [
  { label: "Settings",  icon: FiSettings,     path: "/settings" },
  { label: "Support",   icon: FiHelpCircle,   path: "/support" },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ||
    (path !== "/home" && location.pathname.startsWith(path));

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            display: "none",
            position: "fixed", inset: 0,
            background: "rgba(15,23,42,0.4)",
            zIndex: 98,
          }}
          id="sidebar-overlay"
        />
      )}

      <aside style={{
        width: "var(--sidebar-width)",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        position: "fixed",
        top: 0, left: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 99,
        transition: "transform 0.25s ease",
      }}
      id="main-sidebar"
      >
        {}
        <div style={{
          height: "var(--navbar-height)",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
          borderBottom: "1px solid var(--border)",
          gap: 12,
        }}>
          <img
            src="/logo.png"
            alt="Comparely"
            style={{ height: 52, width: "auto", objectFit: "contain" }}
          />

          {}
          <button
            onClick={onClose}
            id="sidebar-close-btn"
            style={{
              display: "none",
              marginLeft: "auto",
              background: "none", border: "none",
              cursor: "pointer", color: "var(--text-400)",
              padding: "4px"
            }}
          >
            <FiX size={18} />
          </button>
        </div>

        {}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          <div style={{ marginBottom: 4 }}>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    border: "none",
                    borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text-900)" : "var(--text-500)",
                    background: "transparent",
                    transition: "var(--transition)",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = "var(--bg)";
                      e.currentTarget.style.color = "var(--text-900)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-500)";
                    }
                  }}
                >
                  <item.icon size={17} style={{ flexShrink: 0 }} />
                  {item.label}
                  {active && (
                    <FiChevronRight size={13} style={{ marginLeft: "auto", opacity: 0.6 }} />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {}
        <div style={{ padding: "10px 10px 20px", borderTop: "1px solid var(--border)" }}>
          {BOTTOM_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "9px 14px",
                  border: "none",
                  borderLeft: active ? "3px solid var(--primary)" : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? "var(--text-900)" : "var(--text-400)",
                  background: "transparent",
                  transition: "var(--transition)",
                  textAlign: "left",
                  marginBottom: 2,
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.background = "var(--bg)";
                    e.currentTarget.style.color = "var(--text-700)";
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-400)";
                  }
                }}
              >
                <item.icon size={16} style={{ flexShrink: 0 }} />
                {item.label}
              </button>
            );
          })}
        </div>
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          #main-sidebar {
            transform: ${isOpen ? "translateX(0)" : "translateX(-100%)"};
          }
          #sidebar-overlay {
            display: ${isOpen ? "block" : "none"} !important;
          }
          #sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}