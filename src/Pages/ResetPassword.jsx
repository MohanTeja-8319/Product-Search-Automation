import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft, FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { FiCheck, FiX, FiAlertCircle } from "react-icons/fi";
import ParticleBackground from "../Components/ParticleBackground";
import { resetPassword } from "../utils/api";

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
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Criteria verification
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const getStrengthScore = () => {
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    return score;
  };

  const strengthScore = getStrengthScore();
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-red-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!hasMinLength) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }
    if (!resetToken) {
      setErrorMessage("Your reset session has expired. Please start over.");
      return;
    }

    setErrorMessage("");
    setLoading(true);

    try {
      await resetPassword({
        resetToken,
        newPassword: password,
        confirmPassword,
      });
      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(err.message || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">
      {/* Particle Animation Background */}
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid md:grid-cols-12 transition-all">
        {/* Left Informative Column */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">
              <FaShieldAlt className="text-purple-300" /> Secure Password Reset
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product Search</h1>
            <h2 className="text-xl font-medium text-purple-200 mt-1">Automation Security</h2>
            <p className="mt-4 text-sm text-purple-100/80 leading-relaxed">
              Create a new secure password{email ? <> for <span className="text-white font-bold">{email}</span></> : ""}.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="my-8 space-y-4">
            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-300">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-500 border-emerald-400 text-white">
                <FiCheck className="text-sm stroke-[3]" />
              </div>
              <span>1. Enter Account Email</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-300">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-500 border-emerald-400 text-white">
                <FiCheck className="text-sm stroke-[3]" />
              </div>
              <span>2. Verify 4-Digit OTP</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-white">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 border-2 border-white ring-2 ring-purple-300/50">
                3
              </div>
              <span>3. Set New Password</span>
            </div>
          </div>

          <div className="text-[11px] text-purple-200/60 flex items-center gap-2">
            <span>256-bit SSL Encrypted Connection</span>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Top Links */}
          {!isSuccess && (
            <div className="mb-4">
              <Link
                to="/verify-otp"
                state={{ email }}
                className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition cursor-pointer"
              >
                <FaArrowLeft className="text-[10px]" /> Back to Verification
              </Link>
            </div>
          )}

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
              <FiAlertCircle className="text-rose-500 text-base shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isSuccess ? (
            <div className="animate-fadeIn space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Set New Password 🔑
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Create a strong, unique password{email ? <> for <span className="font-semibold text-indigo-600 dark:text-indigo-400">{email}</span></> : ""}.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute top-4 left-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute top-4 left-4 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-12 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Live Password Strength Meter */}
                {password && (
                  <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/70 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Strength:</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">
                        {strengthLabels[Math.max(0, strengthScore - 1)] || "Too Weak"}
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-full flex-1 rounded-full transition-all ${
                            strengthScore >= level ? strengthColors[strengthScore - 1] : "bg-transparent"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Criteria Checklist */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                      <div
                        className={`flex items-center gap-1.5 ${
                          hasMinLength ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {hasMinLength ? <FiCheck /> : <FiX />} 8+ characters
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          hasUppercase ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {hasUppercase ? <FiCheck /> : <FiX />} Uppercase letter
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          hasNumber ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {hasNumber ? <FiCheck /> : <FiX />} At least 1 number
                      </div>
                      <div
                        className={`flex items-center gap-1.5 ${
                          hasSpecial ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"
                        }`}
                      >
                        {hasSpecial ? <FiCheck /> : <FiX />} Special character
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !hasMinLength || !passwordsMatch}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* SUCCESS CONFIRMATION */
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-800/80 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none">
                <FaCheckCircle className="text-emerald-500 text-4xl animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Password Reset Successfully! 🎉
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your new password has been saved. You can now sign in with your updated credentials.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 cursor-pointer"
                >
                  Sign In with New Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}