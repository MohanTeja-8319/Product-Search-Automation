import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiStar,
  FiChevronRight, FiChevronLeft, FiChevronDown, FiX, FiSliders, FiArrowUp, FiArrowDown,
  FiLoader, FiAlertCircle, FiShoppingBag, FiBell, FiRotateCcw, FiTag, FiExternalLink
} from "react-icons/fi";
import { FaHeart, FaStar, FaExchangeAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import WishlistButton from "../Components/WishlistButton";
import { searchLiveProducts, syncUserData } from "../utils/api";
import { isProductInWishlist } from "../utils/wishlistHelper";
import { savePriceAlert } from "../utils/alertHelper";
import { getDirectStoreUrl } from "../utils/storeHelper";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "relevance",   label: "Most Relevant" },
  { value: "price_asc",  label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc",label: "Highest Rated" },
  { value: "discount",   label: "Best Discount" },
];

const FILTER_CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "smartphones", label: "Smartphones & Mobiles" },
  { id: "laptops", label: "Laptops & PCs" },
  { id: "headphones", label: "Headphones & Audio" },
  { id: "televisions", label: "Televisions" },
  { id: "smartwatches", label: "Smartwatches" },
  { id: "groceries", label: "Groceries & Essentials" },
  { id: "fashion", label: "Fashion & Shoes" },
  { id: "beauty", label: "Beauty & Personal Care" },
  { id: "gaming", label: "Gaming Consoles" },
];

const ALL_STORES = [
  { id: "amazon", name: "Amazon", color: "#F59E0B" },
  { id: "flipkart", name: "Flipkart", color: "#2563EB" },
  { id: "blinkit", name: "BlinkIt", color: "#EAB308" },
  { id: "zepto", name: "Zepto", color: "#9333EA" },
  { id: "swiggy", name: "Swiggy", color: "#EA580C" },
  { id: "bigbasket", name: "BigBasket", color: "#65A30D" },
  { id: "myntra", name: "Myntra", color: "#E11D48" },
  { id: "nykaa", name: "Nykaa", color: "#DB2777" },
];

