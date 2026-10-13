import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft, FiCheck, FiX, FiExternalLink, FiBell,
  FiTrendingDown, FiShield, FiAlertCircle
} from "react-icons/fi";
import { FaStar, FaStore } from "react-icons/fa";

import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import WishlistButton from "../Components/WishlistButton";
import { getLiveComparison } from "../utils/api";
import { savePriceAlert } from "../utils/alertHelper";
import { getDirectStoreUrl } from "../utils/storeHelper";
import toast from "react-hot-toast";

const STORE_COLORS = {
  amazon: { text: "#FF9900", bg: "#FFF8F0", label: "Amazon" },
  flipkart: { text: "#2874F0", bg: "#F0F6FF", label: "Flipkart" },
  blinkit: { text: "#E5A914", bg: "#FEF9EC", label: "BlinkIt" },
  zepto: { text: "#8A2BE2", bg: "#F5EEFD", label: "Zepto" },
  swiggy: { text: "#FC8019", bg: "#FFF4EB", label: "Swiggy" },
  bigbasket: { text: "#84C225", bg: "#F2F9E9", label: "BigBasket" },
  myntra: { text: "#FF3F6C", bg: "#FFF0F4", label: "Myntra" },
  nykaa: { text: "#FC2779", bg: "#FFF0F6", label: "Nykaa" },
  dmart: { text: "#006400", bg: "#EAF7EA", label: "DMart" },
  minutes: { text: "#2874F0", bg: "#F0F6FF", label: "Minutes" },
  jiomart: { text: "#0078AD", bg: "#EBF5FB", label: "JioMart" },
};

