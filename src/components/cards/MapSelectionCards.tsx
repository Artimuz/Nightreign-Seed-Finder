'use client'
import { motion } from 'framer-motion';
import { pagesWebpUrl } from '@/lib/pagesAssets';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MAP_TYPES } from '@/lib/types';
import { MapSelectionCard } from './MapSelectionCard';
import '@/styles/map-cards.css';
import seedData from '../../../public/data/seed_data.json';
import { trackAnalyticsEvent } from '@/lib/analytics/events';

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

interface MapSelectionCardsProps {
  selectedNightlord?: string;
}

export const MapSelectionCards: React.FC<MapSelectionCardsProps> = ({ selectedNightlord = 'empty' }) => {
  const router = useRouter();

  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const [mobileIconSize, setMobileIconSize] = useState(100);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [hasClicked, setHasClicked] = useState(false);

  const getSeedCounts = (mapType: string) => {
    const mapTypeMapping: Record<string, string> = {
      'normal': 'Normal',
      'crater': 'Crater',
      'mountaintop': 'Mountaintop',
      'noklateo': 'Noklateo',
      'rotted': 'Rotted',
      'greatHollow': 'Great Hollow'
    };
    
    const jsonMapType = mapTypeMapping[mapType];
    const total = seedData.filter(seed => seed.map_type === jsonMapType).length;
    
    if (selectedNightlord && selectedNightlord !== 'empty') {
      const nightlordSeeds = seedData.filter(
        seed => seed.map_type === jsonMapType && seed.nightlord === selectedNightlord
      ).length;
      return { nightlordSeeds, total };
    }
    
    return { nightlordSeeds: 0, total };
  };

  const handleCardClick = (mapKey: string, event: React.MouseEvent) => {
    event.preventDefault();
    if (!hasClicked) {
      setHasClicked(true);
      setClickedCard(mapKey);
      
      if (selectedNightlord && selectedNightlord !== 'empty') {
        trackAnalyticsEvent('map_selected_with_boss', { 
          map_type: mapKey, 
          nightlord: selectedNightlord 
        });
      } else {
        trackAnalyticsEvent('map_selected', { 
          map_type: mapKey 
        });
      }
      
      router.push(`/map/${mapKey}`);
    }
  };

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
    <div className="flex flex-col items-center p-2 relative">
      <div className="max-w-6xl w-full relative z-10">
        <div className="text-center mb-1">
          <h2 className="text-2xl md:text-2xl font-semibold text-white text-outlined seed-finder-glow">
            Select your map
          </h2>
        </div>
        
        {}
        <div className={`desktop-map-cards-container hidden md:flex${hasClicked && clickedCard ? ' card-clicked' : ''}`}>
          {MAP_TYPES.map((mapData) => {
            const isOther = hasClicked && clickedCard && clickedCard !== mapData.key;
            const seedCounts = getSeedCounts(mapData.key);
            return (
              <motion.div
                key={mapData.key}
                animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MapSelectionCard
                  mapType={mapData.key}
                  title={mapData.title}
                  imageSrc={mapData.cardImage}
                  onClick={(event) => handleCardClick(mapData.key, event)}
                  isLocked={false}
                  seedCounts={selectedNightlord !== 'empty' ? seedCounts : undefined}
                />
              </motion.div>
            );
          })}
        </div>

        <div
          ref={mobileContainerRef}
          className={`mobile-map-icons-container block md:hidden${hasClicked && clickedCard ? ' icon-clicked' : ''}`}
        >
          <div className="mobile-icons-row mobile-icons-first">
            {MAP_TYPES.slice(0, 3).map((mapData, index) => {
              const isOther = hasClicked && clickedCard && clickedCard !== mapData.key;
              return (
                <motion.div
                  key={mapData.key}
                  className="mobile-map-icon"
                  animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
                  animate={isOther ? { opacity: 0.05 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
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
        </div>
      </div>
    </div>
  );
};