'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { Events, nightlordStatusCards } from '@/lib/constants/icons'
import { getAllSeeds } from '@/lib/data/seedSearch'
import { normalizeNightlordKey } from '@/lib/map/nightlordUtils'
import { getNightlordStatusCardCoordinate, toLeafletCoordinates } from '@/lib/constants/mapCoordinates'
import type { Seed } from '@/lib/types'

interface MapResultProps {
  seedNumber: string
}

export default function MapResult({ seedNumber }: MapResultProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [seedData, setSeedData] = useState<Seed | null>(null)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    const allSeeds = getAllSeeds()
    const seed = allSeeds.find(s => s.seed_id === seedNumber)
    setSeedData(seed ?? null)
  }, [seedNumber])

  const nightlordStatusKey = useMemo(() => {
    return normalizeNightlordKey(seedData?.nightlord)
  }, [seedData?.nightlord])

  useEffect(() => {
    if (!mapRef.current) return

    const containerSize = Math.min(mapRef.current.offsetWidth, mapRef.current.offsetHeight) || 1000
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

    let eventMarker: L.Marker | null = null
    if (seedData?.Event && Events[seedData.Event]) {
      const eventIconSize = Math.round(containerSize * 0.16)
      const halfIconSize = eventIconSize / 2

      const eventX = (900 / 1000) * containerSize
      const eventY = (100 / 1000) * containerSize

      const eventIcon = L.divIcon({
        html: `<img src=\"${Events[seedData.Event]}\" alt=\"${seedData.Event}\" style=\"width: ${eventIconSize}px; height: ${eventIconSize}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));\" />`,
        className: 'event-icon',
        iconSize: [eventIconSize, eventIconSize],
        iconAnchor: [halfIconSize, halfIconSize]
      })

      eventMarker = L.marker([eventY, eventX], { icon: eventIcon, interactive: false })
      eventMarker.addTo(map)
    }

    const createNightlordStatusIcon = (zoom: number): L.DivIcon | null => {
      const statusUrl = nightlordStatusKey ? nightlordStatusCards[nightlordStatusKey] : undefined
      if (!statusUrl) return null

      const baseIconSize = Math.max(24, containerSize * 0.04)
      const zoomScale = Math.max(1.0, 1.0 + (zoom * 0.5))
      const statusCardScale = 4.5

      const width = Math.round(baseIconSize * statusCardScale * zoomScale)
      const height = Math.round(width * 0.72)

      const offsetX = Math.round(width * 0.12)
      const offsetY = Math.round(height * 0.18)

      const iconAnchor: [number, number] = [Math.round(width / 2) - offsetX, Math.round(height / 2) + offsetY]

      return L.divIcon({
        html: `<img src="${statusUrl}" alt="${nightlordStatusKey}" style="width: ${width}px; height: ${height}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));" />`,
        className: 'nightlord-status-card',
        iconSize: [width, height],
        iconAnchor
      })
    }

    map.fitBounds(imageBounds)
    map.setMaxBounds(imageBounds)

    let nightlordStatusMarker: L.Marker | null = null
    const initialNightlordIcon = createNightlordStatusIcon(map.getZoom())
    if (initialNightlordIcon) {
      const baseCoordinate = getNightlordStatusCardCoordinate()
      const leafletCoords = toLeafletCoordinates(baseCoordinate, containerSize)

      nightlordStatusMarker = L.marker(leafletCoords, {
        icon: initialNightlordIcon,
        interactive: true,
        bubblingMouseEvents: false,
        zIndexOffset: 600,
      })
      nightlordStatusMarker.addTo(map)
    }

    let hideTimeoutId: number | null = null
    let isHidden = false

    const setHidden = (hidden: boolean) => {
      isHidden = hidden
      const element = nightlordStatusMarker?.getElement()
      if (!element) return

      if (hidden) {
        element.classList.add('nightlord-status-card-hidden')
      } else {
        element.classList.remove('nightlord-status-card-hidden')
      }
    }

    const startAutoHideTimer = () => {
      if (hideTimeoutId) {
        window.clearTimeout(hideTimeoutId)
      }

      hideTimeoutId = window.setTimeout(() => {
        setHidden(true)
      }, 2000)
    }

    const attachHoverHandlers = () => {
      const element = nightlordStatusMarker?.getElement()
      if (!element) return

      const handleMouseEnter = () => {
        if (hideTimeoutId) {
          window.clearTimeout(hideTimeoutId)
          hideTimeoutId = null
        }
        setHidden(false)
      }

      const handleMouseLeave = () => {
        setHidden(true)
      }

      element.onmouseenter = handleMouseEnter
      element.onmouseleave = handleMouseLeave

      setHidden(isHidden)
    }

    if (nightlordStatusMarker) {
      startAutoHideTimer()
      attachHoverHandlers()
    }

    map.on('zoom', () => {
      map.panInsideBounds(imageBounds, { animate: false })
      if (nightlordStatusMarker) {
        const updated = createNightlordStatusIcon(map.getZoom())
        if (updated) {
          nightlordStatusMarker.setIcon(updated)
          attachHoverHandlers()
        }
      }
    })

    map.on('drag', () => {
      map.panInsideBounds(imageBounds, { animate: false })
    })

    leafletMapRef.current = map

    return () => {
      if (eventMarker) {
        eventMarker.remove()
        eventMarker = null
      }
      if (hideTimeoutId) {
        window.clearTimeout(hideTimeoutId)
        hideTimeoutId = null
      }
      if (nightlordStatusMarker) {
        const element = nightlordStatusMarker.getElement()
        if (element) {
          element.onmouseenter = null
          element.onmouseleave = null
        }

        nightlordStatusMarker.remove()
        nightlordStatusMarker = null
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [isMobile, seedNumber, seedData, nightlordStatusKey])

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