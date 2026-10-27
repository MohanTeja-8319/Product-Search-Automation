// PWA Helper: Service Worker registration, updates, install prompt handling, and offline detection

let deferredInstallPrompt = null;
const installListeners = new Set();
const offlineListeners = new Set();

/**
 * Register Service Worker safely with update detection
 */
export function registerPwaServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => {
        // Check for updates periodically and on registration
        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener("statechange", () => {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available; emit event for optional reload prompt
              window.dispatchEvent(new CustomEvent("pwa-update-available", { detail: registration }));
            }
          });
        });
      })
      .catch((error) => {
        console.warn("[PWA] Service Worker registration failed:", error);
      });
  });

  // Handle controllerchange safely without causing infinite refresh loops
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!refreshing) {
      refreshing = true;
      // Soft notification or optional page reload only when explicitly accepted
    }
  });
}

/**
 * Capture beforeinstallprompt event
 */
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    notifyInstallListeners(true);
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    notifyInstallListeners(false);
  });

  window.addEventListener("online", () => notifyOfflineListeners(true));
  window.addEventListener("offline", () => notifyOfflineListeners(false));
}

function notifyInstallListeners(canInstall) {
  installListeners.forEach((fn) => {
    try {
      fn(canInstall);
    } catch (_) {}
  });
}

function notifyOfflineListeners(isOnline) {
  offlineListeners.forEach((fn) => {
    try {
      fn(isOnline);
    } catch (_) {}
  });
}

/**
 * Hook or subscriber for PWA installability
 */
export function subscribeInstallPrompt(callback) {
  installListeners.add(callback);
  callback(!!deferredInstallPrompt);
  return () => installListeners.delete(callback);
}

/**
 * Trigger the native browser install prompt
 */
export async function triggerInstallPrompt() {
  if (!deferredInstallPrompt) {
    return { outcome: "unavailable" };
  }
  try {
    deferredInstallPrompt.prompt();
    const choiceResult = await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    notifyInstallListeners(false);
    return choiceResult;
  } catch (err) {
    deferredInstallPrompt = null;
    notifyInstallListeners(false);
    return { outcome: "dismissed" };
  }
}

/**
 * Check if the app is already installed or launched in standalone mode
 */
export function isAppStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

/**
 * Subscribe to online/offline network changes
 */
export function subscribeNetworkStatus(callback) {
  offlineListeners.add(callback);
  if (typeof navigator !== "undefined") {
    callback(navigator.onLine);
  }
  return () => offlineListeners.delete(callback);
}
