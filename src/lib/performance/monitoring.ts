
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackApiCall(endpoint: string, duration: number) {
    const key = `api_${endpoint}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key)!;
    metrics.push(duration);

    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  trackRender(componentName: string, duration: number) {
    const key = `render_${componentName}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key)!;
    metrics.push(duration);
    
    if (metrics.length > 50) {
      metrics.shift();
    }
  }

  getStats(metricKey: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const metrics = this.metrics.get(metricKey);
    if (!metrics || metrics.length === 0) return null;

    const average = metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
    const min = Math.min(...metrics);
    const max = Math.max(...metrics);

    return { average, min, max, count: metrics.length };
  }

  initWebVitals() {
    if (typeof window === 'undefined') return;

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint') {
            this.trackMetric('LCP', entry.startTime);
          } else if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            this.trackMetric('FID', (fidEntry as unknown as { processingStart: number }).processingStart - entry.startTime);
          } else if (entry.entryType === 'layout-shift') {
            const clsEntry = entry as PerformanceEventTiming;
            const hasRecentInput = (clsEntry as unknown as { hadRecentInput: boolean }).hadRecentInput;
            if (!hasRecentInput) {
              this.trackMetric('CLS', (clsEntry as unknown as { value: number }).value);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.trackMetric('TTFB', navigation.responseStart - navigation.requestStart);
      this.trackMetric('DOMLoad', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      this.trackMetric('PageLoad', navigation.loadEventEnd - navigation.fetchStart);
    });
  }

  private trackMetric(name: string, value: number) {
    const key = `webvital_${name}`;
    if (!this.metrics.has(key)) {
      this.metrics.set(key, []);
    }
    
    const metrics = this.metrics.get(key)!;
    metrics.push(value);
    
    if (metrics.length > 20) {
      metrics.shift();
    }

    if (name === 'LCP' && value > 2500) {
      console.warn(`Poor LCP: ${value}ms`);
    } else if (name === 'FID' && value > 100) {
      console.warn(`Poor FID: ${value}ms`);
    } else if (name === 'CLS' && value > 0.1) {
      console.warn(`Poor CLS: ${value}`);
    }
  }

  getAllMetrics(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const [key] of this.metrics.entries()) {
      result[key] = this.getStats(key);
    }
    
    return result;
  }

  clearMetrics() {
    this.metrics.clear();
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const measureAsync = async <T>(
  name: string,
  operation: () => Promise<T>
): Promise<T> => {
  const start = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().trackApiCall(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().trackApiCall(`${name}_error`, duration);
    throw error;
  }
};

export const measureSync = <T>(
  name: string,
  operation: () => T
): T => {
  const start = performance.now();
  try {
    const result = operation();
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().trackRender(name, duration);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    PerformanceMonitor.getInstance().trackRender(`${name}_error`, duration);
    throw error;
  }
};

export const usePerformanceTracking = () => {
  const monitor = PerformanceMonitor.getInstance();
  
  return {
    trackApiCall: monitor.trackApiCall.bind(monitor),
    trackRender: monitor.trackRender.bind(monitor),
    getStats: monitor.getStats.bind(monitor),
    getAllMetrics: monitor.getAllMetrics.bind(monitor),
  };
};