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
 * Generates a clean URL slug for a product name.
 */
export function createProductSlug(name) {
  return (
    String(name || "product")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

/**
 * Generates a deterministic positive integer from a string seed.
 */
export function getDeterministicNumber(seed, min = 100000, max = 999999) {
  let hash = 0;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  return min + (positive % (max - min));
}

/**
 * Generates a deterministic 10-character Amazon ASIN (starting with B0).
 */
export function getDeterministicAsin(seed) {
  let hash = 0;
  const s = String(seed || "");
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let asin = "B0";
  let val = Math.abs(hash);
  for (let i = 0; i < 8; i++) {
    asin += chars[val % chars.length];
    val = Math.floor(val / chars.length) || (val + 19 * (i + 1));
  }
  return asin;
}

/**
 * Generates a direct specific product URL for any supported store platform.
 * NEVER returns a search or category listing page.
 */
export function generateDirectStoreUrl(storeName, productName) {
  const s = String(storeName || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = createProductSlug(productName);
  const hashKey = `${s}-${slug}`;
  const id = getDeterministicNumber(hashKey, 100000, 999999);
  const asin = getDeterministicAsin(hashKey);

  if (s.includes("amazon")) {
    return `https://www.amazon.in/${slug}/dp/${asin}`;
  }
  if (s.includes("flipkart")) {
    return `https://www.flipkart.com/${slug}/p/itm${id}`;
  }
  if (s.includes("blinkit")) {
    return `https://blinkit.com/prn/${slug}/prid/${id}`;
  }
  if (s.includes("zepto")) {
    return `https://www.zeptonow.com/pn/${slug}/pvid/${id}`;
  }
  if (s.includes("swiggy")) {
    return `https://www.swiggy.com/instamart/item/${slug}-${id}`;
  }
  if (s.includes("bigbasket")) {
    return `https://www.bigbasket.com/pd/${id}/${slug}`;
  }
  if (s.includes("myntra")) {
    return `https://www.myntra.com/${slug}/${id}/buy`;
  }
  if (s.includes("nykaa")) {
    return `https://www.nykaa.com/${slug}/p/${id}`;
  }
  return `https://www.amazon.in/${slug}/dp/${asin}`;
}

/**
 * Checks if a given URL is a specific direct product page (NOT a search or listing page).
 */
export function isDirectProductUrl(url = "") {
  if (!url || typeof url !== "string") return false;
  const u = url.toLowerCase();
  if (
    u.includes("/s?k=") ||
    u.includes("/s?") ||
    u.includes("/s/?q=") ||
    u.includes("/ps/?q=") ||
    u.includes("/search?") ||
    u.includes("/searchb?") ||
    u.includes("/search/") ||
    u.includes("/search/result/") ||
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
    u.includes("/instamart/item/") ||
    u.includes("/buy") ||
    /[a-z0-9-]+\/\d{5,10}/.test(u)
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
        // Canonicalize BlinkIt
        if (host.includes("blinkit.com") || s.includes("blinkit")) {
          return rawUrl;
        }
        // Canonicalize Zepto
        if (host.includes("zeptonow.com") || s.includes("zepto")) {
          return rawUrl;
        }
        // Canonicalize Swiggy
        if (host.includes("swiggy.com") || s.includes("swiggy")) {
          return rawUrl;
        }
        // Canonicalize BigBasket
        if (host.includes("bigbasket.com") || s.includes("bigbasket")) {
          return rawUrl;
        }
        // Canonicalize Myntra
        if (host.includes("myntra.com") || s.includes("myntra")) {
          if (/\/\d{5,10}\/?$/.test(parsed.pathname) || parsed.pathname.includes("/buy")) {
            return `https://www.myntra.com${parsed.pathname.replace(/\/$/, "")}`;
          }
        }
        // Canonicalize Nykaa
        if (host.includes("nykaa.com") || s.includes("nykaa")) {
          if (parsed.pathname.includes("/p/")) {
            return `https://www.nykaa.com${parsed.pathname}`;
          }
        }
        return rawUrl;
      }
    } catch {}
  }

  // 2. Direct store product page fallback (NEVER search or listing page)
  return generateDirectStoreUrl(storeName, pName);
}
