'use client'

import { useState, useEffect } from 'react'
import { MapSelectionCards } from '../components/cards/MapSelectionCards'
import { useGlobalUpdateContext } from '@/components/providers/GlobalUpdateProvider'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { showAutomaticModal } = useGlobalUpdateContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const timer = setTimeout(() => {
        showAutomaticModal()
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [mounted, showAutomaticModal])

  if (!mounted) {
    return null
  }

  return (
    <main>
      <MapSelectionCards />
    </main>
  )
}