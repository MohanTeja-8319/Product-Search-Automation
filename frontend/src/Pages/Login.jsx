import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiArrowRight, FiBarChart2, FiCheck } from "react-icons/fi";
import { loginUser, registerUser, saveAuth } from "../utils/api";

const FEATURES = [
  "Compare prices across 7+ stores instantly",
  "Set price alerts & get email notifications",
  "Track price history over time",
  "Free to use — no credit card needed",
];

export function AuthLayout({ children, title, subtitle, isRegister }) {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg)", fontFamily: "'Inter', sans-serif"
    }}>
      {/* Sidebar (Left) */}
      <div style={{
        width: 480, flexShrink: 0,
        background: "var(--primary-content)", // Stark dark/black
        display: "flex", flexDirection: "column", padding: "48px 48px",
        position: "relative", overflow: "hidden",
        borderRight: "1px solid var(--border)"
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "var(--primary-muted)" }} />
        
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 80, position: "relative" }}>
          <img
            src="/logo.png"
            alt="Comparely"
            style={{ height: 60, width: "auto", objectFit: "contain" }}
          />
        </div>

        {/* Hero Text */}
        <div style={{ flex: 1, position: "relative" }}>
          <h2 className="font-heading" style={{
            fontSize: 42, color: "var(--primary)", lineHeight: 1.1, marginBottom: 24, fontStyle: "italic"
          }}>
            Intelligent commerce.
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-400)", lineHeight: 1.8, marginBottom: 40, maxWidth: 300, letterSpacing: "0.02em" }}>
            The definitive destination to contrast, analyze, and acquire across premium retailers.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 4, height: 4, background: "var(--primary)", borderRadius: "50%" }} />
                <span style={{ fontSize: 12, color: "var(--text-300)", letterSpacing: "0.03em", textTransform: "uppercase", fontWeight: 600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: "relative", fontSize: 11, color: "var(--text-500)", marginTop: 48, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          © 2026 Comparely
        </div>
      </div>

      {}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 24px"
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <h1 className="font-heading" style={{
            fontSize: 32, fontWeight: 400,
            color: "var(--text-900)", marginBottom: 12
          }}>
            {title}
          </h1>
          <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 40, lineHeight: 1.6, letterSpacing: "0.01em" }}>
            {subtitle}
          </p>
          {children}
          <div style={{ marginTop: 28, textAlign: "center", fontSize: 13, color: "var(--text-400)" }}>
            {isRegister ? (
              <>Already have an account?{" "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Sign In</Link>
              </>
            ) : (
              <>Don't have an account?{" "}
                <Link to="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── LOGIN ──────────────────────────────────────
export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginUser({ email, password });
      saveAuth(data);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Comparely account to continue."
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

        {/* Email */}
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
            Email Address
          </label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}>
              <FiMail size={15} />
            </span>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ border: "none", boxShadow: "none", padding: "8px 0" }}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
            <Link to="/forgot-password" style={{ fontSize: 11, color: "var(--text-400)", textDecoration: "none", fontWeight: 600 }}>
              FORGOT PASSWORD?
            </Link>
          </div>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}>
              <FiLock size={15} />
            </span>
            <input
              className="input"
              type={showPw ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ border: "none", boxShadow: "none", padding: "8px 0" }}
            />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ padding: "0 14px", background: "none", border: "none", color: "var(--text-400)", cursor: "pointer", display: "flex" }}>
              {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
          style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in..." : (<>Sign In <FiArrowRight size={16} /></>)}
        </button>

        {/* Admin link */}
        <div style={{ textAlign: "center" }}>
          <Link to="/admin/login" style={{ fontSize: 12, color: "var(--text-400)", textDecoration: "none" }}>
            Admin Portal →
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

// ── REGISTER ──────────────────────────────────
export function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const data = await registerUser({ fullName, email, password, confirmPassword });
      saveAuth(data);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start comparing prices for free. No credit card required."
      isRegister={true}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Full Name</label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}><FiUser size={15} /></span>
            <input className="input" type="text" placeholder="Your full name" value={fullName}
              onChange={e => setFullName(e.target.value)} required style={{ border: "none", boxShadow: "none", padding: "8px 0" }} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Email Address</label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}><FiMail size={15} /></span>
            <input className="input" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)} required style={{ border: "none", boxShadow: "none", padding: "8px 0" }} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Password</label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}><FiLock size={15} /></span>
            <input className="input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters" value={password}
              onChange={e => setPassword(e.target.value)} required style={{ border: "none", boxShadow: "none", padding: "8px 0" }} />
            <button type="button" onClick={() => setShowPw(p => !p)}
              style={{ padding: "0 14px", background: "none", border: "none", color: "var(--text-400)", cursor: "pointer", display: "flex" }}>
              {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-400)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>Confirm Password</label>
          <div className="input-group" style={{ borderRadius: "0", border: "none", borderBottom: "1px solid var(--border)", paddingBottom: 4 }}>
            <span style={{ padding: "0 0 0 14px", color: "var(--text-400)", display: "flex" }}><FiLock size={15} /></span>
            <input className="input" type="password" placeholder="Repeat password" value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)} required style={{ border: "none", boxShadow: "none", padding: "8px 0" }} />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
          style={{ marginTop: 24, borderRadius: "0", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, padding: "16px", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Creating account..." : (<>Create Account <FiArrowRight size={16} /></>)}
        </button>
      </form>
    </AuthLayout>
  );
}

// ── LOGOUT ────────────────────────────────────
export function Logout() {
  const navigate = useNavigate();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("searchHistory");
  localStorage.removeItem("recentProducts");
  localStorage.removeItem("wishlistItems");
  localStorage.removeItem("price_scout_notifications");
  localStorage.removeItem("profilePhoto");
  navigate("/");
  return null;
}