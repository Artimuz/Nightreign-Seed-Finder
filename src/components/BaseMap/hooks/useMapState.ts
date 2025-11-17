'use client'

import { useEffect, useState } from 'react'

export interface IconConfig {
  size: [number, number]
  anchor: [number, number]
  popupAnchor: [number, number]
}

export interface UseMapStateReturn {
  isMobile: boolean
  containerSize: number
  iconConfig: IconConfig
}

export function useMapState(containerRef?: React.RefObject<HTMLDivElement | null>) {
  const [isMobile, setIsMobile] = useState(false)
  const [containerSize, setContainerSize] = useState<number>(1000)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    const updateContainerSize = () => {
      if (containerRef?.current) {
        const size = Math.min(containerRef.current.offsetWidth, containerRef.current.offsetHeight)
        setContainerSize(size)
      }
    }

    const handleResize = () => {
      checkIfMobile()
      updateContainerSize()
    }

    checkIfMobile()
    updateContainerSize()
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [containerRef])

  const containerWidth = containerRef?.current?.offsetWidth || 1000
  const baseIconSize = Math.max(24, containerWidth * 0.04)

  const iconConfig: IconConfig = isMobile 
    ? {
        size: [baseIconSize, baseIconSize],
        anchor: [baseIconSize / 2, baseIconSize / 2],
        popupAnchor: [0, -baseIconSize / 2]
      }
    : {
        size: [baseIconSize * 1.3, baseIconSize * 1.3],
        anchor: [baseIconSize * 0.65, baseIconSize * 0.65],
        popupAnchor: [0, -baseIconSize * 0.65]
      }

  return {
    isMobile,
    containerSize,
    iconConfig
  } as UseMapStateReturn
}

export function useZoomChange(onZoomChange?: (zoom: number) => void) {
  return (zoom: number) => {
    if (onZoomChange) {
      onZoomChange(zoom)
    }
  }
}