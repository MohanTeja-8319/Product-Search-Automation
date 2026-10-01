import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Eye,
  Star,
  ExternalLink,
  Filter,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";

import { API_BASE_URL } from "../../utils/api";

function ProductThumbnail({ src, alt, size = 44 }) {
  const [error, setError] = useState(!src);

  if (error || !src) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          border: "1px solid var(--adm-border, #222222)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--adm-accent, #38bdf8)",
          flexShrink: 0,
        }}
        title={alt}
      >
        <Package size={Math.round(size * 0.52)} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      style={{
        width: size,
        height: size,
        borderRadius: 8,
        objectFit: "cover",
        border: "1px solid var(--adm-border, #222222)",
        flexShrink: 0,
        backgroundColor: "var(--adm-card, #111111)",
      }}
    />
  );
}

export default function AdminProducts() {
  const { products: contextProducts = [] } = useAdminData();
  const navigate = useNavigate();
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`${API_BASE_URL}/admin/products`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setLiveProducts(data);
        }
      })
      .catch((err) => console.error("Error fetching live products:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const allProducts = liveProducts.length > 0 ? liveProducts : contextProducts;

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all");
  const [priceSort, setPriceSort] = useState("default");

  const filteredData = useMemo(() => {
    return allProducts.filter((p) => {
      if (selectedCategory !== "all" && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (selectedPlatform !== "all" && !p.platform?.toLowerCase().includes(selectedPlatform.toLowerCase())) {
        return false;
      }
      if (selectedAvailability !== "all" && p.availability?.toLowerCase() !== selectedAvailability.toLowerCase()) {
        return false;
      }
      return true;
    });
  }, [allProducts, selectedCategory, selectedPlatform, selectedAvailability]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedPlatform("all");
    setSelectedAvailability("all");
  };

  const columns = [
    {
      header: "Product",
      key: "name",
      sortable: true,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12, maxWidth: 300, minWidth: 200 }}>
          <ProductThumbnail src={row.image} alt={row.name} size={44} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <Link
              to={`/admin/products/${row.id}`}
              style={{
                fontWeight: 700,
                color: "var(--adm-text, #f4efe8)",
                textDecoration: "none",
                fontSize: 13.5,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={row.name}
              className="adm-link-hover"
            >
              {row.name}
            </Link>
            <span style={{ fontSize: 11.5, color: "var(--adm-muted, #888888)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Brand: {row.brand || "Comparely Index"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      sortable: true,
      render: (row) => (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--adm-border, #222222)",
            color: "var(--adm-text, #f4efe8)",
          }}
        >
          {row.category}
        </span>
      ),
    },
    {
      header: "Platform",
      key: "platform",
      sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--adm-accent, #38bdf8)" }}>
          {row.platform}
        </span>
      ),
    },
    {
      header: "Best Price",
      key: "price",
      sortable: true,
      align: "right",
      render: (row) => (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800, color: "var(--adm-text, #f4efe8)", fontSize: 14 }}>
            ₹{row.price?.toLocaleString()}
          </div>
          {row.discount && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>
              {row.discount}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Rating & Reviews",
      key: "rating",
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: "#fbbf24", fontWeight: 700, fontSize: 13 }}>
            <Star size={13} fill="#fbbf24" color="#fbbf24" /> {row.rating}
          </div>
          <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)" }}>({row.reviews?.toLocaleString()} reviews)</span>
        </div>
      ),
    },
    {
      header: "Availability",
      key: "availability",
      sortable: true,
      render: (row) => <StatusBadge status={row.availability || "In Stock"} size="small" />,
    },
    {
      header: "Last Updated",
      key: "lastUpdated",
      sortable: true,
      render: (row) => (
        <span style={{ fontSize: 12, color: "var(--adm-muted, #888888)" }}>{row.lastUpdated || "Recently"}</span>
      ),
    },
    {
      header: "Actions",
      align: "right",
      render: (row) => (
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate(`/admin/products/${row.id}`)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "6px 14px",
              borderRadius: 9999,
              border: "1px solid var(--adm-border, #222222)",
              backgroundColor: "transparent",
              color: "var(--adm-text, #f4efe8)",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
          >
            <Eye size={13} /> View Details
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
            Product Catalog & Multi-Store Inventory
          </h2>
          <p style={{ fontSize: 13.5, color: "var(--adm-muted, #888888)", margin: "6px 0 0" }}>
            Manage scraped product variants, matched platform offers, and live price histories.
          </p>
        </div>

        <div style={{ fontSize: 13, color: "var(--adm-muted, #888888)", backgroundColor: "var(--adm-card, #111111)", padding: "7px 16px", borderRadius: 9999, border: "1px solid var(--adm-border, #222222)", fontWeight: 600 }}>
          Catalog Index: <strong style={{ color: "var(--adm-text, #f4efe8)" }}>{allProducts.length} items</strong>
        </div>
      </div>

      {/* Filter Toolbar (Category, Platform, Availability, Price) */}
      <div
        className="adm-card"
        style={{
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "var(--adm-text, #f4efe8)" }}>
          <Filter size={15} color="var(--adm-accent, #38bdf8)" /> Filters:
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="adm-input"
          style={{ width: "auto", minWidth: 140, padding: "6px 12px", borderRadius: 9999, fontSize: 13 }}
        >
          <option value="all">All Categories</option>
          <option value="mobiles">Mobiles</option>
          <option value="laptops">Laptops</option>
          <option value="headphones">Headphones</option>
          <option value="shoes">Shoes</option>
          <option value="home appliances">Home Appliances</option>
        </select>

        {/* Platform Filter */}
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="adm-input"
          style={{ width: "auto", minWidth: 140, padding: "6px 12px", borderRadius: 9999, fontSize: 13 }}
        >
          <option value="all">All Platforms</option>
          <option value="multi-store">Multi-Store Matched</option>
          <option value="amazon">Amazon Only</option>
          <option value="flipkart">Flipkart Only</option>
          <option value="myntra">Myntra Only</option>
        </select>

        {/* Availability Filter */}
        <select
          value={selectedAvailability}
          onChange={(e) => setSelectedAvailability(e.target.value)}
          className="adm-input"
          style={{ width: "auto", minWidth: 140, padding: "6px 12px", borderRadius: 9999, fontSize: 13 }}
        >
          <option value="all">All Stock Status</option>
          <option value="in stock">In Stock</option>
          <option value="limited stock">Limited Stock</option>
          <option value="out of stock">Out of Stock</option>
        </select>

        {(selectedCategory !== "all" || selectedPlatform !== "all" || selectedAvailability !== "all") && (
          <button
            onClick={handleResetFilters}
            style={{
              background: "none",
              border: "none",
              color: "#f87171",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <RotateCcw size={12} /> Reset Filters
          </button>
        )}
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={filteredData}
        searchKey="name"
        searchPlaceholder="Search products by title or brand..."
      />
    </div>
  );
}
