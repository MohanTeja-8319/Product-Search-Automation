import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaEye, 
  FaEyeSlash, 
  FaGoogle, 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaArrowLeft, 
  FaBolt,
  FaShieldAlt,
  FaShoppingBag,
  FaCheck
} from "react-icons/fa";
import { FiCheckCircle, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import ParticleBackground from "../Components/ParticleBackground";
import GoogleAuthModal from "../Components/GoogleAuthModal";
import ResetPassword from "./ResetPassword";
import A from "../assets/ab.png";
import { loginUser, registerUser, saveAuth } from "../utils/api";

// ==========================================
// 1. LOGIN COMPONENT
// ==========================================
export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleManualLogin = async (e) => {
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

  const handleQuickDemoLogin = (demoName, demoEmail) => {
    setEmail(demoEmail);
    setPassword("DemoPass@2026");
    setLoading(true);

    setTimeout(() => {
      const userPayload = {
        name: demoName,
        email: demoEmail,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        provider: "demo",
        loggedInAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      localStorage.setItem("token", `demo-${Date.now()}`);
      setLoading(false);
      navigate("/home");
    }, 500);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">
      {/* Dynamic Animated Particles Background */}
      <ParticleBackground />

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={() => navigate("/home")}
      />

      <div className="relative z-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
        {/* Left Hero Graphic Section */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-10 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">
              <FaShoppingBag className="text-purple-300" /> Smart Price Intelligence
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Product Search</h1>
            <h2 className="text-2xl lg:text-3xl font-semibold text-purple-200 mt-2">Automation</h2>
            <p className="text-purple-100/80 text-sm lg:text-base mt-4 leading-relaxed">
              Search products across Amazon, Flipkart, Croma & Reliance simultaneously with real-time price alerts and automated comparisons.
            </p>
          </div>

          <div className="relative z-10 my-6 flex justify-center">
            <img 
              src={A} 
              alt="Shopping Automation" 
              className="w-72 lg:w-84 drop-shadow-2xl hover:scale-105 transition-transform duration-500" 
            />
          </div>

          <div className="relative z-10 flex items-center justify-between text-xs text-purple-200/70 pt-4 border-t border-white/10">
            <span>✓ Multi-store Aggregation</span>
            <span>✓ Live Price History</span>
            <span>✓ Instant Alerts</span>
          </div>
        </div>

        {/* Right Authentication Form Section */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign in to manage price alerts and smart comparisons
            </p>
          </div>

          {/* Quick Demo Helper */}
          <div className="mb-5 p-3 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-medium">
              <FaBolt className="text-amber-500" />
              <span>Quick Test Access:</span>
            </div>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin("Mohan Teja", "mohan.teja@gmail.com")}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs shadow-sm transition cursor-pointer"
            >
              Mohan Teja (Demo)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Email / Password Sign In Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute top-4 left-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" 
                />
                Remember me
              </label>
              <Link 
                to="/forgot-password" 
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider directly down of the Sign In button */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-3 text-xs uppercase font-bold text-gray-400">OR CONTINUE WITH</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Google Authentication Button placed DOWN of the button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-200 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer hover:border-indigo-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account?
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-bold ml-1.5 hover:underline">
              Create Free Account
            </Link>
          </p>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-center">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 px-3.5 py-1.5 rounded-xl transition"
            >
              <FaShieldAlt className="text-purple-500" />
              <span>Switch to Admin Portal</span> →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. REGISTER COMPONENT
// ==========================================
export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
    setError("Please fill all required fields.");
    return;
  }
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  if (!formData.agreedToTerms) {
    setError("Please agree to the Terms & Conditions.");
    return;
  }

  setLoading(true);
  try {
    await registerUser(formData);
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    });
    navigate("/", { state: { registered: true, email: formData.email } });
  } catch (err) {
    setError(err.message || "Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccess={() => navigate("/home")}
      />

      <div className="relative z-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
        {/* Left Informative Panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-700 via-purple-800 to-slate-900 text-white p-10 lg:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">
              🚀 Start Saving Money
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">Join Us Today</h1>
            <p className="text-purple-100/80 text-sm lg:text-base mt-4 leading-relaxed">
              Create your account to unlock automated price tracking, deal alerts, and instant multi-platform comparison tools.
            </p>
          </div>

          <div className="relative z-10 my-6 flex justify-center">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Join Platform"
              className="w-48 drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="relative z-10 text-xs text-purple-200/70 pt-4 border-t border-white/10 flex justify-between">
            <span>Free Forever Tier</span>
            <span>Zero Spam Guarantee</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
          <div className="text-center md:text-left mb-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Create Account ✨
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Sign up in seconds to start tracking deals
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Mohan Teja"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute top-4 left-3 text-gray-400 text-xs" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-9 pr-9 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                  Confirm
                </label>
                <div className="relative">
                  <FaLock className="absolute top-4 left-3 text-gray-400 text-xs" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-9 pr-9 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-4 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirm ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                required
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span>I agree to the Terms of Service & Privacy Policy</span>
            </label>

            {/* Primary Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider directly down of the Sign Up button */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-3 text-xs uppercase font-bold text-gray-400">OR REGISTER WITH</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Google Authentication Button placed DOWN of the Sign Up button */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 bg-white dark:bg-slate-800/60 text-gray-700 dark:text-gray-200 py-3.5 px-4 rounded-2xl flex items-center justify-center gap-3 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer hover:border-indigo-200 group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?
            <Link to="/" className="text-indigo-600 dark:text-indigo-400 font-bold ml-1.5 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import ForgotPasswordComponent from "./ForgotPassword";

// ==========================================
// 3. FORGOT PASSWORD COMPONENT
// ==========================================
export function ForgotPassword() {
  return <ForgotPasswordComponent />;
}

// ==========================================
// 4. LOGOUT COMPONENT
// ==========================================
export function Logout() {
  const navigate = useNavigate();
  const [logoutState, setLogoutState] = useState("confirm");

  const handleConfirmLogout = () => {
    setLogoutState("logging_out");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setTimeout(() => {
      setLogoutState("logged_out");
    }, 1200);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      <div className="relative z-10 bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden max-w-md w-full p-8 text-center">
        {logoutState === "confirm" && (
          <div className="space-y-6 py-2 animate-fadeIn">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 rounded-full mx-auto flex items-center justify-center shadow-md">
              <FiAlertTriangle className="text-indigo-600 dark:text-indigo-400 text-3xl stroke-[2] animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Confirm Sign Out
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 leading-relaxed">
                Are you sure you want to end your active session?
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="w-1/2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {logoutState === "logging_out" && (
          <div className="space-y-6 py-6 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
              <FiLogOut className="text-indigo-600 dark:text-indigo-400 text-2xl animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Signing Out...</h2>
              <p className="text-xs text-gray-400 mt-1">Clearing local sessions and secure tokens</p>
            </div>
          </div>
        )}

        {logoutState === "logged_out" && (
          <div className="space-y-6 py-4 animate-fadeIn">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-50">
              <FiCheckCircle className="text-emerald-500 text-4xl stroke-[1.8] animate-bounce" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Signed Out Successfully
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">
                You have been safely disconnected from your account.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer shadow-lg shadow-indigo-200"
            >
              Sign In Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;