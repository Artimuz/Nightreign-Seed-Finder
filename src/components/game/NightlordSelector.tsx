'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { nightlordIcons, nightlordNames } from '@/lib/constants/icons';
import { getNightlordCoordinates } from '@/lib/data/coordinates';
import { getValidNightlords, getNightlordIconState } from '@/lib/data/validBuildings';
import { getResponsiveMapSize, getIconScale, MAP_CONFIG } from '@/lib/constants/mapSizing';
import { NightlordModal } from './NightlordModal';
import { NightlordType } from '@/lib/types/game';
import Image from 'next/image';
export const NightlordSelector: React.FC = () => {
  const { nightlord, setNightlord, mapType, slots } = useGameStore();
  const nightlordCoords = getNightlordCoordinates();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapSize, setMapSize] = useState(1000);
  const [nightlordIconScale, setNightlordIconScale] = useState(75);
  useEffect(() => {
    const updateMapSize = () => {
      const newSize = getResponsiveMapSize(window.innerWidth, window.innerHeight);
      const newIconScale = getIconScale(newSize, 1.5);
      setMapSize(newSize);
      setNightlordIconScale(newIconScale);
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);
  if (!nightlordCoords) return null;
  const topPos = (nightlordCoords.y / MAP_CONFIG.ORIGINAL_SIZE) * mapSize - nightlordIconScale / 2;
  const leftPos = (nightlordCoords.x / MAP_CONFIG.ORIGINAL_SIZE) * mapSize - nightlordIconScale / 2;
  const validNightlords = getValidNightlords(mapType!, slots);
  const nightlordState = getNightlordIconState(validNightlords, nightlord ?? undefined);
  const handleNightlordClick = () => {
    switch (nightlordState.clickAction) {
      case 'hide':
        break;
      case 'ghost-to-real':
        if (nightlordState.ghostNightlord) {
          setNightlord(nightlordState.ghostNightlord as NightlordType);
        }
        break;
      case 'empty-immediately':
        setNightlord('' as NightlordType);
        break;
      case 'open-modal':
        setIsModalOpen(true);
        break;
    }
  };
  if (nightlordState.shouldHide) {
    return null;
  }
  return (
    <>
      {}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative pointer-events-auto"
          style={{ width: mapSize, height: mapSize }}
        >
          <motion.button
            className="absolute cursor-pointer z-10 bg-transparent border-none p-0"
            style={{
              top: topPos,
              left: leftPos,
              width: nightlordIconScale,
              height: nightlordIconScale
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: nightlordState.shouldShowGhost ? 0.4 : 1
            }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ opacity: 0.8 }}
            whileTap={{ opacity: 0.7 }}
            onClick={handleNightlordClick}
          >
            {}
            <Image
              src={nightlordState.displayNightlord && nightlordIcons[nightlordState.displayNightlord] ?
                nightlordIcons[nightlordState.displayNightlord] : "/Images/buildingIcons/empty.webp"}
              alt={nightlordState.displayNightlord && nightlordNames[nightlordState.displayNightlord] ?
                nightlordNames[nightlordState.displayNightlord] : 'empty nightlord slot'}
              width={nightlordIconScale}
              height={nightlordIconScale}
              className={`object-contain ${
                nightlordState.shouldShowGhost ? 'opacity-50' : ''
              } ${nightlord ? 'drop-shadow-lg' : 'hover:drop-shadow-md'}`}
              sizes={`${nightlordIconScale}px`}
            />
          </motion.button>
        </div>
      </div>
      {}
      <NightlordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};