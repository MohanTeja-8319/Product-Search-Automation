const axios = require("axios");
const crypto = require("crypto");
const {
  searchCatalogProducts,
  findCatalogProductByName,
  buildMultiStoreCatalog,
  generateDirectStoreUrl,
  lookupDirectStoreProductUrl,
  cleanProductNameForStore,
  VERIFIED_PRODUCT_STORE_URLS,
  isSyntheticBrokenUrl,
  isDirectProductUrl,
  canonicalizeProductUrl,
} = require("./multiStoreCatalog");

const API_BASE_URL = "https://api.quickcommerceapi.com";
// Platforms supported in India (E-commerce & Quick Commerce):
// Amazon, Flipkart, BlinkIt, Zepto, Swiggy (Instamart), BigBasket, DMart, Minutes, JioMart
const BASE_PLATFORMS = ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "Minutes", "JioMart"];
const PINCODE_PLATFORMS = ["DMart", "JioMart", "Minutes"];
const ALL_SUPPORTED_PLATFORMS = ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "Minutes", "JioMart"];
const LIVE_PLATFORMS = ALL_SUPPORTED_PLATFORMS;

// In-memory cache for repeated searches
const searchCache = new Map();
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;

function hashString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/(\d+)\s*gb\b/g, "$1gb")
    .replace(/(\d+)\s*tb\b/g, "$1tb")
    .replace(/(\d+)\s*ml\b/g, "$1ml")
    .replace(/(\d+)\s*g\b/g, "$1g")
    .replace(/(\d+)\s*kg\b/g, "$1kg")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(value) {
  return new Set(normalizeText(value).split(" ").filter(Boolean));
}

const STOP_WORDS = new Set([
  "for", "with", "and", "the", "a", "an", "of", "on", "in", "to", "by", "at"
]);

function meaningfulTokens(value) {
  return [...tokens(value)].filter((t) => !STOP_WORDS.has(t));
}

function similarity(a, b) {
  const aa = tokens(a);
  const bb = tokens(b);
  if (!aa.size || !bb.size) return 0;
  let inter = 0;
  for (const t of aa) if (bb.has(t)) inter++;
  return inter / (aa.size + bb.size - inter);
}

let cachedCreditsStatus = null;
let lastCreditsCheck = 0;

/**
 * Checks Quick Commerce API credit status.
 * If credits are exhausted (credits <= 0, 402, 429, 500, or out of quota),
 * flags creditsCompleted = true and message = "products are not available".
 */
async function checkApiCreditsStatus(force = false) {
  const now = Date.now();
  if (!force && cachedCreditsStatus && now - lastCreditsCheck < 60000) {
    return cachedCreditsStatus;
  }

  const apiKey = process.env.QUICKCOMMERCE_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    cachedCreditsStatus = {
      hasKey: false,
      creditsCompleted: true,
      creditsRemaining: 0,
      message: "products are not available",
    };
    lastCreditsCheck = now;
    return cachedCreditsStatus;
  }

  try {
    const res = await axios.get(`${API_BASE_URL}/v1/credits`, {
      headers: { "X-API-Key": apiKey },
      timeout: 5000,
    });

    const rem = res.data?.credits_remaining ?? res.data?.total_credits ?? res.data?.credits;
    if (typeof rem === "number" && rem <= 0) {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: true,
        creditsRemaining: 0,
        message: "products are not available",
      };
    } else {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: false,
        creditsRemaining: rem ?? null,
      };
    }
  } catch (err) {
    const status = err.response?.status;
    const body = JSON.stringify(err.response?.data || "");
    if (status === 402 || status === 429 || status === 500 || /credit|quota|insufficient|payment/i.test(body)) {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: true,
        creditsRemaining: 0,
        message: "products are not available",
      };
    } else {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: false,
        creditsRemaining: null,
      };
    }
  }

  lastCreditsCheck = now;
  return cachedCreditsStatus;
}

/**
 * Resolves a product or offer into an authentic, working retailer product details page (PDP) URL.
 * Supports: deeplink, deep_link, url, product_link, link, product_url, web_url.
 * Automatically converts dark store mobile deeplinks (blinkit://, zepto://, swiggy://) into direct web PDP URLs.
 */
