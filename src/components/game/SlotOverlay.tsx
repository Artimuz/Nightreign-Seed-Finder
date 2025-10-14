'use client'
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { getSlotCoordinates } from '@/lib/data/coordinates';
import { buildingIcons } from '@/lib/constants/icons';
import { getValidBuildingsForSlot, getIconState } from '@/lib/data/validBuildings';
import { BuildingType } from '@/lib/types/game';
import { useState, useEffect } from 'react';
import { getResponsiveMapSize, getIconScale, MAP_CONFIG } from '@/lib/constants/mapSizing';
import Image from 'next/image';
export const SlotOverlay: React.FC = () => {
  const { slots, activeSlot, setActiveSlot, setSlot, mapType, nightlord, activeBuildingPanel, previewBuilding } = useGameStore();
  const coordinates = getSlotCoordinates();
  const [mapSize, setMapSize] = useState(1000);
  const [buildingIconScale, setBuildingIconScale] = useState(80);
  useEffect(() => {
    const updateMapSize = () => {
      const newSize = getResponsiveMapSize(window.innerWidth, window.innerHeight);
      const newIconScale = getIconScale(newSize, 1.4);
      setMapSize(newSize);
      setBuildingIconScale(newIconScale);
    };
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, []);
  const handleIconClick = (slotId: string) => {
    const validBuildings = getValidBuildingsForSlot(mapType!, slotId, slots, nightlord);
    const currentBuilding = slots[slotId];
    const iconState = getIconState(validBuildings, currentBuilding);
    switch (iconState.clickAction) {
      case 'hide':
        break;
      case 'ghost-to-real':
        if (iconState.ghostBuilding) {
          setSlot(slotId, iconState.ghostBuilding as BuildingType);
        }
        break;
      case 'empty-immediately':
        setSlot(slotId, 'empty' as BuildingType);
        break;
      case 'open-modal':
        setActiveSlot(slotId);
        break;
    }
  };
  return (
    <div className="absolute inset-0 flex items-center justify-center pt-12 pb-8">
      <div
        className="relative pointer-events-none"
        style={{ width: mapSize, height: mapSize }}
      >
        <div
          className="absolute inset-0 pointer-events-auto"
        >
        {coordinates.map((coord) => {
          const currentBuilding = slots[coord.id];
          const validBuildings = getValidBuildingsForSlot(mapType!, coord.id, slots, nightlord);
          const iconState = getIconState(validBuildings, currentBuilding);

          const isActiveSlot = activeSlot === coord.id && activeBuildingPanel;

          let displayBuilding, shouldShowAsGhost, useOriginalGhost;
          
          if (isActiveSlot) {

            const activeSlotPreview = activeSlot === coord.id ? previewBuilding : null;
            
            if (activeSlotPreview) {
              displayBuilding = activeSlotPreview;
              shouldShowAsGhost = activeSlotPreview !== currentBuilding;
            } else {

              displayBuilding = currentBuilding && currentBuilding !== 'empty' ? currentBuilding : 'empty';
              shouldShowAsGhost = false;
            }
            useOriginalGhost = false;
          } else {

            displayBuilding = iconState.displayBuilding;
            shouldShowAsGhost = false;
            useOriginalGhost = iconState.shouldShowGhost;
          }
          
          if (iconState.shouldHide && !isActiveSlot) {
            return null;
          }
          const topPos = (coord.y / MAP_CONFIG.ORIGINAL_SIZE) * mapSize - buildingIconScale / 2;
          const leftPos = (coord.x / MAP_CONFIG.ORIGINAL_SIZE) * mapSize - buildingIconScale / 2;
          
          return (
            <motion.button
              key={coord.id}
              className={`absolute cursor-pointer z-10 bg-transparent border-none p-0 transition-all duration-300 ease-in-out ${
                isActiveSlot ? 'active-slot-glow' : ''
              }`}
              style={{
                top: `${(coord.y / MAP_CONFIG.ORIGINAL_SIZE) * 100}%`,
                left: `${(coord.x / MAP_CONFIG.ORIGINAL_SIZE) * 100}%`,
                width: buildingIconScale,
                height: buildingIconScale,
                transform: `translate(-50%, -50%)`,
                willChange: 'opacity'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              onClick={() => handleIconClick(coord.id)}
            >
            {}
            <Image
              src={buildingIcons[displayBuilding] || buildingIcons.empty}
              alt={displayBuilding || 'empty'}
              width={buildingIconScale}
              height={buildingIconScale}
              className={`object-contain transition-all duration-75 ${
                shouldShowAsGhost || useOriginalGhost ? 'ghost-icon' : ''
              } ${currentBuilding && !shouldShowAsGhost ? 'drop-shadow-lg' : 'hover:drop-shadow-md hover:brightness-110'}`}
              sizes={`${buildingIconScale}px`}
            />
            </motion.button>
          );
        })}
        </div>
      </div>
    </div>
  );
};