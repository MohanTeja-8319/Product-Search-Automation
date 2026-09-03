import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { getInitialTheme, toggleTheme } from "../utils/themeHelper";

export default function ThemeToggle({ className = "", compact = false }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const handleThemeChange = (e) => {
      if (e.detail && e.detail.theme) {
        setTheme(e.detail.theme);
      }
    };
    window.addEventListener("theme-change", handleThemeChange);
    return () => window.removeEventListener("theme-change", handleThemeChange);
  }, []);

  const handleToggle = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer font-bold text-xs shadow-xs shrink-0 ${
        isDark
          ? "bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 hover:border-slate-600"
          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300"
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle theme mode"
    >
      {isDark ? (
        <>
          <FiSun className="text-amber-400 text-sm animate-spin-slow shrink-0" />
          {!compact && <span className="hidden sm:inline">Light Mode</span>}
        </>
      ) : (
        <>
          <FiMoon className="text-indigo-600 text-sm shrink-0" />
          {!compact && <span className="hidden sm:inline">Dark Mode</span>}
        </>
      )}
    </button>
  );
}
