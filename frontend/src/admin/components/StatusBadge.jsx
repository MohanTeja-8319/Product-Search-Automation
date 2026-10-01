import React from "react";
import { CircleCheck, Clock, AlertTriangle, XCircle, Power } from "lucide-react";

export default function StatusBadge({ status = "Active", size = "normal" }) {
  const normalized = String(status || "").toLowerCase();

  let bg = "rgba(255, 255, 255, 0.06)";
  let color = "var(--text-700, #d5cabd)";
  let border = "var(--border, #222222)";
  let Icon = null;

  if (["active", "enabled", "healthy", "completed", "success", "optimal", "in stock"].includes(normalized)) {
    bg = "rgba(16, 185, 129, 0.15)";
    color = "#10b981";
    border = "rgba(16, 185, 129, 0.3)";
    Icon = CircleCheck;
  } else if (["running", "processing", "syncing", "queued"].includes(normalized)) {
    bg = "rgba(255, 255, 255, 0.1)";
    color = "var(--text-900, #f4efe8)";
    border = "rgba(255, 255, 255, 0.25)";
    Icon = Clock;
  } else if (["warning", "degraded", "pending", "paused", "limited stock"].includes(normalized)) {
    bg = "rgba(245, 158, 11, 0.15)";
    color = "#f59e0b";
    border = "rgba(245, 158, 11, 0.3)";
    Icon = AlertTriangle;
  } else if (["failed", "error", "suspended", "stopped", "out of stock"].includes(normalized)) {
    bg = "rgba(239, 68, 68, 0.15)";
    color = "#ef4444";
    border = "rgba(239, 68, 68, 0.3)";
    Icon = XCircle;
  } else if (["disabled", "inactive"].includes(normalized)) {
    bg = "rgba(255, 255, 255, 0.05)";
    color = "var(--text-500, #888888)";
    border = "var(--border, #222222)";
    Icon = Power;
  }

  const isSmall = size === "small";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: isSmall ? "2px 8px" : "4px 12px",
        borderRadius: "var(--radius-full, 9999px)",
        backgroundColor: bg,
        color: color,
        border: `1px solid ${border}`,
        fontSize: isSmall ? 11 : 12,
        fontWeight: 600,
        letterSpacing: "0.01em",
        whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={isSmall ? 11 : 12.5} strokeWidth={2.2} />}
      <span>{status}</span>
    </span>
  );
}
