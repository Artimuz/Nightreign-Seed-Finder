'use client'

import { useEffect } from 'react'

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/')
        const expectedScriptUrl = new URL('/sw.js', window.location.href).toString()

        if (existingRegistration) {
          const existingScriptUrl = existingRegistration.active?.scriptURL
          if (existingScriptUrl === expectedScriptUrl) return
        }

        await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      } catch {
        return
      }
    }

    void register()
  }, [])

  return null
}
