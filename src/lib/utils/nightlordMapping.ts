import { nightlordNames } from '@/lib/constants/icons';
import seedData from '../../../data/seed_data.json';

interface SeedEntry {
  seed_id: string;
  map_type: string;
  Event: string;
  nightlord: string;
  slots: Record<string, string>;
}

/**
 * Maps a seed ID to its corresponding Nightlord name by looking up the actual seed data
 * Seed format: 3-digit number (000-999)
 */
export const getSeedNightlord = (seedId: string): string | null => {
  // Validate seed format (should be 3-digit number)
  const seedMatch = seedId.match(/^(\d{3})$/);
  if (!seedMatch) {
    return null;
  }

  // Find the seed in the actual data
  const seedEntry = (seedData as SeedEntry[]).find((entry) => entry.seed_id === seedId);
  if (!seedEntry || !seedEntry.nightlord) {
    return null;
  }

  // Return the Nightlord name from the nightlordNames mapping
  return nightlordNames[seedEntry.nightlord] || null;
};

/**
 * Validates if a Nightlord name is valid
 */
export const isValidNightlord = (nightlord: string): boolean => {
  return Object.values(nightlordNames).includes(nightlord);
};