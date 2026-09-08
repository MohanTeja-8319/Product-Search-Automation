import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiClock,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiToggleLeft,
  FiToggleRight
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import StatusBadge from "../components/StatusBadge";

export function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, toggleUserStatus } = useAdminData();

  const user = getUserById(id);

  if (!user) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto mb-3 text-xl">
          <FiAlertCircle />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">User Not Found</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-5">
          No account found matching user ID <strong className="font-mono">{id}</strong>.
        </p>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
        >
          <FiArrowLeft /> Back to Users List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Back Navigation & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
        >
          <FiArrowLeft /> Back to Users
        </button>

        <button
          type="button"
          onClick={() => toggleUserStatus(user.id)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shadow-xs ${
            user.status === "Active"
              ? "bg-rose-50 dark:bg-rose-950 text-rose-700 border-rose-200 hover:bg-rose-100"
              : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          }`}
        >
          {user.status === "Active" ? <FiToggleRight className="text-base" /> : <FiToggleLeft className="text-base" />}
          {user.status === "Active" ? "Deactivate User" : "Activate User"}
        </button>
      </div>

      {/* User Information Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 dark:border-slate-800 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-800 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                <StatusBadge status={user.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{user.email}</p>
              <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                <span className="font-mono font-semibold text-slate-600 dark:text-slate-400">{user.id}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FiMapPin className="text-xs" /> {user.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Metadata Attributes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {/* Registration Date */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Registration Date
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <FiCalendar className="text-indigo-600 dark:text-indigo-400" />
              <span>{user.registrationDate}</span>
            </div>
          </div>

          {/* Last Login / Active */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Last Login
            </span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <FiClock className="text-indigo-600 dark:text-indigo-400" />
              <span>{user.lastActive}</span>
            </div>
          </div>

          {/* Total Searches */}
          <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/50 border border-indigo-100/60">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block mb-1">
              Total Searches
            </span>
            <div className="flex items-center gap-2 text-base font-extrabold text-indigo-900 dark:text-indigo-400">
              <FiSearch className="text-indigo-600 dark:text-indigo-400" />
              <span>{user.totalSearches}</span>
            </div>
          </div>

          {/* Success vs Failure Searches Breakdown */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Search Health
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <FiCheckCircle className="text-[11px]" /> {user.successfulSearches || user.totalSearches - 4} OK
              </span>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-rose-600 flex items-center gap-1">
                <FiAlertCircle className="text-[11px]" /> {user.failedSearches || 4} Failed
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Recent Searches */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">User's Recent Searches</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical queries triggered by {user.name}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {user.searches?.length || 0} Recorded Queries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-950/75 dark:bg-slate-950 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="px-4 py-3">Search Query</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Results Count</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(user.searches || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-xs text-slate-400">
                    No recent searches recorded for this user.
                  </td>
                </tr>
              ) : (
                user.searches.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-950 dark:hover:bg-slate-800 transition-colors">
                    <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white max-w-sm truncate">
                      "{s.query}"
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {s.date}
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold text-slate-800 dark:text-slate-100">
                      {s.resultsCount}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <Link
                        to={`/admin/searches/${s.id || "SCH-8821"}`}
                        className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 rounded-lg transition-colors"
                        title="View Search Detail"
                      >
                        <FiExternalLink className="text-sm" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminUserDetails;
