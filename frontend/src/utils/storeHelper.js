import { API_BASE_URL } from "./api";

/**
 * Supported QuickCommerce platforms
 */
export const SUPPORTED_STORES = [
  "Amazon",
  "Flipkart",
  "BlinkIt",
  "Zepto",
  "Swiggy",
  "BigBasket",
  "Myntra",
  "Nykaa"
];

/**
 * Checks if a given URL is a specific direct product page (NOT a search or listing page).
 */
export function isDirectProductUrl(url = "") {
  if (!url || typeof url !== "string") return false;
  const u = url.toLowerCase();
  if (
    u.includes("/s?k=") ||
    u.includes("/s?") ||
    u.includes("/search?") ||
    u.includes("/searchb?") ||
    u.includes("/search/") ||
    u.endsWith("/search") ||
    u === "https://amazon.in" ||
    u === "https://www.amazon.in" ||
    u === "https://flipkart.com" ||
    u === "https://www.flipkart.com" ||
    u === "https://blinkit.com" ||
    u === "https://www.zeptonow.com" ||
    u === "https://www.swiggy.com" ||
    u === "https://www.bigbasket.com" ||
    u === "https://www.myntra.com" ||
    u === "https://www.nykaa.com"
  ) {
    return false;
  }
  return (
    u.includes("/dp/") ||
    u.includes("/gp/product/") ||
    u.includes("/gp/aw/d/") ||
    u.includes("/p/itm") ||
    u.includes("/p/") ||
    u.includes("/product/") ||
    u.includes("/prn/") ||
    u.includes("/pn/") ||
    u.includes("/pd/") ||
    u.includes("/buy/") ||
    /[a-z0-9-]+\/\d{6,10}/.test(u)
  );
}

/**
 * Resolves any product into a direct retailer product page URL across
 * all 8 QuickCommerce platforms: Amazon, Flipkart, BlinkIt, Zepto,
 * Swiggy, BigBasket, Myntra, and Nykaa.
 */
export function getDirectStoreUrl(storeName = "", productName = "", rawUrl = "") {
  const s = String(storeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const pName = String(productName || "").trim();

  if (rawUrl && typeof rawUrl === "string") {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase();

      // 1. Direct retailer product page
      if (isDirectProductUrl(rawUrl)) {
        // Canonicalize Amazon
        if (host.includes("amazon.") || s.includes("amazon")) {
          const m = parsed.pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/i);
          const asin = m?.[1] || parsed.searchParams.get("asin");
          if (asin) return `https://www.amazon.in/dp/${asin}`;
        }
        // Canonicalize Flipkart
        if (host.includes("flipkart.com") || s.includes("flipkart")) {
          const pid = parsed.searchParams.get("pid");
          const m = parsed.pathname.match(/\/([^/]+)\/p\/(itm[a-z0-9]+)/i) || parsed.pathname.match(/\/p\/(itm[a-z0-9]+)/i);
          if (m) {
            const slug = m[2] ? m[1] : "product";
            const itm = m[2] || m[1];
            return pid
              ? `https://www.flipkart.com/${slug}/p/${itm}?pid=${pid}`
              : `https://www.flipkart.com/${slug}/p/${itm}`;
          }
          if (pid) return `https://www.flipkart.com/product/p/itm?pid=${pid}`;
        }
        // Canonicalize Myntra
        if (host.includes("myntra.com") && /\/\d{5,10}\/?$/.test(parsed.pathname)) {
          return `https://www.myntra.com${parsed.pathname.replace(/\/$/, "")}`;
        }
        // Canonicalize Nykaa
        if (host.includes("nykaa.com") && parsed.pathname.includes("/p/")) {
          return `https://www.nykaa.com${parsed.pathname}`;
        }
        return rawUrl;
      }
    } catch {}
  }

  // 2. Direct store product search link fallback if no direct ID is known
  const q = encodeURIComponent(pName);
  if (s.includes("amazon")) return `https://www.amazon.in/s?k=${q}`;
  if (s.includes("flipkart")) return `https://www.flipkart.com/search?q=${q}`;
  if (s.includes("blinkit")) return `https://blinkit.com/s/?q=${q}`;
  if (s.includes("zepto")) return `https://www.zeptonow.com/search?query=${q}`;
  if (s.includes("swiggy")) return `https://www.swiggy.com/search?query=${q}`;
  if (s.includes("bigbasket")) return `https://www.bigbasket.com/ps/?q=${q}`;
  if (s.includes("myntra")) return `https://www.myntra.com/${q}`;
  if (s.includes("nykaa")) return `https://www.nykaa.com/search/result/?q=${q}`;

  // Default to backend redirect endpoint
  const base = API_BASE_URL || "/api";
  const params = new URLSearchParams({
    store: storeName || "Amazon",
    name: pName,
    url: rawUrl && !rawUrl.startsWith(base) ? rawUrl : "",
  });

  return `${base}/products/redirect?${params.toString()}`;
}
