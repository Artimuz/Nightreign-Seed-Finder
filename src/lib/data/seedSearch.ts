import { Seed } from '@/lib/types'
import seedData from '../../../public/data/seed_data.json'

const seeds: Seed[] = seedData as Seed[]

interface SearchCriteria {
  mapType: string
  slots: Record<string, string>
  nightlord?: string | null
}

export const searchSeeds = (criteria: SearchCriteria): Seed[] => {
  const { mapType, slots, nightlord } = criteria

  if (!mapType) return []

  return seeds.filter(seed => {

    const seedMapType = seed.map_type.toLowerCase().replace(/\s+/g, '').replace(',', '')
    const searchMapType = mapType.toLowerCase().replace(/\s+/g, '').replace(',', '')
    
    const mapTypeMapping: Record<string, string[]> = {
      'normal': ['normal'],
      'crater': ['crater'],
      'mountaintop': ['mountaintop', 'mountain'],
      'noklateo': ['noklateo', 'noklateo,theshroudedcity', 'noklateo the shrouded city'],
      'rotted': ['rotted', 'rottedwoods', 'rotted woods']
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
      if (!Object.prototype.hasOwnProperty.call(slots, slotId)) continue;
      if (building && building !== 'empty' && 
          Object.prototype.hasOwnProperty.call(seed.slots, slotId) && 
          seed.slots[slotId as keyof typeof seed.slots] !== building) {
        return false
      }
    }

    return true
  })
}

export const getAvailableBuildingsForSlot = (
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

  const matchingSeeds = searchSeeds({
    mapType,
    slots: currentSlots,
    nightlord
  })

  const availableBuildings = new Set<string>()
  
  matchingSeeds.forEach(seed => {
    const building = seed.slots[targetSlotId as keyof typeof seed.slots]
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
  slots: Record<string, string>
): string[] => {
  if (!mapType) return []

  const matchingSeeds = searchSeeds({
    mapType,
    slots
  })

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
  nightlord: string | null
): Seed[] => {
  return searchSeeds({ mapType, slots, nightlord })
}

export const getAllSeeds = (): Seed[] => seeds