// Re-exports from mapCoordinates.ts for backward compatibility and enhanced utilities
export { 
  scaleCoordinate, 
  toLeafletCoordinates,
  INTERACTIVE_COORDINATES,
  EVENT_COORDINATE
} from '@/lib/constants/mapCoordinates'

import { INTERACTIVE_COORDINATES, EVENT_COORDINATE } from '@/lib/constants/mapCoordinates'

// Additional utility functions for coordinate manipulation

export interface Coordinate {
  id: string
  x: number
  y: number
}

export interface ScaledCoordinate {
  x: number
  y: number
}

export function scaleCoordinates(
  coords: { x: number; y: number }, 
  containerSize: number
): [number, number] {
  const scaledX = (coords.x / 1000) * containerSize
  const scaledY = (coords.y / 1000) * containerSize
  return [scaledX, scaledY]
}

export function getCoordinateById(id: string): Coordinate | null {
  const allCoordinates = [
    ...getBuildingSlotCoordinates(),
    getNightlordCoordinate(),
    getEventCoordinate()
  ]
  
  return allCoordinates.find(coord => coord.id === id) || null
}

export function getBuildingSlotCoordinates(): Coordinate[] {
  return INTERACTIVE_COORDINATES.filter(coord => coord.id !== 'nightlord')
}

export function getNightlordCoordinate(): Coordinate {
  return INTERACTIVE_COORDINATES.find(coord => coord.id === 'nightlord') || { id: 'nightlord', x: 500, y: 200 }
}

export function getEventCoordinate(): Coordinate {
  return EVENT_COORDINATE
}

export function getInteractiveCoordinates(): Coordinate[] {
  return INTERACTIVE_COORDINATES
}

export function getAllMapCoordinates(): Coordinate[] {
  return [
    ...getBuildingSlotCoordinates(),
    getNightlordCoordinate(),
    getEventCoordinate()
  ]
}

export function isBuildingSlot(id: string): boolean {
  return getBuildingSlotCoordinates().some(coord => coord.id === id)
}

export function isNightlordSlot(id: string): boolean {
  return id === 'nightlord'
}

export function isEventSlot(id: string): boolean {
  return id === 'event'
}

export function normalizeCoordinate(
  coord: { x: number; y: number },
  fromSize: number,
  toSize: number
): { x: number; y: number } {
  const scaleRatio = toSize / fromSize
  return {
    x: coord.x * scaleRatio,
    y: coord.y * scaleRatio
  }
}

export function getCoordinateBounds(coordinates: Coordinate[]): {
  minX: number
  maxX: number
  minY: number
  maxY: number
} {
  if (coordinates.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  const xs = coordinates.map(c => c.x)
  const ys = coordinates.map(c => c.y)

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys)
  }
}

export function getDistanceBetweenCoordinates(
  coord1: { x: number; y: number },
  coord2: { x: number; y: number }
): number {
  const dx = coord2.x - coord1.x
  const dy = coord2.y - coord1.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function findNearestCoordinate(
  target: { x: number; y: number },
  coordinates: Coordinate[]
): Coordinate | null {
  if (coordinates.length === 0) return null

  return coordinates.reduce((nearest, current) => {
    const currentDistance = getDistanceBetweenCoordinates(target, current)
    const nearestDistance = getDistanceBetweenCoordinates(target, nearest)
    
    return currentDistance < nearestDistance ? current : nearest
  })
}

export function isCoordinateInBounds(
  coord: { x: number; y: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): boolean {
  return coord.x >= bounds.minX &&
         coord.x <= bounds.maxX &&
         coord.y >= bounds.minY &&
         coord.y <= bounds.maxY
}

export function clampCoordinate(
  coord: { x: number; y: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): { x: number; y: number } {
  return {
    x: Math.max(bounds.minX, Math.min(bounds.maxX, coord.x)),
    y: Math.max(bounds.minY, Math.min(bounds.maxY, coord.y))
  }
}