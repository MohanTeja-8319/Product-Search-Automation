const mongoose = require("mongoose");
const crypto = require("crypto");
const Alert = require("../models/Alert");
const User = require("../models/User");
const { runAlertCheckCycle, notifyTriggeredAlert } = require("../services/alertMonitor");

// Fallback in-memory alerts store for offline / disconnected DB state
const fallbackAlerts = new Map();

exports.getAlerts = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
        return res.status(200).json({ alerts });
      } catch (dbErr) {
        console.warn("MongoDB getAlerts failed, falling back:", dbErr.message);
      }
    }

    const alerts = Array.from(fallbackAlerts.values())
      .filter((a) => String(a.user) === String(req.userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({ alerts });
  } catch (err) {
    console.error("Get alerts error:", err);
    return res.status(500).json({ message: "Could not fetch price alerts." });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const {
      productId,
      productName,
      image,
      currentPrice,
      targetPrice,
      initialPrice,
      store,
      category,
      notifyPriceDrop,
      notifyStock,
      email,
      push,
      whatsapp,
      emailAddress,
      frequency,
    } = req.body;

    if (!productName || !String(productName).trim()) {
      return res.status(400).json({ message: "Product name is required." });
    }
    if (targetPrice === undefined || targetPrice === null || targetPrice === "") {
      return res.status(400).json({ message: "Target price is required." });
    }

    let resolvedEmailAddress = emailAddress && String(emailAddress).trim();
    if (!resolvedEmailAddress && mongoose.connection.readyState === 1) {
      const currentUser = await User.findById(req.userId).select("email").catch(() => null);
      resolvedEmailAddress = currentUser?.email || "";
    }

    const payload = {
      user: req.userId,
      productId: productId || "",
      productName: String(productName).trim(),
      image: image || "",
      currentPrice: Number(currentPrice) || 0,
      targetPrice: Number(targetPrice),
      initialPrice: Number(initialPrice) || Number(currentPrice) || 0,
      store: store || "",
      category: category || "General",
      notifyPriceDrop: notifyPriceDrop !== undefined ? !!notifyPriceDrop : true,
      notifyStock: notifyStock !== undefined ? !!notifyStock : true,
      email: email !== undefined ? !!email : true,
      push: push !== undefined ? !!push : true,
      whatsapp: whatsapp !== undefined ? !!whatsapp : false,
      emailAddress: resolvedEmailAddress || "",
      frequency: frequency || "Instant",
      active: true,
      triggeredAt: null,
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const alert = await Alert.findOneAndUpdate(
          { user: req.userId, productName: payload.productName },
          payload,
          { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
        );

        return res.status(201).json({
          message: "Price alert created successfully.",
          alert,
        });
      } catch (dbErr) {
        console.warn("MongoDB createAlert failed, falling back:", dbErr.message);
      }
    }

    // In-memory fallback
    const alertId = `alert-${crypto.randomUUID()}`;
    const mockAlert = {
      _id: alertId,
      ...payload,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackAlerts.set(alertId, mockAlert);

    return res.status(201).json({
      message: "Price alert created successfully.",
      alert: mockAlert,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Create alert error:", err);
    return res.status(500).json({ message: "Could not create price alert." });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const allowedFields = [
      "currentPrice",
      "targetPrice",
      "active",
      "triggeredAt",
      "notifyPriceDrop",
      "notifyStock",
      "email",
      "push",
      "whatsapp",
      "emailAddress",
      "frequency",
      "store",
      "category",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const before = await Alert.findOne({ _id: id, user: req.userId });
        if (before) {
          const wasTriggered = !before.active || !!before.triggeredAt;

          const alert = await Alert.findOneAndUpdate(
            { _id: id, user: req.userId },
            updates,
            { new: true, runValidators: true }
          );

          if (alert) {
            const priceForCheck =
              updates.currentPrice !== undefined ? Number(updates.currentPrice) : Number(alert.currentPrice);
            const justReached =
              !wasTriggered &&
              Number(priceForCheck) > 0 &&
              Number(priceForCheck) <= Number(alert.targetPrice);

            if (justReached) {
              if (!alert.active || !alert.triggeredAt) {
                alert.active = false;
                alert.triggeredAt = alert.triggeredAt || new Date();
                await alert.save().catch(() => {});
              }

              const user = await User.findById(req.userId).select("email fullName").catch(() => null);
              notifyTriggeredAlert(alert, user).catch(() => {});
            }

            return res.status(200).json({ message: "Alert updated.", alert });
          }
        }
      } catch (dbErr) {
        console.warn("MongoDB updateAlert failed, falling back:", dbErr.message);
      }
    }

    const mockAlert = fallbackAlerts.get(id);
    if (mockAlert && String(mockAlert.user) === String(req.userId)) {
      Object.assign(mockAlert, updates, { updatedAt: new Date() });
      return res.status(200).json({ message: "Alert updated.", alert: mockAlert });
    }

    return res.status(404).json({ message: "Alert not found." });
  } catch (err) {
    console.error("Update alert error:", err);
    return res.status(500).json({ message: "Could not update alert." });
  }
};

exports.checkNow = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const results = await runAlertCheckCycle({ userId: req.userId });
        const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
        const triggeredCount = results.filter((r) => r.reached).length;

        return res.status(200).json({
          message:
            triggeredCount > 0
              ? ` ${triggeredCount} alert${triggeredCount === 1 ? "" : "s"} just hit your target price!`
              : results.length > 0
              ? "Checked latest prices. No alerts hit their target yet."
              : "No active alerts to check.",
          triggeredCount,
          checkedCount: results.length,
          alerts,
        });
      } catch (dbErr) {
        console.warn("MongoDB checkNow failed, falling back:", dbErr.message);
      }
    }

    const alerts = Array.from(fallbackAlerts.values()).filter(
      (a) => String(a.user) === String(req.userId)
    );

    return res.status(200).json({
      message: "Checked latest prices. No alerts hit their target yet.",
      triggeredCount: 0,
      checkedCount: alerts.length,
      alerts,
    });
  } catch (err) {
    console.error("Check-now error:", err);
    return res.status(500).json({ message: "Could not check live prices right now." });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      try {
        const alert = await Alert.findOneAndDelete({ _id: id, user: req.userId });
        if (alert) {
          return res.status(200).json({ message: "Alert deleted." });
        }
      } catch (dbErr) {
        console.warn("MongoDB deleteAlert failed, falling back:", dbErr.message);
      }
    }

    if (fallbackAlerts.has(id)) {
      fallbackAlerts.delete(id);
      return res.status(200).json({ message: "Alert deleted." });
    }

    return res.status(404).json({ message: "Alert not found." });
  } catch (err) {
    console.error("Delete alert error:", err);
    return res.status(500).json({ message: "Could not delete alert." });
  }
};
