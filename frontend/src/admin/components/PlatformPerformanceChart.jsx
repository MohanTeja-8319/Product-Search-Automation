import React, { useState } from "react";
import { CheckCircle2, Globe } from "lucide-react";

export default function PlatformPerformanceChart() {
  const [metric, setMetric] = useState("volume"); // volume, successRate, productsFound

  const platforms = [
    {
      name: "Amazon",
      volume: 12450,
      volumePercent: 50,
      avgPrice: "₹14,250",
      productsFound: 5230,
      successRate: 98.2,
      status: "Enabled",
    },
    {
      name: "Flipkart",
      volume: 9812,
      volumePercent: 40,
      avgPrice: "₹13,890",
      productsFound: 4812,
      successRate: 96.8,
      status: "Enabled",
    },
    {
      name: "Myntra",
      volume: 5310,
      volumePercent: 22,
      avgPrice: "₹2,450",
      productsFound: 3104,
      successRate: 94.5,
      status: "Enabled",
    },
    {
      name: "Other Sources",
      volume: 1420,
      volumePercent: 10,
      avgPrice: "₹11,100",
      productsFound: 1420,
      successRate: 92.1,
      status: "Degraded",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "var(--adm-card)",
        border: "1px solid var(--adm-border)",
        borderRadius: 16,
        padding: "24px",
        boxShadow: "var(--adm-shadow-card)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {/* Header and Toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-heading)", margin: 0, letterSpacing: "-0.01em" }}>
            Platform Performance
          </h3>
          <p style={{ fontSize: 12.5, color: "var(--adm-muted)", margin: "2px 0 0" }}>
            Comparison of enabled store sources & indexers
          </p>
        </div>

        <div style={{ display: "flex", gap: 4, backgroundColor: "var(--adm-primary-light, rgba(255,255,255,0.05))", border: "1px solid var(--adm-border)", padding: 4, borderRadius: 9999 }}>
          <button
            onClick={() => setMetric("volume")}
            style={{
              border: "none",
              borderRadius: 9999,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: metric === "volume" ? "var(--adm-primary)" : "transparent",
              color: metric === "volume" ? "var(--adm-primary-content)" : "var(--adm-muted)",
            }}
          >
            Volume
          </button>
          <button
            onClick={() => setMetric("successRate")}
            style={{
              border: "none",
              borderRadius: 9999,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor: metric === "successRate" ? "var(--adm-primary)" : "transparent",
              color: metric === "successRate" ? "var(--adm-primary-content)" : "var(--adm-muted)",
            }}
          >
            Success Rate
          </button>
        </div>
      </div>

      {/* Horizontal Bar List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {platforms.map((p) => {
          const barValue = metric === "volume" ? p.volumePercent : p.successRate;
          const barColor = metric === "volume" ? "var(--adm-primary)" : "#10B981";

          return (
            <div key={p.name} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, color: "var(--adm-heading)" }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: "var(--adm-muted)" }}>({p.productsFound} items)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "var(--adm-muted)" }}>Avg {p.avgPrice}</span>
                  <span style={{ fontWeight: 700, color: "var(--adm-heading)", minWidth: 48, textAlign: "right" }}>
                    {metric === "volume" ? `${p.volume.toLocaleString()}` : `${p.successRate}%`}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div
                style={{
                  height: 8,
                  width: "100%",
                  backgroundColor: "var(--adm-border)",
                  borderRadius: 9999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, barValue)}%`,
                    backgroundColor: barColor,
                    borderRadius: 9999,
                    transition: "width 0.4s ease-out",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--adm-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--adm-muted)" }}>
          <CheckCircle2 size={15} color="#10B981" /> 4 Active Indexing Crawlers
        </div>
        <span style={{ fontSize: 12, color: "var(--adm-muted)" }}>
          Overall Success: <strong style={{ color: "#10b981" }}>96.4%</strong>
        </span>
      </div>
    </div>
  );
}
