
export const BACKGROUND_ANIMATION_CONFIG = {
  height: {
    min: 1000,
    max: 2000,
  },
  blur: {
    intensity: 0.3,
    min: 0,
    max: 8,
  },
  saturation: {
    intensity: 0.4,
    min: 0.8,
    max: 1.4,
  },
  hue: {
    intensity: 0.2,
    min: -15,
    max: 15,
  },
  zoom: {
    intensity: 0.1,
    min: 1.0,
    max: 1.2,
  },
  durations: {
    blur: 8,
    saturation: 12,
    hue: 15,
    zoom: 20,
  },
  easing: 'ease-in-out',
  position: {
    objectFit: 'cover' as const,
    objectPosition: 'center' as const,
  }
} as const;
export const calculateResponsiveHeight = (): number => {
  if (typeof window === 'undefined') return BACKGROUND_ANIMATION_CONFIG.height.max;
  const viewportHeight = window.innerHeight;
  const { min, max } = BACKGROUND_ANIMATION_CONFIG.height;
  const scaleFactor = Math.min(Math.max(viewportHeight / 1080, 0.5), 2);
  return Math.max(min, Math.min(max, min + (max - min) * scaleFactor));
};