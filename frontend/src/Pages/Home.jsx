import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch, FiArrowRight, FiTrendingUp, FiHeart,
  FiChevronRight, FiStar, FiShoppingBag, FiZap,
  FiShield, FiClock, FiCheckCircle, FiPercent,
  FiSmartphone, FiMonitor, FiHeadphones, FiWatch,
  FiCamera, FiHome, FiGrid, FiRefreshCw, FiTv, FiPackage, FiSmile
} from "react-icons/fi";
import { FaHeart, FaStar, FaExchangeAlt, FaGamepad } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import WishlistButton from "../Components/WishlistButton";
import { searchLiveProducts } from "../utils/api";

const CATEGORIES = [
  { name: "Mobiles",     icon: FiSmartphone,  searchKey: "Smartphones",      categoryKey: "smartphones",  color: "#4F46E5", bg: "#EEF2FF" },
  { name: "Laptops",     icon: FiMonitor,     searchKey: "Laptops",          categoryKey: "laptops",      color: "#7C3AED", bg: "#F5F3FF" },
  { name: "Audio",       icon: FiHeadphones,  searchKey: "Headphones",       categoryKey: "headphones",   color: "#DB2777", bg: "#FDF2F8" },
  { name: "TVs",         icon: FiTv,          searchKey: "Televisions",      categoryKey: "televisions",  color: "#0891B2", bg: "#ECFEFF" },
  { name: "Wearables",   icon: FiWatch,       searchKey: "Smartwatches",     categoryKey: "smartwatches", color: "#059669", bg: "#ECFDF5" },
  { name: "Gaming",      icon: FaGamepad,     searchKey: "Gaming Consoles",  categoryKey: "gaming",       color: "#DC2626", bg: "#FEF2F2" },
  { name: "Groceries",   icon: FiPackage,     searchKey: "Groceries",        categoryKey: "groceries",    color: "#16A34A", bg: "#F0FDF4" },
  { name: "Fashion",     icon: FiShoppingBag, searchKey: "Fashion",          categoryKey: "fashion",      color: "#BE185D", bg: "#FDF2F8" },
  { name: "Beauty",      icon: FiSmile,       searchKey: "Beauty",           categoryKey: "beauty",       color: "#D97706", bg: "#FFFBEB" },
];

const FEATURES = [
  { icon: FaExchangeAlt, title: "Compare Stores",    desc: "Side-by-side prices from Amazon, Flipkart, Myntra & more.",  color: "#4F46E5", bg: "#EEF2FF" },
  { icon: FiZap,         title: "Save Time & Money", desc: "No more tab-hopping. Find the best deal in seconds.",        color: "#059669", bg: "#ECFDF5" },
  { icon: FiShield,      title: "Verified Data",     desc: "Live prices pulled directly from retailer listings.",        color: "#0891B2", bg: "#ECFEFF" },
  { icon: FiCheckCircle, title: "Price Alerts",      desc: "Get notified by email when price drops to your target.",     color: "#D97706", bg: "#FFFBEB" },
];


const STORE_BADGE_CONFIG = {
  amazon: { bg: "#FFF8E7", color: "#B45309", border: "#FDE68A", label: "Amazon" },
  flipkart: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Flipkart" },
  blinkit: { bg: "#FEF9C3", color: "#854D0E", border: "#FDE047", label: "BlinkIt" },
  zepto: { bg: "#F3E8FF", color: "#6B21A8", border: "#E9D5FF", label: "Zepto" },
  swiggy: { bg: "#FFF7ED", color: "#C2410C", border: "#FFEDD5", label: "Swiggy" },
  bigbasket: { bg: "#F7FEE7", color: "#3F6212", border: "#ECFCCB", label: "BigBasket" },
  myntra: { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3", label: "Myntra" },
  nykaa: { bg: "#FDF2F8", color: "#BE185D", border: "#FCE7F3", label: "Nykaa" },
};

function StoreBadge({ store, storeCount }) {
  const key = (store || "").toLowerCase().replace(/[^a-z]/g, "");
  const conf = STORE_BADGE_CONFIG[key] || { bg: "var(--primary-light)", color: "var(--primary)", border: "transparent", label: store || "Store" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        background: conf.bg,
        color: conf.color,
        border: `1px solid ${conf.border}`,
        borderRadius: "var(--radius-sm)",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {store || "Verified Store"}
      </span>
      {storeCount > 1 && (
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 6px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-600)",
          borderRadius: "var(--radius-sm)",
          display: "inline-flex",
          alignItems: "center",
          gap: 3
        }}>
          <FaExchangeAlt size={8} style={{ color: "var(--primary)" }} />
          +{storeCount - 1} stores
        </span>
      )}
    </div>
  );
}

