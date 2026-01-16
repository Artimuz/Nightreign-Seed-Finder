'use client'

import { useEffect } from 'react'

function getWarmableAssetUrls(): string[] {
  const urls = new Set<string>()

  for (const script of Array.from(document.scripts)) {
    const src = script.getAttribute('src')
    if (src) urls.add(src)
  }

  for (const link of Array.from(document.querySelectorAll('link[rel="stylesheet"]'))) {
    const href = link.getAttribute('href')
    if (href) urls.add(href)
  }

  return Array.from(urls)
}

async function sendWarmCacheMessage(): Promise<void> {
  const controller = navigator.serviceWorker.controller
  if (!controller) return

  const urls = getWarmableAssetUrls()
  controller.postMessage({ type: 'WARM_CACHE', urls })
}

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const appVersion = process.env.NEXT_PUBLIC_APP_VERSION ?? '0'
        const registration = await navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(appVersion)}`, {
          scope: '/',
        })

        const onControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
          void sendWarmCacheMessage()
          window.location.reload()
        }

        navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)

        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
          return
        }

        await navigator.serviceWorker.ready
        await sendWarmCacheMessage()
      } catch {
        return
      }
    }

    void register()
  }, [])

  return null
}
