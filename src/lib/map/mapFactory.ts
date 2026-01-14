import L from 'leaflet'
import { MAP_CONFIG } from './config'

export interface MapOptions {
  container: HTMLElement
  isMobile?: boolean
  enableZoom?: boolean
  enablePan?: boolean
  minZoom?: number
  maxZoom?: number
  imageBounds: L.LatLngBoundsExpression
  onZoomChange?: (zoom: number) => void
  onDragEnd?: () => void
}

export function createLeafletMap(options: MapOptions): L.Map {
  const {
    container,
    isMobile = false,
    enableZoom = true,
    enablePan = true,
    minZoom,
    maxZoom,
    imageBounds,
    onZoomChange,
    onDragEnd
  } = options

  const zoomConfig = isMobile ? MAP_CONFIG.zoom.mobile : MAP_CONFIG.zoom.desktop

  const map = L.map(container, {
    crs: L.CRS.Simple,
    minZoom: minZoom ?? zoomConfig.min,
    maxZoom: maxZoom ?? zoomConfig.max,
    zoomControl: enableZoom,
    attributionControl: MAP_CONFIG.leaflet.attributionControl,
    zoomSnap: zoomConfig.snap,
    zoomDelta: zoomConfig.delta,
    dragging: enablePan,
    touchZoom: enableZoom,
    doubleClickZoom: enableZoom,
    scrollWheelZoom: enableZoom,
    boxZoom: enableZoom,
    keyboard: enableZoom
  })

  map.fitBounds(imageBounds)
  map.setMaxBounds(imageBounds)

  if (onZoomChange) {
    map.on('zoom', () => {
      map.panInsideBounds(imageBounds, { 
        animate: MAP_CONFIG.leaflet.animations.panInsideBounds 
      })
      onZoomChange(map.getZoom())
    })
  }

  if (onDragEnd || enablePan) {
    map.on('drag', () => {
      map.panInsideBounds(imageBounds, { 
        animate: MAP_CONFIG.leaflet.animations.panInsideBounds 
      })
    })
    
    if (onDragEnd) {
      map.on('dragend', onDragEnd)
    }
  }

  return map
}

export function addImageOverlay(
  map: L.Map, 
  imageUrl: string, 
  bounds: L.LatLngBoundsExpression
): L.ImageOverlay {
  const imageOverlay = L.imageOverlay(imageUrl, bounds)
  imageOverlay.addTo(map)
  return imageOverlay
}

export function calculateMapBounds(containerSize: number): L.LatLngBoundsExpression {
  return [[0, 0], [containerSize, containerSize]]
}

export function setupMapResizeObserver(
  container: HTMLElement,
  map: L.Map,
  onResize?: () => void
): ResizeObserver {
  const resizeObserver = new ResizeObserver(() => {
    // Reduced delay and more gentle resize handling
    setTimeout(() => {
      if (map && map.getContainer()) {
        map.invalidateSize({ animate: false })
        if (onResize) {
          onResize()
        }
      }
    }, 50)
  })

  resizeObserver.observe(container)
  return resizeObserver
}

export function cleanupMap(map: L.Map | null): void {
  if (map) {
    map.remove()
  }
}