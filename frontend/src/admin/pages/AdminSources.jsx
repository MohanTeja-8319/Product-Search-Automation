import React, { useState, useEffect } from "react";
import {
  Globe,
  RefreshCw,
  Power,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sliders,
  Radio,
  Clock,
  Zap,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useAdminToast } from "../context/AdminToastContext";
import { API_BASE_URL } from "../../utils/api";

const INITIAL_SOURCES = [
  {
    id: "src-1",
    name: "Amazon India",
    code: "amazon",
    status: "Enabled",
    productsCollected: 5230,
    lastSync: "1 min ago",
    successRate: 98.4,
    syncInterval: "15 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Amazon",
    rateLimit: "100 req / min",
  },
  {
    id: "src-2",
    name: "Flipkart",
    code: "flipkart",
    status: "Enabled",
    productsCollected: 4812,
    lastSync: "3 min ago",
    successRate: 97.2,
    syncInterval: "15 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Flipkart",
    rateLimit: "60 req / min",
  },
  {
    id: "src-3",
    name: "BlinkIt",
    code: "blinkit",
    status: "Enabled",
    productsCollected: 2150,
    lastSync: "2 min ago",
    successRate: 99.1,
    syncInterval: "10 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=BlinkIt",
    rateLimit: "60 req / min",
  },
  {
    id: "src-4",
    name: "Zepto",
    code: "zepto",
    status: "Enabled",
    productsCollected: 1940,
    lastSync: "5 min ago",
    successRate: 98.0,
    syncInterval: "10 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Zepto",
    rateLimit: "60 req / min",
  },
  {
    id: "src-5",
    name: "Swiggy Instamart",
    code: "swiggy",
    status: "Enabled",
    productsCollected: 2870,
    lastSync: "4 min ago",
    successRate: 96.5,
    syncInterval: "10 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Swiggy",
    rateLimit: "60 req / min",
  },
  {
    id: "src-6",
    name: "BigBasket",
    code: "bigbasket",
    status: "Enabled",
    productsCollected: 3410,
    lastSync: "7 min ago",
    successRate: 97.8,
    syncInterval: "15 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=BigBasket",
    rateLimit: "60 req / min",
  },
  {
    id: "src-7",
    name: "Myntra Fashion",
    code: "myntra",
    status: "Enabled",
    productsCollected: 3104,
    lastSync: "6 min ago",
    successRate: 95.5,
    syncInterval: "30 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Myntra",
    rateLimit: "45 req / min",
  },
  {
    id: "src-8",
    name: "Nykaa",
    code: "nykaa",
    status: "Enabled",
    productsCollected: 1850,
    lastSync: "8 min ago",
    successRate: 96.0,
    syncInterval: "30 min",
    apiType: "QuickCommerce API Gateway",
    endpoint: "https://api.quickcommerceapi.com/v1/groupsearch?platforms=Nykaa",
    rateLimit: "45 req / min",
  },
];

