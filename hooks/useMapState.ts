import { useState, useEffect, useCallback } from 'react';
import { Seed, SlotId, MapState } from '../types';
import { MAP_ORIGINAL_SIZE, MAP_MIN_SIZE, MAP_MAX_SIZE, ICON_SCALE_RATIO } from '../constants/layout';

interface UseMapStateProps {
  initialSeeds: Seed[];
  mapType?: string;
}

export const useMapState = ({ initialSeeds, mapType }: UseMapStateProps) => {
  const [mapState, setMapState] = useState<MapState>({
    displaySize: MAP_ORIGINAL_SIZE,
    iconScale: MAP_ORIGINAL_SIZE * ICON_SCALE_RATIO,
    slots: { nightlord: "empty" },
    remainingSeeds: initialSeeds,
    activeSlot: null,
    pathLog: [],
  });

  // Update map size based on window size
  const updateMapSize = useCallback(() => {
    const headerHeight = 60;
    const footerHeight = 60;
    const availableHeight = window.innerHeight - headerHeight - footerHeight - 32;
    const size = Math.min(Math.max(availableHeight, MAP_MIN_SIZE), MAP_MAX_SIZE);
    
    setMapState(prev => ({
      ...prev,
      displaySize: size,
      iconScale: size * ICON_SCALE_RATIO,
    }));
  }, []);

  // Filter seeds based on map type
  useEffect(() => {
    const filteredSeeds = mapType 
      ? initialSeeds.filter(seed => seed.map_type === mapType)
      : initialSeeds;
    
    setMapState(prev => ({
      ...prev,
      remainingSeeds: filteredSeeds,
    }));
  }, [initialSeeds, mapType]);

  // Set up resize listener
  useEffect(() => {
    updateMapSize();
    window.addEventListener('resize', updateMapSize);
    return () => window.removeEventListener('resize', updateMapSize);
  }, [updateMapSize]);

  // Compute valid options for a slot
  const computeOptionsForSlot = useCallback((slotId: string, excludeCurrent = false) => {
    const validIds = new Set<string>();

    for (const seed of initialSeeds) {
      if (mapType && seed.map_type !== mapType) continue;

      let isValid = true;
      for (const [sId, val] of Object.entries(mapState.slots)) {
        if (sId === slotId) continue;
        if (!val || val === "empty") continue;

        if (sId === "nightlord") {
          if (seed.nightlord !== val) {
            isValid = false;
            break;
          }
        } else {
          if (seed.slots?.[sId as SlotId] !== val) {
            isValid = false;
            break;
          }
        }
      }
      
      if (!isValid) continue;

      if (slotId === "nightlord") {
        validIds.add(seed.nightlord || "empty");
      } else {
        validIds.add(seed.slots?.[slotId as SlotId] || "empty");
      }
    }

    validIds.add("empty");
    if (excludeCurrent) {
      validIds.delete(mapState.slots[slotId] || "empty");
    }

    return Array.from(validIds);
  }, [initialSeeds, mapType, mapState.slots]);

  // Handle slot selection
  const handleSlotSelection = useCallback((slotId: string, iconId: string) => {
    setMapState(prev => {
      const nextSlots = { ...prev.slots };

      if (iconId === "empty") {
        delete nextSlots[slotId];
      } else {
        nextSlots[slotId] = iconId;
      }

      // Update path log
      let updatedLog: (string | number)[] = [...prev.pathLog];

      if (iconId === "empty") {
        updatedLog = updatedLog.filter(
          entry => entry !== Number(slotId) && 
                  (typeof entry === "string" ? entry !== slotId : true)
        );
      } else {
        const value = slotId === "nightlord" ? iconId : Number(slotId);
        const idx = updatedLog.findIndex(entry =>
          slotId === "nightlord"
            ? typeof entry === "string"
            : entry === Number(slotId)
        );

        if (idx !== -1) {
          updatedLog[idx] = value;
        } else {
          updatedLog.push(value);
        }
      }

      // Remove duplicates
      const seen = new Set();
      updatedLog = updatedLog.filter(entry => {
        if (seen.has(entry)) return false;
        seen.add(entry);
        return true;
      });

      // Filter remaining seeds
      const filteredSeeds = initialSeeds.filter(seed => {
        if (mapType && seed.map_type !== mapType) return false;
        
        for (const [sId, val] of Object.entries(nextSlots)) {
          if (val === "empty") continue;
          if (sId === "nightlord" && seed.nightlord !== val) return false;
          if (sId !== "nightlord" && seed.slots?.[sId as SlotId] !== val) return false;
        }
        return true;
      });

      return {
        ...prev,
        slots: nextSlots,
        remainingSeeds: filteredSeeds,
        pathLog: updatedLog,
        activeSlot: null,
      };
    });
  }, [initialSeeds, mapType]);

  // Set active slot
  const setActiveSlot = useCallback((slotId: string | null) => {
    setMapState(prev => ({ ...prev, activeSlot: slotId }));
  }, []);

  // Reset all selections
  const resetSelections = useCallback(() => {
    setMapState(prev => ({
      ...prev,
      slots: { nightlord: "empty" },
      remainingSeeds: mapType 
        ? initialSeeds.filter(seed => seed.map_type === mapType)
        : initialSeeds,
      pathLog: [],
      activeSlot: null,
    }));
  }, [initialSeeds, mapType]);

  return {
    mapState,
    computeOptionsForSlot,
    handleSlotSelection,
    setActiveSlot,
    resetSelections,
  };
};