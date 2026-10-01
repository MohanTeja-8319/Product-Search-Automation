import React, { useState, useEffect } from "react";
import {
  Activity,
  Play,
  RotateCcw,
  Square,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  RefreshCw,
  Terminal,
} from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAdminToast } from "../context/AdminToastContext";
import { API_BASE_URL } from "../../utils/api";

export default function AdminAutomation() {
  const { addToast } = useAdminToast();
  const [jobs, setJobs] = useState([]);
  const [selectedLogsJob, setSelectedLogsJob] = useState(null);
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [newJobSource, setNewJobSource] = useState("Amazon India");
  const [newJobType, setNewJobType] = useState("Price & Variant Update");

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/jobs`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d) => ({
            jobId: d.id,
            sourceWebsite: d.source,
            type: d.type,
            startTime: d.started,
            duration: d.duration,
            status: d.status,
            resultsCollected: 24,
            logs: (d.logs || []).map((l) => ({
              time: l.split(" - ")[0] || "10:00:00",
              text: l.split(" - ")[1] || l,
              type: l.toLowerCase().includes("error") || l.toLowerCase().includes("failed") ? "error" : "info",
            })),
          }));
          setJobs(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const handleRunJob = (e) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toTimeString().split(" ")[0];
    const newId = `JOB-${Math.floor(1000 + Math.random() * 9000)}`;

    const newJob = {
      jobId: newId,
      sourceWebsite: newJobSource,
      type: newJobType,
      startTime: timeStr,
      duration: "Running",
      status: "Running",
      resultsCollected: 0,
      logs: [
        { time: timeStr, text: `Job manually triggered by administrator`, type: "info" },
        { time: timeStr, text: `Connecting to ${newJobSource} endpoints...`, type: "info" },
      ],
    };

    setJobs((prev) => [newJob, ...prev]);
    addToast(`Job ${newId} started on ${newJobSource}.`, "info");
    setRunModalOpen(false);

    // Auto complete after 3s
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.jobId === newId
            ? {
                ...j,
                status: "Completed",
                duration: "2.8s",
                resultsCollected: 32,
                logs: [
                  ...j.logs,
                  { time: new Date().toTimeString().split(" ")[0], text: "Data parsed and normalized successfully.", type: "success" },
                ],
              }
            : j
        )
      );
      addToast(`Job ${newId} completed successfully!`, "success");
    }, 3000);
  };

  const handleRetryJob = (jobId) => {
    addToast(`Retrying job ${jobId}...`, "info");
    setJobs((prev) =>
      prev.map((j) =>
        j.jobId === jobId
          ? {
              ...j,
              status: "Running",
              duration: "Running",
              logs: [
                ...j.logs,
                { time: new Date().toTimeString().split(" ")[0], text: "Retry initiated by admin.", type: "info" },
              ],
            }
          : j
      )
    );

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.jobId === jobId
            ? {
                ...j,
                status: "Completed",
                duration: "3.1s",
                resultsCollected: 28,
                logs: [
                  ...j.logs,
                  { time: new Date().toTimeString().split(" ")[0], text: "Connection recovered. Scraping completed.", type: "success" },
                ],
              }
            : j
        )
      );
      addToast(`Job ${jobId} finished with status Completed.`, "success");
    }, 2500);
  };

  const handleCancelJob = (jobId) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.jobId === jobId
          ? {
              ...j,
              status: "Failed",
              duration: "Cancelled",
              logs: [
                ...j.logs,
                { time: new Date().toTimeString().split(" ")[0], text: "Job cancelled by administrator.", type: "error" },
              ],
            }
          : j
      )
    );
    addToast(`Job ${jobId} was cancelled.`, "warning");
  };

  const columns = [
    {
      header: "Job ID",
      key: "jobId",
      sortable: true,
      render: (row) => (
        <span style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--adm-accent, #38bdf8)" }}>
          {row.jobId}
        </span>
      ),
    },
    {
      header: "Source",
      key: "sourceWebsite",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>{row.sourceWebsite}</span>
      ),
    },
    {
      header: "Type",
      key: "type",
      sortable: true,
      render: (row) => <span style={{ color: "var(--adm-muted, #888888)" }}>{row.type}</span>,
    },
    {
      header: "Started",
      key: "startTime",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 13 }}>{row.startTime}</span>
      ),
    },
    {
      header: "Duration",
      key: "duration",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 13, fontWeight: 500 }}>
          {row.duration}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button
            onClick={() => setSelectedLogsJob(row)}
            title="View Logs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 12px",
              borderRadius: 9999,
              border: "1px solid var(--adm-border, #222222)",
              backgroundColor: "transparent",
              color: "var(--adm-text, #f4efe8)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Terminal size={13} /> View Logs
          </button>

          {row.status === "Failed" && (
            <button
              onClick={() => handleRetryJob(row.jobId)}
              title="Retry Job"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 9999,
                border: "1px solid rgba(56, 189, 248, 0.3)",
                backgroundColor: "rgba(56, 189, 248, 0.1)",
                color: "#38bdf8",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <RotateCcw size={13} /> Retry
            </button>
          )}

          {row.status === "Running" && (
            <button
              onClick={() => handleCancelJob(row.jobId)}
              title="Cancel Job"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 9999,
                border: "1px solid rgba(239, 68, 68, 0.3)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#f87171",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Square size={13} /> Cancel
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0, letterSpacing: "-0.02em" }}>
            Automation & Scraping Jobs
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Manage product scraping queues, live data collection, and source updates.
          </p>
        </div>

        <button
          onClick={() => setRunModalOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 20px",
            borderRadius: 9999,
            backgroundColor: "#ffffff",
            color: "#0a0a0a",
            fontSize: 13.5,
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(255,255,255,0.15)",
          }}
          className="adm-btn-primary"
        >
          <Play size={15} fill="#0a0a0a" /> Run New Job
        </button>
      </div>

      {/* Jobs Table */}
      <DataTable
        columns={columns}
        data={jobs}
        searchKey="jobId"
        searchPlaceholder="Search jobs by ID or source..."
      />

      {/* Job Log Viewer Modal */}
      {selectedLogsJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setSelectedLogsJob(null)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 680,
              backgroundColor: "#0F172A",
              color: "#F8FAFC",
              borderRadius: 16,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
              border: "1px solid #334155",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #1E293B",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#1E293B",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Terminal size={18} color="#10B981" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", fontFamily: "monospace" }}>
                  Execution Logs — {selectedLogsJob.jobId} ({selectedLogsJob.sourceWebsite})
                </span>
              </div>

              <button
                onClick={() => setSelectedLogsJob(null)}
                style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Log Stream Body */}
            <div
              className="adm-code-logs"
              style={{
                padding: 20,
                maxHeight: 400,
                overflowY: "auto",
                backgroundColor: "#0F172A",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {selectedLogsJob.logs && selectedLogsJob.logs.length > 0 ? (
                selectedLogsJob.logs.map((log, index) => {
                  const isError = log.type === "error" || (typeof log === "string" && log.includes("Error"));
                  const isSuccess = log.type === "success" || (typeof log === "string" && log.includes("successfully"));

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        gap: 12,
                        color: isError ? "#F87171" : isSuccess ? "#34D399" : "#CBD5E1",
                        backgroundColor: isError ? "rgba(239, 68, 68, 0.1)" : "transparent",
                        padding: isError ? "4px 8px" : "2px 0",
                        borderRadius: 4,
                      }}
                    >
                      <span style={{ color: "#64748B", flexShrink: 0 }}>
                        {log.time || "10:32:14"}
                      </span>
                      <span>{log.text || log}</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ color: "#94A3B8" }}>No detailed log entries recorded for this job.</div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                backgroundColor: "#1E293B",
                borderTop: "1px solid #334155",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "#94A3B8" }}>
                Status: <strong style={{ color: selectedLogsJob.status === "Completed" ? "#34D399" : "#F87171" }}>{selectedLogsJob.status}</strong>
              </span>

              <button
                onClick={() => setSelectedLogsJob(null)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 6,
                  border: "1px solid #475569",
                  backgroundColor: "#334155",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Job Modal */}
      {runModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            padding: 20,
          }}
          onClick={() => setRunModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 460,
              backgroundColor: "var(--adm-card, #111111)",
              borderRadius: 16,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--adm-border, #222222)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--adm-border, #222222)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0 }}>
                Trigger Scraping / Sync Job
              </h3>
              <button onClick={() => setRunModalOpen(false)} style={{ background: "none", border: "none", color: "var(--adm-muted, #888888)", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRunJob} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block", marginBottom: 6 }}>
                  Target Store / Source
                </label>
                <select
                  value={newJobSource}
                  onChange={(e) => setNewJobSource(e.target.value)}
                  className="adm-input"
                >
                  <option value="Amazon India">Amazon India</option>
                  <option value="Flipkart">Flipkart</option>
                  <option value="Myntra Fashion">Myntra Fashion</option>
                  <option value="Croma Electronics">Croma Electronics</option>
                  <option value="SerpAPI Crawler">SerpAPI Multi-Store Engine</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block", marginBottom: 6 }}>
                  Operation Type
                </label>
                <select
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value)}
                  className="adm-input"
                >
                  <option value="Price & Variant Update">Price & Variant Update</option>
                  <option value="Category Scrape (Mobiles)">Category Scrape (Mobiles)</option>
                  <option value="Discount Coupon Sync">Discount Coupon Sync</option>
                  <option value="Live Search Query Cache">Live Search Query Cache</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setRunModalOpen(false)} className="adm-btn adm-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  Launch Worker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
