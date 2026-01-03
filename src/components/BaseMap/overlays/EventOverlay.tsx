'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { getEventCoordinateForSource } from '@/lib/constants/mapCoordinates'
import { Events } from '@/lib/constants/icons'
import { createEventMarker } from '@/lib/map'

export interface EventOverlayProps {
  map: L.Map | null
  eventType?: string
  iconSize?: number
  useEventCoordinate?: boolean
  customPosition?: { x: number; y: number }
  containerSize: number
  sourceLabel?: string
}

export default function EventOverlay({
  map,
  eventType,
  iconSize,
  useEventCoordinate = true,
  customPosition,
  containerSize,
  sourceLabel
}: EventOverlayProps) {
  const eventMarkerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!map || !eventType || !Events[eventType]) {
      if (eventMarkerRef.current) {
        eventMarkerRef.current.remove()
        eventMarkerRef.current = null
      }
      return
    }

    if (!map.getContainer()) {
      return
    }

    if (eventMarkerRef.current) {
      eventMarkerRef.current.remove()
    }

    const addEventMarker = () => {
      try {
        const coordinate = customPosition ? { ...customPosition, id: 'event' } : getEventCoordinateForSource(sourceLabel)
        
        const eventMarker = createEventMarker({
          coordinate,
          containerSize,
          eventType,
          customSize: iconSize,
          isInteractive: false
        })
        
        eventMarker.addTo(map)
        eventMarkerRef.current = eventMarker
      } catch (error) {
        console.warn('Failed to add event marker, map not ready:', error)
      }
    }

    const timeoutId = setTimeout(addEventMarker, 100)

    return () => {
      clearTimeout(timeoutId)
      if (eventMarkerRef.current) {
        eventMarkerRef.current.remove()
        eventMarkerRef.current = null
      }
    }
  }, [map, eventType, iconSize, useEventCoordinate, customPosition, containerSize, sourceLabel])

  return null
}