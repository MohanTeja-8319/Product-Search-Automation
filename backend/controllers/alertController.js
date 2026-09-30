const Alert = require("../models/Alert");
const User = require("../models/User");
const { runAlertCheckCycle, notifyTriggeredAlert } = require("../services/alertMonitor");



exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ user: req.userId }).sort({ createdAt: -1 });
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
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
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
      
      
      
      notifyTriggeredAlert(alert, user).catch((err) =>
        console.error("Manual alert trigger: notification failed:", err.message)
      );
    }

    return res.status(200).json({ message: "Alert updated.", alert });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Update alert error:", err);
    return res.status(500).json({ message: "Could not update alert." });
  }
};






exports.checkNow = async (req, res) => {
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
  } catch (err) {
    console.error("Check-now error:", err);
    return res.status(500).json({ message: "Could not check live prices right now." });
  }
};



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
