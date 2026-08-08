const SHELL_CACHE_VERSION = "sakura-shell-v26";
const KANJI_CONTENT_CACHE_VERSION = "sakura-kanji-content-v1";

const APP_SHELL = [
    "./",
    "./index.html",
    "./style.css?v=19",
    "./app.js?v=23",
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
                .open(SHELL_CACHE_VERSION)
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
                                        cacheName !== SHELL_CACHE_VERSION &&
                                        cacheName !== KANJI_CONTENT_CACHE_VERSION
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
                                .open(SHELL_CACHE_VERSION)
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
            const isKanjiContent =
                requestUrl.pathname.includes("/data/kanji/") &&
                requestUrl.pathname.endsWith(".json");

            if (isKanjiContent) {
                event.respondWith(
                    fetch(request)
                        .then(async response => {
                            const contentCache = await caches.open(KANJI_CONTENT_CACHE_VERSION);
                            if (!response.ok) {
                                return (await contentCache.match(request)) || response;
                            }
                            await contentCache.put(request, response.clone());
                            return response;
                        })
                        .catch(async error => {
                            const contentCache = await caches.open(KANJI_CONTENT_CACHE_VERSION);
                            const cached = await contentCache.match(request);
                            if (cached) return cached;
                            throw error;
                        })
                );
                return;
            }

            event.respondWith(
                fetch(request)
                    .then(
                        response => {
                            if (response.ok) {
                                const responseCopy = response.clone();
                                caches.open(SHELL_CACHE_VERSION).then(cache => cache.put(request, responseCopy));
                            }
                            return response;
                        }
                    )
                    .catch(() => caches.match(request))
            );

            return;
        }

    }
);
