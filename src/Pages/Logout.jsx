import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiLock, FiLogOut, FiAlertTriangle } from "react-icons/fi";

const Logout = () => {
  const navigate = useNavigate();
  // States: "confirm" | "logging_out" | "logged_out"
  const [logoutState, setLogoutState] = useState("confirm");

  const handleConfirmLogout = () => {
    setLogoutState("logging_out");

    // Clear any authentication tokens if present in localStorage or sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();

    setTimeout(() => {
      setLogoutState("logged_out");
    }, 1800);
  };

  const handleCancel = () => {
    // Navigate back to the home page
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 p-5">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 md:p-10 text-center relative">
        
        {/* Soft Background Accent Circles */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-indigo-50 rounded-full -z-10 animate-pulse"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-50 rounded-full -z-10 animate-pulse"></div>

        {logoutState === "confirm" && (
          <div className="space-y-6 py-4">
            {/* Warning Circle Icon */}
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-full mx-auto flex items-center justify-center shadow-md">
              <FiAlertTriangle className="text-indigo-600 text-3xl stroke-[2] animate-bounce" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Confirm Logout
              </h2>
              <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                Are you sure you want to sign out of <span className="font-bold text-indigo-600">PriceScout</span>? You will need to log back in to access your wishlist and alerts.
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleCancel}
                className="w-full sm:w-1/2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl text-sm transition duration-200 cursor-pointer"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="w-full sm:w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl text-sm transition duration-200 cursor-pointer shadow-lg shadow-indigo-100"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        )}

        {logoutState === "logging_out" && (
          <div className="space-y-6 py-6">
            {/* Spinning Loader */}
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin"></div>
              <FiLogOut className="text-indigo-600 text-2xl animate-pulse" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">Signing Out</h2>
              <p className="text-gray-400 text-sm font-semibold mt-2">
                Securing your session and signing out...
              </p>
            </div>
          </div>
        )}

        {logoutState === "logged_out" && (
          <div className="space-y-6 py-4">
            {/* Success Checked Icon */}
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-50 animate-bounce">
              <FiCheckCircle className="text-emerald-500 text-4xl stroke-[1.8]" />
            </div>

            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Logged Out
              </h2>
              <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                Thank you for using <span className="font-bold text-indigo-600">PriceScout</span>. Your session has been ended securely.
              </p>
            </div>

            {/* Security Tip Banner */}
            <div className="bg-indigo-50/50 border border-indigo-100/40 rounded-2xl p-4 text-left flex items-start gap-3">
              <FiLock className="text-indigo-600 text-lg shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-snug">Security Tip</h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5 leading-normal">
                  To protect your account details and clear cached data, we recommend closing this browser tab now.
                </p>
              </div>
            </div>

            {/* Log Back In Button */}
            <button
              onClick={() => navigate("/")}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl text-sm transition duration-200 cursor-pointer shadow-lg shadow-indigo-100"
            >
              Sign In Again
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Logout;
