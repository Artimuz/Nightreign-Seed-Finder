'use client'

import { useEffect } from 'react'

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const version = process.env.NEXT_PUBLIC_APP_VERSION ?? 'dev'
    const register = async () => {
      try {
        await navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`, {
          scope: '/',
          updateViaCache: 'none',
        })
      } catch {
        return
      }
    }

    void register()
  }, [])

  return null
}
