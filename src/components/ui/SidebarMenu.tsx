'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onTriggerUpdates?: () => void
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const [shouldRender, setShouldRender] = useState(isOpen)

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true)
      return
    }

    const id = window.setTimeout(() => setShouldRender(false), 300)
    return () => window.clearTimeout(id)
  }, [isOpen])

  if (!shouldRender) return null

  return (
    <>
      <div
        className={`fixed top-20 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 md:w-96 bg-black/95 backdrop-blur-md border-l border-gray-600/50 z-40 overflow-y-auto transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        aria-hidden={!isOpen}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <nav className={`space-y-4 transition-all duration-300 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <Link
              href="/updates"
              prefetch={false}
              onClick={onClose}
              className="block w-full p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-blue-400 transition-all duration-200 text-left"
            >
              <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">Updates</h3>
              <p className="text-sm text-gray-400 mt-1">Browse release notes and new features</p>
            </Link>

            <Link
              href="/faq"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">FAQ</h3>
              <p className="text-sm text-gray-400 mt-1">Frequently asked questions</p>
            </Link>

            <Link
              href="/contact"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">Contact</h3>
              <p className="text-sm text-gray-400 mt-1">How to reach the author</p>
            </Link>

            <Link
              href="/about"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">About</h3>
              <p className="text-sm text-gray-400 mt-1">The story behind the project</p>
            </Link>

            <Link
              href="/how-to-use"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">How to Use</h3>
              <p className="text-sm text-gray-400 mt-1">Step-by-step guide</p>
            </Link>

            <Link
              href="/privacy-policy"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">Privacy Policy</h3>
              <p className="text-sm text-gray-400 mt-1">Learn how we protect and handle your data</p>
            </Link>

            <Link
              href="/legal"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">Legal</h3>
              <p className="text-sm text-gray-400 mt-1">Disclaimers, trademarks, and takedown policy</p>
            </Link>

            <Link
              href="/terms"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">Terms</h3>
              <p className="text-sm text-gray-400 mt-1">Terms of service</p>
            </Link>

            <Link
              href="/support-the-project"
              prefetch={false}
              onClick={onClose}
              className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-blue-400 transition-all duration-200"
            >
              <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">Support the Project</h3>
              <p className="text-sm text-gray-400 mt-1">Help keep the site sustainable</p>
            </Link>
          </nav>
        </div>
      </div>
    </>
  )
}
