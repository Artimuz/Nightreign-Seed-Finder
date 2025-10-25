'use client'

import { motion } from 'framer-motion';
import { findSeedById } from '@/lib/data/seedSearch';
import { Events } from '@/lib/constants/icons';
import { useGameStore } from '@/lib/state/store';
import { useState, useEffect } from 'react';
import { getResponsiveMapSize } from '@/lib/constants/mapSizing';
import Image from 'next/image';

interface ResultDisplayProps {
  seedId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const mapVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const eventVariants = {
  hidden: { 
    opacity: 0, 
    scale: 2,
    y: -200
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: 1.2,
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 1.0
    }
  }
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ seedId }) => {
  const seed = findSeedById(seedId);
  const { restart } = useGameStore();
  const [mapSize, setMapSize] = useState(1000);

  useEffect(() => {
    const updateMapSize = () => {
      const newSize = getResponsiveMapSize(window.innerWidth, window.innerHeight);
      setMapSize(newSize);
    };

    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);

  if (!seed) {
    return (
      <motion.div
        className="flex items-center justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Seed Not Found</h2>
          <p className="text-red-300">Could not find seed with ID: {seedId}</p>
        </div>
      </motion.div>
    );
  }

  const seedImageUrl = `https://thefifthmatt.github.io/nightreign/pattern/${seed.seed_id.padStart(3, '0')}.jpg`;

  return (
    <motion.div
      className="flex items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative">
        <motion.div 
          className="relative mx-auto"
          style={{ width: mapSize, height: mapSize }}
          variants={mapVariants}
          initial="hidden"
          animate="visible"
        >
          <img
            src={seedImageUrl}
            alt={`Seed ${seed.seed_id} pattern`}
            width={mapSize}
            height={mapSize}
            className="object-cover rounded-lg"
            style={{ width: mapSize, height: mapSize }}
            loading="eager"
          />
            
          {seed.Event && Events[seed.Event] && (
            (() => {
              const eventIconSize = Math.round(mapSize * 0.16);
              const halfIconSize = eventIconSize / 2;
              return (
                <motion.div
                  className="absolute"
                  style={{
                    top: (905 / 1000) * mapSize - halfIconSize,
                    left: (910 / 1000) * mapSize - halfIconSize,
                    width: `${eventIconSize}px`,
                    height: `${eventIconSize}px`
                  }}
                  variants={eventVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Image
                    src={Events[seed.Event]}
                    alt={seed.Event}
                    width={eventIconSize}
                    height={eventIconSize}
                    className="object-contain drop-shadow-lg"
                    sizes={`${eventIconSize}px`}
                    quality={75}
                  />
                </motion.div>
              );
            })()
          )}
        </motion.div>
        
      </div>
    </motion.div>
  );
};