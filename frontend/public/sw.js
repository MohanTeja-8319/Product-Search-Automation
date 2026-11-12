// Comparely / Product Search Automation PWA Service Worker
// Version: 1.0.1

const isLocalhost =
  self.location.hostname === "localhost" ||
  self.location.hostname === "127.0.0.1" ||
  self.location.hostname === "0.0.0.0";

if (isLocalhost) {
  // In development, immediately skip waiting, purge all caches, and unregister
  self.addEventListener("install", () => {
    self.skipWaiting();
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => self.registration.unregister())
        .then(() => self.clients.claim())
    );
  });

  // DO NOT attach any fetch listener on localhost so the browser and Vite handle all requests natively
} else {
  // Production PWA Service Worker logic
  const CACHE_VERSION = "comparely-pwa-v1.0.1";
  const PRECACHE_ASSETS = [
    "/",
    "/index.html",
    "/manifest.json",
    "/manifest.webmanifest",
    "/logo.png",
    "/comparely.png",
    "/favicon.svg",
    "/pwa-192x192.png",
    "/pwa-512x512.png",
    "/apple-touch-icon.png",
    "/pwa-maskable-512x512.png"
  ];

  self.addEventListener("install", (event) => {
    event.waitUntil(
      caches
        .open(CACHE_VERSION)
        .then((cache) => {
          return cache.addAll(PRECACHE_ASSETS).catch((err) => {
            console.warn("[SW] Precaching non-critical assets warning:", err);
          });
        })
        .then(() => self.skipWaiting())
    );
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((name) => {
              if (name.startsWith("comparely-") && name !== CACHE_VERSION) {
                return caches.delete(name);
              }
              return null;
            })
          );
        })
        .then(() => self.clients.claim())
    );
  });

  self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;

    const url = new URL(request.url);

    // Never intercept API routes, dev scripts, or external retail links
    if (
      url.pathname.startsWith("/api/") ||
      url.pathname.startsWith("/api") ||
      url.pathname.startsWith("/@") ||
      url.pathname.startsWith("/src/") ||
      url.pathname.startsWith("/node_modules/") ||
      url.hostname !== self.location.hostname
    ) {
      return;
    }

    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(async () => {
            const cache = await caches.open(CACHE_VERSION);
            const cachedRoute = await cache.match(request);
            if (cachedRoute) return cachedRoute;
            const cachedIndex = (await cache.match("/index.html")) || (await cache.match("/"));
            if (cachedIndex) return cachedIndex;
            return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
          })
      );
      return;
    }

    // Static assets
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => new Response("", { status: 408, statusText: "Offline" }));
      })
    );
  });

  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
      self.skipWaiting();
    }
  });

  self.addEventListener("push", (event) => {
    let data = { title: "Price Alert", body: "A price you're tracking has changed.", url: "/pricealerts" };
    if (event.data) {
      try {
        data = { ...data, ...event.data.json() };
      } catch {
        data.body = event.data.text() || data.body;
      }
    }
    const options = {
      body: data.body,
      icon: "/pwa-192x192.png",
      badge: "/favicon.svg",
      data: { url: data.url || "/pricealerts" },
      vibrate: [100, 50, 100],
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/pricealerts";
    event.waitUntil(
      self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientsList) => {
        for (const client of clientsList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
    );
  });
}
