import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FiArrowLeft, FiExternalLink, FiShoppingBag, FiShield, FiCheck
} from "react-icons/fi";
import { FaStore, FaStar, FaMotorcycle } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { getLiveComparison } from "../utils/api";
import { getDirectStoreUrl } from "../utils/storeHelper";

const STORE_CONFIGS = {
  amazon: {
    name: "Amazon",
    theme: "#FF9900",
    headerBg: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)",
    badgeColor: "#C2410C",
    badgeBg: "#FFF7ED",
    tagline: "Amazon.in • India's Largest Online Store & Amazon Prime",
    defaultSla: "Prime One-Day Delivery",
  },
  flipkart: {
    name: "Flipkart",
    theme: "#2563EB",
    headerBg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
    badgeColor: "#1D4ED8",
    badgeBg: "#EFF6FF",
    tagline: "Flipkart • India Ka Electronics & Grocery Destination",
    defaultSla: "Express Delivery",
  },
  blinkit: {
    name: "BlinkIt",
    theme: "#EAB308",
    headerBg: "linear-gradient(135deg, #FEF9C3 0%, #FEF08A 100%)",
    badgeColor: "#854D0E",
    badgeBg: "#FEF9C3",
    tagline: "India's Last Minute App • 10-Min Dark Store Delivery",
    defaultSla: "10-12 mins",
  },
  zepto: {
    name: "Zepto",
    theme: "#9333EA",
    headerBg: "linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)",
    badgeColor: "#6B21A8",
    badgeBg: "#F3E8FF",
    tagline: "10-Minute Grocery Delivery • Fresh & Packed",
    defaultSla: "10 mins",
  },
  swiggy: {
    name: "Swiggy",
    theme: "#EA580C",
    headerBg: "linear-gradient(135deg, #FFEDD5 0%, #FED7AA 100%)",
    badgeColor: "#C2410C",
    badgeBg: "#FFF7ED",
    tagline: "Swiggy Instamart • Lightning Fast Groceries",
    defaultSla: "12-15 mins",
  },
  bigbasket: {
    name: "BigBasket",
    theme: "#65A30D",
    headerBg: "linear-gradient(135deg, #ECFCCB 0%, #D9F99D 100%)",
    badgeColor: "#3F6212",
    badgeBg: "#F7FEE7",
    tagline: "bbnow Instant Delivery • A TATA Enterprise",
    defaultSla: "15-20 mins",
  },
  dmart: {
    name: "DMart",
    theme: "#059669",
    headerBg: "linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)",
    badgeColor: "#047857",
    badgeBg: "#ECFDF5",
    tagline: "DMart Ready • Guaranteed Lowest Everyday Prices",
    defaultSla: "Express Same-Day",
  },
  minutes: {
    name: "Minutes",
    theme: "#2563EB",
    headerBg: "linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)",
    badgeColor: "#1D4ED8",
    badgeBg: "#EFF6FF",
    tagline: "Flipkart Minutes • Quick Commerce Delivery",
    defaultSla: "10-15 mins",
  },
  jiomart: {
    name: "JioMart",
    theme: "#0078AD",
    headerBg: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)",
    badgeColor: "#0369A1",
    badgeBg: "#F0F9FF",
    tagline: "JioMart Express • Trusted Delivery",
    defaultSla: "Express Delivery",
  },
};

