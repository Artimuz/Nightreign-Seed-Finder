
export type SlotId =
  | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"
  | "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20"
  | "21" | "22" | "23" | "24" | "25" | "26" | "27";
export interface Seed {
  seed_id: string;
  map_type: string;
  Event?: string;
  nightlord: string;
  slots: Record<SlotId, string>;
}
export interface Coordinates {
  id: string;
  x: number;
  y: number;
}
export interface URLState {
  mapType: string | null;
  slots: Record<string, string>;
  nightlord: string | null;
  foundSeed: string | null;
}
export interface GameState extends URLState {
  urlArray: string[];
  urlHistory: string[][];
  urlHistoryIndex: number;
  currentPhase: 'selection' | 'building' | 'complete';
  activeSlot: string | null;
  activeBuildingPanel: boolean;
  matchingSeeds: Seed[];
  _isInternalURLUpdate: boolean;
  sessionStartTime: number;
  loggedSeeds: string[];
  setMapType: (mapType: string) => void;
  setSlot: (slotId: string, building: string) => void;
  setNightlord: (nightlord: string) => void;
  setFoundSeed: (seedId: string) => void;
  setActiveSlot: (slotId: string | null) => void;
  setActiveBuildingPanel: (active: boolean) => void;
  getUndoPreview: () => void;
  undo: () => void;
  restart: () => void;
  syncFromURL: (urlState: URLState, originalArray?: string[] | null) => void;
  updateURL: () => void;
  arrayToObject: (urlArray: string[]) => URLState;
  objectToArray: (urlState: URLState) => string[];
  logResult: (seedId: string) => void;
}
export const MAP_TYPES = {
  'mountaintop': {
    title: 'Mountaintop',
    cardImage: '/Images/mapTypes/mountainIcon.webp',
    mapImage: '/Images/mapTypes/Mountaintop.webp'
  },
  'noklateo': {
    title: 'Noklateo',
    cardImage: '/Images/mapTypes/noklateoIcon.webp',
    mapImage: '/Images/mapTypes/Noklateo, the Shrouded City.webp'
  },
  'normal': {
    title: 'Normal',
    cardImage: '/Images/mapTypes/normalIcon.webp',
    mapImage: '/Images/mapTypes/Normal.webp'
  },
  'rotted': {
    title: 'Rotted Woods',
    cardImage: '/Images/mapTypes/rotIcon.webp',
    mapImage: '/Images/mapTypes/Rotted Woods.webp'
  },
  'crater': {
    title: 'Crater',
    cardImage: '/Images/mapTypes/craterIcon.webp',
    mapImage: '/Images/mapTypes/Crater.webp'
  }
} as const;
export type MapType = keyof typeof MAP_TYPES;