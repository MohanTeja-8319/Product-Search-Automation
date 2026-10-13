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

function mergeStoreComparisons(listA = [], listB = [], baseName = "", fallbackItem = null) {
  const storeMap = new Map();

  const addItems = (items) => {
    if (!Array.isArray(items)) return;
    for (const item of items) {
      if (item && item.store && typeof item.price === "number" && !isNaN(item.price)) {
        const key = item.store.toLowerCase().trim();
        const rawUrl = item.deeplink || item.url || item.product_link || item.link;
        const resolvedUrl = getDirectStoreUrl(item.store, item.name || baseName, rawUrl);
        const existing = storeMap.get(key);
        if (!existing || item.price < existing.price) {
          storeMap.set(key, {
            ...item,
            url: resolvedUrl,
            deeplink: resolvedUrl,
            link: resolvedUrl,
            product_link: resolvedUrl,
          });
        }
      }
    }
  };

  addItems(listA);
  addItems(listB);

  if (fallbackItem && fallbackItem.store && typeof fallbackItem.price === "number" && !isNaN(fallbackItem.price)) {
    const key = fallbackItem.store.toLowerCase().trim();
    if (!storeMap.has(key)) {
      const rawUrl = fallbackItem.deeplink || fallbackItem.url || fallbackItem.product_link || fallbackItem.link;
      const resolvedUrl = getDirectStoreUrl(fallbackItem.store, fallbackItem.name || baseName, rawUrl);
      storeMap.set(key, {
        store: fallbackItem.store,
        price: fallbackItem.price,
        originalPrice: fallbackItem.originalPrice || fallbackItem.price,
        delivery: fallbackItem.delivery || "Standard Delivery",
        rating: fallbackItem.rating,
        reviews: fallbackItem.reviews,
        url: resolvedUrl,
        deeplink: resolvedUrl,
        link: resolvedUrl,
        product_link: resolvedUrl,
      });
    }
  }

  return Array.from(storeMap.values()).sort((a, b) => a.price - b.price);
}

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
      if (pStore) setSelectedStore(pStore);

      const initialComps = mergeStoreComparisons(stateProduct.comparison, [], decodedName || stateProduct.name, stateProduct);
      const storeMatch = initialComps.find(c => c.store.toLowerCase() === pStore.toLowerCase()) || initialComps[0];

      setProductData({
        ...stateProduct,
        store: storeMatch?.store || pStore,
        price: storeMatch?.price ?? stateProduct.price,
        originalPrice: storeMatch?.originalPrice ?? stateProduct.originalPrice,
        url: storeMatch?.url || stateProduct.url,
        storeCount: initialComps.length,
        comparison: initialComps,
      });

      if (initialComps.length > 0) {
        setComparisonList(initialComps);
        setLoading(false);
      }
    }

    setLoading(true);
    getLiveComparison(decodedName, { store: requestedStore })
      .then((res) => {
        if (!active) return;
        if (res?.creditsCompleted || res?.message === "products are not available") {
          setProductData(null);
          setComparisonList([]);
          setError("products are not available");
          return;
        }

        if (res?.product) {
          const storeToKeep = requestedStore || stateProduct?.store || res.product.store;
          if (storeToKeep) setSelectedStore(storeToKeep);

          const comps = mergeStoreComparisons(res.product.comparison, stateProduct?.comparison, decodedName || res.product.name, stateProduct);
          const storeMatch = comps.find((c) => c.store.toLowerCase() === storeToKeep.toLowerCase()) || comps[0];

          setProductData({
            ...res.product,
            store: storeMatch?.store || storeToKeep,
            price: storeMatch?.price ?? res.product.price,
            originalPrice: storeMatch?.originalPrice ?? res.product.originalPrice,
            url: storeMatch?.url || res.product.url,
            deeplink: storeMatch?.url || res.product.url,
            link: storeMatch?.url || res.product.url,
            product_link: storeMatch?.url || res.product.url,
            rating: storeMatch?.rating ?? res.product.rating,
            storeCount: comps.length,
            comparison: comps,
          });

          setComparisonList(comps);
        } else if (stateProduct) {
          const storeToKeep = requestedStore || stateProduct.store || "Quick Commerce";
          const comps = mergeStoreComparisons(stateProduct.comparison, [], decodedName || stateProduct.name, stateProduct);
          const storeMatch = comps.find((c) => c.store.toLowerCase() === storeToKeep.toLowerCase()) || comps[0];

          setProductData({
            ...stateProduct,
            store: storeMatch?.store || storeToKeep,
            price: storeMatch?.price ?? stateProduct.price,
            originalPrice: storeMatch?.originalPrice ?? stateProduct.originalPrice,
            url: storeMatch?.url || stateProduct.url,
            deeplink: storeMatch?.url || stateProduct.url,
            link: storeMatch?.url || stateProduct.url,
            product_link: storeMatch?.url || stateProduct.url,
            storeCount: comps.length,
            comparison: comps,
          });
          setComparisonList(comps);
        } else {
          setError("No exact matches found across our supported retailers.");
        }
      })
      .catch((err) => {
        if (active) {
          const isCompleted = err?.response?.data?.creditsCompleted || err?.response?.data?.message === "products are not available";
          if (isCompleted) {
            setProductData(null);
            setComparisonList([]);
            setError("products are not available");
            return;
          }

          if (stateProduct) {
            const storeToKeep = requestedStore || stateProduct.store || "Quick Commerce";
            const comps = mergeStoreComparisons(stateProduct.comparison, [], decodedName || stateProduct.name, stateProduct);
            const storeMatch = comps.find((c) => c.store.toLowerCase() === storeToKeep.toLowerCase()) || comps[0];

            setProductData({
              ...stateProduct,
              store: storeMatch?.store || storeToKeep,
              price: storeMatch?.price ?? stateProduct.price,
              originalPrice: storeMatch?.originalPrice ?? stateProduct.originalPrice,
              url: storeMatch?.url || stateProduct.url,
              deeplink: storeMatch?.url || stateProduct.url,
              link: storeMatch?.url || stateProduct.url,
              product_link: storeMatch?.url || stateProduct.url,
              storeCount: comps.length,
              comparison: comps,
            });
            setComparisonList(comps);
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
  const lowestOffer = sortedComparisons.length > 0 ? sortedComparisons[0] : null;
  const bestPrice = lowestOffer?.price || productData?.price || null;

  const activeStore = selectedStore || productData?.store || lowestOffer?.store || "";
  const selectedOffer = sortedComparisons.find(
    (item) => item.store.toLowerCase() === activeStore.toLowerCase()
  ) || lowestOffer || (productData ? {
    store: activeStore,
    price: productData.price,
    url: productData.url,
    deeplink: productData.deeplink || productData.url,
    link: productData.link || productData.url,
    product_link: productData.product_link || productData.url,
  } : null);

  const isSelectedLowest = Boolean(
    selectedOffer && lowestOffer && selectedOffer.store.toLowerCase() === lowestOffer.store.toLowerCase()
  );

  const priceDiff = (!isSelectedLowest && selectedOffer && lowestOffer && selectedOffer.price > lowestOffer.price)
    ? (selectedOffer.price - lowestOffer.price)
    : 0;

  const savingsPct = (!isSelectedLowest && selectedOffer?.price && priceDiff > 0)
    ? Math.round((priceDiff / selectedOffer.price) * 100)
    : 0;


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
            <div className="card empty-state" style={{ marginTop: 40, padding: 48, textAlign: "center" }}>
              <div className="empty-state-icon"><FiAlertCircle size={28} /></div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>
                {error === "products are not available" ? "products are not available" : "Product Not Found"}
              </h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", marginBottom: 24 }}>
                {error === "products are not available" ? "products are not available" : error}
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/search")}>Return to Search</button>
            </div>
          )}

          {!loading && productData && (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              {}
              {/* Compare Hero Card */}
              <div className="card compare-hero" style={{ padding: 32, display: "flex", gap: 40, alignItems: "center" }}>
                <div style={{
                  width: 280, height: 280, flexShrink: 0, background: "var(--bg)",
                  borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <img src={productData.image} alt={productData.name} style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }}
                    onError={e => { e.target.src = "https://via.placeholder.com/280?text=Product"; }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Badges Bar with Store Count */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="badge badge-primary">{productData.category || "General"}</span>

                    {/* Store Availability Badge */}
                    <span
                      className="badge"
                      style={{
                        background: "#EEF2FF",
                        color: "#4338CA",
                        fontWeight: 700,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "5px 12px",
                        fontSize: 12,
                        border: "1px solid #C7D2FE"
                      }}
                    >
                      <FaStore size={12} />
                      Available in {comparisonList.length || 1} {comparisonList.length === 1 ? "Store" : "Stores"}
                    </span>

                    {/* Active Selected Store Badge */}
                    {selectedOffer?.store && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "5px 12px",
                          background: (STORE_COLORS[selectedOffer.store.toLowerCase()]?.bg || "#F3F4F6"),
                          color: (STORE_COLORS[selectedOffer.store.toLowerCase()]?.text || "var(--text-900)"),
                          borderRadius: "var(--radius-sm)",
                          fontSize: 12,
                          fontWeight: 700,
                          border: `1px solid ${STORE_COLORS[selectedOffer.store.toLowerCase()]?.text || "var(--border)"}35`
                        }}
                      >
                        <FaStore size={12} />
                        Viewing: {selectedOffer.store}
                      </span>
                    )}

                    {productData.rating ? (
                      <span className="badge" style={{ background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", gap: 4 }}>
                        <FaStar size={11} /> {Number(productData.rating).toFixed(1)} Rating
                      </span>
                    ) : (
                      <span className="badge" style={{ background: "#F0FDF4", color: "#166534", display: "flex", alignItems: "center", gap: 4 }}>
                        <FiShield size={11} /> Quick Commerce Verified
                      </span>
                    )}
                  </div>
                  
                  <h1 className="font-heading" style={{ fontSize: 30, fontWeight: 500, color: "var(--text-900)", lineHeight: 1.3, marginBottom: 12 }}>
                    {productData.name}
                  </h1>
                  
                  {productData.description && (
                    <p style={{ fontSize: 14, color: "var(--text-500)", lineHeight: 1.6, marginBottom: 16 }}>
                      {productData.description}
                    </p>
                  )}

                  {/* Multi-Store Availability Selector Chips */}
                  {sortedComparisons.length > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-600)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <FaStore size={12} /> Available across {sortedComparisons.length} {sortedComparisons.length === 1 ? "store" : "stores"} (Click to compare):
                      </div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {sortedComparisons.map((c) => {
                          const isCurrent = (selectedOffer?.store || "").toLowerCase() === c.store.toLowerCase();
                          const isLowest = lowestOffer && c.store.toLowerCase() === lowestOffer.store.toLowerCase();
                          const sColor = STORE_COLORS[c.store.toLowerCase()] || { bg: "#F3F4F6", text: "var(--text-900)" };
                          return (
                            <button
                              key={c.store}
                              type="button"
                              onClick={() => {
                                setSelectedStore(c.store);
                                setProductData(prev => ({
                                  ...prev,
                                  store: c.store,
                                  price: c.price,
                                  url: c.url || c.deeplink || prev?.url
                                }));
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "6px 14px",
                                borderRadius: "var(--radius-full)",
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: "pointer",
                                background: isCurrent ? sColor.bg : "var(--surface)",
                                color: isCurrent ? sColor.text : "var(--text-700)",
                                border: isCurrent ? `2px solid ${sColor.text}` : "1px solid var(--border)",
                                boxShadow: isCurrent ? "var(--shadow-xs)" : "none",
                                transition: "all 0.15s ease"
                              }}
                              title={`Switch to ${c.store} (₹${c.price?.toLocaleString()})`}
                            >
                              <FaStore size={11} />
                              <span>{c.store}</span>
                              <span style={{ fontWeight: 800, color: isLowest ? "var(--success)" : "inherit" }}>
                                ₹{c.price?.toLocaleString()}
                              </span>
                              {isLowest && (
                                <span style={{ fontSize: 9, background: "var(--success)", color: "#fff", padding: "1px 6px", borderRadius: 10, fontWeight: 800, textTransform: "uppercase" }}>
                                  Lowest
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dual Price Comparison Display */}
                  {priceDiff > 0 && lowestOffer && selectedOffer ? (
                    <div className="price-comparison-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                      {/* Lowest Available Price Box */}
                      <div style={{ padding: "16px 20px", background: "var(--success-light)", borderRadius: "var(--radius-md)", border: "2px solid #34D399", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success-hover)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 6 }}>
                            <FiTrendingDown size={16} /> Lowest Price on {lowestOffer.store}
                          </div>
                          <span className="badge badge-success" style={{ fontSize: 11, fontWeight: 800 }}>
                            Best Market Price
                          </span>
                        </div>
                        <div className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: "var(--success)" }}>
                          ₹{lowestOffer.price?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--success-hover)", fontWeight: 700 }}>
                          Save ₹{priceDiff.toLocaleString()} ({savingsPct}% cheaper than {selectedOffer.store})
                        </div>
                        <div style={{ marginTop: "auto", paddingTop: 8 }}>
                          <a
                            href={getDirectStoreUrl(lowestOffer.store, lowestOffer.name || productData.name, lowestOffer.deeplink || lowestOffer.url || lowestOffer.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm btn-full"
                            style={{ background: "var(--success)", borderColor: "var(--success)", color: "#fff", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px" }}
                          >
                            Buy Lowest on {lowestOffer.store} (₹{lowestOffer.price?.toLocaleString()}) <FiExternalLink size={13} />
                          </a>
                        </div>
                      </div>

                      {/* Current Selected Store Price Box */}
                      <div style={{ padding: "16px 20px", background: "var(--surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-600)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Price on {selectedOffer.store} (Selected)
                          </div>
                          <span className="badge" style={{ background: "#F3F4F6", color: "var(--text-700)", fontSize: 11 }}>
                            Selected Store
                          </span>
                        </div>
                        <div className="font-heading" style={{ fontSize: 32, fontWeight: 700, color: "var(--text-900)" }}>
                          ₹{selectedOffer.price?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>
                          +₹{priceDiff.toLocaleString()} higher than {lowestOffer.store}
                        </div>
                        <div style={{ marginTop: "auto", paddingTop: 8 }}>
                          <a
                            href={getDirectStoreUrl(selectedOffer.store, selectedOffer.name || productData.name, selectedOffer.deeplink || selectedOffer.url || selectedOffer.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline btn-sm btn-full"
                            style={{ fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 16px" }}
                          >
                            Buy on {selectedOffer.store} (₹{selectedOffer.price?.toLocaleString()}) <FiExternalLink size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Single Best Price Box when selected store IS lowest or only 1 store exists */
                    <div className="best-price-box" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "var(--success-light)", borderRadius: "var(--radius-md)", border: "2px solid #34D399", marginBottom: 16, flexWrap: "wrap" }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--success)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <FiTrendingDown size={22} />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--success-hover)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          ✓ Lowest Price on {selectedOffer?.store || productData.store} (Best Price Guaranteed)
                        </div>
                        <div className="font-heading" style={{ fontSize: 30, fontWeight: 700, color: "var(--success)" }}>
                          ₹{(bestPrice || selectedOffer?.price || productData.price)?.toLocaleString()}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--success-hover)", fontWeight: 600 }}>
                          Lowest price verified across all {comparisonList.length || 1} supported {comparisonList.length === 1 ? "store" : "stores"}
                        </div>
                      </div>

                      <div style={{ marginLeft: "auto", display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {(selectedOffer || lowestOffer || comparisonList[0]) && (() => {
                          const target = selectedOffer || lowestOffer || comparisonList[0];
                          return (
                            <a
                              href={getDirectStoreUrl(target.store, target.name || productData.name, target.deeplink || target.url || target.link)}
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
                                background: "var(--success)",
                                borderColor: "var(--success)",
                                color: "#fff",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                textDecoration: "none"
                              }}
                              title={`Buy on ${target.store}`}
                            >
                              Buy on {target.store} (₹{(target.price || productData.price)?.toLocaleString()}) <FiExternalLink size={14} />
                            </a>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Secondary Actions (Wishlist & Price Alert) */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
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
                      style={{ background: "#fff", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px" }}
                    >
                      <FiBell size={14} /> Set Price Drop Alert
                    </button>
                  </div>
                </div>
              </div>

              {/* Price Difference Explanatory Banner */}
              {priceDiff > 0 && lowestOffer && selectedOffer && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: "14px 20px",
                  borderRadius: "var(--radius-md)",
                  background: "#FFFBEB",
                  border: "1px solid #FCD34D",
                  color: "#92400E",
                  fontSize: 14,
                  fontWeight: 600,
                  flexWrap: "wrap"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <FiTrendingDown size={20} color="#D97706" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Price Alert:</strong> {productData.name} is available for <strong>₹{lowestOffer.price?.toLocaleString()} on {lowestOffer.store}</strong>, which is <strong>₹{priceDiff.toLocaleString()} less</strong> than {selectedOffer?.store}'s price of ₹{selectedOffer?.price?.toLocaleString()}.
                    </span>
                  </div>
                  <a
                    href={getDirectStoreUrl(lowestOffer.store, lowestOffer.name || productData.name, lowestOffer.deeplink || lowestOffer.url || lowestOffer.link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm"
                    style={{ background: "#D97706", color: "#fff", border: "none", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 14px", borderRadius: "var(--radius-sm)" }}
                  >
                    Buy Lowest on {lowestOffer.store} <FiExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* Live Price Comparison Table */}
              <div className="card" style={{ padding: "32px 0 0" }}>
                <div className="section-header" style={{ padding: "0 32px", marginBottom: 24 }}>
                  <div>
                    <h2 className="section-title">
                      Live Price Comparison ({comparisonList.length} {comparisonList.length === 1 ? "Store" : "Stores"} Available)
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--text-500)", marginTop: 4 }}>
                      Compare real-time prices, delivery speeds, and verified ratings across all {comparisonList.length} stores.
                    </p>
                  </div>
                </div>

                {comparisonList.length === 0 ? (
                  <div style={{ padding: "40px 32px", textAlign: "center", color: "var(--text-500)", fontSize: 14 }}>
                    No exact store listings found. Check spelling or try a broader search.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: 640 }}>
                    <thead>
                      <tr style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Retailer</th>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Delivery</th>
                        <th style={{ padding: "16px 32px", fontSize: 12, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price &amp; Comparison</th>
                        <th style={{ padding: "16px 32px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedComparisons.map((item, idx) => {
                        const storeId = item.store.toLowerCase();
                        const storeStyle = STORE_COLORS[storeId] || { text: "var(--text-700)", bg: "var(--bg)", label: item.store };
                        const isBest = lowestOffer && item.store.toLowerCase() === lowestOffer.store.toLowerCase();
                        const isSelectedStore = (selectedOffer?.store || "").toLowerCase() === item.store.toLowerCase();
                        const buyUrl = getDirectStoreUrl(item.store, item.name || productData?.name, item.deeplink || item.url || item.product_link || item.link);
                        const storeDiff = bestPrice != null && item.price > bestPrice ? (item.price - bestPrice) : 0;

                        return (
                          <tr key={idx} style={{ borderBottom: "1px solid var(--border)", transition: "var(--transition)", background: isBest ? "rgba(5,150,105,0.03)" : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                            onMouseLeave={e => e.currentTarget.style.background = isBest ? "rgba(5,150,105,0.03)" : "transparent"}
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
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                <span style={{ fontSize: 19, fontWeight: 800, color: isBest ? "var(--success)" : "var(--text-900)" }}>
                                  ₹{item.price ? Number(item.price).toLocaleString() : "N/A"}
                                </span>
                                {isBest && (
                                  <span className="badge badge-success" style={{ fontWeight: 800 }}>
                                    Lowest Price
                                  </span>
                                )}
                                {!isBest && storeDiff > 0 && (
                                  <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>
                                    +₹{storeDiff.toLocaleString()} higher
                                  </span>
                                )}
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
                                  textDecoration: "none",
                                  fontWeight: 700
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
                <div style={{ fontSize: 12, fontWeight: 600 }}>We automatically update these prices across all verified retailers in real-time.</div>
              </div>
              
            </div>
          )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .compare-hero { flex-direction: column !important; padding: 20px !important; gap: 20px !important; }
          .compare-hero > div:first-child { width: 100% !important; height: auto !important; aspect-ratio: 1; }
          .price-comparison-grid { grid-template-columns: 1fr !important; }
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