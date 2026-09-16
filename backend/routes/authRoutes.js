const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");
const {
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  changePassword,
} = require("../controllers/authController");

router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

// Change password for the logged-in user (requires current password).
router.post("/change-password", protect, changePassword);

module.exports = router;
