import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { resetPassword } from "../utils/api";
import { AuthLayout } from "./Login";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const hasMinLength = password.length >= 8;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!hasMinLength) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords do not match. Please verify.");
      return;
    }
    if (!resetToken) {
      setError("Your reset session has expired. Please start over.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await resetPassword({
        resetToken,
        newPassword: password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Updated"
        subtitle="Your password has been successfully reset. You can now use it to sign in."
        isRegister={false}
      >
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--success-light)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <FiCheck size={32} />
          </div>
          <button onClick={() => navigate("/login")} className="btn btn-primary btn-full btn-lg" style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px" }}>
            Return to Sign In <FiArrowRight size={16} />
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Your new password must be at least 8 characters long."
      isRegister={false}
    >
      <form onSubmit={handleResetPassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            New Password
          </label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}>
              <FiLock size={15} />
            </span>
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ border: "none", boxShadow: "none", padding: "8px 0" }}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: "none", border: "none", padding: "0 14px", color: "var(--text-400)", cursor: "pointer", display: "flex" }}>
              {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            Confirm Password
          </label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}>
              <FiLock size={15} />
            </span>
            <input
              className="input"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ border: "none", boxShadow: "none", padding: "8px 0" }}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ background: "none", border: "none", padding: "0 14px", color: "var(--text-400)", cursor: "pointer", display: "flex" }}>
              {showConfirmPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading || !hasMinLength || !passwordsMatch}
          style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px", opacity: (loading || !hasMinLength || !passwordsMatch) ? 0.7 : 1 }}>
          {loading ? "Resetting..." : (<>Reset Password <FiArrowRight size={16} /></>)}
        </button>
      </form>
    </AuthLayout>
  );
}