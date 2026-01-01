'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { getInteractiveCoordinates, EVENT_COORDINATE } from '@/lib/constants/mapCoordinates'
import { 
  createMarkerManager,
  createBuildingMarker,
  updateBuildingMarker,
  type MarkerManager 
} from '@/lib/map'

export interface UseMarkerManagerProps {
  map: L.Map | null
  mapType: string
  selectedBuildings: Record<string, string>
  selectedNightlord: string
  onSlotClick: (slotId: string) => void
  coordinateType: 'interactive' | 'all'
  containerSize: number
  iconConfig: { size: [number, number], anchor: [number, number], popupAnchor: [number, number] }
  currentZoom: number
}

export function useMarkerManager({
  map,
  mapType,
  selectedBuildings,
  selectedNightlord,
  onSlotClick,
  coordinateType,
  containerSize,
  iconConfig,
  currentZoom
}: UseMarkerManagerProps) {
  const markerManagerRef = useRef<MarkerManager>(createMarkerManager())

  

  useEffect(() => {
    if (!map || !map.getContainer()) return

    const markerManager = markerManagerRef.current
    markerManager.clearAll()

    const addMarkersWhenReady = () => {
      try {
        const interactive = getInteractiveCoordinates(mapType)
        const coordinates = coordinateType === 'interactive' ? interactive : [...interactive, EVENT_COORDINATE]

        coordinates.forEach((coord) => {
          const building = coord.id === 'nightlord' ? selectedNightlord : selectedBuildings[coord.id]
          const isNightlord = coord.id === 'nightlord'
          
          const marker = createBuildingMarker({
            coordinate: coord,
            containerSize,
            zoom: currentZoom,
            isMobile: iconConfig.size[0] <= 32,
            building: building || 'empty',
            isNightlord,
            tooltip: isNightlord ? 'Nightlord - Click to select' : `Slot ${coord.id} - Click to build`,
            isInteractive: true,
            onClick: onSlotClick
          })

          marker.addTo(map)
          markerManager.addMarker(coord.id, marker)
        })
      } catch (error) {
        console.warn('Failed to add markers, map not ready:', error)
      }
    }

    const timeoutId = setTimeout(addMarkersWhenReady, 100)

    return () => {
      clearTimeout(timeoutId)
      markerManager.clearAll()
    }
  }, [map, mapType, selectedBuildings, selectedNightlord, coordinateType, containerSize, iconConfig, currentZoom])

  useEffect(() => {
    if (!map) return

    const markerManager = markerManagerRef.current
    
    markerManager.updateAll((marker, slotId) => {
      const building = slotId === 'nightlord' ? selectedNightlord : selectedBuildings[slotId]
      const isNightlord = slotId === 'nightlord'
      const isMobile = iconConfig.size[0] <= 32
      
      updateBuildingMarker(
        marker,
        building || 'empty',
        containerSize,
        currentZoom,
        isMobile,
        isNightlord
      )
    })
  }, [currentZoom, selectedBuildings, selectedNightlord])

  return {
    markers: markerManagerRef.current.markers,
    clearMarkers: () => markerManagerRef.current.clearAll()
  }
}