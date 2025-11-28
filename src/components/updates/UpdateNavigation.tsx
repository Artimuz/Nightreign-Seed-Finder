'use client'

import { UpdateDisplayMode } from '@/lib/updates/types'
import { getUpdatePreferences } from '@/lib/updates/storage'

interface UpdateNavigationProps {
  mode: UpdateDisplayMode
  currentIndex: number
  totalUpdates: number
  canGoNext: boolean
  canGoPrevious: boolean
  onNext: () => void
  onPrevious: () => void
  onDismissUpdate: () => void
  onClose: () => void
  currentUpdateId: string
}

export default function UpdateNavigation({
  mode,
  currentIndex,
  totalUpdates,
  canGoNext,
  canGoPrevious,
  onNext,
  onPrevious,
  onDismissUpdate,
  onClose,
  currentUpdateId
}: UpdateNavigationProps) {
  const isDismissed = mode === 'manual' ? 
    getUpdatePreferences().dismissedUpdates.includes(currentUpdateId) : false

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {currentIndex + 1} of {totalUpdates}
        </span>
        
        {/* Progress dots */}
        <div className="flex gap-1 ml-2">
          {Array.from({ length: Math.min(totalUpdates, 5) }, (_, index) => {
            let dotIndex = index
            if (totalUpdates > 5) {
              if (currentIndex < 3) {
                dotIndex = index
              } else if (currentIndex >= totalUpdates - 2) {
                dotIndex = totalUpdates - 5 + index
              } else {
                dotIndex = currentIndex - 2 + index
              }
            }
            
            return (
              <div
                key={dotIndex}
                className={`w-2 h-2 rounded-full transition-colors ${
                  dotIndex === currentIndex
                    ? 'bg-blue-500'
                    : dotIndex < currentIndex
                    ? 'bg-green-500'
                    : 'bg-gray-600'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Navigation and Action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Previous/Next navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-3 py-2 bg-gray-700/80 text-white rounded hover:bg-gray-600/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            Previous
          </button>
          
          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-3 py-2 bg-gray-700/80 text-white rounded hover:bg-gray-600/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
          >
            Next
          </button>
        </div>

        {/* Action buttons for automatic mode */}
        {mode === 'automatic' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onDismissUpdate}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-sm font-medium"
            >
              Don&apos;t show me again
            </button>
          </div>
        )}

        {/* Manual mode indicator */}
        {mode === 'manual' && isDismissed && (
          <div className="flex items-center">
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              Previously dismissed
            </span>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white text-2xl leading-none p-2 hover:bg-gray-700/50 rounded transition-all duration-200"
        aria-label="Close updates"
      >
        ×
      </button>
    </div>
  )
}