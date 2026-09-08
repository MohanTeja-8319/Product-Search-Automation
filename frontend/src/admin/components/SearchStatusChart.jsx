import React, { useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

export function SearchStatusChart({ breakdown }) {
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const successful = breakdown?.successful || 86120;
  const failed = breakdown?.failed || 3330;
  const total = successful + failed;

  const successPercent = ((successful / total) * 100).toFixed(1);
  const failedPercent = ((failed / total) * 100).toFixed(1);

  // SVG Donut calculation
  const radius = 64;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;

  const successDash = (successful / total) * circumference;
  const failedDash = (failed / total) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
      {/* Header */}
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Search Status</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Execution health and resolution ratio</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 border border-emerald-100">
          96.3% SLA Met
        </span>
      </div>

      {/* Donut Content */}
      <div className="my-auto py-4 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* SVG Donut */}
        <div className="relative w-44 h-44 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background Circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth={strokeWidth}
            />

            {/* Successful searches slice */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={hoveredSlice === "success" ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${successDash} ${circumference}`}
              strokeDashoffset="0"
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSlice("success")}
              onMouseLeave={() => setHoveredSlice(null)}
            />

            {/* Failed searches slice */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={hoveredSlice === "failed" ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${failedDash} ${circumference}`}
              strokeDashoffset={-successDash}
              strokeLinecap="round"
              className="transition-all duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredSlice("failed")}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          </svg>

          {/* Center Info */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
              {hoveredSlice === "failed" ? `${failedPercent}%` : `${successPercent}%`}
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">
              {hoveredSlice === "failed" ? "Failure Rate" : "Success Rate"}
            </span>
          </div>
        </div>

        {/* Breakdown Details */}
        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {/* Successful card */}
          <div
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              hoveredSlice === "success"
                ? "bg-emerald-50/70 dark:bg-emerald-950/70 border-emerald-200 shadow-sm"
                : "bg-slate-50/60 dark:bg-slate-950/60 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
            onMouseEnter={() => setHoveredSlice("success")}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Successful Searches</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {successful.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{successPercent}% of total</span>
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <FiCheckCircle className="text-[10px]" /> Optimal
              </span>
            </div>
          </div>

          {/* Failed card */}
          <div
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              hoveredSlice === "failed"
                ? "bg-rose-50/70 dark:bg-rose-950/70 border-rose-200 shadow-sm"
                : "bg-slate-50/60 dark:bg-slate-950/60 dark:bg-slate-900/60 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950"
            }`}
            onMouseEnter={() => setHoveredSlice("failed")}
            onMouseLeave={() => setHoveredSlice(null)}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Failed Searches</span>
              </div>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {failed.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>{failedPercent}% of total</span>
              <span className="text-rose-600 font-medium flex items-center gap-1">
                <FiXCircle className="text-[10px]" /> Needs review
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Total Processed: <strong className="text-slate-800 dark:text-slate-100">{total.toLocaleString()}</strong></span>
        <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">
          View Failure Logs →
        </span>
      </div>
    </div>
  );
}

export default SearchStatusChart;
