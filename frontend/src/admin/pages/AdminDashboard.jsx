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
import StatusBadge from "../components/StatusBadge";

export function AdminDashboard() {
 const {
 stats,
 systemHealth,
 users,
 searches
 } = useAdminData();

 
 const recentSearches = searches.slice(0, 5);

 return (
 <div className="space-y-6">
 {}
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
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
 <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
 All 6 Scraper Nodes Active
 </span>
 </div>
 </div>

 {}
 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
 {}
 <StatCard
 title="Total Users"
 value={stats.totalUsers.value}
 icon={FiUsers}
 supportingText={stats.totalUsers.change}
 isPositive={stats.totalUsers.isPositive}
 color="indigo"
 />

 {}
 <StatCard
 title="Active Users"
 value={stats.activeUsers.value}
 icon={FiUserCheck}
 supportingText={stats.activeUsers.change}
 isPositive={stats.activeUsers.isPositive}
 color="emerald"
 />

 {}
 <StatCard
 title="Total Products"
 value={stats.totalProducts.value}
 icon={FiPackage}
 supportingText={stats.totalProducts.change}
 isPositive={stats.totalProducts.isPositive}
 color="blue"
 />

 {}
 <StatCard
 title="Total Searches"
 value={stats.totalSearches.value}
 icon={FiSearch}
 supportingText={stats.totalSearches.change}
 isPositive={stats.totalSearches.isPositive}
 color="amber"
 />

 {}
 <StatCard
 title="Active Price Alerts"
 value={stats.successfulSearches.value}
 icon={FiCheckCircle}
 supportingText={stats.successfulSearches.change}
 isPositive={stats.successfulSearches.isPositive}
 color="emerald"
 />

 {}
 <StatCard
 title="Scraper Health"
 value={stats.activeScrapers.value}
 icon={FiAlertCircle}
 supportingText={stats.activeScrapers.change}
 isPositive={stats.activeScrapers.isPositive}
 color="rose"
 />
 </div>

 {}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
 {}
 <div className="lg:col-span-2 bg-white rounded-[16px] border border-slate-200/90 shadow-soft flex flex-col">
 <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
 <div>
 <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
 <FiUsers className="text-indigo-600" />
 Recent Users
 </h3>
 <p className="text-xs text-slate-500 mt-0.5">
 Latest users registered on the platform.
 </p>
 </div>
 <Link
 to="/admin/users"
 className="px-3 py-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-[10px] transition-colors"
 >
 View All Users
 </Link>
 </div>

 <div className="flex-1 overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-slate-50/50 border-b border-slate-200 ">
 <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">User</th>
 <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Email</th>
 <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Joined</th>
 <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Status</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 ">
 {users.slice(0, 5).map((user) => (
 <tr key={user.id} className="hover:bg-slate-50 :bg-slate-950/50 transition-colors">
 <td className="px-4 py-3.5">
 <div className="flex items-center gap-3">
 <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full bg-slate-200" />
 <span className="font-bold text-slate-900 text-sm">{user.name}</span>
 </div>
 </td>
 <td className="px-4 py-3.5 font-medium text-slate-600 text-xs">
 {user.email}
 </td>
 <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
 {user.joinedDate}
 </td>
 <td className="px-4 py-3.5 whitespace-nowrap text-right">
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
 Active
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>

 {}
 <div className="bg-white rounded-[16px] border border-slate-200/90 shadow-soft p-5 flex flex-col justify-between">
 <div>
 <div className="flex items-center justify-between pb-3 border-b border-slate-200 ">
 <div className="flex items-center gap-2">
 <FiActivity className="text-emerald-600 text-base" />
 <h3 className="text-base font-bold text-slate-900 ">System Health</h3>
 </div>
 <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
 100% Operational
 </span>
 </div>

 <p className="text-xs text-slate-500 mt-2 mb-4">
 Continuous heartbeat telemetry for cluster infrastructure
 </p>

 {}
 <div className="space-y-3">
 {}
 <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/60 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 transition-colors flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-[10px] bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
 <FiServer />
 </div>
 <div>
 <h4 className="text-xs font-bold text-slate-800 ">
 {systemHealth.backendApi.name}
 </h4>
 <span className="text-[10px] text-slate-400">
 Latency: {systemHealth.backendApi.latency}
 </span>
 </div>
 </div>
 <StatusBadge status={systemHealth.backendApi.status} size="sm" />
 </div>

 {}
 <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/60 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 transition-colors flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-[10px] bg-blue-50 text-blue-600 flex items-center justify-center text-sm">
 <FiDatabase />
 </div>
 <div>
 <h4 className="text-xs font-bold text-slate-800 ">
 {systemHealth.database.name}
 </h4>
 <span className="text-[10px] text-slate-400">
 Ping: {systemHealth.database.latency}
 </span>
 </div>
 </div>
 <StatusBadge status={systemHealth.database.status} size="sm" />
 </div>

 {}
 <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/60 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 transition-colors flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-[10px] bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
 <FiCpu />
 </div>
 <div>
 <h4 className="text-xs font-bold text-slate-800 ">
 {systemHealth.automationService.name}
 </h4>
 <span className="text-[10px] text-slate-400">
 {systemHealth.automationService.latency}
 </span>
 </div>
 </div>
 <StatusBadge status={systemHealth.automationService.status} size="sm" />
 </div>

 {}
 <div className="p-3 rounded-[10px] border border-slate-200 bg-slate-50/60 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 transition-colors flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-8 h-8 rounded-[10px] bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
 <FiGlobe />
 </div>
 <div>
 <h4 className="text-xs font-bold text-slate-800 ">
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

 <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
 <span>Uptime: 99.98% (30d)</span>
 
 </div>
 </div>
 </div>
 </div>
 );
}

export default AdminDashboard;
