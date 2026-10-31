const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { getJwtSecret } = require("../config/jwt");
const { isValidObjectId } = require("../utils/mongoHelpers");
const { findFallbackUserById } = require("../controllers/authController");

async function protectAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication required. Please log in as an administrator.",
        code: "AUTH_REQUIRED",
      });
    }

    const token = authHeader.split(" ")[1];
    let decoded;

    try {
      decoded = jwt.verify(token, getJwtSecret());
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          message: "Session expired. Please log in again.",
          code: "TOKEN_EXPIRED",
        });
      }
      return res.status(401).json({
        message: "Invalid or corrupt authorization token.",
        code: "INVALID_TOKEN",
      });
    }

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        message: "Invalid token payload.",
        code: "INVALID_PAYLOAD",
      });
    }

    let user = null;

    if (mongoose.connection.readyState === 1 && isValidObjectId(decoded.id)) {
      try {
        user = await User.findById(decoded.id);
      } catch (dbErr) {
        console.warn("MongoDB user query failed in adminMiddleware:", dbErr.message);
      }
    }

    if (!user) {
      user = findFallbackUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        message: "Administrator account not found.",
        code: "USER_NOT_FOUND",
      });
    }

    if (!user.isAdmin) {
      return res.status(403).json({
        message: "Access denied. Administrator privileges required.",
        code: "ADMIN_FORBIDDEN",
      });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({
        message: "Access denied. This administrator account has been suspended.",
        code: "ACCOUNT_SUSPENDED",
      });
    }

    req.user = user;
    req.userId = user._id || user.id;
    next();
  } catch (error) {
    console.error("Critical error in protectAdmin middleware:", error);
    return res.status(500).json({
      message: "Server authorization error.",
      code: "AUTH_SERVER_ERROR",
    });
  }
}

module.exports = protectAdmin;

