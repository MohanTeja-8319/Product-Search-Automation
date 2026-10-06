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
      // Category Filter
      if (selectedCategory !== "all") {
        const pCat = String(p.category || "").toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        let matches = pCat.includes(selCat);
        if (selCat === "mobiles" || selCat === "smartphones") {
          matches = pCat.includes("mobile") || pCat.includes("phone") || pCat.includes("smart");
        } else if (selCat === "headphones" || selCat === "audio") {
          matches = pCat.includes("headphone") || pCat.includes("audio") || pCat.includes("earphone") || pCat.includes("airpod");
        } else if (selCat === "shoes" || selCat === "fashion") {
          matches = pCat.includes("fashion") || pCat.includes("shoe") || pCat.includes("cloth");
        } else if (selCat === "groceries" || selCat === "grocery") {
          matches = pCat.includes("grocer") || pCat.includes("food") || pCat.includes("snack");
        } else if (selCat === "beauty") {
          matches = pCat.includes("beauty") || pCat.includes("cosmetic") || pCat.includes("serum") || pCat.includes("skin");
        }
        if (!matches) return false;
      }

      // Platform / Store Filter
      if (selectedPlatform !== "all") {
        const selPlat = selectedPlatform.toLowerCase();
        if (selPlat === "multi-store") {
          const storeCount = p.storeCount || (Array.isArray(p.comparison) ? p.comparison.length : 1);
          if (storeCount <= 1) return false;
        } else {
          const mainStore = String(p.store || p.platform || "").toLowerCase();
          const compStores = Array.isArray(p.comparison) ? p.comparison.map(c => String(c.store || c.name || "").toLowerCase()) : [];
          const allStores = [mainStore, ...(Array.isArray(p.stores) ? p.stores.map(s => String(s).toLowerCase()) : []), ...compStores];
          if (!allStores.some(s => s.includes(selPlat))) {
            return false;
          }
        }
      }

      // Availability Filter
      if (selectedAvailability !== "all") {
        const pAvail = String(p.availability || "in stock").toLowerCase();
        const selAvail = selectedAvailability.toLowerCase();
        if (!pAvail.includes(selAvail)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (priceSort === "low-to-high") {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price || 0).replace(/[^0-9.]/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price || 0).replace(/[^0-9.]/g, "")) || 0;
        return priceA - priceB;
      }
      if (priceSort === "high-to-low") {
        const priceA = typeof a.price === "number" ? a.price : parseFloat(String(a.price || 0).replace(/[^0-9.]/g, "")) || 0;
        const priceB = typeof b.price === "number" ? b.price : parseFloat(String(b.price || 0).replace(/[^0-9.]/g, "")) || 0;
        return priceB - priceA;
      }
      return 0;
    });
  }, [allProducts, selectedCategory, selectedPlatform, selectedAvailability, priceSort]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedPlatform("all");
    setSelectedAvailability("all");
    setPriceSort("default");
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
          <option value="mobiles">Mobiles & Phones</option>
          <option value="laptops">Laptops</option>
          <option value="headphones">Headphones & Audio</option>
          <option value="groceries">Groceries & Food</option>
          <option value="fashion">Fashion & Shoes</option>
          <option value="beauty">Beauty & Personal Care</option>
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
          <option value="amazon">Amazon</option>
          <option value="flipkart">Flipkart</option>
          <option value="blinkit">BlinkIt</option>
          <option value="zepto">Zepto</option>
          <option value="swiggy">Swiggy</option>
          <option value="bigbasket">BigBasket</option>
          <option value="myntra">Myntra</option>
          <option value="nykaa">Nykaa</option>
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

        {/* Price Sort */}
        <select
          value={priceSort}
          onChange={(e) => setPriceSort(e.target.value)}
          className="adm-input"
          style={{ width: "auto", minWidth: 140, padding: "6px 12px", borderRadius: 9999, fontSize: 13 }}
        >
          <option value="default">Default Order</option>
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>

        {(selectedCategory !== "all" || selectedPlatform !== "all" || selectedAvailability !== "all" || priceSort !== "default") && (
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
