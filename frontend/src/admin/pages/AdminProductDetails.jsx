import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Shield,
  TrendingDown,
  Clock,
  Layers,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Package,
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { useAdminData } from "../context/AdminDataContext";
import { API_BASE_URL } from "../../utils/api";

export default function AdminProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useAdminData();
  const [liveProduct, setLiveProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setImgError(false);
    fetch(`${API_BASE_URL}/admin/products/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((item) => {
        if (mounted && item) {
          setLiveProduct(item);
        }
      })
      .catch((err) => console.error("Error fetching product details:", err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  const contextProduct = getProductById ? getProductById(id) : null;
  const data = liveProduct || contextProduct;

  if (loading && !data) {
    return (
      <div style={{ padding: 60, textAlign: "center", color: "#64748B" }}>
        <div style={{ display: "inline-block", width: 32, height: 32, border: "3px solid #E2E8F0", borderTopColor: "#4F46E5", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>Loading product telemetry & store comparisons...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ maxWidth: 500, margin: "60px auto" }} className="adm-card">
        <h3 style={{ color: "#0F172A", margin: 0 }}>Product Not Found</h3>
        <p style={{ color: "#64748B", fontSize: 13.5 }}>No product was found matching identifier "{id}".</p>
        <button onClick={() => navigate("/admin/products")} className="adm-btn adm-btn-primary" style={{ marginTop: 16 }}>
          <ArrowLeft size={14} /> Back to Products
        </button>
      </div>
    );
  }

  // Safe normalized comparison list
  const comparisonList = (
    (Array.isArray(data.platformComparison) && data.platformComparison.length > 0 ? data.platformComparison : null) ||
    (Array.isArray(data.platforms) && data.platforms.length > 0 ? data.platforms : null) ||
    []
  ).map((p, idx) => ({
    platform: p.platform || p.name || `Store #${idx + 1}`,
    price: p.price ?? data.currentPrice ?? data.price ?? 0,
    stock: p.stock ?? (p.inStock === false ? "Out of Stock" : "In Stock"),
    delivery: p.delivery || "Standard 2-3 Business Days",
    rating: p.rating || 4.5,
    deal: p.deal || (idx === 0 ? "Best Price" : "Standard Price"),
    url: p.url || "#",
  }));

  // Safe specifications matrix
  const specsList = (Array.isArray(data.specifications) && data.specifications.length > 0)
    ? data.specifications
    : [
        { key: "Brand", value: data.brand || "Comparely Verified" },
        { key: "Category", value: data.category || "General" },
        { key: "Stock Status", value: data.availability || "In Stock" },
        { key: "Stores Monitored", value: `${comparisonList.length || 3} Active Portals` },
      ];

  const displayPrice = data.currentPrice ?? data.price ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
      {/* Top Breadcrumb & Back Button */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={() => navigate("/admin/products")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 16px",
            borderRadius: 9999,
            border: "1px solid var(--adm-border, #222222)",
            backgroundColor: "transparent",
            color: "var(--adm-text, #f4efe8)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          className="adm-btn-outline"
        >
          <ArrowLeft size={15} /> Back to Products
        </button>

        <span style={{ fontSize: 13, color: "var(--adm-muted, #888888)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--adm-muted, #888888)" }}>Product Details</span>
        <span style={{ fontSize: 13, color: "var(--adm-muted, #888888)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--adm-text, #f4efe8)" }}>{data.name || data.title}</span>
      </div>

      {/* Main Info Card */}
      <div className="adm-card" style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {/* Product Image with Fallback */}
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 14,
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--adm-border, #222222)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {imgError || !data.image ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, color: "var(--adm-muted, #888888)" }}>
                <div style={{ width: 68, height: 68, borderRadius: 16, backgroundColor: "rgba(56, 189, 248, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--adm-accent, #38bdf8)" }}>
                  <Package size={34} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--adm-muted, #888888)" }}>Comparely Product</span>
              </div>
            ) : (
              <img
                src={data.image}
                alt={data.name || data.title}
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 9999,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid var(--adm-border, #222222)",
                    color: "var(--adm-text, #f4efe8)",
                  }}
                >
                  {data.category || "General"}
                </span>
                <span style={{ fontSize: 12, color: "var(--adm-muted, #888888)" }}>Brand: <strong style={{ color: "var(--adm-text, #f4efe8)" }}>{data.brand || "Verified Brand"}</strong></span>
                <StatusBadge status={data.availability || "In Stock"} size="small" />
              </div>

              <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: "0 0 12px", lineHeight: 1.3 }}>
                {data.name || data.title}
              </h1>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "#fbbf24", fontWeight: 700, fontSize: 14 }}>
                  <Star size={16} fill="#fbbf24" color="#fbbf24" /> {data.rating || 4.5}
                  <span style={{ color: "var(--adm-muted, #888888)", fontWeight: 400, fontSize: 13 }}>
                    ({(data.reviews || data.reviewsCount || 0).toLocaleString()} reviews across stores)
                  </span>
                </div>
                <span style={{ fontSize: 12, color: "var(--adm-muted, #888888)" }}>• Last synced {data.lastUpdated || "Just now"}</span>
              </div>

              {/* Price Details */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "14px 18px", borderRadius: 12, backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--adm-border, #222222)" }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--adm-muted, #888888)", textTransform: "uppercase", fontWeight: 700, display: "block" }}>
                    Best Available Price
                  </span>
                  <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)" }}>
                    ₹{displayPrice.toLocaleString()}
                  </div>
                </div>

                {data.originalPrice && data.originalPrice > displayPrice && (
                  <div>
                    <span style={{ fontSize: 13, color: "var(--adm-muted, #888888)", textDecoration: "line-through" }}>
                      MRP ₹{data.originalPrice?.toLocaleString()}
                    </span>
                    <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 700, color: "#10b981", backgroundColor: "rgba(16, 185, 129, 0.15)", padding: "2px 8px", borderRadius: 9999 }}>
                      {data.discount || `${Math.round(((data.originalPrice - displayPrice) / data.originalPrice) * 100)}% OFF`}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <a
                href="/comparison"
                target="_blank"
                rel="noreferrer"
                className="adm-btn adm-btn-primary"
                style={{ borderRadius: 9999, padding: "9px 20px" }}
              >
                <ExternalLink size={14} /> Open Live Compare View
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Platform Comparison Table & Specifications */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 24 }}>
        {/* Platform Comparison */}
        <div className="adm-card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: 0 }}>
              Live Platform Comparison
            </h3>
            <span style={{ fontSize: 12, color: "var(--adm-muted, #888888)" }}>
              {comparisonList.length} store offers tracked
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {comparisonList.length === 0 ? (
              <div style={{ padding: 24, textAlign: "center", color: "var(--adm-muted, #888888)", fontSize: 13 }}>
                No active store prices tracked yet.
              </div>
            ) : (
              comparisonList.map((p, idx) => {
                const isBest = p.deal === "Best Price" || idx === 0;
                return (
                  <div
                    key={p.platform + idx}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 10,
                      backgroundColor: isBest ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.03)",
                      border: isBest ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--adm-border, #222222)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: "var(--adm-text, #f4efe8)", fontSize: 14 }}>{p.platform}</span>
                        {isBest && (
                          <span style={{ fontSize: 10, fontWeight: 700, backgroundColor: "#10b981", color: "#000000", padding: "1px 6px", borderRadius: 4 }}>
                            BEST DEAL
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--adm-muted, #888888)" }}>Delivery: {p.delivery}</span>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: isBest ? "#10b981" : "var(--adm-text, #f4efe8)" }}>
                        ₹{Number(p.price || 0).toLocaleString()}
                      </div>
                      <span style={{ fontSize: 11.5, color: "var(--adm-muted, #888888)" }}>{p.stock}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Specifications Matrix */}
        <div className="adm-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "var(--font-heading, 'Playfair Display', serif)", color: "var(--adm-text, #f4efe8)", margin: "0 0 16px" }}>
            Normalized Technical Specifications
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {specsList.map((spec, i) => (
              <div
                key={spec.key || i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: 8,
                  backgroundColor: i % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "transparent",
                  fontSize: 13,
                }}
              >
                <span style={{ color: "var(--adm-muted, #888888)", fontWeight: 500 }}>{spec.key}</span>
                <strong style={{ color: "var(--adm-text, #f4efe8)" }}>{spec.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
