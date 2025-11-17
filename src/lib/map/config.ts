export const MAP_CONFIG = {
  images: {
    'normal': '/Images/mapTypes/Normal.webp',
    'crater': '/Images/mapTypes/Crater.webp',
    'mountaintop': '/Images/mapTypes/Mountaintop.webp',
    'noklateo': '/Images/mapTypes/Noklateo, the Shrouded City.webp',
    'rotted': '/Images/mapTypes/Rotted Woods.webp'
  },
  zoom: {
    mobile: { min: 0, max: 3, snap: 0.10, delta: 0.10 },
    desktop: { min: 0, max: 2, snap: 0.10, delta: 0.10 }
  },
  iconSizes: {
    mobile: { base: 24, nightlord: 36, multiplier: 1.0 },
    desktop: { base: 32, nightlord: 48, multiplier: 1.3 }
  },
  container: {
    defaultSize: 1000,
    aspectRatio: '1',
    style: {
      height: 'calc(100vh - 160px)',
      width: 'min(100vw, calc(100vh - 160px))',
      touchAction: 'none' as const,
      background: 'transparent'
    }
  },
  leaflet: {
    crs: 'Simple' as const,
    attributionControl: false,
    animations: {
      panInsideBounds: false
    }
  }
}

export type MapType = 'normal' | 'crater' | 'mountaintop' | 'noklateo' | 'rotted'

export const getMapImage = (mapType: MapType): string => {
  return MAP_CONFIG.images[mapType]
}

export const getZoomConfig = (isMobile: boolean) => {
  return isMobile ? MAP_CONFIG.zoom.mobile : MAP_CONFIG.zoom.desktop
}

export const getIconSizes = (isMobile: boolean) => {
  return isMobile ? MAP_CONFIG.iconSizes.mobile : MAP_CONFIG.iconSizes.desktop
}

// Re-export all map utilities for convenience (excluding mapUtils that depends on Legacy components)
// export * from './mapUtils'
export * from './iconUtils'
export * from './coordinateUtils'
export * from './mapFactory'
export * from './markerUtils'
export * from './performanceUtils'
export * from './validationUtils'