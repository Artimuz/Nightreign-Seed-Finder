'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { Events } from '@/lib/constants/icons'
import { getAllSeeds } from '@/lib/data/seedSearch'

interface MapResultProps {
  seedNumber: string
}

export default function MapResult({seedNumber }: MapResultProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [seedData, setSeedData] = useState<{
    seed_id: string
    map_type: string
    Event?: string
    nightlord?: string
    slots: Record<string, string>
  } | null>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const loadSeedData = () => {
      const allSeeds = getAllSeeds()
      const seed = allSeeds.find(s => s.seed_id === seedNumber)
      setSeedData(seed || null)
    }

    loadSeedData()
  }, [seedNumber])

  useEffect(() => {
    if (!mapRef.current) return

    const containerSize = mapRef.current ? Math.min(mapRef.current.offsetWidth, mapRef.current.offsetHeight) : 1000
    const imageBounds: L.LatLngBoundsExpression = [[0, 0], [containerSize, containerSize]]
    
    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
    }

    const zoomConfig = isMobile 
      ? { minZoom: 0, maxZoom: 3 }
      : { minZoom: 0, maxZoom: 2 }

    const map = L.map(mapRef.current, {
      crs: L.CRS.Simple,
      ...zoomConfig,
      zoomControl: false,
      attributionControl: false,
      zoomSnap: 0.10,
      zoomDelta: 0.10,
    })

    const seedImageUrl = `https://thefifthmatt.github.io/nightreign/pattern/${seedNumber}.jpg`
    const seedOverlay = L.imageOverlay(seedImageUrl, imageBounds)
    seedOverlay.addTo(map)

    if (seedData && seedData.Event && Events[seedData.Event]) {
      const eventIconSize = Math.round(containerSize * 0.16)
      const halfIconSize = eventIconSize / 2

      const eventX = (900 / 1000) * containerSize
      const eventY = (100 / 1000) * containerSize
      
      const eventIcon = L.divIcon({
        html: `<img src="${Events[seedData.Event]}" alt="${seedData.Event}" style="width: ${eventIconSize}px; height: ${eventIconSize}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));" />`,
        className: 'event-icon',
        iconSize: [eventIconSize, eventIconSize],
        iconAnchor: [halfIconSize, halfIconSize]
      })
      
      const eventMarker = L.marker([eventY, eventX], { icon: eventIcon })
      eventMarker.addTo(map)
    }

    map.fitBounds(imageBounds)

    map.setMaxBounds(imageBounds)

    map.on('zoom', () => {
      map.panInsideBounds(imageBounds, { animate: false })
    })
    
    map.on('drag', () => {
      map.panInsideBounds(imageBounds, { animate: false })
    })

    leafletMapRef.current = map

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isMobile, seedNumber, seedData])

  useEffect(() => {
    if (!mapRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      if (leafletMapRef.current) {

        setTimeout(() => {
          leafletMapRef.current?.invalidateSize()
        }, 100)
      }
    })

    resizeObserver.observe(mapRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="overflow-hidden"
        style={{ 
          height: 'calc(100vh - 160px)',
          width: 'min(100vw, calc(100vh - 160px))',
          aspectRatio: '1',
          touchAction: 'none',
          background: 'transparent'
        }}
      />
      
      {}
      <div 
        className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none z-[1000]"
        style={{ fontSize: isMobile ? '12px' : '14px' }}
      >
        Map Pattern {seedNumber} - Source: thefifthmatt
      </div>
    </div>
  )
}