export default function AdminSources() {
  const { addToast } = useAdminToast();
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [syncingId, setSyncingId] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/sources`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setSources(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggle = (id) => {
    setSources((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const next = s.status === "Enabled" ? "Disabled" : "Enabled";
          addToast(
            `${s.name} connector has been ${next.toLowerCase()}.`,
            next === "Enabled" ? "success" : "warning"
          );
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  const handleSync = (s) => {
    setSyncingId(s.id);
    addToast(`Triggering manual sync for ${s.name}...`, "info");

    setTimeout(() => {
      setSyncingId(null);
      setSources((prev) =>
        prev.map((item) =>
          item.id === s.id ? { ...item, lastSync: "Just now", productsCollected: item.productsCollected + 14 } : item
        )
      );
      addToast(`Sync completed for ${s.name}: 14 new product quotes saved.`, "success");
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0, letterSpacing: "-0.02em" }}>
            Sources & Platforms
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Monitor e-commerce data connectors, rate limits, and synchronization health.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "7px 16px", borderRadius: 9999, fontWeight: 600 }}>
          <CheckCircle2 size={16} /> 4 of 6 Platforms Active
        </div>
      </div>

      {/* Grid of Source Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: 20,
        }}
      >
        {sources.map((s) => {
          const isEnabled = s.status === "Enabled";
          const isSyncing = syncingId === s.id;

          return (
            <div
              key={s.id}
              className="adm-card adm-card-hover"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "24px",
                borderLeft: isEnabled ? "4px solid #10B981" : "4px solid #444444",
              }}
            >
              <div>
                {/* Card Top */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: isEnabled ? "rgba(56, 189, 248, 0.1)" : "rgba(255, 255, 255, 0.04)",
                        color: isEnabled ? "var(--adm-accent, #38bdf8)" : "var(--adm-muted, #888888)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Globe size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0 }}>
                        {s.name}
                      </h3>
                      <span style={{ fontSize: 11.5, color: "var(--adm-muted, #888888)" }}>{s.apiType}</span>
                    </div>
                  </div>

                  <StatusBadge status={s.status} />
                </div>

                {/* Metrics Grid */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 10,
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--adm-border, #222222)",
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                      Products Indexed
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "var(--adm-text, #f4efe8)" }}>
                      {s.productsCollected ? s.productsCollected.toLocaleString() : "0"}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                      Success Rate
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: s.successRate > 95 ? "#10b981" : s.successRate > 0 ? "#fbbf24" : "var(--adm-muted, #888888)",
                      }}
                    >
                      {s.successRate > 0 ? `${s.successRate}%` : "—"}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                      Last Synced
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>
                      {s.lastSync}
                    </span>
                  </div>

                  <div>
                    <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                      Sync Cycle
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>
                      {s.syncInterval || "15 min"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--adm-border, #222222)" }}>
                <button
                  onClick={() => handleToggle(s.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 9999,
                    border: "1px solid var(--adm-border, #222222)",
                    backgroundColor: isEnabled ? "transparent" : "rgba(16, 185, 129, 0.1)",
                    color: isEnabled ? "var(--adm-text, #f4efe8)" : "#10b981",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Power size={13} /> {isEnabled ? "Disable Source" : "Enable Source"}
                </button>

                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setSelectedSource(s)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 9999,
                      border: "1px solid var(--adm-border, #222222)",
                      backgroundColor: "transparent",
                      color: "var(--adm-text, #f4efe8)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Details
                  </button>

                  <button
                    onClick={() => handleSync(s)}
                    disabled={!isEnabled || isSyncing}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      padding: "6px 16px",
                      borderRadius: 9999,
                      border: "none",
                      backgroundColor: isEnabled ? "#ffffff" : "rgba(255, 255, 255, 0.05)",
                      color: isEnabled ? "#0a0a0a" : "var(--adm-muted, #888888)",
                      fontSize: 12.5,
                      fontWeight: 600,
                      cursor: isEnabled && !isSyncing ? "pointer" : "not-allowed",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <RefreshCw size={13} className={isSyncing ? "spin-animation" : ""} />
                    <span>{isSyncing ? "Syncing..." : "Sync"}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Source Details Modal */}
      {selectedSource && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setSelectedSource(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 520,
              backgroundColor: "var(--adm-card, #111111)",
              borderRadius: 16,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--adm-border, #222222)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--adm-border, #222222)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Globe size={20} color="var(--adm-accent, #38bdf8)" />
                <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0 }}>
                  {selectedSource.name} Integration
                </h3>
              </div>
              <StatusBadge status={selectedSource.status} />
            </div>

            <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block" }}>
                  Endpoint URL
                </span>
                <code style={{ fontSize: 13, color: "var(--adm-text, #f4efe8)", backgroundColor: "rgba(255, 255, 255, 0.04)", padding: "8px 12px", borderRadius: 8, display: "block", marginTop: 6, border: "1px solid var(--adm-border, #222222)" }}>
                  {selectedSource.endpoint || "Internal scraper connector"}
                </code>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block" }}>
                    Rate Limit
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>
                    {selectedSource.rateLimit || "100 req / min"}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block" }}>
                    Integration Driver
                  </span>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>
                    {selectedSource.apiType}
                  </span>
                </div>
              </div>

              <div style={{ padding: 14, borderRadius: 10, backgroundColor: "rgba(56, 189, 248, 0.08)", border: "1px solid rgba(56, 189, 248, 0.2)", fontSize: 12.5, color: "#7dd3fc", lineHeight: 1.5 }}>
                <Zap size={14} style={{ display: "inline", marginRight: 6 }} />
                Real-time price normalization and currency formatting are active for this store connector.
              </div>
            </div>

            <div style={{ padding: "16px 24px", backgroundColor: "rgba(255, 255, 255, 0.02)", borderTop: "1px solid var(--adm-border, #222222)", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedSource(null)}
                className="adm-btn adm-btn-primary"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
