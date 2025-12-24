'use client'

import { pagesWebpUrl } from '@/lib/pagesAssets'

interface SpawnIconProps {
  isSelected: boolean
  onClick: () => void
  className?: string
}

export function SpawnIcon({ isSelected, onClick, className = '' }: SpawnIconProps) {
  const iconSrc = isSelected 
    ? pagesWebpUrl('/Images/SpawnIcons/Set_Spawn_False.webp')
    : pagesWebpUrl('/Images/SpawnIcons/Set_Spawn_True.webp')
    
  const text = isSelected 
    ? 'Remove spawn location'
    : 'Set spawn location'

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 p-2 rounded-lg border-2 border-transparent hover:border-yellow-400 transition-colors"
        type="button"
      >
        <img
          src={iconSrc}
          alt={text}
          width={48}
          height={48}
          className="w-[48px] h-[48px] md:w-[52px] md:h-[52px] lg:w-[56px] lg:h-[56px] object-contain"
          loading="lazy"
          decoding="async"
        />
        <span className="text-sm text-center text-white font-medium">
          {text}
        </span>
      </button>
    </div>
  )
}