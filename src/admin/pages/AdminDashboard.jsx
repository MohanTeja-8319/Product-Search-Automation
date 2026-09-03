import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiPackage,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
  FiArrowRight,
  FiExternalLink,
  FiServer,
  FiDatabase,
  FiCpu,
  FiGlobe
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import StatCard from "../components/StatCard";
import SearchesPerDayChart from "../components/SearchesPerDayChart";
import SearchStatusChart from "../components/SearchStatusChart";
import StatusBadge from "../components/StatusBadge";

export function AdminDashboard() {
  const {
    stats,
    searchesPerDay,
    searchStatusBreakdown,
    systemHealth,
    searches
  } = useAdminData();

  // Show the latest 5 recent searches
  const recentSearches = searches.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time monitoring and analytics for product search automation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All 6 Scraper Nodes Active
          </span>
        </div>
      </div>

      {/* Exactly the 6 Required Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 1. Total Users */}
        <StatCard
          title="Total Users"
          value={stats.totalUsers.value}
          icon={FiUsers}
          supportingText={stats.totalUsers.change}
          isPositive={stats.totalUsers.isPositive}
          color="indigo"
        />

        {/* 2. Active Users */}
        <StatCard
          title="Active Users"
          value={stats.activeUsers.value}
          icon={FiUserCheck}
          supportingText={stats.activeUsers.change}
          isPositive={stats.activeUsers.isPositive}
          color="emerald"
        />

        {/* 3. Total Products */}
        <StatCard
          title="Total Products"
          value={stats.totalProducts.value}
          icon={FiPackage}
          supportingText={stats.totalProducts.change}
          isPositive={stats.totalProducts.isPositive}
          color="blue"
        />

        {/* 4. Total Searches */}
        <StatCard
          title="Total Searches"
          value={stats.totalSearches.value}
          icon={FiSearch}
          supportingText={stats.totalSearches.change}
          isPositive={stats.totalSearches.isPositive}
          color="amber"
        />

        {/* 5. Successful Searches */}
        <StatCard
          title="Successful Searches"
          value={stats.successfulSearches.value}
          icon={FiCheckCircle}
          supportingText={stats.successfulSearches.change}
          isPositive={stats.successfulSearches.isPositive}
          color="emerald"
        />

        {/* 6. Failed Searches */}
        <StatCard
          title="Failed Searches"
          value={stats.failedSearches.value}
          icon={FiAlertCircle}
          supportingText={stats.failedSearches.change}
          isPositive={stats.failedSearches.isPositive}
          color="rose"
        />
      </div>

      {/* Exactly the Two Required Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Searches Per Day (Line Chart) */}
        <div className="lg:col-span-2">
          <SearchesPerDayChart data={searchesPerDay} />
        </div>

        {/* Chart 2: Search Status (Donut Chart) */}
        <div className="lg:col-span-1">
          <SearchStatusChart breakdown={searchStatusBreakdown} />
        </div>
      </div>

      {/* Grid: Recent Searches (Table) & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Searches Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Searches</h3>
              <p className="text-xs text-slate-500 mt-0.5">Live stream of incoming user queries</p>
            </div>
            <Link
              to="/admin/searches"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              View all searches <FiArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Search Query</th>
                  <th className="px-4 py-3">Date/Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Results</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentSearches.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* User */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div className="truncate">
                          <span className="font-semibold text-slate-800 block truncate">
                            {item.userName}
                          </span>
                          <span className="text-[10px] text-slate-400 block truncate">
                            {item.userId}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Search Query */}
                    <td className="px-4 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                      "{item.query}"
                    </td>

                    {/* Date/Time */}
                    <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {item.dateTime}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Results Count */}
                    <td className="px-4 py-3.5 text-right font-bold text-slate-800">
                      {item.resultsCount}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3.5 text-center">
                      <Link
                        to={`/admin/searches/${item.id}`}
                        className="inline-flex items-center justify-center p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Search Details"
                      >
                        <FiExternalLink className="text-sm" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-center">
            <Link
              to="/admin/searches"
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600"
            >
              Showing latest {recentSearches.length} of {searches.length} logged searches
            </Link>
          </div>
        </div>

        {/* System Health Section (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FiActivity className="text-emerald-500 text-base" />
                <h3 className="text-base font-bold text-slate-900">System Health</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                100% Operational
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-2 mb-4">
              Continuous heartbeat telemetry for cluster infrastructure
            </p>

            {/* Exactly the 4 specified health indicators */}
            <div className="space-y-3">
              {/* 1. Backend API */}
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
                    <FiServer />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {systemHealth.backendApi.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Latency: {systemHealth.backendApi.latency}
                    </span>
                  </div>
                </div>
                <StatusBadge status={systemHealth.backendApi.status} size="sm" />
              </div>

              {/* 2. Database */}
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
                    <FiDatabase />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {systemHealth.database.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Ping: {systemHealth.database.latency}
                    </span>
                  </div>
                </div>
                <StatusBadge status={systemHealth.database.status} size="sm" />
              </div>

              {/* 3. Automation Service */}
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
                    <FiCpu />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {systemHealth.automationService.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {systemHealth.automationService.latency}
                    </span>
                  </div>
                </div>
                <StatusBadge status={systemHealth.automationService.status} size="sm" />
              </div>

              {/* 4. Source Websites */}
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
                    <FiGlobe />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {systemHealth.sourceWebsites.name}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {systemHealth.sourceWebsites.latency}
                    </span>
                  </div>
                </div>
                <StatusBadge status={systemHealth.sourceWebsites.status} size="sm" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Uptime: 99.98% (30d)</span>
            <Link to="/admin/logs" className="text-indigo-600 font-semibold hover:underline">
              System Logs →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
