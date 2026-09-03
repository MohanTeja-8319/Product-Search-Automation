import React, { useState } from "react";
import {
  FiFileText,
  FiAlertOctagon,
  FiAlertTriangle,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiEye,
  FiX,
  FiFilter,
  FiTerminal
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";

export function AdminLogs() {
  const { systemLogs, resolveLog } = useAdminData();
  const [selectedLogModal, setSelectedLogModal] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredLogs = typeFilter === "all"
    ? systemLogs
    : systemLogs.filter((log) => log.type.toLowerCase() === typeFilter.toLowerCase());

  const getSeverityBadge = (severity) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <FiAlertOctagon className="text-xs" /> Critical
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
            <FiAlertCircle className="text-xs" /> Error
          </span>
        );
      case "warning":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            <FiAlertTriangle className="text-xs" /> Warning
          </span>
        );
      case "info":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            <FiInfo className="text-xs" /> Info
          </span>
        );
    }
  };

  const columns = [
    {
      header: "Log ID",
      key: "logId",
      sortKey: "logId",
      width: "w-28",
      render: (item) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          {item.logId}
        </span>
      )
    },
    {
      header: "Type",
      key: "type",
      sortKey: "type",
      render: (item) => (
        <span className="font-semibold text-xs text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
          {item.type}
        </span>
      )
    },
    {
      header: "Message",
      key: "message",
      sortKey: "message",
      render: (item) => (
        <div className="max-w-md truncate font-medium text-slate-900 text-xs sm:text-sm">
          {item.message}
        </div>
      )
    },
    {
      header: "Source",
      key: "source",
      sortKey: "source",
      render: (item) => (
        <span className="font-mono text-xs text-slate-500">{item.source}</span>
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
      header: "Severity",
      key: "severity",
      sortKey: "severity",
      render: (item) => getSeverityBadge(item.severity)
    },
    {
      header: "Status",
      key: "status",
      sortKey: "status",
      render: (item) => <StatusBadge status={item.status} size="sm" />
    },
    {
      header: "Actions",
      align: "center",
      render: (item) => (
        <button
          type="button"
          onClick={() => setSelectedLogModal(item)}
          className="inline-flex items-center justify-center p-2 rounded-xl text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          title="View Log Details"
        >
          <FiEye className="text-sm" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            System Logs & Telemetry
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time error monitoring and exception tracking across system subsystems
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            Logged Events: <span className="text-indigo-600 font-bold">{systemLogs.length}</span>
          </div>
        </div>
      </div>

      {/* Main Logs Table */}
      <DataTable
        columns={columns}
        data={filteredLogs}
        searchKey="message"
        searchPlaceholder="Search logs by message, ID, or source..."
        filterOptions={{
          label: "Severity",
          key: "severity",
          options: [
            { label: "Critical", value: "critical" },
            { label: "Error", value: "error" },
            { label: "Warning", value: "warning" },
            { label: "Info", value: "info" }
          ]
        }}
        extraControls={
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-xs md:text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
            >
              <option value="all">All Log Types</option>
              <option value="automation error">Automation Error</option>
              <option value="api error">API Error</option>
              <option value="failed search">Failed Search</option>
              <option value="scraping error">Scraping Error</option>
              <option value="system error">System Error</option>
            </select>
            <FiFilter className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs" />
          </div>
        }
        defaultSortKey="dateTime"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No log entries found"
        emptyDescription="System healthy. No events matching the current search parameters."
      />

      {/* View Log Details Modal */}
      {selectedLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedLogModal(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-xl w-full p-6 z-10 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  <FiTerminal />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Log Event Detail
                    </h3>
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      {selectedLogModal.logId}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {selectedLogModal.dateTime}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLogModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Log Type:</span>
                <span className="font-semibold text-slate-900">{selectedLogModal.type}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Source Worker / Service:</span>
                <span className="font-mono text-slate-700">{selectedLogModal.source}</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Severity:</span>
                <div>{getSeverityBadge(selectedLogModal.severity)}</div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Resolution Status:</span>
                <StatusBadge status={selectedLogModal.status} size="sm" />
              </div>

              <div>
                <span className="text-slate-500 block mb-1 font-semibold">Event Message:</span>
                <div className="p-3 bg-slate-50 text-slate-800 rounded-xl border border-slate-200 font-medium text-xs leading-relaxed">
                  {selectedLogModal.message}
                </div>
              </div>

              {selectedLogModal.stackTrace && (
                <div>
                  <span className="text-slate-500 block mb-1 font-semibold">Exception Stack Trace:</span>
                  <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-36">
                    {selectedLogModal.stackTrace}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center pt-3 border-t border-slate-100">
              {selectedLogModal.status !== "Resolved" ? (
                <button
                  type="button"
                  onClick={() => {
                    resolveLog(selectedLogModal.logId);
                    setSelectedLogModal((prev) => ({ ...prev, status: "Resolved" }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
                >
                  <FiCheckCircle className="text-sm" /> Mark Resolved
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <FiCheckCircle /> Resolved
                </span>
              )}

              <button
                type="button"
                onClick={() => setSelectedLogModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLogs;
