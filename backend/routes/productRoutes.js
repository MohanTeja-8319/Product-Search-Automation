const express = require("express");
const {
  searchLiveProducts,
  searchSpecificLiveProduct,
} = require("../services/serpApiService");
const SearchLog = require("../models/SearchLog");
const Product = require("../models/Product");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

function getLocation(req) {
  const lat = Number(req.query.lat ?? process.env.SEARCH_LAT);
  const lon = Number(req.query.lon ?? process.env.SEARCH_LON);
  const pincode = req.query.pincode || process.env.SEARCH_PINCODE || "";

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    const error = new Error(
      "A valid latitude and longitude are required. Set SEARCH_LAT and SEARCH_LON in backend/.env."
    );

    error.status = 400;
    throw error;
  }

  return { lat, lon, pincode };
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

router.get("/search", async (req, res) => {
  let query = String(req.query.q || "").trim();
  query = extractProductFromUrl(query);

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Search query q is required.",
    });
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
        const u = await User.findById(decoded.id);
        if (u) {
          userName = u.fullName;
          userEmail = u.email;
          userId = u._id;
        }
      }
    } catch (_) {}

    SearchLog.create({
      query,
      user: userName,
      userEmail,
      userId,
      platforms: result.platforms?.length || 4,
      platformList: Array.isArray(result.platforms)
        ? result.platforms.map((p) => p.name || p).join(", ")
        : "Amazon, Flipkart, Myntra, Croma",
      productsFound: result.products?.length || 0,
      duration: durationStr,
      status: "Completed",
    }).catch(() => {});

    // Cache products into Product model
    if (Array.isArray(result.products) && result.products.length > 0) {
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
              platforms: Array.isArray(p.platforms) && p.platforms.length > 0
                ? p.platforms
                : [{ name: p.store || "Amazon", price: p.price || 0, originalPrice: p.originalPrice || 0, inStock: true }],
              searchQuery: query,
            },
          },
          { upsert: true }
        ).catch(() => {});
      }
    }

    return res.json({
      status: "success",
      query: query,
      products: result.products || [],
      platforms: result.platforms || [],
      creditsRemaining: result.creditsRemaining,
      fromCache: result.fromCache || false,
    });
  } catch (error) {
    console.error("Live product search failed:", error);

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




module.exports = router;