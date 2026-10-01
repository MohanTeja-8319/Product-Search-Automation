import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiArrowRight, FiTrendingUp, FiHeart,
  FiChevronRight, FiStar, FiShoppingBag, FiZap,
  FiShield, FiClock, FiCheckCircle, FiPercent,
  FiSmartphone, FiMonitor, FiHeadphones, FiWatch,
  FiCamera, FiHome, FiGrid,
} from "react-icons/fi";
import { FaHeart, FaStar, FaExchangeAlt, FaGamepad } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import WishlistButton from "../Components/WishlistButton";
import { searchLiveProducts } from "../utils/api";

const CATEGORIES = [
  { name: "Mobiles",    icon: FiSmartphone, key: "Smartphones",     color: "#4F46E5", bg: "#EEF2FF" },
  { name: "Laptops",    icon: FiMonitor,    key: "Laptops",          color: "#7C3AED", bg: "#F5F3FF" },
  { name: "Audio",      icon: FiHeadphones, key: "Headphones",       color: "#DB2777", bg: "#FDF2F8" },
  { name: "Wearables",  icon: FiWatch,      key: "Smartwatches",     color: "#0891B2", bg: "#ECFEFF" },
  { name: "Cameras",    icon: FiCamera,     key: "Camera",           color: "#059669", bg: "#ECFDF5" },
  { name: "Gaming",     icon: FaGamepad,    key: "Gaming",           color: "#DC2626", bg: "#FEF2F2" },
  { name: "Home",       icon: FiHome,       key: "Home Appliances",  color: "#D97706", bg: "#FFFBEB" },
  { name: "Fashion",    icon: FiShoppingBag,key: "Clothing",         color: "#BE185D", bg: "#FDF2F8" },
];

const FEATURES = [
  { icon: FaExchangeAlt, title: "Compare Stores",    desc: "Side-by-side prices from Amazon, Flipkart, Myntra & more.",  color: "#4F46E5", bg: "#EEF2FF" },
  { icon: FiZap,         title: "Save Time & Money", desc: "No more tab-hopping. Find the best deal in seconds.",        color: "#059669", bg: "#ECFDF5" },
  { icon: FiShield,      title: "Verified Data",     desc: "Live prices pulled directly from retailer listings.",        color: "#0891B2", bg: "#ECFEFF" },
  { icon: FiCheckCircle, title: "Price Alerts",      desc: "Get notified by email when price drops to your target.",     color: "#D97706", bg: "#FFFBEB" },
];


function ProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card card-hover animate-fade-in-up"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}
    >
      <div style={{ position: "absolute", top: 14, right: 14, zIndex: 3 }}>
        <WishlistButton product={product} size={32} iconSize={13} />
      </div>

      {}
      {product.discount && (
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
          <span className="badge badge-success">{product.discount} OFF</span>
        </div>
      )}

      {}
      <div style={{
        width: "100%", height: 160,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", borderRadius: "var(--radius-md)",
        overflow: "hidden", marginTop: product.discount ? 20 : 0,
      }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", transition: "transform 0.3s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          onError={e => { e.target.src = "https://via.placeholder.com/160x160?text=Product"; }}
        />
      </div>

      {}
      <h3 style={{
        fontSize: 13, fontWeight: 600, color: "var(--text-900)",
        lineHeight: 1.4, display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>
        {product.name}
      </h3>

      {}
      {product.rating && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <FaStar size={11} style={{ color: "#F59E0B" }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-700)" }}>{product.rating}</span>
          <span style={{ fontSize: 11, color: "var(--text-400)" }}>(reviews)</span>
        </div>
      )}

      <div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-sm)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {product.store || "Verified Store"}
        </span>
      </div>

      {}
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "var(--success)" }}>
          ₹{product.price?.toLocaleString()}
        </span>
        {product.originalPrice > product.price && (
          <span style={{ fontSize: 12, color: "var(--text-400)", textDecoration: "line-through" }}>
            ₹{product.originalPrice?.toLocaleString()}
          </span>
        )}
      </div>

      {}
      <button
        onClick={onClick}
        className="btn btn-primary btn-full"
        style={{ marginTop: "auto" }}
      >
        <FaExchangeAlt size={12} />
        Compare Prices
      </button>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [bestDeals, setBestDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    searchLiveProducts("trending smartphones laptops")
      .then(res => {
        if (active && res?.products) {
          setTrendingProducts(res.products.slice(0, 8));
          setBestDeals(res.products.slice(8, 16));
        }
      })
      .catch(err => console.error("Home fetch error:", err))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    else navigate("/search");
  };

  const SkeletonCard = () => (
    <div className="card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 160, borderRadius: "var(--radius-md)", marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 14, width: "70%", borderRadius: 4, marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 22, width: "50%", borderRadius: 4, marginBottom: 16 }} />
      <div className="skeleton" style={{ height: 38, borderRadius: "var(--radius-md)" }} />
    </div>
  );

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          {}
          <section style={{
            background: "transparent",
            padding: "clamp(32px, 5vw, 56px) clamp(20px, 5vw, 48px)",
            marginBottom: 40,
            position: "relative",
            overflow: "hidden",
            textAlign: "center",
          }}>
            <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--primary-light)",
                color: "var(--primary)",
                borderRadius: "var(--radius-full)",
                padding: "6px 16px", fontSize: 12, fontWeight: 700,
                marginBottom: 24, letterSpacing: "0.04em",
              }}>
                <FiZap size={14} /> Smart Price Comparison
              </div>

              <h1 className="font-heading" style={{
                fontSize: "clamp(48px, 6vw, 72px)",
                fontWeight: 400, lineHeight: 1.1,
                color: "var(--text-900)",
                marginBottom: 24,
              }}>
                Compare Prices.<br />
                <span style={{ fontStyle: "italic", opacity: 0.8 }}>Shop Smarter.</span>
              </h1>

              <p style={{
                fontSize: 16, color: "var(--text-500)", lineHeight: 1.7,
                marginBottom: 36, maxWidth: 480, margin: "0 auto 36px"
              }}>
                Search any product and instantly compare prices across Amazon, Flipkart, Myntra & more — all in one place.
              </p>

              <form onSubmit={handleSearch}>
                <div style={{
                  display: "flex", gap: 0,
                  background: "var(--surface)",
                  border: "1px solid var(--text-300)",
                  borderRadius: "var(--radius-full)",
                  padding: "6px 6px 6px 20px",
                  maxWidth: 520, margin: "0 auto",
                }}>
                  <FiSearch size={18} style={{ color: "var(--text-400)", alignSelf: "center", flexShrink: 0 }} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search iPhone, laptops, headphones..."
                    style={{
                      flex: 1, border: "none", outline: "none", padding: "10px 14px",
                      fontSize: 14, background: "transparent", color: "var(--text-900)",
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onKeyDown={e => e.key === "Enter" && handleSearch()}
                  />
                  <button type="submit" className="btn btn-primary btn-pill" style={{ padding: "11px 28px" }}>
                    Search
                  </button>
                </div>
              </form>

              {}
              <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-500)", alignSelf: "center" }}>Try:</span>
                {["iPhone 16", "Samsung TV", "AirPods", "HP Laptop"].map(q => (
                  <button key={q} onClick={() => navigate(`/search?q=${encodeURIComponent(q)}`)} style={{
                    background: "transparent", border: "1px solid var(--border)",
                    color: "var(--text-700)", borderRadius: "var(--radius-full)", padding: "4px 12px",
                    fontSize: 12, cursor: "pointer", transition: "var(--transition)", fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--primary-light)"; e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-700)"; }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </section>


          {}
          <section style={{ marginBottom: 48 }}>
            <div className="section-header">
              <div>
                <div className="section-label"><FiGrid size={11} /> Browse by Category</div>
                <h2 className="section-title">Explore Categories</h2>
              </div>
              <button className="section-link" onClick={() => navigate("/categories")}>
                View All <FiChevronRight size={14} />
              </button>
            </div>

            <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(cat.key)}`)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 10, padding: "20px 8px",
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)", cursor: "pointer",
                    transition: "var(--transition-slow)", fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = cat.color;
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{
                    width: 46, height: 46, borderRadius: "50%",
                    background: cat.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    color: cat.color, transition: "transform 0.3s ease"
                  }}>
                    <cat.icon size={20} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-700)" }}>{cat.name}</span>
                </button>
              ))}
            </div>
          </section>

          {}
          <section style={{ marginBottom: 48 }}>
            <div className="section-header">
              <div>
                <div className="section-label"><FiTrendingUp size={11} /> Hot Right Now</div>
                <h2 className="section-title">Trending Products</h2>
              </div>
              <button className="section-link" onClick={() => navigate("/search")}>
                View All <FiChevronRight size={14} />
              </button>
            </div>

            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : trendingProducts.length > 0 ? (
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {trendingProducts.map((product, i) => (
                  <ProductCard
                    key={product.id || i}
                    product={product}
                    onClick={() => navigate(`/comparison/${encodeURIComponent(product.name)}`, { state: { product } })}
                  />
                ))}
              </div>
            ) : (
              <div className="card empty-state">
                <div className="empty-state-icon"><FiSearch size={28} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>No products loaded</h3>
                <p style={{ fontSize: 13, color: "var(--text-400)" }}>Make sure the backend server is running.</p>
              </div>
            )}
          </section>

          {}
          {bestDeals.length > 0 && (
            <section style={{ marginBottom: 48 }}>
              <div className="section-header">
                <div>
                  <div className="section-label"><FiPercent size={11} /> Maximum Savings</div>
                  <h2 className="section-title">Best Deals</h2>
                </div>
                <button className="section-link" onClick={() => navigate("/search")}>
                  View All <FiChevronRight size={14} />
                </button>
              </div>
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                {bestDeals.map((product, i) => (
                  <ProductCard
                    key={product.id || i}
                    product={product}
                    onClick={() => navigate(`/comparison/${encodeURIComponent(product.name)}`, { state: { product } })}
                  />
                ))}
              </div>
            </section>
          )}

          {}
          <section style={{ marginBottom: 48 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div className="section-label" style={{ justifyContent: "center" }}>
                <FiCheckCircle size={11} /> Why Comparely?
              </div>
              <h2 className="section-title">Built for Smart Shoppers</h2>
            </div>
            <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="card" style={{ padding: 28, textAlign: "center" }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: "var(--radius-lg)",
                    background: f.bg, color: f.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px", fontSize: 22
                  }}>
                    <f.icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "var(--text-500)", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>


        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .categories-grid { grid-template-columns: repeat(4, 1fr) !important; }
          .products-grid   { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid   { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .categories-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 8px !important; }
          .products-grid   { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .features-grid   { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
          .cta-banner      { padding: 28px 20px !important; }
          .cta-buttons     { width: 100%; }
          .cta-buttons .btn { flex: 1; justify-content: center; }
        }
      `}</style>
    </div>
  );
}