'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { 
  MAP_CONFIG, 
  createLeafletMap, 
  addImageOverlay, 
  calculateMapBounds,
  setupMapResizeObserver,
  cleanupMap,
  getMapImage
} from '@/lib/map'

// Fix for Leaflet default icons in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

export interface BaseMapProps {
  mapType?: 'normal' | 'crater' | 'mountaintop' | 'noklateo' | 'rotted'
  imageUrl?: string
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onMapReady?: (map: L.Map) => void
  onZoomChange?: (zoom: number) => void
  minZoom?: number
  maxZoom?: number
  enableZoom?: boolean
  enablePan?: boolean
}


export default function BaseMap({
  mapType = 'normal',
  imageUrl,
  className = '',
  style,
  children,
  onMapReady,
  onZoomChange,
  minZoom,
  maxZoom,
  enableZoom = true,
  enablePan = true
}: BaseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    const containerSize = mapRef.current ? Math.min(mapRef.current.offsetWidth, mapRef.current.offsetHeight) : MAP_CONFIG.container.defaultSize
    const imageBounds = calculateMapBounds(containerSize)
    
    if (leafletMapRef.current) {
      cleanupMap(leafletMapRef.current)
      leafletMapRef.current = null
    }

    const map = createLeafletMap({
      container: mapRef.current,
      isMobile,
      enableZoom,
      enablePan,
      minZoom,
      maxZoom,
      imageBounds,
      onZoomChange: onZoomChange ? (zoom) => onZoomChange(zoom) : undefined
    })

    const finalImageUrl = imageUrl || getMapImage(mapType as keyof typeof MAP_CONFIG.images)
    addImageOverlay(map, finalImageUrl, imageBounds)

    leafletMapRef.current = map

    if (onMapReady) {
      onMapReady(map)
    }

    return () => {
      if (leafletMapRef.current) {
        cleanupMap(leafletMapRef.current)
        leafletMapRef.current = null
      }
    }
  }, [isMobile, mapType, imageUrl, minZoom, maxZoom, enableZoom, enablePan, onMapReady, onZoomChange])

  useEffect(() => {
    if (!mapRef.current || !leafletMapRef.current) return

    const resizeObserver = setupMapResizeObserver(
      mapRef.current,
      leafletMapRef.current
    )

    return () => {
      resizeObserver.disconnect()
    }
  }, [leafletMapRef.current])

  const defaultStyle = {
    height: 'calc(100vh - 160px)',
    width: 'min(100vw, calc(100vh - 160px))',
    aspectRatio: '1',
    touchAction: 'none',
    background: 'transparent'
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="overflow-hidden"
        style={{ ...defaultStyle, ...style }}
      />
      {children}
    </div>
  )
}