'use client'

type GtagFunction = (command: 'event', eventName: string, params?: Record<string, unknown>) => void

type TelemetryEvent = {
  eventName: AnalyticsEventName
  params: Record<string, unknown>
  timestamp: number
}

type WindowWithGtag = Window & {
  gtag?: GtagFunction
  __telemetryEvents?: TelemetryEvent[]
}

export type AnalyticsEventName = 'building_icon_added' | 'seed_pattern_found' | 'crystal_shattered' | 'map_selected' | 'map_selected_with_boss'

if (typeof window !== 'undefined') {
  const windowWithGtag = window as WindowWithGtag
  windowWithGtag.__telemetryEvents = windowWithGtag.__telemetryEvents ?? []
}

function getPageContext(): Record<string, unknown> {
  if (typeof window === 'undefined') return {}

  const context: Record<string, unknown> = {}

  const href = window.location.href
  if (href && href.length > 0) context.page_location = href

  const path = window.location.pathname
  const search = window.location.search
  const pagePath = search && search.length > 0 ? `${path}${search}` : path
  if (pagePath && pagePath.length > 0) context.page_path = pagePath

  if (typeof document !== 'undefined') {
    const title = document.title
    if (title && title.length > 0) context.page_title = title
  }

  return context
}

export function trackAnalyticsEvent(eventName: AnalyticsEventName, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  const safeParams = { ...getPageContext(), ...(params ?? {}) }

  const windowWithGtag = window as WindowWithGtag
  const telemetryEvents = windowWithGtag.__telemetryEvents ?? []
  telemetryEvents.push({ eventName, params: safeParams, timestamp: Date.now() })
  windowWithGtag.__telemetryEvents = telemetryEvents

  if (process.env.NODE_ENV !== 'production') return

  const gtag = windowWithGtag.gtag
  if (!gtag) return

  gtag('event', eventName, safeParams)
}
