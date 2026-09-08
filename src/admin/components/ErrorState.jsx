import React from "react";
import { FiAlertOctagon, FiRotateCw } from "react-icons/fi";

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this section. Please try again.",
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 shadow-sm my-4">
      <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-100 flex items-center justify-center text-rose-500 mb-3 shadow-xs">
        <FiAlertOctagon className="text-2xl" />
      </div>
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-sm active:scale-95"
        >
          <FiRotateCw className="text-xs" />
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
