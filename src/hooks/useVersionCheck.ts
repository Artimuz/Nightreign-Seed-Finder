'use client'

import { useState, useEffect, useCallback } from 'react'
import { APP_VERSION } from '@/lib/constants/version'

interface VersionResponse {
  version: string
  timestamp: number
  needs_update: boolean
  client_version: string | null
  version_history?: Array<{
    version: string
    released: string
    features: string[]
  }>
  latest_features?: string[]
}

interface VersionCheckState {
  currentVersion: string | null
  serverVersion: string | null
  needsUpdate: boolean
  lastChecked: number | null
  isChecking: boolean
  error: string | null
  versionHistory: VersionResponse['version_history']
  latestFeatures: string[]
}

const STORAGE_KEY = 'nightreign_version_check'
const CHECK_INTERVAL = 60 * 60 * 1000
const CLIENT_VERSION = APP_VERSION

export function useVersionCheck() {
  const [state, setState] = useState<VersionCheckState>({
    currentVersion: CLIENT_VERSION,
    serverVersion: null,
    needsUpdate: false,
    lastChecked: null,
    isChecking: false,
    error: null,
    versionHistory: [],
    latestFeatures: []
  })

  const checkVersion = useCallback(async (detailed = false) => {
    try {
      setState(prev => ({ ...prev, isChecking: true, error: null }))
      
      const params = new URLSearchParams({
        client_version: CLIENT_VERSION,
        ...(detailed && { detailed: 'true' })
      })
      
      const response = await fetch(`/api/version?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data: VersionResponse = await response.json()
      
      setState(prev => ({
        ...prev,
        serverVersion: data.version,
        needsUpdate: data.needs_update,
        lastChecked: Date.now(),
        isChecking: false,
        versionHistory: data.version_history || prev.versionHistory,
        latestFeatures: data.latest_features || prev.latestFeatures
      }))
      
      const checkData = {
        lastChecked: Date.now(),
        serverVersion: data.version,
        needsUpdate: data.needs_update
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkData))
      
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Version check failed'
      setState(prev => ({ 
        ...prev, 
        isChecking: false, 
        error: errorMessage 
      }))
      console.error('Version check failed:', error)
      throw error
    }
  }, [])

  const shouldCheck = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return true
      
      const { lastChecked } = JSON.parse(stored)
      return Date.now() - lastChecked > CHECK_INTERVAL
    } catch {
      return true
    }
  }, [])

  const loadStoredData = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setState(prev => ({
          ...prev,
          serverVersion: data.serverVersion,
          needsUpdate: data.needsUpdate,
          lastChecked: data.lastChecked
        }))
      }
    } catch (error) {
      console.error('Failed to load stored version data:', error)
    }
  }, [])

  const forceCheck = useCallback(() => {
    return checkVersion(true)
  }, [checkVersion])

  const clearUpdateFlag = useCallback(() => {
    setState(prev => ({ ...prev, needsUpdate: false }))
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        data.needsUpdate = false
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.error('Failed to clear update flag:', error)
    }
  }, [])

  useEffect(() => {
    loadStoredData()
    
    if (shouldCheck()) {
      checkVersion()
    }
    
    const interval = setInterval(() => {
      if (shouldCheck()) {
        checkVersion()
      }
    }, CHECK_INTERVAL)
    
    return () => clearInterval(interval)
  }, [checkVersion, shouldCheck, loadStoredData])

  return {
    ...state,
    checkVersion: forceCheck,
    clearUpdateFlag,
    timeUntilNextCheck: state.lastChecked 
      ? Math.max(0, CHECK_INTERVAL - (Date.now() - state.lastChecked))
      : 0
  }
}