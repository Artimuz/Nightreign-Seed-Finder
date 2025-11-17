'use client'

import React from 'react'

export interface InfoOverlayProps {
  seedNumber?: string
  remainingSeedsCount?: number
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  isMobile: boolean
  className?: string
  style?: React.CSSProperties
}

export default function InfoOverlay({
  seedNumber,
  remainingSeedsCount,
  position,
  isMobile,
  className = '',
  style
}: InfoOverlayProps) {
  const getPositionClasses = (pos: string) => {
    switch (pos) {
      case 'top-left':
        return 'top-2 left-2'
      case 'top-right':
        return 'top-8 right-2'
      case 'bottom-left':
        return 'bottom-2 left-2'
      case 'bottom-right':
        return 'bottom-2 right-2'
      default:
        return 'top-2 left-2'
    }
  }

  const baseClasses = "absolute bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm font-medium pointer-events-none z-[1000]"
  const positionClasses = getPositionClasses(position)
  const fontSize = isMobile ? '12px' : '14px'

  if (seedNumber) {
    return (
      <div 
        className={`${baseClasses} ${positionClasses} ${className}`}
        style={{ fontSize, ...style }}
      >
        Map Pattern {seedNumber} - Source: thefifthmatt
      </div>
    )
  }

  if (remainingSeedsCount !== undefined) {
    return (
      <div 
        className={`${baseClasses} ${positionClasses} ${className}`}
        style={{ fontSize, ...style }}
      >
        {remainingSeedsCount} seeds remaining
      </div>
    )
  }

  return null
}