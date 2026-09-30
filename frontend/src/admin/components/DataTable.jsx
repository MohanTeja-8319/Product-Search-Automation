import React, { useState, useMemo } from "react";
import {
 FiSearch,
 FiChevronLeft,
 FiChevronRight,
 FiChevronUp,
 FiChevronDown,
 FiFilter,
 FiX
} from "react-icons/fi";
import EmptyState from "./EmptyState";
import { TableSkeleton } from "./LoadingSkeleton";

export function DataTable({
 columns = [],
 data = [],
 searchKey = "",
 searchPlaceholder = "Search records...",
 filterOptions = null, 
 defaultSortKey = "",
 defaultSortDir = "asc",
 pageSize = 8,
 isLoading = false,
 emptyTitle = "No records found",
 emptyDescription = "Try adjusting your search or filter criteria.",
 extraControls = null
}) {
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedFilter, setSelectedFilter] = useState("all");
 const [sortKey, setSortKey] = useState(defaultSortKey);
 const [sortDir, setSortDir] = useState(defaultSortDir);
 const [currentPage, setCurrentPage] = useState(1);

 
 const filteredData = useMemo(() => {
 return data.filter((item) => {
 
 if (searchTerm.trim()) {
 const term = searchTerm.toLowerCase();
 let matches = false;

 if (searchKey && item[searchKey]) {
 matches = String(item[searchKey]).toLowerCase().includes(term);
 } else {
 
 matches = Object.values(item).some((val) =>
 val !== null && val !== undefined && String(val).toLowerCase().includes(term)
 );
 }
 if (!matches) return false;
 }

 
 if (filterOptions && selectedFilter !== "all") {
 const itemVal = String(item[filterOptions.key] || "").toLowerCase();
 if (itemVal !== selectedFilter.toLowerCase()) return false;
 }

 return true;
 });
 }, [data, searchTerm, searchKey, filterOptions, selectedFilter]);

 
 const sortedData = useMemo(() => {
 if (!sortKey) return filteredData;

 return [...filteredData].sort((a, b) => {
 let valA = a[sortKey];
 let valB = b[sortKey];

 if (typeof valA === "string") valA = valA.toLowerCase();
 if (typeof valB === "string") valB = valB.toLowerCase();

 if (valA < valB) return sortDir === "asc" ? -1 : 1;
 if (valA > valB) return sortDir === "asc" ? 1 : -1;
 return 0;
 });
 }, [filteredData, sortKey, sortDir]);

 
 const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
 const paginatedData = useMemo(() => {
 const start = (currentPage - 1) * pageSize;
 return sortedData.slice(start, start + pageSize);
 }, [sortedData, currentPage, pageSize]);

 const handleSort = (key) => {
 if (!key) return;
 if (sortKey === key) {
 setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
 } else {
 setSortKey(key);
 setSortDir("asc");
 }
 };

 const handleSearchChange = (e) => {
 setSearchTerm(e.target.value);
 setCurrentPage(1);
 };

 const handleFilterChange = (e) => {
 setSelectedFilter(e.target.value);
 setCurrentPage(1);
 };

 const clearFilters = () => {
 setSearchTerm("");
 setSelectedFilter("all");
 setCurrentPage(1);
 };

 if (isLoading) {
 return <TableSkeleton columns={columns.length} rows={pageSize} />;
 }

 return (
 <div className="bg-white rounded-[16px] border border-slate-200/90 shadow-soft overflow-hidden flex flex-col">
 {}
 <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/40 ">
 {}
 <div className="relative w-full sm:w-80">
 <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
 <input
 type="text"
 value={searchTerm}
 onChange={handleSearchChange}
 placeholder={searchPlaceholder}
 className="w-full pl-9 pr-8 py-2 text-xs md:text-sm bg-white border border-slate-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
 />
 {searchTerm && (
 <button
 onClick={() => setSearchTerm("")}
 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 :text-slate-400 p-1"
 >
 <FiX className="text-xs" />
 </button>
 )}
 </div>

 {}
 <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
 {filterOptions && (
 <div className="relative flex items-center">
 <select
 value={selectedFilter}
 onChange={handleFilterChange}
 className="pl-3 pr-8 py-2 text-xs md:text-sm font-medium bg-white border border-slate-200 rounded-[10px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
 >
 <option value="all">All {filterOptions.label}</option>
 {filterOptions.options.map((opt) => (
 <option key={opt.value} value={opt.value}>
 {opt.label}
 </option>
 ))}
 </select>
 <FiFilter className="absolute right-2.5 pointer-events-none text-slate-400 text-xs" />
 </div>
 )}

 {extraControls}
 </div>
 </div>

 {}
 <div className="overflow-x-auto min-h-[300px]">
 {paginatedData.length === 0 ? (
 <div className="p-8">
 <EmptyState
 title={emptyTitle}
 description={emptyDescription}
 actionText="Reset Filters"
 onAction={clearFilters}
 />
 </div>
 ) : (
 <table className="w-full text-left text-xs md:text-sm border-collapse">
 <thead>
 <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
 {columns.map((col, idx) => {
 const isSortable = !!col.sortKey;
 const isCurrentSort = sortKey === col.sortKey;
 return (
 <th
 key={idx}
 onClick={() => isSortable && handleSort(col.sortKey)}
 className={`px-4 py-3.5 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"} ${
 isSortable ? "cursor-pointer select-none hover:text-slate-900 :text-white transition-colors" : ""
 } ${col.width || ""}`}
 >
 <div
 className={`inline-flex items-center gap-1.5 ${
 col.align === "right" ? "justify-end w-full" : col.align === "center" ? "justify-center w-full" : ""
 }`}
 >
 <span>{col.header}</span>
 {isSortable && (
 <span className="text-slate-400">
 {isCurrentSort ? (
 sortDir === "asc" ? (
 <FiChevronUp className="text-indigo-600 font-bold" />
 ) : (
 <FiChevronDown className="text-indigo-600 font-bold" />
 )
 ) : (
 <FiChevronUp className="opacity-0 group-hover:opacity-100" />
 )}
 </span>
 )}
 </div>
 </th>
 );
 })}
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100 text-slate-700 ">
 {paginatedData.map((item, rowIdx) => (
 <tr
 key={item.id || item.jobId || item.logId || rowIdx}
 className="hover:bg-indigo-50/20 :bg-indigo-950/20 transition-colors"
 >
 {columns.map((col, colIdx) => (
 <td
 key={colIdx}
 className={`px-4 py-3.5 align-middle ${
 col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
 }`}
 >
 {col.render ? col.render(item, rowIdx) : item[col.key] || "—"}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {}
 {sortedData.length > 0 && (
 <div className="p-4 border-t border-slate-200 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 ">
 <div>
 Showing <span className="font-semibold text-slate-700 ">{(currentPage - 1) * pageSize + 1}</span> to{" "}
 <span className="font-semibold text-slate-700 ">
 {Math.min(currentPage * pageSize, sortedData.length)}
 </span>{" "}
 of <span className="font-semibold text-slate-700 ">{sortedData.length}</span> results
 </div>

 <div className="flex items-center gap-1.5">
 <button
 onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
 disabled={currentPage === 1}
 className="p-1.5 rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
 aria-label="Previous page"
 >
 <FiChevronLeft className="text-sm" />
 </button>

 {Array.from({ length: totalPages }, (_, i) => i + 1)
 .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
 .map((page) => (
 <button
 key={page}
 onClick={() => setCurrentPage(page)}
 className={`min-w-[28px] h-7 px-2 text-xs font-semibold rounded-[10px] transition-all ${
 currentPage === page
 ? "bg-slate-900 text-white shadow-xs"
 : "text-slate-600 hover:bg-slate-100 :bg-slate-800"
 }`}
 >
 {page}
 </button>
 ))}

 <button
 onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
 disabled={currentPage === totalPages}
 className="p-1.5 rounded-[10px] border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 :bg-slate-950 :bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
 aria-label="Next page"
 >
 <FiChevronRight className="text-sm" />
 </button>
 </div>
 </div>
 )}
 </div>
 );
}

export default DataTable;
