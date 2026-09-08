
import React, { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
  useLocation,
} from "react-router-dom";

import { FaShieldAlt, FaArrowLeft, FaRedoAlt } from "react-icons/fa";
import { FiCheck, FiAlertCircle } from "react-icons/fi";

import ParticleBackground from "../Components/ParticleBackground";

import {
  verifyResetOtp,
  requestPasswordReset,
} from "../utils/api";

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // EMAIL
  // =========================================================

  const emailParam =
    searchParams.get("email") ||
    location.state?.email ||
    "";

  const [email] = useState(emailParam);

  // =========================================================
  // OTP - 4 DIGITS
  // =========================================================

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
  ]);

  // =========================================================
  // STATES
  // =========================================================

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  // 2 minutes = 120 seconds
  const [timer, setTimer] = useState(120);

  const [canResend, setCanResend] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const otpInputRefs = useRef([]);

  // =========================================================
  // AUTO FOCUS FIRST OTP INPUT
  // =========================================================

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, []);

  // =========================================================
  // 2 MINUTE COUNTDOWN
  // =========================================================

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // =========================================================
  // FORMAT TIMER
  // =========================================================
  // 120 -> 2:00
  // 119 -> 1:59
  // 60  -> 1:00
  // 10  -> 0:10
  // =========================================================

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================================================
  // HANDLE OTP INPUT
  // =========================================================

  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    // Keep only one digit
    newOtp[index] = value.substring(
      value.length - 1
    );

    setOtp(newOtp);

    // Move to next OTP box
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // =========================================================
  // HANDLE BACKSPACE
  // =========================================================

  const handleOtpKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // =========================================================
  // HANDLE PASTE
  // =========================================================

  const handleOtpPaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim();

    // Accept exactly 4 digits
    if (/^\d{4}$/.test(pasted)) {
      const digits = pasted.split("");

      setOtp(digits);

      // Focus last box
      otpInputRefs.current[3]?.focus();

      setErrorMessage("");
    } else {
      setErrorMessage(
        "Please paste a valid 4-digit OTP."
      );
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const fullOtp = otp.join("");

    // OTP must contain exactly 4 digits
    if (fullOtp.length !== 4) {
      setErrorMessage(
        "Please enter the complete 4-digit verification code."
      );

      return;
    }

    setErrorMessage("");

    setLoading(true);

    try {
      // Send OTP to backend
      const data = await verifyResetOtp({
        email,
        otp: fullOtp,
      });

      // Backend should return resetToken
      navigate("/reset-password", {
        state: {
          email,
          resetToken: data.resetToken,
        },
      });

    } catch (err) {
      setErrorMessage(
        err.message ||
          "Invalid or expired code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOtp = async () => {
    // Prevent multiple clicks
    if (resending) {
      return;
    }

    setErrorMessage("");

    setResending(true);

    try {
      // =====================================================
      // REQUEST A NEW OTP
      // =====================================================
      // Backend should:
      // 1. Generate a new OTP
      // 2. Save it in MongoDB
      // 3. Send it through Nodemailer
      // =====================================================

      await requestPasswordReset(email);

      // Clear old OTP
      setOtp([
        "",
        "",
        "",
        "",
      ]);

      // Restart 2-minute timer
      setTimer(120);

      // Disable resend button
      setCanResend(false);

      // Focus first OTP box
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);

    } catch (err) {
      setErrorMessage(
        err.message ||
          "Could not resend OTP. Please try again."
      );
    } finally {
      setResending(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-[100dvh] w-full relative flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-4 sm:p-6 overflow-hidden">

      {/* Particle Background */}
      <ParticleBackground />

      <div className="relative z-10 w-full max-w-4xl bg-white/95 dark:bg-slate-900/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden grid md:grid-cols-12 transition-all">

        {/* =====================================================
            LEFT COLUMN
        ====================================================== */}

        <div className="hidden md:flex md:col-span-5 flex-col justify-between bg-gradient-to-br from-purple-700 via-indigo-800 to-slate-900 text-white p-8 lg:p-10 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

          <div>

            {/* Security Badge */}

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 dark:bg-slate-900/10 dark:bg-slate-900 backdrop-blur-md border border-white/15 text-xs font-semibold text-purple-200 mb-6">

              <FaShieldAlt className="text-purple-300" />

              Security Verification

            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              Product Search
            </h1>

            <h2 className="text-xl font-medium text-purple-200 mt-1">
              Automation Security
            </h2>

            <p className="mt-4 text-sm text-purple-100/80 leading-relaxed">
              We've dispatched a 4-digit confirmation code.
              Please enter it below to verify your identity.
            </p>

          </div>

          {/* =================================================
              STEPPER
          ================================================== */}

          <div className="my-8 space-y-4">

            {/* Step 1 */}

            <div className="flex items-center gap-3 text-xs font-semibold text-emerald-300">

              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-emerald-500 border-emerald-400 text-white">

                <FiCheck className="text-sm stroke-[3]" />

              </div>

              <span>
                1. Enter Account Email
              </span>

            </div>

            {/* Step 2 */}

            <div className="flex items-center gap-3 text-xs font-bold text-white">

              <div className="w-7 h-7 rounded-full flex items-center justify-center bg-white/20 dark:bg-slate-900/20 dark:bg-slate-900 border-2 border-white ring-2 ring-purple-300/50">

                2

              </div>

              <span>
                2. Verify 4-Digit OTP
              </span>

            </div>

            {/* Step 3 */}

            <div className="flex items-center gap-3 text-xs font-semibold text-white/40">

              <div className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 text-white/40">

                3

              </div>

              <span>
                3. Set New Password
              </span>

            </div>

          </div>

          <div className="text-[11px] text-purple-200/60 flex items-center gap-2">

            <span>
              256-bit SSL Encrypted Connection
            </span>

          </div>

        </div>

        {/* =====================================================
            RIGHT COLUMN
        ====================================================== */}

        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">

          {/* Navigation */}

          <div className="flex items-center justify-between mb-4">

            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-400 transition cursor-pointer"
            >

              <FaArrowLeft className="text-[10px]" />

              Change Email

            </Link>

            <Link
              to="/"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Back to Login
            </Link>

          </div>

          {/* Error Message */}

          {errorMessage && (

            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-fadeIn">

              <FiAlertCircle className="text-rose-500 text-base shrink-0" />

              <span>
                {errorMessage}
              </span>

            </div>

          )}

          <div className="space-y-6 animate-fadeIn">

            {/* Heading */}

            <div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Enter Verification Code 📩
              </h2>

              <p className="text-sm text-gray-500 dark:text-slate-400 dark:text-gray-400 mt-2">

                We've sent a 4-digit code to{" "}

                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {email}
                </span>

                .

              </p>

            </div>

            {/* =================================================
                OTP FORM
            ================================================== */}

            <form
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >

              <div>

                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 text-center">

                  4-Digit Security Code

                </label>

                {/* OTP BOXES */}

                <div
                  className="flex justify-center gap-3 max-w-sm mx-auto"
                  onPaste={handleOtpPaste}
                >

                  {otp.map((digit, index) => (

                    <input
                      key={index}

                      ref={(el) =>
                        (otpInputRefs.current[index] = el)
                      }

                      type="text"

                      inputMode="numeric"

                      maxLength="1"

                      value={digit}

                      onChange={(e) =>
                        handleOtpChange(
                          index,
                          e.target.value
                        )
                      }

                      onKeyDown={(e) =>
                        handleOtpKeyDown(index, e)
                      }

                      className="w-14 h-16 text-center text-2xl font-bold rounded-xl border border-gray-200 dark:border-slate-800 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-950/50 dark:bg-slate-950/50 dark:bg-slate-900/50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-inner"

                    />

                  ))}

                </div>

              </div>

              {/* =================================================
                  VERIFY BUTTON
              ================================================== */}

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

            {/* =================================================
                RESEND SECTION
            ================================================== */}

            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-slate-400 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">

              {/* Change Email */}

              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password")
                }
                className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >

                Change Email

              </button>

              {/* =================================================
                  RESEND BUTTON / TIMER
              ================================================== */}

              {canResend ? (

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resending}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer disabled:opacity-60"
                >

                  <FaRedoAlt className="text-[10px]" />

                  {resending
                    ? "Sending..."
                    : "Resend Code"}

                </button>

              ) : (

                <span>

                  Resend in{" "}

                  <span className="font-bold text-gray-700 dark:text-gray-300">

                    {formatTime(timer)}

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

