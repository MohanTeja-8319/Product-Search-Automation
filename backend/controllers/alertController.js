const Alert = require("../models/Alert");

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
      emailAddress: emailAddress || "",
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

    const alert = await Alert.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    return res.status(200).json({ message: "Alert updated.", alert });
  } catch (err) {
    console.error("Update alert error:", err);
    return res.status(500).json({ message: "Could not update alert." });
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
