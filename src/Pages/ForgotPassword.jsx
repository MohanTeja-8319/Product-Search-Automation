import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";
import ParticleBackground from "../Components/ParticleBackground";
import { requestPasswordReset } from "../utils/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid registered email address.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      navigate("/verify-otp", {
        state: { email: email.trim() },
      });
    } catch (err) {
      setErrorMessage(err.message || "Could not send verification code. Please try again.");
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
              <FaShieldAlt className="text-purple-300" /> Secure Recovery
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product Search</h1>
            <h2 className="text-xl font-medium text-purple-200 mt-1">Automation Security</h2>
            <p className="mt-4 text-sm text-purple-100/80 leading-relaxed">
              Enter your email to receive a secure 4-digit one-time verification code and regain access to your account.
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="my-8 space-y-4">
            <div className="flex items-center gap-3 text-xs font-bold text-white">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 border-2 border-white ring-2 ring-purple-300/50">
                1
              </div>
              <span>1. Enter Account Email</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-white/40">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 text-white/40">
                2
              </div>
              <span>2. Verify 
                4-Digit OTP</span>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold text-white/40">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 text-white/40">
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
          {/* Back to Login Link */}
          <div className="mb-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Back to Login
            </Link>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
              <FiAlertCircle className="text-rose-500 text-base shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Forgot Password? 🔒
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Enter your registered email address and we'll send you a 4-digit verification code on the next page.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. mohan.teja@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800/80 rounded-2xl py-3.5 pl-12 pr-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Send Verification Code →"
                )}
              </button>
            </form>

            <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
              <FaShieldAlt className="text-indigo-600 dark:text-indigo-400 text-base shrink-0 mt-0.5" />
              <span>
                For security, verification codes expire after 2 minutes. Click the button above to proceed to the verification code entry page.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}