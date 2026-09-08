import React from "react";

export function StatCard({ title, value, icon: Icon, supportingText, isPositive, color = "indigo" }) {
  const colorThemes = {
    indigo: {
      iconBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-100",
      accent: "hover:border-indigo-200"
    },
    emerald: {
      iconBg: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border-emerald-100",
      accent: "hover:border-emerald-200"
    },
    blue: {
      iconBg: "bg-blue-50 dark:bg-blue-950 text-blue-600 border-blue-100",
      accent: "hover:border-blue-200"
    },
    amber: {
      iconBg: "bg-amber-50 dark:bg-amber-950 text-amber-600 border-amber-100",
      accent: "hover:border-amber-200"
    },
    rose: {
      iconBg: "bg-rose-50 dark:bg-rose-950 text-rose-600 border-rose-100",
      accent: "hover:border-rose-200"
    },
    slate: {
      iconBg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800",
      accent: "hover:border-slate-300 dark:hover:border-slate-700"
    }
  }[color] || {
    iconBg: "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border-indigo-100",
    accent: "hover:border-indigo-200"
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all duration-200 hover:shadow-md ${colorThemes.accent}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-tight">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorThemes.iconBg} transition-transform`}>
            <Icon className="text-lg" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>

        {supportingText && (
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span
              className={`font-medium ${
                isPositive === true
                  ? "text-emerald-600"
                  : isPositive === false
                  ? "text-rose-600"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {supportingText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
