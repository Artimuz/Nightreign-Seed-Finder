'use client'
import { useEffect } from 'react';
import { PerformanceMonitor } from '@/lib/performance/monitoring';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({ children }) => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.initWebVitals();

    return () => monitor.cleanup();
  }, []);

  return <>{children}</>;
};