import React, { useState } from "react";
import {
  Star,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Filter,
  ThumbsUp,
  Store,
} from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAdminToast } from "../context/AdminToastContext";

import { API_BASE_URL } from "../../utils/api";

export default function AdminReviews() {
  const { addToast } = useAdminToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/reviews`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch((err) => console.error("Error fetching live reviews:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleStatus = (id) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const next = r.status === "Approved" ? "Flagged" : "Approved";
          addToast(`Review marked as ${next}.`, next === "Approved" ? "success" : "warning");
          return { ...r, status: next };
        }
        return r;
      })
    );
  };

  const handleDelete = (id) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast("Review removed from platform index.", "info");
  };

  const columns = [
    {
      header: "Author & Product",
      key: "author",
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 700, color: "var(--adm-text, #f4efe8)" }}>{row.author}</div>
          <div style={{ fontSize: 12, color: "var(--adm-accent, #38bdf8)", marginTop: 2 }}>{row.product}</div>
        </div>
      ),
    },
    {
      header: "Store",
      key: "store",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 600, color: "var(--adm-muted, #888888)" }}>{row.store}</span>
      ),
    },
    {
      header: "Rating",
      key: "rating",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#fbbf24", fontWeight: 700 }}>
          <Star size={14} fill="#fbbf24" color="#fbbf24" />
          <span>{row.rating}.0</span>
        </div>
      ),
    },
    {
      header: "Feedback",
      key: "comment",
      wrap: true,
      render: (row) => (
        <div style={{ maxWidth: 360 }}>
          <div style={{ fontWeight: 600, color: "var(--adm-text, #f4efe8)", fontSize: 13 }}>{row.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--adm-muted, #888888)", marginTop: 2 }}>{row.comment}</div>
        </div>
      ),
    },
    {
      header: "Sentiment",
      key: "sentiment",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 9999,
            border: "1px solid",
            borderColor: row.sentiment === "Positive" ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)",
            backgroundColor: row.sentiment === "Positive" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
            color: row.sentiment === "Positive" ? "#10b981" : "#fbbf24",
          }}
        >
          {row.sentiment}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.status === "Approved" ? "Active" : "Warning"} />
      ),
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button
            onClick={() => handleToggleStatus(row.id)}
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              border: "1px solid var(--adm-border, #222222)",
              backgroundColor: "transparent",
              color: row.status === "Approved" ? "#fbbf24" : "#10b981",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {row.status === "Approved" ? "Flag" : "Approve"}
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            style={{
              padding: "6px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              color: "#f87171",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Trash2 size={13} />
          </button>
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
            Review Moderation & Consumer Ratings
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Monitor product ratings, verified buyer feedback, and merchant experience reviews.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ backgroundColor: "var(--adm-card, #111111)", border: "1px solid var(--adm-border, #222222)", borderRadius: 9999, padding: "8px 18px", display: "flex", alignItems: "center", gap: 8 }}>
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--adm-text, #f4efe8)" }}>4.7 / 5.0 Average Platform Rating</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        searchKey="product"
        searchPlaceholder="Search reviews by product or author..."
      />
    </div>
  );
}
