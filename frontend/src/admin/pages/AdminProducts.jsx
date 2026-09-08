import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiEye,
  FiStar,
  FiExternalLink,
  FiGlobe,
  FiLayers,
  FiFilter
} from "react-icons/fi";
import { useAdminData } from "../context/AdminDataContext";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";

export function AdminProducts() {
  const { products } = useAdminData();
  const [sourceFilter, setSourceFilter] = useState("all");

  const filteredProducts = sourceFilter === "all"
    ? products
    : products.filter((p) => p.sourceWebsite.toLowerCase() === sourceFilter.toLowerCase());

  const columns = [
    {
      header: "Product Image",
      key: "image",
      width: "w-20",
      render: (item) => (
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )
    },
    {
      header: "Product Name",
      key: "name",
      sortKey: "name",
      render: (item) => (
        <div className="max-w-xs sm:max-w-sm truncate">
          <Link
            to={`/admin/products/${item.id}`}
            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block truncate"
          >
            {item.name}
          </Link>
          <span className="text-[11px] font-mono text-slate-400 block">{item.id}</span>
        </div>
      )
    },
    {
      header: "Category",
      key: "category",
      sortKey: "category",
      render: (item) => (
        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {item.category}
        </span>
      )
    },
    {
      header: "Price",
      key: "price",
      sortKey: "price",
      align: "right",
      render: (item) => (
        <div className="text-right">
          <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
            ₹{item.price.toLocaleString("en-IN")}
          </div>
          {item.discount && (
            <span className="text-[10px] text-emerald-600 font-semibold">{item.discount}</span>
          )}
        </div>
      )
    },
    {
      header: "Rating",
      key: "rating",
      sortKey: "rating",
      align: "center",
      render: (item) => (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-800 font-bold text-xs border border-amber-200/60">
          <FiStar className="text-amber-500 fill-amber-500 text-[10px]" />
          <span>{item.rating}</span>
        </div>
      )
    },
    {
      header: "Reviews",
      key: "reviews",
      sortKey: "reviews",
      align: "right",
      render: (item) => (
        <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
          {item.reviews.toLocaleString()}
        </span>
      )
    },
    {
      header: "Source Website",
      key: "sourceWebsite",
      sortKey: "sourceWebsite",
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-100">
          <FiGlobe className="text-xs" />
          {item.sourceWebsite}
        </span>
      )
    },
    {
      header: "Availability",
      key: "availability",
      sortKey: "availability",
      render: (item) => <StatusBadge status={item.availability} size="sm" />
    },
    {
      header: "Last Updated",
      key: "lastUpdated",
      sortKey: "lastUpdated",
      render: (item) => (
        <span className="text-slate-400 text-xs whitespace-nowrap">{item.lastUpdated}</span>
      )
    },
    {
      header: "Actions",
      align: "center",
      render: (item) => (
        <Link
          to={`/admin/products/${item.id}`}
          className="inline-flex items-center justify-center p-2 rounded-xl text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 transition-colors"
          title="View Details"
        >
          <FiEye className="text-sm" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Scraped Products Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Auto-indexed products collected across supported shopping engines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs">
            Catalog Size: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{products.length} Products</span>
          </div>
        </div>
      </div>

      {/* Main Products Table */}
      <DataTable
        columns={columns}
        data={filteredProducts}
        searchKey="name"
        searchPlaceholder="Search products by title, SKU, or category..."
        filterOptions={{
          label: "Category",
          key: "category",
          options: [
            { label: "Smartphones", value: "smartphones" },
            { label: "Laptops", value: "laptops" },
            { label: "Audio", value: "audio" },
            { label: "Smartwatches", value: "smartwatches" },
            { label: "Cameras", value: "cameras" },
            { label: "Appliances", value: "appliances" }
          ]
        }}
        extraControls={
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-xs md:text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer appearance-none"
            >
              <option value="all">All Stores</option>
              <option value="amazon">Amazon</option>
              <option value="flipkart">Flipkart</option>
              <option value="myntra">Myntra</option>
              <option value="croma">Croma</option>
              <option value="reliance digital">Reliance Digital</option>
            </select>
            <FiGlobe className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs" />
          </div>
        }
        defaultSortKey="price"
        defaultSortDir="desc"
        pageSize={8}
        emptyTitle="No products match your criteria"
        emptyDescription="Try selecting a different category or clearing the store filter."
      />
    </div>
  );
}

export default AdminProducts;
