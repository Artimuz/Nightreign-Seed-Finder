// Main exports for map utilities
export * from './config'
export * from './iconUtils'
export * from './coordinateUtils'
export * from './mapFactory'
export * from './markerUtils'
// export * from './mapUtils' // Commented out as it depends on Legacy components
export * from './performanceUtils'
export * from './validationUtils'

// Type exports for clean imports
export type { IconSize } from './iconUtils'
export type { Coordinate, ScaledCoordinate } from './coordinateUtils'
export type { MapOptions } from './mapFactory'
export type { 
  MarkerConfig,
  BuildingMarkerConfig,
  EventMarkerConfig,
  MarkerManager 
} from './markerUtils'
export type { PerformanceConfig } from './performanceUtils'

// Configuration shortcuts
export { MAP_CONFIG } from './config'

// Most commonly used utilities
export { 
  createLeafletMap,
  addImageOverlay,
  calculateMapBounds
} from './mapFactory'
export { 
  createBuildingMarker,
  createEventMarker,
  createMarkerManager
} from './markerUtils'
export {
  getIconPath,
  calculateIconSize,
  createMarkerIcon
} from './iconUtils'
export {
  toLeafletCoordinates,
  getCoordinateById,
  getInteractiveCoordinates
} from './coordinateUtils'