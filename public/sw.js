const CACHE_NAME = "b1-planner-v2";
const PRECACHE = ["/", "/icon-192.png", "/icon-512.png", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SCHEDULE_REMINDER") {
    const { delayMs, title, body } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title || "German B1 Planner", {
        body: body || "Time to practice your German! 🇩🇪",
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "daily-reminder",
        renotify: true,
      });
    }, Math.max(0, delayMs));
  }
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      if (clients.length > 0) return clients[0].focus();
      return self.clients.openWindow("/");
    })
  );
});
