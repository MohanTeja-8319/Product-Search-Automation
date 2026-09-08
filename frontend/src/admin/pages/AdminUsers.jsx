import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiEye,
  FiTrash2,
  FiToggleLeft,
  FiToggleRight,
  FiSearch,
  FiPlus,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";

export function AdminUsers() {
  const { users, toggleUserStatus, deleteUser } = useAdminData();
  const navigate = useNavigate();

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteUser(userToDelete.id);
      setUserToDelete(null);
      setIsDeleting(false);
    }, 400);
  };

  const columns = [
    {
      header: "User ID",
      key: "id",
      sortKey: "id",
      width: "w-28",
      render: (item) => (
        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
          {item.id}
        </span>
      )
    },
    {
      header: "Name",
      key: "name",
      sortKey: "name",
      render: (item) => (
        <div className="flex items-center gap-3">
          <img
            src={item.avatar}
            alt={item.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
          />
          <div>
            <Link
              to={`/admin/users/${item.id}`}
              className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
            >
              {item.name}
            </Link>
            <span className="text-[11px] text-slate-400">{item.location}</span>
          </div>
        </div>
      )
    },
    {
      header: "Email",
      key: "email",
      sortKey: "email",
      render: (item) => (
        <span className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm font-medium">{item.email}</span>
      )
    },
    {
      header: "Registration Date",
      key: "registrationDate",
      sortKey: "registrationDate",
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
          {item.registrationDate}
        </span>
      )
    },
    {
      header: "Status",
      key: "status",
      sortKey: "status",
      render: (item) => <StatusBadge status={item.status} size="sm" />
    },
    {
      header: "Total Searches",
      key: "totalSearches",
      sortKey: "totalSearches",
      align: "center",
      render: (item) => (
        <span className="font-bold text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg text-xs">
          {item.totalSearches}
        </span>
      )
    },
    {
      header: "Last Active",
      key: "lastActive",
      sortKey: "lastActive",
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">{item.lastActive}</span>
      )
    },
    {
      header: "Actions",
      align: "right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1.5">
          {/* View Details */}
          <Link
            to={`/admin/users/${item.id}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
            title="View User Details"
          >
            <FiEye className="text-base" />
          </Link>

          {/* Activate / Deactivate Toggle */}
          <button
            type="button"
            onClick={() => toggleUserStatus(item.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              item.status === "Active"
                ? "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            }`}
            title={item.status === "Active" ? "Deactivate User" : "Activate User"}
          >
            {item.status === "Active" ? (
              <FiToggleRight className="text-xl text-emerald-600" />
            ) : (
              <FiToggleLeft className="text-xl text-slate-400" />
            )}
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={() => setUserToDelete(item)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
            title="Delete User"
          >
            <FiTrash2 className="text-base" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            User Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor registered platform members, search activity, and access state
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            Total Users: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{users.length}</span>
          </div>
        </div>
      </div>

      {/* Main Users Table */}
      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users by name, email, or ID..."
        filterOptions={{
          label: "Status",
          key: "status",
          options: [
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" }
          ]
        }}
        defaultSortKey="registrationDate"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No users found"
        emptyDescription="We couldn't find any registered accounts matching your filters."
      />

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user "${userToDelete?.name}" (${userToDelete?.email})? This action cannot be undone and will purge their search history.`}
        confirmText="Delete User"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}

export default AdminUsers;
