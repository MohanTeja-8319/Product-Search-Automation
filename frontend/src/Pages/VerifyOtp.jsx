import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FiArrowRight, FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { verifyResetOtp, requestPasswordReset } from "../utils/api";
import { AuthLayout } from "./Login";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const emailParam = searchParams.get("email") || location.state?.email || "";
  const [email] = useState(emailParam);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = await verifyResetOtp({ email: email.trim(), otp: otpValue });
      navigate("/reset-password", {
        state: {
          email: email.trim(),
          resetToken: data.resetToken,
        },
      });
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setError("");
    setResending(true);
    try {
      await requestPasswordReset(email.trim());
      setTimer(120);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Could not resend verification code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We've sent a 6-digit code to ${email}.`}
      isRegister={false}
    >
      <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 12, textAlign: "center" }}>
            6-Digit Code
          </label>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                ref={(el) => (otpInputRefs.current[idx] = el)}
                style={{
                  width: 48, height: 56, fontSize: 24, fontWeight: 700, textAlign: "center",
                  border: "1px solid var(--border)", borderRadius: "var(--radius-md)",
                  background: "var(--surface)", color: "var(--text-900)", transition: "var(--transition)"
                }}
              />
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
          style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Verifying..." : (<>Verify Code <FiArrowRight size={16} /></>)}
        </button>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          {canResend ? (
            <button type="button" onClick={handleResend} disabled={resending} style={{ background: "none", border: "none", fontSize: 13, color: "var(--primary)", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiRefreshCw size={14} className={resending ? "spin" : ""} /> Resend Code
            </button>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-500)" }}>
              Resend code in <span style={{ fontWeight: 600, color: "var(--text-700)" }}>{formatTimer(timer)}</span>
            </span>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: 12 }}>
          <Link to="/forgot-password" style={{ fontSize: 13, color: "var(--text-500)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
            <FiArrowLeft size={14} /> Change Email
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
