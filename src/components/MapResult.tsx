'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import CrystalFinderHelpModal from '@/components/CrystalFinderHelpModal'
import L from 'leaflet'
import { Events, buildingIcons, nightlordIcons, nightlordStatusCards } from '@/lib/constants/icons'
import { getAllSeeds } from '@/lib/data/seedSearch'
import { normalizeNightlordKey } from '@/lib/map/nightlordUtils'
import { getCrystalSlotCoordinates, getEventCoordinateForSource, getNightlordCoordinate, getNightlordStatusCardCoordinate, toLeafletCoordinates } from '@/lib/constants/mapCoordinates'
import { getSeedImageProvider } from '@/lib/map/seedImageProvider'
import type { Seed } from '@/lib/types'
import crystalData from '../../public/data/crystal_data.json'
import { trackAnalyticsEvent } from '@/lib/analytics/events'

interface MapResultProps {
  seedNumber: string
}

type CrystalSlotState = 'unknown' | 'confirmed' | 'cleared'

const normalizeMapTypeKey = (value?: string | null): string => {
  return (value ?? '').toLowerCase().replace(/\s+/g, '').replace(',', '')
}

export default function MapResult({ seedNumber }: MapResultProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const undergroundControlButtonRef = useRef<HTMLButtonElement | null>(null)
  const crystalFinderControlButtonRef = useRef<HTMLButtonElement | null>(null)
  const crystalFinderHelpButtonRef = useRef<HTMLButtonElement | null>(null)
  const crystalFinderResetButtonRef = useRef<HTMLButtonElement | null>(null)
  const undergroundOverlayRef = useRef<L.ImageOverlay | null>(null)
  const undergroundShadeRef = useRef<L.Rectangle | null>(null)
  const crystalMarkersRef = useRef<Map<string, L.Marker>>(new Map())

  const [isMobile, setIsMobile] = useState(false)
  const [seedData, setSeedData] = useState<Seed | null>(null)
  const [isUndergroundEnabled, setIsUndergroundEnabled] = useState(false)
  const [isCrystalFinderEnabled, setIsCrystalFinderEnabled] = useState(false)
  const [isCrystalFinderHelpOpen, setIsCrystalFinderHelpOpen] = useState(false)
  const [crystalSlotStates, setCrystalSlotStates] = useState<Map<string, CrystalSlotState>>(() => new Map())
  const mapContainerSizeRef = useRef<number>(1000)

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

  const isGreatHollowSeed = useMemo(() => {
    return normalizeMapTypeKey(seedData?.map_type) === 'greathollow'
  }, [seedData?.map_type])

  useEffect(() => {
    if (!isGreatHollowSeed) {
      setIsUndergroundEnabled(false)
      setIsCrystalFinderEnabled(false)
      setIsCrystalFinderHelpOpen(false)
      setCrystalSlotStates(new Map())
    }
  }, [isGreatHollowSeed])

  const nightlordStatusKey = useMemo(() => {
    return normalizeNightlordKey(seedData?.nightlord)
  }, [seedData?.nightlord])

  const seedImageProvider = useMemo(() => {
    return getSeedImageProvider(seedNumber)
  }, [seedNumber])

  const isDlcSeedImage = useMemo(() => {
    return seedImageProvider.sourceLabel === 'kevins78'
  }, [seedImageProvider.sourceLabel])

  const crystalLayouts = useMemo(() => {
    const layouts = crystalData as unknown as Array<{ id: string; slots: Record<string, string> }>
    return layouts.map((layout) => ({ id: layout.id, slots: new Map(Object.entries(layout.slots)) }))
  }, [])

  const remainingCrystalLayouts = useMemo(() => {
    const confirmedSlotIds = Array.from(crystalSlotStates.entries())
      .filter(([, state]) => state === 'confirmed')
      .map(([slotId]) => slotId)

    const clearedSlotIds = Array.from(crystalSlotStates.entries())
      .filter(([, state]) => state === 'cleared')
      .map(([slotId]) => slotId)

    if (confirmedSlotIds.length === 0 && clearedSlotIds.length === 0) return crystalLayouts

    return crystalLayouts.filter((layout) => {
      const matchesConfirmed = confirmedSlotIds.every((slotId) => {
        const expectedValue = layout.slots.get(slotId) ?? ''
        return expectedValue === 'Crystal' || expectedValue === 'CrystalUnder'
      })

      if (!matchesConfirmed) return false

      return clearedSlotIds.every((slotId) => {
        const expectedValue = layout.slots.get(slotId) ?? ''
        return expectedValue !== 'Crystal' && expectedValue !== 'CrystalUnder'
      })
    })
  }, [crystalLayouts, crystalSlotStates])

  const resolvedCrystalLayout = useMemo(() => {
    if (remainingCrystalLayouts.length !== 1) return null
    return remainingCrystalLayouts[0] ?? null
  }, [remainingCrystalLayouts])

  useEffect(() => {
    if (!isGreatHollowSeed) return

    const img = new Image()
    img.src = seedImageProvider.undergroundImageUrl
  }, [isGreatHollowSeed, seedImageProvider.undergroundImageUrl])

  useEffect(() => {
    if (!mapRef.current) return

    const containerSize = Math.min(mapRef.current.offsetWidth, mapRef.current.offsetHeight) || 1000
    mapContainerSizeRef.current = containerSize
    const imageBounds: L.LatLngBoundsExpression = [[0, 0], [containerSize, containerSize]]

    if (leafletMapRef.current) {
      leafletMapRef.current.remove()
      leafletMapRef.current = null
    }

    undergroundControlButtonRef.current = null
    crystalFinderControlButtonRef.current = null
    crystalFinderHelpButtonRef.current = null
    crystalFinderResetButtonRef.current = null
    undergroundOverlayRef.current = null
    undergroundShadeRef.current = null

    crystalMarkersRef.current.forEach((marker) => marker.remove())
    crystalMarkersRef.current = new Map()

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

    if (!isGreatHollowSeed) {
      const surfaceOverlay = L.imageOverlay(seedImageProvider.surfaceImageUrl, imageBounds)
      surfaceOverlay.addTo(map)
    }

    if (isGreatHollowSeed) {
      map.createPane('greatHollowSurfacePane')
      map.createPane('greatHollowShadePane')
      map.createPane('greatHollowUndergroundPane')
      map.createPane('greatHollowCrystalPane')

      const surfacePane = map.getPane('greatHollowSurfacePane')
      const shadePane = map.getPane('greatHollowShadePane')
      const undergroundPane = map.getPane('greatHollowUndergroundPane')
      const crystalPane = map.getPane('greatHollowCrystalPane')

      if (surfacePane) surfacePane.style.zIndex = '200'
      if (shadePane) shadePane.style.zIndex = '250'
      if (undergroundPane) undergroundPane.style.zIndex = '300'
      if (crystalPane) crystalPane.style.zIndex = '400'

      const surfaceOverlay = L.imageOverlay(seedImageProvider.surfaceImageUrl, imageBounds, { pane: 'greatHollowSurfacePane' })
      surfaceOverlay.addTo(map)

      const shadeOverlay = L.rectangle(imageBounds, {
        interactive: false,
        stroke: false,
        fill: true,
        fillColor: '#000',
        fillOpacity: 0.8,
        pane: 'greatHollowShadePane'
      })

      const undergroundOverlay = L.imageOverlay(seedImageProvider.undergroundImageUrl, imageBounds, { pane: 'greatHollowUndergroundPane' })

      undergroundShadeRef.current = shadeOverlay
      undergroundOverlayRef.current = undergroundOverlay

      const control = new L.Control({ position: 'topright' })

      control.onAdd = () => {
        const container = L.DomUtil.create('div', 'leaflet-great-hollow-toggle')
        const button = L.DomUtil.create('button', 'leaflet-great-hollow-toggle__button', container)
        button.type = 'button'
        button.onclick = () => {
          setIsUndergroundEnabled(previous => !previous)
        }

        const crystalGroup = L.DomUtil.create('div', 'leaflet-great-hollow-toggle__group', container)

        const crystalButton = L.DomUtil.create('button', 'leaflet-great-hollow-toggle__button', crystalGroup)
        crystalButton.type = 'button'
        crystalButton.onclick = () => {
          setIsCrystalFinderEnabled(previous => !previous)
        }

        const crystalChildren = L.DomUtil.create('div', 'leaflet-great-hollow-toggle__children', crystalGroup)

        const helpButton = L.DomUtil.create('button', 'leaflet-great-hollow-toggle__child-button', crystalChildren)
        helpButton.type = 'button'
        helpButton.textContent = 'Help'
        helpButton.onclick = () => {
          setIsCrystalFinderHelpOpen(true)
        }

        const resetButton = L.DomUtil.create('button', 'leaflet-great-hollow-toggle__child-button', crystalChildren)
        resetButton.type = 'button'
        resetButton.textContent = 'Reset'
        resetButton.onclick = () => {
          setCrystalSlotStates(new Map())
          setIsCrystalFinderHelpOpen(false)
        }

        L.DomEvent.disableClickPropagation(container)
        L.DomEvent.disableScrollPropagation(container)

        undergroundControlButtonRef.current = button
        crystalFinderControlButtonRef.current = crystalButton
        crystalFinderHelpButtonRef.current = helpButton
        crystalFinderResetButtonRef.current = resetButton

        return container
      }

      control.addTo(map)
    }

    map.fitBounds(imageBounds)
    map.setMaxBounds(imageBounds)

    const baseZoom = map.getZoom()

    const getZoomScale = () => map.getZoomScale(map.getZoom(), baseZoom)

    const createEventIcon = (): L.DivIcon | null => {
      if (!seedData?.Event) return null
      const eventUrl = Events[seedData.Event]
      if (!eventUrl) return null

      const zoomScale = getZoomScale()
      const eventIconSize = Math.round(containerSize * 0.128 * zoomScale)
      const halfIconSize = eventIconSize / 2

      return L.divIcon({
        html: `<img src=\"${eventUrl}\" alt=\"${seedData.Event}\" style=\"width: ${eventIconSize}px; height: ${eventIconSize}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));\" />`,
        className: 'event-icon',
        iconSize: [eventIconSize, eventIconSize],
        iconAnchor: [halfIconSize, halfIconSize]
      })
    }

    let eventMarker: L.Marker | null = null
    const initialEventIcon = createEventIcon()
    if (initialEventIcon) {
      const eventCoordinate = getEventCoordinateForSource(seedImageProvider.sourceLabel)
      const leafletCoords = toLeafletCoordinates(eventCoordinate, containerSize)
      eventMarker = L.marker(leafletCoords, { icon: initialEventIcon, interactive: false })
      eventMarker.addTo(map)
    }

    const getLookupValue = (lookup: Record<string, string>, key: string | null | undefined): string | undefined => {
      if (!key) return undefined
      if (!(key in lookup)) return undefined
      return lookup[key as keyof typeof lookup]
    }

    const createNightlordStatusIcon = (): L.DivIcon | null => {
      const statusUrl = getLookupValue(nightlordStatusCards, nightlordStatusKey)
      if (!statusUrl) return null

      const baseIconSize = Math.max(24, containerSize * 0.04)
      const statusCardScale = 4.5

      const zoomScale = getZoomScale()
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

    const createNightlordIcon = (): L.DivIcon | null => {
      const nightlordIconUrl = getLookupValue(nightlordIcons, nightlordStatusKey)
      if (!nightlordIconUrl) return null

      const baseIconSize = Math.max(24, containerSize * 0.04)
      const sizeMultiplier = 2.2

      const zoomScale = getZoomScale()
      const size = Math.round(baseIconSize * sizeMultiplier * zoomScale)
      const half = Math.round(size / 2)

      return L.divIcon({
        html: `<img src="${nightlordIconUrl}" alt="${nightlordStatusKey}" style="width: ${size}px; height: ${size}px; object-fit: contain; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));" />`,
        className: 'nightlord-icon',
        iconSize: [size, size],
        iconAnchor: [half, half]
      })
    }

    let nightlordMarker: L.Marker | null = null
    if (isDlcSeedImage) {
      const initialNightlordIcon = createNightlordIcon()
      if (initialNightlordIcon) {
        const baseCoordinate = getNightlordCoordinate()
        const leafletCoords = toLeafletCoordinates(baseCoordinate, containerSize)

        nightlordMarker = L.marker(leafletCoords, {
          icon: initialNightlordIcon,
          interactive: false,
          bubblingMouseEvents: false,
          zIndexOffset: 500,
        })

        nightlordMarker.addTo(map)
      }
    }

    let nightlordStatusMarker: L.Marker | null = null
    const initialNightlordStatusIcon = createNightlordStatusIcon()
    if (initialNightlordStatusIcon) {
      const baseCoordinate = getNightlordStatusCardCoordinate()
      const leafletCoords = toLeafletCoordinates(baseCoordinate, containerSize)

      nightlordStatusMarker = L.marker(leafletCoords, {
        icon: initialNightlordStatusIcon,
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
      if (nightlordMarker) {
        const updated = createNightlordIcon()
        if (updated) {
          nightlordMarker.setIcon(updated)
        }
      }
      if (nightlordStatusMarker) {
        const updated = createNightlordStatusIcon()
        if (updated) {
          nightlordStatusMarker.setIcon(updated)
          attachHoverHandlers()
        }
      }
      if (eventMarker) {
        const updated = createEventIcon()
        if (updated) {
          eventMarker.setIcon(updated)
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
      if (nightlordMarker) {
        nightlordMarker.remove()
        nightlordMarker = null
      }
      crystalMarkersRef.current.forEach((marker) => marker.remove())
      crystalMarkersRef.current = new Map()

      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [
    isMobile,
    seedNumber,
    seedData,
    nightlordStatusKey,
    seedImageProvider.surfaceImageUrl,
    seedImageProvider.undergroundImageUrl,
    seedImageProvider.sourceLabel,
    isDlcSeedImage,
    isGreatHollowSeed
  ])

  useEffect(() => {
    if (!isCrystalFinderEnabled) {
      setIsCrystalFinderHelpOpen(false)
    }

    const map = leafletMapRef.current
    if (!map) return

    const undergroundOverlay = undergroundOverlayRef.current
    const shadeOverlay = undergroundShadeRef.current

    if (!isGreatHollowSeed || !undergroundOverlay || !shadeOverlay) return

    const container = map.getContainer()

    const suppressContextMenu = (event: Event) => {
      if (!isCrystalFinderEnabled) return
      event.preventDefault()
    }

    container.addEventListener('contextmenu', suppressContextMenu)

    const button = undergroundControlButtonRef.current
    if (button) {
      button.textContent = isUndergroundEnabled ? 'Underground: ON' : 'Underground: OFF'
      if (isUndergroundEnabled) {
        button.classList.add('leaflet-great-hollow-toggle__button--active')
      } else {
        button.classList.remove('leaflet-great-hollow-toggle__button--active')
      }
    }

    const crystalButton = crystalFinderControlButtonRef.current
    if (crystalButton) {
      crystalButton.textContent = isCrystalFinderEnabled ? 'Crystal Finder: ON' : 'Crystal Finder: OFF'
      if (isCrystalFinderEnabled) {
        crystalButton.classList.add('leaflet-great-hollow-toggle__button--active')
      } else {
        crystalButton.classList.remove('leaflet-great-hollow-toggle__button--active')
      }
    }

    const helpButton = crystalFinderHelpButtonRef.current
    const resetButton = crystalFinderResetButtonRef.current
    if (helpButton && resetButton) {
      const displayValue = isCrystalFinderEnabled ? 'flex' : 'none'
      helpButton.style.display = displayValue
      resetButton.style.display = displayValue
    }

    if (isUndergroundEnabled) {
      if (!map.hasLayer(shadeOverlay)) {
        shadeOverlay.addTo(map)
      }
      if (!map.hasLayer(undergroundOverlay)) {
        undergroundOverlay.addTo(map)
      }
    } else {
      if (map.hasLayer(undergroundOverlay)) {
        undergroundOverlay.removeFrom(map)
      }
      if (map.hasLayer(shadeOverlay)) {
        shadeOverlay.removeFrom(map)
      }
    }

    return () => {
      container.removeEventListener('contextmenu', suppressContextMenu)
    }
  }, [isCrystalFinderEnabled, isGreatHollowSeed, isUndergroundEnabled])

  const setCrystalSlotState = (slotId: string, state: CrystalSlotState) => {
    setCrystalSlotStates((previous) => {
      const current = previous.get(slotId) ?? 'unknown'
      if (current === state) return previous
      const nextStates = new Map(previous)
      nextStates.set(slotId, state)
      return nextStates
    })
  }

  useEffect(() => {
    if (!isCrystalFinderEnabled) return
    if (!resolvedCrystalLayout) return

    setIsCrystalFinderHelpOpen(false)
  }, [isCrystalFinderEnabled, resolvedCrystalLayout])

  useEffect(() => {
    const map = leafletMapRef.current
    if (!map || !isGreatHollowSeed) return

    const coordinates = getCrystalSlotCoordinates(seedData?.map_type)
    const containerSize = mapContainerSizeRef.current

    const shouldBeVisible = isCrystalFinderEnabled

    const visibleCoordinates = coordinates

    const shouldRemoveMarker = (slotId: string): boolean => {
      const marker = crystalMarkersRef.current.get(slotId)
      if (!marker) return true
      if (!shouldBeVisible) return true
      return !visibleCoordinates.some((coord) => coord.id === slotId)
    }

    Array.from(crystalMarkersRef.current.keys()).forEach((slotId) => {
      if (shouldRemoveMarker(slotId)) {
        crystalMarkersRef.current.get(slotId)?.remove()
        crystalMarkersRef.current.delete(slotId)
      }
    })

    if (!shouldBeVisible) return

    const iconSize = Math.round(containerSize * 0.05 * 1.4)
    const iconHalf = Math.round(iconSize / 2)

    const getCrystalKindForSlot = (layouts: Array<{ id: string; slots: Map<string, string> }>, slotId: string): { anySurface: boolean; anyUnderground: boolean; allSurface: boolean; allUnderground: boolean; anyCrystal: boolean; allCrystal: boolean } => {
      if (layouts.length === 0) {
        return { anySurface: false, anyUnderground: false, allSurface: false, allUnderground: false, anyCrystal: false, allCrystal: false }
      }

      let anySurface = false
      let anyUnderground = false
      let allSurface = true
      let allUnderground = true
      let anyCrystal = false
      let allCrystal = true

      layouts.forEach((layout) => {
        const value = layout.slots.get(slotId) ?? ''
        const isSurface = value === 'Crystal'
        const isUnderground = value === 'CrystalUnder'
        const isCrystal = isSurface || isUnderground

        anySurface = anySurface || isSurface
        anyUnderground = anyUnderground || isUnderground
        anyCrystal = anyCrystal || isCrystal

        allSurface = allSurface && isSurface
        allUnderground = allUnderground && isUnderground
        allCrystal = allCrystal && isCrystal
      })

      return { anySurface, anyUnderground, allSurface, allUnderground, anyCrystal, allCrystal }
    }

    const getIconForSlot = (slotId: string): string | null => {
      const state = crystalSlotStates.get(slotId) ?? 'unknown'

      if (resolvedCrystalLayout) {
        const expectedValue = resolvedCrystalLayout.slots.get(slotId) ?? ''

        if (expectedValue === 'Crystal') {
          if (state === 'confirmed') return buildingIcons.brokenCrystal
          return buildingIcons.Crystal
        }

        if (expectedValue === 'CrystalUnder') {
          if (state === 'confirmed') return buildingIcons.brokenCrystalUnder
          return buildingIcons.CrystalUnder
        }

        return null
      }

      if (state === 'cleared') {
        const kind = getCrystalKindForSlot(crystalLayouts, slotId)
        const isUndergroundOnly = kind.anyUnderground && !kind.anySurface
        if (isUndergroundOnly) return buildingIcons.possibleCrystalUnder
        return buildingIcons.possibleCrystal
      }

      const kind = getCrystalKindForSlot(remainingCrystalLayouts, slotId)
      const isUndergroundOnly = kind.anyUnderground && !kind.anySurface

      if (state === 'confirmed') {
        if (isUndergroundOnly) return buildingIcons.brokenCrystalUnder
        return buildingIcons.brokenCrystal
      }

      if (kind.allCrystal) {
        if (kind.allUnderground || isUndergroundOnly) return buildingIcons.CrystalUnder
        return buildingIcons.Crystal
      }

      if (!kind.anyCrystal) {
        return null
      }

      if (isUndergroundOnly) return buildingIcons.possibleCrystalUnder
      return buildingIcons.possibleCrystal
    }

    const createCrystalIcon = (slotId: string): L.DivIcon | null => {
      const iconUrl = getIconForSlot(slotId)
      if (!iconUrl) return null

      const state = crystalSlotStates.get(slotId) ?? 'unknown'

      const overlay = state === 'cleared' && !resolvedCrystalLayout
        ? `<div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #ff3b3b; font-size: ${Math.round(iconSize * 0.85)}px; line-height: 1; text-shadow: 1px 0 0 #000, -1px 0 0 #000, 0 1px 0 #000, 0 -1px 0 #000;">×</div>`
        : ''

      return L.divIcon({
        html: `<div style="position: relative; width: ${iconSize}px; height: ${iconSize}px;"><img src="${iconUrl}" alt="crystal" style="width: ${iconSize}px; height: ${iconSize}px; object-fit: contain; filter: drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff) drop-shadow(2px 2px 4px rgba(0,0,0,0.5));" />${overlay}</div>`,
        className: 'crystal-icon',
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconHalf, iconHalf],
      })
    }

    visibleCoordinates.forEach((coord) => {
      const existing = crystalMarkersRef.current.get(coord.id)
      const icon = createCrystalIcon(coord.id)
      if (!icon) {
        if (existing) {
          existing.remove()
          crystalMarkersRef.current.delete(coord.id)
        }
        return
      }

      const position = toLeafletCoordinates(coord, containerSize)

      if (existing) {
        existing.setLatLng(position)
        existing.setIcon(icon)
        return
      }

      const marker = L.marker(position, {
        icon,
        interactive: true,
        bubblingMouseEvents: false,
        pane: 'greatHollowCrystalPane',
        zIndexOffset: 800,
      })

      marker.on('click', () => {
        if (isGreatHollowSeed && isCrystalFinderEnabled) {
          trackAnalyticsEvent('crystal_shattered', { seed_id: seedNumber, map_type: seedData?.map_type ?? null, slot_id: coord.id })
        }
        setCrystalSlotState(coord.id, 'confirmed')
      })

      marker.on('contextmenu', (event: L.LeafletMouseEvent) => {
        const originalEvent = event.originalEvent
        if (originalEvent instanceof MouseEvent) {
          originalEvent.preventDefault()
          originalEvent.stopPropagation()
        }

        if (resolvedCrystalLayout) return

        const currentState = crystalSlotStates.get(coord.id) ?? 'unknown'
        if (currentState !== 'unknown') return

        const iconUrl = getIconForSlot(coord.id)
        const isPossible = iconUrl === buildingIcons.possibleCrystal || iconUrl === buildingIcons.possibleCrystalUnder
        if (!isPossible) return

        setCrystalSlotState(coord.id, 'cleared')
      })

      marker.addTo(map)
      crystalMarkersRef.current.set(coord.id, marker)
    })
  }, [isCrystalFinderEnabled, isGreatHollowSeed, crystalLayouts, remainingCrystalLayouts, resolvedCrystalLayout, seedData?.map_type, crystalSlotStates])

  useEffect(() => {
    if (!mapRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      if (!mapRef.current) return
      mapContainerSizeRef.current = Math.min(mapRef.current.offsetWidth, mapRef.current.offsetHeight) || 1000

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
      <div
        className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none z-[1000] mapresult-seed-label"
        style={{ fontSize: isMobile ? '12px' : '14px' }}
      >
        Map Pattern {seedNumber} - Source: {seedImageProvider.sourceLabel}
      </div>
      <CrystalFinderHelpModal
        isOpen={isGreatHollowSeed && isCrystalFinderEnabled && isCrystalFinderHelpOpen}
        onClose={() => setIsCrystalFinderHelpOpen(false)}
      />
    </div>
  )
}
