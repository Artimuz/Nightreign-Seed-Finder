'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

type WindowWithGtag = Window & {
  gtag?: (...args: unknown[]) => void
}

function getMeasurementId(): string | null {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function buildPagePath(pathname: string): string {
  return pathname
}

export function GaPageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return

    const measurementId = getMeasurementId()
    if (!measurementId) return

    const windowWithGtag = window as WindowWithGtag
    const gtag = windowWithGtag.gtag
    if (typeof gtag !== 'function') return

    const pagePath = buildPagePath(pathname)
    gtag('config', measurementId, { page_path: pagePath })
  }, [pathname])

  return null
}
