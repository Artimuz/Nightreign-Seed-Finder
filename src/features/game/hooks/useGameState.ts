import { useGameStore } from '@/lib/state/store';

export const useGameState = () => {
  const {
    mapType,
    slots,
    nightlord,
    foundSeed,
    currentPhase,
    activeSlot,
    activeBuildingPanel,
    matchingSeeds,
    setMapType,
    setSlot,
    setNightlord,
    setFoundSeed,
    undo,
    restart
  } = useGameStore();

  const canUndo = useGameStore(state => state.urlHistoryIndex > 0);
  const isComplete = currentPhase === 'complete';
  const isBuilding = currentPhase === 'building';
  const isSelection = currentPhase === 'selection';

  return {
    state: {
      mapType,
      slots,
      nightlord,
      foundSeed,
      currentPhase,
      activeSlot,
      activeBuildingPanel,
      matchingSeeds,
      canUndo,
      isComplete,
      isBuilding,
      isSelection,
    },
    actions: {
      setMapType,
      setSlot,
      setNightlord,
      setFoundSeed,
      undo,
      restart,
    }
  };
};