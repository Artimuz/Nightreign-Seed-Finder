'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/state/store';
import { nightlordIcons, nightlordNames, nightlordIconOrder } from '@/lib/constants/icons';
import { getValidNightlords } from '@/lib/data/validBuildings';
import { NightlordType } from '@/lib/types/game';
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
interface NightlordModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export const NightlordModal: React.FC<NightlordModalProps> = ({ isOpen, onClose }) => {
  const { nightlord, setNightlord, mapType, slots } = useGameStore();
  if (!isOpen) return null;
  const validNightlords = getValidNightlords(mapType!, slots);
  const availableNightlords = nightlordIconOrder
    .filter(nightlordId => {
      const isValid = validNightlords.includes(nightlordId);
      const isNotCurrent = nightlordId !== nightlord;
      const shouldExcludeEmpty = nightlordId === 'empty' && !nightlord;
      return isValid && isNotCurrent && !shouldExcludeEmpty;
    })
    .map(nightlordId => [nightlordId, nightlordIcons[nightlordId]] as [string, string]);
  const handleNightlordSelect = (nightlordId: string) => {
    setNightlord(nightlordId as NightlordType);
    onClose();
  };
  const handleClose = () => {
    onClose();
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
                  Select Nightlord
                </h3>
                {nightlord && (
                  <p className="text-gray-400 text-sm mt-1">
                    Currently: {nightlordNames[nightlord]}
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
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
              variants={gridVariants}
              initial="hidden"
              animate="visible"
            >
              {availableNightlords.map(([nightlordId, iconSrc]) => {
                const isSelected = nightlord === nightlordId;
                const name = nightlordNames[nightlordId];
                return (
                  <motion.button
                    key={nightlordId}
                    variants={itemVariants}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-75 group ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/20'
                        : 'border-gray-600/50 bg-gray-700/30 hover:border-purple-400 hover:bg-gray-600/50'
                    }`}
                    onClick={() => handleNightlordSelect(nightlordId)}
                    whileHover={{ opacity: 0.8, transition: { duration: 0.1 } }}
                    whileTap={{ opacity: 0.7 }}
                  >
                    <div className="aspect-square relative w-16 h-16 mx-auto">
                      <Image
                        src={iconSrc}
                        alt={name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    {}
                    {isSelected && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border-2 border-purple-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
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
              Click a nightlord to select, or click outside to cancel
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};