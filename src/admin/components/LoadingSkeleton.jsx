import React from "react";

export function TableSkeleton({ rows = 5, columns = 6 }) {
  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm animate-pulse">
      {/* Header controls skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
        <div className="h-10 w-72 bg-slate-200 rounded-xl"></div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="h-10 w-32 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
        </div>
      </div>

      {/* Table header skeleton */}
      <div className="grid grid-cols-6 gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded"></div>
        ))}
      </div>

      {/* Table rows skeleton */}
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="grid grid-cols-6 gap-4 py-4 items-center">
            {Array.from({ length: columns }).map((_, c) => (
              <div
                key={c}
                className={`h-4 bg-slate-100 dark:bg-slate-800 rounded ${c === 0 ? "w-4/5 font-semibold" : c === columns - 1 ? "w-1/2" : "w-3/4"}`}
              ></div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-40 bg-slate-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-slate-200 rounded"></div>
            <div className="h-8 w-8 bg-slate-200 rounded-lg"></div>
          </div>
          <div>
            <div className="h-7 w-24 bg-slate-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 h-80 flex flex-col justify-between">
        <div className="flex justify-between">
          <div className="h-5 w-40 bg-slate-200 rounded"></div>
          <div className="h-7 w-32 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 h-80 flex flex-col justify-between">
        <div className="h-5 w-32 bg-slate-200 rounded"></div>
        <div className="h-40 w-40 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto"></div>
        <div className="h-8 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}

export function DetailsSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-200"></div>
        <div className="space-y-2 flex-1">
          <div className="h-6 w-60 bg-slate-200 rounded"></div>
          <div className="h-4 w-40 bg-slate-100 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
      </div>
      <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
    </div>
  );
}

export default {
  TableSkeleton,
  StatCardsSkeleton,
  ChartsSkeleton,
  DetailsSkeleton
};
