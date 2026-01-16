'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { APP_VERSION } from '@/lib/constants/version'
import { pagesPngUrl } from '@/lib/pagesAssets'
import BugReportModal from './BugReportModal'

export const Footer: React.FC = () => {
  const [isBugModalOpen, setIsBugModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsBugModalOpen(false)
  }, [pathname])

  useEffect(() => {
    const id = window.setTimeout(() => setIsVisible(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-gray-600/30 transition-all duration-500 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
    >
      <div className="relative flex items-center justify-center py-3">
        <span className="absolute left-4 text-sm text-gray-500">v{APP_VERSION}</span>
        <button
          onClick={() => setIsBugModalOpen(true)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 transition-all duration-200 hover:scale-105 z-10 focus:outline-none flex items-center gap-2"
          aria-label="Report a bug"
          title="Report a bug"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M19 8h-1.28a6.96 6.96 0 00-1.53-2.02l.91-.91a1 1 0 10-1.41-1.41l-1.2 1.2A6.95 6.95 0 0012 4c-1.07 0-2.09.25-2.98.7l-1.2-1.2a1 1 0 10-1.41 1.41l.91.91A6.96 6.96 0 005.28 8H4a1 1 0 100 2h1v2H4a1 1 0 100 2h1v1a4 4 0 004 4h6a4 4 0 004-4v-1h1a1 1 0 100-2h-1v-2h1a1 1 0 100-2zM7 10a5 5 0 0110 0v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z" />
          </svg>
          <span className="hidden sm:inline text-sm">Report</span>
        </button>
        <Link
          href="/support-the-project"
          prefetch={false}
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <Image
            src={pagesPngUrl('/Images/support/KoFiIcon.png')}
            alt="Ko-fi"
            width={18}
            height={18}
            className="group-hover:scale-110 transition-transform duration-200"
            unoptimized
          />
          <span className="text-base font-semibold text-white">Support the project</span>
          <Image
            src={pagesPngUrl('/Images/support/KoFiIcon.png')}
            alt="Ko-fi"
            width={18}
            height={18}
            className="group-hover:scale-110 transition-transform duration-200"
            unoptimized
          />
        </Link>
        {isBugModalOpen ? (
          <BugReportModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} borderHueRotate={0} />
        ) : null}
      </div>
    </footer>
  )
}
