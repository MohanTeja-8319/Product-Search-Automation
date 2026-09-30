import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch, FiTrendingDown, FiShield, FiBell, FiBarChart2, FiSun, FiMoon
} from "react-icons/fi";


function getTheme() {
  try { return localStorage.getItem("theme") || "dark"; } catch { return "dark"; }
}
function applyTheme(t) {
  document.documentElement.setAttribute("data-theme", t);
  try { localStorage.setItem("theme", t); } catch {}
}


function PublicNavbar({ theme, onToggle }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 72,
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "var(--surface)" : "transparent",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
      transition: "all 0.2s ease-in-out",
      fontFamily: "'Inter', sans-serif"
    }}>
      {}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/logo.png"
          alt="Comparely"
          style={{ height: 60, width: "auto", objectFit: "contain" }}
        />
      </div>

      {}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {}
        <button
          onClick={onToggle}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "var(--surface)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-500)",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-500)"; }}
        >
          {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        <Link to="/login" style={{ color: "var(--text-700)", fontWeight: 600, fontSize: 14, textDecoration: "none", padding: "8px 4px" }}>Log In</Link>
        <Link to="/register" className="btn btn-primary btn-sm" style={{ borderRadius: "var(--radius-full)" }}>Sign Up Free</Link>
      </div>
    </nav>
  );
}


const FEATURES = [
  {
    icon: FiSearch,
    title: "One Search, Everywhere",
    desc: "Search once and instantly see prices from Amazon, Flipkart, Myntra, Croma, and Reliance Digital side-by-side."
  },
  {
    icon: FiBell,
    title: "Smart Price Alerts",
    desc: "Set your target price for any product. We track it 24/7 and email you the second the price drops."
  },
  {
    icon: FiTrendingDown,
    title: "Historical Price Tracking",
    desc: "Never fall for fake sales. View the 30-day price history of any product to know if it's actually a good deal."
  },
  {
    icon: FiShield,
    title: "100% Verified Data",
    desc: "We pull live, verified data directly from retailer listings so you never miss a real-time price change."
  }
];


export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(getTheme);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const isDark = theme === "dark";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'Inter', sans-serif" }}>
      <PublicNavbar theme={theme} onToggle={toggleTheme} />

      {}
      <section style={{ padding: "160px 24px 100px", textAlign: "center", position: "relative" }}>
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: 820, margin: "0 auto" }}>
          {}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--primary-light)", border: "1px solid var(--border-primary)",
            borderRadius: "var(--radius-full)", padding: "6px 18px",
            fontSize: 12, fontWeight: 700, color: "var(--primary)",
            marginBottom: 32, letterSpacing: "0.04em"
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
            Live Price Comparison Engine
          </div>

          {}
          <h1 className="font-heading" style={{
            fontSize: "clamp(48px, 8vw, 84px)",
            fontWeight: 400, color: "var(--text-900)", lineHeight: 1.1, marginBottom: 24,
            letterSpacing: "-0.02em"
          }}>
            Quiet logic,<br />
            <span style={{ fontStyle: "italic", opacity: 0.8 }}>loudly considered.</span>
          </h1>

          <p style={{
            fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text-500)",
            lineHeight: 1.7, marginBottom: 48, maxWidth: 560, margin: "0 auto 48px"
          }}>
            Compare prices across India's top retailers instantly. Find the best deals, track price drops, and save money on every purchase.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: "0 auto 40px" }}>
            <div style={{
              display: "flex", background: "var(--surface)",
              borderRadius: "var(--radius-full)",
              padding: "6px 6px 6px 24px",
              border: "1px solid var(--border)",
              alignItems: "center"
            }}>
              <FiSearch size={20} color="var(--text-400)" style={{ flexShrink: 0 }} />
              <input
                type="text"
                placeholder="Search for an iPhone, laptop, or anything..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: "none", outline: "none", padding: "14px 16px",
                  fontSize: 16, background: "transparent", color: "var(--text-900)",
                  fontFamily: "'Inter', sans-serif"
                }}
              />
              <button type="submit" className="btn btn-primary btn-pill" style={{ padding: "12px 28px", fontSize: 15 }}>
                Compare
              </button>
            </div>
          </form>

          {/* Store logos text */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 32, flexWrap: "wrap", opacity: 0.8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Supported</span>
            {[
              { label: "Amazon" },
              { label: "Flipkart" },
              { label: "Myntra" },
            ].map(s => (
              <span key={s.label} className="font-heading" style={{ fontWeight: 400, fontSize: 20, color: "var(--text-700)", letterSpacing: "0.02em" }}>{s.label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section style={{ padding: "100px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--primary-light)",
            borderRadius: "var(--radius-full)", padding: "6px 16px",
            fontSize: 12, fontWeight: 700, color: "var(--primary)",
            marginBottom: 20
          }}>
            Why Comparely
          </div>
          <h2 className="font-heading" style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "var(--text-900)", marginBottom: 16 }}>
            Everything you need.
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-500)", maxWidth: 540, margin: "0 auto", lineHeight: 1.7 }}>
            We do the heavy lifting of checking multiple websites. Compare, track, and save with ease.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>
          {FEATURES.map((feat, i) => (
            <div key={i} style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "transparent",
                border: "1px solid var(--text-300)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, color: "var(--primary)",
                margin: "0 auto 20px"
              }}>
                <feat.icon />
              </div>
              <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 400, color: "var(--text-900)", marginBottom: 12 }}>{feat.title}</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", lineHeight: 1.6 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: 800, margin: "0 auto",
          textAlign: "center"
        }}>
          <h2 className="font-heading" style={{ fontSize: "clamp(36px, 6vw, 56px)", fontWeight: 400, color: "var(--text-900)", marginBottom: 16 }}>
            Ready to begin?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-500)", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.6 }}>
            Join thousands of smart shoppers who are saving money every day.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link to="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 0, padding: "14px 32px" }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "48px 24px", textAlign: "center", background: "var(--surface)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
          <img
            src="/logo.png"
            alt="Comparely"
            style={{ height: 80, width: "auto", objectFit: "contain" }}
          />
        </div>
        <p style={{ fontSize: 13, color: "var(--text-400)", marginBottom: 8 }}>
          © 2026 Comparely. Built for smart shoppers everywhere.
        </p>
        <p style={{ fontSize: 12, color: "var(--text-300)" }}>Compare. Save. Shop Smarter.</p>
      </footer>
    </div>
  );
}
