'use client'
import { motion } from 'framer-motion';
import { pagesWebpUrl } from '@/lib/pagesAssets';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MAP_TYPES } from '@/lib/types';
import { MapSelectionCard } from './MapSelectionCard';
import '@/styles/map-cards.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: {
      duration: 0.15,
      delay: delay,
      ease: "easeOut"
    }
  })
};

const titleVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const MapSelectionCards: React.FC = () => {
  const router = useRouter();
  const cardScale = 0.65;

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileIconSize, setMobileIconSize] = useState(100);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [hasClicked, setHasClicked] = useState(false);

  const handleCardClick = (mapKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (!hasClicked) {
      setHasClicked(true);
      setClickedCard(mapKey);
      router.push(`/map/${mapKey}`);
    }
  };

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
    <div className="flex flex-col items-center p-6 relative">
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
        <div className={`desktop-map-cards-container hidden md:flex${hasClicked && clickedCard ? ' card-clicked' : ''}`}>
          {(() => {
            const delayMap = {
              'mountaintop': 0.2,
              'noklateo': 0.1,
              'normal': 0,
              'rotted': 0.1,
              'crater': 0.2,
              'greatHollow': 0.3
            };
            return MAP_TYPES.map((mapData) => {
              const delay = delayMap[mapData.key as keyof typeof delayMap];
              const isOther = hasClicked && clickedCard && clickedCard !== mapData.key;
              return (
                <motion.div
                  key={mapData.key}
                  variants={cardVariants}
                  custom={delay}
                  animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <MapSelectionCard
                    mapType={mapData.key}
                    title={mapData.title}
                    imageSrc={mapData.cardImage}
                    onClick={(event) => handleCardClick(mapData.key, event)}
                    isLocked={false}
                  />
                </motion.div>
              );
            });
          })()}
        </div>

        <motion.div
          ref={mobileContainerRef}
          className={`mobile-map-icons-container block md:hidden${hasClicked && clickedCard ? ' icon-clicked' : ''}`}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mobile-icons-row mobile-icons-first">
            {MAP_TYPES.slice(0, 3).map((mapData, index) => {
              const isOther = hasClicked && clickedCard && clickedCard !== mapData.key;
              return (
                <motion.div
                  key={mapData.key}
                  className="mobile-map-icon"
                  variants={cardVariants}
                  custom={index * 0.1}
                  animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  onClick={(event) => handleCardClick(mapData.key, event)}
                >
                  <div className="relative">
                    <Image
                      src={pagesWebpUrl(`/Images/mapTypes/map_icon/${mapData.key === 'rotted' ? 'rot' : mapData.key === 'mountaintop' ? 'mountain' : mapData.key}Icon.webp`)}
                      alt={mapData.title}
                      width={mobileIconSize}
                      height={mobileIconSize}
                      className="mobile-icon-image"
                      unoptimized
                    />
                  </div>
                  <span className="mobile-icon-title">{mapData.title}</span>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mobile-icons-row mobile-icons-second">
            {MAP_TYPES.slice(3, 6).map((mapData, index) => {
              const isOther = hasClicked && clickedCard && clickedCard !== mapData.key;
              return (
                <motion.div
                  key={mapData.key}
                  className="mobile-map-icon"
                  variants={cardVariants}
                  custom={(index + 2) * 0.1}
                  animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  onClick={(event) => handleCardClick(mapData.key, event)}
                >
                  <div className="relative">
                    <Image
                      src={pagesWebpUrl(`/Images/mapTypes/map_icon/${mapData.key === 'rotted' ? 'rot' : mapData.key === 'mountaintop' ? 'mountain' : mapData.key}Icon.webp`)}
                      alt={mapData.title}
                      width={mobileIconSize}
                      height={mobileIconSize}
                      className="mobile-icon-image"
                      unoptimized
                    />
                  </div>
                  <span className="mobile-icon-title">{mapData.title}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};