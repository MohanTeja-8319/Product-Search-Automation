// Comparely / Product Search Automation PWA Service Worker
// Version: 1.0.0

const CACHE_VERSION = "comparely-pwa-v1.0.0";
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
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

// 1. Installation: Precaching the App Shell and Essential Static Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => {
        // Precache critical shell assets
        return cache.addAll(PRECACHE_ASSETS).catch((err) => {
          console.warn("[SW] Precaching warning (some non-critical assets skipped):", err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// 2. Activation: Clean up obsolete caches belonging only to this app
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

// 3. Fetch Strategy: Tailored, secure caching
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests; never touch POST/PUT/DELETE/etc.
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // STRICT RULE: Never cache or intercept API endpoints, auth routes, or external retail links
  // Let the browser handle network directly
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/api") ||
    url.hostname !== self.location.hostname
  ) {
    return;
  }

  // A. Navigation requests (HTML pages / React Router routes)
  // Strategy: Network-first, fallback to cached App Shell / index.html, then offline.html
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_VERSION).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_VERSION);
          // Try matching requested route first
          const cachedRoute = await cache.match(request);
          if (cachedRoute) return cachedRoute;
          // Fallback to cached index.html so React Router handles client-side routing
          const cachedIndex = await cache.match("/index.html") || await cache.match("/");
          if (cachedIndex) return cachedIndex;
          // Final fallback to dedicated offline HTML page
          const offlineFallback = await cache.match("/offline.html");
          if (offlineFallback) return offlineFallback;
          return new Response("Offline - Product Search Automation", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        })
    );
    return;
  }

  // B. Static Assets: JS bundles, CSS files, fonts, and local images
  // Strategy: Cache-first with network fallback for hashed/static assets
  const isStaticAsset =
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ttf") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".ico");

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_VERSION).then((cache) => {
                cache.put(request, clone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // If image request fails offline, fallback to favicon.svg or logo.png if available
            if (request.destination === "image") {
              return caches.match("/logo.png");
            }
            return Response.error();
          });
      })
    );
    return;
  }

  // C. All other same-origin requests: Network-first
  event.respondWith(
    fetch(request).catch(async () => {
      const match = await caches.match(request);
      return match || Response.error();
    })
  );
});

// 4. Safe update message listener
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// 5. Preserved Push Notifications for Price Alerts
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

// 6. Preserved Notification Click Handler
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
