import { Seed, SlotId } from '@/lib/types';
import { searchSeeds } from './seedSearch';
export const getValidBuildingsForSlot = (
  mapType: string,
  slotId: string,
  currentSlots: Record<string, string>,
  nightlord?: string | null
): string[] => {
  if (!mapType) return [];
  const allBuildings = new Set<string>();
  const otherSlots = { ...currentSlots };
  delete otherSlots[slotId];
  const matchingSeeds = searchSeeds({
    mapType,
    slots: otherSlots,
    nightlord
  });
  matchingSeeds.forEach(seed => {
    const buildingInSlot = seed.slots[slotId as SlotId];
    if (buildingInSlot) {
      allBuildings.add(buildingInSlot);
    }
  });
  allBuildings.add('empty');
  return Array.from(allBuildings).sort();
};
export const getIconState = (
  validOptions: string[],
  currentValue: string | undefined
): {
  shouldHide: boolean;
  shouldShowGhost: boolean;
  ghostBuilding: string | null;
  displayBuilding: string;
  clickAction: 'hide' | 'ghost-to-real' | 'open-modal' | 'empty-immediately';
} => {
  const nonEmptyOptions = validOptions.filter(opt => opt !== 'empty');
  if (validOptions.length === 1 && validOptions[0] === 'empty') {
    return {
      shouldHide: true,
      shouldShowGhost: false,
      ghostBuilding: null,
      displayBuilding: 'empty',
      clickAction: 'hide'
    };
  }
  if (nonEmptyOptions.length === 1 && !currentValue) {
    return {
      shouldHide: false,
      shouldShowGhost: true,
      ghostBuilding: nonEmptyOptions[0],
      displayBuilding: nonEmptyOptions[0],
      clickAction: 'ghost-to-real'
    };
  }
  if (currentValue && currentValue !== 'empty' && nonEmptyOptions.length === 1 && nonEmptyOptions[0] === currentValue) {
    return {
      shouldHide: false,
      shouldShowGhost: false,
      ghostBuilding: null,
      displayBuilding: currentValue,
      clickAction: 'empty-immediately'
    };
  }
  return {
    shouldHide: false,
    shouldShowGhost: false,
    ghostBuilding: null,
    displayBuilding: currentValue || 'empty',
    clickAction: 'open-modal'
  };
};
export const getValidNightlords = (
  mapType: string,
  slots: Record<string, string>
): string[] => {
  if (!mapType) return [];
  const validNightlords = new Set<string>();
  const matchingSeeds = searchSeeds({
    mapType,
    slots
  });
  matchingSeeds.forEach(seed => {
    if (seed.nightlord) {
      validNightlords.add(seed.nightlord);
    }
  });
  validNightlords.add('empty');
  return Array.from(validNightlords).sort();
};
export const getNightlordIconState = (
  validOptions: string[],
  currentValue: string | undefined
): {
  shouldHide: boolean;
  shouldShowGhost: boolean;
  ghostNightlord: string | null;
  displayNightlord: string;
  clickAction: 'hide' | 'ghost-to-real' | 'open-modal' | 'empty-immediately';
} => {
  const nonEmptyOptions = validOptions.filter(opt => opt !== 'empty');
  if (validOptions.length === 1 && validOptions[0] === 'empty') {
    return {
      shouldHide: true,
      shouldShowGhost: false,
      ghostNightlord: null,
      displayNightlord: 'empty',
      clickAction: 'hide'
    };
  }
  if (nonEmptyOptions.length === 1 && !currentValue) {
    return {
      shouldHide: false,
      shouldShowGhost: true,
      ghostNightlord: nonEmptyOptions[0],
      displayNightlord: nonEmptyOptions[0],
      clickAction: 'ghost-to-real'
    };
  }
  if (currentValue && currentValue !== 'empty' && nonEmptyOptions.length === 1 && nonEmptyOptions[0] === currentValue) {
    return {
      shouldHide: false,
      shouldShowGhost: false,
      ghostNightlord: null,
      displayNightlord: currentValue,
      clickAction: 'empty-immediately'
    };
  }
  return {
    shouldHide: false,
    shouldShowGhost: false,
    ghostNightlord: null,
    displayNightlord: currentValue || 'empty',
    clickAction: 'open-modal'
  };
};