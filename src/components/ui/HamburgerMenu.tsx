'use client'
import React from 'react'

interface HamburgerMenuProps {
  isOpen: boolean
  className?: string
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  className = ''
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-8 h-8 transition-all duration-300 ${className}`}
    >
      <span
        className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ease-out ${
          isOpen ? 'rotate-45 translate-y-1.5' : 'translate-y-0'
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ease-out my-1 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <span
        className={`block w-6 h-0.5 bg-gray-200 transition-all duration-300 ease-out ${
          isOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0'
        }`}
      />
    </div>
  )
}