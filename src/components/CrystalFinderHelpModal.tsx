'use client'

import { createPortal } from 'react-dom'
import { useCallback, useEffect } from 'react'
import { buildingIcons } from '@/lib/constants/icons'

interface CrystalFinderHelpModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CrystalFinderHelpModal({ isOpen, onClose }: CrystalFinderHelpModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    if (e.key === 'Escape') onClose()
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [handleKeyDown, isOpen])

  if (!isOpen) return null

  const overlay = (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg mx-4 rounded-lg shadow-2xl overflow-hidden flex flex-col bg-black/95 border border-gray-600/50">
        <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-black/80">
          <h2 className="text-lg font-semibold text-white">Crystal Finder Help</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-xl px-2" aria-label="Close modal">×</button>
        </div>
        <div className="p-4 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-custom">
          <div className="text-sm text-gray-200 leading-relaxed">
            Mark the Crystals you find and the pattern will be formed automatically.
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-semibold">Labeling</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-3 rounded-md border border-gray-700/60 bg-black/60 px-3 py-2">
                <img src={buildingIcons.possibleCrystal} alt="Possible Crystal" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff) drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
                <div className="text-sm text-gray-200">There is a chance you will find a Crystal in that location.</div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-gray-700/60 bg-black/60 px-3 py-2">
                <img src={buildingIcons.brokenCrystal} alt="Confirmed Crystal" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff) drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
                <div className="text-sm text-gray-200">You already found or broke this Crystal.</div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-gray-700/60 bg-black/60 px-3 py-2">
                <img src={buildingIcons.Crystal} alt="Guaranteed Crystal" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff) drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
                <div className="text-sm text-gray-200">There will be a guaranteed Crystal here.</div>
              </div>
              <div className="flex items-center gap-3 rounded-md border border-gray-700/60 bg-black/60 px-3 py-2">
                <img src={buildingIcons.CrystalUnder} alt="Underground Crystal" className="w-14 h-14 object-contain" style={{ filter: 'drop-shadow(1px 0 0 #fff) drop-shadow(-1px 0 0 #fff) drop-shadow(0 1px 0 #fff) drop-shadow(0 -1px 0 #fff) drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' }} />
                <div className="text-sm text-gray-200">The arrow indicates that the location is underground.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (typeof window === 'undefined') return overlay
  return createPortal(overlay, document.body)
}
