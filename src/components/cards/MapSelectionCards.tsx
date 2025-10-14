'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useGameStore } from '@/lib/state/store';
import { MAP_TYPES } from '@/lib/types';
import { MapSelectionCard } from './MapSelectionCard';
import '@/styles/map-cards.css';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};
const cardVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: delay,
      ease: "easeOut"
    }
  })
};
const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};
export const MapSelectionCards: React.FC = () => {
  const { setMapType } = useGameStore();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <motion.div
        className="max-w-6xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {}
        <motion.div
          className="text-center mb-2"
          variants={titleVariants}
        >
          {}
          <div className="flex justify-center">
            <div className="w-full max-w-md mx-auto">
              <Image
                src="/Images/Title_n.webp"
                alt="NIGHTREIGN"
                width={400}
                height={160}
                priority
                className="w-full h-auto object-contain"
                sizes="(max-width: 768px) 300px, 400px"
              />
            </div>
          </div>
          {}
          <h1 className="text-2xl md:text-4xl font-bold font-mantinia text-white mb-16 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent text-outlined -mt-8 md:-mt-12 seed-finder-glow">
            SEED FINDER
          </h1>
        </motion.div>
        {}
        <motion.div
          className="text-center mb-4"
          variants={titleVariants}
        >
          <h2 className="text-2xl md:text-2xl font-semibold text-white text-outlined seed-finder-glow">
            Select your map
          </h2>
        </motion.div>
        {}
        <motion.div
          className="map-cards-container"
          initial="hidden"
          animate="visible"
        >
          {(() => {
            const delayMap = {
              'mountaintop': 0.4,
              'noklateo': 0.2,
              'normal': 0,
              'rotted': 0.2,
              'crater': 0.4
            };
            return Object.entries(MAP_TYPES).map(([mapType, mapData]) => {
              const delay = delayMap[mapType as keyof typeof delayMap];
              return (
                <motion.div
                  key={mapType}
                  variants={cardVariants}
                  custom={delay}
                >
                  <MapSelectionCard
                    mapType={mapType}
                    title={mapData.title}
                    imageSrc={mapData.cardImage}
                    onSelect={setMapType}
                  />
                </motion.div>
              );
            });
          })()}
        </motion.div>
        {}
        <motion.div
          className="text-center mt-12"
          variants={titleVariants}
        >
        </motion.div>
      </motion.div>
    </div>
  );
};