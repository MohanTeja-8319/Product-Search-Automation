import React, { createContext, useContext, useState, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

const AdminToastContext = createContext();

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AdminToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none max-w-md w-full px-4">
        {toasts.map((toast) => {
          const typeStyles = {
            success: "bg-slate-900 text-white border-emerald-500/50 shadow-emerald-950/20",
            error: "bg-slate-900 text-white border-rose-500/50 shadow-rose-950/20",
            warning: "bg-slate-900 text-white border-amber-500/50 shadow-amber-950/20",
            info: "bg-slate-900 text-white border-indigo-500/50 shadow-indigo-950/20"
          }[toast.type] || "bg-slate-900 text-white border-slate-700";

          const icon = {
            success: <FiCheckCircle className="text-emerald-400 text-xl flex-shrink-0" />,
            error: <FiAlertCircle className="text-rose-400 text-xl flex-shrink-0" />,
            warning: <FiAlertTriangle className="text-amber-400 text-xl flex-shrink-0" />,
            info: <FiInfo className="text-indigo-400 text-xl flex-shrink-0" />
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 ${typeStyles}`}
              role="alert"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                aria-label="Close notification"
              >
                <FiX className="text-base" />
              </button>
            </div>
          );
        })}
      </div>
    </AdminToastContext.Provider>
  );
}

export function useAdminToast() {
  const context = useContext(AdminToastContext);
  if (!context) {
    throw new Error("useAdminToast must be used within an AdminToastProvider");
  }
  return context;
}
