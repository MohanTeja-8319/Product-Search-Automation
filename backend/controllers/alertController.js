const Alert = require("../models/Alert");
const User = require("../models/User");
const { runAlertCheckCycle, notifyTriggeredAlert } = require("../services/alertMonitor");

// @route GET /api/alerts (protected)
// Returns only the alerts that belong to the logged-in user.
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ alerts });
  } catch (err) {
    console.error("Get alerts error:", err);
    return res.status(500).json({ message: "Could not fetch price alerts." });
  }
};

// @route POST /api/alerts (protected)
// Creates a new price alert for the logged-in user. If an alert for the
// same product already exists for this user, it is refreshed instead of
// creating a duplicate (mirrors the old localStorage dedupe behaviour).
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

    // If the client didn't send an email (or the frontend somehow sent a
    // blank one), fall back to the logged-in user's own registered email
    // instead of leaving it empty — that's the address alert emails go to.
    let resolvedEmailAddress = emailAddress && String(emailAddress).trim();
    if (!resolvedEmailAddress) {
      const currentUser = await User.findById(req.userId).select("email");
      resolvedEmailAddress = currentUser?.email || "";
    }

    const payload = {
      user: req.userId,
      productId,
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
      emailAddress: resolvedEmailAddress,
      frequency: frequency || "Instant",
      active: true,
      triggeredAt: null,
    };

    // Upsert on (user, productName) so re-creating an alert for the same
    // product updates it in place instead of creating a duplicate doc.
    const alert = await Alert.findOneAndUpdate(
      { user: req.userId, productName: payload.productName },
      payload,
      { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    return res.status(201).json({
      message: "Price alert created successfully.",
      alert,
    });
  } catch (err) {
    console.error("Create alert error:", err);
    return res.status(500).json({ message: "Could not create price alert." });
  }
};

// @route PATCH /api/alerts/:id (protected)
// Updates fields on ONE alert that belongs to the logged-in user
// (used for toggling active/paused, and for the "simulate price drop" demo).
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

    // Was this alert already "triggered" before this update? Used below to
    // detect the moment a manual edit (e.g. the "Simulate Drop" button, or
    // an admin/testing PATCH that sets currentPrice <= targetPrice) crosses
    // into the triggered state, so we can fire the same real email/push
    // notification the live monitor sends — instead of the DB silently
    // recording a "triggered" alert that nobody was ever told about.
    const before = await Alert.findOne({ _id: id, user: req.userId });
    if (!before) {
      return res.status(404).json({ message: "Alert not found." });
    }
    const wasTriggered = !before.active || !!before.triggeredAt;

    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    // Figure out, from the fields actually being updated, whether the
    // target price has now been reached and wasn't already reported.
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
        await alert.save();
      }

      const user = await User.findById(req.userId).select("email fullName");
      // liveInfo is left undefined here since this is a manual/simulated
      // trigger, not a live price lookup — notifyTriggeredAlert already
      // falls back to the alert's own currentPrice/store/image in that case.
      notifyTriggeredAlert(alert, user).catch((err) =>
        console.error("Manual alert trigger: notification failed:", err.message)
      );
    }

    return res.status(200).json({ message: "Alert updated.", alert });
  } catch (err) {
    console.error("Update alert error:", err);
    return res.status(500).json({ message: "Could not update alert." });
  }
};

// @route POST /api/alerts/check-now (protected)
// Immediately fetches live prices for every ACTIVE alert belonging to the
// logged-in user and triggers real email/push notifications for any that
// have hit their target — this is the real thing the old "Simulate Drop"
// button used to fake with localStorage.
exports.checkNow = async (req, res) => {
  try {
    const results = await runAlertCheckCycle({ userId: req.userId });
    const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
    const triggeredCount = results.filter((r) => r.reached).length;

    return res.status(200).json({
      message:
        triggeredCount > 0
          ? `🎯 ${triggeredCount} alert${triggeredCount === 1 ? "" : "s"} just hit your target price!`
          : results.length > 0
          ? "Checked latest prices. No alerts hit their target yet."
          : "No active alerts to check.",
      triggeredCount,
      checkedCount: results.length,
      alerts,
    });
  } catch (err) {
    console.error("Check-now error:", err);
    return res.status(500).json({ message: "Could not check live prices right now." });
  }
};

// @route DELETE /api/alerts/:id (protected)
// Deletes ONE alert that belongs to the logged-in user.
exports.deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await Alert.findOneAndDelete({ _id: id, user: req.userId });
    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    return res.status(200).json({ message: "Alert deleted." });
  } catch (err) {
    console.error("Delete alert error:", err);
    return res.status(500).json({ message: "Could not delete alert." });
  }
};
