import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Power, Layers, CheckCircle2, X } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAdminToast } from "../context/AdminToastContext";
import { API_BASE_URL } from "../../utils/api";

export default function AdminCategories() {
  const { addToast } = useAdminToast();
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/categories`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? { ...c, name: categoryName.trim() } : c))
      );
      addToast(`Category "${categoryName}" updated successfully.`, "success");
    } else {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: categoryName.trim(),
        productsCount: 0,
        activeStatus: true,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setCategories((prev) => [newCat, ...prev]);
      addToast(`Category "${categoryName}" created.`, "success");
    }
    setModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = !c.activeStatus;
          addToast(`Category "${c.name}" ${next ? "enabled" : "disabled"}.`, next ? "success" : "warning");
          return { ...c, activeStatus: next };
        }
        return c;
      })
    );
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    addToast(`Category "${deleteTarget.name}" deleted.`, "info");
    setDeleteTarget(null);
  };

  const columns = [
    {
      header: "Category Name",
      key: "name",
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
            }}
          >
            <Layers size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>{row.name}</div>
            <div style={{ fontSize: 11.5, color: "var(--adm-muted, #888888)" }}>ID: {row.id}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Products Count",
      key: "productsCount",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>
          {row.productsCount.toLocaleString()} products
        </span>
      ),
    },
    {
      header: "Status",
      key: "activeStatus",
      sortable: true,
      render: (row) => (
        <StatusBadge status={row.activeStatus ? "Active" : "Disabled"} />
      ),
    },
    {
      header: "Created Date",
      key: "createdDate",
      sortable: true,
      render: (row) => <span style={{ color: "var(--adm-muted, #888888)" }}>{row.createdDate}</span>,
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button
            onClick={() => handleToggleStatus(row.id)}
            title={row.activeStatus ? "Disable category" : "Enable category"}
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              border: "1px solid var(--adm-border, #222222)",
              backgroundColor: "transparent",
              color: row.activeStatus ? "var(--adm-muted, #888888)" : "#10b981",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s ease",
            }}
          >
            <Power size={13} /> {row.activeStatus ? "Disable" : "Enable"}
          </button>

          <button
            onClick={() => handleOpenEdit(row)}
            title="Edit category"
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              border: "1px solid var(--adm-border, #222222)",
              backgroundColor: "transparent",
              color: "var(--adm-text, #f4efe8)",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s ease",
            }}
          >
            <Edit3 size={13} /> Edit
          </button>

          <button
            onClick={() => setDeleteTarget(row)}
            title="Delete category"
            style={{
              padding: "6px 10px",
              borderRadius: 9999,
              border: "1px solid rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
              color: "#f87171",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              transition: "all 0.15s ease",
            }}
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400, margin: "0 auto" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0, letterSpacing: "-0.02em" }}>
            Category Taxonomy
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Organize products, manage navigation trees, and track catalog counts.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
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
            boxShadow: "0 2px 10px rgba(255, 255, 255, 0.15)",
          }}
          className="adm-btn-primary"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories Table */}
      <DataTable
        columns={columns}
        data={categories}
        searchKey="name"
        searchPlaceholder="Search categories..."
      />

      {/* Add / Edit Category Modal */}
      {modalOpen && (
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
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 440,
              backgroundColor: "var(--adm-card, #111111)",
              borderRadius: 16,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--adm-border, #222222)",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid var(--adm-border, #222222)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0 }}>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: "none", border: "none", color: "var(--adm-muted, #888888)", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} style={{ padding: "24px" }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "var(--adm-muted, #888888)", display: "block", marginBottom: 6 }}>
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Smartwatches & Wearables"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                  className="adm-input"
                  autoFocus
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="adm-btn adm-btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn adm-btn-primary">
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Category"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? Products under this category may become unorganized.`}
        confirmLabel="Delete Category"
        isDanger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