export default function ComparisonPage() {
  const navigate = useNavigate();
  const { productName } = useParams();
  const decodedName = productName || "";

  const [searchParams] = useSearchParams();
  const location = useLocation();
  const stateProduct = location.state?.product;

  const urlStore = searchParams.get("store") || "";
  const initialStore = urlStore || stateProduct?.store || "";
  const [selectedStore, setSelectedStore] = useState(initialStore);

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [comparisonList, setComparisonList] = useState([]);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertProduct, setAlertProduct] = useState(null);
  const [targetPriceInput, setTargetPriceInput] = useState("");

  useEffect(() => {
    let active = true;
    const requestedStore = urlStore || stateProduct?.store || selectedStore || "";

    // If product passed in route state, display preview immediately with preserved store
    if (stateProduct && (stateProduct.name === decodedName || !decodedName)) {
      const pStore = requestedStore || stateProduct.store || "";
      setProductData({
        ...stateProduct,
        store: pStore,
      });
      if (pStore) setSelectedStore(pStore);

      if (Array.isArray(stateProduct.comparison) && stateProduct.comparison.length > 0) {
        const cleaned = stateProduct.comparison
          .filter((c) => {
            const isTech = /phone|laptop|galaxy|iphone|macbook|ultra|pro|tv|watch/i.test(decodedName || stateProduct.name || "");
            if (isTech && /zepto/i.test(c.store)) return false;
            return true;
          })
          .map((c) => {
            const raw = c.deeplink || c.url || c.product_link || c.link;
            const resolved = getDirectStoreUrl(c.store, decodedName || stateProduct.name, raw);
            return {
              ...c,
              url: resolved,
              deeplink: resolved,
              link: resolved,
              product_link: resolved,
            };
          });
        setComparisonList(cleaned);
        setLoading(false);
      }
    }

    setLoading(true);
    getLiveComparison(decodedName, { store: requestedStore })
      .then((res) => {
        if (!active) return;
        if (res?.product) {
          // ALWAYS preserve the store from the product card / query!
          const storeToKeep = requestedStore || stateProduct?.store || res.product.store;
          if (storeToKeep) setSelectedStore(storeToKeep);

          const storeMatch = Array.isArray(res.product.comparison)
            ? res.product.comparison.find((c) => c.store.toLowerCase() === storeToKeep.toLowerCase())
            : null;

          const rawMatchUrl = storeMatch?.deeplink || storeMatch?.url || storeMatch?.product_link || storeMatch?.link;
          const rawFallbackUrl = storeToKeep === stateProduct?.store
            ? (stateProduct?.deeplink || stateProduct?.url || stateProduct?.product_link || stateProduct?.link)
            : (res.product.deeplink || res.product.url || res.product.product_link || res.product.link);
          const chosenUrl = getDirectStoreUrl(storeToKeep, decodedName || res.product.name, rawMatchUrl ?? rawFallbackUrl);

          setProductData({
            ...res.product,
            store: storeToKeep,
            price: storeMatch?.price ?? (storeToKeep === stateProduct?.store ? stateProduct?.price : res.product.price),
            originalPrice: storeMatch?.originalPrice ?? (storeToKeep === stateProduct?.store ? stateProduct?.originalPrice : res.product.originalPrice),
            url: chosenUrl,
            deeplink: chosenUrl,
            link: chosenUrl,
            product_link: chosenUrl,
            rating: storeMatch?.rating ?? (storeToKeep === stateProduct?.store ? stateProduct?.rating : res.product.rating),
          });

          // Ensure the comparisonList contains the selected store with accurate data
          let comps = Array.isArray(res.product.comparison)
            ? res.product.comparison.map((c) => {
                const cUrl = c.deeplink || c.url || c.product_link || c.link;
                const resolved = getDirectStoreUrl(c.store, decodedName || res.product.name, cUrl);
                return {
                  ...c,
                  url: resolved,
                  deeplink: resolved,
                  link: resolved,
                  product_link: resolved,
                };
              })
            : [];
          if (storeToKeep && !comps.some(c => c.store.toLowerCase() === storeToKeep.toLowerCase()) && stateProduct) {
            const sUrl = stateProduct.deeplink || stateProduct.url || stateProduct.product_link || stateProduct.link || "#";
            comps.unshift({
              store: storeToKeep,
              price: stateProduct.price,
              originalPrice: stateProduct.originalPrice || stateProduct.price,
              url: sUrl,
              deeplink: sUrl,
              link: sUrl,
              product_link: sUrl,
              delivery: "Standard Delivery",
            });
          }
          setComparisonList(comps);
        } else if (stateProduct) {
          // Fallback to stateProduct if specific search didn't find multiple stores
          const storeToKeep = requestedStore || stateProduct.store || "Quick Commerce";
          const sUrl = stateProduct.deeplink || stateProduct.url || stateProduct.product_link || stateProduct.link || "#";
          setProductData({
            ...stateProduct,
            store: storeToKeep,
            url: sUrl,
            deeplink: sUrl,
            link: sUrl,
            product_link: sUrl,
          });
          if (stateProduct.store && stateProduct.price) {
            setComparisonList([
              {
                store: stateProduct.store,
                price: stateProduct.price,
                originalPrice: stateProduct.originalPrice || stateProduct.price,
                url: sUrl,
                deeplink: sUrl,
                link: sUrl,
                product_link: sUrl,
                delivery: "Standard Delivery",
              }
            ]);
          }
        } else {
          setError("No exact matches found across our supported retailers.");
        }
      })
      .catch((err) => {
        if (active) {
          if (stateProduct) {
            const storeToKeep = requestedStore || stateProduct.store || "Quick Commerce";
            const sUrl = stateProduct.deeplink || stateProduct.url || stateProduct.product_link || stateProduct.link || "#";
            setProductData({
              ...stateProduct,
              store: storeToKeep,
              url: sUrl,
              deeplink: sUrl,
              link: sUrl,
              product_link: sUrl,
            });
            if (stateProduct.store && stateProduct.price) {
              setComparisonList([
                {
                  store: stateProduct.store,
                  price: stateProduct.price,
                  originalPrice: stateProduct.originalPrice || stateProduct.price,
                  url: sUrl,
                  deeplink: sUrl,
                  link: sUrl,
                  product_link: sUrl,
                  delivery: "Standard Delivery",
                }
              ]);
            }
          } else {
            setError(err.message || "Failed to load live comparison.");
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [decodedName, stateProduct, urlStore]);

  const sortedComparisons = [...comparisonList].sort((a, b) => a.price - b.price);
  const validPrices = sortedComparisons.map(item => item.price).filter(p => typeof p === 'number' && !isNaN(p) && p > 0);
  const bestPrice = validPrices.length > 0
    ? Math.min(...validPrices)
    : (productData?.price || null);

  const activeStore = productData?.store || selectedStore || "";
  const selectedOffer = sortedComparisons.find(
    (item) => item.store.toLowerCase() === activeStore.toLowerCase()
  ) || (productData ? {
    store: activeStore,
    price: productData.price,
    url: productData.url,
    deeplink: productData.deeplink || productData.url,
    link: productData.link || productData.url,
    product_link: productData.product_link || productData.url,
  } : null);

  const lowestOffer = sortedComparisons.find((item) => item.price === bestPrice) || sortedComparisons[0] || null;
  const isSelectedLowest = selectedOffer && bestPrice && selectedOffer.price === bestPrice;
  const bestDeal = isSelectedLowest ? selectedOffer : lowestOffer;

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
                  <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="badge badge-primary">{productData.category || "Gadget"}</span>
                    {productData.store && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 10px",
                          background: (STORE_COLORS[productData.store.toLowerCase()]?.bg || "#F3F4F6"),
                          color: (STORE_COLORS[productData.store.toLowerCase()]?.text || "var(--text-900)"),
                          borderRadius: "var(--radius-sm)",
                          fontSize: 12,
                          fontWeight: 700,
                          border: `1px solid ${STORE_COLORS[productData.store.toLowerCase()]?.text || "var(--border)"}35`
                        }}
                      >
                        <FaStore size={12} />
                        {productData.store}
                      </span>
                    )}
                    {productData.rating ? (
                      <span className="badge" style={{ background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", gap: 4 }}>
                        <FaStar size={11} /> {Number(productData.rating).toFixed(1)} Rating
                      </span>
                    ) : (
                      <span className="badge" style={{ background: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", gap: 4 }}>
                        <FiShield size={11} /> Quick Commerce Verified
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
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--success-hover)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        {isSelectedLowest
                          ? `Lowest Price on ${selectedOffer?.store || productData.store}`
                          : (lowestOffer ? `Best Market Price • Lowest on ${lowestOffer.store}` : `Price on ${productData.store}`)}
                      </div>
                      <div className="font-heading" style={{ fontSize: 28, fontWeight: 400, color: "var(--success)" }}>
                        ₹{(bestPrice || selectedOffer?.price || productData.price)?.toLocaleString()}
                      </div>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto", flexWrap: "wrap" }}>
                      {/* Primary Buy Button for the selected store */}
                      {selectedOffer && (
                        <a
                          href={getDirectStoreUrl(selectedOffer.store, selectedOffer.name || productData.name, selectedOffer.deeplink || selectedOffer.url || selectedOffer.product_link || selectedOffer.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 18px",
                            fontWeight: 700,
                            borderRadius: "var(--radius-md)",
                            background: isSelectedLowest ? "var(--success)" : "var(--primary)",
                            borderColor: isSelectedLowest ? "var(--success)" : "var(--primary)",
                            color: "#fff",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                            textDecoration: "none"
                          }}
                          title={`Buy on ${selectedOffer.store}`}
                        >
                          Buy on {selectedOffer.store} {selectedOffer.price ? `(₹${selectedOffer.price.toLocaleString()})` : ""} <FiExternalLink size={14} />
                        </a>
                      )}

                      {/* Alternative Lowest Price button if another store is cheaper */}
                      {!isSelectedLowest && lowestOffer && lowestOffer.store.toLowerCase() !== (selectedOffer?.store || "").toLowerCase() && (
                        <a
                          href={getDirectStoreUrl(lowestOffer.store, lowestOffer.name || productData.name, lowestOffer.deeplink || lowestOffer.url || lowestOffer.product_link || lowestOffer.link)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "9px 16px",
                            fontWeight: 700,
                            borderRadius: "var(--radius-md)",
                            borderColor: "var(--success)",
                            color: "var(--success)",
                            background: "#fff",
                            textDecoration: "none"
                          }}
                          title={`Buy on ${lowestOffer.store} for lower price`}
                        >
                          Lowest on {lowestOffer.store} (₹{lowestOffer.price?.toLocaleString()}) <FiExternalLink size={14} />
                        </a>
                      )}

                      <WishlistButton
                        product={{
                          name: productData.name,
                          price: bestPrice || selectedOffer?.price || productData.price,
                          image: productData.image,
                        }}
                        size={38}
                        iconSize={15}
                        showText={true}
                      />

                      <button
                        onClick={() => {
                          setAlertProduct(productData);
                          setTargetPriceInput(Math.round(((bestPrice || selectedOffer?.price || 0)) * 0.9));
                        }}
                        className="btn btn-outline"
                        style={{ background: "#fff" }}
                      >
                        <FiBell size={14} /> Set Alert
                      </button>
                    </div>
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
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price &amp; Rating</th>
                        <th style={{ padding: "16px 32px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedComparisons.map((item, idx) => {
                        const storeId = item.store.toLowerCase();
                        const storeStyle = STORE_COLORS[storeId] || { text: "var(--text-700)", bg: "var(--bg)", label: item.store };
                        const isBest = item.price === bestPrice;
                        const isSelectedStore = (productData?.store || selectedStore || "").toLowerCase() === item.store.toLowerCase();
                        const buyUrl = getDirectStoreUrl(item.store, item.name || productData?.name, item.deeplink || item.url || item.product_link || item.link);

                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid var(--border)", transition: "var(--transition)", background: isBest ? "rgba(5,150,105,0.02)" : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                            onMouseLeave={e => e.currentTarget.style.background = isBest ? "rgba(5,150,105,0.02)" : "transparent"}
                          >
                            <td style={{ padding: "20px 32px" }}>
                              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 14px", background: storeStyle.bg, color: storeStyle.text, borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: 13 }}>
                                <FaStore size={14} /> {storeStyle.label}
                              </div>
                              {isSelectedStore && (
                                <span className="badge badge-primary" style={{ marginLeft: 8, fontSize: 10, verticalAlign: "middle" }}>
                                  Selected Store
                                </span>
                              )}
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
                              {item.rating ? (
                                <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6 }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                      key={star}
                                      size={12}
                                      style={{
                                        color: star <= Math.round(Number(item.rating)) ? "#F59E0B" : "#D1D5DB",
                                      }}
                                    />
                                  ))}
                                  <span
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                      color: "#92400E",
                                      marginLeft: 4,
                                      background: "#FEF3C7",
                                      padding: "1px 6px",
                                      borderRadius: 4,
                                    }}
                                  >
                                    {Number(item.rating).toFixed(1)}
                                  </span>
                                  {item.reviews && (
                                    <span style={{ fontSize: 11, color: "var(--text-400)", marginLeft: 2 }}>
                                      ({Number(item.reviews).toLocaleString()} reviews)
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 11, color: "var(--text-500)", fontWeight: 500 }}>
                                  <FiShield size={12} color="var(--primary)" /> Verified Store Listing
                                </div>
                              )}
                            </td>

                            <td style={{ padding: "20px 32px", textAlign: "right" }}>
                              <a
                                href={buyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary btn-sm"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 6,
                                  background: isBest ? "var(--success)" : undefined,
                                  borderColor: isBest ? "var(--success)" : undefined,
                                  boxShadow: isBest ? "0 2px 8px rgba(16, 185, 129, 0.25)" : undefined,
                                  textDecoration: "none"
                                }}
                                title={`Buy on ${item.store || "Store"}`}
                              >
                                Buy on {item.store || "Store"} <FiExternalLink size={13} />
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
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", padding: 16 }}>
          <div className="card" style={{ width: "100%", maxWidth: 420, padding: 32, position: "relative", background: "var(--surface)", borderRadius: "var(--radius-lg)" }}>
            <button onClick={() => setAlertProduct(null)} style={{ position: "absolute", top: 16, right: 16, background: "transparent", border: "none", cursor: "pointer", color: "var(--text-400)" }}><FiX size={20} /></button>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <FiBell size={22} />
            </div>
            <h2 className="font-heading" style={{ fontSize: 22, fontWeight: 400, color: "var(--text-900)", marginBottom: 8 }}>Track Price Drop</h2>
            <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 20 }}>We'll notify you when <strong>{alertProduct.name}</strong> drops below your target price.</p>
            
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-700)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "block" }}>
              Target Price (Current: ₹{(bestPrice || 0).toLocaleString()})
            </label>
            <div className="input-group" style={{ marginBottom: 16, padding: "4px 12px" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-400)" }}>₹</span>
              <input
                type="number"
                className="input"
                value={targetPriceInput}
                onChange={(e) => setTargetPriceInput(e.target.value)}
                style={{ fontSize: 18, fontWeight: 700, padding: "8px 12px" }}
              />
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[5, 10, 15, 20].map((pct) => {
                const calculated = Math.round((bestPrice || 0) * (1 - pct / 100));
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setTargetPriceInput(calculated)}
                    style={{
                      flex: 1,
                      padding: "6px 0",
                      fontSize: 12,
                      fontWeight: 600,
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      background: Number(targetPriceInput) === calculated ? "var(--primary-light)" : "transparent",
                      color: Number(targetPriceInput) === calculated ? "var(--primary)" : "var(--text-600)",
                      cursor: "pointer",
                      transition: "var(--transition)"
                    }}
                  >
                    -{pct}%
                  </button>
                );
              })}
            </div>

            <button
              className="btn btn-primary btn-full"
              style={{ padding: 14 }}
              onClick={async () => {
                const target = Number(targetPriceInput) || Math.round((bestPrice || 0) * 0.9);
                await savePriceAlert({
                  productName: alertProduct.name,
                  productId: alertProduct.id,
                  image: alertProduct.image,
                  currentPrice: bestPrice || 0,
                  targetPrice: target,
                  store: "Lowest Retailer",
                });
                toast.success(`Price alert set for ₹${target.toLocaleString()}! We'll track it.`);
                setAlertProduct(null);
              }}
            >
              Set Price Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}