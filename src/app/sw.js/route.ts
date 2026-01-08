import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export function GET() {
  const js = `self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys()
      await Promise.all(cacheKeys.map((key) => caches.delete(key)))

      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      for (const client of clients) {
        try {
          client.navigate(client.url)
        } catch {
          continue
        }
      }

      await self.registration.unregister()

      self.clients.claim()
    })()
  )
})
`

  return new NextResponse(js, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
