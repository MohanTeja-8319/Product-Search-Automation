import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiClock, FiSearch, FiArrowRight, FiTrash2, FiInfo, FiX
} from "react-icons/fi";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { syncUserData, getProfile } from "../utils/api";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem("token");

  function formatRelativeTime(value) {
    if (!value || value === "Just now" || value === "Recently") return "Just now";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "Recently";
    const seconds = Math.floor((new Date() - d) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  const loadHistory = () => {
    // 1. Immediately read local storage
    let localHist = [];
    try {
      const stored = localStorage.getItem("searchHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localHist = parsed
            .map((item) => {
              if (typeof item === "string") return { term: item, time: new Date().toISOString() };
              return {
                term: item?.term || item?.query || "",
                time: item?.time || new Date().toISOString(),
              };
            })
            .filter((item) => item.term && item.term.trim());
        }
      }
    } catch (e) {}

    setHistory(localHist);

    // 2. If token exists, sync with server profile
    const token = localStorage.getItem("token");
    if (token) {
      getProfile()
        .then((res) => {
          const dbHistory = Array.isArray(res?.user?.searchHistory)
            ? res.user.searchHistory.map((it) => ({
                term: typeof it === "string" ? it : it?.term || it?.query || "",
                time: it?.time || new Date().toISOString(),
              })).filter(it => it.term && it.term.trim())
            : [];

          // Merge: local first, then server, deduplicating by term
          const termSet = new Set();
          const consolidated = [];
          for (const item of [...localHist, ...dbHistory]) {
            const key = item.term.trim().toLowerCase();
            if (key && !termSet.has(key)) {
              termSet.add(key);
              consolidated.push(item);
            }
          }

          setHistory(consolidated);
          localStorage.setItem("searchHistory", JSON.stringify(consolidated));

          if (consolidated.length !== dbHistory.length) {
            syncUserData({ searchHistory: consolidated }).catch(() => {});
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDeleteItem = (e, termToDelete) => {
    e.stopPropagation();
    const updated = history.filter(
      (item) => item.term.trim().toLowerCase() !== termToDelete.trim().toLowerCase()
    );
    setHistory(updated);
    localStorage.setItem("searchHistory", JSON.stringify(updated));
    if (isLoggedIn) {
      syncUserData({ searchHistory: updated }).catch(() => {});
    }
    toast.success("Search removed");
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear your entire search history?")) {
      setHistory([]);
      localStorage.removeItem("searchHistory");
      if (isLoggedIn) {
        syncUserData({ searchHistory: [] }).catch(() => {});
      }
      toast.success("Search history cleared");
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
                Search History
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                Quickly jump back to products and terms you've searched for recently.
              </p>
            </div>

            {history.length > 0 && (
              <button className="btn btn-outline" onClick={clearHistory} style={{ fontSize: 13 }}>
                <FiTrash2 size={13} /> Clear All
              </button>
            )}
          </div>

          {/* Guest notification notice */}
          {!isLoggedIn && history.length > 0 && (
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
                Search history is saved locally in your browser.{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Sign in
                </Link>{" "}
                to save and access your searches across devices.
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 68, borderRadius: "var(--radius-md)" }} />
              ))}
            </div>
          ) : history.length === 0 ? (
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
                <FiClock />
              </div>
              <h3
                className="font-heading"
                style={{
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--text-900)",
                  marginBottom: 12,
                }}
              >
                No recent searches
              </h3>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-500)",
                  maxWidth: 440,
                  margin: "0 auto 32px",
                  lineHeight: 1.6,
                }}
              >
                Your search history is empty. Start searching for products to compare prices across stores and see them appear here.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                Start Searching <FiArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflow: "hidden", padding: 0 }}>
              {history.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    borderBottom: idx !== history.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "var(--transition)",
                    cursor: "pointer",
                  }}
                  className="card-hover"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(item.term)}`)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--bg)",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiSearch size={16} />
                    </div>
                    <div>
                      <h3
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "var(--text-900)",
                          marginBottom: 4,
                        }}
                      >
                        {item.term}
                      </h3>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--text-400)",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <FiClock size={11} /> {formatRelativeTime(item.time)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/search?q=${encodeURIComponent(item.term)}`);
                      }}
                    >
                      Search Again <FiArrowRight size={12} />
                    </button>

                    <button
                      onClick={(e) => handleDeleteItem(e, item.term)}
                      title="Delete search item"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: "transparent",
                        border: "1px solid var(--border)",
                        color: "var(--text-400)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "var(--transition)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--danger)";
                        e.currentTarget.style.borderColor = "var(--danger)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-400)";
                        e.currentTarget.style.borderColor = "var(--border)";
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
