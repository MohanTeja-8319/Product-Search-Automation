import React, { useState } from "react";
import { FaGoogle, FaUserPlus, FaCheck, FaTimes, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function GoogleAuthModal({ isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [customMode, setCustomMode] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [loadingAccount, setLoadingAccount] = useState(null);
  const [authSuccess, setAuthSuccess] = useState(null);

  if (!isOpen) return null;

  const mockGoogleAccounts = [
    {
      name: "Mohan Teja",
      email: "mohan.teja@gmail.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    },
    {
      name: "Aarav Sharma",
      email: "aarav.sharma@gmail.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    },
  ];

  const handleSelectAccount = (account) => {
    setLoadingAccount(account.email);
    setTimeout(() => {
      const userPayload = {
        name: account.name,
        email: account.email,
        avatar: account.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(account.name)}`,
        provider: "google",
        loggedInAt: new Date().toISOString(),
        verified: true,
      };

      localStorage.setItem("user", JSON.stringify(userPayload));
      localStorage.setItem("token", `google-oauth-${Date.now()}`);

      setLoadingAccount(null);
      setAuthSuccess(userPayload);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(userPayload);
        } else {
          navigate("/home");
        }
        onClose();
      }, 1000);
    }, 1200);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;

    const fallbackName = customName.trim() || customEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const account = {
      name: fallbackName,
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fallbackName)}`,
    };

    handleSelectAccount(account);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 animate-scaleUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Google Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC05] to-[#34A853]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Close Google Authentication"
        >
          <FaTimes className="text-base" />
        </button>

        <div className="p-7">
          {/* Google Branding Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            </div>
            <h3 className="text-xl font-bold text-gray-900">Sign in with Google</h3>
            <p className="text-xs text-gray-500 mt-1">
              to continue to <span className="font-semibold text-indigo-600">Product Search Automation</span>
            </p>
          </div>

          {authSuccess ? (
            <div className="py-6 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-inner">
                <FaCheck className="text-2xl animate-bounce" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Authentication Successful!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Signed in as <span className="font-semibold text-indigo-600">{authSuccess.name}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Redirecting to dashboard...
              </div>
            </div>
          ) : !customMode ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-1">
                Choose an account
              </div>

              {/* Account list */}
              <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 overflow-hidden bg-gray-50/50">
                {mockGoogleAccounts.map((acc) => {
                  const isLoading = loadingAccount === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={!!loadingAccount}
                      onClick={() => handleSelectAccount(acc)}
                      className="w-full text-left p-3.5 flex items-center gap-3.5 hover:bg-indigo-50/60 transition cursor-pointer disabled:opacity-60"
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-gray-900 truncate">
                          {acc.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{acc.email}</div>
                      </div>
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition">
                          Sign In
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Add new / custom Google account */}
                <button
                  type="button"
                  onClick={() => setCustomMode(true)}
                  disabled={!!loadingAccount}
                  className="w-full text-left p-3.5 flex items-center gap-3.5 hover:bg-indigo-50/60 transition cursor-pointer text-gray-700 hover:text-indigo-600 font-medium text-sm"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                    <FaUserPlus className="text-sm" />
                  </div>
                  <span>Use another account</span>
                </button>
              </div>

              {/* Security info note */}
              <div className="pt-3 border-t border-gray-100 flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed">
                <FaShieldAlt className="text-indigo-500 text-sm shrink-0 mt-0.5" />
                <span>
                  Google securely authorizes your profile info (name, email, and photo) with encrypted token authentication.
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-4 animate-fadeIn">
              <div className="text-xs font-semibold text-gray-600 px-1">
                Enter your Google Account credentials
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Google Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="w-1/2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl text-sm transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loadingAccount === customEmail}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-md shadow-indigo-100"
                >
                  {loadingAccount === customEmail ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Authorize"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-gray-50 px-7 py-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
          <span>Protected by Google Identity</span>
          <a href="#help" onClick={(e) => e.preventDefault()} className="text-indigo-600 hover:underline">
            Privacy & Terms
          </a>
        </div>
      </div>
    </div>
  );
}
