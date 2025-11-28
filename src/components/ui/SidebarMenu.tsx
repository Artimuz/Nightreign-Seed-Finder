'use client'
import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getLoreCategories } from '@/lib/lore/utils'

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  onTriggerUpdates?: () => void
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, onTriggerUpdates }) => {
  const categories = getLoreCategories()

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
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-white">Lore & Stories</h2>
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

              {/* Navigation Items */}
              <nav className="space-y-4">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={category.href}
                      onClick={onClose}
                      className="block group"
                    >
                      <div className="p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200">
                        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-200">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {category.description}
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          {category.characters.length} characters
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {/* Additional Links */}
                <motion.div
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-gray-600/50 space-y-4"
                >
                  <button
                    onClick={() => {
                      if (onTriggerUpdates) {
                        onTriggerUpdates()
                      }
                      onClose()
                    }}
                    className="block w-full p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-blue-400 transition-all duration-200 text-left"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
                      Last Updates
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      View recent app updates and new features
                    </p>
                  </button>
                  
                  <Link
                    href="/lore"
                    onClick={onClose}
                    className="block p-4 rounded-lg border border-gray-600/50 bg-gray-700/30 hover:bg-gray-600/50 hover:border-yellow-400 transition-all duration-200"
                  >
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors duration-200">
                      All Lore
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Explore the complete collection of stories and characters
                    </p>
                  </Link>
                  
                  <Link
                    href="/privacy-policy"
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
                </motion.div>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}