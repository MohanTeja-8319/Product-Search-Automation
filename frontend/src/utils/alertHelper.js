import { createAlert as createAlertApi, deleteAlert as deleteAlertApi } from "./api";

/**
 * Retrieve local price alerts array safely.
 */
export const getStoredAlerts = () => {
  const stored = localStorage.getItem("priceAlerts");
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
};

/**
 * Check if a product has an active price alert.
 */
export const isProductAlertActive = (productName) => {
  if (!productName) return false;
  const list = getStoredAlerts();
  return list.some(
    (a) => (a?.productName || "").trim().toLowerCase() === productName.trim().toLowerCase()
  );
};

/**
 * Save or update a price alert locally and sync with backend if authenticated.
 */
export const savePriceAlert = async (alertData) => {
  if (!alertData || !alertData.productName) return null;

  const currentPrice = Number(alertData.currentPrice || alertData.price) || 0;
  const targetPrice =
    alertData.targetPrice !== undefined && alertData.targetPrice !== null && alertData.targetPrice !== ""
      ? Number(alertData.targetPrice)
      : Math.round(currentPrice * 0.9);

  const cleanAlert = {
    _id: alertData._id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    productId: alertData.productId || alertData.id || `prod_${Date.now()}`,
    productName: String(alertData.productName).trim(),
    image: alertData.image || "",
    currentPrice: currentPrice,
    targetPrice: targetPrice,
    initialPrice: Number(alertData.initialPrice || currentPrice) || currentPrice,
    store: alertData.store || "Amazon",
    category: alertData.category || "General",
    createdAt: alertData.createdAt || new Date().toISOString(),
    active: true,
  };

  // Update local storage
  let currentList = getStoredAlerts();
  // Remove existing alert for the same product name
  currentList = currentList.filter(
    (a) => (a?.productName || "").trim().toLowerCase() !== cleanAlert.productName.toLowerCase()
  );
  currentList.unshift(cleanAlert);
  localStorage.setItem("priceAlerts", JSON.stringify(currentList));

  // Sync to database if user is logged in
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const res = await createAlertApi({
        productId: cleanAlert.productId,
        productName: cleanAlert.productName,
        image: cleanAlert.image,
        currentPrice: cleanAlert.currentPrice,
        targetPrice: cleanAlert.targetPrice,
        initialPrice: cleanAlert.initialPrice,
        store: cleanAlert.store,
        category: cleanAlert.category,
        notifyPriceDrop: true,
        notifyStock: true,
        email: true,
        push: true,
        frequency: "Instant",
      });

      if (res?.alert?._id) {
        // Update local alert with backend ID
        cleanAlert._id = res.alert._id;
        const updatedList = getStoredAlerts().map((a) =>
          (a?.productName || "").trim().toLowerCase() === cleanAlert.productName.toLowerCase()
            ? { ...a, _id: res.alert._id }
            : a
        );
        localStorage.setItem("priceAlerts", JSON.stringify(updatedList));
      }
    } catch (err) {
      console.warn("Backend alert sync failed, saved locally:", err?.message || err);
    }
  }

  // Notify listeners
  window.dispatchEvent(new CustomEvent("priceAlertsUpdated", { detail: cleanAlert }));
  return cleanAlert;
};

/**
 * Remove an alert from local storage and backend.
 */
export const removePriceAlert = async (id, productName) => {
  let list = getStoredAlerts();
  list = list.filter((a) => {
    if (id && a._id === id) return false;
    if (productName && (a?.productName || "").trim().toLowerCase() === productName.trim().toLowerCase()) {
      return false;
    }
    return true;
  });
  localStorage.setItem("priceAlerts", JSON.stringify(list));

  const token = localStorage.getItem("token");
  if (token && id && !String(id).startsWith("local_")) {
    try {
      await deleteAlertApi(id);
    } catch (err) {
      console.warn("Failed to delete alert from backend:", err);
    }
  }

  window.dispatchEvent(new CustomEvent("priceAlertsUpdated", { detail: { id, productName } }));
};
