import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiHeart, FiTrash2, FiExternalLink, FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { FaExchangeAlt, FaStar } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { getWishlist, removeWishlistItem } from "../utils/wishlistHelper";
import { getProfile } from "../utils/api";

export default function Wishlist() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then(res => setItems(res.user?.wishlist || []))
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleRemove = (name) => {
    removeWishlistItem(name);
    setItems(getWishlist());
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 800, color: "var(--text-900)", marginBottom: 8 }}>
                My Wishlist
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                {items.length} {items.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>
            
            {items.length > 0 && (
              <button className="btn btn-primary" onClick={() => navigate("/search")}>
                Add More <FiArrowRight size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-400)" }}>Loading wishlist...</div>
          ) : !localStorage.getItem("token") ? (
            <div className="card empty-state" style={{ padding: 64 }}>
              <div className="empty-state-icon" style={{ width: 80, height: 80, fontSize: 32 }}><FiHeart /></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 12 }}>Sign in to view your wishlist</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 400, margin: "0 auto 32px" }}>
                Your saved items are synced to your database. Log in to view and manage them.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
                Log In
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="card empty-state" style={{ padding: 64 }}>
              <div className="empty-state-icon" style={{ width: 80, height: 80, fontSize: 32 }}><FiHeart /></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 12 }}>Your wishlist is empty</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 400, margin: "0 auto 32px" }}>
                Keep track of products you want to buy. Tap the heart icon on any product to save it here.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {items.map((item, idx) => (
                <div key={idx} className="card card-hover" style={{ padding: 20, display: "flex", flexDirection: "column" }}>
                  <button onClick={() => handleRemove(item.name)} style={{
                    position: "absolute", top: 12, right: 12, width: 32, height: 32,
                    borderRadius: "50%", background: "var(--danger-light)", color: "var(--danger)",
                    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", zIndex: 2, transition: "var(--transition)"
                  }}>
                    <FiTrash2 size={14} />
                  </button>

                  <div style={{ height: 160, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <img src={item.image} alt={item.name} style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }}
                      onError={e => { e.target.src = "https://via.placeholder.com/160?text=Product"; }} />
                  </div>

                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {item.name}
                  </h3>

                  {item.rating && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                      <FaStar size={11} style={{ color: "#F59E0B" }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-700)" }}>{item.rating}</span>
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16, marginTop: "auto" }}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: "var(--success)" }}>
                      ₹{item.price?.toLocaleString()}
                    </span>
                  </div>

                  <button onClick={() => navigate(`/comparison/${encodeURIComponent(item.name)}`, { state: { product: item } })} className="btn btn-primary btn-full">
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
