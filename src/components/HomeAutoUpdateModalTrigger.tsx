'use client'

import { useEffect } from 'react'
import { useGlobalUpdateContext } from '@/components/providers/GlobalUpdateProvider'

export function HomeAutoUpdateModalTrigger() {
  const { showAutomaticModal } = useGlobalUpdateContext()

  useEffect(() => {
    const timer = setTimeout(() => {
      showAutomaticModal()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [showAutomaticModal])

  return null
}
