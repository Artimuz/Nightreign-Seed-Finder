import { UpdatePreferences } from './types'

const STORAGE_KEY = 'seedfinder-update-preferences'

const defaultPreferences: UpdatePreferences = {
  dismissedUpdates: [],
  showUpdateModals: true,
  lastDismissalDate: undefined,
  lastManualView: undefined,
  lastSeenUpdate: undefined
}

let isLocalStorageBlocked = false
let memoryPreferences: UpdatePreferences = { ...defaultPreferences }

export const getUpdatePreferences = (): UpdatePreferences => {
  if (typeof window === 'undefined') return defaultPreferences
  
  // If localStorage is blocked, use memory fallback
  if (isLocalStorageBlocked) {
    return { ...memoryPreferences }
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return defaultPreferences
    
    const parsed = JSON.parse(stored)
    return { ...defaultPreferences, ...parsed }
  } catch (error) {
    console.warn('localStorage access failed, using memory fallback:', error)
    isLocalStorageBlocked = true
    return { ...memoryPreferences }
  }
}

export const saveUpdatePreferences = (preferences: UpdatePreferences): void => {
  if (typeof window === 'undefined') return
  
  // Always update memory fallback
  memoryPreferences = { ...preferences }
  
  // If localStorage is known to be blocked, don't try again
  if (isLocalStorageBlocked) {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  } catch (error) {
    console.warn('localStorage save failed, falling back to memory storage:', error)
    isLocalStorageBlocked = true
  }
}

export const dismissUpdate = (updateId: string): void => {
  const preferences = getUpdatePreferences()
  if (!preferences.dismissedUpdates.includes(updateId)) {
    preferences.dismissedUpdates.push(updateId)
    preferences.lastDismissalDate = new Date().toISOString()
    saveUpdatePreferences(preferences)
  }
}

export const markAllUpdatesAsRead = (updateIds: string[]): void => {
  const preferences = getUpdatePreferences()
  const newDismissed = [...new Set([...preferences.dismissedUpdates, ...updateIds])]
  
  saveUpdatePreferences({
    ...preferences,
    dismissedUpdates: newDismissed,
    lastSeenUpdate: updateIds[0],
    lastDismissalDate: new Date().toISOString()
  })
}

export const setLastManualView = (updateId: string): void => {
  const preferences = getUpdatePreferences()
  saveUpdatePreferences({
    ...preferences,
    lastManualView: updateId
  })
}

export const clearAllPreferences = (): void => {
  if (typeof window === 'undefined') return
  
  // Clear memory fallback
  memoryPreferences = { ...defaultPreferences }
  
  // Clear localStorage if available
  if (!isLocalStorageBlocked) {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
      isLocalStorageBlocked = true
    }
  }
}