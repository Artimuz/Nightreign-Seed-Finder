import L from 'leaflet'
import { pagesWebpUrl } from '@/lib/pagesAssets'
import { 
  getIconPath, 
  calculateIconSize, 
  createMarkerIcon, 
  createDivIcon,
  setMarkerGhost,
  setMarkerVisibility,
  type IconSize
} from './iconUtils'
import { toLeafletCoordinates, type Coordinate } from './coordinateUtils'

export interface MarkerConfig {
  coordinate: Coordinate
  containerSize: number
  zoom?: number
  isMobile?: boolean
  isInteractive?: boolean
  onClick?: (slotId: string) => void
}

export interface BuildingMarkerConfig extends MarkerConfig {
  building: string
  isNightlord?: boolean
  tooltip?: string
  isGhost?: boolean
}

export interface EventMarkerConfig extends MarkerConfig {
  eventType: string
  customSize?: number
}

export function createBuildingMarker(config: BuildingMarkerConfig): L.Marker {
  const {
    coordinate,
    containerSize,
    zoom = 0,
    isMobile = false,
    building,
    isNightlord = false,
    tooltip,
    isGhost = false,
    isInteractive = true,
    onClick
  } = config

  const iconUrl = getIconPath(building, isNightlord)
  const iconSize = calculateIconSize(containerSize, zoom, isMobile, isNightlord)
  const leafletCoords = toLeafletCoordinates(coordinate, containerSize)

  const icon = createMarkerIcon(iconUrl, iconSize)
  const marker = L.marker(leafletCoords, { 
    icon,
    interactive: isInteractive
  })

  // Set up event handlers
  marker.on('add', () => {
    const markerElement = marker.getElement()
    if (markerElement) {
      markerElement.setAttribute('data-slot-id', coordinate.id)
      markerElement.setAttribute('data-building', building || 'empty')
      
      if (isGhost) {
        setMarkerGhost(marker, true)
      }
    }
  })

  if (onClick && isInteractive) {
    marker.on('click', () => onClick(coordinate.id))
  }

  if (tooltip) {
    marker.bindTooltip(tooltip)
  }

  return marker
}

export function createEventMarker(config: EventMarkerConfig): L.Marker {
  const {
    coordinate,
    containerSize,
    eventType,
    customSize,
    isInteractive = false
  } = config

  const eventIconSize = customSize || Math.round(containerSize * 0.16)
  const halfIconSize = eventIconSize / 2
  const leafletCoords = toLeafletCoordinates(coordinate, containerSize)

  const eventIcon = createDivIcon(
    `<img src="${pagesWebpUrl(`/Images/events/${eventType}.webp`)}" alt="${eventType}" style="width: ${eventIconSize}px; height: ${eventIconSize}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));" />`,
    {
      width: eventIconSize,
      height: eventIconSize,
      anchor: [halfIconSize, halfIconSize],
      popupAnchor: [0, -halfIconSize]
    },
    'event-icon'
  )

  return L.marker(leafletCoords, { 
    icon: eventIcon,
    interactive: isInteractive
  })
}

export function updateBuildingMarker(
  marker: L.Marker,
  building: string,
  containerSize: number,
  zoom: number = 0,
  isMobile: boolean = false,
  isNightlord: boolean = false
): void {
  const iconUrl = getIconPath(building, isNightlord)
  const iconSize = calculateIconSize(containerSize, zoom, isMobile, isNightlord)
  
  const newIcon = createMarkerIcon(iconUrl, iconSize)
  marker.setIcon(newIcon)

  // Update data attributes
  const element = marker.getElement()
  if (element) {
    element.setAttribute('data-building', building || 'empty')
  }
}

export function updateMarkerVisibility(
  marker: L.Marker,
  visible: boolean,
  opacity: number = 1
): void {
  setMarkerVisibility(marker, visible, opacity)
}

export function updateMarkerGhost(marker: L.Marker, isGhost: boolean): void {
  setMarkerGhost(marker, isGhost)
}

export function getMarkerSlotId(marker: L.Marker): string | null {
  const element = marker.getElement()
  return element?.getAttribute('data-slot-id') || null
}

export function getMarkerBuilding(marker: L.Marker): string | null {
  const element = marker.getElement()
  return element?.getAttribute('data-building') || null
}

export function createMarkerGroup(markers: L.Marker[]): L.LayerGroup {
  return L.layerGroup(markers)
}

export function addMarkersToMap(markers: L.Marker[], map: L.Map): void {
  markers.forEach(marker => {
    try {
      if (map.getContainer()) {
        marker.addTo(map)
      }
    } catch (error) {
      console.warn('Failed to add marker to map:', error)
    }
  })
}

export function removeMarkersFromMap(markers: L.Marker[]): void {
  markers.forEach(marker => marker.remove())
}

export function clearMarkerGroup(group: L.LayerGroup): void {
  group.clearLayers()
}

export interface MarkerManager {
  markers: Map<string, L.Marker>
  addMarker: (id: string, marker: L.Marker) => void
  removeMarker: (id: string) => void
  getMarker: (id: string) => L.Marker | undefined
  clearAll: () => void
  updateAll: (updateFn: (marker: L.Marker, id: string) => void) => void
}

export function createMarkerManager(): MarkerManager {
  const markers = new Map<string, L.Marker>()

  return {
    markers,
    addMarker: (id: string, marker: L.Marker) => {
      const existing = markers.get(id)
      if (existing) {
        existing.remove()
      }
      markers.set(id, marker)
    },
    removeMarker: (id: string) => {
      const marker = markers.get(id)
      if (marker) {
        marker.remove()
        markers.delete(id)
      }
    },
    getMarker: (id: string) => markers.get(id),
    clearAll: () => {
      markers.forEach(marker => marker.remove())
      markers.clear()
    },
    updateAll: (updateFn: (marker: L.Marker, id: string) => void) => {
      markers.forEach((marker, id) => updateFn(marker, id))
    }
  }
}