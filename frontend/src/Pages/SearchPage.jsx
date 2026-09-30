import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch, FiFilter, FiGrid, FiList, FiHeart, FiStar,
  FiChevronRight, FiChevronDown, FiX, FiSliders, FiArrowUp, FiArrowDown,
  FiLoader, FiAlertCircle, FiShoppingBag, FiBell
} from "react-icons/fi";
import { FaHeart, FaStar, FaExchangeAlt } from "react-icons/fa";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import { searchLiveProducts, syncUserData } from "../utils/api";
import { toggleWishlistItem, isProductInWishlist } from "../utils/wishlistHelper";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "relevance",    label: "Most Relevant" },
  { value: "price_asc",   label: "Price: Low to High" },
  { value: "price_desc",  label: "Price: High to Low" },
  { value: "rating_desc", label: "Highest Rated" },
  { value: "discount",    label: "Best Discount" },
];

function ProductCard({ product, view, onCompare, onTrack }) {
  const [inWishlist, setInWishlist] = useState(isProductInWishlist(product.name));

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlistItem(product);
    setInWishlist(p => !p);
  };

  if (view === "list") {
    return (
      <div className="card card-hover" onClick={onCompare}
        style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 80, height: 80, flexShrink: 0, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            onError={e => { e.target.src = "https://via.placeholder.com/80?text=P"; }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {product.name}
          </h3>
          {product.rating && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
              <FaStar size={10} style={{ color: "#F59E0B" }} />
              <span style={{ fontSize: 12, color: "var(--text-500)" }}>{product.rating}</span>
            </div>
          )}
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-sm)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {product.store || "Verified Store"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "var(--success)" }}>₹{product.price?.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: 12, color: "var(--text-400)", textDecoration: "line-through" }}>₹{product.originalPrice?.toLocaleString()}</span>
            )}
            {product.discount && <span className="badge badge-success">{product.discount} OFF</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button onClick={handleWishlist} className="btn btn-outline btn-sm"
            style={{ padding: "7px 10px", color: inWishlist ? "#EF4444" : "var(--text-400)", borderColor: inWishlist ? "#FCA5A5" : "var(--border)" }}>
            {inWishlist ? <FaHeart size={13} /> : <FiHeart size={13} />}
          </button>
          <button onClick={onCompare} className="btn btn-primary btn-sm">
            <FaExchangeAlt size={11} /> Compare
          </button>
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
      <button onClick={handleWishlist} style={{
        position: "absolute", top: 12, right: 12, width: 30, height: 30,
        borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 2, color: inWishlist ? "#EF4444" : "var(--text-400)",
        transition: "var(--transition)", boxShadow: "var(--shadow-xs)"
      }}>
        {inWishlist ? <FaHeart size={12} /> : <FiHeart size={12} />}
      </button>

      <button onClick={(e) => { e.stopPropagation(); onTrack(); }} style={{
        position: "absolute", top: 12, right: 48, width: 30, height: 30,
        borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 2, color: "var(--text-900)",
        transition: "var(--transition)", boxShadow: "var(--shadow-xs)"
      }}>
        <FiBell size={12} />
      </button>

      {product.discount && (
        <div style={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
          <span className="badge badge-success">{product.discount} OFF</span>
        </div>
      )}

      <div style={{ height: 150, background: "var(--bg)", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: product.discount ? 20 : 0 }}>
        <img src={product.image} alt={product.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          onError={e => { e.target.src = "https://via.placeholder.com/150?text=P"; }} />
      </div>

      <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text-900)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {product.name}
      </h3>

      {product.rating && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <FaStar size={10} style={{ color: "#F59E0B" }} />
          <span style={{ fontSize: 11, color: "var(--text-500)" }}>{product.rating}</span>
        </div>
      )}

      <div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 8px", background: "var(--primary-light)", color: "var(--primary)", borderRadius: "var(--radius-sm)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {product.store || "Verified Store"}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: "auto" }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: "var(--success)" }}>₹{product.price?.toLocaleString()}</span>
        {product.originalPrice > product.price && (
          <span style={{ fontSize: 11, color: "var(--text-400)", textDecoration: "line-through" }}>₹{product.originalPrice?.toLocaleString()}</span>
        )}
      </div>

      <button onClick={onCompare} className="btn btn-primary btn-full btn-sm" style={{ marginTop: 4 }}>
        <FaExchangeAlt size={11} /> Compare Prices
      </button>
    </div>
  );
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("relevance");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(query);
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minDiscount, setMinDiscount] = useState("");
  const [selectedStores, setSelectedStores] = useState([]);
  const [alertProduct, setAlertProduct] = useState(null);

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
    if (!query) { setProducts([]); return; }
    setLoading(true);
    setError("");
    searchLiveProducts(query)
      .then(res => {
        setProducts(res?.products || []);
        
        // Save history with parsed query and timestamp
        const finalQuery = res?.query || query;
        try {
          const stored = localStorage.getItem("searchHistory");
          let hist = stored ? JSON.parse(stored) : [];
          hist = hist.filter(item => item.term.toLowerCase() !== finalQuery.toLowerCase()); 
          hist.unshift({ term: finalQuery, time: new Date().toISOString() }); 
          if (hist.length > 10) hist.pop(); 
          localStorage.setItem("searchHistory", JSON.stringify(hist));
          if (localStorage.getItem("token")) {
            syncUserData({ searchHistory: hist }).catch(() => {});
          }
        } catch(err) {}
      })
      .catch(err => setError(err.message || "Search failed."))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchInput.trim()) {
      const q = searchInput.trim();
      setSearchParams({ q });
    }
  };

  const filtered = products
    .filter(p => !maxPrice || p.price <= Number(maxPrice))
    .filter(p => !minRating || (p.rating && p.rating >= Number(minRating)))
    .filter(p => !minDiscount || (parseInt(p.discount || "0") >= Number(minDiscount)))
    .filter(p => selectedStores.length === 0 || selectedStores.includes(p.store?.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price_asc")   return (a.price || 0) - (b.price || 0);
      if (sort === "price_desc")  return (b.price || 0) - (a.price || 0);
      if (sort === "rating_desc") return (b.rating || 0) - (a.rating || 0);
      if (sort === "discount")    return parseInt(b.discount || "0") - parseInt(a.discount || "0");
      return 0;
    });

  const toggleStore = (store) => {
    setSelectedStores(prev => 
      prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
    );
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

          {}
          <form onSubmit={handleSearch} style={{ marginBottom: 28 }}>
            <div className="input-group" style={{ borderRadius: "var(--radius-full)", boxShadow: "var(--shadow-sm)" }}>
              <span style={{ padding: "0 0 0 20px", color: "var(--text-400)", display: "flex" }}>
                <FiSearch size={18} />
              </span>
              <input className="input" type="text" placeholder="Search for products..."
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

          <div className="search-layout" style={{ display: "flex", gap: 24 }}>

            {}
            <div className="search-filters" style={{ width: 220, flexShrink: 0 }}>
              <div className="card" style={{ padding: 20, position: "sticky", top: "calc(var(--navbar-height) + 24px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <FiSliders size={16} style={{ color: "var(--text-900)" }} />
                  <h3 className="font-heading" style={{ fontSize: 20, fontWeight: 400, color: "var(--text-900)", margin: 0 }}>Filters</h3>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
                    Max Price (₹)
                  </label>
                  <input className="input" type="number" placeholder="e.g. 50000"
                    value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    style={{ fontSize: 13 }} />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
                    Min Rating
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[3, 4, 4.5].map(r => (
                      <button key={r} onClick={() => setMinRating(minRating == r ? "" : r)}
                        style={{
                          padding: "5px 10px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                          background: minRating == r ? "var(--primary-light)" : "transparent",
                          color: minRating == r ? "var(--primary)" : "var(--text-500)",
                          borderColor: minRating == r ? "var(--primary)" : "var(--border)",
                          transition: "var(--transition)"
                        }}>
                        {r}+
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
                    Retailers
                  </label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {["amazon", "flipkart", "myntra"].map(store => (
                      <label key={store} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: "var(--text-900)", textTransform: "capitalize" }}>
                        <input type="checkbox" checked={selectedStores.includes(store)} onChange={() => toggleStore(store)}
                          style={{ accentColor: "var(--text-900)", width: 16, height: 16, cursor: "pointer" }} />
                        {store}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 10 }}>
                    Min Discount
                  </label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[10, 20, 50].map(d => (
                      <button key={d} onClick={() => setMinDiscount(minDiscount == d ? "" : d)}
                        style={{
                          padding: "5px 10px", borderRadius: "var(--radius-sm)", fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1px solid",
                          background: minDiscount == d ? "var(--text-900)" : "transparent",
                          color: minDiscount == d ? "var(--bg)" : "var(--text-500)",
                          borderColor: minDiscount == d ? "var(--text-900)" : "var(--border)",
                          transition: "var(--transition)"
                        }}>
                        {d}%+
                      </button>
                    ))}
                  </div>
                </div>

                {(maxPrice || minRating || minDiscount || selectedStores.length > 0) && (
                  <button className="btn btn-outline btn-sm btn-full"
                    onClick={() => { setMaxPrice(""); setMinRating(""); setMinDiscount(""); setSelectedStores([]); }}>
                    <FiX size={13} /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {}
            <div style={{ flex: 1, minWidth: 0 }}>

              {}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  {query && !loading && (
                    <div style={{ fontSize: 13, color: "var(--text-500)" }}>
                      {filtered.length > 0 ? (
                        <><span style={{ fontWeight: 700, color: "var(--text-900)" }}>{filtered.length}</span> results for <span style={{ fontWeight: 600, color: "var(--primary)" }}>"{query}"</span></>
                      ) : (
                        <span>No results found</span>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ position: "relative" }} ref={sortRef}>
                    <button type="button" onClick={() => setSortOpen(!sortOpen)}
                      style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "7px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", background: "var(--surface)", color: "var(--text-700)", cursor: "pointer", fontFamily: "'Inter',sans-serif" }}>
                      {SORT_OPTIONS.find(o => o.value === sort)?.label}
                      <FiChevronDown />
                    </button>
                    {sortOpen && (
                      <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "4px", zIndex: 10, boxShadow: "var(--shadow-md)", minWidth: 160 }}>
                        {SORT_OPTIONS.map(o => (
                          <button key={o.value} type="button" onClick={() => { setSort(o.value); setSortOpen(false); }}
                            onMouseEnter={e => {
                              if(sort !== o.value) e.currentTarget.style.background = 'var(--surface-hover)';
                            }}
                            onMouseLeave={e => {
                              if(sort !== o.value) e.currentTarget.style.background = 'transparent';
                            }}
                            style={{
                              display: "block", width: "100%", textAlign: "left", padding: "8px 12px", fontSize: 13,
                              color: sort === o.value ? "var(--primary)" : "var(--text-700)",
                              background: sort === o.value ? "var(--primary-light)" : "transparent",
                              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "var(--transition)"
                            }}>
                            {o.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
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

              {}
              {loading && (
                <div className={view === "list" ? "" : "products-grid"} style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!loading && error && (
                <div className="card empty-state">
                  <div className="empty-state-icon"><FiAlertCircle size={28} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>Search Error</h3>
                  <p style={{ fontSize: 13, color: "var(--text-400)" }}>{error}</p>
                </div>
              )}

              {!loading && !error && !query && (
                <div className="card empty-state">
                  <div className="empty-state-icon"><FiSearch size={28} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>Search for anything</h3>
                  <p style={{ fontSize: 13, color: "var(--text-400)" }}>Type a product name above to compare prices across stores.</p>
                </div>
              )}

              {!loading && !error && query && filtered.length === 0 && (
                <div className="card empty-state">
                  <div className="empty-state-icon"><FiShoppingBag size={28} /></div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-700)", marginBottom: 6 }}>No results found</h3>
                  <p style={{ fontSize: 13, color: "var(--text-400)" }}>Try different keywords or adjust your filters.</p>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <div className={view === "list" ? "" : "products-grid"} style={{ display: "grid", gridTemplateColumns: view === "list" ? "1fr" : "repeat(3, 1fr)", gap: 16 }}>
                  {filtered.map((product, i) => (
                    <ProductCard
                      key={product.id || i}
                      product={product}
                      view={view}
                      onCompare={() => navigate(`/comparison/${encodeURIComponent(product.name)}`, { state: { product } })}
                      onTrack={() => setAlertProduct(product)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1024px) {
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .search-layout { flex-direction: column !important; }
          .search-filters { width: 100% !important; position: static !important; }
          .products-grid { grid-template-columns: repeat(1, 1fr) !important; }
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
            
            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-500)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "block" }}>Target Price (Current: ₹{alertProduct.price?.toLocaleString()})</label>
            <div className="input-group" style={{ marginBottom: 24, padding: "4px 12px" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "var(--text-400)" }}>₹</span>
              <input type="number" className="input" defaultValue={Math.round(alertProduct.price * 0.9)} style={{ fontSize: 18, fontWeight: 700, padding: "8px 12px" }} />
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