import React from "react";
import { FiInbox, FiSearch, FiRefreshCw } from "react-icons/fi";

export function EmptyState({
  title = "No data found",
  description = "There are no records matching your current filter criteria.",
  icon: Icon = FiInbox,
  actionText,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-2xl bg-white border border-dashed border-slate-200">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3 shadow-xs">
        <Icon className="text-2xl" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors shadow-xs"
        >
          <FiRefreshCw className="text-xs" />
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
