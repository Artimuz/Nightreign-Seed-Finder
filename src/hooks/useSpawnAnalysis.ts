'use client'

import { useState, useEffect, useMemo } from 'react'
import { analyzePossibleSpawns, SpawnAnalysis } from '@/lib/map/spawnAnalysis'

interface UseSpawnAnalysisProps {
  mapType: string
  slots: Record<string, string>
  nightlord: string | null
}

export function useSpawnAnalysis({ mapType, slots, nightlord }: UseSpawnAnalysisProps) {
  const [spawnAnalysis, setSpawnAnalysis] = useState<SpawnAnalysis>({
    possibleSpawnSlots: [],
    confidence: 0,
    matchingSeedCount: 0
  })

  const [selectedSpawnSlot, setSelectedSpawnSlot] = useState<string | null>(null)

  const memoizedAnalysis = useMemo(() => 
    analyzePossibleSpawns(mapType, slots, nightlord),
    [mapType, slots, nightlord]
  )

  useEffect(() => {
    setSpawnAnalysis(memoizedAnalysis)
    
    // Reset selected spawn if it's no longer possible
    if (selectedSpawnSlot && !memoizedAnalysis.possibleSpawnSlots.includes(selectedSpawnSlot)) {
      setSelectedSpawnSlot(null)
    }
  }, [memoizedAnalysis, selectedSpawnSlot])

  const toggleSpawnSlot = (slotId: string) => {
    setSelectedSpawnSlot(current => current === slotId ? null : slotId)
  }

  return {
    spawnAnalysis,
    selectedSpawnSlot,
    toggleSpawnSlot,
    isPossibleSpawn: (slotId: string) => spawnAnalysis.possibleSpawnSlots.includes(slotId),
    isSpawnSelected: (slotId: string) => selectedSpawnSlot === slotId
  }
}