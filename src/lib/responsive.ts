export type ViewportSize = {
  width: number
  height: number
}

export function isMobileLayout(viewport: ViewportSize): boolean {
  const { width, height } = viewport
  const isPhoneWidth = width <= 768
  const isPortraitTablet = width <= 1180 && height > width
  return isPhoneWidth || isPortraitTablet
}

export function getViewportSizeFromWindow(): ViewportSize {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}
