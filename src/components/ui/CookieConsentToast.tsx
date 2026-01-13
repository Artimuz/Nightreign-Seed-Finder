'use client'

import React from 'react'

type ConsentState = {
  isVisible: boolean
}

type CookieOptions = {
  maxAgeSeconds: number
}

const consentCookieName = 'cookie_consent_v1'
const legacyStorageKey = 'cookie_consent_v1'
const sessionDismissKey = 'cookie_consent_dismissed_session_v1'

const readLocalStorageValue = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const buildCookieString = (name: string, value: string, options: CookieOptions): string => {
  const encodedName = encodeURIComponent(name)
  const encodedValue = encodeURIComponent(value)
  const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  return `${encodedName}=${encodedValue}; Path=/; Max-Age=${options.maxAgeSeconds}; SameSite=Lax${secure}`
}

const setCookieValue = (name: string, value: string, options: CookieOptions): void => {
  try {
    document.cookie = buildCookieString(name, value, options)
  } catch {
    return
  }
}

const getCookieValue = (name: string): string | null => {
  if (typeof document === 'undefined') return null

  const encodedName = encodeURIComponent(name)
  const parts = document.cookie.split(';').map((part) => part.trim()).filter((part) => part.length > 0)

  for (const part of parts) {
    if (!part.startsWith(`${encodedName}=`)) continue
    return decodeURIComponent(part.slice(encodedName.length + 1))
  }

  return null
}

const readSessionStorageValue = (key: string): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

const writeSessionStorageValue = (key: string, value: string): void => {
  try {
    window.sessionStorage.setItem(key, value)
  } catch {
    return
  }
}

const trackCookieAccepted = (): void => {
  if (typeof window === 'undefined') return

  const maybeGtag: unknown = (window as unknown as { gtag?: unknown }).gtag
  if (typeof maybeGtag !== 'function') return

  const gtag = maybeGtag as (...args: unknown[]) => void
  gtag('event', 'cookies_accepted')
}

export function CookieConsentToast() {
  const [state, setState] = React.useState<ConsentState>({ isVisible: false })

  React.useEffect(() => {
    const consentCookie = getCookieValue(consentCookieName)
    const dismissedThisSession = readSessionStorageValue(sessionDismissKey)

    if (consentCookie === 'accepted') {
      setState({ isVisible: false })
      return
    }

    const legacyConsent = readLocalStorageValue(legacyStorageKey)
    if (legacyConsent === 'accepted') {
      setCookieValue(consentCookieName, 'accepted', { maxAgeSeconds: 60 * 60 * 24 * 180 })
      setState({ isVisible: false })
      return
    }

    if (dismissedThisSession === 'true') {
      setState({ isVisible: false })
      return
    }

    setState({ isVisible: true })
  }, [])

  const handleAccept = () => {
    setCookieValue(consentCookieName, 'accepted', { maxAgeSeconds: 60 * 60 * 24 * 180 })
    trackCookieAccepted()
    setState({ isVisible: false })
  }

  const handleLater = () => {
    writeSessionStorageValue(sessionDismissKey, 'true')
    setState({ isVisible: false })
  }

  if (!state.isVisible) return null

  return (
    <div className="fixed bottom-24 right-4 z-[60] w-[min(420px,calc(100vw-2rem))]">
      <div className="rounded-xl border border-gray-600/40 bg-black/90 p-4 text-gray-200 shadow-lg backdrop-blur-sm">
        <div className="text-sm leading-snug">
          This website uses cookies and similar technologies to improve the experience and measure usage. By selecting Accept, you
          also agree to our{' '}
          <a className="underline" href="/privacy-policy">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a className="underline" href="/terms">
            Terms
          </a>
          .
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleLater}
            className="rounded-lg border border-gray-600/60 bg-transparent px-3 py-2 text-sm text-gray-200 hover:border-gray-400/70 hover:bg-gray-800/40 transition-colors"
          >
            Later
          </button>
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black hover:bg-gray-100 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
