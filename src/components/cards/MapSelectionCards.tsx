'use client'
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

  const cardScale = 0.65;

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileIconSize, setMobileIconSize] = useState(100);

  useEffect(() => {
    document.documentElement.style.setProperty('--card-scale', cardScale.toString());
  }, [cardScale]);

  useEffect(() => {
    const updateIconSize = () => {
      if (mobileContainerRef.current) {
        const containerWidth = mobileContainerRef.current.offsetWidth;

        const availableWidth = containerWidth - 60;
        const baseIconSize = Math.max(80, Math.min(140, availableWidth / 3));
        setMobileIconSize(Math.round(baseIconSize));

        document.documentElement.style.setProperty('--mobile-icon-size', `${baseIconSize}px`);
      }
    };

    updateIconSize();

    window.addEventListener('resize', updateIconSize);

    return () => window.removeEventListener('resize', updateIconSize);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <motion.div
        className="max-w-6xl w-full relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="text-center mb-8"
          variants={titleVariants}
        >
          <h2 className="text-2xl md:text-2xl font-semibold text-white text-outlined seed-finder-glow">
            Select your map
          </h2>
        </motion.div>
        
        {}
        <div className="desktop-map-cards-container hidden md:flex">
          {(() => {
            const delayMap = {
              'mountaintop': 0.4,
              'noklateo': 0.2,
              'normal': 0,
              'rotted': 0.2,
              'crater': 0.4
            };
            return MAP_TYPES.map((mapData) => {
              const delay = delayMap[mapData.key as keyof typeof delayMap];
              return (
                <motion.div
                  key={mapData.key}
                  variants={cardVariants}
                  custom={delay}
                >
                  <MapSelectionCard
                    mapType={mapData.key}
                    title={mapData.title}
                    imageSrc={mapData.cardImage}
                    href={`/map/${mapData.key}`}
                  />
                </motion.div>
              );
            });
          })()}
        </div>

        <motion.div
          ref={mobileContainerRef}
          className="mobile-map-icons-container block md:hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mobile-icons-row mobile-icons-first">
            {MAP_TYPES.slice(0, 3).map((mapData, index) => (
              <motion.a
                key={mapData.key}
                href={`/map/${mapData.key}`}
                className="mobile-map-icon"
                variants={cardVariants}
                custom={index * 0.1}
              >
                <Image
                  src={`/Images/mapTypes/map_icon/${mapData.key === 'rotted' ? 'rot' : mapData.key === 'mountaintop' ? 'mountain' : mapData.key}Icon.webp`}
                  alt={mapData.title}
                  width={mobileIconSize}
                  height={mobileIconSize}
                  className="mobile-icon-image"
                />
                <span className="mobile-icon-title">{mapData.title}</span>
              </motion.a>
            ))}
          </div>
          
          <div className="mobile-icons-row mobile-icons-second">
            {MAP_TYPES.slice(3, 5).map((mapData, index) => (
              <motion.a
                key={mapData.key}
                href={`/map/${mapData.key}`}
                className="mobile-map-icon"
                variants={cardVariants}
                custom={(index + 2) * 0.1}
              >
                <Image
                  src={`/Images/mapTypes/map_icon/${mapData.key === 'rotted' ? 'rot' : mapData.key === 'mountaintop' ? 'mountain' : mapData.key}Icon.webp`}
                  alt={mapData.title}
                  width={mobileIconSize}
                  height={mobileIconSize}
                  className="mobile-icon-image"
                />
                <span className="mobile-icon-title">{mapData.title}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};