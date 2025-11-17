import L from 'leaflet'
import { buildingIcons, nightlordIcons } from '@/lib/constants/icons'
import { MAP_CONFIG } from './config'

export interface IconSize {
  width: number
  height: number
  anchor: [number, number]
  popupAnchor: [number, number]
}

export function getIconPath(building: string, isNightlord: boolean = false): string {
  if (!building || building === 'empty' || building === '') {
    return isNightlord ? nightlordIcons.empty : buildingIcons.empty
  }

  if (building.match(/^\d+_/)) {
    return nightlordIcons[building] || nightlordIcons.empty
  }
  
  return buildingIcons[building] || buildingIcons.empty
}

export function calculateIconSize(
  containerSize: number, 
  zoom: number = 0, 
  isMobile: boolean = false,
  isNightlord: boolean = false
): IconSize {
  const config = isMobile ? MAP_CONFIG.iconSizes.mobile : MAP_CONFIG.iconSizes.desktop
  const baseSize = isNightlord ? config.nightlord : config.base
  
  // Calculate responsive size based on container
  const containerWidth = containerSize || MAP_CONFIG.container.defaultSize
  const responsiveSize = Math.max(baseSize, containerWidth * 0.04)
  
  // Apply zoom scaling
  const zoomScale = Math.max(1.0, 1.0 + (zoom * 0.5))
  const finalSize = Math.round(responsiveSize * zoomScale)
  
  // Apply nightlord multiplier
  const multipliedSize = isNightlord ? finalSize * 1.5 : finalSize
  
  return {
    width: multipliedSize,
    height: multipliedSize,
    anchor: [multipliedSize / 2, multipliedSize / 2],
    popupAnchor: [0, -multipliedSize / 2]
  }
}

export function createMarkerIcon(iconUrl: string, iconSize: IconSize): L.Icon {
  return L.icon({
    iconUrl,
    iconSize: [iconSize.width, iconSize.height],
    iconAnchor: iconSize.anchor,
    popupAnchor: iconSize.popupAnchor
  })
}

export function createDivIcon(
  html: string, 
  iconSize: IconSize, 
  className: string = ''
): L.DivIcon {
  return L.divIcon({
    html,
    className,
    iconSize: [iconSize.width, iconSize.height],
    iconAnchor: iconSize.anchor,
    popupAnchor: iconSize.popupAnchor
  })
}

export function getEventIconSize(containerSize: number): IconSize {
  const size = Math.round(containerSize * 0.16)
  return {
    width: size,
    height: size,
    anchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  }
}

export function createGhostIconStyle(baseOpacity: number = 0.67): string {
  return `
    opacity: ${baseOpacity};
    filter: saturate(100%) brightness(2) blur(0.5px) drop-shadow(0 6px 18px rgb(65, 138, 248));
    animation: ghosty 4.5s ease-in-out infinite;
  `
}

export function updateMarkerIcon(
  marker: L.Marker,
  iconUrl: string,
  iconSize: IconSize
): void {
  const newIcon = createMarkerIcon(iconUrl, iconSize)
  marker.setIcon(newIcon)
}

export function setMarkerGhost(marker: L.Marker, isGhost: boolean): void {
  const element = marker.getElement()
  if (element) {
    if (isGhost) {
      element.classList.add('ghost-icon')
    } else {
      element.classList.remove('ghost-icon')
    }
  }
}

export function setMarkerVisibility(
  marker: L.Marker, 
  visible: boolean, 
  opacity: number = 1
): void {
  const element = marker.getElement()
  if (element) {
    if (visible) {
      element.style.display = ''
      element.style.setProperty('opacity', opacity.toString(), 'important')
    } else {
      element.style.display = 'none'
    }
  }
}