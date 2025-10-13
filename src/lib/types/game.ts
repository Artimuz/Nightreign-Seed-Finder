export interface Seed {
  seed_id: string;
  map_type: string;
  slots: Record<string, string>;
  nightlord?: string;
  Event?: string;
  coordinates?: Record<string, { x: number; y: number }>;
}

export interface GameSlots {
  [key: string]: string;
}

export interface URLState {
  mapType: string | null;
  slots: GameSlots;
  nightlord: string | null;
  foundSeed: string | null;
}

export type MapType = 'normal' | 'crater' | 'mountaintop' | 'noklateo' | 'rot';
export type BuildingType = 'church' | 'fort' | 'greatchurch' | 'mainencampment' | 'ruins' | 'sorcerers' | 'township' | 'empty';
export type NightlordType = 'Gladius' | 'Adel' | 'Gnoster' | 'Maris' | 'Libra' | 'Fulghor' | 'Caligo' | 'Heolstor';
export type GamePhase = 'selection' | 'building' | 'complete';

export interface GameState {
  mapType: MapType | null;
  slots: GameSlots;
  nightlord: NightlordType | null;
  foundSeed: string | null;
  urlArray: string[];
  urlHistory: string[][];
  urlHistoryIndex: number;
  currentPhase: GamePhase;
  activeSlot: string | null;
  activeBuildingPanel: boolean;
  matchingSeeds: Seed[];
  _isInternalURLUpdate: boolean;
  sessionStartTime: number;
  loggedSeeds: string[];
  
  arrayToObject: (urlArray: string[]) => URLState;
  objectToArray: (urlState: URLState) => string[];
  setMapType: (mapType: MapType) => void;
  setSlot: (slotId: string, building: BuildingType | null) => void;
  setNightlord: (nightlord: NightlordType) => void;
  setFoundSeed: (seedId: string) => void;
  setActiveSlot: (slotId: string | null) => void;
  setActiveBuildingPanel: (active: boolean) => void;
  getUndoPreview: () => void;
  undo: () => void;
  restart: () => void;
  syncFromURL: (urlState: URLState, originalArray?: string[]) => void;
  updateURL: () => void;
  logResult: (seedId: string) => void;
}