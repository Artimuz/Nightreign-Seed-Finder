'use client'

import { useEffect } from 'react'

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })

        if (registration.waiting) {
          const onControllerChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
            window.location.reload()
          }

          navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
          registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        }
      } catch {
        return
      }
    }

    void register()
  }, [])

  return null
}
