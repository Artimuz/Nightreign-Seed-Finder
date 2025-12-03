'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import L from 'leaflet'
import SlotSelectionModal from './SlotSelectionModal'
import { getRemainingSeeds, getAvailableBuildingsForSlot, getAvailableNightlords, getAvailableNightlordsForGhost, getAllSeeds } from '@/lib/data/seedSearch'
import { useRateLimit } from '@/hooks/useRateLimit'
import { useSpawnAnalysis } from '@/hooks/useSpawnAnalysis'

interface MapBuilderProps {
  mapType?: 'normal' | 'crater' | 'mountaintop' | 'noklateo' | 'rotted' | 'forsaken'
}

const MAP_IMAGES = {
  'normal': '/Images/mapTypes/Normal.webp',
  'crater': '/Images/mapTypes/Crater.webp',
  'mountaintop': '/Images/mapTypes/Mountaintop.webp',
  'noklateo': '/Images/mapTypes/Noklateo, the Shrouded City.webp',
  'rotted': '/Images/mapTypes/Rotted Woods.webp',
  'forsaken': '/Images/mapTypes/Forsaken.webp'
}

export default function MapBuilder({ mapType = 'normal' }: MapBuilderProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const leafletMapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())
  const iconConfigRef = useRef<{ size: [number, number], anchor: [number, number], popupAnchor: [number, number] } | null>(null)
  const spawnMarkerRef = useRef<L.Marker | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedBuildings, setSelectedBuildings] = useState<Record<string, string>>({})
  const [selectedNightlord, setSelectedNightlord] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string>('')
  const [currentZoom, setCurrentZoom] = useState<number>(0)
  const [pathTaken, setPathTaken] = useState<Record<string, string>>({})
  const [remainingSeedsCount, setRemainingSeedsCount] = useState<number>(0)
  const [pendingLogSeed, setPendingLogSeed] = useState<string | null>(null)
  const router = useRouter()
  
  const { canMakeRequest, recordRequest, getRemainingTime } = useRateLimit(30000)

  const { isPossibleSpawn, spawnAnalysis, selectedSpawnSlot, toggleSpawnSlot } = useSpawnAnalysis({
    mapType,
    slots: selectedBuildings,
    nightlord: (!selectedNightlord || selectedNightlord === 'empty' || selectedNightlord === '') ? null : selectedNightlord
  })

  useEffect(() => {
    if (!mapRef.current) return

    const observer = new MutationObserver(() => {
      const emptyIcons = mapRef.current?.querySelectorAll('img[src*="empty.webp"]')
      if (emptyIcons && emptyIcons.length > 0) {
        emptyIcons.forEach((img) => {
          if (img instanceof HTMLImageElement) {
            const markerElement = img.closest('[data-slot-id]')
            if (markerElement) {
              const slotId = markerElement.getAttribute('data-slot-id')
              if (slotId && slotId !== 'nightlord') {
                const shouldHaveBlueHue = selectedSpawnSlot === null && spawnAnalysis.possibleSpawnSlots.includes(slotId)
                
                if (shouldHaveBlueHue) {
                  img.style.filter = 'hue-rotate(115deg) saturate(1.5) brightness(1)'
                } else {
                  img.style.filter = ''
                }
              }
            }
          }
        })
      }
    })

    observer.observe(mapRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src']
    })

    return () => observer.disconnect()
  }, [spawnAnalysis.possibleSpawnSlots, selectedSpawnSlot])

  const applyBlueHueIfNeeded = (imgElement: HTMLImageElement, slotId: string) => {
    if (slotId === 'nightlord') return
    
    const currentBuilding = selectedBuildings[slotId] || ''
    const isEmpty = !currentBuilding || currentBuilding === '' || currentBuilding === 'empty'
    const isSpawnAvailable = spawnAnalysis.possibleSpawnSlots.includes(slotId)
    const noSpawnSelected = !selectedSpawnSlot
    
    if (isEmpty && isSpawnAvailable && noSpawnSelected && imgElement.src.includes('empty.webp')) {
      imgElement.style.filter = 'hue-rotate(200deg) saturate(1.5) brightness(1.1)'
    } else {
      imgElement.style.filter = ''
    }
  }

  const updateRemainingSeedsCount = () => {
    const cleanedSlots: Record<string, string> = {}
    Object.keys(selectedBuildings).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(selectedBuildings, key)) return;
      const building = selectedBuildings[key]
      if (building && building !== 'empty' && building.trim() !== '') {
        if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
          cleanedSlots[key] = building
        }
      }
    })
    
    const cleanedNightlord = (!selectedNightlord || selectedNightlord === 'empty') ? null : selectedNightlord
    const remainingSeeds = getRemainingSeeds(mapType, cleanedSlots, cleanedNightlord, selectedSpawnSlot)
    setRemainingSeedsCount(remainingSeeds.length)
  }

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    const handleResize = () => {
      checkIfMobile()
      
      // Never destroy the map, just invalidate size for all resize events
      if (leafletMapRef.current) {
        setTimeout(() => {
          leafletMapRef.current?.invalidateSize({ animate: false })
        }, 50)
      }
    }

    checkIfMobile()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    updateRemainingSeedsCount()
  }, [])

  useEffect(() => {
    updateRemainingSeedsCount()
  }, [selectedBuildings, selectedNightlord, mapType, selectedSpawnSlot])

  useEffect(() => {
    if (pendingLogSeed) {

      const executeLogging = async () => {

        router.push(`/result/${pendingLogSeed}`);
        
        const canMake = canMakeRequest();
        if (!canMake) {
          return;
        }

        try {
          recordRequest();
          
          const allSeeds = getAllSeeds();
          const foundSeed = allSeeds.find(seed => seed.seed_id === pendingLogSeed);
          const nightlordFromData = foundSeed ? extractNightlordName(foundSeed.nightlord || '') : '';
          
          const logData = {
            seed_id: pendingLogSeed,
            timezone: getUserTimezone(),
            path_taken: pathTaken,
            additional_info: mapType,
            session_duration: getSessionDuration(),
            Nightlord: nightlordFromData
          };

          fetch('/api/log', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(logData),
          }).catch(() => {});
        } catch {}
      };
      
      executeLogging();
      setPendingLogSeed(null);
    }
  }, [pathTaken, selectedBuildings, selectedNightlord, pendingLogSeed, canMakeRequest, getRemainingTime, recordRequest, router, mapType, selectedSpawnSlot])

  useEffect(() => {
    const sessionStartKey = 'seedfinder_session_start';
    if (!localStorage.getItem(sessionStartKey)) {
      localStorage.setItem(sessionStartKey, Date.now().toString());
    }
  }, [])

  const getSessionDuration = (): number => {
    const sessionStartKey = 'seedfinder_session_start';
    const startTime = localStorage.getItem(sessionStartKey);
    if (startTime) {
      const duration = Math.floor((Date.now() - parseInt(startTime)) / 1000);
      localStorage.removeItem(sessionStartKey);
      return Math.min(duration, 86400);
    }
    return 0;
  }

  const extractNightlordName = (seedId: string): string => {

    const parts = seedId.split('_');
    return parts.length > 1 ? parts[1] : '';
  }

  const getUserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  }

  const getAvailableOptions = (slotId: string, showSeedCount: boolean = false) => {

    const currentSlots = { ...selectedBuildings }

    const currentNightlord = (!selectedNightlord || selectedNightlord === '' || selectedNightlord === 'empty') ? null : selectedNightlord

    return getAvailableOptionsWithState(slotId, currentSlots, currentNightlord, showSeedCount)
  }

  const getAvailableOptionsWithState = (slotId: string, buildings: Record<string, string>, nightlord: string | null, showSeedCount: boolean = false) => {

    const currentNightlord = (!nightlord || nightlord === '' || nightlord === 'empty') ? null : nightlord

    const cleanedSlots: Record<string, string> = {}
    Object.keys(buildings).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(buildings, key)) return;
      const building = buildings[key]
      if (building && building !== 'empty' && building.trim() !== '') {
        if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
          cleanedSlots[key] = building
        }
      }

    })

    if (slotId === 'nightlord') {


      const availableNightlords = getAvailableNightlords(mapType, cleanedSlots, selectedSpawnSlot)

      if (nightlord && nightlord !== '' && nightlord !== 'empty') {
        availableNightlords.push('empty')
      }
      
      return availableNightlords
    }

    const slotsWithoutTarget = { ...cleanedSlots }
    if (Object.prototype.hasOwnProperty.call(slotsWithoutTarget, slotId)) {
      delete slotsWithoutTarget[slotId]
    }


    return getAvailableBuildingsForSlot(mapType, slotsWithoutTarget, currentNightlord, slotId, selectedSpawnSlot)
  }

  // CLICK HANDLER: Function that includes spawn filtering for click logic
  const getAvailableOptionsWithStateAndSpawn = (slotId: string, buildings: Record<string, string>, nightlord: string | null, spawnSlot: string | null) => {

    const currentNightlord = (!nightlord || nightlord === '' || nightlord === 'empty') ? null : nightlord

    const cleanedSlots: Record<string, string> = {}
    Object.keys(buildings).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(buildings, key)) return;
      const building = buildings[key]
      if (building && building !== 'empty' && building.trim() !== '') {
        if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
          cleanedSlots[key] = building
        }
      }

    })

    if (slotId === 'nightlord') {


      const availableNightlords = getAvailableNightlords(mapType, cleanedSlots, spawnSlot)

      if (nightlord && nightlord !== '' && nightlord !== 'empty') {
        availableNightlords.push('empty')
      }
      
      return availableNightlords
    }

    const slotsWithoutTarget = { ...cleanedSlots }
    if (Object.prototype.hasOwnProperty.call(slotsWithoutTarget, slotId)) {
      delete slotsWithoutTarget[slotId]
    }


    const result = getAvailableBuildingsForSlot(mapType, slotsWithoutTarget, currentNightlord, slotId, spawnSlot)
    
    
    return result
  }

  // GHOST LOGIC: Separate function that excludes spawn filtering for ghost detection
  const getAvailableOptionsForGhost = (slotId: string, currentBuildings: Record<string, string>, currentNightlord: string): string[] => {
    const cleanedSlots: Record<string, string> = {}
    Object.keys(currentBuildings).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(currentBuildings, key)) return;
      const building = currentBuildings[key]
      if (building && building !== 'empty' && building.trim() !== '') {
        if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
          cleanedSlots[key] = building
        }
      }
    })

    const nightlord = (!currentNightlord || currentNightlord === 'empty') ? null : currentNightlord

    if (slotId === 'nightlord') {
      const availableNightlords = getAvailableNightlordsForGhost(mapType, cleanedSlots)

      if (currentNightlord && currentNightlord !== '' && currentNightlord !== 'empty') {
        availableNightlords.push('empty')
      }
      
      return availableNightlords
    }

    const slotsWithoutTarget = { ...cleanedSlots }
    if (Object.prototype.hasOwnProperty.call(slotsWithoutTarget, slotId)) {
      delete slotsWithoutTarget[slotId]
    }

    // IMPORTANT: Ghost logic should still consider spawn constraints for building filtering
    // but NOT for final seed results - this ensures ghost works when spawn narrows building options
    const result = getAvailableBuildingsForSlot(mapType, slotsWithoutTarget, nightlord, slotId, selectedSpawnSlot)
    
    
    return result
  }

  const handleSpawnToggle = (slotId: string) => {
    toggleSpawnSlot(slotId) // Use hook's function instead of manual state
    const newSpawnSlot = selectedSpawnSlot === slotId ? null : slotId
    
    // Check for auto-navigation after spawn toggle
    setTimeout(() => {
      const currentSlots = { ...selectedBuildingsRef.current }
      const currentNightlord = selectedNightlordRef.current || null
      
      
      const cleanedSlots: Record<string, string> = {}
      Object.keys(currentSlots).forEach(key => {
        if (!Object.prototype.hasOwnProperty.call(currentSlots, key)) return;
        const slotBuilding = currentSlots[key]
        if (slotBuilding && slotBuilding !== 'empty' && slotBuilding.trim() !== '') {
          if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
            cleanedSlots[key] = slotBuilding
          }
        }
      })
      
      const cleanedNightlord = (!currentNightlord || currentNightlord === 'empty') ? null : currentNightlord
      const remainingSeeds = getRemainingSeeds(mapType, cleanedSlots, cleanedNightlord, newSpawnSlot)
      
      
      if (remainingSeeds.length === 1) {
        setPendingLogSeed(remainingSeeds[0].seed_id);
      }
    }, 0)
  }

  const getIconPath = (building: string, isNightlordSlot: boolean = false) => {
    if (!building || building === 'empty' || building === '') {
      if (isNightlordSlot) {
        return '/Images/nightlordIcons/empty_nightlord.webp'
      }
      return '/Images/buildingIcons/empty.webp'
    }

    if (building.match(/^\d+_/)) {
      return `/Images/nightlordIcons/${building}.webp`
    }
    
    return `/Images/buildingIcons/${building}.webp`
  }

  const getZoomScaledIconSize = (baseSize: [number, number], zoomLevel: number) => {

    const zoomScale = Math.max(1.0, 1.0 + (zoomLevel * 0.5))
    
    const scaledWidth = Math.round(baseSize[0] * zoomScale)
    const scaledHeight = Math.round(baseSize[1] * zoomScale)
    
    return [scaledWidth, scaledHeight] as [number, number]
  }

  const selectedBuildingsRef = useRef(selectedBuildings)
  const selectedNightlordRef = useRef(selectedNightlord)
  const selectedSpawnSlotRef = useRef(selectedSpawnSlot)

  useEffect(() => {
    selectedBuildingsRef.current = selectedBuildings
  }, [selectedBuildings])
  
  useEffect(() => {
    selectedNightlordRef.current = selectedNightlord
  }, [selectedNightlord])
  
  useEffect(() => {
    selectedSpawnSlotRef.current = selectedSpawnSlot
  }, [selectedSpawnSlot])

  const handleSlotClick = (slotId: string) => {

    const currentBuildings = selectedBuildingsRef.current
    const currentNightlord = selectedNightlordRef.current

    // Use modal options for click logic - same options the modal will show
    // IMPORTANT: Use current spawn slot state from ref to ensure consistency
    const currentSpawnSlot = selectedSpawnSlotRef.current
    const options = getAvailableOptionsWithStateAndSpawn(slotId, currentBuildings, currentNightlord, currentSpawnSlot)

    const currentBuilding = slotId === 'nightlord' ? currentNightlord : 
      (Object.prototype.hasOwnProperty.call(currentBuildings, slotId) ? currentBuildings[slotId] : undefined)

    const nonEmptyOptions = options.filter(option => option !== 'empty')
    
    // Exception: If this slot is set as spawn location, always open modal (don't auto-select)
    const isSpawnSlot = selectedSpawnSlotRef.current === slotId
    
    if (nonEmptyOptions.length === 1 && !isSpawnSlot) {
      const singleOption = nonEmptyOptions[0]
      
      if (!currentBuilding || currentBuilding === '' || currentBuilding === 'empty') {

        handleBuildingSelect(singleOption, slotId)
        return
      } else if (currentBuilding === singleOption) {

        handleBuildingSelect('empty', slotId)
        return
      } else {

        handleBuildingSelect(singleOption, slotId)
        return
      }
    }

    if (currentBuilding && currentBuilding !== '' && currentBuilding !== 'empty') {

      if (!options.includes(currentBuilding)) {
        handleBuildingSelect('empty', slotId)
        return
      }
    }

    if (options.length === 1 && options[0] === 'empty') {
      if (currentBuilding && currentBuilding !== '' && currentBuilding !== 'empty') {
        handleBuildingSelect('empty', slotId)
        return
      }
    }

    if (options.length > 0) {
      setSelectedSlot(slotId)
      setModalOpen(true)
    }
  }

  const handleBuildingSelect = (building: string, forceSlotId?: string) => {

    const targetSlot = forceSlotId || selectedSlot

    if (targetSlot === 'nightlord') {
      setSelectedNightlord(building)
    } else {
      setSelectedBuildings(prev => ({
        ...prev,
        [targetSlot]: building
      }))
    }

    setPathTaken(prev => {
      const newPath = { ...prev }
      
      if (targetSlot === 'nightlord') {
        if (building === 'empty' || building === '') {

          delete newPath.nightlord
        } else {

          newPath.nightlord = building
        }
      } else {
        if (building === 'empty' || building === '') {

          if (Object.prototype.hasOwnProperty.call(newPath, targetSlot)) {
            delete newPath[targetSlot]
          }
        } else {

          if (typeof targetSlot === 'string' && /^[a-zA-Z0-9_]+$/.test(targetSlot)) {
            newPath[targetSlot] = building
          }
        }
      }
      
      return newPath
    })

    setTimeout(() => {
      const currentSlots = { ...selectedBuildingsRef.current }
      const currentNightlord = selectedNightlordRef.current || null
      

      if (targetSlot === 'nightlord') {

        const nightlordForSearch = (building === '' || building === 'empty') ? null : building

        const cleanedSlots: Record<string, string> = {}
        Object.keys(currentSlots).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(currentSlots, key)) return;
          const slotBuilding = currentSlots[key]
          if (slotBuilding && slotBuilding !== 'empty' && slotBuilding.trim() !== '') {
            if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
              cleanedSlots[key] = slotBuilding
            }
          }
        })
        
        const currentSpawnSlot = selectedSpawnSlotRef.current
        const remainingSeeds = getRemainingSeeds(mapType, cleanedSlots, nightlordForSearch, currentSpawnSlot)
        
        
        if (remainingSeeds.length === 1) {
          setPendingLogSeed(remainingSeeds[0].seed_id);
        }
      } else {

        const cleanedSlots: Record<string, string> = {}
        Object.keys(currentSlots).forEach(key => {
          if (!Object.prototype.hasOwnProperty.call(currentSlots, key)) return;
          const slotBuilding = currentSlots[key]
          if (slotBuilding && slotBuilding !== 'empty' && slotBuilding.trim() !== '') {
            if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
              cleanedSlots[key] = slotBuilding
            }
          }
        })

        if (building && building !== 'empty' && building.trim() !== '') {
          if (typeof targetSlot === 'string' && /^[a-zA-Z0-9_]+$/.test(targetSlot)) {
            cleanedSlots[targetSlot] = building
          }
        }

        const cleanedNightlord = (!currentNightlord || currentNightlord === 'empty') ? null : currentNightlord
        
        const currentSpawnSlot = selectedSpawnSlotRef.current
        const remainingSeeds = getRemainingSeeds(mapType, cleanedSlots, cleanedNightlord, currentSpawnSlot)
        
        
        if (remainingSeeds.length === 1) {
          setPendingLogSeed(remainingSeeds[0].seed_id);
        }
      }
    }, 0)

    setModalOpen(false)
  }

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

    const imageOverlay = L.imageOverlay(MAP_IMAGES[mapType], imageBounds)
    imageOverlay.addTo(map)

    map.fitBounds(imageBounds)

    setCurrentZoom(map.getZoom())
    
    leafletMapRef.current = map

    setTimeout(async () => {
      try {
        if (!leafletMapRef.current || !leafletMapRef.current.getContainer()) {
          return
        }

        // Use Phase 1 coordinate constants instead of JSON loading
        const { INTERACTIVE_COORDINATES } = await import('@/lib/constants/mapCoordinates')
        const coordsData = INTERACTIVE_COORDINATES
        

        const containerWidth = mapRef.current?.offsetWidth || 1000
        const baseIconSize = Math.max(24, containerWidth * 0.04)
        
        const iconConfig = {
          mobile: {
            size: [baseIconSize, baseIconSize] as [number, number],
            anchor: [baseIconSize / 2, baseIconSize / 2] as [number, number],
            popupAnchor: [0, -baseIconSize / 2] as [number, number]
          },
          desktop: {
            size: [baseIconSize * 1.3, baseIconSize * 1.3] as [number, number],
            anchor: [baseIconSize * 0.65, baseIconSize * 0.65] as [number, number],
            popupAnchor: [0, -baseIconSize * 0.65] as [number, number]
          }
        }
        
        // Use current isMobile state for real-time icon configuration
        const currentConfig = isMobile ? iconConfig.mobile : iconConfig.desktop

        markersRef.current.forEach((marker) => {
          marker.remove()
        })
        markersRef.current.clear()

        const orphanedMarkers = document.querySelectorAll('[data-slot-id]')
        orphanedMarkers.forEach(element => {
          element.remove()
        })

        const orphanedNightlords = document.querySelectorAll('[data-slot-id="nightlord"]')
        orphanedNightlords.forEach(element => {
          element.remove()
        })

        coordsData.forEach((coord: { id: string, x: number, y: number }) => {

          const availableOptions = getAvailableOptions(coord.id, false)

          const nonEmptyOptions = availableOptions.filter(option => option !== 'empty')

          if (nonEmptyOptions.length === 0) return

          if (markersRef.current.has(coord.id)) {
            return
          }
          
          const scaleFactor = containerSize / 1000
          
          const scaledX = coord.x * scaleFactor
          const scaledY = coord.y * scaleFactor
          const leafletCoords: [number, number] = [containerSize - scaledY, scaledX]

          let iconUrl, iconSize, iconAnchor, popupAnchor, shouldGhost = false

          const ghostCheckOptions = getAvailableOptionsForGhost(coord.id, selectedBuildings, selectedNightlord).filter(option => option !== 'empty')
          
          if (coord.id === 'nightlord') {

            const currentNightlord = selectedNightlord || ''
            
            if (ghostCheckOptions.length === 1 && (!currentNightlord || currentNightlord === '' || currentNightlord === 'empty')) {

              iconUrl = getIconPath(ghostCheckOptions[0], true)
              shouldGhost = true
            } else {

              iconUrl = getIconPath(currentNightlord, true)
            }
            
            const baseIconSize = getZoomScaledIconSize(currentConfig.size, currentZoom)
            iconSize = [baseIconSize[0] * 1.75, baseIconSize[1] * 1.75] as [number, number]
            iconAnchor = [iconSize[0] / 2, iconSize[1] / 2] as [number, number]
            popupAnchor = [0, -iconSize[1] / 2] as [number, number]
          } else {

            const currentBuilding = selectedBuildings[coord.id] || ''
            
            if (ghostCheckOptions.length === 1 && (!currentBuilding || currentBuilding === '' || currentBuilding === 'empty')) {

              iconUrl = getIconPath(ghostCheckOptions[0])
              shouldGhost = true
            } else {

              iconUrl = getIconPath(currentBuilding || 'empty')
            }
            
            iconSize = getZoomScaledIconSize(currentConfig.size, currentZoom)
            iconAnchor = [iconSize[0] / 2, iconSize[1] / 2] as [number, number]
            popupAnchor = [0, -iconSize[1] / 2] as [number, number]
          }
          
          const slotIcon = L.icon({
            iconUrl,
            iconSize,
            iconAnchor,
            popupAnchor
          })
          
          const marker = L.marker(leafletCoords, { 
            icon: slotIcon,
            interactive: true
          })

          marker.on('add', () => {
            const markerElement = marker.getElement()
            if (markerElement) {
              markerElement.setAttribute('data-slot-id', coord.id)
              markerElement.setAttribute('data-building', coord.id === 'nightlord' ? (selectedNightlord || '') : 'empty')

              if (shouldGhost) {
                const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
                if (imgElement) {
                  imgElement.classList.add('ghost-icon')
                }
              }
            }
          })
          
          
          marker.on('click', () => {
            handleSlotClick(coord.id)
          })
          
          marker.addTo(leafletMapRef.current!)
          markersRef.current.set(coord.id, marker)
        })

        iconConfigRef.current = currentConfig
        
      } catch (error) {
        console.warn('Could not load building slot icons:', error)
      }
    }, 250)
    
    map.setMaxBounds(imageBounds)
    
    map.on('zoom', () => {
      map.panInsideBounds(imageBounds, { animate: false })
      const newZoom = map.getZoom()
      setCurrentZoom(newZoom)
    })
    
    map.on('drag', () => {
      map.panInsideBounds(imageBounds, { animate: false })
    })

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove()
        leafletMapRef.current = null
      }
    }
  }, [mapType, router])

  useEffect(() => {
    if (!markersRef.current || !iconConfigRef.current || !leafletMapRef.current) return

    const markers = markersRef.current

    Object.keys(selectedBuildings).forEach(slotId => {
      if (!Object.prototype.hasOwnProperty.call(selectedBuildings, slotId)) return;
      const marker = markers.get(slotId)
      if (marker) {
        const currentBuilding = selectedBuildings[slotId]
        const markerElement = marker.getElement()
        
        if (markerElement) {

          const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
          
          if (imgElement instanceof HTMLImageElement) {

            imgElement.src = getIconPath(currentBuilding)
            markerElement.setAttribute('data-building', currentBuilding)

            applyBlueHueIfNeeded(imgElement, slotId)

            marker.setTooltipContent(`Slot ${slotId} - ${currentBuilding === 'empty' ? 'Empty' : currentBuilding}`)
          }
        }
      }
    })

    const nightlordMarker = markers.get('nightlord')
    if (nightlordMarker) {
      const currentNightlord = selectedNightlord || ''
      const markerElement = nightlordMarker.getElement()
      
      if (markerElement) {
        const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
        
        if (imgElement && imgElement instanceof HTMLImageElement) {
          imgElement.src = getIconPath(currentNightlord, true)
          markerElement.setAttribute('data-building', currentNightlord)
          nightlordMarker.setTooltipContent(`Nightlord - ${currentNightlord}`)
        }
      }
    }

    markers.forEach((marker, slotId) => {
      if (slotId !== 'nightlord' && !Object.prototype.hasOwnProperty.call(selectedBuildings, slotId)) {
        const markerElement = marker.getElement()
        if (markerElement) {
          const currentBuilding = markerElement.getAttribute('data-building')

          if (currentBuilding !== 'empty') {
            const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
            
            if (imgElement && imgElement instanceof HTMLImageElement) {
              imgElement.src = getIconPath('empty')
              markerElement.setAttribute('data-building', 'empty')
              
              applyBlueHueIfNeeded(imgElement, slotId)
              
              marker.setTooltipContent(`Slot ${slotId} - Click to build`)
            }
          }
        }
      }
    })
  }, [selectedBuildings, selectedNightlord])

  useEffect(() => {
    if (!markersRef.current || !leafletMapRef.current) return
    
    const markers = markersRef.current

    markers.forEach((marker, slotId) => {
      getAvailableOptions(slotId, false)
      const nonEmptyOptions = getAvailableOptionsForGhost(slotId, selectedBuildings, selectedNightlord).filter(option => option !== 'empty')
      
      const markerElement = marker.getElement()
      if (markerElement) {
        const currentBuilding = slotId === 'nightlord' ? selectedNightlord : 
          (Object.prototype.hasOwnProperty.call(selectedBuildings, slotId) ? selectedBuildings[slotId] || '' : '')
        const isEmpty = !currentBuilding || currentBuilding === '' || currentBuilding === 'empty'
        

        if (nonEmptyOptions.length === 0) {

          markerElement.style.display = 'none'
          marker.closeTooltip()
        } else if (remainingSeedsCount === 1 && isEmpty) {
          markerElement.style.setProperty('opacity', '0', 'important')
          marker.closeTooltip()
        } else {

          markerElement.style.display = 'block'
          markerElement.style.setProperty('opacity', '1', 'important')

          const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
          if (imgElement) {

            imgElement.classList.remove('ghost-icon')

            const shouldGhost = nonEmptyOptions.length === 1 && isEmpty
            
            
            if (shouldGhost) {

              if (!leafletMapRef.current?.hasLayer(marker)) {
                marker.addTo(leafletMapRef.current!)
              }
              
              if (imgElement instanceof HTMLImageElement) {
                imgElement.src = getIconPath(nonEmptyOptions[0], slotId === 'nightlord')
                imgElement.classList.add('ghost-icon')
              }
              
              marker.setTooltipContent(slotId === 'nightlord' ? `Nightlord - Auto-select ${nonEmptyOptions[0]}` : `Slot ${slotId} - Auto-select ${nonEmptyOptions[0]}`)
            } else {

              const currentIcon = slotId === 'nightlord' ? (selectedNightlord || '') : 
                (Object.prototype.hasOwnProperty.call(selectedBuildings, slotId) ? selectedBuildings[slotId] || 'empty' : 'empty')

              if (!leafletMapRef.current?.hasLayer(marker)) {
                marker.addTo(leafletMapRef.current!)
              }
              
              if (imgElement instanceof HTMLImageElement) {
                imgElement.src = getIconPath(currentIcon, slotId === 'nightlord')
                imgElement.classList.remove('ghost-icon')
                
                if (slotId !== 'nightlord') {
                  applyBlueHueIfNeeded(imgElement, slotId)
                }
              }
              marker.setTooltipContent(slotId === 'nightlord' ? `Nightlord - Click to select` : `Slot ${slotId} - Click to build`)
            }
          }
        }
      }
    })
  }, [selectedBuildings, selectedNightlord, mapType, remainingSeedsCount, selectedSpawnSlot])

  // Separate useEffect for spawn marker (doesn't need iconConfigRef)
  useEffect(() => {
    if (!markersRef.current || !leafletMapRef.current) return

    const markers = markersRef.current

    // Spawn marker management
    if (selectedSpawnSlot) {
      const spawnSlotMarker = markers.get(selectedSpawnSlot)
      
      if (spawnSlotMarker && leafletMapRef.current) {
        const spawnPosition = spawnSlotMarker.getLatLng()
        
        // Create or update spawn marker
        if (!spawnMarkerRef.current) {
          const spawnIcon = L.icon({
            iconUrl: '/Images/SpawnIcons/spawn.webp',
            iconSize: [70, 70],
            iconAnchor: [35, 35],
            popupAnchor: [0, -35]
          })
          
          spawnMarkerRef.current = L.marker(spawnPosition, { 
            icon: spawnIcon,
            zIndexOffset: 1000, // Above all other markers
            interactive: false // Allow clicks to pass through to markers below
          }).addTo(leafletMapRef.current)
          
          spawnMarkerRef.current.setTooltipContent(`Spawn Location - Slot ${selectedSpawnSlot}`)
        } else {
          // Update existing spawn marker position
          spawnMarkerRef.current.setLatLng(spawnPosition)
          spawnMarkerRef.current.setTooltipContent(`Spawn Location - Slot ${selectedSpawnSlot}`)
        }
      }
    } else {
      // Remove spawn marker if no spawn slot selected
      if (spawnMarkerRef.current && leafletMapRef.current) {
        leafletMapRef.current.removeLayer(spawnMarkerRef.current)
        spawnMarkerRef.current = null
      }
    }
  }, [selectedSpawnSlot])

  useEffect(() => {
    if (!markersRef.current || !iconConfigRef.current || !leafletMapRef.current) return

    const containerWidth = mapRef.current?.offsetWidth || 1000
    const baseIconSize = Math.max(24, containerWidth * 0.04)
    
    const newIconConfig = isMobile 
      ? {
          size: [baseIconSize, baseIconSize] as [number, number],
          anchor: [baseIconSize / 2, baseIconSize / 2] as [number, number],
          popupAnchor: [0, -baseIconSize / 2] as [number, number]
        }
      : {
          size: [baseIconSize * 1.3, baseIconSize * 1.3] as [number, number],
          anchor: [baseIconSize * 0.65, baseIconSize * 0.65] as [number, number],
          popupAnchor: [0, -baseIconSize * 0.65] as [number, number]
        }

    iconConfigRef.current = newIconConfig

    const markers = markersRef.current

    markers.forEach((marker, slotId) => {
      const markerElement = marker.getElement()
      if (markerElement) {
        const imgElement = markerElement.tagName === 'IMG' ? markerElement : markerElement.querySelector('img')
        
        if (imgElement) {
          const baseSize = getZoomScaledIconSize(newIconConfig.size, currentZoom)
          const newSize = slotId === 'nightlord' ? 
            [baseSize[0] * 1.75, baseSize[1] * 1.75] : baseSize

          imgElement.style.width = `${newSize[0]}px`
          imgElement.style.height = `${newSize[1]}px`

          const newAnchor = [newSize[0] / 2, newSize[1] / 2]
          markerElement.style.marginLeft = `-${newAnchor[0]}px`
          markerElement.style.marginTop = `-${newAnchor[1]}px`
        }
      }
    })
  }, [currentZoom, isMobile])

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
    <>
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
          className="absolute top-8 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none z-[1000]"
          style={{ fontSize: isMobile ? '12px' : '14px' }}
        >
          {remainingSeedsCount} seeds remaining
        </div>
      </div>
      
      <SlotSelectionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        slotId={selectedSlot}
        onSelect={handleBuildingSelect}
        availableOptions={getAvailableOptions(selectedSlot)}
        currentBuilding={selectedSlot === 'nightlord' ? selectedNightlord : 
          (Object.prototype.hasOwnProperty.call(selectedBuildings, selectedSlot) ? selectedBuildings[selectedSlot] : undefined)}
        mapType={mapType}
        slots={selectedBuildings}
        nightlord={(!selectedNightlord || selectedNightlord === 'empty' || selectedNightlord === '') ? null : selectedNightlord}
        selectedSpawnSlot={selectedSpawnSlot}
        onSpawnToggle={handleSpawnToggle}
      />
    </>
  )
}