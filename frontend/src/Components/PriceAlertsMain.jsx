import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiBell, FiTrash2, FiTarget, FiTrendingDown, FiClock,
  FiArrowRight, FiCheckCircle, FiAlertCircle, FiSearch
} from "react-icons/fi";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { getAlerts, deleteAlert as deleteAlertApi } from "../utils/api";

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
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hr ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

export default function PriceAlertsMain() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchAlerts = () => {
    setLoading(true);
    getAlerts()
      .then((data) => {
        if (data.alerts) setAlerts(data.alerts);
        else setAlerts([]);
        setError("");
      })
      .catch((err) => {
        setError(err.message || "Failed to load alerts.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteAlertApi(id);
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (err) {
      toast.error("Failed to delete alert.");
    }
  };

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <h1 className="font-heading" style={{ fontSize: 28, fontWeight: 400, color: "var(--text-900)", marginBottom: 8 }}>
                Price Alerts
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-500)" }}>
                We track these products 24/7 and will email you when they drop below your target price.
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate("/search")}>
              <FiSearch size={14} style={{ marginRight: 6 }} /> Find Products to Track
            </button>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card skeleton" style={{ height: 100, borderRadius: "var(--radius-lg)" }} />
              ))}
            </div>
          ) : error ? (
            <div className="card empty-state" style={{ padding: 60 }}>
              <div className="empty-state-icon"><FiAlertCircle size={32} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Failed to load alerts</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", marginBottom: 24 }}>{error}</p>
              <button className="btn btn-primary" onClick={fetchAlerts}>Try Again</button>
            </div>
          ) : alerts.length === 0 ? (
            <div className="card empty-state" style={{ padding: 80 }}>
              <div style={{ width: 80, height: 80, borderRadius: 20, background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 32 }}>
                <FiBell />
              </div>
              <h3 className="font-heading" style={{ fontSize: 22, fontWeight: 400, color: "var(--text-900)", marginBottom: 12 }}>No active price alerts</h3>
              <p style={{ fontSize: 15, color: "var(--text-500)", maxWidth: 400, margin: "0 auto 32px" }}>
                Stop checking prices manually. Tell us what you want to pay, and we'll notify you the second the price drops.
              </p>
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/search")}>
                Find Products to Track
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: 20 }}>
              {alerts.map((alert) => (
                <div key={alert._id} className="card" style={{ padding: 24, display: "flex", flexDirection: "column", position: "relative" }}>
                  <button onClick={() => handleDelete(alert._id)} style={{
                    position: "absolute", top: 16, right: 16, width: 32, height: 32,
                    borderRadius: "50%", background: "var(--danger-light)", color: "var(--danger)",
                    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", transition: "var(--transition)"
                  }}>
                    <FiTrash2 size={14} />
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 64, height: 64, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <img src={alert.image || "https://via.placeholder.com/64?text=P"} alt={alert.productName} style={{ maxWidth: "80%", maxHeight: "80%", objectFit: "contain" }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {alert.productName}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-400)", marginTop: 6 }}>
                        <FiClock size={12} /> Created {formatRelativeTime(alert.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, background: "var(--bg)", padding: 16, borderRadius: "var(--radius-md)", marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                        Current Price
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)" }}>
                        ₹{alert.currentPrice?.toLocaleString() || "---"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        <FiTarget size={12} /> Target Price
                      </div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "var(--primary)" }}>
                        ₹{alert.targetPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--success)", fontWeight: 600, background: "var(--success-light)", padding: "10px 16px", borderRadius: "var(--radius-sm)", marginTop: "auto" }}>
                    <FiCheckCircle size={15} /> Tracking active
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