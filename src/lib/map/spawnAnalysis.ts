import { Seed } from '@/lib/types'
import seedData from '../../../public/data/seed_data.json'

const seeds: Seed[] = seedData as Seed[]

export interface SpawnAnalysis {
  possibleSpawnSlots: string[]
  confidence: number
  matchingSeedCount: number
}

export function analyzePossibleSpawns(
  mapType: string,
  currentBuildings: Record<string, string>,
  nightlord: string | null
): SpawnAnalysis {
  if (!mapType) {
    return {
      possibleSpawnSlots: [],
      confidence: 0,
      matchingSeedCount: 0
    }
  }

  // Filter seeds by existing criteria (without spawn slot filtering)
  const matchingSeeds = seeds.filter(seed => {
    // Map type matching logic
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
    
    if (!isMapTypeMatch) return false

    // Nightlord matching
    if (nightlord && nightlord.trim() !== '' && seed.nightlord !== nightlord) {
      return false
    }

    // Building matching
    for (const [slotId, building] of Object.entries(currentBuildings)) {
      if (building && building !== 'empty' && 
          Object.prototype.hasOwnProperty.call(seed.slots, slotId) && 
          seed.slots[slotId as keyof typeof seed.slots] !== building) {
        return false
      }
    }

    return true
  })

  if (matchingSeeds.length === 0) {
    return {
      possibleSpawnSlots: [],
      confidence: 0,
      matchingSeedCount: 0
    }
  }

  // Analyze spawn slots from matching seeds
  const spawnSlotCounts: Record<string, number> = {}
  
  matchingSeeds.forEach(seed => {
    const spawnSlot = seed['Spawn Slot' as keyof Seed]
    if (spawnSlot && typeof spawnSlot === 'string') {
      const normalizedSlot = normalizeSpawnSlot(spawnSlot)
      spawnSlotCounts[normalizedSlot] = (spawnSlotCounts[normalizedSlot] || 0) + 1
    }
  })

  const totalSeeds = matchingSeeds.length
  const possibleSpawnSlots = Object.entries(spawnSlotCounts)
    .filter(([, count]) => count > 0)
    .map(([slot]) => slot)
    .sort()

  const confidence = possibleSpawnSlots.length > 0 
    ? Math.max(...Object.values(spawnSlotCounts)) / totalSeeds 
    : 0

  return {
    possibleSpawnSlots,
    confidence,
    matchingSeedCount: totalSeeds
  }
}

function normalizeSpawnSlot(slot: string): string {
  const num = parseInt(slot, 10)
  return num < 10 ? `0${num}` : slot
}

export function filterSeedsBySpawn(
  seeds: Seed[],
  selectedSpawnSlot: string | null
): Seed[] {
  if (!selectedSpawnSlot) {
    return seeds
  }

  return seeds.filter(seed => {
    const seedSpawnSlot = seed['Spawn Slot' as keyof Seed]
    if (!seedSpawnSlot || typeof seedSpawnSlot !== 'string') {
      return false
    }
    
    const normalizedSeedSlot = normalizeSpawnSlot(seedSpawnSlot)
    return normalizedSeedSlot === selectedSpawnSlot
  })
}