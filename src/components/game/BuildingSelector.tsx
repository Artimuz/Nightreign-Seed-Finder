'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { buildingIcons, buildingIconOrder } from '@/lib/constants/icons';
import { getValidBuildingsForSlot } from '@/lib/data/validBuildings';
import { BuildingType } from '@/lib/types/game';
import { LazyIcon } from '@/components/ui/LazyIcon';
import { getCoordinateById } from '@/lib/data/coordinates';
import { getResponsiveMapSize, getIconScale, MAP_CONFIG } from '@/lib/constants/mapSizing';
import { useState, useEffect } from 'react';
const panelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 }
  }
};
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  }
};
export const BuildingSelector: React.FC = () => {
  const { activeSlot, setSlot, setActiveBuildingPanel, slots, mapType, nightlord, setPreviewBuilding } = useGameStore();
  const [modalPosition, setModalPosition] = useState<{ top?: string; bottom?: string; left: string }>({ left: '50%' });
  const [hoverEnabled, setHoverEnabled] = useState(false);

  useEffect(() => {
    if (!activeSlot) return;

    setHoverEnabled(false);
    
    const slotCoordinates = getCoordinateById(activeSlot);
    if (!slotCoordinates) return;

    const mapSize = getResponsiveMapSize(window.innerWidth, window.innerHeight);
    const iconScale = getIconScale(mapSize, 1.4);

    const slotScreenX = (slotCoordinates.x / MAP_CONFIG.ORIGINAL_SIZE) * mapSize;
    const slotScreenY = (slotCoordinates.y / MAP_CONFIG.ORIGINAL_SIZE) * mapSize;

    const iconDistance = iconScale * 0.7; // Much closer to the slot
    const shouldPositionAbove = slotCoordinates.y > 500;

    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = (window.innerHeight / 2) + 30; // account for header offset
    
    const modalScreenX = viewportCenterX - (mapSize / 2) + slotScreenX;
    const modalScreenY = viewportCenterY - (mapSize / 2) + slotScreenY;

    const mapLeft = viewportCenterX - (mapSize / 2);
    const mapRight = viewportCenterX + (mapSize / 2);
    const maxModalWidth = 640; // max-w-2xl equivalent

    const constrainedX = Math.max(
      mapLeft + (maxModalWidth / 2) + 20, // Left boundary + padding
      Math.min(
        mapRight - (maxModalWidth / 2) - 20, // Right boundary - padding
        modalScreenX
      )
    );

    if (shouldPositionAbove) {

      setModalPosition({
        left: `${constrainedX}px`,
        bottom: `${window.innerHeight - modalScreenY + iconDistance}px`
      });
    } else {

      setModalPosition({
        left: `${constrainedX}px`,
        top: `${modalScreenY + iconDistance}px`
      });
    }

    const hoverTimer = setTimeout(() => {
      setHoverEnabled(true);
    }, 500);
    
    return () => clearTimeout(hoverTimer);
  }, [activeSlot]);

  if (!activeSlot) return null;

  const currentBuilding = slots[activeSlot];
  const validBuildings = getValidBuildingsForSlot(mapType!, activeSlot, slots, nightlord);
  const availableBuildings = buildingIconOrder.filter(building => {
    const isValid = validBuildings.includes(building);
    const isNotCurrent = building !== currentBuilding;
    const shouldExcludeEmpty = building === 'empty' && !currentBuilding;
    return isValid && isNotCurrent && !shouldExcludeEmpty;
  });

  const getGridCols = (count: number) => {
    if (count <= 3) return 3;
    if (count <= 6) return Math.min(count, 6);
    if (count <= 12) return 6;
    return 6; // Maximum 6 columns for 6x3 layout
  };

  const gridCols = getGridCols(availableBuildings.length);
  const maxRows = 3;
  const shouldLimitHeight = availableBuildings.length > (gridCols * maxRows);
  const handleBuildingSelect = (building: string) => {
    setSlot(activeSlot, building as BuildingType);
    setActiveBuildingPanel(false);
    setPreviewBuilding(null);
  };
  
  const handleClose = () => {
    setActiveBuildingPanel(false);
    setPreviewBuilding(null);
  };
  
  const handleBuildingHover = (building: string | null) => {
    if (!hoverEnabled) {
      return;
    }
    setPreviewBuilding(building);
  };
  return (
    <AnimatePresence>
      {}
      <motion.div
        key="modal-overlay"
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      />
      
      {}
      <motion.div
        key="modal-content"
        className={`fixed z-50 bg-black/95 rounded-2xl border border-gray-600/50 shadow-2xl w-auto ${shouldLimitHeight ? 'max-h-[400px] overflow-hidden' : ''}`}
        style={{
          ...modalPosition,
          transform: 'translateX(-50%)', // Center horizontally on the calculated position
          minWidth: `${Math.max(320, gridCols * 80 + 80)}px`, // Dynamic min width based on columns
          maxWidth: `${gridCols * 100 + 80}px`, // Dynamic max width
        }}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
          {}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Select Building
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="w-6 h-6 rounded-full bg-gray-700/50 hover:bg-gray-600/70 flex items-center justify-center transition-colors duration-75"
              >
                <span className="text-white text-sm">×</span>
              </button>
            </div>
          </div>
          {}
          <div className={`p-6 ${shouldLimitHeight ? 'overflow-y-auto max-h-80' : ''}`}>
            <motion.div
              className={`grid gap-4`}
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {availableBuildings.map((building) => {
                const isSelected = currentBuilding === building;
                const iconSrc = buildingIcons[building];
                const displayName = building.replace(/_/g, ' ');
                return (
                  <motion.button
                    key={building}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0 }}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-75 group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600/50 bg-gray-700/30 hover:border-blue-400 hover:bg-gray-600/50'
                    }`}
                    onClick={() => handleBuildingSelect(building)}
                    onMouseEnter={() => handleBuildingHover(building)}
                    whileHover={{ opacity: 0.8, transition: { duration: 0.1 } }}
                    whileTap={{ opacity: 0.7 }}
                  >
                    <div className="aspect-square relative w-full h-full flex items-center justify-center">
                      <LazyIcon
                        src={iconSrc}
                        alt={displayName}
                        width={64}
                        height={64}
                        className="object-contain max-w-full max-h-full"
                      />
                    </div>
                    {}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-blue-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
      </motion.div>
    </AnimatePresence>
  );
};