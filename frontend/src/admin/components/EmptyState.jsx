import React from "react";
import { Inbox, Search, Package, AlertCircle } from "lucide-react";

export default function EmptyState({
  title = "No data available",
  description = "There are no records found to display at this moment.",
  icon: Icon = Inbox,
  action = null,
}) {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          backgroundColor: "#F1F5F9",
          border: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94A3B8",
          marginBottom: 16,
        }}
      >
        <Icon size={24} strokeWidth={1.75} />
      </div>

      <h3
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: "#0F172A",
          marginBottom: 6,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: 13,
          color: "#64748B",
          maxWidth: 380,
          lineHeight: 1.5,
          margin: "0 auto",
        }}
      >
        {description}
      </p>

      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}
