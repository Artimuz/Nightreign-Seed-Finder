'use client'

import { useEffect, useState } from 'react'
import { pagesWebpUrl } from '@/lib/pagesAssets'
import { buildingIconOrder, nightlordIconOrder, nightlordIcons } from '@/lib/constants/icons'

interface SlotSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  slotId: string
  onSelect: (building: string) => void
  availableOptions: string[]
  currentBuilding?: string
}

export default function SlotSelectionModal({ 
  isOpen, 
  onClose, 
  slotId, 
  onSelect, 
  availableOptions,
  currentBuilding
}: SlotSelectionModalProps) {
  const [mounted, setMounted] = useState(false)
  

  const iconConfig = {
    mobile: {
      size: 60,
      containerPadding: 'p-1'
    },
    desktop: {
      size: 64,
      containerPadding: 'p-1'
    },

    nightlordDesktop: {
      size: 80,
      containerPadding: 'p-1',
      maxColumns: 4
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleOptionClick = (building: string) => {
    onSelect(building)
    onClose()
  }


  const getIconPath = (building: string) => {
    if (!building || building === 'empty') {
      return isNightlordModal ? pagesWebpUrl('/Images/nightlordIcons/empty_nightlord.webp') : pagesWebpUrl('/Images/buildingIcons/empty.webp')
    }

    if (Object.prototype.hasOwnProperty.call(nightlordIcons, building)) {
      return pagesWebpUrl(`/Images/nightlordIcons/${building}.webp`)
    }

    return pagesWebpUrl(`/Images/buildingIcons/${building}.webp`)
  }

  const uniqueOptions = Array.from(new Set(availableOptions))
  if (!uniqueOptions.includes('empty')) {
    uniqueOptions.unshift('empty')
  }

  const isNightlordModal = slotId === 'nightlord' || uniqueOptions.some(option => option !== 'empty' && Object.prototype.hasOwnProperty.call(nightlordIcons, option))

  const filteredOptions = uniqueOptions.filter(option => {

    if (currentBuilding && option === currentBuilding) {
      return false
    }

    if ((!currentBuilding || currentBuilding === '' || currentBuilding === 'empty') && option === 'empty') {
      return false
    }
    return true
  })

  const sortedOptions = filteredOptions.sort((a, b) => {
    const orderArray = isNightlordModal ? nightlordIconOrder : buildingIconOrder
    const indexA = orderArray.indexOf(a)
    const indexB = orderArray.indexOf(b)

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB
    }

    if (indexA !== -1) return -1
    if (indexB !== -1) return 1

    return 0
  })

  const getGridColumns = () => {
    const optionsCount = sortedOptions.length

    if (isNightlordModal) {
      return `grid-cols-${Math.min(optionsCount, iconConfig.nightlordDesktop.maxColumns)}`
    }

    if (optionsCount <= 2) return 'grid-cols-2'
    if (optionsCount <= 3) return 'grid-cols-3'
    if (optionsCount <= 4) return 'grid-cols-4'
    if (optionsCount <= 5) return 'grid-cols-4 sm:grid-cols-5'
    return 'grid-cols-4 sm:grid-cols-5 md:grid-cols-6'
  }

  const getModalWidth = () => {
    const optionsCount = sortedOptions.length
    if (optionsCount <= 2) return 'max-w-xs'
    if (optionsCount <= 4) return 'max-w-sm'
    if (optionsCount <= 8) return 'max-w-md'
    if (optionsCount <= 12) return 'max-w-lg'
    return 'max-w-xl'
  }

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-black/95 rounded-2xl border border-gray-600/50 shadow-2xl ${getModalWidth()} w-full max-h-[80vh] overflow-hidden mx-4`}
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white">
                Make your choice
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/70 flex items-center justify-center transition-colors duration-75"
            >
              <span className="text-white text-lg">×</span>
            </button>
          </div>
        </div>
        
        {}
        <div className="p-6 overflow-y-auto max-h-96 scrollbar-custom">
          <div className={`grid ${getGridColumns()} gap-2 justify-items-center`}>
            {sortedOptions.map((building, index) => {
              const iconSrc = getIconPath(building)

              return (
                <button
                  key={`${building}-${index}`}
                  onClick={() => handleOptionClick(building)}
                  className={`relative ${iconConfig.mobile.containerPadding} ${isNightlordModal ? `md:${iconConfig.nightlordDesktop.containerPadding}` : `md:${iconConfig.desktop.containerPadding}`} rounded-xl border-2 border-gray-600/50 bg-gray-700/30 hover:border-yellow-400 hover:bg-gray-600/50 transition-all duration-75 group flex items-center justify-center`}
                >
                  <div
                    className="relative flex items-center justify-center md:hidden"
                    style={{
                      width: `${iconConfig.mobile.size}px`,
                      height: `${iconConfig.mobile.size}px`
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={building || 'empty'}
                      width={iconConfig.mobile.size}
                      height={iconConfig.mobile.size}
                      className="object-contain group-hover:opacity-80 transition-opacity duration-100"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div
                    className="relative items-center justify-center hidden md:flex"
                    style={{
                      width: `${isNightlordModal ? iconConfig.nightlordDesktop.size : iconConfig.desktop.size}px`,
                      height: `${isNightlordModal ? iconConfig.nightlordDesktop.size : iconConfig.desktop.size}px`
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt={building || 'empty'}
                      width={isNightlordModal ? iconConfig.nightlordDesktop.size : iconConfig.desktop.size}
                      height={isNightlordModal ? iconConfig.nightlordDesktop.size : iconConfig.desktop.size}
                      className="object-contain group-hover:opacity-80 transition-opacity duration-100"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  {building && building.endsWith('_spawn') && (
                    <div className="absolute inset-x-0 -bottom-5 flex justify-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-400 text-black shadow">
                        Spawn
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        {}
        <div className="p-4 border-t border-gray-700/50 bg-black/30">
        </div>
      </div>
    </div>
  )
}