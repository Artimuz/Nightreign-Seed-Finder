'use client'
import { useEffect } from 'react';
import { PerformanceMonitor } from '@/lib/performance/monitoring';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  useEffect(() => {
    // Initialize performance monitoring
    const monitor = PerformanceMonitor.getInstance();
    monitor.initWebVitals();

    // Preload critical images for better LCP
    const criticalImages = [
      '/Images/BG2.webp',
      '/Images/Title_n.webp',
      '/Images/viewIcon.webp',
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Performance metrics logging removed for better performance

    return () => monitor.cleanup();
  }, []);

  return <>{children}</>;
};