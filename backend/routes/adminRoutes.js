const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Alert = require("../models/Alert");
const protect = require("../middleware/authMiddleware");

// Admin middleware - basic check for now
const adminOnly = (req, res, next) => {
  // Assuming all logged-in users are admins for this local tool, or add a real role check
  if (req.user) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const alertCount = await Alert.countDocuments();
    res.json({
      totalUsers: userCount,
      totalAlerts: alertCount,
      activeScrapers: 3 // Mock value for display
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
