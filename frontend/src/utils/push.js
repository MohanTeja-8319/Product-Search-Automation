// Wires the browser's Push API to the backend's /api/push endpoints so the
// "Browser Push" checkbox that already existed all over the UI actually
// does something: register the service worker, ask permission, subscribe,
// and hand the subscription to the backend so alertMonitor.js can push to it.
import { getVapidPublicKey, subscribePush, unsubscribePush } from "./api";

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Web Push VAPID keys are URL-safe base64; PushManager wants a Uint8Array.
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getServiceWorkerRegistration() {
  // Reuse an existing registration if one is already active, otherwise
  // register the minimal sw.js that ships in /public.
  const existing = await navigator.serviceWorker.getRegistration("/");
  if (existing) return existing;
  return navigator.serviceWorker.register("/sw.js");
}

/** Returns the current PushSubscription for this browser, or null. */
export async function getExistingPushSubscription() {
  if (!isPushSupported()) return null;
  try {
    const registration = await getServiceWorkerRegistration();
    return await registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

/**
 * Registers the service worker (if needed), asks the user for notification
 * permission, subscribes to Web Push, and saves the subscription on the
 * backend for the logged-in user. Safe to call more than once — an
 * already-subscribed browser just re-saves the same endpoint.
 *
 * Throws a human-readable Error on failure so callers can surface it.
 */
export async function enableBrowserPush() {
  if (!isPushSupported()) {
    throw new Error("Browser push notifications aren't supported in this browser.");
  }

  if (Notification.permission === "denied") {
    throw new Error(
      "Notifications are blocked for this site. Enable them in your browser's site settings."
    );
  }

  const permission =
    Notification.permission === "granted" ? "granted" : await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const { publicKey } = await getVapidPublicKey();
  if (!publicKey) {
    throw new Error("Push notifications are not configured on the server yet.");
  }

  const registration = await getServiceWorkerRegistration();
  await navigator.serviceWorker.ready;

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const json = subscription.toJSON();
  await subscribePush({ endpoint: json.endpoint, keys: json.keys });

  return subscription;
}

/** Unsubscribes this browser from push, both locally and on the backend. */
export async function disableBrowserPush() {
  const subscription = await getExistingPushSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  try {
    await subscription.unsubscribe();
  } finally {
    // Still tell the backend even if the local unsubscribe throws, so we
    // don't keep sending pushes to a subscription the browser dropped.
    await unsubscribePush(endpoint).catch(() => {});
  }
}
