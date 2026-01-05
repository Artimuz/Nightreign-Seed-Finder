const CACHE_VERSION = "1.2.10"
const APP_CACHE = `app-${CACHE_VERSION}`
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`

const normalizePathPrefix = (value) => {
  if (!value) return ''
  const withoutTrailing = value.endsWith('/') ? value.slice(0, -1) : value
  return withoutTrailing === '/' ? '' : withoutTrailing
}

const basePath = (() => {
  const scopePath = new URL(self.registration.scope).pathname
  return normalizePathPrefix(scopePath)
})()

const withBasePath = (pathValue) => basePath + pathValue

const isCacheableRequest = (request) => {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false
  return true
}

const isStaticAsset = (url) => {
  return url.pathname.startsWith(withBasePath('/_next/static/')) || url.pathname.startsWith(withBasePath('/Images/')) || url.pathname.startsWith(withBasePath('/fonts/')) || url.pathname.startsWith(withBasePath('/data/')) || url.pathname === withBasePath('/manifest.webmanifest')
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      cache.addAll([withBasePath('/'), withBasePath('/manifest.webmanifest')]).catch(() => undefined)
    )
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key !== APP_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (!isCacheableRequest(request)) return

  const url = new URL(request.url)

  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE)
        const cachedDirect = await cache.match(request, { ignoreVary: true })
        if (cachedDirect) return cachedDirect
        const canonicalRequest = new Request(url.toString(), { method: 'GET' })
        const cachedCanonical = await cache.match(canonicalRequest, { ignoreVary: true })
        if (cachedCanonical) return cachedCanonical
        const response = await fetch(request)
        if (response.status === 200 || response.type === 'opaque') {
          await cache.put(request, response.clone())
          await cache.put(canonicalRequest, response.clone())
        }
        return response
      })()
    )
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(APP_CACHE)
        try {
          const response = await fetch(request)
          if (response.ok) await cache.put(withBasePath('/'), response.clone())
          return response
        } catch {
          const cached = await cache.match(withBasePath('/'))
          if (cached) return cached
          return new Response('Offline', { status: 503, statusText: 'Offline' })
        }
      })()
    )
  }
})
