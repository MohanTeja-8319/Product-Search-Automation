const Alert = require("../models/Alert");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { sendPushToUser } = require("../utils/sendPush");
const { searchSpecificLiveProduct } = require("./quickCommerceService");

const DEFAULT_LOCATION = {
  lat: Number(process.env.SEARCH_LAT) || 12.9021,
  lon: Number(process.env.SEARCH_LON) || 77.6639,
  pincode: process.env.SEARCH_PINCODE || "",
};

const FREQUENCY_MIN_GAP_MS = {
  Instant: 0,
  Daily: 24 * 60 * 60 * 1000,
  Weekly: 7 * 24 * 60 * 60 * 1000,
};

function isDue(alert, now = Date.now()) {
  const gap = FREQUENCY_MIN_GAP_MS[alert.frequency] ?? 0;
  if (!gap) return true;
  if (!alert.lastCheckedAt) return true;
  return now - new Date(alert.lastCheckedAt).getTime() >= gap;
}

async function fetchLivePrice(productName) {
  try {
    console.log(`🔎 Fetching LIVE price for "${productName}"`);

    const result = await searchSpecificLiveProduct({
      query: productName,
      ...DEFAULT_LOCATION,
    });

    const product = result?.product;

    if (!product) {
      console.log(`⚠️ No live product found for "${productName}"`);
      return null;
    }

    const price = Number(product.price);

    if (!Number.isFinite(price) || price <= 0) {
      console.log(`⚠️ Invalid live price for "${productName}":`, product.price);
      return null;
    }

    console.log(`💰 LIVE PRICE: "${productName}" = ₹${price}`);

    return {
      price,
      store: product.store || "",
      image: product.image || "",
      url: product.url || "",
    };
  } catch (error) {
    console.error(`❌ Live price lookup failed for "${productName}"`);
    console.error("Error:", error.message);
    return null;
  }
}

function formatRupees(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "₹0";
  return `₹${number.toLocaleString("en-IN")}`;
}

function buildAlertEmailHtml(alert, liveInfo) {
  const currentPrice = liveInfo?.price ?? alert.currentPrice;
  const dealUrl = liveInfo?.url || "";
  const image = liveInfo?.image || alert.image || "";

  return `
  <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:20px 24px;color:#fff;">
      <p style="margin:0;font-size:13px;opacity:.85;">🎯 Price Alert Triggered</p>
      <h2 style="margin:6px 0 0;font-size:18px;">${alert.productName}</h2>
    </div>
    <div style="padding:24px;background:#fff;">
      ${image ? `<img src="${image}" alt="${alert.productName}" style="max-height:140px;display:block;margin:0 auto 16px;" />` : ""}
      <p style="font-size:14px;color:#374151;margin:0 0 12px;">Great news! The price just reached your target.</p>
      <table style="width:100%;font-size:14px;color:#111827;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;">Current price</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#059669;">${formatRupees(currentPrice)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Your target</td><td style="padding:6px 0;text-align:right;">${formatRupees(alert.targetPrice)}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;">Store</td><td style="padding:6px 0;text-align:right;">${liveInfo?.store || alert.store || "-"}</td></tr>
      </table>
      ${dealUrl ? `<a href="${dealUrl}" target="_blank" rel="noopener noreferrer" style="display:block;text-align:center;margin-top:20px;background:#4f46e5;color:#fff;padding:12px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:13px;">View This Deal</a>` : ""}
    </div>
  </div>`;
}

async function notifyTriggeredAlert(alert, user, liveInfo) {
  const currentPrice = liveInfo?.price ?? alert.currentPrice;
  const to = alert.emailAddress || user?.email || "";

  if (alert.email && to) {
    try {
      console.log(`📧 Price target reached. Sending email to ${to}...`);

      await sendEmail({
        to,
        subject: `🎯 Price Alert: ${alert.productName} hit ${formatRupees(currentPrice)}`,
        html: buildAlertEmailHtml(alert, liveInfo),
      });

      console.log(`✅ Price-alert email successfully sent to ${to}`);
    } catch (error) {
      console.error("❌ PRICE ALERT EMAIL FAILED");
      console.error("Recipient:", to);
      console.error("Product:", alert.productName);
      console.error("Current price:", currentPrice);
      console.error("Target price:", alert.targetPrice);
      console.error("Error:", error.message);
    }
  } else {
    console.log(`⚠️ Email skipped for "${alert.productName}".`);
    console.log("Email enabled:", alert.email);
    console.log("Recipient:", to || "NO EMAIL");
  }

  if (alert.push) {
    try {
      await sendPushToUser(String(alert.user), {
        title: "🎯 Target price reached!",
        body: `${alert.productName} is now ${formatRupees(currentPrice)} (target: ${formatRupees(alert.targetPrice)})`,
        url: `/comparison/${encodeURIComponent(alert.productName)}`,
      });
      console.log("🔔 Browser push notification sent.");
    } catch (error) {
      console.error("❌ Browser push failed:", error.message);
    }
  }

  if (alert.whatsapp) {
    console.log(
      `[WhatsApp notification skipped - not configured] user=${alert.user} product="${alert.productName}" price=${currentPrice}`
    );
  }
}

async function checkSingleAlert(alert) {
  console.log("======================================");
  console.log(`🎯 CHECKING ALERT: ${alert.productName}`);
  console.log("Alert ID:", alert._id);
  console.log("Target:", formatRupees(alert.targetPrice));
  console.log("Stored current price:", formatRupees(alert.currentPrice));
  console.log("Email enabled:", alert.email);
  console.log("Email:", alert.emailAddress || "(user email fallback)");
  console.log("======================================");

  const liveInfo = await fetchLivePrice(alert.productName);
  const now = new Date();
  const newPrice = liveInfo?.price ?? Number(alert.currentPrice);

  alert.lastCheckedAt = now;

  if (liveInfo?.price) alert.currentPrice = liveInfo.price;
  if (liveInfo?.store) alert.store = liveInfo.store;
  if (liveInfo?.image && !alert.image) alert.image = liveInfo.image;

  const reached = Number(newPrice) > 0 && Number(newPrice) <= Number(alert.targetPrice);

  console.log("======================================");
  console.log(`🎯 ALERT RESULT: ${alert.productName}`);
  console.log(`Current price: ₹${newPrice}`);
  console.log(`Target price: ₹${alert.targetPrice}`);
  console.log(`Reached: ${reached}`);
  console.log("======================================");

  if (reached) {
    alert.active = false;
    alert.triggeredAt = now;
  }

  await alert.save();

  if (reached) {
    console.log(`🎯 TARGET REACHED for "${alert.productName}"`);
    const user = await User.findById(alert.user).select("email fullName");
    await notifyTriggeredAlert(alert, user, liveInfo);
  }

  return { alert, reached, liveInfo };
}

async function runAlertCheckCycle({ userId } = {}) {
  const query = { active: true };
  if (userId) query.user = userId;

  const alerts = await Alert.find(query);
  const now = Date.now();
  const dueAlerts = userId ? alerts : alerts.filter((alert) => isDue(alert, now));

  console.log(`🔎 Alert monitor found ${alerts.length} active alert(s).`);

  const results = [];

  for (const alert of dueAlerts) {
    try {
      results.push(await checkSingleAlert(alert));
    } catch (error) {
      console.error(`❌ Alert monitor: failed checking alert ${alert._id}:`, error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  return results;
}

module.exports = {
  runAlertCheckCycle,
  checkSingleAlert,
  notifyTriggeredAlert,
  fetchLivePrice,
};
