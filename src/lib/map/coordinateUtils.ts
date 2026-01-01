export {
  scaleCoordinate,
  toLeafletCoordinates,
  EVENT_COORDINATE,
  getBuildingSlotCoordinates,
  getInteractiveCoordinates,
  getAllMapCoordinates,
  getCoordinateById,
  getNightlordCoordinate,
  getEventCoordinate,
  isBuildingSlot,
  isNightlordSlot,
  isEventSlot
} from '@/lib/constants/mapCoordinates'

import {
  EVENT_COORDINATE,
  getBuildingSlotCoordinates as getBuildingSlotCoordinatesForMap,
  getNightlordCoordinate as getNightlordCoordinateShared,
  getEventCoordinate as getEventCoordinateShared,
  getInteractiveCoordinates as getInteractiveCoordinatesForMap
} from '@/lib/constants/mapCoordinates'

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

export function getCoordinateByIdCompat(id: string, mapType?: string): Coordinate | null {
  const coords = getAllMapCoordinatesCompat(mapType)
  return coords.find(coord => coord.id === id) || null
}

export function getBuildingSlotCoordinatesCompat(mapType?: string): Coordinate[] {
  return getBuildingSlotCoordinatesForMap(mapType)
}

export function getNightlordCoordinateCompat(): Coordinate {
  return getNightlordCoordinateShared()
}

export function getEventCoordinateCompat(): Coordinate {
  return getEventCoordinateShared()
}

export function getInteractiveCoordinatesCompat(mapType?: string): Coordinate[] {
  return getInteractiveCoordinatesForMap(mapType)
}

export function getAllMapCoordinatesCompat(mapType?: string): Coordinate[] {
  const building = getBuildingSlotCoordinatesForMap(mapType)
  return [...building, getNightlordCoordinateShared(), getEventCoordinateShared()]
}

export function isBuildingSlotCompat(id: string, mapType?: string): boolean {
  return getBuildingSlotCoordinatesForMap(mapType).some(coord => coord.id === id)
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