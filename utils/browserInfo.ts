import { BrowserInfo } from '../types';

export const getBrowserInfo = (): BrowserInfo => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      userAgent: 'server',
      language: 'en',
      platform: 'server',
      cookieEnabled: false,
      onLine: false,
      viewport: { width: 0, height: 0 },
      screen: { width: 0, height: 0, colorDepth: 0 },
    };
  }

  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth,
    },
  };
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};