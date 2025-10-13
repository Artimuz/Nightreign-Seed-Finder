import { Seed } from '@/lib/types/game';
import seedData from '../../../data/seed_data.json';
const seeds: Seed[] = seedData as Seed[];
interface SearchCriteria {
  mapType: string;
  slots: Record<string, string>;
  nightlord?: string | null;
}
export const searchSeeds = (criteria: SearchCriteria): Seed[] => {
  const { mapType, slots, nightlord } = criteria;
  if (!mapType) return [];
  return seeds.filter(seed => {
    const seedMapType = seed.map_type.toLowerCase().replace(/\s+/g, '').replace(',', '');
    const searchMapType = mapType.toLowerCase().replace(/\s+/g, '').replace(',', '');
    const mapTypeMapping: Record<string, string[]> = {
      'normal': ['normal'],
      'crater': ['crater'],
      'mountaintop': ['mountaintop', 'mountain'],
      'noklateo': ['noklateo', 'noklateo,theshroudedcity', 'noklateo the shrouded city'],
      'rotted': ['rotted', 'rottedwoods', 'rotted woods']
    };
    const validMappings = mapTypeMapping[searchMapType] || [searchMapType];
    const isMapTypeMatch = validMappings.some(mapping =>
      seedMapType.includes(mapping) || mapping.includes(seedMapType)
    );
    if (!isMapTypeMatch) {
      return false;
    }
    if (nightlord && seed.nightlord !== nightlord) {
      return false;
    }
    for (const [slotId, building] of Object.entries(slots)) {
      if (seed.slots[slotId as keyof typeof seed.slots] !== building) {
        return false;
      }
    }
    return true;
  });
};
export const findSeedById = (seedId: string): Seed | null => {
  if (!seedId) return null;
  let seed = seeds.find(s => s.seed_id === seedId);
  if (!seed) {
    const padded = seedId.padStart(3, '0');
    seed = seeds.find(s => s.seed_id === padded);
  }
  return seed || null;
};
export const getAllSeeds = (): Seed[] => seeds;
export const getSeedsByMapType = (mapType: string): Seed[] => {
  return seeds.filter(seed =>
    seed.map_type.toLowerCase() === mapType.toLowerCase()
  );
};