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

export function trackAnalyticsEvent(eventName: AnalyticsEventName, params?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  const safeParams = params ?? {}

  const windowWithGtag = window as WindowWithGtag
  const telemetryEvents = windowWithGtag.__telemetryEvents ?? []
  telemetryEvents.push({ eventName, params: safeParams, timestamp: Date.now() })
  windowWithGtag.__telemetryEvents = telemetryEvents

  if (process.env.NODE_ENV !== 'production') return

  const gtag = windowWithGtag.gtag
  if (!gtag) return

  gtag('event', eventName, safeParams)
}
