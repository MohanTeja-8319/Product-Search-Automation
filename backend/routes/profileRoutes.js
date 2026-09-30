const express = require("express");
const router = express.Router();
const { getMe, updateProfile, deleteAccount } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");



router.get("/", protect, getMe);



router.put("/", protect, updateProfile);



router.delete("/", protect, deleteAccount);

module.exports = router;
