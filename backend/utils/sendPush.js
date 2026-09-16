const webpush = require("web-push");

let configured = false;

// Lazily configure web-push the first time it's actually needed, so a
// backend running without VAPID keys set up yet doesn't crash on boot —
// it just skips push sending (email alerts still work).
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

/**
 * Sends a browser push notification to every device/browser the given
 * user has subscribed from. Expired/unsubscribed endpoints (404/410 from
 * the push service) are cleaned up automatically.
 *
 * @param {string} userId
 * @param {{ title: string, body: string, url?: string }} payload
 */
async function sendPushToUser(userId, payload) {
  if (!configureWebPush()) {
    console.warn(
      "Push notification skipped: VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY are not set in backend/.env."
    );
    return { sent: 0, failed: 0, configured: false };
  }

  // Required here (not top-level) to avoid a circular require at module load time.
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
        // 404/410 = the browser dropped this subscription; stop trying it.
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
