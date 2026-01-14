// Phase 1 Components
export { default } from './BaseMap/BaseMap'
export type { BaseMapProps } from './BaseMap/BaseMap'

// Phase 1 Overlays
export { 
  BuildingSlotOverlay, 
  EventOverlay, 
  InfoOverlay,
  useMapState,
  useMarkerManager
} from './BaseMap'

// Phase 2 Components moved to Legacy folder
// export { default as MapComponent } from './Legacy/MapComponent'
// export { default as MapBuilderUnified } from './Legacy/MapBuilderUnified'
// export { default as MapResultUnified } from './Legacy/MapResultUnified'
// export { default as MapViewerExample } from './Legacy/MapViewerExample'

// Original Components (preserved for backward compatibility)
export { default as MapBuilder } from './MapBuilder'
export { default as MapResult } from './MapResult'
// Refactored components moved to Legacy folder
// export { default as MapBuilderRefactored } from './Legacy/MapBuilderRefactored'
// export { default as MapResultRefactored } from './Legacy/MapResultRefactored'

// UI Components
export { default as SlotSelectionModal } from './SlotSelectionModal'
export { default as VersionNotification } from './VersionNotification'
export { default as VersionStatus } from './VersionStatus'
export { default as CrystalFinderHelpModal } from './CrystalFinderHelpModal'

// Background Components
export { GlobalBackground } from './backgrounds/GlobalBackground'

// Card Components
export { MapSelectionCard } from './cards/MapSelectionCard'
export { MapSelectionCards } from './cards/MapSelectionCards'

// UI Components
export { Footer } from './ui/Footer'
export { Header } from './ui/Header'
export { CardImage as OptimizedImage } from './ui/OptimizedImage'
export { default as DecoratedArticle } from './ui/DecoratedArticle'