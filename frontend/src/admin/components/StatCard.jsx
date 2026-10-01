import React from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  growth,
  isPositive = true,
  status,
  icon: Icon,
  iconTheme = "indigo",
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface, #111111)",
        border: "1px solid var(--border, #222222)",
        borderRadius: "var(--radius-lg, 14px)",
        padding: "22px 24px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 14,
        flex: 1,
        minWidth: 200,
        transition: "border-color 0.2s ease, transform 0.15s ease",
      }}
      className="adm-card-hover"
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "var(--text-500, #888888)",
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "var(--radius-full, 9999px)",
              backgroundColor: "var(--surface-hover, #1a1a1a)",
              border: "1px solid var(--border, #222222)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "var(--text-900, #f4efe8)",
            }}
          >
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div
          className="font-heading"
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "var(--text-900, #f4efe8)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          {value}
        </div>

        {growth && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              fontSize: 12,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: "var(--radius-full, 9999px)",
              backgroundColor: isPositive ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
              color: isPositive ? "#10b981" : "#ef4444",
            }}
          >
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{growth}</span>
          </div>
        )}

        {status && (
          <span
            style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "var(--radius-full, 9999px)",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "#10b981",
              border: "1px solid rgba(16, 185, 129, 0.3)",
            }}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}
