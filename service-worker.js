const SHELL_CACHE_VERSION = "sakura-shell-v141";
const KANJI_CONTENT_CACHE_VERSION = "sakura-kanji-content-v7";
const TRAVEL_CONTENT_CACHE_VERSION = "sakura-travel-content-v1";
const VOCABULARY_CONTENT_CACHE_VERSION = "sakura-vocabulary-content-v7";
const READING_CONTENT_CACHE_VERSION = "sakura-reading-content-v6";

const APP_SHELL = [
    "./index.html",
    "./style.css?v=73",
    "./app.js?v=92",
    "./study-suite.js?v=1",
    "./reading-garden.js?v=7",
    "./features/sakura-experience.js?v=1",
    "./data/vocabulary.js?v=6",
    "./data/native-japanese.js?v=2",
    "./data/slang.js?v=2",
    "./data/travel.js?v=4",
    "./data/kanji.js?v=21",
    "./data/kanji/n5.json",
    "./data/vocabulary/n5.json?v=2",
    "./data/translation-phrases.json?v=1",
    "./data/practice-what-would-you-say.js?v=3",
    "./data/practice-sentence-builder.js?v=3",
    "./data/practice-one-line-many-personalities.js?v=3",
    "./data/counters.json?v=2",
    "./data/particles.json?v=1",
    "./data/grammar.json?v=2",
    "./data/etiquette.json?v=1",
    "./avatar/sakura.png",
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
                .then(cache => Promise.all(
                    APP_SHELL.map(async url => {
                        const response = await fetch(url, { cache:"reload" });
                        if (!response.ok) throw new Error(`Could not precache ${url} (HTTP ${response.status}).`);
                        await cache.put(url, response);
                    })
                ))
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
                                        cacheName !== VOCABULARY_CONTENT_CACHE_VERSION &&
                                        cacheName !== READING_CONTENT_CACHE_VERSION
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
            const isReadingContent =
                requestUrl.pathname.includes("/data/reading/") &&
                requestUrl.pathname.endsWith(".json");

            if (isKanjiContent || isTravelContent || isVocabularyContent || isReadingContent) {
                const contentCacheName = isKanjiContent
                    ? KANJI_CONTENT_CACHE_VERSION
                    : isTravelContent
                        ? TRAVEL_CONTENT_CACHE_VERSION
                        : isVocabularyContent
                            ? VOCABULARY_CONTENT_CACHE_VERSION
                            : READING_CONTENT_CACHE_VERSION;
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

            const shouldBypassHttpCache =
                requestUrl.pathname.endsWith("/app.js") ||
                requestUrl.pathname.endsWith("/data/kanji.js") ||
                requestUrl.pathname.includes("/features/sakura-experience.");
            const networkRequest = shouldBypassHttpCache
                ? new Request(request, { cache:"no-cache" })
                : request;
            event.respondWith(
                fetch(networkRequest)
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
