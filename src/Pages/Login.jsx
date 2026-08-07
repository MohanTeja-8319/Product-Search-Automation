import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle, FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { FiCheckCircle, FiLogOut, FiAlertTriangle } from "react-icons/fi";
import A from "../assets/ab.png";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/Home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-12">
          <h1 className="text-5xl font-bold mb-5">Product Search</h1>
          <h2 className="text-3xl font-semibold mb-4">Automation</h2>
          <p className="text-center text-lg leading-8">
            Search products from multiple shopping websites and compare prices instantly.
          </p>
          <img src={A} alt="Shopping" className="w-95 mt-10" />
        </div>

        <div className="p-10">
          <h2 className="text-4xl font-bold text-center text-gray-800">Welcome Back 👋</h2>
          <p className="text-center text-gray-500 mt-2 mb-8">Login to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  className="w-full border rounded-xl p-4 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-5 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Remember Me
              </label>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition">
              Login
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border"></div>
            <span className="px-4 text-gray-400">OR</span>
            <div className="flex-1 border"></div>
          </div>

          <button className="w-full border rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-100 transition">
            <FaGoogle className="text-[#4285F4] text-xl" />
            Continue with Google
          </button>

          <p className="text-center mt-8">
            Don't have an account?
            <Link to="/register" className="text-blue-600 font-semibold ml-2 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Please fill all fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    alert("Registration Successful!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 flex items-center justify-center p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full grid md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 to-blue-900 text-white p-10">
          <h1 className="text-5xl font-bold mb-4">Join Us 🚀</h1>
          <p className="text-center text-lg leading-8">
            Create your account and start comparing products from multiple e-commerce websites.
          </p>
          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="Register"
            className="w-56 mt-10"
          />
        </div>

        <div className="p-10">
          <h2 className="text-4xl font-bold text-center text-gray-800">Create Account</h2>
          <p className="text-center text-gray-500 mt-2 mb-8">Register to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaUser className="absolute top-5 left-4 text-gray-500" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-5 left-4 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-5 left-4 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-5 right-4 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <FaLock className="absolute top-5 left-4 text-gray-500" />
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute top-5 right-4 text-gray-500"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required />
              I agree to the Terms & Conditions
            </label>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-semibold text-lg transition"
            >
              Register
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border"></div>
            <span className="px-4 text-gray-400">OR</span>
            <div className="flex-1 border"></div>
          </div>

          <button className="w-full border py-4 rounded-xl flex justify-center items-center gap-3 hover:bg-gray-100 transition">
            <FaGoogle className="text-red-500 text-xl" />
            Continue with Google
          </button>

          <p className="text-center mt-8">
            Already have an account?
            <Link to="/" className="text-indigo-600 font-semibold ml-2 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    alert("Password reset link has been sent to your email.");
    setEmail("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
          <p className="text-gray-500 mt-3">
            Enter your registered email address. We'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <FaEnvelope className="absolute top-4 left-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

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
    }, 1800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 md:p-10 text-center relative">
        {logoutState === "confirm" && (
          <div className="space-y-6 py-4">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full mx-auto flex items-center justify-center shadow-md">
              <FiAlertTriangle className="text-indigo-600 text-3xl stroke-[2] animate-bounce" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Confirm Logout</h2>
              <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                Are you sure you want to sign out?
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate("/home")}
                className="w-full sm:w-1/2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition cursor-pointer shadow-lg shadow-indigo-100"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        )}

        {logoutState === "logging_out" && (
          <div className="space-y-6 py-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
              <FiLogOut className="text-indigo-600 text-2xl animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Signing Out</h2>
            </div>
          </div>
        )}

        {logoutState === "logged_out" && (
          <div className="space-y-6 py-4">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-50 animate-bounce">
              <FiCheckCircle className="text-emerald-500 text-4xl stroke-[1.8]" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Logged Out</h2>
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-sm transition cursor-pointer shadow-lg shadow-indigo-100"
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
