'use client'

import { useVersionCheck } from '@/hooks/useVersionCheck'

export default function VersionStatus() {
  const { 
    currentVersion, 
    serverVersion, 
    lastChecked, 
    isChecking, 
    error, 
    timeUntilNextCheck,
    checkVersion 
  } = useVersionCheck()

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60))
    const seconds = Math.floor((ms % (1000 * 60)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <div className="bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm">
        <div className="space-y-1">
          <div>Version: {currentVersion}</div>
          {serverVersion && (
            <div>Server: {serverVersion}</div>
          )}
          {lastChecked && (
            <div>
              Last check: {new Date(lastChecked).toLocaleTimeString()}
            </div>
          )}
          {timeUntilNextCheck > 0 && (
            <div>
              Next check: {formatTime(timeUntilNextCheck)}
            </div>
          )}
          {isChecking && (
            <div className="text-blue-400">Checking...</div>
          )}
          {error && (
            <div className="text-red-400">Error: {error}</div>
          )}
          <button
            onClick={checkVersion}
            disabled={isChecking}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-50"
          >
            Check Now
          </button>
        </div>
      </div>
    </div>
  )
}