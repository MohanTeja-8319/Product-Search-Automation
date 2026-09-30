const PushSubscription = require("../models/PushSubscription");




exports.getPublicKey = (req, res) => {
  const key = process.env.VAPID_PUBLIC_KEY || "";

  if (!key) {
    return res.status(503).json({
      message:
        "Push notifications are not configured on the server yet (missing VAPID keys).",
    });
  }

  return res.status(200).json({ publicKey: key });
};




exports.subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body || {};

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ message: "A valid push subscription is required." });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      {
        user: req.userId,
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: req.headers["user-agent"] || "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({ message: "Browser push notifications enabled." });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error("Push subscribe error:", err);
    return res.status(500).json({ message: "Could not enable push notifications." });
  }
};


exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return res.status(400).json({ message: "endpoint is required." });
    }

    await PushSubscription.deleteOne({ endpoint, user: req.userId });
    return res.status(200).json({ message: "Browser push notifications disabled." });
  } catch (err) {
    console.error("Push unsubscribe error:", err);
    return res.status(500).json({ message: "Could not disable push notifications." });
  }
};
