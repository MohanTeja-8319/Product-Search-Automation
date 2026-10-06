import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  User,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Globe,
  TrendingDown,
} from "lucide-react";
import { useAdminData } from "../context/AdminDataContext";
import { API_BASE_URL } from "../../utils/api";
import { fetchAdminJson } from "../utils/adminApi";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";

export default function AdminSearchDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSearchById } = useAdminData();
  const [liveSearch, setLiveSearch] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchAdminJson(`/admin/searches/${id}`)
      .then((item) => {
        if (mounted && item) setLiveSearch(item);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const contextSearch = getSearchById ? getSearchById(id) : null;
  const data = liveSearch || contextSearch;

  if (loading && !data) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
        Loading search telemetry...
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto" }} className="adm-card">
        <EmptyState
          title="Search Record Not Found"
          description={`No search log found matching identifier "${id}".`}
          action={
            <button onClick={() => navigate("/admin/searches")} className="adm-btn adm-btn-primary">
              <ArrowLeft size={14} /> Back to Searches
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Top Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => navigate("/admin/searches")}
          className="adm-btn adm-btn-outline"
        >
          <ArrowLeft size={15} /> Back to Searches
        </button>
        <span style={{ fontSize: 13, color: "#94A3B8" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>Search: {data.query}</span>
      </div>

      {/* Query Header Card */}
      <div className="adm-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: "#EEF2FF",
                  color: "#4F46E5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Search size={16} />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                "{data.query}"
              </h2>
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>
              Executed by <strong style={{ color: "#0F172A" }}>{data.user || "Guest"}</strong> on {data.date}
            </div>
          </div>

          <StatusBadge status={data.status} />
        </div>

        {/* Telemetry Metrics */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 14,
            padding: 18,
            borderRadius: 12,
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
            marginTop: 20,
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8" }}>
              Total Matches
            </span>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
              {data.productsFound} items found
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8" }}>
              Query Latency
            </span>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#059669", marginTop: 2 }}>
              {data.duration}
            </div>
          </div>

          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94A3B8" }}>
              Sources Queried
            </span>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#4F46E5", marginTop: 2 }}>
              {data.platformsSearched?.length || 4} platforms
            </div>
          </div>
        </div>
      </div>

      {/* Dispatched Results Across Stores */}
      <div className="adm-card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>
          Live Store Results Dispatched
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(data.storeResults || []).map((res) => (
            <div
              key={res.store}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: 10,
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
              }}
            >
              <div>
                <strong style={{ fontSize: 14, color: "#0F172A" }}>{res.store}</strong>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Delivery: {res.delivery}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>
                  ₹{res.price?.toLocaleString()}
                </div>
                <StatusBadge status={res.status} size="small" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
