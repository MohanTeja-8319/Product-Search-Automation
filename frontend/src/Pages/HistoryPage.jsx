import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiSearch, FiArrowRight, FiTrash2, FiExternalLink } from "react-icons/fi";
import { FaExchangeAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { syncUserData, getProfile } from "../utils/api";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function formatRelativeTime(value) {
    if (value === "Just now") return value;
    const d = new Date(value);
    if (isNaN(d)) return value;
    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then(res => setHistory(res.user?.searchHistory || []))
        .catch(() => setHistory([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("searchHistory");
    if (localStorage.getItem("token")) syncUserData({ searchHistory: [] }).catch(() => {});
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
                Search History
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                Quickly jump back to products you've searched for recently.
              </p>
            </div>
            
            {history.length > 0 && (
              <button className="btn btn-outline" onClick={clearHistory}>
                <FiTrash2 size={14} /> Clear All
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "var(--text-400)" }}>Loading history...</div>
          ) : !localStorage.getItem("token") ? (
            <div className="card empty-state" style={{ padding: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "var(--surface)", color: "var(--text-400)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>
                <FiClock />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 12 }}>Sign in to view history</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 400, margin: "0 auto 32px" }}>
                Your search history is saved securely in your account database. Log in to access it across all your devices.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/login")}>
                Log In
              </button>
            </div>
          ) : history.length === 0 ? (
            <div className="card empty-state" style={{ padding: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "var(--surface)", color: "var(--text-400)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>
                <FiClock />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 12 }}>No recent searches</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 400, margin: "0 auto 32px" }}>
                Your search history is empty. Start searching for products to see them appear here.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                Start Searching <FiArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden" }}>
              {history.map((item, idx) => (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "20px 24px", borderBottom: idx !== history.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "var(--transition)", cursor: "pointer"
                }} className="card-hover" onClick={() => navigate(`/search?q=${encodeURIComponent(item.term)}`)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg)", color: "var(--text-400)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FiSearch size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-900)", marginBottom: 4 }}>
                        {item.term}
                      </h3>
                      <div style={{ fontSize: 13, color: "var(--text-400)", display: "flex", alignItems: "center", gap: 6 }}>
                        <FiClock size={12} /> {formatRelativeTime(item.time)}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/search?q=${encodeURIComponent(item.term)}`);
                  }}>
                    Search Again <FiArrowRight size={12} />
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
