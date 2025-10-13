'use client'

import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { MapDisplay } from './MapDisplay';
import { SlotOverlay } from './SlotOverlay';
import { BuildingSelector } from './BuildingSelector';
import { ResultDisplay } from './ResultDisplay';
import { NightlordSelector } from './NightlordSelector';
import { Controls } from '../navigation/Controls';

const layerVariants = {
  enter: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

export const GameBoard: React.FC = () => {
  const { 
    currentPhase, 
    mapType, 
    foundSeed, 
    activeBuildingPanel
  } = useGameStore();

  return (
    <div className="relative w-full h-screen overflow-hidden">

      <motion.div
        className="fixed top-8 left-0 right-0 z-30 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold text-white whitespace-nowrap">
          {foundSeed ? (
            <span>
              Result Found {foundSeed} - Source{' '}
              <a 
                href="https://thefifthmatt.github.io/nightreign/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white font-bold hover:text-gray-300 transition-colors duration-200"
              >
                thefifthmatt
              </a>
            </span>
          ) : (
            <span className="text-outlined">How does your map look like?</span>
          )}
        </h2>
      </motion.div>

      <AnimatePresence>
        {mapType && (
          <motion.div
            key="map-display"
            variants={layerVariants}
            initial="exit"
            animate="enter"
            className="absolute inset-0 flex items-center justify-center pt-12 pb-8"
          >
            <div className="relative">
              <MapDisplay mapType={mapType} />
              <Controls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentPhase === 'building' && (
          <motion.div
            key="slot-overlay"
            variants={layerVariants}
            initial="exit"
            animate="enter"
            className="absolute inset-0"
          >
            <SlotOverlay />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeBuildingPanel && (
          <BuildingSelector />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentPhase === 'building' && (
          <NightlordSelector />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {foundSeed && (
          <motion.div
            key="result-display"
            variants={layerVariants}
            initial="exit"
            animate="enter"
            className="absolute inset-0 flex items-center justify-center pt-12 pb-8"
          >
            <div className="relative">
              <ResultDisplay seedId={foundSeed} />
              <Controls />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};