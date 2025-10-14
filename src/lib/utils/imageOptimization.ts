
export const generateResponsiveSizes = (
  breakpoints: { width: number; size: string }[]
): string => {
  return breakpoints
    .map(({ width, size }) => `(max-width: ${width}px) ${size}`)
    .join(', ');
};

export const getOptimalImageSize = (
  containerWidth: number,
  containerHeight: number,
  aspectRatio: number = 1
): { width: number; height: number } => {
  if (containerWidth / containerHeight > aspectRatio) {
    return {
      width: Math.round(containerHeight * aspectRatio),
      height: containerHeight,
    };
  } else {
    return {
      width: containerWidth,
      height: Math.round(containerWidth / aspectRatio),
    };
  }
};

export const preloadCriticalImages = (imageSrcs: string[]) => {
  if (typeof window === 'undefined') return;
  
  imageSrcs.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const createBlurDataURL = (width: number = 8, height: number = 8): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#f3f4f6');
  gradient.addColorStop(1, '#e5e7eb');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.1);
};

export const IMAGE_QUALITY_PRESETS = {
  high: 95,
  medium: 85,
  low: 75,
  thumbnail: 60,
} as const;

export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1920,
} as const;

export const COMMON_SIZES = {
  mapCard: generateResponsiveSizes([
    { width: RESPONSIVE_BREAKPOINTS.mobile, size: '100vw' },
    { width: RESPONSIVE_BREAKPOINTS.tablet, size: '50vw' },
    { width: RESPONSIVE_BREAKPOINTS.desktop, size: '500px' },
  ]),
  gameMap: generateResponsiveSizes([
    { width: RESPONSIVE_BREAKPOINTS.mobile, size: '90vw' },
    { width: RESPONSIVE_BREAKPOINTS.tablet, size: '70vw' },
    { width: RESPONSIVE_BREAKPOINTS.desktop, size: '900px' },
  ]),
  icon: generateResponsiveSizes([
    { width: RESPONSIVE_BREAKPOINTS.mobile, size: '48px' },
    { width: RESPONSIVE_BREAKPOINTS.tablet, size: '64px' },
    { width: RESPONSIVE_BREAKPOINTS.desktop, size: '64px' },
  ]),
} as const;