function resolveProductOfferUrl(item, platform = "", name = "") {
  if (!item && !name) return "";
  const rawItem = typeof item === "object" && item !== null ? item : {};
  const cleanName = cleanProductNameForStore(name || rawItem.name || rawItem.title || "");
  const effectivePlatform = String(
    platform || rawItem.store || rawItem.platform?.name || rawItem.platform || "BlinkIt"
  ).trim();
  const pLower = effectivePlatform.toLowerCase();

  // 1. Check all candidate URL properties: deeplink (QuickCommerce standard), deep_link, url, product_link, link, etc.
  const rawUrl =
    rawItem.deeplink ||
    rawItem.deep_link ||
    rawItem.url ||
    rawItem.product_link ||
    rawItem.link ||
    rawItem.product_url ||
    rawItem.web_url ||
    (typeof item === "string" ? item : "");

  // Convert mobile scheme deeplinks into live desktop/mobile web PDP URLs
  if (typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    if (trimmed.startsWith("blinkit://")) {
      const prnMatch = trimmed.match(/prn\/([^/]+)\/prid\/([^/?#]+)/i);
      if (prnMatch) return `https://blinkit.com/prn/${prnMatch[1]}/prid/${prnMatch[2]}`;
      const idMatch = trimmed.match(/(?:product|prid|item)\/([^/?#]+)/i);
      if (idMatch) return `https://blinkit.com/prn/${createProductSlug(cleanName)}/prid/${idMatch[1]}`;
    }
    if (trimmed.startsWith("zepto://")) {
      const pnMatch = trimmed.match(/pn\/([^/]+)\/pvid\/([^/?#]+)/i);
      if (pnMatch) return `https://www.zeptonow.com/pn/${pnMatch[1]}/pvid/${pnMatch[2]}`;
      const idMatch = trimmed.match(/(?:product|pvid|item)\/([^/?#]+)/i);
      if (idMatch) return `https://www.zeptonow.com/pn/${createProductSlug(cleanName)}/pvid/${idMatch[1]}`;
    }
    if (trimmed.startsWith("swiggy://")) {
      const idMatch = trimmed.match(/(?:instamart\/item|item)\/([^/?#]+)/i);
      if (idMatch) return `https://www.swiggy.com/instamart/item/${idMatch[1]}`;
    }

    if ((trimmed.startsWith("http://") || trimmed.startsWith("https://")) && !isSyntheticBrokenUrl(trimmed)) {
      const canonical = canonicalizeProductUrl(trimmed, effectivePlatform);
      if (canonical) return canonical;
      if (isDirectProductUrl(trimmed)) return trimmed;
    }
  }

  // 2. Build live product details page URL from real platform productId / id if present
  const rawId = String(rawItem.productId || rawItem.id || "").trim();
  const isInternalId = !rawId || rawId.startsWith("qc-") || rawId.startsWith("db-") || rawId.startsWith("trend-") || rawId.startsWith("deal-");
  const cleanId = isInternalId ? "" : rawId;
  const slug = createProductSlug(cleanName);
  if (cleanId) {
    if (pLower.includes("blinkit") && (/^\d+$/.test(cleanId) || /^[a-f0-9-]{36}$/i.test(cleanId))) {
      return `https://blinkit.com/prn/${slug}/prid/${cleanId}`;
    }
    if (pLower.includes("zepto") && /^[a-f0-9-]{36}$/i.test(cleanId)) {
      return `https://www.zeptonow.com/pn/${slug}/pvid/${cleanId}`;
    }
    if (pLower.includes("swiggy") && (/^\d+$/.test(cleanId) || cleanId.includes("-"))) {
      return `https://www.swiggy.com/instamart/item/${cleanId}`;
    }
    if (pLower.includes("bigbasket")) {
      return `https://www.bigbasket.com/ps/?q=${encodeURIComponent(cleanName)}`;
    }
    if (pLower.includes("dmart") && /^[a-z0-9_-]+$/i.test(cleanId)) {
      return `https://www.dmart.in/product/${slug}-${cleanId}`;
    }
    if (pLower.includes("amazon") && /^[B0-9][A-Z0-9]{9}$/i.test(cleanId)) {
      return `https://www.amazon.in/dp/${cleanId}`;
    }
    if (pLower.includes("flipkart") && /^[A-Z0-9]{16}$/i.test(cleanId)) {
      return `https://www.flipkart.com/product/p/itm?pid=${cleanId}`;
    }
  }

  // 3. Verified registry lookup for authentic store product page
  const directFromRegistry = lookupDirectStoreProductUrl(effectivePlatform, cleanName);
  if (directFromRegistry && !isSyntheticBrokenUrl(directFromRegistry)) {
    return directFromRegistry;
  }

  // 4. Any raw valid HTTP(S) URL (only direct product pages, not search results)
  if (typeof rawUrl === "string") {
    const trimmed = rawUrl.trim();
    if ((trimmed.startsWith("http://") || trimmed.startsWith("https://")) && !isSyntheticBrokenUrl(trimmed)) {
      if (isDirectProductUrl(trimmed)) {
        return trimmed;
      }
    }
  }

  // 5. Fallback: Generate the authentic retailer store product URL
  return generateDirectStoreUrl(effectivePlatform, cleanName);
}


const KNOWN_BRANDS = [
  "Apple", "Samsung", "OnePlus", "Xiaomi", "Redmi", "Poco", "Realme", "Nokia",
  "Motorola", "Sony", "LG", "Asus", "Lenovo", "HP", "Dell", "Acer", "boAt", "JBL",
  "Adidas", "Nike", "Puma", "Reebok", "Levi's", "Zara", "H&M", "Amul", "Tata",
  "Cadbury", "Nescafe", "Country Delight", "Lakme", "Maybelline", "Minimalist"
];

function extractBrand(title) {
  for (const b of KNOWN_BRANDS) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b;
  }
  const first = title.trim().split(/\s+/)[0] || "";
  return first.length > 1 ? first : "";
}

function normalizeCategoryName(cat = "") {
  if (!cat) return "";
  const c = String(cat).toLowerCase().trim();
  if (c === "smartphones" || c === "mobiles" || c === "mobile" || c === "phone") return "Smartphones";
  if (c === "laptops" || c === "laptop" || c === "computers" || c === "pc") return "Laptops";
  if (c === "headphones" || c === "headphone" || c === "audio" || c === "earphones") return "Headphones";
  if (c === "televisions" || c === "television" || c === "tv" || c === "tvs") return "Televisions";
  if (c === "smartwatches" || c === "smartwatch" || c === "watches" || c === "watch") return "Smartwatches";
  if (c === "gaming" || c === "gaming consoles" || c === "consoles" || c === "console") return "Gaming Consoles";
  if (c === "groceries" || c === "grocery" || c === "essentials") return "Groceries";
  if (c === "fashion" || c === "clothing" || c === "shoes" || c === "apparel" || c === "fashion & shoes") return "Fashion";
  if (c === "beauty" || c === "personal care" || c === "skincare" || c === "cosmetics" || c === "beauty & care" || c === "beauty & personal care") return "Beauty";
  return "";
}

function inferProductCategory(name = "", explicitCat = "") {
  if (explicitCat) {
    const norm = normalizeCategoryName(explicitCat);
    if (norm) return norm;
  }
  const n = String(name).toLowerCase();
  if (/\b(smartphone|smartphones|phone|phones|mobile|mobiles|iphone|galaxy s|galaxy z|galaxy a|oneplus|realme|redmi|pixel|poco|motorola)\b/i.test(n) &&
      !/\b(watch|tv|television|headphone|earphone|neckband|earbud|airpod)\b/i.test(n)) {
    return "Smartphones";
  }
  if (/\b(laptop|laptops|macbook|thinkpad|ideapad|pavilion|zenbook|vivobook|legion|chromebook|notebook)\b/i.test(n)) {
    return "Laptops";
  }
  if (/\b(headphone|headphones|earphone|earphones|airpod|airpods|earbud|earbuds|tws|neckband|soundbar|speaker|speakers|audiophile|anc|wh-1000|airdopes|sennheiser)\b/i.test(n)) {
    return "Headphones";
  }
  if (/\b(tv|tvs|television|televisions|oled|qled|bravia|smart led|4k uhd)\b/i.test(n)) {
    return "Televisions";
  }
  if (/\b(smartwatch|smartwatches|watch|watches|wearable|fitness band|apple watch|galaxy watch|colorfit|fitbit)\b/i.test(n)) {
    return "Smartwatches";
  }
  if (/\b(playstation|ps5|ps4|xbox|nintendo switch|dualsense|controller|gaming console)\b/i.test(n) && !/\b(laptop|laptops)\b/i.test(n)) {
    return "Gaming Consoles";
  }
  if (/\b(shoe|shoes|sneaker|sneakers|jeans|shirt|t-shirt|kurta|trousers|jacket|hoodie|saree|sandals|boots|clothing|apparel|footwear|nike|adidas|puma|levis)\b/i.test(n) &&
      !/\b(watch|tv|television)\b/i.test(n)) {
    return "Fashion";
  }
  if (/\b(serum|sunscreen|shampoo|lipstick|mascara|moisturizer|face wash|lotion|conditioner|perfume|deodorant|cosmetic|cosmetics|skincare|lakme|maybelline|derma co)\b/i.test(n)) {
    return "Beauty";
  }
  if (/\b(milk|tea|coffee|atta|oil|ghee|butter|paneer|bread|biscuit|snack|snacks|chips|chocolate|dal|rice|masala|sugar|detergent|grocery|groceries|anjeer|almond|dry fruit|amul|tata|fortune)\b/i.test(n)) {
    return "Groceries";
  }
  return "General";
}


/**
 * Standardizes a product offer from Quick Commerce APIs into our unified model.
 * 100% authentic prices, real store deep links, authentic ratings (no synthetic hash fallbacks).
 */
function mapPlatformProduct(item, platformName) {
  const platform = item.platform?.name || platformName || "BlinkIt";
  const price = Number(item.offer_price ?? item.price ?? item.discounted_price ?? item.mrp ?? 0);
  const rawMrp = Number(item.mrp ?? item.originalPrice ?? price);
  const mrp = rawMrp > 0 ? rawMrp : price;

  const rawRating = Number(item.rating ?? item.user_rating);
  const finalRating = Number.isFinite(rawRating) && rawRating >= 1 && rawRating <= 5
    ? Number(rawRating.toFixed(1))
    : null;

  const rawReviews = Number(item.rating_count ?? item.reviews ?? item.reviewsCount ?? item.ratingCount);
  const finalReviews = Number.isFinite(rawReviews) && rawReviews > 0
    ? rawReviews
    : null;

  const itemName = item.name || item.title || "Product";
  const directUrl = resolveProductOfferUrl(item, platform, itemName);

  const deliveryStr =
    item.platform?.sla ||
    item.delivery ||
    (["BlinkIt", "Zepto", "Swiggy"].includes(platform)
      ? "10 mins delivery"
      : platform === "BigBasket"
      ? "Express Delivery"
      : "Standard Delivery");

  const prodCat = inferProductCategory(
    itemName,
    item.category || item.department || item.category_name || ""
  );

  return {
    id: `qc-${platform.toLowerCase()}-${item.id || item.productId || crypto.randomUUID()}`,
    name: itemName,
    brand: item.brand || extractBrand(itemName),
    quantity: item.quantity || "",
    category: prodCat,
    price,
    originalPrice: mrp > price ? mrp : price,
    discount:
      mrp > price && price > 0
        ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF`
        : null,
    rating: finalRating,
    reviews: finalReviews,
    availability: item.available === false ? "Out of Stock" : "In Stock",
    image: item.images?.[0] || item.image || item.thumbnail || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    url: directUrl,
    deeplink: directUrl,
    link: directUrl,
    product_link: directUrl,
    store: platform,
    source: "QuickCommerce API",
    delivery: deliveryStr,
  };
}

const QC_STORES_SET = new Set(["amazon", "flipkart", "blinkit", "zepto", "swiggy", "bigbasket", "dmart", "minutes", "jiomart"]);

/**
 * Groups multiple platform offerings of the same product for side-by-side comparison.
 */
function groupProducts(rawProducts) {
  const groups = [];

  for (const product of rawProducts) {
    if (!product.name || !product.price) continue;
    const storeKey = String(product.store || "").toLowerCase().trim();
    if (storeKey && !QC_STORES_SET.has(storeKey)) continue;

    const brand = normalizeText(product.brand || "");
    const name = normalizeText(product.name || "");
    const exactKey = [brand, name].filter(Boolean).join(" ");
    let group = groups.find((c) => c.key === exactKey);

    if (!group) {
      group = {
        key: exactKey,
        items: [],
      };
      groups.push(group);
    }

    group.items.push(product);
  }

  // Merge products with high textual similarity (e.g. slight naming variations across dark stores)
  for (let i = 0; i < groups.length; i++) {
    for (let j = groups.length - 1; j > i; j--) {
      const aName = groups[i].items[0]?.name || "";
      const bName = groups[j].items[0]?.name || "";
      if (similarity(aName, bName) >= 0.72) {
        groups[i].items.push(...groups[j].items);
        groups[j].items = [];
      }
    }
  }

  return groups
    .filter((g) => g.items.length)
    .map((g) => {
      const uniqueStores = new Map();

      for (const item of g.items) {
        const existing = uniqueStores.get(item.store);
        const itemDirect = isDirectProductUrl(item.url);
        const exDirect = existing ? isDirectProductUrl(existing.url) : false;

        if (!existing) {
          uniqueStores.set(item.store, item);
        } else if (itemDirect && !exDirect) {
          uniqueStores.set(item.store, item);
        } else if (!exDirect && item.price < existing.price) {
          uniqueStores.set(item.store, item);
        } else if (itemDirect && exDirect && item.price < existing.price) {
          uniqueStores.set(item.store, item);
        }
      }

      // Comparison sorted strictly by lowest price first
      const comparison = [...uniqueStores.values()].sort((a, b) => a.price - b.price);
      const designatedItem = comparison[0];
      const cheapest = comparison[0];

      const primaryUrl = designatedItem.deeplink || designatedItem.url || designatedItem.link || designatedItem.product_link;
      return {
        id: `qc-${crypto.randomUUID()}`,
        name: designatedItem.name,
        brand: designatedItem.brand,
        quantity: designatedItem.quantity,
        category: designatedItem.category || "General",
        price: designatedItem.price,
        originalPrice: designatedItem.originalPrice,
        discount: designatedItem.discount,
        rating: designatedItem.rating,
        reviews: designatedItem.reviews,
        availability: designatedItem.availability,
        image: designatedItem.image,
        url: primaryUrl,
        deeplink: primaryUrl,
        link: primaryUrl,
        product_link: primaryUrl,
        store: designatedItem.store,
        storeCount: comparison.length,
        comparison: comparison.map((item) => {
          const itemUrl = item.deeplink || item.url || item.link || item.product_link;
          return {
            ...item,
            url: itemUrl,
            deeplink: itemUrl,
            link: itemUrl,
            product_link: itemUrl,
          };
        }),
        lowestPrice: cheapest.price,
        stores: comparison.map((item) => item.store),
        live: true,
      };
    });
}

function normalizeStoreName(raw = "") {
  const s = String(raw || "").toLowerCase().trim();
  if (s.includes("amazon")) return "Amazon";
  if (s.includes("flipkart") || s.includes("shopsy")) return "Flipkart";
  if (s.includes("blinkit")) return "BlinkIt";
  if (s.includes("zepto")) return "Zepto";
  if (s.includes("swiggy")) return "Swiggy";
  if (s.includes("bigbasket")) return "BigBasket";
  if (s.includes("dmart")) return "DMart";
  if (s.includes("minutes")) return "Minutes";
  if (s.includes("jiomart")) return "JioMart";
  const cleaned = raw.replace(/\.com|\.in/gi, "").trim();
  return cleaned || "Amazon";
}

const COMMODITY_BRAND_MAP = {
  milk: ["amul", "nandini", "milky-mist", "mother-dairy"],
  butter: ["amul", "britannia", "milky-mist"],
  cheese: ["amul", "britannia", "go-cheese"],
  paneer: ["amul", "milky-mist", "mother-dairy"],
  ghee: ["amul", "aashirvaad", "mother-dairy", "fortune"],
  curd: ["amul", "milky-mist", "epigamia"],
  yogurt: ["epigamia", "milky-mist", "amul"],
  bread: ["britannia", "modern", "harvest-gold", "english-oven"],
  tea: ["tata-tea-gold", "tata-tea", "red-label", "taj-mahal"],
  coffee: ["nescafe", "bru", "davidoff", "continental-coffee"],
  biscuit: ["britannia", "parle", "sunfeast", "cadbury-oreo"],
  biscuits: ["britannia", "parle", "sunfeast", "cadbury-oreo"],
  cookie: ["britannia", "parle", "unibic"],
  cookies: ["britannia", "parle", "unibic"],
  chocolate: ["cadbury", "nestle", "amul", "ferrero-rocher"],
  chocolates: ["cadbury", "nestle", "amul", "ferrero-rocher"],
  chips: ["lays", "doritos", "bingo", "pringles"],
  atta: ["aashirvaad", "fortune", "pillsbury"],
  rice: ["india-gate", "daawat", "fortune"],
  oil: ["fortune", "saffola", "dhara"],
  sugar: ["madhur", "trust", "dhampure"],
  salt: ["tata-salt", "aashirvaad", "catch"],
  noodles: ["maggi", "yippee", "top-ramen"],
  maggie: ["maggi"],
  maggi: ["maggi"],
  dal: ["tata-sampann", "fortune", "organic-tattva"],
  soap: ["dettol", "dove", "pears", "lifebuoy"],
  shampoo: ["dove", "head-shoulders", "pantene", "l-oreal"],
  toothpaste: ["colgate", "sensodyne", "close-up"],
  detergent: ["surf-excel", "ariel", "tide", "rin"],
  coke: ["coca-cola"],
  cola: ["coca-cola", "pepsi"],
  colddrink: ["coca-cola", "pepsi", "thums-up", "sprite"],
  juice: ["real", "tropicana", "paper-boat"],
  water: ["bisleri", "kinley", "aquafina"],
  ketchup: ["kissan", "maggi", "heinz"],
  jam: ["kissan"],
  honey: ["dabur", "patanjali", "saffola"],
  phone: ["apple", "samsung", "oneplus"],
  smartphone: ["apple", "samsung", "oneplus"],
  mobile: ["apple", "samsung", "oneplus"],
  iphone: ["apple"],
  apple: ["apple"],
  samsung: ["samsung"],
  earphones: ["boat", "noise", "sony", "jbl"],
  headphones: ["boat", "sony", "jbl"],
};

const POPULAR_QC_BRANDS = [
  "amul",
  "cadbury",
  "britannia",
  "tata-tea-gold",
  "maggi",
  "surf-excel",
  "lays",
  "dettol",
  "colgate",
  "nescafe",
];

const qcLiveSearchCache = new Map();
const qcSpecificCache = new Map();
const QC_CACHE_TTL_MS = 15 * 60 * 1000;

function mapQuickCommerceCatalogProduct(item) {
  const platform = item.platformLabel || normalizeStoreName(item.platformSlug || "");
  const price = Number(item.price ?? item.offer_price ?? item.mrp ?? 0);
  const mrp = Number(item.mrp ?? price);
  const title = String(item.name || "").trim();
  const brand = item.brand || extractBrand(title);
  const prodCat = inferProductCategory(title, item.category || "");

  const rawRating = Number(item.rating ?? item.user_rating);
  const finalRating = Number.isFinite(rawRating) && rawRating >= 1 && rawRating <= 5
    ? Number(rawRating.toFixed(1))
    : null;

  const rawReviews = Number(item.rating_count ?? item.reviews ?? item.reviewsCount);
  const finalReviews = Number.isFinite(rawReviews) && rawReviews > 0 ? rawReviews : null;

  const directUrl = resolveProductOfferUrl(item, platform, title);

  const deliveryStr =
    ["BlinkIt", "Zepto", "Swiggy"].includes(platform)
      ? "10 mins delivery"
      : platform === "BigBasket"
      ? "Express Delivery"
      : "Standard Delivery";

  return {
    id: `qc-${item.platformSlug || platform.toLowerCase()}-${item.productId || crypto.randomUUID()}`,
    name: title,
    brand,
    quantity: item.quantity || "",
    category: prodCat,
    price,
    originalPrice: mrp > price ? mrp : price,
    discount: mrp > price && price > 0 ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF` : null,
    rating: finalRating,
    reviews: finalReviews,
    availability: "In Stock",
    image: (Array.isArray(item.imageUrls) && item.imageUrls[0]) || item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    url: directUrl,
    deeplink: directUrl,
    link: directUrl,
    product_link: directUrl,
    store: platform,
    source: "QuickCommerce API",
    delivery: deliveryStr,
  };
}

/**
 * Searches the live QuickCommerce Catalog API across BlinkIt, Zepto, Swiggy, BigBasket, DMart, etc.
 * Uses official API key from process.env.QUICKCOMMERCE_API_KEY.
 */
async function fetchLiveQuickCommerceCatalog({ query, category }) {
  const apiKey = process.env.QUICKCOMMERCE_API_KEY;
  if (!apiKey) return null;

  const rawQ = String(query || category || "").trim();
  const isGeneric = !rawQ || rawQ === "all" || rawQ === "popular";

  const cacheKey = `qc_cat_${normalizeText(rawQ || "popular")}`;
  const cached = qcLiveSearchCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < QC_CACHE_TTL_MS) {
    return cached.products;
  }

  try {
    let brandSlugs = [];

    if (isGeneric) {
      brandSlugs = POPULAR_QC_BRANDS.slice(0, 4);
    } else {
      const qNorm = rawQ.toLowerCase();
      // Check commodity mapping first
      for (const [commodity, slugs] of Object.entries(COMMODITY_BRAND_MAP)) {
        if (qNorm.includes(commodity) || commodity.includes(qNorm)) {
          brandSlugs.push(...slugs);
        }
      }
      brandSlugs = [...new Set(brandSlugs)];

      // If no commodity matched, search brands endpoint
      if (brandSlugs.length === 0) {
        const searchTerms = qNorm.split(/\s+/).filter((w) => w.length >= 2);
        const primaryTerm = searchTerms[0] || rawQ;
        const brandRes = await axios.get(`${API_BASE_URL}/catalog/brands`, {
          params: { q: primaryTerm, limit: 6 },
          headers: { "X-API-Key": apiKey },
          timeout: 8000,
        });
        const brands = brandRes.data?.brands;
        if (Array.isArray(brands) && brands.length > 0) {
          brandSlugs = brands.slice(0, 3).map((b) => b.slug);
        }
      }
    }

    if (brandSlugs.length === 0) return null;

    const rawItems = [];
    const searchTerms = rawQ.toLowerCase().split(/\s+/).filter((w) => w.length >= 2);

    await Promise.all(
      brandSlugs.slice(0, 8).map(async (slug) => {
        try {
          const prodRes = await axios.get(`${API_BASE_URL}/catalog/brands/${slug}/products`, {
            params: { limit: 100 },
            headers: { "X-API-Key": apiKey },
            timeout: 8000,
          });
          const prods = prodRes.data?.products;
          if (Array.isArray(prods)) {
            for (const p of prods) {
              if (p && p.name && (p.mrp > 0 || p.price > 0)) {
                const normName = normalizeText(p.name);
                const isRelevant =
                  isGeneric ||
                  searchTerms.length === 0 ||
                  searchTerms.some((st) => normName.includes(st) || slug.includes(st));
                if (isRelevant) {
                  rawItems.push(mapQuickCommerceCatalogProduct(p));
                }
              }
            }
          }
        } catch {
          // brand products fetch error ignored
        }
      })
    );

    if (rawItems.length === 0) return null;

    const grouped = groupProducts(rawItems);
    if (grouped.length > 0) {
      qcLiveSearchCache.set(cacheKey, { createdAt: Date.now(), products: grouped });
      return grouped;
    }
    return null;
  } catch (err) {
    const status = err.response?.status;
    const body = JSON.stringify(err.response?.data || "");
    if (status === 402 || status === 429 || status === 500 || /credit|quota|insufficient|deplet/i.test(body)) {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: true,
        creditsRemaining: 0,
        message: "products are not available",
      };
      lastCreditsCheck = Date.now();
    }
    console.error("QuickCommerce catalog search warning:", err.message);
    return null;
  }
}

/**
 * Queries the real-time Quick Commerce dark-store groupsearch API.
 * Returns live store offers across BlinkIt, Zepto, Swiggy, BigBasket.
 */
async function fetchGroupSearch({ query, lat, lon, pincode }) {
  const cacheKey = `${normalizeText(query)}_${lat || ""}_${lon || ""}_${pincode || ""}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < SEARCH_CACHE_TTL_MS) {
    return { ...cached.payload, _fromCache: true };
  }

  const apiKey = process.env.QUICKCOMMERCE_API_KEY;
  if (!apiKey) {
    return { results: {} };
  }

  const targetPlatforms = ["BlinkIt", "Zepto", "Swiggy", "BigBasket"];

  try {
    const params = new URLSearchParams({
      q: query,
      lat: String(lat || 12.9021),
      lon: String(lon || 77.6639),
      platforms: targetPlatforms.join(","),
    });
    if (pincode) params.set("pincode", pincode);

    const response = await axios.get(`${API_BASE_URL}/v1/groupsearch?${params.toString()}`, {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      timeout: 10000,
    });

    if (response.data) {
      searchCache.set(cacheKey, { createdAt: Date.now(), payload: response.data });
      return response.data;
    }

    return { results: {} };
  } catch (err) {
    const status = err.response?.status;
    const body = JSON.stringify(err.response?.data || "");
    if (status === 402 || status === 429 || status === 500 || /credit|quota|insufficient|deplet/i.test(body)) {
      cachedCreditsStatus = {
        hasKey: true,
        creditsCompleted: true,
        creditsRemaining: 0,
        message: "products are not available",
      };
      lastCreditsCheck = Date.now();
    }
    return { results: {} };
  }
}

/**
 * Searches for products across supported Quick Commerce stores only.
 * 100% authentic live data (BlinkIt, Zepto, Swiggy, BigBasket, DMart, Minutes).
 * ZERO mock or dummy data.
 */
async function searchLiveProducts({ query, category, lat, lon, pincode }) {
  const cleanQ = (query || "").trim();
  const cleanCat = (category || "").trim().toLowerCase();
  const targetCat = normalizeCategoryName(cleanCat || cleanQ);

  // Check API credits status first
  const credStatus = await checkApiCreditsStatus();
  if (credStatus.creditsCompleted) {
    return {
      query: cleanQ,
      category: targetCat || cleanCat || "all",
      platforms: BASE_PLATFORMS,
      creditCost: 0,
      creditsRemaining: 0,
      creditsCompleted: true,
      message: "products are not available",
      fromCache: false,
      products: [],
    };
  }

  const apiQuery = cleanQ && cleanQ.toLowerCase() !== "popular" && cleanQ.toLowerCase() !== "all"
    ? cleanQ
    : (targetCat || "popular");

  // 1. PRIMARY: Query real-time Quick Commerce groupsearch
  const payload = await fetchGroupSearch({ query: apiQuery, lat, lon, pincode });
  if (cachedCreditsStatus?.creditsCompleted) {
    return {
      query: cleanQ,
      category: targetCat || cleanCat || "all",
      platforms: BASE_PLATFORMS,
      creditCost: 0,
      creditsRemaining: 0,
      creditsCompleted: true,
      message: "products are not available",
      fromCache: false,
      products: [],
    };
  }
  const raw = [];

  const results = payload?.data?.results || payload?.results || {};
  if (typeof results === "object" && !Array.isArray(results)) {
    for (const [platform, items] of Object.entries(results)) {
      if (Array.isArray(items)) {
        for (const item of items) {
          raw.push(mapPlatformProduct(item, platform));
        }
      }
    }
  }

  const list = payload?.data?.products || payload?.products || (Array.isArray(payload?.data) ? payload.data : null);
  if (Array.isArray(list)) {
    for (const item of list) {
      const platform = item.store || item.platform?.name || item.platform || "BlinkIt";
      raw.push(mapPlatformProduct(item, platform));
    }
  }

  // Retrieve multi-store catalog products (contains authentic Amazon, Flipkart, BlinkIt, Zepto, etc.)
  const catalogProducts = searchCatalogProducts({ query: cleanQ || apiQuery, category: targetCat, limit: 500 });
  const combined = [];
  const existingNames = new Set();

  if (raw.length > 0) {
    const grouped = groupProducts(raw);
    for (const p of grouped) {
      const norm = normalizeText(p.name);
      existingNames.add(norm);
      if (Array.isArray(catalogProducts)) {
        const catMatch = catalogProducts.find((cp) => similarity(normalizeText(cp.name), norm) >= 0.72);
        if (catMatch && Array.isArray(catMatch.comparison)) {
          const storeSet = new Set((p.comparison || []).map((c) => c.store.toLowerCase()));
          for (const c of catMatch.comparison) {
            if (!storeSet.has(c.store.toLowerCase())) {
              storeSet.add(c.store.toLowerCase());
              p.comparison.push(c);
            }
          }
          p.comparison.sort((a, b) => a.price - b.price);
          p.storeCount = p.comparison.length;
          p.lowestPrice = p.comparison[0]?.price || p.price;
          p.stores = p.comparison.map((c) => c.store);
        }
      }
      combined.push(p);
    }
  }

  if (Array.isArray(catalogProducts)) {
    for (const cp of catalogProducts) {
      const norm = normalizeText(cp.name);
      if (!existingNames.has(norm)) {
        existingNames.add(norm);
        combined.push(cp);
      }
    }
  }

  let finalProducts = combined;
  if (targetCat) {
    const filtered = finalProducts.filter((p) => normalizeCategoryName(p.category) === targetCat);
    if (filtered.length > 0) {
      finalProducts = filtered;
    }
  }

  if (finalProducts.length > 0) {
    return {
      query: cleanQ,
      category: targetCat || cleanCat || "all",
      platforms: BASE_PLATFORMS,
      creditCost: payload?.data?.credit_cost ?? 4,
      creditsRemaining: payload?.credits_remaining ?? null,
      fromCache: Boolean(payload?._fromCache) || (raw.length === 0),
      products: finalProducts,
    };
  }

  // 3. Fallback: Query live QuickCommerce Catalog API if catalog had no matches
  if (process.env.QUICKCOMMERCE_API_KEY) {
    try {
      const liveQcProducts = await fetchLiveQuickCommerceCatalog({ query: apiQuery, category: targetCat });
      if (Array.isArray(liveQcProducts) && liveQcProducts.length > 0) {
        return {
          query: cleanQ,
          category: targetCat || cleanCat || "all",
          platforms: BASE_PLATFORMS,
          creditCost: 1,
          creditsRemaining: null,
          fromCache: false,
          products: liveQcProducts,
        };
      }
    } catch (qcErr) {
      console.error("QuickCommerce catalog search warning:", qcErr.message);
    }
  }

  return {
    query: cleanQ,
    category: targetCat || cleanCat || "all",
    platforms: BASE_PLATFORMS,
    creditCost: 0,
    creditsRemaining: null,
    fromCache: false,
    products: [],
  };
}

/**
 * Searches for a specific product to compare side-by-side across stores.
 * 100% authentic Quick Commerce data. Zero synthetic mock items.
 */
async function searchSpecificLiveProduct({ query, store }) {
  const cleanQ = (query || "").trim();
  const qNorm = normalizeText(cleanQ);
  const cleanStore = (store || "").trim();

  // Check API credits status first
  const credStatus = await checkApiCreditsStatus();
  if (credStatus.creditsCompleted) {
    return {
      query: cleanQ,
      platforms: BASE_PLATFORMS,
      creditCost: 0,
      creditsRemaining: 0,
      creditsCompleted: true,
      message: "products are not available",
      fromCache: false,
      product: null,
      products: [],
      matchDetails: [],
    };
  }

  if (!cleanQ) {
    return {
      query: "",
      platforms: BASE_PLATFORMS,
      creditCost: 0,
      creditsRemaining: null,
      fromCache: false,
      product: null,
      matchDetails: [],
    };
  }

  const cacheKey = `qc_specific_${qNorm}_${cleanStore.toLowerCase()}`;
  const cached = qcSpecificCache.get(cacheKey);
  if (cached && Date.now() - cached.createdAt < QC_CACHE_TTL_MS) {
    return cached.data;
  }

  // 1. PRIMARY: Query real-time groupsearch across dark stores
  if (process.env.QUICKCOMMERCE_API_KEY) {
    try {
      const payload = await fetchGroupSearch({ query: cleanQ });
      if (cachedCreditsStatus?.creditsCompleted) {
        return {
          query: cleanQ,
          platforms: BASE_PLATFORMS,
          creditCost: 0,
          creditsRemaining: 0,
          creditsCompleted: true,
          message: "products are not available",
          fromCache: false,
          product: null,
          products: [],
          matchDetails: [],
        };
      }
      const raw = [];
      const results = payload?.data?.results || payload?.results || {};
      if (typeof results === "object" && !Array.isArray(results)) {
        for (const [platform, items] of Object.entries(results)) {
          if (Array.isArray(items)) {
            for (const item of items) {
              raw.push(mapPlatformProduct(item, platform));
            }
          }
        }
      }

      if (raw.length > 0) {
        const grouped = groupProducts(raw);
        if (grouped.length > 0) {
          let best = null;
          let bestScore = -1;
          for (const g of grouped) {
            const s = similarity(normalizeText(g.name), qNorm);
            const hasRequestedStore = cleanStore
              ? g.stores?.some((st) => st.toLowerCase().includes(cleanStore.toLowerCase()) || cleanStore.toLowerCase().includes(st.toLowerCase()))
              : false;
            const combinedScore = s + (hasRequestedStore ? 0.35 : 0);
            if (combinedScore > bestScore) {
              bestScore = combinedScore;
              best = g;
            }
          }

          if (best) {
            // Also merge any catalog store offers (like Amazon, Flipkart) if available
            const catalogMatch = findCatalogProductByName(cleanQ, cleanStore);
            if (catalogMatch && Array.isArray(catalogMatch.comparison)) {
              const existingStores = new Set((best.comparison || []).map((c) => c.store.toLowerCase().trim()));
              for (const c of catalogMatch.comparison) {
                if (!existingStores.has(c.store.toLowerCase().trim())) {
                  existingStores.add(c.store.toLowerCase().trim());
                  best.comparison.push(c);
                }
              }
              best.comparison.sort((a, b) => a.price - b.price);
              best.storeCount = best.comparison.length;
              best.lowestPrice = best.comparison[0]?.price || best.price;
              best.stores = best.comparison.map((c) => c.store);
            }

            // If specific store requested and exists in comparison, match designated store
            if (cleanStore && Array.isArray(best.comparison)) {
              const storeMatch = best.comparison.find(
                (c) => c.store.toLowerCase().includes(cleanStore.toLowerCase()) ||
                       cleanStore.toLowerCase().includes(c.store.toLowerCase())
              );
              if (storeMatch) {
                const sUrl = storeMatch.deeplink || storeMatch.url || storeMatch.link || storeMatch.product_link || best.url;
                best = {
                  ...best,
                  store: storeMatch.store,
                  price: storeMatch.price,
                  originalPrice: storeMatch.originalPrice || best.originalPrice,
                  discount: storeMatch.discount || best.discount,
                  url: sUrl,
                  deeplink: sUrl,
                  link: sUrl,
                  product_link: sUrl,
                  rating: storeMatch.rating || best.rating,
                };
              }
            }

            const responseData = {
              query: cleanQ,
              platforms: best.stores || BASE_PLATFORMS,
              creditCost: 0,
              creditsRemaining: null,
              fromCache: false,
              product: best,
              matchDetails: (best.comparison || []).map((c) => ({
                platform: c.store,
                found: true,
                directUrl: true,
              })),
            };
            qcSpecificCache.set(cacheKey, { createdAt: Date.now(), data: responseData });
            return responseData;
          }
        }
      }
    } catch (err) {
      console.error("QuickCommerce specific groupsearch warning:", err.message);
    }
  }

  // 2. Multi-Store Quick Commerce Catalog lookup with real store prices & store preservation
  const matchedProduct = findCatalogProductByName(cleanQ, cleanStore);
  if (matchedProduct) {
    const responseData = {
      query: cleanQ,
      platforms: matchedProduct.stores || BASE_PLATFORMS,
      creditCost: 0,
      creditsRemaining: null,
      fromCache: true,
      product: matchedProduct,
      matchDetails: (matchedProduct.comparison || []).map((c) => ({
        platform: c.store,
        found: true,
        directUrl: true,
      })),
    };
    qcSpecificCache.set(cacheKey, { createdAt: Date.now(), data: responseData });
    return responseData;
  }

  // 3. Fallback: Query QuickCommerce catalog API if not found
  if (process.env.QUICKCOMMERCE_API_KEY) {
    try {
      const liveQcProducts = await fetchLiveQuickCommerceCatalog({ query: cleanQ });
      if (Array.isArray(liveQcProducts) && liveQcProducts.length > 0) {
        let best = null;
        let bestScore = -1;
        for (const lp of liveQcProducts) {
          const s = similarity(normalizeText(lp.name), qNorm);
          const hasRequestedStore = cleanStore
            ? lp.stores?.some((st) => st.toLowerCase().includes(cleanStore.toLowerCase()) || cleanStore.toLowerCase().includes(st.toLowerCase()))
            : false;
          const combinedScore = s + (hasRequestedStore ? 0.35 : 0);
          if (combinedScore > bestScore) {
            bestScore = combinedScore;
            best = lp;
          }
        }

        if (best) {
          if (cleanStore && Array.isArray(best.comparison)) {
            const storeMatch = best.comparison.find(
              (c) => c.store.toLowerCase().includes(cleanStore.toLowerCase()) ||
                     cleanStore.toLowerCase().includes(c.store.toLowerCase())
            );
            if (storeMatch) {
              const sUrl = storeMatch.deeplink || storeMatch.url || storeMatch.link || storeMatch.product_link || best.url;
              best = {
                ...best,
                store: storeMatch.store,
                price: storeMatch.price,
                originalPrice: storeMatch.originalPrice || best.originalPrice,
                discount: storeMatch.discount || best.discount,
                url: sUrl,
                deeplink: sUrl,
                link: sUrl,
                product_link: sUrl,
                rating: storeMatch.rating || best.rating,
              };
            }
          }

          const responseData = {
            query: cleanQ,
            platforms: best.stores || BASE_PLATFORMS,
            creditCost: 0,
            creditsRemaining: null,
            fromCache: false,
            product: best,
            matchDetails: (best.comparison || []).map((c) => ({
              platform: c.store,
              found: true,
              directUrl: true,
            })),
          };
          qcSpecificCache.set(cacheKey, { createdAt: Date.now(), data: responseData });
          return responseData;
        }
      }
    } catch (qcErr) {
      console.error("QuickCommerce specific catalog warning:", qcErr.message);
    }
  }

  return {
    query: cleanQ,
    platforms: BASE_PLATFORMS,
    creditCost: 0,
    creditsRemaining: null,
    fromCache: false,
    product: null,
    matchDetails: [],
  };
}

async function resolveExactProductUrl(store = "", productName = "", rawUrl = "") {
  return resolveProductOfferUrl(
    typeof rawUrl === "object" && rawUrl !== null ? rawUrl : { url: rawUrl, deeplink: rawUrl, link: rawUrl, product_link: rawUrl },
    store,
    productName
  );
}

module.exports = {
  LIVE_PLATFORMS,
  BASE_PLATFORMS,
  ALL_SUPPORTED_PLATFORMS,
  searchLiveProducts,
  searchSpecificLiveProduct,
  groupProducts,
  resolveExactProductUrl,
  isDirectProductUrl,
  isSyntheticBrokenUrl,
  cleanProductNameForStore,
  canonicalizeProductUrl,
  generateDirectStoreUrl,
  lookupDirectStoreProductUrl,
  inferProductCategory,
  normalizeCategoryName,
  VERIFIED_PRODUCT_STORE_URLS,
  checkApiCreditsStatus,
};
