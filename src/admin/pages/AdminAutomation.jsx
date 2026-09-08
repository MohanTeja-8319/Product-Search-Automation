import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiCpu,
  FiRotateCw,
  FiStopCircle,
  FiAlertTriangle,
  FiX,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiActivity
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";

export function AdminAutomation() {
  const { automationJobs, retryJob, stopJob } = useAdminData();

  const [jobToStop, setJobToStop] = useState(null);
  const [errorJobModal, setErrorJobModal] = useState(null);
  const [isStopping, setIsStopping] = useState(false);

  const handleStopConfirm = () => {
    if (!jobToStop) return;
    setIsStopping(true);
    setTimeout(() => {
      stopJob(jobToStop.jobId);
      setJobToStop(null);
      setIsStopping(false);
    }, 400);
  };

  const columns = [
    {
      header: "Job ID",
      key: "jobId",
      sortKey: "jobId",
      width: "w-28",
      render: (item) => (
        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
          {item.jobId}
        </span>
      )
    },
    {
      header: "Search ID",
      key: "searchId",
      sortKey: "searchId",
      render: (item) => (
        <Link
          to={`/admin/searches/${item.searchId}`}
          className="font-mono text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
        >
          {item.searchId}
        </Link>
      )
    },
    {
      header: "Source Website",
      key: "sourceWebsite",
      sortKey: "sourceWebsite",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <FiGlobe className="text-xs" />
          {item.sourceWebsite}
        </span>
      )
    },
    {
      header: "Start Time",
      key: "startTime",
      sortKey: "startTime",
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{item.startTime}</span>
      )
    },
    {
      header: "End Time",
      key: "endTime",
      sortKey: "endTime",
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
          {item.endTime || "In Progress"}
        </span>
      )
    },
    {
      header: "Duration",
      key: "duration",
      sortKey: "duration",
      render: (item) => (
        <span className="text-slate-600 dark:text-slate-400 font-mono text-xs">{item.duration}</span>
      )
    },
    {
      header: "Progress",
      key: "progress",
      sortKey: "progress",
      render: (item) => (
        <div className="w-32">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            <span>{item.progress}%</span>
            {item.status === "Running" && (
              <span className="text-indigo-600 dark:text-indigo-400 animate-pulse text-[10px]">Processing</span>
            )}
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.status === "Completed"
                  ? "bg-emerald-500"
                  : item.status === "Failed"
                  ? "bg-rose-500"
                  : "bg-indigo-600"
              }`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      )
    },
    {
      header: "Status",
      key: "status",
      sortKey: "status",
      render: (item) => <StatusBadge status={item.status} size="sm" />
    },
    {
      header: "Results Collected",
      key: "resultsCollected",
      sortKey: "resultsCollected",
      align: "center",
      render: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs">
          {item.resultsCollected}
        </span>
      )
    },
    {
      header: "Actions",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* Retry Failed Job */}
          {item.status === "Failed" && (
            <button
              type="button"
              onClick={() => retryJob(item.jobId)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 rounded-lg transition-colors"
              title="Retry Failed Scraper Job"
            >
              <FiRotateCw className="text-xs" />
              <span>Retry</span>
            </button>
          )}

          {/* View Error */}
          {item.status === "Failed" && item.errorMessage && (
            <button
              type="button"
              onClick={() => setErrorJobModal(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 rounded-lg transition-colors"
              title="View Error Details"
            >
              <FiAlertCircle className="text-xs" />
              <span>View Error</span>
            </button>
          )}

          {/* Stop Running Job */}
          {item.status === "Running" && (
            <button
              type="button"
              onClick={() => setJobToStop(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 rounded-lg transition-colors"
              title="Stop Running Worker Job"
            >
              <FiStopCircle className="text-xs" />
              <span>Stop Job</span>
            </button>
          )}

          {item.status === "Completed" && (
            <span className="text-[11px] font-semibold text-emerald-600 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-100">
              Finished
            </span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Automation Jobs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Single unified table monitoring scraper tasks and worker execution
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs flex items-center gap-2">
            <FiActivity className="text-emerald-500" />
            <span>Active Worker Pool: <strong className="text-slate-900 dark:text-white">12 Nodes</strong></span>
          </div>
        </div>
      </div>

      {/* Main Single Clean Jobs Table */}
      <DataTable
        columns={columns}
        data={automationJobs}
        searchKey="jobId"
        searchPlaceholder="Search jobs by Job ID, source, or search ID..."
        filterOptions={{
          label: "Status",
          key: "status",
          options: [
            { label: "Running", value: "running" },
            { label: "Completed", value: "completed" },
            { label: "Failed", value: "failed" }
          ]
        }}
        defaultSortKey="startTime"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No automation jobs found"
        emptyDescription="No worker tasks matching your criteria are currently recorded."
      />

      {/* Stop Job Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!jobToStop}
        title="Stop Running Automation Job"
        message={`Are you sure you want to forcibly stop worker job "${jobToStop?.jobId}" targeting "${jobToStop?.sourceWebsite}"? Current progress (${jobToStop?.progress}%) will be aborted.`}
        confirmText="Stop Job"
        cancelText="Keep Running"
        variant="danger"
        isLoading={isStopping}
        onConfirm={handleStopConfirm}
        onCancel={() => setJobToStop(null)}
      />

      {/* View Error Modal */}
      {errorJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setErrorJobModal(null)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 z-10 shadow-2xl border border-slate-200 dark:border-slate-800 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600">
                <FiAlertCircle className="text-xl" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Worker Job Error Detail
                </h3>
              </div>
              <button
                onClick={() => setErrorJobModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-400 dark:text-slate-400 p-1"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Job ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{errorJobModal.jobId}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Source:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{errorJobModal.sourceWebsite}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400">Worker Node:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{errorJobModal.workerNode || "Worker-Cluster-01"}</span>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block mb-1 font-semibold">Error Message:</span>
                <div className="p-3 bg-rose-50 dark:bg-rose-950 text-rose-800 rounded-xl border border-rose-100 font-mono text-[11px] leading-relaxed">
                  {errorJobModal.errorMessage}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  retryJob(errorJobModal.jobId);
                  setErrorJobModal(null);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Retry Job Now
              </button>
              <button
                type="button"
                onClick={() => setErrorJobModal(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
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

export default AdminAutomation;
