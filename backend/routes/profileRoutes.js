const express = require("express");
const router = express.Router();
const { getMe, updateProfile, deleteAccount } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// GET /api/profile -> fetch the logged-in user's current data (for prefilling
// the Edit Profile form so fields are never blank).
router.get("/", protect, getMe);

// PUT /api/profile -> update ONLY the fields provided, on the SAME existing
// user document identified via the JWT (no userId accepted from the client).
router.put("/", protect, updateProfile);

// DELETE /api/profile -> permanently deletes the SAME user document (and
// everything owned by them) from the database. Requires password confirmation.
router.delete("/", protect, deleteAccount);

module.exports = router;
