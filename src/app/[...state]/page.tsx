'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useGameStore } from '@/lib/state/store'
import { decodeURLState } from '@/lib/state/urlState'
import { parseURLToArray } from '@/lib/state/urlArrayManager'
import Home from '../page'

export default function StatePage() {
  const params = useParams()
  const { syncFromURL } = useGameStore()

  useEffect(() => {
    if (params.state && Array.isArray(params.state)) {
      const urlPath = params.state.join('/')
      
      const decodedUrlPath = decodeURIComponent(urlPath)
      
      const originalArray = parseURLToArray(decodedUrlPath)
      
      const decodedState = decodeURLState(decodedUrlPath)
      
      syncFromURL(decodedState, originalArray)
    }
  }, [params.state, syncFromURL])

  return <Home />
}