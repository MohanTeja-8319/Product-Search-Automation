const express = require("express");
const {
  searchLiveProducts,
  searchSpecificLiveProduct,
  resolveExactProductUrl,
} = require("../services/quickCommerceService");
const SearchLog = require("../models/SearchLog");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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
      const match = pathname.match(/^\/([^\/]+)\/dp\//);
      if (match) slug = match[1];
    } else if (host.includes("flipkart.com")) {
      const match = pathname.match(/^\/([^\/]+)\/p\//);
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

function mapDbProduct(p) {
  const comparison = (Array.isArray(p.platforms) && p.platforms.length > 0)
    ? p.platforms.map((pl) => ({
        id: `qc-${pl.name}-${p._id}`,
        name: p.title,
        brand: p.brand || "",
        price: pl.price || p.currentPrice || 0,
        originalPrice: pl.originalPrice || p.originalPrice,
        discount: p.discount,
        rating: pl.rating || p.rating || 4.5,
        reviews: p.reviewsCount || 120,
        availability: pl.inStock === false ? "Out of Stock" : "In Stock",
        image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        url: pl.url || `/api/products/redirect?store=${encodeURIComponent(pl.name)}&name=${encodeURIComponent(p.title)}`,
        store: pl.name,
        source: "QuickCommerce API",
      }))
    : [{
        id: `qc-Amazon-${p._id}`,
        name: p.title,
        brand: p.brand || "",
        price: p.currentPrice || 0,
        originalPrice: p.originalPrice,
        discount: p.discount,
        rating: p.rating || 4.5,
        reviews: p.reviewsCount || 120,
        availability: p.availability || "In Stock",
        image: p.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
        url: `/api/products/redirect?store=Amazon&name=${encodeURIComponent(p.title)}`,
        store: "Amazon",
        source: "QuickCommerce API",
      }];

  const sortedComp = [...comparison].sort((a, b) => a.price - b.price);
  const primaryStore = p.platforms?.[0]?.name || comparison[0]?.store || "Amazon";
  const primaryItem = comparison.find((c) => c.store === primaryStore) || comparison[0];

  return {
    id: `db-${p._id}`,
    name: p.title,
    brand: p.brand || "",
    category: p.category || "Live Results",
    price: primaryItem.price || p.currentPrice || sortedComp[0].price,
    originalPrice: p.originalPrice || primaryItem.originalPrice,
    discount: p.discount,
    rating: p.rating || primaryItem.rating || 4.5,
    reviews: p.reviewsCount || primaryItem.reviews || 120,
    availability: p.availability || "In Stock",
    image: p.image || primaryItem.image,
    url: primaryItem.url,
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
  query = extractProductFromUrl(query);

  if (!query) {
    query = "popular";
  }

  try {
    const location = getLocation(req);

    const startTime = Date.now();
    const result = await searchLiveProducts({
      query,
      ...location,
    });

    const durationStr = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

    // Asynchronously record search in SearchLog
    let userName = "Storefront Guest";
    let userEmail = "";
    let userId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        if (mongoose.connection.readyState === 1) {
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

    // Cache products into Product model
    if (mongoose.connection.readyState === 1 && Array.isArray(result.products) && result.products.length > 0) {
      for (const p of result.products) {
        if (!p.name && !p.title) continue;
        Product.findOneAndUpdate(
          { title: p.name || p.title },
          {
            $set: {
              title: p.name || p.title,
              category: p.category || "General",
              brand: p.brand || "",
              image: p.image || "",
              currentPrice: p.price || 0,
              originalPrice: p.originalPrice || 0,
              discount: p.discount || "",
              rating: p.rating || 4.5,
              reviewsCount: p.reviewsCount || 120,
              availability: p.inStock === false ? "Out of Stock" : "In Stock",
              platforms: Array.isArray(p.comparison) && p.comparison.length > 0
                ? p.comparison.map(c => ({
                    name: c.store || "Amazon",
                    price: c.price || p.price || 0,
                    originalPrice: c.originalPrice || 0,
                    inStock: c.availability !== "Out of Stock",
                    url: c.url || "",
                    rating: c.rating || 4.5,
                  }))
                : [{ name: p.store || "Amazon", price: p.price || 0, originalPrice: p.originalPrice || 0, inStock: true }],
              searchQuery: query,
            },
          },
          { upsert: true }
        ).catch(() => {});
      }
    }

    let returnedProducts = result.products || [];

    // If API returned 0 products, check database cache
    if (returnedProducts.length === 0 && mongoose.connection.readyState === 1) {
      try {
        const dbMatches = await Product.find({
          $or: [
            { title: { $regex: query, $options: "i" } },
            { brand: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
          ],
        }).limit(20);

        if (dbMatches.length > 0) {
          returnedProducts = dbMatches.map(mapDbProduct);
        } else {
          const recentDb = await Product.find({}).sort({ updatedAt: -1 }).limit(16);
          if (recentDb.length > 0) {
            returnedProducts = recentDb.map(mapDbProduct);
          }
        }
      } catch (_) {}
    }

    return res.json({
      status: "success",
      query: query,
      products: returnedProducts,
      platforms: result.platforms || ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "Myntra", "Nykaa"],
      creditsRemaining: result.creditsRemaining,
      fromCache: result.fromCache || false,
    });
  } catch (error) {
    console.error("Live product search failed:", error);

    if (mongoose.connection.readyState === 1) {
      try {
        const fallback = await Product.find({}).sort({ updatedAt: -1 }).limit(16);
        if (fallback.length > 0) {
          return res.json({
            status: "success",
            query: query,
            products: fallback.map(mapDbProduct),
            platforms: ["Amazon", "Flipkart", "BlinkIt", "Zepto", "Swiggy", "BigBasket", "Myntra", "Nykaa"],
            fromCache: true,
          });
        }
      } catch (_) {}
    }

    return res.status(error.status || 502).json({
      status: "error",
      message: error.message || "Live product search failed.",
    });
  }
});



router.get("/specific", async (req, res) => {
  let query = String(
    req.query.name || req.query.q || ""
  ).trim();
  query = extractProductFromUrl(query);

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "A specific product name is required.",
    });
  }

  try {
    const location = getLocation(req);

    const result = await searchSpecificLiveProduct({
      query,
      ...location,
    });

    return res.json({
      status: "success",

      product: result.product || null,

      products: result.product
        ? [result.product]
        : [],

      platforms: result.platforms || [],

      matchDetails: result.matchDetails || null,

      creditsRemaining: result.creditsRemaining,

      fromCache: result.fromCache || false,
    });
  } catch (error) {
    console.error(
      "Specific live product search failed:",
      error
    );

    return res.status(error.status || 502).json({
      status: "error",
      message:
        error.message ||
        "Specific live product search failed.",
    });
  }
});




