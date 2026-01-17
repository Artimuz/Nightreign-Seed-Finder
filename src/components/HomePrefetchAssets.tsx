'use client'

import { useEffect, useRef } from 'react'
import { pagesWebpUrl } from '@/lib/pagesAssets'
import { nightlordIconOrder, nightlordIcons } from '@/lib/constants/icons'

const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => resolve()
    image.onerror = () => resolve()
    image.src = url
  })
}

const schedule = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return
  }

  const idleCallback = ('requestIdleCallback' in window)
    ? (window as unknown as { requestIdleCallback: (value: () => void) => void }).requestIdleCallback
    : null

  if (idleCallback) {
    idleCallback(() => callback())
    return
  }

  window.setTimeout(callback, 0)
}

export default function HomePrefetchAssets() {
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (hasRunRef.current) {
      return
    }

    hasRunRef.current = true

    schedule(() => {
      const run = async () => {
        const nightlordUrls = nightlordIconOrder
          .map((key) => nightlordIcons[key])
          .filter((value): value is string => typeof value === 'string' && value.length > 0)

        await Promise.all(nightlordUrls.map((url) => preloadImage(url)))

        const mapTypeUrls = [
          pagesWebpUrl('/Images/mapTypes/Crater.webp'),
          pagesWebpUrl('/Images/mapTypes/Mountaintop.webp'),
          pagesWebpUrl('/Images/mapTypes/Noklateo, the Shrouded City.webp'),
          pagesWebpUrl('/Images/mapTypes/Normal.webp'),
          pagesWebpUrl('/Images/mapTypes/Rotted Woods.webp'),
        ]

        await Promise.all(mapTypeUrls.map((url) => preloadImage(url)))

        const uiUrls = [
          pagesWebpUrl('/Images/UI/ern-border-bottom.webp'),
          pagesWebpUrl('/Images/UI/ern-border-top.webp'),
          pagesWebpUrl('/Images/UI/preSelectNightlord.webp'),
        ]

        await Promise.all(uiUrls.map((url) => preloadImage(url)))
      }

      void run()
    })
  }, [])

  return null
}
