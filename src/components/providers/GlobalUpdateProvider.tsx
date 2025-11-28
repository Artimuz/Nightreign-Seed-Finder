'use client'

import { createContext, useContext } from 'react'
import { UpdateNotificationModal } from '@/components/updates'
import { useUpdateNotifications } from '@/hooks/useUpdateNotifications'

const GlobalUpdateContext = createContext<{
  triggerUpdateModal: () => void
  showAutomaticModal: () => void
} | null>(null)

export const useGlobalUpdateContext = () => {
  const context = useContext(GlobalUpdateContext)
  if (!context) {
    throw new Error('useGlobalUpdateContext must be used within GlobalUpdateProvider')
  }
  return context
}

export function GlobalUpdateProvider({ children }: { children: React.ReactNode }) {
  const {
    modalState,
    closeModal,
    triggerUpdateModal,
    showAutomaticModal,
    goToNext,
    goToPrevious,
    dismissCurrentUpdate,
    getCurrentUpdate,
    canGoNext,
    canGoPrevious
  } = useUpdateNotifications()

  return (
    <GlobalUpdateContext.Provider value={{ triggerUpdateModal, showAutomaticModal }}>
      {children}
      <UpdateNotificationModal 
        isOpen={modalState.isOpen} 
        onClose={closeModal}
        modalState={modalState}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        dismissCurrentUpdate={dismissCurrentUpdate}
        getCurrentUpdate={getCurrentUpdate}
        canGoNext={canGoNext}
        canGoPrevious={canGoPrevious}
      />
    </GlobalUpdateContext.Provider>
  )
}