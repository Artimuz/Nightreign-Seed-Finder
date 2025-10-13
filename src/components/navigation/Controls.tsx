'use client'
import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import UserCounter from '@/components/ui/UserCounter';
export const Controls: React.FC = () => {
  const { undo, restart, getUndoPreview, urlHistory, urlHistoryIndex, currentPhase, mapType } = useGameStore();
  const canUndo = urlHistoryIndex > 0;
  React.useEffect(() => {
    if (canUndo) {
      getUndoPreview();
    }
  }, [urlHistoryIndex, canUndo, getUndoPreview]);
  if (currentPhase === 'selection' || !mapType) return null;
  return (
    <>
      <motion.div
        className="absolute top-4 left-4 flex gap-2 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
      {}
      <motion.button
        className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all shadow-lg ${
          canUndo
            ? 'bg-blue-600/80 border-blue-400 hover:bg-blue-500/80 text-white'
            : 'bg-gray-800/80 border-gray-600 opacity-50 cursor-not-allowed text-gray-400'
        }`}
        onClick={undo}
        disabled={!canUndo}
        whileHover={canUndo ? { opacity: 0.8 } : {}}
        whileTap={canUndo ? { opacity: 0.7 } : {}}
        title={canUndo ? "Undo last action" : "No actions to undo"}
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </motion.button>
      {}
      <motion.button
        className="w-10 h-10 rounded-full bg-red-600/80 border-2 border-red-400 backdrop-blur-md flex items-center justify-center hover:bg-red-500/80 transition-all text-white shadow-lg"
        onClick={restart}
        whileHover={{ opacity: 0.8, rotate: 180 }}
        whileTap={{ opacity: 0.7 }}
        title="Start over"
      >
        <ArrowPathIcon className="w-6 h-6" />
      </motion.button>
      </motion.div>
    </>
  );
};