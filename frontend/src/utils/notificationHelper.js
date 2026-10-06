/**
 * Helper for managing real-time storefront notifications
 */

const STORAGE_KEY = "price_scout_notifications";

export const DEFAULT_NOTIFICATIONS = [
  {
    id: "notif-live-1",
    type: "price_drop",
    title: "Price Drop Detected!",
    message: "Apple iPhone 15 Pro (128 GB) dropped to ₹1,27,990 on Amazon.",
    productName: "Apple iPhone 15 Pro",
    store: "Amazon",
    discount: "5% OFF",
    time: "10m ago",
    read: false,
    link: "/comparison/Apple%20iPhone%2015%20Pro",
  },
  {
    id: "notif-live-2",
    type: "target_reached",
    title: "Best Price Match!",
    message: "Sony WH-1000XM5 Noise Cancelling Headphones now available at ₹26,490.",
    productName: "Sony WH-1000XM5",
    store: "Amazon",
    discount: "24% OFF",
    time: "1h ago",
    read: false,
    link: "/comparison/Sony%20WH-1000XM5",
  },
  {
    id: "notif-live-3",
    type: "alert_set",
    title: "Real-time Tracker Active",
    message: "Live price scanner is actively monitoring all 8 supported retailers for discounts.",
    productName: "Comparely Multi-Store Bot",
    store: "Comparely",
    time: "2h ago",
    read: true,
    link: "/pricealerts",
  },
];

/**
 * Get all notifications, populating initial defaults or synced price alerts.
 */
export function getStoredNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to parse notifications:", e);
  }

  // If no notifications yet, initialize with defaults
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
  } catch {}
  return DEFAULT_NOTIFICATIONS;
}

/**
 * Save notifications and dispatch live update event.
 */
function saveAndDispatch(notifications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {}
  window.dispatchEvent(
    new CustomEvent("notificationsUpdated", { detail: notifications })
  );
  return notifications;
}

/**
 * Add a new notification.
 */
export function addNotification(notification) {
  const current = getStoredNotifications();
  const newNotif = {
    id: notification.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    type: notification.type || "price_drop",
    title: notification.title || "Price Alert Update",
    message: notification.message || "",
    productName: notification.productName || "",
    store: notification.store || "Comparely",
    discount: notification.discount || "",
    time: notification.time || "Just now",
    read: false,
    link: notification.link || "/pricealerts",
    createdAt: new Date().toISOString(),
  };

  const updated = [newNotif, ...current.filter((n) => n.id !== newNotif.id)];
  return saveAndDispatch(updated);
}

/**
 * Mark a single notification as read.
 */
export function markAsRead(id) {
  const current = getStoredNotifications();
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  return saveAndDispatch(updated);
}

/**
 * Mark all notifications as read.
 */
export function markAllAsRead() {
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  return saveAndDispatch(updated);
}

/**
 * Remove a specific notification by ID.
 */
export function removeNotification(id) {
  const current = getStoredNotifications();
  const updated = current.filter((n) => n.id !== id);
  return saveAndDispatch(updated);
}

/**
 * Clear all notifications.
 */
export function clearAllNotifications() {
  return saveAndDispatch([]);
}

/**
 * Sync active price alerts to notifications list so alerts are visible immediately.
 */
export function syncAlertsToNotifications() {
  try {
    const rawAlerts = localStorage.getItem("priceAlerts");
    if (!rawAlerts) return;
    const alerts = JSON.parse(rawAlerts);
    if (!Array.isArray(alerts) || alerts.length === 0) return;

    const currentNotifs = getStoredNotifications();
    const existingTitles = new Set(currentNotifs.map((n) => n.productName.toLowerCase()));

    const newItems = [];
    alerts.forEach((alert) => {
      const pName = (alert.productName || "").trim();
      if (!pName || existingTitles.has(pName.toLowerCase())) return;

      newItems.push({
        id: `notif_alert_${alert._id || Date.now()}`,
        type: "target_reached",
        title: `Tracking: ${pName}`,
        message: `Alert active: We will notify you when price drops below ₹${Number(alert.targetPrice || 0).toLocaleString()}.`,
        productName: pName,
        store: alert.store || "Verified Stores",
        time: "Active alert",
        read: false,
        link: `/comparison/${encodeURIComponent(pName)}`,
        createdAt: alert.createdAt || new Date().toISOString(),
      });
      existingTitles.add(pName.toLowerCase());
    });

    if (newItems.length > 0) {
      saveAndDispatch([...newItems, ...currentNotifs]);
    }
  } catch (e) {
    console.warn("syncAlertsToNotifications error:", e);
  }
}
