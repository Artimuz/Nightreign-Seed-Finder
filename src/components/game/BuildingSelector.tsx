'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { buildingIcons, buildingIconOrder } from '@/lib/constants/icons';
import { getValidBuildingsForSlot } from '@/lib/data/validBuildings';
import { BuildingType } from '@/lib/types/game';
import Image from 'next/image';
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
      duration: 0.2
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut"
    }
  }
};
export const BuildingSelector: React.FC = () => {
  const { activeSlot, setSlot, setActiveBuildingPanel, slots, mapType, nightlord } = useGameStore();
  if (!activeSlot) return null;
  const currentBuilding = slots[activeSlot];
  const validBuildings = getValidBuildingsForSlot(mapType!, activeSlot, slots, nightlord);
  const availableBuildings = buildingIconOrder.filter(building => {
    const isValid = validBuildings.includes(building);
    const isNotCurrent = building !== currentBuilding;
    const shouldExcludeEmpty = building === 'empty' && !currentBuilding;
    return isValid && isNotCurrent && !shouldExcludeEmpty;
  });
  const handleBuildingSelect = (building: string) => {
    setSlot(activeSlot, building as BuildingType);
    setActiveBuildingPanel(false);
  };
  const handleClose = () => {
    setActiveBuildingPanel(false);
  };
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            handleClose();
          }
        }}
      >
        <motion.div
          className="bg-black/95 rounded-2xl border border-gray-600/50 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {}
          <div className="p-6 border-b border-gray-700/50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Select a Building
                </h3>
                {currentBuilding && (
                  <p className="text-gray-400 text-sm mt-1">
                    Currently: {currentBuilding.replace(/_/g, ' ')}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/70 flex items-center justify-center transition-colors duration-75"
              >
                <span className="text-white text-lg">×</span>
              </button>
            </div>
          </div>
          {}
          <div className="p-6 overflow-y-auto max-h-96">
            <motion.div
              className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {availableBuildings.map((building) => {
                const isSelected = currentBuilding === building;
                const iconSrc = buildingIcons[building];
                const displayName = building.replace(/_/g, ' ');
                return (
                  <motion.button
                    key={building}
                    variants={itemVariants}
                    className={`relative p-3 rounded-xl border-2 transition-all duration-75 group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-gray-600/50 bg-gray-700/30 hover:border-blue-400 hover:bg-gray-600/50'
                    }`}
                    onClick={() => handleBuildingSelect(building)}
                    whileHover={{ opacity: 0.8, transition: { duration: 0.1 } }}
                    whileTap={{ opacity: 0.7 }}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={iconSrc}
                        alt={displayName}
                        fill
                        className="object-contain"
                        sizes="80px"
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
          {}
          <div className="p-4 border-t border-gray-700/50 bg-black/30">
            <p className="text-gray-400 text-sm text-center">
              Click a building to place it in slot.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};