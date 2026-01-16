'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

type GtagFunction = (command: 'event' | 'config' | 'js', target: string | Date, params?: Record<string, unknown>) => void

type WindowWithGtag = Window & {
  gtag?: GtagFunction
}

function getMeasurementId(): string | null {
  const value = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function buildPagePath(pathname: string, searchParamsKey: string): string {
  if (!searchParamsKey || searchParamsKey.length === 0) return pathname
  return `${pathname}?${searchParamsKey}`
}

function buildPageLocation(): string | null {
  if (typeof window === 'undefined') return null
  const href = window.location.href
  return href && href.length > 0 ? href : null
}

function buildPageTitle(): string | null {
  if (typeof document === 'undefined') return null
  const title = document.title
  return title && title.length > 0 ? title : null
}

export function GaPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchParamsKey = searchParams?.toString() ?? ''

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return

    if (!getMeasurementId()) return

    const windowWithGtag = window as WindowWithGtag

    const pagePath = buildPagePath(pathname, searchParamsKey)
    const pageLocation = buildPageLocation()
    const pageTitle = buildPageTitle()

    const params: Record<string, unknown> = {
      page_path: pagePath,
    }

    if (pageLocation) params.page_location = pageLocation
    if (pageTitle) params.page_title = pageTitle

    const sendPageView = (attempt: number) => {
      const gtag = windowWithGtag.gtag
      if (typeof gtag === 'function') {
        gtag('event', 'page_view', params)
        return
      }

      if (attempt >= 20) return

      window.setTimeout(() => {
        sendPageView(attempt + 1)
      }, 100)
    }

    sendPageView(0)
  }, [pathname, searchParamsKey])

  return null
}
