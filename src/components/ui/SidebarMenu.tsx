'use client'
import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onTriggerUpdates?: () => void
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, onTriggerUpdates }) => {

  const sidebarVariants = {
    closed: {
      x: '100%',
      opacity: 0
    },
    open: {
      x: 0,
      opacity: 1
    }
  }

  const overlayVariants = {
    closed: {
      opacity: 0
    },
    open: {
      opacity: 1
    }
  }

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-30"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="fixed top-20 right-0 h-[calc(100vh-5rem)] w-80 md:w-96 bg-black/95 backdrop-blur-md border-l border-gray-600/50 z-40 overflow-y-auto"
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

              <nav className="space-y-4">
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <Link
                    href="/updates"
                    prefetch={false}
                    onClick={onClose}
                    className="block w-full p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-blue-400 transition-all duration-200 text-left"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
                      Updates
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Browse release notes and new features
                    </p>
                  </Link>
                  
                  <Link
                    href="/faq"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      FAQ
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Frequently asked questions
                    </p>
                  </Link>

                  <Link
                    href="/contact"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      Contact
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      How to reach the author
                    </p>
                  </Link>

                  <Link
                    href="/about"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      About
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      The story behind the project
                    </p>
                  </Link>

                  <Link
                    href="/how-to-use"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      How to Use
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Step-by-step guide
                    </p>
                  </Link>

                  <Link
                    href="/privacy-policy"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-gray-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-gray-300 transition-colors duration-200">
                      Privacy Policy
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Learn how we protect and handle your data
                    </p>
                  </Link>

                  <Link
                    href="/support-the-project"
                    prefetch={false}
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-blue-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
                      Support the Project
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Help keep the site sustainable
                    </p>
                  </Link>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}