// Centralized constants for the application

export const MAP_TYPES = {
  NORMAL: 'Normal',
  CRATER: 'Crater', 
  MOUNTAINTOP: 'Mountaintop',
  NOKLATEO: 'Noklateo, the Shrouded City',
  ROTTED_WOODS: 'Rotted Woods',
} as const;

export const EVENT_TYPES = {
  AUGUR_RAID: 'augurraid',
  EXTRA_BOSS: 'extraboss', 
  FELL_OMEN: 'fellomen',
  FRENZY_TOWER: 'frenzytower',
  GNOSTER_PLAGUE: 'gnosterplague',
  LIBRA_CURSE: 'libracurse',
  MAUSOLEUM: 'mausoleum',
  METEOR_STRIKE: 'meteorstrike',
  NIGHT_HORDE: 'nighthorde',
  SORCERERS_RISE: 'sorcerersrise',
} as const;

export const NIGHTLORDS = {
  GLADIUS: '1_Gladius',
  ADEL: '2_Adel',
  GNOSTER: '3_Gnoster', 
  MARIS: '4_Maris',
  LIBRA: '5_Libra',
  FULGHOR: '6_Fulghor',
  CALIGO: '7_Caligo',
  HEOLSTOR: '8_Heolstor',
} as const;

export const BUILDING_TYPES = {
  EMPTY: 'empty',
  CHURCH: 'church',
  FORT: 'fort',
  FORT_MAGIC: 'fort_magic',
  GREAT_CHURCH: 'greatchurch',
  GREAT_CHURCH_FIRE: 'greatchurch_fire',
  GREAT_CHURCH_HOLY: 'greatchurch_holy',
  MAIN_ENCAMPMENT: 'mainencampment',
  MAIN_ENCAMPMENT_ELECTRIC: 'mainencampment_eletric',
  MAIN_ENCAMPMENT_FIRE: 'mainencampment_fire',
  MAIN_ENCAMPMENT_MADNESS: 'mainencampment_madness',
  RUINS: 'ruins',
  RUINS_BLEED: 'ruins_bleed',
  RUINS_BLIGHT: 'ruins_blight',
  RUINS_ELECTRIC: 'ruins_eletric',
  RUINS_FIRE: 'ruins_fire',
  RUINS_FROSTBITE: 'ruins_frostbite',
  RUINS_HOLY: 'ruins_holy',
  RUINS_MAGIC: 'ruins_magic',
  RUINS_POISON: 'ruins_poison',
  RUINS_SLEEP: 'ruins_sleep',
  SORCERERS: 'sorcerers',
  TOWNSHIP: 'township',
} as const;

// Type exports
export type MapType = typeof MAP_TYPES[keyof typeof MAP_TYPES];
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];
export type NightlordType = typeof NIGHTLORDS[keyof typeof NIGHTLORDS];
export type BuildingType = typeof BUILDING_TYPES[keyof typeof BUILDING_TYPES];