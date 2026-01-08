import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export function GET() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
  const buildId = (process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? '').trim()
  const cacheVersion = buildId ? `${version}-${buildId}` : version

  const sha = (process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? '').trim()
  const jsDelivrBase = sha
    ? `https://cdn.jsdelivr.net/gh/artimuz/Nightreign-Seed-Finder@${sha}/docs/chunks`
    : 'https://cdn.jsdelivr.net/gh/artimuz/Nightreign-Seed-Finder@main/docs/chunks'

  const pagesChunksBaseUrl = jsDelivrBase

  const js = `const CACHE_VERSION = ${JSON.stringify(cacheVersion)}
const APP_CACHE = \`app-\${CACHE_VERSION}\`
const RUNTIME_CACHE = \`runtime-\${CACHE_VERSION}\`
const PAGES_CHUNKS_BASE_URL = ${JSON.stringify(pagesChunksBaseUrl)}

const isCacheableRequest = (request) => {
  if (request.method !== 'GET') return false
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return false
  return true
}

const isStaticAsset = (url) => {
  return url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/Images/') || url.pathname.startsWith('/fonts/') || url.pathname.startsWith('/data/') || url.pathname === '/manifest.webmanifest'
}

const isNextStaticAsset = (url) => url.pathname.startsWith('/_next/static/')

const buildPagesChunksUrl = (url) => {
  const base = PAGES_CHUNKS_BASE_URL.endsWith('/') ? PAGES_CHUNKS_BASE_URL.slice(0, -1) : PAGES_CHUNKS_BASE_URL
  return base + url.pathname + url.search
}

const withChunkSourceHeader = (response, source) => {
  const headers = new Headers(response.headers)
  headers.set('x-chunk-source', source)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

const fetchFromCdn = async (request) => {
  const url = new URL(request.url)
  const pagesUrl = buildPagesChunksUrl(url)
  return fetch(pagesUrl, { method: 'GET', credentials: 'omit', mode: 'cors' })
}

const fetchFromOrigin = async (request) => fetch(request)

const fetchNextStaticCdnFirst = async ({ request, cache }) => {
  const cached = await cache.match(request, { ignoreVary: true })
  if (cached) return { response: cached, cacheHit: true }

  try {
    const cdnResponse = await fetchFromCdn(request)
    if (cdnResponse.ok) {
      const cdnWithHeader = withChunkSourceHeader(cdnResponse.clone(), 'jsdelivr')
      await cache.put(request, cdnWithHeader.clone())
      return { response: cdnWithHeader, cacheHit: false }
    }
  } catch {
    const originResponse = await fetchFromOrigin(request)
    if (originResponse.ok) {
      const originWithHeader = withChunkSourceHeader(originResponse.clone(), 'vercel')
      await cache.put(request, originWithHeader.clone())
      return { response: originWithHeader, cacheHit: false }
    }
    return { response: originResponse, cacheHit: false }
  }

  const originResponse = await fetchFromOrigin(request)
  if (originResponse.ok) {
    const originWithHeader = withChunkSourceHeader(originResponse.clone(), 'vercel')
    await cache.put(request, originWithHeader.clone())
    return { response: originWithHeader, cacheHit: false }
  }

  return { response: originResponse, cacheHit: false }
}

const upgradeCachedNextStaticInBackground = async ({ request, cache }) => {
  const cached = await cache.match(request, { ignoreVary: true })
  if (!cached) return

  const source = cached.headers.get('x-chunk-source')
  if (source === 'jsdelivr') return

  try {
    const cdnResponse = await fetchFromCdn(request)
    if (!cdnResponse.ok) return

    const cdnWithHeader = withChunkSourceHeader(cdnResponse.clone(), 'jsdelivr')
    await cache.put(request, cdnWithHeader)
  } catch {
    return
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      cache.addAll(['/manifest.webmanifest']).catch(() => undefined)
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

        if (isNextStaticAsset(url)) {
          const { response, cacheHit } = await fetchNextStaticCdnFirst({ request, cache })
          if (cacheHit) {
            event.waitUntil(upgradeCachedNextStaticInBackground({ request, cache }))
            const source = response.headers.get('x-chunk-source')
            if (source) return response
            return withChunkSourceHeader(response.clone(), 'cache')
          }
          return response
        }

        const cachedDirect = await cache.match(request, { ignoreVary: true })
        if (cachedDirect) return cachedDirect
        const canonicalRequest = new Request(url.toString(), { method: 'GET' })
        const cachedCanonical = await cache.match(canonicalRequest, { ignoreVary: true })
        if (cachedCanonical) return cachedCanonical
        const response = await fetch(request)
        if (response.ok || response.type === 'opaque') {
          await cache.put(request, response.clone())
          await cache.put(canonicalRequest, response.clone())
        }
        return response
      })()
    )
    return
  }
})
`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