function ProductCard({ product, onClick }) {
  const storeCount = product.storeCount || (Array.isArray(product.comparison) ? product.comparison.length : 1);

  return (
    <div
      onClick={onClick}
      className="card card-hover animate-fade-in-up"
      style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, position: "relative" }}
    >
      <div style={{ position: "absolute", top: 14, right: 14, zIndex: 3 }}>
        <WishlistButton product={product} size={32} iconSize={13} />
      </div>

      {product.discount && (
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 2 }}>
          <span className="badge badge-success">{product.discount} OFF</span>
        </div>
      )}

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

      <h3 style={{
        fontSize: 13, fontWeight: 600, color: "var(--text-900)",
        lineHeight: 1.4, display: "-webkit-box",
        WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
      }}>
        {product.name}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <FaStar size={11} style={{ color: "#F59E0B" }} />
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-800)" }}>
          {product.rating ? Number(product.rating).toFixed(1) : "4.3"}
        </span>
        <span style={{ fontSize: 11, color: "var(--text-400)" }}>
          ({Number(product.reviews || 320).toLocaleString()} reviews)
        </span>
      </div>

      <StoreBadge store={product.store} storeCount={storeCount} />

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
  const [trendingProducts, setTrendingProducts] = useState(() => {
    try {
      const cached = localStorage.getItem("cachedHomeProducts");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.slice(0, 8);
      }
    } catch (_) {}
    return [];
  });
  const [bestDeals, setBestDeals] = useState(() => {
    try {
      const cached = localStorage.getItem("cachedHomeProducts");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 8) return parsed.slice(8, 16);
      }
    } catch (_) {}
    return [];
  });
  const [loading, setLoading] = useState(() => {
    try {
      const cached = localStorage.getItem("cachedHomeProducts");
      if (cached && JSON.parse(cached)?.length > 0) return false;
    } catch (_) {}
    return true;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadHomeProducts = (forceLoading = false) => {
    if (forceLoading) setLoading(true);
    searchLiveProducts("popular")
      .then(res => {
        if (res?.products && res.products.length > 0) {
          setTrendingProducts(res.products.slice(0, 8));
          setBestDeals(res.products.slice(8, 16));
          try {
            localStorage.setItem("cachedHomeProducts", JSON.stringify(res.products));
          } catch (_) {}
        }
      })
      .catch(err => console.error("Home fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadHomeProducts();
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

            <div className="categories-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12 }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/search?q=${encodeURIComponent(cat.searchKey)}&category=${cat.categoryKey}`)}
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
                    key={`${product.id || 'trend'}-${i}`}
                    product={product}
                    onClick={() => navigate(`/comparison/${encodeURIComponent(product.name)}`, { state: { product } })}
                  />
                ))}
              </div>
            ) : (
              <div className="card empty-state" style={{ padding: "36px 20px", textAlign: "center" }}>
                <div className="empty-state-icon"><FiSearch size={28} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>No products loaded</h3>
                <p style={{ fontSize: 13, color: "var(--text-400)", marginBottom: 16 }}>Unable to load live feed. Please verify the backend service is running.</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => loadHomeProducts(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, margin: "0 auto" }}
                >
                  <FiRefreshCw size={13} /> Retry Loading
                </button>
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
                    key={`${product.id || 'deal'}-${i}`}
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