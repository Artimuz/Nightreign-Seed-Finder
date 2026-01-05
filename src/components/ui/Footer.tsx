'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { APP_VERSION } from '@/lib/constants/version'
import { usePathname } from 'next/navigation'
import BugReportModal from './BugReportModal'

export const Footer: React.FC = () => {
  const [isBugModalOpen, setIsBugModalOpen] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    setIsBugModalOpen(false)
  }, [pathname])

  return (
    <motion.footer
      className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-t border-gray-600/30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
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
          href="https://github.com/Artimuz/Nightreign-Seed-Finder"
          prefetch={false}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12 0a12 12 0 00-3.79 23.39c.6.11.82-.26.82-.58v-2.2c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.47 11.47 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.87.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 0z" />
          </svg>
          <span className="text-sm font-medium">GitHub Repository</span>
          <svg
            className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>
        <BugReportModal isOpen={isBugModalOpen} onClose={() => setIsBugModalOpen(false)} />
      </div>
    </motion.footer>
  )
}
