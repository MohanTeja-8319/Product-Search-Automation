import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "Failed to load data from the server. Please try again.",
  onRetry = null,
}) {
  return (
    <div
      style={{
        padding: "40px 24px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        border: "1px solid #FEE2E2",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: "#FEE2E2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#EF4444",
          marginBottom: 14,
        }}
      >
        <AlertCircle size={24} />
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>
        {title}
      </h3>

      <p style={{ fontSize: 13, color: "#64748B", maxWidth: 360, margin: "0 auto 18px", lineHeight: 1.5 }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            borderRadius: 8,
            backgroundColor: "#4F46E5",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            transition: "background-color 0.15s ease",
          }}
          className="adm-btn-primary"
        >
          <RefreshCw size={14} /> Retry Request
        </button>
      )}
    </div>
  );
}
