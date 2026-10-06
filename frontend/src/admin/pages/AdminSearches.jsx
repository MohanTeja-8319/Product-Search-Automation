import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Eye, Clock, CheckCircle2, Globe } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";

import { API_BASE_URL } from "../../utils/api";

export default function AdminSearches() {
  const { searches: contextSearches = [] } = useAdminData();
  const navigate = useNavigate();
  const [liveSearches, setLiveSearches] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/searches`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setLiveSearches(data);
        }
      })
      .catch((err) => console.error("Error fetching live searches:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const data = liveSearches.length > 0 ? liveSearches : contextSearches;

  const columns = [
    {
      header: "Search Query",
      key: "query",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              backgroundColor: "rgba(56, 189, 248, 0.1)",
              color: "var(--adm-accent, #38bdf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Search size={15} />
          </div>
          <div>
            <span style={{ fontWeight: 700, color: "var(--adm-text, #f4efe8)", fontSize: 13.5 }}>
              {row.query}
            </span>
            <div style={{ fontSize: 11, color: "var(--adm-muted, #888888)" }}>ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "User",
      key: "user",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 600, color: "var(--adm-text, #f4efe8)", fontSize: 13 }}>
          {row.user || row.userName || "Guest"}
        </span>
      ),
    },
    {
      header: "Platforms Searched",
      key: "platforms",
      sortable: true,
      render: (row) => (
        <div>
          <span style={{ fontWeight: 700, color: "var(--adm-accent, #38bdf8)", fontSize: 13 }}>
            {row.platforms || 4} platforms
          </span>
          <div style={{ fontSize: 11, color: "var(--adm-muted, #888888)" }}>
            {row.platformList || "Amazon, Flipkart, BlinkIt, Zepto, Swiggy, BigBasket, Myntra, Nykaa"}
          </div>
        </div>
      ),
    },
    {
      header: "Products Found",
      key: "productsFound",
      sortable: true,
      align: "center",
      render: (row) => (
        <span style={{ fontWeight: 800, color: "var(--adm-text, #f4efe8)", fontSize: 13.5 }}>
          {row.productsFound ?? 0} items
        </span>
      ),
    },
    {
      header: "Date & Time",
      key: "date",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 12.5 }}>
          {row.date || row.timestamp || "Today"}
        </span>
      ),
    },
    {
      header: "Duration",
      key: "duration",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 12.5, fontWeight: 500 }}>
          {row.duration || "1.4s"}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "Completed"} />,
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => (
        <button
          onClick={() => navigate(`/admin/searches/${row.id}`)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "6px 14px",
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
          <Eye size={13} /> View
        </button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0, letterSpacing: "-0.02em" }}>
            Live Search Telemetry & Queries
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Track user search velocity, multi-store response latency, and match rates.
          </p>
        </div>

        <div style={{ fontSize: 13, color: "var(--adm-muted, #888888)", backgroundColor: "var(--adm-card, #111111)", padding: "7px 16px", borderRadius: 9999, border: "1px solid var(--adm-border, #222222)", fontWeight: 600 }}>
          Today's Queries: <strong style={{ color: "var(--adm-text, #f4efe8)" }}>4,892 searches</strong>
        </div>
      </div>

      {/* Searches Table */}
      <DataTable
        columns={columns}
        data={data}
        searchKey="query"
        searchPlaceholder="Search queries or user name..."
      />
    </div>
  );
}
