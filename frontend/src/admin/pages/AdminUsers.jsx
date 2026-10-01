import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Search,
  CheckCircle2,
} from "lucide-react";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAdminToast } from "../context/AdminToastContext";

export default function AdminUsers() {
  const { users = [], toggleUserStatus, deleteUser } = useAdminData();
  const { addToast } = useAdminToast();
  const navigate = useNavigate();

  const [userToSuspend, setUserToSuspend] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleToggleStatus = (u) => {
    if (toggleUserStatus) {
      toggleUserStatus(u.id);
    } else {
      const nextStatus = u.status === "Active" ? "Suspended" : "Active";
      addToast(`User ${u.name} status updated to ${nextStatus}.`, nextStatus === "Active" ? "success" : "warning");
    }
    setUserToSuspend(null);
  };

  const columns = [
    {
      header: "User",
      key: "name",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={
              row.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(row.name || "User")}`
            }
            alt={row.name}
            style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: "1px solid var(--adm-border, #222222)" }}
          />
          <div>
            <Link
              to={`/admin/users/${row.id}`}
              style={{ fontWeight: 700, color: "var(--adm-text, #f4efe8)", textDecoration: "none", fontSize: 13.5 }}
              className="adm-link-hover"
            >
              {row.name}
            </Link>
            <div style={{ fontSize: 11.5, color: "var(--adm-muted, #888888)" }}>ID: {row.id?.slice(0, 8)}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Email Address",
      key: "email",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 13, fontWeight: 500 }}>
          {row.email}
        </span>
      ),
    },
    {
      header: "Registration Date",
      key: "registrationDate",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 13 }}>
          {row.registrationDate || row.joinedDate || "2026-08-15"}
        </span>
      ),
    },
    {
      header: "Searches",
      key: "searches",
      sortable: true,
      align: "center",
      render: (row) => (
        <span style={{ fontWeight: 700, color: "var(--adm-text, #f4efe8)", fontSize: 13 }}>
          {row.searches ?? row.totalSearches ?? 0}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      sortable: true,
      render: (row) => <StatusBadge status={row.status || "Active"} />,
    },
    {
      header: "Last Active",
      key: "lastActive",
      sortable: true,
      render: (row) => (
        <span style={{ color: "var(--adm-muted, #888888)", fontSize: 12.5 }}>
          {row.lastActive || "Today"}
        </span>
      ),
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => {
        const isActive = row.status === "Active" || !row.status;

        return (
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={() => navigate(`/admin/users/${row.id}`)}
              title="View User Details"
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
              <Eye size={13} /> View
            </button>

            <button
              onClick={() => handleToggleStatus(row)}
              title={isActive ? "Suspend User" : "Activate User"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: 9999,
                border: "1px solid",
                borderColor: isActive ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)",
                backgroundColor: isActive ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                color: isActive ? "#f87171" : "#10b981",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {isActive ? <UserX size={13} /> : <UserCheck size={13} />}
              <span>{isActive ? "Suspend" : "Activate"}</span>
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0, letterSpacing: "-0.02em" }}>
            Registered Users
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Monitor accounts, search queries, active status, and security compliance.
          </p>
        </div>

        <div style={{ fontSize: 13, color: "var(--adm-muted, #888888)", backgroundColor: "var(--adm-card, #111111)", padding: "7px 16px", borderRadius: 9999, border: "1px solid var(--adm-border, #222222)", fontWeight: 600 }}>
          Total Users: <strong style={{ color: "var(--adm-text, #f4efe8)" }}>{users.length} accounts</strong>
        </div>
      </div>

      {/* Users Table */}
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users by name or email..."
      />

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToSuspend)}
        title={userToSuspend?.status === "Active" ? "Suspend User Account" : "Activate User Account"}
        message={`Are you sure you want to change the status of ${userToSuspend?.name} (${userToSuspend?.email})?`}
        confirmLabel={userToSuspend?.status === "Active" ? "Suspend Account" : "Activate Account"}
        isDanger={userToSuspend?.status === "Active"}
        onConfirm={() => handleToggleStatus(userToSuspend)}
        onCancel={() => setUserToSuspend(null)}
      />
    </div>
  );
}
