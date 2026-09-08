import React, { useState } from "react";
import { FiX, FiShield, FiMail, FiCalendar, FiClock, FiKey, FiCheckCircle } from "react-icons/fi";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminToast } from "../context/AdminToastContext";

export function AdminProfileModal({ isOpen, onClose }) {
  const { adminUser, updateProfile } = useAdminAuth();
  const { addToast } = useAdminToast();

  const [name, setName] = useState(adminUser?.name || "Mohan Teja");
  const [email, setEmail] = useState(adminUser?.email || "admin@productautomation.io");
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email });
    setIsEditing(false);
    addToast("Admin profile updated successfully", "success");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-scaleUp overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-300 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-center gap-4 pt-2">
          <div className="relative">
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"}
              alt={adminUser?.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-600 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{adminUser?.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200">
                ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{adminUser?.role}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{adminUser?.department}</p>
          </div>
        </div>

        {/* Profile Info / Edit Form */}
        <div className="mt-6">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <FiMail className="text-slate-400 text-sm" /> Email Address
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{adminUser?.email}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <FiShield className="text-slate-400 text-sm" /> Access Level
                </span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle className="text-xs" /> {adminUser?.accessLevel}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800/60 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <FiClock className="text-slate-400 text-sm" /> Last Active Session
                </span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{adminUser?.lastLogin}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <FiKey className="text-slate-400 text-sm" /> Two-Factor Authentication
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                  ENFORCED
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {!isEditing && (
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400">
              Admin Node ID: <strong className="font-mono text-slate-600 dark:text-slate-400">AUTH-NODE-01</strong>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 rounded-xl transition-colors"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProfileModal;
