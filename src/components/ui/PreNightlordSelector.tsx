'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { pagesWebpUrl } from '@/lib/pagesAssets'
import { nightlordIcons, nightlordIconOrder, nightlordNames, nightlordStatusCards } from '@/lib/constants/icons'
import SlotSelectionModal from '../SlotSelectionModal'

interface PreNightlordSelectorProps {
  onNightlordChange?: (nightlord: string) => void
  initialNightlord?: string
}

export default function PreNightlordSelector({ onNightlordChange, initialNightlord }: PreNightlordSelectorProps) {
  const [selectedNightlord, setSelectedNightlord] = useState<string>(initialNightlord || 'empty')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('preSelectedNightlord')
      if (stored) {
        setSelectedNightlord(stored)
        onNightlordChange?.(stored)
      } else {
        setSelectedNightlord('empty')
      }
    }

    const handleStorageChange = () => {
      const stored = localStorage.getItem('preSelectedNightlord')
      if (stored) {
        setSelectedNightlord(stored)
        onNightlordChange?.(stored)
      } else {
        setSelectedNightlord('empty')
      }
    }

    const handleNightlordReset = () => {
      setSelectedNightlord('empty')
      onNightlordChange?.('empty')
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('nightlord-reset', handleNightlordReset)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('nightlord-reset', handleNightlordReset)
    }
  }, [onNightlordChange])

  const handleNightlordSelect = (nightlord: string) => {
    setSelectedNightlord(nightlord)
    if (typeof window !== 'undefined') {
      localStorage.setItem('preSelectedNightlord', nightlord)
    }
    onNightlordChange?.(nightlord)
    setIsModalOpen(false)
  }

  const currentIcon = selectedNightlord === 'empty' ? nightlordIcons.empty : nightlordIcons[selectedNightlord]
  const currentName = selectedNightlord === 'empty' ? 'Select Nightlord' : nightlordNames[selectedNightlord]
  const currentStatusCard = selectedNightlord !== 'empty' ? nightlordStatusCards[selectedNightlord] : null

  return (
    <>
      <div
        className="relative w-full max-w-[400px] h-[200px] cursor-pointer"
        style={{
          backgroundImage: `url(${pagesWebpUrl('/Images/UI/preSelectNightlord.webp')})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        onClick={() => setIsModalOpen(true)}
      >
        <div
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-130%, -49%)',
            width: '120px',
            height: '120px',
          }}
        >
          <Image
            src={currentIcon}
            alt={currentName}
            fill
            className="object-contain"
          />
        </div>

        {currentStatusCard && (
          <div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-8%, -49%)',
              width: '180px',
              height: '180px',
            }}
          >
            <Image
              src={currentStatusCard}
              alt={`${currentName} Status`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      <SlotSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        slotId="nightlord"
        onSelect={handleNightlordSelect}
        availableOptions={['empty', ...nightlordIconOrder]}
        currentBuilding={selectedNightlord}
        borderHueRotate={90}
      />
    </>
  )
}
