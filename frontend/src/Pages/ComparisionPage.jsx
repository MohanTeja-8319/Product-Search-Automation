import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiArrowLeft, FiCheck, FiX, FiExternalLink, FiBell,
  FiTrendingDown, FiShield, FiAlertCircle
} from "react-icons/fi";
import { FaStar, FaStore } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { getLiveComparison } from "../utils/api";
import toast from "react-hot-toast";

const STORE_COLORS = {
  amazon: { text: "#FF9900", bg: "#FFF8F0", label: "Amazon" },
  flipkart: { text: "#2874F0", bg: "#F0F6FF", label: "Flipkart" },
  myntra: { text: "#FF3F6C", bg: "#FFF0F4", label: "Myntra" },
  croma: { text: "#00E5FF", bg: "#E5FFFF", label: "Croma" },
  reliance: { text: "#E31837", bg: "#FDF0F2", label: "Reliance Digital" }
};

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { productName } = useParams();
  const decodedName = productName || "";

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);

  const location = useLocation();
  const stateProduct = location.state?.product;

  useEffect(() => {
    let active = true;

    if (stateProduct && stateProduct.name === decodedName) {
      setProductData(stateProduct);
      setComparisonList(stateProduct.comparison || []);
      setLoading(false);
      return;
    }

    setLoading(true);
    getLiveComparison(decodedName)
      .then((res) => {
        if (!active) return;
        if (res?.product) {
          setProductData(res.product);
          setComparisonList(res.product.comparison || []);
        } else {
          setError("No exact matches found across our supported retailers.");
        }
      })
      .catch((err) => {
        if (active) setError(err.message || "Failed to load live comparison.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [decodedName, stateProduct]);

  const bestPrice = comparisonList.length > 0
    ? Math.min(...comparisonList.map(item => item.price || Infinity))
    : null;

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          {}
          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ padding: "8px 0", marginBottom: 16 }}>
            <FiArrowLeft size={16} /> Back to results
          </button>

          {loading && (
            <div className="card" style={{ padding: 40, display: "flex", flexDirection: "column", gap: 32 }}>
              <div style={{ display: "flex", gap: 32 }}>
                <div className="skeleton" style={{ width: 240, height: 240, borderRadius: "var(--radius-lg)" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="skeleton" style={{ width: "80%", height: 32, borderRadius: 8 }} />
                  <div className="skeleton" style={{ width: "30%", height: 24, borderRadius: 8 }} />
                  <div className="skeleton" style={{ width: "100%", height: 16, borderRadius: 4 }} />
                  <div className="skeleton" style={{ width: "60%", height: 16, borderRadius: 4 }} />
                </div>
              </div>
              <div className="skeleton" style={{ width: "100%", height: 300, borderRadius: "var(--radius-lg)" }} />
            </div>
          )}

          {!loading && error && (
            <div className="card empty-state" style={{ marginTop: 40 }}>
              <div className="empty-state-icon"><FiAlertCircle size={28} /></div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Product Not Found</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", marginBottom: 24 }}>{error}</p>
              <button className="btn btn-primary" onClick={() => navigate("/search")}>Search Again</button>
            </div>
          )}

          {!loading && productData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {}
              <div className="card compare-hero" style={{ padding: 32, display: "flex", gap: 40, alignItems: "center" }}>
                <div style={{
                  width: 280, height: 280, flexShrink: 0, background: "var(--bg)",
                  borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <img src={productData.image} alt={productData.name} style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }}
                    onError={e => { e.target.src = "https://via.placeholder.com/280?text=Product"; }} />
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <span className="badge badge-primary">{productData.category || "Gadget"}</span>
                    {productData.rating && (
                      <span className="badge" style={{ background: "#FFFBEB", color: "#D97706", display: "flex", gap: 4 }}>
                        <FaStar size={10} /> {productData.rating} Rating
                      </span>
                    )}
                  </div>
                  
                  <h1 className="font-heading" style={{ fontSize: 32, fontWeight: 400, color: "var(--text-900)", lineHeight: 1.3, marginBottom: 16 }}>
                    {productData.name}
                  </h1>
                  
                  {productData.description && (
                    <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6, marginBottom: 24 }}>
                      {productData.description}
                    </p>
                  )}

                  <div className="best-price-box" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--success-light)", borderRadius: "var(--radius-md)", border: "1px solid #A7F3D0" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--success)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FiTrendingDown size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--success-hover)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Current Best Price</div>
                      <div className="font-heading" style={{ fontSize: 28, fontWeight: 400, color: "var(--success)" }}>
                        ₹{bestPrice ? bestPrice.toLocaleString() : "N/A"}
                      </div>
                    </div>
                    
                    <button onClick={() => setAlertProduct(productData)}
                      className="btn btn-primary" style={{ marginLeft: "auto" }}>
                      <FiBell size={14} /> Set Alert
                    </button>
                  </div>
                </div>
              </div>

              {}
              <div className="card" style={{ padding: "32px 0 0" }}>
                <div className="section-header" style={{ padding: "0 32px", marginBottom: 24 }}>
                  <div>
                    <h2 className="section-title">Live Price Comparison</h2>
                    <p style={{ fontSize: 14, color: "var(--text-500)", marginTop: 4 }}>Compare exact matches across verified retailers.</p>
                  </div>
                </div>

                {comparisonList.length === 0 ? (
                  <div style={{ padding: "40px 32px", textAlign: "center", color: "var(--text-500)", fontSize: 14 }}>
                    No exact store listings found. Check spelling or try a broader search.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 600 }}>
                    <thead>
                      <tr style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Retailer</th>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Delivery</th>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                        <th style={{ padding: "16px 32px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonList.sort((a, b) => a.price - b.price).map((item, idx) => {
                        const storeId = item.store.toLowerCase();
                        const storeStyle = STORE_COLORS[storeId] || { text: "var(--text-700)", bg: "var(--bg)", label: item.store };
                        const isBest = item.price === bestPrice;

                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid var(--border)", transition: "var(--transition)", background: isBest ? "rgba(5,150,105,0.02)" : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                            onMouseLeave={e => e.currentTarget.style.background = isBest ? "rgba(5,150,105,0.02)" : "transparent"}
                          >
                            <td style={{ padding: "20px 32px" }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", background: storeStyle.bg, color: storeStyle.text, borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: 13 }}>
                                <FaStore size={14} /> {storeStyle.label}
                              </div>
                            </td>
                            
                            <td style={{ padding: "20px 32px" }}>
                              {item.delivery ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-700)", fontWeight: 500 }}>
                                  <FiCheck size={14} color="var(--success)" /> {item.delivery}
                                </div>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-400)" }}>
                                  <FiX size={14} /> Not specified
                                </div>
                              )}
                            </td>

                            <td style={{ padding: "20px 32px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 18, fontWeight: 800, color: isBest ? "var(--success)" : "var(--text-900)" }}>
                                  ₹{item.price ? Number(item.price).toLocaleString() : "N/A"}
                                </span>
                                {isBest && <span className="badge badge-success">Lowest</span>}
                              </div>
                            </td>

                            <td style={{ padding: "20px 32px", textAlign: "right" }}>
                              <a href={item.url || item.link || "#"} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
                                Go to Store <FiExternalLink size={13} />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.6 }}>
                <FiShield size={24} style={{ marginBottom: 12, color: "var(--text-400)" }} />
                <div style={{ fontSize: 12, fontWeight: 600 }}>We automatically update these prices in real-time.</div>
              </div>
              
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .compare-hero { flex-direction: column !important; padding: 20px !important; gap: 20px !important; }
          .compare-hero > div:first-child { width: 100% !important; height: auto !important; aspect-ratio: 1; }
          .best-price-box { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .best-price-box .btn { margin-left: 0 !important; width: 100% !important; justify-content: center !important; }
        }
      `}</style>
      
      {alertProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
          <div className="card" style={{ width: "100%", maxWidth: 400, padding: 32, position: "relative", background: "var(--bg)" }}>
            <button onClick={() => setAlertProduct(null)} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-500)" }}><FiX size={20} /></button>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--primary-light)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <FiBell size={20} color="var(--primary)" />
            </div>
            <h2 className="font-heading" style={{ fontSize: 24, fontWeight: 400, color: "var(--text-900)", marginBottom: 8 }}>Track Price Drop</h2>
            <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 24 }}>We'll notify you when <strong>{alertProduct.name}</strong> drops below your target price.</p>
            
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "block" }}>Target Price (Current: ₹{bestPrice?.toLocaleString()})</label>
            <div className="input-group" style={{ marginBottom: 24, padding: "4px 12px" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-400)" }}>₹</span>
              <input type="number" className="input" defaultValue={Math.round((bestPrice || 0) * 0.9)} style={{ fontSize: 18, fontWeight: 700, padding: "8px 12px" }} />
            </div>

            <button className="btn btn-primary btn-full" style={{ padding: 14 }} onClick={() => { toast.success("Price alert created successfully!"); setAlertProduct(null); }}>
              Set Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}