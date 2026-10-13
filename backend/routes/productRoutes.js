const express = require("express");
const {
  searchLiveProducts,
  searchSpecificLiveProduct,
  resolveExactProductUrl,
  generateDirectStoreUrl,
  inferProductCategory,
  normalizeCategoryName,
  checkApiCreditsStatus,
} = require("../services/quickCommerceService");
const SearchLog = require("../models/SearchLog");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { getJwtSecret } = require("../config/jwt");
const { isValidObjectId } = require("../utils/mongoHelpers");

const router = express.Router();

function getLocation(req) {
  const lat = Number(req.query.lat ?? process.env.SEARCH_LAT ?? 12.9021);
  const lon = Number(req.query.lon ?? process.env.SEARCH_LON ?? 77.6639);
  const pincode = req.query.pincode || process.env.SEARCH_PINCODE || "";

  // Fall back to Bengaluru coordinates if env not set — never block the search
  return {
    lat: Number.isFinite(lat) ? lat : 12.9021,
    lon: Number.isFinite(lon) ? lon : 77.6639,
    pincode,
  };
};

function extractProductFromUrl(urlStr) {
  try {
    let urlToParse = urlStr;
    if (!urlToParse.startsWith('http://') && !urlToParse.startsWith('https://')) {
      if (urlToParse.startsWith('www.') || urlToParse.includes('.com/') || urlToParse.includes('.in/')) {
        urlToParse = 'https://' + urlToParse;
      } else {
        return urlStr;
      }
    }

    const parsed = new URL(urlToParse);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname;

    let slug = "";

    if (host.includes("amazon.")) {
      const match = pathname.match(/^\/([^/]+)\/dp\//);
      if (match) slug = match[1];
    } else if (host.includes("flipkart.com")) {
      const match = pathname.match(/^\/([^/]+)\/p\//);
      if (match) slug = match[1];
    }
    
    if (!slug) {
       const segments = pathname.split('/').filter(s => s.includes('-') && isNaN(s.replace(/-/g, '')));
       if (segments.length) {
         slug = segments.sort((a,b) => b.length - a.length)[0];
       }
    }

    if (slug) {
      return decodeURIComponent(slug).replace(/-/g, ' ').replace(/\+/g, ' ').trim();
    }
    return urlStr;
  } catch (e) {
    return urlStr;
  }
}

const QC_STORES_SET = new Set(["amazon", "flipkart", "blinkit", "zepto", "swiggy", "bigbasket", "dmart", "minutes", "jiomart"]);

function mapDbProduct(p) {
  const qcPlatforms = Array.isArray(p.platforms)
    ? p.platforms.filter((pl) => pl && pl.name && QC_STORES_SET.has(String(pl.name).toLowerCase().trim()))
    : [];

  const comparison = qcPlatforms.length > 0
    ? qcPlatforms.map((pl) => {
        const pUrl = pl.deeplink || pl.url || pl.product_link || pl.link || `/api/products/redirect?store=${encodeURIComponent(pl.name)}&name=${encodeURIComponent(p.title)}`;
        return {
          id: `qc-${pl.name}-${p._id}`,
          name: p.title,
          brand: p.brand || "",
          price: pl.price || p.currentPrice || 0,
          originalPrice: pl.originalPrice || p.originalPrice || pl.price,
          discount: p.discount,
          rating: (Number.isFinite(pl.rating) && pl.rating > 0) ? pl.rating : ((Number.isFinite(p.rating) && p.rating > 0) ? p.rating : 4.5),
          reviews: (Number.isFinite(p.reviewsCount) && p.reviewsCount > 0) ? p.reviewsCount : 120,
          availability: pl.inStock === false ? "Out of Stock" : "In Stock",
          image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
          url: pUrl,
          deeplink: pUrl,
          link: pUrl,
          product_link: pUrl,
          store: pl.name,
          source: p.source || "Quick Commerce",
        };
      })
    : [{
        id: `qc-BlinkIt-${p._id}`,
        name: p.title,
        brand: p.brand || "",
        price: p.currentPrice || 0,
        originalPrice: p.originalPrice || p.currentPrice,
        discount: p.discount,
        rating: (Number.isFinite(p.rating) && p.rating > 0) ? p.rating : 4.5,
        reviews: (Number.isFinite(p.reviewsCount) && p.reviewsCount > 0) ? p.reviewsCount : 120,
        availability: p.availability || "In Stock",
        image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        url: `/api/products/redirect?store=BlinkIt&name=${encodeURIComponent(p.title)}`,
        deeplink: `/api/products/redirect?store=BlinkIt&name=${encodeURIComponent(p.title)}`,
        link: `/api/products/redirect?store=BlinkIt&name=${encodeURIComponent(p.title)}`,
        product_link: `/api/products/redirect?store=BlinkIt&name=${encodeURIComponent(p.title)}`,
        store: "BlinkIt",
        source: p.source || "Quick Commerce",
      }];

  const sortedComp = [...comparison].sort((a, b) => a.price - b.price);
  const primaryStore = sortedComp[0]?.store || "BlinkIt";
  const primaryItem = sortedComp[0];
  const primaryUrl = primaryItem.deeplink || primaryItem.url || primaryItem.link || primaryItem.product_link;

  return {
    id: `db-${p._id}`,
    name: p.title,
    category: (p.category && p.category !== "Live Results" && p.category !== "General")
      ? p.category
      : (inferProductCategory(p.title, p.category) || p.category || "General"),
    price: primaryItem.price || p.currentPrice || sortedComp[0].price,
    originalPrice: p.originalPrice || primaryItem.originalPrice,
    discount: p.discount,
    rating: p.rating || primaryItem.rating || 4.5,
    reviews: p.reviewsCount || primaryItem.reviews || 120,
    availability: p.availability || "In Stock",
    image: p.image || primaryItem.image,
    url: primaryUrl,
    deeplink: primaryUrl,
    link: primaryUrl,
    product_link: primaryUrl,
    store: primaryStore,
    storeCount: comparison.length,
    comparison: sortedComp,
    lowestPrice: sortedComp[0]?.price || p.currentPrice,
    stores: comparison.map((c) => c.store),
    live: true,
  };
}

router.get("/search", async (req, res) => {
  let query = String(req.query.q || "").trim();
  const category = String(req.query.category || "").trim();
  query = extractProductFromUrl(query);

  if (!query && !category) {
    query = "popular";
  }

  try {
    const location = getLocation(req);

    const startTime = Date.now();
    const result = await searchLiveProducts({
      query,
      category,
      ...location,
    });

    if (result.creditsCompleted || result.message === "products are not available") {
      return res.json({
        status: "success",
        query: query,
        products: [],
        platforms: result.platforms || ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "Minutes", "JioMart"],
        creditsRemaining: 0,
        creditsCompleted: true,
        message: "products are not available",
      });
    }

    const durationStr = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

    // Asynchronously record search in SearchLog
    let userName = "Storefront Guest";
    let userEmail = "";
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, getJwtSecret());
        if (mongoose.connection.readyState === 1 && isValidObjectId(decoded.id)) {
          const u = await User.findById(decoded.id);
          if (u) {
            userName = u.fullName;
            userEmail = u.email;
            userId = u._id;
          }
        }
      }
    } catch (_) {}

    if (mongoose.connection.readyState === 1) {
      SearchLog.create({
        query,
        user: userName,
        userEmail,
        userId,
        platforms: result.platforms?.length || 8,
        platformList: Array.isArray(result.platforms)
          ? result.platforms.map((p) => p.name || p).join(", ")
          : "Amazon, Flipkart, BlinkIt, Zepto, Swiggy, BigBasket, Myntra, Nykaa",
        productsFound: result.products?.length || 0,
        duration: durationStr,
        status: "Completed",
      }).catch(() => {});
    }

    // Persist live products into MongoDB Product model
    if (mongoose.connection.readyState === 1 && Array.isArray(result.products) && result.products.length > 0) {
      const savePromises = result.products.map(p => {
        if (!p || (!p.name && !p.title)) return null;
        const title = p.name || p.title;
        const platforms = Array.isArray(p.comparison) && p.comparison.length > 0
          ? p.comparison.map(c => {
              const cUrl = c.deeplink || c.url || c.link || c.product_link || "";
              return {
                name: c.store || "BlinkIt",
                price: c.price || p.price || 0,
                originalPrice: c.originalPrice || 0,
                inStock: c.availability !== "Out of Stock",
                url: cUrl,
                deeplink: cUrl,
                link: cUrl,
                product_link: cUrl,
                rating: (Number.isFinite(c.rating) && c.rating > 0) ? c.rating : null,
              };
            })
          : [{
              name: p.store || "BlinkIt",
              price: p.price || 0,
              originalPrice: p.originalPrice || 0,
              inStock: true,
              url: p.deeplink || p.url || p.link || p.product_link || "",
              deeplink: p.deeplink || p.url || p.link || p.product_link || "",
              link: p.deeplink || p.url || p.link || p.product_link || "",
              product_link: p.deeplink || p.url || p.link || p.product_link || "",
            }];

        return Product.findOneAndUpdate(
          { title },
          {
            $set: {
              title,
              category: p.category || "General",
              brand: p.brand || "",
              image: p.image || "",
              currentPrice: p.price || 0,
              originalPrice: p.originalPrice || 0,
              discount: p.discount || "",
              rating: (Number.isFinite(p.rating) && p.rating > 0) ? p.rating : null,
              reviewsCount: (Number.isFinite(p.reviews) && p.reviews > 0) ? p.reviews : null,
              availability: p.inStock === false ? "Out of Stock" : "In Stock",
              platforms,
              source: "Quick Commerce API",
              searchQuery: query,
            },
          },
          { upsert: true }
        ).catch(err => console.error("Error saving product to DB:", err.message));
      });
      await Promise.all(savePromises.filter(Boolean));
    }

    let returnedProducts = result.products || [];

    // Retrieve all matching category products from MongoDB (no 40 limit)
    if (mongoose.connection.readyState === 1) {
      try {
        const cleanQuery = String(query || "").trim();
        const cleanCategory = String(category || "").trim();

        const conditions = [{ source: "Quick Commerce API" }];

        // 1. Category filter
        if (cleanCategory && cleanCategory.toLowerCase() !== "all") {
          const normCat = normalizeCategoryName(cleanCategory) || cleanCategory;
          const catRegex = new RegExp(normCat, "i");
          conditions.push({
            $or: [
              { category: catRegex },
              { searchQuery: catRegex },
              { title: catRegex }
            ]
          });
        }

        // 2. Query filter
        if (cleanQuery && cleanQuery.toLowerCase() !== "popular" && cleanQuery.toLowerCase() !== "all") {
          const safeRegex = new RegExp(cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
          conditions.push({
            $or: [
              { title: safeRegex },
              { searchQuery: safeRegex },
              { category: safeRegex },
              { brand: safeRegex }
            ]
          });
        }

        const searchFilter = {};
        if (conditions.length === 1) {
          Object.assign(searchFilter, conditions[0]);
        } else if (conditions.length > 1) {
          searchFilter.$and = conditions;
        }

        // If category requested or fewer than 50 products from API, pull ALL matching category products
        if ((cleanCategory && cleanCategory.toLowerCase() !== "all") || returnedProducts.length < 50) {
          const dbMatches = await Product.find(searchFilter).sort({ updatedAt: -1 }).limit(500);
          if (dbMatches.length > 0) {
            const existingTitles = new Set(returnedProducts.map(p => (p.name || p.title || "").toLowerCase().trim()));
            for (const dbItem of dbMatches) {
              const mapped = mapDbProduct(dbItem);
              const key = (mapped.name || "").toLowerCase().trim();
              if (key && !existingTitles.has(key)) {
                existingTitles.add(key);
                returnedProducts.push(mapped);
              }
            }
          }
        }
      } catch (dbErr) {
        console.error("DB retrieval error:", dbErr.message);
      }
    }

    return res.json({
      status: "success",
      query: query,
      products: returnedProducts,
      platforms: result.platforms || ["BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "Minutes"],
      creditsRemaining: result.creditsRemaining,
      fromCache: result.fromCache || false,
    });
  } catch (error) {
    console.error("Live product search warning:", error.message || error);

    return res.json({
      status: "success",
      query: query,
      products: [],
      platforms: ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "DMart", "Minutes", "JioMart"],
      creditsRemaining: 0,
      creditsCompleted: true,
      message: "products are not available",
    });
  }
});



