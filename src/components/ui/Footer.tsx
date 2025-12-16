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
  React.useEffect(() => { setIsBugModalOpen(false) }, [pathname])
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
            <path d="M19 8h-1.28a6.96 6.96 0 00-1.53-2.02l.91-.91a1 1 0 10-1.41-1.41l-1.2 1.2A6.95 6.95 0 0012 4c-1.07 0-2.09.25-2.98.7l-1.2-1.2a1 1 0 10-1.41 1.41l.91.91A6.96 6.96 0 005.28 8H4a1 1 0 100 2h1v2H4a1 1 0 100 2h1v1a4 4 0 004 4h6a4 4 0 004-4v-1h1a1 1 0 100-2h-1v-2h1a1 1 0 100-2zM7 10a5 5 0 0110 0v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5z"/>
          </svg>
          <span className="hidden sm:inline text-sm">Report</span>
        </button>
        <Link
          href="https://github.com/Artimuz/Nightreign-Seed-Finder"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12" />
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
