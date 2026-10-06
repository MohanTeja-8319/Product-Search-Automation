import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiLayers, FiTrendingDown, FiShield, FiBarChart2 } from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

export default function Comparison() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">
          
          <div style={{ textAlign: "center", padding: "40px 20px 60px", maxWidth: 640, margin: "0 auto" }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16, background: "var(--primary-light)", color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 28
            }}>
              <FiBarChart2 />
            </div>
            
            <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(28px, 5vw, 36px)", fontWeight: 800, color: "var(--text-900)", marginBottom: 16 }}>
              Compare Prices Side-by-Side
            </h1>
            
            <p style={{ fontSize: 16, color: "var(--text-500)", lineHeight: 1.6, marginBottom: 40 }}>
              Search for any product to instantly see its price across Amazon, Flipkart, BlinkIt, Zepto, Swiggy, BigBasket, and Myntra.
            </p>

            <form onSubmit={handleSearch} style={{ display: "flex", background: "white", borderRadius: "var(--radius-full)", padding: "8px 8px 8px 24px", boxShadow: "var(--shadow-md)", border: "1px solid var(--border)" }}>
              <FiSearch size={20} color="var(--text-400)" style={{ alignSelf: "center", flexShrink: 0 }} />
              <input
                type="text"
                placeholder="e.g., iPhone 15 Pro, Sony Headphones"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: 15, background: "transparent", color: "var(--text-900)" }}
              />
              <button type="submit" className="btn btn-primary btn-pill" style={{ padding: "12px 28px" }}>
                Compare Now
              </button>
            </form>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 24 }}>
              <span style={{ fontSize: 13, color: "var(--text-400)", alignSelf: "center" }}>Popular:</span>
              {["Smartphones", "Laptops", "Smartwatches", "TVs"].map(tag => (
                <button key={tag} onClick={() => navigate(`/search?q=${encodeURIComponent(tag)}`)}
                  style={{ padding: "6px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--border)", background: "var(--surface)", fontSize: 12, fontWeight: 600, color: "var(--text-700)", cursor: "pointer", transition: "var(--transition)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--primary-light)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="comparison-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 960, margin: "0 auto" }}>
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <FiLayers size={28} color="var(--primary)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Multi-Store View</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6 }}>See prices, delivery estimates, and stock status from multiple retailers in one clean table.</p>
            </div>
            
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <FiTrendingDown size={28} color="var(--success)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Find the Best Deal</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6 }}>We automatically highlight the lowest current price so you never overpay again.</p>
            </div>
            
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <FiShield size={28} color="var(--text-400)" style={{ marginBottom: 16 }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Verified Listings</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6 }}>We only track and compare listings from official, trusted retailers across India.</p>
            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .comparison-features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
