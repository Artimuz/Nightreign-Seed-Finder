'use client'

import { useMemo } from 'react'
import { getRemainingSeeds, getAvailableBuildingsForSlot, getAvailableNightlords, getAllSeeds } from '@/lib/data/seedSearch'

export interface UseSeedSearchProps {
  mapType: string
  selectedBuildings: Record<string, string>
  selectedNightlord: string
}

export interface Seed {
  seed_id: string
  map_type: string
  Event?: string
  nightlord?: string
  slots: Record<string, string>
}

export interface UseSeedSearchReturn {
  remainingSeedsCount: number
  getAvailableOptions: (slotId: string) => string[]
  findUniqueSeed: () => Seed | null
}

export function useSeedSearch({
  mapType,
  selectedBuildings,
  selectedNightlord
}: UseSeedSearchProps): UseSeedSearchReturn {
  const cleanedSlots = useMemo(() => {
    const cleaned: Record<string, string> = {}
    Object.keys(selectedBuildings).forEach(key => {
      const building = selectedBuildings[key]
      if (building && building !== 'empty' && building.trim() !== '') {
        if (typeof key === 'string' && /^[a-zA-Z0-9_]+$/.test(key)) {
          cleaned[key] = building
        }
      }
    })
    return cleaned
  }, [selectedBuildings])

  const cleanedNightlord = useMemo(() => {
    return (!selectedNightlord || selectedNightlord === 'empty') ? null : selectedNightlord
  }, [selectedNightlord])

  const remainingSeeds = useMemo(() => {
    return getRemainingSeeds(mapType, cleanedSlots, cleanedNightlord)
  }, [mapType, cleanedSlots, cleanedNightlord])

  const remainingSeedsCount = remainingSeeds.length

  const getAvailableOptions = (slotId: string): string[] => {
    if (slotId === 'nightlord') {
      const availableNightlords = getAvailableNightlords(mapType, cleanedSlots)
      
      if (selectedNightlord && selectedNightlord !== '' && selectedNightlord !== 'empty') {
        return [...availableNightlords, 'empty']
      }
      
      return availableNightlords
    }

    const slotsWithoutTarget = { ...cleanedSlots }
    if (Object.prototype.hasOwnProperty.call(slotsWithoutTarget, slotId)) {
      delete slotsWithoutTarget[slotId]
    }

    return getAvailableBuildingsForSlot(mapType, slotsWithoutTarget, cleanedNightlord, slotId)
  }

  const findUniqueSeed = (): Seed | null => {
    if (remainingSeedsCount === 1) {
      return remainingSeeds[0] as Seed
    }
    return null
  }

  return {
    remainingSeedsCount,
    getAvailableOptions,
    findUniqueSeed
  }
}