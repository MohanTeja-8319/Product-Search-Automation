import React, { useState } from "react";
import {
  FiGlobe,
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiToggleLeft,
  FiToggleRight,
  FiInfo,
  FiX,
  FiActivity,
  FiShield
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";

export function AdminSources() {
  const { sources, toggleSourceStatus } = useAdminData();
  const [selectedSourceModal, setSelectedSourceModal] = useState(null);

  const columns = [
    {
      header: "Website Name",
      key: "name",
      sortKey: "name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
            {item.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs sm:text-sm">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">{item.id}</span>
          </div>
        </div>
      )
    },
    {
      header: "Website URL",
      key: "websiteUrl",
      sortKey: "websiteUrl",
      render: (item) => (
        <a
          href={item.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline font-mono"
        >
          <span>{item.websiteUrl}</span>
          <FiExternalLink className="text-[10px]" />
        </a>
      )
    },
    {
      header: "Status",
      key: "status",
      sortKey: "status",
      render: (item) => <StatusBadge status={item.status} size="sm" />
    },
    {
      header: "Last Successful Run",
      key: "lastSuccessfulRun",
      sortKey: "lastSuccessfulRun",
      render: (item) => (
        <span className="text-slate-500 text-xs whitespace-nowrap">
          {item.lastSuccessfulRun}
        </span>
      )
    },
    {
      header: "Products Collected",
      key: "productsCollected",
      sortKey: "productsCollected",
      align: "right",
      render: (item) => (
        <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg text-xs">
          {item.productsCollected.toLocaleString()}
        </span>
      )
    },
    {
      header: "Actions",
      align: "center",
      render: (item) => (
        <div className="flex items-center justify-center gap-2">
          {/* Enable / Disable Action */}
          <button
            type="button"
            onClick={() => toggleSourceStatus(item.id)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              item.status === "Enabled"
                ? "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
            }`}
            title={item.status === "Enabled" ? "Disable Connector" : "Enable Connector"}
          >
            {item.status === "Enabled" ? (
              <>
                <FiToggleRight className="text-sm text-emerald-600" />
                <span>Disable</span>
              </>
            ) : (
              <>
                <FiToggleLeft className="text-sm text-slate-400" />
                <span>Enable</span>
              </>
            )}
          </button>

          {/* View Status Modal */}
          <button
            type="button"
            onClick={() => setSelectedSourceModal(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="View Source Status"
          >
            <FiInfo className="text-base" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Source Connectors
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Supported e-commerce platforms and automated scraper integration endpoints
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            Operational Sources:{" "}
            <span className="text-emerald-600 font-bold">
              {sources.filter((s) => s.status === "Enabled").length} / {sources.length} Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Sources Table */}
      <DataTable
        columns={columns}
        data={sources}
        searchKey="name"
        searchPlaceholder="Search e-commerce sources..."
        filterOptions={{
          label: "Status",
          key: "status",
          options: [
            { label: "Enabled", value: "enabled" },
            { label: "Disabled", value: "disabled" },
            { label: "Error", value: "error" }
          ]
        }}
        defaultSortKey="productsCollected"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No sources found"
        emptyDescription="No e-commerce connectors match the specified filter."
      />

      {/* View Status Modal */}
      {selectedSourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setSelectedSourceModal(null)}
          />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 z-10 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  <FiGlobe />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedSourceModal.name} Connector
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedSourceModal.websiteUrl}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSourceModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Connector Status:</span>
                <StatusBadge status={selectedSourceModal.status} size="sm" />
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Connector Engine:</span>
                <span className="font-mono font-semibold text-slate-800">
                  {selectedSourceModal.connectorVersion || "v3.0.0"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Average Scrape Latency:</span>
                <span className="font-bold text-slate-800">
                  {selectedSourceModal.avgLatency || "1.2s"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Health Reliability:</span>
                <span className="font-bold text-emerald-600">
                  {selectedSourceModal.healthRate || "99.0%"}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Total Products Indexed:</span>
                <span className="font-bold text-slate-800">
                  {selectedSourceModal.productsCollected.toLocaleString()}
                </span>
              </div>

              {selectedSourceModal.errorDetail && (
                <div className="pt-2">
                  <span className="text-rose-600 font-semibold block mb-1">
                    Connector Error:
                  </span>
                  <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl text-[11px]">
                    {selectedSourceModal.errorDetail}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  toggleSourceStatus(selectedSourceModal.id);
                  setSelectedSourceModal((prev) => ({
                    ...prev,
                    status: prev.status === "Enabled" ? "Disabled" : "Enabled"
                  }));
                }}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                {selectedSourceModal.status === "Enabled" ? "Disable Connector" : "Enable Connector"}
              </button>

              <button
                type="button"
                onClick={() => setSelectedSourceModal(null)}
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

export default AdminSources;