const STORE_BADGE_CONFIG = {
  amazon: { bg: "#FFF8E7", color: "#B45309", border: "#FDE68A", label: "Amazon" },
  flipkart: { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE", label: "Flipkart" },
  blinkit: { bg: "#FEF9C3", color: "#854D0E", border: "#FDE047", label: "BlinkIt" },
  zepto: { bg: "#F3E8FF", color: "#6B21A8", border: "#E9D5FF", label: "Zepto" },
  swiggy: { bg: "#FFF7ED", color: "#C2410C", border: "#FFEDD5", label: "Swiggy" },
  bigbasket: { bg: "#F7FEE7", color: "#3F6212", border: "#ECFCCB", label: "BigBasket" },
  myntra: { bg: "#FFF1F2", color: "#BE123C", border: "#FECDD3", label: "Myntra" },
  nykaa: { bg: "#FDF2F8", color: "#BE185D", border: "#FCE7F3", label: "Nykaa" },
};

function getNumericPrice(val) {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function getDiscountPercent(p) {
  if (p?.discount) {
    const parsed = parseInt(String(p.discount).replace(/[^0-9]/g, ""), 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) return parsed;
  }
  const price = getNumericPrice(p?.price);
  const orig = getNumericPrice(p?.originalPrice);
  if (orig > price && price > 0) {
    return Math.round(((orig - price) / orig) * 100);
  }
  return 0;
}

function matchesCategory(product = {}, filterCat = "") {
  if (!filterCat || filterCat === "all") return true;
  const p = typeof product === "string" 
    ? product.toLowerCase() 
    : `${product.category || ""} ${product.name || product.title || ""} ${product.brand || ""}`.toLowerCase();
  const f = filterCat.toLowerCase();
  
  if (f === "mobiles" || f === "smartphones") {
    return (p.includes("phone") || p.includes("mobile") || p.includes("smartphone") || p.includes("iphone") || p.includes("galaxy") || p.includes("oneplus") || p.includes("realme") || p.includes("vivo")) && !p.includes("watch") && !p.includes("tv");
  }
  if (f === "laptops") {
    return p.includes("laptop") || p.includes("macbook") || p.includes("computer") || p.includes("pc") || p.includes("ideapad") || p.includes("pavilion") || p.includes("strix");
  }
  if (f === "headphones" || f === "audio") {
    return p.includes("headphone") || p.includes("audio") || p.includes("earphone") || p.includes("airpod") || p.includes("sound") || p.includes("speaker") || p.includes("airdopes") || p.includes("neckband");
  }
  if (f === "televisions" || f === "tv") {
    return p.includes("television") || p.includes("tv") || p.includes("oled") || p.includes("qled") || p.includes("bravia");
  }
  if (f === "smartwatches" || f === "watches") {
    return p.includes("watch") || p.includes("wearable") || p.includes("smartwatch") || p.includes("colorfit");
  }
  if (f === "gaming") {
    return p.includes("gaming") || p.includes("console") || p.includes("playstation") || p.includes("xbox") || p.includes("nintendo") || p.includes("switch");
  }
  if (f === "groceries") {
    return p.includes("grocer") || p.includes("food") || p.includes("snack") || p.includes("oil") || p.includes("milk") || p.includes("tea") || p.includes("coffee") || p.includes("atta") || p.includes("noodle") || p.includes("detergent") || p.includes("amul") || p.includes("tata") || p.includes("cadbury") || p.includes("fortune") || p.includes("nescafe") || p.includes("aashirvaad") || p.includes("surf") || p.includes("nandini") || p.includes("delight");
  }
  if (f === "fashion") {
    return p.includes("fashion") || p.includes("shoe") || p.includes("cloth") || p.includes("apparel") || p.includes("shirt") || p.includes("sneaker") || p.includes("jeans") || p.includes("nike") || p.includes("puma") || p.includes("adidas") || p.includes("levi");
  }
  if (f === "beauty") {
    return p.includes("beauty") || p.includes("cosmetic") || p.includes("serum") || p.includes("skin") || p.includes("hair") || p.includes("lakme") || p.includes("maybelline") || p.includes("sunscreen") || p.includes("niacinamide");
  }
  return p.includes(f);
}

function getDisplayProduct(p, selectedStores) {
  if (!selectedStores || selectedStores.length === 0) return p;
  const pStore = String(p.store || "").toLowerCase().replace(/[^a-z]/g, "");
  const matchesPrimary = selectedStores.some(s => pStore.includes(s.toLowerCase()));
  if (matchesPrimary) return p;

  if (Array.isArray(p.comparison)) {
    const compMatch = p.comparison.find(c => {
      const cStore = String(c.store || c.name || "").toLowerCase().replace(/[^a-z]/g, "");
      return selectedStores.some(s => cStore.includes(s.toLowerCase()));
    });
    if (compMatch) {
      return {
        ...p,
        store: compMatch.store || compMatch.name || p.store,
        price: compMatch.price || p.price,
        originalPrice: compMatch.originalPrice || p.originalPrice,
        discount: compMatch.discount || p.discount,
        link: compMatch.link || p.link,
        rating: compMatch.rating || p.rating,
        delivery: compMatch.delivery || p.delivery
      };
    }
  }
  return p;
}

function StoreBadge({ store, storeCount }) {
  const key = (store || "").toLowerCase().replace(/[^a-z]/g, "");
  const conf = STORE_BADGE_CONFIG[key] || { bg: "var(--primary-light)", color: "var(--primary)", border: "transparent", label: store || "Store" };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        padding: "3px 8px",
        background: conf.bg,
        color: conf.color,
        border: `1px solid ${conf.border}`,
        borderRadius: "var(--radius-sm)",
        textTransform: "uppercase",
        letterSpacing: "0.05em"
      }}>
        {store || "Verified Store"}
      </span>
      {storeCount > 1 && (
        <span style={{
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 6px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--text-600)",
          borderRadius: "var(--radius-sm)",
          display: "inline-flex",
          alignItems: "center",
          gap: 3
        }}>
          <FaExchangeAlt size={8} style={{ color: "var(--primary)" }} />
          +{storeCount - 1} stores
        </span>
      )}
    </div>
  );
}

