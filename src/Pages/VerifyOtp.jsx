import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { FaShieldAlt, FaArrowLeft, FaRedoAlt, FaCopy } from "react-icons/fa";
import { FiCheck, FiX, FiAlertCircle, FiZap, FiMail } from "react-icons/fi";
import ParticleBackground from "../Components/ParticleBackground";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract email from query param or state
  const emailParam = searchParams.get("email") || location.state?.email || "user@example.com";
  const [email] = useState(emailParam);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState({
    code: "482910",
    email: emailParam,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  });
  const [copied, setCopied] = useState(false);

  const otpInputRefs = useRef([]);

  // Auto focus first OTP input upon mounting
  useEffect(() => {
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);
  }, []);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle individual digit input
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto advance focus to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split("");
      setOtp(digits);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleFillDemoOtp = () => {
    setOtp(["4", "8", "2", "9", "1", "0"]);
    otpInputRefs.current[5]?.focus();
  };

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Submit OTP Verification
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Navigate to the separate Reset/New Password page
      navigate(`/reset-password?email=${encodeURIComponent(email)}&verified=true`, {
        state: { email, verified: true },
      });
    }, 700);
  };

  const handleResendOtp = () => {
    setCanResend(false);
    setTimer(45);
    setErrorMessage("");
    setOtp(["", "", "", "", "", ""]);
    setToastMessage({
      code: "482910",
      email: email,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    otpInputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">
      {/* Particle Animation Background */}
      <ParticleBackground />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-4 sm:right-8 z-50 max-w-sm w-full bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/40 animate-bounce">
          <div className="flex items-start justify-between gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <FiMail className="text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                  Verification Code Sent
                </span>
                <span className="text-[10px] text-slate-400">{toastMessage.time}</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                Sent to <span className="font-semibold text-white">{toastMessage.email}</span>
              </p>
              <div className="mt-2 p-2 bg-slate-800 rounded-lg flex items-center justify-between border border-slate-700">
                <span className="font-mono text-base font-black tracking-widest text-indigo-300">
                  {toastMessage.code}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(toastMessage.code)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <FiCheck className="text-emerald-400" /> : <FaCopy />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFillDemoOtp}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-[10px] font-bold text-white transition cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white transition cursor-pointer"
            >
              <FiX className="text-sm" />
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid md:grid-cols-12 transition-all">
        {/* Left Informative Column */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">
              <FaShieldAlt className="text-purple-300" /> Security Verification
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Product Search</h1>
            <h2 className="text-xl font-medium text-purple-200 mt-1">Automation Security</h2>
            <p className="mt-4 text-sm text-purple-100/80 leading-relaxed">
              We've dispatched a 6-digit confirmation code. Please enter it below to verify your identity.
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

            <div className="flex items-center gap-3 text-xs font-bold text-white">
              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 border-2 border-white ring-2 ring-purple-300/50">
                2
              </div>
              <span>2. Verify 6-Digit OTP</span>
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
          {/* Navigation Links */}
          <div className="flex items-center justify-between mb-4">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition cursor-pointer"
            >
              <FaArrowLeft className="text-[10px]" /> Change Email
            </Link>

            <Link
              to="/"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition"
            >
              Back to Login
            </Link>
          </div>

          {/* Error Message Toast */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">
              <FiAlertCircle className="text-rose-500 text-base shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Enter Verification Code 📩
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                We've sent a 6-digit code to{" "}
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {email}
                </span>
                .
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 text-center">
                  6-Digit Security Code
                </label>
                <div
                  className="flex justify-between gap-2 max-w-sm mx-auto"
                  onPaste={handleOtpPaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-inner"
                    />
                  ))}
                </div>
              </div>

              {/* Quick Demo Helper */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleFillDemoOtp}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  <FiZap className="text-xs text-amber-500" />
                  <span>Quick Test Code (482910)</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.99] text-white font-bold py-3.5 rounded-2xl text-sm transition shadow-lg shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Verify Code →"
                )}
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Change Email
              </button>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <FaRedoAlt className="text-[10px]" /> Resend Code
                </button>
              ) : (
                <span>
                  Resend in{" "}
                  <span className="font-bold text-gray-700 dark:text-gray-300">
                    {timer}s
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
