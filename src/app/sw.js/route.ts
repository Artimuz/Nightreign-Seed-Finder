import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export function GET() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
  const buildId = (process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? '').trim()
  const cacheVersion = buildId ? `${version}-${buildId}` : version

  const configuredPagesBase = (process.env.NEXT_PUBLIC_PAGES_ASSET_BASE_URL ?? 'https://artimuz.github.io/Nightreign-Seed-Finder/public').trim().replace(/\/$/, '')
  const pagesBaseWithoutPublic = configuredPagesBase.endsWith('/public') ? configuredPagesBase.slice(0, -'/public'.length) : configuredPagesBase
  const pagesChunksBaseUrl = `${pagesBaseWithoutPublic}/chunks`

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

const fetchWithFallback = async (request) => {
  const url = new URL(request.url)

  if (isNextStaticAsset(url)) {
    try {
      const pagesUrl = buildPagesChunksUrl(url)
      const pagesResponse = await fetch(pagesUrl, { method: 'GET', credentials: 'omit', mode: 'no-cors' })
      if (pagesResponse.type === 'opaque') return pagesResponse
      if (pagesResponse.ok) return pagesResponse
      const originResponse = await fetch(request)
      if (originResponse.ok) return originResponse
      return pagesResponse
    } catch {
      return fetch(request)
    }
  }

  return fetch(request)
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
        const cachedDirect = await cache.match(request, { ignoreVary: true })
        if (cachedDirect) return cachedDirect
        const canonicalRequest = new Request(url.toString(), { method: 'GET' })
        const cachedCanonical = await cache.match(canonicalRequest, { ignoreVary: true })
        if (cachedCanonical) return cachedCanonical
        const response = await fetchWithFallback(request)
        if (response.status === 200 || response.type === 'opaque') {
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
