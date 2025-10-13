'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';

export const SeedCounter: React.FC = () => {
  const { matchingSeeds, currentPhase, foundSeed, mapType } = useGameStore();

  const shouldShow = (currentPhase === 'building' || (currentPhase === 'selection' && mapType)) && !foundSeed && matchingSeeds.length > 0;
  const seedCount = matchingSeeds.length;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 pointer-events-none"
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.p 
            className="text-white text-sm font-medium whitespace-nowrap"
            key={seedCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {seedCount === 1 ? '1 seed remaining' : `${seedCount} seeds remaining`}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};