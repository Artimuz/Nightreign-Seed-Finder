import { Seed } from '@/lib/types'
import seedData from '../../../public/data/seed_data.json'
import { filterSeedsBySpawn } from '@/lib/map/spawnAnalysis'
import { normalizeSlotId } from '@/lib/map/slotIdUtils'

const seeds: Seed[] = seedData as Seed[]

interface SearchCriteria {
  mapType: string
  slots: Record<string, string>
  nightlord?: string | null
  selectedSpawnSlot?: string | null
}

export const searchSeeds = (criteria: SearchCriteria): Seed[] => {
  const { mapType, slots, nightlord, selectedSpawnSlot } = criteria

  if (!mapType) return []

  let filteredSeeds = seeds.filter(seed => {

    const seedMapType = seed.map_type.toLowerCase().replace(/\s+/g, '').replace(',', '')
    const searchMapType = mapType.toLowerCase().replace(/\s+/g, '').replace(',', '')
    
    const mapTypeMapping: Record<string, string[]> = {
      'normal': ['normal'],
      'crater': ['crater'],
      'mountaintop': ['mountaintop', 'mountain'],
      'noklateo': ['noklateo', 'noklateo,theshroudedcity', 'noklateo the shrouded city'],
      'rotted': ['rotted', 'rottedwoods', 'rotted woods'],
      'forsaken': ['forsaken', 'forsakenhollows', 'forsaken hollows', 'the forsaken hollows']
    }
    
    const validMappings = mapTypeMapping[searchMapType] || [searchMapType]
    const isMapTypeMatch = validMappings.some(mapping =>
      seedMapType.includes(mapping) || mapping.includes(seedMapType)
    )
    
    if (!isMapTypeMatch) {
      return false
    }

    if (nightlord && nightlord.trim() !== '' && seed.nightlord !== nightlord) {
      return false
    }

    for (const [slotId, building] of Object.entries(slots)) {
      if (!Object.prototype.hasOwnProperty.call(slots, slotId)) continue

      const normalizedSlotId = normalizeSlotId(slotId)

      if (building && building !== 'empty') {
        const normalizedValue = seed.slots[normalizedSlotId as keyof typeof seed.slots]
        const rawValue = seed.slots[slotId as keyof typeof seed.slots]
        const value = normalizedValue ?? rawValue

        if (value !== undefined && value !== building) {
          return false
        }
      }
    }

    return true
  })

  // Apply spawn filtering if selected
  if (selectedSpawnSlot) {
    filteredSeeds = filterSeedsBySpawn(filteredSeeds, selectedSpawnSlot)
  }

  return filteredSeeds
}

// IMPORTANT: Keep original functions for ghost icon logic (no spawn filtering)
export const searchSeedsForGhost = (mapType: string, slots: Record<string, string>, nightlord?: string | null): Seed[] => {
  return searchSeeds({ mapType, slots, nightlord })
}

export const getAvailableBuildingsForSlot = (
  mapType: string,
  slots: Record<string, string>,
  nightlord: string | null,
  targetSlotId: string,
  selectedSpawnSlot?: string | null
): string[] => {
  if (!mapType) return []

  const currentSlots = { ...slots }
  if (Object.prototype.hasOwnProperty.call(currentSlots, targetSlotId)) {
    delete currentSlots[targetSlotId]
  }

  const matchingSeeds = searchSeeds({
    mapType,
    slots: currentSlots,
    nightlord,
    selectedSpawnSlot
  })

  const availableBuildings = new Set<string>()
  
  matchingSeeds.forEach(seed => {
    const normalizedTargetSlotId = normalizeSlotId(targetSlotId)
    const building = seed.slots[normalizedTargetSlotId as keyof typeof seed.slots] ?? seed.slots[targetSlotId as keyof typeof seed.slots]
    if (building && building !== 'empty' && building.trim() !== '') {
      availableBuildings.add(building)
    }
  })

  if (Object.prototype.hasOwnProperty.call(slots, targetSlotId) && 
      slots[targetSlotId] && slots[targetSlotId] !== 'empty') {
    availableBuildings.add('empty')
  }

  return Array.from(availableBuildings)
}

// GHOST LOGIC: Separate function for building options without spawn filtering
export const getAvailableBuildingsForSlotForGhost = (
  mapType: string,
  slots: Record<string, string>,
  nightlord: string | null,
  targetSlotId: string
): string[] => {
  if (!mapType) return []

  const currentSlots = { ...slots }
  if (Object.prototype.hasOwnProperty.call(currentSlots, targetSlotId)) {
    delete currentSlots[targetSlotId]
  }

  const matchingSeeds = searchSeedsForGhost(mapType, currentSlots, nightlord)

  const availableBuildings = new Set<string>()
  
  matchingSeeds.forEach(seed => {
    const normalizedTargetSlotId = normalizeSlotId(targetSlotId)
    const building = seed.slots[normalizedTargetSlotId as keyof typeof seed.slots] ?? seed.slots[targetSlotId as keyof typeof seed.slots]
    if (building && building !== 'empty' && building.trim() !== '') {
      availableBuildings.add(building)
    }
  })

  if (Object.prototype.hasOwnProperty.call(slots, targetSlotId) && 
      slots[targetSlotId] && slots[targetSlotId] !== 'empty') {
    availableBuildings.add('empty')
  }

  return Array.from(availableBuildings)
}

export const getAvailableNightlords = (
  mapType: string,
  slots: Record<string, string>,
  selectedSpawnSlot?: string | null
): string[] => {
  if (!mapType) return []

  const matchingSeeds = searchSeeds({
    mapType,
    slots,
    selectedSpawnSlot
  })

  const availableNightlords = new Set<string>()
  
  matchingSeeds.forEach(seed => {
    if (seed.nightlord && seed.nightlord.trim() !== '') {
      availableNightlords.add(seed.nightlord)
    }
  })

  return Array.from(availableNightlords)
}

// GHOST LOGIC: Separate function for nightlords without spawn filtering
export const getAvailableNightlordsForGhost = (
  mapType: string,
  slots: Record<string, string>
): string[] => {
  if (!mapType) return []

  const matchingSeeds = searchSeedsForGhost(mapType, slots)

  const availableNightlords = new Set<string>()
  
  matchingSeeds.forEach(seed => {
    if (seed.nightlord && seed.nightlord.trim() !== '') {
      availableNightlords.add(seed.nightlord)
    }
  })

  return Array.from(availableNightlords)
}

export const getRemainingSeeds = (
  mapType: string,
  slots: Record<string, string>,
  nightlord: string | null,
  selectedSpawnSlot?: string | null
): Seed[] => {
  return searchSeeds({ mapType, slots, nightlord, selectedSpawnSlot })
}

const normalizeBuilding = (value: string): string => {
  if (value.endsWith('_spawn')) return value.replace(/_spawn$/, '')
  return value
}

export const getAllSeeds = (): Seed[] => seeds
