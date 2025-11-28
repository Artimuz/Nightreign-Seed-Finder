'use client'

import { useState, useEffect, useCallback } from 'react'
import { UpdatePost, UpdateDisplayMode, UpdateModalState } from '@/lib/updates/types'
import { 
  getUpdatePreferences, 
  dismissUpdate, 
  markAllUpdatesAsRead, 
  setLastManualView 
} from '@/lib/updates/storage'
import { getAllUpdates, getUnseenUpdates } from '@/lib/updates/updateManager'

export const useUpdateNotifications = () => {
  const [modalState, setModalState] = useState<UpdateModalState>({
    isOpen: false,
    currentIndex: 0,
    mode: 'automatic',
    updates: []
  })

  const [hasUnseenUpdates, setHasUnseenUpdates] = useState(false)

  const checkForUpdates = useCallback(() => {
    const preferences = getUpdatePreferences()
    const unseenUpdates = getUnseenUpdates(preferences.dismissedUpdates)
    setHasUnseenUpdates(unseenUpdates.length > 0)
    return unseenUpdates
  }, [])

  const showAutomaticModal = useCallback(() => {
    const unseenUpdates = checkForUpdates()
    if (unseenUpdates.length > 0) {
      setModalState({
        isOpen: true,
        currentIndex: 0,
        mode: 'automatic',
        updates: unseenUpdates
      })
    }
  }, [checkForUpdates])

  const triggerUpdateModal = useCallback(() => {
    const allUpdates = getAllUpdates()
    setModalState({
      isOpen: true,
      currentIndex: 0,
      mode: 'manual',
      updates: allUpdates
    })
  }, [])

  const closeModal = useCallback(() => {
    if (modalState.mode === 'manual' && modalState.updates.length > 0) {
      setLastManualView(modalState.updates[modalState.currentIndex].id)
    }
    
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }))
  }, [modalState.mode, modalState.updates, modalState.currentIndex])

  const goToNext = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      currentIndex: Math.min(prev.currentIndex + 1, prev.updates.length - 1)
    }))
  }, [])

  const goToPrevious = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      currentIndex: Math.max(prev.currentIndex - 1, 0)
    }))
  }, [])

  const dismissCurrentUpdate = useCallback(() => {
    if (modalState.updates[modalState.currentIndex]) {
      const currentUpdate = modalState.updates[modalState.currentIndex]
      dismissUpdate(currentUpdate.id)
      
      const remainingUpdates = modalState.updates.filter((_, index) => index !== modalState.currentIndex)
      
      if (remainingUpdates.length === 0) {
        closeModal()
      } else {
        setModalState(prev => ({
          ...prev,
          updates: remainingUpdates,
          currentIndex: Math.min(prev.currentIndex, remainingUpdates.length - 1)
        }))
      }
      
      checkForUpdates()
    }
  }, [modalState.updates, modalState.currentIndex, closeModal, checkForUpdates])

  const markAllAsRead = useCallback(() => {
    if (modalState.updates.length > 0) {
      const updateIds = modalState.updates.map(update => update.id)
      markAllUpdatesAsRead(updateIds)
      closeModal()
      checkForUpdates()
    }
  }, [modalState.updates, closeModal, checkForUpdates])

  const getCurrentUpdate = useCallback((): UpdatePost | null => {
    return modalState.updates[modalState.currentIndex] || null
  }, [modalState.updates, modalState.currentIndex])

  const canGoNext = modalState.currentIndex < modalState.updates.length - 1
  const canGoPrevious = modalState.currentIndex > 0
  const isLastUpdate = modalState.currentIndex === modalState.updates.length - 1
  const isFirstUpdate = modalState.currentIndex === 0

  useEffect(() => {
    checkForUpdates()
  }, [checkForUpdates])

  return {
    modalState,
    hasUnseenUpdates,
    showAutomaticModal,
    triggerUpdateModal,
    closeModal,
    goToNext,
    goToPrevious,
    dismissCurrentUpdate,
    markAllAsRead,
    getCurrentUpdate,
    canGoNext,
    canGoPrevious,
    isLastUpdate,
    isFirstUpdate,
    checkForUpdates
  }
}