export default function StoreOrderingPage() {
  const navigate = useNavigate();
  const { store: routeStore, productName: routeProductName } = useParams();
  const location = useLocation();

  const stateProduct = location.state?.product;
  const stateOffer = location.state?.storeOffer;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!stateOffer);

  // Active product & offer state
  const [productData, setProductData] = useState(stateProduct || null);
  const [offerData, setOfferData] = useState(stateOffer || null);

  const targetStore = (routeStore || stateOffer?.store || stateProduct?.store || "BlinkIt").trim();
  const storeKey = targetStore.toLowerCase();
  const storeConfig = STORE_CONFIGS[storeKey] || {
    name: targetStore,
    theme: "var(--primary)",
    headerBg: "var(--primary-light)",
    badgeColor: "var(--primary)",
    badgeBg: "var(--primary-light)",
    tagline: "Quick Commerce Verified Store Order",
    defaultSla: "10-15 mins",
  };

  const decodedName = decodeURIComponent(routeProductName || stateProduct?.name || "");

  // Load offer from live API if navigated directly via URL
  useEffect(() => {
    if (stateOffer && stateProduct) {
      setOfferData(stateOffer);
      setProductData(stateProduct);
      setLoading(false);
      return;
    }

    if (!decodedName) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getLiveComparison(decodedName, { store: targetStore })
      .then((res) => {
        if (res?.product) {
          setProductData(res.product);
          const match = Array.isArray(res.product.comparison)
            ? res.product.comparison.find((c) => c.store.toLowerCase() === storeKey)
            : null;

          if (match) {
            setOfferData(match);
          } else {
            setOfferData({
              store: targetStore,
              price: res.product.price,
              originalPrice: res.product.originalPrice || res.product.price,
              discount: res.product.discount,
              rating: res.product.rating,
              reviews: res.product.reviews,
              delivery: "10-15 mins delivery",
              image: res.product.image,
              name: res.product.name,
              url: res.product.url,
            });
          }
        }
      })
      .catch((err) => {
        console.error("Live order details load error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [decodedName, targetStore]);

  // Synchronized prices and authentic store URL
  const finalPrice = Number(offerData?.price ?? productData?.price ?? 0);
  const finalOrigPrice = Number(offerData?.originalPrice ?? productData?.originalPrice ?? finalPrice);
  const finalRating = offerData?.rating ?? productData?.rating ?? 4.5;
  const finalReviews = offerData?.reviews ?? productData?.reviews ?? 140;
  const finalDiscount = offerData?.discount ?? productData?.discount ?? (finalOrigPrice > finalPrice ? `${Math.round(((finalOrigPrice - finalPrice) / finalOrigPrice) * 100)}% OFF` : null);
  const finalSla = offerData?.delivery || storeConfig.defaultSla;

  const externalBuyUrl = getDirectStoreUrl(
    targetStore,
    offerData?.name || productData?.name || decodedName,
    offerData?.deeplink || offerData?.url || productData?.deeplink || productData?.url
  );

  // Directly redirect user to the authentic retailer ordering page
  useEffect(() => {
    if (!loading && externalBuyUrl && externalBuyUrl.startsWith("http")) {
      const timer = setTimeout(() => {
        window.location.replace(externalBuyUrl);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [loading, externalBuyUrl]);

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen((o) => !o)} />
        <div className="page-body">

          {/* Top navigation */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            style={{ padding: "8px 0", marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <FiArrowLeft size={16} /> Back to comparison
          </button>

          {loading && (
            <div className="card" style={{ padding: 48, display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
              <div className="skeleton" style={{ width: 64, height: 64, borderRadius: "50%" }} />
              <div className="skeleton" style={{ width: 280, height: 28, borderRadius: 8 }} />
              <div className="skeleton" style={{ width: 200, height: 20, borderRadius: 8 }} />
            </div>
          )}

          {!loading && !offerData && !productData && (
            <div className="card empty-state" style={{ marginTop: 40, padding: 48, textAlign: "center" }}>
              <FiShoppingBag size={48} color="var(--text-400)" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>Store Offer Not Available</h3>
              <p style={{ fontSize: 14, color: "var(--text-500)", marginBottom: 24 }}>
                We couldn't retrieve the live ordering details for {targetStore}. Please check the comparison page.
              </p>
              <button className="btn btn-primary" onClick={() => navigate("/search")}>Return to Search</button>
            </div>
          )}

          {!loading && (offerData || productData) && (
            <div
              className="card"
              style={{
                padding: "48px 32px",
                textAlign: "center",
                maxWidth: 640,
                margin: "24px auto",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-md)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: storeConfig.badgeBg,
                  color: storeConfig.badgeColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  border: `2px solid ${storeConfig.theme}40`,
                }}
              >
                <FaStore size={36} />
              </div>

              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: storeConfig.badgeBg, color: storeConfig.badgeColor, padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 12, fontWeight: 800, marginBottom: 14 }}>
                <FiShield size={13} /> {storeConfig.name} Official Product Page
              </div>

              <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--text-900)", marginBottom: 10, lineHeight: 1.3 }}>
                Redirecting to {storeConfig.name}...
              </h2>

              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-700)", marginBottom: 12, lineHeight: 1.5 }}>
                {offerData?.name || productData?.name || decodedName}
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--success)" }}>
                  ₹{finalPrice.toLocaleString()}
                </span>
                {finalOrigPrice > finalPrice && (
                  <span style={{ fontSize: 15, color: "var(--text-400)", textDecoration: "line-through" }}>
                    ₹{finalOrigPrice.toLocaleString()}
                  </span>
                )}
                {finalDiscount && (
                  <span className="badge badge-success" style={{ fontWeight: 800 }}>
                    {finalDiscount}
                  </span>
                )}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "#FEF3C7", color: "#92400E", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 800 }}>
                  <FaStar size={11} color="#F59E0B" />
                  {Number(finalRating).toFixed(1)}
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 28, lineHeight: 1.6 }}>
                Opening the official {storeConfig.name} product ordering page in a new window with verified live prices and ratings.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={externalBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    padding: "14px 32px",
                    fontSize: 15,
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    textDecoration: "none",
                  }}
                >
                  Open {storeConfig.name} Ordering Page <FiExternalLink size={16} />
                </a>

                <button
                  onClick={() => navigate(-1)}
                  className="btn btn-secondary"
                  style={{ padding: "14px 20px" }}
                >
                  Back to Comparison
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
