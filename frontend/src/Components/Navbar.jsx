import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSearch, FiBell, FiHeart, FiChevronDown, FiLogOut,
  FiSettings, FiMenu, FiSun, FiMoon
} from "react-icons/fi";

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    try { return localStorage.getItem("profilePhoto") || null; } catch { return null; }
  });
  const userMenuRef = useRef(null);

  useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem("user");
        if (raw) setUser(JSON.parse(raw));
      } catch { setUser(null); }
      try {
        setProfilePhoto(localStorage.getItem("profilePhoto") || null);
      } catch {}
    };
    load();
    window.addEventListener("user-profile-updated", load);
    window.addEventListener("profile-photo-updated", load);
    return () => {
      window.removeEventListener("user-profile-updated", load);
      window.removeEventListener("profile-photo-updated", load);
    };
  }, []);

  const [wishlistCount, setWishlistCount] = useState(() => {
    try {
      const stored = localStorage.getItem("wishlistItems");
      return stored ? JSON.parse(stored).length : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    const handleWishlistUpdate = () => {
      try {
        const stored = localStorage.getItem("wishlistItems");
        setWishlistCount(stored ? JSON.parse(stored).length : 0);
      } catch {
        setWishlistCount(0);
      }
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("searchHistory");
    localStorage.removeItem("recentProducts");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("price_scout_notifications");
    localStorage.removeItem("profilePhoto");
    navigate("/");
  };

  
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <header style={{
      height: "var(--navbar-height)",
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: "16px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {}
      <button
        onClick={onMenuToggle}
        className="btn btn-ghost btn-sm"
        style={{ display: "none", padding: "8px" }}
        id="mobile-menu-btn"
      >
        <FiMenu size={20} />
      </button>

      {}
      {!["/home", "/search", "/comparison"].some(p => location.pathname.startsWith(p)) ? (
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 480 }}>
        <div className="input-group" style={{ borderRadius: "var(--radius-full)" }}>
          <span style={{ padding: "0 12px 0 16px", color: "var(--text-400)", display: "flex" }}>
            <FiSearch size={16} />
          </span>
          <input
            type="text"
            className="input"
            placeholder="Search for products, brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: 0, padding: "10px 0" }}
          />
          <button type="submit" className="btn btn-primary btn-sm" style={{
            margin: "4px",
            borderRadius: "var(--radius-full)",
            padding: "7px 20px"
          }}>
            Search
          </button>
        </div>
      </form>
      ) : <div style={{ flex: 1 }} />}

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
        {}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost"
          style={{ padding: "10px", borderRadius: "var(--radius-full)" }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
        {}
        <button
          onClick={() => navigate("/pricealerts")}
          className="btn btn-ghost"
          style={{ padding: "10px", borderRadius: "var(--radius-full)", position: "relative" }}
          title="Price Alerts"
        >
          <FiBell size={18} />
          <span style={{
            position: "absolute", top: 6, right: 6,
            width: 8, height: 8,
            background: "var(--danger)",
            borderRadius: "50%",
            border: "2px solid white"
          }} />
        </button>
        {/* Wishlist */}
        <button
          onClick={() => navigate("/wishlist")}
          className="btn btn-ghost"
          style={{ padding: "10px", borderRadius: "var(--radius-full)", position: "relative" }}
          title="My Wishlist"
        >
          <FiHeart size={18} />
          {wishlistCount > 0 && (
            <span style={{
              position: "absolute", top: 4, right: 4,
              minWidth: 16, height: 16, padding: "0 4px",
              background: "#EF4444", color: "#fff",
              borderRadius: "50%", fontSize: 10, fontWeight: 700,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              {wishlistCount > 9 ? "9+" : wishlistCount}
            </span>
          )}
        </button>

        {}
        <div style={{ position: "relative" }} ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "6px 12px 6px 6px",
              background: userMenuOpen ? "var(--bg)" : "transparent",
              border: "1px solid",
              borderColor: userMenuOpen ? "var(--border)" : "transparent",
              borderRadius: "var(--radius-full)",
              cursor: "pointer",
              transition: "var(--transition)"
            }}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt={user?.name || "User"}
                style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "var(--primary)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700
              }}>
                {initials}
              </div>
            )}
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column" }} className="navbar-username">
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.2 }}>
                {user?.name?.split(" ")[0] || "User"}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-400)", lineHeight: 1.2 }}>Member</span>
            </div>
            <FiChevronDown size={14} style={{
              color: "var(--text-400)",
              transform: userMenuOpen ? "rotate(180deg)" : "none",
              transition: "var(--transition)"
            }} />
          </button>

          {}
          {userMenuOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-lg)",
              width: 200,
              overflow: "hidden",
              animation: "fadeIn 0.15s ease",
              zIndex: 100,
            }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-900)" }}>
                  {user?.name || "User"}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-400)", marginTop: 2 }}>
                  {user?.email || ""}
                </div>
              </div>
              {[
                { label: "My Wishlist", icon: FiHeart, path: "/wishlist" },
                { label: "Settings", icon: FiSettings, path: "/settings" },
              ].map(item => (
                <button key={item.label}
                  onClick={() => { navigate(item.path); setUserMenuOpen(false); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", background: "none", border: "none",
                    cursor: "pointer", fontSize: 13, color: "var(--text-700)",
                    transition: "var(--transition)", textAlign: "left"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <item.icon size={15} style={{ color: "var(--text-400)" }} />
                  {item.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px", background: "none", border: "none",
                    cursor: "pointer", fontSize: 13, color: "var(--danger)",
                    transition: "var(--transition)", textAlign: "left"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--danger-light)"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <FiLogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}