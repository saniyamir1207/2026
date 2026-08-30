/* =========================================================
   HEALTHSPHERE SERVICE WORKER
   VERSION 1.0.0
   ========================================================= */

"use strict";


/* =========================================================
   CACHE CONFIGURATION
   ========================================================= */

const CACHE_NAME =
    "healthsphere-v1";


const RUNTIME_CACHE =
    "healthsphere-runtime-v1";


/*
 * Add your main frontend files here.
 *
 * If you later create additional CSS/JS files,
 * add their paths to this array.
 */

const APP_SHELL = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json"

];


/* =========================================================
   INSTALL EVENT
   ========================================================= */

self.addEventListener(
    "install",
    function (event) {

        console.log(
            "[HealthSphere SW] Installing..."
        );


        event.waitUntil(

            caches.open(
                CACHE_NAME
            )
            .then(
                function (cache) {

                    console.log(
                        "[HealthSphere SW] Caching app shell."
                    );


                    return cache.addAll(
                        APP_SHELL
                    );

                }
            )
            .then(
                function () {

                    /*
                     * Activate the new service worker
                     * immediately.
                     */

                    return self.skipWaiting();

                }
            )

        );

    }
);


/* =========================================================
   ACTIVATE EVENT
   ========================================================= */

self.addEventListener(
    "activate",
    function (event) {

        console.log(
            "[HealthSphere SW] Activating..."
        );


        event.waitUntil(

            caches.keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function (cacheName) {

                                    /*
                                     * Delete old HealthSphere
                                     * cache versions.
                                     */

                                    if (
                                        cacheName !== CACHE_NAME &&
                                        cacheName !== RUNTIME_CACHE
                                    ) {

                                        console.log(
                                            "[HealthSphere SW] Removing old cache:",
                                            cacheName
                                        );


                                        return caches.delete(
                                            cacheName
                                        );

                                    }


                                    return null;

                                }
                            )

                        );

                    }
                )
                .then(
                    function () {

                        /*
                         * Take control of open pages.
                         */

                        return self.clients.claim();

                    }
                )

        );

    }
);


/* =========================================================
   FETCH EVENT
   ========================================================= */

self.addEventListener(
    "fetch",
    function (event) {

        /*
         * Only handle GET requests.
         */

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        /*
         * Ignore browser extensions.
         */

        if (
            event.request.url.startsWith(
                "chrome-extension://"
            )
        ) {

            return;

        }


        event.respondWith(

            caches.match(
                event.request
            )
            .then(
                function (cachedResponse) {

                    /*
                     * If the file exists in cache,
                     * return it immediately.
                     */

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    /*
                     * Otherwise try the network.
                     */

                    return fetch(
                        event.request
                    )
                    .then(
                        function (networkResponse) {

                            /*
                             * Only cache valid responses.
                             */

                            if (
                                !networkResponse ||
                                networkResponse.status !== 200 ||
                                networkResponse.type === "opaque"
                            ) {

                                return networkResponse;

                            }


                            /*
                             * Clone response because
                             * one copy is returned and
                             * another is stored.
                             */

                            const responseClone =
                                networkResponse.clone();


                            caches.open(
                                RUNTIME_CACHE
                            )
                            .then(
                                function (cache) {

                                    cache.put(
                                        event.request,
                                        responseClone
                                    );

                                }
                            );


                            return networkResponse;

                        }
                    )
                    .catch(
                        function () {

                            /*
                             * Offline fallback.
                             */

                            return caches.match(
                                "./index.html"
                            );

                        }
                    );

                }
            )

        );

    }
);


/* =========================================================
   MESSAGE EVENT
   ========================================================= */

self.addEventListener(
    "message",
    function (event) {

        if (
            !event.data
        ) {

            return;

        }


        /*
         * Force service-worker update.
         */

        if (
            event.data.type ===
            "SKIP_WAITING"
        ) {

            self.skipWaiting();

        }


        /*
         * Clear runtime cache.
         */

        if (
            event.data.type ===
            "CLEAR_RUNTIME_CACHE"
        ) {

            caches.delete(
                RUNTIME_CACHE
            );

        }

    }
);


/* =========================================================
   BACKGROUND SYNC PLACEHOLDER
   ========================================================= */

/*
 * Backend integration can later use this area
 * for queued health-related requests when the
 * device comes back online.
 */

self.addEventListener(
    "sync",
    function (event) {

        if (
            event.tag ===
            "healthsphere-sync"
        ) {

            event.waitUntil(
                Promise.resolve()
            );

        }

    }
);


console.log(
    "[HealthSphere SW] Service worker loaded."
);