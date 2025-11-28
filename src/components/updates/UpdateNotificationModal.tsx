'use client'

import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import UpdatePost from './UpdatePost'
import UpdateNavigation from './UpdateNavigation'
import { getUpdatePreferences } from '@/lib/updates/storage'
import { UpdateModalState, UpdatePost as UpdatePostType } from '@/lib/updates/types'

interface UpdateNotificationModalProps {
  isOpen: boolean
  onClose: () => void
  modalState: UpdateModalState
  goToNext: () => void
  goToPrevious: () => void
  dismissCurrentUpdate: () => void
  getCurrentUpdate: () => UpdatePostType | null
  canGoNext: boolean
  canGoPrevious: boolean
}

export default function UpdateNotificationModal({ 
  isOpen, 
  onClose,
  modalState,
  goToNext,
  goToPrevious,
  dismissCurrentUpdate,
  getCurrentUpdate,
  canGoNext,
  canGoPrevious
}: UpdateNotificationModalProps) {
  const currentUpdate = getCurrentUpdate()

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return
    
    switch (e.key) {
      case 'Escape':
        handleClose()
        break
      case 'ArrowLeft':
        if (canGoPrevious) goToPrevious()
        break
      case 'ArrowRight':
        if (canGoNext) goToNext()
        break
    }
  }, [isOpen, handleClose, canGoPrevious, canGoNext, goToPrevious, goToNext])

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }, [handleClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      
      const focusableElement = document.querySelector('[data-focus-trap]') as HTMLElement
      if (focusableElement) {
        focusableElement.focus()
      }
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen || !currentUpdate) return null

  const preferences = getUpdatePreferences()
  const isDismissed = preferences.dismissedUpdates.includes(currentUpdate.id)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-4xl mx-4 h-[80vh] max-h-[80vh] bg-black/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-600/50 overflow-hidden flex flex-col"
          data-focus-trap
          tabIndex={-1}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-600/50 bg-black/80 flex-shrink-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-white">
                {modalState.mode === 'automatic' ? 'New Updates Available' : 'Update History'}
              </h1>
              {modalState.mode === 'automatic' && (
                <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                  {modalState.updates.length} new
                </span>
              )}
            </div>
            
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white text-xl p-2 hover:bg-gray-600 rounded transition-colors"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              <UpdatePost 
                update={currentUpdate}
                isManualMode={modalState.mode === 'manual'}
                isDismissed={isDismissed}
              />
            </div>
          </div>
          
          {/* Footer Navigation */}
          <div className="p-4 bg-black/80 border-t border-gray-600/50 flex-shrink-0">
            <UpdateNavigation
              mode={modalState.mode}
              currentIndex={modalState.currentIndex}
              totalUpdates={modalState.updates.length}
              canGoNext={canGoNext}
              canGoPrevious={canGoPrevious}
              onNext={goToNext}
              onPrevious={goToPrevious}
              onDismissUpdate={dismissCurrentUpdate}
              onClose={handleClose}
              currentUpdateId={currentUpdate.id}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}