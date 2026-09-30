const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const {
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: "Too many authentication attempts from this IP, please try again after 15 minutes",
});

router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/verify-otp", authLimiter, verifyResetOtp);
router.post("/reset-password", authLimiter, resetPassword);
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);


router.post("/change-password", protect, changePassword);

module.exports = router;
