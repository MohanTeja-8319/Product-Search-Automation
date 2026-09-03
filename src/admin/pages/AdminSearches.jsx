import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiClock,
  FiCalendar,
  FiFilter,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";

export function AdminSearches() {
  const { searches } = useAdminData();
  const [dateRangeFilter, setDateRangeFilter] = useState("all");

  const columns = [
    {
      header: "Search ID",
      key: "id",
      sortKey: "id",
      width: "w-28",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-500">
          {item.id}
        </span>
      )
    },
    {
      header: "User",
      key: "userName",
      sortKey: "userName",
      render: (item) => (
        <div className="flex items-center gap-2.5">
          <img
            src={item.userAvatar}
            alt={item.userName}
            className="w-7 h-7 rounded-full object-cover border border-slate-200"
          />
          <div>
            <Link
              to={`/admin/users/${item.userId}`}
              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-xs"
            >
              {item.userName}
            </Link>
            <span className="text-[10px] text-slate-400 font-mono">{item.userId}</span>
          </div>
        </div>
      )
    },
    {
      header: "Search Query",
      key: "query",
      sortKey: "query",
      render: (item) => (
        <div className="max-w-xs truncate">
          <Link
            to={`/admin/searches/${item.id}`}
            className="font-semibold text-slate-800 hover:text-indigo-600 transition-colors block truncate"
          >
            "{item.query}"
          </Link>
        </div>
      )
    },
    {
      header: "Date/Time",
      key: "dateTime",
      sortKey: "dateTime",
      render: (item) => (
        <span className="text-slate-500 text-xs whitespace-nowrap">{item.dateTime}</span>
      )
    },
    {
      header: "Status",
      key: "status",
      sortKey: "status",
      render: (item) => <StatusBadge status={item.status} size="sm" />
    },
    {
      header: "Results Count",
      key: "resultsCount",
      sortKey: "resultsCount",
      align: "right",
      render: (item) => (
        <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
          {item.resultsCount}
        </span>
      )
    },
    {
      header: "Duration",
      key: "duration",
      sortKey: "duration",
      render: (item) => (
        <span className="text-slate-500 font-mono text-xs">{item.duration}</span>
      )
    },
    {
      header: "Actions",
      align: "center",
      render: (item) => (
        <Link
          to={`/admin/searches/${item.id}`}
          className="inline-flex items-center justify-center p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          title="View Search Results"
        >
          <FiEye className="text-sm" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Search Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor real-time aggregation queries executed across e-commerce sources
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            Total Queries: <span className="text-indigo-600 font-bold">{searches.length}</span>
          </div>
        </div>
      </div>

      {/* Main Searches Table */}
      <DataTable
        columns={columns}
        data={searches}
        searchKey="query"
        searchPlaceholder="Search by user or product query..."
        filterOptions={{
          label: "Status",
          key: "status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Running", value: "running" },
            { label: "Successful", value: "successful" },
            { label: "Failed", value: "failed" }
          ]
        }}
        defaultSortKey="dateTime"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No search records found"
        emptyDescription="No search executions match your specified keyword or status filter."
      />
    </div>
  );
}

export default AdminSearches;