function ProductCard({ product, view, onCompare, onTrack }) {
  const storeCount = product.storeCount || (Array.isArray(product.comparison) ? product.comparison.length : 1);
  const numPrice = getNumericPrice(product.price);
  const numOrigPrice = getNumericPrice(product.originalPrice);
  const discountPct = getDiscountPercent(product);

  if (view === "list") {
    return (
      <div className="card card-hover" onClick={onCompare}
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 80, height: 80, flexShrink: 0, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={e => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"; }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
            <FaStar size={11} style={{ color: "#F59E0B" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-800)" }}>
              {product.rating ? Number(product.rating).toFixed(1) : "4.3"}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-400)" }}>
              ({Number(product.reviews || 280).toLocaleString()} reviews)
            </span>
          </div>
          <StoreBadge store={product.store} storeCount={storeCount} />
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--success)" }}>₹{numPrice.toLocaleString("en-IN")}</span>
            {numOrigPrice > numPrice && (
              <span style={{ fontSize: 12, color: "var(--text-400)", textDecoration: "line-through" }}>₹{numOrigPrice.toLocaleString("en-IN")}</span>
            )}
            {discountPct > 0 && <span className="badge badge-success">{discountPct}% OFF</span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <WishlistButton product={product} size={32} iconSize={13} />
          <button onClick={onCompare} className="btn btn-primary btn-sm">
            <FaExchangeAlt size={11} /> Compare
          </button>
          <a
            href={getDirectStoreUrl(product.store, product.name, product.url)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="btn btn-outline btn-sm"
            style={{ padding: "7px 10px", display: "inline-flex", alignItems: "center", gap: 5, textDecoration: "none", borderColor: "var(--border)", color: "var(--text-900)" }}
            title={`Go to ${product.store || "Store"}`}
          >
            Go to {product.store || "Store"} <FiExternalLink size={12} />
          </a>
          <button onClick={(e) => { e.stopPropagation(); onTrack(); }} className="btn btn-outline btn-sm" style={{ padding: "7px 10px", borderColor: "var(--border)", color: "var(--text-900)" }}>
            <FiBell size={13} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card card-hover animate-fade-in-up" onClick={onCompare}
      style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
      <div style={{ position: "absolute", top: 12, right: 12, zIndex: 3 }}>
        <WishlistButton product={product} size={30} iconSize={12} />
      </div>

      <button onClick={(e) => { e.stopPropagation(); onTrack(); }} style={{
        position: "absolute", top: 12, right: 48, width: 30, height: 30,
        borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 2, color: "var(--text-900)",
        transition: "var(--transition)", boxShadow: "var(--shadow-xs)"
      }}>
        <FiBell size={12} />
      </button>

      {discountPct > 0 && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          <span className="badge badge-success">{discountPct}% OFF</span>
        </div>
      )}

      <div style={{ height: 150, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: discountPct > 0 ? 20 : 0 }}>
        <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"; }} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {product.name}
      </h3>

      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <FaStar size={11} style={{ color: "#F59E0B" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-800)" }}>
          {product.rating ? Number(product.rating).toFixed(1) : "4.3"}
        </span>
        <span style={{ fontSize: 10, color: "var(--text-400)" }}>
          ({Number(product.reviews || 280).toLocaleString()})
        </span>
      </div>

      <StoreBadge store={product.store} storeCount={storeCount} />

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: "auto" }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: "var(--success)" }}>₹{numPrice.toLocaleString("en-IN")}</span>
        {numOrigPrice > numPrice && (
          <span style={{ fontSize: 11, color: "var(--text-400)", textDecoration: "line-through" }}>₹{numOrigPrice.toLocaleString("en-IN")}</span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 6, marginTop: 4 }}>
        <button onClick={onCompare} className="btn btn-primary btn-sm" style={{ width: "100%", justifyContent: "center" }}>
          <FaExchangeAlt size={11} /> Compare Prices
        </button>
        <a
          href={getDirectStoreUrl(product.store, product.name, product.url)}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="btn btn-outline btn-sm"
          style={{
            padding: "7px 10px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            borderColor: "var(--border)",
            color: "var(--text-900)",
            textDecoration: "none"
          }}
          title={`Go to ${product.store || "Store"}`}
        >
          <FiExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const paramCategory = searchParams.get("category") || "";

  const [products, setProducts] = useState(() => {
    try {
      const cached = localStorage.getItem("cachedSearchProducts") || localStorage.getItem("cachedHomeProducts");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  // Filter States
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(paramCategory || "all");
  const [selectedStores, setSelectedStores] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Price Alert Modal
  const [alertProduct, setAlertProduct] = useState(null);
  const [targetPriceInput, setTargetPriceInput] = useState("");

  // Reset to page 1 whenever any filter, store, or query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStores, minPrice, maxPrice, minRating, minDiscount, selectedCategory, sort, query]);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (paramCategory) {
      setSelectedCategory(paramCategory);
    } else if (query) {
      const qLower = query.toLowerCase();
      if (/tv|television/i.test(qLower)) setSelectedCategory("televisions");
      else if (/watch|smartwatch/i.test(qLower)) setSelectedCategory("smartwatches");
      else if (/gaming|console|ps5|xbox|switch/i.test(qLower)) setSelectedCategory("gaming");
      else if (/phone|mobile|smartphone/i.test(qLower)) setSelectedCategory("smartphones");
      else if (/laptop|macbook|computer/i.test(qLower)) setSelectedCategory("laptops");
      else if (/headphone|earphone|audio|airpod/i.test(qLower)) setSelectedCategory("headphones");
      else if (/grocer|food|milk|snack|tea/i.test(qLower)) setSelectedCategory("groceries");
      else if (/fashion|shoe|sneaker|cloth|jean/i.test(qLower)) setSelectedCategory("fashion");
      else if (/beauty|cosmetic|skin|serum/i.test(qLower)) setSelectedCategory("beauty");
      else setSelectedCategory("all");
    } else {
      setSelectedCategory("all");
    }
  }, [paramCategory, query]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const q = (query || "popular").trim();
    setLoading(true);
    setError("");
    searchLiveProducts(q)
      .then(res => {
        const list = res?.products || [];
        setProducts(list);
        if (list.length > 0) {
          try {
            localStorage.setItem("cachedSearchProducts", JSON.stringify(list));
          } catch (_) {}
        }
        
        // Save history with parsed query and timestamp if query was provided
        const finalQuery = (res?.query || query || "").trim();
        if (finalQuery && query) {
          try {
            const stored = localStorage.getItem("searchHistory");
            let hist = [];
            if (stored) {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                hist = parsed
                  .map(item => {
                    if (typeof item === "string") return { term: item, time: new Date().toISOString() };
                    return {
                      term: item?.term || item?.query || "",
                      time: item?.time || new Date().toISOString(),
                    };
                  })
                  .filter(item => item.term && item.term.trim());
              }
            }
            hist = hist.filter(item => item.term.toLowerCase() !== finalQuery.toLowerCase()); 
            hist.unshift({ term: finalQuery, time: new Date().toISOString() }); 
            if (hist.length > 25) hist = hist.slice(0, 25); 
            localStorage.setItem("searchHistory", JSON.stringify(hist));
            if (localStorage.getItem("token")) {
              syncUserData({ searchHistory: hist }).catch(() => {});
            }
          } catch(err) {
            console.error("Failed to save search history:", err);
          }
        }
      })
      .catch(err => {
        if (!query) {
          try {
            const cached = localStorage.getItem("cachedSearchProducts") || localStorage.getItem("cachedHomeProducts");
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setProducts(parsed);
                return;
              }
            }
          } catch (_) {}
        }
        setError(err.message || "Search failed.");
      })
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchInput.trim()) {
      const q = searchInput.trim();
      setSearchParams({ q });
    }
  };

  const toggleStore = (storeId) => {
    setSelectedStores(prev => 
      prev.includes(storeId) ? prev.filter(s => s !== storeId) : [...prev, storeId]
    );
  };

  const handleClearAllFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setMinDiscount("");
    setSelectedCategory("all");
    setSelectedStores([]);
    setCurrentPage(1);
  };

  const activeFilterCount = (
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (minRating ? 1 : 0) +
    (minDiscount ? 1 : 0) +
    (selectedCategory && selectedCategory !== "all" ? 1 : 0) +
    selectedStores.length
  );

  // Compute Filtered and Sorted Products
  const filtered = useMemo(() => {
    return products
      .map(p => getDisplayProduct(p, selectedStores))
      .filter(p => {
        const price = getNumericPrice(p.price);

        // 1. Min Price
        if (minPrice && price < Number(minPrice)) return false;

        // 2. Max Price
        if (maxPrice && price > Number(maxPrice)) return false;

        // 3. Min Rating
        if (minRating && (Number(p.rating) || 0) < Number(minRating)) return false;

        // 4. Min Discount
        if (minDiscount && getDiscountPercent(p) < Number(minDiscount)) return false;

        // 5. Category
        if (selectedCategory && selectedCategory !== "all") {
          if (!matchesCategory(p, selectedCategory)) return false;
        }

        // 6. Retailers / Stores
        if (selectedStores.length > 0) {
          const pStore = String(p.store || "").toLowerCase().replace(/[^a-z]/g, "");
          const compStores = Array.isArray(p.comparison)
            ? p.comparison.map(c => String(c.store || c.name || "").toLowerCase().replace(/[^a-z]/g, ""))
            : [];
          const extraStores = Array.isArray(p.stores)
            ? p.stores.map(s => String(s).toLowerCase().replace(/[^a-z]/g, ""))
            : [];
          const allProductStores = [pStore, ...compStores, ...extraStores];
          const hasStoreMatch = selectedStores.some(sel =>
            allProductStores.some(st => st.includes(sel.toLowerCase()))
          );
          if (!hasStoreMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = getNumericPrice(a.price);
        const priceB = getNumericPrice(b.price);
        if (sort === "price_asc") return priceA - priceB;
        if (sort === "price_desc") return priceB - priceA;
        if (sort === "rating_desc") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (sort === "discount") return getDiscountPercent(b) - getDiscountPercent(a);
        return 0; // relevance preserves original order
      });
  }, [products, minPrice, maxPrice, minRating, minDiscount, selectedCategory, selectedStores, sort]);

  // Pagination Calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedProducts = useMemo(() => {
    return filtered.slice(startIndex, endIndex);
  }, [filtered, startIndex, endIndex]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === safeCurrentPage) return;
    setCurrentPage(newPage);
    const targetEl = document.querySelector(".search-layout") || document.body;
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("...");
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const SkeletonCard = () => (
    <div className="card" style={{ padding: 18 }}>
      <div className="skeleton" style={{ height: 150, borderRadius: "var(--radius-md)", marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 13, borderRadius: 4, marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 13, width: "70%", borderRadius: 4, marginBottom: 14 }} />
      <div className="skeleton" style={{ height: 20, width: "40%", borderRadius: 4, marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 34, borderRadius: "var(--radius-md)" }} />
    </div>
  );

  return (
    <div className="page-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onMenuToggle={() => setSidebarOpen(o => !o)} />
        <div className="page-body">

          {/* Search Header Bar */}
          <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
            <div className="input-group" style={{ borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ padding: "0 0 0 20px", color: "var(--text-400)", display: "flex" }}>
                <FiSearch size={18} />
              </span>
              <input className="input" type="text" placeholder="Search across Amazon, Flipkart, BlinkIt, Zepto & more..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{ border: "none", boxShadow: "none", fontSize: 15, padding: "13px 16px" }} />
              {searchInput && (
                <button type="button" onClick={() => setSearchInput("")}
                  style={{ padding: "0 8px", background: "none", border: "none", color: "var(--text-400)", cursor: "pointer", display: "flex" }}>
                  <FiX size={16} />
                </button>
              )}
              <button type="submit" className="btn btn-primary btn-pill" style={{ margin: "5px", padding: "10px 28px" }}>
                Search
              </button>
            </div>
          </form>

          {/* Mobile Filter Toggle Button */}
          <div className="mobile-filter-bar" style={{ display: "none", marginBottom: 16 }}>
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="btn btn-outline btn-full"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px" }}
            >
              <FiFilter size={15} />
              {mobileFiltersOpen ? "Hide Filters" : `Show Filters ${activeFilterCount > 0 ? `(${activeFilterCount})` : ""}`}
            </button>
          </div>

          <div className="search-layout" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

            {/* Sticky Filters Sidebar */}
            <aside
              className={`search-filters ${mobileFiltersOpen ? "mobile-open" : ""}`}
              style={{
                width: 250,
                flexShrink: 0,
                position: "sticky",
                top: "calc(var(--navbar-height, 72px) + 20px)",
                alignSelf: "flex-start",
                zIndex: 25,
              }}
            >
              <div
                className="sticky-filter-card"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 18px",
                  maxHeight: "calc(100vh - var(--navbar-height, 72px) - 36px)",
                  overflowY: "auto",
                  overscrollBehavior: "contain",
                  boxShadow: "var(--shadow-sm)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                
                {/* Filters Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, borderBottom: "1px solid var(--border)", paddingBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <FiSliders size={16} style={{ color: "var(--primary)" }} />
                    <h3 className="font-heading" style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)", margin: 0 }}>Filters</h3>
                    {activeFilterCount > 0 && (
                      <span style={{
                        background: "var(--primary)", color: "#fff", fontSize: 11, fontWeight: 700,
                        borderRadius: "var(--radius-full)", padding: "1px 7px"
                      }}>
                        {activeFilterCount}
                      </span>
                    )}
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={handleClearAllFilters}
                      style={{
                        background: "none", border: "none", color: "#EF4444", fontSize: 12,
                        fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "2px 6px", borderRadius: 4
                      }}
                    >
                      <FiRotateCcw size={11} /> Reset
                    </button>
                  )}
                </div>

                {/* 1. Category Filter */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="input"
                    style={{ fontSize: 13, padding: "8px 10px", width: "100%", cursor: "pointer", background: "var(--surface)", color: "var(--text-900)" }}
                  >
                    {FILTER_CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Price Range (Min & Max) */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                      Price Range (₹)
                    </label>
                    {(minPrice || maxPrice) && (
                      <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} style={{ background: "none", border: "none", color: "var(--text-400)", fontSize: 11, cursor: "pointer", padding: 0 }}>
                        Clear
                      </button>
                    )}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div>
                      <input
                        className="input"
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => setMinPrice(e.target.value)}
                        style={{ fontSize: 12, padding: "7px 10px", width: "100%" }}
                      />
                    </div>
                    <div>
                      <input
                        className="input"
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => setMaxPrice(e.target.value)}
                        style={{ fontSize: 12, padding: "7px 10px", width: "100%" }}
                      />
                    </div>
                  </div>
                  {/* Quick Price Presets */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {[
                      { label: "< ₹1K", min: "", max: "1000" },
                      { label: "< ₹10K", min: "", max: "10000" },
                      { label: "< ₹50K", min: "", max: "50000" },
                      { label: "₹50K+", min: "50000", max: "" },
                    ].map((preset) => {
                      const isActive = minPrice === preset.min && maxPrice === preset.max;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            if (isActive) { setMinPrice(""); setMaxPrice(""); }
                            else { setMinPrice(preset.min); setMaxPrice(preset.max); }
                          }}
                          style={{
                            fontSize: 11, padding: "3px 7px", borderRadius: "var(--radius-sm)",
                            border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                            background: isActive ? "var(--primary-light)" : "transparent",
                            color: isActive ? "var(--primary)" : "var(--text-600)",
                            cursor: "pointer", transition: "var(--transition)"
                          }}
                        >
                          {preset.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Retailers / Stores */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                      Retailers {selectedStores.length > 0 ? `(${selectedStores.length})` : ""}
                    </label>
                    {selectedStores.length > 0 && (
                      <button onClick={() => setSelectedStores([])} style={{ background: "none", border: "none", color: "var(--text-400)", fontSize: 11, cursor: "pointer", padding: 0 }}>
                        Clear
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 210, overflowY: "auto", paddingRight: 4 }}>
                    {ALL_STORES.map(store => {
                      const isChecked = selectedStores.includes(store.id);
                      return (
                        <label key={store.id} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          cursor: "pointer", fontSize: 13, color: isChecked ? "var(--text-900)" : "var(--text-700)",
                          padding: "4px 6px", borderRadius: "var(--radius-sm)",
                          background: isChecked ? "var(--surface-hover)" : "transparent"
                        }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleStore(store.id)}
                              style={{ accentColor: "var(--primary)", width: 15, height: 15, cursor: "pointer" }}
                            />
                            <span>{store.name}</span>
                          </span>
                          <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: store.color, display: "inline-block"
                          }} />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Minimum Rating */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                      Min Rating
                    </label>
                    {minRating && (
                      <button onClick={() => setMinRating("")} style={{ background: "none", border: "none", color: "var(--text-400)", fontSize: 11, cursor: "pointer", padding: 0 }}>
                        Clear
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[3, 4, 4.5].map(r => {
                      const isActive = Number(minRating) === r;
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setMinRating(isActive ? "" : String(r))}
                          style={{
                            flex: 1, padding: "6px 0", borderRadius: "var(--radius-sm)",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            border: `1px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                            background: isActive ? "var(--primary-light)" : "transparent",
                            color: isActive ? "var(--primary)" : "var(--text-600)",
                            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 3,
                            transition: "var(--transition)"
                          }}
                        >
                          {r} <FaStar size={10} style={{ color: isActive ? "var(--primary)" : "#F59E0B" }} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Minimum Discount */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
                      Min Discount
                    </label>
                    {minDiscount && (
                      <button onClick={() => setMinDiscount("")} style={{ background: "none", border: "none", color: "var(--text-400)", fontSize: 11, cursor: "pointer", padding: 0 }}>
                        Clear
                      </button>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {[10, 20, 30, 50].map(d => {
                      const isActive = Number(minDiscount) === d;
                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setMinDiscount(isActive ? "" : String(d))}
                          style={{
                            flex: 1, minWidth: "40px", padding: "6px 0", borderRadius: "var(--radius-sm)",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            border: `1px solid ${isActive ? "var(--text-900)" : "var(--border)"}`,
                            background: isActive ? "var(--text-900)" : "transparent",
                            color: isActive ? "var(--bg)" : "var(--text-600)",
                            textAlign: "center",
                            transition: "var(--transition)"
                          }}
                        >
                          {d}%+
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Clear Button */}
                {activeFilterCount > 0 && (
                  <button className="btn btn-outline btn-sm btn-full"
                    onClick={handleClearAllFilters}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <FiRotateCcw size={12} /> Clear All Filters
                  </button>
                )}
              </div>
            </aside>

            {/* Product Grid Area */}
            <div style={{ flex: 1, minWidth: 0 }}>

              {/* Top Bar (Count, Active Badges, Sort, Grid/List) */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
                <div>
                  {query && !loading && (
                    <div style={{ fontSize: 14, color: "var(--text-600)" }}>
                      {filtered.length > 0 ? (
                        <>
                          <span style={{ fontWeight: 800, color: "var(--text-900)" }}>{filtered.length}</span> results for <span style={{ fontWeight: 700, color: "var(--primary)" }}>"{query}"</span>
                          {totalPages > 1 && (
                            <span style={{ fontSize: 12, color: "var(--text-500)", marginLeft: 6 }}>
                              (Page {safeCurrentPage} of {totalPages})
                            </span>
                          )}
                        </>
                      ) : (
                        <span>0 matches found for "{query}"</span>
                      )}
                    </div>
                  )}
                  {!query && !loading && (
                    <div style={{ fontSize: 14, color: "var(--text-600)" }}>
                      <span style={{ fontWeight: 800, color: "var(--text-900)" }}>{filtered.length}</span> products across 8 live stores
                      {totalPages > 1 && (
                        <span style={{ fontSize: 12, color: "var(--text-500)", marginLeft: 6 }}>
                          (Page {safeCurrentPage} of {totalPages})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Sort Dropdown */}
                  <div style={{ position: "relative" }} ref={sortRef}>
                    <button type="button" onClick={() => setSortOpen(!sortOpen)}
                      style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "7px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)", color: "var(--text-700)", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                      <span>Sort: <strong>{SORT_OPTIONS.find(o => o.value === sort)?.label}</strong></span>
                      <FiChevronDown />
                    </button>
                    {sortOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "4px", zIndex: 10, boxShadow: "var(--shadow-md)", minWidth: 180 }}>
                        {SORT_OPTIONS.map(o => (
                          <button key={o.value} type="button" onClick={() => { setSort(o.value); setSortOpen(false); }}
                            onMouseEnter={e => {
                              if (sort !== o.value) e.currentTarget.style.background = 'var(--surface-hover)';
                            }}
                            onMouseLeave={e => {
                              if (sort !== o.value) e.currentTarget.style.background = 'transparent';
                            }}
                            style={{
                              display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 13,
                              color: sort === o.value ? "var(--primary)" : "var(--text-700)",
                              background: sort === o.value ? "var(--primary-light)" : "transparent",
                              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "var(--transition)",
                              fontWeight: sort === o.value ? 600 : 400
                            }}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Switcher */}
                  <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                    {[{ v: "grid", Icon: FiGrid }, { v: "list", Icon: FiList }].map(({ v, Icon }) => (
                      <button key={v} onClick={() => setView(v)}
                        style={{
                          padding: "7px 10px", border: "none", cursor: "pointer",
                          background: view === v ? "var(--primary-light)" : "var(--surface)",
                          color: view === v ? "var(--primary)" : "var(--text-400)",
                          transition: "var(--transition)"
                        }}>
                        <Icon size={15} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filter Chips / Badges Bar */}
              {activeFilterCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 20, background: "var(--surface)", padding: "10px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-600)", display: "flex", alignItems: "center", gap: 4 }}>
                    <FiTag size={13} /> Active Filters:
                  </span>

                  {selectedCategory !== "all" && (
                    <span style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", fontSize: 12, color: "var(--text-800)" }}>
                      Category: <strong>{FILTER_CATEGORIES.find(c => c.id === selectedCategory)?.label || selectedCategory}</strong>
                      <FiX style={{ cursor: "pointer", color: "var(--text-400)" }} onClick={() => setSelectedCategory("all")} />
                    </span>
                  )}

                  {(minPrice || maxPrice) && (
                    <span style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", fontSize: 12, color: "var(--text-800)" }}>
                      Price: <strong>₹{minPrice || 0} - ₹{maxPrice || "Any"}</strong>
                      <FiX style={{ cursor: "pointer", color: "var(--text-400)" }} onClick={() => { setMinPrice(""); setMaxPrice(""); }} />
                    </span>
                  )}

                  {selectedStores.map(st => (
                    <span key={st} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", fontSize: 12, color: "var(--text-800)", textTransform: "capitalize" }}>
                      Store: <strong>{st}</strong>
                      <FiX style={{ cursor: "pointer", color: "var(--text-400)" }} onClick={() => toggleStore(st)} />
                    </span>
                  ))}

                  {minRating && (
                    <span style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", fontSize: 12, color: "var(--text-800)" }}>
                      Rating: <strong>{minRating}+ ★</strong>
                      <FiX style={{ cursor: "pointer", color: "var(--text-400)" }} onClick={() => setMinRating("")} />
                    </span>
                  )}

                  {minDiscount && (
                    <span style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 8px", fontSize: 12, color: "var(--text-800)" }}>
                      Discount: <strong>{minDiscount}%+ OFF</strong>
                      <FiX style={{ cursor: "pointer", color: "var(--text-400)" }} onClick={() => setMinDiscount("")} />
                    </span>
                  )}

                  <button
                    onClick={handleClearAllFilters}
                    style={{
                      background: "transparent", border: "none", color: "#EF4444",
                      fontSize: 12, fontWeight: 700, cursor: "pointer", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4
                    }}
                  >
                    <FiRotateCcw size={11} /> Clear all
                  </button>
                </div>
              )}

              {/* Skeletons while loading */}
              {loading && (
                <div className={view === "list" ? "" : "products-grid"} style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div className="card empty-state">
                  <div className="empty-state-icon"><FiAlertCircle size={28} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>Search Error</h3>
                  <p style={{ fontSize: 13, color: "var(--text-400)" }}>{error}</p>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filtered.length === 0 && (
                <div className="card empty-state" style={{ padding: "48px 20px", textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--text-400)" }}>
                    <FiShoppingBag size={28} />
                  </div>
                  {products.length > 0 ? (
                    <>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>
                        No products match your current filters
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 20, maxWidth: 420, margin: "0 auto 20px" }}>
                        Found {products.length} live products, but none met all the selected filters. Try clearing or expanding your price, rating, or store filters.
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ margin: "0 auto", display: "inline-flex", alignItems: "center", gap: 6 }}
                        onClick={handleClearAllFilters}
                      >
                        <FiRotateCcw size={12} /> Reset All Filters
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-900)", marginBottom: 8 }}>
                        {query ? `No results found for "${query}"` : "No products available"}
                      </h3>
                      <p style={{ fontSize: 13, color: "var(--text-500)", marginBottom: 20 }}>
                        Try searching for smartphones, headphones, laptops, groceries, or shoes.
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ margin: "0 auto" }}
                        onClick={() => {
                          setSearchInput("");
                          setSearchParams({});
                          handleClearAllFilters();
                        }}
                      >
                        Browse Popular Products
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Filtered Product Grid / List */}
              {!loading && !error && filtered.length > 0 && (
                <>
                  <div className={view === "list" ? "" : "products-grid"} style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                    {paginatedProducts.map((product, i) => (
                      <ProductCard
                        key={`${product.id || 'prod'}-${startIndex + i}`}
                        product={product}
                        view={view}
                        onCompare={() => navigate(`/comparison/${encodeURIComponent(product.name)}`, { state: { product } })}
                        onTrack={() => {
                          setAlertProduct(product);
                          setTargetPriceInput(Math.round(getNumericPrice(product.price) * 0.9));
                        }}
                      />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination-bar" style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 16,
                      marginTop: 32,
                      padding: "16px 20px",
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      boxShadow: "var(--shadow-xs)"
                    }}>
                      {/* Showing Info */}
                      <div style={{ fontSize: 13, color: "var(--text-600)" }}>
                        Showing <strong style={{ color: "var(--text-900)" }}>{totalItems > 0 ? startIndex + 1 : 0}–{endIndex}</strong> of <strong style={{ color: "var(--text-900)" }}>{totalItems}</strong> products
                        <span style={{ marginLeft: 6, color: "var(--text-400)" }}>(Page {safeCurrentPage} of {totalPages})</span>
                      </div>

                      {/* Page Buttons (Previous, 1, 2, 3..., Next) */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {/* Prev Button */}
                        <button
                          type="button"
                          onClick={() => handlePageChange(safeCurrentPage - 1)}
                          disabled={safeCurrentPage === 1}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "8px 12px",
                            borderRadius: "var(--radius-md)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: safeCurrentPage === 1 ? "not-allowed" : "pointer",
                            background: "var(--surface-hover)",
                            border: "1px solid var(--border)",
                            color: safeCurrentPage === 1 ? "var(--text-400)" : "var(--text-800)",
                            opacity: safeCurrentPage === 1 ? 0.5 : 1,
                            transition: "var(--transition)"
                          }}
                        >
                          <FiChevronLeft size={14} /> Previous
                        </button>

                        {/* Page Numbers */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {getPageNumbers().map((p, idx) => {
                            if (p === "...") {
                              return <span key={`ellipsis-${idx}`} style={{ padding: "0 6px", color: "var(--text-400)", fontSize: 13 }}>...</span>;
                            }
                            const isCurrent = p === safeCurrentPage;
                            return (
                              <button
                                key={p}
                                type="button"
                                onClick={() => handlePageChange(p)}
                                style={{
                                  minWidth: 36,
                                  height: 36,
                                  padding: "0 10px",
                                  borderRadius: "var(--radius-md)",
                                  fontSize: 13,
                                  fontWeight: isCurrent ? 700 : 500,
                                  cursor: "pointer",
                                  border: isCurrent ? "1px solid var(--primary)" : "1px solid var(--border)",
                                  background: isCurrent ? "var(--primary)" : "transparent",
                                  color: isCurrent ? "var(--primary-content)" : "var(--text-700)",
                                  boxShadow: isCurrent ? "var(--shadow-xs)" : "none",
                                  transition: "var(--transition)"
                                }}
                              >
                                {p}
                              </button>
                            );
                          })}
                        </div>

                        {/* Next Button */}
                        <button
                          type="button"
                          onClick={() => handlePageChange(safeCurrentPage + 1)}
                          disabled={safeCurrentPage === totalPages}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "8px 12px",
                            borderRadius: "var(--radius-md)",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: safeCurrentPage === totalPages ? "not-allowed" : "pointer",
                            background: "var(--surface-hover)",
                            border: "1px solid var(--border)",
                            color: safeCurrentPage === totalPages ? "var(--text-400)" : "var(--text-800)",
                            opacity: safeCurrentPage === totalPages ? 0.5 : 1,
                            transition: "var(--transition)"
                          }}
                        >
                          Next <FiChevronRight size={14} />
                        </button>
                      </div>

                      {/* Items Per Page Selector */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-500)" }}>
                        <span>Per page:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          style={{
                            background: "var(--bg)",
                            border: "1px solid var(--border)",
                            color: "var(--text-800)",
                            borderRadius: "var(--radius-sm)",
                            padding: "4px 8px",
                            fontSize: 12,
                            cursor: "pointer"
                          }}
                        >
                          <option value={6}>6 items</option>
                          <option value={9}>9 items</option>
                          <option value={12}>12 items</option>
                          <option value={18}>18 items</option>
                        </select>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .sticky-filter-card::-webkit-scrollbar {
          width: 5px;
        }
        .sticky-filter-card::-webkit-scrollbar-track {
          background: transparent;
        }
        .sticky-filter-card::-webkit-scrollbar-thumb {
          background: var(--border-hover, #333333);
          border-radius: 4px;
        }
        .sticky-filter-card {
          scrollbar-width: thin;
          scrollbar-color: var(--border-hover, #333333) transparent;
        }
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .mobile-filter-bar { display: block !important; }
          .search-layout { flex-direction: column !important; }
          .search-filters {
            width: 100% !important;
            position: static !important;
            top: auto !important;
            display: none !important;
          }
          .search-filters.mobile-open {
            display: block !important;
          }
          .sticky-filter-card {
            max-height: none !important;
            overflow-y: visible !important;
          }
          .products-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>

      {/* Price Alert Modal */}
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
              Target Price (Current: ₹{getNumericPrice(alertProduct.price).toLocaleString("en-IN")})
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
                const calculated = Math.round(getNumericPrice(alertProduct.price) * (1 - pct / 100));
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
                const target = Number(targetPriceInput) || Math.round(getNumericPrice(alertProduct.price) * 0.9);
                await savePriceAlert({
                  productName: alertProduct.name,
                  productId: alertProduct.id,
                  image: alertProduct.image,
                  currentPrice: getNumericPrice(alertProduct.price),
                  targetPrice: target,
                  store: alertProduct.store || "Amazon",
                });
                toast.success(`Price alert set for ₹${target.toLocaleString("en-IN")}! We'll track it.`);
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