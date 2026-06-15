const CACHE = "webkalcer-v4";

self.addEventListener("install", () => {
  // Do NOT cache any HTML shell — that causes stale chunk references after deploy
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Static chunks & assets: always fetch fresh, never cache
  if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/__nextjs_")) {
    event.respondWith(fetch(request).catch(() => new Response(null, { status: 502 })));
    return;
  }

  // For navigation (HTML pages): network-first, fall back to cache for offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response(null, { status: 502 }))),
    );
    return;
  }

  // Other static assets (images, etc.): stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
          return response;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    }),
  );
});
