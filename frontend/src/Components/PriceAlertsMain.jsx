import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBell, FiTrash2, FiTarget, FiTrendingDown, FiClock,
  FiArrowRight, FiCheckCircle, FiAlertCircle, FiSearch,
  FiPlus, FiInfo, FiX
} from "react-icons/fi";
import { FaExchangeAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { getAlerts, deleteAlert as deleteAlertApi } from "../utils/api";
import { getStoredAlerts, savePriceAlert, removePriceAlert } from "../utils/alertHelper";
import { getWishlist } from "../utils/wishlistHelper";

function formatRelativeTime(value) {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default function PriceAlertsMain() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [newTargetPrice, setNewTargetPrice] = useState("");
  const [newCurrentPrice, setNewCurrentPrice] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  const fetchAlerts = () => {
    setLoading(true);
    // 1. Immediately read local alerts
    const localAlerts = getStoredAlerts();
    setAlerts(localAlerts);

    const token = localStorage.getItem("token");
    if (!token) {
      setAlerts(localAlerts);
      setError("");
      setLoading(false);
      return;
    }

    getAlerts()
      .then((data) => {
        const serverAlerts = Array.isArray(data?.alerts) ? data.alerts : [];
        // Merge: local alerts + server alerts, deduplicating by productName
        const alertMap = new Map();
        localAlerts.forEach((a) => {
          if (a?.productName) alertMap.set(a.productName.trim().toLowerCase(), a);
        });
        serverAlerts.forEach((a) => {
          if (a?.productName) alertMap.set(a.productName.trim().toLowerCase(), a);
        });

        const merged = Array.from(alertMap.values());
        setAlerts(merged);
        localStorage.setItem("priceAlerts", JSON.stringify(merged));
        setError("");
      })
      .catch((err) => {
        // If network error, keep localAlerts
        setAlerts(localAlerts);
        if (localAlerts.length === 0) {
          setError(err.message || "Failed to load alerts.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();

    const handleAlertsUpdate = () => {
      setAlerts(getStoredAlerts());
    };
    window.addEventListener("priceAlertsUpdated", handleAlertsUpdate);
    return () => window.removeEventListener("priceAlertsUpdated", handleAlertsUpdate);
  }, []);

  const handleDelete = async (id, productName) => {
    try {
      await removePriceAlert(id, productName);
      setAlerts((prev) =>
        prev.filter((a) => a._id !== id && (!productName || a.productName !== productName))
      );
      toast.success("Alert removed");
    } catch (err) {
      toast.error("Failed to delete alert.");
    }
  };

  const handleCreateManualAlert = async (e) => {
    e.preventDefault();
    if (!newProductName.trim() || !newTargetPrice) {
      toast.error("Please provide both product name and target price");
      return;
    }

    const currentP = Number(newCurrentPrice) || Number(newTargetPrice) * 1.1;
    const alertData = {
      productName: newProductName.trim(),
      targetPrice: Number(newTargetPrice),
      currentPrice: Math.round(currentP),
      store: "Amazon & Retailers",
      image: "https://via.placeholder.com/150?text=Product",
    };

    await savePriceAlert(alertData);
    toast.success(`Tracking price alert for ${newProductName}!`);
    setIsModalOpen(false);
    setNewProductName("");
    setNewTargetPrice("");
    setNewCurrentPrice("");
    fetchAlerts();
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
                Price Alerts
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                We monitor prices across stores 24/7 and alert you when prices drop below your target.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setIsModalOpen(true)}>
                <FiPlus size={14} style={{ marginRight: 6 }} /> Track New Product
              </button>
              <button className="btn btn-primary" onClick={() => navigate("/search")}>
                <FiSearch size={14} style={{ marginRight: 6 }} /> Search Products
              </button>
            </div>
          </div>

          {/* Guest notification notice */}
          {!isLoggedIn && alerts.length > 0 && (
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
                Price alerts are tracked in this browser.{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600 }}>
                  Sign in
                </Link>{" "}
                to receive instant email notifications the moment prices drop.
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 220, borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : alerts.length === 0 ? (
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
                <FiBell />
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
                No active price alerts
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
                Stop refreshing product pages manually! Tap the bell icon on any product in Search or click below to set a target price alert.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button className="btn btn-outline btn-lg" onClick={() => setIsModalOpen(true)}>
                  <FiPlus size={16} /> Track a Product
                </button>
                <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                  Search Products <FiArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                gap: 20,
              }}
            >
              {alerts.map((alert) => {
                const diff = (alert.currentPrice || 0) - (alert.targetPrice || 0);
                const isReached = (alert.currentPrice || 0) <= (alert.targetPrice || 0) && alert.currentPrice > 0;

                return (
                  <div
                    key={alert._id || alert.productName}
                    className="card card-hover"
                    style={{
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                    }}
                  >
                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(alert._id, alert.productName)}
                      title="Remove price alert"
                      style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
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
                        transition: "var(--transition)",
                        boxShadow: "var(--shadow-xs)",
                        zIndex: 2,
                      }}
                    >
                      <FiTrash2 size={13} />
                    </button>

                    {/* Product info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                      <div
                        style={{
                          width: 64,
                          height: 64,
                          background: "var(--bg)",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={alert.image || "https://via.placeholder.com/64?text=P"}
                          alt={alert.productName}
                          style={{
                            maxWidth: "80%",
                            maxHeight: "80%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64?text=Product";
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0, paddingRight: 28 }}>
                        <h3
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "var(--text-900)",
                            lineHeight: 1.4,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {alert.productName}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 12,
                            color: "var(--text-400)",
                            marginTop: 4,
                          }}
                        >
                          <FiClock size={11} /> Created {formatRelativeTime(alert.createdAt)}
                        </div>
                      </div>
                    </div>

                    {/* Price boxes */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        background: "var(--bg)",
                        padding: "14px 16px",
                        borderRadius: "var(--radius-md)",
                        marginBottom: 16,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text-500)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 4,
                          }}
                        >
                          Current Price
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-900)" }}>
                          ₹{alert.currentPrice ? Number(alert.currentPrice).toLocaleString() : "---"}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--primary)",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: 4,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FiTarget size={11} /> Target Price
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 800, color: "var(--primary)" }}>
                          ₹{Number(alert.targetPrice).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 12,
                        fontWeight: 600,
                        background: isReached ? "rgba(16, 185, 129, 0.12)" : "var(--primary-light)",
                        color: isReached ? "var(--success)" : "var(--primary)",
                        padding: "8px 12px",
                        borderRadius: "var(--radius-sm)",
                        marginBottom: 12,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <FiCheckCircle size={14} />
                        {isReached ? "Price target reached! 🎉" : "Tracking 24/7"}
                      </span>
                      {diff > 0 && !isReached && (
                        <span style={{ fontSize: 11, opacity: 0.85 }}>₹{diff.toLocaleString()} to drop</span>
                      )}
                    </div>

                    {/* Compare action button */}
                    <button
                      onClick={() =>
                        navigate(`/comparison/${encodeURIComponent(alert.productName)}`, {
                          state: { product: alert },
                        })
                      }
                      className="btn btn-outline btn-sm btn-full"
                    >
                      <FaExchangeAlt size={11} /> Compare Live Prices
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Modal to Track New Product */}
          {isModalOpen && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(4px)",
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <div
                className="card"
                style={{
                  width: "100%",
                  maxWidth: 440,
                  padding: 32,
                  position: "relative",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-400)",
                  }}
                >
                  <FiX size={20} />
                </button>

                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <FiBell size={22} />
                </div>

                <h2
                  className="font-heading"
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    color: "var(--text-900)",
                    marginBottom: 8,
                  }}
                >
                  Track Product Price
                </h2>
                <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 20 }}>
                  Enter the product name and desired price. We'll monitor all stores and alert you when it drops.
                </p>

                <form onSubmit={handleCreateManualAlert}>
                  <div style={{ marginBottom: 16 }}>
                    <label
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-700)",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Product Name or Keyword
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Sony WH-1000XM5, iPhone 16"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-700)",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Target Price (₹)
                      </label>
                      <input
                        type="number"
                        className="input"
                        placeholder="e.g. 24999"
                        value={newTargetPrice}
                        onChange={(e) => setNewTargetPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text-500)",
                          display: "block",
                          marginBottom: 6,
                        }}
                      >
                        Approx Current (₹)
                      </label>
                      <input
                        type="number"
                        className="input"
                        placeholder="Optional"
                        value={newCurrentPrice}
                        onChange={(e) => setNewCurrentPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full" style={{ padding: 13 }}>
                    Start Tracking
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}