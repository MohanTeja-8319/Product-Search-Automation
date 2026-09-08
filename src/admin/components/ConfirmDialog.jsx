import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "primary"
  onConfirm,
  onCancel,
  isLoading = false
}) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: "bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-100",
      buttonBg: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white"
    },
    warning: {
      iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100",
      buttonBg: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white"
    },
    primary: {
      iconBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-100",
      buttonBg: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white"
    }
  }[variant] || {
    iconBg: "bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-100",
    buttonBg: "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10 animate-scaleUp">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border ${variantStyles.iconBg} flex-shrink-0 mt-0.5`}>
            <FiAlertTriangle className="text-xl" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 flex items-center gap-2 ${variantStyles.buttonBg} ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
