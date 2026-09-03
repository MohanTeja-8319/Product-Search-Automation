import React from "react";

export function StatusBadge({ status, size = "md" }) {
  if (!status) return null;

  const normalized = status.toString().toLowerCase().trim();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";
  let dotColor = "bg-slate-500";

  switch (normalized) {
    case "active":
    case "online":
    case "connected":
    case "running":
    case "completed":
    case "successful":
    case "enabled":
    case "healthy":
    case "resolved":
    case "in stock":
      styles = "bg-emerald-50 text-emerald-700 border-emerald-200/80";
      dotColor = "bg-emerald-500";
      break;

    case "inactive":
    case "disabled":
    case "stopped":
    case "out of stock":
      styles = "bg-slate-100 text-slate-600 border-slate-200";
      dotColor = "bg-slate-400";
      break;

    case "pending":
    case "warning":
    case "investigating":
    case "low stock":
      styles = "bg-amber-50 text-amber-700 border-amber-200/80";
      dotColor = "bg-amber-500";
      break;

    case "failed":
    case "error":
    case "critical":
    case "suspended":
      styles = "bg-rose-50 text-rose-700 border-rose-200/80";
      dotColor = "bg-rose-500";
      break;

    case "info":
      styles = "bg-blue-50 text-blue-700 border-blue-200/80";
      dotColor = "bg-blue-500";
      break;

    default:
      styles = "bg-slate-100 text-slate-700 border-slate-200";
      dotColor = "bg-slate-500";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-1 text-xs font-semibold",
    lg: "px-3 py-1.5 text-sm font-semibold"
  }[size] || "px-2.5 py-1 text-xs font-semibold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClasses} ${styles} transition-colors select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0 animate-pulse`} />
      <span className="capitalize">{status}</span>
    </span>
  );
}

export default StatusBadge;
