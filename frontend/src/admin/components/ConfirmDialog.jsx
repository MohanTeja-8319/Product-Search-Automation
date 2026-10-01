import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen = false,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action may be irreversible.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDanger = true,
  onConfirm = () => {},
  onCancel = () => {},
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.2)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          animation: "adm-scale 0.2s ease-out",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #F1F5F9",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: isDanger ? "#FEE2E2" : "#EEF2FF",
                color: isDanger ? "#EF4444" : "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              {title}
            </h3>
          </div>

          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "20px 24px", fontSize: 14, color: "#475569", lineHeight: 1.5 }}>
          {message}
        </div>

        <div
          style={{
            padding: "16px 24px",
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button
            onClick={onCancel}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {cancelLabel}
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              backgroundColor: isDanger ? "#EF4444" : "#4F46E5",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
