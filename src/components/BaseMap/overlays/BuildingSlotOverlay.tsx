'use client'

import { useEffect } from 'react'
import { useMarkerManager } from '../hooks/useMarkerManager'
import { IconConfig } from '../hooks/useMapState'

export interface BuildingSlotOverlayProps {
  map: L.Map | null
  selectedBuildings: Record<string, string>
  selectedNightlord: string
  onSlotClick: (slotId: string) => void
  isInteractive: boolean
  mapType: string
  remainingSeedsCount?: number
  containerSize: number
  iconConfig: IconConfig
  currentZoom: number
}

export default function BuildingSlotOverlay({
  map,
  selectedBuildings,
  selectedNightlord,
  onSlotClick,
  isInteractive,
  mapType,
  remainingSeedsCount,
  containerSize,
  iconConfig,
  currentZoom
}: BuildingSlotOverlayProps) {
  const { markers } = useMarkerManager({
    map,
    selectedBuildings,
    selectedNightlord,
    onSlotClick,
    coordinateType: 'interactive',
    containerSize,
    iconConfig,
    currentZoom
  })

  useEffect(() => {
    if (!isInteractive && markers) {
      markers.forEach((marker) => {
        marker.off('click')
        const element = marker.getElement()
        if (element) {
          element.style.cursor = 'default'
        }
      })
    }
  }, [isInteractive, markers])

  return null
}