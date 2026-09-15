const express = require("express");
const {
  searchLiveProducts,
  searchSpecificLiveProduct,
} = require("../services/quickCommerceService");

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

/*
  SEARCH
  Used by SearchPage.

  Returns:
  {
    status: "success",
    products: [...]
  }
*/
router.get("/search", async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Search query q is required.",
    });
  }

  try {
    const location = getLocation(req);

    const result = await searchLiveProducts({
      query,
      ...location,
    });

    return res.json({
      status: "success",
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


/*
  SPECIFIC PRODUCT
  Used when we want ONE exact product
  across Amazon + Flipkart + Myntra.
*/
router.get("/specific", async (req, res) => {
  const query = String(
    req.query.name || req.query.q || ""
  ).trim();

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


/*
  COMPARE
  Used by ComparisonPage.
*/
router.get("/compare", async (req, res) => {
  const query = String(
    req.query.name || req.query.q || ""
  ).trim();

  if (!query) {
    return res.status(400).json({
      status: "error",
      message: "Product name is required.",
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
    console.error("Live comparison failed:", error);

    return res.status(error.status || 502).json({
      status: "error",
      message:
        error.message ||
        "Live comparison failed.",
    });
  }
});


module.exports = router;