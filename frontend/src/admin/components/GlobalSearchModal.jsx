import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiUser,
  FiPackage,
  FiActivity,
  FiServer,
  FiArrowRight,
  FiFileText
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { users, products, searches, automationJobs } = useAdminData();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Results
  const matchedUsers = trimmed
    ? users.filter(
        (u) =>
          u.name.toLowerCase().includes(trimmed) ||
          u.email.toLowerCase().includes(trimmed) ||
          u.id.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedProducts = trimmed
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(trimmed) ||
          p.category.toLowerCase().includes(trimmed) ||
          p.id.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedSearches = trimmed
    ? searches.filter(
        (s) =>
          s.query.toLowerCase().includes(trimmed) ||
          s.userName.toLowerCase().includes(trimmed) ||
          s.id.toLowerCase().includes(trimmed)
      ).slice(0, 3)
    : [];

  const matchedJobs = trimmed
    ? automationJobs.filter(
        (j) =>
          j.jobId.toLowerCase().includes(trimmed) ||
          j.sourceWebsite.toLowerCase().includes(trimmed) ||
          j.searchId.toLowerCase().includes(trimmed)
      ).slice(0, 2)
    : [];

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  const navShortcuts = [
    { label: "Dashboard", path: "/admin/dashboard", icon: FiActivity },
    { label: "User Management", path: "/admin/users", icon: FiUser },
    { label: "Products Catalog", path: "/admin/products", icon: FiPackage },
    { label: "Search History", path: "/admin/searches", icon: FiSearch },
    { label: "Automation Jobs", path: "/admin/automation", icon: FiServer },
    { label: "Source Connectors", path: "/admin/sources", icon: FiServer },
    { label: "System Logs", path: "/admin/logs", icon: FiFileText }
  ];

  const totalResults = matchedUsers.length + matchedProducts.length + matchedSearches.length + matchedJobs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Search Palette */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 z-10 overflow-hidden animate-scaleUp">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FiSearch className="text-slate-400 text-lg mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users, products, search queries, automation jobs..."
            className="w-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400 p-1 mr-1"
            >
              <FiX className="text-sm" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {trimmed && totalResults === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matches found for <strong className="text-slate-600 dark:text-slate-400">"{query}"</strong>
            </div>
          )}

          {/* Matched Users */}
          {matchedUsers.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Users
              </div>
              <div className="space-y-1">
                {matchedUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleSelect(`/admin/users/${u.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {u.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.email} • {u.id}</div>
                      </div>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-xs" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Products
              </div>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/admin/products/${p.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div className="max-w-md truncate">
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ₹{p.price.toLocaleString()} • {p.sourceWebsite} • {p.id}
                        </div>
                      </div>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-xs" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Searches */}
          {matchedSearches.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Searches
              </div>
              <div className="space-y-1">
                {matchedSearches.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/admin/searches/${s.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                        <FiSearch />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          "{s.query}"
                        </div>
                        <div className="text-[11px] text-slate-400">
                          by {s.userName} • {s.dateTime}
                        </div>
                      </div>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-xs" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Automation Jobs */}
          {matchedJobs.length > 0 && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Automation Jobs
              </div>
              <div className="space-y-1">
                {matchedJobs.map((j) => (
                  <button
                    key={j.jobId}
                    onClick={() => handleSelect(`/admin/automation`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-bold">
                        <FiServer />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {j.jobId} — {j.sourceWebsite}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Status: {j.status} • Search: {j.searchId}
                        </div>
                      </div>
                    </div>
                    <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-xs" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Navigation Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
              Admin Sections
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {navShortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleSelect(item.path)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Icon className="text-slate-400 text-sm" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with mouse or Tab</span>
          <span className="font-mono text-slate-500 dark:text-slate-400">Product Search Automation Admin</span>
        </div>
      </div>
    </div>
  );
}

export default GlobalSearchModal;
