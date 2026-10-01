import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import EmptyState from "./EmptyState";

export default function DataTable({
  columns = [],
  data = [],
  searchKey = "",
  searchPlaceholder = "Search records...",
  itemsPerPage = 10,
  emptyTitle = "No records found",
  emptyDescription = "There are no entries matching your current filters.",
  actions = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Filter
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();

    return data.filter((item) => {
      if (searchKey && item[searchKey]) {
        return String(item[searchKey]).toLowerCase().includes(term);
      }
      return Object.values(item).some((val) =>
        String(val || "").toLowerCase().includes(term)
      );
    });
  }, [data, searchTerm, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const renderPaginationButtons = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        const isActive = currentPage === i;
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            style={{
              minWidth: 32,
              height: 32,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: "var(--radius-full, 9999px)",
              border: "1px solid",
              borderColor: isActive ? "var(--primary, #ffffff)" : "var(--border, #222222)",
              backgroundColor: isActive ? "var(--primary, #ffffff)" : "transparent",
              color: isActive ? "var(--primary-content, #0a0a0a)" : "var(--text-700, #d5cabd)",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            {i}
          </button>
        );
      } else if (
        (i === currentPage - 2 && i > 1) ||
        (i === currentPage + 2 && i < totalPages)
      ) {
        pages.push(
          <span key={`dots-${i}`} style={{ color: "var(--text-500, #888888)", padding: "0 4px" }}>
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div
      style={{
        backgroundColor: "var(--surface, #111111)",
        border: "1px solid var(--border, #222222)",
        borderRadius: "var(--radius-lg, 14px)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
        overflow: "hidden",
      }}
    >
      {/* Top Search & Actions Bar */}
      {(searchPlaceholder || actions) && (
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid var(--border, #222222)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {searchPlaceholder && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                backgroundColor: "var(--surface-hover, #1a1a1a)",
                border: "1px solid var(--border, #222222)",
                borderRadius: "var(--radius-full, 9999px)",
                padding: "8px 16px",
                width: 300,
                maxWidth: "100%",
              }}
            >
              <Search size={15} color="var(--text-500, #888888)" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontSize: 13,
                  color: "var(--text-900, #f4efe8)",
                  width: "100%",
                }}
              />
            </div>
          )}

          {actions && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{actions}</div>}
        </div>
      )}

      {/* Table Content */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{
                    backgroundColor: "var(--surface-hover, #1a1a1a)",
                    color: "var(--text-500, #888888)",
                    fontSize: 11.5,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    padding: "13px 18px",
                    textAlign: col.align || "left",
                    borderBottom: "1px solid var(--border, #222222)",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      justifyContent: col.align === "right" ? "flex-end" : "flex-start",
                    }}
                  >
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown size={12} color="var(--text-500, #888888)" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  style={{
                    transition: "background-color 0.15s ease",
                  }}
                  className="adm-table-row"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key || col.header}
                      style={{
                        padding: "14px 18px",
                        fontSize: 13,
                        color: "var(--text-700, #d5cabd)",
                        borderBottom: "1px solid var(--border, #222222)",
                        backgroundColor: "var(--surface, #111111)",
                        textAlign: col.align || "left",
                        verticalAlign: "middle",
                      }}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ padding: "48px 20px", textAlign: "center", backgroundColor: "var(--surface, #111111)" }}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    actionText={searchTerm ? "Clear Search Filter" : null}
                    onAction={() => setSearchTerm("")}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div
          style={{
            padding: "14px 20px",
            borderTop: "1px solid var(--border, #222222)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            backgroundColor: "var(--surface, #111111)",
          }}
        >
          <div style={{ fontSize: 12.5, color: "var(--text-500, #888888)" }}>
            Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to{" "}
            <strong>{Math.min(currentPage * itemsPerPage, sortedData.length)}</strong> of{" "}
            <strong>{sortedData.length}</strong> items
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid var(--border, #222222)",
                backgroundColor: "transparent",
                color: "var(--text-700, #d5cabd)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
                transition: "all 0.15s ease",
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>

            <div style={{ display: "flex", gap: 4 }}>{renderPaginationButtons()}</div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "6px 12px",
                borderRadius: "var(--radius-full, 9999px)",
                border: "1px solid var(--border, #222222)",
                backgroundColor: "transparent",
                color: "var(--text-700, #d5cabd)",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
                transition: "all 0.15s ease",
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
