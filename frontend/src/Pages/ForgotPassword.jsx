import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { requestPasswordReset } from "../utils/api";
import { AuthLayout } from "./Login";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid registered email address.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      navigate("/verify-otp", {
        state: { email: email.trim() },
      });
    } catch (err) {
      setError(err.message || "Could not send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your registered email address and we'll send you a 6-digit verification code."
      isRegister={false}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {error && (
          <div style={{
            padding: "12px 16px", borderRadius: "var(--radius-md)",
            background: "var(--danger-light)", color: "var(--danger)",
            fontSize: 13, fontWeight: 500, border: "1px solid #FCA5A5"
          }}>
            {error}
          </div>
        )}

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            Registered Email Address
          </label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}>
              <FiMail size={15} />
            </span>
            <input
              className="input"
              type="email"
              placeholder="e.g. you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ border: "none", boxShadow: "none", padding: "8px 0" }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
          style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Sending..." : (<>Send Verification Code <FiArrowRight size={16} /></>)}
        </button>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Link to="/login" style={{ fontSize: 13, color: "var(--text-500)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <FiArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}