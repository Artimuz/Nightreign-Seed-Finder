
export const MAP_CONFIG = {
  MAX_SIZE: 1150,
  ORIGINAL_SIZE: 1000,
  ICON_SCALE_RATIO: 0.05,
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
  }
} as const;
export const getResponsiveMapSize = (viewportWidth: number, viewportHeight: number): number => {
  const maxSize = MAP_CONFIG.MAX_SIZE;
  const reservedHeight = 60 + 48 + 48;
  const availableWidth = viewportWidth * 0.9;
  const availableHeight = viewportHeight - reservedHeight;
  const availableSpace = Math.min(availableWidth, availableHeight);
  return Math.min(maxSize, Math.max(280, availableSpace));
};
export const getIconScale = (mapSize: number, multiplier: number = 1): number => {
  const baseScale = mapSize * MAP_CONFIG.ICON_SCALE_RATIO;
  return Math.round(baseScale * multiplier);
};