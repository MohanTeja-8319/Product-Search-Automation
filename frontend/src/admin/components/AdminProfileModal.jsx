import React, { useState } from "react";
import {
  X,
  Shield,
  Mail,
  Calendar,
  Clock,
  Key,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminProfileModal({ onClose = () => {} }) {
  const { adminUser, updateProfile } = useAdminAuth();

  const [name, setName] = useState(adminUser?.name || "Mohan Teja");
  const [email, setEmail] = useState(adminUser?.email || "admin@comparely.io");
  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile({ name, email });
    }
    setSavedMessage("Admin credentials updated successfully!");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
                Admin Profile & Credentials
              </h3>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0 }}>
                Comparely System Security Level 1
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
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

        {/* Form Body */}
        <form onSubmit={handleSave} style={{ padding: "24px" }}>
          {savedMessage && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                backgroundColor: "#D1FAE5",
                color: "#059669",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <CheckCircle2 size={16} /> {savedMessage}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <img
              src={
                adminUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
              }
              alt="Avatar"
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #4F46E5",
              }}
            />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>
                {adminUser?.name || "Mohan Teja"}
              </div>
              <div style={{ fontSize: 12.5, color: "#64748B" }}>
                Lead Systems Administrator
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  backgroundColor: "#D1FAE5",
                  color: "#059669",
                  padding: "2px 8px",
                  borderRadius: 4,
                  marginTop: 6,
                }}
              >
                <CheckCircle2 size={11} /> {adminUser?.accessLevel || "Full Access (Root)"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#64748B", display: "block", marginBottom: 6 }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="adm-input"
              />
            </div>

            <div>
              <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#64748B", display: "block", marginBottom: 6 }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="adm-input"
              />
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                fontSize: 12,
              }}
            >
              <div>
                <span style={{ color: "#94A3B8", display: "block" }}>Admin ID:</span>
                <span style={{ fontWeight: 600, color: "#0F172A" }}>ADM-8319</span>
              </div>
              <div>
                <span style={{ color: "#94A3B8", display: "block" }}>Two-Factor Auth:</span>
                <span style={{ fontWeight: 600, color: "#059669" }}>Enforced (TOTP)</span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              className="adm-btn adm-btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
