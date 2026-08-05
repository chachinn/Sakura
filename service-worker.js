const CACHE_VERSION = "sakura-v18";

const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css?v=18",
    "./app.js?v=18",
    "./data/kanji.js",
    "./data/vocabulary.js",
    "./data/native-japanese.js",
    "./data/slang.js",
    "./manifest.webmanifest",
    "./icons/icon-180.png",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

self.addEventListener(
    "install",
    event => {
        event.waitUntil(
            caches
                .open(CACHE_VERSION)
                .then(
                    cache =>
                        cache.addAll(APP_SHELL)
                )
        );
    }
);

self.addEventListener("message", event => {
    if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener(
    "activate",
    event => {
        event.waitUntil(
            caches
                .keys()
                .then(
                    cacheNames =>
                        Promise.all(
                            cacheNames
                                .filter(
                                    cacheName =>
                                        cacheName !== CACHE_VERSION
                                )
                                .map(
                                    cacheName =>
                                        caches.delete(cacheName)
                                )
                        )
                )
                .then(
                    () => self.clients.claim()
                )
        );
    }
);

self.addEventListener(
    "fetch",
    event => {
        const request = event.request;

        if (request.method !== "GET") {
            return;
        }

        const requestUrl =
            new URL(request.url);

        if (request.mode === "navigate") {
            event.respondWith(
                fetch(request)
                    .then(
                        response => {
                            const responseCopy =
                                response.clone();

                            caches
                                .open(CACHE_VERSION)
                                .then(
                                    cache =>
                                        cache.put(
                                            "./index.html",
                                            responseCopy
                                        )
                                );

                            return response;
                        }
                    )
                    .catch(
                        () =>
                            caches.match("./index.html")
                    )
            );

            return;
        }

        if (requestUrl.origin === self.location.origin) {
            event.respondWith(
                fetch(request)
                    .then(
                        response => {
                            if (response.ok) {
                                const responseCopy = response.clone();
                                caches.open(CACHE_VERSION).then(cache => cache.put(request, responseCopy));
                            }
                            return response;
                        }
                    )
                    .catch(() => caches.match(request))
            );

            return;
        }

        if (requestUrl.hostname === "kanjiapi.dev") {
            event.respondWith(
                caches.match(request).then(cachedResponse => cachedResponse || fetch(request).then(response => {
                    if (response.ok) {
                        const responseCopy = response.clone();
                        caches.open(CACHE_VERSION).then(cache => cache.put(request, responseCopy));
                    }
                    return response;
                }))
            );
        }
    }
);
