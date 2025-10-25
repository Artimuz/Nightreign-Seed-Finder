export const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;

  const criticalImages = [
    '/Images/buildingIcons/empty.webp',
    '/Images/buildingIcons/church.webp',
    '/Images/buildingIcons/fort.webp',
    '/Images/mapTypes/map_icon/normalIcon.webp',
    '/Images/Title_n_.webp'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const getCachedSeedImage = (seedId: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`seed_${seedId}`);
};

export const cacheSeedImage = (seedId: string, imageData: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`seed_${seedId}`, imageData);
  } catch (e) {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('seed_'));
    keys.slice(0, 10).forEach(key => localStorage.removeItem(key));
  }
};