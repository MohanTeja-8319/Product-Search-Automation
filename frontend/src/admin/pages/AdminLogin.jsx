import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ComparelyLogo from "../components/ComparelyLogo";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminToast } from "../context/AdminToastContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@comparely.io");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAdminAuth();
  const { addToast } = useAdminToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin/dashboard";

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    login(email, password);
    addToast("Admin authenticated. Welcome to Comparely Control Center!", "success");
    navigate(from, { replace: true });
    setIsLoading(false);
  };

  const fillCredentials = () => {
    setEmail("admin@comparely.io");
    setPassword("admin123");
    setErrorMessage("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg, #0a0a0a)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "var(--surface, #111111)",
          borderRadius: 20,
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.7)",
          border: "1px solid var(--border, #222222)",
          overflow: "hidden",
        }}
      >
        {/* Top Header Card */}
        <div
          style={{
            padding: "36px 32px 24px",
            backgroundColor: "var(--surface, #111111)",
            borderBottom: "1px solid var(--border, #222222)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <img
              src="/logo.png"
              alt="Comparely"
              style={{ width: 34, height: 34, objectFit: "contain", borderRadius: 8 }}
            />
            <span style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--text-900, #f4efe8)", letterSpacing: "-0.02em" }}>
              COMPARELY
            </span>
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--text-900, #f4efe8)", margin: "0 0 6px" }}>
            Admin Control Center
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-500, #888888)", margin: 0 }}>
            Restricted access portal for Comparely platform operators.
          </p>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleLogin} style={{ padding: "28px 32px 32px" }}>
          {errorMessage && (
            <div
              style={{
                padding: "12px 14px",
                borderRadius: 8,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Email Field */}
            <div>
              <label
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-500, #888888)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Administrator Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  color="var(--text-500, #888888)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@comparely.io"
                  required
                  className="adm-input"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-500, #888888)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  color="var(--text-500, #888888)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="adm-input"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-500, #888888)",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: 9999,
                backgroundColor: "#ffffff",
                color: "#0a0a0a",
                fontSize: 14,
                fontWeight: 700,
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 6,
                transition: "all 0.2s ease",
                boxShadow: "0 2px 10px rgba(255, 255, 255, 0.15)",
              }}
              className="adm-btn-primary"
            >
              <span>{isLoading ? "Authenticating..." : "Sign In to Admin Console"}</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Pre-fill Demo Admin credentials */}
          <div
            style={{
              marginTop: 24,
              padding: "12px 14px",
              borderRadius: 10,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px dashed var(--border, #222222)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: 12, color: "var(--text-500, #888888)" }}>
              Quick Login: <strong style={{ color: "var(--text-900, #f4efe8)" }}>admin@comparely.io</strong>
            </div>
            <button
              type="button"
              onClick={fillCredentials}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-900, #f4efe8)",
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Autofill
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
