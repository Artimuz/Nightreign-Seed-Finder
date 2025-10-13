'use client'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/lib/state/store'
import { MapSelectionCards } from '@/components/cards/MapSelectionCards'
import { GameBoard } from '@/components/game/GameBoard'
export default function Home() {
  const { currentPhase } = useGameStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  return (
    <main className="min-h-screen">
      {currentPhase === 'selection' ? (
        <MapSelectionCards />
      ) : (
        <GameBoard />
      )}
    </main>
  );
}