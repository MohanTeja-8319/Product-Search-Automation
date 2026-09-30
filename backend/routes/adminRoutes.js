const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Alert = require("../models/Alert");
const protect = require("../middleware/authMiddleware");

const adminOnly = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user && user.isAdmin) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ message: "Not authorized as an admin" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error during admin check" });
  }
};

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const alertCount = await Alert.countDocuments();
    res.json({
      totalUsers: userCount,
      totalAlerts: alertCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
