const SHELL_CACHE_VERSION = "sakura-shell-v84";
const KANJI_CONTENT_CACHE_VERSION = "sakura-kanji-content-v1";
const TRAVEL_CONTENT_CACHE_VERSION = "sakura-travel-content-v1";
const VOCABULARY_CONTENT_CACHE_VERSION = "sakura-vocabulary-content-v1";

const APP_SHELL = [
    "./index.html",
    "./style.css?v=54",
    "./app.js?v=63",
    "./data/practice-what-would-you-say.js?v=2",
    "./data/practice-sentence-builder.js?v=2",
    "./data/practice-one-line-many-personalities.js?v=2",
    "./data/counters.json?v=1",
    "./data/etiquette.json?v=1",
    "./data/kanji.js",
    "./data/vocabulary.js?v=4",
    "./data/native-japanese.js?v=2",
    "./data/slang.js?v=2",
    "./data/slang-expansions.js?v=6",
    "./data/travel.js?v=4",
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
                                        cacheName !== KANJI_CONTENT_CACHE_VERSION &&
                                        cacheName !== TRAVEL_CONTENT_CACHE_VERSION &&
                                        cacheName !== VOCABULARY_CONTENT_CACHE_VERSION
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
            const isTravelContent =
                requestUrl.pathname.includes("/data/travel/") &&
                requestUrl.pathname.endsWith(".json");
            const isVocabularyContent =
                requestUrl.pathname.includes("/data/vocabulary/") &&
                requestUrl.pathname.endsWith(".json");

            if (isKanjiContent || isTravelContent || isVocabularyContent) {
                const contentCacheName = isKanjiContent
                    ? KANJI_CONTENT_CACHE_VERSION
                    : isTravelContent
                        ? TRAVEL_CONTENT_CACHE_VERSION
                        : VOCABULARY_CONTENT_CACHE_VERSION;
                event.respondWith(
                    fetch(request)
                        .then(async response => {
                            const contentCache = await caches.open(contentCacheName);
                            if (!response.ok) {
                                return (await contentCache.match(request)) || response;
                            }
                            await contentCache.put(request, response.clone());
                            return response;
                        })
                        .catch(async error => {
                            const contentCache = await caches.open(contentCacheName);
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
