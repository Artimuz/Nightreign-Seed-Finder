import L from 'leaflet'

// Performance optimization utilities for map rendering and interactions

export interface PerformanceConfig {
  enableDebounce?: boolean
  debounceDelay?: number
  enableThrottle?: boolean
  throttleDelay?: number
  enableVirtualization?: boolean
  maxVisibleMarkers?: number
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let isThrottled = false
  
  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args)
      isThrottled = true
      setTimeout(() => {
        isThrottled = false
      }, delay)
    }
  }
}

export function createDebouncedZoomHandler(
  onZoom: (zoom: number) => void,
  delay: number = 150
): (zoom: number) => void {
  return debounce(onZoom as (...args: unknown[]) => unknown, delay) as (zoom: number) => void
}

export function createThrottledPanHandler(
  onPan: () => void,
  delay: number = 100
): () => void {
  return throttle(onPan as (...args: unknown[]) => unknown, delay) as () => void
}

export function batchMarkerUpdates(
  markers: L.Marker[],
  updateFn: (marker: L.Marker) => void
): void {
  // Batch DOM updates for better performance
  const fragment = document.createDocumentFragment()
  
  markers.forEach(marker => {
    const element = marker.getElement()
    if (element && element.parentNode) {
      fragment.appendChild(element.parentNode.removeChild(element))
      updateFn(marker)
      fragment.appendChild(element)
    } else {
      updateFn(marker)
    }
  })
}

export function optimizeMarkerVisibility(
  markers: Map<string, L.Marker>,
  visibleBounds: L.LatLngBounds,
  maxVisible: number = 50
): void {
  let visibleCount = 0
  
  markers.forEach((marker, id) => {
    const position = marker.getLatLng()
    const isInBounds = visibleBounds.contains(position)
    const shouldShow = isInBounds && visibleCount < maxVisible
    
    const element = marker.getElement()
    if (element) {
      element.style.display = shouldShow ? '' : 'none'
      if (shouldShow) visibleCount++
    }
  })
}

export function preloadImages(imageUrls: string[]): Promise<void[]> {
  const promises = imageUrls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
      img.src = url
    })
  })
  
  return Promise.all(promises)
}

export function createImageCache(): {
  set: (key: string, url: string) => Promise<void>
  get: (key: string) => string | undefined
  preload: (entries: Record<string, string>) => Promise<void>
} {
  const cache = new Map<string, string>()
  const loadingPromises = new Map<string, Promise<void>>()
  
  return {
    set: async (key: string, url: string) => {
      if (loadingPromises.has(key)) {
        await loadingPromises.get(key)
        return
      }
      
      const promise = new Promise<void>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          cache.set(key, url)
          loadingPromises.delete(key)
          resolve()
        }
        img.onerror = () => {
          loadingPromises.delete(key)
          reject(new Error(`Failed to cache image: ${url}`))
        }
        img.src = url
      })
      
      loadingPromises.set(key, promise)
      await promise
    },
    
    get: (key: string) => cache.get(key),
    
    preload: async function(entries: Record<string, string>) {
      const promises = Object.entries(entries).map(([key, url]) => 
        cache.has(key) ? Promise.resolve() : this.set(key, url)
      )
      await Promise.all(promises)
    }
  }
}

export function measurePerformance<T>(
  label: string,
  fn: () => T
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  return result
}

export async function measureAsyncPerformance<T>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  
  return result
}

export function createFrameRateLimiter(targetFPS: number = 60): {
  shouldUpdate: () => boolean
  reset: () => void
} {
  const frameInterval = 1000 / targetFPS
  let lastFrameTime = 0
  
  return {
    shouldUpdate: () => {
      const now = performance.now()
      if (now - lastFrameTime >= frameInterval) {
        lastFrameTime = now
        return true
      }
      return false
    },
    reset: () => {
      lastFrameTime = 0
    }
  }
}

export function optimizeReactUpdates<T>(
  dependencies: T[],
  computeFn: () => unknown,
  isEqual: (a: T, b: T) => boolean = (a, b) => a === b
): unknown {
  // Memoization helper for React components
  const memoKey = dependencies.map(dep => 
    typeof dep === 'object' ? JSON.stringify(dep) : String(dep)
  ).join('|')
  
  return computeFn()
}