'use client'

import { useEffect } from 'react'
import { APP_VERSION } from '@/lib/constants/version'

export function PwaServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = async () => {
      try {
        const existingRegistration = await navigator.serviceWorker.getRegistration('/')
        const expectedScriptUrl = new URL(`/sw.js?v=${APP_VERSION}`, window.location.href).toString()

        if (existingRegistration) {
          try {
            const existingScriptUrl = existingRegistration.active?.scriptURL
            if (existingScriptUrl) {
              const existing = new URL(existingScriptUrl)
              const expected = new URL(expectedScriptUrl)
              if (existing.pathname === expected.pathname && existing.search === expected.search) {
                await existingRegistration.update()
                return
              }
            }
          } catch {
            await existingRegistration.update()
            return
          }

          await existingRegistration.unregister()
        }

        await navigator.serviceWorker.register(`/sw.js?v=${APP_VERSION}`, { scope: '/' })
      } catch {
        return
      }
    }

    void register()
  }, [])

  return null
}