router.get("/redirect", async (req, res) => {
  const store = String(req.query.store || "").trim();
  const name = String(req.query.name || req.query.q || "").trim();
  const rawUrl = String(req.query.url || "").trim();

  try {
    const directUrl = await resolveExactProductUrl(store, name, rawUrl);
    if (directUrl) {
      return res.redirect(302, directUrl);
    }
  } catch (err) {
    console.error("Store redirect error:", err.message);
  }

  const q = encodeURIComponent(name);
  const s = store.toLowerCase();
  if (s.includes("amazon")) return res.redirect(302, `https://www.amazon.in/s?k=${q}`);
  if (s.includes("flipkart")) return res.redirect(302, `https://www.flipkart.com/search?q=${q}`);
  if (s.includes("myntra")) return res.redirect(302, `https://www.myntra.com/${q}`);
  if (s.includes("nykaa")) return res.redirect(302, `https://www.nykaa.com/search/result/?q=${q}`);
  if (s.includes("blinkit")) return res.redirect(302, `https://blinkit.com/s/?q=${q}`);
  if (s.includes("zepto")) return res.redirect(302, `https://www.zeptonow.com/search?query=${q}`);
  if (s.includes("swiggy")) return res.redirect(302, `https://www.swiggy.com/search?query=${q}`);
  if (s.includes("bigbasket")) return res.redirect(302, `https://www.bigbasket.com/ps/?q=${q}`);
  if (s.includes("jiomart")) return res.redirect(302, `https://www.jiomart.com/search/${q}`);
  return res.redirect(302, "https://www.amazon.in");
});

module.exports = router;