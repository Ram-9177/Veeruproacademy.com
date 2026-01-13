/* Enhanced service worker: cache shell + offline fallback */
const CACHE_NAME = 'vpa-static-v1'
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k)
        })
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy))
        return res
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('/'))) // fallback to shell
  )
})
