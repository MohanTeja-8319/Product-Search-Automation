import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  UserCheck,
  UserX,
  Heart,
  Bell,
  ExternalLink,
} from "lucide-react";
import { useAdminData } from "../context/AdminDataContext";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import { API_BASE_URL } from "../../utils/api";

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserById, toggleUserStatus } = useAdminData();

  const [liveUser, setLiveUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/users/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && data) setLiveUser(data);
      })
      .catch((err) => console.error("Error fetching live user details:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const contextUser = getUserById ? getUserById(id) : null;
  const user = liveUser || contextUser;

  if (loading && !user) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
        Loading user account details...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto" }} className="adm-card">
        <EmptyState
          title="User Account Not Found"
          description={`No user found matching identifier "${id}". The user may have been deleted.`}
          action={
            <button onClick={() => navigate("/admin/users")} className="adm-btn adm-btn-primary">
              <ArrowLeft size={14} /> Back to Users
            </button>
          }
        />
      </div>
    );
  }

  const isActive = user.status === "Active" || !user.status;

  const handleToggle = () => {
    if (toggleUserStatus) {
      toggleUserStatus(user.id);
      setLiveUser((prev) => (prev ? { ...prev, status: isActive ? "Suspended" : "Active" } : prev));
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* Top Navigation */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate("/admin/users")}
          className="adm-btn adm-btn-outline"
        >
          <ArrowLeft size={15} /> Back to Users
        </button>

        <button
          onClick={handleToggle}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 8,
            border: "1px solid",
            borderColor: isActive ? "#FEE2E2" : "#D1FAE5",
            backgroundColor: isActive ? "#FFFFFF" : "#D1FAE5",
            color: isActive ? "#DC2626" : "#059669",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {isActive ? <UserX size={15} /> : <UserCheck size={15} />}
          <span>{isActive ? "Suspend User" : "Activate User"}</span>
        </button>
      </div>

      {/* Main Profile Card */}
      <div className="adm-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginBottom: 24 }}>
          <img
            src={
              user.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || "User")}`
            }
            alt={user.name}
            style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", border: "2px solid #4F46E5" }}
          />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                {user.name}
              </h2>
              <StatusBadge status={user.status || "Active"} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
              Account ID: <code style={{ color: "#0F172A", fontWeight: 600 }}>{user.id}</code>
            </div>
          </div>
        </div>

        {/* User Info Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            padding: 20,
            borderRadius: 12,
            backgroundColor: "#F8FAFC",
            border: "1px solid #E2E8F0",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 11.5, textTransform: "uppercase", fontWeight: 700 }}>
              <Mail size={13} /> Email Address
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginTop: 4 }}>
              {user.email}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 11.5, textTransform: "uppercase", fontWeight: 700 }}>
              <Calendar size={13} /> Member Since
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginTop: 4 }}>
              {user.registrationDate || "September 2026"}
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 11.5, textTransform: "uppercase", fontWeight: 700 }}>
              <Search size={13} /> Lifetime Queries
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginTop: 4 }}>
              {user.searches ?? 0} searches executed
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#94A3B8", fontSize: 11.5, textTransform: "uppercase", fontWeight: 700 }}>
              <Clock size={13} /> Recent Activity
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginTop: 4 }}>
              {user.lastActive || "Active Today"}
            </div>
          </div>
        </div>
      </div>

      {/* Live User Wishlist Items from User Panel */}
      <div className="adm-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={18} color="#EF4444" />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
              User Wishlist Items ({user.wishlist?.length || 0})
            </h3>
          </div>
          <span style={{ fontSize: 12, color: "#64748B" }}>Direct from consumer panel</span>
        </div>

        {Array.isArray(user.wishlist) && user.wishlist.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {user.wishlist.map((item, idx) => (
              <div
                key={item.id || idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 10,
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    style={{ width: 44, height: 44, borderRadius: 6, objectFit: "contain", backgroundColor: "#FFFFFF" }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>₹{Number(item.price).toLocaleString()}</span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>Store: {item.store || "Verified"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px 0", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
            No saved wishlist items for this user.
          </div>
        )}
      </div>

      {/* Live User Search History */}
      <div className="adm-card" style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <Search size={18} color="#4F46E5" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>
            Recent Search Queries ({user.searchHistory?.length || 0})
          </h3>
        </div>

        {Array.isArray(user.searchHistory) && user.searchHistory.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {user.searchHistory.map((s, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                }}
              >
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>
                  "{s.term || s}"
                </span>
                <span style={{ fontSize: 11.5, color: "#64748B" }}>
                  {s.time ? new Date(s.time).toLocaleDateString() : "Recent"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: "20px 0", color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
            No search history recorded for this user yet.
          </div>
        )}
      </div>
    </div>
  );
}
