const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

const SERPAPI_BASE = "https://serpapi.com/search";
const LIVE_PLATFORMS = ["Amazon", "Flipkart", "Myntra", "Croma", "Reliance Digital", "Apple Store", "Ajio"];

function throttleByCache(key) {
  if (!searchCache.has(key)) {
    searchCache.set(key, Date.now());
    return;
  }

  const last = searchCache.get(key);
  const elapsed = Date.now() - last;
  const min = Math.ceil(elapsed / 60000);

  if (min < 1) throw new Error(`Live search blocked. Try again in ${60 - Math.floor(elapsed / 1000)} seconds`);

  searchCache.set(key, Date.now());

  if (searchCache.size > 200) {
    const oldest = searchCache.keys().next().value;
    if (oldest) searchCache.delete(oldest);
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

const STOP_WORDS = new Set([
  "for","with","and","the","a","an","of","on","in",
  "men","mens","women","womens","unisex","shoe","shoes",
  "footwear","running","casual","original","latest",
]);

function meaningfulTokens(value) {
  return [...tokens(value)].filter((t) => !STOP_WORDS.has(t));
}

function similarity(a, b) {
  const aa = new Set(meaningfulTokens(a));
  const bb = new Set(meaningfulTokens(b));
  
  if (!aa.size || !bb.size) return 0;
  let inter = 0;
  for (const t of aa) if (bb.has(t)) inter++;
  
  const jaccard = inter / (aa.size + bb.size - inter);
  const minSize = Math.min(aa.size, bb.size);
  const coverage = minSize > 0 ? inter / minSize : 0;
  
  return Math.max(jaccard, coverage >= 0.8 ? coverage : 0);
}

function candidateMatchScore(query, item) {
  const qTokens = meaningfulTokens(query);
  const cTokens = new Set(
    meaningfulTokens(`${item.brand || ""} ${item.name || ""} ${item.quantity || ""}`)
  );
  if (!qTokens.length || !cTokens.size) return 0;

  const matched = qTokens.filter((t) => cTokens.has(t));
  const coverage = matched.length / qTokens.length;
  const nQuery = normalizeText(query);
  const nCand = normalizeText(`${item.brand || ""} ${item.name || ""}`);

  const phraseBonus = nCand.includes(nQuery) ? 0.35 : 0;
  const brandBonus =
    item.brand && nQuery.includes(normalizeText(item.brand)) ? 0.15 : 0;

  // Accessory Filter: Reject cases/covers if the user didn't ask for them
  const accessoryKeywords = ["case", "cover", "guard", "protector", "glass", "strap", "skin", "bumper"];
  let accessoryPenalty = 0;
  
  const queryHasAccessory = accessoryKeywords.some(kw => nQuery.includes(kw));
  const itemHasAccessory = accessoryKeywords.some(kw => nCand.includes(kw));
  
  if (!queryHasAccessory && itemHasAccessory) {
    accessoryPenalty = 1.0; // Heavily penalize or completely exclude it
  }

  return (coverage + phraseBonus + brandBonus) - accessoryPenalty;
}

function detectPlatform(source = "") {
  const s = source.toLowerCase();
  if (s.includes("amazon"))   return "Amazon";
  if (s.includes("flipkart")) return "Flipkart";
  if (s.includes("myntra"))   return "Myntra";
  if (s.includes("croma"))    return "Croma";
  if (s.includes("reliance")) return "Reliance Digital";
  if (s.includes("apple"))    return "Apple Store";
  if (s.includes("ajio"))     return "Ajio";
  return null;
}

function generateFallbackUrl(platform, productName) {
  const q = encodeURIComponent(productName);
  if (platform === "Amazon")   return `https://www.amazon.in/s?k=${q}`;
  if (platform === "Flipkart") return `https://www.flipkart.com/search?q=${q}`;
  if (platform === "Myntra")   return `https://www.myntra.com/${q}`;
  if (platform === "Croma")    return `https://www.croma.com/searchB?q=${q}`;
  if (platform === "Reliance Digital") return `https://www.reliancedigital.in/search?q=${q}`;
  
  if (platform === "Apple Store") return `https://www.apple.com/in/search/${q}`;
  if (platform === "Ajio")     return `https://www.ajio.com/search/?text=${q}`;
  return `https://www.google.com/search?q=${q}+buy+india`;
}

function mapSerpItem(item, platform) {
  const price    = Number(item.extracted_price  ?? 0);
  const mrp      = Number(item.extracted_old_price ?? 0);
  const discount = mrp > price && price > 0
    ? `${Math.round(((mrp - price) / mrp) * 100)}% OFF`
    : "";

  const url = item.link || item.product_link || generateFallbackUrl(platform, item.title || "");

  return {
    id:            `serp-${platform}-${crypto.randomUUID()}`,
    name:          item.title || "Unnamed product",
    brand:         extractBrand(item.title || "", platform),
    quantity:      "",
    price,
    originalPrice: mrp > price ? mrp : undefined,
    discount,
    rating:        item.rating  ?? null,
    reviews:       item.reviews ?? 0,
    availability:  "In Stock",
    image:         item.thumbnail || item.serpapi_thumbnail || "",
    url,
    store:         platform,
    source:        "SerpAPI / Google Shopping",
  };
}

const KNOWN_BRANDS = [
  "Apple","Samsung","OnePlus","Xiaomi","Redmi","Poco","Realme","Nokia",
  "Motorola","Sony","LG","Asus","Lenovo","HP","Dell","Acer","boAt","JBL",
  "Adidas","Nike","Puma","Reebok","Levi","Zara","H&M","Myntra","Flipkart",
];
function extractBrand(title, platform) {
  for (const b of KNOWN_BRANDS) {
    if (title.toLowerCase().includes(b.toLowerCase())) return b;
  }
  const first = title.trim().split(/\s+/)[0] || "";
  return first.length > 1 ? first : "";
}

function groupProducts(products) {
  const groups = [];

  for (const p of products) {
    if (!p.name || !p.price) continue;
    const key = normalizeText(`${p.brand} ${p.name}`);
    let g = groups.find((x) => x.key === key);
    if (!g) {
      g = { key, items: [] };
      groups.push(g);
    }
    g.items.push(p);
  }

  for (let i = 0; i < groups.length; i++) {
    for (let j = groups.length - 1; j > i; j--) {
      if (
        similarity(groups[i].items[0]?.name || "", groups[j].items[0]?.name || "") >= 0.78
      ) {
        groups[i].items.push(...groups[j].items);
        groups[j].items = [];
      }
    }
  }

  return groups
    .filter((g) => g.items.length)
    .map((g) => {
      const byStore = new Map();
      for (const item of g.items) {
        const ex = byStore.get(item.store);
        if (!ex || item.price < ex.price) byStore.set(item.store, item);
      }

      const comparison = [...byStore.values()].sort((a, b) => a.price - b.price);
      const best = comparison[0];

      return {
        id:            `serp-${Buffer.from(normalizeText(best.name)).toString("base64url").slice(0, 30)}`,
        name:          best.name,
        brand:         best.brand,
        quantity:      best.quantity,
        category:      "Live Results",
        price:         best.price,
        originalPrice: best.originalPrice,
        discount:      best.discount,
        rating:        best.rating,
        reviews:       best.reviews,
        availability:  best.availability,
        image:         best.image,
        url:           best.url,
        store:         best.store,
        storeCount:    comparison.length,
        comparison,
        lowestPrice:   best.price,
        stores:        comparison.map((x) => x.store),
        live:          true,
      };
    })
    .sort((a, b) => {
      if (b.storeCount !== a.storeCount) return b.storeCount - a.storeCount;
      return a.price - b.price;
    });
}

function selectSpecificProduct(products, query) {
  const selected = [];
  const details  = [];

  for (const platform of LIVE_PLATFORMS) {
    const candidates = products
      .filter((p) => p.store === platform && p.name && p.price > 0)
      .map((p)    => ({ p, score: candidateMatchScore(query, p) }))
      .sort((a, b) => b.score - a.score || a.p.price - b.p.price);

    const best = candidates[0];
    if (!best) { details.push({ platform, found: false }); continue; }

    if (best.score < 0.35) {
      details.push({ platform, found: false, reason: `Score too low: ${best.score.toFixed(2)}` });
      continue;
    }

    selected.push(best.p);
    details.push({ platform, found: true, score: +best.score.toFixed(3) });
  }

  if (!selected.length) return { product: null, details };

  const comparison = selected;
  const cheapest   = comparison.reduce((a, b) => (b.price < a.price ? b : a));

  return {
    product: {
      id:            `serp-${Buffer.from(normalizeText(query)).toString("base64url").slice(0, 30)}`,
      name:          query,
      brand:         cheapest.brand,
      quantity:      cheapest.quantity,
      category:      "Live Specific Product",
      price:         cheapest.price,
      originalPrice: cheapest.originalPrice,
      discount:      cheapest.discount,
      rating:        cheapest.rating,
      reviews:       cheapest.reviews,
      availability:  cheapest.availability,
      image:         cheapest.image,
      url:           cheapest.url,
      store:         cheapest.store,
      storeCount:    comparison.length,
      comparison,
      lowestPrice:   cheapest.price,
      stores:        comparison.map((x) => x.store),
      live:          true,
      exactMatch:    true,
    },
    details,
  };
}



async function callSerpApi(query) {
  const key = process.env.SERPAPI_KEY;
  if (!key || key === "YOUR_SERPAPI_KEY_HERE") {
    throw new Error("SERPAPI_KEY is not set.");
  }

  const params = new URLSearchParams({
    engine: "google_shopping",
    q:      query,
    gl:     "in",
    hl:     "en",
    num:    "40",
    api_key: key,
  });

  let response;
  try {
    response = await fetch(`${SERPAPI_BASE}?${params}`, {
      headers: { Accept: "application/json" },
    });
  } catch (netErr) {
    
    throw new Error(`SerpAPI network error: ${netErr.message}`);
  }

  let text = "";
  try {
    text = await response.text();
  } catch (eofErr) {
    
    throw new Error(`SerpAPI stream EOF: ${eofErr.message}`);
  }

  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    
    throw new Error("SerpAPI returned non-JSON");
  }

  if (!response.ok) {
    console.error(`SerpAPI HTTP ${response.status}:`, json);
    if (response.status === 429 || response.status >= 500) {
      
    }
    throw new Error(`SerpAPI error: HTTP ${response.status}`);
  }

  const raw = [];
  for (const item of json.shopping_results || []) {
    const platform = detectPlatform(item.source || "");
    if (!platform) continue;
    const price = Number(item.extracted_price ?? 0);
    if (price <= 0) continue;
    raw.push(mapSerpItem(item, platform));
  }

  if (!raw.length) {
    console.warn(`SerpAPI returned 0 products for "${query}" on our platforms.`);
    return [];
  }

  return raw;
}

async function searchLiveProducts({ query }) {
  

  

  console.log(`SerpAPI search: "${query}"`);
  let raw = await callSerpApi(query);
  
  const hasAmazon = raw.some(r => r.store === 'Amazon');
  const hasFlipkart = raw.some(r => r.store === 'Flipkart');
  if (!hasAmazon || !hasFlipkart) {
    console.log("Triggering fallback scrapers...");
    const [amzRaw, fkRaw] = await Promise.all([
      !hasAmazon ? scrapeAmazonFallback(query) : Promise.resolve([]),
      !hasFlipkart ? scrapeFlipkartFallback(query) : Promise.resolve([]),
    ]);
    raw = [...raw, ...amzRaw, ...fkRaw];
  }
  
  const grouped = groupProducts(raw);
  const result  = {
    query,
    platforms:        LIVE_PLATFORMS,
    creditCost:       1,
    creditsRemaining: null,
    
    
    products:         grouped,
  };

  
  return result;
}

async function searchSpecificLiveProduct({ query }) {
  

  const queryTokens   = meaningfulTokens(query);
  const searchQuery   = queryTokens.length > 6
    ? queryTokens.slice(0, 6).join(" ")
    : query;

  console.log(`SerpAPI specific: "${searchQuery}"`);
  let raw = await callSerpApi(searchQuery);
  const hasAmazon = raw.some(r => r.store === 'Amazon');
  const hasFlipkart = raw.some(r => r.store === 'Flipkart');
  if (!hasAmazon || !hasFlipkart) {
    const [amzRaw, fkRaw] = await Promise.all([
      !hasAmazon ? scrapeAmazonFallback(searchQuery) : Promise.resolve([]),
      !hasFlipkart ? scrapeFlipkartFallback(searchQuery) : Promise.resolve([]),
    ]);
    raw = [...raw, ...amzRaw, ...fkRaw];
  }
  const match = selectSpecificProduct(raw, query);

  return {
    query,
    platforms:        LIVE_PLATFORMS,
    creditCost:       1,
    creditsRemaining: null,
    
    
    product:          match.product,
    matchDetails:     match.details,
  };
}

async function scrapeAmazonFallback(query) {
  try {
    const key = process.env.SERPAPI_KEY;
    if (!key || key === "YOUR_SERPAPI_KEY_HERE") {
      console.warn("SERPAPI_KEY not set. Skipping SerpAPI Amazon fallback.");
      return [];
    }

    const params = new URLSearchParams({
      engine: "amazon",
      amazon_domain: "amazon.in",
      k: query,
      api_key: key
    });

    const response = await axios.get(`https://serpapi.com/search?${params}`);
    const results = [];

    const searchResults = response.data.organic_results || [];
    for (let i = 0; i < Math.min(searchResults.length, 5); i++) {
      const item = searchResults[i];
      const price = item.price ? Number(item.price.replace(/[^0-9.]/g, "")) : 0;
      
      if (item.title && price > 0) {
        results.push({
          id: `serp-Amazon-${crypto.randomUUID()}`,
          name: item.title,
          brand: extractBrand(item.title, 'Amazon'),
          quantity: "",
          price,
          originalPrice: undefined,
          discount: "",
          rating: item.rating || null,
          reviews: item.reviews || 0,
          availability: "In Stock",
          image: item.thumbnail || "",
          url: item.link,
          store: "Amazon",
          source: "SerpAPI Amazon Engine",
        });
      }
    }
    return results;
  } catch (err) {
    console.error("SerpAPI Amazon fallback failed:", err.message);
    return [];
  }
}

async function scrapeFlipkartFallback(query) {
  try {
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      }
    });
    const $ = cheerio.load(data);
    const results = [];
    
    $('a[rel="noopener noreferrer"]').each((i, el) => {
      if (results.length >= 5) return;
      const title = $(el).find('.KzDlHZ, .WKTcLC, .s1Q9rs').text().trim() || $(el).attr('title');
      const priceText = $(el).find('.Nx9bqj').text().replace(/[^0-9]/g, '');
      const price = parseInt(priceText, 10);
      const link = 'https://www.flipkart.com' + $(el).attr('href');
      const img = $(el).find('img').attr('src');
      
      if (title && price > 0) {
        results.push({
          id: `serp-Flipkart-${crypto.randomUUID()}`,
          name: title,
          brand: extractBrand(title, 'Flipkart'),
          quantity: "",
          price,
          originalPrice: undefined,
          discount: "",
          rating: null,
          reviews: 0,
          availability: "In Stock",
          image: img || "",
          url: link,
          store: "Flipkart",
          source: "Direct Scrape",
        });
      }
    });
    return results;
  } catch (err) {
    console.error("Flipkart scrape failed:", err.message);
    return [];
  }
}

module.exports = {
  LIVE_PLATFORMS,
  searchLiveProducts,
  searchSpecificLiveProduct,
  groupProducts,
};
