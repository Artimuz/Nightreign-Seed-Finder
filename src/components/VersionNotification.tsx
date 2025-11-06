'use client'

import { useVersionCheck } from '@/hooks/useVersionCheck'
import { useState } from 'react'

export default function VersionNotification() {
  const { needsUpdate, serverVersion, currentVersion, versionHistory, latestFeatures, clearUpdateFlag, checkVersion, isChecking } = useVersionCheck()
  const [showDetails, setShowDetails] = useState(false)

  if (!needsUpdate) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-blue-600 text-white p-4 rounded-lg shadow-lg border border-blue-500">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Update Available</h3>
            <p className="text-xs opacity-90 mb-2">
              Version {serverVersion} is now available
            </p>
            <p className="text-xs opacity-75 mb-3">
              Current: {currentVersion}
            </p>
            
            {latestFeatures.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium mb-1">New Features:</p>
                <ul className="text-xs opacity-90 space-y-1">
                  {latestFeatures.slice(0, 2).map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            onClick={clearUpdateFlag}
            className="text-white/70 hover:text-white text-lg leading-none ml-2"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
        
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => window.location.reload()}
            className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
          >
            Refresh Now
          </button>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-white/80 hover:text-white transition-colors"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
          
          <button
            onClick={checkVersion}
            disabled={isChecking}
            className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
          >
            {isChecking ? 'Checking...' : 'Recheck'}
          </button>
        </div>
        
        {showDetails && versionHistory && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs font-medium mb-2">Recent Updates:</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {versionHistory.slice(0, 3).map((version) => (
                <div key={version.version} className="text-xs">
                  <div className="font-medium">{version.version}</div>
                  <div className="opacity-75 text-xs">{version.released}</div>
                  <ul className="opacity-90 mt-1">
                    {version.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="mr-1">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}