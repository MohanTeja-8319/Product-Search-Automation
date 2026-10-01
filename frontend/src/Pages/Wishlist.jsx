import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiHeart, FiTrash2, FiExternalLink, FiArrowRight,
  FiShoppingCart, FiSearch, FiInfo, FiTag
} from "react-icons/fi";
import { FaExchangeAlt, FaStar } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { getWishlist, removeWishlistItem } from "../utils/wishlistHelper";
import { getProfile, syncUserData } from "../utils/api";
import toast from "react-hot-toast";

export default function Wishlist() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");

  const syncWishlist = () => {
    // 1. Immediately load local items
    const localItems = getWishlist();
    setItems(localItems);

    // 2. If logged in, fetch from backend and merge
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then((res) => {
          const dbWishlist = Array.isArray(res?.user?.wishlist) ? res.user.wishlist : [];
          // Deduplicate and merge by name
          const itemMap = new Map();
          localItems.forEach((it) => {
            const key = (it?.name || it?.title || "").trim().toLowerCase();
            if (key) itemMap.set(key, it);
          });
          dbWishlist.forEach((it) => {
            const key = (it?.name || it?.title || "").trim().toLowerCase();
            if (key) itemMap.set(key, it);
          });

          const consolidated = Array.from(itemMap.values());
          setItems(consolidated);
          localStorage.setItem("wishlistItems", JSON.stringify(consolidated));

          // If local had new items not on the server, push to server
          if (consolidated.length !== dbWishlist.length) {
            syncUserData({ wishlist: consolidated }).catch(() => {});
          }
        })
        .catch(() => {
          // Keep localItems if backend fails
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncWishlist();

    const handleUpdate = () => {
      setItems(getWishlist());
    };
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);

  const handleRemove = (name) => {
    const updated = removeWishlistItem(name);
    setItems(updated);
    toast.success("Removed from wishlist");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      localStorage.removeItem("wishlistItems");
      setItems([]);
      if (isLoggedIn) {
        syncUserData({ wishlist: [] }).catch(() => {});
      }
      toast.success("Wishlist cleared");
    }
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <div className="page-body">
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <h1
                className="font-heading"
                style={{
                  fontSize: 28,
                  fontWeight: 400,
                  color: "var(--text-900)",
                  marginBottom: 6,
                }}
              >
                My Wishlist
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                {items.length} {items.length === 1 ? "product" : "products"} saved across retailers
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              {items.length > 0 && (
                <button className="btn btn-outline" onClick={handleClearAll} style={{ fontSize: 13 }}>
                  <FiTrash2 size={13} /> Clear All
                </button>
              )}
              <button className="btn btn-primary" onClick={() => navigate("/search")}>
                <FiSearch size={14} style={{ marginRight: 6 }} /> Add More
              </button>
            </div>
          </div>

          {/* Guest notification notice */}
          {!isLoggedIn && items.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 18px",
                marginBottom: 24,
                fontSize: 13,
                color: "var(--text-700)",
              }}
            >
              <FiInfo size={16} style={{ color: "var(--primary)", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                You are viewing saved items on this device.{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Sign in
                </Link>{" "}
                to sync your wishlist across all your devices.
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 320, borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="card empty-state" style={{ padding: 80 }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background: "var(--primary-light)",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px",
                  fontSize: 32,
                }}
              >
                <FiHeart />
              </div>
              <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 400, color: "var(--text-900)", marginBottom: 12 }}>
                Your wishlist is empty
              </h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 440, margin: "0 auto 32px", lineHeight: 1.6 }}>
                Keep track of items you love. Click the heart icon on any product in Search or Home to save it here and compare prices later.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                Explore Products <FiArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}
            >
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="card card-hover"
                  style={{
                    padding: 20,
                    display: "flex",
                    flexDirection: "column",
                    position: "relative",
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(item.name || item.title)}
                    title="Remove from wishlist"
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "var(--surface)",
                      color: "var(--danger)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      zIndex: 3,
                      transition: "var(--transition)",
                      boxShadow: "var(--shadow-xs)",
                    }}
                  >
                    <FiTrash2 size={13} />
                  </button>

                  {/* Discount tag if any */}
                  {item.discount && (
                    <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
                      <span className="badge badge-success">{item.discount} OFF</span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    style={{
                      height: 160,
                      background: "var(--bg)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                      marginTop: item.discount ? 16 : 0,
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name || item.title}
                      style={{
                        maxWidth: "80%",
                        maxHeight: "80%",
                        objectFit: "contain",
                      }}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/160?text=Product";
                      }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-900)",
                      lineHeight: 1.4,
                      marginBottom: 8,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.name || item.title}
                  </h3>

                  {/* Rating & Store */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    {item.rating ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FaStar size={11} style={{ color: "#F59E0B" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-700)" }}>
                          {item.rating}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: 11, color: "var(--text-400)" }}>Verified</span>
                    )}

                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        borderRadius: "var(--radius-sm)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.store || "Amazon"}
                    </span>
                  </div>

                  {/* Price */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 8,
                      marginBottom: 16,
                      marginTop: "auto",
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--success)" }}>
                      ₹{item.price ? Number(item.price).toLocaleString() : "---"}
                    </span>
                    {item.originalPrice > item.price && (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-400)",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{Number(item.originalPrice).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Compare action */}
                  <button
                    onClick={() =>
                      navigate(`/comparison/${encodeURIComponent(item.name || item.title)}`, {
                        state: { product: item },
                      })
                    }
                    className="btn btn-primary btn-full btn-sm"
                  >
                    <FaExchangeAlt size={12} /> Compare Prices
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
