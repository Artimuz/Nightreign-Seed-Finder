import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export function GET() {
  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? '0'

  const js = `const APP_VERSION = ${JSON.stringify(appVersion)}
const SW_REVISION = '6'

const staticCacheName = \`next-static-\${APP_VERSION}-\${SW_REVISION}\`

const shouldHandleRequest = (requestUrl, requestMethod) => {
  if (requestMethod !== 'GET') return false
  if (requestUrl.origin !== self.location.origin) return false

  const path = requestUrl.pathname

  if (path.startsWith('/_next/static/chunks/')) return true
  if (path.startsWith('/_next/static/css/')) return true

  return false
}

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      const expectedPrefix = 'next-static-'

      await Promise.all(
        keys.map((key) => {
          if (!key.startsWith(expectedPrefix)) return Promise.resolve(false)
          if (key === staticCacheName) return Promise.resolve(false)
          return caches.delete(key)
        })
      )

      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', (event) => {
  const data = event.data

  if (!data || typeof data !== 'object') return

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting()
    return
  }

  if (data.type === 'WARM_CACHE') {
    const urls = Array.isArray(data.urls) ? data.urls : []
    event.waitUntil(warmCache(urls, staticCacheName))
  }
})

self.addEventListener('fetch', (event) => {
  const request = event.request

  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') return

  if (request.headers.has('range')) return

  const url = new URL(request.url)

  if (!shouldHandleRequest(url, request.method)) return

  const cacheKey = url.toString()

  event.respondWith(failOpenCacheFirst(cacheKey, request, staticCacheName))
})

async function failOpenCacheFirst(cacheKey, request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(request)

    if (response.ok && response.status === 200 && response.type === 'basic') {
      try {
        await cache.put(cacheKey, response.clone())
      } catch {
        return response
      }
    }

    return response
  } catch {
    return fetch(request)
  }
}

async function warmCache(urls, cacheName) {
  const cache = await caches.open(cacheName)
  const uniqueUrls = Array.from(
    new Set(
      urls
        .filter((url) => typeof url === 'string')
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
    )
  )

  await Promise.all(
    uniqueUrls.map(async (url) => {
      const requestUrl = new URL(url, self.location.origin)
      if (requestUrl.origin !== self.location.origin) return
      if (!shouldHandleRequest(requestUrl, 'GET')) return

      const cacheKey = requestUrl.toString()
      const cached = await cache.match(cacheKey)
      if (cached) return

      const response = await fetch(cacheKey, { cache: 'reload' })

      if (response.ok && response.status === 200 && response.type === 'basic') {
        await cache.put(cacheKey, response)
      }
    })
  )
}

`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
