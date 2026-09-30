const webpush = require("web-push");

let configured = false;




function configureWebPush() {
  if (configured) return true;

  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return false;
  }

  webpush.setVapidDetails(
    VAPID_SUBJECT || "mailto:alerts@productsearch.local",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );

  configured = true;
  return true;
}


async function sendPushToUser(userId, payload) {
  if (!configureWebPush()) {
    console.warn(
      "Push notification skipped: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are not set in backend/.env."
    );
    return { sent: 0, failed: 0, configured: false };
  }

  
  const PushSubscription = require("../models/PushSubscription");
  const subscriptions = await PushSubscription.find({ user: userId });

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, configured: true };
  }

  let sent = 0;
  let failed = 0;

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload)
        );
        sent += 1;
      } catch (err) {
        failed += 1;
        
        if (err.statusCode === 404 || err.statusCode === 410) {
          await PushSubscription.deleteOne({ _id: sub._id }).catch(() => {});
        } else {
          console.error("Push send failed:", err.message);
        }
      }
    })
  );

  return { sent, failed, configured: true };
}

module.exports = { sendPushToUser, configureWebPush };
