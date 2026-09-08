import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiCheckCircle,
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiCheck
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";

export function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, markAllNotificationsAsRead, markNotificationAsRead } = useAdminData();
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "error":
        return <FiAlertCircle className="text-rose-500 text-base" />;
      case "warning":
        return <FiAlertTriangle className="text-amber-500 text-base" />;
      case "success":
        return <FiCheckCircle className="text-emerald-500 text-base" />;
      case "info":
      default:
        return <FiInfo className="text-indigo-500 text-base" />;
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-scaleUp"
    >
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-950/70 dark:bg-slate-950">
        <div className="flex items-center gap-2">
          <FiBell className="text-indigo-600 dark:text-indigo-400 text-base" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">System Alerts</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
          >
            <FiCheck className="text-xs" /> Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No system notifications
          </div>
        ) : (
          notifications.map((notif) => (
            <Link
              key={notif.id}
              to={notif.link}
              onClick={() => {
                markNotificationAsRead(notif.id);
                onClose();
              }}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors block ${
                !notif.read ? "bg-indigo-50/30 dark:bg-indigo-950/30" : ""
              }`}
            >
              <div className="mt-0.5 flex-shrink-0 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className={`text-xs font-bold truncate ${!notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                    {notif.title}
                  </h5>
                  <span className="text-[10px] text-slate-400 flex-shrink-0">{notif.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-indigo-600 self-center flex-shrink-0"></span>
              )}
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/admin/logs"
          onClick={onClose}
          className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          View All System Logs →
        </Link>
      </div>
    </div>
  );
}

export default NotificationDropdown;