router.get("/specific", async (req, res) => {
  let query = String(
    req.query.name || req.query.q || ""
  ).trim();
  const store = String(req.query.store || "").trim();
  query = extractProductFromUrl(query);

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "A specific product name is required.",
    });
  }

  let finalProduct = null;
  let platforms = [];
  let fromCache = false;
  let creditsRemaining = null;

  try {
    const location = getLocation(req);
    const result = await searchSpecificLiveProduct({
      query,
      store,
      ...location,
    });

    if (result.creditsCompleted || result.message === "products are not available") {
      return res.json({
        status: "success",
        product: null,
        products: [],
        platforms: [],
        creditsRemaining: 0,
        creditsCompleted: true,
        message: "products are not available",
      });
    }

    finalProduct = result.product || null;
    platforms = result.platforms || [];
    fromCache = result.fromCache || false;
    creditsRemaining = result.creditsRemaining;
  } catch (error) {
    console.error("Specific live product search warning:", error.message || error);
    if (error.creditsCompleted || error.message === "products are not available") {
      return res.json({
        status: "success",
        product: null,
        products: [],
        platforms: [],
        creditsRemaining: 0,
        creditsCompleted: true,
        message: "products are not available",
      });
    }
  }

  const credStatus = await checkApiCreditsStatus().catch(() => null);
  if (credStatus?.creditsCompleted) {
    return res.json({
      status: "success",
      product: null,
      products: [],
      platforms: [],
      creditsRemaining: 0,
      creditsCompleted: true,
      message: "products are not available",
    });
  }

  // If live search returned no product or only 1 store offer, search MongoDB Atlas stored live products
  if ((!finalProduct || !Array.isArray(finalProduct.comparison) || finalProduct.comparison.length <= 1) && mongoose.connection.readyState === 1) {
    try {
      const safeRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");
      let dbProd = await Product.findOne({ title: safeRegex, source: "Quick Commerce API" });
      if (!dbProd) {
        const words = query.split(/\s+/).filter((w) => w.length >= 2);
        if (words.length > 0) {
          dbProd = await Product.findOne({
            title: { $regex: words.slice(0, 3).join(".*"), $options: "i" },
            source: "Quick Commerce API"
          });
        }
      }
      if (dbProd) {
        const mapped = mapDbProduct(dbProd);
        if (mapped) {
          if (!finalProduct || (Array.isArray(mapped.comparison) && mapped.comparison.length > (finalProduct.comparison?.length || 0))) {
            finalProduct = mapped;
            platforms = mapped.stores || [];
            fromCache = true;
          }
        }
      }
    } catch (dbErr) {
      console.error("MongoDB Atlas lookup in /specific error:", dbErr.message);
    }
  }

  if (finalProduct) {
    if (Array.isArray(finalProduct.comparison) && finalProduct.comparison.length > 0) {
      finalProduct.storeCount = finalProduct.comparison.length;
      const validPrices = finalProduct.comparison.map(c => c.price).filter(p => typeof p === 'number' && p > 0);
      if (validPrices.length > 0) {
        finalProduct.lowestPrice = Math.min(...validPrices);
      }
      if (store) {
        const match = finalProduct.comparison.find(c => c.store.toLowerCase() === store.toLowerCase());
        if (match) {
          finalProduct.store = match.store;
          finalProduct.price = match.price;
          finalProduct.url = match.deeplink || match.url || finalProduct.url;
        }
      }
    }

    return res.json({
      status: "success",
      product: finalProduct,
      products: [finalProduct],
      platforms: platforms.length > 0 ? platforms : (finalProduct.stores || []),
      creditsRemaining,
      fromCache,
    });
  }

  return res.json({
    status: "success",
    product: null,
    products: [],
    platforms: [],
    fromCache: false,
  });
});





router.get("/redirect", async (req, res) => {
  const store = String(req.query.store || "").trim();
  const name = String(req.query.name || req.query.q || "").trim();
  const rawUrl = String(req.query.url || req.query.deeplink || req.query.link || req.query.product_link || "").trim();

  try {
    const directUrl = await resolveExactProductUrl(store, name, rawUrl);
    if (directUrl) {
      return res.redirect(302, directUrl);
    }
  } catch (err) {
    console.error("Store redirect error:", err.message);
  }

  // Reliable fallback: platform direct product URL
  const directFallback = generateDirectStoreUrl(store, name);
  return res.redirect(302, directFallback);
});

module.exports = router;