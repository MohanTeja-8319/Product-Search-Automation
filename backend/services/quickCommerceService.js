const API_BASE_URL = "https://api.quickcommerceapi.com";

const LIVE_PLATFORMS = ["Amazon", "Flipkart", "Myntra"];

// Short-lived in-memory cache. A repeated search for the same product/location
// reuses the previous QuickCommerce response instead of spending credits again.
const SEARCH_CACHE_TTL_MS = 10 * 60 * 1000;
const searchCache = new Map();

function makeCacheKey({ query, lat, lon, pincode }) {
  return JSON.stringify({
    query: normalizeText(query),
    lat: Number(lat),
    lon: Number(lon),
    pincode: String(pincode || ""),
  });
}

function getCachedSearch(key) {
  const cached = searchCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.createdAt > SEARCH_CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  return cached.payload;
}

function setCachedSearch(key, payload) {
  searchCache.set(key, { createdAt: Date.now(), payload });
  // Prevent unbounded growth if many different searches are made.
  if (searchCache.size > 100) {
    const oldestKey = searchCache.keys().next().value;
    if (oldestKey) searchCache.delete(oldestKey);
  }
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

function similarity(a, b) {
  const aa = tokens(a);
  const bb = tokens(b);
  if (!aa.size || !bb.size) return 0;

  let intersection = 0;
  for (const token of aa) {
    if (bb.has(token)) intersection += 1;
  }

  return intersection / (aa.size + bb.size - intersection);
}

function canonicalProductName(item) {
  const brand = normalizeText(item.brand || "");
  const name = normalizeText(item.name || "");
  const quantity = normalizeText(item.quantity || "");
  return [brand, name, quantity].filter(Boolean).join(" ");
}



const MATCH_STOP_WORDS = new Set([
  "for", "with", "and", "the", "a", "an", "of", "on", "in",
  "men", "mens", "women", "womens", "unisex", "shoe", "shoes",
  "footwear", "running", "casual", "original", "latest"
]);

function meaningfulTokens(value) {
  return [...tokens(value)].filter((token) => !MATCH_STOP_WORDS.has(token));
}

function candidateMatchScore(query, item) {
  const queryTokens = meaningfulTokens(query);
  const candidateTokens = new Set(
    meaningfulTokens(`${item.brand || ""} ${item.name || ""} ${item.quantity || ""}`)
  );

  if (!queryTokens.length || !candidateTokens.size) return 0;

  const matched = queryTokens.filter((token) => candidateTokens.has(token));
  const coverage = matched.length / queryTokens.length;
  const normalizedQuery = normalizeText(query);
  const normalizedCandidate = normalizeText(
    `${item.brand || ""} ${item.name || ""} ${item.quantity || ""}`
  );

  // Strong preference for the requested model appearing as a phrase.
  const phraseBonus = normalizedCandidate.includes(normalizedQuery) ? 0.35 : 0;
  const brandBonus = item.brand && normalizedQuery.includes(normalizeText(item.brand)) ? 0.15 : 0;

  return coverage + phraseBonus + brandBonus;
}

/**
 * For a specific product name, select exactly ONE best candidate from each
 * supported store. We only accept a comparison when every store has a strong
 * match to the requested model.
 */
function selectSpecificProduct(rawProducts, query) {
  const selected = [];
  const details = [];

  for (const platform of LIVE_PLATFORMS) {
    const candidates = rawProducts
      .filter((item) => item.store === platform && item.name && item.price > 0)
      .map((item) => ({ item, score: candidateMatchScore(query, item) }))
      .sort((a, b) => b.score - a.score || a.item.price - b.item.price);

    const best = candidates[0];
    if (!best) {
      details.push({ platform, found: false });
      continue;
    }

    // Require a reasonable match score instead of a strict 100% exact token match.
    if (best.score < 0.4) {
      details.push({ platform, found: false, reason: `Match score too low: ${best.score.toFixed(2)}` });
      continue;
    }

    selected.push(best.item);
    details.push({ platform, found: true, score: Number(best.score.toFixed(3)) });
  }

  if (selected.length === 0) {
    return { product: null, details };
  }

  const comparison = selected.map((item) => mapPlatformProduct(item, item.store));
  const best = comparison.reduce((lowest, item) =>
    item.price < lowest.price ? item : lowest
  );

  return {
    product: {
      id: `live-${Buffer.from(normalizeText(query)).toString("base64url").slice(0, 30)}`,
      name: query,
      brand: best.brand,
      quantity: best.quantity,
      category: "Live Specific Product",
      price: best.price,
      originalPrice: best.originalPrice,
      discount: best.discount,
      rating: best.rating,
      reviews: best.reviews,
      availability: best.availability,
      image: best.image,
      url: best.url,
      store: best.store,
      storeCount: comparison.length,
      comparison,
      lowestPrice: best.price,
      stores: comparison.map((item) => item.store),
      live: true,
      exactMatch: true,
    },
    details,
  };
}

function mapPlatformProduct(item, platform) {
  const price = Number(item.offer_price ?? item.price ?? 0);
  const mrp = Number(item.mrp ?? 0);

  return {
    id: String(item.id ?? item.item_id ?? `${platform}-${Date.now()}-${Math.random()}`),
    name: item.name || "Unnamed product",
    brand: item.brand || "",
    quantity: item.quantity || "",
    price,
    originalPrice: mrp || undefined,
    discount:
      mrp > price && price > 0
        ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF`
        : "",
    rating: item.rating ?? null,
    reviews: item.rating_count ?? item.ratingCount ?? 0,
    availability: item.available === false ? "Out of Stock" : "In Stock",
    image: item.images?.[0] || item.image || "",
    url: item.deeplink || "",
    store: item.platform?.name || platform,
    inventory: item.inventory ?? null,
    sla: item.platform?.sla || null,
    source: "QuickCommerce API",
  };
}

function groupProducts(rawProducts) {
  const groups = [];

  for (const product of rawProducts) {
    if (!product.name || !product.price) continue;

    const exactKey = canonicalProductName(product);
    let group = groups.find((candidate) => candidate.key === exactKey);

    if (!group) {
      group = {
        key: exactKey,
        items: [],
        brands: new Set(),
      };
      groups.push(group);
    }

    group.items.push(product);
    if (product.brand) group.brands.add(normalizeText(product.brand));
  }

  // Merge close names such as "iPhone 16 (128 GB)" and "Apple iPhone 16 128GB".
  for (let i = 0; i < groups.length; i += 1) {
    for (let j = groups.length - 1; j > i; j -= 1) {
      const a = groups[i];
      const b = groups[j];
      const aName = a.items[0]?.name || "";
      const bName = b.items[0]?.name || "";
      const aBrand = normalizeText(a.items[0]?.brand || "");
      const bBrand = normalizeText(b.items[0]?.brand || "");

      const brandMatches = !aBrand || !bBrand || aBrand === bBrand;
      const nameSimilarity = similarity(aName, bName);

      if (brandMatches && nameSimilarity >= 0.78) {
        a.items.push(...b.items);
        b.items = [];
      }
    }
  }

  return groups
    .filter((group) => group.items.length)
    .map((group) => {
      const uniqueStores = new Map();

      for (const item of group.items) {
        const existing = uniqueStores.get(item.store);
        if (!existing || item.price < existing.price) {
          uniqueStores.set(item.store, item);
        }
      }

      const comparison = [...uniqueStores.values()].sort(
        (a, b) => a.price - b.price
      );

      const best = comparison[0];

      return {
        id: `live-${Buffer.from(canonicalProductName(best)).toString("base64url").slice(0, 30)}`,
        name: best.name,
        brand: best.brand,
        quantity: best.quantity,
        category: "Live Results",
        price: best.price,
        originalPrice: best.originalPrice,
        discount: best.discount,
        rating: best.rating,
        reviews: best.reviews,
        availability: best.availability,
        image: best.image,
        url: best.url,
        store: best.store,
        storeCount: comparison.length,
        comparison,
        lowestPrice: best.price,
        stores: comparison.map((item) => item.store),
        live: true,
      };
    })
    .sort((a, b) => {
      if (b.storeCount !== a.storeCount) return b.storeCount - a.storeCount;
      return a.price - b.price;
    });
}

async function fetchGroupSearch({ query, lat, lon, pincode }) {
  const cacheKey = makeCacheKey({ query, lat, lon, pincode });
  const cached = getCachedSearch(cacheKey);
  if (cached) {
    return { ...cached, _fromCache: true };
  }

  const params = new URLSearchParams({
    q: query,
    lat: String(lat),
    lon: String(lon),
    platforms: LIVE_PLATFORMS.join(","),
  });

  if (pincode) params.set("pincode", pincode);

  const response = await fetch(`${API_BASE_URL}/v1/groupsearch?${params}`, {
    headers: {
      "X-API-Key": process.env.QUICKCOMMERCE_API_KEY,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  let payload = null;
  try {
    payload = JSON.parse(text);
  } catch {
    payload = { message: text };
  }

  if (!response.ok) {
    const error = new Error(
      payload?.message || `QuickCommerce API returned ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  setCachedSearch(cacheKey, payload);
  return payload;
}

async function searchLiveProducts({ query, lat, lon, pincode }) {
  if (!process.env.QUICKCOMMERCE_API_KEY) {
    const error = new Error("QUICKCOMMERCE_API_KEY is not configured on the backend.");
    error.status = 500;
    throw error;
  }

  const payload = await fetchGroupSearch({ query, lat, lon, pincode });
  const raw = [];

  const results = payload?.data?.results || {};
  for (const platform of LIVE_PLATFORMS) {
    for (const item of results[platform] || []) {
      raw.push(mapPlatformProduct(item, platform));
    }
  }

  return {
    query,
    platforms: LIVE_PLATFORMS,
    creditCost: payload?.data?.credit_cost ?? LIVE_PLATFORMS.length,
    creditsRemaining: payload?.credits_remaining ?? null,
    fromCache: Boolean(payload?._fromCache),
    products: groupProducts(raw),
  };
}


async function searchSpecificLiveProduct({ query, lat, lon, pincode }) {
  if (!process.env.QUICKCOMMERCE_API_KEY) {
    const error = new Error("QUICKCOMMERCE_API_KEY is not configured on the backend.");
    error.status = 500;
    throw error;
  }

  // Simplify the search query for the external API. Extremely long titles often return 0 results.
  const queryTokens = meaningfulTokens(query);
  const searchApiQuery = queryTokens.length > 6 ? queryTokens.slice(0, 6).join(" ") : query;
  
  const payload = await fetchGroupSearch({ query: searchApiQuery, lat, lon, pincode });
  const raw = [];
  const results = payload?.data?.results || {};

  for (const platform of LIVE_PLATFORMS) {
    for (const item of results[platform] || []) {
      raw.push(mapPlatformProduct(item, platform));
    }
  }

  const match = selectSpecificProduct(raw, query);

  return {
    query,
    platforms: LIVE_PLATFORMS,
    creditCost: payload?.data?.credit_cost ?? LIVE_PLATFORMS.length,
    creditsRemaining: payload?.credits_remaining ?? null,
    fromCache: Boolean(payload?._fromCache),
    product: match.product,
    matchDetails: match.details,
  };
}

module.exports = {
  LIVE_PLATFORMS,
  searchLiveProducts,
  searchSpecificLiveProduct,
  groupProducts,
};
