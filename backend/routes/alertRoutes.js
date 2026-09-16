const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
  checkNow,
} = require("../controllers/alertController");

router.get("/", protect, getAlerts);
router.post("/", protect, createAlert);
router.post("/check-now", protect, checkNow);
router.patch("/:id", protect, updateAlert);
router.delete("/:id", protect, deleteAlert);

module.exports = router;
