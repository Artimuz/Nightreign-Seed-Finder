'use client'

import { useState, useEffect } from 'react'
import { MapSelectionCards } from '../components/cards/MapSelectionCards'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main>
      <MapSelectionCards />
    </main>
  )
}