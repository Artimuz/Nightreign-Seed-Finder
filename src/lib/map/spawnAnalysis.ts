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

  const matchingSeeds = seeds.filter(seed => {
    const seedMapType = seed.map_type.toLowerCase().replace(/\s+/g, '').replace(',', '')
    const searchMapType = mapType.toLowerCase().replace(/\s+/g, '').replace(',', '')
    
    const mapTypeMapping: Record<string, string[]> = {
      normal: ['normal'],
      crater: ['crater'],
      mountaintop: ['mountaintop', 'mountain'],
      noklateo: ['noklateo', 'noklateo,theshroudedcity', 'noklateo the shrouded city'],
      rotted: ['rotted', 'rottedwoods', 'rotted woods']
    }
    
    const validMappings = mapTypeMapping[searchMapType] || [searchMapType]
    const isMapTypeMatch = validMappings.some(mapping =>
      seedMapType.includes(mapping) || mapping.includes(seedMapType)
    )
    
    if (!isMapTypeMatch) return false

    if (nightlord && nightlord.trim() !== '' && seed.nightlord !== nightlord) {
      return false
    }

    for (const [slotId, building] of Object.entries(currentBuildings)) {
      const current = building
      if (
        current &&
        current !== 'empty' &&
        Object.prototype.hasOwnProperty.call(seed.slots, slotId)
      ) {
        const val = seed.slots[slotId as keyof typeof seed.slots]
        if (val !== current) {
          return false
        }
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

  const spawnSlotCounts: Record<string, number> = {}
  
  matchingSeeds.forEach(seed => {
    Object.entries(seed.slots).forEach(([slotId, value]) => {
      if (value === 'empty_spawn' || value === 'church_spawn') {
        const normalizedSlot = normalizeSlotId(slotId)
        spawnSlotCounts[normalizedSlot] = (spawnSlotCounts[normalizedSlot] || 0) + 1
      }
    })
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

function normalizeSlotId(slot: string): string {
  const num = parseInt(slot, 10)
  if (Number.isNaN(num)) return slot
  return num < 10 ? `0${num}` : String(num)
}

function normalizeBuilding(value: string): string {
  if (value.endsWith('_spawn')) return value.replace(/_spawn$/, '')
  return value
}

export function filterSeedsBySpawn(
  list: Seed[],
  selectedSpawnSlot: string | null
): Seed[] {
  if (!selectedSpawnSlot) {
    return list
  }
  const normalized = normalizeSlotId(selectedSpawnSlot)
  return list.filter(seed => {
    const valAtNormalized = seed.slots[normalized as keyof typeof seed.slots]
    const valAtRaw = seed.slots[selectedSpawnSlot as keyof typeof seed.slots]
    const val = valAtNormalized ?? valAtRaw
    return val === 'empty_spawn' || val === 'church_spawn'
  })
}